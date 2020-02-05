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
 * File system
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 22/12/2018
 */

function Filesystem( aoz )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.currentPath = 'application:';
	this.filterOut = '';
	this.filenameWidth = 30;
	this.data = [];
	this.assigns = {};
	this.openFiles = [];
	this.nextLine = String.fromCharCode( 10 );
	this.noCase = true;
	if ( this.manifest.filesystem && this.aoz.manifest.filesystem.caseSensitive )
		this.noCase = !this.aoz.manifest.filesystem.caseSensitive;

	// Get the content of localStorage
	var currentFiles;
	try
	{
		currentFiles = JSON.parse( localStorage.getItem( 'aoz_current_files' ) );
	}
	catch {}
	if ( currentFiles )
	{
		var toRemove = [];
		for ( var sourcePath in currentFiles.files )
		{
			var column = sourcePath.indexOf( ':' );
			var drive = sourcePath.substring( 0, column );
			var path = sourcePath.substring( column + 1 );
			var filename = this.utilities.getFilenameAndExtension( path );
			var files = Filesystem.files[ drive ];
			var parent = files;
			if ( files )
			{
				var slash = path.indexOf( '/' );
				while( slash >= 0 )
				{
					var f = path.substring( 0, slash );
					if ( f == '' )
						break;
					parent = files;
					files = files[ f ];
					if ( !files )
					{
						files = {};
						parent[ f ] = files;
					}
					path = path.substring( slash + 1 );
					slash = path.indexOf( '/' );
				}
				files[ path ] = { name: filename, length: currentFiles.files[ sourcePath ].l, localStorage: currentFiles.files[ sourcePath ].n };
			}
			else
			{
				// Drive does not exist: delete all files from localStorage
				for ( var pathBad in currentFiles.files )
				{
					var driveBad = pathBad.substring( 0, pathBad.indexOf( ':' ) );
					if ( driveBad == drive )
					{
						localStorage.removeItem( 'aoz_' + currentFiles.files[ pathBad ].n );
						toRemove.push( pathBad );
					}
				}
			}
		}
		if ( toRemove.length )
		{
			var temp = { number: currentFiles.number, files: {} };
			for ( var f in currentFiles.files )
			{
				for ( var ff = 0; ff < toRemove.length; ff++ )
				{
					if ( f != toRemove[ ff ] )
					{
						temp.files[ f ] = currentFiles.files[ f ];
					}
				}
			}
			try
			{
				localStorage.setItem( 'aoz_current_files', JSON.stringify( temp ) );
			}
			catch {}
		}
	}
	this.externalFiles = INSERT_EXTERNALFILES;
}
Filesystem.prototype.getFile = function( path, options )
{
	options = typeof options == 'undefined' ? {} : options;
	var result =
	{
		isFileSystem: true,
		isDirectory: false,
		isURL: false,
		URL$: '',
		parent: null,
		files: null,
		file: null,
		filename: '',
		name:'',
		path: '',
		filter: '',
		error: false
	};

	path = this.utilities.replaceStringInText( path, '\\', '/' );

	while( true )
	{
		var column = path.indexOf( ':' );
		if ( column >= 0 )
		{
			result.drive = path.substring( 0, column );
			path = path.substring( column + 1 );
			var temp;
			if ( ( temp = this.utilities.getProperty( this.assigns, result.drive, this.noCase ) ) )
				result.drive = temp;
		}
		else
		{
			if ( path.indexOf( '/' ) == 0 )
			{
				result.drive = 'application';
			}
			else
			{
				path = this.currentPath + path;
				continue;
			}
		}
		break;
	};

	if ( result.drive.toLowerCase() == 'http' || result.drive.toLowerCase() == 'https' )
	{
		result.isUrl = true;
		result.url$ = path;
		// Extract parameters...
		// Check domains...
		// cf Friend.
	}
	else
	{
		result.files = this.utilities.getProperty( Filesystem.files, result.drive, this.noCase );
		if ( !result.files )
		{
			result.error = 'drive_not_found';
			if ( !options.noErrors )
				throw result.error;
		}
		else
		{
			result.parent = Filesystem;
			result.fullPath = result.drive + ':' + path;

			var slash = path.indexOf( '/' );
			while( slash >= 0 )
			{
				var f = path.substring( 0, slash );
				if ( f == '' )
					break;
				result.parent = result.files;
				result.files = this.utilities.getProperty( result.files, f, this.noCase );
				if ( !result.files )
				{
					result.error = 'directory_not_found';
					if ( !options.noErrors )
						throw result.error;
					break;
				}
				path = path.substring( slash + 1 );
				slash = path.indexOf( '/' );
			}

			if ( !result.error )
			{
				result.name = path;
				result.isDirectory = false;
				if ( path != '' )
				{
					if ( path.indexOf( '*' ) >= 0 || path.indexOf( '?' ) >= 0 )
					{
						result.filter = path;
						result.path = '';
					}
					else
					{
						result.file = this.findFileInDirectory( result.files, path, this.noCase );
						if ( result.file )
						{
							if ( options.askForReplace )
							{
								if ( !confirm( "File already exists, overwrite?" ) )
								{
									result.error = 'cannot_write_file';
									if ( !options.noErrors )
										throw result.error;
								}
							}

							result.isDirectory = result.file.isDirectory;
							if ( !result.file.isDirectory )
							{
								if ( options.onlyDirectories )
								{
									result.error = 'cannot_open_file';
									if ( !options.noErrors )
										throw result.error;
								}
								else
								{
									result.filename = path;
								}
							}
							else
							{
								if ( options.onlyFiles )
								{
									result.error = 'cannot_open_file';
									if ( !options.noErrors )
										throw result.error;
								}
								else
								{
									result.files = result.file;
									result.file = null;
								}
							}
						}
						else
						{
							if ( options.mustExist )
							{
								result.error = 'file_not_found';
								if ( !options.noErrors )
									throw result.error;
							}
						}
					}
				}
				else
				{
					if ( !options.onlyFiles )
					{
						result.isDirectory = true;
						result.isRoot = true;
						result.name  = result.drive;
					}
					else
					{
						if ( !options.noErrors )
							throw 'cannot_open_file';
						result.error = true;
					}
				}
			}
		}
	}
	// Clean results...
	if ( !result.error )
	{
		if ( result.files )
		{
			var temp = {};
			for ( var f in result.files )
			{
				if ( this.utilities.isObject( result.files[ f ] ) )
					temp[ f ] = result.files[ f ];
			}
			result.files = temp;
		}
	}
	return result;
};
Filesystem.prototype.findFileInDirectory = function ( directory, filename, noCase )
{
	var fname = noCase ? filename.toLowerCase() : filename;
	for ( f in directory )
	{
		var file = directory[ f ];
		if ( file && this.utilities.isObject( file ) )
		{
			var name = noCase ? file.name.toLowerCase() : file.name;
			if ( name == fname )
			{
				return file;
			}
		}
	}
	return null;
};

