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
 * Fonts!
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/03/2018
 */

function Fonts( aoz )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.miniCanvas = document.createElement( 'canvas' );
	this.miniCanvas.width = 16;
	this.miniCanvas.heigth = 16;
	this.miniContext = this.miniCanvas.getContext( '2d' );
	this.fontInformations = [];
	this.windowFonts = {};
	this.windowFontsInformations = {};

	this.getFonts(["roboto"],[],"application");
	this.setWindowFont( "IBM Plex Mono","google",53.5,"normal","normal","normal","","application");


	// Load first font on the list
	var self = this;
	this.firstFontHeight = 16;
	var reference = this.getFirstFont();
	if ( reference )
	{
		this.aoz.loadingMax++;
		this.getFont( reference, this.firstFontHeight, undefined, undefined, undefined, '', this.aoz.currentContextName, function( response, font, extra )
		{
			self.aoz.loadingCount++;
			if ( response )
				self.firstFont = font;
		} );
	}
}
Fonts.EMPTYAMIGACHAR_KERN = 2;
Fonts.EMPTYAMIGACHAR_SPACE = 2;
Fonts.EMPTYAMIGACHAR_WIDTH = 4;

Fonts.prototype.getFonts = function( googleList, amigaList, contextName )
{
	for ( var a = 0; a < googleList.length; a++ )
	{
		var fontInformation;
		var name = googleList[ a ];
		for ( var i = 0; i < this.fontInformations.length; i++ )
		{
			if ( this.fontInformations[ i ].name == name )
			{
				fontInformation = this.fontInformations[ i ];
				break;
			}
		}
		if ( !fontInformation )
		{
			fontInformation =
			{
				index: name.toLowerCase(),
				name: name,
				type: 'google',
				contextNames: {},
				fonts: {}
			};
			this.fontInformations.push( fontInformation );
		}
		fontInformation.contextNames[ contextName ] = true;
	}
	for ( var a = 0; a < amigaList.length; a++ )
	{
		var fontInformation;
		var name = amigaList[ a ];
		for ( var i = 0; i < this.fontInformations.length; i++ )
		{
			if ( this.fontInformations[ i ].name == name )
			{
				fontInformation = this.fontInformations[ i ];
				break;
			}
		}
		if ( !fontInformation )
		{
			var fontInformation =
			{
				index: name.toLowerCase(),
				name: name,
				type: 'amiga',
				contextNames: {},
				fonts: {}
			};
			this.fontInformations.push( fontInformation );
		}
		fontInformation.contextNames[ contextName ] = true;
	}
}
Fonts.prototype.setWindowFont = function( name, type, height, weight, italic, stretch, tags, contextName )
{
	var fontInformation;
	var fontID = name + '_' + type;
	for ( var count = 0; count < this.fontInformations.length; count++ )
	{
		var fontInfo = this.fontInformations[ count ];
		if ( name == fontInfo.name && type == fontInfo.type )
		{
			fontInformation = fontInfo;
			break;
		}
	}
	if ( !fontInformation )
	{
		if ( this.windowFontsInformations[ fontID ] )
			fontInformation = this.windowFontsInformations[ fontID ];
	}
	if ( !fontInformation )
	{
		fontInformation =
		{
			index: name.toLowerCase(),
			name: name,
			type: type,
			contextNames: {},
			fonts: {}
		};
		fontInformation.contextNames[ contextName ] = true;
		this.getFont( fontInformation, height, weight, italic, stretch, tags + '#setwindowfont', contextName );
	}
	else
	{
		fontInformation.contextNames[ contextName ] = true;
	}
	this.windowFontsInformations[ fontID ] = fontInformation;
};
Fonts.prototype.getFontInformation = function( reference, contextName )
{
	if ( !this.fontInformations )
		throw 'fonts_not_examined';

	var fontInformation;
	if ( this.utilities.isObject( reference ) && reference.contextNames[ contextName ] )
		fontInformation = reference;
	else if ( typeof reference == 'number' )
	{
		if ( reference < 0 )
			throw 'illegal_function_call';
		if ( this.fontInformations[ reference ] )
		{
			if ( this.fontInformations[ reference ].contextNames[ contextName ] )
				fontInformation = this.fontInformations[ reference ];
		}
	}
	else
	{
		reference = reference.toLowerCase();
		for ( var f = 0; f < this.fontInformations.length; f++ )
		{
			if ( this.fontInformations[ f ].index == reference )
			{
				if ( this.fontInformations[ f ].contextNames[ contextName ] )
				{
					fontInformation = this.fontInformations[ f ];
					break;
				}
			}
		}
	}
	if ( !fontInformation )
		throw 'font_not_available';
	return fontInformation;
};
Fonts.prototype.getAmigaFontDefinition = function( font )
{
	var result = {};
	result.definition = AmigaFonts[ font.fontInformation.index ];
	result.characters = AmigaCharacters[ font.fontInformation.index ];
	if ( !result.definition || !result.characters )
		throw 'font_not_defined';
	result.heightDefinition = result.definition[font.baseHeight ];
	result.characterSet = result.characters[ font.baseHeight ];
	return result;
};
Fonts.prototype.getFirstFont = function()
{
	for ( var reference in this.fontInformations )
	{
		if ( this.fontInformations[ reference ].contextNames[ this.aoz.currentContextName ] )
			return this.fontInformations[ reference ];
	}
	return null;	
};
Fonts.prototype.getFont = function( reference, height, weight, italic, stretch, tags, contextName, callback, extra )
{
	var fontInformation = this.getFontInformation( reference, contextName );
	var self = this;
	this.loadFont( fontInformation, weight, italic, stretch, function( response, font, extra )
	{
		if ( response )
		{
			if ( !font.baseLines[ height ] )
			{
				if ( font.fontInformation.type == 'google' )
					font.baseLines[ height ] =	self.getTextMetrics( font.fontInformation.name, height, weight ).baseline;
				else
				{
					var foundHeight;
					var maxHeight = 0;
					for ( var h in font.fontCode )
					{
						maxHeight = Math.max( h, maxHeight );
						var delta = h - height;
						if ( delta >= 0 )
						{
							foundHeight = h;
							break;
						}
					}
					if ( foundHeight )
						font.baseHeight = foundHeight;
					else
						font.baseHeight = maxHeight;
					font.baseLines[ height ] = height / font.baseHeight;
					font.canvasDefinitions[ height ] = [];
				}
			}
			font.fontInformation.contextNames[ contextName ] = true;
			if ( self.aoz.utilities.isTag( tags, [ 'setWindowFont' ] ) )
				self.windowFonts[ contextName ] = font;
			if ( callback )
				callback( true, font, extra );
		}
		else
		{
			if ( callback )
				callback( false, null, extra );
		}
	} );
};
Fonts.prototype.loadFont = function( fontInformation, weight, italic, stretch, callback, extra )
{
	weight = typeof weight == 'undefined' ? 'normal' : weight;
	italic = typeof italic == 'undefined' ? 'normal' : italic;
	stretch = typeof stretch == 'undefined' ? 'normal' : stretch;

	var self = this;
	if ( fontInformation.type == 'google' )
	{
		var fontStyleIndex = 'italic:' + italic + 'weight:' + weight + 'stretch:' + stretch;
		if ( !fontInformation.fonts[ fontStyleIndex ] )
		{
			var font =
			{
				weight: weight,
				style: italic,
				strech: stretch
			};
			var observer = new FontFaceObserver( fontInformation.name, font );
			this.aoz.loadingMax++;
			observer.load().then( function()
			{
				self.aoz.loadingCount++;
				font.fontInformation = fontInformation;
				font.baseLines = [];
				fontInformation.fonts[ fontStyleIndex ] = font;
				callback( true, font, extra );
			}, function()
			{
				self.aoz.loadingCount++;
				self.aoz.loadingError = 'cannot_load_font';
				callback( false, null, extra );
			} );
	   	}
		else
		{
			callback( true, fontInformation.fonts[ fontStyleIndex ], extra );
		}
	}
	else if ( fontInformation.type == 'amiga' )
	{
		if ( !fontInformation.font )
		{
			var path = './resources/fonts/amiga/' + fontInformation.name + '.js';
			this.aoz.loadingMax++;
			this.utilities.loadScript( path, {}, function( response, data, extra )
			{
				self.aoz.loadingCount++;
				if ( response )
				{
					fontInformation.font =
					{
						fontCode: typeof AmigaFonts[ fontInformation.index ] == 'undefined' ? WindowFont[ fontInformation.index ] : AmigaFonts[ fontInformation.index ],
						fontInformation: fontInformation,
						canvasDefinitions: [],
						baseLines: [],
						italic: italic,
						weight: weight,
						stretch: stretch
					};
					callback( true, fontInformation.font, extra );
				}
				else
				{
					self.aoz.loadingError = 'cannot_load_font';
					callback( false, null, extra );
				}
			} );
		}
		else
		{
			callback( true, fontInformation.font, extra );
		}
	}
};
Fonts.prototype.getNumberOfFonts = function( type )
{
	var amiga = typeof type == 'undefined' ? true : ( type.toLowerCase() == 'amiga');
	var google = typeof type == 'undefined' ? true : ( type.toLowerCase() == 'google');
	var count = 0;
	for ( var f = 0; f < this.fontInformations.length; f++ )
	{
		var fontInformation = this.fontInformations[ f ];
		if ( fontInformation.contextName == this.aoz.currentContextName )
		{
			if ( amiga && fontInformation.type == 'amiga' )
				count++;
			if ( google && fontInformation.type == 'google' )
				count++;
		}
	}
	return count;
};
Fonts.prototype.getFont$ = function( reference )
{
	var result = '';
	var fontInformation = this.getFontInformation( reference );
	if ( fontInformation  && fontInformation.contextNames[ this.aoz.currentContextName ] )
	{
		if ( !this.manifest.fonts.listFonts || this.manifest.fonts.listFonts.toLowerCase() == 'amiga' )
		{
			result += fontInformation.name;
			while ( result.length < 32 )
				result += ' ';
			result += 16;
			while ( result.length < 36 )
				result += ' ';
			result += fontInformation.type == 'amiga' ? 'rom' : 'disc';
		}
		else
		{
			result += fontInformation.name + ' ';
			result += '(' + fontInformation.type + '): ';
			if ( fontInformation.type == 'google' )
			{
				var fontCode = GoogleFonts[ fontInformation.index ];
				for ( var f = 0; f < fontCode.sizes.length; f++ )
				{
					var fontDef = fontCode.sizes[ f ];
					result += fontDef.weight + ', ' + fontDef.style + ( f < fontCode.sizes.length -1 ? '; ' : '' );
				}
			}
			else
			{
				result += fontInformation.baseHeight;
			}
		}
	}
	return result;
};
Fonts.prototype.getBaseLine = function( font, height )
{
	return font.baseLines[ height ];
};
Fonts.prototype.getTextLength = function( text, font, height )
{
	if ( font.fontInformation.type == 'amiga' )
	{
		var result = 0;
		var fontDefinition = this.getAmigaFontDefinition( font, height )
		for ( var p = 0; p < text.length; p++ )
		{
			var c = text.charCodeAt( p );
			if ( c >= fontDefinition.heightDefinition.loChar && c <= fontDefinition.heightDefinition.hiChar )
			{
				var charDefinition = fontDefinition.characterSet[ c - fontDefinition.heightDefinition.loChar ];
				result += charDefinition.space + charDefinition.kern;
			}
			else
			{
				result += Fonts.EMPTYAMIGACHAR_SPACE + Fonts.EMPTYAMIGACHAR_KERN;
			}
		}
		return result;
	}
	else if ( font.fontInformation.type == 'google' )
	{
		this.miniContext.font = this.utilities.getFontString( font.fontInformation.name, height, font.weight, font.italic );
		return this.miniContext.measureText( text ).width;
	}
	throw 'font_not_available';
};
Fonts.prototype.drawAmigaText = function( context, scale, x, y, text, font, height, textAlign, textBaseLine, direction, fillStyle, alpha, fontWidth )
{
	var fontDefinition = this.getAmigaFontDefinition( font );
	if ( textAlign == 'center' || textAlign == 'right' )
	{
		var width = this.getTextLength( text, font, height );
		if ( textAlign == 'center' )
			x -= width / 2;
		else
			x -= width;
	}
	if ( textBaseLine == 'bottom' )
		y -= height;
	else if ( textBaseLine != 'top' )
		y -= font.baseLines[ height ];

	context.globalAlpha = alpha;
	context.imageSmoothingEnabled = false;
	for ( var c = 0; c < text.length; c++ )
	{
		var result = this.getAmigaCharacter( font, fontDefinition, text.charCodeAt( c ), height, fillStyle );
		var scaleDisplay = ( height / result.canvas.height ) * scale;
		context.drawImage( result.canvas, 0, 0, result.canvas.width, result.canvas.height, x * scale, y * scale, result.canvas.width * scaleDisplay, result.canvas.height * scaleDisplay );
		if ( !fontWidth )
			x += result.charDefinition.kern + result.charDefinition.space;
		else
			x += fontWidth;
	}
};
Fonts.prototype.getAmigaCharacter = function( font, fontDefinition, c, height, fillStyle )
{
	var charDefinition;
	if ( c >= fontDefinition.heightDefinition.loChar && c <= fontDefinition.heightDefinition.hiChar )
		charDefinition = fontDefinition.characterSet[ c - fontDefinition.heightDefinition.loChar ];
	else
	{
		charDefinition =
		{
			kern: Fonts.EMPTYAMIGACHAR_KERN,
			space: Fonts.EMPTYAMIGACHAR_SPACE,
			width: Fonts.EMPTYAMIGACHAR_WIDTH
		};
	}

	var fontIndex = Math.floor( height );
	var canvasDefinition = font.canvasDefinitions[ fontIndex ][ c ];
	if ( canvasDefinition )
	{
		if ( canvasDefinition.fillStyle == fillStyle )
			return { canvas: canvasDefinition.canvas, charDefinition: charDefinition };
	}

	// New canvas!
	var canvas = document.createElement( 'canvas' );
	canvas.width = font.baseHeight;
	canvas.height = font.baseHeight;
	var context = canvas.getContext( '2d' );
	context.fillStyle = fillStyle;
	context.imageSmoothingEnabled = false;
	font.canvasDefinitions[ fontIndex ][ c ] = { fillStyle: fillStyle, canvas: canvas };
	if ( charDefinition.bitmap )
	{
		var modulo = Math.floor( charDefinition.width / 8 ) + ( ( charDefinition.width & 7 ) != 0 ? 1 : 0 );
		for ( var y = 0; y < font.baseHeight; y++ )
		{
			var address = y * modulo;
			var byte = charDefinition.bitmap[ address ];
			var mask = 0x80;
			for ( x = 0; x < charDefinition.width; x++ )
			{
				if ( ( byte & mask ) != 0 )
				{
					context.fillRect( x, y, 1, 1 );
				}
				mask >>= 1;
				if ( mask == 0 )
				{
					mask = 0x80;
					address++;
					byte = charDefinition.bitmap[ address ];
				}
			}
		}
	}
	return { canvas: canvas, charDefinition: charDefinition };
};

