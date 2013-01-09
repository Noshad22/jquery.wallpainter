jQuery WallPainter
==================

A jQuery plugin to paint HTML backgrounds programmatically, preview them in the browser and export them as PNG ([some demos here](http://www.lucaongaro.eu/demos/jquery.wallpainter/)).


Usage
-----

Just call `jQuery(".my_selector").wallPainter({ /* your options here */ })`. Usually you would specify in the options at least the `width` and `height` of your background image, and a `paint` method.
The `paint` method will be called passing the `context` of an HTML canvas, so you can just paint the canvas and it will be used as the background for the selected element(s).
In addition to the standard canvas methods, on the `context` object passed to the `paint` method you can also call some useful helpers (described below).

An example is worth a thousand words:

```javascript
// Let's draw a pinstriped background
$("body").wallPainter({

  // Dimensions of our background image
  width: 30,
  height: 30,

  paint: function( context ) {
    // First paint a uniform dark grey background
    context.fillBackground("#333");

    // Then add a dashed line, the 'pinstripe'
    context.strokeStyle = "rgba(255, 255, 255, 0.3)";
    context.dashedLine( 15, 0, 15, 30 );

    // And some background noise to make it more realistic
    context.noise({ opacity: 0.1 });
  }

});
```

Producing the background programmatically gives you complete control and the possibility to fine-tune it in development, but is obviously not very efficient in production,
and not cross-browser. No worries: when you are done, double click on a background to open a PNG version of your background image in another browser tab,
ready to be saved and used as the background.

If you prefer to use another event instead of double-click to get the PNG image, set the `openImageOn` option to something else, like `openImageOn: "mycustomevent"`. You
can also set it to false to disable this behavior completely.

Helpers
-------

In addition to the standard canvas methods, `jQuery.wallPainter` mixins some useful helper methods in the `context` object:

* `context.fillBackground( color )`: fill the background with `color`
* `context.line( fromX, fromY, toX, toY )`: draw a line from `(fromX, fromY)` to `(toX, toY)`
* `context.dashedLine( fromX, fromY, toX, toY, dashLength, gapLength )`: draw a dashed line from `(fromX, fromY)` to `(toX, toY)`
* `context.polygon( x1, y1, x2, y2, x3, y3, ... )`: draw a polygonal path with vertexes `(x1, y1)`, `(x2, y2)`, `(x3, y3)`, etc.
* `context.repeat( { from: [x1, y1], to: [x2, y2], increment: [incX, incY] }, func )`: call function `func` iteratively with arguments `x, y, xIteration, yIteration` incrementing `x` and `y` with the specified range and increment step.
* `context.noise( options )`: paint background noise. The parameters that can be configured and their defaults are the following:

```javascript
context.noise({
  opacity: { from: 0.1, to: 0.5 }, // opacity of the noise (number or { from: ..., to: ... })
  grainDimension: 1,               // dimension of the grains of noise (number or { width: ..., height: ...})
  fromColor: "000000",             // starting point of the color range (color string)
  toColor: "606060",               // end point of the color range (color string)
  independentChannels: false,      // color channels are independent? (boolean)
  distribution: "bell",            // statistical distribution of noise ("bell", "uniform", "triangular" or number)
  bias: 0,                         // bias of the statistical distribution (positive for bias toward fromColor)
  randomFunction: /* internal */   // function to generate random numbers (arguments are distribution, bias, x and y)
});
```

You can also mixin your custom helpers:

```javascript
jQuery.wallPainter.mixin({
  // These functions will be mixed in the context object
  myHelper: function() {
    // here `this` is the canvas context
  },
  anotherHelper: function() {
    // ...
  }
});
```
