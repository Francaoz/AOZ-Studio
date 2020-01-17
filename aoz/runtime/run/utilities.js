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
 * Various utilities
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */
function Utilities( aoz )
{
	this.aoz = aoz;
}

Utilities.prototype.rotate = function( x, y, cx, cy, angle )
{
	var cos = Math.cos( angle );
	var sin = Math.sin( angle );
	var nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
	var ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
	return { x: nx, y: ny };
};

Utilities.prototype.slice = function( arr, position, length )
{
	var result = [];
	length = typeof length != 'undefined' ? length : 1;
	for ( var p = 0; p < arr.length; p++ )
	{
		if ( p < position || p >= position + length )
		{
			result.push( arr[ p ] );
		}
	}
	return result;
};

Utilities.prototype.trimString = function( str, position )
{
	var start = 0;
	position = typeof position == 'undefined' ? { left: true, right: true } : position;
	if ( position.left )
	{
		while( start < str.length && ( str.charCodeAt( start ) == 32 || str.charCodeAt( start ) == 9 || str.charCodeAt( start ) == 10 || str.charCodeAt( start ) == 13 ) )
			start++;
	}
	var end = str.length;
	if ( position.right )
	{
		while( end > 0 && ( str.charCodeAt( end - 1 ) == 32 || str.charCodeAt( end - 1 ) == 9 || str.charCodeAt( end - 1 ) == 10 || str.charCodeAt( end - 1 ) == 13 ) )
			end--;
	}
	if ( end > start )
		return str.substring( start, end );
	return '';
}

Utilities.prototype.getFontString = function( name, height, weight, italic )
{
	var font = '';
	if ( typeof italic != 'undefined' )
		font += 'italic ';
	if ( typeof weight != 'undefined' )
		font += weight + ' ';
	font += height + 'px ' + name;
	return font;
};

Utilities.prototype.getFontStringHeight = function( fontString )
{
	var height = 10;
	var pos = fontString.indexOf( 'px' );
	if ( pos >= 0 )
		height = parseInt( fontString.substring( 0, pos ) );
	return height;
};


Utilities.prototype.getRGBA = function( r, g, b, a )
{
	a = ( typeof a == 'undefined' ? 255 : 0 );
	return ( ( r & 0xFF ) << 24 ) | ( ( g & 0xFF ) << 16 ) | ( ( b & 0xFF ) << 8 ) | ( a & 0xFF );
};
Utilities.prototype.getRGBAColors = function( rgba )
{
	var result =
	{
		r: ( rgba >> 24 ) & 0xFF,
		g: ( rgba >> 16 ) & 0xFF,
		b: ( rgba  >> 8 ) & 0xFF,
		a: ( rgba & 0xFF )
	};
	return result;
};
Utilities.prototype.getRGBAStringColors = function( rgbaString )
{
	var result = {};
	result.r = parseInt( rgbaString.substr( 1, 2 ), 16 );
	result.g = parseInt( rgbaString.substr( 3, 2 ), 16 );
	result.b = parseInt( rgbaString.substr( 5, 2 ), 16 );
	result.a = 255;
	if ( rgbaString.length == 9 )
		result.a = parseInt( rgbaString.substr( 7, 2 ), 16 );
	return result;
};
Utilities.prototype.getRGBAString = function( r, g, b, a )
{
	var rr = r.toString( 16 );
	if ( rr.length < 2 ) rr = '0' + rr;
	var gg = g.toString( 16 );
	if ( gg.length < 2 ) gg = '0' + gg;
	var bb = b.toString( 16 );
	if ( bb.length < 2 ) bb = '0' + bb;
	var aa = '';
	if ( typeof a != 'undefined')
	{
		aa = a.toString( 16 );
		if ( aa.length < 2 ) aa = '0' + aa;
	}
	return ( '#' + rr + gg + bb + aa ).toUpperCase();
}
Utilities.prototype.getModernColorString = function( color, short = false )
{
	var colorString = color.toString( 16 );
	if ( short )
	{
		while ( colorString.length < 3 )
			colorString = '0' + colorString;
		colorString = colorString.substr( 0, 1 ) + '0' + colorString.substr( 1, 1 ) + '0' + colorString.substr( 2, 1 ) + '0';
	}
	else
	{
		while ( colorString.length < 6 )
			colorString = '0' + colorString;
	}
	return ( '#' + colorString ).toUpperCase();
};


