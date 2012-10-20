(function( $ ) {
  "use strict";

  var defaults = {
        width: 50,
        height: 50,
        paint: function(){},
        mixins: mixins,
        openImageOn: "dblclick"
      },

      // Utilities
      utils = {
        // Generate random numbers from a parametric distribution
        parametricRandom: function( n, bias ) {
          var i, r = 0;
          for ( i = 0; i < n; i++ ) {
              r += Math.random();
          }
          return $.isFunction( bias ) ? bias( r/i ) : Math.pow( r/i, Math.pow( 1.2, bias ) );
        },

        // Translate hexadecimal values into three separate RGB channels
        hexToRGB: function( hex, alpha ) {
          hex = parseInt( hex, 16 );
          return {
            red:   ( ( hex & 0xff0000 ) >> 16 ),
            green: ( ( hex & 0x00ff00 ) >> 8 ),
            blue:  ( ( hex & 0x0000ff ) ),
            alpha: typeof alpha === 'number' ? alpha : 1
          };
        },

        // Map a value ranging from 0 to 1 into another range
        mapToRange: function( x, from, to, floor ) {
          return floor ? Math.floor( x * ( to - from ) ) + from : x * ( to - from ) + from;
        }
      },

      // Default mixins
      mixins = {
        // Utility to draw a straight line between two points
        line: function( x1, y1, x2, y2 ) {
         this.moveTo( x1, y1 );
         this.lineTo( x2, y2 );
        },

        // Repeat a drawing shifting x and y in a range
        repeat: function( opts, func ) {
          var defts = {
            from: [ 0, 0 ],
            to: [ 1, 1 ],
            increment: [ 10, 10 ]
          },
          x, y;
          opts = $.extend( defts, opts );
          for( x = opts.from[0]; x <= opts.to[0]; x += opts.increment[0] ) {
            for( y = opts.from[1]; y <= opts.to[1]; y += opts.increment[1] ) {
              func( x, y, ( x - opts.from[0] ) / opts.increment[0], ( y - opts.from[1] ) / opts.increment[1] );
            }
          }
        },

        // Utility to draw a polygon
        polygon: function() {
          this.beginPath();
          for( var i in arguments ) { if ( arguments.hasOwnProperty( i ) ) {
            if( i === 0)  {
              this.moveTo( arguments[i][0], arguments[i][1] );
            } else {
              this.lineTo( arguments[i][0], arguments[i][1] );
            }
          }}
          this.closePath();
        },

        // Mixin to paint bacckground color
        paintBackground: function( color ) {
          var originalFillStyle = this.fillStyle;
          if ( color ) {
            this.fillStyle = color;
          }
          this.fillRect( 0, 0, this.canvas.width, this.canvas.height );
          this.strokeStyle = originalFillStyle;
        },

        // Utility to draw background noise
        noise: function( opts ) {
          var defts = {
            opacity: { from: 0.1, to: 0.5 },
            grainDimension: 1,
            fromColor: "000000",
            toColor: "606060",
            independentChannels: false,
            distribution: "bell",
            bias: 0
          },
          x = 0, y = 0;
          opts = $.extend( defts, opts );
          // Parse options.distribution and turn it into an integer
          if ( typeof opts.distribution === "string" ) {
            switch( opts.distribution ) {
              case "uniform": opts.distribution = 1; break;
              case "triangular": opts.distribution = 2; break;
              case "bell": opts.distribution = 5; break;
              default: opts.distribution = 5;
            }
          } else {
            opts.distribution = Math.abs( parseInt( opts.distribution, 10 ) );
          }
          // If grainDimension is a number, then use that as the value for grainDimension.width and grainDimension.height
          if ( typeof opts.grainDimension === 'number' ) {
            opts.grainDimension = { width: opts.grainDimension, height: opts.grainDimension };
          }
          while ( x < this.canvas.width ) {
            while ( y < this.canvas.height ) {
              var fromRGB = utils.hexToRGB( opts.fromColor, opts.opacity.hasOwnProperty('from') ? opts.opacity.from : opts.opacity ),
                  toRGB = utils.hexToRGB( opts.toColor, opts.opacity.hasOwnProperty('to') ? opts.opacity.to : opts.opacity ),
                  r, g, b, a;
              if ( !opts.independentChannels ) {
                  // RGB channels are not independent
                  var rand = utils.parametricRandom( opts.distribution, opts.bias );
                  r = utils.mapToRange( rand, fromRGB.red, toRGB.red, true );
                  g = utils.mapToRange( rand, fromRGB.green, toRGB.green, true );
                  b = utils.mapToRange( rand, fromRGB.blue, toRGB.blue, true );
                  a = utils.mapToRange( rand, fromRGB.alpha, toRGB.alpha );
              } else {
                  // RGB channels are independent
                  r = utils.mapToRange( utils.parametricRandom( opts.distribution, opts.bias ), fromRGB.red, toRGB.red, true );
                  g = utils.mapToRange( utils.parametricRandom( opts.distribution, opts.bias ), fromRGB.green, toRGB.green, true );
                  b = utils.mapToRange( utils.parametricRandom( opts.distribution, opts.bias ), fromRGB.blue, toRGB.blue, true );
                  a = utils.mapToRange( Math.random(), fromRGB.alpha, toRGB.alpha );
              }
              this.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
              this.fillRect( x, y, opts.grainDimension.width, opts.grainDimension.height );
              y += opts.grainDimension.height;
            }
            y = 0;
            x += opts.grainDimension.width;
          }
        }
      };

  // jQuery.wallPainter
  $.wallPainter = {
    
    extendDefaults: function( opts ) {
      var extended = $.extend( {}, defaults, opts );
      extended.mixins = $.extend( {}, mixins, opts.mixins );
      return extended;
    },

    setDefaults: function( opts ) {
      defaults = $.wallPainter.extendDefaults( opts );
    },

    mixin: function( mxn ) {
      $.extend( defaults.mixins, mxn );
    }
  };

  // jQuery( ... ).wallPainter
  $.fn.wallPainter = function( options ) {

    var ctx, dataURL,
        canvas = document.createElement("canvas"),
        originalBgImage = this.css("background-image"),
        options = $.wallPainter.extendDefaults( options );
    
    // Detect canvas support
    if ( !canvas.getContext || !canvas.getContext("2d") ) {
      // Canvas not supported :( just return maintaining chainability
      return this;
    } else {
      // Canvas supported :)
      ctx = canvas.getContext("2d");      

      canvas.width = options.width;
      canvas.height = options.height;
      
      // Paint canvas
      options.paint.call( this, $.extend( ctx, options.mixins ) );
      dataURL = canvas.toDataURL("image/png");

      // Bind event to open image
      if( options.openImageOn ) {
        this.on( options.openImageOn, function() {
          window.open( dataURL );
        });
      }

      return this.css( "background-image", "url(" + dataURL + ")" + ", " + originalBgImage || "none repeat" );
    }
  };
})( jQuery );