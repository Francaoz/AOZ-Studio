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
 * AMAL
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function AMAL( aoz )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	this.channels = [];
	this.numberOfChannels = 0;
	this.handle = false;
	this.isSynchro = true;

	this.registers =
	{
		'A': 0,
		'B': 0,
		'C': 0,
		'D': 0,
		'E': 0,
		'F': 0,
		'G': 0,
		'H': 0,
		'I': 0,
		'J': 0,
		'K': 0,
		'L': 0,
		'M': 0,
		'N': 0,
		'O': 0,
		'P': 0,
		'Q': 0,
		'R': 0,
		'S': 0,
		'T': 0,
		'U': 0,
		'V': 0,
		'W': 0,
		'X': 0,
		'Y': 0,
		'Z': 0
	};
}
AMAL.prototype.setSynchro = function( onOff )
{
	this.isSynchro = onOff;
}
AMAL.prototype.synchro = function()
{
	if ( !this.isSynchro )
		this.doSynchro();
}
AMAL.prototype.setOnOff = function( onOff, channelNumber )
{
	if ( typeof channelNumber == 'undefined' )
	{
		for ( var c = 0; c < this.channels.length; c++ )
		{
			if ( this.channels[ c ] )
				this.channels[ c ].onOff = onOff;
		}
	}
	else
	{
		if ( channelNumber < 0 )
			throw 'illegal_function_call';
		if ( !this.channels[ channelNumber ] )
			throw 'amal_channel_not_opened';
		this.channels[ channelNumber ].onOff = onOff;
	}
};
AMAL.prototype.freeze = function( onOff, channelNumber )
{
	if ( typeof channelNumber == 'undefined' )
	{
		for ( var c = 0; c < this.channels.length; c++ )
		{
			if ( this.channels[ c ] )
				this.channels[ c ].freeze = onOff;
		}
	}
	else
	{
		if ( channelNumber < 0 )
			throw 'illegal_function_call';
		if ( !this.channels[ channelNumber ] )
			throw 'amal_channel_not_opened';
		this.channels[ channelNumber ].freeze = onOff;
	}
};
AMAL.prototype.runChannel = function( channelNumber, code, callback, extra )
{
	if ( channelNumber < 0 )
		throw 'illegal_function_call';
	if ( this.channels[ channelNumber ] )
	{
		this.channels[ channelNumber ].destroy();
		this.channels[ channelNumber ] = null;
		this.numberOfChannels--;
	}
	var name = 'AMALChannel' + channelNumber;
	this.callback = callback;
	this.extra = extra;

	var self = this;
	this.channels[ channelNumber ] = new AMALChannel( this.aoz, this, code, name, function( response, data, extra )
	{
		if ( response )
		{
			if ( !self.handle )
			{
				self.handle = setInterval( function()
				{
					if ( self.isSynchro )
						self.doSynchro.call( self );
				}, 20 );
			}
			callback( true, null, extra );
		}
		else
		{
			callback( false, null, extra );
		}
	}, extra );
	this.numberOfChannels++;
};
AMAL.prototype.doSynchro = function()
{
	var count = 0;
	for ( var c = 0; c < this.channels.length && count < this.numberOfChannels; c++ )
	{
		var channel = this.channels[ c ];
		if ( channel && channel.onOff )
		{
			if ( channel.amalProgram )
			{
				var result = channel.update();
				result.channelNumber = c;
				this.callback( true, result, this.extra );	
			}
			count++;
		}
	}
};
AMAL.prototype.setChannelPosition = function( channelNumber, x, y, image )
{
	if ( channelNumber < 0 )
		throw 'illegal_function_call';
	var channel = this.channels[ channelNumber ];
	if ( channel )
	{
		channel.registers.x = x;
		channel.registers.y = y;
		channel.registers.a = image;
		return true;
	}
	return false;
};
AMAL.prototype.setRegister = function( value, registerNumber, channelNumber )
{
	if ( registerNumber < 0 )
		throw 'illegal_function_call';
	if ( typeof channelNumber == 'undefined' )
	{
		if ( registerNumber > 25 )
			throw 'illegal_function_call';
		this.registers[ registerNumber ] = value;
	}
	else
	{
		if ( registerNumber > 10 )
			throw 'illegal_function_call';
		if ( this.channels[ channelNumber ] == null )
			throw 'amal_channel_not_opened';
		this.channels[ channelNumber ].registers[ registerNumber ] = value;
	}
};
AMAL.prototype.getRegister = function( registerNumber, channelNumber )
{
	if ( registerNumber < 0 )
		throw 'illegal_function_call';
	if ( typeof channelNumber == 'undefined' )
	{
		if ( registerNumber > 25 )
			throw 'illegal_function_call';
		return this.registers[ registerNumber ];
	}
	else
	{
		if ( registerNumber > 10 )
			throw 'illegal_function_call';
		if ( channelNumber > 10 )
			throw 'illegal_function_call';
		if ( this.channels[ channelNumber ] == null )
			throw 'amal_channel_not_opened';
		return this.channels[ channelNumber ].registers[ registerNumber ];
	}
	return 0;
};
AMAL.prototype.isChannelAnimated = function( channelNumber )
{
	if ( channelNumber < 0 )
		throw 'illegal_function_call';
	if ( this.channels[ channelNumber ] == null )
		throw 'amal_channel_not_opened';
	return this.channels.animCounter > 0;
};
AMAL.prototype.isChannelMoving = function( channelNumber )
{
	if ( channelNumber < 0 )
		throw 'illegal_function_call';
	if ( this.channels[ channelNumber ] == null )
		throw 'amal_channel_not_opened';
	return this.channels.moveCounter > 0;
};
function AMALChannel( aoz, amal, code, name, callback, extra )
{
	this.aoz = aoz;
	this.amal = amal;
	this.extra = extra;
	this.utilities = amal.utilities;
	this.waiting = null;
	this.onOff = false;
	this.freeze = false;
	this.moveCounter = 0;
	this.animCounter = 0;
	this.waitInstructions =
	{
		move: this.move,
		move_wait: this.move_wait,
	};

	this.registers =
	{
		'0': 0,
		'1': 0,
		'2': 0,
		'3': 0,
		'4': 0,
		'5': 0,
		'6': 0,
		'7': 0,
		'8': 0,
		'9': 0,
		'x': 0,
		'y': 0,
		'a': 0
	};
	this.position = 0;
	
	// Save and load code as blob
	code = this.utilities.replaceStringInText( code, '%$NAME', name );
	this.script = document.createElement( 'script' );
	this.script.textContent = code;
	document.body.appendChild( this.script );

	var self = this;
	var handle = setInterval( function()
	{
		if ( typeof window[ name ] != 'undefined' )
		{
			clearInterval( handle );
			self.amalProgram = new window[ name ]( self.aoz, self );
			self.wait = false;
			self.positionMain = 0;
			callback( true, {}, extra );
		}
	}, 50 );
};
AMALChannel.prototype.destroy = function()
{
	if ( this.script )
		document.body.removeChild( this.script );
};
AMALChannel.prototype.run = function()
{

};
AMALChannel.prototype.update = function()
{
	var toUpdate = 0;
	if ( !this.freeze )
	{
		this.updateBlocks( this.amalProgram, this.amalProgram.blocksAutotest, 0 );
		if ( !this.wait )
			this.positionMain = this.updateBlocks( this.amalProgram, this.amalProgram.blocks, this.positionMain );
	
		if ( this.moveCounter )
		{
			this.registers.x += this.moveDeltaX;
			this.registers.y += this.moveDeltaY;
			this.moveCounter--;
			toUpdate |= 0b011;
		}
		if ( this.animCounter > 0 )
		{
			this.animCounter--;
			if ( this.animCounter == 0 )
			{
				var stop = false;
				this.animPosition++;
				if ( this.animPosition >= this.animFrames.length )
				{
					this.animPosition = 0;
					if ( this.animRepeatCounter > 0 )
					{
						this.animRepeatCounter--;
						if ( this.animRepeatCounter == 0 )
							stop = true
					}
				}
				if ( !stop )
				{
					this.registers.a = this.animFrames[ this.animPosition ].i;
					this.animCounter = this.animFrames[ this.animPosition ].t;
					toUpdate |= 0b100;
				}
			}
		}
	}
	var data = { toUpdate: false };
	toUpdate |= this.toUpdate;
	this.toUpdate = 0;
	if ( toUpdate )
	{
		if ( toUpdate & 0b001 )
			data.x = this.registers.x;
		if ( toUpdate & 0b010 )
			data.y = this.registers.y;
		if ( toUpdate & 0b100 )
			data.image = this.registers.a;
		data.toUpdate = true;
	}
	return data;
};

