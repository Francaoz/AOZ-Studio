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
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 * 
 * True Color Screens Class
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function Screen( aoz, renderer, contextName, definition )
{
	this.aoz = aoz;
	this.renderer = renderer;
	this.contextName = contextName;
	this.utilities = aoz.utilities;
	this.sprites = aoz.sprites;
	this.banks = aoz.banks;
	this.position = 
	{ 
		x: this.aoz.manifest.default.screen.x, 
		y: this.aoz.manifest.default.screen.y, 
		z: 0, 
	};
	this.dimension = 
	{ 
		width: this.aoz.manifest.default.screen.width, 
		height: this.aoz.manifest.default.screen.height, 
		depth: 0 
	};
	this.scale = { x: 1, y: 1, z: 1 };
	this.skew = { x: 0, y: 0, z: 0 };
	this.angle = { x: 0, y: 0, z: 0 };
	this.hotSpot = { x: 0, y: 0, z: 0 };
	this.display = { width: this.dimension.width, height: this.dimension.height, depth: 0 };
	this.grPosition = { x: 0, y: 0, z: 0 };
	this.offset = { x: 0, y: 0, z: 0 };
	this.skew = { x: 0, y: 0, z: 0 };

	if ( definition.position )
	{ 
		this.position.x = typeof definition.position.x != 'undefined' ? definition.position.x : this.definition.x;
		this.position.y = typeof definition.position.y != 'undefined' ? definition.position.y : this.definition.y;
	}
	if ( definition.dimension )
	{ 		 
		this.dimension.width = typeof definition.dimension.width != 'undefined' ? definition.width : this.definition.width;
		this.dimension.height = typeof definition.dimension.height != 'undefined' ? definition.height : this.defintion.height;
		if ( this.dimension.width <= 0 || this.dimension.height <= 0 )
			throw 'illegal_function_call';
		if ( !this.aoz.manifest.compilation.unlimitedScreens )
		{
			if ( this.dimension.width >= 1024 || this.dimension.height >= 1024 )
				throw 'illegal_function_call';
		}		
	}
	if ( definition.display )
	{ 		 
		this.display.width = typeof definition.display.width != 'undefined' ? display.width : this.display.width;
		this.display.height = typeof definition.display.height != 'undefined' ? display.height : this.display.height;
	}
	if ( definition.angle )
	{ 
		this.angle.z = typeof definition.angle.z != 'undefined' ? definition.angle.z : this.angle.z;
	}
	if ( definition.hotSpot )
	{ 
		this.hotSpot.x = typeof definition.hotSpot.x != 'undefined' ? definition.hotSpot.x : this.hotSpot.x;
		this.hotSpot.y = typeof definition.hotSpot.y != 'undefined' ? definition.hotSpot.y : this.hotSpot.y;
	}
	if ( definition.offset )
	{ 
		this.offset.x = typeof definition.offset.x != 'undefined' ? definition.offset.x : this.offset.x;
		this.offset.y = typeof definition.offset.y != 'undefined' ? definition.offset.y : this.offset.y;
	}
	if ( definition.skew )
	{ 
		this.skew.x = typeof definition.skew.x != 'undefined' ? definition.skew.x : this.skew.x;
		this.skew.y = typeof definition.skew.y != 'undefined' ? definition.skew.y : this.skew.y;
	}
	
	if ( definition.clip )
	{ 
		this.clip = this.utilities.getZone( definition.clip, this.dimension, this.scale );;
	}

	this.numberOfColors = typeof definition.numberOfColors != 'undefined' ? definition.numberOfColors : this.aoz.manifest.default.screen.numberOfColors;
	this.palette = [];
	if ( this.aoz.manifest.compilation.usePalette )
		this.alphas = [];
	else
		this.alphas = {};
	var palette = definition.palette != 'undefined' ? definition.palette : this.aoz.manifest.default.screen.palette;
	for ( var c = 0; c < Math.max( this.numberOfColors, palette.length ); c++ )
	{
		var colorString = '#000000';
		if ( c < palette.length )
			colorString = palette[ c ].toUpperCase();
		this.palette[ c ] = colorString;
		if ( this.aoz.manifest.compilation.usePalette )
			this.alphas[ c ] = 1;
		else
			this.alphas[ colorString ] = 1;
	}

	this.pixelMode = typeof definition.pixelMode != 'undefined' ? definition.pixelMode : this.aoz.manifest.display.pixelMode;
	if ( typeof this.pixelMode == 'number' )
	{
		var pixelString = '';
		if ( ( this.pixelMode & 1 ) != 0 )
			pixelString += 'hires';
		if ( ( this.pixelMode & 2 ) != 0 )
			pixelString += ' laced';
		if ( ( this.pixelMode & 4 ) != 0 )
			pixelString += ' hbm';
		this.pixelMode = pixelString;
	}

	this.halfBrightMode = false;
	this.hamMode = false;
	if ( this.aoz.manifest.compilation.maskHardwareCoordinates )
	{
		this.position.x &= 0xFFFFFFF0;
		this.dimension.width &= 0xFFFFFFF0;
	}
	if ( this.aoz.manifest.compilation.emulation == '500' || this.aoz.manifest.compilation.emulation == '1200' || this.aoz.manifest.compilation.emulation == '3000' || this.aoz.manifest.compilation.emulation == '4000' )
	{
		if (   this.numberOfColors != 2 && this.numberOfColors != 4
			&& this.numberOfColors != 8 && this.numberOfColors != 16
			&& this.numberOfColors != 16 && this.numberOfColors != 32
			&& this.numberOfColors != 64 && this.numberOfColors != 4096 )
			throw 'illegal_function_call';
	}
	else if ( this.aoz.manifest.compilation.emulation == '600' || this.aoz.manifest.compilation.emulation == '1200' )
	{
		if (   this.numberOfColors != 2 && this.numberOfColors != 4
			&& this.numberOfColors != 8 && this.numberOfColors != 16
			&& this.numberOfColors != 16 && this.numberOfColors != 32
			&& this.numberOfColors != 64 && this.numberOfColors != 128
			&& this.numberOfColors != 256 && this.numberOfColors != 4096 )
			throw 'illegal_function_call';
	}
	if ( this.numberOfColors == 64 || this.pixelMode.indexOf( 'hbm' ) >= 0 )
	{
		this.halfBrightMode = true;
		for ( var p = 0; p < 32; p++ )
		{
			this.setHalfBrightColor( p );
		}
		this.numberOfColors = 32;
	}
	if ( this.numberOfColors == 4096 )
	{
		this.numberOfColors = 64;
		this.hamMode = true;
	}

	this.ink = 2;
	this.pattern = 0;
	this.paint = false;
	this.border = 0;
	this.cloned = null;
	this.linePattern = [];

	// Create canvas
	this.scale = 
	{
		x: typeof this.aoz.manifest.display.screenScale != 'undefined' ? aoz.manifest.display.screenScale : 1,
		y: typeof this.aoz.manifest.display.screenScale != 'undefined' ? aoz.manifest.display.screenScale : 1,
		z: 1
	};
	this.renderScale = 
	{
		x: ( this.pixelMode.indexOf( 'hires' ) >= 0 ? 0.5 : 1 ),
		y: ( this.pixelMode.indexOf( 'laced' ) >= 0 ? 0.5 : 1 ),
		z: 1
	}
	this.displayScale = { x: 1, y: 1, z: 1 };
	this.canvas = document.createElement( 'canvas' );
	this.canvas.width = this.dimension.width * this.scale.x;
	this.canvas.height = this.dimension.height * this.scale.y;
	this.context = this.canvas.getContext( '2d' );
	this.dualPlayfieldFront = false;
	this.dualPlayfieldBack = false;
	this.font = null;
	this.imageRendering = 'pixelated';
	this.delayedDrawing = true;
	this.drawingHandle = null;
	this.drawingCount = 0;
	this.onlyInk = false;
	this.xor = false;
	this.inverseInks = false;

	// Bob context
	this.bobsContext = new AOZContext( this.aoz, contextName, { sorted: true } );
	this.bobsContext.addContext("v1_0_3d");
this.bobsContext.addContext("v1_0_textwindows");

	this.bobsToUpdate = false;
	this.bobsUpdateOn = true;
	this.bobsPriorityOn = false;
	this.bobsPriorityReverseOn = false;

	// Default window
	this.windows = {};
	this.windowsZ = [];
	this.zones = [];
	this.scrolls = [];
	this.transparentColors = [];
	this.maxZones = 0;
	this.windOpen( 'default' );

	// Create Empty Window
	for ( var p = 0 in Screen.prototype )
	{
		if ( p != 'deactivate' )
			Screen.ScreenEmpty.prototype[ p ] = function() { throw 'screen_not_opened' };
		else
			Screen.ScreenEmpty.prototype[ p ] = function() {};
	}

	// Set first font on the list
	this.font = this.aoz.fonts.firstFont;
	this.fontHeight  = this.aoz.fonts.firstFontHeight;

	// Available properties -> TODO -> Update!
	this.propertyContext =
	{
		name: 'Screen',
		self: this,
		properties:
		{
			// TODO: add
			//	### ROOT tag
			//  ## etc. think about it!
			// 	# normal tag, can be removed
			x: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			y: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			width: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			height: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			numberOfColors: { type: PROPERTYTYPE_INTEGER, doTags: '#refresh', addTags: [ ], removeTags: [] },
			pixelMode: { type: PROPERTYTYPE_STRING, doTags: '#refresh', addTags: [ ], removeTags: [] },
			angleDisplay: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			xScaleDisplay: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			yScaleDisplay: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			xSkewDisplay: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			ySkewDisplay: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			isCenteredX: { type: PROPERTYTYPE_BOOLEAN, doTags: '#refresh', addTags: [ ], removeTags: [] },
			isCenteredY: { type: PROPERTYTYPE_BOOLEAN, doTags: '#refresh', addTags: [ ], removeTags: [] },
			displayWidth: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			displayHeight: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			offsetX: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			offsetY: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			hotSpotX: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			hotSpotY: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			ink: { type: PROPERTYTYPE_INTEGER, doTags: '', addTags: [], removeTags: [] },
			positionX: { type: PROPERTYTYPE_FLOAT, doTags: '', addTags: [], removeTags: [] },
			positionY: { type: PROPERTYTYPE_FLOAT, doTags: '', addTags: [], removeTags: [] },
			scale: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			renderScaleX: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			renderScaleY: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [ ], removeTags: [] },
			canvas: { type: "Canvas", doTags: '#restart', addTags: [], removeTags: [] },
			context: { type: "Context", doTags: '#refresh', addTags: [], removeTags: [] },
			clipX1: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [], removeTags: [] },
			clipY1: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [], removeTags: [] },
			clipX2: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [], removeTags: [] },
			clipY2: { type: PROPERTYTYPE_FLOAT, doTags: '#refresh', addTags: [], removeTags: [] },
			bobsToUpdate: { type: PROPERTYTYPE_BOOLEAN, doTags: '', addTags: [], removeTags: [] },
			bobsUpdateOn: { type: PROPERTYTYPE_BOOLEAN, doTags: '', addTags: [], removeTags: [] },
			bobsPriorityOn: { type: PROPERTYTYPE_BOOLEAN, doTags: '#refresh', addTags: [], removeTags: [] },
			bobsPriorityReverseOn: { type: PROPERTYTYPE_BOOLEAN, doTags: '#refresh', addTags: [], removeTags: [] },
		}
	};
	this.aoz.registerPropertyContext( this.propertyContext );
};
Screen.prototype.setTags = function( tags )
{
	if ( this.utilities.getTag( tags, [ 'refresh' ] ) != '' )
		this.setModified();
};
Screen.prototype.setModified = function()
{
	this.toUpdate = true;
	this.renderer.modified = true;
};


