const postcss = require('postcss');
const perfectionist = require('perfectionist');
var csso = require('postcss-csso');
const {
  expandShorthandProperty,
  getShorthandComputedProperties,
} = require('css-property-parser');
const { CssSelectorParser } = require('css-selector-parser');

const selectorParser = new CssSelectorParser();
selectorParser.registerNumericPseudos('nth-child');

const applyNamespace = (namespace, obj) => {
  switch (obj.type) {
    case 'selectors':
      obj.selectors = obj.selectors.map(selector => {
        return applyNamespace(namespace, selector);
      });
      break;
    case 'rule':
    case 'ruleSet':
      const rule = obj.rule;
      if (!rule) {
        break;
      }

      if (rule.id) {
        rule.id = `${namespace}-${rule.id}`;
      }

      if (rule.classNames) {
        rule.classNames = rule.classNames.map(c => `${namespace}-${c}`);
      }

      if (rule.tagName) {
        rule.classNames = [
          `${namespace}-${rule.tagName}`,
          ...(rule.classNames || []),
        ];
        delete rule.tagName;
      }

      if (rule.rule) {
        obj.rule = applyNamespace(namespace, rule);
      }
      break;
  }

  return obj;
};

module.exports.parseTimeAsMs = str => {
  let [, sign, value, unit = 's'] = /(-)?(\d+(?:\.\d+)?)(\w+)?/i.exec(str);
  value = parseFloat(value);
  value *= sign === '-' ? -1 : 1;
  value *= unit.toLowerCase() === 's' ? 1000 : 1;
  return value;
};

module.exports.updateDelayValue = (rootAnimationDelay, currentValue) =>
  `${parseTimeAsMs(currentValue) - rootAnimationDelay}ms`;

const PostCSSPlugins = {
  setAnimationDelay: postcss.plugin(
    'set-animation-delay',
    ({ rootAnimationDelay }) => root => {
      root.walkDecls(/^animation$/, decl => {
        const parsed = expandShorthandProperty('animation', decl.value);
        parsed['animation-delay'] = parsed['animation-delay'] || '0s';

        decl.value = getShorthandComputedProperties('animation')
          .filter(prop => parsed[prop])
          .map(prop => {
            let value = parsed[prop];
            if (prop === 'animation-delay') {
              value = updateDelayValue(rootAnimationDelay, value);
            }
            return value;
          })
          .join(' ');
      });

      // Look for explicit delays first and update them.
      root.walkDecls(/^animation-delay$/, decl => {
        decl.value = updateDelayValue(rootAnimationDelay, decl.value);
      });
    },
  ),

  disableAnimation: postcss.plugin('disable-animation', () => root => {
    const rulesWithAnimations = new Set();
    root.walkDecls(/^animation/, decl => {
      if (decl.prop === 'animation-play-state') {
        decl.value = 'paused';
      } else {
        rulesWithAnimations.add(decl.parent);
      }
    });

    for (let rule of rulesWithAnimations) {
      rule.append({
        prop: 'animation-play-state',
        value: 'paused',
      });
    }
  }),

  namespaceEverything: postcss.plugin(
    'namespace-everything',
    ({ namespace }) => root => {
      // Add a namespace to all the selectors.
      root.walkRules(rule => {
        if (rule.parent && rule.parent.name === 'keyframes') return;

        const parsedSelector = applyNamespace(
          namespace,
          selectorParser.parse(rule.selector),
        );

        rule.selector = selectorParser.render(parsedSelector);
      });

      // Add a namespace to the animation names.
      root.walkAtRules('keyframes', rule => {
        rule.params = `${namespace}-${rule.params}`;
      });

      // Namespace animation names where used.
      root.walkDecls('animation', decl => {
        const parsed = expandShorthandProperty('animation', decl.value);
        if (parsed['animation-name']) {
          parsed['animation-name'] = `${namespace}-${parsed['animation-name']}`;
          decl.value = getShorthandComputedProperties('animation')
            .filter(prop => parsed[prop])
            .map(prop => parsed[prop])
            .join(' ');
        }
      });
      root.walkDecls('animation-name', decl => {
        decl.value = `${namespace}-${decl.value}`;
      });
    },
  ),
};

module.exports.processCSS = (css, renderOptions) => {
  const plugins = [];

  if (renderOptions.disableAnimation) {
    plugins.push(PostCSSPlugins.disableAnimation(renderOptions));
  }

  if (renderOptions.rootAnimationDelay) {
    plugins.push(PostCSSPlugins.setAnimationDelay(renderOptions));
  }

  if (renderOptions.namespace) {
    plugins.push(PostCSSPlugins.namespaceEverything(renderOptions));
  }

  if (renderOptions.minify) {
    plugins.push(csso);
  } else {
    plugins.push(
      perfectionist({
        indentSize: 2,
      }),
    );
  }

  return postcss(plugins).process(css.trim()).css;
};
