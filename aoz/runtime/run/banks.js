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
 * AOZ Runtume
 *
 * Banks.
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 28/02/2018
 */
function Banks( aoz )
{
	this.aoz = aoz;
	this.aoz.banks = this;
	this.utilities = aoz.utilities;
	this.manifest = aoz.manifest;
	this.banks = [];
	this.quickBanks = {};
	this.numberOfSoundsToPreload = typeof this.aoz.manifest.sounds.numberOfSoundsToPreload == 'undefined' ? 4 : this.aoz.manifest.sounds.numberOfSoundsToPreload;
	this.soundPoolSize = this.aoz.manifest.sounds.soundPoolSize;
	this.numberOfReserves = 0;

INSERT_CODE

	// Poke the indexes and reservation numbers.
	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] )
		{
			for ( var c in this.banks[ b ] )
			{
				var bank = this.banks[ b ][ c ];
				if ( bank )
				{
					bank.index = b;
					bank.reserveNumber = this.numberOfReserves++;
				}
			}
		}
	}
};

Banks.prototype.reserve = function( number, type, length, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( number < 0 )
		throw 'illegal_function_call';
	if ( !this.manifest.unlimitedBanks && number > 16 )
		throw 'illegal_function_call';

	var length = typeof length == 'undefined' ? 0 : length;
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( !type || type == '' )
		throw 'illegal_function_call';

	var bank = this.banks[ number ];
	if ( !bank )
		this.banks[ number ] = {};
	type = type.toLowerCase();
	var bank, copyBlock = false;
	switch ( type )
	{
		case 'images':
			bank = new ImageBank( this.aoz, [], this.aoz.manifest.default.screen.palette, { domain: type, type: type } );
			break;
		case 'icons':
			bank = new ImageBank( this.aoz, [], this.aoz.manifest.default.screen.palette, { domain: type, type: type } );
			break;
		case 'musics':
			bank = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'samples':
			bank = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'picpac':
		case 'amal':
			bank = new DataBank( this.aoz, undefined, 0, { domain: type, type: type } );
			break;
		case 'work':
		case 'tracker':
		case 'data':
		default:
			bank = new DataBank( this.aoz, undefined, length, { domain: type, type: type } );
			copyBlock = true;
			break;
	}
	bank.reserveNumber = this.numberOfReserves++;
	bank.index = number;
	this.banks[ number ][ contextName ] = bank;
	this.quickBanks[ contextName ] = {};
	return bank;
};
Banks.prototype.erase = function( bankIndex, noError, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( bankIndex < 1 || ( !this.manifest.unlimitedBanks && bankIndex > 16 ) )
	{
		if ( !noError )
			throw 'illegal_function_call';
		return;
	}

	if ( !this.banks[ bankIndex ] || !this.banks[ bankIndex ][ contextName ] )
	{
		if ( !noError )
			throw 'bank_not_reserved';
		return;
	}
	this.getBank( bankIndex, contextName ).erase();
	this.banks[ bankIndex ] = this.utilities.cleanObject( this.banks[ bankIndex ], contextName );
	this.quickBanks[ contextName ] = {};
};
Banks.prototype.eraseTemp = function( bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] && this.banks[ b ][ contextName ] )
		{
			var bank = this.banks[ b ][ contextName ];
			if ( bank.isType( 'work' ) )
			{
				this.erase( b, contextName );
				this.updateBank( null, b, contextName );
			}
		}
	}
};
Banks.prototype.eraseAll = function( bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] && this.banks[ b ][ contextName ] )
		{
			this.erase( b, contextName );
			this.updateBank( null, b, contextName );
		}
	}
};
Banks.prototype.updateBank = function( bank, bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	this.aoz.screensContext.parseAll( contextName, function( screen )
	{
		screen.updateBank( bank, bankIndex, contextName )
	} );
	if ( this.aoz.sprites )
	{
		this.aoz.sprites.updateBank( bank, bankIndex, contextName );
	}
};
Banks.prototype.bankShrink = function( bankIndex, newLength, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	var bank = this.getBank( bankIndex, contextName );
	bank.setLength( newLength );
	this.updateBank( bank, bankIndex, contextName );
};
Banks.prototype.bankSwap = function( bankIndex1, bankIndex2, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( bankIndex1 < 1 || bankIndex2 < 1 || typeof bankIndex1 == 'undefined' || typeof bankIndex2 == 'undefined' )
		throw 'illegal_function_call';
	if ( !this.manifest.unlimitedBanks && ( bankIndex1 > 16 || bankIndex2 > 16 ) )
		throw 'illegal_function_call';

	if ( !this.banks[ bankIndex1 ][ contextName ] || !this.banks[ bankIndex2 ][ contextName ] )
		throw 'bank_not_reserved';

	// Swap!
	var bank1 = this.banks[ bankIndex1 ][ contextName ];
	var bank2 = this.banks[ bankIndex2 ][ contextName ];
	this.banks[ bankIndex1 ][ contextName ] = bank2;
	this.banks[ bankIndex2 ][ contextName ] = bank1;
	bank2.index = bankIndex1;
	bank1.index = bankIndex2;

	// Update banks
	this.updateBank( bank1, bank1.index, contextName );
	this.updateBank( bank2, bank2.index, contextName );
};
Banks.prototype.getBank = function( bankIndex, contextName, bankType )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( typeof bankIndex == 'undefined' )
	{
		if ( typeof bankType == 'undefined' )
			throw 'illegal_function_call';
		if ( bankType == 'images' || bankType == 'icons' || bankType == 'musics' || bankType == 'samples' || bankType == 'amal' )
		{
			if ( this.quickBanks[ contextName ] && this.quickBanks[ contextName ][ bankType ] )
				return this.quickBanks[ contextName ][ bankType ];
			for ( var b = 0; b < this.banks.length; b++ )
			{
				if ( this.banks[ b ] )
				{
					var bank = this.banks[ b ][ contextName ];
					if ( bank && bank.isType( bankType ) )
					{
						this.quickBanks[ contextName ][ bankType ] = bank;
						return bank;
					}
				}
			}
		}
		throw 'bank_not_defined';
	}
	if ( bankIndex < 1 )
		throw 'illegal_function_call';
	if ( !this.manifest.unlimitedBanks && bankIndex > 16 )
		throw 'illegal_function_call';

	if ( !this.banks[ bankIndex ] )
		throw 'bank_not_reserved';
	var bank = this.banks[ bankIndex ][ contextName ];
	if ( !bank )
		throw 'bank_not_reserved';
	if ( bankType && !bank.isType( bankType ))
		throw 'bank_type_mismatch';
	return bank;
};
Banks.prototype.getBankElement = function( bankIndex, elementNumber, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName ).getElement( elementNumber );
};
Banks.prototype.getStart = function( bankIndex, contextName, elementNumber )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	elementNumber = typeof elementNumber == 'undefined' ? 1 : elementNumber;
	var bank = this.getBank( bankIndex, contextName );
	if ( bank.type == 'tracker' || bank.type == 'data' || bank.type == 'work' )
		return bank.getElement( elementNumber ).memoryHash * this.aoz.memoryHashMultiplier;
	throw 'bank_type_mismatch';
};
Banks.prototype.getLength = function( bankIndex, contextName )
{
	return this.getBank( bankIndex, contextName ).getLength();
};
Banks.prototype.listBank = function( contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] )
		{
			var bank = this.banks[ b ][ contextName ];
			if ( bank && bank.getLength() )
			{
				this.aoz.currentScreen.currentTextWindow.printUsing( '###', [ b ], false );
				this.aoz.currentScreen.currentTextWindow.print( ' - ', false );
				this.aoz.currentScreen.currentTextWindow.printUsing( '~~~~~~~~~~~~~~~~~ L: ', [ bank.domain ], false );
				this.aoz.currentScreen.currentTextWindow.print( '' + bank.getLength(), true );
			}
		}
	}
};
Banks.prototype.loadFileToBank = function( pathOrDescriptor, bankIndex, bankType, options, callback, extra )
{
	options = typeof options == 'undefined' ? options : {};
	var contextName = typeof options.contextName == 'undefined' ? this.aoz.currentContextName : options.contextName;

	var descriptor;
	if ( typeof pathOrDescriptor == 'string' )
	{
		descriptor = this.aoz.filesystem.getFile( pathOrDescriptor );
		if ( descriptor.filename == '' )
			callback( false, 'illegal_function_call', extra );		
	}
	else	
	{ 
		descriptor = pathOrDescriptor;
	}

	var self = this;
	this.aoz.filesystem.loadFile( descriptor, { binary: true }, function( response, arrayBuffer, extra )
	{
		if ( response )
		{
			var block = self.aoz.allocMemoryBlock( arrayBuffer, 'big' );
			var bank = self.aoz.banks.reserve( bankIndex, bankType, block.length, contextName );
			var elementIndex = typeof options.elementIndex == 'undefined' ? 1 : options.elementIndex;
			if ( elementIndex < 0 )
			{
				callback( false, 'illegal_function_call', extra );
				return;
			}
			block.filename = descriptor.name;
			bank.setElement( elementIndex, block );
			callback( true, bank, extra );
		}
		else
		{
			callback( false, 'cannot_load_file', extra );
		}
	}, extra );
};

