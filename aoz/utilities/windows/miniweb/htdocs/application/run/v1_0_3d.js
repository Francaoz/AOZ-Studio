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
// The 3D Instructions
// By Baptiste Bideaux
// Version 0.99
// 24/12/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 0.9.3.1 - 21/01/2020 on the 27/01/2020-18:37:25
//

function v1_0_3d( aoz )
{
	this.manifest=JSON.parse('{"version":"8","versionModule":"1","infos":{"applicationName":"The 3D Instructions","author":"By Baptiste Bideaux","version":"Version 0.99","date":"24/12/2019","copyright":"(c) AOZ Studio 2019","start":"3D.aoz","object":"3D"}}');
	this.parent=this;
	this.root=this;
	this.aoz=aoz;
	this.contextName='v1_0_3d';

	this.blocks=[];
	this.blocks[0]=function()
	{
		// #need_server
		// Javascript
		this.aoz.AOZ3D = this;	
		this.Scenes = {};
		this.Entity3D = {};
		this.create3DScene = function( _sceneId )
		{
			var css = document.createElement( "style" );
			css.setAttribute("type", "text/css");
			css.innerHTML = "canvas { position:absolute; }";
			document.body.appendChild( css );
			var canvas = document.getElementById( "AOZCanvas" );
			this.Scenes[_sceneId] = new THREE.Scene();
			if( typeof this.renderer3D == 'undefined' )
			{
				this.renderer3D = new THREE.WebGLRenderer( { alpha: true } );
				this.renderer3D.setPixelRatio( window.devicePixelRatio );
				this.renderer3D.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( this.renderer3D.domElement );
			}
		};
		this.load3DScene = function( args )
		{
			var _sceneId = args[ 0 ];
			var _sceneName = args[ 1 ];
			var css = document.createElement("style");
			css.setAttribute("type", "text/css");
			css.innerHTML = "canvas { position:absolute; }";
			document.body.appendChild( css );
			var self = this;
			var _path = "resources/models/";
			var loader = new THREE.GLTFLoader();
			loader.load( _path + _sceneName, function ( _gltf ) 
			{
				_gltf.scene.name = _sceneId;
				self.Scenes[_sceneId] = _gltf.scene;
				if( typeof self.renderer3D == 'undefined' )
				{
					self.renderer3D = new THREE.WebGLRenderer({ alpha: true });
					self.renderer3D.setPixelRatio( window.devicePixelRatio );
					self.renderer3D.setSize( window.innerWidth, window.innerHeight );
					document.body.appendChild( self.renderer3D.domElement );
				}
				self.load_done = true;
			}, undefined, function ( error ) 
			{
				self.load_done = true;
				console.error( error );
			});
		};
		this.setName3DModel = function(_index, _sceneId, _modelId)
		{
			var model = this.Scenes[_sceneId].children[0];
			model.name = _modelId;
			this.Entity3D[_modelId] = model;
			console.log(model.animations);
		};
		this.addToScene3D = function(_sceneId, _entityId)
		{
			var scene = this.Scenes[_sceneId]; 
			scene.add(this.Entity3D[_entityId]);
		};
		this.addToGroup3D = function(_groupId, _entityId)
		{
			this.Entity3D[_groupId].add(this.Entity3D[_entityId]);
		}
		this.moveXYZ = function(_entityId, x, y, z)
		{
			this.Entity3D[_entityId].position.set(x, y, z);
		};
		this.moveX = function(_entityId, x)
		{
			this.Entity3D[_entityId].position.x = x;
		};
		this.moveY = function(_entityId, y)
		{
			this.Entity3D[_entityId].position.y = y;
		};
		this.moveZ = function(_entityId, z)
		{
			this.Entity3D[_entityId].position.z = z;
		};
		this._rotateXYZ = function(_entityId, x, y, z)
		{
			this.Entity3D[_entityId].rotation.x = x * (Math.PI/180);
			this.Entity3D[_entityId].rotation.y = y * (Math.PI/180);
			this.Entity3D[_entityId].rotation.z = z * (Math.PI/180);
		};
		this.rotateX = function(_entityId, x)
		{
			thiis.Entity3D[_entityId].rotation.x = x * (Math.PI/180);
		};
		this.rotateY = function(_entityId, y)
		{
			this.Entity3D[_entityId].rotation.y = y * (Math.PI/180);
		};
		this.rotateZ = function(_entityId, z)
		{
			this.Entity3D[_entityId].rotation.z = z * (Math.PI/180);
		};
		this.render3D = function(_sceneId, _cameraId)
		{
			if(typeof this.renderer3D == 'undefined')
				return;
			var scene = this.Scenes[_sceneId];
			this.renderer3D.setSize( window.innerWidth, window.innerHeight ); 
			var camera = this.Entity3D[_cameraId];
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			this.renderer3D.render( scene, camera );
		};
		this._create3DGroup = function(_entityId)
		{
			var group = new THREE.Group();
			group.name = _entityId
			this.Entity3D[_entityId] = group;
		};
		this.create3DPerspectiveCamera = function(_id, _fov, _width, _height, _near, _far)
		{
			var camera = new THREE.PerspectiveCamera(_fov, _width/_height, _near, _far);
			camera.name = _id;
			this.Entity3D[_id] = camera;
		};
		this.create3DAmbientLight = function(_id, _color)
		{
			var light = new THREE.AmbientLight(_color);
			light.name = _id
			this.Entity3D[_id] = light;
		};
		this.create3DDirectionalLight = function(_id, _color, _intensity)
		{
			var light = new THREE.DirectionalLight(0xFFFFFF, _intensity);
			light.name = _id
			this.Entity3D[_id] = light;
		};
		this.create3DPointLight = function(_id, _color, _intensity,_distance, _decay)
		{
			var light = new THREE.PointLight(_color, _intensity, _distance, _decay);
			light.name = _id
			this.Entity3D[_id] = light;
		};
		this.create3DSpotLight = function(_id, _color, _intensity, _distance, _angle, _penumbra, _decay)
		{
			var light = new THREE.PointLight(_color, _intensity, _distance, _angle, _penumbra, _decay);
			light.name = _id
			this.Entity3D[_id] = light;
		};
		this.create3DBasicMaterial = function(_id, _color, _textureId)
		{
			var material;
			if (typeof this.Entity3D[_textureId] == 'undefined')
			{
				_textureId = "";
			}
			if(_textureId == "")
			{
				material = new THREE.MeshBasicMaterial({color: _color, side: THREE.DoubleSide});
			}
			else
			{
				material = new THREE.MeshBasicMaterial({color: _color, map: this.Entity3D[_textureId], side: THREE.DoubleSide});
			}
			material.name = _id;
			this.Entity3D[_id] = material;
		};
		this.create3DPhongMaterial = function(_id, _color, _textureId)
		{
			var material;
			if (typeof this.Entity3D[_textureId] == 'undefined')
			{
				_textureId = '';
			}
			if(_textureId == "")
			{
				material = new THREE.MeshPhongMaterial({color: _color, side: THREE.DoubleSide});
			}
			else
			{
				material = new THREE.MeshPhongMaterial({color: _color, map: this.Entity3D[_textureId], side: THREE.DoubleSide});
			}
			material.name = _id
			this.Entity3D[_id] = material;
		};
		this.create3DTexture = function( args )
		{
			var _id = args[ 0 ];
			var _imageName = args[ 1 ];
			var self = this;
			var path = "resources/images/" + _imageName;
			var loader = new THREE.TextureLoader();
			loader.load( path, function( texture )
			{
				texture.name = _id
				self.Entity3D[_id] = texture; 
				self.load_done = true;
			}, undefined, function ( error ) 
			{
				self.load_done = true;
				console.error( error );
			} );				
		};
		this.create3DBox = function(_id, _sizeX, _sizeY, _sizeZ, _materialId)
		{
			var geometry = new THREE.BoxGeometry(_sizeX, _sizeY, _sizeZ );
			var mesh = new THREE.Mesh( geometry, this.Entity3D[_materialId]);
			mesh.name = _id
			this.Entity3D[_id] = mesh;
		};
		this.create3DSPhere = function(_id, _radius, _widthSegments, _heightSegments, _materialId)
		{
			var geometry = new THREE.SphereGeometry(_radius, _widthSegments, _heightSegments );
			var mesh = new THREE.Mesh( geometry, this.Entity3D[materialId]);
			mesh.name = _id
			this.Entity3D[_id] = mesh;
		};
		this.create3DPlane = function(_id, _width, _height, _widthSegments, _heightSegments, _materialId)
		{
			var geometry = new THREE.PlaneGeometry( _width, _height, _widthSegments, _heightSegments );
			var mesh = new THREE.Mesh( geometry, this.Entity3D[_materialId]);
			mesh.name = _id
			this.Entity3D[_id] = mesh;    
		};
		this.create3DCone = function(_id, _radius, _height, _radialSegments, _materialId)
		{
			var geometry = new THREE.ConeGeometry(_radius, _height, _radialSegments);
			var mesh = new THREE.Mesh( geometry, this.Entity3D[_materialId]);
			mesh.name = _id
			this.Entity3D[_id] = mesh;
		};
		this.create3DCylinder = function(_id, _radiusTop, _radiusBottom, _height, _radialSegments, _materialId)
		{
			var geometry = new THREE.ConeGeometry(_radiusTop, _radiusBottom, _height, _radialSegments);
			var mesh = new THREE.Mesh( geometry, this.Entity3D[_materialId]);
			mesh.name = _id
			this.Entity3D[_id] = mesh;
		};
		this.load3DModel = function( args )
		{
			var _modelId = args[ 0 ];
			var _modelName = args[ 1 ];
			var _path = "resources/models/";
			var loader = new THREE.GLTFLoader();
			var self = this;
			this.load_done = false;
			loader.load( _path + _modelName, function ( _gltf ) 
			{
				var model = _gltf.scene.children[0];
				model.name = _modelId;
				self.Entity3D[_modelId] = model;
				self.load_done = true;
			}, undefined, function ( error ) 
			{
				console.error( error );
			});    
		};
		this.load_wait = function()
		{
			if ( this.load_done )
			{
				this.aoz.waiting = null;
			}
		};
		// End Javascript
	};
	this.blocks[1]=function()
	{
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
