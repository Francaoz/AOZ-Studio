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
 * AMAL, a transpiler in a transpiled application! :)
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

var AMALTokens =
[
	{ abbreviation: 'M', token: 'Move', params: [ 'I0,0,0' ], compile: [ 'return{type:2,instruction:"move",args:[%$P0,%$P1,%$P2]};' ], waiting: true, newBlock: true },
	{ abbreviation: 'A', token: 'Anim', params: [ '0', 'I'  ], compile: [ 'this.amal.registers.a', '#handleAnim' ], newBlock: false, register: 'a', channelRegister: true, toUpdate: 0b100 },
	{ abbreviation: 'J', token: 'Jump', params: [ 'J' ], compile: [ '#handleJump' ], autotest: true },
	{ abbreviation: 'L', token: 'Let', params: [ 'I' ], compile: [ '#handleLet' ], newBlock: false, autotest: true },
	{ abbreviation: 'I', token: 'I', params: [ 'I' ], compile: [ '#handleIf' ], autotest: true },
	{ abbreviation: 'F', token: 'For', params: [ 'I' ], compile: [ '#handleFor'], newBlock: true },
	{ abbreviation: 'T', token: 'To', params: [ 'I' ], compile: [], newBlock: false },
	{ abbreviation: 'N', token: 'Next', params: [ 'I' ], compile: [ '#handleNext' ], newBlock: true },
	{ abbreviation: 'AU', token: 'AUtotest', params: [ 'I' ], compile: [ '#handleAutotest'], newBlock: false },
	{ abbreviation: 'D', token: 'Direct', params: [ 'I' ], compile: [ '#handleDirect' ], newBlock: false, autotest: true },
	{ abbreviation: 'E', token: 'End', params: [ 'I' ], compile: [ 'return{type:0};' ], newBlock: true },
	{ abbreviation: 'X', token: 'eXit', params: [ '0', 'I' ], compile: [ 'this.amal.registers.x', 'return{type:0};' ], newBlock: true, register: 'x', channelRegister: true, toUpdate: 0b001, autotest: true },
	{ abbreviation: 'O', token: 'On', params: [ 'I' ], compile: [ 'this.amal.wait=false;' ], newBlock: true, autotest: true },
	{ abbreviation: 'P', token: 'Pause', params: [ 'I' ], compile: [ '' ], newBlock: true, autotest: true },
	{ abbreviation: 'W', token: 'Wait', params: [ 'I' ], compile: [ 'this.amal.wait=true;' ], newBlock: true, autotest: true },
	{ abbreviation: 'PL', token: 'PLay', params: [ 'I0' ], compile: [ 'this.amal.play(%$P1);' ], newBlock: false },
	{ abbreviation: 'BC', token: 'Bob Col', params: [ '00,0,0' ], compile: [ 'this.amal.bobCol(%$P0,%$P1,%$P2)' ] },
	{ abbreviation: 'SC', token: 'Sprite Col', params: [ '00,0,0' ], compile: [ 'this.amal.spriteCol(%$P0,%$P1,%$P2)' ] },
	{ abbreviation: 'VU', token: 'VU meter', params: [ '00' ], compile: [ 'this.amal.vuMeter(%$P0)' ] },
	{ abbreviation: 'Z', token: 'Zrandom', params: [ '00' ], compile: [ 'this.amal.z(%$P0)' ] },
	{ abbreviation: 'XH', token: 'X Hard', params: [ '00,0' ], compile: [ 'this.aoz.xHard(%$P1,%$P0)' ] },
	{ abbreviation: 'YH', token: 'Y Hard', params: [ '00,0' ], compile: [ 'this.aoz.yHard(%$P1,%$P0)' ] },
	{ abbreviation: 'XM', token: 'X Mouse', params: [ '0' ], compile: [ 'this.aoz.xMouse' ] },
	{ abbreviation: 'YM', token: 'Y Mouse', params: [ '0' ], compile: [ 'this.aoz.yMouse' ] },
	{ abbreviation: 'XS', token: 'X Screen', params: [ '00,0' ], compile: [ 'this.aoz.xScreen(%$P1,%$P0)' ] },
	{ abbreviation: 'YS', token: 'Y Screen', params: [ '00,0' ], compile: [ 'this.aoz.yScreen(%$P1,%$P0)' ] },
	{ abbreviation: 'C', token: 'Col', params: [ '00' ], compile: [ 'this.amal.collisions' ] },
	{ abbreviation: 'J0', token: 'Joystick 0', params: [ '0' ], compile: [ 'this.aoz.joy(0)' ] },
	{ abbreviation: 'J1', token: 'Joystick 1', params: [ '0' ], compile: [ 'this.aoz.joy(1)' ] },
	{ abbreviation: 'K1', token: 'mouseKey 1', params: [ '0' ], compile: [ '((this.aoz.mouseButtons&0b001)!=0)' ] },
	{ abbreviation: 'K2', token: 'mouseKey 2', params: [ '0' ], compile: [ '((this.aoz.mouseButtons&0b010)!=0)' ] },
	{ abbreviation: 'E', token: 'End', params: [ 'I' ], compile: [ 'return{type:0};' ], newBlock: true },
	//{ abbreviation: 'X', token: 'X', params: '0', compile: [ 'this.amal.registers.x' ], register: 'x', toUpdate: 0b001, channelRegister: true },
	{ abbreviation: 'Y', token: 'Y', params: '0', compile: [ 'this.amal.registers.y' ], register: 'y', toUpdate: 0b010, channelRegister: true },
	{ abbreviation: 'R0', token: 'R0', params: '0', compile: [ 'this.amal.registers["0"]' ], register: '0' },
	{ abbreviation: 'R1', token: 'R1', params: '0', compile: [ 'this.amal.registers["1"]' ], register: '1' },
	{ abbreviation: 'R2', token: 'R2', params: '0', compile: [ 'this.amal.registers["2"]' ], register: '2' },
	{ abbreviation: 'R3', token: 'R3', params: '0', compile: [ 'this.amal.registers["3"]' ], register: '3' },
	{ abbreviation: 'R4', token: 'R4', params: '0', compile: [ 'this.amal.registers["4"]' ], register: '4' },
	{ abbreviation: 'R5', token: 'R5', params: '0', compile: [ 'this.amal.registers["5"]' ], register: '5' },
	{ abbreviation: 'R6', token: 'R6', params: '0', compile: [ 'this.amal.registers["6"]' ], register: '6' },
	{ abbreviation: 'R7', token: 'R7', params: '0', compile: [ 'this.amal.registers["7"]' ], register: '7' },
	{ abbreviation: 'R8', token: 'R8', params: '0', compile: [ 'this.amal.registers["8"]' ], register: '8' },
	{ abbreviation: 'R9', token: 'R9', params: '0', compile: [ 'this.amal.registers["9"]' ], register: '9' },
	{ abbreviation: 'RA', token: 'RA', params: '0', compile: [ 'this.amal.amal.registers["A"]' ], register: 'A' },
	{ abbreviation: 'RB', token: 'RB', params: '0', compile: [ 'this.amal.amal.registers["B"]' ], register: 'B' },
	{ abbreviation: 'RC', token: 'RC', params: '0', compile: [ 'this.amal.amal.registers["C"]' ], register: 'C' },
	{ abbreviation: 'RD', token: 'RD', params: '0', compile: [ 'this.amal.amal.registers["D"]' ], register: 'D' },
	{ abbreviation: 'RE', token: 'RE', params: '0', compile: [ 'this.amal.amal.registers["E"]' ], register: 'E' },
	{ abbreviation: 'RF', token: 'RF', params: '0', compile: [ 'this.amal.amal.registers["F"]' ], register: 'F' },
	{ abbreviation: 'RG', token: 'RG', params: '0', compile: [ 'this.amal.amal.registers["G"]' ], register: 'G' },
	{ abbreviation: 'RH', token: 'RH', params: '0', compile: [ 'this.amal.amal.registers["H"]' ], register: 'H' },
	{ abbreviation: 'RI', token: 'RI', params: '0', compile: [ 'this.amal.amal.registers["I"]' ], register: 'I' },
	{ abbreviation: 'RJ', token: 'RJ', params: '0', compile: [ 'this.amal.amal.registers["J"]' ], register: 'J' },
	{ abbreviation: 'RK', token: 'RK', params: '0', compile: [ 'this.amal.amal.registers["K"]' ], register: 'K' },
	{ abbreviation: 'RL', token: 'RL', params: '0', compile: [ 'this.amal.amal.registers["L"]' ], register: 'L' },
	{ abbreviation: 'RM', token: 'RM', params: '0', compile: [ 'this.amal.amal.registers["M"]' ], register: 'M' },
	{ abbreviation: 'RN', token: 'RN', params: '0', compile: [ 'this.amal.amal.registers["N"]' ], register: 'N' },
	{ abbreviation: 'RO', token: 'RO', params: '0', compile: [ 'this.amal.amal.registers["O"]' ], register: 'O' },
	{ abbreviation: 'RP', token: 'RP', params: '0', compile: [ 'this.amal.amal.registers["P"]' ], register: 'P' },
	{ abbreviation: 'RQ', token: 'RQ', params: '0', compile: [ 'this.amal.amal.registers["Q"]' ], register: 'Q' },
	{ abbreviation: 'RR', token: 'RR', params: '0', compile: [ 'this.amal.amal.registers["R"]' ], register: 'R' },
	{ abbreviation: 'RS', token: 'RS', params: '0', compile: [ 'this.amal.amal.registers["S"]' ], register: 'S' },
	{ abbreviation: 'RT', token: 'RT', params: '0', compile: [ 'this.amal.amal.registers["T"]' ], register: 'T' },
	{ abbreviation: 'RU', token: 'RU', params: '0', compile: [ 'this.amal.amal.registers["U"]' ], register: 'U' },
	{ abbreviation: 'RV', token: 'RV', params: '0', compile: [ 'this.amal.amal.registers["V"]' ], register: 'V' },
	{ abbreviation: 'RW', token: 'RW', params: '0', compile: [ 'this.amal.amal.registers["W"]' ], register: 'W' },
	{ abbreviation: 'RX', token: 'RX', params: '0', compile: [ 'this.amal.amal.registers["X"]' ], register: 'X' },
	{ abbreviation: 'RY', token: 'RY', params: '0', compile: [ 'this.amal.amal.registers["Y"]' ], register: 'Y' },
	{ abbreviation: 'RZ', token: 'RZ', params: '0', compile: [ 'this.amal.amal.registers["Z"]' ], register: 'Z' }
];