Fonts.prototype.getTextMetrics = function(fontFamily, fontSize, fontWeight)
{
	var padding;
	var context;
	var canvas;
	var chars =
	{
		capHeight: 'S',
		baseline: 'n',
		xHeight: 'x',
		descent: 'p',
		ascent: 'h',
		tittle: 'i'
	};

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var padding = fontSize * 0.5;
	canvas.width = fontSize * 2;
	canvas.height = fontSize * 2 + padding;
	context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
	context.textBaseline = 'top';
	context.textAlign = 'center';

	var result =
	{
		capHeight: measureTop(chars.capHeight),
		baseline: measureBottom(chars.baseline),
		xHeight: measureTop(chars.xHeight),
		descent: measureBottom(chars.descent),
		bottom: computeLineHeight(),
		ascent: measureTop(chars.ascent),
		tittle: measureTop(chars.tittle),
		top: 0
	};
	return result;

	function measureTop(text)
	{
		var pixels = updateText( text );
		return Math.round(getFirstIndex(pixels) / canvas.width) - padding;
	};

	function measureBottom(text)
	{
		var pixels = updateText(text);
		return Math.round(getLastIndex(pixels) / canvas.width) - padding;
	};

	function updateText( text )
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(text, canvas.width / 2, padding, canvas.width);
		return context.getImageData(0, 0, canvas.width, canvas.height).data;
	};

	function setAlignment(baseline = 'top')
	{
		const ty = baseline === 'bottom' ? canvas.height : 0;
		context.setTransform(1, 0, 0, 1, 0, ty);
		context.textBaseline = baseline;
	};

	function computeLineHeight()
	{
		const letter = 'A';
		setAlignment('bottom');
		updateText( letter );
		const gutter = canvas.height - measureBottom(letter);
		setAlignment('top');
		updateText( letter );
		return measureBottom(letter) + gutter;
	};

	function getFirstIndex( pixels )
	{
		for (var i = 3, n = pixels.length; i < n; i += 4)
		{
			if (pixels[i] > 0)
				return (i - 3) / 4;
		}
		return pixels.length;
	};

	function getLastIndex( pixels )
	{
		for (var i = pixels.length - 1; i >= 3; i -= 4)
		{
			if (pixels[i] > 0)
				return i / 4;
		}
		return 0;
	};

	function normalize(metrics, fontSize, origin)
	{
		const result = {};
		const offset = metrics[origin];
		for (let key in metrics)
		{
			result[key] = (metrics[key] - offset) / fontSize;
		}
		return result;
	};
};


// Fonts definitions...
AmigaFonts = {};
AmigaCharacters = {};
GoogleFonts = {};
GoogleFonts["roboto"]=
{
	name:"Roboto",sizes:[{weight:"100",style:"normal"},{weight:"100",style:"italic"},{weight:"300",style:"normal"},{weight:"300",style:"italic"},{weight:"400",style:"normal"},{weight:"500",style:"normal"},{weight:"500",style:"italic"},{weight:"400",style:"italic"},{weight:"700",style:"italic"},{weight:"900",style:"normal"},{weight:"700",style:"normal"},{weight:"900",style:"italic"}]
};
GoogleFonts["ibm plex mono"]=
{
	name:"IBM Plex Mono",sizes:[{weight:"100",style:"normal"},{weight:"100",style:"italic"},{weight:"200",style:"normal"},{weight:"200",style:"italic"},{weight:"300",style:"normal"},{weight:"300",style:"italic"},{weight:"400",style:"normal"},{weight:"400",style:"italic"},{weight:"500",style:"normal"},{weight:"500",style:"italic"},{weight:"600",style:"normal"},{weight:"700",style:"normal"},{weight:"600",style:"italic"},{weight:"700",style:"italic"}]
};