//////////////////////////////////////////////////////////////////////
// Control
//////////////////////////////////////////////////////////////////////
Screen.prototype.startDrawing = function()
{
	this.drawingCount++;
	if ( this.drawingCount == 1 )
	{
		if ( this.currentTextWindow )
			this.currentTextWindow.cursorOff();
		if ( this.clip )
		{
			this.context.save();
			this.context.rect( this.clip.x, this.clip.y, this.clip.x + this.clip.width, this.clip.y + this.clip.height );
			this.context.clip();
		}
	}
}; 
Screen.prototype.endDrawing = function( noCursor )
{
	this.toUpdate = true;
	this.renderer.modified = true;

	this.drawingCount--;
	if ( this.drawingCount == 0 )
	{
		if ( this.clip )
			this.context.restore();
		if ( !noCursor && this.currentTextWindow )
			this.currentTextWindow.cursorOn();
	}
};
Screen.prototype.clipOff = function()
{
	if ( this.clip )
	{
		if ( this.drawingHandle )
		{
			this.context.restore();
			this.context.save();
		}
		this.clip = null;
	}
};
Screen.prototype.setClip = function( rectangle )
{
	this.clipOff();
	this.clip = this.utilities.getZone( rectangle, this.dimension, this.scale );
};

Screen.prototype.setDualPlayfield = function( screen )
{
	if ( this.dualPlayfield || screen.dualPlayfield )
		throw 'cant_set_dual_playfield';
	if ( this.pixelMode != screen.pixelMode )
		throw 'cant_set_dual_playfield';

	this.dualPlayfieldFront = true;
	screen.dualPlayfieldBack = true;
	this.setTransparent( this.aoz.usePalette ? [ 0 ] : [ '#000000' ], true );
	//screen.setTransparent( this.aoz.usePalette ? [ 0 ] : [ '#000000' ], false );
	this.utilities.remapBlock( this.context, [ { r: 0, g: 0, b: 0 } ], [ { r: 0, g: 0, b: 0, b: 0 } ], { x: 0, y: 0, width: this.dimension.width, height: this.dimension.height } );
	screen.position.x = this.position.x;
	screen.position.y = this.position.y;
	this.aoz.screensContext.moveBefore( this.aoz.currentContextName, this, screen );
	this.setModified();
	screen.setModified();
};
Screen.prototype.dualPriority = function( screen )
{
	var isGood = this.dualPlayfieldFront || this.dualPlayfieldBack || screen.dualPlayfieldFront || screen.dualPlayfieldBack;
	if ( !isGood )
		throw 'screen_not_in_dual_playfield';
	if ( !this.dualPlayfieldFront )
	{
		this.dualPlayfieldBack = false;
		this.dualPlayfieldFront = true;
		screen.dualPlayfieldBack = true;
		screen.dualPlayfieldFront = false;
		this.setTransparent( this.aoz.usePalette ? 0 : '#000000', true );
		screen.setTransparent( this.aoz.usePalette ? 0 : '#000000', false );
		this.aoz.moveBefore( this.aoz.currentContextName, this, screen );
		screen.setModified();
		this.setModified();
	}
};
Screen.prototype.show = function( flag )
{
	this.hidden = !flag;
	this.setModified();
};
Screen.prototype.setCenter = function( inX, inY )
{
	this.isCenteredX = inX ? true : false;
	this.isCenteredY = inY ? true : false;
	this.setModified();
};
Screen.prototype.setAngle = function( angle )
{
	this.angle.z = angle;
	this.setModified();
};
Screen.prototype.setSkew = function( skew )
{
	this.skew.x = typeof skew.x != 'undefined' ? skew.x : this.skew.x;
	this.skew.y = typeof skew.y != 'undefined' ? skew.y : this.skew.y;
	this.setModified();
};
Screen.prototype.setDisplay = function( rectangle )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.position.x;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.position.y;
	rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.display.width;
	rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.display.height;
	if ( this.aoz.maskHardwareCoordinates )
	{
		rectangle.x &= 0xFFFFFFF0;
		rectangle.width &= 0xFFFFFFF0;
	}
	if ( rectangle.width < 0 || rectangle.height < 0 )
		throw 'illegal_function_call';

	this.position.x = rectangle.x;
	this.position.y = rectangle.y;
	this.display.width = rectangle.width;
	this.display.height = rectangle.height;
	this.setModified();
};
Screen.prototype.setScale = function( scale )
{
	this.displayScale.x = typeof scale.x != 'undefined' ? scale.x : this.displayScale.x;
	this.displayScale.y = typeof scale.y != 'undefined' ? scale.y : this.displayScale.y;
	this.setModified();
};

