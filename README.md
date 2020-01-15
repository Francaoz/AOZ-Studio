## AOZ Studio Source Code

#### Welcome to the first official release of the source code of AOZ Studio.

We publish this code as open-source, in hope for help, participation,  and any suggestions you might have. Time being rather short these days, please forgive the lack of documentation on the structure of the source-code, I will work on that next month.

You will not find in this folder the code of the transpiler itself, we have decided not to make it public. It might change in the future. The builds will be synchronized with the major releases of new code for the runtime.

The system is very open,  and leaves space for you to program your own extensions, with the language itself or in Javascript, write new instructions and functions etc.

The transpiler does not contain the syntax of the language, it is all contained in external files.

Those files are transpiled once for all (at each new version, when a change is done within them), and contain both the syntax and the code, in the form of a .aoz source code. They have access to the whole AOZ Runtime Library, contained in the folder runtime/run.

You will find the definition of the syntax of the current version in the folder aoz/languages/v1_0, grouped by categories. If you inspect the sources, you can see that they are AOZ Source code (and not pure Javascript), with Javascript inserted. All the instructions of the language, except for the structural instructions will be defined like that in the future (still some to convert that use the old system).

This system is available to you. Not only will you be able to program your own extension in Basic or Javascript, but also your new language, with different instructions and functions that do other things... That can all use the AOZ Runtime code, that I will document in February. Heavy work in January in this part of the code! ;)

To make a development version:

* Copy the transpiler itself at the root of the aoz sub-folder 

* If you use vscode, you will find the folder I use, with keyboard shortcuts F2 and F1 defined. 

* Load a .aoz file, press F2 to transpile, F1 to launch (if keyboard shortcut do not work, please read the file "keyboard_shortcuts.js")

* Any change in the source code contained in the "languages" folder and rthe "exte nsions" folder will result in their re-tranpilation.

* You can force the process, recompile extensions and language modules each time with the command line options: -cleanextensions -cleanmodules (still have to do a doc on the command line version of the tool)...

  

Thank you for being there, have fun poking in the code, please report problems and suggestions at:

Our forum-> https://aoz.studio/forum

Our Discord Channel-> https://discord.gg/DngfgC7

By email-> fl@aoz.studio

Francois



*Please note that AOZ Studio uses the following code:*

* Howler.js
* ilbm-js
* Font Face Observer v2.1.0 - © Bram Stein
* And of many others, time for me to list them all

.





