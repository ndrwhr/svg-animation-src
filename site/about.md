---
templateEngineOverride: njk,md
layout: layouts/base
stylesheets:
  - 'css/about.css'
---

<div class="about">

# About

There are no raster images^†^ and there is no javascript^‡^ on this site. Just SVGs, HTML, and CSS.

## How Does This Work

SVGs allow you to embed css stylesheets. Each animation is no more than a series of CSS animations moving around or transforming basic SVG elements.

<div>
  {% include "about/example1.njk" %}
</div>

In many cases animations are stacked on top of each other using groups of elements to create more complex motions.

<div>
  {% include "about/example2.njk" %}
</div>

I also made liberal use animating dash-offsets on paths (see [Jake Archibald's fantastic explanation](http://jakearchibald.com/2013/animated-line-drawing-svg/) on how this works).

<div>
  {% include "about/example3.njk" %}
</div>

## What Libraries Did You Use

- [gl-matrix](http://glmatrix.net/) — For vector/matrix manipulation.
- [postcss](https://github.com/postcss/postcss) — For processing/modifying inlineline stylesheets.
- [perfectionist](https://github.com/ben-eb/perfectionist) — For cleaning up the inline stylesheets.
- [css-property-parser](https://github.com/mahirshah/css-property-parser)/[css-selector-parser](https://github.com/postcss/postcss-selector-parser) — To namespace selectors and do a few other manipulations.
- A bunch of other utilities like [lodash](https://lodash.com/), [eases](https://www.npmjs.com/package/eases), [case](https://www.npmjs.com/package/case), and [seedrandom](https://www.npmjs.com/package/seedrandom).
- [11ty](https://www.11ty.io/) — To generate this static site.

For rendering SVGs I wrote my own tiny (read: horrible) renderer as I wanted a chance to play around with [proxy objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). At one point I had also experimented with headless chrome to take screenshots and generate gifs/videos of the SVGs by manually stepping forward the animation delay to render individual frames.

## Credits

I like to think that I'm creative, but ultimately quite a few of the designs here I discovered on pinterest. Each animation lists its attribution if any, but I also wanted to call them all out here:

## Notes

- † Unfortunately few browsers support [SVG favicons](https://caniuse.com/#feat=link-icon-svg) (as of late 2019 anyway). As such I have had to include a single rasterized image. <span class="no-wrap">(ಥ﹏ಥ)</span>
- ‡ Some/most pages include google analytics.

</div>