Screen.prototype.setHotspot = function( hotSpot, tag )
{
	if ( hotSpot.y == 'mask' )
	{
		switch ( ( hotSpot.x & 0x70 ) >> 4 )
		{
			case 0:
				this.hotSpot.x = 0;
				break;
			case 1:
				this.hotSpot.x = this.dimension.width / 2;
				break;
			case 2:
				this.hotSpot.x = this.dimension.width;
				break;
		}
		switch ( hotSpot.x & 0x07 )
		{
			case 0:
				this.hotSpot.y = 0;
				break;
			case 1:
				this.hotSpot.y = this.dimension.height / 2;
				break;
			case 2:
				this.hotSpot.y = this.dimension.height;
				break;
		}
	}
	else
	{
		this.hotSpot.x = typeof hotSpot.x != 'undefined' ? hotSpot.x : this.hotSpot.x;
		this.hotSpot.y = typeof hotSpot.y != 'undefined' ? hotSpot.y : this.hotSpot.y;
	}
	this.setModified();
};
Screen.prototype.setOffset = function( offset )
{
	offset.x = typeof offset.x != 'undefined' ? offset.x : this.offset.x;
	offset.y = typeof offset.y != 'undefined' ? offset.y : this.offset.y;
	this.offset.x = offset.x % this.dimension.width;
	this.offset.y = offset.y % this.dimension.height;
	if ( this.offset.x + this.display.width > this.dimension.width )
		this.display.width = this.dimension.width - this.offset.x;
	if ( this.offset.y + this.display.height > this.dimension.height )
		this.display.height = this.dimension.height - this.offset.y;
	this.setModified();
};
Screen.prototype.deactivate = function()
{
	//this.currentTextWindow.deactivate();
};
Screen.prototype.activate = function()
{
	//this.currentTextWindow.activate( true );
};
Screen.prototype.setCloned = function( screen )
{
	this.cloned = screen;
	this.canvas = screen.canvas;
	this.context = screen.context;
	clearInterval( this.windows[ 0 ].cursorHandle );
};

//////////////////////////////////////////////////////////////////////
// Zones
//////////////////////////////////////////////////////////////////////
Screen.prototype.reserveZone = function( number )
{
	if ( typeof number != undefined )
	{
		if ( number < 0 )
			throw 'illegal_function_call';
		this.maxZones = number;
	}
	else
	{
		this.zones = [];
		this.maxZones = 0;
	}
};
Screen.prototype.setZone = function( number, rectangle )
{
	if ( number <= 0 || number > this.maxZones )
		throw 'illegal_function_call';
	this.zones[ number ] = this.utilities.getZone( rectangle, this.dimension, { x: 1, y: 1, z: 1 } );
};
Screen.prototype.zone = function( number, position )
{
	var screen = this.aoz.getScreen( number );
	for ( var z = 1; z < screen.zones.length; z++ )
	{
		if ( screen.zones[ z ] )
		{
			var zone = this.zones[ z ];
			if ( position.x >= zone.x && position.x < zone.x + zone.width && position.y >= zone.y && position.y < zone.y + zone.height )
			{
				return z;
			}
		}	
	}
	return 0;
};
Screen.prototype.resetZone = function( number, position )
{
	if ( typeof number != 'undefined' )
	{
		if ( number < 1 || number > this.maxZones )
			throw 'illegal_function_call';
		this.zones[ number ] = null;
	}
	else
	{
		this.zones = [];
	}
};
Screen.prototype.isIn = function( position )
{
	var x = Math.floor( ( position.x - this.x ) / this.renderScale.x );
	var y = Math.floor( ( position.y - this.y ) / this.renderScale.y );
	return ( x >= 0 && x < this.dimension.width ) && ( y >= 0 && y < this.dimension.height );
};
Screen.prototype.hZone2 = function( position )
{
	position.x = ( position.x - this.position.x ) / this.renderScale.x;
	position.y = ( position.y - this.position.y ) / this.renderScale.y;
	return this.zone( undefined, position );
};

//////////////////////////////////////////////////////////////////////
// Colors
//////////////////////////////////////////////////////////////////////
Screen.prototype.setHalfBrightColor = function( p )
{
	if ( this.halfBrightMode )
	{
		var c = this.palette[ p ];
		var r = ( ( c & 0xF00 ) >> 1 ) & 0xF00;
		var g = ( ( c & 0x0F0 ) >> 1 ) & 0x0F0;
		var b = ( ( c & 0x00F ) >> 1 ) & 0x00F;
		this.palette[ p + 32 ] = r | g | b;
	}
};
Screen.prototype.getPalette = function( index, mask )
{
	var screen = this.aoz.getScreen( index );
	var b = 1;
	for ( var c = 0; c < screen.palette.length; c++ )
	{
		if ( typeof mask != 'undefined' )
		{
			if ( ( mask & b ) != 0 )
			{
				this.palette[ c ] = screen.palette[ c ];
			}
			b = b << 1;
		}
		else
		{
			this.palette[ c ] = screen.palette[ c ];
		}
	}
};
Screen.prototype.setPalette = function( palette, tags )
{
	var remap = true;
	if ( tags && this.utilities.getTag( tags, [ 'noremap' ] ) )
		remap = false;
	var oldPalette = this.utilities.copyArray( this.palette )
	for ( var p = 0; p < palette.length; p++ )
	{
		if ( typeof palette[ p ] != 'undefined' )
		{
			if ( typeof palette[ p ] == 'string' )
				this.palette[ p ] = palette[ p ];
			else
				this.palette[ p ] = this.utilities.getModernColorString( palette[ p ], this.aoz.manifest.compilation.useShortColors );
			if ( this.halfBrightMode && p < 32 )
				this.setHalfBrightColor( p );
		}
	}
	if ( remap )
	{
		var sourceColors = [];
		var destinationColors = [];
		for ( var c = 0; c < this.palette.length; c++ )
		{
			if ( oldPalette[ c ] != this.palette[ c ] )
			{
				sourceColors.push( this.utilities.getRGBAStringColors( oldPalette[ c ] ) );
				destinationColors.push( this.utilities.getRGBAStringColors( this.palette[ c ] ) );
			}
		}
		if ( sourceColors.length != 0 )
		{
			var zone = this.utilities.getZone( {}, this.dimension, this.scale )
			this.startDrawing();
			this.utilities.remapBlock( this.context, sourceColors, destinationColors, zone );
			this.endDrawing();
		}
	}
};
Screen.prototype.setColour = function( number, color )
{
	if ( this.aoz.manifest.compilation.usePalette )
	{
		if ( number < 0 )
			throw 'illegal_function_call';
		number = number % this.numberOfColors;
		this.palette[ number ] = this.utilities.getModernColorString( color, this.aoz.manifest.compilation.useShortColors );
		if ( this.halfBrightMode && p < 32 )
			this.setHalfBrightColor( p );
	}
};
Screen.prototype.getColour = function( number )
{
	if ( !this.aoz.manifest.compilation.usePalette )
		throw 'function_not_available_in_true_color_mode';
	if ( number < 0 )
		throw 'illegal_function_call';

	number = number % this.numberOfColors;
	var color = this.palette[ number ];
	if ( this.aoz.manifest.compilation.useShortColors )
		return parseInt( '0x' + color.substr( 1, 1 ) + color.substr( 3, 1 ) + color.substr( 5, 1 ) );
	return parseInt( '0x' + color.substr( 1, 2 ) + color.substr( 3, 2 ) + color.substr( 5, 2 ) );
};
Screen.prototype.getColorAlpha = function( color )
{
	if ( this.aoz.manifest.compilation.usePalette )
		return this.alphas[ color % this.numberOfColors ];

	color = this.getColorString( color );
	return typeof this.alphas[ color ] == 'undefined' ? 1.0 : this.alphas[ color ];
};
Screen.prototype.getColorString = function( color )
{
	// True color?
	if ( !this.aoz.manifest.compilation.usePalette )
	{
		if ( typeof color == 'number' )
			color = color.toString( 16 );
		if ( color.charAt( 0 ) == '#' )
			color = color.substring( 1 );
		while ( color.length < 6 )
			color = '0' + color;
		return ( '#' + color ).toUpperCase();
	}

	// Palette index...
	color = color % this.numberOfColors;
	if ( this.dualPlayfieldBack )
		color += 8;
	return this.palette[ color ];
};
Screen.prototype.setTransparent = function( colors, trueFalse )
{
	var sourceColors = [];
	var destinationColors = [];
	var alphas = [];
	for ( var c = 0; c < colors.length; c++ )
	{
		sourceColors[ c ] = this.aoz.utilities.getRGBAStringColors( this.palette[ c ] );
		if ( trueFalse )
		{
			alphas[ c ] = 0;
			destinationColors[ c ] = sourceColors[ c ];
			destinationColors[ c ].a = 0;
		}
		else
		{
			alphas[ c ] = 0;
			destinationColors[ c ] = sourceColors[ c ];
			destinationColors[ c ].a = 255;
		}
	}
	this.setColorAlpha( colors, alphas );
	this.utilities.remapBlock( this.context, sourceColors, destinationColors, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height } );
};
Screen.prototype.setColorAlpha = function( colors, alphas )
{
	if ( this.aoz.manifest.compilation.usePalette )
	{
		for ( var c = 0; c < colors.length; c++ )
		{
			if ( colors[ c ] < 0 || alphas[ c ] < 0 || alphas[ c ] > 1 )
				throw 'illegal_function_call';
			this.alphas[ colors[ c ] % this.numberOfColors ] = alphas[ c ];
		}
	}
	else
	{
		for ( var c = 0; c < colors.length; c++ )
		{
			var color = this.getColorString( colors[ c ] );
			if ( alphas[ c ] < 0 || alphas[ c ] > 1 )
				throw 'illegal_function_call';
			this.alphas[ color ] = alphas[ c ];
		}
	}
};
Screen.prototype.isTransparentColor = function( color )
{
	if ( this.aoz.manifest.compilation.usePalette )
	{
		if ( color < 0 )
			throw 'illegal_function_call';
		return this.alphas[ color % this.numberOfColors ] == 0;
	}
	color = this.getModernColorString( color, false );
	if ( typeof this.alphas[ color ] != 'undefined' && typeof this.alphas[ color ] > 0 )
		return false;
	return true;
};
Screen.prototype.remap = function( colorsSource, colorsDestination, rectangle )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale )

	// Check colors
	var rgbaSource = [], rgbaDestination = [];
	for ( var c = 0; c < colorsSource.length; c++ )
	{
		var a = ( Math.floor( this.getColorAlpha( colorsSource[ c ] ) * 255 ) ).toString( 16 );
		a += a.length < 2 ? ' ' : '';
		rgbaSource.push( this.utilities.getRGBAStringColors( this.getColorString( colorsSource[ c ] ) + a ) );
		if ( this.dualPlayfieldBack && colorsSource[ c ] == 0 )
		{
			rgbaDestination.push( this.utilities.getRGBAStringColors( '#00000000' ) );
		}
		else
		{
			a = ( Math.floor( this.getColorAlpha( colorsDestination[ c ] ) * 255 ) ).toString( 16 );
			a += a.length < 2 ? ' ' : '';
			rgbaDestination.push( this.utilities.getRGBAStringColors( this.getColorString( colorsSource[ c ] ) + a ) );
		}
	}
	this.startDrawing();
	this.utilities.remapBlock( this.context, rgbaSource, rgbaDestination, zone );
	this.endDrawing();
};
Screen.prototype.findColorIndex = function( r, g, b )
{
	for ( var p = 0; p < this.palette.length; p++ )
	{
		var rgb = this.utilities.getRGBAStringColors( this.palette[ p ] );
		if ( rgb.r == r && rgb.g == g && rgb.b == b )
		{
			return p;
		}
	}
	return -1;
};

