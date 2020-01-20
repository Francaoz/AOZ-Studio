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
 * Sprite bank and sprites
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/03/2019
 */

function Sprites( aoz )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.spriteContext = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: true } );
	this.spritesToUpdate = false;
	this.spritesUpdateOn = true;
	this.spritesPriorityOn = false;
	this.spritesPriorityReverseOn = false;
	this.collisionList = [];
	this.collisionBoxed = this.aoz.manifest.sprites.collisionBoxed;
	this.collisionPrecision = this.aoz.manifest.sprites.collisionPrecision;
	this.collisionAlphaThreshold = this.aoz.manifest.sprites.collisionAlphaThreshold;
}
Sprites.HREV = 0x80000000;
Sprites.VREV = 0x40000000;

Sprites.prototype.sprite = function( index, x, y, image )
{
	var hRev = 0;
	var vRev = 0;
	if ( typeof index == 'number' )
	{
		hRev = ( index & Sprites.HREV ) != 0;
		vRev = ( index & Sprites.VREV ) != 0;
		index &= ~( Sprites.HREV | Sprites.VREV );
	}
	var sprite = this.spriteContext.getElement( this.aoz.currentContextName, index );
	if ( !sprite )
	{
		sprite =
		{
			xDisplay: undefined,
			yDisplay: undefined,
			imageDisplay: undefined,
			xScaleDisplay: undefined,
			yScaleDisplay: undefined,
			xSkewDisplay: undefined,
			ySkewDisplay: undefined,
			angleDisplay: undefined,
			xNew: x,
			yNew: y,
			imageNew: image,
			angleNew: 0,
			xScaleNew: 1,
			yScaleNew: 1,
			xSkewNew: 0,
			ySkewNew: 0,
			hRev: hRev,
			vRev: vRev,
			toUpdate: true,
			toUpdateCollisions: true,
			collisions: {}
		};
		this.spriteContext.setElement( this.aoz.currentContextName, sprite, index );
	}
	x = typeof x == 'undefined' ? sprite.xNew : x;
	y = typeof y == 'undefined' ? sprite.yNew : y;
	image = typeof image == 'undefined' ? sprite.imageNew : image;
	this.banks.getImage( image, this.aoz.currentContextName );			// Check if undefined
	sprite.xNew = x;
	sprite.yNew = y;
	sprite.imageNew = image;
	sprite.toUpdate = true;
	sprite.toUpdateCollisions = true;
	this.spritesToUpdate = true;
	this.aoz.renderer.setModified();
};
Sprites.prototype.spriteOff = function( index )
{
	if ( typeof index != 'undefined' )
	{
		this.spriteContext.deleteElement( this.aoz.currentContextName, index );
	}
	else
	{
		this.spriteContext.reset( this.aoz.currentContextName );
	}
	this.spritesToUpdate = true;
	this.aoz.renderer.setModified();
};
Sprites.prototype.spritesUpdate = function( force, forceAll )
{
	if ( force || ( this.spritesUpdateOn && this.spritesToUpdate ) )
	{
		this.spritesToUpdate = false;

		var done = false;
		for ( var sprite = this.spriteContext.getFirstElement( this.aoz.currentContextName ); sprite != null; sprite = this.spriteContext.getNextElement( this.aoz.currentContextName ) )
		{
			if ( sprite.toUpdate || forceAll )
			{
				sprite.toUpdate = false;
				sprite.xDisplay = sprite.xNew;
				sprite.yDisplay = sprite.yNew;
				sprite.imageDisplay = sprite.imageNew;
				sprite.xScaleDisplay = sprite.xScaleNew;
				sprite.yScaleDisplay = sprite.yScaleNew;
				sprite.xSkewDisplay = sprite.xSkewNew;
				sprite.ySkewDisplay = sprite.ySkewNew;
				sprite.angleDisplay = sprite.angleNew;
				done = true;
			}
		}
		if ( done )
		{
			this.sortSpritesPriority();
			this.aoz.renderer.setModified();
		}
	}
};
Sprites.prototype.setSpritesUpdate = function( yes_no )
{
	this.spritesUpdateOn = yes_no;
};
Sprites.prototype.setScale = function( index, xScale, yScale )
{
	var sprite = this.spriteContext.getElement( this.aoz.currentContextName, index, 'sprite_not_defined' );
	if ( typeof xScale != 'undefined' )
		sprite.xScaleNew = xScale;
	if ( typeof yScale != 'undefined' )
		sprite.yScaleNew = yScale;

	sprite.toUpdate = true;
	sprite.toUpdateCollisions = true;
	this.spritesToUpdate = true;
};
Sprites.prototype.setSkew = function( index, xSkew, ySkew )
{
	var sprite = this.spriteContext.getElement( this.aoz.currentContextName, index, 'sprite_not_defined' );
	if ( typeof xSkew != 'undefined' )
		sprite.xSkewNew = xSkew;
	if ( typeof ySkew != 'undefined' )
		sprite.ySkewNew = ySkew;

	sprite.toUpdate = true;
	sprite.toUpdateCollisions = true;
	this.spritesToUpdate = true;
};
Sprites.prototype.setAngle = function( index, angle )
{
	var sprite = this.spriteContext.setProperty( this.aoz.currentContextName, index, 'angleNew', angle, 'sprite_not_defined' );

	if ( sprite )
	{
		sprite.toUpdate = true;
		sprite.toUpdateCollisions = true;
		this.spritesToUpdate = true;
	}
};
Sprites.prototype.xSprite = function( index )
{
	return this.spriteContext.getProperty( this.aoz.currentContextName, index, 'xNew', 'sprite_not_defined' );
};
Sprites.prototype.ySprite = function( index )
{
	return this.spriteContext.getProperty( this.aoz.currentContextName, index, 'yNew', 'sprite_not_defined' );
};
Sprites.prototype.iSprite = function( index )
{
	return this.spriteContext.getProperty( this.aoz.currentContextName, index, 'iNew', 'sprite_not_defined' );
};
Sprites.prototype.getPalette = function( )
{
	return this.banks.getImagePalette( this.aoz.currentContextName );
};
Sprites.prototype.isSprite = function( index )
{
	return this.spriteContext.getElement( this.aoz.currentContextName, index ) != null;
};
Sprites.prototype.setSpritesPriority = function( on_off )
{
	this.spritesPriorityOn = on_off;
	this.spritesToUpdate = true;
};
Sprites.prototype.setSpritesPriorityReverse = function( on_off )
{
	this.spritesPriorityReverseOn  = on_off;
	this.spritesToUpdate = true;
};
Sprites.prototype.sortSpritesPriority = function()
{
	if ( this.spritesPriorityOn )
	{
		if ( this.spritesPriorityReverseOn )
		{
			this.spriteContext.sort( undefined, function( b1, b2 )
			{
				if ( b1.yNew == b2.yNew )
					return 0;
				return ( b1.yNew > b2.yNew ) ? -1 : 1;
			} );
		}
		else
		{
			this.spriteContext.sort( undefined, function( b1, b2 )
			{
				if ( b1.yNew == b2.yNew )
					return 0;
				return ( b1.yNew < b2.yNew ) ? -1 : 1;
			} );
		}
	}
};