Filesystem.prototype.setInput = function( char1, char2 )
{
	this.nextLine = String.fromCharCode( char1 );
	if ( typeof char2 != 'undefined' && char2 >= 0 )
		this.nextLine += String.fromCharCode( char2 );
};
Filesystem.prototype.openOut = function( port, path, callback, extra )
{
	var fileDefinition = this.getFile( path, { mustExist: false, askForReplace: false } );
	if ( fileDefinition.error )
		throw 'disc_error';
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( this.openFiles[ port ] )
		throw 'file_already_opened';
	this.openFiles[ port ] =
	{
		path: path,
		file: '',
		in: false,
		out: true,
		random: false,
		pof: 0,
		modified: true
	};
	callback( true, {}, extra );
};
Filesystem.prototype.openIn = function( port, path, callback, extra )
{
	var descriptor = this.getFile( path, { mustExist: true } );
	if ( descriptor.error )
		callback( false, 'illegal_function_call', extra );
	if ( port < 1 )
		callback( false, 'illegal_function_call', extra );
	if ( this.openFiles[ port ] )
		callback( false, 'file_already_opened', extra );
	var self = this;
	this.loadFile( descriptor, { binary: false, text: true }, function( response, data, extra )
	{
		if ( response )
		{
			self.openFiles[ port ] =
			{
				path: path,
				file: data,
				in: true,
				out: false,
				random: false,
				pof: 0,
				modified: false
			};
			callback( true, self.openFiles[ port ], extra );
		}
		else
		{
			callback( false, data, extra );
		}
	}, extra );
};
Filesystem.prototype.append = function( port, path, callback, extra )
{
	var descriptor = this.getFile( path, { mustExist: false } );
	if ( descriptor.error )
		callback( false, 'cannot_open_file', extra );
	if ( port < 1 )
		callback( false, 'illegal_function_call', extra );
	if ( this.openFiles[ port ] )
		callback( false, 'file_already_opened', extra );
	if ( descriptor.files[ descriptor.name ] )
	{
		var self = this;
		this.loadFile( descriptor, { binary: false, text: true }, function( response, data, extra )
		{
			if ( response )
			{
				self.openFiles[ port ] =
				{
					path: path,
					file: data,
					in: false,
					out: true,
					random: false,
					pof: data.length,
					modified: false
				};
				callback( true, self.openFiles[ port ], extra );
			}
			else
			{
				callback( false, data, extra );
			}
		}, extra );
	}
	else
	{
		this.openFiles[ port ] =
		{
			path: path,
			file: '',
			in: false,
			out: true,
			random: false,
			pof: 0,
			modified: true
		};
		callback( true, this.openFiles[ port ], extra );
	}
};
Filesystem.prototype.print = function( port, text, newLine )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( !file.out )
		throw 'file_type_mismatch';
	if ( newLine )
		text += this.nextLine;
	file.file = file.file.substring( 0, file.pof ) + text + file.file.substring( file.pof + text.length );
	file.pof += text.length;
	file.modified = true;
};
Filesystem.prototype.input = function( port, variables, commas )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( !file.in )
		throw 'file_type_mismatch';
	for ( var v = 0; v < variables.length; v++ )
	{
		var variable = variables[ v ];

		if ( file.pof >= file.file.length )
			throw 'end_of_file';

		var posComma = -1;
		if ( commas )
			posComma = file.file.indexOf( ',', file.pof );
		posComma = posComma >= 0 ? posComma : file.file.length;
		var posNewLine = file.file.indexOf( this.nextLine, file.pof );
		posNewLine = posNewLine >= 0 ? posNewLine :  file.file.length;

		var delta = 0;
		if ( posComma < file.file.length )
			delta = 1;
		if ( posNewLine < file.file.length )
			delta = this.nextLine.length;

		var pos = posComma < posNewLine ? posComma : posNewLine;
		var text = file.file.substring( file.pof, pos );
		file.pof += text.length + delta;
		var value;
		if ( variable.type == 0 )
			value = parseInt( text );
		else if ( variable.type == 1 )
			value = parseFloat( text );
		else
			value = text;
		if ( variable.type != 2 && isNaN( value ) )
			value = 0;
		this.aoz.setVariable( variable, value );
	}
};
Filesystem.prototype.eof = function( port )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	return this.openFiles[ port ].pof >= this.openFiles[ port ].file.length;
};
Filesystem.prototype.lof = function( port )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( file.random )
		throw 'file_type_mismatch';
	return file.file.length;
};
Filesystem.prototype.setPof = function( port, position )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( file.random )
		throw 'file_type_mismatch';
	if ( position < 0 || position > file.file.length )
		throw 'illegal_function_call';
	return file.pof = position;
};
Filesystem.prototype.getPof = function( port )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	if ( file.random )
		throw 'file_type_mismatch';
	return this.openFiles[ port ].pof;
};
Filesystem.prototype.close = function( port, callback, extra )
{
	var self = this;
	if ( typeof port != 'undefined' )
	{
		if ( port < 1 )
			throw 'illegal_function_call';
		if ( !this.openFiles[ port ] )
			throw 'file_not_opened';
		var file = this.openFiles[ port ];
		if ( file.modified )
		{
			var descriptor = self.getFile( file.path );
			this.saveFile( descriptor, file.file, {}, function( response, data, extra )
			{
				if ( response )
					self.openFiles[ port ] = null;
				callback( response, data, extra );
			}, extra );
		}
		else
		{
			this.openFiles[ port ] = null;
			callback( true, {}, extra );
		}
	}
	else
	{
		var count = 0;
		for ( var f = 0; f < this.openFiles.length; f++ )
		{
			if ( this.openFiles[ f ] && this.openFiles[ f ].modified )
				count++;
		}
		if ( count )
		{
			var errors;
			for ( var f = 0; f < this.openFiles.length; f++ )
			{
				var file = this.openFiles[ f ];
				if ( file && file.modified )
				{
					var descriptor = self.getFile( file.path );
					this.saveFile( descriptor, file.file, {}, function( response, data, extra )
					{
						if ( response )
							this.openFiles[ extra ] = null;
						else if ( !errors )
							errors = data;
						count--;
						if ( count == 0 )
						{
							if ( !errors )
								callback( true, {}, extra );
							else
								callback( false, errors, extra );
						}

					}, f );
				}
				else
				{
					this.openFiles[ f ] = null;
				}
			}
		}
		else
		{
			callback( true, {}, extra );
		}
	}
};
Filesystem.prototype.openRandom = function( port, path, callback, extra )
{
	var descriptor = this.getFile( path, { mustExist: false } );
	if ( descriptor.error )
		callback( false, 'illegal_function_call', extra );
	if ( port < 1 )
		callback( false, 'illegal_function_call', extra );
	if ( this.openFiles[ port ] )
		callback( false, 'file_already_opened', extra );
	if ( descriptor.files[ descriptor.name ] )
	{
		var self = this;
		this.loadFile( descriptor, { binary: false, text: true }, function( response, data, extra )
		{
			if ( response )
			{
				self.openFiles[ port ] =
				{
					path: path,
					file: data,
					in: false,
					out: false,
					random: true,
					pof: data.length,
					fields: [],
					variables: [],
					modified: false
				};
				callback( true, self.openFiles[ port ], extra );
			}
			else
			{
				callback( false, data, extra );
			}
		}, extra );
	}
	else
	{
		this.openFiles[ port ] =
		{
			path: path,
			file: '',
			in: false,
			out: false,
			random: true,
			pof: 0,
			fields: [],
			variables: [],
			modified: true
		};
		callback( true, this.openFiles[ port ], extra );
	}
};
Filesystem.prototype.field = function( port, variables, fields )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( !file.random )
		throw 'file_type_mismatch';
	file.variables = variables;
	file.fields = fields;
	file.fieldsLength = 0;
	for ( var f = 0; f < fields.length; f++ )
		file.fieldsLength += fields[ f ];
};
Filesystem.prototype.put = function( port, field )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( !file.random )
		throw 'file_type_mismatch';
	if ( typeof file.fieldsLength == 'undefined' )
		throw 'illegal_function_call';
	if ( typeof field == 'undefined' )
		throw 'illegal_function_call';
	field--;
	if ( field < 0 )
		throw 'illegal_function_call';

	var fileNumberOfFields = file.file.length / file.fieldsLength;
	if ( Math.floor( file.file.length / file.fieldsLength ) != fileNumberOfFields )
		throw 'corrupted_file';

	var field$ = '';
	for ( var f = 0; f < file.fieldsLength; f++ )
		field$ += ' ';
	if ( fileNumberOfFields < field )
	{
		for ( var f = fileNumberOfFields; f < field; f++ )
			file.file += field$;
	}

	var pos = 0;
	for ( var v = 0; v < file.variables.length; v++ )
	{
		var text = this.aoz.getVariable( file.variables[ v ] ).substring( 0, file.fields[ v ] );
		field$ = field$.substring( 0, pos ) + text + field$.substring( pos + text.length );
		pos += file.fields[ v ];
	}
	file.file = file.file.substring( 0, field * file.fieldsLength ) + field$ + file.file.substring( ( field + 1 ) * file.fieldsLength );
	file.modified = true;
};

