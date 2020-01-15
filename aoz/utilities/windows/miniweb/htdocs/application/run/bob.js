/*@****************************************************************************
*
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗ 
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝ 
*
****************************************************************************@*/
/** @file
 *
 * AOZ - Bob Class
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 10/11/2019
 */

function Bob( aoz, parent, tags )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.parent = parent;
	this.tags = tags;

	this.position = { x: 0, y: 0, z: 0 };
	this.dimension = { x: 0, y: 0, z: 0 };
	this.scale = { x: 1, y: 1, z: 1 };
	this.skew = { x: 0, y: 0, z: 0 };
	this.angle = { x: 0, y: 0, z: 0 };
	this.image = 0;
	this.positionDisplay = {};
	this.dimensionDisplay = {};
	this.scaleDisplay = {};
	this.skewDisplay = {};
	this.angleDisplay = {};
	this.imageDisplay = undefined;

	this.clipping = null;
	this.limits = null;
	this.toUpdate = false;
	this.toUpdateCollisions = false;
	this.collisions = {};
}
Bob.prototype.set = function( position, image, tags )
{
	if ( typeof image != 'undefined' )
	{
		this.image = image;
		this.imageObject = this.banks.getImage( image, this.aoz.currentContextName );		// Check the image
		this.dimension.width = this.imageObject.width * this.scale.x;
		this.dimension.height = this.imageObject.height * this.scale.y;
	}	
	if ( typeof position.x != 'undefined' ) this.position.x = position.x;
	if ( typeof position.y != 'undefined' ) this.position.y = position.y;
	if ( typeof position.z != 'undefined' ) this.position.z = position.z;
	this.toUpdate = true;
};
Bob.prototype.destroy = function( options )
{
	this.parent.bobOff( this.index );
};
Bob.prototype.update = function( options )
{
	if ( this.toUpdate || options.force )
	{
		this.toUpdate = false;
		this.imageDisplay = this.image;
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
Bob.prototype.setClipping = function( rectangle, options )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
	rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
	rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
	this.clipping = rectangle;
	this.toUpdate = true;
};
Bob.prototype.setLimits = function( rectangle, options )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
	rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
	rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
	this.limits = rectangle;
	this.computeLimits();
};
Bob.prototype.computeLimits = function( options )
{
	if ( this.limits )
	{		
		var image = this.banks.getImage( this.image, this.aoz.currentContextName );
		if ( image )
		{
			if ( this.position.x - image.hotSpotX < this.limits.x1 )
				this.position.x = this.limits.x + image.hotSpotX;
			if ( this.position.x - image.hotSpotX + this.dimension.width > this.limits.x + this.limits.width )
				this.position.x = this.limits.x + this.limits.width + image.hotSpotX - this.dimension.width;
			if ( this.position.y - image.hotSpotY < this.limits.y )
				this.position.y = this.limits.y + image.hotSpotY;
			if ( this.position.y - image.hotSpotY + this.dimension.height > this.limits.y + this.limits.height )
				this.position.y = this.limits.y + this.limits.width + image.hotSpotY - this.dimension.height;
			this.toUpdate = true;
		}
	}
};
Bob.prototype.setScale = function( vector, tags )
{
	vector.x = typeof vector.x == 'undefined' ? 1 : vector.x;
	vector.y = typeof vector.y == 'undefined' ? 1 : vector.y;
	vector.z = typeof vector.z == 'undefined' ? 1 : vector.z;
	this.scale = vector;
	this.toUpdate = true;
};
Bob.prototype.setSkew = function( vector, tags )
{
	vector.x = typeof vector.x == 'undefined' ? 0 : vector.x;
	vector.y = typeof vector.y == 'undefined' ? 0 : vector.y;
	vector.z = typeof vector.z == 'undefined' ? 0 : vector.z;
	this.skew = vector;
	this.toUpdate = true;
};
Bob.prototype.setAngle = function( angle, tags )
{
	angle.x = typeof angle.x == 'undefined' ? 0 : angle.x;
	angle.y = typeof angle.y == 'undefined' ? 0 : angle.y;
	angle.z = typeof angle.z == 'undefined' ? 0 : angle.z;
	this.angle = angle;
	this.toUpdate = true;
};
Bob.prototype.draw = function( options )
{
};