///////////////////////////////////////////////////////////////////////////
// IMAGE / ICONS BANK
///////////////////////////////////////////////////////////////////////////
Banks.prototype.getImage = function( bankName, index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getElement( index );
};
Banks.prototype.setImageHotSpot = function( bankName, index, position, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).setHotSpot( index, position );
};
Banks.prototype.insertImage = function( bankName, index, name, tags, contextName, bankIndex, canvas )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	bank = this.getBank( bankIndex, contextName, bankName );
	bank.add( index, name, tags );
	if ( canvas )
		bank.setElement( index, canvas );
};
Banks.prototype.insertImageRange = function( bankName, first, last, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).addRange( first, last, tags );
};
Banks.prototype.insertImageFromArray = function( bankName, arrayIndex, arrayNames, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	arrayNames = typeof arrayNames == 'undefined' ? {} : arrayNames;
	for ( var i in arrayIndex )
		bank.add( arrayIndex[ i ], arrayNames[ i ], tags );
};
Banks.prototype.setImageCanvas = function( bankName, index, canvas, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, bankName ).getElement( index ).setElement( canvas, tags );
};
Banks.prototype.deleteImage = function( bankName, index, contextName, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	if ( typeof index == 'undefined' )
		bank.reset();
	else
		bank.delete( index );
};
Banks.prototype.deleteImageRange = function( bankName, first, last, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	if ( typeof first == 'undefined' && typeof last == 'undefined' )
		bank.reset();
	else
	{
		last = typeof last != 'undefined' ? last : first + 1;
		bank.deleteRange( first, last );
	}
};
Banks.prototype.deleteImagesFromArray = function( bankName, _array, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	for ( var i in _array )
		bank.delete( _array[ i ] );
};
Banks.prototype.getImagePalette = function( bankName, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, bankName ).getPalette();
};
Banks.prototype.processMask = function( bankName, index, onOff, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, bankName );
	var from = onOff ? { r: 0, g: 0, b: 0, a: 255 } : { r: 0, g: 0, b: 0, a: 0 };
	var to = onOff ? { r: 0, g: 0, b: 0, a: 0 } : { r: 0, g: 0, b: 0, a: 255 };
	if ( typeof number != 'undefined' )
	{
		var element = bank.getElement( index );
		var canvas = element.getCanvas();
		var context = canvas.getContext( '2d' );
		this.utilities.remapBlock( context, [ from ], [ to ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );
	}
	else
	{
		var self = this;
		bank.context.parseAll( contextName, function( element )
		{
			var canvas = element.getCanvas();
			var context = canvas.getContext( '2d' );
			self.utilities.remapBlock( context, [ from ], [ to ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );
		} );
	}
};


function ImageBank( aoz, imageList, palette, options )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	this.palette = palette;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( imageList )
		this.loadList( imageList, options.tags );
};
ImageBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
ImageBank.prototype.loadList = function( imageList, tags )
{
	var self = this;
	tags = typeof tags == 'undefined' ? '' : tags;
	for ( var i = 0; i < imageList.length; i++ )
	{
		this.aoz.loadingMax++;
		var infos = this.context.getElementInfosFromFilename( this.domain, imageList[ i ], 'image' );
		infos.path = './resources/' + this.path + '/' + imageList[ i ];
		this.utilities.loadUnlockedImage( infos.path, 'image/png', {}, function( response, imageLoaded, extra )
		{
			if ( response )
			{
				// Set color 0 transparent
				var image = self.utilities.makeTransparentImage( imageLoaded );
				var image =
				{
					aoz: self.aoz,
					name: extra.name,
					path: extra.path,
					canvas: image,
					width: image.width,
					height: image.height,
					hotSpotX: 0,
					hotSpotY: 0,
					collisionMaskPrecision: self.aoz.manifest.sprites.collisionPrecision,
					collisionMaskAlphaThreshold: self.aoz.manifest.sprites.collisionAlphaThreshold,
					getCanvas: self.getImageCanvas
				};
				self.context.setElement( this.domain, image, extra.index, true );
				self.setTags( extra.index, tags );
			}
			self.aoz.loadingCount++;
		}, infos );
	}
};
ImageBank.prototype.load = function( index, name, path, width, height, tags )
{
	var self = this;
	var infos = this.utilities.getElementInfosFromFilename( this.domain, path, 'image' );
	index = typeof index == 'undefined' ? infos.index : index;
	name = typeof name == 'undefined' ? infos.name : name;
	var image = new Image();
	this.aoz.loadingMax++;
	image.onload = function()
	{
		var canvas = document.createElement( 'canvas' );
		canvas.width = typeof width != 'undefined' ? width : this.width;
		canvas.height = typeof height != 'undefined' ? height : this.height;
		var context = canvas.getContext( '2d' );
		context.imageSmoothingEnabled = self.utilities.isTag( tags, [ 'smooth' ] )
		context.drawImage( this, 0, 0 );
		var newImage =
		{
			aoz: self.aoz,
			name: name,
			canvas: canvas,
			width: canvas.width,
			height: canvas.height,
			hotSpotX: 0,
			hotSpotY: 0,
			collisionMaskPrecision: self.collisionPrecision,
			collisionMaskAlphaThreshold: self.collisionAlphaThreshold,
			getCanvas: self.getImageCanvas
		}
		self.context.setElement( this.domain, newImage, index, true );
		self.setTags( index, tags );
		this.aoz.loadingCount++;
	};
	image.src = path;
};
ImageBank.prototype.add = function( index, tags )
{
	var name;
	if ( typeof index == 'string' )
		name = index;
	else
		name = 'image#' + index;
	var image =
	{
		aoz: this.aoz,
		name: name,
		canvas: null,
		width: 0,
		height: 0,
		hotSpotX: 0,
		hotSpotY: 0,
		collisionMaskPrecision: this.collisionPrecision,
		collisionMaskAlphaThreshold: this.collisionAlphaThreshold,
		getCanvas: this.getImageCanvas,
		getCollisionMask: this.getCollisionMask
	}
	this.context.setElement( this.domain, image, index, true );
	this.setTags( image, tags );
	return image;
};
ImageBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last =='undefined' ? first + 1 : last;
	if ( last < first )
		throw 'illegal_function_call';

	var result = [];
	for ( var count = first; count < last; count++ )
	{
		result.push( this.add( count, tags ) );
	}
	return result;
};
ImageBank.prototype.getImageCanvas =  function( hRev, vRev )
{
	if ( typeof vRev == 'undefined' )
	{
		vRev = ( hRev & 0x4000 ) != 0;
		hRev = ( hRev & 0x8000 ) != 0;
	}
	var canvas = this.canvas;
	if ( canvas )
	{
		if ( hRev || vRev )
		{
			if ( hRev && vRev )
			{
				if ( !this.canvasRev )
					this.canvasRev = this.aoz.utilities.flipCanvas( this.canvas, true, true );
				canvas = this.canvasRev;
			}
			else if ( hRev )
			{
				if ( !this.canvasHRev )
					this.canvasHRev = this.aoz.utilities.flipCanvas( this.canvas, true, false );
				canvas = this.canvasHRev;
			}
			else
			{
				if ( !this.canvasVRev )
					this.canvasVRev = this.aoz.utilities.flipCanvas( this.canvas, false, true );
				canvas = this.canvasVRev;
			}
		}
	}
	return canvas;
};
ImageBank.prototype.getCollisionMask = function( image )
{
	// Note: we are in the "image" context ;)
	if ( !this.collisionMask )
	{
		var context = this.canvas.getContext( '2d' );
		var dataView = context.getImageData( 0, 0, this.width, this.height );

		this.collisionMask = dataView;
		this.collisionMaskWidth = image.width;
		this.collisionMaskHeight = image.height;
		this.collisionMaskPrecision = 1;
	}
	return { mask: this.collisionMask, width: this.collisionMaskWidth, height: this.collisionMaskHeight, precision: this.collisionMaskPrecision };
};
ImageBank.prototype.getLength = function()
{
	return this.context.getNumberOfElements( this.domain );
};
ImageBank.prototype.setLength = function()
{
	throw 'illegal_function_call';
};
ImageBank.prototype.setElement = function( index, canvas, tags )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	image.canvas = canvas;
	image.width = canvas.width;
	image.height = canvas.height;
	image.canvasRev = null;
	image.canvasHRev = null;
	image.canvasVRev = null;
};
ImageBank.prototype.getElement = function( index )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	if ( image.canvas )
		return image;
	throw 'image_not_defined';
};
ImageBank.prototype.getPalette = function()
{
	return this.palette;
};
ImageBank.prototype.reset = function()
{
	this.context.reset( this.domain );
};
ImageBank.prototype.delete = function( index )
{
	this.context.deleteElement( this.domain, index );
};
ImageBank.prototype.deleteRange = function( first, last )
{
	this.context.deleteRange( this.domain, first, last );
};
ImageBank.prototype.setTags = function( index, tags )
{
	if ( tags )
	{
		var image = this.context.getElement( this.domain, index, 'image_not_defined' );
		if ( this.utilities.isTag( tags, [ 'hotSpotX', 'hotSpotY' ] ) )
		{
			var x = this.utilities.getTagParameter( tags, 'hotSpotX' );
			if ( typeof x == 'string' )
			{
				switch ( x )
				{
					case 'left':
						image.hotSpotX = 0;
						break;
					case 'center':
						image.hotSpotX = image.width / 2;
						break;
					case 'right':
						image.hotSpotX = image.width;
						break;
				}
			}
			else if ( typeof x == 'number' )
			{
				image.hotSpotX = x;
			}

			var y = this.utilities.getTagParameter( tags, 'hotSpotY' );
			if ( typeof y == 'string' )
			{
				switch ( y )
				{
					case 'top':
						image.hotSpotY = 0;
						break;
					case 'middle':
						image.hotSpotY = image.height / 2;
						break;
					case 'bottom':
						image.hotSpotY = image.height;
						break;
				}
			}
			else if ( typeof y == 'number' )
			{
				image.hotSpotY = y;
			}
		}
	}
};
ImageBank.prototype.setHotSpot = function( index, position )
{
	var image = this.context.getElement( this.domain, index, 'image_not_defined' );
	if ( position.x == 'mask' )
	{
		switch ( ( position.y & 0x70 ) >> 4 )
		{
			case 0:
				image.hotSpotX = 0;
				break;
			case 1:
				image.hotSpotX = image.width / 2;
				break;
			case 2:
				image.hotSpotX = image.width;
				break;
		}
		switch ( position.y & 0x07 )
		{
			case 0:
				image.hotSpotY = 0;
				break;
			case 1:
				image.hotSpotY = image.height / 2;
				break;
			case 2:
				image.hotSpotY = image.height;
				break;
		}
	}
	else
	{
		if ( typeof position.x != 'undefined' )
			image.hotSpotX = position.x;
		if ( typeof position.y != 'undefined' )
			image.hotSpotY = position.y;
	}
};
ImageBank.prototype.erase = function( index )
{
};