//////////////////////////////////////////////////////////////////////
// Block transfer
//////////////////////////////////////////////////////////////////////
Screen.prototype.cls = function( color, rectangle )
{
	color = typeof color == 'undefined' ? 0 : color;
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	this.startDrawing();
	if ( this.isTransparentColor( color ) )
	{
		this.context.clearRect( zone.x, zone.y, zone.width, zone.height );
	}
	else
	{
		this.context.globalAlpha = this.getColorAlpha( color );
		this.context.fillStyle = this.getColorString( color );
		this.context.fillRect( zone.x, zone.y, zone.width, zone.height );
	}
	this.currentTextWindow.home();
	this.endDrawing();
};
Screen.prototype.pasteCanvas = function( canvas, rectangle )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	this.startDrawing();
	this.context.imageSmoothingEnabled= false;
	this.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, zone.x, zone.y, zone.width, zone.height );

	/*
	if ( angleZ == 0 )
		this.context.drawImage( canvas, x * scaleX, y * scaleY, canvas.width * scaleX, canvas.height * scaleY );
	else
	{
		this.context.save();
		this.context.translate( x, y );
		this.context.rotate( -angleZ );
		this.context.scale( Math.max( 0.001, scaleX ), Math.max( 0.001, scaleY ) );
		this.context.translate( -image.hotSpotX, -image.hotSpotY );
		this.context.drawImage( image.canvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height );
		this.context.restore();
	}
	*/
	this.endDrawing();
};
Screen.prototype.pasteImage = function( number, position, scale, angle, tags, contextName )
{
	var x = typeof position.x != 'undefined' ? position.x * this.scale.x : 0.0;
	var y = typeof position.y != 'undefined' ? position.y * this.scale.y : 0.0;
	var scaleX = this.scale.x;
	var scaleY = this.scale.y;
	if ( scale )
	{
		scaleX *= typeof scale.x != 'undefined' ? scale.x : 1.0;
		scaleY *= typeof scale.y != 'undefined' ? scale.y : scaleX;
	}
	var angleZ = !isNaN( angle ) ? angle : 0;

	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var image = this.banks.getImage( number, contextName );
	if ( image )
	{
		var canvas = image.getCanvas();

		this.startDrawing();
		this.context.imageSmoothingEnabled= false;

		if ( angleZ == 0 )
			this.context.drawImage( canvas, x - image.hotSpotX * scaleX, y - image.hotSpotY * scaleY, image.width * scaleX, image.height * scaleY );
		else
		{
			this.context.save();
			this.context.translate( x, y );
			this.context.rotate( -angleZ );
			this.context.scale( Math.max( 0.001, scaleX ), Math.max( 0.001, scaleY ) );
			this.context.translate( -image.hotSpotX, -image.hotSpotY );
			this.context.drawImage( canvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height );
			this.context.restore();
		}
		this.endDrawing();
	}
};
Screen.prototype.screenCopy = function( destination, mode, rectangleSource, rectangleDestination )
{
	destination.startDrawing();
	if ( typeof rectangleSource == 'undefined' && typeof rectangleDestination == 'undefined' )
	{
		destination.context.imageSmoothingEnabled= false;
		destination.context.drawImage( this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, destination.canvas.width, destination.canvas.height );
	}
	else
	{
		rectangleDestination.width = typeof rectangleDestination.width == 'undefined' ? rectangleSource.width : rectangleDestination.width;
		rectangleDestination.height = typeof rectangleDestination.height == 'undefined' ? rectangleSource.height : rectangleDestination.height;
		var szone = this.utilities.getZone( rectangleSource, this.dimension, this.scale );
		var dzone = this.utilities.getZone( rectangleDestination, destination.dimension, destination.scale );

		this.context.imageSmoothingEnabled= false;
		destination.context.imageSmoothingEnabled= false;
		destination.context.drawImage( this.canvas, szone.x, szone.y, szone.width, szone.height, dzone.x, dzone.y, dzone.width, dzone.height );
	}
	destination.endDrawing();
};
Screen.prototype.screenProject = function( destination, x1, y1, x2, y2, dx1, dy1, dx2, dy2, dx3, dy3, dx4, dy4 )
{
	this.startDrawing();
	this.context.scale( 1 / this.scale.x, 1 / this.scale.y );
	if ( this != destination )
	{
		destination.startDrawing();
		destination.context.scale( 1 / destination.scale.x, 1 / destination.scale.y );
	}
	x1 = typeof x1 == 'undefined' ? 0 : x1 * this.scaleX;
	y1 = typeof y1 == 'undefined' ? 0 : y1 * this.scaleY;
	x2 = typeof x2 == 'undefined' ? this.width * this.scaleX: x2 * this.scaleX;
	y2 = typeof y2 == 'undefined' ? this.height * this.scaleY : y2 * this.scaleY;
	dx1 = typeof dx1 == 'undefined' ? 0 : dx1 * destination.scaleX;
	dy1 = typeof dy1 == 'undefined' ? 0 : dy1 * destination.scaleY;
	dx2 = typeof dx2 == 'undefined' ? destination.width * destination.scaleX : dx2 * destination.scaleX;
	dy2 = typeof dy2 == 'undefined' ? 0 : dy2 * destination.scaleY;
	dx3 = typeof dx3 == 'undefined' ? destination.width * destination.scaleX : dx3 * destination.scaleX;
	dy3 = typeof dy3 == 'undefined' ? destination.height * destination.scaleY : dy3 * destination.scaleY;
	dx4 = typeof dx4 == 'undefined' ? 0 : dx4 * destination.scaleX;
	dy4 = typeof dy4 == 'undefined' ? destination.height * destination.scaleY : dy4 * destination.scaleY;

	var deltaDX1 = dx4 - dx1;
	var deltaDY1 = dy4 - dy1;
	var deltaDX2 = dx3 - dx2;
	var deltaDY2 = dy3 - dy2;
	var canvasLine = document.createElement( 'canvas' );
	canvasLine.width = x2 - x1;
	canvasLine.height = this.scaleY;
	var contextLine = canvasLine.getContext( '2d' );
	contextLine.imageSmoothingEnabled= false;

	var canvas = document.createElement( 'canvas' );
	canvas.width = this.dimension.width * this.scale.x;
	canvas.height = this.dimension.height * this.scale.y;
	var context = canvas.getContext( '2d' );
	context.drawImage( this.canvas, 0, 0 );

	destination.context.imageSmoothingEnabled= false;

	for ( var yy1 = y1; yy1 < y2; yy1 += this.scaleY )
	{
		contextLine.drawImage( canvas, x1, yy1, x2 - x1, this.scaleY, 0, 0, x2 - x1, this.scaleY );

		// Do copy
		var done = ( yy1 - y1 ) / ( y2 - y1 );
		var dXX1 = dx1 + deltaDX1 * done;
		var dYY1 = dy1 + deltaDY1 * done;
		var dXX2 = dx2 + deltaDX2 * done;
		var dYY2 = dy2 + deltaDY2 * done;

		var dx = dXX2 - dXX1;
		var dy = dYY2 - dYY1;
		var angle = Math.atan2( dy, dx );
		var distance = Math.hypot( dx, dy );
		destination.context.save();
		destination.context.translate( dXX1, dYY1 );
		destination.context.rotate( angle );
		destination.context.drawImage( canvasLine, 0, 0, x2 - x1, this.scale.y, 0, 0, distance, destination.scale.y * ( destination.scale.y / this.scale.y ) );
		destination.context.restore();
	}

	this.context.scale( this.scale.x, this.scale.y );
	if ( this != destination )
	{
		destination.context.scale( destination.scale.x, destination.scale.y );
		destination.endDrawing();
	}
	this.endDrawing();
};
Screen.prototype.defScroll = function( number, rectangle, displacement )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	if ( !this.aoz.manifest.compilation.unlimitedScreens && number > 16 )
		throw 'illegal_function_call';
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );
	this.scrolls[ number ] =
	{
		zone: zone,
		dx: displacement.x * this.scale.x,
		dy: displacement.y * this.scale.y
	}
};
Screen.prototype.scroll = function( number )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	if ( !this.aoz.manifest.compilation.unlimitedScreen && number > 16 )
		throw 'illegal_function_call';
	if ( !this.scrolls[ number ] )
		throw 'scrolling_not_defined';
	var scroll = this.scrolls[ number ];
	this.startDrawing();
	this.context.imageSmoothingEnabled= false;
	if ( this.dualPlayfieldFront )
	{
		var canvas = document.createElement( 'canvas' );
		canvas.width = scroll.zone.width;
		canvas.height = scroll.zone.height;
		var context = canvas.getContext( '2d' );
		context.imageSmoothingEnabled= false;
		context.drawImage( this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, 0, 0, scroll.zone.width, scroll.zone.height );
		this.context.clearRect( scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height );
		this.context.drawImage( canvas, 0, 0, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height );
	}
	else
	{
		this.context.drawImage( this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height );
	}
	this.endDrawing();
};