function AMALCompiler( aoz )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
}
AMALCompiler.prototype.compile = function( source, options )
{
	this.errors = [];
	if ( !options )
		options = {};
	if ( !options.tabs )
		options.tabs = '\t';

	// Compile
	var info = this.compileLoop( source, false, options );
	if ( this.utilities.isArray( info ) )
		return info;

	// Build the code
	var code = 'function %$NAME(aoz,amal)\n'
	code += '{\n';
	code += '	this.aoz=aoz;\n';
	code += ' 	this.amal=amal;\n';

	// Insertion of the blocks of code
	code += '\tthis.blocks=[];\n';
	for ( var b = 0; b < info.blocks.length; b++ )
	{
		code += '\tthis.blocks[' + b + ']=function()\n\t{\n';
		code += info.blocks[ b ];
		code += '\t};\n';
	}

	// Insertion of the autotest
	code += '\tthis.blocksAutotest=[];\n';
	if ( info.autotest )
	{
		for ( var b = 0; b < info.childInfo.blocks.length; b++ )
		{
			code += '\tthis.blocksAutotest[' + b + ']=function()\n\t{\n';
			code += info.childInfo.blocks[ b ];
			code += '\t};\n';
		}
	}
	code += '}\n';

	return code;
}
AMALCompiler.prototype.compileLoop = function( source, parent, options )
{
	options.tabs += '\t';
	var info = new Information( source, this, options );
	if ( parent )
	{
		info.parent = parent;
		parent.childInfo = info;
	}
	this.toCompile = [];

	var quit = false;
	while( !quit )
	{
		try
		{
			info.extractNextWord( '#instruction' );
			if ( info.eol )
				break;

			switch ( info.type )
			{
				case 'label':
					var label = info.labels[ info.abbreviation ];
					if ( !label )
					{
						label =
						{
							name: info.abbreviation,
							info: info,
							toReplace: []
						};
					}
					info.nextBlock( '' );
					label.block = info.blockNumber;
					info.labels[ info.abbreviation ] = label;
					break;
				case 'token':
					var token = info.token;
					info.waitingFunctionCount = 0;

					// A normal token
					if ( typeof token.compile == 'undefined' )
						info.throwError( 'instruction_not_implemented' );

					// Must be a normal instruction
					var isInstruction = false;
					var isJump = false;
					var isParams = false;
					if ( typeof token.params == 'string' )
					{
						isInstruction = true;
					}
					else
					{
						for ( var t = 0; t < token.params.length; t++ )
						{
							var c = token.params[ t ].charAt( 0 );
							if ( c == 'I' || c == 'V' )
							{
								isInstruction = true;
								isParams = true;
								break;
							}
							if ( c == 'J' )
							{
								isJump = true;
								break;
							}
						}
					}
					if ( !isInstruction && !isJump )
						info.throwError( 'instruction_not_implemented' );

					// In autotest?
					if ( info.parent && !token.autotest )
						info.throwError( 'syntax_error' );

					// Extract the parameters
					var found = !isParams;
					var params = 0, numberOfParams = 0;
					var isVariable = ( token.params[ 0 ].charAt( 0 ) == 'V' );
					var isReservedVariable = 0;
					var foundSyntax = isVariable ? 'V' : 'I';
					var parameters = [];
					var positions = [];
					if ( isParams || isJump )
					{
						// Special case?
						var func = token.compile[ t ];
						if ( func.indexOf( '#' ) == 0 )
						{
							specialCases[ func.substring( 1 ) ].call( this, info );
							break;
						}

						info.peekNextWord();
						if ( info.text == '(' )
						{
							if ( isVariable )
								info.setPeekNextWordEnd();
						}
						else if ( isVariable )
						{
							info.endOfInstruction = true;
						}
						info.peekNextWord( '#function' );
						if ( info.type != 'token' && info.type != 'number' )
							info.endOfInstruction = true;

						if ( !info.endOfInstruction )
						{
							while( true )
							{
								positions[ foundSyntax.length ] = info.position;
								info.compileExpression( isVariable );
								parameters[ params ] = info.result;
								switch( info.returnType )
								{
									case '0':
									case '1':
										foundSyntax += '0';
										break;
									case '2':
										foundSyntax += '2';
										break;
									case '?':
										foundSyntax += '?';
										break;
								}

								info.peekNextWord();
								if ( info.endOfInstruction )
								{
									numberOfParams = params + 1;
									break;
								}
								if ( info.text == ')' )
								{
									numberOfParams = params + 1;
									if ( !isVariable )
										info.throwError( 'syntax_error' );
									info.position = info.peekNextWordEnd;
									break;
								}
								if ( info.text.toLowerCase() == 'to' )
									foundSyntax += 't';
								else if ( info.text.toLowerCase() == ',' )
									foundSyntax += ',';
								else
								{
									numberOfParams = params + 1;
									break;
								}
									
								info.setPeekNextWordEnd();
								params++;
							}
						}
						var paramNumber = 0;
						for ( var s = 0; s < token.params.length; s++ )
						{
							var syntax = token.params[ s ];
							if ( foundSyntax.length == syntax.length )
							{
								if ( foundSyntax == syntax )
								{
									found = true;
									break;
								}
								for ( var p = 1; p < foundSyntax.length; p++ )
								{
									if ( foundSyntax.charAt( p ) == '?' )
									{
										foundSyntax = syntax.substring( 0, p ) + syntax.charAt( p ) + syntax.substring( p + 1 );
									}
									else if ( syntax.charAt( p ) >= 'A' && syntax.charAt( p ) <= 'C' )
									{
										foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
										isReservedVariable = p;
									}
								}
								var paramNumber = 0;
								for ( var p = 1; p < syntax.length; p++ )
								{
									var foundChar = foundSyntax.charAt( p );
									var char = syntax.charAt( p );
									if ( foundChar != char )
									{
										if ( char == '3' )
										{
											parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*this.aoz.degreeRadian';
										}
										else if ( char != '?' )
										{
											if ( this.utilities.getCharacterType( char ) == 'number')
												info.throwError( 'type_mismatch' );
											else
												info.throwError( 'syntax_error' );
										}
									}
									if ( char == ',' || char == 't' )
										paramNumber++;
								}
								if ( p >= syntax.length )
								{
									found = true;
									break;
								}
							}
						}
					}
					if ( !found )
						info.throwError( 'syntax_error' );

					// Generates the code
					var code = isParams ? token.compile[ s ] : token.compile;
					if ( code != '' )
					{
						if ( isVariable )
						{
							info.extractNextWord();
							if ( info.text != '=' )
								info.throwError( 'syntax_error' );
							var type = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
							info.compileExpression();
							if ( !this.checkTypes( type, info.returnType ) )
								info.throwError( 'type_mismatch' );
							if ( ! isReservedVariable )
							{
								code = this.utilities.replaceStringInText( code, '%$PV', 'set' );
								code = this.utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? info.result : info.result + ',' );
								code = this.utilities.replaceStringInText( code, '%$P;', ';' );
							}
							else
							{
								var save = info.position;
								var saveResult = info.result;
								info.position = positions[ isReservedVariable ];
								info.extractNextWord();
								info.extractVariableAssignment( 'input' );
								info.position = save;
								code = this.utilities.replaceStringInText( code, '%$PV', 'set' );
								code = this.utilities.replaceStringInText( code, '%$P0', info.result );
								code = this.utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? saveResult : saveResult + ',' );
								code = this.utilities.replaceStringInText( code, '%$P;', ';' );
							}
						}
						for ( var p = numberOfParams - 1; p >= 0; p-- )
						{
							code = this.utilities.replaceStringInText( code, '%$P' + p, parameters[ p ] );
						}
						info.addLine( code );
						if ( token.newBlock )
							info.nextBlock( '' );
					}
					break;
				default:
				case 'semicolumn':
					break;
			}
		}
		catch( error )
		{
			this.errors.push( error );
		}
	}
	info.nextBlock( 'return{type:0};' );

	if ( info.pile.length > 1 )
	{
		for ( var l = 1; l < info.pile.length; l++ )
		{
			var loop = info.pile[ l ];
			this.errors.push( { error: 'for_without_next', position: loop.position } );
		}
	}

	// Compile sub-sections
	for ( var c = 0; c < this.toCompile.length; c++ )
	{
		var childInfo = this.compileLoop( this.toCompile[ c ], info, options );
		if ( this.utilities.isArray( childInfo ) )
			childInfo.throwError( 'syntax_error' );
	}

	// Relocate labels
	for ( var l in info.labels )
	{
		var label = info.labels[ l ];
		if ( typeof label.block == 'undefined' )
			info.throwError( 'label_not_defined' );
		for ( var t = 0; t < label.toReplace.length; t++ )
		{
			var toReplace = label.toReplace[ t ];
			toReplace.info.blocks[ toReplace.block ] = this.utilities.replaceStringInText( toReplace.info.blocks[ toReplace.block ], toReplace.text, '' + label.block );
		}
	}

	// Done!
	options.tabs = options.tabs.substring( 0, options.tabs.length - 1 );
	if ( this.errors.length )
		return this.errors;
	return info;
};
var specialCases = {};
specialCases.handleDirect = function( info )
{
	info.extractNextWord( );
	var label = info.parent.labels[ info.abbreviation ];	// Labels in main program!
	if ( !label )
		info.throwError( 'label_not_defined' );
	var toReplace =
	{
		info: info,
		block: info.blockNumber,
		text: toReplace = '%$PL' + info.labelCount++ + '$%'
	}
	label.toReplace.push( toReplace );
	var code = 'this.amal.direct(' + toReplace.text + ');return{type:0};';
	info.addLine( code );
}
specialCases.handleAutotest = function( info )
{
	if ( this.autotest )
		info.throwError( 'syntax_error' );
	this.autotest = true;
	info.extractNextWord();
	if ( info.text != '(' )
		info.throwError( 'syntax_error' );

	// Extract autotest
	var start = info.position;
	var bracketCount = 1;
	var end;
	while( true )
	{
		end = info.position;
		info.extractNextWord();
		if ( info.text == '(' )
			bracketCount++;
		if ( info.text == ')' )
		{
			bracketCount--;
			if ( bracketCount == 0 )
				break;
		}
	}
	var source = info.line.substring( start, end );
	this.toCompile.push( source );
	info.autotest = true;
};
specialCases.handleFor = function( info )
{
	// Let
	info.extractNextWord();
	if ( info.type != 'token' )
		info.throwError( 'syntax_error' );
	var token = info.token;
	var register = token.register;
	if ( !register )
		info.throwError( 'syntax_error' );
	var variable = token.compile[ 0 ];
	var toUpdate = token.toUpdate;
	var register = token.register;
	info.extractNextWord();
	if ( info.text != '=' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	var code = variable + '=' + info.result + ';';
	if ( toUpdate )
		info.addLine( 'this.amal.toUpdate=' + toUpdate + ';' );
	info.nextBlock( code );

	// To
	info.extractNextWord();
	if( info.type != 'token' )
		info.throwError( 'syntax_error' );
	if ( info.token.abbreviation != 'T' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );

	var pokeLabel = '%$PNEXT' + info.labelCount++;
	code = 'if(' + variable + '==' + info.result + ') return{type:1,label:' + pokeLabel + '};';
	info.addLine( code );
	info.pile.push(
	{
		register: register,
		toUpdate: toUpdate,
		variable: variable,
		loopBlock: info.blockNumber,
		pokeLabel: pokeLabel,
	} );
};
specialCases.handleNext = function( info )
{
	if ( info.pile.length < 1 )
		info.throwError( 'next_without_for' );
	var loop = info.pile.pop();
	info.peekNextWord( '#register' );
	if ( info.type == 'token')
	{
		if ( !info.token.register )
			info.throwError( 'next_without_for' );
		if ( info.token.register != loop.register )
			info.throwError( 'next_without_for' );
		info.setPeekNextWordEnd();
	}
	var code = loop.variable + '++;';
	if ( loop.toUpdate )
		code += 'this.amal.toUpdate=' + loop.toUpdate + ';';
	code += 'return{type:4,label:' + loop.loopBlock + '};';
	info.nextBlock( code );	
	info.blocks[ loop.loopBlock ] = this.utilities.replaceStringInText( info.blocks[ loop.loopBlock ], loop.pokeLabel, '' + info.blockNumber );
};
specialCases.handleIf = function( info )
{
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	var code = 'if(' + info.result + ')';
	info.extractNextWord();
	if ( info.type != 'token' )
		info.throwError( 'syntax_error' );
	if ( info.token.abbreviation != 'J' )
		info.throwError( 'syntax_error' );
	code += specialCases.handleJump.call( this, info, true );
	info.addLine( code );
};
specialCases.handleLet = function( info, fromFor )
{
	info.extractNextWord( '#register' );
	if ( info.type != 'token' )
		info.throwError( 'syntax_error' );
	var token = info.token;
	if ( !token.register )
		info.throwError( 'syntax_error' );

	var code = token.compile[ 0 ];
	info.extractNextWord();
	if ( info.text != '=' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	code += '=' + info.result + ';';
	if ( typeof token.toUpdate != 'undefined' )
		code += 'this.amal.toUpdate|=' + token.toUpdate + ';';
	if ( !fromFor )
		info.addLine( code );
};
specialCases.handleJump = function( info, fromIf )
{
	info.extractNextWord( '#jump' );
	if ( info.type != 'text' )
		info.throwError( 'syntax_error' );
	var label = info.labels[ info.abbreviation ];
	if ( !label )
	{
		label =
		{
			name: info.abbreviation,
			toReplace: []
		};
		info.labels[ info.abbreviation ] = label;
	}
	var toReplace =
	{
		info: info,
		block: info.blockNumber,
		text: '%$PL' + info.labelCount++ + '$%'
	};
	label.toReplace.push( toReplace );
	var code = 'return{type:4,label:' + toReplace.text + '};';
	if ( !fromIf )
	{
		code = 'return{type:4,label:' + toReplace.text + '};';
		info.addLine( code );
	}
	else
	{
		code = 'return{type:1,label:' + toReplace.text + '};';
	}
	return code;
};
specialCases.handleAnim = function( info )
{
	var code = 'this.amal.anim(';
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	code += info.result + ',[';
	info.extractNextWord();
	if ( info.text != ',' )
		info.throwError( 'syntax_error' );
	do
	{
		info.extractNextWord();
		if ( info.text != '(' )
			info.throwError( 'syntax_error' );
		info.compileExpression();
		if ( !info.checkTypes( '0', info.returnType ) )
			info.throwError( 'type_mismatch' );
		code += '{i:' + info.result + ',';
		info.extractNextWord();
		if ( info.text != ',' )
			info.throwError( 'syntax_error' );
		info.compileExpression( true );
		if ( !info.checkTypes( '0', info.returnType ) )
			info.throwError( 'type_mismatch' );
		code += 't:' + info.result + '}';
		info.extractNextWord();
		if ( info.text != ')' )
			info.throwError( 'syntax_error' );
		info.peekNextWord();
		if ( info.text != '(' )
			break;
		code += ',';
	} while( true )
	code += ']);';
	info.addLine( code );
};









function Information( source, amal, options )
{
	this.amal = amal;
	this.line = source;
	this.options = typeof options == 'undefined' ? {} : options;
	this.position = 0;
	this.text = '';
	this.textLower = '';
	this.abbreviation = '';
	this.tabs = typeof this.options.tabs != 'undefined' ? this.options.tabs : '';
	this.type = '';
	this.tokens = window.AMALTokens;
	this.blocks = [];
	this.pile = [];
	this.labels = {};
	this.labelCount = 0;
	this.blockNumber = 0;
	this.currentBlock = '';

	this.utilities = amal.utilities;
}
Information.prototype.compileExpression = function(endOnBracket, saveCounts )
{
	var saveBracket = this.endOnBracket;
	this.endOnBracket = endOnBracket;
	var save1 = this.numberOfOperands;
	var save2 = this.typeLastOperand;
	var saveComparaison = this.comparaison;
	this.compileExp();
	this.endOnBracket = saveBracket;
	this.comparaison = saveComparaison;
	this.acceptCommas = false;
	this.operator = false;
	if ( saveCounts )
	{
		this.numberOfOperands = save1;
		this.typeLastOperand = save2;
	}
};
Information.prototype.compileExp = function()
{
	var type;
	var quit = false;
	var code = '';
	var comparaison = this.comparaison;
	this.constant = true;
	this.numberOfOperands = 0;
	var power = false;
	var powerPosition1, powerPosition2;

	while( !quit )
	{
		// An operande first!
		var positionOperand = code.length;
		this.operator = false;
		skipOperator = false;
		this.extractNextWord( '#function' );
		this.typeLastOperand = this.type;

		switch ( this.type )
		{
			case 'token':
				var token = this.token;

				// Special case for NOT
				if ( this.token.token == '!' )
				{
					code += '!(';
					this.acceptCommas = true;
					this.compileExpression( false, true );
					code += this.result + ')';
					if ( this.returnType != '0' )
						this.throwError( 'type_mismatch' );
					if ( !type )
						type = this.returnType;
					break;
				}

				// Must be a function
				var foundSyntax = '';
				var isParams;
				if ( typeof token.params == 'string' )
				{
					foundSyntax = 'dummy';
					isParams = false;
				}
				else
				{
					for ( var t = 0; t < token.params.length; t++ )
					{
						if ( token.params[ t ].charAt( 0 ) == 'V' || this.utilities.getCharacterType( token.params[ t ].charAt( 0 ) ) == 'number' )
						{
							foundSyntax = token.params[ t ].charAt( 0 );
							isParams = true;
							break;
						}
					}
				}
				if ( foundSyntax == '' )
					this.throwError( 'syntax_error' );
				if ( typeof token.compile == 'undefined' )
					this.throwError( 'function_not_implemented' );

				var found = !isParams;
				var numberOfParams = 0;
				var parameters = [];
				var positions = [];
				var isVariable = ( foundSyntax == 'V' );
				if ( isParams )
				{
					// Special case?
					if ( token.compile[ t ].indexOf( '#' ) == 0 )
					{
						var func = token.compile[ t ].substring( 1 );
						specialCases[ func ].call( this );
						code += this.result;
						this.constant = false;
						type = this.returnType;
						break;
					}

					// Extract the parameters
					this.peekNextWord();
					if ( this.text == '(' )
					{
						this.setPeekNextWordEnd();

						var params = 0;
						while( true )
						{
							positions[ foundSyntax.length ] = this.position;
							this.acceptCommas = true;
							this.compileExpression( true, true );
							parameters[ params ] = this.result;
							switch( this.returnType )
							{
								case '0':
								case '1':
									foundSyntax += '0';
									break;
								case '2':
									foundSyntax += '2';
									break;
								case '?':
									foundSyntax += '?';
									break;
							}
							this.peekNextWord();
							if ( this.text == ',' )
							{
								foundSyntax += ','
								this.setPeekNextWordEnd();
							}
							else if ( this.textLower == 'to' )
							{
								foundSyntax += 't';
								this.setPeekNextWordEnd();
							}
							else if ( this.text == ')' )
							{
								numberOfParams = params + 1;
								this.setPeekNextWordEnd();
								break;
							}
							else
							{
								this.throwError( 'syntax_error' );
							}
							params++;
						}
					}

					for ( var s = 0; s < token.params.length; s++ )
					{
						var syntax = token.params[ s ];

						if ( syntax.charAt( 0 ) == foundSyntax.charAt( 0 ) )
						{
							if ( foundSyntax == syntax )
							{
								found = true;
								break;
							}

							if ( foundSyntax.length == syntax.length )
							{
								var paramNumber = 0;
								for ( var p = 1; p < syntax.length; )
								{
									if ( foundSyntax.charAt( p ) != syntax.charAt( p ) )
									{
										if ( foundSyntax.charAt( p ) == '?' )
										{
											foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
										}
										if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'letter' )
										{
											syntax = syntax.substring( 0, p ) + String.fromCharCode( syntax.charCodeAt( p ) - 65 + 48 ) + syntax.substring( p + 1 );
											if ( syntax.charAt( p ) != foundSyntax.charAt( p ) )
											{
												this.throwError( 'type_mismatch' );
											}
										}
										else if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'number' )
										{
											if ( syntax.charAt( p ) == '3' && foundSyntax.charAt( p ) == '0' )
											{
												parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*this.aoz.degreeRadian';
											}
											else
											{
												this.throwError( 'type_mismatch' );
											}
										}
										else
										{
											if ( syntax.charAt( p ) != '?' )
											{
												this.throwError( 'type_mismatch' );
											}
										}
									}
									if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'number' || syntax.charAt( p ) == '?' )
										paramNumber++;
									if ( ++p >= syntax.length )
									{
										found = true;
										break;
									}
								}
								if ( found )
									break;
							}
						}
					}
				}
				if ( !found )
					this.throwError( 'syntax_error' );

				// Check types
				var addBracket = '';
				var subCode = isParams ? token.compile[ s ] : token.compile;
				var tokenType;
				if ( !isVariable )
				{
					if ( isParams )
						tokenType = token.params[ s ].charAt( 0 );
					else
						tokenType = token.params.charAt( 0 );
				}
				else
				{
					tokenType = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
					subCode = this.utilities.replaceStringInText( subCode, '%$PV', 'get' );
					subCode = this.utilities.replaceStringInText( subCode, '%$PP', '' );
					subCode = this.utilities.replaceStringInText( subCode, '%$P;', '' );
				}
				if ( !type )
					type = tokenType;
				var addBracket1 = '';
				var addBracket2 = '';
				if ( !this.checkTypes( tokenType, type ) )
				{
					if ( token.params[ s ].charAt( 0 ) == '3' )
					{
						addBracket1 = '(';
						addBracket2 = '*this.aoz.degreeRadian)';
					}
					else
					{
						this.throwError( 'type_mismatch' );
					}
				}

				// A waiting function?
				if ( token.waiting )
				{
					for ( var p = numberOfParams - 1; p >= 0; p-- )
						subCode = this.utilities.replaceStringInText( subCode, '%$P' + ( p + 1 ), parameters[ p ] );
					subCode = this.utilities.replaceStringInText( subCode, '%$PN', this.waitingFunctionCount );
					this.nextBlock( subCode );
					subCode = addBracket + 'this.aoz.results[' + this.waitingFunctionCount++ + ']';
				}
				else
				{
					// Normal function
					subCode = addBracket1 + subCode + addBracket2;
					for ( var p = numberOfParams - 1; p >= 0; p-- )
						subCode = this.utilities.replaceStringInText( subCode, '%$P' + p, parameters[ p ] );
				}
				code += subCode;
				this.constant = false;
				break;

			case 'number':
				if ( !type )
					type = this.returnType;
				if ( !this.checkTypes( type, this.returnType ) )
					this.throwError( 'type_mismatch' );
				code += this.text;
				break;

			case 'string':
				if ( !type )
					type = this.returnType;
				if ( !this.checkTypes( type, this.returnType ) )
					this.throwError( 'type_mismatch' );
				code += '"' + this.text + '"';
				break;

			default:
				if ( this.text == '-' )
				{
					code += '-';
					skipOperator = true;
					break;
				}
				if ( this.text == '(' )
				{
					code += '(';
					this.compileExpression( true, true );
					code += this.result + ')';
					if ( !type )
						type = this.returnType;
					if ( !this.checkTypes( type, this.returnType ) )
						this.throwError( 'type_mismatch' );
					this.peekNextWord();
					if ( this.text != ')' )
						this.throwError( 'syntax_error' );
					this.setPeekNextWordEnd();
					this.constant = false;
					break;
				}
				if ( this.text == '$' )
				{
					var text = '';
					var savePosition = this.position;
					for ( ; this.position < this.line.length; this.position++ )
					{
						c = this.line.charAt( this.position ).toUpperCase();
						var ascii = c.charCodeAt( 0 );
						if ( !( ( ascii >= 48 && ascii <= 57 ) || ( ascii >= 65 && ascii <= 70 ) ) )
							break;
						text += c;
					}
					if ( text.length > 0 )
					{
						if ( !type )
							type = '0';
						if ( !this.checkTypes( type, '0' ) )
							this.throwError( 'type_mismatch' );
						code += '0x' + text;
						break;
					}
					this.position = savePosition;
				}
				if ( this.text == '%' )
				{
					var text = '';
					var savePosition = this.position;
					for ( ; this.position < this.line.length; this.position++ )
					{
						c = this.line.charAt( this.position );
						if ( c != '0' && c != '1' )
							break;
						text += c;
					}
					if ( text.length > 0 )
					{
						if ( !type )
							type = '0';
						if ( !this.checkTypes( type, '0' ) )
							this.throwError( 'type_mismatch' );
						code += '0b' + text;
						break;
					}
					this.position = savePosition;
				}
				if ( this.text == ',' || this.text == ';' || this.remark )
				{
					code += 'undefined';
					if ( type )
						this.throwError( 'syntax_error' );
					type = '?';
					this.position = this.column;
					skipOperator = true;
					quit = true;
				}
				else if ( this.eol )
				{
					code += 'undefined';
					if ( type )
						this.throwError( 'syntax_error' );
					type = '?';
					skipOperator = true;
					quit = true;
				}
				else
				{
					this.throwError( 'syntax_error' );
				}
				break;
		}
		this.numberOfOperands++;

		// ^ operator?
		if ( power )
		{
			var first = code.substring( powerPosition1, powerPosition2 );
			var second = code.substring( positionOperand );
			code = code.substring( 0, powerPosition1 ) + 'Math.pow(' + first + ',' + second + ')';
			power = false;
		}

		// An operator?
		if ( skipOperator )
			continue;

		this.operator = true;
		this.peekNextWord( '#operator' );
		if ( this.eol )
		{
			this.endOfInstruction = true;
			break;
		}
		else if ( this.abbreviation == 'J' || this.abbreviation == 'T' )
		{
			quit = true;
			break;
		}
		/*
		{			
			else
			{
				this.throwError( 'syntax_error' );
			}
		}
		*/
		else
		{
			switch ( this.textLower )
			{
				case '&':
					if ( comparaison )
						code += '&&';
					else
						code += '&';
					this.setPeekNextWordEnd();
					if ( comparaison )
						type = undefined;
					break;
				case '|':
					if ( comparaison )
						code += '&&';
					else
						code += '&';
					this.setPeekNextWordEnd();
					if ( comparaison )
						type = undefined;
					break;
				case '^':
					powerPosition1 = positionOperand;
					powerPosition2 = code.length;
					power = true;
					this.constant = false;
					this.setPeekNextWordEnd();
					break;

				case '%':
				case '+':
				case '-':
				case '*':
				case '/':
				case '&':
				case '&&':
				case '|':
				case '||':
				case '<<':
				case '>>':
					code += this.text;
					this.constant = false;
					this.setPeekNextWordEnd();
					break;

				case '=':
					code += '==';
					this.setPeekNextWordEnd();
					comparaison = true;
					break;

				case '<':
				case '<=':
				case '>':
				case '>=':
				case '!=':
					code += this.text;
					this.constant = false;
					this.setPeekNextWordEnd();
					comparaison = true;
					break;

				case '<>':
					code += '!=';
					this.setPeekNextWordEnd();
					this.constant = false;
					comparaison = true;
					break;

				case ')':
					if ( !this.endOnBracket )
						this.throwError( 'syntax_error' );
					quit = true;
					break;

				case ',':
					quit = true;
					break;

				case ';':
					this.endOfInstruction = true;
				case ':':
				case ']':
					if ( this.endOnBracket )
						this.throwError( 'syntax_error' );
					quit = true;
					break;

				default:
					this.endOfInstruction = true;
					quit = true;
					break;
					//this.throwError( 'syntax_error' );
			}
		}
	}
	this.returnType = type;
	this.result = code;
};