//////////////////////////////////////////////////////////////////////////
//
// SOUND BANK
//
//////////////////////////////////////////////////////////////////////////
Banks.prototype.getSound = function( index, callback, extra, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	var sample = bank.getElement( index );

	// A free sound?
	var sound;
	for ( var s = 0; s < sample.sounds.length; s++ )
	{
		sound = sample.sounds[ s ];
		if ( sound && !sound.playing() )
		{
			callback( true, sound, extra );
			return;
		}
	}

	// Load a new one?
	if ( sample.sounds.length < this.soundPoolSize && sample.filename )
	{
		this.utilities.loadUnlockedSound( sample.pathname, { keepSource: true }, function( response, soundLoaded, number )
		{
			if ( response )
			{
				//for ( var i = 0; i < this.banks.numberOfSoundsToPreload; i++ )
				//	sample.sounds[ i ] = new p5.SoundFile();
				sample.sounds.push( soundLoaded );
				callback( true, soundLoaded, extra );
				return;
			}
			callback( false, null, extra );
		}, s );
		return;
	}
	callback( false, null, extra );
};
Banks.prototype.insertSample = function( index, name, tags, sample, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	bank.add( index, name, tags );
	if ( typeof sample != 'undefined' )
		bank.setElement( index, sample, tags );
};
Banks.prototype.insertSampleRange = function( first, last, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'samples' ).addRange( first, last, tags );
};
Banks.prototype.deleteSample = function( index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'samples' ).delete( index );
};
Banks.prototype.deleteSampleRange = function( first, last, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'samples' );
	if ( typeof first == 'undefined' && typeof last == 'undefined' )
	{
		bank.reset( this.domain );
	}
	else
	{
		last = typeof last != 'undefined' ? last : first + 1;
		bank.deleteRange( first, last );
	}
};