Filesystem.prototype.get = function( port, field )
{
	if ( port < 1 )
		throw 'illegal_function_call';
	if ( !this.openFiles[ port ] )
		throw 'file_not_opened';
	var file = this.openFiles[ port ];
	if ( !file.random )
		throw 'file_type_mismatch';
	if ( typeof file.fieldsLength == 'undefined' )
		throw 'illegal_function_call';
	if ( typeof field == 'undefined' )
		throw 'illegal_function_call';
	field--;
	if ( field < 0 )
		throw 'illegal_function_call';

	var fileNumberOfFields = file.file.length / file.fieldsLength;
	if ( Math.floor( file.file.length / file.fieldsLength ) != fileNumberOfFields )
		throw 'corrupted_file';
	if ( field >= fileNumberOfFields )
		throw 'end_of_file';

	var pos = field * file.fieldsLength;
	for ( var v = 0; v < file.variables.length; v++ )
	{
		var text = file.file.substr( pos, file.fields[ v ] );
		this.aoz.setVariable( file.variables[ v ], text );
		pos += file.fields[ v ];
	}
};

Filesystem.prototype.saveFile = function( descriptor, source, options, callback, extra )
{
	if ( !this.storageAvailable( 'localStorage' ) )
		callback( false, 'local_storage_not_available', extra );

	var currentFiles;
	try
	{
		currentFiles = JSON.parse( localStorage.getItem( 'aoz_current_files' ) );
	}
	catch {}
	if ( !currentFiles )
		currentFiles = { number: 0, files: {} };

	var fileNumber, temp;
	if ( ( temp = this.utilities.getProperty( currentFiles.files, descriptor.path, this.noCase ) ) )
		fileNumber = temp.n;
	else
		fileNumber = currentFiles.number++;

	var length, type;
	if ( typeof source == 'string' )
	{
		try
		{
			localStorage.setItem( 'aoz_' + fileNumber, source );
			length = source.length;
			type = 't';
		}
		catch( error )
		{
			callback( false, 'disc_full', extra );
		}
	}
	else
	{
		var base64 = this.utilities.convertArrayBufferToString( source )
		try
		{
			localStorage.setItem( 'aoz_' + fileNumber, base64 );
			length = source.byteLength;
			type = 'b';
		}
		catch( error )
		{
			callback( false, 'disc_full', extra );
		}
	}
	descriptor.files[ descriptor.filename ] = { length: length, localStorage: fileNumber, type: type };

	currentFiles.files[ descriptor.path ] = { n: fileNumber, l: length, t: type };
	localStorage.setItem( 'aoz_current_files', JSON.stringify( currentFiles ) );
	callback( true, {}, extra );
};
Filesystem.prototype.loadFile = function( descriptor, options, callback, extra )
{
	file = this.findFileInDirectory( descriptor.files, descriptor.name, this.noCase );
	if ( !file )
	{
		callback( false, 'file_not_found', extra );
		return;
	}

	if ( typeof file.localStorage == 'undefined' )
	{
		var self = this;
		var name = '';
		if ( file.context )
			name += file.context + '_';
		name += file.number;
		this.utilities.loadScript( './resources/filesystem/' + name  + '.js', {}, function( response, data, extra )
		{
			if ( response )
			{
				var data = Filesdata[ name ];//file.number ];
				if ( options.binary )
				{
					data = self.utilities.convertStringToArrayBuffer( data );
					//Filesdata[ file.number ] = '';
				}
				else if ( options.text )
				{
					var arrayBuffer = self.utilities.convertStringToArrayBuffer( data );
					var view = new Uint8Array( arrayBuffer );
					data = '';
					for ( var p = 0; p < view.byteLength; p++ )
						data += String.fromCharCode( view[ p ] );
				}
				callback( true, data, extra );
				return;
			}
			callback( false, 'cannot_load_file', extra );
		}, extra );
	}
	else
	{
		if ( !this.storageAvailable( 'localStorage' ) )
			throw 'local_storage_not_available';
		var data = localStorage.getItem( 'aoz_' + file.localStorage );
		if ( options.binary )
		{
			data = this.utilities.convertStringToArrayBuffer( data );
		}
		callback( true, data, extra );
	}
};

