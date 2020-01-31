/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file license.pdf.                                                 *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * Renderer - to be improved and expanded...
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function Renderer( aoz, canvasId )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.banks = aoz.banks;
	this.canvas = document.getElementById( canvasId );
	this.context = this.canvas.getContext( '2d' );

	var width = this.canvas.width;
	var height = this.canvas.height;
	if ( this.manifest.display.fullScreen || this.manifest.display.fullPage )
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}
	this.width = width;
	this.height = height;
	this.originalWidth = width;
	this.originalHeight = height;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.scaleX = typeof this.manifest.display.scaleX != 'undefined' ? this.manifest.display.scaleX : 1;
	this.scaleY = typeof this.manifest.display.scaleY != 'undefined' ? this.manifest.display.scaleY : 1;
	this.background = typeof this.manifest.display.background != 'undefined' ? this.manifest.display.background : 'color';
	this.backgroundColor = typeof this.manifest.display.backgroundColor != 'undefined' ? this.manifest.display.backgroundColor : '#000000';
	this.redrawBars = true;
	this.xLeftDraw = 0;
	this.yTopDraw = 0;
	this.widthDraw = 320;
	this.heightDraw = 200;

	// Display FPS?
	if ( this.manifest.display.fps )
	{
		var height = this.utilities.getFontStringHeight( this.manifest.display.fpsFont );
		this.fpsRectX = this.manifest.display.fpsX;
		this.fpsRectY = this.manifest.display.fpsY;
		this.fpsRectWidth = this.context.measureText( 'XXX FPS' ).width;
		this.fpsRectHeight = height;
	}

	this.debugX = 1;
	this.debugY = 1;
	var self = this;
	window.addEventListener( "resize", doResize );
	doResize( true );

	// Load the full screen icons
	if ( this.manifest.display.fullScreenIcon )
	{
		this.utilities.loadImages(
		[
			'./run/resources/full_screen.png',
			'./run/resources/small_screen.png',
		], {}, function( response, data, extra )
		{
			if ( response )
			{
				self.fullScreenIcons = data;
			}
		} );
	}

	this.modified = true;
	this.doubleBuffer = false;
	this.viewOn = true;

	function doResize( force )
	{
		if( force && ( self.manifest.display.fullScreen || self.manifest.display.fullPage ) )
		{
			self.width = window.innerWidth;
			self.height = window.innerHeight;
			self.canvas.width = self.width;
			self.canvas.height = self.height;
			self.fullScreenIconRatio = self.width / self.manifest.display.width;
			self.redrawBars = true;
			self.resetDisplay = true;
		}
	}
};
Renderer.prototype.init = function()
{
};
Renderer.prototype.getSoftwareFromHardwareX = function( x )
{

};
Renderer.prototype.setDoubleBuffer = function()
{
	this.doubleBuffer = true;
};
Renderer.prototype.autoback = function( mode )
{
	if ( !this.doubleBuffer )
		throw 'illegal_function_call';
	if ( mode == 0 || mode == 1 )
		this.viewOn = false;
	else
		this.viewOn = true;
};
Renderer.prototype.screenSwap = function()
{
	if ( !this.doubleBuffer )
		throw 'illegal_function_call';
	if ( !this.viewOn )
		this.render( true );
};
Renderer.prototype.setModified = function()
{
	this.modified = true;
};
Renderer.prototype.setBackgroundColor = function( color )
{
	this.backgroundColor = color;
	this.setModified();
};
Renderer.prototype.setView = function( onOff )
{
	this.viewOn = onOff;
};
Renderer.prototype.view = function( onOff )
{
	this.viewOn = true;
	this.render( true );
};
Renderer.prototype.setScreenDisplay = function()
{
	var hardTopY = 0, hardHeight = 0;
	if ( this.manifest.compilation.emulation != 'PC' )
	{
		switch( this.manifest.display.tvStandard )
		{
			case 'pal':
				hardTopY = 30;
				hardHeight = 311 - hardTopY;
				break;
			default:
			case 'ntsc':
				hardTopY = 30;
				hardHeight = 261 - hardTopY;
				break;
		}
	}
	switch( this.manifest.compilation.emulation )
	{
		default:
		case '500':
		case '600':
		case '1200':
		case '3000':
		case '4000':
			this.hardLeftX = 110;
			this.hardTopY = hardTopY;
			this.hardWidth = 342;
			this.hardHeight = hardHeight;
			break;
		case 'PC':
			this.hardLeftX = 0;
			this.hardTopY = 0;
			this.hardWidth = this.widthDraw / this.scaleX;
			this.hardHeight = this.heightDraw / this.scaleY;
			break;
	}
};
Renderer.prototype.render = function( force )
{
	var self = this;
	force = typeof force == 'undefined' ? false : true;
	if ( !this.rendering && ( force || ( this.modified & this.viewOn ) ) )
	{
		this.rendering = true;
		this.context.save();
		this.context.imageSmoothingEnabled = true;
		this.context.imageRendering = 'pixelated';
		this.context.globalAlpha = 1.0;

		// Drawing area
		var widthDraw = this.width;
		var heightDraw = this.height;
		var doClip = false;
		if ( this.manifest.display.fullPage || this.manifest.display.fullScreen )
		{
			if ( this.manifest.display.keepProportions )
			{
				var originalRatio = this.manifest.display.width / this.manifest.display.height;
				var w = heightDraw * originalRatio;
				var h = widthDraw / originalRatio;
				if ( h <= heightDraw )
				{
					widthDraw = h * originalRatio;
					heightDraw = h;
				}
				else
				{
					widthDraw = w;
					heightDraw = w / originalRatio;
				}
				doClip = true;
			}
		}
		var xLeftDraw = ( this.width - widthDraw ) / 2;
		var yTopDraw = ( this.height - heightDraw ) / 2;

		this.xLeftDraw = xLeftDraw;
		this.yTopDraw = yTopDraw;
		this.widthDraw = widthDraw;
		this.heightDraw = heightDraw;
		this.setScreenDisplay();

		// Reset display
		if ( this.background == 'transparent' )
		{
			if ( this.resetDisplay )
				this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			else
				this.context.clearRect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
		}
		else
		{
			this.context.fillStyle = this.backgroundColor;
			if ( this.resetDisplay )
				this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
			else
				this.context.fillRect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
		}
		this.resetDisplay = false;

		// If full screen, clip!
		if ( doClip )
		{
			path = new Path2D();
			path.rect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
			this.context.clip( path );
		}
		this.xRatioDisplay = widthDraw / this.hardWidth;
		this.yRatioDisplay = heightDraw / this.hardHeight;
		if ( this.manifest.compilation.emulation.toLowerCase() == 'pc' )
		{
			this.xRatioDisplay *= ( widthDraw / this.manifest.display.width );
			this.yRatioDisplay *= ( heightDraw / this.manifest.display.height );
		}

		// Draw screens
		if ( this.aoz.screensContext.isAny() )
		{
			// Rainbows
			var rainbowsToRemove;
			var rainbowsToDraw;
			if ( this.aoz.moduleRainbows )
			{
				var numberOfRainbows = 0;
				var rainbows = [];
				for ( var rainbow = this.aoz.moduleRainbows.context.getFirstElement( this.aoz.currentContextName ); rainbow != null; rainbow = this.aoz.moduleRainbows.context.getNextElement( this.aoz.currentContextName ) )
					rainbows[ numberOfRainbows++ ] = rainbow;

				if ( this.aoz.moduleRainbows.mode == 'slow' )
				{
					if ( numberOfRainbows )
						rainbowsToDraw = rainbows;
				}
				else if ( this.aoz.moduleRainbows.mode == 'fast' )
				{
					if ( numberOfRainbows > 0 )
					{
						// Insert rainbow screen at the correct Z position in screens
						var screen;
						var screens = [];
						var countScreens = 0;
						for ( screen = this.aoz.screensContext.getFirstElement( this.aoz.currentContextName ); screen != null; screen = this.aoz.screensContext.getNextElement() )
						{
							for ( var r = 0; r < numberOfRainbows; r++ )
							{
								var rainbow = rainbows[ r ];
								if ( countScreens == rainbow.zPosition && rainbow.screen )
								{
									if ( !screens[ r ] )
									{
										screens[ r ] = screen;
										countScreens++;
										break;
									}
								}
							}
						}
						if ( countScreens )
						{
							rainbowsToRemove = [];
							for ( var r = 0; r < rainbows.length; r++ )
							{
								if ( rainbows[ r ].screen )
								{
									rainbowsToRemove.push( rainbows[ r ] );
									rainbows[ r ].screen.show( true );
									if ( screens[ r ] )
									{
										this.aoz.screensContext.addElement( this.aoz.currentContextName, rainbows[ r ].screen );
										this.aoz.screensContext.moveBefore( this.aoz.currentContextName, rainbows[ r ].screen, screens[ r ] );
										screens[ r ] = null;
									}
								}
							}
							for ( var r = 0; r < rainbows.length; r++ )
							{
								if ( rainbows[ r ].screen )
								{
									if ( screens[ r ] )
									{
										this.aoz.screensContext.addElement( this.aoz.currentContextName, rainbows[ r ] );
									}
								}
							}
						}
					}
				}
			}

			this.aoz.screensContext.parseAll( undefined, function( screen )
			{
				if ( !screen.hidden )
				{
					var xDrawScreen;
					var yDrawScreen;
					if ( screen.isCenteredX )
						xDrawScreen = xLeftDraw + widthDraw / 2 - screen.dimension.width * screen.scale.x - self.hardLeftX * self.xRatioDisplay;
					else
						xDrawScreen = ( screen.position.x - self.hardLeftX ) * self.xRatioDisplay  + xLeftDraw;// - screen.hotSpot.x * screen.displayScale.x * self.xRatioDisplay;
					if ( screen.isCenteredY )
						yDrawScreen = yTopDraw + heightDraw / 2 - screen.dimension.height * screen.scale.y - self.hardTopY * self.yRatioDisplay;
					else
						yDrawScreen = ( screen.position.y - self.hardTopY ) * self.yRatioDisplay + yTopDraw;// - screen.hotSpot.y * screen.displayScale.y * self.yRatioDisplay;
					var xScaleScreen = screen.displayScale.x * screen.renderScale.x * ( self.xRatioDisplay / screen.scale.x );
					var yScaleScreen = screen.displayScale.y * screen.renderScale.y * ( self.yRatioDisplay / screen.scale.y );
					var width = screen.display.width * screen.scale.x;
					var height = screen.display.height * screen.scale.y;
					var widthDrawScreen = width * xScaleScreen;
					var heightDrawScreen = height * yScaleScreen;

					var screenRotated = false;
					if ( screen.angle.z == 0 && screen.skew.x == 0 && screen.skew.y == 0 )
					{
						self.context.drawImage( screen.canvas, ( screen.offset.x - screen.hotSpot.x ) * screen.scale.x, ( screen.offset.y - screen.hotSpot.y ) * screen.scale.y, width, height, xDrawScreen, yDrawScreen, widthDrawScreen, heightDrawScreen );
					}
					else
					{
						self.context.setTransform( xScaleScreen, screen.skew.x, screen.skew.y, yScaleScreen, xDrawScreen, yDrawScreen );
						self.context.rotate( screen.angle.z );
						self.context.drawImage( screen.canvas, 0, 0, width, height, 0, 0, width, height );
						screenRotated = true;
					}

					/*
					if ( self.aoz.showCopperBlack && screen.xScale == 1 && screen.yScale == 1 && screen.angle == 0 )
					{
						var width = screen.displayWidth * screen.renderScaleX * ( widthDraw / self.hardWidth );
						var height = screen.displayHeight * screen.renderScaleY * ( heightDraw / self.hardHeight );
						self.context.fillStyle = self.backgroundColor;
						self.context.fillRect( 0, yDraw - self.scaleY, widthDraw, self.scaleY );
						self.context.fillRect( 0, yDraw + height, widthDraw, self.scaleY );
						self.context.fillRect( 0, yDraw, xDraw, height );
						self.context.fillRect( xDraw + width, yDraw, self.canvas.width - x - width, height );
					}
					*/

					// Update the bobs and sprites
					self.aoz.rendererUpdate();

					// Bobs!
					if ( screen.bobsContext.isAny() )
					{
						// Clip the canvas
						self.context.save();
						path = new Path2D();
						path.rect( xDrawScreen, yDrawScreen, widthDrawScreen, heightDrawScreen );
						self.context.clip( path );

						// Go through all the bobs...
						screen.bobsContext.parseAll( undefined, function( bob )
						{
							if ( bob.visible && bob.canvas )
							{
								var canvas = bob.canvas;
								var xBob = bob.positionDisplay.x * screen.displayScale.x * self.xRatioDisplay + xDrawScreen;
								var yBob = bob.positionDisplay.y * screen.displayScale.y * self.yRatioDisplay + yDrawScreen;
								var xScale = xScaleScreen * bob.scaleDisplay.x * screen.scale.x;
								var yScale = yScaleScreen * bob.scaleDisplay.y * screen.scale.y;
								if ( bob.clipping )
								{
									self.context.save();
									path = new Path2D();
									path.rect( bob.clipping.x * screen.displayScale.x * self.xRatioDisplay + xDrawScreen,
											   bob.clipping.y * screen.displayScale.y * self.yRatioDisplay + yDrawScreen,
											   bob.clipping.width * screen.displayScale.x * self.xRatioDisplay,
											   bob.clipping.height * screen.displayScale.y * self.yRatioDisplay );
									self.context.clip( path );
								}
								self.context.globalAlpha = bob.alpha;
								if ( !screenRotated && ( bob.angleDisplay.z == 0 && bob.skewDisplay.x == 0 && bob.skewDisplay.y == 0 ) )
								{
									var deltaX = bob.imageObject.hotSpotX * screen.displayScale.x * xScale;
									var deltaY = bob.imageObject.hotSpotY * screen.displayScale.y * yScale;
									self.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, xBob - deltaX, yBob - deltaY, xScale * canvas.width, yScale * canvas.height );
								}
								else
								{
									var xCenter = ( screen.position.x - self.hardLeftX ) * self.xRatioDisplay;
									var yCenter = ( screen.position.y - self.hardTopY ) * self.yRatioDisplay;
									var bobDisplay = self.utilities.rotate( xBob, yBob, xCenter, yCenter, screen.angle.z );
									self.context.setTransform( xScale, screen.skew.x + bob.skew.x, screen.skew.y + bob.skew.y, yScale, bobDisplay.x, bobDisplay.y );
									self.context.rotate( screen.angle.z + bob.angleDisplay.z );
									self.context.drawImage( canvas, -bob.imageObject.hotSpotX, -bob.imageObject.hotSpotY );
									self.context.resetTransform();
									self.context.rotate( 0 );
								}
								if ( bob.clipping )
									self.context.restore();
							}
						} );

						// Restore canvas
						self.context.restore();
					}
				}
			} );
			if ( rainbowsToRemove )
			{
				for ( var r = 0; r < rainbowsToRemove.length; r++ )
				{
					this.aoz.screensContext.deleteElement( this.aoz.currentContextName, rainbowsToRemove[ r ] );
				}
			}
			else if ( rainbowsToDraw )
			{
				for ( var r = 0; r < rainbowsToDraw.length; r++ )
				{
					var rainbow = rainbowsToDraw[ r ];
					rainbow.render( this.context, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height } );
				}
			}
		};

		// Sprites!
		// Draw sprites
		this.aoz.spritesContext.parseAll( undefined, function( sprite )
		{
			if ( sprite.visible && typeof sprite.canvas )
			{
				var canvas = sprite.canvas;
				if ( canvas )
				{
					var xDraw = ( sprite.positionDisplay.x - self.hardLeftX ) * ( widthDraw / self.hardWidth ) + xLeftDraw;
					var yDraw = ( sprite.positionDisplay.y - self.hardTopY ) * ( heightDraw / self.hardHeight ) + yTopDraw;
					if ( sprite.angleDisplay.z == 0 && sprite.skewDisplay.x == 0 && sprite.skewDisplay.y == 0 )
					{
						var deltaX = sprite.imageObject.hotSpotX * ( widthDraw / self.hardWidth );
						var deltaY = sprite.imageObject.hotSpotY * ( heightDraw / self.hardHeight );
						var width = sprite.imageObject.width * ( widthDraw / self.hardWidth );
						var height = sprite.imageObject.height * ( heightDraw / self.hardHeight );
						self.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, xDraw - deltaX, yDraw - deltaY, width, height );
					}
					else
					{
						self.context.setTransform( sprite.scaleDisplay.x * ( self.width / self.hardWidth ), sprite.skewDisplay.x, sprite.skewDisplay.y, sprite.scaleDisplay.y * ( self.height / self.hardHeight ), xDraw, yDraw );
						self.context.rotate( sprite.angleDisplay.z );
						self.context.drawImage( canvas, -sprite.imageObject.hotSpotX, -sprite.imageObject.hotSpotY );
						self.context.rotate( 0 );
						self.context.setTransform( 1, 0, 0, 1, 0, 0 );
					}
				}
			}
		} );

		// All done!
		this.context.restore();
	}

	// Display FPS?
	if ( this.manifest.display.fps )
	{
		if ( ( this.aoz.fpsPosition % 10 ) == 0 || !this.previousFps )
		{
			this.previousFps = 0;
			for ( var f = 0; f < this.aoz.fps.length; f++ )
				this.previousFps += this.aoz.fps[ f ];
			this.previousFps = 1000 / ( this.previousFps / this.aoz.fps.length );
		}

		var text = this.aoz.errors.getErrorFromNumber( 202 ).message;
		text = this.aoz.utilities.replaceStringInText( text, '%1', '' + Math.floor( this.previousFps ) );
		this.context.fillStyle = this.manifest.display.backgroundColor;
		this.context.fillRect( this.fpsRectX, this.fpsRectY, this.fpsRectWidth, this.fpsRectHeight );
		this.context.fillStyle = this.manifest.display.fpsColor;
		this.context.font = this.manifest.display.fpsFont;
		this.context.textBaseline = 'top';
		this.context.fillText( text, this.manifest.display.fpsX, this.manifest.display.fpsY );
	}

	// Display Full Screen Icons?
	if ( this.manifest.display.fullScreenIcon && this.fullScreenIcons )
	{
		if ( this.isFullScreen() )
			this.fullScreenIconOn = 'small_screen';
		else
			this.fullScreenIconOn = 'full_screen';
		var image = this.fullScreenIcons[ this.fullScreenIconOn ];
		this.fullScreenIconX = this.manifest.display.fullScreenIconX >= 0 ? this.manifest.display.fullScreenIconX * this.fullScreenIconRatio : this.width + this.manifest.display.fullScreenIconX  * this.fullScreenIconRatio;
		this.fullScreenIconY = this.manifest.display.fullScreenIconY >= 0 ? this.manifest.display.fullScreenIconY * this.fullScreenIconRatio : this.height + this.manifest.display.fullScreenIconY * this.fullScreenIconRatio;
		this.fullScreenIconWidth = image.width * this.fullScreenIconRatio;
		this.fullScreenIconHeight = image.height * this.fullScreenIconRatio;
		this.context.fillStyle = this.manifest.display.backgroundColor;
		this.context.fillRect( this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
		this.context.drawImage( image, this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
	}

	// The end!
	this.modified = false;
	this.rendering = false;
};

Renderer.prototype.isFullScreen = function()
{
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	return full_screen_element != null;
};
Renderer.prototype.isInFullScreenIcon = function( position)
{
	if ( this.fullScreenIconOn )
	{
		if ( position.x >= this.fullScreenIconX && position.x < this.fullScreenIconX + this.fullScreenIconWidth
		  && position.y >= this.fullScreenIconY && position.y < this.fullScreenIconY + this.fullScreenIconHeight )
		  return this.fullScreenIconOn;

		return false;
	}
};
Renderer.prototype.swapFullScreen = function()
{
	if ( document.fullscreenEnabled )
	{
		if ( this.fullScreenIconOn == 'full_screen' )
			this.canvas.requestFullscreen();
		else
			document.exitFullscreen();
	}
}