function SampleBank( aoz, soundList, soundTypesList, options )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( soundList )
		this.loadList( soundList, soundTypesList, options.tags );
};
SampleBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
SampleBank.prototype.loadList = function( soundList, soundTypesList, tags )
{
	var self = this;
	tags = typeof tags == 'undefined' ? '' : tags;
	for ( var i = 0; i < soundList.length; i++ )
	{
		var element = soundList[ i ];
		var infos = this.context.getElementInfosFromFilename( this.domain, element.a, this.type );
		infos.path = './resources/' + this.path + '/' + element.a;
		infos.filename = element.b;
		this.aoz.loadingMax++;
		this.utilities.loadMultipleUnlockedSound( infos.path, this.banks.numberOfSoundsToPreload, { }, function( response, soundsLoaded, extra )
		{
			if ( response )
			{
				var sound =
				{
					name: extra.name,
					filename: extra.filename,
					path: extra.path,
					sounds: soundsLoaded,
				};
				self.context.setElement( this.domain, sound, extra.index, true );
				if ( typeof tags != 'undefined' )
					self.setTags( extra.index, tags );
			}
			self.aoz.loadingCount++;
		}, infos );
	}
};
SampleBank.prototype.load = function( index, name, path, type, tags )
{
	// TODO
};
SampleBank.prototype.add = function( index, name, tags )
{
	if ( typeof name == 'undefined' )
	{
		if ( typeof index == 'string' )
			name = index;
		else
			name = 'sound#' + index;
	}
	var sample =
	{
		name: name,
		filename: '',
		sounds: []
	}
	this.context.setElement( this.domain, sample, index, true );
	if ( typeof tags != 'undefined' )
		this.setTags( index, tags );
	return sample;
};
SampleBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last == 'undefined' ? first + 1 : last;
	if ( last < first || first < 0 || last < 0 )
		throw 'illegal_function_call';
	var result = [];
	for ( var index = first; index < last; index++ )
	{
		var sample =
		{
			name: 'sound#' + index,
			filename: '',
			sounds: []
		}
		result.push( sample );
		//for ( var i = 0; i < this.banks.numberOfSoundsToPreload; i++ )
		//	sample.sounds[ i ] = new p5.SoundFile();
		this.context.setElement( this.domain, sample, index, true );
		this.setTags( index, tags );
	}
	return result;
};
SampleBank.prototype.setElement = function( index, sound, tags )
{
	this.context.getElement( this.domain, index, 'sound_not_defined' ).sounds = [ sound ];
	this.setTags( index, tags );
};
SampleBank.prototype.getElement = function( index )
{
	return this.context.getElement( this.domain, index, 'sound_not_defined' );
};
SampleBank.prototype.getLength = function()
{
	return this.context.getNumberOfElements( this.domain );
};
SampleBank.prototype.setLength = function()
{
	throw 'illegal_function_call';
};
SampleBank.prototype.reset = function()
{
	return this.context.reset( this.domain );
};
SampleBank.prototype.delete = function( index )
{
	return this.context.deleteElement( this.domain, index );
};
SampleBank.prototype.deleteRange = function( first, last )
{
	return this.context.deleteRange( this.domain, first, last );
};
SampleBank.prototype.setTags = function( index, tags )
{
};
SampleBank.prototype.erase = function( index )
{
};




