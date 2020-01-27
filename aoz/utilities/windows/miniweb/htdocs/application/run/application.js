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
// Name of your application.
// By You
// Version 0.0
// Created on the ...
// (c) Your Corporation Unlimited
//
// Compiled with AOZ Transpiler Version 0.9.3.1 - 21/01/2020 on the 27/01/2020-22:10:25
//

function Application( canvasId )
{
	this.manifest=JSON.parse('{"version":"8","infos":{"applicationName":"Name of your application.","author":"By You","version":"Version 0.0","date":"Created on the ...","copyright":"(c) Your Corporation Unlimited","start":"main.aoz"},"compilation":{"speed":"fast","syntax":"aoz","emulation":"PC","usePalette":true,"useShortColors":false,"showCopperBlack":false,"unlimitedScreens":true,"unlimitedWindows":true,"maskHardwareCoordinates":false,"endian":"little"},"display":{"tvStandard":"pal","width":1280,"height":720,"background":"color","backgroundColor":"#000000","bodyBackgroundColor":"#000000","bodyBackgroundImage":"./runtime/resources/star_night.jpeg","scaleX":1,"scaleY":1,"screenScale":1,"fps":true,"fpsFont":"12px Verdana","fpsColor":"#FFFF00","fpsX":10,"fpsY":16,"fullPage":true,"fullScreen":true,"keepProportions":true,"fullScreenIcon":true,"fullScreenIconX":-34,"fullScreenIconY":2,"fullScreenIconImage":"./runtime/resources/full_screen.png","smallScreenIconImage":"./runtime/resources/small_screen.png"},"sprites":{"collisionBoxed":false,"collisionPrecision":1,"collisionAlphaThreshold":1},"sounds":{"mode":"amiga","volume":1,"preload":true,"numberOfSoundsToPreload":4,"soundPoolSize":4},"gamepad":{"mapping":{"up":38,"down":40,"left":37,"right":37,"fire":32}},"fonts":{"listFonts":"PC","amiga":[],"google":["expletus sans"]},"default":{"screen":{"x":0,"y":0,"width":1280,"height":720,"numberOfColors":32,"pixelMode":"lowres","palette":["#000000","#FFFFFF","#000000","#222222","#FF0000","#00FF00","#0000FF","#666666","#555555","#333333","#773333","#337733","#777733","#333377","#773377","#337777","#000000","#EECC88","#CC6600","#EEAA00","#2277FF","#4499DD","#55AAEE","#AADDFF","#BBDDFF","#CCEEFF","#FFFFFF","#440088","#AA00EE","#EE00EE","#EE0088","#EEEEEE"],"window":{"x":0,"y":0,"fontWidth":8,"fontHeight":16,"border":0,"paper":0,"pen":1,"background":"opaque","font":{"name":"IBM Plex Mono","type":"google","height":13.375},"cursorImage":"./runtime/resources/cursor_pc.png","cursorColors":[{"r":68,"g":68,"b":0,"a":128},{"r":136,"g":136,"b":0,"a":128},{"r":187,"g":187,"b":0,"a":128},{"r":221,"g":221,"b":0,"a":128},{"r":238,"g":238,"b":0,"a":128},{"r":255,"g":255,"b":34,"a":128},{"r":255,"g":255,"b":136,"a":128},{"r":255,"g":255,"b":204,"a":128},{"r":255,"g":255,"b":255,"a":128},{"r":170,"g":170,"b":255,"a":128},{"r":136,"g":136,"b":204,"a":128},{"r":102,"g":102,"b":170,"a":128},{"r":34,"g":34,"b":102,"a":128},{"r":0,"g":0,"b":68,"a":128},{"r":0,"g":0,"b":17,"a":128},{"r":0,"g":0,"b":0,"a":128}]}}}}');
	this.parent=this;
	this.root=this;
	this.contextName='application';
	this.procParam=0;
	this.procParam$='';
	this.aoz=new AOZ(canvasId,this.manifest);

	// Compiled program begins here
	// ----------------------------
	this.vars=
	{
		CW:0,
		CH:0,
		x_:0.0,
		y_:0.0,
		z_:0.0
	}
	this.blocks=[];
	this.blocks[0]=function()
	{
		// CW=0
		this.aoz.sourcePos="8:0";
		this.vars.CW=0;
		// CH=0
		this.aoz.sourcePos="9:0";
		this.vars.CH=0;
		// Javascript
		this.vars.CW = window.innerWidth;
		this.vars.CH = window.innerHeight;
		// End Javascript
		// Pen1 : Paper 0 : Print "Darius by Kraken. Under Licence CC Attribution.";
	};
	this.blocks[1]=function()
	{
		this.aoz.sourcePos="16:7";
		this.aoz.currentScreen.currentTextWindow.setPaper(0);
		this.aoz.sourcePos="16:17";
		this.aoz.currentScreen.currentTextWindow.print("Darius by Kraken. Under Licence CC Attribution.",false);
		// locate 1,2: Print "https://sketchfab.com";
		this.aoz.sourcePos="17:0";
		this.aoz.currentScreen.currentTextWindow.locate({x:1,y:2});
		this.aoz.sourcePos="17:12";
		this.aoz.currentScreen.currentTextWindow.print("https://sketchfab.com",false);
		// Load3D Scene "scene_darius", "darius/scene.gltf"
		this.aoz.sourcePos="20:0";
		return{type:12,waitThis:this.aoz.AOZ3D,callFunction:"load3DScene", waitFunction:"load_wait",args:["scene_darius", "darius/scene.gltf"]};	
	};
	this.blocks[2]=function()
	{
		// Create3D DIrectionalLight "light1", $FFFFFF, 4
		this.aoz.sourcePos="27:0";
		this.aoz.AOZ3D.create3DDirectionalLight("light1", 0xFFFFFF, 4);
		// AddTo Scene3D "scene_darius", "light1"
		this.aoz.sourcePos="28:0";
		this.aoz.AOZ3D.addToScene3D("scene_darius", "light1")
		// Create3D PerspectiveCamera "camera1", 75, CW, CH, 0.1, 1000
		this.aoz.sourcePos="31:0";
		this.aoz.AOZ3D.create3DPerspectiveCamera("camera1", 75, this.vars.CW, this.vars.CH, 0.1, 1000);
		// MoveXYZ "camera1", 0,20,50
		this.aoz.sourcePos="32:0";
		this.aoz.AOZ3D.moveXYZ("camera1", 0, 20, 50);
		// SetName 3DModel 0, "scene_darius", "darius"
		this.aoz.sourcePos="34:0";
		this.aoz.AOZ3D.setName3DModel(0, "scene_darius", "darius");
		// x#=0.0
		this.aoz.sourcePos="37:0";
		this.vars.x_=0.0;
		// y#=0.0
		this.aoz.sourcePos="38:0";
		this.vars.y_=0.0;
		// z#=0.0
		this.aoz.sourcePos="39:0";
		this.vars.z_=0.0;
		// Do
		this.aoz.sourcePos="40:0";
	};
	this.blocks[3]=function()
	{
		// RotateZ "darius", z#
		this.aoz.sourcePos="41:4";
		this.aoz.AOZ3D.rotateZ("darius", this.vars.z_);
		// z# = z# + 1
		this.aoz.sourcePos="42:4";
		this.vars.z_=this.vars.z_+1;
		// Render3D "scene_darius", "camera1"
		this.aoz.sourcePos="43:4";
		this.aoz.AOZ3D.render3D("scene_darius","camera1");
		// Wait Vbl
		this.aoz.sourcePos="44:4";
		return{type:8,instruction:"waitVbl",args:[]};
	};
	this.blocks[4]=function()
	{
		// Loop
		this.aoz.sourcePos="45:0";
		return{type:1,label:3};
	};
	this.blocks[5]=function()
	{
		// End
		this.aoz.sourcePos="47:0";
		return{type:0}
	};

	// Labels...
	this.labels=
	{
		Pen1:
		{
			dataPosition:0,
			labelBlock:1
		}
	};
	this.aoz.run(this,0,null,this);
	this.aoz.v1_0_textwindows=new v1_0_textwindows(this.aoz,this);
	this.aoz.v1_0_3d=new v1_0_3d(this.aoz,this);
};
