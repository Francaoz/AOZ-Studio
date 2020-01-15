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
	this.quickBanks = [];
	this.numberOfSoundsToPreload = typeof this.aoz.manifest.sounds.numberOfSoundsToPreload == 'undefined' ? 4 : this.aoz.manifest.sounds.numberOfSoundsToPreload; 
	this.soundPoolSize = this.aoz.manifest.sounds.soundPoolSize;

INSERT_CODE
};

Banks.prototype.reserve = function( number, type, length, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( number < 0 )
		throw 'illegal_function_call';
	if ( !this.manifest.unlimitedBanks && number > 16 )
		throw 'illegal_function_call';
	length = typeof length == 'undefined' ? 0 : length;
	if ( length < 0 )
		throw 'illegal_function_call';
	if ( !type || type == '' )
		throw 'illegal_function_call';

	var bank = this.banks[ number ];
	if ( !bank )
		this.banks[ number ] = {};
	type = type.toLowerCase();
	switch ( type )
	{
		case 'images':
			this.banks[ number ][ contextName ] = new ImageBank( this.aoz, [], this.aoz.manifest.default.screen.palette, { domaine: type, type: type } );
			break;
		case 'icons':
			this.banks[ number ][ contextName ] = new ImageBank( this.aoz, [], this.aoz.manifest.default.screen.palette, { domain: type, type: type } );
			break;
		case 'musics':
			this.banks[ number ][ contextName ] = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;
		case 'samples':
			this.banks[ number ][ contextName ] = new SampleBank( this.aoz, [], [], { domain: type, type: type } );
			break;	
		case 'picpac':
		case 'amal':
			this.banks[ number ][ contextName ] = new DataBank( this.aoz, undefined, 0, { domain: type, type: type } );
			break;
		case 'work':
		case 'tracker':
		case 'data':
		default:
			this.banks[ number ][ contextName ] = new DataBank( this.aoz, undefined, length, { domain: type, type: type } );
			break;
	}
	this.quickBanks[ contextName ] = [];
	return this.banks[ number ][ contextName ];
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
			if ( this.quickBanks[ contextName ][ bankType ] )
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
Banks.prototype.erase = function( bankIndex, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	if ( bankIndex < 1 )
		throw 'illegal_function_call';
	if ( !this.manifest.unlimitedBanks && bankIndex > 16 )
		throw 'illegal_function_call';

	this.getBank( bankIndex, contextName ).erase();
	if ( !this.banks[ bankIndex ] )
		throw 'bank_not_reserved';
	if ( !this.banks[ bankIndex ][ contextName ] )
		throw 'bank_not_reserved';
	this.banks[ bankIndex ] = this.utilities.cleanObject( this.banks[ bankIndex ], contextName );
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
	var result = '';
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	for ( var b = 0; b < this.banks.length; b++ )
	{
		if ( this.banks[ b ] )
		{
			var bank = this.banks[ b ][ contextName ];
			if ( bank )
			{
/*				
				switch ( bank.domain )
				{
					case 'images':
					case 'icons':
					case 'samples':
					case 'musics':
					case 'amal':
						result = ' ' + b + ' - ' + bank.domain + '     ' + ' L: ' + bank.getLength();
						break;
					default:
						result = ' ' + b + ' - ' + bank.domain + '     ' + ' L: ' + bank.getLength();
						break;
				}
*/				
				this.aoz.currentScreen.currentTextWindow.printUsing( '###', [ b ], false );
				this.aoz.currentScreen.currentTextWindow.print( ' - ', false );
				this.aoz.currentScreen.currentTextWindow.printUsing( '~~~~~~~~~~~~~~~~~ L: ', [ bank.domain ], false );
				this.aoz.currentScreen.currentTextWindow.print( '' + bank.getLength(), true );
			}
		}
	}
};


// IMAGE BANK
Banks.prototype.getImage = function( index, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, 'images' ).getElement( index );
};
Banks.prototype.setImageHotSpot = function( index, position, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'images' ).setHotSpot( index, position );
};
Banks.prototype.insertImage = function( index, name, tags, contextName, bankIndex, canvas )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	bank = this.getBank( bankIndex, contextName, 'images' );
	bank.add( index, name, tags );
	if ( canvas )
		bank.setElement( index, canvas );
};
Banks.prototype.insertImageRange = function( first, last, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'images' ).addRange( first, last, tags );
};
Banks.prototype.insertImageFromArray = function( arrayIndex, arrayNames, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'images' );
	arrayNames = typeof arrayNames == 'undefined' ? {} : arrayNames;
	for ( var i in arrayIndex )
		bank.add( arrayIndex[ i ], arrayNames[ i ], tags );
};
Banks.prototype.setImageCanvas = function( index, canvas, tags, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	this.getBank( bankIndex, contextName, 'images' ).getElement( index ).setElement( canvas, tags );
};
Banks.prototype.deleteImage = function( index, contextName, contextName )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'images' );
	if ( typeof index == 'undefined' )
		bank.reset();
	else
		bank.delete( index );
};
Banks.prototype.deleteImageRange = function( first, last, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'images' );
	if ( typeof first == 'undefined' && typeof last == 'undefined' )
		bank.reset();
	else
	{
		last = typeof last != 'undefined' ? last : first + 1;
		bank.deleteRange( first, last );
	}
};
Banks.prototype.deleteImagesFromArray = function( _array, contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	var bank = this.getBank( bankIndex, contextName, 'images' );
	for ( var i in _array )
		bank.delete( _array[ i ] );
};
Banks.prototype.getImagePalette = function( contextName, bankIndex )
{
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	return this.getBank( bankIndex, contextName, 'images' ).getPalette();
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
ImageBank.prototype.isType = function( type )
{
	return type == this.type;
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
		getCanvas: this.getImageCanvas
	}
	this.context.setElement( this.domain, image, i, true );
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
	var canvas = this.canvas;
	if ( canvas )
	{
		if ( hRev || vRev )
		{
			if ( hRev && vRev )
			{
				if ( !element.canvasRev )
					element.canvasRev = this.aoz.utilities.flipCanvas( element.canvas, Sprites.HREV | Sprites.VREV );
				canvas = element.canvasRev;
			}
			else if ( hRev )
			{
				if ( !element.canvasHRev )
					element.canvasHRev = this.aoz.utilities.flipCanvas( element.canvas, Sprites.HREV );
				canvas = element.canvasHRev;
			}
			else
			{
				if ( !element.canvasVRev )
					element.canvasVRev = this.aoz.utilities.flipCanvas( element.canvas, Sprites.VREV );
				canvas = element.canvasVRev;
			}
		}
	}
	return canvas;
};
ImageBank.prototype.getLength = function()
{
	return this.context.getNumberOfElements( this.domain );
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
SampleBank.prototype.isType = function( type )
{
	return type == this.type;
};
SampleBank.prototype.loadList = function( soundList, soundTypesList, tags )
{
	var self = this;
	tags = typeof tags == 'undefined' ? '' : tags;
	for ( var i = 0; i < soundList.length; i++ )
	{		
		var infos = this.context.getElementInfosFromFilename( this.domain, soundList[ i ], 'sample' );
		infos.path = './resources/' + this.path + '/' + soundList[ i ];
		this.aoz.loadingMax++;
		this.utilities.loadMultipleUnlockedSound( infos.path, this.banks.numberOfSoundsToPreload, { }, function( response, soundsLoaded, infos )
		{
			if ( response )
			{
				var sound =
				{
					name: infos.name,
					path: infos.path,
					sounds: soundsLoaded,
				};
				self.context.setElement( this.domain, sound, infos.index, true );
				if ( typeof tags != 'undefined' )
					self.setTags( infos.index, tags );
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
DataBank.prototype.isType = function( type )
{
	return type == this.type;
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
		var path = './resources/' + this.path + '/' + loadList[ i ];
		var infos = this.context.getElementInfosFromFilename( this.domain, loadList[ i ], 'sample' );
		infos.path = path;
		this.utilities.loadUnlockedBankElement( path, infos, function( response, data, extra )
		{
			if ( response )
			{
				var block = nself.aoz.allocMemoryBlock( data, self.aoz.manifest.compilation.endian );
				block.path = extra.path;
				block.name = extra.name;
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
	if ( element.aoz )
		return element.length;
	return 0
};
DataBank.prototype.setTags = function( index, tags )
{
};