function DataBank( aoz, loadList, length, options )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.options = options;
	this.domain = options.domain;
	this.type = options.type;
	this.path = options.path;
	this.context = new AOZContext( this.aoz, this.domain, {} );
	if ( loadList )
		this.loadList( loadList, options.tags );
	else if ( length > 0 )
		this.context.setElement( this.domain, this.aoz.allocMemoryBlock( length, this.aoz.manifest.compilation.endian ), 1, true );
};
DataBank.prototype.isType = function( types )
{
	if ( typeof types == 'string' )
		types = [ types ];
	for ( var t = 0; t < types.length; t++ )
	{
		if ( types[ t ] == this.type )
			return true;
	}
	return false;
};
DataBank.prototype.getElement = function( index )
{
	var element = this.context.getElement( this.domain, index, 'bank_element_not_defined' );
	if ( element.aoz )
		return element;
	throw 'bank_element_not_defined';
};
DataBank.prototype.loadList = function( loadList, tags )
{
	var self = this;
	tags = typeof tags == 'undefined' ? '' : tags;
	for ( var i = 0; i < loadList.length; i++ )
	{
		var element = loadList[ i ];
		var infos = this.context.getElementInfosFromFilename( this.domain, element.a, this.type );
		infos.path = './resources/' + this.path + '/' + element.a;
		infos.filename = element.b;
		this.utilities.loadUnlockedBankElement( infos.path, infos, function( response, data, extra )
		{
			if ( response )
			{
				var block = self.aoz.allocMemoryBlock( data, self.aoz.manifest.compilation.endian );
				block.path = extra.path;
				block.name = extra.name;
				block.filename = extra.filename;
				self.context.setElement( self.domain, block, extra.index, true );
			}
		}, infos );
	}
};
DataBank.prototype.add = function( index, name )
{
	if ( typeof name == 'undefined' )
	{
		name = typeof index == 'string' ? index : this.domain + '#' + index;
	}
	this.context.setElement( this.domain, { name: name }, index, true );
};
DataBank.prototype.addRange = function( first, last, tags )
{
	last = typeof last == 'undefined' ? first + 1 : last;
	if ( last < first || first < 0 || last < 0 )
		throw 'illegal_function_call';
	for ( var index = first; index < last; index++ )
	{
		this.context.setElement( this.domain, { name: this.domain + '#' + index }, index, true );
	}
};
DataBank.prototype.setElement = function( index, block, tags )
{
	this.context.setElement( this.domain, block, index, true );
};
DataBank.prototype.erase = function()
{
	for ( var block = this.context.getFirstElement( this.domain ); block !=null; block = this.context.getNextElement( this.domain ) )
		this.aoz.freeMemoryBlock( block );
};
DataBank.prototype.delete = function( index )
{
	return this.context.deleteElement( this.domain, index );
};
DataBank.prototype.deleteRange = function( first, last )
{
	return this.context.deleteRange( this.domain, first, last );
};
DataBank.prototype.getLength = function( index )
{
	if ( this.type == 'tracker' )
	{
		if ( typeof index == 'undefined' )
			return this.context.numberOfElements;
		else
			return this.getElement( index ).length;
	}
	var element = this.context.getElement( this.domain, 1 );
	if ( element && element.aoz )
		return element.length;
	return this.context.numberOfElements;
};
DataBank.prototype.setLength = function( newLength )
{
	if ( this.type == 'tracker' )
		throw 'illegal_function_call';
	var element = this.context.getElement( this.domain, 1 );

	// If MemoryBlock
	if ( element && element.aoz )
	{
		element.setLength( newLength );
		return;
	}
	throw 'illegal_function_call';
};
DataBank.prototype.setTags = function( index, tags )
{
};
