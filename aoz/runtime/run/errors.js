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
	this.language = this.aoz.utilities.getBrowserLanguage();
	
	// <ERRORS-INSERT>
};
Errors.prototype.getError = function( error )
{
	if ( typeof error == 'string' )
		error = { error: error, params: [] };
	var id = error.error + ':';

	// First in browser language
	var result = getError( this.errors[ this.language ], error );
	if ( result ) 
		return result;
	
	// Then in English
	if ( this.language != 'us' )
	{
		result = getError( this.errors[ 'us' ], error );
		if ( result ) 
			return result;
	}

	// Then any language (TODO: keep?)
	for ( var l in this.errors )
	{
		if ( l != this.language && l != 'us' )
		{
			result = getError( this.errors[ l ], error );
			if ( result ) 
				return result;
		}
	}

	// Then just the message...
	return { number: -1, index: '', message: error.error };

	function getError( errorList, error )
	{
		if ( errorList )
		{
			var number = errorList.findIndex( function( element )
			{
				return element.indexOf( id ) == 0;
			}) 
			if ( number )
			{
				var message = errorList[ number ].substring( id.length );
				for ( var p = 0; p < error.params.length; p++ )
					message = this.aoz.utilities.replaceStringInText( message, '%' + ( p + 1 ), error.params[ p ] );
				return { number: number, index: id.substring( 0, id.length - 1 ), message: message };
			}
		}		
		return undefined;
	}
};
Errors.prototype.getErrorFromNumber = function( number )
{
	// Browser language
	var result = getError( this.errors[ this.language ], number )
	if ( result )
		return result;
	
	// English!
	if ( this.language != 'us' )
	{
		result = getError( this.errors[ 'us' ], number )
		if ( result )
			return result;
	}
	
	// Any language (TODO: keep?)
	for ( var l in this.errors )
	{
		if ( l != this.language && l != 'us' )
		{
			result = getError( this.errors[ l ], number );
			if ( result ) 
				return result;
		}
	}
	return { number: number, message: 'Message not found ' + number, index: '' };
	
	function getError( list, num )
	{
		if ( num < list.length )
		{
			var message = list[ num ];
			var pos = message.indexOf( ':' );
			if ( pos >= 0 )
			{
				return { number: num, message: message.substring( pos + 1 ), index: message.substring( 0, pos ) };
			}
		}
		return undefined;
	}	
};
