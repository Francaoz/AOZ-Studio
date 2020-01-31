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
 * @date first pushed on 29/01/2020
 */
function Sprite( aoz, parent, tags )
{
	this.aoz = aoz;
	this.parent = aoz;
	this.tags = tags;

	this.position = { x: 0, y: 0, z: 0 };
	this.dimension = { x: 0, y: 0, z: 0 };
	this.scale = { x: 1, y: 1, z: 1 };
	this.skew = { x: 0, y: 0, z: 0 };
	this.angle = { x: 0, y: 0, z: 0 };
	this.image = 0;
	this.hRev = false;
	this.vRev = false;
	this.positionDisplay = {};
	this.dimensionDisplay = {};
	this.scaleDisplay = {};
	this.skewDisplay = {};
	this.angleDisplay = {};
	this.bankIndex = undefined;
	this.bankReserveNumber = -1;

	this.toUpdate = false;
	this.toUpdateCollisions = false;
	this.collisions = {};
}
Sprite.prototype.setModified = function()
{
	this.toUpdate = true;
	this.toUpdateCollisions = true;
	this.aoz.renderer.setModified();
};
Sprite.prototype.set = function( position, image, tags )
{
	var toUpdate = 0;
	if ( typeof image != 'undefined' )
	{
		if ( typeof image == 'number' )
		{
			this.hRev = ( image & AOZ.HREV ) != 0;
			this.vRev = ( image & AOZ.VREV ) != 0;
			image &= ~( AOZ.HREV | AOZ.VREV );
		}
		else
		{
			this.hRev = false;
			this.vRev = false;
		}
		this.bank = this.aoz.banks.getBank( this.bankIndex, this.aoz.currentContextName, 'images' );
		this.bankIndex = this.bank.index;
		this.bankReserveNumber = this.bank.reserveNumber;
		this.image = image;
		this.imageObject = this.bank.getElement( this.image );
		this.dimension.width = this.imageObject.width * this.scale.x;
		this.dimension.height = this.imageObject.height * this.scale.y;
		toUpdate++;
	}
	if ( typeof position.x != 'undefined' )
	{
		this.position.x = this.limits ? Math.max( this.limits.x, Math.min( this.position.x, this.limits.x + this.limits.width ) ) : position.x;
		toUpdate++;
	}
	if ( typeof position.y != 'undefined' )
	{
		this.position.y = this.limits ? Math.max( this.limits.y, Math.min( this.position.y, this.limits.y + this.limits.height ) ) : position.y;
		toUpdate++;
	}
	if ( typeof position.z != 'undefined' )
	{
		this.position.z = position.z;
		toUpdate++;
	}
	if ( toUpdate > 0 )
		this.setModified();
};
Sprite.prototype.updateBank = function( newBank, newBankIndex, contextName )
{
	if ( this.bankIndex == newBankIndex )
	{
		if ( newBank )
		{
			if ( this.bankReserveNumber != newBank.reserveNumber )
			{
				this.bank = newBank;
				this.bankReserveNumber = newBank.reserveNumber;
				this.imageObject = newBank.getElement( this.image );
				if ( !this.imageObject )
					this.destroy();
				else
				{
					this.dimension.width = this.imageObject.width * this.scale.x;
					this.dimension.height = this.imageObject.height * this.scale.y;
					this.setModified();
				}
				return true;
			}
		}
		else
		{
			this.destroy();
			return true;
		}
	}
};
Sprite.prototype.destroy = function( options )
{
	this.parent.destroy( this.index );
};
Sprite.prototype.update = function( options )
{
	if ( this.toUpdate || options.force )
	{
		this.toUpdate = false;
		this.canvas = this.imageObject.getCanvas( this.hRev, this.vRev );
		this.positionDisplay.x = this.position.x;
		this.positionDisplay.y = this.position.y;
		this.dimensionDisplay.width = this.dimension.width;
		this.dimensionDisplay.height = this.dimension.height;
		this.scaleDisplay.x = this.scale.x;
		this.scaleDisplay.y = this.scale.y;
		this.skewDisplay.x = this.skew.x;
		this.skewDisplay.y = this.skew.y;
		this.angleDisplay.z = this.angle.z;
		return true;
	}
	return false;
};
Sprite.prototype.setClipping = function( rectangle, options )
{
	if ( rectangle )
	{
		rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
		rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
		rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
		rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
	}
	this.clipping = rectangle;
	this.setModified();
};
Sprite.prototype.setLimits = function( rectangle, options )
{
	if ( rectangle )
	{
		rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
		rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
		rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
		rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
		if ( this.aoz.manifest.compilation.emulation.toLowerCase() != 'pc' )
			rectangle.width &= 0xFFFFFFF0;
	}
	this.limits = rectangle;
	this.clipping = rectangle;
	this.setModified();
};
Sprite.prototype.setScale = function( vector, tags )
{
	vector.x = typeof vector.x == 'undefined' ? 1 : vector.x;
	vector.y = typeof vector.y == 'undefined' ? 1 : vector.y;
	vector.z = typeof vector.z == 'undefined' ? 1 : vector.z;
	this.scale = vector;
	this.setModified();
};
Sprite.prototype.setSkew = function( vector, tags )
{
	vector.x = typeof vector.x == 'undefined' ? 0 : vector.x;
	vector.y = typeof vector.y == 'undefined' ? 0 : vector.y;
	vector.z = typeof vector.z == 'undefined' ? 0 : vector.z;
	this.skew = vector;
	this.setModified();
};
Sprite.prototype.setAngle = function( angle, tags )
{
	angle.x = typeof angle.x == 'undefined' ? 0 : angle.x;
	angle.y = typeof angle.y == 'undefined' ? 0 : angle.y;
	angle.z = typeof angle.z == 'undefined' ? 0 : angle.z;
	this.angle = angle;
	this.setModified();
};
Sprite.prototype.setVisible = function( yesNo )
{
	this.visible = yesNo;
};
Sprite.prototype.updateCollisionData = function()
{
	if ( this.toUpdateCollisions )
	{
		var collisions = this.collisions;
		if ( this.imageObject )
		{
			if ( this.angle.z == 0 )
			{
				collisions.x1 = this.position.x - this.imageObject.hotSpotX * this.scale.x;
				collisions.y1 = this.position.y - this.imageObject.hotSpotY * this.scale.y;
				collisions.x2 = collisions.x1 + this.imageObject.width * this.scale.x;
				collisions.y2 = collisions.y1 + this.imageObject.height * this.scale.y;
			}
			else
			{
				var x1 = this.position.x - this.imageObject.hotSpotX * this.scale.x;
				var y1 = this.position.y - this.imageObject.hotSpotY * this.scale.y;
				var coords = this.aoz.utilities.rotate( x1, y1,	this.position.x, this.position.y, this.angle.z );
				collisions.x1 = coords.x;
				collisions.y1 = coords.y;
				coords = this.aoz.utilities.rotate( x1 + this.imageObject.width * this.scale.x, y1 + this.imageObject.height * this.scale.y, this.position.x, this.position.y, this.angle.z );
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
		this.toUpdateCollisions = false;
	}
};
