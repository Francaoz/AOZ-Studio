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
	
	// List of errors
	this.errors=
	[
		"",
		"return_without_gosub:Return without gosub",
		"pop_without_gosub:Pop without gosub",
		"error_not_resumed:Error not resumed",
		"cant_resume_to_a_label:Can't resume to a label",
		"no_on_error_proc:No ON ERROR PROC before this instruction",
		"resume_label_not_defined:Resume label not defined",
		"resume_without_error:Resume without error",
		"error_procedure_must_resume:Error procedure must resume to end",
		"program_interrupted:Program interrupted",
		"procedure_not_closed:Procedure not closed",
		"out_of_variable_space:Out of variable space",
		"cannot_open_math_libraries:Cannot open math libraries",
		"out_of_stack_space:Out of stack space",
		"procedure_not_opened:Procedure not opened",
		"user_function_not_defined:User function not defined",
		"illegal_user_function_call:Illegal user function call",
		"illegal_direct_mode:Illegal direct mode",
		"procedure_not_found:Procedure not found",
		"instruction_not_implemented:Instruction not implemented",
		"division_by_zero:Division by zero",
		"string_too_long:String too long",
		"syntax_error:Syntax error",
		"illegal_function_call:Illegal function call",
		"out_of_memory:Out of memory",
		"address_error:Address error",
		"string_not_closed:String not closed",
		"non_dimensionned_array:Non dimensionned array",
		"array_already_dimensionned:Array already dimensionned",
		"overflow:Overflow",
		"bad_iff_format:Bad IFF format",
		"iff_compression_not_recognised:IFF compression not recognised",
		"cant_fit_picture:Can't fit picture in current screen",
		"out_of_data:Out of data",
		"type_mismatch:Type mismatch",
		"bank_already_reserved:Bank already reserved",
		"bank_not_reserved:Bank not reserved",
		"fonts_not_examined:Fonts not examined",
		"menu_not_opened:Menu not opened",
		"menu_item_not_defined:Menu item not defined",
		"label_not_defined:Label not defined",
		"not_data_after_this_label:No data after this label",
		"procedure_already_defined:Procedure already defined",
		"next_without_for:Next without for",
		"font_not_available:Font not available",
		"until_without_repeat:Until without repeat",
		"block_not_defined:Block no defined",
		"screen_not_opened:Screen not opened",
		"illegal_screen_parameter:Illegal screen parameter",
		"illegal_number_of_colours:Illegal number of colours",
		"valid_screen_numbers:Valid screen numbers range from 0 to 7",
		"too_many_colours_in_flash:Too many colours in flash",
		"flash_declaration_error:Flash declaration error",
		"shift_declaration_error:Shift declaration error",
		"text_window_not_opened:Text window not opened",
		"text_window_already_opened:Text window already opened",
		"text_window_too_small:Text window too small",
		"text_window_too_large:Text window too large",
		"wend_without_while:Wend without while",
		"bordered_text_windows_not_on_edge:Bordered text windows not on edge of screen",
		"illegal_text_window_parameter:Illegal text window parameter",
		"loop_without_do:Loop without do",
		"text_window_0_cant_be_closed:Text window 0 can't be closed",
		"this_windows_has_no_border:This window has not border",
		"no_loop_to_exit_from:No loop to exit from",
		"block_not_found:Block not found",
		"illegal_block_parameters:Illegal block parameters",
		"screens_cant_be_animated:Screens can't be animated",
		"bob_not_defined:Bob not defined",
		"screen_already_in_double_buffering:Screen already in double buffering",
		"cant_set_dual_playfield:Can't set dual playfield",
		"screen_not_in_dual_playfield:Screen not in dual playfield mode",
		"scrolling_not_defined:Scrolling not defined",
		"no_zones_defined:No zones defined",
		"icon_not_defined:Icon not defined",
		"rainbow_not_defined:Rainbow not defined",
		"copper_not_disabled:Copper not disabled",
		"copper_list_too_long:Copper list too long",
		"illegal_copper_parameter:Illegal copper parameter",
		"file_already_exists:File already exists",
		"directory_not_found:Directory not found",
		"file_not_found:File not found",
		"illegal_filename:Illegal filename",
		"disc_is_not_validated:Disc is not validated",
		"disc_is_write_protected:Disc is write protected",
		"directory_not_empty:Directory not empty",
		"device_not_available:Device not available",
		"for_without_next:For without next",
		"disc_full:Disc full",
		"file_is_write_protected_against_deletion:File is write protected against deletion",
		"file_is_write_protected:File is write protected",
		"file_is_protected_against_reading:File is protected against reading",
		"not_an_amigados_disc:Not an AmogaDOS disc",
		"no_disc_in_drive:No disc in drive",
		"io_error:I/O error",
		"file_format_not_recognised:File format not recognised",
		"file_already_opened:File already opened",
		"file_not_opened:File not opened",
		"file_type_mismatch:File type mismatch",
		"input_too_long:Input too long",
		"end_of_file:End of file",
		"disc_error:Disc error",
		"instruction_not_allowed_there:Instruction not allowed there",
		"illegal_number_of_dimensions:Illegal number of dimensions",
		"array_not_dimensionned:Array not dimensionned",
		"sprite_error:Sprite error",
		"function_not_implemented:Function not implemented",
		"syntax_error_in_animation_string:Syntax error in animation string",
		"next_without_for_in_animation_string:Next without for in animation string",
		"label_not_defined_in_animation_string:Label not defined in animation string",
		"jump_to_within_autotest:Jump to/within autotest in animation string",
		"autotest_already_opened:Autotest already opened",
		"instruction_only_valid_in_autotest:Instruction only valid in autotest",
		"animation_string_too_long:Animation string too long",
		"label_already_defined_in_animation_string:Label already defined in animation string",
		"illegal_instruction_during_autotest:Illegal instruction during autotest",
		"amal_bank_not_reserved:AMAL bank not reserved",
		"internal_error:Internal error",
		"unknown_error:Unknown error",
		"cannot_load_file:Cannot load file",
		"interface_error_bad_syntax:Interface error: bad syntax",
		"interface_error_out_of_memory:Interface error: out of memory",
		"interface_error_label_defined_twice:Interface error: label defined twice",
		"interface_error_label_not_defined:Interface error: label not defined",
		"interface_error_channel_already_defined:Interface error: channel already defined",
		"interface_error_channel_not_defined:Interface error: channel not defined",
		"interface_error_screen_modified:Interface error: screen modified",
		"interface_error_variable_not_defined:Interface error: variable not defined",
		"interface_error_illegal_function_call:Interface error: illegal function call",
		"interface_error_type_mismatch:Interface error: type mismatch",
		"interface_error_buffer_too_small:Interface error: buffer too small",
		"interface_error_illegal_n_parameters:Interface error: illegal number of parameters",
		"if_without_endif:If without endif",
		"not_enough_loops_to_exit:Not enough loops to exit",
		"no_loop_to_exit:No loop to exit",
		"please_redo_from_start:Please redo from start ",
		"instruction_not_opened:Instruction not opened",
		"instruction_already_opened:Instruction already opened",
		"function_not_opened:Function not opened",
		"function already opened:Function already opened",
		"device_already_opened:Device already opened",
		"device_not_opened:Device not opened",
		"device_cannot_be_opened:Device cannot be opened",
		"command_not_supported_by_device:Command not supported by device",
		"device_error:Device errror",
		"serial_device_already_in_use:Serial device already in use",
		"",
		"invalid_baud_rate:Invalid baud rate",
		"out_of_memory_serial_device:Out of memory (serial device)",
		"bad_parameter:Bad parameter",
		"hardware_data_overrun:hardware data overrrun",
		"",
		"",
		"cannot_read_directory:Cannot read directory: ",
		"directory_of:Directory of %1",
		"timeout_error:Timeout error",
		"buffer_overflow:Buffer overflow",
		"no_data_set_ready:No data set ready",
		"do_without_loop:Do without loop",
		"break_detected:Break detected",
		"selected_unit_already_in_use:Selected unit already in use",
		"user_canceled_request:User canceled request",
		"printer_cannot_output_graphics:Printer cannot output graphics",
		"while_without_wend:While without wend",
		"illegal_print_dimensions:Illegal print dimensions",
		"corrupted_file:Corrupted file",
		"out_of_memory_printer_device:Out of memory (printer device)",
		"out_of_internal_memory_printer_device:Out of internal memory (printer device)",
		"library_already_opened:Library already opened",
		"library_not_opened:Library not opened",
		"cannot_open_library:Cannot open library",
		"parallel_device_already_opened:Parallel device already opened",
		"out_of_memory_parallel_device:Out of memory (parallel device)",
		"invalid_parallel_parameter:Invalid parallel parameter",
		"parallel_line_error:Parallel line error",
		"drive_not_found:Drive not found",
		"parallel_port_reset:Parallel port reset",
		"parallel_initialisation_error:Parallel initialisation error",
		"wave_not_defined:Wave not defined",
		"sample_not_defined:Sample not defined",
		"sample_bank_not_found:Sample bank not found",
		"256_characters_for_a_wave:256 characters for a wave",
		"wave_0_and_1_are_reserved:Wave 0 and 1 are reserved",
		"music_bank_not_found:Music bank not found",
		"music_not_defined:Music not defined",
		"cant_open_narrator:Can't open narrator",
		"not_a_tracker_module:Not a tracker module",
		"cannot_load_med_library:Cannot load med.library",
		"cannot_start_med_library:Cannot start med.library",
		"not_a_med_module:Not a med module",
		"at_line:at line: ",
		"at_column:column: ",
		"image_not_defined:Image not defined",
		"arexx_port_already_opened:Arexx port already opened",
		"arexx_library_not_found:Arexx library not found",
		"cannot_open_arexx_port:Cannot open Arexx port",
		"Arexx_port_not_opened:Arexx port not opened",
		"no_arexx_message_waiting:No Arexx message waiting",
		"arexx_message_not_answered_to:Arexx message not answered to",
		"arexx_device_not_interactive:Arexx device not interactive",
		"local_storage_not_available:Local storage not available",
		"sprite_not_defined:Sprite not defined",
		"fps_indicator:%1 FPS",
		"every_too_long:Every routine too long",
		"every_not_defined:Every not defined",
		"every_already_defined:Every already defined",
		"amal_channel_not_opened:AMAL channel not opened",
		"global_variable_not_defined:Global array not defined",
		"function_not_available_in_true_color_mode:Function not available in non-paletted graphical mode",
		"context_not_defined:Property context not defined",
		"property_not_defined:Property not defined",
		"name_already_used:Name already used",
		"instruction_not_closed:Instruction not closed",
		"function_not_closed:Function not closed",
		"procedure_not_closed:Procedure not closed",
		"non_contiguous_instructions:Non contiguous instruction definition",
		"non_contiguous_functions:Non contiguous function definition",
		"javascript_section_not_closed:Javascript section not closed",
		"compiler_stuck_in_loop:Compiler stuck in loop"
	];
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
 