//////////////////////////////////////////////////////////////////////
// Drawing
//////////////////////////////////////////////////////////////////////
Screen.prototype.setLine = function( pattern )
{
	this.linePattern = [];
	if ( pattern == 0 )
		return;
	var b = 0x8000;
	var on = true;
	var previousCount = 0;
	var delta = 1 * this.scale.x;
	for ( var count = 0; count < 16; count++ )
	{
		if ( ( pattern & b ) == 0 && on )
		{
			this.linePattern.push( ( count - previousCount ) * delta );
			previousCount = count;
			on = false;
		}
		else if ( ( pattern & b ) != 0 && !on )
		{
			this.linePattern.push( ( count - previousCount ) * delta );
			previousCount = count;
			on = true;
		}
		b = b >> 1;
	}
};
Screen.prototype.setInk = function( color, pattern, border )
{
	this.ink = Math.abs( color ) % this.numberOfColors;
	if ( typeof pattern != 'undefined' )
	{
		if ( pattern > 34 )
			throw 'illegal_function_call';
		this.pattern = pattern;
	}
	if ( typeof border != 'undefined' )
	{
		this.border = Math.abs( border ) % this.numberOfColors;
	}
};
Screen.prototype.setPattern = function( pattern )
{
	if ( pattern < 0 )
		throw 'not_implemented';
	if ( pattern > 34 )
		throw 'illegal_function_call';
	this.pattern = pattern;
};
Screen.prototype.setPaint = function( onOff )
{
	this.paint = onOff;
};
Screen.prototype.setWriting = function( style )
{
	this.onlyInk = !( ( style & 0x01 ) != 0 );
	this.xor = ( style & 0x02 ) != 0;
	this.inverseInks = ( style & 0x04 ) != 0;
};
Screen.prototype.getInk = function()
{
	return this.ink;	//this.inverseInks ? this.paper : this.ink;
};
Screen.prototype.getCompositeOperation = function()
{
	return this.xor ? 'difference' : 'source-over';
};
Screen.prototype.plot = function( position, color )
{
	var color = typeof color != 'undefined' ? color : this.getInk();
	position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y

	if ( !this.isTransparentColor( color ) )
	{
		this.startDrawing();
		//if ( !this.xor )
		{
			this.context.fillStyle = this.getColorString( color );
			this.context.globalAlpha = this.getColorAlpha( color );
			this.context.globalCompositeOperation = this.getCompositeOperation();
			this.context.fillRect( position.x * this.scale.x, position.y * this.scale.y, this.scale.x, this.scale.y );
		}
		/*
		else
		{
			var colors = this.utilities.getRGBAStringColors( this.getColorString( color ) );
			var pixel = this.context.getImageData( position.x * this.scale.x, position.y * this.scale.y, this.scale.x, this.scale.y );
			for ( var y = 0; y < this.scale.y; y++ )
			{
				for ( var x = 0; x < this.scale.x; x++ )
				{
					var address = ( y * this.scale.x + x ) * 4;
					pixel.data[ address + 0 ] = pixel.data[ address + 0 ] ^ colors.r;
					pixel.data[ address + 1 ] = pixel.data[ address + 1 ] ^ colors.g;
					pixel.data[ address + 2 ] = pixel.data[ address + 2 ] ^ colors.b;
				}
			}
			this.context.putImageData( pixel, position.x * this.scale.x, position.y * this.scale.y );
		}
		*/
		this.endDrawing();
	}
	this.grPosition = position;
};
Screen.prototype.draw = function( rectangle )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	if ( typeof rectangle.width == 'undefined' || typeof rectangle.height == 'undefined' )
		throw 'syntax_error';
	this.context.strokeStyle = this.getColorString( this.getInk() );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );
	this.context.lineWidth = ( this.scale.x + this.scale.y ) / 1.5;
	this.startDrawing()
	this.context.beginPath();
	this.context.moveTo( rectangle.x * this.scale.x, rectangle.y * this.scale.y );
	this.context.lineTo( ( rectangle.x + rectangle.width ) * this.scale.x, ( rectangle.y + rectangle.height ) * this.scale.y );
	this.context.stroke();
	this.endDrawing();

	this.grPosition.x = rectangle.x + rectangle.width;
	this.grPosition.y = rectangle.y + rectangle.height;
};
Screen.prototype.drawTo = function( position )
{
	position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;

	this.startDrawing();
	this.context.strokeStyle = this.getColorString( this.getInk() );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );
	this.context.lineWidth =  ( this.scale.x + this.scale.y ) / 1.5;
	this.context.beginPath();
	this.context.moveTo( this.grPosition.x * this.scale.x, this.grPosition.y * this.scale.y );
	this.context.lineTo( position.x * this.scale.x, position.y * this.scale.y );
	this.context.stroke();
	this.endDrawing();

	this.grPosition = position;
};
Screen.prototype.grLocate = function( position )
{
	this.grPosition.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	this.grPosition.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
};
Screen.prototype.point = function( position )
{
	position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	if ( position.x < 0 || position.x > this.dimension.width || position.y < 0 || position.y > this.dimension.height )
		return -1;
	var pixel = this.context.getImageData( position.x * this.scale.x, position.y * this.scale.y, 1, 1 );
	if ( this.aoz.manifest.compilation.usePalette )
		return this.findColorIndex( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ] );
	return this.utilities.getRGBAString( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ], pixel.data[ 3 ] );
};
Screen.prototype.box = function( rectangle )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	this.startDrawing();
	this.context.strokeStyle = this.getColorString( this.getInk() );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );
	this.context.lineWidth =  ( this.scale.x + this.scale.y ) / 1.5;
	this.context.strokeRect( zone.x, zone.y, zone.width, zone.height );
	this.endDrawing();

	this.grPosition.x = rectangle.x + rectangle.width;
	this.grPosition.y = rectangle.y + rectangle.height;
};
Screen.prototype.bar = function( rectangle )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	this.startDrawing();
	if ( this.pattern == 0 )
		this.context.fillStyle = this.getColorString( this.getInk() );
	else
		this.context.fillStyle = this.createPattern( this.pattern );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.fillRect( zone.x, zone.y, zone.width, zone.height );
	if ( this.paint )
	{
		this.context.strokeStyle = this.getColorString( this.border );
		this.context.globalAlpha = this.getColorAlpha( this.border );
		this.context.setLineDash( this.linePattern );
		this.context.lineWidth =  ( this.scale.x + this.scale.y ) / 1.5;
		this.context.strokeRect( zone.x, zone.y, zone.width, zone.height );
	}
	this.endDrawing();

	this.grPosition.x = rectangle.x + rectangle.width;
	this.grPosition.y = rectangle.y + rectangle.height;
};
Screen.prototype.circle = function( rectangle, angle1, angle2 )
{
	rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
	rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : rectangle.width;
	this.ellipse( rectangle, angle1, angle2 );
};
Screen.prototype.ellipse = function( rectangle, angle1, angle2, rotation )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );
	if ( this.pixelMode.indexOf( 'hires' ) >= 0 )
		zone.width *= 2;
	angle1 = isNaN( angle1 ) ? 0 : angle1;
	angle2 = isNaN( angle2 ) ? 2 * Math.PI : angle2;
	rotation = typeof rotation == 'undefined' ? 0 : rotation;
	this.startDrawing();
	this.context.strokeStyle = this.getColorString( this.getInk() );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );
	this.context.lineWidth = this.scale;
	this.context.beginPath();
	this.context.ellipse( zone.x, zone.y, zone.width, zone.height, rotation, angle1,  angle2 );
	this.context.stroke();
	this.endDrawing();

	this.grPosition.x = rectangle.x;
	this.grPosition.y = rectangle.y;
};
Screen.prototype.polyline = function( coords )
{	
	var x = typeof coords[ 0 ] != 'undefined' ? coords[ 0 ] : this.grPosition.x;
	var y = typeof coords[ 1 ] != 'undefined' ? coords[ 1 ] : this.grPosition.y;

	this.startDrawing();
	this.context.strokeStyle = this.getColorString( this.getInk() );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );
	this.context.lineWidth =  ( this.scale.x + this.scale.y ) / 1.5;;
	this.context.beginPath();
	this.context.moveTo( x * this.scale.x, y * this.scale.y );
	for ( var c = 2; c < coords.length; c += 2 )
	{
		x = typeof coords[ c ] != 'undefined' ? coords[ c ] : x;
		y = typeof coords[ c + 1 ] != 'undefined' ? coords[ c + 1 ] : y;
		this.context.lineTo( x * this.scale.x, y * this.scale.y );
	}
	this.context.stroke();
	this.endDrawing();

	this.grPosition.x = x;
	this.grPosition.y = y;
};
Screen.prototype.polygon = function( coords )
{
	var x = typeof coords[ 0 ] != 'undefined' ? coords[ 0 ] : this.grPosition.x;
	var y = typeof coords[ 1 ] != 'undefined' ? coords[ 1 ] : this.grPosition.y;

	this.startDrawing();
	if ( this.pattern == 0 )
		this.context.fillStyle = this.getColorString( this.getInk() );
	else
		this.context.fillStyle = this.createPattern( this.pattern );
	this.context.globalAlpha = this.getColorAlpha( this.getInk() );
	this.context.globalCompositeOperation = this.getCompositeOperation();
	this.context.setLineDash( this.linePattern );

	this.context.beginPath();
	this.context.moveTo( x * this.scale.x, y * this.scale.y );
	for ( var c = 2; c < coords.length; c += 2 )
	{
		x = typeof coords[ c ] != 'undefined' ? coords[ c ] : x;
		y = typeof coords[ c + 1 ] != 'undefined' ? coords[ c + 1 ] : y;
		this.context.lineTo( x * this.scale.x, y * this.scale.y );
	}
	this.context.closePath();
	this.context.fill();

	//if ( this.paint )
	{
		this.context.strokeStyle = this.getColorString( this.border );
		this.context.globalAlpha = this.getColorAlpha( this.border );
		this.context.lineWidth =  ( this.scale.x + this.scale.y ) / 1.5;;
		this.context.stroke();
	}
	this.endDrawing();

	this.grPosition.x = x;
	this.grPosition.y = y;
};
Screen.prototype.createPattern = function( pattern )
{
	// Create a little canvas
	var canvas = document.createElement( 'canvas' );
	canvas.width = 8 * this.scale.x;
	canvas.height = 8 * this.scale.y;
	var context = canvas.getContext( '2d' );

	var imageData = context.getImageData( 0, 0, canvas.width, canvas.height  );
	var colorInk = this.utilities.getRGBAStringColors( this.getColorString( this.getInk() ) );
	var alpha = this.getColorAlpha( this.getInk() );
	var source = Patterns[ pattern ];
	for ( var y = 0; y < 8; y++ )
	{
		for ( yy = 0; yy < this.scale.y; yy++ )
		{
			for ( var x = 0; x < 8; x++ )
			{
				var mask = 0x80 >> x;
				for ( xx = 0; xx < this.scale.x; xx++ )
				{
					if ( ( source[ y ] & mask ) == 0 )
					{
						var offset = ( y * this.scale.y + yy ) * 32 * this.scale.x + ( x * this.scale.x + xx ) * 4;
						imageData.data[ offset ] = colorInk.r;
						imageData.data[ offset + 1 ] = colorInk.g;
						imageData.data[ offset + 2 ] = colorInk.b;
						imageData.data[ offset + 3 ] = alpha * 255;
					}
				}
			}
		}
	}
	context.putImageData( imageData, 0, 0 );

	// Create the pattern
	return this.context.createPattern( canvas, 'repeat' );
}
Patterns =
[
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],         //  0
	[ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  1
	[ 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA ],         //  2
	[ 0xFF, 0xFF, 0xEF, 0xD7, 0xFF, 0xFF, 0xFE, 0x7D ],         //  3
	[ 0xFD, 0xFD, 0x55, 0xAF, 0xDF, 0xDF, 0x55, 0xFA ],         //  4
	[ 0xBF, 0x7F, 0xFF, 0xF7, 0xFB, 0xFD, 0xFF, 0xDF ],         //  5
	[ 0x99, 0x39, 0x27, 0xE7, 0x7E, 0x72, 0xF3, 0x9F ],         //  6
	[ 0xFF, 0xFF, 0xFB, 0xFF, 0xFF, 0xFF, 0x7F, 0xFF ],         //  7
	[ 0x07, 0x93, 0x39, 0x70, 0xE0, 0xC9, 0x9C, 0x0E ],         //  8
	[ 0xDE, 0xC0, 0xF3, 0x7B, 0x01, 0xFA, 0xF9, 0xFD ],         //  9
	[ 0xF7, 0xFF, 0x55, 0xFF, 0xF7, 0xFF, 0x77, 0xFF ],         //  10
	[ 0x88, 0x67, 0x07, 0x07, 0x88, 0x76, 0x70, 0x70 ],         //  11
	[ 0x7F, 0x7F, 0xBE, 0xC1, 0xF7, 0xF7, 0xEB, 0x1C ],         //  12
	[ 0x7E, 0xBD, 0xDB, 0xE7, 0xF9, 0xFE, 0x7F, 0x7F ],         //  13
	[ 0x0F, 0x0F, 0x0F, 0x0F, 0xF0, 0xF0, 0xF0, 0xF0 ],         //  14
	[ 0xF7, 0xE3, 0xC1, 0x80, 0x00, 0x80, 0xC1, 0xE3 ],         //  15
	[ 0xEE, 0xDD, 0xBB, 0x00, 0x77, 0xBB, 0xDD, 0x00 ],         //  16
	[ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  17
	[ 0xBD, 0x7E, 0x7E, 0xBD, 0xDB, 0xE7, 0xE7, 0xDB ],         //  18
	[ 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  19
	[ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  20
	[ 0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  21
	[ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  22
	[ 0xFC, 0xF8, 0xF1, 0xE3, 0xC7, 0x8F, 0x1F, 0x3F ],         //  23
	[ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  24
	[ 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  25
	[ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  26
	[ 0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  27
	[ 0xFF, 0xBB, 0xFF, 0xEE, 0xFF, 0xBB, 0xFF, 0xEE ],         //  28
	[ 0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA ],         //  29
	[ 0x77, 0xAA, 0xDD, 0xAA, 0x77, 0xAA, 0xDD, 0xAA ],         //  30
	[ 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA ],         //  31
	[ 0x55, 0x22, 0x55, 0x88, 0x55, 0x22, 0x55, 0x88 ],         //  32
	[ 0x55, 0x00, 0x55, 0x00, 0x55, 0x00, 0x55, 0x00 ],         //  33
	[ 0x11, 0x00, 0x44, 0x00, 0x11, 0x00, 0x44, 0x00 ]          //  34
]


//////////////////////////////////////////////////////////////////////
// Bobs
//////////////////////////////////////////////////////////////////////
Screen.prototype.getBobFromIndex = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getElement( contextName, index );
};
Screen.prototype.getNumberOfBobs = function()
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getNumberOfElements( contextName );
};
Screen.prototype.bob = function( index, position, image, tags, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bob = this.bobsContext.getElement( contextName, index );
	if ( !bob )
	{
		bob = new Bob( this.aoz, this, tags );
		this.bobsContext.setElement( contextName, bob, index );
	}
	bob.set( position, image, tags );
	this.setModified();
	this.bobsToUpdate = true;
};
Screen.prototype.bobOff = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	if ( typeof index == 'undefined' )
	{
		this.bobsContext.deleteRange( contextName );
	}
	else
	{
		this.bobsContext.deleteElement( contextName, index, 'bob_not_defined' );
		this.bobsToUpdate = true;
		this.setModified();
	}
};
Screen.prototype.bobDestroy = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.bobsContext.deleteElement( contextName, index );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.bobsUpdate = function( force )
{
	var contextName = this.aoz.currentContextName;
	if ( force || ( this.bobsUpdateOn && this.bobsToUpdate ) )
	{
		this.bobsToUpdate = false;

		var done = false;
		for ( var bob = this.bobsContext.getFirstElement( contextName ); bob != null; bob = this.bobsContext.getNextElement( contextName ) )
			done |= bob.update( { force: force } );
		if ( done )
		{
			this.sortBobsPriority();
			this.setModified();
		}
	}
};
Screen.prototype.setBobsUpdate = function( yes_no )
{
	this.bobsUpdateOn = yes_no;
};
Screen.prototype.xBob = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getElement( contextName, index, 'bob_not_defined' ).position.x;
};
Screen.prototype.yBob = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getElement( contextName, index, 'bob_not_defined' ).position.y;
};
Screen.prototype.iBob = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getElement( contextName, index, 'bob_not_defined' ).image;
};
Screen.prototype.isBob = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.bobsContext.getElement( contextName, index ) != null;
};
Screen.prototype.getBobPalette = function( mask, contextName )
{
	var self = this;
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var palette = this.banks.getImagePalette( contextName );
	for ( var p = 0; p < Math.min( this.numberOfColors, palette.length ); p++ )
	{
		if ( typeof palette[ p ] != 'undefined' )
		{
			if ( typeof mask == 'undefined' )
				pokeColor( p, palette[ p ] );
			else if ( ( p & mask ) != 0 )
				pokeColor( p, palette[ p ] );
		}
	}
	function pokeColor( number, color )
	{
		self.palette[ number ] = color;
		if ( number < 16 && self.numberOfColors <= 16 )
			self.palette[ number + 16 ] = color;
	}
};
Screen.prototype.limitBob = function( index, rectangle, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	if ( typeof index != 'undefined' )
	{
		var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
		bob.setLimits( rectangle );
	}
	else
	{
		this.bobsContext.parseAll( this.aoz.currentContextName, function( bob )
		{
			bob.setLimits( rectangle );
		} );
	}
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.bobScale = function( index, scale, tags, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bob = this.bobsContext.getElement( contextName, index, 'bob_not_defined' );
	bob.setScale( scale, tags );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.bobSkew = function( index, skew, tags, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bob = this.bobsContext.getElement( contextName, index, 'bob_not_defined' );
	bob.setSkew( skew, tags );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.bobRotate = function( index, angle, tags, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bob = this.bobsContext.getElement( contextName, index, 'bob_not_defined' );
	bob.setAngle( { x:0, y: 0, z: angle }, tags );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.bobShow = function( show_hide, index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.bobsContext.setProperty( contextName, index, 'hidden', !show_hide, 'bob_not_defined' );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.limitBobOff = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.bobsContext.setProperty( contextName, index, 'limits', null, 'bob_not_defined' );
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.setBobsPriority = function( on_off, contextName )
{
	this.bobsPriorityOn = on_off;
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.setBobsPriorityReverse = function( on_off, contextName )
{
	this.bobsPriorityReverseOn  = on_off;
	this.bobsToUpdate = true;
	this.setModified();
};
Screen.prototype.sortBobsPriority = function( contextName )
{
	if ( this.bobsPriorityOn )
	{
		if ( this.bobsPriorityReverseOn )
		{
			this.bobsContext.sort( undefined, function( b1, b2 )
			{
				if ( b1.y == b2.y )
					return 0;
				return ( b1.y > b2.y ) ? -1 : 1;
			} );
		}
		else
		{
			this.bobsContext.sort( undefined, function( b1, b2 )
			{
				if ( b1.y == b2.y )
					return 0;
				return ( b1.y < b2.y ) ? -1 : 1;
			} );
		}
	}
};
Screen.prototype.getBob = function( index, rectangle, tags, contextName )
{
	var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	var canvas = document.createElement( 'canvas' );
	canvas.width = rectangle.width;
	canvas.height = rectangle.height;
	var context = canvas.getContext( '2d' );
	context.imageSmoothingEnabled= false;
	this.startDrawing();
	context.drawImage( this.canvas, zone.x, zone.y, zone.width, zone.height, 0, 0, canvas.width, canvas.height );
	this.endDrawing();

	this.utilities.remapBlock( context, [ { r: 0, g: 0, b: 0, a: 255 } ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );

	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.banks.insertImage( index, undefined, tags, contextName, undefined, canvas );
};
Screen.prototype.putBob = function( index, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bob = this.bobsContext.getElement( contextName, index, 'bob_not_defined' );
	this.pasteImage( bob.image, bob.position, bob.scale, bob.angle );
};
Screen.prototype.pasteBob = function( number, x, y, scaleX, scaleY, angle, tags, contextName )
{
	x = typeof x != 'undefined' ? x : 0.0;
	y = typeof y != 'undefined' ? y : 0.0;
	scaleX = scaleX ? scaleX : 1.0;
	scaleY = scaleY ? scaleY : scaleX;
	angle = !isNaN( angle ) ? angle : 0;
	this.pasteImage( number, { x: x, y: y }, { x: scaleX, y: scaleY }, angle, tags, contextName );
};

//////////////////////////////////////////////////////////////////////
// Windows
//////////////////////////////////////////////////////////////////////
Screen.prototype.setWindow = function( number )
{
	if ( number < 0 )
		throw 'illegal_text_window_parameter';
	if ( !this.windows[ number ] )
		throw 'text_window_not_opened';

	if ( this.currentTextWindow.number != number )
	{
		this.currentTextWindow.deactivate();
		for ( var z = 0; z < this.windowsZ.length; z++ )
		{
			if ( this.windowsZ[ z ].number == number )
			{
				this.windowsZ.splice( z, 1 );
				break;
			}
		}
		this.currentTextWindow = this.windows[ number ];
		this.windowsZ.push( this.currentTextWindow );
		this.currentTextWindow.activate();
	}
};
Screen.prototype.windOpen = function( number, rectangle, border, tags )
{
	if ( number == 'default' )
		number = 0;
	else
	{
		if ( number <= 0 )
			throw 'illegal_text_window_parameter';
	}
	if ( !this.aoz.unlimitedWindows && number >= 16 )
		throw 'illegal_text_window_parameter';

	if ( this.windows[ number ] )
		throw 'text_window_already_opened';

	this.startDrawing();
	rectangle = typeof rectangle == 'undefined' ? {} : rectangle;
	var windowDefinition = this.utilities.copyObject( this.aoz.manifest.default.screen.window );
	if ( typeof rectangle.x != 'undefined' ) windowDefinition.x = rectangle.x;
	if ( typeof rectangle.y != 'undefined' ) windowDefinition.y = rectangle.y;
	if ( typeof rectangle.width != 'undefined' ) windowDefinition.width = rectangle.width;
	if ( typeof rectangle.height != 'undefined' ) windowDefinition.height = rectangle.height;
	if ( typeof border != 'undefined' ) windowDefinition.border = border;
	if ( this.currentTextWindow )
		this.currentTextWindow.deactivate();
	this.currentTextWindow = new TextWindow( this.aoz, this, this.contextName, windowDefinition );
	this.windows[ number ] = this.currentTextWindow;
	this.currentTextWindow.number = number;
	this.windowsZ.push( this.currentTextWindow );
	this.endDrawing( true );
};
Screen.prototype.windClose = function()
{
	if ( this.currentTextWindow == this.windows[ 0 ] )
		throw 'text_window_0_cant_be_closed';

	this.startDrawing();
	this.currentTextWindow.close();
	this.windows[ this.currentTextWindow.number ] = null;
	this.windowsZ.pop();
	for ( var z = 0; z < this.windowsZ.length; z++ )
		this.windowsZ[ z ].restore();
	this.currentTextWindow = this.windowsZ[ this.windowsZ.length - 1 ];
	this.currentTextWindow.activate( true );
	this.endDrawing();
};
Screen.prototype.restoreWindows = function()
{
	this.startDrawing();
	for ( var z = 0; z < this.windowsZ.length - 1; z++ )
	{
		this.windowsZ[ z ].restore();
	}
	this.endDrawing();
};



//////////////////////////////////////////////////////////////////////
// Blocks
//////////////////////////////////////////////////////////////////////
Screen.prototype.getBlock = function( number, rectangle, mask )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	this.aoz.blocks[ number ] = this.doGetBlock( rectangle, mask );
};
Screen.prototype.getCBlock = function( number, rectangle, mask )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	this.aoz.cBlocks[ number ] = this.doGetBlock( rectangle, mask );
};
Screen.prototype.putBlock = function( number, position, bitPlanes, bitMode )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	var block = this.aoz.blocks[ number ];
	if ( !block )
		throw 'block_not_defined';
	this.doPutBlock( block, position, bitPlanes, bitMode );
};
Screen.prototype.putCBlock = function( number, position, bitPlanes, bitMode )
{
	if ( number < 0 )
		throw 'illegal_function_call';
	var block = this.aoz.cBlocks[ number ];
	if ( !block )
		throw 'block_not_defined';
	this.doPutBlock( block, position, bitPlanes, bitMode );
};
Screen.prototype.delBlock = function( number )
{
	this.aoz.blocks = this.doDelBlock( this.aoz.blocks, number );
};
Screen.prototype.delCBlock = function( number )
{
	this.aoz.cBlocks = this.doDelBlock( this.aoz.cBlocks, number );
};
Screen.prototype.doGetBlock = function( rectangle, mask )
{
	rectangle = this.utilities.checkRectangle( rectangle, this.grPosition, this.dimension );
	var block =
	{
		rectangle: rectangle,
		alpha: 1.0,
		canvas: document.createElement( 'canvas' )
	}
	block.canvas.width = rectangle.width * this.scale.x;
	block.canvas.height = rectangle.height * this.scale.y;
	this.currentTextWindow.cursorOff();
	var context = block.canvas.getContext( '2d' );
	context.drawImage( this.canvas, rectangle.x * this.scale.x, rectangle.y * this.scale.y, block.canvas.width, block.canvas.height, 0, 0, block.canvas.width, block.canvas.height );
	this.currentTextWindow.cursorOn();

	if ( typeof mask != 'undefined' && mask != 0 )
	{
		this.utilities.remapBlock( context, [ { r: 0, g: 0, b: 0, a: 255 } ], [ { r: 0, g: 0, b: 0, b: 0 } ], { x: 0, y: 0, width: block.canvas.width, height: block.canvas.height } );
	}
	return block;
};
Screen.prototype.doSetBlockAlpha = function( block, alpha )
{
	block.alpha = alpha / 255.0;
};
Screen.prototype.doPutBlock = function( block, position, bitPlanes, bitMode )
{
	position = this.utilities.checkRectangle( position, this.grPosition );
	this.startDrawing();
	this.context.globalAlpha = block.alpha;
	this.context.drawImage( block.canvas, position.x * this.scale.x, position.y * this.scale.y );
	this.setModified();
};
Screen.prototype.doDelBlock = function( blocks, number )
{
	if ( typeof number == 'undefined' )
		return [];
	else
	{
		if ( number < 0 )
			throw 'illegal_function_call';
		if ( !blocks[ number ] )
			throw 'block_not_defined';

		var dest = [];
		for ( var b = 0; b < blocks.length; b++ )
		{
			if ( b != number )
				dest[ b ] = blocks[ b ];
		}
		return dest;
	}
};

//////////////////////////////////////////////////////////////////////
// Fonts
/////////////////////////////////////////
///////////////////////////
Screen.prototype.setFont = function( reference, height, weight, italic, stretch, callback )
{
	var self = this;
	height = typeof height != 'undefined' ? height : 16;
	this.aoz.fonts.getFont( reference, height, weight, italic, stretch, '', this.aoz.currentContextName, function( response, font, extra )
	{
		if ( response )
		{
			self.font = font;
			self.fontHeight  = height;
		}
		callback( response, font, extra );
	} );
};
Screen.prototype.textLength = function( text )
{
	if ( this.font )
		return this.aoz.fonts.getTextLength( text, this.font, this.fontHeight );
	throw 'font_not_available';
};
Screen.prototype.text = function( position, text, align )
{
	if ( !this.font )
		throw 'font_not_available';

	position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;

	var textAlign = "left";
	var textBaseLine = "alphabetic";
	var direction = "inherit";
	if ( align )
	{
		var temp;
		if ( ( temp = this.utilities.getTag( align, [ 'left', 'center', 'right', 'start', 'end' ] ) ) != '' )
			textAlign = temp;
		if ( ( temp = this.utilities.getTag( align, [ 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom' ] ) ) != '' )
			textBaseLine = temp;
		if ( ( temp = this.utilities.getTag( align, [ 'ltr', 'rtl', 'inherit' ] ) ) != '' )
			direction = temp;
	}

	var color = this.getColorString( this.ink );
	var alpha = this.getColorAlpha( this.ink );
	this.startDrawing();

	if ( this.font.fontInformation.type == 'amiga' )
	{
		this.context.imageSmoothingEnabled = true;
		// TODO: set scale X and Y
		this.aoz.fonts.drawAmigaText( this.context, this.scale.x, position.x, position.y, text, this.font, this.fontHeight, textAlign, textBaseLine, direction, color, alpha )
	}
	else if ( this.font.fontInformation.type == 'google' )
	{
		this.context.textAlign = textAlign;
		this.context.textBaseline = textBaseLine;
		this.context.direction = direction;
		this.context.fillStyle = color;
		this.context.globalAlpha = alpha;
		this.context.font = this.utilities.getFontString( this.font.fontInformation.name, this.fontHeight * this.scale.x, this.font.weight, this.font.italic );
		this.context.fillText( text, position.x * this.scale.x, position.y * this.scale.y );
	}
	this.setModified();

	this.grPosition = position;
};
Screen.prototype.textBase = function()
{
	return this.aoz.fonts.getBaseLine( this.font, this.fontHeight );
};

Screen.ScreenEmpty = function()
{
	this.emptyScreen = true;
};