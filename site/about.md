---
layout: layouts/base
---

# About

There are no raster images^†^ and there is no javascript^‡^ on this site.

## How Does This Work

SVGs allow you to embed css stylesheets. Each animation is no more than a series of CSS animations moving around basic SVG elements.

In many cases animations are stacked on top of each other using groups of elements or masks.

## What Libraries Did You Use

- [gl-matrix](http://glmatrix.net/) — For vector/matrix manipulation.
- [postcss](https://github.com/postcss/postcss) — For processing/modifying inlineline stylesheets.
- [perfectionist](https://github.com/ben-eb/perfectionist) — For cleaning up the inline stylesheets.
- [css-property-parser](https://github.com/mahirshah/css-property-parser)/[css-selector-parser](https://github.com/postcss/postcss-selector-parser) — To namespace selectors and do a few other manipulations.
- [11ty](https://www.11ty.io/) — To generate this static site.

For rendering SVGs I wrote my own tiny (read: horrible) renderer as I wanted a chance to play around with [Proxy objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Notes

† Unfortunately few browsers support [SVG favicons](https://caniuse.com/#feat=link-icon-svg) (as of late 2019 anyway). As such I have had to include a single rasterized image. <span class="no-wrap">(ಥ﹏ಥ)</span>

‡ Some/most pages include google analytics.

## Credits
