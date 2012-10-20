jQuery WallPainter
==================

A jQuery plugin to create tiled HTML backgrounds programmatically (like [these](http://www.lucaongaro.eu/demos/jquery.wallpainter/)). You can code and preview them in Chrome/Safari/Firefox and export them as PNG.

Usage
-----

Just select an HTML element and call `jQuery("#my_element").wallPainter({ ... })` passing an object specifying `width` and `height` of your background image, and a `paint` method that will be passed the `context` of an HTML canvas. Then paint the canvas as usual: it will be used as the background of your element.

```javascript
// Pinstribed background
$(".pinstriped").wallPainter({
  width: 30,
  height: 30,
  paint: function( context ) {
  	context.paintBackground("#333");
    context.strokeStyle = "rgba(255, 255, 255, 0.3)";
    context.beginPath();
    for( var y = 0; y < 30; y += 3 ) {
      context.line( 15.5, y + 1.5, 15.5, y + 2.5 );
    }
    context.stroke();
    context.noise({ opacity: 0.1 });
  }
});
```

When you are done, double click on a background to open the background PNG image in another browser tab, ready to be exported and used in any browser.


Mixins
------

In addition to the standard canvas methods, `jQuery.wallPainter` mixins some useful methods in the `context` object:

- `context.line( fromX, fromY, toX, toY )`: draw a line from `(fromX, fromX)` to `(toX, toY)`

- `context.polygon( x1, y1, x2, y2, x3, y3, ... )`: draw a polygon with vertexes `(x1, y1)`, `(x2, y2)`, `(x3, y3)`, etc.

- `context.repeat( { from: [x1, y1], to: [x2, y2], increment: [incX, incY] }, func )`: call function `func` iteratively with arguments `x, y, xIteration, yIteration` incrementing `x` and `y` with the specified range and increment step.

- `context.paintBackground( color )`: paint the background color

- `context.noise( options )`: paint background noise. Default options are:
	```javascript
	{
    opacity: { from: 0.1, to: 0.5 },
    grainDimension: 1,
    fromColor: "000000",
    toColor: "606060",
    independentChannels: false,
    distribution: "bell",
    bias: 0
  }
  ```

You can also add your custom mixins:

```javascript
jQuery.wallPainter.mixin({
	myMixin: function() { ... }
});
```
