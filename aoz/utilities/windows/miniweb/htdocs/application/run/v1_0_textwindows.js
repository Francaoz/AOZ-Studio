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
//
// The Text Window Instructions
// By Francois Lionet
// Version 0.99
// 11/11/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 0.9.2.6 - 17/01/2020 on the 18/01/2020-10:04:20
//

function v1_0_textwindows( aoz )
{
	this.manifest=JSON.parse('{"version":"7","versionModule":"1","infos":{"applicationName":"The Text Window Instructions","author":"By Francois Lionet","version":"Version 0.99","date":"11/11/2019","copyright":"(c) AOZ Studio 2019","start":"textwindows.aoz","object":"textwindows"}}');
	this.parent=this;
	this.root=this;
	this.aoz=aoz;
	this.contextName='v1_0_textwindows';

	this.blocks=[];
	this.blocks[0]=function()
	{
		return {type:0};
	};
	this.aoz.run(this,0,null);
};