Filesystem.prototype.saveBinary = function( path, options, callback, extra )
{
	var descriptor = this.getFile( path, { mustExist: false } );
	if ( descriptor.error )
	{
		var memoryBlock = this.aoz.getMemoryBlockFromAddress( options.start );
		var arrayBuffer = memoryBlock.extractArrayBuffer( options.start, options.end );
		if ( arrayBuffer )
		{
			this.saveFile( descriptor, arrayBuffer, {}, callback, extra );
			return;
		}
	}
	callback( false, 'disc_error', extra );
};
Filesystem.prototype.loadBinary = function( path, start, callback, extra )
{
	var fileDefinition = this.getFile( path, { mustExist: true, noDirectory: true, noErrors: true } );
	if ( fileDefinition.error )
		callback( false, error, extra );

	var self = this;
	this.loadFile( fileDefinition, { binary: true }, function( response, data, extra )
	{
		if ( response )
		{
			var info = self.aoz.getMemory( start );
			try
			{
				info.block.pokeArrayBuffer( info.start, data );
			}
			catch( error )
			{
				callback( false, error, extra );
				return;
			}
			callback( true, info, extra );
		}
		else
		{
			callback( false, 'cannot_load_file', extra );
		}
	}, extra );
};

Filesystem.prototype.dir = function( path )
{
	path = typeof path == 'undefined' ? this.currentPath : path;
	var info = this.getFile( path );
	if ( info.isDirectory )
	{
		var message = this.aoz.errors.getErrorFromId( 'directory_of' ).message;
		message = this.utilities.replaceStringInText( message, '%1', path );
		this.aoz.currentScreen.currentTextWindow.print( message, true );
		for ( var f in info.files )
		{
			var file = info.files[ f ];
			if ( this.utilities.isObject( file ) && file.name )
			{
				if ( this.filter( file.name, info.filter ) )
				{
					if ( this.filterOut == '' || ( this.filterOut != '' && !this.filter( file.name, this.filterOut ) ) )
					{
						var line = this.getFileDescription( file );
						this.aoz.currentScreen.currentTextWindow.print( line, true );
					}
				}
			}
		}
	}
};
Filesystem.prototype.getFileDescription = function( file )
{
	var line = '';
	var name = file.name;
	/*
	var filename = name.substring( 0, Math.min( this.filenameWidth, name.length ) );
	while( filename.length < this.filenameWidth )
		filename += ' ';
	if ( typeof file.length != 'undefined' )
		line = '  ' + filename + file.length;
	else
		line = '* ' + filename;
	return line;
	*/
	return name;
};
Filesystem.prototype.filter = function( name, filter )
{
	if ( filter == '' )
		return true;

	name = this.noCase ? name : name.toLowerCase();
	filter = this.noCase ? filter : filter.toLowerCase();

	// Before the dot
	var f = 0;
	for ( var n = 0; n < name.length; n++ )
	{
		var char = name.charAt( n );
		if ( char == '.' )
			break;
		var charFilter = filter.charAt( f );
		if ( charFilter == '*' )
		{
			n = name.indexOf( '.' ) >= 0 ? name.indexOf( '.' ) : name.length;
			break;
		}
		if ( charFilter != '?' )
		{
			if ( char != charFilter )
				return false;
		}
		f++;
	}
	if ( n == name.length )
		return true;
	f = filter.indexOf( '.' );
	if ( f < 0 )
		return false;
	for ( ++n, ++f; n < name.length; n++ )
	{
		var char = name.charAt( n );
		var charFilter = filter.charAt( f );
		if ( charFilter == '*' )
			return true;
		if ( charFilter != '?' )
		{
			if ( char != charFilter )
				return false;
		}
		f++;
	}
	return true;
};
Filesystem.prototype.dirFirst$ = function( path )
{
	path = typeof path == 'undefined' ? this.currentPath : path;
	var info = this.getFile( path, { mustExist: true, onlyDirectory: true } );
	this.fileList = [];
	this.fileListPosition = 0;
	for ( var f in info.files )
	{
		var file = info.files[ f ];
		if ( this.filter( file.name, info.filter ) )
		{
			if ( this.filterOut == '' || ( this.filterOut != '' && !this.filter( file.name, this.filterOut ) ) )
			{
				this.fileList.push( info.files[ f ] );
			}
		}
	}
	return this.dirNext$();
};
Filesystem.prototype.dirNext$ = function()
{
	if ( typeof this.fileList == 'undefined' )
		throw 'illegal_function_call';
	if ( this.fileListPosition < this.fileList.length )
	{
		var file = this.fileList[ this.fileListPosition++ ];
		return this.getFileDescription( file );
	}
	return '';
};
Filesystem.prototype.mkDir = function( path )
{
	if ( path == '' )
		throw 'illegal_function_call';
	var info = this.getFile( path, { mustExist: false } );
	info.files[ info.name ] = {};
};
Filesystem.prototype.exist = function( path )
{
	if ( path == '' )
		throw 'illegal_function_call';
	var info = this.getFile( path, { mustExist: true, noErrors: true } );
	return !info.error;
};
Filesystem.prototype.setDir = function( width, filterOut )
{
	width = typeof width == 'undefined' ? 30 : width;
	if ( width <= 0 )
		throw 'illegal_function_call';
	this.filenameWidth = width;
	if ( typeof filterOut != 'undefined' )
		this.filterOut = filterOut;
};
Filesystem.prototype.rename = function( path, name )
{
	var info = this.getFile( path, { mustExist: true, onlyFiles: true } );
	if ( this.findFileInDirectory( info.files, name, this.noCase ) )
		throw 'file_already_exist';
	info.file.name = name;
};
Filesystem.prototype.kill = function( path )
{
	var info = this.getFile( path, { mustExist: true, onlyFiles: true } );
	info.files = this.utilities.cleanObject( info.files, info.file, this.noCase );
};
Filesystem.prototype.setDir$ = function( path )
{
	path = this.utilities.replaceStringInText( path, '\\', '/' );
	var end = path.charAt( path.length - 1 );
	if ( end != ':' && end != '/' )
		path += '/';
	this.getFile( path, { mustExist: true, onlyDirectory: true } );		// Genrates errors...
	this.currentPath = path;
};
Filesystem.prototype.getDir$ = function()
{
	return this.currentPath;
};
Filesystem.prototype.assign = function( from, to )
{
	if ( from.charAt( from.length - 1 ) == ':' )
		from = from.substring( 0, from.length - 1 );
	if ( to.charAt( to.length - 1 ) == ':' )
		to = to.substring( 0, to.length - 1 );
	if ( !Filesystem.files[ to ] )
		throw 'drive_not_found';
	this.assigns[ from ] = to;
};
Filesystem.prototype.parent = function()
{
	var pos = this.currentPath.lastIndexOf( '/' );
	if ( pos >= 0 )
	{
		pos = this.currentPath.lastIndexOf( '/', pos - 1 );
		if ( pos < 0 )
		{
			pos = this.currentPath.indexOf( ':' );
			if ( pos < 0 )
				pos = 0;
		}
		this.currentPath = this.currentPath.substring( 0, pos + 1 );
	}
};
Filesystem.prototype.dFree = function()
{
	if ( localStorage )
	{
		var i = 0;
		try
		{
			// Test up to 10 MB
			for ( i = 1000; i <= 10000; i += 1000 )
			{
				localStorage.setItem( 'size_test', new Array( ( i * 1024 ) + 1 ).join( 'a' ) );
			}
		}
		catch (e)
		{
			localStorage.removeItem( 'size_test' );
			return ( i - 1000 ) * 1024;
		}
	}
	return 0;
};
Filesystem.prototype.discInfo$ = function( path )
{
	var pos = path.indexOf( ':' );
	if ( pos >= 0 )
	{
		var drive = path.substring( 0, pos );
		if ( this.assigns[ drive ] )
			drive = this.assigns[ drive ];
		if ( !Filesystem.files[ drive ] )
			throw 'drive_not_found';
		return drive + ':' + this.dFree;
	}
	throw 'drive_not_found';
};

Filesystem.prototype.storageAvailable = function( type )
{
	try
	{
        var storage = window[ type ],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
	catch(e)
	{
		return e instanceof DOMException && ( e.code === 22 || e.code === 1014 || e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && storage.length !== 0;
    }
};

Filesystem.files=
{
INSERT_TREE
};
Filesdata = {};