Utilities.prototype.pokeString = function( str, replacement, position, length  )
{
	var result = str.substring( 0, position );
	if ( length < replacement.length )
	{
		result += replacement.substr( 0, length );
	}
	else
	{
		result += replacement;
		result += str.substr( position + replacement.length, length - replacement.length );
	}
	result += str.substring( position + length );
	return result;
};
Utilities.prototype.getFilename = function( path )
{
	var posPoint = path.lastIndexOf( '.' );
	if ( posPoint < 0 )
		posPoint = path.length;

	var posSlash1 = path.lastIndexOf( '/' );
	var posSlash2 = path.lastIndexOf( '\\' );
	if ( posSlash1 >= 0 && posSlash2 >= 0 )
		posSlash1 = Math.max( posSlash1, posSlash2 ) + 1;
	else if ( posSlash1 < 0 && posSlash2 < 0 )
		posSlash1 = 0;
	else if ( posSlash1 < 0 )
		posSlash1 = posSlash2 + 1;
	else
		posSlash1++;

	return path.substring( posSlash1, posPoint );
};
Utilities.prototype.getFilenameExtension = function( path )
{
	var posPoint = path.lastIndexOf( '.' );
	if ( posPoint < 0 )
		return '';
	return path.substring( posPoint + 1 );
};
Utilities.prototype.getFilenameAndExtension = function( path )
{
	var posSlash1 = path.lastIndexOf( '/' );
	var posSlash2 = path.lastIndexOf( '\\' );
	if ( posSlash1 >= 0 && posSlash2 >= 0 )
		posSlash1 = Math.max( posSlash1, posSlash2 ) + 1;
	else if ( posSlash1 < 0 && posSlash2 < 0 )
		posSlash1 = 0;
	else if ( posSlash1 < 0 )
		posSlash1 = posSlash2 + 1;
	else
		posSlash1++;

	return path.substring( posSlash1 );
};
Utilities.prototype.convertStringToArrayBuffer = function( str )
{
	var lookup = window.base64Lookup;
	if ( !lookup )
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		lookup = new Uint8Array(256);
		for ( var i = 0; i < chars.length; i++ )
		{
			lookup[ chars.charCodeAt( i ) ] = i;
		}
		window.base64Lookup = lookup;
	}

	var bufferLength = str.length * 0.75, len = str.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
	if ( str[ str.length - 1 ] === "=")
	{
		bufferLength--;
		if ( str[ str.length - 2 ] === "=")
		{
			bufferLength--;
		}
	}

	var arraybuffer = new ArrayBuffer( bufferLength ),
	bytes = new Uint8Array( arraybuffer );

	for ( i = 0; i < len; i += 4 )
	{
		encoded1 = lookup[str.charCodeAt(i)];
		encoded2 = lookup[str.charCodeAt(i+1)];
		encoded3 = lookup[str.charCodeAt(i+2)];
		encoded4 = lookup[str.charCodeAt(i+3)];

		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	}
	return arraybuffer;
};
Utilities.prototype.convertArrayBufferToString = function( arrayBuffer )
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var bytes = new Uint8Array( arrayBuffer ), i, len = bytes.length, base64 = "";

	for (i = 0; i < len; i+=3)
	{
		base64 += chars[bytes[i] >> 2];
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if ((len % 3) === 2)
	{
		base64 = base64.substring(0, base64.length - 1) + "=";
	}
	else if (len % 3 === 1)
	{
		base64 = base64.substring(0, base64.length - 2) + "==";
	}
	return base64;
};
Utilities.prototype.loadArraybuffer = function( path, options, callback, extra )
{
	var self = this;
	fetch( path )
  		.then( response => response.text() )
  		.then( ( data ) => {
			var arrayBuffer = self.convertStringToArrayBuffer( data );
			callback( true, arrayBuffer, extra );
		} )
		.catch( function( error )
		{
			callback( false, null, extra );
		} );
}
Utilities.prototype.replaceStringInText = function( text, mark, replacement )
{
	var pos = text.indexOf( mark );
	while( pos >= 0 )
	{
		text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
		pos = text.indexOf( mark );
	}
	return text;
};
Utilities.prototype.loadScript = function( scripts, options, callback, extra )
{
	options = typeof options != 'undefined' ? options : {};
	timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
	if ( typeof scripts == 'string' )
		scripts = [ scripts ];

	
	var loaded = 0;
	var toLoad = scripts.length;
	var handle = setTimeout( onTimeout, timeout );
	for ( var s = 0; s < scripts.length; s++ )
	{
		var path = scripts[ s ];

		var element = document.createElement( 'script' );
		element.onload = onLoad;
		element.onError = onError;					// Not on all browsers
		element.src = path;
		document.head.appendChild( element ); 		// Adds to the document
		scripts[ s ] = element;
		function onLoad()
		{
			loaded++;
			if ( loaded == toLoad )
			{
				clearTimeout( handle );
				if ( callback )
					callback( true, scripts, extra );
			}
		};
		function onError()
		{
			clearTimeout( handle );
			if ( callback )
				callback( false, scripts, extra );
		};
		function onTimeout()
		{
			if ( callback )
				callback( false, scripts, extra );
		};
	}
};
Utilities.prototype.loadImages = function( images, options, callback, extra )
{
	options = typeof options != 'undefined' ? options : {};
	timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
	if ( typeof images == 'string' )
		images = [ images ];

	var loaded = 0;
	var toLoad = images.length;
	var loadedImages = {};
	for ( var s = 0; s < images.length; s++ )
	{
		var path = images[ s ];

		var i = new Image();
		i.__name = this.getFilename( path );
		i.onload = function()
		{
			loaded++;
			loadedImages[ this.__name ] = this;
			if ( loaded == toLoad )
			{
				clearTimeout( handle );
				if ( callback )
					callback( true, loadedImages, extra );
			}
		};
		i.onerror = function()
		{
			clearTimeout( handle );
			if ( callback )
				callback( false, null, { error: 'load_error' } );
		};
		i.src = path;
	}
	var handle = setTimeout( onTimeout, timeout );
	function onTimeout()
	{
		if ( callback )
			callback( false, null, { error: 'timeout' } );
	};
};
Utilities.prototype.convertObjectToArray = function( obj, options )
{
	var	result = [];
	for ( var d = 0; d < obj.length; d++ )
	{
		result.push( obj[ d ] );
	}
	if ( options )
	{
		if ( options.sort == 'up' )
		{
			result.sort( function( a, b )
			{
				return ( a < b ) ? 1 : -1;
			} );
		}
		else if ( options.sort == 'down' )
		{
			result.sort( function( a, b )
			{
				return ( a > b ) ? 1 : -1;
			} );
		}
	}
	return result;
};