// Collision detection
Sprites.prototype.spriteCol = function( number, from, to )
{
	if ( typeof number != 'number' )
		throw 'type_mismatch';
	if ( number < 0 )
		throw 'illegal_function_call';
	var sprite = this.sprites[ number ];
	if ( !sprite )
		throw 'sprite_not_defined';
	if ( sprite.toUpdateCollisions )
		this.setSpriteCollisionData( sprite );

	from = typeof from == 'undefined' ? 0 : from;
	to = typeof to == 'undefined' ? this.lastSpriteNumber : to;
	if ( from < 0 || to < 0 || from > to )
		throw 'illegal_function_call';

	this.collisionList = [];
	for ( var s = from; s <= to; s++ )
	{
		var testSprite = this.sprites[ s ];
		if ( testSprite && testSprite != sprite )
		{
			if ( testSprite.toUpdateCollisions )
				this.setSpriteCollisionData( testSprite );
			if ( this.isColliding( sprite, testSprite ) )
			{
				this.collisionList[ s ] = true;
			}
		}
	}
	return this.collisionList.length > 0;
};
Sprites.prototype.spriteBobCol = function( sprite, screen, from, to )
{
	if ( typeof sprite != 'number')
		throw 'type_mismatch';
	if ( sprite < 0 )
		throw 'illegal_function_call';
	sprite = this.sprites[ sprite ];
	if ( !sprite )
		throw 'sprite_not_defined';
	if ( sprite.toUpdateCollisions )
		this.setSpriteCollisionData( sprite );

	from = typeof from == 'undefined' ? 0 : from;
	to = typeof to == 'undefined' ? screen.getNumberOfElements() : to;
	if ( from < 0 || to < 0 || from > to )
		throw 'illegal_function_call';

	this.collisionList = [];
	for ( var b = from; b <= to; b++ )
	{
		var bob = screen.getBobFromIndex( b );
		if ( bob )
		{
			if ( bob.toUpdateCollisions )
				this.setBobCollisionData( bob, screen );

			if ( this.collisionRectangle || this.isColliding( sprite, bob ) )
			{
				this.collisionList[ b ] = true;
			}
		}
	}
	return this.collisionList.length > 0;
};
Sprites.prototype.bobSpriteCol = function( bob, screen, from, to )
{
	if ( typeof bob != 'number' )
		throw 'type_mismatch';
	if ( bob < 0 )
		throw 'illegal_function_call';
	bob = screen.getBobFromIndex( bob );
	if ( !bob )
		throw 'bob_not_defined';
	if ( bob.toUpdateCollisions )
		this.setBobCollisionData( bob, screen );

	from = typeof from == 'undefined' ? 0 : from;
	to = typeof to == 'undefined' ? this.lastSpriteNumber : to;
	if ( from < 0 || to < 0 || from > to )
		throw 'illegal_function_call';

	this.collisionList = [];
	for ( var s = from; s <= to; s++ )
	{
		var sprite = this.sprites[ s ];
		if ( sprite )
		{
			if ( sprite.toUpdateCollisions )
				this.setSpriteCollisionData( sprite );

			if ( this.isColliding( sprite, bob ) )
			{
				this.collisionList[ s ] = true;
			}
		}
	}
	return this.collisionList.length > 0;
};
Sprites.prototype.bobCol = function( bob, screen, from, to )
{
	// TODO: allow collision test with strings as bob reference.
	if ( typeof bob != 'number' )
		throw 'type_mismatch';
	if ( bob < 0 )
		throw 'illegal_function_call';
	bob = screen.getBobFromIndex( bob );
	if ( !bob )
		throw 'bob_not_defined';
	if ( bob.toUpdateCollisions )
		this.setBobCollisionData( bob, screen );

	from = typeof from == 'undefined' ? 0 : from;
	to = typeof to == 'undefined' ? screen.getNumberOfBobs() : to;
	if ( from < 0 || to < 0 || from > to )
		throw 'illegal_function_call';

	this.collisionList = [];
	for ( var b = from; b <= to; b++ )
	{
		var testBob = screen.getBobFromIndex( b );
		if ( testBob && testBob != bob )
		{
			if ( testBob.toUpdateCollisions )
				this.setBobCollisionData( testBob, screen );

			if ( this.isColliding( bob, testBob ) )
			{
				this.collisionList[ b ] = true;
			}
		}
	}
	return this.collisionList.length > 0;
};
Sprites.prototype.col = function( number )
{
	if ( number < 0 )
	{
		for ( var c = 0; c < this.collisionList.length; c++ )
		{
			if ( this.collisionList[ c ] )
				return c;
		}
		return 0;
	}
	return this.collisionList[ number ] == true;
};
Sprites.prototype.setSpriteCollisionData = function( sprite )
{
	var collisions = sprite.collisions;
	var image = this.getImage( sprite.imageNew );
	if ( image )
	{
		if ( sprite.angleNew == 0 )
		{
			collisions.x1 = sprite.xNew - image.hotSpotX * sprite.xScaleNew;
			collisions.y1 = sprite.yNew - image.hotSpotY * sprite.yScaleNew;
			collisions.x2 = collisions.x1 + image.width * sprite.xScaleNew;
			collisions.y2 = collisions.y1 + image.height * sprite.yScaleNew;
		}
		else
		{
			var x1 = sprite.xNew - image.hotSpotX * sprite.xScaleNew;
			var y1 = sprite.yNew - image.hotSpotY * sprite.yScaleNew;
			var coords = this.utilities.rotate( x1, y1,	sprite.xNew, sprite.yNew, sprite.angleNew );
			collisions.x1 = coords.x;
			collisions.y1 = coords.y;
			coords = this.utilities.rotate( x1 + image.width * sprite.xScaleNew, y1 + image.height * sprite.yScaleNew, sprite.xNew, sprite.yNew, sprite.angle );
			collisions.x2 = coords.x;
			collisions.y2 = coords.y;
		}
	}
	else
	{
		collisions.x1 = 10000000;
		collisions.y1 = 10000000;
		collisions.x2 = -10000000;
		collisions.y2 = -10000000;
	}
	sprite.toUpdateCollisions = false;
};
Sprites.prototype.setBobCollisionData = function( bob, screen )
{
	var collisions = bob.collisions;
	var image = this.getImage( bob.imageNew );
	if ( image )
	{
		var xHard = bob.xNew * screen.scale.x + screen.position.x;
		var yHard = bob.yNew * screen.scale.y + screen.position.y;
		var xHotspotHard = image.hotSpotX * screen.scale.x;
		var yHotspotHard = image.hotSpotY * screen.scale.y;
		var widthHard = image.width * screen.scale.x;
		var heightHard = image.height * screen.scale.y;
		if ( bob.angleNew == 0 )
		{
			collisions.x1 = xHard - xHotspotHard * bob.scale.x;
			collisions.y1 = yHard - yHotspotHard * bob.scale.y;
			collisions.x2 = collisions.x1 + widthHard * bob.scale.x;
			collisions.y2 = collisions.y1 + heightHard * bob.scale.y;
		}
		else
		{
			var x1 = xHard - xHotspotHard * bob.scale.x;
			var y1 = yHard - yHotspothard * bob.scale.y;
			var coords = this.utilities.rotate( x1, y1,	xHard, yHard, bob.angle.z );
			collisions.x1 = coords.x;
			collisions.y1 = coords.y;
			coords = this.utilities.rotate( x1 + widthHard * bob.scale.x, y1 + heightHard * bob.scale.y, xHard, yHard, bob.angle.z );
			collisions.x2 = coords.x;
			collisions.y2 = coords.y;
		}
	}
	else
	{
		collisions.x1 = 10000000;
		collisions.y1 = 10000000;
		collisions.x2 = -10000000;
		collisions.y2 = -10000000;
	}
	bob.toUpdateCollisions = false;
};
Sprites.prototype.getCollisionMask = function( image )
{
	if ( !image.collisionMask )
	{
		var context = image.getContext( '2d' );
		var dataView = context.getImageData( 0, 0, image.width, image.height );

		image.collisionMask = dataView;
		image.collisionMaskWidth = image.width;
		image.collisionMaskHeight = image.height;
		image.collisionMaskPrecision = 1;
	}
	return { mask: image.collisionMask, width: image.collisionMaskWidth, height: image.collisionMaskHeight, precision: image.collisionMaskPrecision };
};
Sprites.prototype.isColliding = function( object1, object2 )
{
	var collisions1 = object1.collisions;
	var collisions2 = object2.collisions;

	var colliding = ( collisions1.x2 > collisions2.x1 && collisions1.x1 <= collisions2.x2
				   && collisions1.y2 > collisions2.y1 && collisions1.y1 <= collisions2.y2 );

	if ( colliding && !this.collisionBoxed && ( object1.angleNew == 0 && object2.angleNew == 0 ) )		// TODO
	{
		var maskDefinition1 = this.getCollisionMask( this.getImage( object1.imageNew ) );
		var maskDefinition2 = this.getCollisionMask( this.getImage( object2.imageNew ) );
		if ( !maskDefinition1 || !maskDefinition2 )
			return colliging;

		colliding = false;
		var o1Left, o1Top, o1Right, o1Bottom;
		var o2Left, o2Top, o2Right, o2Bottom;
		if ( collisions1.x1 <= collisions2.x1 )
		{
			o2Left = 0;
			o1Left = collisions2.x1 - collisions1.x1;
			if ( collisions1.x2 < collisions2.x2 )
			{
				o1Right = collisions1.x2 - collisions1.x1;
				o2Right = collisions1.x2 - collisions2.x1;
			}
			else
			{
				o2Right = collisions2.x2 - collisions2.x1;
				o1Right = collisions2.x2 - collisions1.x1;
			}
		}
		else
		{
			o1Left = 0;
			o2Left = collisions1.x1 - collisions2.x1;
			if ( collisions1.x2 < collisions2.x2 )
			{
				o1Right = collisions1.x2 - collisions1.x1;
				o2Right = collisions1.x2 - collisions2.x1;
			}
			else
			{
				o1Right = collisions2.x2 - collisions1.x1;
				o2Right = collisions2.x2 - collisions2.x1;
			}
		}
		if ( collisions1.y1 <= collisions2.y1 )
		{
			o2Top = 0;
			o1Top = collisions2.y1 - collisions1.y1;
			if ( collisions1.y2 < collisions2.y2 )
			{
				o1Bottom = collisions1.y2 - collisions1.y1;
				o2Bottom = collisions1.y2 - collisions2.y1;
			}
			else
			{
				o2Bottom = collisions2.y2 - collisions2.y1;
				o1Bottom = collisions2.y2 - collisions1.y1;
			}
		}
		else
		{
			o1Top = 0;
			o2Top = collisions1.y1 - collisions2.y1;
			if ( collisions1.y2 < collisions2.y2 )
			{
				o1Bottom = collisions1.y2 - collisions1.y1;
				o2Bottom = collisions1.y2 - collisions2.y1;
			}
			else
			{
				o1Bottom = collisions2.y2 - collisions1.y1;
				o2Bottom = collisions2.y2 - collisions2.y1;
			}
		}

		o1Left = o1Left * maskDefinition1.precision / object1.xScaleNew;
		o1Top = o1Top * maskDefinition1.precision / object1.yScaleNew;
		o2Left = o2Left * maskDefinition2.precision / object2.xScaleNew;
		o2Top = o2Top * maskDefinition2.precision / object2.yScaleNew;
		o1Right = Math.floor( o1Right * maskDefinition1.precision / object1.xScaleNew );
		o1Bottom = Math.floor( o1Bottom * maskDefinition1.precision / object1.yScaleNew );
		o2Right = Math.floor( o2Right * maskDefinition2.precision / object2.xScaleNew );
		o2Bottom = Math.floor( o2Bottom * maskDefinition2.precision / object2.yScaleNew );
		var o1PlusX = maskDefinition1.precision / object1.xScaleNew;
		var o1PlusY = maskDefinition1.precision / object1.yScaleNew;
		var o2PlusX = maskDefinition2.precision / object2.xScaleNew;
		var o2PlusY = maskDefinition2.precision / object2.yScaleNew;

		var x1, y1, x2, y2;

		/*
		for ( y1 = o1Top, y2 = o2Top; y1 < o1Bottom && y2 < o2Bottom; y1 += o1PlusY, y2 += o2PlusY )
		{
			var offset1 = Math.floor( y1 ) * maskDefinition1.width;
			var offset2 = Math.floor( y2 ) * maskDefinition2.width;
			for ( x1 = o1Left, x2 = o2Left; x1 < o1Right && x2 < o2Right; x1 += o1PlusX, x2 += o2PlusX )
			{
				this.aoz.currentScreen.plot( x1 - o1Left, y1 - o1Top, maskDefinition1.mask[ offset1 + Math.floor( x1 ) ] != 0 ? 2 : 0 );
				this.aoz.currentScreen.plot( 100 + x2 - o2Left, y2 - o2Top, maskDefinition2.mask[ offset2 + Math.floor( x2 ) ] != 0 ? 2 : 0 );
				if ( ( maskDefinition1.mask[ offset1 + Math.floor( x1 ) ] & maskDefinition2.mask[ offset2 + Math.floor( x2 ) ] ) != 0 )
				{
					this.aoz.currentScreen.plot( x1 - o1Left, y1 - o1Top, 5 );
					this.aoz.currentScreen.plot( 100 + x2 - o2Left, y2 - o2Top, 5 );
				}
			}
		}
		*/

		for ( y1 = o1Top, y2 = o2Top; y1 < o1Bottom && y2 < o2Bottom && !colliding; y1 += o1PlusY, y2 += o2PlusY )
		{
			var offset1 = Math.floor( y1 ) * maskDefinition1.width;
			var offset2 = Math.floor( y2 ) * maskDefinition2.width;
			for ( x1 = o1Left, x2 = o2Left; x1 < o1Right && x2 < o2Right; x1 += o1PlusX, x2 += o2PlusX )
			{
				if ( ( maskDefinition1.mask[ offset1 + Math.floor( x1 ) ] & maskDefinition2.mask[ offset2 + Math.floor( x2 ) ] ) != 0 )
				{
					colliding = true;
					break;
				}
			}
		}
	}
	return colliding;
};
