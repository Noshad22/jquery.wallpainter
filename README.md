jQuery WallPainter
==================

A jQuery plugin to paint HTML backgrounds programmatically, preview them in the browser and export them as PNG ([some demos here](http://www.lucaongaro.eu/demos/jquery.wallpainter/)).


Usage
-----

Just select an HTML element and call `jQuery("#my_element").wallPainter({ ... })` specifying the dimension of your background image, and a `paint` method that will receive the `context` of an HTML canvas. In the `paint` method, just paint the canvas using standard methods plus some useful helpers described below. The canvas will be used as the background of your element:

```javascript
// Let's draw a pinstriped background
$("body").wallPainter({

  // Dimensions of our tiled background image
  width: 30,
  height: 30,

  paint: function( context ) {
    // First paint a uniform background
    context.fillBackground("#333");

    // Then add a dashed line
    context.strokeStyle = "rgba(255, 255, 255, 0.3)";
    context.dashedLine( 15, 0, 15, 30 );

    // And some background noise to make it more realistic
    context.noise({ opacity: 0.1 });
  }

});
```

When you are done, double click on a background to open its PNG image version in another browser tab, ready to be exported and used in any browser.


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
  randomFunction: /* internal */   // function to generate random number (arguments are distribution, bias, x and y)
});
```

You can easily add your custom helpers:

```javascript
jQuery.wallPainter.mixin({

  myHelper: function() {
    // here `this` is the canvas context
  },

  anotherHelper: function() {
    // ...
  }

});
```