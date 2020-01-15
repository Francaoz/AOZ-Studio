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
 * AOZ Runtime
 *
 * File access - All the routines to load files
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */
function DOS( aoz )
{
	this.aoz = aoz;
}

/**
 * loadJSON
 *
 * Load a JSON file from server and returns the parsed object
 *
 * @param {string} path the path to the file to load
 */
DOS.prototype.loadJSON = function( path, options, callback, extra )
{
	var request = new XMLHttpRequest();
	request.overrideMimeType( 'application/json' );
	request.open( 'GET', path, true );
	request.onreadystatechange = function ()
	{
		if ( request.readyState == 4 )
		{
			if ( request.status == '200' )
			{
				var result;
				try
				{
					result = JSON.parse( request.responseText );
				}
				catch( e )
				{
					callback( false, 'ERROR - Illegal JSON.', extra );
					return;
				}
				callback( true, result, extra );
			}
			else
			{
				callback( false, 'ERROR - Network error.', extra );
			}
		}
	}
	request.send( null );
}