AMALChannel.prototype.updateBlocks = function( section, blocks, position )
{
	if ( position >= blocks.length )
		return;

	var time = new Date().getTime();
	this.previousTime = time;

	this.timeCheckCounter = 100;		// Should be enough!
	this.loopCounter = this.timeCheckCounter;
	this.maxLoopTime = 1;				// One MS max per script!
	var quit = false;
	while( !quit )
	{
		while( !quit && this.loopCounter > 0 )
		{
			if ( this.waiting )
			{
				this.waiting.call( this );
				if ( this.waiting )
					break;
			}
			do
			{
				ret = blocks[ position++ ].call( section );
			} while( !ret );

			switch ( ret.type )
			{
				// End!
				case 0:
					if ( blocks == this.amalProgram.blocks )
						this.wait = true;
					quit = true;
					break;

				// Goto
				case 1:
					position = ret.label;
					break;

				// Blocking instruction
				case 2:
					this.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					this.waitInstructions[ ret.instruction ].call( this, ret.args );
					break;

				// Blocking function
				case 3:
					this.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					this.waitInstructions[ ret.instruction ].call( this, ret.result, ret.args );
					break;

				// Next
				case 4:
					position = ret.label;
					quit = true;
					break;
			}
			this.loopCounter--;
		}
		if ( quit || this.waiting )
			break;

		// Check time in loop
		this.loopCounter = this.timeCheckCounter;
		if ( new Date().getTime() - time >= this.maxLoopTime )
			break;
	}
	return position;
};
AMALChannel.prototype.move = function( args )
{
	if ( args[ 2 ] <= 0 )
		args[ 2 ] = 1;
	this.moveDeltaX = args[ 0 ] / args[ 2 ];
	this.moveDeltaY = args[ 1 ] / args[ 2 ];
	this.moveCounter = args[ 2 ];
};
AMALChannel.prototype.move_wait = function( slopeX, slopeY, steps )
{
	if ( this.moveCounter == 0 )
	{
		this.waiting = null;
	}
};
AMALChannel.prototype.anim = function( repeat, frames )
{
	this.animFrames = frames;
	this.animPosition = 0;
	this.animRepeatCounter = repeat;
	this.registers.a = this.animFrames[ 0 ].i;
	this.animCounter = this.animFrames[ 0 ].t;
};
AMALChannel.prototype.direct = function( label )
{
	this.positionMain = label;
	this.wait = false;
	this.waiting = false;
};
AMALChannel.prototype.bobCol = function( number, start, end )
{
	this.collisions = this.aoz.sprites.bobCol( number, this.extra, start, end );
};
AMALChannel.prototype.spriteCol = function()
{
	this.collisions = this.aoz.sprites.spriteCol( number, start, end );
};
AMALChannel.prototype.z = function( mask )
{
	var value = this.aoz.rnd( 65536 );
	if ( typeof mask != 'undefined' )
		value &= mask;
	return value;
};
AMALChannel.prototype.joystick = function( number )
{
};
AMALChannel.prototype.setAMAL = function( number )
{
};

