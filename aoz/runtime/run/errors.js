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
 * Error messages
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 25/01/2018
 */

function Errors( aoz )
{
	this.aoz = aoz;
	
	// <ERRORS-INSERT>
};
Errors.prototype.getErrorFromId = function( id )
{
	id += ':';
	var message;
	for ( var l = 0; l < this.errors.length; l++ )
	{
		if ( this.errors[ l ].indexOf( id ) == 0 )
		{
			message = this.errors[ l ].substring( id.length );
			return { number: l, message: message };
		}
	}
	return { number: -1, message: 'Message not found ' + id };
};
Errors.prototype.getErrorFromNumber = function( number )
{
	if ( number < this.errors.length )
	{
		var message = this.errors[ number ];
		var pos = message.indexOf( ':' );
		if ( pos >= 0 )
		{
			var index = message.substring( 0, pos );
			message = message.substring( pos + 1 );
			return { number: number, message: message, index: index };
		}
	}
	return { number: -1, message: 'Message not found ' + number, index: '' };
};
 