Utilities.prototype.copyArray = function ( arr )
{
	var result = [];
	for ( var i = 0; i < arr.length; i++ )
		result[ i ] = arr[ i ];
	return result;
};
Utilities.prototype.copyObject = function ( obj )
{
	var result = {};
	for ( var i in obj )
		result[ i ] = obj[ i ];
	return result;
};
Utilities.prototype.mergeObjectIntoNewObject = function ( destination, source )
{
	var result = {};
	for ( var i in destination )
		result[ i ] = destination[ i ];
	for ( var i in source )
		result[ i ] = source[ i ];
	return result;
};
Utilities.prototype.getProperty = function ( obj, prop, noCase )
{
	if ( typeof prop != 'string' )
		return obj[ prop ];
	if ( noCase )
		return obj[ prop.toLowerCase() ];
	return obj[ prop ];
};
Utilities.prototype.cleanObject = function ( obj, exclude, noCase )
{
	var temp = {};
	if ( typeof exclude == 'string' )
	{
		if ( noCase )
		{
			for ( var key in obj )
			{
				if ( typeof key != 'string' || key.toLowerCase() != exclude.toLowerCase() )
					temp[ key ] = obj[ key ];
			}
		}
		else
		{
			for ( var key in obj )
			{
				if ( key != exclude )
					temp[ key ] = obj[ key ];
			}
		}
	}
	else
	{
		for ( var key in obj )
		{
			if ( obj[ key ] && obj[ key ] != exclude )
				temp[ key ] = obj[ key ];
		}
	}
	return temp;
};
Utilities.prototype.isObject = function( item )
{
    return typeof item != 'undefined' ? (typeof item === "object" && !Array.isArray(item) && item !== null) : false;
};
Utilities.prototype.isArray = function( item )
{
    return typeof item != 'undefined' ? item.constructor == Array : false;
};
Utilities.prototype.getTag = function( text, tags )
{
	if ( tags )
	{
		text = text.toLowerCase();
		for ( var t = 0; t < tags.length; t++ )
		{
			if ( text.indexOf( '#' + tags[ t ].toLowerCase() ) >= 0 )
			{
				return tags[ t ];
			}
		}
	}
	return '';
};
Utilities.prototype.isTag = function( text, tags )
{
	if ( tags )
	{
		text = text.toLowerCase();
		for ( var t = 0; t < tags.length; t++ )
		{
			if ( text.indexOf( '#' + tags[ t ].toLowerCase() ) >= 0 )
			{
				return true;
			}
		}
	}
	return false;
};
Utilities.prototype.getTagParameter = function( text, tag )
{
	text = text.toLowerCase();
	var start = text.indexOf( '#' + tag.toLowerCase() );
	if ( start >= 0 )
	{
		start += tag.length + 1;
		if ( text.charAt( start ) == ':' )
		{
			start++;
			var end = text.indexOf( ',', start );
			if ( end < 0 ) end = text.length;
			var param = text.substring( start, end );
			if ( param.charAt( 0 ) == '"' || param.charAt( 0 ) == "'" )
				return text.substring( start + 1, end - 1 );
			var number = this.val( param );
			if ( !isNaN( number ) )
				return number;
			return param;
		}
	}
	return undefined;
};
Utilities.prototype.val = function( value )
{
	var base = 10;
	if ( value.substring( 0, 1 ) == '$' )
	{
		value = value.substring( 1 );
		base = 16;
	}
	if ( value.substring( 0, 1 ) == '%' )
	{
		value = value.substring( 1 );
		base = 2;
	}
	return parseInt( value, base );
};
Utilities.prototype.skipSpaces = function( line )
{
	var position = 0;
	while ( ( line.charAt( position ) == ' ' || line.charAt( position ) == '\t' ) && position < line.length )
		position++;
	return line.substring( position );
};
Utilities.prototype.flattenObject = function( objet )
{
	var result = [];
	for ( var i in objet )
		result.push( objet[ i ] );
	return result;
};



