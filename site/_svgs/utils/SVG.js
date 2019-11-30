const Case = require('case');
const postcss = require('postcss');
const perfectionist = require('perfectionist');

const { PostCSSPlugins, parseTimeAsMs, updateDelayValue } = require('./CSS');

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

    this.duration = parseTimeAsMs(this.attributes.dataAnimationDuration);
    this.time = 1;
  }

  renderStep(stepSize) {
    if (stepSize && this.time > this.duration) return;

    const result = this.render({
      disableAnimation: true,
      rootAnimationDelay: stepSize ? this.duration - this.time : undefined,
    });

    if (stepSize) this.time += stepSize;

    return result;
  }

  render(renderOptions = {}) {
    const extraOptions = {};

    if (renderOptions.addNamespace) {
      if (!this.attributes.id) {
        throw new Error('Cannot namespace if the SVG does not have an id.');
        return;
      }

      extraOptions.namespace = `svg${this.attributes.id}`;
    }

    return super.render(Object.assign(renderOptions, extraOptions));
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
    const processedCSS = (this.processor = postcss([
      ...this.getAdditionalPlugins(renderOptions),
      perfectionist({
        indentSize: 2,
      }),
    ]).process(this.css.trim()).css);

    const textContent = [
      '/* <![CDATA[ */',
      ...indentLines(processedCSS.split('\n'), 1),
      '/* ]]> */',
    ].join('\n');

    return commonToString(this.tagName, this.attributes, [textContent]);
  }

  getAdditionalPlugins(renderOptions) {
    const plugins = new Set();

    if (renderOptions.disableAnimation) {
      plugins.add(PostCSSPlugins.disableAnimation(renderOptions));
    }

    if (renderOptions.rootAnimationDelay) {
      plugins.add(PostCSSPlugins.setAnimationDelay(renderOptions));
    }

    if (renderOptions.namespace) {
      plugins.add(PostCSSPlugins.namespaceEverything(renderOptions));
    }

    return [...plugins];
  }
}

class MetaElement extends Element {
  constructor(tagName, parent, text = '') {
    super(tagName, parent);
    this.text = text;
  }

  render() {
    return commonToString(this.tagName, this.attributes, [this.text]);
  }
}

const SPECIAL_CONSTRUCTORS = {
  svg: SVGElement,
  style: StyleElement,
  title: MetaElement,
  desc: MetaElement,
};

module.exports = ElementFactoryProxy;
