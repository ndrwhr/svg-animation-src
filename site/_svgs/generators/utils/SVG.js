const Case = require('case');
const htmlmin = require('html-minifier');

const { processCSS, parseTimeAsMs, updateDelayValue } = require('./CSS');

const ATTRIBUTE_MAP = {
  className: 'class',
  onClick: 'onClick',
  preserveAspectRatio: 'preserveAspectRatio',
  viewBox: 'viewBox',
  'xmlns:xlink': 'xmlns:xlink',
  'xlink:href': 'xlink:href',
};

const namespaceTagClassBlackList = new Set([
  'clipPath',
  'defs',
  'style',
  'svg',
]);

const applyNamespaceToAttributes = (tagName, attrs, { namespace }) => {
  const attrsCopy = Object.assign({}, attrs);

  if (!namespaceTagClassBlackList.has(tagName)) {
    // Update the classes to include the tag class.
    const classNames = (attrsCopy.className || '').split(' ');
    attrsCopy.className = [tagName, ...classNames]
      .filter(Boolean)
      .map(c => `${namespace}-${c}`)
      .join(' ');
  }

  if (attrsCopy.href && /^#/.test(attrsCopy.href.trim())) {
    attrsCopy.href = `#${namespace}-${attrsCopy.href.replace('#', '')}`;
  }

  if (attrsCopy.clipPath) {
    const [, id] = /url\(#([^\)]+)\)/.exec(attrsCopy.clipPath);
    attrsCopy.clipPath = `url(#${namespace}-${id})`;
  }

  if (tagName !== 'svg' && attrsCopy.id) {
    attrsCopy.id = `${namespace}-${attrsCopy.id}`;
  }

  return attrsCopy;
};

const ATTRIBUTE_PROCESSORS = {
  style(values, options) {
    if (typeof values === 'object') {
      return Object.keys(values)
        .map(prop => {
          let value = values[prop];
          if (prop === 'animationDelay' && options.rootAnimationDelay) {
            value = updateDelayValue(options.rootAnimationDelay, value);
          }
          return `${Case.kebab(prop)}: ${value}`;
        })
        .join('; ');
    }
    return values;
  },

  points(values) {
    if (Array.isArray(values)) {
      return values.map(p => p.join(',')).join(' ');
    }

    return values;
  },
};

const indentLine = (line, level) => {
  return `${''.padStart(level * 2)}${line}`;
};

const indentLines = (lines, level) => {
  return lines.map(line => indentLine(line, level));
};

const commonToString = (
  tagName,
  originalAttrs = {},
  children = [],
  options = {},
) => {
  const lines = [];

  const attrs = options.namespace
    ? applyNamespaceToAttributes(tagName, originalAttrs, options)
    : originalAttrs;

  if (Object.keys(attrs).length) {
    lines.push(`<${tagName}`);

    const attrLines = Object.keys(attrs)
      .map(attr => {
        const actualAttr = ATTRIBUTE_MAP[attr] || Case.kebab(attr);
        const value = ATTRIBUTE_PROCESSORS[actualAttr]
          ? ATTRIBUTE_PROCESSORS[actualAttr](attrs[attr], options)
          : attrs[attr];
        return indentLine(`${actualAttr}="${value}"`, 1);
      })
      .sort();

    lines.push(...attrLines, children.length ? '>' : '/>');
  } else {
    lines.push(`<${tagName}${children.length ? '>' : ' />'}`);
  }

  if (children.length) {
    children.forEach(child => {
      const result = typeof child === 'string' ? child : child.render(options);
      lines.push(...indentLines(result.split('\n'), 1));
    });

    lines.push(`</${tagName}>`);
  }

  return lines.join('\n');
};

const ElementFactoryProxy = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (!(property in receiver)) {
        const ElementConstructor = SPECIAL_CONSTRUCTORS[property] || Element;
        return (...args) =>
          new ElementConstructor(
            property,
            receiver instanceof Element ? receiver : null,
            ...args,
          );
      }
      return Reflect.get(target, property, receiver);
    },
  },
);

const ElementFactory = function() {};
ElementFactory.prototype = ElementFactoryProxy;

class Element extends ElementFactory {
  constructor(tagName, parent, attributes, ...children) {
    super();
    this.tagName = tagName;
    this.attributes = attributes;
    this.children = [];
    this.parent = parent;

    if (this.parent) {
      this.parent.appendChild(this);
      this.root = this.parent.root;
    }
    children.map(c => this.appendChild(c));
  }

  appendChild(child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child) {
    this.children = this.children.filter(otherChild => otherChild !== child);
    child.parent = null;
  }

  render(options) {
    return commonToString(
      this.tagName,
      this.attributes,
      this.children,
      options,
    );
  }
}

class SVGElement extends Element {
  constructor(tagName, parent, attributes = {}, ...children) {
    super(
      tagName,
      parent,
      Object.assign(
        {
          version: '1.1',
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          preserveAspectRatio: 'xMidYMid meet',
        },
        attributes,
      ),
      ...children,
    );
    this.root = this;
    this.attributes = attributes;

    this.duration = parseTimeAsMs(this.attributes.dataAnimationDuration);
    this.time = 1;
  }

  appendChild(child) {
    super.appendChild(child);

    if (child.tagName === 'title') {
      // Title should be rendered first so remove the child from the end of
      // the children and stick it at the beginning.
      this.children.pop();
      this.children.unshift(child);
    } else if (child.tagName === 'desc') {
      // Similarly, desc should be after title.
      this.children.pop();

      const insertIndex =
        this.children.length && this.children[0].tagName === 'title' ? 1 : 0;
      this.children.splice(insertIndex, 0, child);
    }
  }

  renderStep(namespace, stepSize) {
    // if (stepSize && this.time > this.duration) return;

    const result = this.render({
      namespace,
      disableAnimation: true,
      rootAnimationDelay: stepSize ? this.duration * 2 - this.time : undefined,
    });

    if (stepSize) this.time += stepSize;

    return result;
  }

  render(renderOptions = {}) {
    if (!renderOptions.namespace) {
      throw new Error('Namespace required.');
    }

    const result = super.render(renderOptions);
    if (renderOptions.minify) {
      return htmlmin.minify(result, {
        removeComments: true,
        collapseWhitespace: true,
      });
    } else {
      return result;
    }
  }
}

class StyleElement extends Element {
  constructor(tagName, parent, css = '') {
    super(tagName, parent);
    this.css = css;
  }

  addStyles(additionalCSS) {
    this.css += additionalCSS;
  }

  render(renderOptions) {
    const processedCSS = processCSS(this.css, renderOptions);
    const textContent = renderOptions.minify
      ? ['/* <![CDATA[ */', processedCSS, '/* ]]> */'].join(' ')
      : [
          '/* <![CDATA[ */',
          ...indentLines(processedCSS.split('\n'), 1),
          '/* ]]> */',
        ].join('\n');

    return commonToString(this.tagName, this.attributes, [textContent]);
  }
}

class TextElement extends Element {
  constructor(tagName, parent, text = '', attributes) {
    super(tagName, parent, attributes);
    this.text = text;
  }

  render() {
    return commonToString(this.tagName, this.attributes, [this.text.trim()]);
  }
}

const SPECIAL_CONSTRUCTORS = {
  svg: SVGElement,
  style: StyleElement,
  title: TextElement,
  desc: TextElement,
  text: TextElement,
};

module.exports = ElementFactoryProxy;