// Memory block class
function MemoryBlock( aoz, buffer, endian )
{
	this.aoz = aoz;
	if ( typeof buffer == 'number' )
		buffer = new ArrayBuffer( buffer );
	this.buffer = buffer;
	this.bufferView = new Uint8Array( buffer );
	this.length = this.bufferView.byteLength;
	this.endian = typeof endian != 'undefined' ? endian : 'big';
};
MemoryBlock.prototype.extractString = function( address, length )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( address + length > this.bufferView.length )
		throw 'illegal_function_call';
	var result = '';
	for ( var l = 0; l < length; l++ )
	{
		var c = this.bufferView[ address + l ];
		if ( c == 0 )
			break;
		if ( c < 32 )
			c = ' ';
		result += String.fromCharCode( c );
	}
	return result;
};
MemoryBlock.prototype.extractArrayBuffer = function( start, end )
{
	start = start - Math.floor( start / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	end = end - Math.floor( end / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.length )
		throw 'illegal_function_call';
	var buffer = new ArrayBuffer( length );
	var view = new Uint8Array( buffer );
	for ( var l = 0; l < length; l++ )
	{
		view[ l ] = this.bufferView[ start + l ];
	}
	return buffer;
};
MemoryBlock.prototype.peek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address > this.bufferView.length )
		throw 'illegal_function_call';
	if ( signed && v >= 0x80 )
		return -( 0x100 - v );
	return this.bufferView[ address ];
};
MemoryBlock.prototype.deek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + 2 > this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 8 | this.bufferView[ address + 1 ] & 0xFF;
	}
	else
	{
		v = ( this.bufferView[ address + 1 ] & 0xFF ) << 8 + this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x8000 )
		return -( 0x10000 - v );
	return v;
};
MemoryBlock.prototype.leek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + 4 > this.bufferView.length )
		throw 'illegal_function_call';
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 24 | ( this.bufferView[ address + 1 ] & 0xFF ) << 16 | ( this.bufferView[ address + 2 ] & 0xFF ) << 8 | this.bufferView[ address + 3 ] & 0xFf;
	}
	else
	{
		v = ( this.bufferView[ address + 3 ] & 0xFF ) << 24 | ( this.bufferView[ address + 2 ] & 0xFF ) << 16 | ( this.bufferView[ address + 1 ] & 0xFF ) << 8 | this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x80000000 )
		return -( 0x100000000 - v );
	return v;
};
MemoryBlock.prototype.poke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFF;
	if ( address >= this.bufferView.length )
		throw 'illegal_function_call';
	this.bufferView[ address ] = value;
};
MemoryBlock.prototype.doke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFFFF;
	if ( address + 2 > this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 8 ) & 0xFF;
		this.bufferView[ address + 1 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value & 0xFF ) >> 8;
	}
};
MemoryBlock.prototype.loke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFFFFFFFF;
	if ( address + 4 > this.bufferView.length )
		throw 'illegal_function_call';
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 24 ) & 0xFF;
		this.bufferView[ address + 1 ] = ( value >> 16 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 3 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 16 ) & 0xFF;
		this.bufferView[ address + 3 ] = ( value  >> 24 ) & 0xFF;
	}
};
MemoryBlock.prototype.pokeArrayBuffer = function( address, buffer )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var view = new Uint8Array( buffer );
	if ( address + view.length > this.bufferView.length )
		throw 'illegal_function_call';
	for ( var b = 0; b < view.length; b++ )
		this.bufferView[ address + b ] = view[ b ];
};
MemoryBlock.prototype.poke$ = function( address, text )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + text.length > this.bufferView.length )
		throw 'illegal_function_call';
	for ( var p = 0; p < text.length; p++ )
		this.bufferView[ address + p ] = text.charCodeAt( p ) & 0xFF;
};
MemoryBlock.prototype.peek$ = function( address, length, stop )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var text = '';
	for ( var p = 0; p < length; p++ )
	{
		var c = String.fromCharCode( this.bufferView[ address + p ] );
		if ( c == stop )
			break;
		if ( address + p > this.bufferView.length )
			throw 'illegal_function_call';
		text += c;
	}
	return text;
};
MemoryBlock.prototype.fill = function( start, end, value )
{
	start = start - Math.floor( start / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	end = end - Math.floor( end / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.length )
		throw 'illegal_function_call';

	for ( var p = 0; p <= length - 4; p += 4 )
		this.loke( start + p, value );
	for ( ; p < length; p++ )
	{
		if ( this.endian == 'big' )
		{
			this.poke( start + p, ( value & 0xFF000000 ) >> 24 );
			value = value << 8;
		}
		else
		{
			this.poke( start + p, value & 0xFF );
			value = value >> 8;
		}
	}
};
MemoryBlock.prototype.copyTo = function( sourceAddress, destinationBlock, destinationAddress, length )
{
	if ( sourceAdress + length > this.bufferView.length || destinationAddress + length > destinationBlock.bufferView.length )
		throw 'illegal_function_call';
	if ( destinationBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = 0; p < length; p++ )
			destinationBlock.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.copyFrom = function( destinationAddress, sourceBlock, sourceAddress, length )
{
	if ( destinationAddress + length > this.bufferView.length || sourceAddress + length > sourceBlock.bufferView.length )
		throw 'illegal_function_call';
	if ( sourceBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = 0; p < length; p++ )
			this.bufferView[ destinationAddress + p ] = sourceBlock.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.copyArray = function( address, sourceArray, type, length )
{
	length = typeof length == 'undefined' ? sourceArray.length : length;
	switch ( type )
	{
		default:
		case 'byte':
			for ( var p = 0; p < length; p++ )
			{
				if ( typeof sourceArray[ p ] == 'string' )
					this.poke( address + p, sourceArray[ p ].charCodeAt( 0 ) );
				else
					this.poke( address + p, sourceArray[ p ] );
			}			
			break;``
		case 'word':	// TODO
			debugger;
			for ( var p = 0; p < length; p++ )
			{
				if ( typeof sourceArray[ p ] == 'string' )
					this.poke( address + p * 2, sourceArray[ p ].charCodeAt( 0 ) );
				else
					this.poke( address + p, sourceArray[ p ] );
			}			
			break;
		case 'dword':	// TODO
			debugger;
			for ( var p = 0; p < length; p++ )
				this.loke( address + p * 4, sourceArray[ p ] );
			break;
	}
};
MemoryBlock.prototype.hunt = function( start, end, text )
{
	var length = end - start;
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( start + text.length > this.bufferView.length )
		return 0;
	for ( var i = 0; i < length - text.length; i++ )
	{
		for ( var j = 0; j < text.length; j++ )
		{
			if ( this.bufferView[ start + i + j ] != text.charCodeAt( j ) & 0xFF )
				break;
		}
		if ( j == text.length )
			return this.memoryHash * this.aoz.memoryHashMultiplier + i;
	}
	return 0;
};









Utilities.prototype.getCharacterType = function( c )
{
	if ( c >= '0' && c <= '9' )
		type = 'number';
	else if ( c == ' ' || c == "\t" )
		type = 'space';
	else if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' )
		type = 'letter';
	else if ( c == '"' || c == "'"  )
		type = 'quote';
	else if ( c == ':' )
		type = 'column';
	else if ( c == ';' )
		type = 'semicolumn';
	else if ( c == '-' )
		type = 'minus';
	else if ( c == '(' || c == ')' )
		type = 'bracket';
	else
		type = 'other';
	return type;
};

// Fix coordinates
Utilities.prototype.getZone = function( rectangle, dimensions, scale )
{
	rectangle = typeof rectangle == 'undefined' ? {} : rectangle;
	scale = typeof scale == 'undefined' ? { x: 1, y: 1, z: 1 } : scale;
	rectangle.x = typeof rectangle.x == 'undefined' ? 0 : rectangle.x;
	rectangle.y = typeof rectangle.y == 'undefined' ? 0 : rectangle.y;
	rectangle.width = isNaN( rectangle.width )  ? dimensions.width : rectangle.width;
	rectangle.height = isNaN( rectangle.height ) ? dimensions.height : rectangle.height;
	return { x: rectangle.x * scale.x, y: rectangle.y * scale.y, width: rectangle.width * scale.x, height: rectangle.height * scale.y };
};
Utilities.prototype.checkRectangle = function( rectangle, position, dimension )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : position.x;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : position.y;
	if ( dimension )
	{		
		if ( typeof rectangle.width == 'undefined' || typeof rectangle.height == 'undefined' )
			throw 'illegal_function_call';
		if ( rectangle.x + rectangle.width > dimension.width )
			rectangle.width = dimension.width - rectangle.x;
		if ( rectangle.y + rectangle.height > dimension.height )
			rectangle.height = this.dimension.height - rectangle.y;
		if ( rectangle.width <= 0 || rectangle.height <= 0 )
			throw 'illegal_function_call';
	}
	return rectangle;
};
Utilities.prototype.makeTransparentImage = function( image )
{
	var canvas = document.createElement( 'canvas' );
	canvas.width = image.width;
	canvas.height = image.height;
	var context = canvas.getContext( '2d' );
	context.drawImage( image, 0, 0 );
	this.remapBlock( context, [ { r: 0, g: 0, b: 0 } ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: image.width, height: image.height } );
	return canvas;
};
Utilities.prototype.remapBlock = function( context, rgbaSource, rgbaDestination, coordinates )
{
	// Do the remapping
	if ( coordinates.width > 0 && coordinates.height > 0 )
	{
		var imageData = context.getImageData( coordinates.x, coordinates.y, coordinates.width, coordinates.height );

		var data = imageData.data;
		if ( rgbaSource.length == 1 )
		{
			rgbaSource = rgbaSource[ 0 ];
			rgbaDestination = rgbaDestination[ 0 ];
			var alpha = typeof rgbaDestination.a != 'undefined';
			for ( var p = 0; p < data.length; p += 4 )
			{
				if ( data[ p ] == rgbaSource.r && data[ p + 1 ] == rgbaSource.g && data[ p + 2 ] == rgbaSource.b )
				{
					data[ p ] = rgbaDestination.r;
					data[ p + 1 ] = rgbaDestination.g;
					data[ p + 2 ] = rgbaDestination.b;
					if ( alpha )
						data[ p + 3 ] = rgbaDestination.a;
				}
			}
		}
		else
		{
			for ( var p = 0; p < data.length; p += 4 )
			{
				for ( var c = 0; c < rgbaSource.length; c++ )
				{
					var source = rgbaSource[ c ];
					if ( data[ p ] == source.r && data[ p + 1 ] == source.g && data[ p + 2 ] == source.b )
					{
						var destination = rgbaDestination[ c ];
						data[ p ] = destination.r;
						data[ p + 1 ] = destination.g;
						data[ p + 2 ] = destination.b;
						if ( typeof destination.a != 'undefined' )
							data[ p + 3 ] = destination.a;
					}
				}
			}
		}
		context.putImageData( imageData, coordinates.x, coordinates.y );
	}
};
Utilities.prototype.loadUnlockedImage = function( path, type, options, callback, extra )
{
	var self = this;
	var name = 'image_' + this.getFilename( path );
	if ( AOZ_Files[ name ] )
	{
		loadIt( AOZ_Files[ name ] );
	}
	else
	{
		this.aoz.loadingMax++;
		this.loadScript( path, options, function( response, data, extra )
		{
			if ( response )
			{
				loadIt( AOZ_Files[ name ] );
			}
			else
			{
				self.aoz.loadingCount++;
				callback( false, null, extra );
			}
		}, extra );
	}
	function loadIt( base64 )
	{
		self.aoz.loadingCount++;
		var type = 'image/png';
		var arrayBuffer = self.convertStringToArrayBuffer( base64 );
		var blob = new Blob( [ arrayBuffer ], { type: type } );
		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL( blob );
		var image = new Image();
		image.onload = function()
		{
			callback( true, this, extra );
		};
		image.src = imageUrl;
	}
};

Utilities.prototype.loadUnlockedSound = function( path, options, callback, extra )
{
	var self = this;
	var name = 'sound_' + this.getFilename( path );
	if ( AOZ_Files[ name ] )
	{
		loadIt( AOZ_Files[ name ] );
		if ( !options.keepSource )
			AOZ_Files[ name ] = null;
	}
	else
	{
		this.aoz.loadingMax++;
		this.loadScript( path, options, function( response, data, extra )
		{
			self.aoz.loadingCount++;
			if ( response )
			{
				if ( AOZ_Files[ name ] )
				{
					loadIt( AOZ_Files[ name ] );
					if ( !options.keepSource )
						AOZ_Files[ name ] = null;
				}
				else
				{
					callback( false, null, extra );
				}
			}
			else
			{
				callback( false, null, extra );
			}
		}, extra );
	}
	function loadIt( source )
	{
		self.aoz.loadingMax++;
		var sound = new Howl( { src: [ source ] } );
		sound.on( "load", function()
		{
			self.aoz.loadingCount++;
			callback( true, sound, extra );
		} );
		sound.on( "loaderror", function()
		{
			self.aoz.loadingCount++;
			callback( false, null, extra );
		} );
	}
};
Utilities.prototype.loadMultipleUnlockedSound = function( path, number, options, callback, extra )
{
	var result = [];
	for ( var n = 0; n < number; n++ )
	{
		this.loadUnlockedSound( path, { keepSource: true }, function( response, sound, num )
		{
			if ( response )
			{
				result.push( sound );
				if ( result.length == number )
					callback( true, result, extra );
			}
		}, n );
	}
};

Utilities.prototype.loadUnlockedBankElement = function( path, options, callback, extra )
{
	var self = this;
	var name = 'bank_' + options.bankIndex;
	if ( AOZ_Files[ name ] )
	{
		callback( true, AOZ_Files[ name ] );
		//if ( !options.keepSource )
		//	AOZ_Files[ name ] = null;
	}
	else
	{
		this.aoz.loadingMax++;
		this.loadScript( path, options, function( response, data, name2 )
		{
			self.aoz.loadingCount++;
			if ( response )
			{
				/*
				debugger;
				if ( AOZ_Files[ 'bank_10' ] && AOZ_Files[ 'bank_11' ] )
				{
					if ( AOZ_Files[ 'bank_10' ] == AOZ_Files[ 'bank_11' ] )
					{
						var merde = 1;
					}
				}
				*/
				var arrayBuffer = self.convertStringToArrayBuffer( AOZ_Files[ name2 ] );
				//if ( !options.keepSource )
				//	AOZ_Files[ name2 ] = null;
				callback( true, arrayBuffer, extra );
			}
			else
			{
				callback( false, null, extra );
			}
		}, name );
	}
};



////////////////////////////////////////////////////////////////////////////
//
// Context management: aoz-3 here we come -> will drive everything!
//
////////////////////////////////////////////////////////////////////////////
function AOZContext( aoz, domain, options )
{
	this.aoz = aoz;
	this.options = options;
	this.domain = domain;
	this.contexts = {};
	this.list = {};
	this.listNames = {};
	this.listSorted = [];
	this.listSortedInContext = {};
	this.numberOfElements = 0;
	this.numberOfElementsInContext = {};
	if ( domain )
		this.addContext( domain );
};
AOZContext.prototype.addContext = function( contextName )
{
	if ( !this.contexts[ contextName ] )
	{
		this.numberOfElementsInContext[ contextName ] = 0;
		if ( this.options.sorted )
			this.listSortedInContext[ contextName ] = [];
		this.contexts[ contextName ] = true;
	}
};
AOZContext.prototype.reset = function( contextName )
{
	if ( contextName )
	{
		var temp = {};
		var count = 0;
		for ( var i in this.list )
		{
			if ( this.list[ i ].contextName != contextName )
			{
				temp[ i ] = this.list[ i ];
				count++;
			}
		}
		this.list = temp;
		this.numberOfElements = count;

		temp = {};
		count = 0;
		for ( var i in this.listNames )
		{
			if ( this.listNames[ i ].contextName != contextName )
			{
				temp[ i ] = this.listNames[ i ];
				count++;
			}
		}
		this.listNames = temp;

		this.numberOfElementsInContext[ contextName ] = 0;

		if ( this.options.sorted )
		{
			var temp = [];
			for ( var i = 0; i < this.listSorted.length; i++ )
			{
				if ( this.listSorted[ i ].contextName != contextName )
					temp.push( this.list[ i ] );
			}
			this.listSorted = temp;
			this.listSortedInContext[ contextName ] = [];
		}
	}
	else
	{
		this.list = {};
		this.listNames = {};
		this.numberOfElements = 0;
		for ( var name in this.contexts )
		{
			this.numberOfElementsInContext[ name ] = 0;
			if ( this.options.sorted )
				this.listSortedInContext[ name ] = [];
		}
	}
};
AOZContext.prototype.getElementInfosFromFilename = function( contextName, filename, type )
{
	var index, name;
	var firstDot = filename.indexOf( '.' );
	if ( firstDot >= 0 )
	{
		index = parseInt( filename.substring( 0, firstDot ) );
		if ( !isNaN( index ) )
		{
			var lastDot = filename.lastIndexOf( '.' );
			if ( lastDot == firstDot )
				name = type + '#' + index;
			else
				name = filename.substring( firstDot + 1, lastDot );
		}
		else
		{
			name = filename.substring( 0, firstDot );
			index = this.getFreeIndex( contextName )
		}
	}
	else
	{
		name = filename;
		index = this.getFreeIndex( contextName )
	}
	return { name: name, index: index };
};
AOZContext.prototype.getFreeIndex = function( contextName )
{
	contextName = contextName ? contextName : this.domain;
	for ( var index = 1; index < 1000000; index++ )
	{
		if ( !this.list[ contextName + ':' + index ] )
			return index;
	}
	return -1;
};
AOZContext.prototype.getElement = function( contextName, index, errorString )
{
	if ( typeof index == 'number' )
	{
		if ( index < 0 )
			throw 'illegal_function_call';

		contextName = contextName ? contextName : this.domain;
		var contextIndex = contextName + ':' + index;
		if ( this.list[ contextIndex ] )
			return this.list[ contextIndex ];
	}
	else
	{
		contextName = contextName ? contextName : this.domain;
		var contextIndex = contextName + ':' + index;
		if ( this.listNames[ contextIndex ] )
			return this.listNames[ contextIndex ];
	}
	if ( errorString )
		throw errorString;
	return null;
};
AOZContext.prototype.getProperty = function( contextName, index, propertyName, errorString )
{
	var element = this.getElement( contextName, index, errorString );
	if ( element )
		return element[ propertyName ];
	return undefined;
};
AOZContext.prototype.setProperty = function( contextName, index, propertyName, value, errorString )
{
	var element = this.getElement( contextName, index, errorString );
	if ( element )
		element[ propertyName ] = value;
	return element;
};
AOZContext.prototype.setRangeProperties = function( contextName, first, last, propertyName, value, errorString )
{
	first = typeof first == 'undefined' ? 0 : first;
	if ( typeof last == 'undefined' )
	{
		if ( first == 0 )
		{
			this.reset( contextName );
			return;
		}
		last = this.getNumberOfElements( contextName );
	}
	if ( typeof first == 'number' && typeof last == 'number' )
	{
		if ( last < first )
			throw 'illegal_function_call';

		for ( var count = first; count < last; count++ )
		{
			var element = this.getElement( contextName, index, errorString );
			if ( element )
				element[ propertyName ] = value;
		}
		return;
	}
	throw 'type_mismatch';

};
AOZContext.prototype.setElement = function( contextName, element, index, replace = true, errorString = 'internal_error' )
{
	if ( typeof index == 'number' && index < 0 )
		throw 'illegal_function_call';

	contextName = contextName ? contextName : this.domain;
	if ( typeof index == 'undefined' )
		index = this.getLastIndex( contextName );
	var contextIndex = contextName + ':' + index;
	var contextIndexName;
	if ( element.name )
		contextIndexName = contextName + ':' + element.name;
	else
	{
		element.name = 'item_' + Math.random() * 1000000;
		contextIndexName = contextName + ':' + element.name;
	}
	if ( this.list[ contextIndex ] )
	{
		if ( !replace )
		{
			if ( errorString && errorString != '' ) throw errorString;
			console.log( 'AOZContext:setElement failed.' );
			return -1;
		}
		this.deleteElement( contextName, index );
	}

	// Insert data into element
	element.index = index;
	element.indexIsNumber = ( typeof index == 'number' );
	element.contextIndex = contextIndex;
	element.contextIndexName = contextIndexName;
	element.contextName = contextName;
	this.list[ contextIndex ] = element;
	this.listNames[ contextIndexName ] = element;
	this.numberOfElements++;
	this.numberOfElementsInContext[ contextName ]++;

	// Position in sorted list
	if ( this.options.sorted )
	{
		element.indexSorted = this.listSorted.length;
		this.listSorted.push( element );
		element.indexSortedInContext = this.listSortedInContext[ contextName ].length;
		this.listSortedInContext[ contextName ].push( element );
	}
	return index;
};
AOZContext.prototype.addElement = function( contextName, element, errorString = 'internal_error' )
{
	var index = this.numberOfElementsInContext[ contextName ];
	this.setElement( contextName, element, this.numberOfElementsInContext[ contextName ], false, errorString );
	return index;
};
AOZContext.prototype.deleteElement = function( contextName, index, errorString )
{
	if ( typeof index == 'number' && index < 0 )
		throw 'illegal_function_call';
	contextName = contextName ? contextName : this.domain;
	var contextIndex, contextIndexName;

	if ( this.aoz.utilities.isObject( index ) )
	{
		var found;
		for ( var e in this.list )
		{
			if ( this.list[ e ] == index )
				found = e;
		}
		if ( found )
		{
			contextIndexName = contextName + ':' + found.contextName;
			contextIndex = contextName + ':' + found.contextIndex;
		}
		else
		{
			if ( errorString ) throw errorString;
			return;	
		}
	}
	else if ( typeof index == 'string' )
	{
		contextIndexName = contextName + ':' + index;
		contextIndex = contextName + ':' + this.listNames[ contextIndexName ].index;
	}
	else
	{
		contextIndex = contextName + ':' + index;
		contextIndexName = contextName + ':' + this.list[ contextIndex ].name;
	}
	var element = this.list[ contextIndex ];
	if ( !element )
	{
		if ( errorString ) throw errorString;
		return;
	}
	this.list = this.aoz.utilities.cleanObject( this.list, contextIndex );
	this.listNames = this.aoz.utilities.cleanObject( this.listNames, contextIndexName );

	if ( this.options.sorted )
	{
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
		for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;	
	}
	this.numberOfElements--;
	this.numberOfElementsInContext[ contextName ]--;
};
AOZContext.prototype.deleteRange = function( contextName, first, last )
{
	first = typeof first == 'undefined' ? 0 : first;
	if ( typeof last == 'undefined' )
	{
		if ( typeof first == 'number' && first == 0 )
		{
			this.reset( contextName );
			return;
		}
		last = this.getNumberOfElements();
	}
	if ( typeof first == 'number' && typeof last == 'number' )
	{
		if ( last < first )
			throw 'illegal_function_call';

		for ( var count = first; count < last; count++ )
			this.deleteElement( contextName, count );
		return;
	}
	throw 'type_mismatch';
};
AOZContext.prototype.isAny = function( contextName )
{
	if ( contextName )
		return this.numberOfElementsInContext[ contextName ] > 0;
	return this.numberOfElements > 0;
};
AOZContext.prototype.getNumberOfElements = function( contextName )
{
	if ( contextName )
		return this.numberOfElementsInContext[ contextName ];
	return this.numberOfElements;
};
AOZContext.prototype.getFirstElement = function( contextName )
{
	if ( this.options.sorted )
	{
		var element = null;
		if ( contextName && this.listSortedInContext[ contextName ].length > 0 )
			element = this.listSortedInContext[ contextName ][ 0 ];
		else if ( this.listSorted.length > 0 )
			element = this.listSorted[ 0 ];
		this.getFirstIndex = element ? element.indexSorted : undefined;
		this.getFirstIndexInContext = element ? element.indexSortedInContext : undefined;
		return element;
	}
	else
	{
		this.flatList = this.aoz.utilities.flattenObject( this.list );
		this.getFirstIndex = 0;
		return this.flatList[ this.getFirstIndex ];
	}
};
AOZContext.prototype.getLastElement = function( contextName )
{
	if ( this.options.sorted )
	{
		var element = null;
		if ( contextName && this.listSortedInContext[ contextName ].length > 0 )
			element = this.listSortedInContext[ contextName ][ this.listSortedInContext[ contextName ].length - 1 ];
		else if ( this.listSorted.length > 0 )
			element = this.listSorted[ this.listSorted.length - 1 ];
		this.getLastIndex = element ? element.indexSorted : undefined;
		this.getLastIndexInContext = element ? element.indexSortedInContext : undefined ;
		return element;
	}
	else
	{
		this.flatList = this.aoz.utilities.flattenObject( this.list );
		this.getLastIndex = this.flatList.length - 1;
		return this.flatList[ this.getLastIndex ];
	}
};
AOZContext.prototype.getNextElement = function( contextName )
{
	if ( typeof this.getFirstIndex == 'undefined' )
		return null;

	if ( this.options.sorted )
	{
		if ( contextName && this.getFirstIndex < this.listSortedInContext[ contextName ].length - 1 )
			return this.listSortedInContext[ contextName ][ ++this.getFirstIndex ];
		else if ( this.getFirstIndex < this.listSorted.length - 1 )
			return this.listSorted[ ++this.getFirstIndex ];
	}
	else if ( this.getFirstIndex < this.flatList.length - 1 )
	{
		return this.flatList[ ++this.getFirstIndex ];
	}
	this.getFirstIndex = undefined;
	return null;
};
AOZContext.prototype.getPreviousElement = function( contextName )
{
	if ( !this.getLastIndex )
		return null;

	if ( this.getLastIndex > 0 )
	{
		if ( this.options.sorted )
		{
			if ( contextName )
				return this.listSortedInContext[ contextName ][ --this.getLastIndex ];
			else
				return this.listSorted[ --this.getLasttIndex ];
		}
		else
		{
			return this.flatList[ --this.getLastIndex ];
		}
	}
	this.getLastIndex = undefined;
	return null;
};
AOZContext.prototype.sort = function( contextName, sortFunction )
{
	if ( typeof sortFunction == 'undefined' )
		sortFunction = sortIndex;
	if ( contextName )
	{
		this.listSortedInContext[ contextName ].sort( sortFunction );
		for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
	}
	this.listSorted.sort( sortFunction );
	for ( var i = 0; i < this.listSorted.length; i++ )
		this.listSorted[ i ].indexSorted = i;

	function sortIndex( a, b )
	{
		if ( a.indexIsNumber && b.indexIsNumber )
		{
			if ( a.index < b.index ) return -1;
			if ( a.index > b.index ) return 1;
			return 0;
		}
		return 0;
	}
};
AOZContext.prototype.parseAll = function( contextName, callback )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{
			for ( var index = 0; index < this.listSortedInContext[ contextName ].length; index++ )
				callback( this.listSortedInContext[ contextName ][ index ] );
		}
		else
		{
			for ( var index = 0; index < this.listSorted.length; index++ )
				callback( this.listSorted[ index ] );
		}
	}
	else
	{
		for ( var index in this.list )
			callback( this.list[ index ] );
	}
};
AOZContext.prototype.moveToStart = function( contextName, element )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{			
			this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
			this.listSortedInContext[ contextName ].unshift( element );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSorted.unshift( element );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveToEnd = function( contextName, element )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{			
			this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
			this.listSortedInContext[ contextName ].push( element );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSorted.push( element );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveAfter = function( contextName, source, destination )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{			
			this.listSortedInContext[ contextName ].splice( source.indexSortedInContext, 1 );
			if ( source.indexSortedInContext < destination.indexSortedInContext )
				this.listSortedInContext[ contextName ].splice( destination.indexSortedInContext, 0, source );
			else
				this.listSortedInContext[ contextName ].splice( destination.indexSortedInContext + 1, 0, source );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted[ contextName ].splice( source.indexSorted, 1 );
		if ( source.indexSorted < destination.indexSorted )
			this.listSorted[ contextName ].splice( destination.indexSorted, 0, source );
		else
			this.listSorted[ contextName ].splice( destination.indexSorted + 1, 0, source );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveBefore = function( contextName, source, destination )
{
	if ( this.options.sorted )
	{
		var result = [];
		if ( contextName )
		{			
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			{
				var element = this.listSortedInContext[ contextName ][ i ];
				if ( element == destination )
				{
					source.indexSortedInContext = result.length;
					result.push( source );
					destination.indexSortedInContext = result.length;
					result.push( destination );
				}
				else if ( element != source )
				{
					element.indexSortedInContext = result.length;
					result.push( source );
				}
			}
			this.listSortedInContext[ contextName ] = result;
			result = [];
		}
		for ( var i = 0; i < this.listSorted.length; i++ )
		{
			var element = this.listSorted[ i ];
			if ( element == destination )
			{
				source.indexSorted = result.length;
				result.push( source );
				destination.indexSorted = result.length;
				result.push( destination );
			}
			else if ( element != source )
			{
				element.indexSorted = result.length;
				result.push( source );
			}
		}
		this.listSorted = result;
	}
};