Information.prototype.peekNextWord = function( tags )
{
	var position = this.position;
	this.extractNextWord( tags );
	this.peekNextWordEnd = this.position;
	this.position = position;
};
Information.prototype.extractNextWord = function( tags )
{
	tags = typeof tags == 'undefined' ? '#instruction' : tags;
	tags = tags.toLowerCase();
	wantInstruction = tags.indexOf( '#instruction' ) >= 0;
	wantFunction = tags.indexOf( '#function' ) >= 0;
	wantJump = tags.indexOf( '#jump' ) >= 0;
	wantRegister = tags.indexOf( '#register' ) >= 0;
	wantOperator = tags.indexOf( '#operator' ) >= 0;

	this.token = false;
	this.abbreviation = '';
	this.text = '';
	this.textLower = '';
	this.type = '';
	this.endOfInstruction = false;
	this.skipSpaces();
	if ( this.eol )
	{
		this.endOfInstruction = true;
		return;
	}

	var start = this.position;
	this.operator = false;
	this.debugLine = this.line.substring( this.position );
	var c = this.line.charAt( this.position );
	var type = this.utilities.getCharacterType( c );
	if ( type == 'quote' )
	{
		this.type = 'string';
		this.extractString();
		this.textLower = this.text.toLowerCase();
		return this.type;
	}
	else if ( type == 'number' || ( !wantOperator && type == 'minus' ) )
	{
		this.type = 'number';
		this.extractNumber();
		this.textLower = this.text.toLowerCase();
		return this.type;
	}
	else if ( type == 'letter' )
	{
		do
		{
			this.text += c;
			this.position++;
			if ( ( c.charCodeAt( 0 ) >= 65 && c.charCodeAt( 0 ) < 65 + 26 ) || ( c.charCodeAt( 0 ) >= 48 && c.charCodeAt( 0 ) < 48 + 10 ) )
				this.abbreviation += c;
			if ( this.position >= this.line.length )
				break;
			c = this.line[ this.position ];
			var type = this.utilities.getCharacterType( c );
		} while( type == 'letter' || type == 'number' )

		// A label?
		if ( this.line.charAt( this.position ) == ':' )		// Want a column right after no space
		{
			this.type = 'label';
			this.position++;
			return this.type;
		}
	
		// Look for a token
		if ( wantInstruction || wantFunction || wantRegister )
		{
			for ( var t = 0; t < this.tokens.length; t++ )
			{
				var token = this.tokens[ t ];
				if ( this.abbreviation == token.abbreviation )
				{
					var ok = true;
					if ( wantFunction )
					{
						if ( !token.register )
						{
							if ( typeof token.params != 'string' )
							{
								for ( var p = 0; p < token.params.length; p++ )
								{
									if ( token.params[ p ].charAt(0) == 'I' )
									{
										ok = false;
										break;
									}
								}
							}
						}
					}
					else if ( wantRegister )
					{
						if ( !token.register )
						{
							ok = false;
							break;
						}
					}
					if ( ok )
					{
						this.text = this.line.substring( start, this.position );
						this.textLower = this.text.toLowerCase();
						this.type = 'token';
						this.token = this.tokens[ t ];
						return this.type;
					}
				}
			}
		}
		this.type = 'text';
		this.textLower = this.text.toLowerCase();
		return this.type;
	}

	// Any other type
	this.text = c;
	this.type = type;
	this.position++;
	if ( c != ')' && c != ']' && c != '(' && c != ',' )
	{
		for ( ; this.position < this.line.length; this.position++ )
		{
			c = this.line.charAt( this.position );
			if ( this.utilities.getCharacterType( c ) != type || c == '$' )		// TODO!
				break;
			this.text += c;
		}
	}
	if ( this.text == ';' )
		this.endOfInstruction = true;
	this.textLower = this.text.toLowerCase();
	return this.type;
};
Information.prototype.extractNextChar = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = this.line.charAt( this.position++ );
	this.type = this.utilities.getCharacterType( this.text );
};
Information.prototype.extractString = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = '';
	var quote = this.line.charAt( this.position++ );
	if ( this.utilities.getCharacterType( quote ) == 'quote' )
	{
		while( this.position < this.line.length )
		{
			var c = this.line.charAt( this.position++ );
			if ( c == '\\' )
			{
				this.text += '\\\\';
				continue;
			}
			else if ( c == quote )
			{
				this.type = 'string';
				this.returnType = '2';
				return;
			}
			this.text += c;
		}
		this.throwError( 'string_not_closed' );
	}
	else
	{
		this.type = 'empty';
	}
};
Information.prototype.extractNumber = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = '';
	this.type = 'empty';
	var c = this.line.charAt( this.position );
	if ( c == '-' )
	{
		this.position++;
		this.skipSpaces();
		if ( this.eol )
			return;
		this.text += '-';
		c = this.line.charAt( this.position );
	}
	if ( this.utilities.getCharacterType( c ) == 'number' )
	{
		this.text += c;
		this.position++;
		this.returnType = '0'
		while( this.position < this.line.length )
		{
			c = this.line.charAt( this.position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			this.text += c;
			if ( c == '.' )
				this.returnType = '1';
			this.position++;
		}
		this.type = 'number';
	}
};
Information.prototype.skipSpaces = function()
{
	this.eol = false;
	while( this.position < this.line.length && ( this.line.charCodeAt( this.position ) == 32 || this.line.charCodeAt( this.position ) == 9 ) )
		this.position++;
	if ( this.position >= this.line.length )
		this.eol = true;
};
Information.prototype.setPeekNextWordEnd = function()
{
	this.position = this.peekNextWordEnd;
};
Information.prototype.addLine = function( code )
{
	if ( code != '' && this.blocks )
		this.currentBlock += this.tabs + code + '\n';
};
Information.prototype.nextBlock = function( code )
{
	if ( code != '' )
		this.currentBlock += this.tabs + code + '\n';
	this.blocks[ this.blockNumber ] = this.currentBlock;
	this.blockNumber++;
	this.currentBlock = '';
};
Information.prototype.indent = function()
{
	this.tabs += '\t';
};
Information.prototype.unIndent = function()
{
	this.tabs = this.tabs.substring( 0, this.tabs.length - 1 );
};
Information.prototype.throwError = function( error )
{
	//throw { error: error, position: this.position };
	console.log( "ERROR" );
};
Information.prototype.checkTypes = function( typeDestination, typeSource )
{
	typeDestination = typeof typeDestination == 'number' ? '' + typeDestination : typeDestination;
	typeSource = typeof typeSource == 'number' ? '' + typeSource : typeSource;
	if ( typeDestination == '0' || typeDestination == '1' )
	{
		return ( typeSource == '0' || typeSource == '1' || typeSource == '?' );
	}
	else if ( typeDestination == '?' )
	{
		return true;
	}
	return typeSource == '2' || typeSource == '?';
};


