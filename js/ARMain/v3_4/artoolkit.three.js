//* THREE.js ARToolKit integration */

(function() {
	var integrate = function() {
		/**
			Helper for setting up a Three.js AR scene using the device camera as input.
			Pass in the maximum dimensions of the video you want to process and onSuccess and onError callbacks.

			On a successful initialization, the onSuccess callback is called with an ThreeARScene object.
			The ThreeARScene object contains two THREE.js scenes (one for the video image and other for the 3D scene)
			and a couple of helper functions for doing video frame processing and AR rendering.

			Here's the structure of the ThreeARScene object:
			{
				scene: THREE.Scene, // The 3D scene. Put your AR objects here.
				camera: THREE.Camera, // The 3D scene camera.

				arController: ARController,

				video: HTMLVideoElement, // The userMedia video element.

				videoScene: THREE.Scene, // The userMedia video image scene. Shows the video feed.
				videoCamera: THREE.Camera, // Camera for the userMedia video scene.

				process: function(), // Process the current video frame and update the markers in the scene.
				renderOn: function( THREE.WebGLRenderer ) // Render the AR scene and video background on the given Three.js GLRenderer.
			}

			You should use the arScene.video.videoWidth and arScene.video.videoHeight to set the width and height of your GLRenderer.

			In your frame loop, use arScene.process() and arScene.renderOn(GLRenderer) to do frame processing and 3D rendering, respectively.

			@param {number} width - The maximum width of the userMedia video to request.
			@param {number} height - The maximum height of the userMedia video to request.
			@param {function} onSuccess - Called on successful initialization with an ThreeARScene object.
			@param {function} onError - Called if the initialization fails with the error encountered.
		*/
		ARController.getUserMediaThreeScene = function(configuration) {
			var obj = {};
			for (var i in configuration) {
				obj[i] = configuration[i];
			}
			var onSuccess = configuration.onSuccess;

			obj.onSuccess = function(arController, arCameraParam) {
				var scenes = arController.createThreeScene();
				onSuccess(scenes, arController, arCameraParam);
			};

			var video = this.getUserMediaARController(obj);
			// console.log("artk.three.js: _getUserMediaThreeScene: return video(w, h):", video.videoWidth, video.videoHeight);
			return video;
		};


		ARController.prototype.UrlExistsFetch = async function( url ){

			let ret = await fetch(url, {method: 'HEAD'})

			console.log('_ARController: _UrlExistsFetch: ret ', ret );
			if ( ret.status ){
				return ret.status == '200';
			}else{
				return false ;
			}

		};


		/**
			Creates a Three.js scene for use with this ARController.

			Returns a ThreeARScene object that contains two THREE.js scenes (one for the video image and other for the 3D scene)
			and a couple of helper functions for doing video frame processing and AR rendering.

			Here's the structure of the ThreeARScene object:
			{
				scene: THREE.Scene, // The 3D scene. Put your AR objects here.
				camera: THREE.Camera, // The 3D scene camera.

				arController: ARController,

				video: HTMLVideoElement, // The userMedia video element.

				videoScene: THREE.Scene, // The userMedia video image scene. Shows the video feed.
				videoCamera: THREE.Camera, // Camera for the userMedia video scene.

				process: function(), // Process the current video frame and update the markers in the scene.
				renderOn: function( THREE.WebGLRenderer ) // Render the AR scene and video background on the given Three.js GLRenderer.
			}

			You should use the arScene.video.videoWidth and arScene.video.videoHeight to set the width and height of your GLRenderer.

			In your frame loop, use arScene.process() and arScene.renderOn(GLRenderer) to do frame processing and 3D rendering, respectively.

			@param video Video image to use as scene background. Defaults to this.image
		*/
		ARController.prototype.createThreeScene = function(video) {
			video = video || this.image;
			

			this.setupThree();

//[start-20181015-fei0029-mod]//
			// To display the video, first create a texture from it. Both Texture and VideoTexture can work well
			// 20181120... Fei find that the VideoTexture will cause the iOS lag... why???
			// var videoTex = new THREE.Texture(video);
			var videoTex = new THREE.VideoTexture(video);
//[end---20181015-fei0029-mod]//
			
			videoTex.minFilter = THREE.LinearFilter;
			videoTex.flipY = false;

//20221208-thonsha-add-start
			this.cameraTexture = videoTex;
//20221208-thonsha-add-end

			// Then create a plane textured with the video.
			var videoStreamPlane = new THREE.Mesh(
//[start-20190111-fei0048-mod]//
				//// in the begging, the size of (2,2) is wired, make the aspect ratio of video not equal to GLRenderer.
				//// we make the videoStreamPlane Geometry equal to video then create the OrthographicCamera as the same. 
				// new THREE.PlaneBufferGeometry( videoTex.image.videoWidth, videoTex.image.videoHeight ),
				
				new THREE.PlaneGeometry( videoTex.image.videoWidth, videoTex.image.videoHeight ),

				// new THREE.PlaneBufferGeometry(2, 2),
//[end---20190111-fei0048-mod]
			 	new THREE.MeshBasicMaterial({map: videoTex, side: THREE.BackSide}) // DoubleSide FrontSide BackSide
			);

			// The video plane shouldn't care about the z-buffer.
			videoStreamPlane.material.depthTest = false;
			videoStreamPlane.material.depthWrite = false;
			videoStreamPlane.position.set(0, 0, -1 );

			// Create a camera and a scene for the video plane and
			// add the camera and the video plane to the scene.
//[start-20190111-fei0048-add]//
			//// we make the aspect ratio of OrthographicCamera same as video.
			// var videoCamera = new THREE.OrthographicCamera( -1, 1, -1, 1, -1, 20000);
			// var videoCamera = new THREE.OrthographicCamera( -320/2, 320/2, -480/2, 480/2, -1, 20000);
//[start-20190823-fei0071-mod]//
			////// make the 2D Camera look from -100 (origin from -1)
			// var videoCamera = new THREE.OrthographicCamera( -videoTex.image.videoWidth/2, videoTex.image.videoWidth/2, -videoTex.image.videoHeight/2, videoTex.image.videoHeight/2, -1, 20000);
			var videoCamera = new THREE.OrthographicCamera( -videoTex.image.videoWidth/2, videoTex.image.videoWidth/2, -videoTex.image.videoHeight/2, videoTex.image.videoHeight/2, -100, 20000);

			// var camera2D = new THREE.OrthographicCamera( -videoTex.image.videoWidth/2, videoTex.image.videoWidth/2, -videoTex.image.videoHeight/2, videoTex.image.videoHeight/2, -100, 20000);


			let arfScene = document.getElementById('arfScene');
			let vw = videoTex.image.videoWidth;
			let vh = videoTex.image.videoHeight;			
			let w , h;
			if ( window.innerWidth/window.innerHeight > vw/vh ){
				w = window.innerWidth ;
				h = (window.innerWidth/vw)*vh;
			}else{
				w = (window.innerHeight/vh) * vw ;
				h = window.innerHeight;
			}
			// console.log(' 88888888 ' , w , h );
			var camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -100, 20000);

//[end---20190823-fei0071-mod]//

//[end---20190111-fei0048-add]//

			var videoScene = new THREE.Scene();
			videoScene.name = "videoScene";
			videoScene.add(videoStreamPlane);
			videoScene.add(videoCamera);

			var glScene = new THREE.Scene();
			glScene.name = "glScene";

			var scene2D = new THREE.Scene();
			scene2D.name = "scene2D";

			var cssScene = new THREE.Scene();

//[start-20181023-fei0032-mod]//
			////// camera for GLRenderer, to observe the THREE object3D
			var camera = new THREE.PerspectiveCamera( 45, 1.33333, 1, 20000 );  //second term(aspect) not work because we set matrixAutoUpdate = false
			// var camera = new THREE.PerspectiveCamera( 45, w/h , 1, 20000 );  //second term(aspect) not work because we set matrixAutoUpdate = false

			// console.log("three.js: 0 camera projectionMatrix:", camera.projectionMatrix.elements.toString() );

			//// 
			//// 在升級 three 版本從 97 到 111 （aframe-v1.0.4）的時候，發現原來調整場景內相機的projectionMatrix 的行為會導致在render 模型的時候
			//// 產生因為無法分辨mesh前後而破面的狀況發生。因應處理讓相機 y z 旋轉各180。然後將矩陣內更改顛倒特定數值
			//// 
			camera.projectionMatrix.fromArray( this.getCameraMatrix() ); //// for both three.js(version: 0.77.1) and three(0.97.1)	
			// camera.position.set( 0 , 0 , 500 ); //// 
			camera.rotation.set( 0 , Math.PI*180/180 , Math.PI*180/180 ); //// 
			
			camera.projectionMatrix.elements[5]  = -camera.projectionMatrix.elements[5]; //// 畫面比例
			camera.projectionMatrix.elements[8] = -camera.projectionMatrix.elements[8]; //// 偏移修正項
			camera.projectionMatrix.elements[9] = -camera.projectionMatrix.elements[9]; //// 偏移修正項
			camera.projectionMatrix.elements[10] = -camera.projectionMatrix.elements[10]; //// 畫面比例
			camera.projectionMatrix.elements[11] = -camera.projectionMatrix.elements[11]; //// 畫面比例
			// console.log(" ********** " , this.getCameraMatrix() , camera.projectionMatrix.elements );

			//// 點擊觸發事件會用到 raycaster-setFromCamera-unproject-projectionMatrixInverse ，所以必須連帶更新
			// camera.projectionMatrixInverse.getInverse( camera.projectionMatrix );
			if ( camera.projectionMatrixInverse.getInverse ){
				camera.projectionMatrixInverse.getInverse( camera.projectionMatrix );
			}else{
				let tempPM = camera.projectionMatrix.clone();
				camera.projectionMatrixInverse.copy( tempPM.invert() );
			}

			//// 備份的 相機，為了確認「投影矩陣」參數
			let bkCamera = camera.clone();



			
			let oCamera = document.getElementById('oCamera');
			let oCamera3D = new THREE.PerspectiveCamera(  60, w/h, 0.3 ,  10000 );

			let originOCameraPosition = oCamera.getObject3D('camera').position.clone();
			oCamera3D.position.copy( originOCameraPosition );

			let cameraData = {
				aspect: w/h,
				near: 0.3,
				far: 10000,
				fov: 60,
			}
			
			oCamera.setObject3D( 'camera', oCamera3D );
			oCamera.setAttribute('camera' , cameraData );

			oCamera.components['camera'].camera = oCamera3D;
			oCamera.components['orbit-controls'].controls.object = oCamera3D;


			// camera.matrixAutoUpdate = false ;// 20190527- unnecessary, if add this the position set will fail
			// console.log("1 camera projectionMatrix:", camera.projectionMatrix.elements );

			////// camera for CSS3DRenderer, to observe the THREE CSS3DObject
			var CSScamera = new THREE.PerspectiveCamera( 45, 1.33333, 1, 20000 );  //second term(aspect) not work because we set matrixAutoUpdate = false
			// CSScamera.matrixAutoUpdate = false ;// 20190603: we cant use here, fucking wast my time 
			CSScamera.projectionMatrix.fromArray( this.getCameraMatrix() ); //// for both three.js(version: 0.77.1) and three(0.97.1)	
			
			// CSScamera.projectionMatrix.elements[0] = camera.projectionMatrix[0];
			// CSScamera.projectionMatrix.elements[5] = -camera.projectionMatrix[5];
		
			// CSScamera.position.set(0, 0, 3000);
			// CSScamera.updateProjectionMatrix();
			// CSScamera.updateMatrix();

			// console.log("0 CSScamera:", CSScamera.projectionMatrix.elements   );

//[end---20181023-fei0032-mod]//

			if (this.orientation === 'portrait') {
//[start-20181015-fei0029-remove]//
				//// dont need to do that, because the video is already portrait
				// plane.rotation.z = Math.PI/2;	
//[end---20181015-fei0029-remove]//
			}
			// glScene.add(camera); // 20190314-fei: it seem not necessary... 

			//// add the light for fbx model
			// var light;

			// light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
			
			// // light.color.setHSL( 0.6, 1, 0.6 );
			// // light.groundColor.setHSL( 0.095, 1, 0.75 );
			// // light.position.set( 0, 50, 0 );
			// light.intensity = 1.4; ////// GLTF Model set 2.0, FBX set 1.0
			// // console.log("three.js: light=", light );

			// // light.position.set( 0, 200, 0 );
			// light.matrixAutoUpdate = false;
			// light.matrix.fromArray(this.getCameraMatrix());
			// // glScene.add( light );
			
			// let amlight = new THREE.AmbientLight( 0x808080 , 1 ); // soft white light
			// glScene.add( amlight );

            // light = new THREE.DirectionalLight( 0xffffff );
			// // light.position.set( 0, 200, 100 );
			// light.matrixAutoUpdate = false;
			// light.matrix.fromArray(this.getCameraMatrix());
            // light.castShadow = true;
            // light.shadow.camera.top = 280;
            // light.shadow.camera.bottom = -280;
            // light.shadow.camera.left = -220;
            // light.shadow.camera.right = 220;
			// // glScene.add( light );


//[start-20181029-fei0034-add]//
			this.glScene = glScene;
			this.camera = camera;
			this.aCamera = camera;
			this.oCamera = oCamera;
			this.oCamera3D = oCamera3D;
			this.bkCamera = bkCamera;
			this.CSScamera = CSScamera;
			this.videoCamera = videoCamera;
			this.videoScene = videoScene;
			this.scene2D = scene2D;
			this.camera2D = camera2D;
			this.videoStreamPlane = videoStreamPlane;

			//// 決定是否啟動「辨認流程」
			this.enableTracking = true;

			var clock = new THREE.Clock();
			this.clock = clock;

			this.cssScene = cssScene;

			var self = this;
			return {
				glScene: glScene,
				videoScene: videoScene,
				scene2D: scene2D,
//[start-20190322-fei0062-add]//
				cssScene: cssScene,
//[end---20190322-fei0062-add]//
				camera: camera,
				CSScamera: CSScamera,
				videoCamera: videoCamera,
				camera2D: camera2D,
				arController: this,
				video: video,
				clock: clock,
				process: function() {
//[start-20180927-fei0027-mod]//
					//// 20181102Fei: the webWorker will not call this part

					// for (var i in self.threeNFTMarkers) {
					// 	self.threeNFTMarkers[i].visible = false;
					// }
					
					for (var i in self.aframeNFTMarkers) {
						self.aframeNFTMarkers[i].object3D.visible = false;
					}

					self.process(video); //20180827-fei note: this call the .api.js: ARController.prototype.process

//[end---20180927-fei0027-mod]//
				},

				renderOn: function(GLRenderer, CSS3DRenderer) {
					videoTex.needsUpdate = true;
					
					GLRenderer.autoClear = false;
					// GLRenderer.clear();

					if ( !self.arScene.video.paused ){
						GLRenderer.render(this.videoScene, this.videoCamera);
					}
					// GLRenderer.render(this.glScene, this.videoCamera);

					GLRenderer.clearDepth();
					// GLRenderer.render(this.glScene, this.camera );
					GLRenderer.render(  arfScene.object3D , arController.camera );

					GLRenderer.render(this.scene2D, this.camera2D );
//[start-20190322-fei0062-add]//
					// CSS3DRenderer.render(this.cssScene, this.CSScamera );
//[end---20190322-fei0062-add]//
				}
			};
		};

		/**
			Creates a Three.js marker Object3D for the given marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			Use this after a successful artoolkit.loadMarker call:

			arController.loadMarker('/bin/Data/patt.hiro', function(markerUID) {
				var markerRoot = arController.createThreeMarker(markerUID);
				markerRoot.add(myFancyHiroModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID The UID of the marker to track.
			@param {number} markerWidth The width of the marker, defaults to 1.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMarker = function(markerUID, markerWidth) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.markerTracker = this.trackPatternMarkerId(markerUID, markerWidth);
			obj.matrixAutoUpdate = false;
			this.threePatternMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given NFT marker UID.
			The marker Object3D tracks the NFT marker when it's detected in the video.

			Use this after a successful artoolkit.loadNFTMarker call:

			arController.loadNFTMarker('DataNFT/pinball', function(markerUID) {
				var markerRoot = arController.createThreeNFTMarker(markerUID);
				markerRoot.add(myFancyModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID The UID of the marker to track.
			@param {number} markerWidth The width of the marker, defaults to 1.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeNFTMarker = function(markerUID, markerWidth) {
			// console.log("artk.three.js: markerUID = ", markerUID);
			this.setupThree();
			var obj = new THREE.Object3D();
//[start-20190108-fei0046-remove]//
			//// Fei: it look like useless..
			// obj.markerTracker = this.trackNFTMarkerId(markerUID, markerWidth);
//[end---20190108-fei0046-remove]//

			obj.visible = false;
			obj.GCSSID = markerUID;
            obj.loadedObjects = false; // when the target first time recognize, load the project data( elements: FBX, video, jpg ), and set this to true 
			obj.showObjects = true; // default set true, that let the objects show in middle when lost.
			obj.matrixAutoUpdate = false;
			this.threeNFTMarkers[markerUID] = obj;
			return obj;
		};

		///////// 大改版： 改為 aframe 架構

		ARController.prototype.createAframeNFTMarker = function( markerUID ) {
			// console.log("artk.three.js: markerUID = ", markerUID);
			this.setupThree();
			// var obj = new THREE.Object3D();

			let entity = document.createElement('a-entity');
			let self = this;

			// entity.setAttribute('id', self.sceneTargetList[ markerUID ].target_id );

			if (  markerUID < publishARProjs.result.length ){

				let tid = publishARProjs.result[ markerUID ].target_ids[0];
				let t_index = self.sceneTargetList.findIndex( e =>  e.target_id == tid  )
				entity.setAttribute('id', tid );
				entity.GCSSID = t_index;
			}

			entity.setAttribute('visible', false );
			
			entity.loadedObjects = false; 
			entity.showObjects = true; 
			entity.addEventListener('loaded', function(){
				entity.object3D.matrixAutoUpdate = false;
				entity.object3D.targetRoot = true;
			});

			this.aframeNFTMarkers[markerUID] = entity;


			return entity;
		};


		/////////////////////////////////////


//[start-20190110-fei0048-add]//
		//// for 2D objects
		ARController.prototype.createThreeNFTMarker2D = function(markerUID) {
			this.setupThree();

			let self = this;

			var obj2D = new THREE.Object3D();
			obj2D.visible = false;
			
			//// 在導入場景物件的時候
			if (  markerUID < publishARProjs.result.length && markerUID > -1 ){
				let tid = publishARProjs.result[ markerUID ].target_ids[0];
				let t_index = self.sceneTargetList.findIndex( e =>  e.target_id == tid  )
				obj2D.GCSSID = t_index;
			}else{
				obj2D.GCSSID = markerUID;
			}

			obj2D.loadedObjects = false;
			obj2D.matrixAutoUpdate = false;
			this.threeNFTMarkers2D[markerUID] = obj2D;
			return obj2D;
		}
//[end---20190110-fei0048-add]//

//[start-20190322-fei0062-add]//
		////////////////////// for CSS objects  //////////////////////
		ARController.prototype.createThreeNFTMarkerCSS = function(markerUID) {
			// this.setupThree();
			var objCSS = new THREE.Object3D();
			objCSS.visible = false;
			objCSS.GCSSID = markerUID;
			objCSS.loadedObjects = false;
			objCSS.matrixAutoUpdate = false;
			this.threeNFTMarkersCSS[markerUID] = objCSS;
			return objCSS;
		}
//[end---20190322-fei0062-add]//

		/**
			Creates a Three.js marker Object3D for the given multimarker UID.
			The marker Object3D tracks the multimarker when it's detected in the video.

			Use this after a successful arController.loadMarker call:

			arController.loadMultiMarker('/bin/Data/multi-barcode-4x3.dat', function(markerUID) {
				var markerRoot = arController.createThreeMultiMarker(markerUID);
				markerRoot.add(myFancyMultiMarkerModel);
				arScene.scene.add(markerRoot);
			});

			@param {number} markerUID The UID of the marker to track.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeMultiMarker = function(markerUID) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.matrixAutoUpdate = false;
			obj.markers = [];
			this.threeMultiMarkers[markerUID] = obj;
			return obj;
		};

		/**
			Creates a Three.js marker Object3D for the given barcode marker UID.
			The marker Object3D tracks the marker pattern when it's detected in the video.

			var markerRoot20 = arController.createThreeBarcodeMarker(20);
			markerRoot20.add(myFancyNumber20Model);
			arScene.scene.add(markerRoot20);

			var markerRoot5 = arController.createThreeBarcodeMarker(5);
			markerRoot5.add(myFancyNumber5Model);
			arScene.scene.add(markerRoot5);

			@param {number} markerUID The UID of the barcode marker to track.
			@param {number} markerWidth The width of the marker, defaults to 1.
			@return {THREE.Object3D} Three.Object3D that tracks the given marker.
		*/
		ARController.prototype.createThreeBarcodeMarker = function(markerUID, markerWidth) {
			this.setupThree();
			var obj = new THREE.Object3D();
			obj.markerTracker = this.trackBarcodeMarkerId(markerUID, markerWidth);
			obj.matrixAutoUpdate = false;
			this.threeBarcodeMarkers[markerUID] = obj;
			return obj;
		};

		ARController.prototype.setupThree = function() {
			if (this.THREE_JS_ENABLED) {
				return;
			}
			this.THREE_JS_ENABLED = true;


//[start-20181107-fei0036-add]//
			var self = this;
			this.addEventListener('loadNFTDone', function(ev) {
				self.gcssTargets = ev.data;
				// console.log("artk.three.js, loadNFTDone, this.gcssTargets=", self.gcssTargets );
			});
//[end---20181107-fei0036-add]//


			/*
				Listen to getMarker events to keep track of Three.js markers.
			*/
			this.addEventListener('getMarker', function(ev) {
				var marker = ev.data.marker;
				var obj;
//[start-20190719-fei0070-remove]//
				// if (ev.data.type === artoolkit.PATTERN_MARKER) {
				// 	obj = this.threePatternMarkers[ev.data.marker.idPatt];

				// } else if (ev.data.type === artoolkit.BARCODE_MARKER) {
				// 	obj = this.threeBarcodeMarkers[ev.data.marker.idMatrix];

				// }
//[end---20190719-fei0070-remove]//
				if (obj) {
//[start-20181023-fei0032-mod]//
					obj.matrix.elements.set(ev.data.matrix);
					// obj.matrix.set(ev.data.matrix);
//[end---20181023-fei0032-mod]//	
					obj.visible = true;
				}
			});

//[start-20190606-fei0065-add]//
			this.addEventListener('getFrameTarget', function(ev) {  // wait from artk.proxy.js   
				console.log('three.js, listened getFrameTarget, ev=', ev );
//[start-20190828-fei0072-mod]//
				if (ev.data.index < 0){
					console.log("three.js: listened getFrameTarget index < 0, return ", this.threeNFTMarkers2D["-3"]);
					if (this.threeNFTMarkers2D["-3"]){
						if (this.threeNFTMarkers2D["-3"].name == "note1"){
							this.threeNFTMarkers2D["-3"].visible = true;
							
							let temp = this;
							setTimeout( function(){
								temp.threeNFTMarkers2D["-3"].visible = false;
							}, 2000 );

						}
					}
				}else{
					if (this.threeNFTMarkers2D["-3"]){
						if (this.threeNFTMarkers2D["-3"].name == "note1"){
							this.threeNFTMarkers2D["-3"].visible = false;
						}
					}
					//// get the Uint8ClampedArray from worker thread(c++), and set into one canvas, ===== done at 20190608 Fei =====
					var uint8ClampedArray = ev.data.uArray;
					var imageData = new ImageData( uint8ClampedArray, 256, 256) ;
					this.targetCtx.putImageData(imageData, 0, 0); // here, this = ARController create in ARProxy
					//// add into DOM for test only. and open on another webpage
					// document.body.appendChild( this.targetCanvas ); 
					// var dataURL = this.targetCanvas.toDataURL();
					// window.open(dataURL, "image");

					//// find the relatived model and change the texture (coloring)
					// let obj = this.threeNFTMarkers[ ev.data.index ]; // get the right index for the right model
					// let obj2D =  this.threeNFTMarkers2D[ ev.data.index ];
					// let objCSS = this.threeNFTMarkersCSS[ ev.data.index ];

					let obj =    this.aframeNFTMarkers[ self.sceneTargetList[ev.data.index].projIndex ];
					let obj2D =  this.threeNFTMarkers2D[ self.sceneTargetList[ev.data.index].projIndex ];
					let objCSS = this.threeNFTMarkersCSS[ self.sceneTargetList[ev.data.index].projIndex ];

					console.log('artk.three.js, listened getFrameTarget, obj=', obj, "\nobj2D=", obj2D );
					console.log(' ************* ' , ev.data.index , self.sceneTargetList[ev.data.index].projIndex );

					//// 紀錄「著色狀態」為「使用者填入」  // -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
					obj.coloringStatus = 1;

					obj.loadModel = true; //// set the _loadModel, then call _loadMakarScene to load the 3D model
					self.loadMakarScene( ev.data.index , obj , obj2D, objCSS );

				}
//[end---20190828-fei0072-mod]//
			

			});
//[end---20190606-fei0065-add]//
			/*
				Listen to getNFTMarker events to keep track of Three.js markers.
			*/
//[start-20181016-fei0030-mod]//
			// this.addEventListener('getNFTMarker', function(ev) {
			this.addEventListener('getNFTMarkerDraw', function(ev) { //wait from artk.proxy.js or artk.api.js, to draw object
//[end---20181016-fei0030-mod]//
				let marker = ev.data.marker;
				

				let obj =    this.aframeNFTMarkers[ self.sceneTargetList[marker.id].projIndex ];

				// let obj =    this.threeNFTMarkers[ self.sceneTargetList[marker.id].projIndex ];
				let obj2D =  this.threeNFTMarkers2D[ self.sceneTargetList[marker.id].projIndex ];
				let objCSS = this.threeNFTMarkersCSS[ self.sceneTargetList[marker.id].projIndex ];

//[start-20181102-fei0034-add]//

				if (obj) {

//[start-20190102-fei0044-add]//
					if( !obj.loadedObjects ||  !obj2D.loadedObjects ){ //// 20190615 add the obj2D 
					// if( !obj.loadedObjects ){
						//// 不能讓場景重複載入，改為則直接設定
						obj.loadedObjects = obj2D.loadedObjects = true;

						//// 當前聲音與影片在手機上播放是需要「使用者互動」，固假如之前有專案帶有「影片」「聲音」，且尚未「確認播放聲音」，則會留下滿板同意視窗。
						//// 無條件隱藏此視窗，並且取消騎觸發事件
						let clickToPlayAudio = document.getElementById("clickToPlayAudio");
						clickToPlayAudio.style.display = "none";
						clickToPlayAudio.onclick = null;


						// console.log( "makar.three.js: getNFTMarkerDraw, loadedObjects: ev=", ev ); // window.sceneResult[  ev.data.marker.id ]
						// let i = ev.data.marker.id;
						let i = self.sceneTargetList[marker.id].projIndex;
						// console.log(" ******** three.js: _getNFTMarkerDraw: ", publishARProjs.proj_list[i]  );

						if (Array.isArray(publishARProjs.proj_list[i].loc)){
							if ( publishARProjs.proj_list[i].loc.length > 1 && publishARProjs.proj_list[i].module_type.find(function(item){return item == "gps";})  ){

								function calculateGeosToDistanceHaversine(lat1, lon1, lat2, lon2, unit="M" ) {
									if ((lat1 == lat2) && (lon1 == lon2)) {
										  return 0;
									} else {
										let radlat1 = Math.PI * lat1/180;
										let radlat2 = Math.PI * lat2/180;
										let radlon1 = Math.PI * lon1/180;
										let radlon2 = Math.PI * lon2/180;
										let dradlat = radlat1-radlat2;
										let dradlon = radlon1-radlon2;
										let dist = 2*Math.asin( Math.sqrt( Math.pow(Math.sin(dradlat/2), 2) + Math.cos(radlat1)*Math.cos(radlat2)*Math.pow( Math.sin(dradlon/2), 2) ) );
										if (unit=="M") { dist = dist * 6378137 }
										console.log("three.js: calculateGeosToDistanceHaversine dist=", dist );
										return dist;
									}
								}
								warnButtonTitle.textContent = worldContent.comfirm[languageType];

								warnModalButton.onclick = function(){
									console.log("three.js: the warnModalButton is clicked ");
									warnModal.style.display = "none";
									obj.loadedObjects = obj2D.loadedObjects = false;//// 把狀態設回未載入
								}

								if (navigator.geolocation) {
									var options = {
										enableHighAccuracy: false,
										timeout: 5000,
										maximumAge: 0
									};
									navigator.geolocation.getCurrentPosition(geoSuccess, geoError , options );
									function geoSuccess(geoPosition) {  
										console.log("three.js: showProjectInfo: get Geolocation geoPosition=.", geoPosition.coords.latitude, geoPosition.coords.longitude);
										let dist = calculateGeosToDistanceHaversine(geoPosition.coords.latitude, geoPosition.coords.longitude , publishARProjs.proj_list[i].loc[0] , publishARProjs.proj_list[i].loc[1]);
										getViewerConfig( serverUrl , function(viewerConfig){
											if (dist < viewerConfig.data.gps_range_distance  ){
												
												let pAll = self.loadMakarScene( marker.id, obj , obj2D, objCSS );

												let cIndex = self.sceneTargetList[marker.id].projIndex;
												if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
												{	
													console.log('three.js: _getNFTMarkerDraw: _GPS get _logic xml ' , cIndex , publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  );
													let pXML = self.parseLogicXML( cIndex , 0 );
													pAll.push( pXML );
												}

												// if ( Array.isArray(pAll) ){
												// 	Promise.all( pAll ).then( function( ret ){
												// 		console.log('three.js: _getNFTMarkerDraw: _GPS _loadMakarScene done: ret = ' , ret  );
												// 		if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && 
												// 		publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
												// 		{
												// 			setTimeout( function(){
												// 				self.logicList[ cIndex ].parseXML();
												// 				if ( obj.targetState == 0 ){
												// 					self.logicList[ cIndex ].stopLogic();
												// 				}

												// 				self.setupSceneBehav( i );

												// 			}, 1 );
												// 		}
												// 	});
												// }

											}else{
												console.log("three.js: showProjectInfo: get Geolocation distance not allow",  dist );
												warnModal.style.display = "block";
												warnModalInfo.textContent = worldContent.GPSDistanceMsg[languageType] + Math.floor(dist) + " meter" ;
											}
										});
									}
									function geoError(err){
										console.log("three.js: showProjectInfo: get Geolocation err=.",  err , err.code , err.message );
										warnModal.style.display = "block";
										warnModalInfo.textContent = worldContent.GPSErrorMsg[languageType] + "\r\n" + err.message;		
									}
								} else {
									  console.log("three.js: showProjectInfo: Geolocation is not supported by this browser.");
									  warnModal.style.display = "block";
									  warnModalInfo.textContent = worldContent.GPSnotSupportMsg[languageType] ;									
								}

							}else{	

								let pAll = self.loadMakarScene( marker.id, obj , obj2D, objCSS );

								let cIndex = self.sceneTargetList[marker.id].projIndex;
								if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
								{	
									console.log('three.js: _getNFTMarkerDraw: get _logic xml ' , cIndex , publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  );
									let pXML = self.parseLogicXML( cIndex , 0 );
									pAll.push( pXML );
								}

								// if ( Array.isArray(pAll) ){
								// 	Promise.all( pAll ).then( function( ret ){
								// 		console.log('three.js: _getNFTMarkerDraw _loadMakarScene done: ret = ' , ret  );
								// 		if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && 
								// 		publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
								// 		{
								// 			setTimeout( function(){
								// 				self.logicList[ cIndex ].parseXML();
								// 				if ( obj.targetState == 0 ){
								// 					self.logicList[ cIndex ].stopLogic();
								// 				}

								// 				self.setupSceneBehav( i );

								// 			}, 1 );

								// 		}
								// 	});
								// }

							}
						}
						

						
					}else{
						// console.log( "artk.three.js: already loadedObjects , tracking id= ", ev.data.marker.id ); // window.sceneResult[  ev.data.marker.id ]
					}

					// if (marker.found == 1){ // tracking ..
					if (marker.found > 0 ){ // recognize or tracking ..
						// this.currentProjectIndex = ev.data.marker.id; //// 20190711 Fei add, it's useless now.
						this.currentProjectIndex = self.sceneTargetList[marker.id].projIndex; //// 20190711 Fei add, it's useless now.
						//// for the modules , now only coloring
						if (marker.found == 2){ //// 0: lost, 1:recognize, 2:tracking

							//// 紀錄「辨識圖狀態」, 0: lost, 1: recognize, 2: tracking.
							obj.targetState = 2;

							//// 假如有「邏輯功能」，啟動
							if ( self.logicList[ self.currentProjectIndex ]  ){
								if ( self.logicList[ self.currentProjectIndex ].logicSystemState == 0 ){
									self.logicList[ self.currentProjectIndex ].parseXML();
								}
							}


							//// -1: not the coloring module, 0: coloring module and not loadModel, 1: coloring module and already loadModel
							// var isLoadModel = this.checkColoring( ev.data.marker.id, obj, obj2D, ev.data.marker.allowColor );
							var isLoadModel = this.checkColoring( self.sceneTargetList[marker.id].projIndex , obj, obj2D, ev.data.marker.allowColor );
							// console.log("isLoadModel=", isLoadModel);

							if (isLoadModel == 1 ){ // means the model is already load(coloring module) or general project, so show the snapShot icon
								// this.threeNFTMarkers2D["-2"].visible = true; //// 20190628 fei: the -2 is snapShot icon, make it visible
								// console.log(" 111111111111111 ");
								// snapShotCamera.style.display = "block";
								if ( parent && parent.pictureBackground && parent.pictureBackground.style ){
									parent.pictureBackground.style.display = 'block';
								}
							}else if ( isLoadModel == 0) { // means prepare to coloring state, maybe from general project to coloring project or the initial state to coloring project
								// this.threeNFTMarkers2D["-2"].visible = false; //// 20190628 fei: the -2 is snapShot icon, make it visible
								// console.log(" 00000000000 ");
								// snapShotCamera.style.display = "none";
								if ( parent && parent.pictureBackground && parent.pictureBackground.style ){
									parent.pictureBackground.style.display = 'none';
								}
							} else if ( isLoadModel == -1 ){
								// console.log(" --------------- ");
							}

						}else{ //// recognize part

							//// 紀錄「辨識圖狀態」, 0: lost, 1: recognize, 2: tracking.
							obj.targetState = 1;
							
							// addScanTimesByTargetID(window.serverUrl, publishARProjs.user_id, publishARProjs.proj_list[ev.data.marker.id].target_id );
							addScanTimesByTargetID(window.serverUrl, publishARProjs.user_id, self.sceneTargetList[marker.id].target_id );

							//// if there is previous scene loaded, clear it, make the GL object visible false and deal the module in dom.  
							this.activeAndClearScene(ev.data.marker.id);
							
							if ( obj.object3D ){
								if ( obj.object3D.children.length > 0 ){
								
									obj.object3D.traverse( function ( child ) {
										if (child.originTransform){
											child.position.copy( child.originTransform.position );
											child.rotation.copy( child.originTransform.rotation );
											child.scale.copy( child.originTransform.scale );
										}
									});
									obj.object3D.updateMatrix();
									obj.object3D.matrixAutoUpdate = false;
								}
							}

							//// 調整「照著物件場景的相機」，投影矩陣調整回來，目前流程有所缺失
							self.camera.projectionMatrix.elements[8] = self.bkCamera.projectionMatrix.elements[8] ;
							// self.camera.projectionMatrix.copy( self.bkCamera.projectionMatrix );

							// self.camera.projectionMatrixInverse.getInverse( self.camera.projectionMatrix );
							if ( self.camera.projectionMatrixInverse.getInverse ){
								self.camera.projectionMatrixInverse.getInverse( self.camera.projectionMatrix );
							}else{
								let tempPM = self.camera.projectionMatrix.clone();
								self.camera.projectionMatrixInverse.copy( tempPM.invert() );
							}


							// console.log(' reco cpm = ', self.camera.projectionMatrix.elements.toString() );

							// console.log( "three.js: recognize: marker.found= ", marker.found ); // window.sceneResult[  ev.data.marker.id ]
						}
//[end---20190614-fei0066-add]//
						//// check and tune the obj visible or not here, instead of in artk.proxy.js.
						//// Base on 3D objects, because there are default 2D objects need show.
						// for (let i in this.threeNFTMarkers) { 
							
						// 	if (i == ev.data.marker.id) {

						// 		this.checkVideoOpt(obj, true);// if the obj have video, call play()
						// 		this.checkAudioOpt(obj, true);// if the obj have audio, call play()
						// 		// obj.visible = true ; //// do it when recognize, no need in tracjing
						// 		// obj2D.visible = true ; //// do it when recognize, no need in tracjing
						// 	}else{
								
						// 		// this.threeNFTMarkers2D[i].visible = false; //// do it when recognize, no need in tracjing
						// 		this.checkAudioOpt(this.threeNFTMarkers[i], false);// if the obj have audio, call pause()
						// 	}
						// }

						// for ( let i in self.aframeNFTMarkers ){
						// 	if ( i == ev.data.marker.id ){
						// 		obj.object3D.visible = true;
						// 	} else {
						// 		obj.object3D.visible = false;
						// 	}
						// }


						obj.object3D.matrix.fromArray(ev.data.matrix);
						// obj.matrix.fromArray(ev.data.matrix); //// for both three.js(version: 0.77.1) and three(0.97.1)
						

					}else{	// losing
						// obj.visible = false;

						obj.object3D.visible = false;

						console.log( "three.js: losing: obj= ", obj , ev.data.marker.id ); 
						// this.checkVideoOpt(obj, false);// if the obj have video, call pause()
//[start-20190614-fei0066-add]//
						var isShowModel = this.checkColoring( ev.data.marker.id, obj, obj2D, 0 ); // for the coloring module

						if ( obj.showObjects == true  ){
						// if ( isShowModel == 1 || obj.showObjects == true  ){

							//// 紀錄「辨識圖狀態」, 0: lost, 1: recognize, 2: tracking.
							obj.targetState = 0;

							//// 假如有邏輯功能，必須停止。
							if ( arController.logicList[ arController.currentProjectIndex ]  ){
								//// 邏輯物件
								let logic = arController.logicList[ arController.currentProjectIndex ];
								logic.stopLogic();
								// logic.parseXML();
							}

							//// 調整「照著物件場景的相機」，x 方向偏移調整回來
							self.camera.projectionMatrix.elements[8] = 0;
							
							// self.camera.projectionMatrixInverse.getInverse( self.camera.projectionMatrix );
							if ( self.camera.projectionMatrixInverse.getInverse ){
								self.camera.projectionMatrixInverse.getInverse( self.camera.projectionMatrix );
							}else{
								let tempPM = self.camera.projectionMatrix.clone();
								self.camera.projectionMatrixInverse.copy( tempPM.invert() );
							}

							// self.camera.updateProjectionMatrix();


							let mid = ev.data.marker.id;
							let w = self.gcssTargets.width [ mid ];
							let dpi = self.gcssTargets.dpi[ mid ] ; 
							let dw = w*25.4/dpi/2;

							
							obj.object3D.visible = true;
						
							obj.object3D.matrixAutoUpdate = true;
							obj.object3D.position.set( -dw, 40, 250 );
							obj.object3D.rotation.x =  90 * Math.PI/180;
							// obj.rotation.z =  10 * Math.PI/180;
							obj.object3D.updateMatrix();
							obj.object3D.updateMatrixWorld();

							obj.object3D.traverse( function ( child ) {
								if (child.originTransform){
									let co = child.originTransform;

									child.position.copy( co.position );
									child.rotation.copy( co.rotation );
									child.scale.copy( co.scale );
									if (child.makarType == "image" || child.makarType == "video" ){
										
										let worldQ = child.getWorldQuaternion(new THREE.Quaternion());
										let worldE = new THREE.Euler();
										worldE.setFromQuaternion(worldQ);
										//// 沿著物件本身的座標軸旋轉，[z->y->x]順序不能更換
										//// 影片圖片本身的 z 軸（垂直銀幕）保持原本旋轉數值。
										// child.rotateOnAxis(new THREE.Vector3(0,0,1), 0       - worldE.z );
										child.rotateOnAxis(new THREE.Vector3(0,1,0), 0       - worldE.y );
										child.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI - worldE.x );
										//// 加上這兩行才會讓後續子物件也正確運作
										child.updateMatrixWorld();
										child.updateMatrix();
									}

									//// 只有場景物件帶有邏輯功能，才會有設立「重設參數」的功能。
									//// 文字物件，需要回復「文字內容」「文字顏色」「文字背景顏色」
									//// 光源物件：回復「亮度」「顏色」
									if ( child.makarType == 'text' || child.makarType == 'light' || child.makarType == 'video' || child.makarType == 'model' ){
										if ( child.resetProperty ){
											child.resetProperty();
										}
									}

								}
							});

							// console.log("three.js: lost and set obj transform done");


							obj.object3D.updateMatrix();
							obj.object3D.matrixAutoUpdate = false;
							
						}

//[end---20190614-fei0066-add]//
						// console.log( "lost.. obj=", obj, "\nmarker.found =", marker.found  );

					}
				}
//[end---20181102-fei0034-add]//
			});

			function getBoundingBox(obj){

				let tempObj = obj.clone();
				let box = new THREE.Box3();
				box.setFromObject(tempObj);

				// let ret = getLastRootObject(obj , 0 );
				// console.log("three.js: _getBoundingBox: ret = ", ret , obj, jsonCloneObj );

				let finalChild = null;
				tempObj.traverse( function(child){
					finalChild = child;
					// console.log("three.js: _getBoundingBox: child = ", child );
					if (!child.visible){
						child.parent.remove(child);
					}
				});

				box = new THREE.BoxHelper( tempObj, 0xffff00 ); 

				// console.log("three.js: _getBoundingBox: lost, box = ", box );
				return box;
			}

			function getLastRootObject(obj, level){
				// console.log("three.js: _getFinalChild: level = ", level );	
				let finalRootChild={};
				if (obj.children.length > 0){
					let getChildLevel = level;
					level++;
					for ( let i = 0; i< obj.children.length; i++ ){
						if (obj.children[i].makarObject){
							let ret = getLastRootObject(obj.children[i] , level );	
							// console.log("three.js: _getFinalChild: ret= ", ret , obj.children[i].makarType );	
							if ( ret[0] > getChildLevel){
								// console.log("three.js: _getFinalChild: ret= ", ret , level , getChildLevel  );	
								getChildLevel = ret[0];
								if (ret[1].makarObject){
									finalRootChild = ret[1];
								}else{
									finalRootChild = obj.children[i];
								}
							}
						}
					}
					// console.log("three.js: _getFinalChild: getChildLevel= ", getChildLevel , level , finalRootChild.makarType, finalRootChild.scale );	
					return [getChildLevel, finalRootChild];
				}

 			}

			/*
				Listen to getMultiMarker events to keep track of Three.js multimarkers.
			*/
			this.addEventListener('getMultiMarker', function(ev) {
				var obj = this.threeMultiMarkers[ev.data.multiMarkerId];
				if (obj) {
//[end---20181023-fei0032-mod]//
					obj.matrix.elements.set(ev.data.matrix);
					// obj.matrix.set(ev.data.matrix);
//[end---20181023-fei0032-mod]//
					obj.visible = true;
				}
			});

			/*
				Listen to getMultiMarkerSub events to keep track of Three.js multimarker submarkers.
			*/
			this.addEventListener('getMultiMarkerSub', function(ev) {
				var marker = ev.data.multiMarkerId;
				var subMarkerID = ev.data.markerIndex;
				var subMarker = ev.data.marker;
				var obj = this.threeMultiMarkers[marker];
				if (obj && obj.markers && obj.markers[subMarkerID]) {
					var sub = obj.markers[subMarkerID];
					sub.matrix.elements.set(ev.data.matrix);
					sub.visible = (subMarker.visible >= 0);
				}
			});
			/**
				Index of Three.js pattern markers, maps markerID -> THREE.Object3D.
			*/
			this.threePatternMarkers = {};
			/**
				Index of Three.js NFT markers, maps markerID -> THREE.Object3D.
			*/
			this.threeNFTMarkers = {};

			this.aframeNFTMarkers = {};

			/**
				Index of Three.js barcode markers, maps markerID -> THREE.Object3D.
			*/
			this.threeBarcodeMarkers = {};
			/**
				Index of Three.js multimarkers, maps markerID -> THREE.Object3D.
			*/
			this.threeMultiMarkers = {};
 
			this.threeNFTMarkers2D = {};

			this.threeNFTMarkersCSS = {};
			this.currentProjectIndex = null;       //// will set the current index of targets 
			this.objectControlState = null; //// 0: nothing, 1:mousedown/touchstart, 2: mousemove/touchmove, 3: mouseup/touchend.

			//// 為了 quiz 模組的容器s
			this.quizModule = [];

			//// 邏輯物件，每個「專案」要有各自的物件
			this.logicList = [];

			//// 手指操控物件：流程上「單指旋轉」得要「真正點擊到物件」才能觸發，「 雙指縮放/平移 」則是觸發「當前物件」或是「之前物件」。
			this.controlObject = null;
			this.currentControllObject = null;

			this.makarObjects = [];
			this.makarObjects2D = [];

			this.sceneTargetList = null;


			//// AR 目前專案設定比較麻煩，會在一次執行同時可以體驗多個「專案」
			//// 所以「紀錄資料」都必須「每個專案都設定」
			//// 紀錄「觸發事件」中帶有「群組」的事件
			this.groupDict = {
				0: {activeObj:null,objs:[]},
				1: {activeObj:null,objs:[]},
				2: {activeObj:null,objs:[]},
				3: {activeObj:null,objs:[]},
				4: {activeObj:null,objs:[]},
				5: {activeObj:null,objs:[]},
				6: {activeObj:null,objs:[]},
				7: {activeObj:null,objs:[]},
			};

			//// 每個「專案」都要有各自的「群組物件」，裡面帶有「1-7群組物件列表」
			this.groupEventTargetDict = {};


			//// 紀錄「注視事件」
			this.lookAtTargetDict = {};
			this.lookAtObjectList = [];
			this.lookAtTargetTimelineDict = {};



			
			this.gcssTargets = {};
			//// check for video
			this.checkVideoOpt = function( obj, opt ){
				
				////// get the first layer children to check the type(video) and play it.
				for (let i = 0; i < obj.children.length; i++ ){
					if (obj.children[i].makarObject == true ){
						if (obj.children[i].mp4Video){
							if (opt){
								// console.log("three.js: _checkVideoOpt: mp4Video play() ", obj );
								obj.children[i].mp4Video.play();
							}else{
								obj.children[i].mp4Video.pause();
							}

						}

					}
				}
				
			};
			//// check audio 
			this.checkAudioOpt = function( obj, opt ){
				
				for (var i in obj.children){
					if (!obj.children[i]) continue;
					if (obj.children[i]){
						if (obj.children[i].type){
							if (obj.children[i].type == "Audio"){
								// console.log("artoolkit.three.js: checkAudioOpt, obj=", obj.children[i]);
								if ( opt== true ){
									if (obj.children[i].isPlaying == false ){
										console.log("audio laod and play, ", obj.children[i] );
										// obj.children[i].stop();
										obj.children[i].offset = 0;
										obj.children[i].play();
									}
								}else if (opt== false){

									if (obj.children[i].isPlaying == true ){
										// console.log("audio pause, ", obj.children[i]);
										obj.children[i].pause();
									}
									
								}

							}
						}
					}
				}
			}

			// the html render will use this function to play the animation
 			this.checkAimation = function( obj , dt ){
				// if (obj.mixer){
				// 	obj.mixer.update(dt);
				// }
				//////
				////// Fei: I dont know is this a good way to control the _action[0].time. I detailly read the three.js(include AnimationMixer/AnimationAction/KeyframeTrack) and make sure the process of animation
				////// 1. obj.mixer._actions[0] will be created after clipAction(), will create [_interpolants, _propertyBindings] from tracks-[times, valuse]. So, after clipAction(), modify tracks will not work on the mixer. 
				////// 2. the AnimationAction.time is the local time of action, will control by mixer.update and loop. We modify actions[0].time will work around to seperate the slices.
				////// 

				if (obj.animationSlices ){
					if (obj.animationSlices[0].uid ){

						var index ;
						for(let i = 1; i < obj.animationSlices.length; i++ ){
							if(obj.animationSlices[0].uid  == obj.animationSlices[i].uid){
							 	index = i;
							}
						}

						if (obj.animationSlices[0].changed ){
							// console.log("three.js: changed , index=", index , obj.animationSlices[0].idle , obj.animationSlices[0].uid );
							obj.mixer._actions[0].time = obj.animationSlices[index].startTime;
							obj.animationSlices[0].changed = false;
							obj.animationSlices[0].count = 0;
						}

						if (!obj.animationSlices[0].reset && obj.animationSlices[0].count == 1 ){
							obj.mixer._actions[0].time = obj.animationSlices[index].endTime;
							return;
						}

						if (obj.mixer._actions[0].time < obj.animationSlices[index].startTime){
							obj.mixer._actions[0].time = obj.animationSlices[index].startTime;
						}

						if (obj.mixer._actions[0].time + 0.00 > obj.animationSlices[index].endTime ){

							if (obj.animationSlices[0].uid == obj.animationSlices[0].loop){
								obj.mixer._actions[0].time = obj.animationSlices[index].startTime;
							}else if (obj.animationSlices[0].reset){
								obj.animationSlices[0].uid = obj.animationSlices[0].idle;
								obj.animationSlices[0].loop = obj.animationSlices[0].idle;
								
								let index2;
								for(let j = 1; j < obj.animationSlices.length; j++ ){
									if(obj.animationSlices[0].uid == obj.animationSlices[j].uid){
										index2 = j;
										for (let k = 0; k < obj.mixer._actions.length; k++ ){
											obj.mixer._actions[k].stop();
										}
										let animationsIndex = obj.animations.findIndex(function(item){
											return item.name == obj.animationSlices[index2].animationName;
										});
										obj.mixer = new THREE.AnimationMixer( obj );
										var action = obj.mixer.clipAction( obj.animations[ animationsIndex ] );//// O is the idle, so must minus one
										action.play();
									}
								}
								obj.mixer._actions[0].time = obj.animationSlices[index2].startTime;
							}
							obj.animationSlices[0].count = 1;
							if (obj.mixer){
								obj.mixer.update(0.000001);
							}

						} else {
							if (obj.mixer){
								obj.mixer.update(dt);
							}
						}

						
					}
				}

			}

//[start-20190614-fei0066-add]//
			//// check if the coloring can be done or not, control the transparent plane and the colorButton
			this.checkColoring = function( targetIndex, obj, obj2D, allowColor){ // -1: not the coloring module, 0: coloring module and not loadModel, 1: coloring module and already loadModel
				
				let i = self.sceneTargetList[ targetIndex ].projIndex;

				if (window.sceneResult[i].module == "coloring" ){ //// check project
					if (obj.loadModel != true){ //// if the 3D model doesnt load, control the coloredPlane and colorButton, and return 0

						if (allowColor == 1){ //// check the target is colorable
							
							// console.log(' _checkColoring: 111' , obj.object3D.children );

							for (let j in obj.object3D.children ){ //// loop all children to find the "coloring" plane
								if (obj.object3D.children[j].name == "coloredPlane" ){
									obj.object3D.children[j].material.color.r = 0;
									obj.object3D.children[j].material.color.g = 1;
								}
							}

							// for (let j in obj.children ){ //// loop all children to find the "coloring" plane
							// 	if (obj.children[j].name == "coloredPlane" ){
							// 		obj.children[j].material.color.r = 0;
							// 		obj.children[j].material.color.g = 1;
							// 	}
							// }

							for (let k in obj2D.children ){
								if (obj2D.children[k].name == "colorButton"){
									obj2D.children[k].material.opacity = 1.0;
									obj2D.children[k].behav[0].enable = true;
								}
							}
						}else{

							// console.log(' _checkColoring: 222' , obj.object3D.children );

							// for (let j in obj.children ){ //// loop all children to find the "coloring" plane
							// 	if (obj.children[j].name == "coloredPlane" ){
							// 		obj.children[j].material.color.r = 1;
							// 		obj.children[j].material.color.g = 0;
							// 	}
							// }

							for (let j in obj.object3D.children ){ //// loop all children to find the "coloring" plane
								if (obj.object3D.children[j].name == "coloredPlane" ){
									obj.object3D.children[j].material.color.r = 1;
									obj.object3D.children[j].material.color.g = 0;
								}
							}


							for (let k in obj2D.children ){
								if (obj2D.children[k].name == "colorButton"){
									obj2D.children[k].material.opacity = 0.3;
									obj2D.children[k].behav[0].enable = false;
								}
							}
						}

						return 0;

					}else{ //// if the 3D model already load, return 1
												
						return 1;
					}
				}

				return -1;
			}
//[end---20190614-fei0066-add]//

//[start-20200515-fei0094-add]//


			this.dealImageUrl = function( scene_obj ){
				let textureUrl = "";

				//// 先檢查是否在「用戶素材庫」或是「線上素材庫」裡面，邏輯上是必要的
				if ( userProjResDict[ scene_obj.res_id ]  ){
					console.log("three.js: _dealImageUrl: image from user resource");
					if ( scene_obj.res_url != userProjResDict[scene_obj.res_id].res_url ){
						console.log("three.js: _dealImageUrl: image from user resource, but difference ", scene_obj.res_url, userProjResDict[scene_obj.res_id].res_url );
					}
					scene_obj.res_url = userProjResDict[scene_obj.res_id].res_url ;
					//// 再檢查是否為「預設素材」，是的話必須替換
					textureUrl = self.getDefaultImageUrl( scene_obj.res_url );
					scene_obj.res_url = textureUrl;

				} else if ( userOnlineResDict[ scene_obj.res_id ] ) { 
					console.log("three.js: _dealImageUrl: image from online resource" , userOnlineResDict[scene_obj.res_id].res_url );
					if ( scene_obj.res_url != userOnlineResDict[scene_obj.res_id].res_url ){
						console.log("three.js: _dealImageUrl: image from online resource, but difference ", scene_obj.res_url, userOnlineResDict[scene_obj.res_id].res_url );
					}
					scene_obj.res_url = userOnlineResDict[scene_obj.res_id].res_url ;
					//// 再檢查是否為「預設素材」，是的話必須替換
					textureUrl = self.getDefaultImageUrl( scene_obj.res_url );
					scene_obj.res_url = textureUrl;

				} else {
					//// 並不在「用戶素材庫」或是「線上素材庫」裡面，
					console.log("three.js: _dealImageUrl: image not in user/online resource" , scene_obj );

					textureUrl = self.getDefaultImageUrl( scene_obj.res_url );
					scene_obj.res_url = textureUrl;

				}

				return textureUrl;
			}




			this.getDefaultImageUrl = function( imageStr ){
				let textureUrl = "";

				if ( imageStr.indexOf("https") > -1 ){

					console.log("three.js: _getDefaultImageUrl: contain [https] direct return, imageStr=", imageStr );
					return imageStr;
				}

				switch( imageStr ) {
					case "DefaultResource/Image/MakAR_Call.png":
						console.log("three.js: _getDefaultImageUrl: image: MakAR_Call");
						textureUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
						break;
					case "DefaultResource/Image/MakAR_Room.png": 
						console.log("three.js: _getDefaultImageUrl: image: MakAR_Room");
						textureUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
						break;
					case "DefaultResource/Image/MakAR_Mail.png": 
						console.log("three.js: _getDefaultImageUrl: image: MakAR_Mail");
						textureUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
						break;
					case "DefaultResource/Image/Line_icon.png":
						console.log("three.js: _getDefaultImageUrl: image: Line_icon");
						textureUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
						break;
					case "DefaultResource/Image/FB_icon.png":
						console.log("three.js: _getDefaultImageUrl: image: FB_icon");
						textureUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
						break;
					case "DefaultResource/ProjectModule/ScratchCardBackground.png":
						console.log("three.js: _getDefaultImageUrl: image: ScratchCardBackground");
						textureUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/ScratchCardBackground.png";
						break;

					default:
						textureUrl = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/icon/qm256.png';
						console.log("three.js: _getDefaultImageUrl: unknown, obj=", imageStr );
				}

				return textureUrl;
			}


			//// 檢查「場景json」中 物件 URL 是否等於 「用戶素材列表」「線上素材列表」

			this.getUserRes_onlineRes = function( scene_obj ){

				////// check by user resource 
				if ( userProjResDict[ scene_obj.res_id ]  ){
					console.log("three.js: _getUserRes_onlineRes: model from user resource");
					scene_obj.res_url = userProjResDict[scene_obj.res_id].res_url ;
				} else if ( userOnlineResDict[ scene_obj.res_id ] ) { 
					console.log("three.js: _getUserRes_onlineRes: model from online resource" , userOnlineResDict[scene_obj.res_id].res_url );
					scene_obj.res_url = userOnlineResDict[scene_obj.res_id].res_url ;
				} else {
					
					switch(scene_obj.res_id){
						case "Cube":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Cube.glb";
							break;
						case "Capsule":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Capsule.glb";
							break;
						case "Sphere":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Sphere.glb";
							break;
						case "ch_Bojue":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Bojue.glb";
							break;
						case "ch_Fei":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Fei.glb";
							break;
						case "ch_Lina":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Lina.glb";
							break;
						case "ch_Poyuan":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Poyuan.glb";
							break;
						case "ch_Roger":
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Roger.glb";
							break;
						default:
							
							scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
							console.log("three.js: _loadSceneObjects: model not exist show missing model ");
							break;
					}
				
				}

				return scene_obj.res_url ;
			}



			this.countObject2D = function(sceneObjects){
				let num2D = 0;
				for (let i = 0; i < sceneObjects.length; i++ ){
					let sceneObject = sceneObjects[i];
					if (sceneObject.obj_type == "2d" ){
						if (sceneObject.main_type == "image"){
							num2D++;
						}
						if (sceneObject.main_type == "module" && sceneObject.sub_type == "scratch_card" ){
							num2D++;
						}
					}
					// if (sceneObject.obj_type == "3d" ){

					// }
				}

				return num2D ;
			
			}

			this.getMakarObjectByObjID = function( makarObjects2D , obj_id ){
				for(let i in makarObjects2D){
					if (makarObjects2D[i].obj_id == obj_id  ){
						return makarObjects2D[i];
					}
				}
				//// 基本上不應該發生
				console.error("three.js: _getMakarObjectByObjID: get null object ", obj_id, makarObjects2D  );
				return null;
			}

//[end---20200515-fei0094-add]//

			
			//// 大改版，改為 aframe 架構
			this.loadAssets = function(index){
				let assets = document.createElement("a-assets");
				assets.setAttribute('id', "makarAssets" );
				assets.setAttribute('timeout', "1000" );
				self.arfScene.appendChild(assets);
				// self.makarObjects.push( assets );
			};


			//// 從「專案順序 」取得「專案版本」
			this.getProjectVersion = function( projIndex ){
				
				let editor_version = [];
				let i = projIndex;

				if (typeof(window.sceneResult[i].data.editor_ver) != "string" ){
					console.log("three.js: _loadMakarScene: the editor_ver is not string, error and return ");
					return -1;
				}else{
					editor_version = window.sceneResult[i].data.editor_ver.split(".");
				}

				return editor_version;
			}

			this.getResolutionIndex = function( projIndex ){
				let self = this;

				let projectIdx =  projIndex ;

				let selectedResolutionIndex = 0;

				let userWidth = self.arScene.clientWidth;
				let userHeight = self.arScene.clientHeight;

				if ( sceneResult[ projectIdx ] && sceneResult[ projectIdx ].data.scene_objs_v2 && sceneResult[ projectIdx ].data.scene_objs_v2.screen &&
					Array.isArray( sceneResult[ projectIdx ].data.scene_objs_v2.screen.orientationData )
				){
					let screenList = sceneResult[ projectIdx ].data.scene_objs_v2.screen.orientationData;
					
					let minScore = 10000;
					screenList.forEach( ( e , i )=>{
						
						//// 比例差距，比例相同為 1 、比例差距極端值為 0 or 無限大 
						let resolutionDiff = ( e.width/e.height ) / ( userWidth/userHeight );

						//// 寬高差距 比值，比例相同為 1 、比例差距極端值為 0 or 無限大
						let widthDIff = e.width / userWidth;
						let heightDIff = e.height / userHeight;

						let nrd = resolutionDiff>1? resolutionDiff: 1/resolutionDiff;
						let nwd = widthDIff>1? widthDIff: 1/widthDIff;
						let nhd = heightDIff>1? heightDIff: 1/heightDIff;

						e.nrdScore = nrd * ( nwd + nhd );

						if ( e.nrdScore < minScore ){
							minScore = e.nrdScore 
							selectedResolutionIndex = i
						}

					});

					let selectResolution = screenList[ selectedResolutionIndex ];
					//// 紀錄「當前使用的 寬高比例 index 」	

					tempR = String ( selectResolution.width ) + ',' + String ( selectResolution.height );
					console.log(' _getResolutionIndex: ' , minScore , selectedResolutionIndex , selectResolution , tempR );

				}else{

					console.log(' _getResolutionIndex: error' , projectIdx , sceneResult );
				}

				return selectedResolutionIndex;

			}

			this.get2DScaleRatioByProjIndex = function( projIndex ){

				let self = this;

				let projectIdx =  projIndex ;

				let editor_version = self.getProjectVersion( projectIdx );

				let scaleRatioXY;

				//// 編輯器基本上針對 AR 專案可以讓使用者選擇「2D界面比例」，由於「使用者裝置比例」無法確認，所以變成載入物件時候需要針對專案來設定物件大小位置
				//// 3:4 =「1440, 1920」
				//// 9:16 =「720, 1280」 
				//// 9:18 =「1080, 2160」
				//// 4:3 = 「1920, 1440」
				//// 16:9 =「1280, 720」 
				//// 18:9 = 「2160, 1080」

				let resolutionString = '';

				////
				//// 2022 1123以後， 3.3.8 上線，修改資料，這邊需要作「向下相容」
				//// 3.3.8 之後需要從「2D界面列表中判斷最適合的」
				///
				if ( Array.isArray ( editor_version )  && editor_version.length == 3 ){
					let largeV  = Number( editor_version[0] );
					let middleV = Number( editor_version[1] );
					let smallV  = Number( editor_version[2] );	
					//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
					if ( largeV > 3 || 
					   ( largeV == 3 && middleV > 3 ) ||
					   ( largeV == 3 && middleV == 3 && smallV > 8 )
					){
						resolutionString = getResolution338();
					}else{
						resolutionString = getResolution330();
					}
				}else{
					resolutionString = getResolution338();
				}

				function getResolution338(){

					let tempR = '';

					//// 當前用戶畫面大小， PC: w*600 mobile: w*300(?)
					let userWidth = self.arScene.clientWidth;
					let userHeight = self.arScene.clientHeight;

					if ( sceneResult[ projectIdx ] && sceneResult[ projectIdx ].data.scene_objs_v2 && sceneResult[ projectIdx ].data.scene_objs_v2.screen &&
						Array.isArray( sceneResult[ projectIdx ].data.scene_objs_v2.screen.orientationData )
					){
						let screenList = sceneResult[ projectIdx ].data.scene_objs_v2.screen.orientationData;
						
						let minScore = 1000;
						let selectedResolutionIndex = 0;
						screenList.forEach( ( e , i )=>{
							
							//// 比例差距，比例相同為 1 、比例差距極端值為 0 or 無限大 
							let resolutionDiff = ( e.width/e.height ) / ( userWidth/userHeight );

							//// 寬高差距 比值，比例相同為 1 、比例差距極端值為 0 or 無限大
							let widthDIff = e.width / userWidth;
							let heightDIff = e.height / userHeight;

							let nrd = resolutionDiff>1? resolutionDiff: 1/resolutionDiff;
							let nwd = widthDIff>1? widthDIff: 1/widthDIff;
							let nhd = heightDIff>1? heightDIff: 1/heightDIff;

							e.nrdScore = nrd * ( nwd + nhd );

							if ( e.nrdScore < minScore ){
								minScore = e.nrdScore 
								selectedResolutionIndex = i
							}

						});

						let selectResolution = screenList[ selectedResolutionIndex ];
						//// 紀錄「當前使用的 寬高比例 index 」	
						self.selectedResolutionIndex = selectedResolutionIndex

						tempR = String ( selectResolution.width ) + ',' + String ( selectResolution.height );
						console.log(' _getResolution338: ' , minScore , selectedResolutionIndex , selectResolution , tempR );

					}
					
					return tempR;

				}

				function getResolution330(){
					//// 判斷是否存在「專案大小比例」
					let tempR = '';
					if ( sceneResult[ projectIdx ] ){
						if ( sceneResult[ projectIdx ].data.scene_objs_v2 ){
							if ( sceneResult[ projectIdx ].data.scene_objs_v2.resolution ){
								tempR = sceneResult[ projectIdx ].data.scene_objs_v2.resolution;
							}
						}
					}
					return tempR;
				}



				if ( resolutionString == ''){
					console.log(' _get2DScaleRatio: fucking lose resolutionString '); 
					resolutionString = "720,1280";
				}

				let cameraWidth, cameraHeight;

				//// 假如有找到「專案大小比例」，調整
				if ( resolutionString != '' ){
					let resArr = resolutionString.split(',');

					//// 專案設定理想大小
					let idealWidth = Number( resArr[0] );
					let idealHeight = Number( resArr[1] );
					
					//// 使用者當下裝置大小
					let userWidth = self.arfScene.clientWidth;
					let userHeight = self.arfScene.clientHeight;

					//// 使用者當前 camera 2D 的比例
					cameraWidth = Math.abs( self.camera2D.right - self.camera2D.left );
					cameraHeight = Math.abs( self.camera2D.bottom - self.camera2D.top );

					//// 2D 相機預設寬度比例 跟 使用者裝置比例比較。
					//// 2D 相機基本上電腦為寬比例( 640x480 ) 手機上通常為高比例(480,640)
					if ( cameraWidth/cameraHeight >= userWidth/userHeight ){

						//// 使用者裝置 與 理想界面 比例比較
						if ( userWidth/userHeight >= idealWidth/idealHeight ){
							let rw = userHeight * (idealWidth/idealHeight );
							let rh = userHeight;
							let d1 = ( userWidth / ( userHeight * ( cameraWidth / cameraHeight ) ) );
							let d2 = ( rw / userWidth );
							let d3 = ( rw / idealWidth );

							scaleRatioXY = d3;
							console.log(' _get2DScaleRatio: 1 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
						}else{
							let rw = userWidth;
							let rh = userWidth * ( idealHeight / idealWidth );

							let d1 = ( userWidth / ( userHeight * ( cameraWidth / cameraHeight ) ) );
							let d2 = ( rh / userHeight ) 
							let d3 = ( rw / idealWidth );

							scaleRatioXY = d3;
							console.log(' _get2DScaleRatio: 2 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
						}

					}else{
						//// 假如相機比裝置寬，計算出對應轉化比例

						if ( userWidth/userHeight >= idealWidth/idealHeight ){
							let rw = userHeight * ( idealWidth / idealHeight );
							let rh = userHeight ;
							let d1 = ( userHeight / ( userWidth * ( cameraHeight / cameraWidth ) ) );
							let d2 = ( rw / userWidth );
							let d3 = ( rw / idealWidth );

							scaleRatioXY =   d3;
							console.log(' _get2DScaleRatio: 3 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
							
						} else {
							let rw = userWidth ;
							let rh = userWidth * ( idealHeight / idealWidth );
							let d1 =  ( userHeight / ( userWidth * ( cameraHeight / cameraWidth ) ) )
							let d2 = ( rh / userHeight ) 
							let d3 = ( rw / idealWidth );

							scaleRatioXY =  d3;
							console.log(' _get2DScaleRatio: 4 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
						}

					}

				} else {
					console.log(' fucking lose resolutionString '); 
				}
				
				// console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY , ', cwh' , cameraWidth , cameraHeight );
				console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY );

				return scaleRatioXY;


			}










			//// 依照不版本，場景物件取得不同

			this.editorVersionControllObjs = function (  projIndex ){
				
				let i = projIndex;

				let scene_objs = window.sceneResult[i].data.scene_objs_v2; 

				var editor_version ;
				if (typeof(window.sceneResult[i].data.editor_ver) != "string" ){
					console.log("three.js: _loadMakarScene: the editor_ver is not string, error and return ");
					return -1;
				}else{
					editor_version = window.sceneResult[i].data.editor_ver.split(".");
				}

				if ( window.sceneResult[i].data.editor_ver == "" ){
					////// the empty editor_ver , do version below 3.0.6 
					if ( !Array.isArray(window.sceneResult[i].data.scene_objs_v2) ){
						console.log("three.js: _loadMakarScene the scene_objs_v2 is not Array, error", window.sceneResult[i] );
						return -1;
					}
					console.log("three.js: _loadMakarScene: the editor version empty. scene=", window.sceneResult[i]  );
					scene_objs = window.sceneResult[i].data.scene_objs_v2;
				}else if ( editor_version[0] == 3 && editor_version[1] == 0 && editor_version[2] <= 6  ){
					////// the version below 3.0.6, before about 2020 03 
					if ( !Array.isArray(window.sceneResult[i].data.scene_objs_v2) ){
						console.log("three.js: _loadMakarScene the scene_objs_v2 is not Array, error", window.sceneResult[i] );
						return -1;
					}
					console.log("three.js: _loadMakarScene: the editor version before 3.0.9, version=", window.sceneResult[i] );
					scene_objs = window.sceneResult[i].data.scene_objs_v2;
				} else if ( editor_version[0] >= 3 &&  ( (editor_version[1] == 0 && editor_version[2] >= 7) || editor_version[1] >= 1 )  ){
					////// the version after 3.0.6, after about 2020 04 
					console.log("three.js: _loadMakarScene: the editor version after 3.0.7, version=", window.sceneResult[i] );
					scene_objs = window.sceneResult[i].data.scene_objs_v2.objs;
				}else{
					////// unknown version 
					if ( !Array.isArray(window.sceneResult[i].data.scene_objs_v2) ){
						console.log("three.js: _loadMakarScene the scene_objs_v2 is not Array, error", window.sceneResult[i] );
						return -1;
					}
					console.log("three.js: _loadMakarScene: the editor version unknown, use the 3.0.6 structure , please contact MIFLY for more information, sceneResult=", sceneResult );
					scene_objs = window.sceneResult[i].data.scene_objs_v2;
				}

				return scene_objs;

			}



//[start-20190102-fei0044-add]//
			//// load MakarScene
			this.loadMakarScene = function(  targetIndex , markerRoot, markerRoot2D, markerRootCSS ){
				// let i = targetIndex;
				//// 2020-07-31 因為加入集點卡模組，所以專案跟辨識圖不是一對一關係 
				let i = self.sceneTargetList[ targetIndex ].projIndex;
				console.log("makar.three.js: _loadMakarScene, window.sceneResult[", i , "] = ", window.sceneResult[i]);

				//// 紀錄所有「3D物件載入 Promise」，2D物件暫時不考慮引入
				let pObjAll = [];

				////紀錄遊玩時間
				self.projStartTimeList.push({
					projIndex: i ,
					time: new Date().getTime()
				}) ;

				//// 從「 場景資料 」來查看是否有「 behav / behav_rederence 」設置錯誤，有的話把 behav_rederence 修改
				self.checkARSceneResultBehav( i );

				//// 每次載入專案，檢查各個 專案 是否有建立過 「群組事件列表」跟「注視事件列比」
				
				if ( !self.groupEventTargetDict[ i ] ){
					self.groupEventTargetDict[ i ] = JSON.parse( JSON.stringify( self.groupDict ) );
				}else{
					console.log('_loadMakarScene: _groupEventTargetDict: already exist ' , i );
				}

				if ( !self.lookAtTargetDict[ i ] ){
					self.lookAtTargetDict[ i ] = [];
				}else{
					console.log('_loadMakarScene: _groupEventTargetDict: already exist ' , i );
				}

				if ( !self.lookAtTargetTimelineDict[ i ] ){
					self.lookAtTargetTimelineDict[ i ] = [];
				}else{
					console.log('_loadMakarScene: _groupEventTargetDict: already exist ' , i );
				}

				


				//// collapse some interface items
				// bottomProjs.className =  'collapsed' ;
				// projsInfo.className =  'collapsed' ;
				// bottomArrow.className =  'collapsed' ;
				// snapShotCamera.className = 'collapsed';

				let scene_objs = window.sceneResult[i].data.scene_objs_v2; 

				scene_objs = self.editorVersionControllObjs( i );
				if ( ! Array.isArray( scene_objs ) ){
					return [];
				}

				let Object2DNum = self.countObject2D(scene_objs);

				////// check the modules first, now only coloring and scratchCard. 

				if ( Array.isArray(window.sceneResult[i].data.module_type) ){
					
					let sceneModule;

					if (window.sceneResult[i].data.module_type.length == 0){
						console.log("three.js: _loadMakarScene: module_type is empty");
					} else if (window.sceneResult[i].data.module_type.length == 1 ){
						sceneModule = window.sceneResult[i].data.module_type[0];
						console.log("three.js: _loadMakarScene: only one module, ", sceneModule );
					} else{
						//// currently not support mutiple modules, only gps can with other
						let countModules = 0;
						let moduleName;
						for (let k=0; k < window.sceneResult[i].data.module_type.length; k++ ){
							moduleName = window.sceneResult[i].data.module_type[k];
							if ( moduleName == "gps" ){
								continue;
							} else if (moduleName == "coloring" || moduleName == "scratch_card" || moduleName == "point_card") {
								console.log("three.js: _loadMakarScene: detect module=", moduleName );
								countModules++;
								sceneModule = moduleName;
							}else{
								console.log("three.js: _loadMakarScene: unknown modules, ", moduleName );
							}
						}
						
						console.log("three.js: _loadMakarScene: currently not support mutiple modules, ", window.sceneResult[i].data.module_type );
					}

					if (sceneModule){
						switch( sceneModule ){
							case "coloring":
	
								markerRoot.loadModule = "coloring"; //// useless now. 
								if ( markerRoot.loadModel != true ){ //// first time, load the transparent plane.
									// console.log("three.js:_loadMakarScene: coloring module, first time, load plane and button, markerRoot=", markerRoot);
									markerRoot.showObjects = false; // dont need to show the transparent plane when lost
	
									//// 紀錄「著色狀態」為「使用者填入」  // -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
									markerRoot.coloringStatus = -1; 

									var dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
									var GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
									var GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 
	
									//// add the 3D transparent plane.
									var plane = new THREE.Mesh( new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial(
										{ transparent: true, opacity: 0.25, color: new THREE.Color("rgb(255,0,0)") } //   
										)
									);
	
									plane.position.set(GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 );// set object center to target center
									//// reset the rotation.
									// plane.rotation.x = Math.PI/2; //set image vertical to target first, bacause we need to set the same direction of editor...
									plane.updateMatrix(); //make the matrix will be set..
									//////
									////// the scale is different between Editor V2 and V3.. WTF
									//////
									let setScale;					
									setScale = new THREE.Vector3(GCSSWidth*25.4/dpi/2, GCSSHeight*25.4/dpi/2, 0.1 );
	
									plane.scale.copy( setScale.multiplyScalar( 2 ) );
									
									// self.setTransform(plane, dpi,
									// 	new THREE.Vector3(0, 0, 0) ,
									// 	new THREE.Vector3(0, 0, 0) , 
									// 	setScale
									// );
	
									plane.name = "coloredPlane";
									// markerRoot.add(plane);
									markerRoot.object3D.add(plane);

									//// add the 2D buttom for coloring
									self.loadDeaultTexture2D( markerRoot2D, "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/coloring2.png", // '../models/fbx/spider/Spider.fbx' , '../models/fbx/boy1.fbx'
										new THREE.Vector3(0, 50, 0) , // position
										new THREE.Vector3(0, 0, 0) ,  // rotation
										new THREE.Vector3(0.3, 0.3, 0.3) ,  // scale
										[0.5, 0], //rect from -1 to 1 means down-top and left-right
										{ simple_behav:"coloring"} //// behavior
									);
									// markerRoot.loadedObjects = true;
									// markerRoot2D.loadedObjects = true;
	
									// console.log("three.js:_loadMakarScene: coloring module!, markerRoot=", markerRoot);
								} else { //// load the model and replace the texture
									// console.log("three.js:_loadMakarScene: coloring module, already catch target, load model ");
									// markerRoot.remove( markerRoot.children[0] ); // remove the transparent plane
									markerRoot.object3D.remove( markerRoot.object3D.children[0] );
									markerRoot2D.remove( markerRoot2D.children[0] ); // remove the button
									markerRoot.showObjects = true;
									for (let j in scene_objs){

										let position = new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) );
										let rotation = new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) );
										let scale    = new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) );

										switch (scene_objs[j].main_type ){
											case "model":
												console.log("three.js: Module: color model 3d, res =", scene_objs[j] );
												

												self.loadAframeGLTFModelWithTexture( markerRoot , 
													scene_objs[j], self.targetCanvas, position, rotation, scale, self.cubeTex );

												console.log("three.js: _loadMakarScene: coloring module, load GLTF Model done ");
												break;

											case "video":
						
												if (scene_objs[j].sub_type == "mp4"){
													if ( scene_objs[j].res_url && scene_objs[j].transform  ){
														console.log("three.js: video mp4 3d, obj with url and transform: ", scene_objs[j]  );
														
														self.loadAframeVideo( markerRoot , scene_objs[j], position, rotation, scale );

													}else{
														console.log("three.js: video mp4 3d, obj without url and transform(fail): ", scene_objs[j]  );
													}
												}
												break;

											case "text":
												console.log("three.js: _loadText: text: ", j , scene_objs[j] );
				
												if (scene_objs[j].obj_type == "3d"){
													self.loadAframeText( markerRoot , scene_obj , position, rotation, scale  );
												}else if ( scene_objs[j].obj_type == "2d" ){
													
													self.loadAframeText2D( markerRoot2D, scene_objs[j], j, scene_objs.length, position, rotation, scale );
												}

												break;

											case "audio":
												if (scene_objs[j].sub_type == "mp3" || scene_objs[j].sub_type == "wav" ||  scene_objs[j].sub_type == "ogg" ){
													if ( scene_objs[j].res_url && scene_objs[j].transform  ){

														self.loadAframeAudio( markerRoot, scene_objs[j], position, rotation, scale  );

													}else{
														console.log("three.js: audio mp4 3d, obj without url and transform(fail): ", scene_objs[j]  );
													}
												}
												break;	
											
											case "image":
												let textureUrl = scene_objs[j].res_url;
												textureUrl = self.dealImageUrl( scene_objs[j] );
												
												if (scene_objs[j].obj_type == "3d"){

													if ( textureUrl && scene_objs[j].transform  ){
														// console.log("three.js: image 3d, obj with url and transform(success): ", scene_objs[j]  );

														self.loadAframeTexture (markerRoot, textureUrl,
															scene_objs[j], position, rotation, scale
														); 

													}else{
														console.log("three.js: image 3d, obj without url and transform(fail): ", scene_objs[j]  );
													}
												}
				
												if (scene_objs[j].obj_type == "2d"){
													if ( textureUrl && scene_objs[j].transform  ){
														console.log("three.js: image 2d, obj with url and transform(success): ", scene_objs[j]  );
												
														self.loadAframeTexture2D( markerRoot2D, scene_objs[j], textureUrl , j, scene_objs.length, position, rotation, scale );

													}else{
														console.log("three.js: image 2d, obj without url and transform(fail): ", scene_objs[j]  );
													}
												}
												break;

											case "light":
												
												self.loadAframeLight(markerRoot , scene_objs[j], position, rotation, scale);

												break;	
											

										}
									}
									console.log("three.js: _loadMakarScene: coloring module, already catch target, markerRoot = ", markerRoot.children );
								}
								console.log("three.js: _loadMakarScene: coloring module, return ");
								return pObjAll ;
	
							case "scratch_card":
	
								console.log("three.js:_loadMakarScene: scratch_card module ", scene_objs , publishARProjs.proj_list[i] , window.sceneResult[i]  );
								
								if (!parent.mdb){
									return [];
								};

								if (parent.userlogin){
									////假如使用者有登入[makar or third party ] 現在還沒有這個部份，預先設置。
								}else{
									//// 使用本地的 indexedDB 

									for (let j in scene_objs ){

										let position = new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) );
										let rotation = new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) );
										let scale    = new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) );

										if (scene_objs[j].res_id == "scratch_card" && scene_objs[j].sub_type == "scratch_card" ){
											if ( Array.isArray(scene_objs[j].project_module) ){
												if (scene_objs[j].project_module.length == 1 ){

													let device_id;
													device_id = new Date().getTime() + "_" + makeid(10) ;
													localStorage.setItem( "device_id",  device_id );
													
													let scProjInfo = {
														"user_id": publishARProjs.proj_list[i].user_id ,
														"playing_user":"",
														"proj_id": publishARProjs.proj_list[i].proj_id,
														"proj_type":"ar",
														"card_id": scene_objs[j].project_module[0].card_id ,
														"device_id": device_id,
														"brand": Browser.name + Browser.version,
														"os": Browser.platform ,
														"location_long":0.0,
														"location_lan":0.0
													}


													// parent.mdb.initProject( publishARProjs.proj_list[i] ).then(function(ret){
													parent.mdb.initProject( scProjInfo ).then(function(ret){

														var setAwardImage  = function(rootObject){
															parent.mdb.getScratchProject( publishARProjs.proj_list[i].proj_id ).then( projRet=>{
																let getAwardIndex;
																switch (projRet.scratchCardState){//// [ 0:init , 1:getAward , 2:scratched , 3:exchanged ]
																	case 0:
																		getAwardIndex = aScratchCard.randomChooseAward( scene_objs[j] );
																		projRet.getAwardIndex = getAwardIndex;
																		projRet.scratchCardState = 1;
																		projRet.scratch_image_url = scene_objs[j].project_module[0].scratch_image_url;
																		var resUrl = self.getDefaultImageUrl(scene_objs[j].project_module[0].award_list[getAwardIndex].image_url);
																		projRet.awards_image_url  = resUrl; 

																		parent.mdb.setScratchProject( projRet );// put, must update

																		scProjInfo.issuance_card = true;
																		scProjInfo.award_list = scene_objs[j].project_module[0].award_list;

																		console.log("three.js: scratch card init : upload to server" , scProjInfo );
																		scratchCardLog( window.serverUrl , scProjInfo );
																		break;
																	case 1:
																		console.log("three.js: _loadMakarScene: scratch_card state[1], set award", projRet.getAwardIndex, rootObject );
																		getAwardIndex = projRet.getAwardIndex;
																		break;
																	case 2:
																		console.log("three.js: _loadMakarScene: scratch_card state[2], clear scratch canvas", projRet.getAwardIndex, rootObject );
																		getAwardIndex = projRet.getAwardIndex;
																		aScratchCard.clearScratchCanvas( rootObject );
																		//// 這邊不需要上傳到 server 
																		break;
																	case 3:
																		console.log("three.js: _loadMakarScene: scratch_card state[3], already exchange", projRet.getAwardIndex, rootObject );
																		getAwardIndex = projRet.getAwardIndex;
																		rootObject.exchanged = 1;
																		aScratchCard.clearScratchCanvas( rootObject );
																		break;
																	default:
																		console.log("three.js: _loadMakarScene: scratch_card state unknow, projRet=", projRet );	
																		break;	
																}
																let awardUrl = scene_objs[j].project_module[0].award_list[getAwardIndex].image_url;
																var resUrl = self.getDefaultImageUrl(awardUrl);
																if ( resUrl.indexOf("https") >= 0 ) {

																	
																	scene_objs[j].sub_type = 'jpg';

																	self.loadAframeTexture2D( markerRoot2D, scene_objs[j], resUrl, j, scene_objs.length, position, rotation, scale );

																}else{
																	console.error( 'three.js: _loadMakarScene: scratch_card error, sceneObject.project_module[0].award_list not include [https]' , scene_objs[j].project_module[0].award_list );
																}

															});

														}
														// setAwardImage();
														//// 載入待被刮的影像
														self.loadCanvas2D( markerRoot2D, 
															scene_objs[j],
															new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) ) ,
															new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) ), 
															new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) ), 
															setAwardImage,
														);

													});														
												}
											}
										}
									}

									markerRoot2D.loadModule = "scratchCard";
									// markerRoot.loadedObjects = true;
									// markerRoot2D.loadedObjects = true;



								}


								break;
	
							case "point_card":
								console.log("three.js: _loadMakarScene: module point_card processing " , window.sceneResult[i].data.module_type[0] , scene_objs, markerRoot2D);
								////// 假如沒有 mdb 則流程不能玩 
								if (!parent.mdb){
									return [];
								};
								markerRoot2D.module = "PointCard"; 
								markerRoot2D.loadModule = "pointCard";

								// snapShotCamera.style.display = "none";
								//// 確認集點卡模組
								for (let j in scene_objs ){
									if (scene_objs[j].main_type == "module" && scene_objs[j].sub_type == "point_card" ){
										// markerRoot2D.points = scene_objs[j].project_module[0].points;
										markerRoot2D.project_module = scene_objs[j].project_module[0];
										markerRoot2D.proj_id = publishARProjs.proj_list[i].proj_id;


										let position = new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) );
										let rotation = new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) );
										let scale    = new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) );

										////// 載入集點卡背景圖
										let pointCardBGUrl;
										if (scene_objs[j].project_module[0].bg_image_url == "" ){
											pointCardBGUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/PointCard_Background.png";
										}else{
											pointCardBGUrl = scene_objs[j].project_module[0].bg_image_url ;
										};
										

										scene_objs[j].sub_type = 'jpg';
										self.loadAframeTexture2D( markerRoot2D, scene_objs[j], pointCardBGUrl, j, scene_objs.length, position, rotation, scale );

										//// 檢查集點狀況
										if (parent.userlogin && false){
											////假如使用者有登入[makar or third party ] 現在還沒有這個部份，預先設置。
										}else{

											////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
											let device_id; 
											device_id = new Date().getTime() + "_" + makeid(10) ;
											localStorage.setItem( "device_id",  device_id );
											
											let cardProj = publishARProjs.proj_list[i];
											
											aPointCard.createPointCardContent(markerRoot2D);
											aPointCard.getPointCardProject(publishARProjs.proj_list[i].proj_id, getProjRet=>{
												console.log("three.js: load pointCard, first get, getProjRet = ", getProjRet );
												let getPointTarget =  scene_objs[j].project_module[0].points.find(function(item){
													return item.target_id == self.sceneTargetList[ targetIndex ].target_id ;
												});
												////// 假如專案沒有紀錄過，將此次的集點卡資訊放入
												if ( !getProjRet.proj_id  ){
													console.log(" ******** there are no project: getPointTarget ", getPointTarget , getProjRet );

													let projInfo = {
														user_id: cardProj.user_id,
														proj_id: cardProj.proj_id,
														device_id: device_id,
														card_id: scene_objs[j].project_module[0].card_id,
														is_exchanged: false,
														can_reward_point_count: scene_objs[j].project_module[0].can_reward_point_count,
														collected_points: [
															getPointTarget.target_id
														],
														type:"point_card"
													}
													
													aPointCard.setPointCardProject(projInfo , setProjRet => {
														console.log(" 1 ------------ setProjRet = ", setProjRet );

														for (let m = 0; m < markerRoot2D.project_module.points.length ; m++ ){
															let pointObj = markerRoot2D.project_module.points[m];

															let position = new THREE.Vector3().fromArray(pointObj.transform[0].split(",").map(function(x){return Number(x)}) ) ;
															let rotation = new THREE.Vector3().fromArray(pointObj.transform[1].split(",").map(function(x){return Number(x)}) ) ;
															let scale = new THREE.Vector3().fromArray(pointObj.transform[2].split(",").map(function(x){return Number(x)}) ) ;

															if ( getPointTarget.target_id == markerRoot2D.project_module.points[m].target_id ){
																if (markerRoot2D.project_module.points[m].collected_point_url == "" ){
																	point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
																}else{
																	point_after_url = markerRoot2D.project_module.points[m].collected_point_url;
																}
																
																

																pointObj.sub_type = 'jpg';
																let pT2D = self.loadAframeTexture2D( markerRoot2D, pointObj, point_after_url, j+1, scene_objs.length, position, rotation, scale );
																pT2D.then( function( t2d ){
																	self.runAnimation2D(t2d , moveAnimate );
																});

																markerRoot2D.project_module.points[m].collected = true;
																
																let moveAnimate = {
																	name: "runAnimation2D", 
																	dt:500, 
																	ds:new THREE.Vector3( 2 , 2 , 2 ), 
																	reverse: true,
																} 
																

																//// 上傳資料至雲端
																let pointCardLogData  = {
																	"user_id": cardProj.user_id,
																	"playing_user": "", //// 在還沒有登入流程時候 一定要設為空字串
																	"proj_id": cardProj.proj_id,
																	"proj_type": "ar",
																	"card_id": scene_objs[j].project_module[0].card_id,
																	"device_id": device_id,
																	"can_reward_point_count": scene_objs[j].project_module[0].can_reward_point_count,
																	"target_id": getPointTarget.target_id,
																	"target_img_url": markerRoot2D.project_module.points[m].target_img_url ,
																	"brand": Browser.name + Browser.version ,
																	"os": Browser.platform , 
																	"location_long":0.0,
																	"location_lan":0.0
																}
																pointCardLog(window.serverUrl , pointCardLogData ,  );
															
															}else{
																let point_before_url;
																if (markerRoot2D.project_module.points[m].uncollected_point_url == "" ){
																	point_before_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_Before.png";
																}else{
																	point_before_url = markerRoot2D.project_module.points[m].uncollected_point_url;
																}

																

																pointObj.sub_type = 'jpg';
																self.loadAframeTexture2D( markerRoot2D, pointObj, point_before_url, j+1, scene_objs.length, position, rotation, scale );

																markerRoot2D.project_module.points[m].collected = false;
															}
														}
														////// 檢查需要的點數，由於此次是第一次載入，只有需求一點的情況要作後續動作。 邏輯上第二個參數必定是 false
														aPointCard.showPointCardCanvas( markerRoot2D,  1 - scene_objs[j].project_module[0].can_reward_point_count , getProjRet.is_exchanged );
														

													}) ;
													
												}else{ ////// 假如專案有紀錄過，先判斷此次集點辨識圖是否在內，否的話再導入
													
													aPointCard.addPoint(getProjRet , getPointTarget.target_id , function(setProjRet){

														for (let m = 0; m < markerRoot2D.project_module.points.length ; m++ ){

															let pointObj = markerRoot2D.project_module.points[m];

															let position = new THREE.Vector3().fromArray(pointObj.transform[0].split(",").map(function(x){return Number(x)}) ) ;
															let rotation = new THREE.Vector3().fromArray(pointObj.transform[1].split(",").map(function(x){return Number(x)}) ) ;
															let scale = new THREE.Vector3().fromArray(pointObj.transform[2].split(",").map(function(x){return Number(x)}) ) ;

															let gotPointTarget =  setProjRet.collected_points.find(function(item){
																return item == markerRoot2D.project_module.points[m].target_id ;
															});

															if ( gotPointTarget ){

																if (markerRoot2D.project_module.points[m].collected_point_url == "" ){
																	point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
																}else{
																	point_after_url = markerRoot2D.project_module.points[m].collected_point_url;
																}
																
																

																pointObj.sub_type = 'jpg';
																let pT2D = self.loadAframeTexture2D( markerRoot2D, pointObj, point_after_url, j+1, scene_objs.length, position, rotation, scale );

																pT2D.then( function( t2d ){
																	self.runAnimation2D(t2d , moveAnimate );
																});

																markerRoot2D.project_module.points[m].collected = true;
																
																let moveAnimate = {
																	name: "runAnimation2D", 
																	dt:500, 
																	ds:new THREE.Vector3( 2 , 2 , 2 ), 
																	reverse: true,
																} 
																

																//// 假如此次有新增集點 
																if (getProjRet != setProjRet){
																	if ( getPointTarget.target_id == markerRoot2D.project_module.points[m].target_id  ){
																		console.log(" three.js: _loadPointCard: new target =",  markerRoot2D.project_module.points[m] );
																		let pointCardLogData  = {
																			"user_id": setProjRet.user_id,
																			"playing_user": "", //// 在還沒有登入流程時候 一定要設為空字串
																			"proj_id": setProjRet.proj_id,
																			"proj_type": "ar",
																			"card_id": setProjRet.card_id,
																			"device_id": setProjRet.device_id,
																			"can_reward_point_count": setProjRet.can_reward_point_count,
																			"target_id": getPointTarget.target_id,
																			"target_img_url": markerRoot2D.project_module.points[m].target_img_url ,
																			"brand": Browser.name + Browser.version,
																			"os": Browser.platform , 
																			"location_long":0.0,
																			"location_lan":0.0
																		}
																		pointCardLog(window.serverUrl , pointCardLogData ,  );
																	}
																}
															
															}else{
																let point_before_url;
																if (markerRoot2D.project_module.points[m].uncollected_point_url == "" ){
																	point_before_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_Before.png";
																}else{
																	point_before_url = markerRoot2D.project_module.points[m].uncollected_point_url;
																}
																
																pointObj.sub_type = 'jpg';
																self.loadAframeTexture2D( markerRoot2D, pointObj, point_before_url, j+1, scene_objs.length, position, rotation, scale );

																markerRoot2D.project_module.points[m].collected = false;
															}
														}

														aPointCard.showPointCardCanvas( markerRoot2D , setProjRet.collected_points.length - scene_objs[j].project_module[0].can_reward_point_count , getProjRet.is_exchanged );
														

													});

												}

											});

										}

										// markerRoot2D.points = scene_objs[j].project_module[0].points;

									}
								}	
							
								break;
							
							case "quiz":
								console.log("three.js: _loadMakarScene: quiz module " , window.sceneResult[i], sceneModule , scene_objs  );

								//// 問答模組
								markerRoot.loadModule = markerRoot2D.loadModule = "quiz";
								
								for (let j = 0, len=scene_objs.length; j<len; j++){

									let scene_obj = scene_objs[j];

									let position = new THREE.Vector3().fromArray(scene_obj.transform[0].split(",").map(function(x){return Number(x)}) );
									let rotation = new THREE.Vector3().fromArray(scene_obj.transform[1].split(",").map(function(x){return Number(x)}) );
									let scale    = new THREE.Vector3().fromArray(scene_obj.transform[2].split(",").map(function(x){return Number(x)}) );
									
									let startQuiz = document.getElementById("startQuiz");
									let QuizStartButton = document.getElementById("QuizStartButton");

									if ( scene_obj.obj_type == '2d' ){
										if (scene_obj.sub_type == "quiz" ){

											startQuiz.style.display = "block";
											
											function start2DQuizFunc(){
												self.load2DQuiz( markerRoot2D , scene_obj, position, rotation, scale );
												startQuiz.style.display = "none";
												markerRoot2D.visible = true;
											}

											function quit2DQuizFunc(){
												startQuiz.style.display = "none";
												markerRoot2D.visible = true;
												QuizStartButton.onclick = null
											}

											let url = window.serverUrl;
											let login_id = localStorage.getItem("login_shared_id"), 
												proj_id = publishARProjs.proj_list[i].proj_id;

											//// 假如專案要求『強制登入作答』，檢查是否登入
											if ( scene_obj.module[0].force_login == true ){
												if (login_id ){
													//// 再檢查是否『允許重複作答』
													if ( scene_obj.module[0].allow_retry == false ){
														console.log("AR.js: _getRecordModule: get remote: ", login_id, proj_id );
														getRecordModule( url, login_id, proj_id, function(ret){
															console.log("AR.js: _getRecordModule: ret= " , ret );
															if (ret.data.record_module_list ){
																QuizStartContent.textContent = worldContent.userAlreadyPlayed[languageType];
																QuizStartButton.onclick = quit2DQuizFunc;
															}else{
																//// 可以重複作答，不用檢查紀錄，直接開始遊玩
																QuizStartContent.textContent = worldContent.clickToPlay[languageType];
																QuizStartButton.onclick = start2DQuizFunc;
															}
														});
													}else{
														//// 可以重複作答，不用檢查紀錄，直接開始遊玩
														QuizStartContent.textContent = worldContent.clickToPlay[languageType];
														QuizStartButton.onclick = start2DQuizFunc;
													}
												}else{
													//// 沒有登入，不給遊玩，跳出提示
													QuizStartContent.textContent = worldContent.userNotLoginInfo[languageType];
													QuizStartButton.onclick = quit2DQuizFunc;
												}
											}else{
											//// 不需要『檢查登入』，直接開始遊玩
												QuizStartContent.textContent = worldContent.clickToPlay[languageType];
												QuizStartButton.onclick = start2DQuizFunc;
											}

										}
									}

									if ( scene_obj.obj_type == '3d' ){
										if (scene_obj.sub_type == "quiz" ){

											startQuiz.style.display = "block";
														
											let startQuizFunc = function(){
												self.loadQuiz( markerRoot , scene_obj, position, rotation, scale );
												startQuiz.style.display = "none";
												markerRoot.visible = true;
												QuizStartButton.removeEventListener("click",startQuizFunc);
											}
											//// 離開quiz
											let quitQuizFunc = function(){
												startQuiz.style.display = "none";
												QuizStartButton.removeEventListener("click",quitQuizFunc);
											}
		
											let url = window.serverUrl;
											let login_id = localStorage.getItem("login_shared_id"), proj_id = publishARProjs.proj_list[i].proj_id;

											//// 假如專案要求『強制登入作答』，檢查是否登入
											if (scene_objs[j].module[0].force_login == true ){
												if (login_id ){
													//// 再檢查是否『允許重複作答』
													if (scene_objs[j].module[0].allow_retry == false ){
														console.log("AR.js: _getRecordModule: get remote: ", login_id, proj_id );
														getRecordModule( url, login_id, proj_id, function(ret){
															console.log("AR.js: _getRecordModule: ret= " , ret );
															if (ret.data.record_module_list ){
																QuizStartContent.textContent = worldContent.userAlreadyPlayed[languageType];
																// QuizStartButton.addEventListener("click",quitQuizFunc);
																QuizStartButton.onclick = quitQuizFunc;

															}else{
																//// 可以重複作答，不用檢查紀錄，直接開始遊玩
																QuizStartContent.textContent = worldContent.clickToPlay[languageType];
																// QuizStartButton.addEventListener("click",startQuizFunc);
																QuizStartButton.onclick = startQuizFunc;
															}
														});
													}else{
														//// 可以重複作答，不用檢查紀錄，直接開始遊玩
														QuizStartContent.textContent = worldContent.clickToPlay[languageType];
														// QuizStartButton.addEventListener("click",startQuizFunc);
														QuizStartButton.onclick = startQuizFunc;
													}
												}else{
													//// 沒有登入，不給遊玩，跳出提示
													QuizStartContent.textContent = worldContent.userNotLoginInfo[languageType];
													// QuizStartButton.addEventListener("click",quitQuizFunc);
													QuizStartButton.onclick = quitQuizFunc;
												}
											}else{
											//// 不需要『檢查登入』，直接開始遊玩
												QuizStartContent.textContent = worldContent.clickToPlay[languageType];
												// QuizStartButton.addEventListener("click",startQuizFunc);
												QuizStartButton.onclick = startQuizFunc;
											}

										}
									}

									
								}


								break;
							default: 
								console.log("three.js: _loadMakarScene: unknown module type " , window.sceneResult[i].data.module_type[0] , sceneModule );
						}
					}

				}

				//// 
				//// default AR project process.
				////
				// markerRoot.loadedObjects = true;
				// markerRoot2D.loadedObjects = true;

				for (let j in scene_objs){
					
					let scene_obj = scene_objs[j];

					let position = new THREE.Vector3().fromArray(scene_obj.transform[0].split(",").map(function(x){return Number(x)}) );
					let rotation = new THREE.Vector3().fromArray(scene_obj.transform[1].split(",").map(function(x){return Number(x)}) );
					let scale    = new THREE.Vector3().fromArray(scene_obj.transform[2].split(",").map(function(x){return Number(x)}) );

					switch (scene_obj.main_type ){
						case "model":
							
//[start-20190906-fei0073-mod]//
							////// check by user resource 
							if ( userProjResDict[ scene_obj.res_id ]  ){
								console.log("three.js: _loadSceneObjects: model from user resource");
								scene_obj.res_url = userProjResDict[scene_obj.res_id].res_url ;
							} else if ( userOnlineResDict[ scene_obj.res_id ] ) { 
								console.log("three.js: _loadSceneObjects: model from online resource" , userOnlineResDict[scene_obj.res_id].res_url );
								scene_obj.res_url = userOnlineResDict[scene_obj.res_id].res_url ;
							} else {
								
								switch(scene_obj.res_id){
									case "Cube":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Cube.glb";
										break;
									case "Capsule":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Capsule.glb";
										break;
									case "Sphere":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Sphere.glb";
										break;
									case "ch_Bojue":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Bojue.glb";
										break;
									case "ch_Fei":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Fei.glb";
										break;
									case "ch_Lina":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Lina.glb";
										break;
									case "ch_Poyuan":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Poyuan.glb";
										break;
									case "ch_Roger":
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Roger.glb";
										break;
									default:
										if (scene_objs[i].res_gltf_resource){												
											break;
										}
										scene_obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
										scene_obj.material = [];
										console.log("three.js: _loadSceneObjects: model not exist show missing model ");
										break;
								}
							
							}


							if ( scene_obj.res_url && scene_obj.transform  ){
								console.log("three.js: model 3d, obj with url and transform: ", scene_obj  );

								let pModel = self.loadAframeGLTFModel(markerRoot , 
									scene_obj, position, rotation, scale, self.cubeTex );

								pObjAll.push( pModel );

							} else{

								console.log("three.js: model 3d, obj without url or transform(fail): ", scene_obj  );

							}
							
//[start-20191023-fei0076-add]//
							markerRoot.visible = true;
//[end---20191023-fei0076-add]//
							break;
						case "video":
							
							if (scene_objs[j].sub_type == "mp4"){
								if ( scene_objs[j].res_url && scene_objs[j].transform  ){
									console.log("three.js: video mp4 3d, obj with url and transform: ", scene_objs[j]  );

									let pViedo = self.loadAframeVideo( markerRoot , scene_objs[j], position, rotation, scale );

									pObjAll.push( pViedo );

								}else{
									console.log("three.js: video mp4 3d, obj without url and transform(fail): ", scene_objs[j]  );
								}
							}
//[start-20190322-fei0062-add]//
							// if (scene_objs[j].sub_type == "youtube"){
							// 	self.loadYouTubeVideo(markerRootCSS, scene_objs[j].res_url,
							// 		scene_objs[j],
							// 		new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) )  ,
							// 		new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) ), 
							// 		new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) ) 
							// 	); // markerRoot, position, rotation, scale
							// 	console.log("youtube load :", scene_objs[j]);
							// }
//[end---20190322-fei0062-add]//
							break;

						case "text":

							// console.log("three.js: _loadText: text: ", j , scene_obj );

							if (scene_objs[j].obj_type == "3d"){
								let pText = self.loadAframeText( markerRoot , scene_obj , position, rotation, scale  );

								pObjAll.push( pText );

							}else if ( scene_objs[j].obj_type == "2d" ){
								
								self.loadAframeText2D( markerRoot2D, scene_objs[j], j, scene_objs.length, position, rotation, scale );
							}

							break;

						case "audio":
							if (scene_objs[j].sub_type == "mp3" || scene_objs[j].sub_type == "wav" ||  scene_objs[j].sub_type == "ogg" ){
								if ( scene_objs[j].res_url && scene_objs[j].transform  ){
									// console.log("three.js: audio mp4 3d, obj with url and transform(success): ", scene_objs[j]  );

									let pAudio = self.loadAframeAudio( markerRoot, scene_objs[j], position, rotation, scale  );

									pObjAll.push( pAudio );

								}else{
									console.log("three.js: audio mp4 3d, obj without url and transform(fail): ", scene_objs[j]  );
								}
							}
							break;

						case "image":

//[start-20190909-fei0073-add]//
							//////
							////// we remove main_type prefab on V3, the default image will set main_type image
							//////
							let textureUrl = scene_objs[j].res_url;

							textureUrl = self.dealImageUrl( scene_objs[j] );

							if (scene_objs[j].obj_type == "3d"){

								if ( textureUrl && scene_objs[j].transform  ){
									// console.log("three.js: image 3d, obj with url and transform(success): ", scene_objs[j]  );
									
									let pTexture = self.loadAframeTexture (markerRoot, textureUrl,
										scene_objs[j], position, rotation, scale
									); 

									pObjAll.push( pTexture );

								}else{
									console.log("three.js: image 3d, obj without url and transform(fail): ", scene_objs[j]  );
								}
							}

							if (scene_objs[j].obj_type == "2d"){
								if ( textureUrl && scene_objs[j].transform  ){
									console.log("three.js: image 2d, obj with url and transform(success): ", scene_objs[j]  );
							
									self.loadAframeTexture2D( markerRoot2D, scene_objs[j], textureUrl , j, scene_objs.length, position, rotation, scale );

								}else{
									console.log("three.js: image 2d, obj without url and transform(fail): ", scene_objs[j]  );
								}
							}

//[end---20190909-fei0073-add]//
							break;
						case "module":
							// console.log("three.js: main type module, deal before :", scene_objs[j].main_type);
							break;

						case "light":

							let pLight = self.loadAframeLight(markerRoot , scene_objs[j], position, rotation, scale);

							pObjAll.push( pLight );

							break;
							
						default:
							console.log("three.js: type unknown show cube :", scene_objs[j] );
							// let cube2 = new THREE.Mesh( new THREE.BoxBufferGeometry(30, 30, 30), new THREE.MeshBasicMaterial({color: new THREE.Color( 0, 0.5, 0.3 ) }) ); // MeshBasicMaterial MeshNormalMaterial
							// self.setTransform(cube2, 96,
							// 	new THREE.Vector3().fromArray(scene_objs[j].transform[0].split(",").map(function(x){return Number(x)}) )  ,
							// 	new THREE.Vector3().fromArray(scene_objs[j].transform[1].split(",").map(function(x){return Number(x)}) ), 
							// 	new THREE.Vector3().fromArray(scene_objs[j].transform[2].split(",").map(function(x){return Number(x)}) ) 
							// );
							// markerRoot.add(cube2);
							break;
					}
				}

				return pObjAll ;

			};

//[end---20190102-fei0044-add]//

			
//[start-20200516-fei0094-add]//
			this.activeAndClearScene = function(targetIndex){
				
				let index = self.sceneTargetList[targetIndex].projIndex ;


				/////////////// aframe 改版 ////////////////////

				for ( let i in this.aframeNFTMarkers ){
					if ( i == index ){
						
						// console.log(' _clearScene: set visible true' , i , this.aframeNFTMarkers[i] );
						// this.aframeNFTMarkers[i].setAttribute('visible' , true ) ;
						this.aframeNFTMarkers[i].object3D.visible = true;
						this.threeNFTMarkers2D[i].visible = true;

						let targetContainer = this.aframeNFTMarkers[i];
						//// 檢查是否有處理過「允許播放聲音影片」，有的話就播放影片以及聲音，沒有的話再執行一次互動播放流程

						targetContainer.object3D.traverse( function( child ){
							//// 先確認物件是否可見
							if ( child.getWorldVisible() == true ){
								
								//// 影片部份，
								if ( child.makarType == 'video' ){

									if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || (window.allowAudioClicked != true && location == parent.location ) )
									{
										self.dealVideoMuted();
									} else {
										child.el.mp4Video.play();
									}

								}

								//// 聲音部份，可以直接播放多個
								if ( child.makarType == 'audio' ){
									child.el.components.sound.playSound();
								}
							}
						});


					} else {

						// console.log(' _clearScene:  ' , index , i , this.aframeNFTMarkers[i].object3D.visible , this.threeNFTMarkers2D[i].visible );

						//// 暫停所有影片物件，判斷子母物件是否為「觸發事件」，是的話將子物件改為不可見
						let targetContainer = this.aframeNFTMarkers[i];
						targetContainer.object3D.traverse( function( child ){
							//// 影片暫停
							if ( child.makarType == 'video' ){
								child.el.mp4Video.pause();
							}
							//// 聲音停止
							if ( child.makarType == 'audio' ){
								child.el.components.sound.stopSound();
							}
							//// 處理「觸發事件子物件隱藏」
							if ( child.behav_reference && child.behav_reference.length > 0 ){
								for ( let j = 0; j < child.behav_reference.length; j++ ){
									if ( child.behav_reference[j].behav_name == 'ShowVideo' || 
										 child.behav_reference[j].behav_name == 'ShowModel' || 
										 child.behav_reference[j].behav_name == 'ShowImage' || 
										 child.behav_reference[j].behav_name == 'PlayMusic' || 
										 child.behav_reference[j].behav_name == 'ShowText' 
									){
										child.el.setAttribute("visible", false);
									}
								}
							}
						});

						//// quiz 專案先行判斷，只要先掃到 quiz 專案（開始遊玩），再掃其他專案，再掃回quiz專案，則要重新開始
						if ( this.aframeNFTMarkers[i].loadModule ){
							if ( this.aframeNFTMarkers[i].loadModule == 'quiz' ){
								
								//// 從 makarObjects 中排除相關物件 
								let quizRoot = this.aframeNFTMarkers[i];

								//// 從場景中清除quiz 專案對應物件
								while( quizRoot.children.length > 0 ){
									quizRoot.children[0].remove();
								}
								//// 清除物件列表中，已經跟場景沒有關聯的物件
								for ( let j = 0; j < self.makarObjects.length; j++ ){
									if (  self.makarObjects[j].object3D.el == null || self.makarObjects[j].object3D.parent == null ){
										self.makarObjects.splice( j , 1 );
									}
								}

								//// 判斷「當前呈現專案」是否是 quiz ，假如是的話則不用「隱藏 UI界面」，假如不是quiz 專案，則要隱藏 quiz對應UI
								let startQuiz = document.getElementById('startQuiz');
								if ( this.aframeNFTMarkers[ index ].loadModule == 'quiz' ){

								} else {
									startQuiz.style.display = 'none';
								}

								self.aframeNFTMarkers[i].loadedObjects = false;
								self.threeNFTMarkers2D[i].loadedObjects = false;

								// console.log(' _clearScene: remove done ');


							}
						}


						if ( this.aframeNFTMarkers[i].object3D.visible == false && this.threeNFTMarkers2D[i].visible == false ){
							//// 這個判斷主要是因為 括括卡模組是共用一組 兌換視窗以及按鈕。
				 			//// 假如兩有兩個括括卡模組[A B]，在先載入A、再載入B，然後將B流程至輸入密碼視窗，這時候假如在掃描到B 則會觸發隱藏輸入密碼視窗。
				 			//// 增加這判斷會跳過已經隱藏過得 target/scene 
							continue;
						}

						// this.aframeNFTMarkers[i].setAttribute('visible' , false ) ;
						this.aframeNFTMarkers[i].object3D.visible = false;
						this.threeNFTMarkers2D[i].visible = false;

						//// 暫停 之前 影片物件
						if (this.threeNFTMarkers2D[i].loadModule ){
							// console.log("2 three.js: recognize: previous scene _loadModule = ", i, this.threeNFTMarkers2D[i] );
							
							switch(this.threeNFTMarkers2D[i].loadModule){
								case "scratchCard":
									// console.log("three.js: recognize: _clearScene, deal previous scratchCard " );
									aScratchCard.hideScratchCanvas( this.threeNFTMarkers2D[i] );
									break;
								case "pointCard":
									console.log("three.js: recognize: _clearScene, processing pointCard " );
									aPointCard.hidePointCardCanvas( this.threeNFTMarkers2D[i] );
									break;

								case "coloring":
									console.log("three.js: recognize: _clearScene, not support coloring " );
									break;
								default:
									console.log("three.js: recognize: _clearScene, not support unknown module", this.threeNFTMarkers2D[i].loadModule );

							}
						};


					}

				}

				for (let i in this.threeNFTMarkers2D) { 
					if (i == index) {
						if (this.threeNFTMarkers2D[i].loadModule ){
							// console.log("2 three.js: recognize: current scene _loadModule = ", i, this.threeNFTMarkers2D[i] );
							switch(this.threeNFTMarkers2D[i].loadModule){
								case "scratchCard":
									// console.log("three.js: recognize: _clearScene, deal current scratchCard " );
									aScratchCard.showScratchCanvas( this.threeNFTMarkers2D[i] );
									break;
								case "pointCard":
									console.log("three.js: recognize: _clearScene, pointCard processing " , self.threeNFTMarkers2D[i] , publishARProjs.proj_list[i] );
									// snapShotCamera.style.display = "none";
									aPointCard.getPointCardProject(publishARProjs.proj_list[i].proj_id, getProjRet=>{
										console.log("three.js: _clearScene: _pointCard: getProjRet=", getProjRet );
										let gotPointTarget2;
										if (getProjRet.collected_points){
											gotPointTarget2 = getProjRet.collected_points.find(function(item){
												return item == self.sceneTargetList[ targetIndex ].target_id ;
											});

											if (gotPointTarget2){////// 假如此點已經集過
												console.log("three.js: _clearScene: _pointCard: already collected ");
												aPointCard.showPointCardCanvas( self.threeNFTMarkers2D[i] , getProjRet.collected_points.length - self.threeNFTMarkers2D[i].project_module.can_reward_point_count , getProjRet.is_exchanged );
												
											} else { ////// 此點尚未集過
												console.log("three.js: _clearScene: _pointCard: not collected ");
												
												aPointCard.addPoint(getProjRet , self.sceneTargetList[ targetIndex ].target_id , function(setProjRet){
													console.log("three.js: _clearScene: setProjRet" , setProjRet );
													if (setProjRet.collected_points){
														for (let m = 0; m < self.threeNFTMarkers2D[i].project_module.points.length ; m++ ){
															if (self.threeNFTMarkers2D[i].project_module.points[m].target_id == self.sceneTargetList[ targetIndex ].target_id ){
																if (self.threeNFTMarkers2D[i].project_module.points[m].collected_point_url == "" ){
																	point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
																}else{
																	point_after_url = self.threeNFTMarkers2D[i].project_module.points[m].collected_point_url;
																}
																let pointObj = self.threeNFTMarkers2D[i].project_module.points[m];

																let position = new THREE.Vector3().fromArray(pointObj.transform[0].split(",").map(function(x){return Number(x)}) ) ;
																let rotation = new THREE.Vector3().fromArray(pointObj.transform[1].split(",").map(function(x){return Number(x)}) ) ;
																let scale = new THREE.Vector3().fromArray(pointObj.transform[2].split(",").map(function(x){return Number(x)}) ) ;


																pointObj.sub_type = 'jpg';
																let pT2D = self.loadAframeTexture2D( self.threeNFTMarkers2D[i], pointObj, point_after_url, self.threeNFTMarkers2D[i].children.length, self.threeNFTMarkers2D[i].children.length, position, rotation, scale );
																pT2D.then( function( t2d ){
																	self.runAnimation2D(t2d , moveAnimate );
																});

																self.threeNFTMarkers2D[i].project_module.points[m].collected = true;
	
																let moveAnimate = {
																	name: "runAnimation2D", 
																	dt:500, 
																	ds:new THREE.Vector3( 2 , 2 , 2 ), 
																	reverse: true,
																} 
																// function planeAnimate(plane){
																// 	console.log("three.js: load pointCard collected plane = " , plane );
																// 	self.runAnimation2D(plane , moveAnimate );
																// };
	
																//// 上傳集點資訊至雲端 
																let pointCardLogData  = {
																	"user_id": setProjRet.user_id,
																	"playing_user": "", //// 在還沒有登入流程時候 一定要設為空字串
																	"proj_id": setProjRet.proj_id,
																	"proj_type": "ar",
																	"card_id": setProjRet.card_id,
																	"device_id": setProjRet.device_id,
																	"can_reward_point_count": setProjRet.can_reward_point_count,
																	"target_id": self.threeNFTMarkers2D[i].project_module.points[m].target_id,
																	"target_img_url": self.threeNFTMarkers2D[i].project_module.points[m].target_img_url ,
																	"brand": Browser.name + Browser.version,
																	"os": Browser.platform , 
																	"location_long":0.0,
																	"location_lan":0.0
																}
																console.log(" three.js: _clearScene: collect target upload=",  pointCardLogData );
																pointCardLog(window.serverUrl , pointCardLogData ,  );
																
															}
														}
	
														aPointCard.showPointCardCanvas( self.threeNFTMarkers2D[i] , setProjRet.collected_points.length - self.threeNFTMarkers2D[i].project_module.can_reward_point_count , getProjRet.is_exchanged );
													}else{
														console.error("three.js: _clearScene: collected_points not exist, shouldnt happen " , self.threeNFTMarkers2D[i].project_module.points );
													}
	
												});
	
											}


										}
										

									});
									
									break;

								case "coloring":
									console.log("three.js: recognize: _clearScene, not support coloring " );
									break;
								default:
									console.log("three.js: recognize: _clearScene, not support unknown module", this.threeNFTMarkers2D[i].loadModule );

							}

						}else{

							// snapShotCamera.style.display = "block";
						
						};
					}

					
				}


			}

//[end---20200516-fei0094-add]//

			////// quiz 部份

			function getRandomInt(max) {
				return Math.floor(Math.random() * Math.floor(max));
			}


			//// 2D quiz
			this.load2DQuiz = function( markerRoot2D, obj, position, rotation, scale){
				console.log("three.js: _load2DQuiz : obj=", obj );

				//// quiz 物件，注意當前 2D 場景的 obj_id 紀錄方式與3D 不同
				let quiz2D = new THREE.Object3D();
				quiz2D.obj_id = obj.obj_id;
				quiz2D.makarType = 'quiz2D';
				quiz2D.makarObject = true ;

				markerRoot2D.add( quiz2D );
				self.makarObjects2D.push(quiz2D);


				//// 處理亂序出題
				let randomQuestionList = [];
				for (let i=0; i<obj.module[0].question_list.length; i++){
					if (obj.module[0].question_list[i].allowRandom){
						randomQuestionList.push(i);
					}
				}

				//// 這邊判斷「呈現題目」是否有值。沒有的話直接返回
				if ( !obj.module[0].display_order_list || obj.module[0].display_order_list.length == 0 ){
					return;
				}

				let totalActiveScoreQuestion = 0
				for (let i=0;i<obj.module[0].display_order_list.length;i++){
					let tempIdx =  obj.module[0].display_order_list[i].index;
					if (tempIdx == -1){
						let randInt = getRandomInt(randomQuestionList.length);
						let randomIdx = randomQuestionList[randInt];
						obj.module[0].display_order_list[i].index = randomIdx
						tempIdx = randomIdx;
						randomQuestionList.splice(randInt,1);
					}
					if (obj.module[0].question_list[tempIdx].active_score){
						totalActiveScoreQuestion += 1;
					}
				}
				//// 起始題目
				let idx = obj.module[0].display_order_list[0].index;
				let first_question = obj.module[0].question_list[idx];
				//// 計時器
				let firstTimer = -1;
				if (obj.module[0].timer_type == "Total"){
					firstTimer = obj.module[0].total_time;
					let timer = document.getElementById("timerDiv");
					timer.style.display = "block";

					let hour = Math.floor(firstTimer/3600);
					let min = Math.floor((firstTimer-hour*3600)/60);
					let sec = firstTimer-hour*3600-min*60;
					timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
				}
				else if(obj.module[0].timer_type == "Custom"){
					firstTimer = first_question.time_limit;
					let timer = document.getElementById("timerDiv");
					timer.style.display = "block";

					let hour = Math.floor(firstTimer/3600);
					let min = Math.floor((firstTimer-hour*3600)/60);
					let sec = firstTimer-hour*3600-min*60;
					timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
				}
				//// 提示區域
				let tipButtonDiv = document.getElementById("tipButtonDiv");
				if(first_question.show_tips){
					tipButtonDiv.style.display = "block";
					tipButtonDiv.addEventListener("click",function(){
						let tipDiv = document.getElementById("tipDiv");
						let tipConfirmButton = document.getElementById("tipConfirmButton");
						let tipContent = document.getElementById("tipContent");
						tipDiv.style.display = "block";
						tipContent.textContent = first_question.tips_content;
						tipConfirmButton.addEventListener("click",function(){
							tipDiv.style.display = "none";
						});
					});
				}
				else{
					tipButtonDiv.style.display = "none";
				}

				//// 物件必須帶有的參數，注意應該儲存於「物件」，而不要在「專案」或是「辨識圖」內
				quiz2D.quizModule = {"json":obj.module[0], "quizObject":quiz2D, "currentQuestionIndex":0, "score":0, "choices":[], "correctAnswer":0, "totalActiveScoreQuestion":totalActiveScoreQuestion, "record":new Array(obj.module[0].question_list.length), "timer":{"currentTimer":null,"counter":firstTimer} , "record_time":0 , "qClock": Date.now() }
				
				//// 載入第一題「題目物件」
				if ( first_question.questions_json && Array.isArray( first_question.questions_json ) ){

					for(let i=0; i<first_question.questions_json.length; i++){

						let qObj = first_question.questions_json[i];
	
						let position = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
						let type = first_question.questions_json[i].main_type;
						switch(type){
							case "text":
								self.loadAframeText2D( markerRoot2D, qObj, i, first_question.questions_json.length, position, rotation, scale );
								break;
							case "image":
	
								let textureUrl = qObj.res_url;
								textureUrl = self.dealImageUrl( qObj );
	
								self.loadAframeTexture2D( markerRoot2D, qObj, textureUrl , i, first_question.questions_json.length, position, rotation, scale );
	
								break;
	
							default:
	
						}	
					}

				}
				

				//// 載入第一題「答案物件」
				
				//// 載入第一題選項
				if ( first_question.options_json && Array.isArray( first_question.options_json ) ){

					for(let i=0; i<first_question.options_json.length; i++){
						let optionObj = first_question.options_json[i];
	
						let position = new THREE.Vector3().fromArray(optionObj.transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray(optionObj.transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray(optionObj.transform[2].split(",").map(function(x){return Number(x)}) );
						let type = optionObj.sub_type;
	
						let pOptionObj;
						
						let textureUrl = optionObj.res_url;
						textureUrl = self.dealImageUrl( optionObj );
	
	
						switch(type){
							case "txt":
								pOptionObj = self.loadAframeText2D( markerRoot2D, optionObj, i, first_question.options_json.length, position, rotation, scale );
								break;
							case "gif":
							case "jpg":
							case "jpeg":
							case "png":	
								pOptionObj = self.loadAframeTexture2D( markerRoot2D, optionObj, textureUrl , i, first_question.options_json.length, position, rotation, scale );
								break;
							case "button":
								textureUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
								pOptionObj = self.loadAframeTexture2D( markerRoot2D, optionObj, textureUrl , i, first_question.options_json.length, position, rotation, scale );
								break;
							default:
	
						}
	
						//// 多選題要讓「選項物件」增加「圓圈」
						if (type != "button" && (first_question.option_type == "MutiOption_Text"|| first_question.option_type == "MutiOption_Image")){
							pOptionObj.then( function( ret ){
	
								let optionObject = ret;
	
								let circlePos = new THREE.Vector3(0,0,0);
								let circleRot = new THREE.Vector3(0,0,0);
								let circleScale = new THREE.Vector3(1,1,1);
								let quaternion = new THREE.Quaternion( );
	
								if ( first_question.option_type == "MutiOption_Text"){
									//// 文字選項，圓圈加在左方
									//// 對比大小由「文字背版」來決定，從「背版寬、高、預設最大值」中選出最小值。
									
									let optionTextBG = optionObject.children[0].children[1];
									// let optionText2DBGWorldScale = optionTextBG.getWorldScale( new THREE.Vector3() );
									let optionText2DBGLocalScale = optionTextBG.scale.clone();
									let optionText2DCoWorldScale = optionObject.children[0].getWorldScale( new THREE.Vector3() ) ;
									// let optionText2DCoLocalScale = optionObject.children[0].scale.clone() ;
									
									let minS = Math.min( optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , 
														 optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height ,
														 1000000 );
	
									circleScale.multiply(  new THREE.Vector3( 0.8 , 0.8 , 0.8 ).multiplyScalar( minS )  );
									circleScale.divide( optionText2DCoWorldScale );
	
									// console.log(' optionText2DBGLocalScale: ' , optionText2DBGLocalScale , 
									// '\noptionText2DBGWorldScale: ', optionText2DBGWorldScale, 
									// '\noptionText2DCoWorldScale: ', optionText2DCoWorldScale, 
									// '\noptionText2DCoLocalScale: ', optionText2DCoLocalScale, 
									// '\ncircleScale:' , circleScale ,'\n222' ,
									// optionTextBG.geometry.parameters.width , optionTextBG.geometry.parameters.height, '\n555' ,
									// optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height );
	
									//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
									let optionImageScale = optionTextBG.geometry.parameters.width * optionText2DBGLocalScale.x  ;
									// let optionImageHeight = optionObject.children[0].geometry.parameters.height;
	
									let tLoader = new THREE.TextureLoader();
	
									//// 內層圓圈 、 選到圓圈
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
									tLoader.load(resUrl, function(texture){
	
										circlePos.x = -optionImageScale * 0.5 - 80 * 0.6 * circleScale.x ;
	
										let circle_base = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
										);
										circle_base.name = "circle_base";
										circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
										// optionObject.add( circle_base );
										optionObject.children[0].add( circle_base );
	
										//// 選到圓圈
										let circle_in = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
										);
										circle_in.name = "circle_in";
										circle_in.renderOrder = 1;
										circle_in.visible = false; //// 預設為『沒有選取』
										circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
										// optionObject.add( circle_in );
										optionObject.children[0].add( circle_in );
									});
	
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
									tLoader.load(resUrl, function(texture){
										
										circlePos.x = -optionImageScale * 0.5 - 80 * 0.6 * circleScale.x ;
	
										// //// 外層圓圈
										let circle_out = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
										);
										circle_out.name = "circle_out";
										circle_out.renderOrder = 1;
										circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
										
										// optionObject.add( circle_out );
										optionObject.children[0].add( circle_out );
	
									});
	
	
								} else {
									//// 圖片選項，圓圈加在下方
	
									//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
									//// 這樣確保圓圈比例維持，且大小隨著選項而變動
									let optionImgWorldScale = optionObject.getWorldScale(new THREE.Vector3());
									let optionImgLocalScale = optionObject.scale.clone()  ;
									// let maxS = Math.max( optionImgLocalScale.x , optionImgLocalScale.y );
	
									let maxS = Math.max( optionImgLocalScale.x * optionObject.children[0].geometry.parameters.width , 
														 optionImgLocalScale.y * optionObject.children[0].geometry.parameters.height  );
	
									circleScale.multiply(  new THREE.Vector3( 0.0025 , 0.0025 , 0.0025 ).multiplyScalar( maxS )  );
									circleScale.divide( optionImgWorldScale );
	
									//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
									let optionImageScale = optionObject.children[0].scale.clone() ;
									let optionImageHeight = optionObject.children[0].geometry.parameters.height;
	
									let tLoader = new THREE.TextureLoader();
	
									//// 內層圓圈 、 選到圓圈
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
									tLoader.load(resUrl, function(texture){
	
										// circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 60 * 0.6 * circleScale.y ;
										circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;
	
										let circle_base = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
										);
										circle_base.name = "circle_base";
										circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
										optionObject.add( circle_base );
	
										//// 選到圓圈
										let circle_in = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
										);
										circle_in.name = "circle_in";
										circle_in.renderOrder = 1;
										circle_in.visible = false; //// 預設為『沒有選取』
										circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
										optionObject.add( circle_in );
									});
	
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
									tLoader.load(resUrl, function(texture){
										
										// circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 60 * 0.6 * circleScale.y ;
										circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;
	
										// //// 外層圓圈
										let circle_out = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
										);
										circle_out.name = "circle_out";
										circle_out.renderOrder = 1;
										circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
										optionObject.add( circle_out );
	
									});
	
	
								}
							});
						}
					}

				}
				
			

			}


			//// 3D quiz

			this.loadQuiz = function( markerRoot, obj, position, rotation, scale){

				console.log("three.js: _loadQuiz: obj=", obj );

				let Quiz = document.createElement("a-entity");
				Quiz.setAttribute("id", obj.obj_id);

				let quaternionStr = obj.quaternionRotation.split(",");
				let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

				let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
				let GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
				let GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ;


				Quiz.addEventListener("loaded", function(evt){
					if (evt.target == evt.currentTarget){
						console.log('three.js: _loadQuiz: _loaded: ' , Quiz.object3D );
						
						Quiz.object3D.makarType = "quiz";
						Quiz.object3D.makarObject = true ;

						let dp = new THREE.Vector3();
						switch (window.serverVersion){
							case "2.0.0":
								scale.multiplyScalar( 1 )
								dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
								break;

							case "3.0.0":
								dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
								scale.multiplyScalar( 2 )
								break;
							default:
								console.log("three.js: _setTransform: serverVersion version wrong", serverVersion);
						}

						//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
						let py = dp.y;
						let pz = dp.z;
						dp.y = pz;
						dp.z = py;

						self.setAframeTransform( Quiz , dp , rotation, scale, quaternion );
						//// 第一層物件必須放至於辨識圖中央										
						Quiz.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
						//// 第一層物件必須垂直於辨識圖表面
						Quiz.object3D.rotation.x += Math.PI*90/180;
						Quiz.object3D.updateMatrix();

						Quiz.object3D['obj_parent_id'] = obj.obj_parent_id ;

						///// 增加一個「空物件」，代表此 entity 已經自身載入完成
						let QObject3D = new THREE.Object3D();
						Quiz.object3D.add( QObject3D );

					}
				});


				markerRoot.appendChild(Quiz);
				self.makarObjects.push( Quiz );


				//// 處理亂序出題
				let randomQuestionList = [];
				for (let i=0; i<obj.module[0].question_list.length; i++){
					if (obj.module[0].question_list[i].allowRandom){
						randomQuestionList.push(i);
					}
				}
				
				//// 這邊判斷「呈現題目」是否有值。沒有的話直接返回
				if ( !obj.module[0].display_order_list ){
					return;
				}
				
				let totalActiveScoreQuestion = 0
				for (let i=0;i<obj.module[0].display_order_list.length;i++){
					let tempIdx =  obj.module[0].display_order_list[i].index;
					if (tempIdx == -1){
						let randInt = getRandomInt(randomQuestionList.length);
						let randomIdx = randomQuestionList[randInt];
						obj.module[0].display_order_list[i].index = randomIdx
						tempIdx = randomIdx;
						randomQuestionList.splice(randInt,1);
					}
					if (obj.module[0].question_list[tempIdx].active_score){
						totalActiveScoreQuestion += 1;
					}
				}
				//// 起始題目
				let idx = obj.module[0].display_order_list[0].index;
				let first_question = obj.module[0].question_list[idx];
				//// 計時器
				let firstTimer = -1;
				if (obj.module[0].timer_type == "Total"){
					firstTimer = obj.module[0].total_time;
					let timer = document.getElementById("timerDiv");
					timer.style.display = "block";

					let hour = Math.floor(firstTimer/3600);
					let min = Math.floor((firstTimer-hour*3600)/60);
					let sec = firstTimer-hour*3600-min*60;
					timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
				}
				else if(obj.module[0].timer_type == "Custom"){
					firstTimer = first_question.time_limit;
					let timer = document.getElementById("timerDiv");
					timer.style.display = "block";

					let hour = Math.floor(firstTimer/3600);
					let min = Math.floor((firstTimer-hour*3600)/60);
					let sec = firstTimer-hour*3600-min*60;
					timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
				}
				//// 提示區域
				let tipButtonDiv = document.getElementById("tipButtonDiv");
				if(first_question.show_tips){
					tipButtonDiv.style.display = "block";
					tipButtonDiv.addEventListener("click",function(){
						let tipDiv = document.getElementById("tipDiv");
						let tipConfirmButton = document.getElementById("tipConfirmButton");
						let tipContent = document.getElementById("tipContent");
						tipDiv.style.display = "block";
						tipContent.textContent = first_question.tips_content;
						tipConfirmButton.addEventListener("click",function(){
							tipDiv.style.display = "none";
						});
					});
				}
				else{
					tipButtonDiv.style.display = "none";
				}
				//// 紀錄所有題目資序，以供後續使用
				self.quizModule[ self.currentProjectIndex ] = {"json":obj.module[0], "quizEntity":Quiz, "currentQuestionIndex":0, "score":0, "choices":[], "correctAnswer":0, "totalActiveScoreQuestion":totalActiveScoreQuestion, "record":new Array(obj.module[0].question_list.length), "timer":{"currentTimer":null,"counter":firstTimer} , "record_time":0 , "qClock": Date.now() }
				
				console.log("AR.js: _loadQuiz: self.quizModule , first_question =" , self.quizModule , first_question  );
				
				//// 分數區域，事件只會在顯示時候設定。
				let scoreDiv = document.getElementById("scoreDiv")
				// scoreDiv.onclick = function(){
				// 	scoreDiv.style.display = "none";
				// 	self.nextQuestion();
				// }

				//// 載入第一個題目
				if ( first_question.questions_json && Array.isArray( first_question.questions_json ) ){
					for(let i=0; i<first_question.questions_json.length; i++){
						let position = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
						let type = first_question.questions_json[i].main_type;
						switch(type){
							case "text":
	
								self.loadAframeText( markerRoot , first_question.questions_json[i] , position, rotation, scale  );
	
								break;
							case "image":
	
								let resUrl = "";
								resUrl = self.dealImageUrl( first_question.questions_json[i] );
	
								self.loadAframeTexture (markerRoot, resUrl, first_question.questions_json[i], position, rotation, scale); 
	
								break;
							case "video":
	
								self.loadAframeVideo( markerRoot , first_question.questions_json[i], position, rotation, scale );
	
								break;
							case "model":
	
								let gltfUrl = self.getUserRes_onlineRes( first_question.questions_json[i] );
							
								self.loadAframeGLTFModel(markerRoot , first_question.questions_json[i], position, rotation, scale, self.cubeTex );
	
								break;
							case "audio":
								
								self.loadAframeAudio( markerRoot, first_question.questions_json[i] , position, rotation, scale  );
								break;
						}
					}
				}
				

				//// 載入第一題選項
				if ( first_question.options_json && Array.isArray( first_question.options_json ) ){
					for(let i=0; i<first_question.options_json.length; i++){
						let position = new THREE.Vector3().fromArray(first_question.options_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray(first_question.options_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray(first_question.options_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
						let type = first_question.options_json[i].sub_type;
						console.log("three.js: _loadQuiz: _loadOption: ", i , type , first_question.options_json[i] )
						let Entity;
	
						let pOption;
	
						let resUrl = "";
						if (type != "txt"){
							resUrl = self.dealImageUrl( first_question.options_json[i] );
						}
						
						
						switch(type){
							case "txt":
								// first_question.options_json[i].main_type = "text";
								pOption = self.loadAframeText( markerRoot , first_question.options_json[i] , position, rotation, scale  );
								break;
							case "gif":
							case "jpg":
							case "jpeg":
							case "png":
								pOption = self.loadAframeTexture (markerRoot, resUrl, first_question.options_json[i], position, rotation, scale); 
								break;
							case "button":
								resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
								pOption = self.loadAframeTexture (markerRoot, resUrl, first_question.options_json[i], position, rotation, scale); 
	
								break;
						}
						
	
						//// 多選題，「選項」需要區分「圖片」、「文字」、「OK按鈕」
						if (type != "button" && (first_question.option_type == "MutiOption_Text"|| first_question.option_type == "MutiOption_Image")){
	
							pOption.then( function( ret ){
								Entity = ret;
	
								Entity.object3D.matrixWorldNeedsUpdate = true;
								Entity.object3D.updateMatrixWorld();
	
								let circlePos = new THREE.Vector3(0,0,0);
								let circleRot = new THREE.Vector3(0,0,0);
								let circleScale = new THREE.Vector3(1,1,1);
	
								let quaternion = new THREE.Quaternion( );
	
								if(first_question.option_type == "MutiOption_Text"){
	
									// console.log(' 6666666666 ' , new THREE.Vector3(1,1,1).multiply( Entity.object3D.scale ).multiply( Entity.object3D.parent.scale ).multiply( Entity.object3D.parent.parent.scale )  );
	
									//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」。## 備註一下： getWorldScale 並不一定會返回「正確的數值」，原因猜測跟取得方式是「worldMatrix」相關
									//// 這樣確保圓圈比例維持，且大小隨著選項而變動
									// let optionTextWorldScale = Entity.object3D.getWorldScale(new THREE.Vector3());
									let optionTextWorldScale = new THREE.Vector3(1,1,1).multiply( Entity.object3D.scale ).multiply( Entity.object3D.parent.scale ).multiply( Entity.object3D.parent.parent.scale );
	
									let optionTextBGWroldScale = Entity.object3D.children[1].scale.clone().multiply( optionTextWorldScale );
									// let optionTextBGWroldScale = new THREE.Vector3();
									// if ( Entity.object3D.children ){
									// 	if ( Entity.object3D.children[1] ){
									// 		if ( Entity.object3D.children[1] ){
									// 			if ( Entity.object3D.children[1].geometry ){
									// 				optionTextBGWroldScale = Entity.object3D.children[1].getWorldScale( new THREE.Vector3() );
									// 			}
									// 		}
									// 	}
									// }
	
									let maxS = Math.max( optionTextBGWroldScale.x , optionTextBGWroldScale.y );
									circleScale.multiply(  new THREE.Vector3( 30, 30, 30 ).multiplyScalar( maxS )  );
									circleScale.divide( optionTextWorldScale );
	
									// console.log(' 777777777777 ' , optionTextBGWroldScale, optionTextWorldScale , Entity.object3D, Entity.object3D.scale, Entity.object3D.parent.scale, Entity.object3D.parent.parent.scale, Entity.object3D.parent.parent.parent.scale );
	
									//// 圓圈位置設定方式為「選項文字高度」 + 「圓圈本身高度」，前者以「 文字結構的左右計算得來」
									//// 目前看來，縱軸也需要些微調整，但是不確定方法。暫放
									let textWidth = Math.abs( Entity.getObject3D("mesh").geometry.attributes.position.array[0] )*2;
									// let textHeight = Math.abs( Entity.getObject3D("mesh").geometry.attributes.position.array[1] )*2;
	
									circlePos.x = -circleScale.x*0.5 - textWidth * 0.6;
									// circlePos.y = -textHeight * 0.5;
									
	
									let base = document.createElement("a-plane");
									base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
									base.setAttribute("id", Entity.object3D.parent.el.id + "_circle_base");
									base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
									
									self.setAframeTransform( base, circlePos, circleRot, circleScale, quaternion );
	
									Entity.appendChild(base);
		
									let circle = document.createElement("a-plane");
									circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
									circle.setAttribute("id", Entity.object3D.parent.el.id + "_circle_out");
									circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
									self.setAframeTransform( circle, circlePos, circleRot, circleScale, quaternion );
									Entity.appendChild(circle);
									
									let circle2 = document.createElement("a-plane");
									circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
									circle2.setAttribute("id", Entity.object3D.parent.el.id + "_circle_in");
									circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
									circle2.setAttribute( "visible", false);
									circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
									self.setAframeTransform( circle2, circlePos, circleRot, circleScale, quaternion );
									Entity.appendChild(circle2);
		
	
	
	
	
									
									// console.log(" *** pOption set scale " , Entity.object3D , Entity.object3D.parent.scale.x  );
									// let width = Math.abs(Entity.getObject3D("mesh").geometry.attributes.position.array[0])*2;
									// circlePos.x = circlePos.x + width*0.5 + 0.25/Entity.object3D.parent.scale.x;
									// circlePos.z = circlePos.z + 0.01;
									// base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
									// circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
									// circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
									
		
									// circleScale.multiply( new THREE.Vector3( 0.35 , 0.35 , 0.35 ) );
									// circleScale.divide( Entity.object3D.parent.scale );
									// base.setAttribute("scale" , circleScale );
									// circle.setAttribute("scale" , circleScale );
									// circle2.setAttribute("scale" , circleScale.clone().multiply( new THREE.Vector3( 0.7,0.7,0.7 ) ) );
							
		
								}
								else{
									//// 對於『圖片格式的多選題』，需要在下方加上『圓框』，先等到『選項圖片』載入完成，個別掛載圖片上去
	
									let timeoutID2 = setInterval( function () {
										if (Entity.getAttribute("heightForQuiz")){ 
											
											//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
											//// 這樣確保圓圈比例維持，且大小隨著選項而變動
											let optionImgWorldScale = Entity.object3D.getWorldScale(new THREE.Vector3());
											let optionImgLocalScale = Entity.object3D.scale.clone()  ;
											let maxS = Math.max( optionImgLocalScale.x , optionImgLocalScale.y );
	
											circleScale.multiply(  new THREE.Vector3( 50, 50, 50 ).multiplyScalar( maxS )  );
											circleScale.divide( optionImgWorldScale );
	
											//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
											let optionImageScale = Entity.object3D.children[0].scale.clone() ; 										
											circlePos.y = -circleScale.y*0.5 - optionImageScale.y * 0.6;
	
											
											let base = document.createElement("a-plane");
											base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
											base.setAttribute("id", Entity.id + "_circle_base");
											base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
											self.setAframeTransform( base, circlePos, circleRot, circleScale, quaternion );
	
											Entity.appendChild(base);
				
											let circle = document.createElement("a-plane");
											circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
											circle.setAttribute("id", Entity.id + "_circle_out");
											circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
											self.setAframeTransform( circle, circlePos, circleRot, circleScale, quaternion );
											Entity.appendChild(circle);
											
											let circle2 = document.createElement("a-plane");
											circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
											circle2.setAttribute("id", Entity.id + "_circle_in");
											circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
											circle2.setAttribute( "visible", false);
											circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
											self.setAframeTransform( circle2, circlePos, circleRot, circleScale, quaternion );
											Entity.appendChild(circle2);
			
											window.clearInterval(timeoutID2);
	
										}
									}, 100 );
	
	
	
	
								
								// 	let timeoutID = setInterval( function () {
								// 		for (let j = 0, len = self.makarObjects.length; j < len; j++ ){
								// 			if (first_question.options_json[i].obj_id == self.makarObjects[j].obj_id && self.makarObjects[j].children[0] ){
								// 				window.clearInterval(timeoutID);
								// 				Entity = self.makarObjects[j] ;
								// 				console.log(" *** got obj = ", j, Entity , first_question.options_json[i] );
		
								// 				let width =  Math.abs( Entity.children[0].geometry.attributes.position.array[1]*2);
								// 				let optionImgWorldScale = Entity.getWorldScale(new THREE.Vector3());
								// 				// console.log("three.js: _loadQuiz: _MutiOption_Image: Entity=" , Entity.scale, optionImgWorldScale );
		
								// 				let tLoader = new THREE.TextureLoader();
								// 				let resUrl;
								// 				//// 內層圓圈
								// 				resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
								// 				tLoader.load(resUrl, function(texture){
								// 					let circle_base = new THREE.Mesh( 
								// 						new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
								// 						new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
								// 					);
								// 					circle_base.name = "circle_base";
								// 					circle_base.position.y = -width/2 - 20/optionImgWorldScale.y ;//// 向下位移經驗上固定距離，需要normalize 上層大小
								// 					circle_base.scale.copy( new THREE.Vector3(0.35,0.35,0.35).divide(optionImgWorldScale) ); //// 大小normalize 上層大小
								// 					// console.log("three.js: _loadQuiz: _MutiOption_Image: circle_base=" , circle_base, circle_base.scale , optionImgWorldScale, optionImgWorldScale.x );
								// 					Entity.children[0].add(circle_base);
								// 				});
								// 				//// 外層圓圈
								// 				resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
								// 				tLoader.load(resUrl, function(texture){
								// 					let circle_out = new THREE.Mesh( 
								// 						new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
								// 						new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
								// 					);
								// 					circle_out.name = "circle_out";
								// 					circle_out.renderOrder = 1;
								// 					circle_out.position.y = -width/2 - 20/optionImgWorldScale.y ;//// 向下位移經驗上固定距離，需要normalize 上層大小
								// 					circle_out.scale.copy( new THREE.Vector3(0.27,0.27,0.27).divide(optionImgWorldScale) ); //// 大小normalize 上層大小
								// 					// console.log("three.js: _loadQuiz: _MutiOption_Image: circle_out=" , circle_out, circle_out.scale , optionImgWorldScale, optionImgWorldScale.x );
								// 					Entity.children[0].add(circle_out);
								// 				});
		
								// 				//// 『選到』圓圈
								// 				resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
								// 				tLoader.load(resUrl, function(texture){
								// 					let circle_in = new THREE.Mesh( 
								// 						new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
								// 						new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
								// 					);
								// 					circle_in.name = "circle_in";
								// 					circle_in.renderOrder = 1;
								// 					circle_in.visible = false; //// 預設為『沒有選取』
								// 					circle_in.position.y = -width/2 - 20/optionImgWorldScale.y ;//// 向下位移經驗上固定距離，需要normalize 上層大小
								// 					circle_in.scale.copy( new THREE.Vector3(0.23,0.23,0.23).divide(optionImgWorldScale) ); //// 大小normalize 上層大小
								// 					// console.log("three.js: _loadQuiz: _MutiOption_Image: circle_in=" , circle_in , circle_in.scale );
								// 					Entity.children[0].add(circle_in);
								// 				});
								// 			}
								// 		}
								// 	}, 10);	
	
								}
	
	
	
	
							});
	
							
						}
					}

				}
				

				//// 倒數計時器
				//// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
				if (self.quizModule[ self.currentProjectIndex ].timer.counter >= 0){
					self.quizModule[ self.currentProjectIndex ].qClock = Date.now();
				  	let timeoutID = setInterval(function() {
						self.quizModule[ self.currentProjectIndex ].timer.currentTimer = timeoutID;
						self.quizModule[ self.currentProjectIndex ].timer.counter -= 1;
						// let timer = document.getElementById("timerDiv");
						
						let hour = Math.floor(self.quizModule[ self.currentProjectIndex ].timer.counter/3600);
						let min = Math.floor((self.quizModule[ self.currentProjectIndex ].timer.counter-hour*3600)/60);
						let sec = self.quizModule[ self.currentProjectIndex ].timer.counter-hour*3600-min*60;
						timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
						
						if (self.quizModule[ self.currentProjectIndex ].timer.counter == 0){
							//// 在quiz模組中，所有物件都是 quiz 的子物件。在時間到的時候，刪除子物件，然後進入下一題或是結束。

							console.log("three.js: _quiz: time out " , obj.module[0] );

							window.clearInterval(self.quizModule[ self.currentProjectIndex ].timer.currentTimer);
							if (obj.module[0].timer_type == "Custom"){
								if (first_question.show_score){
									let scoreDiv = document.getElementById("scoreDiv");
									let score = document.getElementById("score");
									scoreDiv.style.display = "block";
									//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
									scoreDiv.onclick = function(){
										scoreDiv.style.display = "none";
										self.nextQuestion();
									}

									score.textContent = self.quizModule[ self.currentProjectIndex ].score;
									
								} else {
									self.nextQuestion();
								}
							}
							else{
								

								let tipButtonDiv = document.getElementById("tipButtonDiv");
								let tipDiv = document.getElementById("tipDiv");
								tipButtonDiv.style.display = "none";
								tipDiv.style.display = "none";

								let startQuiz = document.getElementById("startQuiz");
								let QuizStartButton = document.getElementById("QuizStartButton");
								let QuizStartContent = document.getElementById("QuizStartContent");
								startQuiz.style.display = "block";
								// QuizStartContent.textContent = "時間到"
								QuizStartContent.textContent = worldContent.timeIsUp[languageType];

								QuizStartButton.onclick = function(){
									startQuiz.style.display = "none";
									self.nextQuestion();
								};
								// QuizStartButton.addEventListener("click",function(){
								// 	startQuiz.style.display = "none";
								// 	self.nextQuestion();
								// });
							}

							let quizIndex = {
								question: idx ,
								get_score:  0,
								answer_time: self.quizModule[ self.currentProjectIndex ].json.question_list[idx].time_limit ,
								answer_options: [],
								answer_cloze: "",
								answer_is_enable: false,
								answer_is: false,
							}
							self.quizModule[ self.currentProjectIndex ].record[idx] = quizIndex;
							self.quizModule[ self.currentProjectIndex ].record_time += self.quizModule[ self.currentProjectIndex ].json.question_list[idx].time_limit;
							self.quizModule[ self.currentProjectIndex ].qClock = Date.now();

							console.log("three.js: _loadQuiz: module=" , quizIndex , self.quizModule[ self.currentProjectIndex ] );

						}
				  	},1000);
			  	}


			}


			//// quiz 2D 按鈕
			
			this.clickQuiz2DButton = function( target ){

				let quizModule;
				target.traverseAncestors( function( p ){
					if ( p.quizModule ){
						quizModule = p.quizModule;
						console.log('three.js: _clickQuiz2DButton: get quizModule ', p , target );
					}
				});

				let answer_options = []; //// 答題 index
				let answer_is = false; //// 答對與否
				let get_score = 0;
				let idx = quizModule.json.display_order_list[ quizModule.currentQuestionIndex].index;
				let currectQuestion = quizModule.json.question_list[idx];
				let scoreType = quizModule.json.score_type;

				let makarDragon = document.getElementById("makarDragon");
				let makarDragonWholeMaskDiv = document.getElementById("makarDragonWholeMaskDiv");
				let imgRight = document.getElementById("imgRight");
				let imgWrong = document.getElementById("imgWrong");

				let targetId = target.obj_id;

				//// 單選題
				if (currectQuestion.option_type == "Option_Text" || currectQuestion.option_type == "Option_Image"){


					if (currectQuestion.answer_list == null){
						currectQuestion.answer_list = []
					}
					let correctAnswerIdx = currectQuestion.answer_list[0];
					let correctAnswer = currectQuestion.options_json[correctAnswerIdx-1];
					
					console.log("three.js: _clickQuiz2DButton: single target=" , target );

					

					// //// 查找紀錄『選了哪個選項』
					for (let i = 0, len=currectQuestion.options_json.length; i < len; i++ ){
						if ( currectQuestion.options_json[i].obj_id == targetId ){
							answer_options.push(i);
						}
					}

					if (correctAnswer.obj_id == targetId){
						if (currectQuestion.active_score){
							if (scoreType == 'Custom'){
								quizModule.score += currectQuestion.score;
								get_score = currectQuestion.score;
							}
							else if(scoreType == 'Total'){
								let scoreTotal = quizModule.json.total_score;
								quizModule.correctAnswer += 1;
								quizModule.score =  Math.round(scoreTotal * quizModule.correctAnswer / quizModule.totalActiveScoreQuestion);
								get_score = Math.round( scoreTotal / quizModule.totalActiveScoreQuestion );
							}
						}
						answer_is = true;
						makarDragon.style.display = "block";
						makarDragonWholeMaskDiv.style.display = 'block';
						imgRight.style.display = "block";
						imgWrong.style.display = "none";
						console.log("three.js: _clickQuiz2DButton: Congratulations! Correct Answer!");
					}
					else{
						answer_is = false;
						makarDragon.style.display = "block";
						makarDragonWholeMaskDiv.style.display = 'block';
						imgRight.style.display = "none";
						imgWrong.style.display = "block";
						console.log("three.js: _clickQuiz2DButton: 叭叭~ Incorrect Answer!");
					}
					window.clearInterval( quizModule.timer.currentTimer);
					
					setTimeout(function(){
						
						makarDragon.style.display = "none";
						makarDragonWholeMaskDiv.style.display = 'none';
						// 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
						console.log("three.js: _clickQuiz2DButton: score , currectQuestion = ", idx, quizModule , quizModule["choices"] , answer_options , get_score );
						let quizIndex = {
							question: idx ,
							get_score:  get_score,
							answer_time: Math.round( (Date.now() - quizModule.qClock)/1000 ),
							answer_options: answer_options,
							answer_cloze: "",
							answer_is_enable: true,
							answer_is: answer_is,
						}
						quizModule.record[idx] = quizIndex;
						quizModule.record_time += Math.round( (Date.now() - quizModule.qClock)/1000 );
						quizModule.qClock = Date.now();
						
						if (currectQuestion.show_score){
							let scoreDiv = document.getElementById("scoreDiv");
							let score = document.getElementById("score");
							scoreDiv.style.display = "block";

							//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
							scoreDiv.onclick = function(){
								scoreDiv.style.display = "none";
								self.nextQuestion2D( quizModule );
							}

							score.textContent = quizModule.score;
							
						}
						else{
							self.nextQuestion2D( quizModule );
						}

					},1600);
					console.log("three.js: _clickQuiz2DButton: score: ", quizModule.score , currectQuestion );



				} else if ( currectQuestion.option_type == "MutiOption_Text" || currectQuestion.option_type == "MutiOption_Image" ) {
					//// 多選題
					if ( target.makarType == 'text2D' || target.makarType == 'image2D' ){

						//// 更改選項「選取狀態」
						target.traverse( function( child ){
							if ( child.isMesh ){
								if ( child.name == 'circle_in' ){

									child.visible = !child.visible;

									//// 假如此選項曾經選擇過，需要移除。反之，加入 
									if ( quizModule["choices"].includes(targetId) ){
										let choices_idx = quizModule["choices"].indexOf(targetId);
										quizModule["choices"].splice(choices_idx,1);
									}else{
										quizModule["choices"].push(targetId);
									}

								}

								if ( child.name == 'circle_out' ){
									if (child.material.color.getHexString() == "7b7b7b" ){
										child.material.color.setStyle( "#00d1c1" );
									}else if ( child.material.color.getHexString() == "00d1c1" ){
										child.material.color.setStyle( "#7b7b7b" );
									}
								}

							}

						});

					}

					//// 判斷是否點擊到『確認按鈕』
					if (target.sub_type == "button"){

						let correctCount = 0;
						if (currectQuestion.answer_list == null){
							currectQuestion.answer_list = []
						}
						for (let correct_idx of currectQuestion.answer_list){
							correctAnswer = currectQuestion.options_json[correct_idx];
							if (correctAnswer){
								for (let choicesId of quizModule["choices"]){
									if(choicesId == correctAnswer.obj_id){
										correctCount += 1;
									}
								}
							}
						}

						for (let i = 0, len = currectQuestion.options_json.length; i < len; i++ ){
							for (let j = 0, len2 = quizModule["choices"].length; j < len2; j++ ){
								if (currectQuestion.options_json[i].obj_id == quizModule["choices"][j] ){
									answer_options.push( i-1 );
								}
							}
						}

						if (correctCount == currectQuestion.answer_list.length && currectQuestion.answer_list.length == quizModule["choices"].length){
							if (currectQuestion.active_score){
								if (scoreType == 'Custom'){
									quizModule.score += currectQuestion.score;
									get_score = currectQuestion.score;
								}
								else if(scoreType == 'Total'){
									let scoreTotal = quizModule.json.total_score;
									quizModule.correctAnswer += 1;
									quizModule.score =  Math.round(scoreTotal * quizModule.correctAnswer / quizModule.totalActiveScoreQuestion);
									get_score = Math.round( scoreTotal / quizModule.totalActiveScoreQuestion );
								}
							}
							answer_is = true;
							makarDragon.style.display = "block";
							makarDragonWholeMaskDiv.style.display = 'block';
							imgRight.style.display = "block";
							imgWrong.style.display = "none";
							console.log("three.js: _clickQuiz2DButton: Congratulations! Correct Answer!");
						}
						else{
							answer_is = false;
							makarDragon.style.display = "block";
							imgRight.style.display = "none";
							imgWrong.style.display = "block";
							console.log("three.js: _clickQuiz2DButton: 叭叭~ Incorrect Answer!");
						}
						window.clearInterval( quizModule.timer.currentTimer);

						//// 播放動畫 1.6 second
						setTimeout(function(){
						
							makarDragon.style.display = "none";
							makarDragonWholeMaskDiv.style.display = 'none';
							// 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
							console.log("three.js: _clickQuiz2DButton: score , currectQuestion = ", idx, quizModule , quizModule["choices"] , answer_options , get_score );
							let quizIndex = {
								question: idx ,
								get_score:  get_score,
								answer_time: Math.round( (Date.now() - quizModule.qClock)/1000 ),
								answer_options: answer_options,
								answer_cloze: "",
								answer_is_enable: true,
								answer_is: answer_is,
							}
							quizModule.record[idx] = quizIndex;
							quizModule.record_time += Math.round( (Date.now() - quizModule.qClock)/1000 );
							quizModule.qClock = Date.now();
							
							if (currectQuestion.show_score){
								let scoreDiv = document.getElementById("scoreDiv");
								let score = document.getElementById("score");
								scoreDiv.style.display = "block";

								//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
								scoreDiv.onclick = function(){
									scoreDiv.style.display = "none";
									self.nextQuestion2D( quizModule );
								}

								score.textContent = quizModule.score;
								
							}
							else{
								self.nextQuestion2D( quizModule );
							}

						},1600);

					}

				} else {
					//// 未知狀況

					return;
				}



			}



			this.pushButton = function(target){

				let quizModule = self.quizModule[ self.currentProjectIndex ];

				let goNext = false;
				let answer_options = []; //// 答題 index
				let answer_is = false; //// 答對與否
				let get_score = 0;
				let idx = quizModule.json.display_order_list[ quizModule.currentQuestionIndex].index;
				let currectQuestion = quizModule.json.question_list[idx];
				let scoreType = quizModule.json.score_type;

				let makarDragon = document.getElementById("makarDragon");
				let makarDragonWholeMaskDiv = document.getElementById("makarDragonWholeMaskDiv");
				let imgRight = document.getElementById("imgRight");
				let imgWrong = document.getElementById("imgWrong");

				console.log("three.js: _pushButton: quizModule=" , quizModule , currectQuestion );

				//// 單選題
				if (currectQuestion.option_type == "Option_Text" || currectQuestion.option_type == "Option_Image"){

					if (currectQuestion.answer_list == null){
						currectQuestion.answer_list = []
					}
					let correctAnswerIdx = currectQuestion.answer_list[0];
					let correctAnswer = currectQuestion.options_json[correctAnswerIdx-1];
					
					console.log("three.js: _pushButton: single target=" , target.el.id );

					let targetId = target.el.id;

					// //// 查找紀錄『選了哪個選項』
					for (let i = 0, len=currectQuestion.options_json.length; i < len; i++ ){
						if ( currectQuestion.options_json[i].obj_id == targetId ){
							// console.log(" ***********   " , i , currectQuestion.options_json );
							answer_options.push(i);
						}
					}

					if (correctAnswer.obj_id == targetId){
						if (currectQuestion.active_score){
							if (scoreType == 'Custom'){
								quizModule.score += currectQuestion.score;
								get_score = currectQuestion.score;
							}
							else if(scoreType == 'Total'){
								let scoreTotal = quizModule.json.total_score;
								quizModule.correctAnswer += 1;
								quizModule.score =  Math.round(scoreTotal * quizModule.correctAnswer / quizModule.totalActiveScoreQuestion);
								get_score = Math.round( scoreTotal / quizModule.totalActiveScoreQuestion );
							}
						}
						answer_is = true;
						makarDragon.style.display = "block";
						makarDragonWholeMaskDiv.style.display = 'block';
						imgRight.style.display = "block";
						imgWrong.style.display = "none";
						console.log("three.js: _pushButton: Congratulations! Correct Answer!");
					}
					else{
						answer_is = false;
						makarDragon.style.display = "block";
						makarDragonWholeMaskDiv.style.display = 'block';
						imgRight.style.display = "none";
						imgWrong.style.display = "block";
						console.log("three.js: _pushButton: 叭叭~ Incorrect Answer!");
					}
					window.clearInterval( quizModule.timer.currentTimer);
					
					setTimeout(function(){
						
						makarDragon.style.display = "none";
						makarDragonWholeMaskDiv.style.display = 'none';
						// 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
						console.log("three.js: score , currectQuestion = ", idx, quizModule , quizModule["choices"] , answer_options , get_score );
						let quizIndex = {
							question: idx ,
							get_score:  get_score,
							answer_time: Math.round( (Date.now() - quizModule.qClock)/1000 ),
							answer_options: answer_options,
							answer_cloze: "",
							answer_is_enable: true,
							answer_is: answer_is,
						}
						quizModule.record[idx] = quizIndex;
						quizModule.record_time += Math.round( (Date.now() - quizModule.qClock)/1000 );
						quizModule.qClock = Date.now();
						
						if (currectQuestion.show_score){
							let scoreDiv = document.getElementById("scoreDiv");
							let score = document.getElementById("score");
							scoreDiv.style.display = "block";

							//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
							scoreDiv.onclick = function(){
								scoreDiv.style.display = "none";
								self.nextQuestion();
							}

							score.textContent = quizModule.score;
							
						}
						else{
							self.nextQuestion();
						}

					},1600);
					console.log("three.js: _pushButton: score: ", quizModule.score , currectQuestion );

				}
				else{
					//// 多選題

					console.log("three.js: _pushButton: target=" , target );

					let targetId;
					
					if ( target.makarType == 'text' || target.makarType == 'image' ){

						targetId = target.el.id;

						target.traverse( function( child ){
							if ( child.isGroup ){
								if ( child.el ){
									if ( child.el.id == target.el.id + '_circle_in' ){
										console.log(' 555555555555555 _circle_in' , child  );
										child.visible = !child.visible;

										// let targetId = target.obj_id;

										//// 假如此選項曾經選擇過，需要移除。反之，加入 
										if ( quizModule["choices"].includes(targetId) ){
											let choices_idx = quizModule["choices"].indexOf(targetId);
											quizModule["choices"].splice(choices_idx,1);
										}else{
											quizModule["choices"].push(targetId);
										}

									}
								}
							}

							if ( child.isMesh ){
								if ( child.el ){
									if ( child.el.id == target.el.id + '_circle_out' ){
										console.log(' 555555555555555 _circle_out' , child  );
										
										if (child.material.color.getHexString() == "7b7b7b" ){
											child.material.color.setStyle( "#00d1c1" );
										}else if ( child.material.color.getHexString() == "00d1c1" ){
											child.material.color.setStyle( "#7b7b7b" );
										}
									}
								}
							}

						});

					} else  {

					}


					//// 判斷是否點擊到『確認按鈕』
					if (target.sub_type == "button"){

						let correctCount = 0;
						if (currectQuestion.answer_list == null){
							currectQuestion.answer_list = []
						}
						for (let correct_idx of currectQuestion.answer_list){
							correctAnswer = currectQuestion.options_json[correct_idx];
							if (correctAnswer){
								for (let choicesId of quizModule["choices"]){
									if(choicesId == correctAnswer.obj_id){
										correctCount += 1;
									}
								}	
							}
						}

						for (let i = 0, len = currectQuestion.options_json.length; i < len; i++ ){
							for (let j = 0, len2 = quizModule["choices"].length; j < len2; j++ ){
								if (currectQuestion.options_json[i].obj_id == quizModule["choices"][j] ){
									answer_options.push( i-1 );
								}
							}
						}

						if (correctCount == currectQuestion.answer_list.length && currectQuestion.answer_list.length == quizModule["choices"].length){
							if (currectQuestion.active_score){
								if (scoreType == 'Custom'){
									quizModule.score += currectQuestion.score;
									get_score = currectQuestion.score;
								}
								else if(scoreType == 'Total'){
									let scoreTotal = quizModule.json.total_score;
									quizModule.correctAnswer += 1;
									quizModule.score =  Math.round(scoreTotal * quizModule.correctAnswer / quizModule.totalActiveScoreQuestion);
									get_score = Math.round( scoreTotal / quizModule.totalActiveScoreQuestion );
								}
							}
							answer_is = true;
							makarDragon.style.display = "block";
							makarDragonWholeMaskDiv.style.display = 'block';
							imgRight.style.display = "block";
							imgWrong.style.display = "none";
							console.log("three.js: _pushButton: Congratulations! Correct Answer!");
						}
						else{
							answer_is = false;
							makarDragon.style.display = "block";
							imgRight.style.display = "none";
							imgWrong.style.display = "block";
							console.log("three.js: _pushButton: 叭叭~ Incorrect Answer!");
						}
						window.clearInterval( quizModule.timer.currentTimer);

						//// 播放動畫 1.6 second
						setTimeout(function(){
						
							makarDragon.style.display = "none";
							makarDragonWholeMaskDiv.style.display = 'none';
							// 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
							console.log("three.js: score , currectQuestion = ", idx, quizModule , quizModule["choices"] , answer_options , get_score );
							let quizIndex = {
								question: idx ,
								get_score:  get_score,
								answer_time: Math.round( (Date.now() - quizModule.qClock)/1000 ),
								answer_options: answer_options,
								answer_cloze: "",
								answer_is_enable: true,
								answer_is: answer_is,
							}
							quizModule.record[idx] = quizIndex;
							quizModule.record_time += Math.round( (Date.now() - quizModule.qClock)/1000 );
							quizModule.qClock = Date.now();
							
							if (currectQuestion.show_score){
								let scoreDiv = document.getElementById("scoreDiv");
								let score = document.getElementById("score");
								scoreDiv.style.display = "block";

								//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
								scoreDiv.onclick = function(){
									scoreDiv.style.display = "none";
									self.nextQuestion();
								}

								score.textContent = quizModule.score;
								
							}
							else{
								self.nextQuestion();
							}
	
						},1600);

					}
				}

			}


			///// quiz 2D 下一題功能，注意此程序必須基於「quiz物件」
			
			this.nextQuestion2D = function( quizModule ){
				console.log('three.js: _nextQuestion2D: _quizModule = ', quizModule );

				//// 清空「已選擇」
				quizModule["choices"] = [];
				let quizObject = quizModule.quizObject;

				//// 先將 quiz 底下的子物件暫存下來，陸續檢查對應的 makarObjects 物件，將其從中剔除掉
				let temp = [];
				for (let item of quizObject.children) {
					temp.push(item);
				}

				temp.forEach(function(item){
					for (let i = 0; i < self.makarObjects2D.length; i++ ){
						if (self.makarObjects2D[i].obj_id == item.obj_id ){
							let makarObject2D = self.makarObjects2D[i];							
							quizObject.remove( makarObject2D );
							self.makarObjects2D.splice(i,1);
						}
					}
				});

				//// 設定為下一題
				quizModule.currentQuestionIndex += 1;
				if ( quizModule.currentQuestionIndex < quizModule.json.display_order_list.length){
					////找出對應的『下一題』
					let idx = quizModule.json.display_order_list[ quizModule.currentQuestionIndex].index;
					let next_question = quizModule.json.question_list[idx];
					//// 時間限制部份
					if( quizModule.json.timer_type == "Custom"){
						quizModule.timer.counter = next_question.time_limit;
					}
					//// 提示部份
					let tipButtonDiv = document.getElementById("tipButtonDiv");
					if(next_question.show_tips){
						tipButtonDiv.style.display = "block";
						tipButtonDiv.addEventListener("click",function(){
							let tipDiv = document.getElementById("tipDiv");
							let tipConfirmButton = document.getElementById("tipConfirmButton");
							let tipContent = document.getElementById("tipContent");
							tipDiv.style.display = "block";
							tipContent.textContent = next_question.tips_content;
							tipConfirmButton.addEventListener("click",function(){
								tipDiv.style.display = "none";
							});
						});
					}
					else{
						tipButtonDiv.style.display = "none";
					}

					////載入下一題的場景

					// let markerRoot = quizEntity.parentEl;
					let markerRoot2D = quizObject.parent;
					
					//// 載入題目
					if ( next_question.questions_json && Array.isArray( next_question.questions_json ) ){
						for(let i=0; i<next_question.questions_json.length; i++){

							let qObj = next_question.questions_json[i];
	
							let position = new THREE.Vector3().fromArray( qObj.transform[0].split(",").map(function(x){return Number(x)}) );
							let rotation = new THREE.Vector3().fromArray( qObj.transform[1].split(",").map(function(x){return Number(x)}) );
							let scale    = new THREE.Vector3().fromArray( qObj.transform[2].split(",").map(function(x){return Number(x)}) );
							let type = qObj.main_type;
							
							let pQuestion;
							switch(type){
								case "text":
									pQuestion = self.loadAframeText2D( markerRoot2D, qObj, i, next_question.questions_json.length, position, rotation, scale );
									break;
								case "image":
									let resUrl = next_question.questions_json[i].res_url;
									resUrl = self.dealImageUrl( next_question.questions_json[i] );
									pQuestion = self.loadAframeTexture2D( markerRoot2D, qObj, resUrl , i, next_question.questions_json.length, position, rotation, scale );
									break;
							}
						}

					}

					//// 載入選項
					for(let i=0; i<next_question.options_json.length; i++){

						let optionObj = next_question.options_json[i];

						let position = new THREE.Vector3().fromArray( optionObj.transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray( optionObj.transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray( optionObj.transform[2].split(",").map(function(x){return Number(x)}) );
						let type = optionObj.sub_type;

						console.log("three.js: _nextQuestion2D: _loadOption: ", i , type , next_question.options_json[i] )

						
						let textureUrl = optionObj.res_url;
						textureUrl = self.dealImageUrl( optionObj );

						let pOptionObj;
						
						switch(type){
							case "txt":
								pOptionObj = self.loadAframeText2D( markerRoot2D, optionObj, i, next_question.options_json.length, position, rotation, scale );
								break;
							case "gif":
							case "jpg":
							case "jpeg":
							case "png":
								pOptionObj = self.loadAframeTexture2D( markerRoot2D, optionObj, textureUrl , i, next_question.options_json.length, position, rotation, scale );
								break;							
							case "button":
								textureUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
								pOptionObj = self.loadAframeTexture2D( markerRoot2D, optionObj, textureUrl , i, next_question.options_json.length, position, rotation, scale );
								break;
						}
						

						//// 多選題要讓「選項物件」增加「圓圈」
						if (type != "button" && (next_question.option_type == "MutiOption_Text"|| next_question.option_type == "MutiOption_Image")){
							pOptionObj.then( function( ret ){

								let optionObject = ret;

								let circlePos = new THREE.Vector3(0,0,0);
								let circleRot = new THREE.Vector3(0,0,0);
								let circleScale = new THREE.Vector3(1,1,1);

								let quaternion = new THREE.Quaternion( );

								if ( next_question.option_type == "MutiOption_Text"){
									//// 文字選項，圓圈加在左方

									let optionTextBG = optionObject.children[0].children[1];
									// let optionText2DBGWorldScale = optionTextBG.getWorldScale( new THREE.Vector3() );
									let optionText2DBGLocalScale = optionTextBG.scale.clone();
									let optionText2DCoWorldScale = optionObject.children[0].getWorldScale( new THREE.Vector3() ) ;
									// let optionText2DCoLocalScale = optionObject.children[0].scale.clone() ;
									
									// let sumScale = optionTextBG.scale.clone();
									// optionTextBG.traverseAncestors( function( p ){
									// 	if ( p.scale ){
									// 		sumScale.multiply( p.scale )
									// 		console.log('s = ' , p.scale , sumScale );
									// 	}
									// });

									let minS = Math.min( optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , 
														optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height ,
														1000000 );

									circleScale.multiply(  new THREE.Vector3( 0.8 , 0.8 , 0.8 ).multiplyScalar( minS )  );
									circleScale.divide( optionText2DCoWorldScale );

									//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
									let optionImageScale = optionTextBG.geometry.parameters.width * optionText2DBGLocalScale.x  ;

									let tLoader = new THREE.TextureLoader();

									//// 內層圓圈 、 選到圓圈
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
									tLoader.load(resUrl, function(texture){

										circlePos.x = -optionImageScale * 0.5 - 80 * 0.6 * circleScale.x ;

										let circle_base = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
										);
										circle_base.name = "circle_base";
										circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
										// optionObject.add( circle_base );
										optionObject.children[0].add( circle_base );

										//// 選到圓圈
										let circle_in = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
										);
										circle_in.name = "circle_in";
										circle_in.renderOrder = 1;
										circle_in.visible = false; //// 預設為『沒有選取』
										circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
										// optionObject.add( circle_in );
										optionObject.children[0].add( circle_in );
									});

									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
									tLoader.load(resUrl, function(texture){
										
										circlePos.x = -optionImageScale * 0.5 - 80 * 0.6 * circleScale.x ;

										// //// 外層圓圈
										let circle_out = new THREE.Mesh( 
											new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
										);
										circle_out.name = "circle_out";
										circle_out.renderOrder = 1;
										circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
										// optionObject.add( circle_out );

										optionObject.children[0].add( circle_out );

									});



								} else {

									let resUrl = "";

									//// 圖片選項，圓圈加在下方

									//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
									//// 這樣確保圓圈比例維持，且大小隨著選項而變動
									let optionImgWorldScale = optionObject.getWorldScale(new THREE.Vector3());
									let optionImgLocalScale = optionObject.scale.clone()  ;
									// let maxS = Math.max( optionImgLocalScale.x , optionImgLocalScale.y );

									let maxS = Math.max( optionImgLocalScale.x * optionObject.children[0].geometry.parameters.width , 
														optionImgLocalScale.y * optionObject.children[0].geometry.parameters.height  );

									circleScale.multiply(  new THREE.Vector3( 0.0025 , 0.0025 , 0.0025 ).multiplyScalar( maxS )  );
									circleScale.divide( optionImgWorldScale );

									//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
									let optionImageScale = optionObject.children[0].scale.clone() ;
									let optionImageHeight = optionObject.children[0].geometry.parameters.height;

									let tLoader = new THREE.TextureLoader();

									//// 內層圓圈 、 選到圓圈
									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
									tLoader.load(resUrl, function(texture){

										// circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 60 * 0.6 * circleScale.y ;
										circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;

										let circle_base = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
										);
										circle_base.name = "circle_base";
										circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
										optionObject.add( circle_base );

										//// 選到圓圈
										let circle_in = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
										);
										circle_in.name = "circle_in";
										circle_in.renderOrder = 1;
										circle_in.visible = false; //// 預設為『沒有選取』
										circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
										optionObject.add( circle_in );
									});

									resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
									tLoader.load(resUrl, function(texture){
										
										// circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 60 * 0.6 * circleScale.y ;
										circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;

										// //// 外層圓圈
										let circle_out = new THREE.Mesh( 
											// new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
											new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
											new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
										);
										circle_out.name = "circle_out";
										circle_out.renderOrder = 1;
										circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
										circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
										optionObject.add( circle_out );

									});


								}
							});
						}


						
					}

					//// 處理『自訂時間』
					if( quizModule.json.timer_type == "Custom"){
						if ( quizModule.timer.counter >= 0){
							let timer = document.getElementById("timerDiv");
							let hour = Math.floor( quizModule.timer.counter/3600);
							let min = Math.floor(( quizModule.timer.counter-hour*3600)/60);
							let sec = quizModule.timer.counter-hour*3600-min*60;
							timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
						}
					}

					setTimeout(function(){

						//// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
			
						if ( quizModule.timer.counter >= 0){
							quizModule.qClock = Date.now();
							let timeoutID = setInterval(function() {
								quizModule.timer.currentTimer = timeoutID;
								quizModule.timer.counter -= 1;

								// let timer = document.getElementById("timerDiv");
								let hour = Math.floor( quizModule.timer.counter/3600);
								let min = Math.floor(( quizModule.timer.counter-hour*3600)/60);
								let sec = quizModule.timer.counter-hour*3600-min*60;
								timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
								
								if ( quizModule.timer.counter == 0){
									window.clearInterval( quizModule.timer.currentTimer);
									if ( quizModule.json.timer_type == "Custom"){
										if (next_question.show_score){
											let scoreDiv = document.getElementById("scoreDiv");
											let score = document.getElementById("score");
											scoreDiv.style.display = "block";

											//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
											scoreDiv.onclick = function(){
												scoreDiv.style.display = "none";
												self.nextQuestion();
											}

											score.textContent = quizModule.score;
											
										}
										else{
											self.nextQuestion();
										}
									}
									else{
										let temp = []
										let quizEntity = quizModule.quizEntity;
										for (let item of quizEntity.children) {
											temp.push(item);
										}
										temp.forEach(function(item){
											if (item.obj_parent_id == quizEntity.obj_id){
												quizEntity.remove(item);
												for (let i = 0, len = self.makarObjects.length; i < len; i++ ){
													if (self.makarObjects[i] == item){
														self.makarObjects.splice(i,1);
													}
												}					
											}
										});


										// timer.style.display = "none";
										let tipButtonDiv = document.getElementById("tipButtonDiv");
										let tipDiv = document.getElementById("tipDiv");
										tipButtonDiv.style.display = "none";
										tipDiv.style.display = "none";
										
										let startQuiz = document.getElementById("startQuiz");
										let QuizStartButton = document.getElementById("QuizStartButton");
										let QuizStartContent = document.getElementById("QuizStartContent");
										startQuiz.style.display = "block";
										// QuizStartContent.textContent = "時間到"
										QuizStartContent.textContent = worldContent.timeIsUp[languageType];
										
										let quizIndex = {
											question: idx ,
											get_score:  0,
											answer_time: quizModule.json.question_list[idx].time_limit ,
											answer_options: [],
											answer_cloze: "",
											answer_is_enable: false,
											answer_is: false,
										}
										quizModule.record[idx] = quizIndex;
										quizModule.record_time += quizModule.json.question_list[idx].time_limit;
										quizModule.qClock = Date.now();

										QuizStartButton.onclick = function(){
											startQuiz.style.display = "none";
											self.nextQuestion();
										}
										// QuizStartButton.addEventListener("click",function(){
										// 	startQuiz.style.display = "none";
										// 	self.nextQuestion();
										// });
									}
								}
							},1000);
						}
						
						//// -------------------------------------------------------------- ////
						
					}, 3000);


				}else{
					//// 沒有下一題，把答題狀態上傳到雲端
					window.clearInterval( quizModule.timer.currentTimer);
					let timer = document.getElementById("timerDiv");
					timer.style.display = "none";
					let tipButtonDiv = document.getElementById("tipButtonDiv");
					let tipDiv = document.getElementById("tipDiv");
					tipButtonDiv.style.display = "none";
					tipDiv.style.display = "none";

					let quizEndDiv = document.getElementById("quizEndDiv");
					quizEndDiv.style.display = "block";
					quizEndDiv.addEventListener("click", function(){
						quizEndDiv.style.display = "none";
					});

					
					console.log("three.js: quiz end , quizModule.record = " , quizModule.record  );
         	 		let playing_user = "", device_id = "";
					if (localStorage.getItem("login_shared_id") ){
						playing_user = localStorage.getItem("login_shared_id");
					}
					if (localStorage.getItem("device_id")){
						device_id = localStorage.getItem("device_id");
					}

          			let quizARLogData  = {
						user_id: publishARProjs.result[self.currentProjectIndex].user_id,
						playing_user: playing_user, //// 在還沒有登入流程時候 一定要設為空字串
						proj_id: publishARProjs.result[self.currentProjectIndex].proj_id,
						proj_type: "ar",
						device_id: device_id,
						brand:"",
						os: navigator.userAgent , 
						location_long:0.0,
						location_lan:0.0,
						module:[ quizModule.json],
						record_time: quizModule.record_time,
						record_score: quizModule.score ,
						record: quizModule.record,

          			}
          
					//// 目前存放分為 『log資訊』給『數據分析』 跟 『專案遊玩資訊』給『viewer 查詢』 
					quizLog( window.serverUrl , quizARLogData);


				}


			}




			this.nextQuestion = function(){

				let quizModule = self.quizModule[ self.currentProjectIndex ];

				quizModule["choices"] = []
				let temp = []
			
				let quizEntity = quizModule.quizEntity;
				
				console.log(" three,js: _nextQuestion: quizModule = " , self.currentProjectIndex, quizModule  );

				//// 場景中的物件，保留『Quiz』本體，其他的都刪除。
				
				//// 先將 quiz 底下的子物件暫存下來，陸續檢查對應的 makarObjects 物件，將其從中剔除掉
				for (let item of quizEntity.children) {
					temp.push(item);
				}

				temp.forEach(function(item){
					for (let i = 0; i < self.makarObjects.length; i++ ){
						if (self.makarObjects[i].id == item.id){
							let makarObject = self.makarObjects[i];
							if(makarObject.getAttribute("src")){
								let id = makarObject.getAttribute("src").split('#')[1];
								if (document.getElementById(id)){
									document.getElementById(id).remove();
								}
							}
							makarObject.remove();
							self.makarObjects.splice(i,1);
						}
					}
				});


				quizModule.currentQuestionIndex += 1;
				if ( quizModule.currentQuestionIndex < quizModule.json.display_order_list.length){
					////找出對應的『下一題』
					let idx = quizModule.json.display_order_list[ quizModule.currentQuestionIndex].index;
					let next_question = quizModule.json.question_list[idx];
					//// 時間限制部份
					if( quizModule.json.timer_type == "Custom"){
						quizModule.timer.counter = next_question.time_limit;
					}
					//// 提示部份
					let tipButtonDiv = document.getElementById("tipButtonDiv");
					if(next_question.show_tips){
						tipButtonDiv.style.display = "block";
						tipButtonDiv.addEventListener("click",function(){
							let tipDiv = document.getElementById("tipDiv");
							let tipConfirmButton = document.getElementById("tipConfirmButton");
							let tipContent = document.getElementById("tipContent");
							tipDiv.style.display = "block";
							tipContent.textContent = next_question.tips_content;
							tipConfirmButton.addEventListener("click",function(){
								tipDiv.style.display = "none";
							});
						});
					}
					else{
						tipButtonDiv.style.display = "none";
					}

					////載入下一題的場景
					// let markerRoot = quizEntity.parent;
					let markerRoot = quizEntity.parentEl;
					
					//// 載入題目
					if ( next_question.questions_json && Array.isArray( next_question.questions_json ) ){
						for(let i=0; i<next_question.questions_json.length; i++){
							let position = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
							let rotation = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
							let scale    = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
							let type = next_question.questions_json[i].main_type;
							
							let pOption;
							switch(type){
								case "text":
	
									pOption = self.loadAframeText( markerRoot , next_question.questions_json[i] , position, rotation, scale  );
	
									break;
								case "image":
									let resUrl = "";
									resUrl = self.dealImageUrl( next_question.questions_json[i] );
									pOption = self.loadAframeTexture (markerRoot, resUrl, next_question.questions_json[i], position, rotation, scale); 
	
									break;
								case "video":
									// self.loadVideo( markerRoot, next_question.questions_json[i], position, rotation, scale);
									break;
								case "model":
	
									let gltfUrl = self.getUserRes_onlineRes( next_question.questions_json[i] );
									self.loadAframeGLTFModel(markerRoot , next_question.questions_json[i], position, rotation, scale, self.cubeTex );
	
									break;
								case "audio":
								
									self.loadAframeAudio( markerRoot, next_question.questions_json[i] , position, rotation, scale  );
									break;
							}
						}
					}
					

					//// 載入選項
					for(let i=0; i<next_question.options_json.length; i++){
						let position = new THREE.Vector3().fromArray(next_question.options_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
						let rotation = new THREE.Vector3().fromArray(next_question.options_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
						let scale    = new THREE.Vector3().fromArray(next_question.options_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
						let type = next_question.options_json[i].sub_type;
						console.log("three.js: _loadQuiz: _loadOption: ", i , type , next_question.options_json[i] )
						let Entity;

						let resUrl = "";
						if (type != "txt"){
							resUrl = self.dealImageUrl( next_question.options_json[i] );
						}
						
						let pOption;
						
						switch(type){
							case "txt":
								// next_question.options_json[i].main_type = "text";
								pOption = self.loadAframeText( markerRoot , next_question.options_json[i] , position, rotation, scale  );
								break;
							case "gif":
							case "jpg":
							case "jpeg":
							case "png":
								pOption = self.loadAframeTexture (markerRoot, resUrl, next_question.options_json[i], position, rotation, scale); 
								break;							
							case "button":
								resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
								pOption = self.loadAframeTexture (markerRoot, resUrl, next_question.options_json[i], position, rotation, scale); 
								break;
						}
						


						if (type != "button" && (next_question.option_type == "MutiOption_Text"|| next_question.option_type == "MutiOption_Image")){

							pOption.then( function( ret ){
								Entity = ret;

								Entity.object3D.matrixWorldNeedsUpdate = true;
								Entity.object3D.updateMatrixWorld();

								let circlePos = new THREE.Vector3(0,0,0);
								let circleRot = new THREE.Vector3(0,0,0);
								let circleScale = new THREE.Vector3(1,1,1);
								let quaternion = new THREE.Quaternion();

								if(next_question.option_type == "MutiOption_Text"){

									// console.log(' 6666666666 ' , new THREE.Vector3(1,1,1).multiply( Entity.object3D.scale ).multiply( Entity.object3D.parent.scale ).multiply( Entity.object3D.parent.parent.scale )  );

									//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
									//// 這樣確保圓圈比例維持，且大小隨著選項而變動
									// let optionTextWorldScale = Entity.object3D.getWorldScale(new THREE.Vector3());
									let optionTextWorldScale = new THREE.Vector3(1,1,1).multiply( Entity.object3D.scale ).multiply( Entity.object3D.parent.scale ).multiply( Entity.object3D.parent.parent.scale );
									let optionTextBGWroldScale = Entity.object3D.children[1].scale.clone().multiply( optionTextWorldScale );

									// let optionTextBGWroldScale = new THREE.Vector3();
									// if ( Entity.object3D.children ){
									// 	if ( Entity.object3D.children[1] ){
									// 		if ( Entity.object3D.children[1] ){
									// 			if ( Entity.object3D.children[1].geometry ){
									// 				optionTextBGWroldScale = Entity.object3D.children[1].getWorldScale( new THREE.Vector3() );

									// 			}
									// 		}
									// 	}
									// }

									let maxS = Math.max( optionTextBGWroldScale.x , optionTextBGWroldScale.y );
									circleScale.multiply(  new THREE.Vector3( 30, 30, 30 ).multiplyScalar( maxS )  );
									circleScale.divide( optionTextWorldScale );

									// console.log(' 777777777777 ' , optionTextBGWroldScale, optionTextWorldScale , Entity.object3D, Entity.object3D.scale, Entity.object3D.parent.scale, Entity.object3D.parent.parent.scale, Entity.object3D.parent.parent.parent.scale );									


									//// 圓圈位置設定方式為「選項文字高度」 + 「圓圈本身高度」，前者以「 文字結構的左右計算得來」
									//// 目前看來，縱軸也需要些微調整，但是不確定方法。暫放
									let textWidth = Math.abs( Entity.getObject3D("mesh").geometry.attributes.position.array[0] )*2;
									// let textHeight = Math.abs( Entity.getObject3D("mesh").geometry.attributes.position.array[1] )*2;

									circlePos.x = -circleScale.x*0.5 - textWidth * 0.6;
									// circlePos.y = -textHeight * 0.5;
									
									console.log(' 99999999999 ' , circleScale , circlePos );


									let base = document.createElement("a-plane");
									base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
									base.setAttribute("id", Entity.object3D.parent.el.id + "_circle_base");
									base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
									self.setAframeTransform( base, circlePos, circleRot, circleScale, quaternion );
									Entity.appendChild(base);
		
									let circle = document.createElement("a-plane");
									circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
									circle.setAttribute("id", Entity.object3D.parent.el.id + "_circle_out");
									circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
									self.setAframeTransform( circle, circlePos, circleRot, circleScale, quaternion );
									Entity.appendChild(circle);
									
									let circle2 = document.createElement("a-plane");
									circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
									circle2.setAttribute("id", Entity.object3D.parent.el.id + "_circle_in");
									circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
									circle2.setAttribute( "visible", false);
									circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
									self.setAframeTransform( circle2, circlePos, circleRot, circleScale, quaternion );
									Entity.appendChild(circle2);

								}
								else{
									//// 對於『圖片格式的多選題』，需要在下方加上『圓框』，先等到『選項圖片』載入完成，個別掛載圖片上去
	

									let timeoutID2 = setInterval( function () {
										if (Entity.getAttribute("heightForQuiz")){ 
											
											//// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
											//// 這樣確保圓圈比例維持，且大小隨著選項而變動
											let optionImgWorldScale = Entity.object3D.getWorldScale(new THREE.Vector3());
											let optionImgLocalScale = Entity.object3D.scale.clone()  ;
											let maxS = Math.max( optionImgLocalScale.x , optionImgLocalScale.y );
	
											circleScale.multiply(  new THREE.Vector3( 50, 50, 50 ).multiplyScalar( maxS )  );
											circleScale.divide( optionImgWorldScale );
	
											//// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
											let optionImageScale = Entity.object3D.children[0].scale.clone() ; 										
											circlePos.y = -circleScale.y*0.5 - optionImageScale.y * 0.6;
											
											let base = document.createElement("a-plane");
											base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
											base.setAttribute("id", Entity.id + "_circle_base");
											base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
											self.setAframeTransform( base, circlePos, circleRot, circleScale, quaternion );
	
											Entity.appendChild(base);
				
											let circle = document.createElement("a-plane");
											circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
											circle.setAttribute("id", Entity.id + "_circle_out");
											circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
											self.setAframeTransform( circle, circlePos, circleRot, circleScale, quaternion );
											Entity.appendChild(circle);
											
											let circle2 = document.createElement("a-plane");
											circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
											circle2.setAttribute("id", Entity.id + "_circle_in");
											circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
											circle2.setAttribute( "visible", false);
											circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
											self.setAframeTransform( circle2, circlePos, circleRot, circleScale, quaternion );
											Entity.appendChild(circle2);
			
											window.clearInterval(timeoutID2);
	
										}
									}, 100 );

								}
							
							});


							
						}
					}

					//// 處理『自訂時間』
					if( quizModule.json.timer_type == "Custom"){
						if ( quizModule.timer.counter >= 0){
							let timer = document.getElementById("timerDiv");
							let hour = Math.floor( quizModule.timer.counter/3600);
							let min = Math.floor(( quizModule.timer.counter-hour*3600)/60);
							let sec = quizModule.timer.counter-hour*3600-min*60;
							timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
						}
					}

					setTimeout(function(){

						//// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
			
						if ( quizModule.timer.counter >= 0){
							quizModule.qClock = Date.now();
							let timeoutID = setInterval(function() {
								quizModule.timer.currentTimer = timeoutID;
								quizModule.timer.counter -= 1;

								// let timer = document.getElementById("timerDiv");
								let hour = Math.floor( quizModule.timer.counter/3600);
								let min = Math.floor(( quizModule.timer.counter-hour*3600)/60);
								let sec = quizModule.timer.counter-hour*3600-min*60;
								timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
								
								if ( quizModule.timer.counter == 0){
									window.clearInterval( quizModule.timer.currentTimer);
									if ( quizModule.json.timer_type == "Custom"){
										if (next_question.show_score){
											let scoreDiv = document.getElementById("scoreDiv");
											let score = document.getElementById("score");
											scoreDiv.style.display = "block";

											//// 這段必須在每次「顯示」時候設定對應流程，為了多 quizz 專案
											scoreDiv.onclick = function(){
												scoreDiv.style.display = "none";
												self.nextQuestion();
											}

											score.textContent = quizModule.score;
											
										}
										else{
											self.nextQuestion();
										}
									}
									else{
										let temp = []
										let quizEntity = quizModule.quizEntity;
										for (let item of quizEntity.children) {
											temp.push(item);
										}
										temp.forEach(function(item){
											if (item.obj_parent_id == quizEntity.obj_id){
												quizEntity.remove(item);
												for (let i = 0, len = self.makarObjects.length; i < len; i++ ){
													if (self.makarObjects[i] == item){
														self.makarObjects.splice(i,1);
													}
												}					
											}
										});


										// timer.style.display = "none";
										let tipButtonDiv = document.getElementById("tipButtonDiv");
										let tipDiv = document.getElementById("tipDiv");
										tipButtonDiv.style.display = "none";
										tipDiv.style.display = "none";
										
										let startQuiz = document.getElementById("startQuiz");
										let QuizStartButton = document.getElementById("QuizStartButton");
										let QuizStartContent = document.getElementById("QuizStartContent");
										startQuiz.style.display = "block";
										// QuizStartContent.textContent = "時間到"
										QuizStartContent.textContent = worldContent.timeIsUp[languageType];
										
										let quizIndex = {
											question: idx ,
											get_score:  0,
											answer_time: quizModule.json.question_list[idx].time_limit ,
											answer_options: [],
											answer_cloze: "",
											answer_is_enable: false,
											answer_is: false,
										}
										quizModule.record[idx] = quizIndex;
										quizModule.record_time += quizModule.json.question_list[idx].time_limit;
										quizModule.qClock = Date.now();

										QuizStartButton.onclick = function(){
											startQuiz.style.display = "none";
											self.nextQuestion();
										}
										// QuizStartButton.addEventListener("click",function(){
										// 	startQuiz.style.display = "none";
										// 	self.nextQuestion();
										// });
									}
								}
							},1000);
						}
						
						//// -------------------------------------------------------------- ////
						
					}, 3000);


				}else{
					//// 沒有下一題，把答題狀態上傳到雲端
					window.clearInterval( quizModule.timer.currentTimer);
					let timer = document.getElementById("timerDiv");
					timer.style.display = "none";
					let tipButtonDiv = document.getElementById("tipButtonDiv");
					let tipDiv = document.getElementById("tipDiv");
					tipButtonDiv.style.display = "none";
					tipDiv.style.display = "none";

					let quizEndDiv = document.getElementById("quizEndDiv");
					quizEndDiv.style.display = "block";
					quizEndDiv.addEventListener("click", function(){
						quizEndDiv.style.display = "none";
					});

					
					console.log("three.js: quiz end , quizModule.record = " , quizModule.record  );
         	 		let playing_user = "", device_id = "";
					if (localStorage.getItem("login_shared_id") ){
						playing_user = localStorage.getItem("login_shared_id");
					}
					if (localStorage.getItem("device_id")){
						device_id = localStorage.getItem("device_id");
					}

          			let quizARLogData  = {
						user_id: publishARProjs.result[self.currentProjectIndex].user_id,
						playing_user: playing_user, //// 在還沒有登入流程時候 一定要設為空字串
						proj_id: publishARProjs.result[self.currentProjectIndex].proj_id,
						proj_type: "ar",
						device_id: device_id,
						brand:"",
						os: navigator.userAgent , 
						location_long:0.0,
						location_lan:0.0,
						module:[ quizModule.json],
						record_time: quizModule.record_time,
						record_score: quizModule.score ,
						record: quizModule.record,

          			}
          
					//// 目前存放分為 『log資訊』給『數據分析』 跟 『專案遊玩資訊』給『viewer 查詢』 
					quizLog( window.serverUrl , quizARLogData);


				}




			}



//[start-20190615-fei0066-add]//
// 			this.loadFBXModelWithTexture = function( markerRoot, url, sceneObject, targetCanvas ,position, rotation, scale ) {
// 				//// load model
// 				// console.log("three.js: loadFBXModelWithTexture: markerRoot.GCSSID=", markerRoot.GCSSID, self.gcssTargets );

// 				var loader = new THREE.FBXLoader();
// 				loader.load( url, function ( object ) {

// 					var skinnedTexture;

// 					if (object.animations){
// 						object.mixer = new THREE.AnimationMixer( object );
// 						// mixers.push( object.mixer ); // fei20181106 remove, we now check which obj is visible then update it
// 						var action = object.mixer.clipAction( object.animations[ 0 ] );
// 						action.play();
// 					}

// 					object.traverse( function ( child ) {
// 						if ( child.isMesh ) {

// 							if (child.type == "SkinnedMesh"){ //// the type of mesh named "SkinnedMesh" must be unique. 
// 								skinnedTexture = new THREE.CanvasTexture( targetCanvas );
// 								child.material.map = skinnedTexture;
// 								child.material.needsUpdate = true;
// 								// console.log("1 child SkinnedMesh, child =", child, "\nskinnedTexture=", skinnedTexture, "\ndataTexture=", targetCanvas );
// 							}

// 							child.castShadow = true;
// 							child.receiveShadow = true;
// 						}
// 					});

// 					var dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
// 					var GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
// 					var GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 
// 					object.position.set(GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0);// set object center to target center
// 					object.rotation.x = Math.PI/2; //set object vertical to target first, bacause we need to set the same direction of editor...
// 					object.rotation.y = Math.PI;
// 					object.updateMatrix(); //make the matrix will be set..

// 					self.checkFBXApplication( object, scale );

// 					scale.x *= 1*25.4/dpi ;
// 					scale.y *= 1*25.4/dpi ;
// 					scale.z *= 1*25.4/dpi ;

// 					let py = position.y;
// 					let pz = position.z;
// 					position.y = pz;
// 					position.z = py;

// 					self.setTransform(object, dpi, position, rotation, scale); //set all transform
// 					object.originTransform = { position: object.position.clone() , rotation: object.rotation.clone() , scale: object.scale.clone() } ;

// 					object["makarObject"] = true ;
// //[start-20190828-fei0071-add]//
// 					// if ( sceneObject.animationSlices ){
// 					// 	object.animationSlices = sceneObject.animationSlices;
// 					// 	// console.log( "three.js: loadFBXModelWithTexture: sceneObject.animationSlices=",  sceneObject.animationSlices );
// 					// 	object["behav"] = [{
// 					// 		simple_behav: "touchPlayAnimation",
// 					// 		index: sceneObject.animationSlices.length-1  ////// set which animationSlice will be played when the tounch event trigger.
// 					// 	}] ; ////// 20190830: now the behavior are manually set, in future will be set from MAKAR Editor.	
// 					// }

// 					object["playAnimation"] = true; // coloring model default play animation 1 , after touch model, play 2.
					
// //[end---20190828-fei0071-add]//
// 					markerRoot.add(object);
					
// 				}, function (error){ 
// 					// console.log("three.js : loadFBXModelWithTexture: onERROR", error );
// 				} );
// 			};


//[end---20190615-fei0066-add]//

			//// the html will use this function to load FBX 
// 			this.loadFBXModel = function( markerRoot, url, sceneObject, position, rotation, scale ) {
// 				//// load model
// 				// console.log("three.js: loadFBXModel: markerRoot.GCSSID=", markerRoot.GCSSID, self.gcssTargets );
// 				var loader = new THREE.FBXLoader();
// 				loader.load( url, function ( object ) {
// 					if (object.animations){
// 						object.mixer = new THREE.AnimationMixer( object );
// 						// mixers.push( object.mixer ); // fei20181106 remove, we now check which obj is visible then update it
// 						var action = object.mixer.clipAction( object.animations[ 0 ] );
// 						action.play();
// 					}
// 					object.traverse( function ( child ) {
// 						if ( child.isMesh ) {
// 							child.castShadow = true;
// 							child.receiveShadow = true;
// 						}
// 					});
// 					var dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
// 					var GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
// 					var GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 
// //[start-20191209-fei0082-add]//
// 					let rootObject = new THREE.Object3D();
// 					if ( sceneObject.behav ){
// 						// console.log("loadFBXModel add event");
// 						rootObject["behav"] = sceneObject.behav ;
// 					}

// 					if (sceneObject.obj_parent_id ){
						
// 						let setIntoParent = function(){
// 							let isParentSet = false;
// 							for (let i = 0; i<self.makarObjects.length; i++ ){
// 								if ( self.makarObjects[i].obj_id == sceneObject.obj_parent_id  ){
// 									isParentSet = true;
// 								}
// 							}
// 							if (isParentSet == false){
// 								setTimeout(setIntoParent, 200 );
// 							}else{
// 								for (let i = 0; i < self.makarObjects.length; i++){
// 									if (self.makarObjects[i].obj_id == sceneObject.obj_parent_id){

// 										// console.log("three.js: _loadFBXModel: get parent sceneObject = " , sceneObject.transform );
							
// 										object.rotation.y = Math.PI;

// 										self.checkFBXApplication( object, object.scale );
// 										object.scale.x *= 1*25.4/dpi ;
// 										object.scale.y *= 1*25.4/dpi ;
// 										object.scale.z *= 1*25.4/dpi ;
							
// 										if ( sceneObject.quaternionRotation ){

// 											var quaternionStr = sceneObject.quaternionRotation.split(",");
// 											var quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );
// 											self.setChildTransform( rootObject, dpi, position, rotation, scale , quaternion );

// 										}else{
// 											console.log("three.js: _loadFBXModel: sceneObject.quaternionRotation not exit"  );
// 											// self.setChildTransform( rootObject, dpi, position, rotation, scale );
// 										}

// 										rootObject["makarObject"] = true ;
// 										rootObject["playAnimation"] = true;
// 										rootObject["obj_id"] = sceneObject.obj_id ;
// 										rootObject.add(object);
// 										self.makarObjects[i].add( rootObject );

// 										self.makarObjects.push(rootObject); 
										
// 										break;
// 									}
									
// 								}
// 							}
// 						}
// 						setIntoParent();

// 					}else{
// 						// console.log("three.js: _loadFBXModel: sceneObject = " , sceneObject );

// 						rootObject.position.set(GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0);// set object center to target center
// 						rootObject.rotation.x = Math.PI/2; //set object vertical to target first, bacause we need to set the same direction of editor...
// 						// rootObject.rotation.y = Math.PI;
// 						rootObject.updateMatrix(); //make the matrix will be set..
	


// 						object.rotation.y = Math.PI;
// 						self.checkFBXApplication( object, object.scale );
	
// 						object.scale.x *= 1*25.4/dpi ;
// 						object.scale.y *= 1*25.4/dpi ;
// 						object.scale.z *= 1*25.4/dpi ;
	
// 						let py = position.y;
// 						let pz = position.z;
// 						position.y = pz;
// 						position.z = py;
	
// 						self.setTransform(rootObject, dpi, position, rotation, scale); //set all transform
// 						rootObject.originTransform = { position: rootObject.position.clone() , rotation: rootObject.rotation.clone() , scale: rootObject.scale.clone() } ;
	
// 						// if ( sceneObject.animationSlices ){
// 						// 	rootObject.animationSlices = sceneObject.animationSlices;
// 						// 	// console.log( "three.js: loadFBXModelWithTexture: sceneObject.animationSlices=",  sceneObject.animationSlices );
// 						// 	rootObject["behav"] = [{
// 						// 		simple_behav: "touchPlayAnimation",
// 						// 		index: sceneObject.animationSlices.length-1  ////// set which animationSlice will be played when the tounch event trigger.
// 						// 	}] ; ////// 20190830: now the behavior are manually set, in future will be set from MAKAR Editor.	
// 						// }
// 						rootObject.add(object);
// 						rootObject["makarObject"] = true ;
// 						rootObject["playAnimation"] = true;
// 						rootObject["obj_id"] = sceneObject.obj_id ;
// 						self.makarObjects.push(rootObject); 
// 						markerRoot.add(rootObject);
// 					}


// //[end---20191209-fei0082-add]//

// 				});
// 			};


			/////////////////  大改版 改為 aframe 架構     ////////////////////

			this.checkGLTFMaterialIndex = function( target, material ){

				if ( !target || !target.object3D || !target.object3D.children[0] ){
					console.log('three.js: _checkGLTFMaterialIndex: target error', target );
					return;
				}

				if ( !material ){
					console.log('three.js: _checkGLTFMaterialIndex: material error', material );
					return;
				}

				//// 當前紀錄要調整材質的方式 很奇特：
			    //// 第一個數值是： nodes 下面，撇除不帶有 mesh 的項目，的index，此 node 帶有的 「mesh」代表 meshes 下的 index
    			//// 第二個數值是： meshes 下的 mesh，底下的 primitives 下的 material index 
				let nodeMeshIndex = material.rendererIndex;
				let primitiveIndex = material.materialIndex;
	
				//// 確認模型物件下面的scene
				let meshIndex = -1;
				let materialIndex = -1;

				//// 查找「nodes」底下「帶有 mesh」的node
                let nodes = target.object3D.children[0].ModelJson.nodes;
                let nodeMeshCount = -1;
                for ( let i = 0; i < nodes.length; i++ ){
                    //// 假如此 node 帶有 mesh ，加一
                    if ( typeof( nodes[i].mesh ) == 'number' ){
                        nodeMeshCount++;
                    }
                    //// 確認是否為「對應 index 」
                    if ( nodeMeshIndex == nodeMeshCount ){
                        meshIndex = nodes[i].mesh;
                        // console.log('three.js: _checkGLTFMaterialIndex: get nodeMeshIndex ', nodes[i] );
                        break;
                    }

                }

                //// 確認模型物件下的 meshes 下 特定 index 是否存在
                // console.log('three.js: _checkGLTFMaterialIndex: meshIndex = ', meshIndex , material  );
                if ( meshIndex >= 0 ){

                    let meshData = target.object3D.children[0].ModelJson.meshes[ meshIndex ];
                    // console.log('three.js: _checkGLTFMaterialIndex: get meshData ', meshIndex , meshData  );
                    if ( meshData ){
                        //// 確認模型物件下的 primitives 是否存在
                        if ( meshData.primitives  ){
                            let primitiveData = meshData.primitives[ primitiveIndex ];
                            //// 確認模型物件下的 primitives 下 material 是否有值
                            if ( primitiveData.material >= 0 ){
                                //// 確認 materials 下是否有此 index
                                materialIndex = primitiveData.material;

                                // console.log('three.js: _checkGLTFMaterialIndex: materialIndex=' , materialIndex );
                            }
                        }
                    }
				}
				

				return materialIndex;

			}


			this.setGLTFMaterial = function( modelEntity , obj ){

				let self = this;

				let objj = modelEntity.getObject3D('mesh');
				let materialIndex = -1;

				let cubeTex = self.cubeTex;

				for(let i = 0; i < obj.material.length; i++){

					if ( objj.ModelJson ){
						materialIndex = self.checkGLTFMaterialIndex( modelEntity, obj.material[i]  );
					}


					let rgba = obj.material[i].color.split(",");
					let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));
					

					objj.traverse(node => {
						//// 取消所有「模型自帶光」
						if (node.type){
							if (typeof(node.type) == 'string' ){
								if (node.type.toLowerCase().includes('light') ){
									node.visible = false;
								}
							}
						}
					});

					switch (obj.material[i].shader) {
						case "Unlit/Color":
							objj.traverse(node => {
								if (node.isMesh) {

									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										// node.material = new THREE.MeshBasicMaterial({color: color, name: obj.material[i].name, skinning: node.material.skinning});
										node.material = new THREE.MeshBasicMaterial({color: color, name: node.material.name , skinning: node.material.skinning});
									}
								}
							});
							break;
						case "Standard":


							var renderer = modelEntity.sceneEl.renderer;
							objj.traverse(node => {

								if (node.material) {

									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){

										node.material = new THREE.MeshStandardMaterial({

											name: node.material.name, 
											skinning: node.material.skinning , 
											map: node.material.map, 
											emissive:node.material.emissive,
											emissiveMap:node.material.emissiveMap,
											normalMap:node.material.normalMap
										});

										node.material.color = color;
										node.material.metalness = obj.material[i].metallic;
										node.material.roughness = 1 - obj.material[i].smoothness;
										//// 先行取消「模型呈現環景」
										node.material.envMap = cubeTex.texture;
										node.material.envMapIntensity = 1;
										node.material.needsUpdate = true;									// if (node.material.name === obj.material[i].name) {

										node.material.reflectivity = 0;
										node.material.side = THREE.DoubleSide;
										node.material.transparent = true;
										// console.log('three.js: _loadGLTFModel: obj.material',obj.material);
										// console.log('three.js: _loadGLTFModel: standard node.material',node.material);
							
										if (node.material.map){
											node.material.map.encoding = THREE.GammaEncoding;
											node.material.map.needsUpdate = true;
										}

										if(obj.material[i].mode == 0){
											node.material.opacity = 1;
											renderer.setClearAlpha(1);

											node.material.blending = THREE.CustomBlending;
											node.material.blendEquation = THREE.AddEquation;
											node.material.blendSrc = THREE.OneFactor;
											node.material.blendDst = THREE.ZeroFactor;
											node.material.blendSrcAlpha = THREE.ZeroFactor;
											node.material.blendDstAlpha = THREE.OneFactor;

										}
										else if(obj.material[i].mode == 1){
											node.material.opacity = 1;
											node.material.alphaTest = obj.material[i].cut_off;
											renderer.setClearAlpha(1);

											node.material.blending = THREE.CustomBlending;
											node.material.blendEquation = THREE.AddEquation;
											node.material.blendSrc = THREE.OneFactor;
											node.material.blendDst = THREE.ZeroFactor;
											node.material.blendSrcAlpha = THREE.ZeroFactor;
											node.material.blendDstAlpha = THREE.OneFactor;

											node.customDepthMaterial = new THREE.MeshDepthMaterial( {
												depthPacking: THREE.RGBADepthPacking,
												skinning: true,
												map: node.material.map,
												alphaTest: obj.material[i].cut_off
											} );
										}
										else if(obj.material[i].mode == 2){
											node.material.opacity = parseFloat(rgba[3]);
											node.material.depthWrite = false;
										
											node.customDepthMaterial = new THREE.MeshDepthMaterial( {
												depthPacking: THREE.RGBADepthPacking,
												skinning: true,
												map: node.material.map,
												alphaTest: obj.material[i].cut_off
											} );
										}
										else if(obj.material[i].mode == 3){
											node.material.opacity = Math.max(parseFloat(rgba[3]), obj.material[i].metallic);
											node.material.depthWrite = false;
											node.material.blending = THREE.CustomBlending;
											node.material.blendEquation = THREE.AddEquation;
											node.material.blendSrc = THREE.OneFactor;
											node.material.blendDst = THREE.OneMinusSrcAlphaFactor;
											node.material.blendSrcAlpha = THREE.OneFactor;
											node.material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;

											node.customDepthMaterial = new THREE.MeshDepthMaterial( {
												depthPacking: THREE.RGBADepthPacking,
												skinning: true,
												map: node.material.map,
												alphaTest: obj.material[i].cut_off
											} );
										}
									}
								}
							});
							// renderer.toneMapping = THREE.ACESFilmicToneMapping;
							// renderer.outputEncoding = THREE.sRGBEncoding;
							
							
							break;
						case "Unlit/Transparent":
							objj.traverse(node => {
								if (node.material) {

									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										node.material.opacity = 1;
										node.material.depthWrite = false;
									}
								}
							});
							break;
						case "Unlit/Transparent Cutout":
							objj.traverse(node => {
								if (node.material) {

									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										node.material.opacity = 1;
										node.material.alphaTest = 0.5;
									}
								}
							});
							break;
						case "Unlit/Texture":
							objj.traverse(node => {
								if (node.material) {

									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});

										if (node.material.map){
											node.material.map.encoding = THREE.GammaEncoding;
											node.material.map.needsUpdate = true;
											console.log(node.material.map)

										}

										node.material.needsUpdate = true;
									}
								}
							});
							break;

//20221207-thonsha-add-start
						case "Unlit/ScreenCutoutShader":
							objj.traverse(node => {
								if (node.material) {
									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
									// if( mIndex == obj.material[i].materialIndex){
									// if (node.material.name == obj.material[i].name) {
										// self.needsRenderTarget = true;

										node.material.onBeforeCompile = function ( shader ) {
											shader.uniforms.tEquirect = { value: self.cameraTexture };
											shader.vertexShader = 'varying vec4 vProjection;\n' + shader.vertexShader;
											shader.vertexShader = shader.vertexShader.replace(
											'#include <worldpos_vertex>',
											[
												'#include <worldpos_vertex>',
												'	vProjection = projectionMatrix * mvPosition;',
											].join( '\n' )
											);
											shader.fragmentShader = 'uniform sampler2D tEquirect;\nvarying vec4 vProjection;\n' + shader.fragmentShader;
											shader.fragmentShader = shader.fragmentShader.replace(
											'#include <dithering_fragment>',
											[
												'#include <dithering_fragment>',
												'	vec2 sampleUV;',
												'	sampleUV.x = vProjection.x/vProjection.w*0.5 + 0.5;',
												'	sampleUV.y = -vProjection.y/vProjection.w*0.5 + 0.5;',
												'	gl_FragColor = texture2D(tEquirect, sampleUV);',
											].join( '\n' )
											);
										};
									
									
									}
								}
							});
							break;
//20221207-thonsha-add-end
						
						case "Blocks/Basic":
							// console.log("20200828",objj);
							break;

						case "Blocks/BlocksGem":
							objj.traverse(node => {
								if (node.material) {
									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										node.material.depthWrite = false;
									}
								}
							});
							break;
						case "Blocks/BlocksGlass":
							objj.traverse(node => {
								if (node.material) {
									let nameSlice = node.material.name.split("_");
									let mIndex = nameSlice[ nameSlice.length - 1 ];
									if( mIndex == materialIndex ){
										node.material.depthWrite = false;
									}
								}
							});
							break;

						default:
							console.log(`The shader of no. ${i} material is not supported currently.`);
							break;
					}
					
				}


			} 



			this.loadAframeGLTFModelWithTexture = function( markerRoot, obj, targetCanvas, position, rotation, scale , cubeTex ){

				let pModel = new Promise( function( modelResolve ){

					var xhr = new XMLHttpRequest();
					xhr.open("GET", "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/web_white_list/colorMeshNames.txt" );
					xhr.responseType = "text";
					xhr.onload = function(e){
						var meshNameList = xhr.response.split("\n");
						console.log(" three.js: _loadAframeGLTFModelWithTexture , meshNameList = ", meshNameList , obj );

						let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
						let GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
						let GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 

						let assets = document.getElementById("makarAssets");

						let assetsitem = document.createElement("a-asset-item")
						assetsitem.setAttribute("id", obj.obj_id+"_"+obj.res_id);
						assetsitem.setAttribute("src",obj.res_url);
						assetsitem.setAttribute("response-type", 'arraybuffer');
						assetsitem.setAttribute('crossorigin', 'anonymous');
						assets.appendChild(assetsitem);

						//20191128-start-thonsha-add
						var animationSlices= null;	
						var mainAnimation;	
						if(obj.animation){
							animationSlices= [];
							for(let i=0; i<obj.animation.length; i++){
								// if (obj.animation[i].isActive){
								// 	animationSlices.push({idle:obj.animation[i].uid, uid:obj.animation[i].uid, changed: false});
								// 	mainAnimation = obj.animation[i].animationName;
								// }
								if (obj.animation[i].defaultAnimation || obj.animation[i].isActive ){
									animationSlices.push({idle:obj.animation[i].uid, loop:obj.animation[i].uid, uid:obj.animation[i].uid, changed: false, reset: true, count: 0});							
									mainAnimation = obj.animation[i].animationName;
								}
							}
							for(let i=0; i<obj.animation.length; i++){
								animationSlices.push({name:obj.animation[i].name,
													animationName:obj.animation[i].animationName,
													startTime:obj.animation[i].startTime,
													endTime:obj.animation[i].endTime,
													uid:obj.animation[i].uid
													});
							}
						}
						//20191128-end-thonsha-add

						let modelEntity = document.createElement('a-entity');

						if(!obj.res_url){ return };
			
						modelEntity.setAttribute("gltf-model", "#"+obj.obj_id+"_"+obj.res_id);
						
						if (obj.animation){
							modelEntity.setAttribute("animation-mixer", "clip: "+mainAnimation);
						}
						if (obj.behav){
							modelEntity.setAttribute('class', "clickable" ); //// fei add
						}
						else{
							modelEntity.setAttribute('class', "unclickable" ); //// fei add
						}
						modelEntity.setAttribute( "id", obj.obj_id );//// fei add 
						modelEntity.setAttribute('crossorigin', 'anonymous');
						modelEntity.setAttribute("shadow","");
						if (obj.model_shift){
							let model_shift = new THREE.Vector3().fromArray(obj.model_shift.split(",").map(function(x){return Number(x)}) );
							model_shift.multiply(scale);
							position.add(model_shift);
						}


						self.makarObjects.push( modelEntity );

						//20191125-start-thonsha-add
						modelEntity.addEventListener("model-loaded", function(evt){ // model-loaded  / object3dset
							// console.log("three.js: arController: _loadAframeGLTFModel, object3dset: evt=", obj.res_name, evt  , obj );
							if ( evt.target ==  evt.currentTarget ){
								//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
								let maxAnisotropy = self.arfScene.renderer.capabilities.getMaxAnisotropy();


								modelEntity.object3D.children[0].scale.set( 100*25.4/dpi , 100*25.4/dpi , 100*25.4/dpi );
								modelEntity.object3D.children[0].rotation.y = Math.PI;

								let quaternionStr = obj.quaternionRotation.split(",");
								let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

								//// 假如是子物件，不用位移到中央
								let dp = new THREE.Vector3();
								if ( obj.obj_parent_id ){

									modelEntity.object3D.obj_parent_id = obj.obj_parent_id;

									dp.addScaledVector( position, 1*100*25.4/dpi );

									///// 子物件的 z 軸要正負顛倒
									let pz = dp.z ;
									dp.z = -pz;

									self.setAframeTransform( modelEntity, dp, rotation, scale, quaternion );

								} else {

									switch (window.serverVersion){
										case "2.0.0":
											scale.multiplyScalar( 1 );
											dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
											break;

										case "3.0.0":
											scale.multiplyScalar( 2 );
											dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
											break;
										default:
											console.log("three.js: loadAframeGLTFModelWithTexture: serverVersion version wrong", serverVersion);
									}

									//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
									let py = dp.y;
									let pz = dp.z;
									dp.y = pz;
									dp.z = py;

									self.setAframeTransform( modelEntity, dp , rotation, scale, quaternion );
									//// 第一層物件必須放置於辨識圖中央										
									modelEntity.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
									//// 第一層物件必須垂直於辨識圖表面
									modelEntity.object3D.rotation.x += Math.PI*90/180;

									console.log('three.js: _loadAframeGLTFModelWithTexture: loaded: no parent prs=' , modelEntity.object3D.position , modelEntity.object3D.rotation, modelEntity.object3D.scale  );

								}

								let pm = modelEntity.object3D;
								pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;

								modelEntity.object3D.makarType = 'model';

								modelEntity.object3D["makarObject"] = true; 
								if ( obj.behav ){
									modelEntity.object3D["behav"] = obj.behav ;

									//// 載入時候建制「群組物件資料」「注視事件」
									self.setObjectBehavAll( obj );
								}

								if(obj.behav_reference){
									modelEntity.object3D["behav_reference"] = obj.behav_reference ;
								}



								//// 素材調製
								evt.detail.model.traverse( ( object ) => {
									if ( object.isMesh === true && object.material.map !== null ) {
										object.material.map.anisotropy = maxAnisotropy;
										object.material.map.needsUpdate = true;
									}

									//// 更換貼圖 
									if ( object.isMesh ){
										for (let i = 0, len=meshNameList.length; i < len; i++){
											if (object.name == meshNameList[i] ){
												skinnedTexture = new THREE.CanvasTexture( targetCanvas );
												skinnedTexture.flipY = false;
												skinnedTexture.needsUpdate = true;		
												object.material.map = skinnedTexture;
												object.material.needsUpdate = true;
											}
										}
										object.material.flatShading = false ; // r87+
										object.material.needsUpdate = true ;
									}

								});
								if ( modelEntity.object3D ){
									

									let objj = modelEntity.getObject3D('mesh');
									let materialIndex = -1;

									if (obj.material){

										for(let i = 0; i < obj.material.length; i++){

											if ( objj.ModelJson ){
												materialIndex = self.checkGLTFMaterialIndex( modelEntity, obj.material[i]  );
											}


											let rgba = obj.material[i].color.split(",");
											let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));
											

											objj.traverse(node => {
												//// 取消所有「模型自帶光」
												if (node.type){
													if (typeof(node.type) == 'string' ){
														if (node.type.toLowerCase().includes('light') ){
															node.visible = false;
														}
													}
												}
											});

											switch (obj.material[i].shader) {
												case "Unlit/Color":
													objj.traverse(node => {
														if (node.isMesh) {

															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if( mIndex == obj.material[i].materialIndex){
															// if (node.material.name === obj.material[i].name) {
																node.material = new THREE.MeshBasicMaterial({color: color, name: obj.material[i].name, skinning: node.material.skinning});
															}
														}
													});
													break;
												case "Standard":

													var renderer = modelEntity.sceneEl.renderer;
													objj.traverse(node => {

														if (node.material) {

															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if( mIndex == obj.material[i].materialIndex ) {

		//20200803-thonsha-add-start
																node.material = new THREE.MeshStandardMaterial({

																	name: node.material.name, 
																	skinning: node.material.skinning , 
																	map: node.material.map, 
																	emissive:node.material.emissive,
																	emissiveMap:node.material.emissiveMap,
																	normalMap:node.material.normalMap
																});
		//20200803-thonsha-add-end
																node.material.color = color;
																node.material.metalness = obj.material[i].metallic;
																node.material.roughness = 1 - obj.material[i].smoothness;
																//// 先行取消「模型呈現環景」
																node.material.envMap = cubeTex.texture;
																node.material.envMapIntensity = 1;
																node.material.needsUpdate = true;
																node.material.reflectivity = 0;
																node.material.side = THREE.DoubleSide;
																node.material.transparent = true;
																// console.log('three.js: _loadGLTFModel: obj.material',obj.material);
																// console.log('three.js: _loadGLTFModel: standard node.material',node.material);
		//20200730-thonsha-add-start														
																if (node.material.map){
																	node.material.map.encoding = THREE.GammaEncoding;
																	node.material.map.needsUpdate = true;
																}
		//20200730-thonsha-add-end	
																if(obj.material[i].mode == 0){
																	node.material.opacity = 1;
																	renderer.setClearAlpha(1);

																	node.material.blending = THREE.CustomBlending;
																	node.material.blendEquation = THREE.AddEquation;
																	node.material.blendSrc = THREE.OneFactor;
																	node.material.blendDst = THREE.ZeroFactor;
																	node.material.blendSrcAlpha = THREE.ZeroFactor;
																	node.material.blendDstAlpha = THREE.OneFactor;

																}
																else if(obj.material[i].mode == 1){
																	node.material.opacity = 1;
																	node.material.alphaTest = obj.material[i].cut_off;
																	renderer.setClearAlpha(1);

																	node.material.blending = THREE.CustomBlending;
																	node.material.blendEquation = THREE.AddEquation;
																	node.material.blendSrc = THREE.OneFactor;
																	node.material.blendDst = THREE.ZeroFactor;
																	node.material.blendSrcAlpha = THREE.ZeroFactor;
																	node.material.blendDstAlpha = THREE.OneFactor;

																	node.customDepthMaterial = new THREE.MeshDepthMaterial( {
																		depthPacking: THREE.RGBADepthPacking,
																		skinning: true,
																		map: node.material.map,
																		alphaTest: obj.material[i].cut_off
																	} );
																}
																else if(obj.material[i].mode == 2){
																	node.material.opacity = parseFloat(rgba[3]);
																	node.material.depthWrite = false;
																
																	node.customDepthMaterial = new THREE.MeshDepthMaterial( {
																		depthPacking: THREE.RGBADepthPacking,
																		skinning: true,
																		map: node.material.map,
																		alphaTest: obj.material[i].cut_off
																	} );
																}
																else if(obj.material[i].mode == 3){
																	node.material.opacity = Math.max(parseFloat(rgba[3]), obj.material[i].metallic);
																	node.material.depthWrite = false;
																	node.material.blending = THREE.CustomBlending;
																	node.material.blendEquation = THREE.AddEquation;
																	node.material.blendSrc = THREE.OneFactor;
																	node.material.blendDst = THREE.OneMinusSrcAlphaFactor;
																	node.material.blendSrcAlpha = THREE.OneFactor;
																	node.material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;

																	node.customDepthMaterial = new THREE.MeshDepthMaterial( {
																		depthPacking: THREE.RGBADepthPacking,
																		skinning: true,
																		map: node.material.map,
																		alphaTest: obj.material[i].cut_off
																	} );
																}
															}
														}
													});
													// renderer.toneMapping = THREE.ACESFilmicToneMapping;
													// renderer.outputEncoding = THREE.sRGBEncoding;
													
													
													break;
												case "Unlit/Transparent":
													objj.traverse(node => {
														if (node.material) {

															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if ( mIndex == obj.material[i].materialIndex ) {
															// if (node.material.name == obj.material[i].name) {
																node.material.opacity = 1;
																node.material.depthWrite = false;
															}
														}
													});
													break;
												case "Unlit/Transparent Cutout":
													objj.traverse(node => {
														if (node.material) {

															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if ( mIndex == obj.material[i].materialIndex ) {
															// if (node.material.name == obj.material[i].name) {
																node.material.opacity = 1;
																node.material.alphaTest = 0.5;
															}
														}
													});
													break;
												case "Unlit/Texture":
													objj.traverse(node => {
														if (node.material) {

															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if ( mIndex == obj.material[i].materialIndex ) {
															// if (node.material.name == obj.material[i].name) {
																node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: obj.material[i].name, skinning: node.material.skinning, map: node.material.map});
		//20200730-thonsha-add-start
																if (node.material.map){
																	node.material.map.encoding = THREE.GammaEncoding;
																	node.material.map.needsUpdate = true;
																	console.log(node.material.map)

																}
		//20200730-thonsha-add-end
																node.material.needsUpdate = true;
															}
														}
													});
													break;

		//20221208-thonsha-add-start
												case "Unlit/ScreenCutoutShader":
													objj.traverse(node => {
														if (node.material) {
															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if( mIndex == obj.material[i].materialIndex){
															// if (node.material.name == obj.material[i].name) {
																// self.needsRenderTarget = true;

																node.material.onBeforeCompile = function ( shader ) {
																	shader.uniforms.tEquirect = { value: self.cameraTexture };
																	shader.vertexShader = 'varying vec4 vProjection;\n' + shader.vertexShader;
																	shader.vertexShader = shader.vertexShader.replace(
																	'#include <worldpos_vertex>',
																	[
																		'#include <worldpos_vertex>',
																		'	vProjection = projectionMatrix * mvPosition;',
																	].join( '\n' )
																	);
																	shader.fragmentShader = 'uniform sampler2D tEquirect;\nvarying vec4 vProjection;\n' + shader.fragmentShader;
																	shader.fragmentShader = shader.fragmentShader.replace(
																	'#include <dithering_fragment>',
																	[
																		'#include <dithering_fragment>',
																		'	vec2 sampleUV;',
																		'	sampleUV.x = vProjection.x/vProjection.w*0.5 + 0.5;',
																		'	sampleUV.y = -vProjection.y/vProjection.w*0.5 + 0.5;',
																		'	gl_FragColor = texture2D(tEquirect, sampleUV);',
																	].join( '\n' )
																	);
																};
															
															
															}
														}
													});
													break;
		//20221208-thonsha-add-end
												
												case "Blocks/Basic":
													// console.log("20200828",objj);
													break;

												case "Blocks/BlocksGem":
													objj.traverse(node => {
														if (node.material) {
															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if( mIndex == obj.material[i].materialIndex){
															// if (node.material.name == obj.material[i].name) {
																node.material.depthWrite = false;
															}
														}
													});
													break;
												case "Blocks/BlocksGlass":
													objj.traverse(node => {
														if (node.material) {
															let nameSlice = node.material.name.split("_");
															let mIndex = nameSlice[ nameSlice.length - 1 ];
															if( mIndex == materialIndex ){
															// if( mIndex == obj.material[i].materialIndex){
															// if (node.material.name == obj.material[i].name) {
																node.material.depthWrite = false;
															}
														}
													});
													break;


												default:
													console.log(`The shader of no. ${i} material is not supported currently.`);
													break;
											}
											
										}

									}
						//20191203-start-thonsha-add							
									//// if there is animation exist in GLTF, but the editor not contain the animation slices, the mixer will not init.
									//// use the first animation( usually only one), to setup animationSlice.
									if (Array.isArray(evt.detail.model.animations)){
										if ( evt.detail.model.animations.length>0 && !modelEntity.getAttribute("animation-mixer") ){
											console.log("three.js: _loadAframeGLTFModelWithTexture: the model with animation but no animation-mixer, probabily older version of editor ");
											modelEntity.setAttribute("animation-mixer", "clip: "+ evt.detail.model.animations[0].name );
											animationSlices = [];
											animationSlices.push({ changed:false, idle:"mifly168", uid:"mifly168" });
											animationSlices.push({
												animationName: evt.detail.model.animations[0].name,
												name: evt.detail.model.animations[0].name,
												endTime: evt.detail.model.animations[0].duration ,
												startTime: 0,
												uid:"mifly168"
											});
										}
									}
									
									evt.detail.model.animationSlices = animationSlices;

									modelResolve( modelEntity );

								}
							}else{
								// console.log("three.js: : , target!=currentTarget", obj.res_name, modelEntity.object3D.children );
							}
						});

						//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
						if ( obj.active == false ){
							modelEntity.setAttribute("visible", false);
							modelEntity.setAttribute('class', "unclickable" );
						}

						if(obj.behav_reference){
							for(let i=0; i<obj.behav_reference.length;i++){
								if (obj.behav_reference[i].behav_name == 'ShowModel'){
									modelEntity.setAttribute("visible", false);
									modelEntity.setAttribute('class', "unclickable" );
									break;
								}
							}
							
						}
						//20191029-start-thonhsa-add
						if(obj.obj_parent_id){
							let timeoutID = setInterval( function () {
								let parent = document.getElementById(obj.obj_parent_id);
								if (parent){ 
									if(parent.object3D.children.length > 0){
										parent.appendChild(modelEntity);
										window.clearInterval(timeoutID);
									} 
								}
							}, 1);
						} else{

							markerRoot.appendChild( modelEntity );
							console.log(' 222222222222222 ' , markerRoot , modelEntity );
						}
						
					}
					xhr.send();



				});

				return pModel;

			}



			this.loadAframeGLTFModel = function( markerRoot, obj, position, rotation, scale , cubeTex ){

				let pModel = new Promise( function( modelResolve ){

					self.UrlExistsFetch( obj.res_url ).then( retStatus =>{

						if ( retStatus == true ){

							//// 作檔案存在與否判斷
							if ( obj.res_url == '' || 
							( obj.sub_type != 'glb' && obj.sub_type != 'gltf'  && obj.sub_type != 'gltf_sketchFab'  && obj.sub_type != 'gltf_sketchfab' &&
							  obj.sub_type != 'gltf_poly'
							) ){
								console.log(" three.js: _loadAframeGLTFModel: obj not support ", obj );
								modelResolve( -1 );
								return;
							}


							let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
							let GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
							let GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 
							let projIndex = self.sceneTargetList[ markerRoot.GCSSID ].projIndex ;

							let assets = document.getElementById("makarAssets");

							let assetsitem = document.createElement("a-asset-item")
							assetsitem.setAttribute("id", obj.obj_id+"_"+obj.res_id);
							assetsitem.setAttribute("src",obj.res_url);
							assetsitem.setAttribute("response-type", 'arraybuffer');
							// assetsitem.setAttribute("src", 'model/tga.glb' );
							// assetsitem.setAttribute("src", 'model/bmp.glb' );
							assetsitem.setAttribute('crossorigin', 'anonymous');
							assets.appendChild(assetsitem);

							//20191128-start-thonsha-add
							var animationSlices= null;	
							var mainAnimation;	
							if(obj.animation){
								animationSlices= [];


								////
								//// 2022 1123 這邊從 3.4.0 之後要作版本控制
								//// 注意，在執行的程式碼端，將 key 結構改為 新版本
								////
								

								let editor_version = self.getProjectVersion( projIndex );

								if ( Array.isArray ( editor_version )  && editor_version.length == 3 ){

									let largeV  = Number( editor_version[0] );
									let middleV = Number( editor_version[1] );
									let smallV  = Number( editor_version[2] );

									//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
									if ( largeV > 3 || 
									( largeV == 3 && middleV > 3 ) ||
									( largeV == 3 && middleV == 3 && smallV > 8 )
									){
										for(let i=0; i<obj.animation.length; i++){
											if (obj.animation[i].is_default || obj.animation[i].is_active){
												animationSlices.push({
													idle:obj.animation[i].uid, 
													loop:obj.animation[i].uid, 
													uid:obj.animation[i].uid, 
													changed: false, 
													reset: true, 
													count: 0});
												mainAnimation = obj.animation[i].animation_name;
											}
										}
										for(let i=0; i<obj.animation.length; i++){
											animationSlices.push({
												name:obj.animation[i].name,
												animationName:obj.animation[i].animation_name,
												startTime:obj.animation[i].start_time,
												endTime:obj.animation[i].end_time,
												uid:obj.animation[i].uid
											});
										}

									}else{
										//// 假如版本小於 3.3.8 使用舊版本 key , 小寫英文開頭，換字改為大寫英文
										
										for(let i=0; i<obj.animation.length; i++){
											if (obj.animation[i].defaultAnimation || obj.animation[i].isActive){
												animationSlices.push({
													idle:obj.animation[i].uid, 
													loop:obj.animation[i].uid, 
													uid:obj.animation[i].uid, 
													changed: false, 
													reset: true, 
													count: 0});
												mainAnimation = obj.animation[i].animationName;
											}
										}
										for(let i=0; i<obj.animation.length; i++){
											animationSlices.push({
												name:obj.animation[i].name,
												animationName:obj.animation[i].animationName,
												startTime:obj.animation[i].startTime,
												endTime:obj.animation[i].endTime,
												uid:obj.animation[i].uid
											});
										}
									}

								}else{
									//// 假如本版檢查有誤，執行「最新版本」3.3.8的架構
									for(let i=0; i<obj.animation.length; i++){
										
										if (obj.animation[i].is_default || obj.animation[i].is_active){
											animationSlices.push({
												idle:obj.animation[i].uid, 
												loop:obj.animation[i].uid, 
												uid:obj.animation[i].uid, 
												changed: false, 
												reset: true, 
												count: 0});							
											mainAnimation = obj.animation[i].animation_name;
										}
									}
									for(let i=0; i<obj.animation.length; i++){
										animationSlices.push({name:obj.animation[i].name,
											animationName:obj.animation[i].animation_name,
											startTime:obj.animation[i].start_time,
											endTime:obj.animation[i].end_time,
											uid:obj.animation[i].uid
										});
									}

								}

								// for(let i=0; i<obj.animation.length; i++){
								// 	// if (obj.animation[i].isActive){
								// 	// 	animationSlices.push({idle:obj.animation[i].uid, uid:obj.animation[i].uid, changed: false});
								// 	// 	mainAnimation = obj.animation[i].animationName;
								// 	// }
								// 	if (obj.animation[i].defaultAnimation || obj.animation[i].isActive ){
								// 		animationSlices.push({idle:obj.animation[i].uid, loop:obj.animation[i].uid, uid:obj.animation[i].uid, changed: false, reset: true, count: 0});							
								// 		mainAnimation = obj.animation[i].animationName;
								// 	}
								// }
								// for(let i=0; i<obj.animation.length; i++){
								// 	animationSlices.push({name:obj.animation[i].name,
								// 						animationName:obj.animation[i].animationName,
								// 						startTime:obj.animation[i].startTime,
								// 						endTime:obj.animation[i].endTime,
								// 						uid:obj.animation[i].uid
								// 						});
								// }


							}
							//20191128-end-thonsha-add

							let modelEntity = document.createElement('a-entity');

							if(!obj.res_url){ return };
				
							modelEntity.setAttribute("gltf-model", "#"+obj.obj_id+"_"+obj.res_id);
							
							if (obj.animation){
								modelEntity.setAttribute("animation-mixer", "clip: "+mainAnimation);
							}
							if (obj.behav){
								modelEntity.setAttribute('class', "clickable" ); //// fei add
							}
							else{
								modelEntity.setAttribute('class', "unclickable" ); //// fei add
							}
							modelEntity.setAttribute( "id", obj.obj_id );//// fei add 
							modelEntity.setAttribute('crossorigin', 'anonymous');
			//20200608-thonsha-add-start
							modelEntity.setAttribute("shadow","");
			//20200608-thonsha-add-end
			//20200619-thonsha0add-start
							if (obj.model_shift){
								let model_shift = new THREE.Vector3().fromArray(obj.model_shift.split(",").map(function(x){return Number(x)}) );
								model_shift.multiply(scale);
								position.add(model_shift);
							}
			//20200619-thonsha0add-end


							self.makarObjects.push( modelEntity );

							//20191125-start-thonsha-add
							modelEntity.addEventListener("model-loaded", function(evt){ // model-loaded  / object3dset
								// console.log("three.js: arController: _loadAframeGLTFModel, object3dset: evt=", obj.res_name, evt  , obj );
								if ( evt.target ==  evt.currentTarget ){
									//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
									let maxAnisotropy = self.arfScene.renderer.capabilities.getMaxAnisotropy();


									modelEntity.object3D.children[0].scale.set( 100*25.4/dpi , 100*25.4/dpi , 100*25.4/dpi );
									modelEntity.object3D.children[0].rotation.y = Math.PI;

									let quaternionStr = obj.quaternionRotation.split(",");
									let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

									//// 假如是子物件，不用位移到中央
									let dp = new THREE.Vector3();
									if ( obj.obj_parent_id ){

										modelEntity.object3D.obj_parent_id = obj.obj_parent_id;

										dp.addScaledVector( position, 1*100*25.4/dpi );

										///// 子物件的 z 軸要正負顛倒
										let pz = dp.z ;
										dp.z = -pz;

										self.setAframeTransform( modelEntity, dp, rotation, scale, quaternion );

									} else {

										switch (window.serverVersion){
											case "2.0.0":
												scale.multiplyScalar( 1 );
												dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
												break;

											case "3.0.0":
												scale.multiplyScalar( 2 );
												dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
												break;
											default:
												console.log("three.js: _loadAframeGLTFModel: serverVersion version wrong", serverVersion);
										}

										//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
										let py = dp.y;
										let pz = dp.z;
										dp.y = pz;
										dp.z = py;

										self.setAframeTransform( modelEntity, dp , rotation, scale, quaternion );
										//// 第一層物件必須放置於辨識圖中央										
										modelEntity.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
										//// 第一層物件必須垂直於辨識圖表面
										modelEntity.object3D.rotation.x += Math.PI*90/180;

										console.log('three.js: _loadAframeGLTFModel: loaded: no parent prs=' , modelEntity.object3D.position , modelEntity.object3D.rotation, modelEntity.object3D.scale  );

									}

									let pm = modelEntity.object3D;
									pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;

									//// 場景模型物件帶有「邏輯功能」，「重設參數」，材質，透明度。
									if ( obj.blockly ){
										pm.resetProperty = function(){
											self.setGLTFMaterial( modelEntity , obj  );
										}
									}

									modelEntity.object3D.makarType = 'model';

									modelEntity.object3D["makarObject"] = true; 
									if ( obj.behav ){
										modelEntity.object3D["behav"] = obj.behav ;

										//// 載入時候建制「群組物件資料」「注視事件」
										self.setObjectBehavAll( obj , projIndex );
									}

									if(obj.behav_reference){
										modelEntity.object3D["behav_reference"] = obj.behav_reference ;
									}



									//// 素材調製
									evt.detail.model.traverse( ( object ) => {
										if ( object.isMesh === true && object.material.map !== null ) {
										object.material.map.anisotropy = maxAnisotropy;
										object.material.map.needsUpdate = true;
										}
									});
									if ( modelEntity.object3D ){
										
										self.setGLTFMaterial( modelEntity , obj  );


							//20191203-start-thonsha-add							
										//// if there is animation exist in GLTF, but the editor not contain the animation slices, the mixer will not init.
										//// use the first animation( usually only one), to setup animationSlice.
										if (Array.isArray(evt.detail.model.animations)){
											if ( evt.detail.model.animations.length>0 && !modelEntity.getAttribute("animation-mixer") ){
												console.log("three.js: loadGFLTFModel: the model with animation but no animation-mixer, probabily older version of editor ");
												modelEntity.setAttribute("animation-mixer", "clip: "+ evt.detail.model.animations[0].name );
												animationSlices = [];
												animationSlices.push({ changed:false, idle:"mifly168", uid:"mifly168" });
												animationSlices.push({
													animationName: evt.detail.model.animations[0].name,
													name: evt.detail.model.animations[0].name,
													endTime: evt.detail.model.animations[0].duration ,
													startTime: 0,
													uid:"mifly168"
												});
											}
										}
										
										evt.detail.model.animationSlices = animationSlices;

										modelResolve( modelEntity );

									}
								}else{
									// console.log("three.js: : , target!=currentTarget", obj.res_name, modelEntity.object3D.children );
								}
							});

							//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
							if ( obj.active == false ){
								modelEntity.setAttribute("visible", false);
								modelEntity.setAttribute('class', "unclickable" );
							}

							if(obj.behav_reference){
								for(let i=0; i<obj.behav_reference.length;i++){
									if (obj.behav_reference[i].behav_name == 'ShowModel'){
										modelEntity.setAttribute("visible", false);
										modelEntity.setAttribute('class', "unclickable" );
										break;
									}
								}
								
							}
							//20191029-start-thonhsa-add
							if(obj.obj_parent_id){
								// modelEntity.setAttribute("visible", false);
								// modelEntity.setAttribute('class', "unclickable" );
								let timeoutID = setInterval( function () {
									let parent = document.getElementById(obj.obj_parent_id);
									if (parent){ 
										if(parent.object3D.children.length > 0){
											parent.appendChild(modelEntity);
											window.clearInterval(timeoutID);
										} 
									}
								}, 1);
							}
							else{


								markerRoot.appendChild( modelEntity );

							}
							
						}else{

							console.log("ARFunc.js: _loadAframeGLTFModel , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

							obj.material = [];
							self.loadAframeGLTFModel( markerRoot , obj , position, rotation, scale , self.cubeTex  )

							modelResolve( 1 );

						}
					});

					


				});

				return pModel;

			}




			/////////////////////////////////////////////////////////////////

			//////////////// 大改版 載入方式 /////////////

			//// chkeck is image default image
			//// 
			this.checkDefaultImage = function( obj ){

				switch(obj.res_id){
					case "MakAR_Call":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
						break;
					case "MakAR_Room": 
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
						break;
					case "MakAR_Mail": 
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
						break;
					case "Line_icon":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
						break;
					case "FB_icon":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
						break;
					default:
						console.log("image: default, obj=",  obj );
				}

			}


			this.loadAframeTexture = function( markerRoot, textUrl , obj, position, rotation, scale ){
				console.log("three.js: ARController: _loadAframeTexture, obj=", obj, position, rotation, scale );
				
				self.checkDefaultImage( obj );

				let pTexture = new Promise( function( textureResolve ){

					self.UrlExistsFetch( obj.res_url ).then( retStatus =>{

						if ( retStatus == true ){

							obj.res_url = textUrl;

							let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
							let GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
							let GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 
							let projIndex = self.sceneTargetList[ markerRoot.GCSSID ].projIndex ;

							let texture = new THREE.TextureLoader().load( obj.res_url );

							let url_spit_length = obj.res_url.split(".").length
							let imgType = obj.res_url.split(".")[url_spit_length-1].toLowerCase();

							let plane;
							
							obj.sub_type = obj.sub_type.toLowerCase();
							if ( obj.sub_type == 'png' || obj.sub_type == 'jpg' || obj.sub_type == 'jpeg' || obj.sub_type == 'bmp' ){
								imgType = obj.sub_type;
								plane = document.createElement("a-plane");
								plane.setAttribute( "src", obj.res_url ); //// origin
							}else if ( obj.sub_type == 'gif' ) {
								imgType = obj.sub_type;
								plane = document.createElement("a-entity")
							}else if ( obj.sub_type == 'button' ){
								
								///// 因為預設 附型態 是「按鈕」，我又擔心會有物件副檔名不存在，那就設定為 png
								if ( imgType != 'png' && imgType != 'jpg' && imgType != 'jpeg' ){
									imgType = 'png';
								}

								plane = document.createElement("a-plane");
								plane.setAttribute( "src", obj.res_url ); //// origin
							}else {
								console.log('_loadAframeTexture: sub_type empty, create empty plane ');
								plane = document.createElement("a-plane");
								textureResolve( plane );
								return;
							}


							plane.setAttribute( "id", obj.obj_id );//// fei add 
							plane.setAttribute('crossorigin', 'anonymous');
							

							let transparentImage = false
							if (obj.behav){
								for(let i=0;i<obj.behav.length;i++){
									if (obj.behav[i].simple_behav == "TransparentVideo" || obj.behav[i].simple_behav == "TransparentImage"){
										transparentImage = true;
										chromaKey = obj.behav[i].chromakey;
										slope = obj.behav[i].slope;
										threshold = obj.behav[i].threshold;
										transparentBehav = obj.behav[i];
										// console.log(obj.behav[i]);
									}
								}
							}

							if (transparentImage){
								let rgba = chromaKey.split(",");
								let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

								//20191127-start-thonsha-mod
								let HSV = transparentBehav.HSV.split(",");
								let keyH = parseFloat(HSV[0]);
								let keyS = parseFloat(HSV[1]);
								let keyV = parseFloat(HSV[2]);

								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
									if (transparentBehav.mode == 'RGB'){
										// console.log("===============RGB==============")
										plane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
									}
									else if (transparentBehav.mode == 'HSV'){
										// console.log("three.js: image HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
										plane.setAttribute( "material", "shader: HSVMatting; transparent: true; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";" ); //// thonsha add shader
									}
								}
								else if (imgType == "gif"){
									// plane.setAttribute("geometry", "primitive: plane");
									// plane.setAttribute("material", "shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true;");

									if (transparentBehav.mode == 'RGB'){
										plane.setAttribute("geometry", "primitive: plane");
										plane.setAttribute("material", "shader:gif_RGB;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false; color: #"+color.getHexString()+"; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";");
									}
									else if (transparentBehav.mode == 'HSV'){
										plane.setAttribute("geometry", "primitive: plane");
										plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
									}

								}
								//20191127-end-thonsha-mod
							}
							else{
								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
									// plane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
									plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; " ); //// 圖片不受場上光源影響
								}
								else if (imgType == "gif"){
									plane.setAttribute("geometry", "primitive: plane");
									plane.setAttribute("material", "shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true;");
								}
								
							}

							if (obj.behav){
								if (obj.behav.length==1 && transparentImage){
									plane.setAttribute('class', "unclickable" ); //// fei add
								}
								else{
									plane.setAttribute('class', "clickable" );
								}
							}
							else{
								plane.setAttribute('class', "unclickable" ); //// fei add
							}


							self.makarObjects.push( plane );

							//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
							let maxAnisotropy = self.arfScene.renderer.capabilities.getMaxAnisotropy();
							plane.addEventListener("materialtextureloaded", function(evt){
								// console.log("three.js: _loadAframeTexture: _materialtextureloaded: plane = " , plane.object3D , evt );
								evt.detail.texture.anisotropy = maxAnisotropy;
								evt.detail.texture.needsUpdate = true;
							});

							plane.addEventListener("loaded", function(evt){
								
								// console.log(evt);
								if (evt.target == evt.currentTarget){
									// console.log("three.js: _loadAframeTexture: loaded target same" );

									let timeoutID = setInterval( function () {
										// let tempTexture = plane.object3D.children[0].material.map;
										if (texture.image && plane.object3D && plane.object3D.children && plane.object3D.children[0] && plane.object3D.children[0].scale ){ 
											// plane.object3D.children[0].scale.set(texture.image.width*0.01, texture.image.height*0.01 , 1);

											plane.object3D.children[0].scale.set( texture.image.width*25.4/dpi , texture.image.height*25.4/dpi , 1);
											

											let quaternionStr = obj.quaternionRotation.split(",");
											let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );
											//// 假如是子物件，不用位移到中央
											let dp = new THREE.Vector3();
											if ( obj.obj_parent_id ){

												plane.object3D.obj_parent_id = obj.obj_parent_id;

												dp.addScaledVector( position, 1*100*25.4/dpi );

												///// 子物件的 z 軸要正負顛倒
												let pz = dp.z ;
												dp.z = -pz;

												//// y z 不需要交換，但我不知道為什麼
												self.setAframeTransform( plane, dp, rotation, scale, quaternion );

											} else {

												switch (window.serverVersion){
													case "2.0.0":
														scale.multiplyScalar( 1 )
														dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
														break;

													case "3.0.0":
														dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
														scale.multiplyScalar( 2 )
														break;
													default:
														console.log("three.js: _loadAframeTexture: serverVersion version wrong", serverVersion);
												}


												//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
												let py = dp.y;
												let pz = dp.z;
												dp.y = pz;
												dp.z = py;

												self.setAframeTransform( plane, dp , rotation, scale, quaternion );
												//// 第一層物件必須放至於辨識圖中央										
												plane.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
												//// 第一層物件必須垂直於辨識圖表面
												plane.object3D.rotation.x += Math.PI*90/180;

											}

											// let pm = plane.object3D.children[0];
											let pm = plane.object3D;
											pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;

											//// 場景圖片物件帶有「邏輯功能」，「重設參數」目前沒有功能需求
											if ( obj.blockly ){
												pm.resetProperty = function(){
													
												}
											}

											plane.setAttribute("heightForQuiz", texture.image.height*0.01 ); //// fei add
											window.clearInterval(timeoutID);

											textureResolve( plane );
											
										}
									}, 1);

									// let r = new THREE.Vector3();
									// r.set(0,Math.PI, 0); 
									// plane.object3D.children[0].rotation.setFromVector3(r);

									plane.object3D.makarType = "image";

									plane.object3D["makarObject"] = true; 
									if ( obj.behav ){
										plane.object3D["behav"] = obj.behav ;

										//// 載入時候建制「群組物件資料」「注視事件」
										self.setObjectBehavAll( obj , projIndex );
									}
									if(obj.behav_reference){
										plane.object3D["behav_reference"] = obj.behav_reference ;
									}
									if (obj.main_type=="button"){
										plane.object3D["main_type"] = obj.main_type ;
										plane.object3D["sub_type"] = obj.sub_type ;
										plane.setAttribute('class', "clickable" );
										console.log("three.js: _loadAframeTexture: button " , plane );
									}

									

								}else{
									console.log("three.js: _loadAframeTexture: loaded target different" );
								}
							});
							//20191031-end-thonsha-mod

							//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
							if ( obj.active == false ){
								plane.setAttribute("visible", false);
								plane.setAttribute('class', "unclickable" );
							}


							//20191227-start-thonsha-add
							// console.log("image behav_reference: ",obj.behav_reference);
							if(obj.behav_reference){
								for(let i=0; i<obj.behav_reference.length;i++){
									if (obj.behav_reference[i].behav_name == 'ShowImage'){
										plane.setAttribute("visible", false);
										plane.setAttribute('class', "unclickable" );
										break;
									}
								}
								
							}
							//20191227-end-thonsha-add

							//20191029-start-thonhsa-add
							if(obj.obj_parent_id){
								// plane.setAttribute("visible", false);
								// plane.setAttribute('class', "unclickable" );
								let timeoutID = setInterval( function () {
									let parent = document.getElementById(obj.obj_parent_id);
									if (parent){ 
										if(parent.object3D.children.length > 0){
											parent.appendChild(plane);
											window.clearInterval(timeoutID);
										}
									}
								}, 1);
							}
							else{
								
								markerRoot.appendChild( plane )

							}


						}else{

							console.log("ARFunc.js: _loadAframeTexture , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
							obj.material = [];
							self.loadAframeGLTFModel( markerRoot , obj , position, rotation, scale , self.cubeTex  )

							textureResolve( 1 );

						}
					});

				});

				return pTexture;

			}




			//////////////////////////////////////////////




//[start-20200514-fei0094-add]//
			//// 使用外加 canvas 來製作，對位跟榜定target需要注意
			this.loadCanvas2D = function(markerRoot2D, obj, position, rotation, scale , scratchCardCallback ){
				
				let scratchedImageUrl="";
				if (Array.isArray(obj.project_module) ){
					if (obj.project_module.length == 1){
						if ( obj.project_module[0].scratch_image_url  ){
							var res = this.getDefaultImageUrl(obj.project_module[0].scratch_image_url);
							if (res.indexOf("https") >= 0 ) {
								scratchedImageUrl = res;
							}else{
								console.error( 'three.js: _loadCanvas2D: error, obj.project_module[0].scratch_image_url not include [https]' , obj );
							}
						}else{
							console.log( 'three.js: _loadCanvas2D: obj.project_module[0].scratch_image_url not exist or empty, use default');
							scratchedImageUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/ScratchCard_Default.png"
						}
					}else{
						console.error( 'three.js: _loadCanvas2D: error, obj.project_module length>1' , obj );	
					}
				}else{
					console.error( 'three.js: _loadCanvas2D: error, obj.project_module not array' , obj );
				}

				if (scratchedImageUrl == ""){
					return;
				}


				let projIndex = self.sceneTargetList[ markerRoot2D.GCSSID ].projIndex ;
				let editor_version = self.getProjectVersion( projIndex );

				//// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
				//// 位置    縮放    尺寸   旋轉
				let rectP, rectSizeDelta, rectScale , rectR ; 
				if ( Array.isArray ( editor_version )  && editor_version.length == 3 ){
					let largeV  = Number( editor_version[0] );
					let middleV = Number( editor_version[1] );
					let smallV  = Number( editor_version[2] );	
					//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
					if ( largeV > 3 || 
						( largeV == 3 && middleV > 3 ) ||
						( largeV == 3 && middleV == 3 && smallV > 8 )
					){
						let trans = getObj2DInfo338();
						if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
							rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
						}else{
							texture2DResolve( false );
						}
					}else{
						let trans = getObj2DInfo300();
						if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
							rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
						}else{
							texture2DResolve( false );
						}
					}
				}else{
					let trans = getObj2DInfo338();
					if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
						rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
					}else{
						texture2DResolve( false );
					}

				}



				function getObj2DInfo338 (){

					let tempInfo = {};
					//// 位置    縮放    尺寸   旋轉
					let rectP, rectSizeDelta, rectScale , rectR ; 
					if ( obj.rect_transform && Array.isArray( obj.rect_transform ) && obj.rect_transform.length > 0 ){

						let selectedResolutionIndex = self.getResolutionIndex( projIndex );

						if ( !Number.isFinite( selectedResolutionIndex )   ){
							console.log(' _getObj2DInfo338: error, missing _selectedResolutionIndex' );
							selectedResolutionIndex = 0;
						}
						let selectedObj2DInfo = obj.rect_transform[ selectedResolutionIndex ];

						if ( selectedObj2DInfo.position && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
							rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
							rectSizeDelta = selectedObj2DInfo.size_dalta.split(",").map(function(x){return Number(x)}); 
							rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
							rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

							let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]),parseFloat(rectR[1]),parseFloat(rectR[2]),parseFloat(rectR[3]))
							let b = new THREE.Euler();
							b.setFromQuaternion(quaternionRotation);

							//// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
							rotation.z = b.z/Math.PI * 180 ;

							//// 為了相容 ，把「縮放資料」取代 「原本 scale」
							scale.x = rectScale[0];
							scale.y = rectScale[1];

							tempInfo = {
								rectP: rectP,
								rectSizeDelta: rectSizeDelta,
								rectScale: rectScale
							}
						}
						

					}

					return tempInfo;
				}

				function getObj2DInfo300(){

					//// 位置    縮放    尺寸   旋轉
					let rectP, rectSizeDelta , rectScale ; 
					if (obj.rect_transform){
						if(obj.rect_transform.length != 5 ){
							console.log(" _loadCanvas2D: fail, rect_transform.length !=5", obj.rect_transform.length);
							return ;
						}
						rectP = obj.rect_transform[0].split(",").map(function(x){return Number(x)}); 
						rectSizeDelta = obj.rect_transform[1].split(",").map(function(x){return Number(x)}); 
						rectScale = obj.rect_transform[2].split(",").map(function(x){return Number(x)}); //// 3.3.0 版本此數值無用
						console.log(" _loadCanvas2D: rect PSO=", rectP, rectSizeDelta, rectScale, rotation, scale);

						return {
							rectP: rectP,
							rectSizeDelta: rectSizeDelta,
							rectScale: rectScale,
						}
					}else{
						console.log(" _loadCanvas2D: fail, no rect_transform");
						return;
					}

				}


				let scaleRatioXY = self.get2DScaleRatioByProjIndex( projIndex );
				
				let width, height;
				width  = rectSizeDelta[0] * scale.x * scaleRatioXY ; // 2/3 is the factor = 480/720 
				height = rectSizeDelta[1] * scale.y * scaleRatioXY ;
				
				// console.log("__________ wh=", width, ",", height, ", rectSizeDelta =", rectSizeDelta, ", rectP=", rectP, "scaleR XY=", scaleRatioXY );
				// console.log("___rw, rh___" , rw , rh );

				let scratchCanvasContainer = document.createElement("div");
				scratchCanvasContainer.setAttribute("class", "scratchCanvasContainer");//// 這個名字不能更換 css 榜定
				scratchCanvasContainer.setAttribute("id", obj.obj_id );//// 這個名字不能更換 css 榜定

				//// set the scale of div
				scratchCanvasContainer.style.width = width + "px";
				scratchCanvasContainer.style.height = height + "px";
				scratchCanvasContainer.style.left = ( innerWidth/2 - width/2 )  + (rectP[0]*scaleRatioXY ) + "px";
				scratchCanvasContainer.style.top  = ( innerHeight/2 - height/2 )  + (-rectP[1]*scaleRatioXY ) + "px";

				// scratchCanvasContainer.style.opacity = 0.5; //// develop

				// scratchCanvasContainer.style.left = ( innerWidth/2 - rw/2 ) + ( rw/2 - width/2 ) + (rectP[0]*scaleRatioXY ) + "px";
				// scratchCanvasContainer.style.top  = ( innerHeight/2 - rh/2 ) + ( rh/2 - height/2 ) + (-rectP[1]*scaleRatioXY ) + "px";

				let scratchCanvas = document.createElement("canvas");
				let canvasContext = scratchCanvas.getContext( '2d' );				
				scratchCanvas.setAttribute("class", "scratchCanvas");//// 這個名字不能更換 css 榜定
				scratchCanvas.setAttribute("width", width );
				scratchCanvas.setAttribute("height", height );
				
				let scratchedImage = new Image();
				// scratchedImage.src = scratchedImageUrl;
				// scratchedImage.crossOrigin = "anonymous";
				scratchedImage.onload = function() {
					// console.log("_______ scratchCanvas=", scratchCanvas.width , scratchCanvas.height , scratchCanvas.style.width, scratchedImage.width  );
					// console.log("_______ self.GLRenderer=", self.GLRenderer.domElement.offsetLeft , self.GLRenderer );
					// canvasContext.drawImage(scratchedImage, 0, 0, 300, 50  );
					//// src, sx, sy, drawWidth, drawHeight
					// canvasContext.drawImage(scratchedImage, 0, 0, scratchCanvas.width, scratchCanvas.height  );
					canvasContext.drawImage(scratchedImage, 0, 0, scratchedImage.width, scratchedImage.height, 0, 0, scratchCanvas.width, scratchCanvas.height );

					if (scratchCardCallback){
						setTimeout(function(){
							scratchCardCallback(rootObject);
						}, 1);
					}
				};

				let xhr = new XMLHttpRequest();
				xhr.open("GET", scratchedImageUrl );
				xhr.responseType = "blob";
				xhr.onload = function(e){
					let urlCreator = window.URL || window.webkitURL;
					let imageUrl = urlCreator.createObjectURL(this.response);
					scratchedImage.src = imageUrl;
				};
				xhr.send();
		

				scratchCanvasContainer.appendChild(scratchCanvas);
				document.body.appendChild(scratchCanvasContainer);
				
				let rootObject = new THREE.Object3D();
				//// make the structure same with MAKAR json as possible as we can
				rootObject["obj_id"] = obj.obj_id;
				rootObject["main_type"] = "module";
				rootObject["sub_type"] = "scratch_card";
				rootObject["canvasDomElement"] = scratchCanvasContainer;

				if (obj.project_module[0].password){
					rootObject["password"] = obj.project_module[0].password;
				}else{
					rootObject["password"] = "";
				}

				markerRoot2D.add(rootObject);
				
				aScratchCard.setCanvas(scratchCanvas, scratchCanvasContainer, rootObject);

				// console.log("three.js: _loadCanvas2D: ...........obj, " , obj, markerRoot2D, rootObject );


				// let ct = new THREE.CanvasTexture( canvas );

			}


//[end---20200514-fei0094-add]//


			////////// 大改版，2D圖片，改為 aframe 架構 //////////////

			this.loadAframeTexture2D = function( markerRoot2D, obj, textureUrl, index, sceneObjNum, position, rotation, scale ){
				console.log("three.js: arController: _loadAframeTexture2D , obj=", obj, position, rotation, scale , textureUrl );

				self.checkDefaultImage( obj );

				let projIndex = self.sceneTargetList[ markerRoot2D.GCSSID ].projIndex ;
				let editor_version = self.getProjectVersion( projIndex );

				let pTexture2D = new Promise( function( texture2DResolve ){
					var loader = new THREE.TextureLoader();
					loader.load(
						textureUrl ,
						function ( texture ) {
							// console.log("three.js: _loadAframeTexture2D: texture WH=", texture.image.width , texture.image.height );

							// let rectP, rectS, rectO ; 

							//// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
							//// 位置    縮放    尺寸   旋轉
							let rectP, rectSizeDelta, rectScale , rectR ; 
							if ( Array.isArray ( editor_version )  && editor_version.length == 3 ){
								let largeV  = Number( editor_version[0] );
								let middleV = Number( editor_version[1] );
								let smallV  = Number( editor_version[2] );	
								//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
								if ( largeV > 3 || 
								   ( largeV == 3 && middleV > 3 ) ||
								   ( largeV == 3 && middleV == 3 && smallV > 8 )
								){
									let trans = getObj2DInfo338();
									if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
										rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
									}else{
										texture2DResolve( false );
									}
								}else{
									let trans = getObj2DInfo300();
									if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
										rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
									}else{
										texture2DResolve( false );
									}
								}
							}else{
								let trans = getObj2DInfo338();
								if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
									rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
								}else{
									texture2DResolve( false );
								}

							}


							function getObj2DInfo338 (){

								let tempInfo = {};
								//// 位置    縮放    尺寸   旋轉
								let rectP, rectSizeDelta, rectScale , rectR ; 
								if ( obj.rect_transform && Array.isArray( obj.rect_transform ) && obj.rect_transform.length > 0 ){
	
									let selectedResolutionIndex = self.getResolutionIndex( projIndex );

									if ( !Number.isFinite( selectedResolutionIndex )   ){
										console.log(' _loadAframeTexture2D: _getObj2DInfo338: error, missing _selectedResolutionIndex' );
										selectedResolutionIndex = 0;
									}
									let selectedObj2DInfo = obj.rect_transform[ selectedResolutionIndex ];

									if ( selectedObj2DInfo.position && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
										rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
										rectSizeDelta = selectedObj2DInfo.size_dalta.split(",").map(function(x){return Number(x)}); 
										rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
										rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

										let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]),parseFloat(rectR[1]),parseFloat(rectR[2]),parseFloat(rectR[3]))
										let b = new THREE.Euler();
										b.setFromQuaternion(quaternionRotation);

										//// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
										rotation.z = b.z/Math.PI * 180 ;

										//// 為了相容 ，把「縮放資料」取代 「原本 scale」
										scale.x = rectScale[0];
										scale.y = rectScale[1];

										tempInfo = {
											rectP: rectP,
											rectSizeDelta: rectSizeDelta,
											rectScale: rectScale
										}
									}
									

								}

								return tempInfo;
							}

							function getObj2DInfo300(){

								//// 位置    縮放    尺寸   旋轉
								let rectP, rectSizeDelta , rectScale ; 
								if (obj.rect_transform){
									if(obj.rect_transform.length != 5 ){
										console.log(" _loadAframeTexture2D: fail, rect_transform.length !=5", obj.rect_transform.length);
										return ;
									}
									rectP = obj.rect_transform[0].split(",").map(function(x){return Number(x)}); 
									rectSizeDelta = obj.rect_transform[1].split(",").map(function(x){return Number(x)}); 
									rectScale = obj.rect_transform[2].split(",").map(function(x){return Number(x)}); //// 3.3.0 版本此數值無用
									console.log(" _loadAframeTexture2D: rect PSO=", rectP, rectSizeDelta, rectScale, rotation, scale);

									return {
										rectP: rectP,
										rectSizeDelta: rectSizeDelta,
										rectScale: rectScale,
									}
								}else{
									console.log(" _loadAframeTexture2D: fail, no rect_transform");
									return;
								}

							}

							
							texture.flipY = false ; 
							//// scale part only x, y , temp work on both android and iOS
							console.log("three.js: _loadAframeTexture2D: innerWH , camera2D ", innerWidth, innerHeight , self.arfScene.clientWidth, self.arfScene.clientHeight );
							

							let width, height;
							let scaleRatioXY = self.get2DScaleRatioByProjIndex( projIndex );
							
							//// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
							width  = rectSizeDelta[0] * scaleRatioXY ;
							height = rectSizeDelta[1] * scaleRatioXY ;


							///////////////////////////////

							let imgType = obj.sub_type ;

							let rootObject = new THREE.Object3D();
							rootObject.makarType = "image2D";

							let transparentImage = false
							let transparentBehav;
							if (obj.behav){
								for(let i=0; i < obj.behav.length; i++){
									if (obj.behav[i].simple_behav == "TransparentImage"){
										transparentImage = true;
										arrayColor = obj.behav[i].chromakey.split(",") ;
										slope = obj.behav[i].slope;
										threshold = obj.behav[i].threshold;
										transparentBehav = obj.behav[i];
										console.log("three.js: _loadAframeTexture2D: behav TransparentImage" , obj.behav[i]);
									}
								}
							}

							let plane;
							let gifObject ;
							
							if (transparentImage){
								
								let HSV = transparentBehav.HSV.split(",");
								let keyH = parseFloat(HSV[0]);
								let keyS = parseFloat(HSV[1]);
								let keyV = parseFloat(HSV[2]);
								let chromaKeyMaterial;
								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){
									if (transparentBehav.mode == "RGB"){
										chromaKeyMaterial = new THREE.ChromaKeyMaterial({
											map: texture , 
											keyColor: arrayColor ,
											side: THREE.DoubleSide, 
											slope: slope,
											threshold: threshold,
										});
										
									} else if (transparentBehav.mode == "HSV"){
										chromaKeyMaterial = new THREE.HSVMattingMaterial({
											map: texture , 
											side: THREE.DoubleSide, // DoubleSide
											_keyingColorH: keyH,
											_keyingColorS: keyS,
											_keyingColorV: keyV,
											_deltaH: transparentBehav.hue,
											_deltaS: transparentBehav.saturation,
											_deltaV: transparentBehav.brightness,
										});
									}
									// plane = THREE.SceneUtils.createMultiMaterialObject( new THREE.PlaneBufferGeometry(
									// 	texture.image.width*25.4/dpi ,
									// 	texture.image.height*25.4/dpi , 0 ), [ 
									// 		chromaKeyMaterial,
									// 		new THREE.MeshBasicMaterial( { color: 0xC0C0C0 , side: THREE.BackSide } ) 
									// 	]
									// );
									plane = new THREE.Mesh( 
										// new THREE.PlaneBufferGeometry( width , height , 0 ), 
										new THREE.PlaneGeometry( width, height ), 
										chromaKeyMaterial,
									);
								}else if (imgType == "gif"){
									gifObject = new THREE.gifAnimator();
									gifObject.init({ src: textureUrl , side: THREE.DoubleSide, transparent: true, opacity: 1.0, autoplay: true, chroma: transparentBehav });
									rootObject.gifObject = gifObject;

									//// 上下顛倒
									if ( gifObject.__texture.flipY ){
										gifObject.__texture.flipY = false;
									}

									plane = new THREE.Mesh(
										// new THREE.PlaneBufferGeometry( width, height , 0 ),
										new THREE.PlaneGeometry( width, height ), 
										gifObject.material,
									);
								}
								
								
							} else {

								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){

									plane = new THREE.Mesh( 
										// new THREE.PlaneBufferGeometry( width, height , 0 ), 
										new THREE.PlaneGeometry( width, height ), 
										new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true  } ),
									);

								} else if (imgType == "gif"){
									gifObject = new THREE.gifAnimator();
									gifObject.init({ src: textureUrl , side: THREE.DoubleSide, transparent: true, opacity: 1.0, autoplay: true });
									rootObject.gifObject = gifObject;

									//// 上下顛倒
									if ( gifObject.__texture.flipY ){
										gifObject.__texture.flipY = false;
									}

									plane = new THREE.Mesh(
										// new THREE.PlaneBufferGeometry( width, height , 0 ),
										new THREE.PlaneGeometry( width, height ), 
										gifObject.material,
									);
								}

							}						

							if (obj.behav_reference){
								rootObject.behav_reference = obj.behav_reference;
								for (let j = 0;j<obj.behav_reference.length; j++){
									if (obj.behav_reference[j].behav_name == "ShowImage"  ){
										rootObject.visible = false;
										if (imgType == "gif" ){
											//// 這邊只有 pause不恰當，因為 gifAnimator 中的[__ready]在被呼叫的時候，會以 autoplay 為標準決定是否執行play
											//// 無法確定 __ready執行的時間，假如已經執行過，這邊 pause則會暫停更新畫面，假如還沒執行過，這邊設 autoplay false會讓 ready時不 play
											gifObject.pause();
											gifObject.__autoplay = false;

										}
									}
								}
							}


							////////////////////////////////

							// var plane = new THREE.Mesh(
							// 	new THREE.PlaneBufferGeometry( width , height , 0 ),
							// 	new THREE.MeshBasicMaterial( { map : texture,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
							// );

							
							if ( obj.behav ){
								rootObject["behav"] = obj.behav ;

								//// 載入時候建制「群組物件資料」「注視事件」
								self.setObjectBehavAll( obj , projIndex );
							}
							
							if (obj.active == false){
								rootObject.visible = false;
							}

							if (obj.behav_reference){
								rootObject.behav_reference = obj.behav_reference;
								for (let j = 0; j < obj.behav_reference.length; j++){
									if (obj.behav_reference[j].behav_name == "ShowImage" ){
										rootObject.visible = false;
									}
								}
							}

							if (obj.main_type=="button"){
								rootObject["main_type"] = obj.main_type ;
								rootObject["sub_type"] = obj.sub_type ;
								console.log("three.js: _loadAframeTexture2D: button " , plane );
							}

							
							//20191029-start-thonhsa-add
							if(obj.obj_parent_id){
								// console.log("three.js: _loadAframeTexture2D: obj(parent) ", obj );

								let setIntoParent = function(){
									let isParentSet = false;
									for (let i = 0; i < self.makarObjects2D.length; i++ ){
										if ( self.makarObjects2D[i].obj_id == obj.obj_parent_id  ){
											isParentSet = true;
										}
									}

									if ( isParentSet == false ) {
										setTimeout(setIntoParent, 500 );
										// console.log("three.js: _loadAframeTexture2D: isParentSet   ", obj , self.makarObjects2D );

									}else{
										for (let i = 0; i < self.makarObjects2D.length; i++){
											if (self.makarObjects2D[i].obj_id == obj.obj_parent_id){
												
												//// 改為統一移動比例
												rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
												rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

												// // translate the plane lower, will not be smaller because the camera is OrthographicCamera, but make it must behind the default texture
												let wp = new THREE.Vector3();
												self.makarObjects2D[i].getWorldPosition( wp );
												rootObject.translateZ( -1 + index/sceneObjNum - wp.z ) ; // [-1, 0]
						
												// //// rotation only at z direction
												rootObject.rotateZ( -rotation.z /180*Math.PI);

												rootObject.scale.set( scale.x , scale.y , 1 );
												
												self.makarObjects2D[i].add(rootObject);
												self.makarObjects2D.push(rootObject);

												rootObject.add(plane);
												rootObject["makarObject"] = true ;
												rootObject["obj_id"] = obj.obj_id ;
												rootObject["obj_parent_id"] = obj.obj_parent_id ;

												texture2DResolve( rootObject );

												console.log("three.js: _loadAframeTexture2D: parent exit, set obj(parent) ", obj , plane );

											}
										}

									}
								};
								setIntoParent();

							} else{
								// console.log("three.js: _loadAframeTexture2D: obj() ", obj );

								//// position, same process

								rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
								rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

								// // translate the plane lower, will not be smaller because the camera is OrthographicCamera, but make it must behind the default texture
								rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

								// //// rotation only at z direction
								rootObject.rotateZ( -rotation.z /180*Math.PI);

								rootObject.scale.set( scale.x , scale.y , 1 );
								
								self.makarObjects2D.push(rootObject);

								markerRoot2D.add( rootObject );

								rootObject.add(plane);
								rootObject["makarObject"] = true ;
								rootObject["obj_id"] = obj.obj_id ;


								texture2DResolve( rootObject );

							}
							//20191029-end-thonhsa-add
							
							// console.log("three.js: arController: _loadAframeTexture2D ,obj=", obj );

						},
						undefined,
						function ( err ) {
							console.error( 'An error happened. _loadAframeTexture2D , err=', err);
						}
					);

				});
				
				return pTexture2D;

			}


			//////////////////////////////////////////////////////


//// load default buttom (without the MAKAR Scene Obejct)
			this.loadDeaultTexture2D = function(markerRoot2D, url, position, rotation, scale, rect, behav ){
				// console.log("three.js: _loadDeaultTexture2D: markerRoot.GCSSID=", markerRoot.GCSSID );
				var loader = new THREE.TextureLoader();
				loader.load(
					url,
					function ( texture ) {
						let rectP, rectS, rectO ; 
						
						rectP = [0, 0, 0];
						rectS = [150, 150]; //default scale 
						// rectO = [0.5, 0];
						rectO = rect;

						texture.flipY = false ; 
						//// scale part only x, y 
						let width, height;
//[start-20190828-fei0071-mod]//

						// width  = rectS[0] * scale.x * 2/3 ; // 2/3 is the factor = 480/720 
						// height = rectS[1] * scale.y * 2/3 ;

						width  =  texture.image.width * scale.x * 2/3 ; // 2/3 is the factor = 480/720 
						height =  texture.image.height * scale.y * 2/3 ;
						// console.log("three.js: texture WH = ", texture.image.width, texture.image.height, texture ) ;
//[end---20190828-fei0071-mod]//
						// for double side 
						var plane = new THREE.Mesh(
							// new THREE.PlaneBufferGeometry( width , height , 0 ),
							new THREE.PlaneGeometry( width, height ), 
							new THREE.MeshBasicMaterial( { map : texture,  side: THREE.DoubleSide,  transparent: true, opacity: 1 } ) // DoubleSide, FrontSide
						);
						
						//// position Align part
						if ( rectO[0] == 0.5 && rectO[1] == 0.5 ){

						} else if ( rectO[0] == 1 && rectO[1] == 0.5 ){
							plane.translateX( 240 - width*1/2 ) ; // algin to right 
						} else if ( rectO[0] == 0 && rectO[1] == 0.5 ){
							plane.translateX( -240 + width*1/2 ) ; // algin to left 
						} else if ( rectO[0] == 0.5 && rectO[1] == 1 ){
							plane.translateY( -320 + height*1/2 ) ; // algin to top 
						} else if ( rectO[0] == 0.5 && rectO[1] == 0 ){
							plane.translateY( 320 - height*1/2 ) ; // algin to bottom 
						} else if ( rectO[0] == 0 && rectO[1] == 1 ){
							plane.translateX( -240 + width*1/2 ) ; // algin to left 
							plane.translateY( -320 + height*1/2 ) ; // algin to top 
						} else if ( rectO[0] == 1 && rectO[1] == 1 ){
							plane.translateX( 240 - width*1/2 ) ; // algin to right 
							plane.translateY( -320 + height*1/2 ) ; // algin to top 
						} else if ( rectO[0] == 0 && rectO[1] == 0 ){
							plane.translateX( -240 + width*1/2 ) ; // algin to left 
							plane.translateY( 320 - height*1/2 ) ; // algin to bottom 
						} else if ( rectO[0] == 1 && rectO[1] == 0 ){
							plane.translateX( 240 - width*1/2 ) ; // algin to right 
							plane.translateY( 320 - height*1/2 ) ; // algin to bottom 
						}

						//// set position by default, same process
						plane.translateX(  rectP[0]*2/3 ) ; // 480/720
						plane.translateY( -rectP[1]*1/2 ) ; // 640/1280, reverse.. dont know why

						//// set the poistion by "position"
						plane.translateX(  position.x ) ; // 480/720
						plane.translateY( -position.y ) ; // 640/1280, reverse.. dont know why
					
						// plane.translateZ( 2 ) ; // 放靠前一點

						//// rotation only at z direction
						plane.rotateZ( -rotation.z /180*Math.PI);

//[start-20190830-fei0072-remove]//						
						// if ( behav == "coloring" ){
						// 	plane["behav"] = [ {name: "Coloring", enable: false } ] ;
						// 	plane["makarObject"] = true ;
						// 	plane.name = "colorButton";
						// 	plane.material.opacity = 1.0;
						// }else if ( behav == "snapShot" ) {
						// 	plane["behav"] = [ { name: "SnapShot", enable: true } ] ;
						// 	plane["makarObject"] = true ; // add this make the raycast can get the object with behave
						// 	// plane.name = "snapShotButton";
						// }else if (behav == "exchangeCamera" ){
						// 	plane["behav"] = [ { name: "exchangeCamera", enable: true } ] ;
						// 	plane["makarObject"] = true ; // add this make the raycast can get the object with behave
						// }
//[end---20190830-fei0072-remove]//

//[start-20190828-fei0071-add]//
						////// now only runAnimation2D 
						switch(behav.simple_behav){
							case "coloring":
								// plane["behav"] = [ {name: "Coloring", enable: false } ] ;
								plane["behav"] = [ {simple_behav: "Coloring", enable: false } ] ;
								plane["makarObject"] = true ;
								plane.name = "colorButton";
								plane.material.opacity = 1.0;

								//// 高度調整
								if ( arController && arController.arfScene && arController.arfScene.clientHeight ){
									let ch = arController.arfScene.clientHeight;
									plane.position.y = ch*( 0.5 - 0.15 );
								}

								break;
							case "snapShot":
								// plane["behav"] = [ { name: "SnapShot", enable: true } ] ;
								plane["behav"] = [ { simple_behav: "SnapShot", enable: true } ] ;
								plane["makarObject"] = true ; // add this make the raycast can get the object with behave
								break;		
							
							case "exchangeCamera":
								// plane["behav"] = [ { name: "exchangeCamera", enable: true } ] ;
								plane["behav"] = [ { simple_behav: "exchangeCamera", enable: true } ] ;
								plane["makarObject"] = true ; // add this make the raycast can get the object with behave
								break;

							case "runAnimation2D":
								plane["behav"] = [ behav ];
								plane["makarObject"] = true;							
								break;

							default:
								console.log("three.js: _loadDeaultTexture2D: default: behav=", behav );
								break;
						}

						// if (behav.name){
						// 	// console.log("%c three.js: _loadDeaultTexture2D: behav= ", "color:blue", behav );
						// 	plane["behav"] = [ behav ];
						// 	plane["makarObject"] = true; // add this make the raycast can get the object with behave				 
						// }
//[end---20190828-fei0071-add]//
						plane.defaultTexture = true; //// 20190628 fei: for triggerEvent, trigger first.
						plane.visible = true;

						// console.log("three.js: _loadDeaultTexture2D: plane = ", plane);

						markerRoot2D.add(plane);
					},
					undefined,
					function ( err ) {
						console.error( 'An error happened. _loadDeaultTexture2D' );
					}
				);
			}


//[end---20191011-fei0048-add]//

//[start-20190823-fei0071-add]//
			////// the json file is large, so load onetimes..
			// this.loadText2D = function(markerRoot2D, text, font, position, rotation, scale, rect, behav ){
			// 	// console.log("three.js: _loadText2D: markerRoot.GCSSID=", markerRoot2D.GCSSID );
				
			// 	var textGeo = new THREE.TextGeometry( text, {
			// 		font: font,
			// 		size: 30,
			// 		height: 1,
			// 		curveSegments: 12,
			// 		bevelEnabled: true,
			// 		bevelThickness: 5,
			// 		bevelSize: 0.5,
			// 		bevelOffset: 0,
			// 		bevelSegments: 3
			// 	} );

			// 	textGeo.computeBoundingBox();
			// 	textGeo.computeVertexNormals();
	
			// 	let rectP, rectS, rectO ;
			// 	rectP = [0, 0, 0];
			// 	rectS = [150, 150]; //default scale 
			// 	// rectO = [0.5, 0];
			// 	rectO = rect;


			// 	//// scale part only x, y 
			// 	let width, height;
			// 	width  = textGeo.boundingBox.max.x - textGeo.boundingBox.min.x;
			// 	height = textGeo.boundingBox.max.y - textGeo.boundingBox.min.y;

			// 	var group = new THREE.Mesh(
			// 		new THREE.PlaneBufferGeometry( width , height , 0 ),
			// 		new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(200, 100, 100)"), side: THREE.DoubleSide, transparent: true, opacity: 0.1 } ) // DoubleSide, FrontSide
			// 	);
			
			// 	var textMaterial = new THREE.MeshBasicMaterial( 
			// 		{ color: new THREE.Color("rgb(220, 220, 220)") ,
			// 			side: THREE.FrontSide, transparent: true, opacity: 1 }
			// 	);
			// 	var plane = new THREE.Mesh( textGeo, textMaterial );

			// 	//// 20190823: Honestly, Fei dont know why this work. Now only work the one colume text
			// 	plane.translateX( -(textGeo.boundingBox.max.x + textGeo.boundingBox.min.x)*0.5 );//// offset the X
			// 	plane.translateY( (textGeo.boundingBox.max.y + textGeo.boundingBox.min.y)*0.5 );//// offset the Y
			// 	plane.rotateOnWorldAxis ( new THREE.Vector3(1, 0, 0), Math.PI*180/180 );

			// 	group.add(plane);
				
			// 	// console.log("three.js: loadText2D: textGeo=", textGeo.boundingBox, " WH=", width, height );

			// 	//// position Align part
			// 	if ( rectO[0] == 0.5 && rectO[1] == 0.5 ){

			// 	} else if ( rectO[0] == 1 && rectO[1] == 0.5 ){
			// 		group.translateX( 240 - width*1/2 ) ; // algin to right 
			// 	} else if ( rectO[0] == 0 && rectO[1] == 0.5 ){
			// 		group.translateX( -240 + width*1/2 ) ; // algin to left 
			// 	} else if ( rectO[0] == 0.5 && rectO[1] == 1 ){
			// 		group.translateY( -320 + height*1/2 ) ; // algin to top 
			// 	} else if ( rectO[0] == 0.5 && rectO[1] == 0 ){
			// 		group.translateY( 320 - height*1/2 ) ; // algin to bottom 
			// 	} else if ( rectO[0] == 0 && rectO[1] == 1 ){
			// 		group.translateX( -240 + width*1/2 ) ; // algin to left 
			// 		group.translateY( -320 + height*1/2 ) ; // algin to top 
			// 	} else if ( rectO[0] == 1 && rectO[1] == 1 ){
			// 		group.translateX( 240 - width*1/2 ) ; // algin to right 
			// 		group.translateY( -320 + height*1/2 ) ; // algin to top 
			// 	} else if ( rectO[0] == 0 && rectO[1] == 0 ){
			// 		group.translateX( -240 + width*1/2 ) ; // algin to left 
			// 		group.translateY( 320 - height*1/2 ) ; // algin to bottom 
			// 	} else if ( rectO[0] == 1 && rectO[1] == 0 ){
			// 		group.translateX( 240 - width*1/2 ) ; // algin to right 
			// 		group.translateY( 320 - height*1/2 ) ; // algin to bottom 
			// 	}

			// 	//// position, same process
			// 	group.translateX(  rectP[0]*2/3 ) ; // 480/720
			// 	group.translateY( -rectP[1]*1/2 ) ; // 640/1280, reverse.. dont know why
			// 	// translate the group lower, will not be smaller because the camera is OrthographicCamera, but make it must behind the default texture
			// 	group.translateZ( -0.5 ) ; 

			// 	//// set the poistion by "position"
			// 	plane.translateX(  position.x ) ; // 480/720
			// 	plane.translateY( -position.y ) ; // 640/1280, reverse.. dont know why

			// 	//// rotation only at z direction
			// 	group.rotateZ( -rotation.z /180*Math.PI);

			// 	group["makarObject"] = true ; // if makarObject set false, the raycaster can't trigger the object.

			// 	////// only allow runAnimation3D/runAnimation2D behavior.
			// 	// if ( behav ){ 
			// 	// 	group["behav"] = [ behav ];
			// 	// }

			// 	console.log("three.js: loadText2D: group = ", group);

			// 	markerRoot2D.add(group);

			// }

//[end---20190823-fei0071-add]//


			this.loadAframeVideo = function( markerRoot, obj, position, rotation, scale ){

				let pVideo = new Promise( function( videoResolve ){

					self.UrlExistsFetch( obj.res_url ).then( retStatus =>{

						if ( retStatus == true ){
	
							let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
							let GCSSWidth = self.gcssTargets.width[markerRoot.GCSSID] ; 
							let GCSSHeight = self.gcssTargets.height[markerRoot.GCSSID] ; 

							let projIndex = self.sceneTargetList[ markerRoot.GCSSID ].projIndex ;


							let assets = document.getElementById("makarAssets");

							var mp4Video, mp4Texture ;

							mp4Video = document.createElement('video');
							mp4Video.src = obj.res_url; // url, "Data/makarVRDemo.mp4"
							mp4Video.playsInline = true;
							mp4Video.autoplay = false;
							//thonsha add
							mp4Video.loop = true;
							//thonsha add
							mp4Video.setAttribute('crossorigin', 'anonymous');
							mp4Video.setAttribute("id", obj.obj_id+"_"+obj.res_id );
							// mp4Video.setAttribute("hidden", "true");
							// mp4Video.setAttribute("loop", "true");
							assets.appendChild(mp4Video); ////// add video into a-assets

							if (window.Browser){
								if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location )  ){
									mp4Video.muted = true;
								}
							}
							

							mp4Video.onloadedmetadata = function() {
								var videoWidth , videoHeight;
								if (mp4Video.videoWidth >= mp4Video.videoHeight){
									videoWidth = 1;
									videoHeight = 1*mp4Video.videoHeight/mp4Video.videoWidth;
								}else{
									videoWidth = 1*mp4Video.videoWidth/mp4Video.videoHeight;
									videoHeight = 1;
								}

								// console.log("three.js: video WH=", mp4Video.videoWidth , mp4Video.videoHeight);
								let videoPlane = document.createElement("a-video");
								//20191108-start-thonsha-add
								let transparentVideo = false
								if (obj.behav){
									for(let i=0;i<obj.behav.length;i++){
										if (obj.behav[i].simple_behav == "TransparentVideo"){
											// console.log(obj.behav[i])
											transparentVideo = true;
											chromaKey = obj.behav[i].chromakey;
											slope = obj.behav[i].slope;
											threshold = obj.behav[i].threshold;
											transparentBehav = obj.behav[i];
										}
									}
								}

								if (transparentVideo){
									let rgba = chromaKey.split(",");
									var color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

									//20191126-start-thonsha-mod
									let HSV = transparentBehav.HSV.split(",");
									let keyH = parseFloat(HSV[0]);
									let keyS = parseFloat(HSV[1]);
									let keyV = parseFloat(HSV[2]);

									if (transparentBehav.mode == 'RGB'){
										videoPlane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
									}
									else if (transparentBehav.mode == 'HSV'){
										// console.log("three.js: video HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
										videoPlane.setAttribute( "material", "shader: HSVMatting; transparent: true; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+transparentBehav.hue+"; _deltaS:"+transparentBehav.saturation+"; _deltaV:"+transparentBehav.brightness+";" ); //// thonsha add shader
									}

									//20191126-end-thonsha-mod
								}
								else{
									videoPlane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
								}
								//20191108-end-thonsha-add

								if (obj.behav){
									if (obj.behav.length==1 && transparentVideo){
										videoPlane.setAttribute('class', "unclickable" ); //// fei add
									}
									else{
										videoPlane.setAttribute('class', "clickable" );
									}
								}
								else{
									videoPlane.setAttribute('class', "unclickable" ); //// fei add
								}

								videoPlane.setAttribute( "id", obj.obj_id );//// fei add 
								videoPlane.setAttribute("src", "#"+obj.obj_id+"_"+obj.res_id ); //  
								// videoPlane.setAttribute("src", obj.res_url);

								videoPlane.mp4Video = mp4Video;

								//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
								let maxAnisotropy = self.arfScene.renderer.capabilities.getMaxAnisotropy();
								videoPlane.addEventListener("materialtextureloaded", function(evt){
									console.log("three.js: _loadVideo: _materialtextureloaded: videoPlane = " , videoPlane.object3D , evt );
									evt.detail.texture.anisotropy = maxAnisotropy;
									evt.detail.texture.needsUpdate = true;
								});

								// position = new THREE.Vector3( 1.5 , 0.0 , 4.0 ); ////// set for test
								// rotation = new THREE.Vector3( 0 , 0 , 0 ); ////// set for test
								// scale.multiply( new THREE.Vector3(videoWidth, videoHeight, 1) ); ////// need calculate from elements paraemter.

								videoPlane.addEventListener("loaded", function(evt){
								// videoPlane.addEventListener("object3dset", function(evt){
									// console.log(evt);
									if (evt.target == evt.currentTarget){
										console.log('three.js: videoPlane.loaded: vw vh = ', videoWidth , videoHeight , evt );

										videoPlane.object3D.children[0].scale.set( 100*videoWidth*25.4/dpi , 100*videoHeight*25.4/dpi , 1 );

										let quaternionStr = obj.quaternionRotation.split(",");
										let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

										//// 假如是子物件，不用位移到中央
										let dp = new THREE.Vector3();
										if ( obj.obj_parent_id ){

											videoPlane.object3D.obj_parent_id = obj.obj_parent_id;

											dp.addScaledVector( position, 1*100*25.4/dpi );

											///// 子物件的 z 軸要正負顛倒
											let pz = dp.z ;
											dp.z = -pz;

											self.setAframeTransform( videoPlane, dp, rotation, scale, quaternion );

										} else {

											switch (window.serverVersion){
												case "2.0.0":
													scale.multiplyScalar( 1 );
													dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
													break;

												case "3.0.0":
													scale.multiplyScalar( 2 );
													dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
													break;
												default:
													console.log("three.js: _loadAframeVideo: serverVersion version wrong", serverVersion);
											}


											//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
											let py = dp.y;
											let pz = dp.z;
											dp.y = pz;
											dp.z = py;

											self.setAframeTransform( videoPlane, dp , rotation, scale, quaternion );
											//// 第一層物件必須放置於辨識圖中央										
											videoPlane.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
											//// 第一層物件必須垂直於辨識圖表面
											videoPlane.object3D.rotation.x += Math.PI*90/180;

											console.log('three.js: _loadAframeVideo: loaded: no parent prs=' , videoPlane.object3D.position , videoPlane.object3D.rotation, videoPlane.object3D.scale  );

										}

										let pm = videoPlane.object3D;
										pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;

										//// 場景物件帶有「邏輯功能」，重設參數，暫停
										if ( obj.blockly ){
											pm.resetProperty = function(){
												mp4Video.pause();
											}
										}

										
										
										// let r = new THREE.Vector3();
										// r.set(0,Math.PI, 0); 
										// videoPlane.object3D.children[0].rotation.setFromVector3(r);
										
										videoPlane.object3D.makarType = 'video';

										videoPlane.object3D["makarObject"] = true; 
										if ( obj.behav ){
											videoPlane.object3D["behav"] = obj.behav ;

											//// 載入時候建制「群組物件資料」「注視事件」
											self.setObjectBehavAll( obj );

										}

										if(obj.behav_reference){
											videoPlane.object3D["behav_reference"] = obj.behav_reference ;
										}

										videoResolve( videoPlane );
									}
								});
								
								self.makarObjects.push( videoPlane );

								//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
								if ( obj.active == false ){
									videoPlane.setAttribute("visible", false);
									videoPlane.setAttribute('class', "unclickable" );
								}

								//20191227-start-thonsha-mod
								let videoBehavRef = false;
								if(obj.behav_reference){
									for(let i=0; i<obj.behav_reference.length;i++){
										if (obj.behav_reference[i].behav_name == 'ShowVideo'){
											videoBehavRef = true;
											videoPlane.setAttribute("visible", false);
											videoPlane.setAttribute('class', "unclickable" );
											mp4Video.muted = false;
											break;
										}
									}
									
								}
								
								if(obj.obj_parent_id){
									// videoPlane.setAttribute("visible", false);
									// videoPlane.setAttribute('class', "unclickable" );
									mp4Video.autoplay = false;
									let timeoutID = setInterval( function () {
										let parent = document.getElementById(obj.obj_parent_id);
										if (parent){
											if(parent.object3D.children.length > 0){
												parent.appendChild(videoPlane);
												window.clearInterval(timeoutID);
												//// deal the behavior or not.
												parent.addEventListener("child-attached", function(el){
													console.log("three.js: arController: _loadVideo,: parent child-attached, el=", el );


													if ( obj.blockly ){

														videoPlane.blockly = obj.blockly;
														mp4Video.pause();
														mp4Video.currentTime = 0;
													} else {


														let parentVisible = true;
														videoPlane.object3D.traverseAncestors( function(parent) {
															if (parent.type != "Scene"){
																console.log("three.js: arController: _loadVideo,: traverseAncestors: not Scene parent=", parent );
																if (parent.visible == false){
																	parentVisible = false;
																}
															} else {
																if (parentVisible == true && videoPlane.object3D.visible == true && videoBehavRef == false ){
																	console.log("three.js: arController: _loadVideo,: traverseAncestors: all parent visible true=", videoPlane.object3D );
																	mp4Video.autoplay = true;
																	mp4Video.play();

																	//// 提醒用戶點擊開啟聲音
																	if (window.Browser){
																		if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
																		// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
																			self.dealVideoMuted( mp4Video );
																		}
																	}

																}else{
																	console.log("three.js: arController: _loadVideo,: traverseAncestors: not all parent visible true=", videoPlane.object3D );
																	//// rootObject.visible = false; 
																	//// 假如前面有物件起始是隱藏，那代表必定需要有觸發事件來開啟這個影片物件，所以即使在ios safari環境，也可以不用禁音
																	mp4Video.muted = false;
																	mp4Video.autoplay = false;
																	mp4Video.pause();
																	mp4Video.currentTime = 0;

																}
															}
														});

													}

												});
											} 
										}
									}, 1);
								}
								else{
									
									if ( obj.blockly ){
										videoPlane.blockly = obj.blockly;
										mp4Video.pause();
										mp4Video.currentTime = 0;
										mp4Video.muted = false;

									} else {
										mp4Video.autoplay = true;
										mp4Video.play();//// this is not necessary 

										//// 提醒用戶點擊開啟聲音
										if (window.Browser){
											if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
												self.dealVideoMuted( mp4Video );
											}
										}

									}						


									markerRoot.appendChild( videoPlane );

								}
								//20191029-end-thonhsa-add
							

							}

						}else{

							console.log("ARFunc.js: _loadAframeVideo , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
							obj.material = [];
							self.loadAframeGLTFModel( markerRoot , obj , position, rotation, scale , self.cubeTex  )

							videoResolve( 1 );

						}
					});


				});

				return pVideo;

			}


//[start-20190322-fei0062-add]//
			this.loadYouTubeVideo = function(markerRootCSS, url, sceneObject, position, rotation, scale ){
				
				var dpi = self.gcssTargets.dpi[markerRootCSS.GCSSID] ; 
				var GCSSWidth = self.gcssTargets.width[markerRootCSS.GCSSID] ; 
				var GCSSHeight = self.gcssTargets.height[markerRootCSS.GCSSID] ; 

				function onPlayerReady(event) {
					// console.log("onPlayerReady, src, mp4 =\n", event.target.a.src );
					// event.target.playVideo();
				}
				var done = false;
				function onPlayerStateChange(event) {
					console.log("onPlayerStateChange, event.target=", event.target);
					console.log("onPlayerStateChange, event.data=", event.data);
					if (event.data == YT.PlayerState.PLAYING && !done) {
						// setTimeout(stopVideo, 6000);
						done = true;
					}
				}
				function createPlayer(playerInfo) {
					console.log("createPlayer playerInfo=", playerInfo ) ;
					return new YT.Player( playerInfo.id, {
						// height: playerInfo.height,
						// width: playerInfo.width,
						videoId: playerInfo.videoId,
						playerVars: {
							rel: 1 ,
							fs:0 ,
							autoplay: 0 ,
							showinfo: 0 ,
							controls: 1 ,
							disablekb: 1 ,
							modestbranding: 1 ,
							playsinline: 1 ,
							enablejsapi: 1
						},
						events: {
							'onReady': onPlayerReady,
							'onStateChange': onPlayerStateChange
						}
					});
				}

				let indexIdStart = url.indexOf("v=")+2;
				let indexIdEnd = url.slice(indexIdStart).indexOf("&");
				let ytID;
				if (indexIdEnd !=-1 ){
					ytID=url.slice(indexIdStart,indexIdStart + indexIdEnd);
				}else{
					ytID=url.slice(indexIdStart);
				}
				console.log("createCssYouTube ytID=", ytID);
				var div = document.createElement('div');
				div.setAttribute("id", ytID);
				// div.setAttribute("display", "none");
				document.body.appendChild(div);
				
				var curplayer = createPlayer( { id:ytID , videoId:ytID } );
				// playerInfoList.push(curplayer);
				// curplayer.getIframe().width = curplayer.getIframe().width/2;
				// curplayer.getIframe().height = curplayer.getIframe().height/2;

				console.log("0 curplayer.getIframe()=", curplayer );

				var divContainer = document.createElement('div');
				divContainer.setAttribute("id", "divContainer");
				divContainer.style.width = curplayer.getIframe().width/1 + "px";
				divContainer.style.height = curplayer.getIframe().height/1 + "px";
				// divContainer.style.position = "absolute";
				// divContainer.style.backgroundColor = "rgba( 200, 0, 0, 0.5)";
				// divContainer.style.zIndex = 10;

				var divMask = document.createElement('div');
				divMask.setAttribute("id", "divMask");
				divMask.style.backgroundColor = "rgba(0, 0, 0, 0)";
				// divMask.style.display = "block";
				divMask.style.zIndex = 5;
				divMask.style.width = curplayer.getIframe().width/1 + "px";
				divMask.style.height = curplayer.getIframe().height/1 + "px";
				divMask.style.position = "absolute";
				// curplayer.getIframe().style.position = "absolute";

				divContainer.appendChild( divMask );
				divContainer.appendChild( curplayer.getIframe() );
				var cssObject = new THREE.CSS3DObject( divContainer );

				console.log("loadYouTubeVideo: dpi=", dpi, ", GCSSWidth=", GCSSWidth, ", GCSSHeight=", GCSSHeight );
				console.log("loadYouTubeVideo: position=", position, ", rotation=", rotation, ", scale=", scale );
				// scale.multiplyScalar(0.01);
				// cssObject.scale = scale;

				//// rotation
				cssObject.rotation.x = Math.PI/2; // reset rotation for fit unity

				//// translation
				cssObject.position.set( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 );// set object center to target center

				let px = position.x;
				let py = position.y;
				let pz = position.z;
				position.y = pz;
				position.z = py;

				var dp = position.clone();
				dp.addScaledVector( position , 100*25.4/dpi ); // 100 is the factor of unity
				cssObject.position.add( dp );

				//// scale
				cssObject.scale.set( 0.2, 0.2, 0.2 ); //// scale for now
				// cssObject.scale.copy( scale );

				//// update the object matrix
				cssObject.updateMatrix();

				// cssObject.scale.set( 0.000005, 0.000005, 0.000005 ); //// update by matrix..

				markerRootCSS.add(cssObject);

			}
//[end---20190322-fei0062-add]//



////////////////  aframe  //////////////////////

			this.loadAframeText = function( markerRoot, obj, position, rotation, scale ){

				let pText = new Promise( function( textResolve ){

					let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
					let GCSSWidth = self.gcssTargets.width[markerRoot.GCSSID] ; 
					let GCSSHeight = self.gcssTargets.height[markerRoot.GCSSID] ; 

					let projIndex = self.sceneTargetList[ markerRoot.GCSSID ].projIndex ;


					let anchor = document.createElement('a-entity');

					anchor.setAttribute( "id", obj.obj_id );//// fei add 
					self.makarObjects.push( anchor );
					if (obj.behav){
						anchor.setAttribute('class', "clickable" ); //// fei add
					}
					else if (obj.main_type == "button"){
						anchor.setAttribute('class', "clickable" ); //// fei add
					}
					else{
						anchor.setAttribute('class', "unclickable" ); //// fei add
					}


					// =======================================================================
					let textEntity = document.createElement('a-text');
					//// 還是要加預設的 mesh，為了觸碰事件 
					textEntity.setAttribute("geometry","primitive:plane; width: auto; height: auto; skipCache: true;");
					textEntity.setAttribute("material","opacity: 0.0 ; depthWrite:false; color:#000000; side:double;");
					
					let textList = obj.content.split('\n');
					let longestSplit = 0;
					const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
					const isChinese = (str) => REGEX_CHINESE.test(str);
					for (let i = 0; i < textList.length;i++) {
						let textLength = 0;
						for (let j = 0; j <  textList[i].length; j++) {
							if(isChinese(textList[i][j])){  // chinese
								textLength += 1.6;
							}
							else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
								textLength += 1;
							}
							else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
								// textLength += 0.85;
								textLength += 1.0;
							}
							else if(!isNaN(textList[i][j] * 1)){ //numeric
								textLength += 1;
							}
							else{ // other symbols
								textLength += 1.25;
							}
							
						}
						// console.log( textList[i], textLength);
						if (textLength > longestSplit) longestSplit =textLength;
					}
					textEntity.setAttribute("value",obj.content);
					textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115, 20201027：這個數值目前沒有用處
					textEntity.setAttribute("wrap-count",longestSplit + 1 ); // 1 for 1,  20210205: 多少字換行，假如是英文，不+1則會最後一個字換行
					textEntity.setAttribute("anchor","center");
					textEntity.setAttribute("align","left");
					//// 不加預設的 mesh 
					// textEntity.setAttribute("geometry","primitive:plane; width:auto; height:auto");
					// textEntity.setAttribute("material","opacity: 0");
					textEntity.setAttribute("backcolor", obj.back_color ); //// 這邊注意一重點，自己設定的 attribute 不能使用 『大寫英文』，否則aframe data內會找不到，參照 text物件
					textEntity.setAttribute("textcolor", obj.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要

					textEntity.setAttribute("side","double");

					// textEntity.setAttribute("font","font/bbttf-msdf.json"); // 舊的方法，只能載入一個 字形
					let fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
					let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
							fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
							fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
					// fonts = [ fontUrl + "1-msdf.json" ];
					textEntity.setAttribute("font", fonts );
					
					textEntity.setAttribute("negate","false");
					textEntity.setAttribute('crossorigin', 'anonymous');

					let rgb = obj.color.split(",");
					let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
					textEntity.setAttribute("color", "#"+color.getHexString());

					//// 因為無法確認「形狀確認」「物件載入完成」那個先行完成，所以增加判定
					let loadedCheck = 0;

					function checkGeometrySet(evt){
						console.log("three.js: _loadAframeText: textEntity geometry-set: evt=" , evt  );
						if ( loadedCheck == 0 ){
							loadedCheck = 1;
						}else if ( loadedCheck == 1 ){
							textResolve( textEntity );
						}
						textEntity.removeEventListener("geometry-set", checkGeometrySet );
					}

					textEntity.addEventListener("geometry-set", checkGeometrySet );


					anchor.addEventListener("loaded", function(evt){
						if (evt.target == evt.currentTarget){

							console.log("three.js: _loadAframeText: anchor loaded: evt=" , evt  );

							textEntity.object3D.scale.set( 100*25.4/dpi , 100*25.4/dpi , 100*25.4/dpi );

							let quaternionStr = obj.quaternionRotation.split(",");
							let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );
							//// 假如是子物件，不用位移到中央
							let dp = new THREE.Vector3();
							if ( obj.obj_parent_id ){

								anchor.object3D.obj_parent_id = obj.obj_parent_id;

								dp.addScaledVector( position, 1*100*25.4/dpi );

								///// 子物件的 z 軸要正負顛倒
								let pz = dp.z ;
								dp.z = -pz;

								self.setAframeTransform( anchor, dp, rotation, scale, quaternion );

							} else {

								switch (window.serverVersion){
									case "2.0.0":
										scale.multiplyScalar( 1 );
										dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
										break;

									case "3.0.0":
										scale.multiplyScalar( 2 );
										dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
										break;
									default:
										console.log("three.js: _loadAframeText: serverVersion version wrong", serverVersion);
								}


								//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
								let py = dp.y;
								let pz = dp.z;
								dp.y = pz;
								dp.z = py;

								self.setAframeTransform( anchor, dp , rotation, scale, quaternion );
								//// 第一層物件必須放置於辨識圖中央										
								anchor.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
								//// 第一層物件必須垂直於辨識圖表面
								anchor.object3D.rotation.x += Math.PI*90/180;

								console.log(' +++++++++ set done' , anchor.object3D.position , anchor.object3D.rotation, anchor.object3D.scale  );

							}


							//// 三維文字物件，紀錄內容、顏色
							let pm = anchor.object3D;
							pm.originTransform = { 
								position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() , 
								textContent: obj.content , textColor: color , textBackColor: obj.back_color ,
							};
							
							//// 邏輯物件：註冊「重設屬性」方程式，重設「文字內容」「文字顏色」「文字背景顏色」
							if ( obj.blockly ){
								pm.resetProperty = function(){
									if ( textEntity.getAttribute('value') != obj.content || 
									textEntity.components.text.attrValue.color != ('#'+color.getHexString() ) || 
									textEntity.components.text.attrValue.backcolor != obj.back_color
									){
										console.log('three.js: _loadAframeText: do reset');
										textEntity.components.text.textMesh.children.length = 0;
										textEntity.object3D.children.length = 1;
										textEntity.setAttribute("value", obj.content );
										textEntity.setAttribute("color", '#' + color.getHexString() );
										textEntity.setAttribute("backcolor", obj.back_color );
									}else{
										console.log('three.js: _loadAframeText: text same, reset do nothing ');
									}
								}
							}
							


							anchor.object3D["makarObject"] = true; 
							anchor.object3D.makarType = 'text';

							if ( obj.behav ){
								// textEntity.object3D["behav"] = obj.behav ;
								anchor.object3D["behav"] = obj.behav ;

								//// 載入時候建制「群組物件資料」「注視事件」
								self.setObjectBehavAll( obj );

							}
							if(obj.behav_reference){
								// textEntity.object3D["behav_reference"] = obj.behav_reference ;
								anchor.object3D["behav_reference"] = obj.behav_reference ;
							}
							if (obj.main_type=="button"){
								// textEntity.object3D["main_type"] = obj.main_type;
								anchor.object3D["main_type"] = obj.main_type;
							}

							if ( loadedCheck == 0 ){
								loadedCheck = 1;
							}else if ( loadedCheck == 1 ){
								textResolve( textEntity );
							}

						}
					});

				
					anchor.appendChild(textEntity);
					

					//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
					if ( obj.active == false ){
						anchor.setAttribute("visible", false);
						anchor.setAttribute('class', "unclickable" );
					}

					//20191227-start-thonsha-add
					if(obj.behav_reference){
						for(let i=0; i<obj.behav_reference.length;i++){
							if (obj.behav_reference[i].behav_name == 'ShowText'){
								
								anchor.setAttribute("visible", false);
								anchor.setAttribute('class', "unclickable" );
								break;
							}
						}
						
					}
					//20191227-end-thonsha-add
					if(obj.obj_parent_id){
						
						let timeoutID = setInterval( function () {
							let parent = document.getElementById(obj.obj_parent_id);
							if (parent){ 
								if(parent.object3D.children.length > 0){
									parent.appendChild(anchor);
									window.clearInterval(timeoutID);
								} 
							}
						}, 1);
					}
					else{

						markerRoot.appendChild( anchor )

					}

				});

				return pText;
				
			}




			this.loadAframeText2D = function( markerRoot2D, obj, index, sceneObjNum, position, rotation, scale ){

				console.log(' _loadAframeText2D: obj=' , obj );

				let pText2D = new Promise( function( text2DResolve ){


					let projIndex = self.sceneTargetList[ markerRoot2D.GCSSID ].projIndex ;
					let editor_version = self.getProjectVersion( projIndex );


					//// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
					//// 位置    縮放    尺寸   旋轉
					let rectP, rectSizeDelta, rectScale , rectR ; 
					if ( Array.isArray ( editor_version )  && editor_version.length == 3 ){
						let largeV  = Number( editor_version[0] );
						let middleV = Number( editor_version[1] );
						let smallV  = Number( editor_version[2] );	
						//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
						if ( largeV > 3 || 
							( largeV == 3 && middleV > 3 ) ||
							( largeV == 3 && middleV == 3 && smallV > 8 )
						){
							let trans = getObj2DInfo338();
							if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
								rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
							}else{
								texture2DResolve( false );
							}
						}else{
							let trans = getObj2DInfo300();
							if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
								rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
							}else{
								texture2DResolve( false );
							}
						}
					}else{
						let trans = getObj2DInfo338();
						if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
							rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
						}else{
							texture2DResolve( false );
						}

					}

					function getObj2DInfo338 (){

						let selectedResolutionIndex = self.getResolutionIndex( projIndex );

						let tempInfo = {};
						//// 位置    縮放    尺寸   旋轉
						let rectP, rectSizeDelta, rectScale , rectR ; 
						if ( obj.rect_transform && Array.isArray( obj.rect_transform ) && obj.rect_transform.length > 0 ){

							if ( !Number.isFinite( selectedResolutionIndex )   ){
								console.log(' _loadAframeText2D: _getObj2DInfo338: error, missing _selectedResolutionIndex' , selectedResolutionIndex );
								selectedResolutionIndex = 0;
							}
							let selectedObj2DInfo = obj.rect_transform[ selectedResolutionIndex ];

							if ( selectedObj2DInfo.position && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
								rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
								rectSizeDelta = selectedObj2DInfo.size_dalta.split(",").map(function(x){return Number(x)}); 
								rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
								rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

								let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]),parseFloat(rectR[1]),parseFloat(rectR[2]),parseFloat(rectR[3]))
								let b = new THREE.Euler();
								b.setFromQuaternion(quaternionRotation);

								//// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
								rotation.z = b.z/Math.PI * 180 ;

								//// 為了相容 ，把「縮放資料」取代 「原本 scale」
								scale.x = rectScale[0];
								scale.y = rectScale[1];

								tempInfo = {
									rectP: rectP,
									rectSizeDelta: rectSizeDelta,
									rectScale: rectScale
								}
							}
							

						}

						console.log(' _loadAframeText2D: _getObj2DInfo338: tempInfo' , tempInfo );

						return tempInfo;
					}

					function getObj2DInfo300(){

						//// 位置    縮放    尺寸   旋轉
						let rectP, rectSizeDelta , rectScale ; 
						if (obj.rect_transform){
							if(obj.rect_transform.length != 5 ){
								console.log(" _loadAframeText2D: fail, rect_transform.length !=5", obj.rect_transform.length);
								return ;
							}
							rectP = obj.rect_transform[0].split(",").map(function(x){return Number(x)}); 
							rectSizeDelta = obj.rect_transform[1].split(",").map(function(x){return Number(x)}); 
							rectScale = obj.rect_transform[2].split(",").map(function(x){return Number(x)}); //// 3.3.0 版本此數值無用
							console.log(" _loadAframeText2D: rect PSO=", rectP, rectSizeDelta, rectScale, rotation, scale);

							return {
								rectP: rectP,
								rectSizeDelta: rectSizeDelta,
								rectScale: rectScale,
							}
						}else{
							console.log(" _loadAframeText2D: fail, no rect_transform");
							return;
						}

					}

					let width, height;
					let scaleRatioXY = self.get2DScaleRatioByProjIndex( projIndex );

					// console.log(' _loadAframeText2D: rect: ', rectP, rectSizeDelta, rectScale, scaleRatioXY );

					//// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
					width  = rectSizeDelta[0] * scaleRatioXY ;
					height = rectSizeDelta[1] * scaleRatioXY ;




					//// 關於「文字大小」，目前 2D 文字 與 3D 文字的設定方式不同。未來可能都往 2D 流程執行
					//// 2D 文字物件的概念是有「文字框物件」跟「文字」。大小必須要各自設定。
					//// 其中藉由上面流程所取得的 rectS scaleRatioXY 可以組成「文字框尺寸」。
					//// 「文字大小」目前在編輯器端是由「文字框大小」與「文字排列內容」與「預設最大字體大小」決定。
					//// 1. 「文字框高度」/「行數」
					//// 2. 「最長文字行數的文字數量」/「文字框寬度」
					//// 3. 「預設最大字體大小」

					let maxWords = 0 ;
					let textObjList = obj.content.split('\n');
					for( let i = 0; i < textObjList.length; i++ ){
						if ( textObjList[i].length > maxWords ){
							maxWords = textObjList[i].length;
						}
					}

					let ws = width/maxWords * 1.0 ;
					let hs =  height/textObjList.length * 0.9;
					// let ms = 150 * scaleRatioXY ;
					let ms = 175 * scaleRatioXY ; //// 最大可以接受的大小，此數值只跟編輯器端 設定 有關
					let fontsize = Math.min( ws , hs, ms );
					console.log(' _loadAframeText2D: fontSize: ' , obj.content, fontsize,maxWords , '[', ws, ',', width , ']', ', [', hs, ',', height , '], ' , ms );




					let rootObject = new THREE.Object3D();
					rootObject.makarType = "text2D";
					if ( obj.behav ){
						// console.log("_loadTexture add event");
						rootObject["behav"] = obj.behav ;

						//// 載入時候建制「群組物件資料」「注視事件」
						self.setObjectBehavAll( obj );
					}

					//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
					if ( obj.active == false ){
						rootObject.visible = false;
					}


					//// 假如物件本身帶有『事件參考』，同時是『顯示模型』，則判定起始為『不可見』
					if (obj.behav_reference){
						rootObject.behav_reference = obj.behav_reference;
						for (let j = 0;j<obj.behav_reference.length; j++){
							if (obj.behav_reference[j].behav_name == "ShowText"  ){
								rootObject.visible = false;
							}
						}
					}


					let textEntity = document.createElement('a-text');
					textEntity.setAttribute("geometry","primitive:plane; width: auto; height: auto; skipCache: true;");
					textEntity.setAttribute("material","opacity: 0.0 ; depthWrite:false; color:#000000; side:double;");

					let textList = obj.content.split('\n');
					let longestSplit = 0;
					const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
					const isChinese = (str) => REGEX_CHINESE.test(str);
					for (let i = 0; i < textList.length;i++) {
						textLength = 0;
						for (let j = 0; j <  textList[i].length; j++) {
							if(isChinese(textList[i][j])){  // chinese
								textLength += 1.6;
							}
							else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
								textLength += 1;
							}
							else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
								// textLength += 0.85;
								textLength += 1.0;
							}
							else if(!isNaN(textList[i][j] * 1)){ //numeric
								textLength += 1;
							}
							else{ // other symbols
								textLength += 1.25;
							}
							
						}
						// console.log( textList[i], textLength);
						if (textLength > longestSplit) longestSplit =textLength;
					}
					textEntity.setAttribute("value", obj.content);
					textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115  20201027：這個數值目前沒有用處
					
					textEntity.setAttribute("width", width );
					textEntity.setAttribute("height", height );
					textEntity.setAttribute("fontsize", fontsize );
					
					textEntity.setAttribute("wrap-count",longestSplit); // 1 for 1    20201027：這個數值目前沒有用處
					textEntity.setAttribute("anchor","left");
					textEntity.setAttribute("align","left");
					textEntity.setAttribute("baseline","top");

					
					textEntity.setAttribute("textcolor", obj.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要
					textEntity.setAttribute("side","double");

					var fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
					let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
							fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
							fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
					// fonts = [ fontUrl + "1-msdf.json" ];
					textEntity.setAttribute("font", fonts );

					textEntity.setAttribute("negate","false");
					textEntity.setAttribute('crossorigin', 'anonymous');

					let rgb = obj.color.split(",");
					let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
					textEntity.setAttribute("color", "#"+color.getHexString());



					let aTempDiv;
					let aTempScene;

					if( document.getElementById("aTempScene") && document.getElementById("aTempDiv") ){
						aTempScene = document.getElementById("aTempScene");
					}else{

						aTempDiv = document.createElement('div');
						aTempDiv.style.display = "none";

						aTempScene = document.createElement("a-scene");
						aTempScene.setAttribute("id", "aTempScene");
						aTempScene.setAttribute("embedded", "");
						
						document.body.appendChild( aTempDiv );
						aTempDiv.appendChild( aTempScene );

					}
					
					aTempScene.appendChild(textEntity);


					textEntity.addEventListener("geometry-set", function(evt){

						let textObject = textEntity.object3D;
						if ( textObject ){
							if ( textObject.children[2] ){
								if ( textObject.children[2] ){

								}
							}
							console.log( '_loadAframeText2D: textEntity geometry-set: textObject=' , textObject , evt );

						}

						text2DResolve( rootObject );
					});


					textEntity.addEventListener("loaded", function(evt){
						// console.log(" **** textEntity loaded evt " , textEntity.object3D );
						
						let textObject = textEntity.object3D;
						if (obj.main_type=="button"){
							rootObject["main_type"] = obj.main_type;
						}


						//// 測試看 文字底板
						// let plane = new THREE.Mesh(
						// 	new THREE.PlaneBufferGeometry( width , height , 0 ),
						// 	new THREE.MeshBasicMaterial( { color: 0x424a54 ,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
						// );
						// plane.position.z = -1;
						// rootObject.add( plane ); 


						//// 2D 物件基底都要「反轉」
						textObject.rotation.x = Math.PI;

						//// 基礎大小調整
						textObject.scale.set( 190 , 190 , 1 );

						if(obj.obj_parent_id){
							textObject.obj_parent_id = obj.obj_parent_id;

							let setIntoParent = function(){
								let isParentSet = false;
								for (let i = 0; i<self.makarObjects2D.length; i++ ){
									if ( self.makarObjects2D[i].obj_id == obj.obj_parent_id  ){
										isParentSet = true;
									}
								}

								if ( isParentSet == false ){
									setTimeout(setIntoParent, 200 );
								}else{
									for (let i = 0; i < self.makarObjects2D.length; i++){
										if (self.makarObjects2D[i].obj_id == obj.obj_parent_id){
										
											rootObject.add(textObject);

											rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
											rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

											rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 
											
											rootObject.rotateZ( -rotation.z /180*Math.PI);

											rootObject.scale.set( scale.x , scale.y , 1 );

											rootObject["makarObject"] = true ;
											rootObject["obj_id"] = obj.obj_id ;
											rootObject["obj_parent_id"] = obj.obj_parent_id ;
											self.makarObjects2D[i].add(rootObject);
											self.makarObjects2D.push(rootObject); 
										
											break;
										}
										
									}
								}
						
							}
							setIntoParent();
							
						}else{

							rootObject.add(textObject);

							rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
							rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

							// // translate the plane lower, will not be smaller because the camera is OrthographicCamera, but make it must behind the default texture
							rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

							// //// rotation only at z direction
							rootObject.rotateZ( -rotation.z /180*Math.PI);

							rootObject.scale.set( scale.x , scale.y , 1 );
							
							rootObject["makarObject"] = true ;
							rootObject["obj_id"] = obj.obj_id ;
							self.makarObjects2D.push(rootObject); 
							markerRoot2D.add(rootObject);

						}

						// text2DResolve( rootObject );

					});


				});


				return pText2D;

			}


			///////// 大改版，轉為 aframe 架構 ///////////

			this.loadAframeAudio = function( markerRoot, obj, position, rotation, scale ){
				// console.log("three.js: _loadAudio: audio loaded");

				let pAudio = new Promise( function( audioResolve ){


					self.UrlExistsFetch( obj.res_url ).then( retStatus =>{

						if ( retStatus == true ){

							let quaternionStr = obj.quaternionRotation.split(",");
							let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

							let assets = document.getElementById("makarAssets");

							let assetsitem = document.createElement("audio");
							assetsitem.setAttribute("id", obj.obj_id+"_"+obj.res_id);
							assetsitem.setAttribute("src",obj.res_url);
							assetsitem.setAttribute('crossorigin', 'anonymous');
							assetsitem.setAttribute("loop", true);
							assetsitem.setAttribute("preload", "auto");
							assets.appendChild(assetsitem);

							assetsitem.onloadedmetadata = function() {
								let soundEntity = document.createElement('a-entity');
								soundEntity.setAttribute("sound", "src: "+"#"+obj.obj_id+"_"+obj.res_id+"; autoplay: true; loop: true; volume: 1; positional: false");
								soundEntity.setAttribute( "id", obj.obj_id );
								// soundEntity.setAttribute("")

								self.setAframeTransform(soundEntity, position, rotation, scale , quaternion );

								self.makarObjects.push( soundEntity );

								let audioVisible = true;

								//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
								if ( obj.active == false ){
									soundEntity.setAttribute("sound", "loop: false");
									soundEntity.setAttribute("visible", false);
									audioVisible = false;
									soundEntity.setAttribute('class', "unclickable" );
								}


								let audioBehavRef = false;
								if(obj.behav_reference){
									for(let i=0; i<obj.behav_reference.length;i++){
										if (obj.behav_reference[i].behav_name == 'PlayMusic'){
											audioBehavRef = true;
											soundEntity.setAttribute("sound", "loop: false");
											soundEntity.setAttribute("visible", false);
											audioVisible = false;

											soundEntity.setAttribute('class', "unclickable" );
											soundEntity.setAttribute("sound", "autoplay: false ");
											break;
										}
									}
								}else{
									soundEntity.setAttribute("visible", true);
								}
								//20191227-end-thonsha-mod

								if(obj.obj_parent_id){
									soundEntity.setAttribute("sound", "autoplay: false");
									// soundEntity.setAttribute("visible", false);
									// soundEntity.setAttribute('class', "unclickable" );
									let timeoutID = setInterval( function () {
										let parent = document.getElementById(obj.obj_parent_id);
										if (parent){ 
											if(parent.object3D.children.length > 0){
												parent.appendChild(soundEntity);
												window.clearInterval(timeoutID);

												parent.addEventListener("child-attached", function(el){

													if ( obj.blockly ){

														soundEntity.blockly = obj.blockly;
														soundEntity.setAttribute("sound", "autoplay: false");

													} else {

														let parentVisible = true;
														soundEntity.object3D.traverseAncestors( function(parent) {
															if (parent.type != "Scene"){
																console.log("three.js: arController: _loadAudio,: traverseAncestors: not Scene parent=", parent );
																if (parent.visible == false){
																	parentVisible = false;
																}
															} else {
																if (parentVisible == true && soundEntity.object3D.visible == true && audioBehavRef == false && audioVisible == true ){
																	console.log("three.js: arController: _loadAudio,: traverseAncestors: all parent visible true=", soundEntity.components.sound );
																	
																	//// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
																	// if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
																	// (window.allowAudioClicked != true && location == parent.location ) ){
																	
																	if ( window.allowAudioClicked != true ){

																		soundEntity.setAttribute("sound", "autoplay: false");
										
																		let clickToPlayAudio = document.getElementById("clickToPlayAudio");
																		clickToPlayAudio.style.display = "block";
																		
																		clickToPlayAudio.addEventListener('click', f_clickToPlayAudio );
																		function f_clickToPlayAudio (){
																			soundEntity.components.sound.playSound();

																			clickToPlayAudio.style.display = "none";
																			clickToPlayAudio.removeEventListener( 'click', f_clickToPlayAudio )
																			window.allowAudioClicked = true;
																		}
										
																	}else{
																		soundEntity.setAttribute("sound", "autoplay: true");
																	}

																}else{
																	console.log("2 three.js: arController: _loadAudio,: traverseAncestors: not all parent visible true=", soundEntity.components.sound );
																	soundEntity.setAttribute("sound", "autoplay: false"); 
																}

															}
														});

													}
																								
												})

											} 
										}
									}, 1);
								}
								else{	
									
									if ( obj.blockly ){
										soundEntity.blockly = obj.blockly;
										soundEntity.setAttribute("sound", "autoplay: false");
									} else {

										// if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
										// (window.allowAudioClicked != true && location == parent.location ) ){

										console.log(' 6666666666666666 ' , audioVisible , audioBehavRef );

										//// 沒有母物件，代表此「聲音物件」是直接放置於場景內，先判斷「是否透過事件觸發」，沒有的話就判斷「是否已經允許聲音」
										if ( audioVisible == true && audioBehavRef == false ){

											if ( window.allowAudioClicked != true ){

												soundEntity.setAttribute("sound", "autoplay: false");
	
												let clickToPlayAudio = document.getElementById("clickToPlayAudio");
												clickToPlayAudio.style.display = "block";
												
												clickToPlayAudio.addEventListener('click', f_clickToPlayAudio );
												function f_clickToPlayAudio (){
													soundEntity.components.sound.playSound();
													clickToPlayAudio.style.display = "none";
													clickToPlayAudio.removeEventListener( 'click', f_clickToPlayAudio )
													window.allowAudioClicked = true;
												}
	
											}else{
												// soundEntity.setAttribute("sound", "autoplay: true");
												// soundEntity.setAttribute("visible", true);
											}

										} else {
										}

									}							
								
									

									markerRoot.appendChild(soundEntity);
								}

								soundEntity.addEventListener("loaded", function(evt){
									if (evt.target == evt.currentTarget){
										soundEntity.object3D.makarType = 'audio';
										soundEntity.object3D["makarObject"] = true; 
										if ( obj.behav ){
											soundEntity.object3D["behav"] = obj.behav ;

											//// 載入時候建制「群組物件資料」「注視事件」
											self.setObjectBehavAll( obj );
										}
										if(obj.behav_reference){
											soundEntity.object3D["behav_reference"] = obj.behav_reference ;
										}

										audioResolve( soundEntity );
									}
								});
							}


						}else{

							console.log("ARFunc.js: _loadAframeAudio , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
							obj.material = [];
							self.loadAframeGLTFModel( markerRoot , obj , position, rotation, scale , self.cubeTex  )

							audioResolve( 1 );

						}
					}).catch( function( e ){
						
						console.log('_loadAframeAudio: error ', e );

					} );

				});

				return pAudio;

			}


			///////////////////////////////////////////


			/////// 大改版， aframe 架構

			this.loadAframeLight = function( markerRoot, obj, position, rotation, scale ){

				let pLight = new Promise( function( lightResolve ){

					let dpi = self.gcssTargets.dpi[markerRoot.GCSSID] ; 
					let GCSSWidth= self.gcssTargets.width[markerRoot.GCSSID] ; 
					let GCSSHeight= self.gcssTargets.height[markerRoot.GCSSID] ; 

					let projIndex = self.sceneTargetList[ markerRoot.GCSSID ].projIndex ;


					// let LightContainer = document.createElement("a-entity");
					// LightContainer.setAttribute("id", obj.obj_id);

					let Light = document.createElement("a-entity");

					// LightContainer.appendChild( Light );

					Light.setAttribute("id", obj.obj_id);
					let attr = "type:"+obj.light.light_type
			
					let rgb = obj.light.color.split(",");
					let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2]));
					attr += "; color:#"+color.getHexString()

					attr += ";intensity:"+obj.light.intensity

					if (obj.light.light_type == "point" || obj.light.light_type == "spot" ){
						attr += ";distance:" + (obj.light.range*2*100*25.4/dpi) //// 其實不確定 「距離」的轉換方式
						attr += ";decay: 2" //// 這邊也無法確認 「強度隨著距離的遞減參數」，設為2是代表「隨距離平方倒數變化」
					}

					if (obj.light.light_type == "spot"){
						attr += ";angle:"+(parseFloat(obj.light.spotAngle)/2).toString()
						attr += ";penumbra: 0.2";
					}

					//// AR先不使用陰影
					if (obj.light.shadow != "None" && false ){
						Light.setAttribute("castShadow", true);
						attr += ";castShadow: true ;shadowCameraVisible: false; shadowBias:-0.0005; shadowCameraTop:10; shadowCameraBottom:-10; shadowCameraRight:10; shadowCameraLeft:-10; shadowMapHeight:3072; shadowMapWidth:3072; shadowCameraFar: 500; shadowCameraNear: 0.5"
					}

					Light.setAttribute("light", attr);
							
					if (obj.light.light_type == "directional"){
						
						//// 強制「平行光」不產生陰影，編輯器也是如此
						Light.setAttribute("castShadow", false);
						Light.setAttribute("light", 'castShadow: false; ');

					}else{

					}

					//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
					if ( obj.active == false ){
						Light.setAttribute("visible", false);
					}


					let quaternionStr = obj.quaternionRotation.split(",");
					let quaternion = new THREE.Quaternion( Number(quaternionStr[1]) , Number(quaternionStr[2]), Number(quaternionStr[3]) , Number(quaternionStr[0])  );

					Light.addEventListener('loaded', function( evt ){
						
						if (evt.target == evt.currentTarget){

							//// 很怪，「聚光燈」會預設生成「target」，但是「平行光」並不會
							if (obj.light.light_type == "directional"){

								//// 設置「方向光」角度
								Light.object3D.children[0].position.set( 0, 0, 0 );

								let lightTarget = new THREE.Object3D();
								lightTarget.position.set(0, 0, -1);
								Light.object3D.children[0].target = lightTarget;
								Light.object3D.add( lightTarget );
								
							}else{

							}

							let dp = new THREE.Vector3();
							if (obj.obj_parent_id ){

								Light.object3D.obj_parent_id = obj.obj_parent_id;

								dp.addScaledVector( position, 1*100*25.4/dpi );
								///// 子物件的 z 軸要正負顛倒
								let pz = dp.z ;
								dp.z = -pz;

								self.setAframeTransform( Light, dp, rotation, scale, quaternion );

							} else {

								switch (window.serverVersion){
									case "2.0.0":
										scale.multiplyScalar( 1 );
										dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
										break;

									case "3.0.0":
										scale.multiplyScalar( 2 );
										dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
										break;
									default:
										console.log("three.js: _loadAframeLight: serverVersion version wrong", serverVersion);
								}

								//// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
								let py = dp.y;
								let pz = dp.z;
								dp.y = pz;
								dp.z = py;

								self.setAframeTransform( Light, dp , rotation, scale, quaternion );
								//// 第一層物件必須放置於辨識圖中央
								Light.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
								//// 第一層物件必須垂直於辨識圖表面
								Light.object3D.rotation.x += Math.PI*90/180;

							}

							//// 光源物件，紀錄強度、顏色
							let pm = Light.object3D;
							pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;
							//// 邏輯物件：設立「重設參數功能」
							if ( obj.blockly ){
								pm.resetProperty = function(){
									pm.children[0].intensity = obj.light.intensity
									pm.children[0].color.copy( color ); 
								}
							}


							Light.object3D.makarType = 'light';
							Light.object3D["makarObject"] = true; 

							self.makarObjects.push(Light); 

							lightResolve( Light );
						}
					});


					if (obj.obj_parent_id ){
						// console.log("three.js: _loadTexture: with parent, obj=", obj );
						let timeoutID = setInterval( function () {
							let parent = document.getElementById(obj.obj_parent_id);
							if (parent){ 
								if(parent.object3D.children.length > 0){
									parent.appendChild( Light );
									window.clearInterval(timeoutID);
								} 
							}
						}, 1);

					}else{
						
						console.log('three.js: _loadAframeLight: loaded: no parent prs=' , Light.object3D.position , Light.object3D.rotation, Light.object3D.scale  );
						markerRoot.appendChild( Light );
						
					}


				} );

				return pLight;

			}

			////////////////////////////


			function rotateAroundLocalAxis(object, axis, radians) {
				let rotWorldMatrix;
				rotWorldMatrix = new THREE.Matrix4();
				rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
				rotWorldMatrix.multiply(object.matrix);
				object.matrix = rotWorldMatrix;
				object.rotation.setFromRotationMatrix(object.matrix );
			}


			////////// 大改版 使用 aframe 架構 ////////////////

			this.showAframeObjectEvent = function( event , reset ){

				let obj_id = event.obj_id;
				let target = document.getElementById(obj_id);

				if (!target){
					console.log('three.js: _showAframeObjectEvent: target not exist', event);
					return;
				}

				if (target.getAttribute("visible")){
					target.setAttribute("visible",false);
					target.setAttribute('class', "unclickable" );

					if(target.localName=="a-video"){
						let id = target.getAttribute("src");
						if(id!=undefined){
							id = id.split("#").pop();
							let v = document.getElementById(id);
							if (v instanceof HTMLElement){
								v.pause();
							}
						}
					}

					//// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
					//// 不論是要開啟還是關閉物件，都查找整個場景一遍中所有影片是否有「可見的」，挑選一隻影片為「有聲音」，其他為「靜音」
					if (window.Browser){
						if (window.Browser.name == undefined || window.Browser.name == "safari" ){
							self.UnMutedAndPlayAllVisibleVideo();
						}
					}


					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							child.el.setAttribute('class', "unclickable" );
							if(child.el.localName=="a-video"){

								//// 假如影片物件有「邏輯」，不予以控制
								if ( child.el.blockly  ){
									console.log('three.js: _showObjectEvent: set false, video blockly: do nothing ', child );
								} else {

									let id = child.el.getAttribute("src");
									if(id!=undefined){
										id = id.split("#").pop();
										let v = document.getElementById(id);
										if (v instanceof HTMLElement){
											v.pause();
										}
									}
								}

							}
							if(child.makarObject && child.el.getAttribute("sound") && target.object3D != child ){
								// child.el.components.sound.stopSound();

								if ( child.el.blockly ){
									console.log('three.js: _showObjectEvent: set false, audio blockly: do nothing ', child );
								} else {

									if (child.behav_reference){
										child.el.setAttribute("visible", false);
									}
									for(let i in child.children ){
										if ( child.children[i].children[0].type == "Audio" ){					
											if (child.children[i].children[0].isPlaying == true ){
												child.el.components.sound.stopSound();
											}
										}
									}
									
								}

							}
						}
					});
					if (reset){
						target.object3D.traverse(function(child){
							if (child.type=="Group"){
								child.el.setAttribute("visible",false);
								child.el.setAttribute('class', "unclickable" );
							}
						});
					}
				}
				else{

					//// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
					//// 不論是要開啟還是關閉物件，都查找整個場景一遍中所有影片是否有「可見的」，挑選一隻影片為「有聲音」，其他為「靜音」
					if (window.Browser){
						if (window.Browser.name == undefined || window.Browser.name == "safari" ){
						// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
							self.UnMutedAndPlayAllVisibleVideo( target );
						}
					}

					target.setAttribute("visible",true);

					if(target.localName=="a-video"){
						let id = target.getAttribute("src");
						if(id!=undefined){
							id = id.split("#").pop();
							let v = document.getElementById(id);
							if (v instanceof HTMLElement){
								v.play();
								window.allowAudioClicked = true;
							}
						}
					}

					if(target.object3D.behav){
						target.setAttribute('class', "clickable" );
					}
					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							if (child.el.getAttribute("visible")){
								if(child.el.object3D.behav){
									child.el.setAttribute('class', "clickable" );
								}
								if(child.el.localName=="a-video"){

									if ( child.el.blockly  ){
										console.log('three.js: _showObjectEvent: set true, video blockly: do nothing  ', child );
									} else {
										let id = child.el.getAttribute("src");
										if(id!=undefined){
											id = id.split("#").pop();
											let v = document.getElementById(id);
											if (v instanceof HTMLElement){
												v.play();
											}
										}

									}

								}
								if(child.makarObject && child.el.getAttribute("sound") && target.object3D != child ){

									if ( child.el.blockly ){
										console.log('three.js: _showObjectEvent: set true, audio blockly: do nothing ', child );
									} else {
										child.el.components.sound.playSound();
									}
								}
							}
						}
					});
				}

			}


			this.hideAframeGroupObjectEvent = function(target){
				if (target.getAttribute("visible")){
					target.setAttribute("visible",false);
					target.setAttribute('class', "unclickable" );
					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							child.el.setAttribute('class', "unclickable" );
							if(child.el.localName=="a-video"){
								let id = child.el.getAttribute("src");
								if(id!=undefined){
									id = id.split("#").pop();
									let v = document.getElementById(id);
									if (v instanceof HTMLElement){
										v.pause();
									}
								}
							}
							if(child.makarObject && child.el.getAttribute("sound")){
								//// 假如此聲音物件有掛 behav_reference[ PlayMusic ], 則將visible 改為 false ，只有觸發 PlayMusic 才能再次開啟
								if (child.behav_reference){
									child.el.setAttribute("visible", false);
								}
								//// 假如聲音物件本來在播放，則停止。因應在手機上假如在沒播放的狀況下呼叫 stop，會報錯誤
								for(let i in child.children ){
									if ( child.children[i].children[0].type == "Audio" ){					
										if (child.children[i].children[0].isPlaying == true ){
											child.el.components.sound.stopSound();
										}
									}
								}
								// child.el.components.sound.stopSound();
							}
						}
					});
					
				}

			}


			////
			//// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
			//// 目前完全不參考「 儲存的 behav_reference 資料 」，都從「 behav 」來自製 「 behav_reference 」 
			////
			this.checkARSceneResultBehav = function( projectIdx ){

				let self = this;

				//// 專案id 錯誤
				if ( ! Number.isFinite( Number( projectIdx ) )   ){
					console.error( ' _checkARSceneResultBehav: projectIdx error ', projectIdx );
					return;
				}
				//// 專案資料內容錯誤
				if ( !Array.isArray( sceneResult ) ||  !sceneResult[ projectIdx ]   ){
					console.error( ' _checkARSceneResultBehav: _VRSceneResult error ', projectIdx  , sceneResult);
					return;
				}

				if ( !sceneResult[ projectIdx ].data.editor_ver || typeof( sceneResult[ projectIdx ].data.editor_ver ) != 'string' ){
					console.error( ' _checkARSceneResultBehav: editor_ver error ', sceneResult[ projectIdx] );
					return;
				}


				let editor_version = sceneResult[ projectIdx ].data.editor_ver.split(".");

				console.log('_checkARSceneResultBehav: _projectIdx ', projectIdx , editor_version );


				let scene_objs = self.editorVersionControllObjs(  projectIdx  );

				console.log('_checkARSceneResultBehav: _scene_objs ', scene_objs );

				if ( !Array.isArray( scene_objs ) ) {
					return ;
				} 

				//// 檢查「 behav / behav_reference 」

				///// 建制列表
				let behavAll = {};
				let behavRefAll = {}; //// 這部份預計拿來對答案用
				let sceneObjDict = {};
				
				for ( let i = 0, len = scene_objs.length; i < len; i++ ){
					let sceneObj = scene_objs[i];

					if ( sceneObj.behav ){
						behavAll[ sceneObj.obj_id ] = sceneObj.behav;
					}

					//// 無條件清除 「 儲存的  behav_reference 資料 」
					if ( sceneObj.behav_reference ){
						// behavRefAll[ sceneObj.obj_id ] = sceneObj.behav_reference;
						delete sceneObj.behav_reference;
					}

					if ( sceneObj.obj_id ){
						sceneObjDict[ sceneObj.obj_id ] = sceneObj;
					}
				}

				//// 從 「事件 behav 」來檢查「全部場景物件」中是否有物件沒有帶到「 事件備註 behav_reference 」
				//// 沒有的話，補上
				for ( let i in behavAll ){
					let behavs = behavAll[i];
					// console.log(' _checkARSceneResultBehav: _behavAll: ', i, behavs );
					for( let j = 0, len = behavs.length; j < len; j++ ){
						let behav = behavs[ j ];
						if ( behav.simple_behav != "FingerGesture" ){
							// console.log(' _checkARSceneResultBehav: _behavAll: ', i.slice(0,6) , j ,behav );
						}
						
						if ( behav.obj_id ){
							let behavObj = sceneObjDict[ behav.obj_id ];

							//// 無條件自製 「 _behav_reference 」
							if ( behavObj && Array.isArray( behavObj.behav_reference ) ){
								behavObj.behav_reference.push({
									behav_name: behav.simple_behav,
									target_id: behav.obj_id,
								});
							}else if ( behavObj ){
								behavObj.behav_reference = [{
									behav_name: behav.simple_behav,
									target_id: behav.obj_id,
								}];
							}else{
								console.error('_checkARSceneResultBehav: cant get _behavObj ', behav );
							}


						}
					}
				}
			}



			


			//// 
			//// 載入「場景物件」完成之後，作的「事件」處理，目前包含「注視事件」 而已
			//// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
			//// 流程：掃一遍「場景中物件 2d/3d 」
			////
			////
			this.setupSceneBehav = function( projIndex ){
				
				let self = this;

				let behavObj = {};
				for ( let i = 0, len = self.makarObjects.length; i< len ; i++ ){
					
					let obj3D = self.makarObjects[i].object3D;
					if ( obj3D ){

						if ( obj3D.behav ){
							
						}

						if ( obj3D.behav_reference ){

						}

					}else{	
						console.error(' _setupSceneBehav: 3d obj error', i, self.makarObjects[i] );
					}

				}

				// for ( let i = 0, len = self.makarObjects2D.length; i< len ; i++ ){

				// }


				//// 從載入過程紀錄的 「注視事件列表」 來建立互動事件 「」
				//// 只有「3d物件」會有注視事件

				let lookAtObjectList = self.lookAtTargetDict[ projIndex ] ; 
				if ( Array.isArray(  lookAtObjectList  ) ){
					for ( let i = 0, len = lookAtObjectList.length; i < len; i++ ){
						let lookAtEvent = lookAtObjectList[i];
	
						let lookObjId = lookAtEvent.lookObjId;
						let lookObj = document.getElementById( lookObjId );
						
						let lookBehav = lookAtEvent.lookBehav;
						let targetObjId = lookBehav.obj_id;
						let reverse = lookBehav.reverse;
	
						let targetObj = document.getElementById( targetObjId );
						//// 確保「目標物件」「注視物件」都存在，建立持續事件
						if (lookObj && lookObj.object3D && targetObj && targetObj.object3D ){
							
							self.addLookAtTimeLine( lookObj , targetObj , lookAtEvent , projIndex );
	
						}else{
							console.log('_setupSceneBehav: _lookAt error, obj not exist', lookObj , targetObj );
						}
	
					}
	
				}

			}


			///// 建立「注視事件功能」
			this.addLookAtTimeLine = function( lookObj , targetObj , lookAtEvent , projIndex ){

				console.log(' _addLookAtTimeLine: ', lookAtEvent );

				let self = this;

				let lookAtTimelineDict = self.lookAtTargetTimelineDict[ projIndex ];


				let targetPos = new THREE.Vector3();
				targetObj.object3D.getWorldPosition(targetPos);
				
				let tl = gsap.timeline();
				lookAtTimelineDict[ lookAtEvent.lookObjId ] = tl;
				//// 無條件不斷重複「注視功能」
				tl.to(lookObj.object3D, {
					duration: 1100,
					delay: 0, 
					ease: 'none',
					repeat: -1,
					onUpdate: function(){
						targetObj.object3D.getWorldPosition(targetPos);
						lookObj.object3D.lookAt(targetPos);
						if ( lookAtEvent.lookBehav && lookAtEvent.lookBehav.reverse == false ){
							lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
						}
					}
				});

			}




			////
			//// 所有 「物件觸發事件」 需要作的「前置動作」
			////
			//// 1. 場景載入物件時候，假如有「觸發事件」，則往下判斷是否有「群組」，並且紀錄下來
			//// 2. 「注視事件」
			////
			this.setObjectBehavAll = function( obj , projIndex ){
				
				let self = this;

				let groupDict = self.groupEventTargetDict[ projIndex ];

				let lookAtObjectList = self.lookAtTargetDict[ projIndex ] ; 

				console.log(' _setObjectBehavAll: ' , projIndex );

				for ( let i = 0, len = obj.behav.length; i < len; i++ ){
					//// 群組事件紀錄
					if ( obj.behav[i].group != '' ){
						if ( groupDict[ obj.behav[i].group ] ){
							let groupObj =  groupDict[ obj.behav[i].group ];

							groupObj.objs.push({
								behav:  obj.behav[i]
								
							} );

						}else{

						}		
					}


					//// 注視事件紀錄
					if ( obj.behav[i].simple_behav == 'LookAt' && obj.behav[i].obj_id ){

						let lookAtEvent = {
							lookBehav: obj.behav[i] ,
							lookObjId: obj.obj_id ,
						}

						lookAtObjectList.push( lookAtEvent );

					}

				}
			}


			////
			//// 處理全部的 群組功能 包含 2D / 3D 
			//// 注意：目前群組功能只有作用在 「顯示/隱藏」相關的功能。我們也只先處理這些，未來在新增
			////
			this.dealAllGroupHide = function( touchObject , projIndex ){

				let self = this;

				let groupDict = self.groupEventTargetDict[ projIndex ];


				if ( !groupDict ){
					console.log('_dealAllGroup: missing groupDict');
					return;
				}

				//// 符合當前群組功能的 事件
				let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];


				for (let i = 0; i < touchObject.behav.length; i++ ){
					let behav = touchObject.behav[i];
					if ( behav.group != '' && groupDict[ behav.group ] ){
						let groupIndex = behav.group;

						// console.log(' _dealAllGroupHide:  ', groupIndex , groupDict[ groupIndex ].objs );

						groupDict[ groupIndex ].objs.forEach( ( groupObj , groupObjIndex  )=>{
							let obj_id = groupObj.behav.obj_id;
							let getObj = self.getObjectTypeByObj_id( obj_id );

							//// 要觸發顯示隱藏的物件 要區分為 2d/3d 
							if ( getObj.obj_type == '2d'  ){
								let obj2D = getObj.obj;
								//// 「 點擊到的事件的『要觸發顯示隱藏的物件id』 」 跟 「 群組中的個別物件的物件id  」 不一樣的話，全部隱藏。
								if ( behav.obj_id != obj_id ){
									//// 檢查事件是否符合所要
									// console.log(' ...2d  ', touchObject , obj2D );
									if ( obj2D.behav_reference ){
										for ( let j = 0; j < obj2D.behav_reference.length; j++ ){
											// console.log(' ...  ', obj2D.behav_reference[j] );
											if ( showEventStrList.filter( e => e == obj2D.behav_reference[j].behav_name ).length > 0 ){
												obj2D.visible = false;
												break;
											}
										}
									}

								}

							}else if ( getObj.obj_type == '3d' ){
								let obj3D = getObj.obj;


								// console.log(' ... obj3D: behav: ', obj3D.object3D );
								if ( obj3D.object3D.behav_reference && Array.isArray( obj3D.object3D.behav_reference ) && behav.obj_id != obj_id  ){
									for ( let j = 0; j < obj3D.object3D.behav_reference.length; j++ ){
										// console.log(' ...  ', obj3D.object3D.behav_reference[j] );
										if ( showEventStrList.filter( e => e == obj3D.object3D.behav_reference[j].behav_name ).length > 0 ){

											self.hideAframeGroupObjectEvent( obj3D );

											// obj3D.setAttribute('visible' , false );
											// obj3D.object3D.visible = false;

											break;
										}
									}
								}
								
							}

						});

					}

				}

			}


			//// 朗讀文字物件功能
			this.speechTextObj = function( textObj ){

				console.log(' _speechTextObj: _textObj: ', textObj );
				if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){

					if ( speechSynthesis.speaking == true ){
						speechSynthesis.pause();
						speechSynthesis.cancel();
					}

					let speed = textObj.speed;
					let speechLangIndex = textObj.language;
					let content = textObj.content;

					let utterance = new SpeechSynthesisUtterance( content );

					//// makar / web = 2 / 1.67
					//// makar / web = 1.5 / 1.38
					//// makar / web = 1 / 1
					//// makar / web = 0.75 / 0.76
					//// makar / web = 0.5 / 0.42
					//// 速度方面怪怪的 沒辦法，經驗判斷加上 2 階 fitting 
					//// https://mycurvefit.com/ 

					// utterance.rate = ( speed **2 ) * (-0.2963) + ( speed )*1.556 - 0.266 ; // 二階
					utterance.rate = ( speed**3 ) * ( 0.1837 ) + ( speed**2 ) * ( -0.9948 ) + ( speed )* ( 2.3352 ) + ( -0.5196 ) ; // 三階
					utterance.pitch = 1;

					//// 發音語言，目前測試由 lang / voice 來控制
					//// 1. 在沒有設置 voice 情況下， lang 改變的確會影響
					//// 2. 在有設定 voice 情況下，lang 就沒有效果了
					//// 所以先判斷 voice 沒有成功的話再設定 lang 

					//// MAKAR 設定
					//// 0: en 1: zh-Hant 2: zh-Hans 3: ja 4: ko
					let setLang = 'en';
					let voiceLang = 'en-US';

					switch( speechLangIndex ){
						case 0:
							setLang = 'en';
							voiceLang = 'en-US';
							break;
						case 1:
							setLang = 'zh-TW';
							voiceLang = 'zh-TW';
							break;
						case 2:
							setLang = 'zh-CN';
							voiceLang = 'zh-CN';
							break;
						case 3:
							setLang = 'ja';
							voiceLang = 'ja-JP';
							break;
						case 4:
							setLang = 'ko';
							voiceLang = 'ko-KR';
							break;
						default:
							setLang = 'en';
							voiceLang = 'en-US';
					}
					
					
					//// 發音標準，20230530, 美語 國語（台灣） 日本語（）
					//// 另外，以下可能無法取得，判斷
					
					let tID = setInterval( function(){
						let getVoice = false;
						let voices = speechSynthesis.getVoices();
						if ( voices.length > 0 ){
							clearInterval( tID );

							//// safari 的各語言發音效果怪怪的，改為只使用預設語言來選定聲音。
							if ( window.Browser && window.Browser.name != "safari"  ){

								voices.forEach( e => {
									if ( e.lang == voiceLang ){
										getVoice = true;
										utterance.voice = e;
									}
								});
	
							}


							if ( getVoice == false ){
								utterance.lang = setLang;
							}

							speechSynthesis.speak(utterance);
							
						}
						 
					}, 1);

				}
			}




			/////////////////////////////////


			this.dealVideoMuted = function( video ){
				let clickToPlayAudio = document.getElementById("clickToPlayAudio");
				clickToPlayAudio.style.display = "block";													
				clickToPlayAudio.onclick = function(){
					
					// video.muted = false;

					self.UnMutedAndPlayAllVisibleVideo();

					window.allowAudioClicked = true;
					clickToPlayAudio.style.display = "none";
					clickToPlayAudio.onclick = null;
					window.alreadyClicked = true;
				}

			}

			//// 為了 iOS 無法同時播放「超過一個有聲音的影片」，在場景中尋找是否有「當前可見的影片」，只能有一隻切換為切換為「有聲音」
			//// 流程分兩種： 1. 點擊觸發「顯示任意物件」 2. 點擊觸發「關閉任意物件」 
			//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
			////
			this.UnMutedAndPlayAllVisibleVideo = function( targetVideo_in ){

				//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
				let targetVideo;
				if (targetVideo_in){
					if ( targetVideo_in.localName == 'a-video' ){
						targetVideo = targetVideo_in;
					}
				}

				//// 取得「所有影片」
				let aVideos = document.getElementsByTagName('a-video');

				console.log("three.js: _UnMutedAndPlayAllVideo: aVideos.length=", aVideos.length );

				if ( targetVideo ){
					//// 假如有「要顯示的影片」
					for ( let i = 0; i < aVideos.length; i++ ){

						let videoPlane = aVideos[i];
						let mp4Video = aVideos[i].mp4Video;

						//// 開啟此影片聲音
						if ( videoPlane == targetVideo ){

							targetVideo.mp4Video.muted = false;
							targetVideo.mp4Video.autoplay = true;
							targetVideo.mp4Video.play();

						}else{

							let parentVisible = true;
							videoPlane.object3D.traverseAncestors( function(parent) {
								if (parent.type != "Scene"){
									// console.log("three.js: ARController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
									if (parent.visible == false){
										parentVisible = false;
									}
								} else {
		
									console.log("three.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );
		
									if (parentVisible == true && videoPlane.object3D.visible == true ){
										
										mp4Video.muted = true;
										mp4Video.autoplay = true;
										mp4Video.play();

									}

									//// 我擔心「先後順訊會影響」，所以多次將「此影片」執行「切換為非靜音」
									targetVideo.mp4Video.muted = false;
									targetVideo.mp4Video.autoplay = true;
									targetVideo.mp4Video.play();

								}
							});

						}
	
					}

				} else {
					//// 假如沒有「傳入影片」，則挑選一隻「改為非靜音」，其他隻都保持靜音
					//// 挑選方式尚未決定

					let setVideoUnMuted = false;

					for ( let i = 0; i < aVideos.length; i++ ){

						let videoPlane = aVideos[i];
						let mp4Video = aVideos[i].mp4Video;
	
						let parentVisible = true;
						videoPlane.object3D.traverseAncestors( function(parent) {
							if (parent.type != "Scene"){
								// console.log("three.js: ARController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
								if (parent.visible == false){
									parentVisible = false;
								}
							} else {
								//// 假如「已經找到場景本體」、「母體都可見」、「本體也可見」、「尚未設定一隻影片有聲音」，則設定「此影片」為「有聲音」，同時紀錄「已經設定過」
	
								console.log("three.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );

								if (parentVisible == true && videoPlane.object3D.visible == true && !videoPlane.blockly ){
									
									if ( setVideoUnMuted == false ){
										console.log("three.js: _UnMutedAndPlayAllVideo: all parent visible true , _setVideoUnMuted false ", videoPlane.object3D );
									
										mp4Video.muted = false;
										mp4Video.autoplay = true;
										mp4Video.play();
										
										setVideoUnMuted = true;
									
									} else {
										console.log("three.js: _UnMutedAndPlayAllVideo: all parent visible true, _setVideoUnMuted true", videoPlane.object3D );
									
										mp4Video.muted = true;
										mp4Video.autoplay = true;
										mp4Video.play();
										
									}
								}
	
							}
						});	

					}

				}

			}



			this.entitySetTransform = function( obj, position, rotation, scale ){

				let pos = position.clone(); 
				pos.multiply( new THREE.Vector3( -1, 1, 1 ) ); ////// reverse the x direction 
				obj.setAttribute( "position", pos );//// origin 
				let rot = rotation.clone(); 
				rot.multiply( new THREE.Vector3( 1 , -1 , -1 ) ); ////// reverse x y direction
				obj.setAttribute( "rotation", rot );//// origin 
				obj.setAttribute( "scale", scale );//// origin 
			}

			this.setTransform = function(obj, dpi, position, rotation, scale ){
				if ( obj && dpi && position && rotation && scale ){
					if ( !obj.isObject3D || !position.isVector3 || !rotation.isVector3 || !scale.isVector3 ){
						console.warn("_setTransform warning, some parameter are not right");
						return -1;
					}
				}
				var dp = position.clone();
//[start-20190909-fei0073-mod]//
				//////
				////// the scale is different between Editor V2 and V3.. WTF
				//////
				switch (window.serverVersion){
					case "2.0.0":
						dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
						break;

					case "3.0.0":
						dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
						break;
					default:
						console.log("three.js: _setTransform: serverVersion version wrong", serverVersion);
				}
//[end---20190909-fei0073-mod]//
				obj.position.add( dp );


				// because the unity coordinate is LH, so y z reverse.   I dont know js, world rotation ? 
				rotateAroundLocalAxis(obj, new THREE.Vector3(1,0,0), -rotation.x * Math.PI/180);
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,1,0), -rotation.z * Math.PI/180);
				rotateAroundLocalAxis(obj, new THREE.Vector3(0,0,1), -rotation.y * Math.PI/180); 

				//// local rotation 
				// obj.rotateX ( -rotation.x * Math.PI/180 );
				obj.rotateZ ( rotation.z * Math.PI/180 );
				// obj.rotateY ( -rotation.z * Math.PI/180 );
//[start-20190909-fei0073-mod]//
				//////
				////// the scale is different between Editor V2 and V3.. WTF
				//////
				switch (window.serverVersion){
					case "2.0.0":
						obj.scale.copy( scale.multiplyScalar( 1 ) );

						break;
					case "3.0.0":
						obj.scale.copy( scale.multiplyScalar( 2 ) ); // 1
						// obj.scale.multiplyScalar( 2 ) ; // 1
						
						break;
					default:
						console.log("three.js: _setTransform: serverVersion version wrong", serverVersion);
				}
				
//[end---20190909-fei0073-mod]//
			}

			this.setAframeTransform = function( obj, position, rotation, scale, quaternion , dpi ){


				//// 位置部份：「中心平移」「子母物件判斷」都在外面完成。這邊單純設定即可
				obj.setAttribute( "position", position );//// origin 


				//// 旋轉部份：先說明這邊很怪，明明在 VR/XR 都可以直接沿用 編輯器給出的數值來設定場中物件
				//// 但是在 AR 中 y.z 數值要顛倒，而且不能使用 aframe 的 setAttribute('rotation', 'dx dy dz') 的方式。
				//// 因為會將物件的 rotation order 設為 'YXZ' 。 fei確認過，在AR架構裡，不可能以此設定出正確的角度。
				//// 預計之後一律改為編輯器物件給出的 Quaternion。只有 x y 方向的數值得要 正負 顛倒。

				// let rot = rotation.clone(); 
				// rot.multiply( new THREE.Vector3( 1 , -1 , -1 ) ); ////// reverse x y direction
				// obj.setAttribute( "rotation", rot );//// origin 

				let object3D = obj.object3D;
				// object3D.rotation.reorder('XYZ') ;

				// rotateAroundLocalAxis( object3D , new THREE.Vector3(1,0,0), -rotation.x * Math.PI/180);
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,1,0), -rotation.z * Math.PI/180);
				// rotateAroundLocalAxis( object3D , new THREE.Vector3(0,0,1), -rotation.y * Math.PI/180); 				
				// object3D.rotateZ ( rotation.z * Math.PI/180 );

				//// from quaternion
				let tempEuler = new THREE.Euler();
				tempEuler.setFromQuaternion(quaternion);
				tempEuler.x = -tempEuler.x;
				tempEuler.y = -tempEuler.y;
				let newQuaternion = new THREE.Quaternion();
				newQuaternion.setFromEuler(tempEuler);

				object3D.setRotationFromQuaternion(newQuaternion);

				/////// 大小部份
				obj.setAttribute( "scale", scale );//// origin 

			}

//[start-20191211-fei0082-add]//

			this.setChildTransform = function(obj, dpi, position, rotation, scale , quaternion){

				// console.log("three.js: _setChildTransform: rotation = " , rotation );

				let pz = position.z;
				position.z = -pz;
				let rx = rotation.x;
				let ry = rotation.y;
				rotation.x = -rx;
				rotation.y = -ry;

				obj.position.add( position.multiplyScalar(  1*100*25.4/dpi )  );
				// obj.position.add( new THREE.Vector3(0 , 0 , 0)  );
				

				// obj.rotation.setFromVector3 ( rotation.multiplyScalar( Math.PI/180 ) );

				// obj.rotateX ( rotation.x * Math.PI/180 );
				// obj.rotateY ( rotation.y * Math.PI/180 );
				// obj.rotateZ ( rotation.z * Math.PI/180 );

				// obj.rotateOnAxis( new THREE.Vector3(1,0,0) , rotation.x * Math.PI/180  );
				// obj.rotateOnAxis( new THREE.Vector3(0,1,0) , rotation.y * Math.PI/180  );
				// obj.rotateOnAxis( new THREE.Vector3(0,0,1) , rotation.z * Math.PI/180  );

				// rotateAroundLocalAxis(obj, new THREE.Vector3(1,0,0), 30 * Math.PI/180 ); 
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,1,0), 30 * Math.PI/180 ); 
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,0,1),  0 * Math.PI/180 ); 

				// obj.rotateOnWorldAxis( new THREE.Vector3(1,0,0), 30 * Math.PI/180 ); 
				// obj.rotateOnWorldAxis( new THREE.Vector3(0,1,0), 30 * Math.PI/180 ); 
				// obj.rotateOnWorldAxis( new THREE.Vector3(0,0,1), 30 * Math.PI/180 ); 
				
				// rotateAroundLocalAxis(obj, new THREE.Vector3(1,0,0), rotation.x * Math.PI/180);
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,1,0), rotation.y * Math.PI/180 ); 
				// rotateAroundLocalAxis(obj, new THREE.Vector3(0,0,1), rotation.z * Math.PI/180);

				//// fail , cant directly use it ..
				// obj.rotateOnWorldAxis( new THREE.Vector3(1,0,0), rotation.x * Math.PI/180 ); 
				// obj.rotateOnWorldAxis( new THREE.Vector3(0,1,0), rotation.y * Math.PI/180 ); 
				// obj.rotateOnWorldAxis( new THREE.Vector3(0,0,1), rotation.z * Math.PI/180 ); 

				//// from quaternion
				let tempEuler = new THREE.Euler();
				tempEuler.setFromQuaternion(quaternion);
				tempEuler.x = -tempEuler.x;
				tempEuler.y = -tempEuler.y;
				let newQuaternion = new THREE.Quaternion();
				newQuaternion.setFromEuler(tempEuler);
				// console.log("three.js: _setChildTransform: tempEuler = " , tempEuler );

				obj.setRotationFromQuaternion(newQuaternion);


				obj.scale.copy ( scale );

			}

//[end---20191211-fei0082-add]//

			this.getMakarObject = function( obj ){
				if (obj.makarObject != true){
					if ( obj.parent ){
						// console.log("obj.parent exist, goto");
						return ( self.getMakarObject( obj.parent ) );
					}else{
						// console.log("obj.parent not exist, return 0");
						return 0;
					}
				}else{
					// console.log("obj.makarObject == true, return", obj);
					return obj ;
				}
			}



			//// 依照「 obj_id 」 來判斷 「物件型態」為 「 2d / 3d 」
			this.getObjectTypeByObj_id = function( obj_id ){

				let self = this;

				let getObj3D = null;
				let getObj3DIndex = null;
				let getObj2D = null;
				let getObj2DIndex = null;

				//// 基本上沒有道理「同一個 obj_id 」同時在「 2d / 3d 物件」
				let getObj = {
					obj_type: '',
					obj_index: null,
					obj: null,
				}

				if ( obj_id ){

					self.makarObjects.forEach( (e,i) =>{
						if ( e.id == obj_id ){
							getObj3D = e;
							getObj3DIndex = i;
						}
					});

					self.makarObjects2D.forEach( (e,i) =>{
						if ( e.obj_id == obj_id ){
							getObj2D = e;
							getObj2DIndex = i;
						}
					});

					
					if ( ( getObj3D != null && getObj3DIndex != null ) || ( getObj2D != null && getObj2DIndex != null ) ){
						
						if ( getObj3D != null && getObj3DIndex != null ){
							console.log('_getObjectTypeByObj_id: 3d: ' , getObj3DIndex , getObj3D );
							getObj.obj_type = '3d';
							getObj.obj_index = getObj3DIndex;
							getObj.obj = getObj3D;

						}else if ( getObj2D != null && getObj2DIndex != null ){
							console.log('_getObjectTypeByObj_id: 2d: ' , getObj2DIndex , getObj2D );
							getObj.obj_type = '2d';
							getObj.obj_index = getObj2DIndex;
							getObj.obj = getObj2D;
							
						}else{
							console.log('_getObjectTypeByObj_id: fucking logic trouble.' , getObj2DIndex , getObj2D );
						}

					}else if ( ( getObj3D != null && getObj3DIndex != null ) && ( getObj2D != null && getObj2DIndex != null ) ){
						console.log('_getObjectTypeByObj_id: warning, both 2D/3D object get', obj_id , ', 3d:' , getObj3DIndex , getObj3D , ', 2d:' , getObj2DIndex , getObj2D );
						getObj.obj_type = '3d';
						getObj.obj_index = getObj3DIndex;
						getObj.obj = getObj3D;
					}else{

					}

				}

				return getObj;

			} 





			////
			//// trigger event, now the url and phone call are use the <a> tag 
			//// I think use createElement is better, TODO.
			//// only "event" is default need, GLRenderer, arScene, makarObj are for other method.
			//// 

			this.triggerEvent = function( event, makarObj , reset ){

				let obj_id, target;

				switch ( event.simple_behav ){
					case "Click3dToPhoneCall": 
					case "PhoneCall":
						console.log("Click3dToPhoneCall: phone=", event.phone );
						if ( window.Browser ){
							if (window.Browser.desktop) {
								// console.log( "Click3dToPhoneCall desktop"  );
								let telTag = window.document.getElementById("phoneCall");
								telTag.href = "tel:"+event.phone ;
								console.log('desktop telTag=', telTag);
								telTag.click();
							}else {
								let telTag = window.document.getElementById("phoneCall");
								telTag.href = "tel:"+event.phone ;
								console.log('cell phone telTag=', telTag);
								telTag.click();
							}
						}
						break;
//[start-20191001-fei0075-mod]//
					case "Click3dToSendEmail":
					case "SendEmail": 
						console.log("Click3dToSendEmail: mail=", event.mail_to );
						if ( window.Browser ){
							if (window.Browser.desktop) {
								let webTag = window.document.getElementById("sendEmail");
								webTag.href = "mailto:" + event.mail_to ;
								webTag.click();
								console.log('desktop: webTag=', webTag);
							}else  {
								let webTag = window.document.getElementById("sendEmail");
								webTag.href = "mailto:" + event.mail_to ;
								webTag.click();
								console.log('cellphone: webTag=', webTag);
							}
						}
						break;
//[end---20191001-fei0075-mod]//

//[start-20191001-fei0075-mod]//
					case "Click3dToOpenWebBrowser": 
					case "OpenWebPage":
//[end---20191001-fei0075-mod]//
						console.log("Click3dToOpenWebBrowser: url=", event.url ); 

						if ( window.Browser ){
							if (window.Browser.desktop) {
								let webTag = window.document.getElementById("openWebBrowser");
								webTag.href = event.url ;
								webTag.click();
								console.log('desktop: webTag=', webTag);
							}else  {
								let webTag = window.document.getElementById("openWebBrowser");
								webTag.href = event.url ;
								webTag.click();
								console.log('mobile: webTag=', webTag);
							}
 
						}
						break;
					//// 2d event
					// case "Click2dToPhoneCall": 
					// 	console.log("Click2dToPhoneCall: phone=", event.phone );
					// 	if ( window.Browser ){
					// 		if (window.Browser.desktop) {
					// 			// console.log( "Click3dToPhoneCall desktop"  );
					// 			let telTag = window.document.getElementById("phoneCall");
					// 			telTag.href = "tel:"+event.phone ;
					// 			console.log('desktop telTag=', telTag);
					// 			telTag.click();
					// 		}else {
					// 			let telTag = window.document.getElementById("phoneCall");
					// 			telTag.href = "tel:"+event.phone ;
					// 			console.log('cell phone telTag=', telTag);
					// 			telTag.click();
					// 		}
					// 	}
					// 	break;

					// case "Click2dToOpenWebBrowser": 
					// 	console.log("Click2dToOpenWebBrowser: url=", event.url ); 
					// 	if ( window.Browser ){
					// 		if (window.Browser.desktop) {
					// 			let webTag = window.document.getElementById("openWebBrowser");
					// 			webTag.href = event.url ;
					// 			webTag.click();
					// 			console.log('desktop: webTag=', webTag);
					// 		}else  {
					// 			let webTag = window.document.getElementById("openWebBrowser");
					// 			webTag.href = event.url ;
					// 			webTag.click();
					// 			console.log('cellphone: webTag=', webTag);
					// 		}
					// 	}
					// 	break;

					// case "Click2dToSendEmail": 
					// 	console.log("Click2dToSendEmail: url=", event.mail_to ); 
					// 	if ( window.Browser ){
					// 		if (window.Browser.desktop) {
					// 			let webTag = window.document.getElementById("sendEmail");
					// 			webTag.href = "mailto:" + event.mail_to ;
					// 			webTag.click();
					// 			console.log('desktop: webTag=', webTag);
					// 		}else  {
					// 			let webTag = window.document.getElementById("sendEmail");
					// 			webTag.href = "mailto:" + event.mail_to ;
					// 			webTag.click();
					// 			console.log('cellphone: webTag=', webTag);
					// 		}
					// 	}
					// 	break;

//[start-20190614-fei0066-add]//
					case "Coloring":
						console.log("triggerEvent: Coloring: event=", event);
						if (event.enable == true){
							window.FuncColoring();
						}

						break;
						 
					case "SnapShot":

						////// make the default 2D icon disappear
						let visibleIDs = [];
						for (var i = 0; i < self.arScene.scene2D.children.length; i++ ){
							if (self.arScene.scene2D.children[i].GCSSID < 0){
								if (self.arScene.scene2D.children[i].visible == true){
									// console.log("SnapShot: the children with GCSSID = ", arScene.scene2D.children[i].GCSSID, arScene.scene2D.children[i] );
									visibleIDs.push(i);
									self.arScene.scene2D.children[i].visible = false;
								}
							}
						}

						console.log("------------ self", self, this);
						self.GLRenderer.autoClear = false;
						self.GLRenderer.render( self.arScene.videoScene, self.arScene.videoCamera);
						self.GLRenderer.clearDepth();
						self.GLRenderer.render(  self.arfScene.object3D , self.camera );
						self.GLRenderer.render( self.arScene.scene2D, self.arScene.camera2D );

						for (var i = 0; i < visibleIDs.length; i++){
							self.arScene.scene2D.children[ visibleIDs[i] ].visible = true;
						}

						var size = self.GLRenderer.getSize();

						var dataURL = self.GLRenderer.domElement.toDataURL("image/png", 1.0);

						// window.open( "https://www.google.com", "_blank" ); // it is work 
						// var w = window.open( dataURL, "_blank" ); // now fail on chrome, work on Safari and firefox, need to try the localStorage

						var w = window.open(""); // work on android chrome / ios safari
						var img = new Image();
						img.src = dataURL;

						img.style.position = "absolute";
						// img.style.textAlign = "right";

						// img.style.left = Math.round((window.innerWidth - size.width)/2) + "px";
						// img.style.width =  Math.round(size.width *1.5)  + "px"; // window.devicePixelRatio
						// img.style.height = Math.round(size.height*1.5)  + "px";
						
						img.style.left = "10%";
						img.style.width = "80%";
						// img.style.height = "640px";

						// img.style.left = "100px";
						// img.style.width = "960px";
						// img.style.height = "640px";
						var info ;
						if (window.Browser){
							if ( window.Browser.name == "safari" && window.Browser.platform == "iphone"){
								info = "<br>  <p style=\"font-size:36px;\"> 請輕觸影像來儲存您的照片。 </p>";
							} else if ( window.Browser.name == "chrome" && window.Browser.platform == "android" ){
								info = "<br>  <p style=\"font-size:36px;\"> 請輕觸影像來下載或分享您的照片。 </p>";
							} else if ( window.Browser.name == "mozilla" && window.Browser.platform == "android" ){
								info = "<br>  <p style=\"font-size:36px;\"> 請輕觸影像來儲存您的照片。 </p>";
							} else{
								info = "<br>  <p style=\"font-size:36px;\"> 請輕觸影像來下載您的照片. </p>";
							}
						}else{
							info = "<br>  <p>Now we can only add context beside the image, because the length of img tag too long </p> <p> 請輕觸影像來下載您的照片.. </p>";
						}

						w.document.write( info + img.outerHTML );
						
						// document.body.appendChild( img );
						// console.log("triggerEvent: SnapShot: event=", event, ", size=", size, ", \nimg.outerHTML=", img.outerHTML, ", \ninfo=", info );
						break;
//[end---20190614-fei0066-add]//

					case "exchangeCamera":

						console.log(" trigger exchange camera ");

						break;
//[start-20190827-fei0071-add]//
					case "runAnimation2D":
						// console.log("three.js: trigger: runAnimation2D, event=", event, makarObj);
						this.runAnimation2D( makarObj, event );
						break;
					case "touchPlayAnimation":
							console.log("three.js: trigger: touchPlayAnimation, event=", event, makarObj);
							if (makarObj.animationSlices){
								if (makarObj.animationSlices[0]){
									if (makarObj.animationSlices[0].index){
										if (makarObj.animationSlices.length > event.index){ ////// the input index must include the origin slices.
											makarObj.animationSlices[0].index = event.index;
										}
									}
								}
							}
							makarObj.playAnimation = true;
							break;

					case "ShowImage":
						
						self.showAframeObjectEvent(event, reset);
						
						break;
					
					case "ShowImage2D":

						for (let i = 0; i< self.makarObjects2D.length; i++){
							if (self.makarObjects2D[i].obj_id == event.obj_id){
								// console.log("three.js: triggerEvent: _ShowImage2D: get obj=", self.makarObjects2D[i] );	
								if (self.makarObjects2D[i].visible == true){
									self.makarObjects2D[i].visible = false;
								}else{
									self.makarObjects2D[i].visible = true;
								}
							}
						}

						break;

					case "ShowText2D": 

						for (let i = 0; i< self.makarObjects2D.length; i++){
							if (self.makarObjects2D[i].obj_id == event.obj_id){
								// console.log("three.js: triggerEvent: _ShowImage2D: get obj=", self.makarObjects2D[i] );	
								if (self.makarObjects2D[i].visible == true){
									self.makarObjects2D[i].visible = false;
								}else{
									self.makarObjects2D[i].visible = true;
								}
							}
						}

						break;

					case "ShowModel":
						
						self.showAframeObjectEvent(event, reset);

						break;

					case "ShowVideo":
						
						self.showAframeObjectEvent(event, reset);

						break;
					case "ShowText":
						
						self.showAframeObjectEvent(event, reset);

						break;
						
					case "PlayAnimation":
						console.log("three.js: trigger: PlayAnimation, event=", event, ", makarObj=", makarObj);


						///////////////

						console.log("three.js: triggerEvent: _PlayAnimation: event=", event );	
						obj_id = event.obj_id;
						target = document.getElementById(obj_id);

						if (!target){
							console.log('three.js: _PlayAnimation: target not exist', target);
							break;
						}
						
						var mainAnimation;
						for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
							if (target.object3D.children[0].animationSlices[i].uid == event.uid){
								mainAnimation = target.object3D.children[0].animationSlices[i].animationName;
							}
						}
						target.setAttribute("animation-mixer", "clip: "+mainAnimation);

						if(event.loop){
							target.object3D.children[0].animationSlices[0].loop = event.uid;
							// target.object3D.children[0].animationSlices[0].idle = event.uid;
							target.object3D.children[0].animationSlices[0].uid = event.uid;
							target.object3D.children[0].animationSlices[0].changed = true;
							target.object3D.children[0].animationSlices[0].reset = true;
							// target.setAttribute('class', "unclickable" );
						}
						else{
							target.object3D.children[0].animationSlices[0].uid = event.uid;
							target.object3D.children[0].animationSlices[0].changed = true;
							target.object3D.children[0].animationSlices[0].reset = event.reset;
						}

						break;


						///////////////

						// let mainAnimation;
						// let mainAnimationIndex;
						// for (let i = 0; i < self.makarObjects.length; i++){
						// 	if (self.makarObjects[i].obj_id == event.obj_id ){
						// 		// mainAnimation = self.makarObjects[i].children[0].animationSlices[i].animationName;

						// 		if (self.makarObjects[i].children[0]){
						// 			if (self.makarObjects[i].children[0].animationSlices){

						// 				for (let j = 1; j < self.makarObjects[i].children[0].animationSlices.length; j++ ){
						// 					if (self.makarObjects[i].children[0].animationSlices[j].uid == event.uid ){

						// 						for(let k = 0; k < self.makarObjects[i].children[0].animations.length; k++){
						// 							if ( self.makarObjects[i].children[0].animationSlices[j].animationName == self.makarObjects[i].children[0].animations[k].name ){
						// 								mainAnimationIndex = k;
						// 							}
						// 						}

						// 						for (let m = 0; m < self.makarObjects[i].children[0].mixer._actions.length; m++ ){
						// 							self.makarObjects[i].children[0].mixer._actions[m].stop();
						// 							// self.makarObjects[i].children[0].mixer._actions[0].fadeOut(10);

						// 						}

						// 						self.makarObjects[i].children[0].mixer = new THREE.AnimationMixer(  self.makarObjects[i].children[0] );
						// 						var action = self.makarObjects[i].children[0].mixer.clipAction( self.makarObjects[i].children[0].animations[ mainAnimationIndex ] );
						// 						action.play();

						// 						if(event.loop){
						// 							self.makarObjects[i].children[0].animationSlices[0].loop = event.uid;
						// 							// self.makarObjects[i].children[0].animationSlices[0].idle = event.uid;
						// 							self.makarObjects[i].children[0].animationSlices[0].uid = event.uid;
						// 							self.makarObjects[i].children[0].animationSlices[0].changed = true;
						// 							self.makarObjects[i].children[0].animationSlices[0].reset = true;
						// 						} else {
						// 							self.makarObjects[i].children[0].animationSlices[0].uid = event.uid;
						// 							self.makarObjects[i].children[0].animationSlices[0].changed = true;
						// 							self.makarObjects[i].children[0].animationSlices[0].reset = event.reset;
						// 						}

						// 					}
						// 				}
						// 			}
						// 		}
								

						// 	}
						// }

						// break;

					case "PlayMusic":

						obj_id = event.obj_id;
						target = document.getElementById(obj_id);

						if (!target){
							console.log('three.js: _PlayMusic: target not exist', target);
							break;
						}

						console.log("three.js: triggerEvent: _PlayMusic: event=", event );

						//// 開關物件「可見」
						self.showAframeObjectEvent(event, reset);

						//// 依照「當前是否正在播放」判定「播放/暫停」
						if ( target.object3D.children[0] ){
							if ( target.object3D.children[0].children[0] ){
								if ( target.object3D.children[0].children[0].type == 'Audio' ){

									if ( target.object3D.children[0].children[0].isPlaying == true ){
										target.components.sound.stopSound();
									}else{
										target.components.sound.playSound();
									}
								}
							}
						}

						break;

					case "ReadText":
						console.log("three.js: _ReadText: ", event );
						//// 找到對應的文字物件
						if ( event.obj_id ){
							let textObjID = event.obj_id;
							let idx = self.currentProjectIndex;

							sceneResult[idx].data.scene_objs_v2.objs

	
							if ( sceneResult && sceneResult[idx] && sceneResult[idx].data && sceneResult[idx].data.scene_objs_v2 && sceneResult[idx].data.scene_objs_v2.objs && Array.isArray( sceneResult[idx].data.scene_objs_v2.objs ) ){
								sceneResult[idx].data.scene_objs_v2.objs.forEach( e =>{
									if ( e.obj_id == textObjID  ){
										self.speechTextObj( e );
									}
								});
							}
						}
	
						break;	
					
					case "FingerGesture":

						break;

					default:
						console.log("three.js: trigger: default, event=", event, ", makarObj=", makarObj);
//[end---20190827-fei0071-add]//

				}
			}


			////
			//// 切換觀看模式，目前有「AR」跟「模型觀看」 兩種
			//// 起始預設為「AR」模式 
			//// 假如「有指定觀看模式」，則切換。假如沒有輸入，則判斷當前模式，改為另一個
			//// AR/model 觀看模式切換上會比較麻煩，暫時設定為： AR 模式 -> 要可以掃描所有的辨識圖， model 模式-> 只展現當前選中場景
			////  
			////
			this.setViewMode = function( mode = '' ){

				let self = this;
				let aCamera = self.aCamera;
				let oCamera = document.getElementById('oCamera');

				let pSet = new Promise( function( setModeResolve ){
					if ( aCamera && oCamera ){

						if ( mode == 'AR' ){

							self.camera = aCamera;

							let pSetSceneObj = self.setViewModeSceneObj('AR');
							pSetSceneObj.then( function( ret ){

								self.objectControls.enable = true;
								self.enableTracking = true;
								setModeResolve( 'AR' );

							} ).catch( function( err ){
								console.log(' _setViewModeSceneObj: AR err=', err);

							} )
							
							
							
						} else if ( mode == 'model' ){
	
							self.camera = oCamera.object3D.children[0] ;

							let pSetSceneObj = self.setViewModeSceneObj('model');
							pSetSceneObj.then( function( ret ){

								self.objectControls.enable = false;
								self.enableTracking = false;
								setModeResolve( 'model' );

							} ).catch( function( err ){
								console.log(' _setViewModeSceneObj: _model err=', err);

							} )


							

	
						} else{
	
							if ( self.camera == aCamera ){

								self.camera = oCamera.object3D.children[0] ;

								let pSetSceneObj = self.setViewModeSceneObj('model');
								pSetSceneObj.then( function( ret ){

									self.objectControls.enable = false;
									self.enableTracking = false;
									setModeResolve( 'model' );
	
								} ).catch( function( err ){
									console.log(' _setViewModeSceneObj: _switch model err=', err);
	
								} )
	

							}else{

								self.camera = aCamera;
								
								let pSetSceneObj = self.setViewModeSceneObj('AR');
								pSetSceneObj.then( function( ret ){

									self.objectControls.enable = true;
									self.enableTracking = true;
									setModeResolve( 'AR' );
	
								} ).catch( function( err ){
									console.log(' _setViewModeSceneObj: _switch AR err=', err);
	
								} );

							}
	
							
						}
	
					}
				});

				return pSet;


			}


			this.setViewModeSceneObj = function( _viewMode ){
				
				let self = this;

				let pSetViewModeSceneObj = new Promise( function( resolve, reject ){

					let sceneNo = 0; /// 基本上等同於 projIndex
					if ( parent.selectedProject  ){
						if ( parent.selectedProject.proj_id ){
							publishARProjs.result.forEach( (e, i )=>{
								if ( e.proj_id == parent.selectedProject.proj_id  ){
									sceneNo = i;
									console.log(' _setViewModeSceneObj: get id ', i, e );
								}
							} )
						}
					}
					
					let targetIndex = 0;
					for ( let i = 0, len = self.sceneTargetList.length; i < len; i++ ){
						if ( publishARProjs.result[ sceneNo ].target_ids.includes(  self.sceneTargetList[i].target_id  )  ){
							targetIndex = i;
						}
					}
					console.log(' _setViewModeSceneObj: sceneNo , targetIndex', sceneNo , targetIndex );

					
					//// 這邊流程：假如「沒有選定過 當前選定專案 」，則設定為「此頁面代表的專案」
					//// 假如「已經掃描過」而「選定過專案」，則保持選定的專案。
					//// 這樣會讓「從 A 專案進入」->「點擊模型觀看」->「看 A 場景」->「點擊XR體驗」->「掃描 B 辨識圖」->「體驗場景 B 」->「點擊模型觀看」->「看 B 場景」
					if ( self.currentProjectIndex == null ){
						self.currentProjectIndex = sceneNo;
					}else{
						sceneNo = self.currentProjectIndex;
					}

					let findColoring = publishARProjs.proj_list[ sceneNo ].proj_descr.indexOf("_coloring");
					if ( findColoring > 0  ){
						findColoring = true;
					}


					let obj = self.aframeNFTMarkers[ sceneNo ]; // get the right index for the right model
					let obj2D =  self.threeNFTMarkers2D[ sceneNo ];

					//// 不論是「從 AR 到 model 」還是「從 model 到 AR 」 都要先把所有的「專案 root 」給隱藏
					for( let i in self.aframeNFTMarkers ){
						self.aframeNFTMarkers[i].object3D.visible = false;
						self.aframeNFTMarkers[i].setAttribute('visible', false);						
					}
					for( let i in self.threeNFTMarkers2D ){
						self.threeNFTMarkers2D[i].visible = false;
					}



					if ( _viewMode == 'AR' ){

						//// 先判斷是否 場景物件有載入完成，沒有的話什麼都不用作（因為可能不是要掃描此專案），有的話把物件隱藏
						//// 注意：「著色專案」必須判斷「是否載入完成」重新回到「未載入狀態」，

						if ( obj.loadedObjects == true || obj2D.loadedObjects == true ){
							obj2D.visible = false;

							obj.setAttribute('visible' , false );
							obj.object3D.visible = false;
							
							
							//// 注意：載入「著色專案」時候要判斷是否已經「著色完成」，
							//// 「著色狀態」 -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
							if ( obj.coloringStatus != undefined && findColoring == true ){
								if ( obj.coloringStatus == -1 || obj.coloringStatus == 0  ){
									console.log(' _setViewModeSceneObj: model: _coloring module ', obj.coloringStatus );

									//// 假如 場景「已載入」，但是 「著色圖片」為「標準白色」，代表是先「使用模型瀏覽」再「AR體驗」。所以沒有讓使用者上過圖
									//// 必須重新走一趟「著色流程」
									obj.loadModel = false;
									//// 從場景中清除quiz 專案對應物件
									while( obj.children.length > 0 ){
										obj.children[0].remove();
									}

									while( obj2D.children.length > 0 ){
										obj2D.remove( obj2D.children[0] );
									}
									
									//// 開始載入場景
									let pAll = self.loadMakarScene( targetIndex , obj, obj2D);
									if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
									{	
										console.log('three.js: _setViewModeSceneObj : get _logic xml ' , self.currentProjectIndex, publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  );
										let pXML = self.parseLogicXML( self.currentProjectIndex , 0 );

										pAll.push( pXML );
									}

									if ( Array.isArray(pAll) ){
										Promise.all( pAll ).then( function( ret ){
											console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
											if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && 
											publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
											{
												self.logicList[ self.currentProjectIndex ].parseXML();
											}

											self.setupSceneBehav( sceneNo );

											resolve( true );
										});
									}


								}else if( obj.coloringStatus == 1 ) {
									//// 什麼事情都不用作
									console.log(' _setViewModeSceneObj: model: color 1');
									resolve( true );
								}

							}else{
								console.log(' _setViewModeSceneObj: AR: not _coloring module ' );

								resolve( true );
							}


						}else{
							resolve( true );

						}


					}else if ( _viewMode == 'model' ){

						
						//// 先判斷是否 場景物件有載入完成，沒有的話載入
						//// 注意：載入「著色專案」時候要直接載入 場景，而不要走「著色流程」
						////
						if ( obj.loadedObjects != true || obj2D.loadedObjects != true ){
							obj.loadedObjects = obj2D.loadedObjects = true;

							if ( findColoring == true ){
								//// 設定「著色模型」為「已經著色」，同時把「著色設定為白色」
								obj.loadModel = true;
								//// 紀錄「著色狀態」為「標準白色」  // -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
								obj.coloringStatus = 0;
								
								var ctx = self.targetCanvas.getContext("2d");
								ctx.fillStyle = "#FFFFFF";
								ctx.fillRect(0, 0, self.targetCanvas.width , self.targetCanvas.height );

							}

							//// 開始載入場景
							let pAll = self.loadMakarScene( targetIndex , obj, obj2D);

							if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
							{	
								console.log('three.js: _setViewModeSceneObj : get _logic xml ' , self.currentProjectIndex, publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  );
								let pXML = self.parseLogicXML( self.currentProjectIndex , 0 );

								pAll.push( pXML );
							}

							if ( Array.isArray(pAll) ){
								Promise.all( pAll ).then( function( ret ){
									console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
									if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && 
									publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
									{
										self.logicList[ self.currentProjectIndex ].parseXML();
									}

									self.setupSceneBehav( sceneNo );

									resolve( true );
								});
							}


						}else{
							//// 假如已經載入過，則啟動「邏輯相關功能」
							if ( self.logicList[ self.currentProjectIndex ]  ){
								if ( self.logicList[ self.currentProjectIndex ].logicSystemState == 0 ){
									self.logicList[ self.currentProjectIndex ].parseXML();
								}
							}

							//// 載入專案已經載入過，則把「調整過的物件」重新設定回來
							obj.object3D.traverse( function ( child ) {
								if (child.originTransform){
									let co = child.originTransform;

									child.position.copy( co.position );
									child.rotation.copy( co.rotation );
									child.scale.copy( co.scale );
									// if (child.makarType == "image" || child.makarType == "video" ){
										
									// 	let worldQ = child.getWorldQuaternion(new THREE.Quaternion());
									// 	let worldE = new THREE.Euler();
									// 	worldE.setFromQuaternion(worldQ);
									// 	//// 沿著物件本身的座標軸旋轉，[z->y->x]順序不能更換
									// 	//// 影片圖片本身的 z 軸（垂直銀幕）保持原本旋轉數值。
									// 	// child.rotateOnAxis(new THREE.Vector3(0,0,1), 0       - worldE.z );
									// 	child.rotateOnAxis(new THREE.Vector3(0,1,0), 0       - worldE.y );
									// 	child.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI - worldE.x );
									// 	//// 加上這兩行才會讓後續子物件也正確運作
									// 	child.updateMatrixWorld();
									// 	child.updateMatrix();
									// }

									//// 只有場景物件帶有邏輯功能，才會有設立「重設參數」的功能。
									//// 文字物件，需要回復「文字內容」「文字顏色」「文字背景顏色」
									//// 光源物件：回復「亮度」「顏色」
									if ( child.makarType == 'text' || child.makarType == 'light' || child.makarType == 'video' || child.makarType == 'model' ){
										if ( child.resetProperty ){
											child.resetProperty();
										}
									}

								}
							});



							//// 著色專案判斷：假如已經「載入過場景」，往下判斷「著色狀態」 -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
							if ( obj.coloringStatus != undefined && findColoring == true ){
								if ( obj.coloringStatus == -1  ){
									
									console.log(' _setViewModeSceneObj: model: _coloring module ', obj.coloringStatus );

									obj.loadModel = true;
									//// 紀錄「著色狀態」為「標準白色」  // -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
									obj.coloringStatus = 0;
									
									var ctx = self.targetCanvas.getContext("2d");
									ctx.fillStyle = "#FFFFFF";
									ctx.fillRect(0, 0, self.targetCanvas.width , self.targetCanvas.height );

									//// 清除物件底下的「著色按鈕」跟「著色透明版」
									while( obj.children.length > 0 ){
										obj.children[0].remove();
									}

									while( obj2D.children.length > 0 ){
										obj2D.remove( obj2D.children[0] );
									}

									//// 開始載入場景
									let pAll = self.loadMakarScene( targetIndex , obj, obj2D);

									if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
									{	
										console.log('three.js: _setViewModeSceneObj : get _logic xml ' , self.currentProjectIndex, publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  );
										let pXML = self.parseLogicXML( self.currentProjectIndex , 0 );

										pAll.push( pXML );
									}

									if ( Array.isArray(pAll) ){
										Promise.all( pAll ).then( function( ret ){
											console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
											if ( Array.isArray( publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls ) && 
											publishARProjs.proj_list[ self.currentProjectIndex ].xml_urls[ 0 ]  )
											{
												self.logicList[ self.currentProjectIndex ].parseXML();
											}

											self.setupSceneBehav( sceneNo )

											resolve( true );
										});
									}


								}else {
									console.log(' _setViewModeSceneObj: model: _coloring module ', obj.coloringStatus );
									resolve( true );
								}

							}else{
								console.log(' _setViewModeSceneObj: model: not _coloring module ' );
								resolve( true );

							}
							

						}

						obj2D.visible = true;

						// //// 測試用，放一個球，在 root object 中心 
						// let sphererObj = new THREE.Mesh( 
						// 	new THREE.SphereGeometry( 5 , 16 , 16 ),
						// 	new THREE.MeshBasicMaterial( { color: 0x00ffff , side: THREE.DoubleSide,  transparent: true, opacity: 1 } ) // DoubleSide, FrontSide
						// )
						// obj.object3D.add( sphererObj );
						
						//// 依照「辨識圖的寬高」決定，「物件觀看」時候，母層物件的位置
						let dpi = self.gcssTargets.dpi[obj.GCSSID] ; 
						let GCSSWidth= self.gcssTargets.width[obj.GCSSID] ; 
						let GCSSHeight= self.gcssTargets.height[obj.GCSSID] ; 

						obj.setAttribute('visible' , true ); //// 改為 aframe 之後，這樣設定比較穩
						obj.object3D.visible = true; //// 這個可能不夠
						obj.object3D.matrixAutoUpdate = true;
						obj.object3D.position.set( 0, 0, 0 );
						obj.object3D.position.add( new THREE.Vector3(  -GCSSWidth*25.4/dpi/2 , -GCSSHeight*25.4/dpi/2 , 0 ) );


						obj.object3D.rotation.x =  -90 * Math.PI/180;
						// obj.rotation.z =  10 * Math.PI/180;
						obj.object3D.updateMatrix();
						obj.object3D.updateMatrixWorld();

					}else{
						//// error 
						console.log(' _setViewModeSceneObj: error', _viewMode );

						reject( _viewMode );
					}



				});

				return pSetViewModeSceneObj;



			}



			this.getSnapShot = function(  ){

				let self = this;

				let pSnapShot = new Promise( function( snapResolve ){

						
					if ( !self || !self.GLRenderer || !self.arScene || !self.arScene.videoScene || !self.arScene.videoCamera ||
						!self.arScene.glScene || !self.arScene.camera || !self.arScene.scene2D || !self.arScene.camera2D || !self.GLRenderer.domElement ||
						!self.GLRenderer.domElement.clientWidth || !self.GLRenderer.domElement.clientHeight || 
						!self.GLRenderer.domElement.width || !self.GLRenderer.domElement.height 
					){
						console.log(' _XRController: _getSnapShot: something error ', self );
						snapResolve( -1 );
						return;
					}
		
					let visibleIDs = [];
					for (var i = 0; i < self.arScene.scene2D.children.length; i++ ){
						if (self.arScene.scene2D.children[i].GCSSID < 0){
							if (self.arScene.scene2D.children[i].visible == true){
								visibleIDs.push(i);
								self.arScene.scene2D.children[i].visible = false;
							}
						}
					}

					self.GLRenderer.autoClear = false;
					self.GLRenderer.render( self.arScene.videoScene, self.arScene.videoCamera);
					self.GLRenderer.clearDepth();
					self.GLRenderer.render(  self.arfScene.object3D , self.camera );
					self.GLRenderer.render( self.arScene.scene2D, self.arScene.camera2D );
					
					for (var i = 0; i < visibleIDs.length; i++){
						self.arScene.scene2D.children[ visibleIDs[i] ].visible = true;
					}

					//// 改變 canvas，必須的。讓圖片原版比例改變。
					// let ccw = self.GLRenderer.domElement.clientWidth;
					// let cch = self.GLRenderer.domElement.clientHeight;
					// let cw = self.GLRenderer.domElement.width;
					// let ch = self.GLRenderer.domElement.height;
		
					// console.log(' _SnapShot: canvas client wh= ',  ccw, cch, 'canvas wh=', cw, ch );
					// let newCanvas = document.createElement('canvas');
					// newCanvas.width = cw;
					// newCanvas.height = cw * ( cch / ccw );
					// let newCtx = newCanvas.getContext('2d');
					// newCtx.drawImage(self.GLRenderer.domElement, 0, 0, cw, ch, 0, 0, newCanvas.width , newCanvas.height );
					// var dataURL = newCanvas.toDataURL("image/png", 1.0);
		
					let dataURL = self.GLRenderer.domElement.toDataURL("image/png", 1.0);
		
					snapResolve( dataURL ) ; 

				} );

				return pSnapShot ;

			}


			////
			//// check which Application create the FBX model, { Maya or 3ds Max } 
			//// we need know the transformation of all common software 
			////

			this.checkFBXApplication = function( object, scale ){
				if (object["LastSaved|ApplicationName"]){
					switch (object["LastSaved|ApplicationName"].value ){
						case "3ds Max":
							if ( object["OriginalUnitScaleFactor"] ){
								console.log("LastSaved|ApplicationName = 3d Max, OriginalUnitScaleFactor exist scale*", object["OriginalUnitScaleFactor"]  ) ; 
								scale.multiplyScalar( object["OriginalUnitScaleFactor"] );
							}else{
								console.log("LastSaved|ApplicationName = 3d Max, OriginalUnitScaleFactor not exist scale*100 " ) ; 
								scale.multiplyScalar(100);
							}
							// scale.multiplyScalar(100);
							break;
						case "Maya":
							if ( object["OriginalUnitScaleFactor"] ){
								console.log("LastSaved|ApplicationName = Maya, OriginalUnitScaleFactor exist scale*", object["OriginalUnitScaleFactor"]  ) ; 
								scale.multiplyScalar( object["OriginalUnitScaleFactor"] );
							}else{
								console.log("LastSaved|ApplicationName = Maya, OriginalUnitScaleFactor not exist do nothong"  ) ; 
							}
							// object.scale.set(1,1,1);
							break;
						default:
							console.log("not 3ds Max and Maya, LastSaved|ApplicationName = ", object["LastSaved|ApplicationName"] );
					}
				}else{
					console.log("three.js: checkFBXApplication: object not include LastSaved|ApplicationName " );
				}
			}

//[end---20181031-fei0034-add]//

//[start-20190827-fei0071-add]//
			this.runAnimation2D = function( obj, event ){
				// console.log("0 three.js: _runAnimation2D: object=", obj );

				if ( obj && event.dt ){
					if ( !obj.isObject3D ){
						console.warn("three.js: _runAnimation2D warning, obj is not THREE.Object3D ");
						return -1;
					}
				}else{
					console.warn("three.js: _runAnimation2D warning, obj is null ");
					return -1;
				}
				// console.log("1 three.js: _runAnimation2D: object=", obj, event );

				if ( event.dp ){
					if (event.dp.isVector3){
						var translateDirection = event.dp.clone().normalize(); 
						var translateDistance = event.dp.length();

						var start = null, progress= null, lastStamp=null, during = null;
						var runAnimation2D_dp_tick = function( timestamp ){
							if (!start)	start = timestamp;
							
							if (lastStamp){
								during = timestamp - lastStamp;
							}else{
								during = 0;
							}
							progress = timestamp - start; ////// unit is ms
							lastStamp = timestamp;
							// console.log("progress=", progress, during );
							if (progress < event.dt ) {
								obj.translateOnAxis( translateDirection, translateDistance*(during/event.dt) ); 
								requestAnimationFrame( runAnimation2D_dp_tick  );
							}
						}
						requestAnimationFrame(runAnimation2D_dp_tick);
					}
				}
				
				if ( event.ds ){
					if (event.ds.isVector3 ){
						if (event.ds.x < 0 || event.ds.y < 0 || event.ds.z < 0 ){

						}
						var scaleDirection = event.ds.clone().normalize(); 
						var scaleDistance = event.ds.length();

						let origins = obj.scale.clone();////原始大小
						let ds = event.ds;//// 要放大倍數
						let finals = obj.scale.clone().multiply(ds); 
						let diffs = finals.clone().sub(origins);

						let revDs = new THREE.Vector3(1,1,1).divide(ds);
						let revOrigins = finals.clone();
						let revFinals = origins.clone();
						let revDiffs = revFinals.clone().sub(revOrigins);

						// console.log("three.js: _runAnimation2D: ds: value " , origins , finals, diffs );
						// console.log("three.js: _runAnimation2D: ds: reverse value " , revOrigins , revFinals, revDiffs );


						var start = null, progress= null, lastStamp=null, during = null;
						var runAnimation2D_ds_tick = function( timestamp ){
							if (!start)	start = timestamp;
							
							if (lastStamp){
								during = timestamp - lastStamp;
							}else{
								during = 0;
							}
							progress = timestamp - start; ////// unit is ms
							lastStamp = timestamp;
							// console.log("progress=", progress, during );
							if (progress < event.dt ) {
								// console.log("three.js: _runAnimation2D: ss ", progress/event.dt , diffs.clone().multiplyScalar(progress/event.dt) , origins.clone().add( diffs.clone().multiplyScalar(progress/event.dt) ) );
								obj.scale.copy( origins.clone().add( diffs.clone().multiplyScalar(progress/event.dt) )   );
								requestAnimationFrame( runAnimation2D_ds_tick  );
							}else{
								if (event.reverse ){
									if ( progress < event.dt*2  ){
										// console.log("three.js: _runAnimation2D: ss ", (progress-event.dt)/event.dt , diffs.clone().multiplyScalar((progress-event.dt)/event.dt) , origins.clone().add( diffs.clone().multiplyScalar((progress-event.dt)/event.dt) ) );
										obj.scale.copy( revOrigins.clone().add( revDiffs.clone().multiplyScalar( (progress-event.dt)/event.dt) )   );
										requestAnimationFrame( runAnimation2D_ds_tick  );
									}else{
										obj.scale.copy( origins );
										console.log("three.js: _runAnimation2D: ds reverse end " , obj.scale);
									}

								}else{
									obj.scale.copy( finals );
									console.log("three.js: _runAnimation2D: ds end , not reverse ", obj.scale );
								}
							}
						}
						requestAnimationFrame(runAnimation2D_ds_tick);
					}
				}

				if ( event.dopacity ){
					if (obj.material){
						if (obj.material.opacity){
							console.log("0 three.js: _runAnimation2D: obj.material.opacity=", obj.material.opacity);
							var originOpacity = obj.material.opacity;
							var diffOpacity = originOpacity - event.dopacity;
							var start = null, progress = null;
							var runAnimation2D_do_tick = function( timestamp ){
								if (!start)	start = timestamp;
								progress = timestamp - start; ////// unit is ms
								if (progress < event.dt ) {
									obj.material.opacity = originOpacity - (diffOpacity*(progress/event.dt));
									requestAnimationFrame( runAnimation2D_do_tick );
								}else{
									console.log("1 three.js: _runAnimation2D: obj.material.opacity=", obj.material.opacity);
								}
							}
							requestAnimationFrame(runAnimation2D_do_tick);
						}
					}
				}

			}


			///// 原本「切換鏡頭」的功能很蠢，要重新載入網頁，改為只要重新啟動相機即可
			this.switchCamera = function( cc ){

				//// 預設為「後鏡頭」
				let configuration = cc ? cc : { facing: 'environment' };

				let cFacing = self.facing;
				if ( cFacing == 'environment' ){
					configuration.facing = 'user';
					self.facing = 'user'
				}else if ( cFacing == 'user' ) {
					configuration.facing = 'environment';
					self.facing = 'environment'
				}else{
					configuration.facing = 'environment';
					self.facing = 'environment'
				}


				// self.arScene.video.srcObject.getTracks()[0].stop()
				self.arScene.video.srcObject.getTracks().forEach( e => {
					e.stop();
				}) ;
				

				let videoSuccess = function(stream){
					console.log("three.js: _startWebCam: videoSuccess: stream=", stream );

					window.videoStream = stream;

					if ( self.videoStreamPlane.material.map.image ){
						let video = self.videoStreamPlane.material.map.image;
						video.srcObject = stream;
						video.playsInline = true;
						video.onloadedmetadata = function() {
							function tick_video(){
								if (video.videoWidth > 200 || video.videoHeight > 200){
									//// 將video 物件記錄下來，在後面等 renderer 開始工作後再啟動
									video.play();
									console.log('three.js: _switchCamera: video play  ');
								}else{
									setTimeout(tick_video, 100);
								}
							}
							if ( self.videoCamera ){
								console.log("three.js: _startWebCam: videoCamera exist, donothing ");
							}else{
								console.log("three.js: _startWebCam: videoCamera not exist, start video ");
								// tick_video();
							}
							tick_video();
						}
						self.streamVideo = video;
					}
				}

				let onError = function( e ){
					console.log('three.js: _switchCamera: onError e = ', e );
				}

				navigator.mediaDevices.enumerateDevices().then(function(devices) {
					let useDeviceID = false;
					let cameraID, facingString, video_constraints;
					devices = devices.filter(function(devices) { return devices.kind === 'videoinput'; });
					if ( configuration.facing == "environment" ){facingString = "back";} 
					else if (configuration.facing == "user" ){facingString = "front";} 
					else{facingString = "back";}
					for (let i in devices){
						// if ( !devices[i].label ){ useDeviceID = false; }
						if( devices[i].label.toLowerCase().search( facingString ) != -1  ){ // front back
							cameraID = devices[i].deviceId;
							useDeviceID = true;
						}
						// console.log("three.js: devices=", devices[i] );
					}
					if (useDeviceID){ // PC, android chrome/FireFox, use the specific id by labels.
						console.log("three.js: _useDeviceID true, cameraID=", cameraID );
						video_constraints = {
							video: {
								width: { min: 320, ideal: 640, max: 1280 },
								height: { min: 240, ideal: 480, max: 800 }, 
								frameRate: { min:15, ideal: 30, max: 60 },
								deviceId: {'exact':cameraID }
							}
						};
					}else{
						let facing;
						if ( configuration.facing ){ //// usually iOS safari and QQ, use "user"/"environment" to start
							facing = configuration.facing;
							console.log("three.js: _configuration.facing do exist: set facing = ", facing );
							video_constraints = {
								video: {
									width: { min: 320, ideal: 640, max: 1280 },
									height: { min: 240, ideal: 480, max: 800 }, 
									frameRate: { min:15, ideal: 30, max: 60 },
									facingMode: facing
								}
							};
						}else{
							console.log("api.js: _configuration.facing dosent exist: set facing = environment" );
							video_constraints = {
								video: {
									width: { min: 320, ideal: 640, max: 1280 },
									height: { min: 240, ideal: 480, max: 800 }, 
									frameRate: { min:15, ideal: 30, max: 60 },
									facingMode: 'environment'
								}
							};
						}
					}

					navigator.mediaDevices.getUserMedia( video_constraints ).then(videoSuccess, onError); // successCallback

				});

				
			}


			//// 載入 邏輯 xml
			this.parseLogicXML = function(projIndex, sceneIndex){
				let pXML;

				// for(let i=0; i< arController.intervalList.length; i++){
				// 	clearInterval( arController.intervalList[i]);
				// }
				// arController.intervalList.length = 0;
				
				if ( publishARProjs.result[projIndex].xml_urls && publishARProjs.result[projIndex].xml_urls[sceneIndex]  ){
					let xmlURL = publishARProjs.result[projIndex].xml_urls[sceneIndex];

					console.log('three.js: _parseLogicXML: xmlURL = ' , xmlURL);

					let logic = new Logic();
					pXML = logic.loadXMLtoDoc(xmlURL);

					arController.logicList[ projIndex ] = logic;
				}

				return pXML;
			}


		};
		
		var event = document.createEvent('HTMLEvents');
		event.initEvent("integrated", true, true);
		event.eventType = 'message';
 		document.dispatchEvent(event);

//[end---20181207-fei0041-add]//
	};

//[start-20190219-fei0055-add]//

	// let serverUrl = "https://ssl-api-makar-apps.miflyservice.com/Makar"; // makar server 


	window.FuncColoring = function(){
		// console.clear(); // clear consle
		if (window.proxy){
			console.log("three.js: proxy is created");
			proxy.getFrameTarget();
		}else{
			console.log("three.js: proxy is not created, please StartAR first");
		}
	}


	function makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	var leavedSendLog = window.leavedSendLog = function(e) {
		var dialogText = 'Dialog text here333';

		if (!window.proxy || !window.publishARProjs) return;
		if (!proxy.arController) return;
		if (!proxy.arController.userStartTime) return;
		if (!proxy.arController.projStartTimeList) return;		
		
		let device_id;
		if (localStorage.getItem("device_id")){
			if (localStorage.getItem("device_id") >= 24 ){
				device_id = localStorage.getItem("device_id");
			}else{
				device_id = new Date().getTime() + "_" + makeid(10) ;
				localStorage.setItem( "device_id",  device_id );
			}
		}else{
			device_id = new Date().getTime() + "_" + makeid(10) ;
			localStorage.setItem( "device_id",  device_id );
		}

		let leavedTime = new Date().getTime();

		let projData = {
			"brand": Browser.name + Browser.version ,
			"os": Browser.platform ,
			"device_id": device_id ,
			"client": "viewer" , //// 等amos修改玩之後再改為 web 
			"user_id": publishARProjs.user_id ,
			"proj_id": "" ,
			"proj_type":"ar" ,
			"duration_time": 0 ,
			"explore_time": 0 ,
			"play_time": 0 ,
			"location_long":0.0 ,
			"location_lan":0.0 ,
		};

		console.log("three.js: window refresh " , proxy.arController.userStartTime , proxy.arController.projStartTimeList  );
		let savedProjLogs = [];
		for (let i = 0; i < proxy.arController.projStartTimeList.length; i++ ){
			let projTimeInfo = proxy.arController.projStartTimeList[i]; 
			let nextProjTimeInfo = proxy.arController.projStartTimeList[i+1] ; 

			projData.proj_id = publishARProjs.proj_list[ projTimeInfo.projIndex ].proj_id;
			//// 假如是第一個遊玩的專案
			if ( i == 0 ){
				//// 假如有下一個專案
				if (nextProjTimeInfo){
					projData.duration_time = (nextProjTimeInfo.time - proxy.arController.userStartTime)/1000;
					projData.play_time     = (nextProjTimeInfo.time - projTimeInfo.time)/1000;
					projData.explore_time  = (projTimeInfo.time     - proxy.arController.userStartTime)/1000 ;
				//// 假如沒有下一個專案
				}else{
					projData.duration_time = (leavedTime        - proxy.arController.userStartTime)/1000;
					projData.play_time     = (leavedTime        - projTimeInfo.time)/1000 ;
					projData.explore_time  = (projTimeInfo.time - proxy.arController.userStartTime)/1000 ;
				}
			//// 假如不是第一個專案
			} else {
				//// 假如有下一個專案
				if (nextProjTimeInfo){
					projData.duration_time = (nextProjTimeInfo.time - projTimeInfo.time)/1000 ;
					projData.play_time     = (nextProjTimeInfo.time - projTimeInfo.time)/1000 ;
					projData.explore_time  = 0 ;
				//// 假如沒有下一個專案
				}else{
					projData.duration_time = (leavedTime        - projTimeInfo.time)/1000 ;
					projData.play_time     = (leavedTime        - projTimeInfo.time)/1000 ;
					projData.explore_time  = 0 ;
				}
			}
			console.log("three.js: project[" + i + "] playing time = " , projData.duration_time , projData.play_time , projData.explore_time );
			savedProjLogs.push(projData);
		}
		localStorage.setItem("savedProjLogs", JSON.stringify(savedProjLogs) );//// 由於重新整理頁面時候，無法傳送 post 出去，我們將資訊存於 localStorage 並且在 main.js 時候判斷是否有待上傳的資料。

		return undefined;
	};

	window.onbeforeunload = leavedSendLog;

	////// control the back arrow
	// let leftTopButton = document.getElementById("leftTopButton");
	// leftTopButton.addEventListener('click', function(event){
	// 	leavedSendLog();
	// 	event.preventDefault();
	// 	// parent.aUI.closeCoreIframe();
	// });

	window.ARThreeOnLoad = function() {


		let facing = 'environment';

		console.log("three.js: _ARThreeOnLoad start, facing=", facing);
		// ARController.getUserMediaThreeScene({maxARVideoSize: 640, cameraParam: '/camera_para_640_480_fei.dat', //// camera_para_1280_720_fei  camera_para_640_480_fei


		//// AR 專案目前不支援在開啟之後再調整畫面大小，技術上太多要解決的部份。所以啟動後隱藏「全螢幕按鈕」
		if ( parent && parent.fullScreenIcon && parent.fullScreenIcon.style ){
			parent.fullScreenIcon.style.display = 'none';
		}

		//// 大改版，架構改為使用 aframe
		let aframeP = new Promise( function( aframeResolve ){

			//// 大改版，直接取用 a-frame 架構
			let arDiv = document.createElement('div');
			arDiv.style.position = "absolute" ;    //  "500px" or "80%"
			arDiv.setAttribute('id', "arDiv" );
			arDiv.style.top = "0px" ; //

			arDiv.style.width = document.documentElement.clientWidth + "px" ;
			arDiv.style.height = Math.round(document.documentElement.clientHeight - 0) + "px" ;

			document.body.appendChild(arDiv);

			let arfScene = document.createElement('a-scene');
			arfScene.setAttribute('id', "arfScene" ); ////// just id
			arfScene.setAttribute( 'embedded', "" );
			arfScene.setAttribute( 'renderer', 'logarithmicDepthBuffer: true; physicallyCorrectLights: false; ' );
			
			
			arfScene.setAttribute( 'vr-mode-ui', "enabled: false" );
			arDiv.appendChild(arfScene);

			let ambientLight = document.createElement("a-light");
			ambientLight.setAttribute("id", "ambientLight");
			ambientLight.setAttribute("type", "ambient" );
			ambientLight.setAttribute("color", "#808080" ); // white / gray / #fff  / #c8c8c8
			ambientLight.setAttribute("ground-color", "#fff" ); // #fff , Fei dont know how it work
			ambientLight.setAttribute("intensity", 1.0 );

			arfScene.appendChild(ambientLight); 


			//// 模型觀看視角的相機，起始預設為「不啟動」。
			//// 注意：啟動指令為  oCamera.setAttribute('camera', 'active:true;')  同時會關閉所有場景中 camera （設定 active false）
			//// 反之，關閉指令為  oCamera.setAttribute('camera', 'active:false;')    
			//// 
			let oCamera = document.createElement('a-entity');
			oCamera.setAttribute('id', "oCamera" );
			oCamera.setAttribute('crossorigin', 'anonymous');
			oCamera.setAttribute('camera', {active: true, fov: 80 } );
			oCamera.setAttribute('orbit-controls', 
			`minPolarAngle: 0; 
			maxPolarAngle: 180; 
			minDistance: 0.1; 
			maxDistance: 1000; 
			initialPosition: 0 60 -300;` ); 

			arfScene.appendChild( oCamera );



			if (arfScene.hasLoaded) {
				aframeResolve();
			} else {
				arfScene.addEventListener('loaded', function(){
					aframeResolve();
				});
			}
		});

		aframeP.then( function(){

			ARController.getUserMediaThreeScene({maxARVideoSize: 640, cameraParam: '../camera_para_640_480_fei.dat', facing: facing , // facing: user or environment 
			onSuccess: function(arScene, arController, arCamera) {
				// console.log("three.js: _ARThreeOnLoad onSuccess start");
				var proxy = new ARProxy(arController, '../camera_para_640_480_fei.dat', function() { //// basically, the current path is same with HTML file. NOTE: if the path is already on root, ../ will not working.  
					// console.log("three.js: ARProxy callback done");
				});
				window.proxy = proxy;

				////// setup exchange camera function
				
				// switchLens.onclick = function(event) {
				// 	console.log("three.js: switchLens click , event= ", event );
				// 	// arController.triggerEvent( { simple_behav: "exchangeCamera", enable: true} );
				// 	arController.switchCamera();

				// };

				////// setup snapShot function
				
				// snapShotCamera.addEventListener("click" , function(event){
				// 	console.log("three.js: snapShotCamera click , event= ", event );
				// 	arController.triggerEvent( { simple_behav: "SnapShot", enable: true} );
				// });
				// snapShotCamera.onclick = function(event){ 
				// 	console.log("three.js: snapShotCamera click , event= ", event );
				// 	arController.triggerEvent( { simple_behav: "SnapShot", enable: true} );
				// };

				//// 改版為 aframe 架構
				let arfScene = document.getElementById('arfScene');
				
				let arfRenderer = arfScene.renderer;
				let arfCanvas = arfScene.canvas;

				arController.arfScene = arfScene;
				arController.loadAssets();

				arController.facing = facing;

				let GLRenderer = arfRenderer;
				// arfCanvas.style.position = 'static';
				arfCanvas.style.position = 'relative';

				GLRenderer.outputEncoding = THREE.GammaEncoding;
				GLRenderer.gammaFactor = 1;

				GLRenderer.sortObjects = true;

				//// AR先不使用陰影
				// GLRenderer.shadowMap.enabled = true;
				// GLRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

				arController.GLRenderer = GLRenderer;
				arController.arScene = arScene;

				arController.ARSceneResult = sceneResult;
				window.arController = arController;

				//// 起始設定，由於目前 「朗讀文字」的功能棟有第一次無法取得 發聲列表 問題，所以這邊先行呼叫一次
				if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){
					let voices = speechSynthesis.getVoices();
					arController.voices = voices;
				}

				proxy.addEventListener('load', function(ev) {
					// console.log("three.js: load: ev=", ev);
					this.processingDone = false ;
					if (window.publishARProjs && window.sceneResult ){

						//////// add the default 2D objects here, exchange camera. 20200227 replace from HTML and CSS.
						
						//// add the default 2D object, note
						var defaultRoot2DNote1 = this.arController.createThreeNFTMarker2D( "-3" ); //set the GCSSID = -x, means its not user added 
						this.arController.loadDeaultTexture2D( defaultRoot2DNote1, "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/note1.png", // "../images/note1.png"
							new THREE.Vector3(0,-50,0) , // position
							new THREE.Vector3(0,0,0) , // rotation
							new THREE.Vector3( 0.9, 0.9, 0.9) , // scale
							[0.5, 1], //rect [-1, -0.5, 0, 0.5, 1] means left-right and down-top  , [0.5, 0]
							{simple_behav: "runAnimation2D", dt:200, dopacity:0.1 }    //// behavior
						);
						defaultRoot2DNote1.name = "note1";
						defaultRoot2DNote1.visible = false; // not show at first, if getFrameTarget false, show it.
						
						arScene.scene2D.add(defaultRoot2DNote1);

						
						/////// 計算所有 target 數量
						let targetsNumber = 0;
						let targetNo = 0;
						let sceneTargetList = [];
						arController.sceneTargetList = sceneTargetList;

						for (let i in window.publishARProjs.proj_list ){

							//// 判斷「用戶是否允許」跟「專案是否允許」，只要其中之一通過即可
							// let proj_allow = false;
							// for ( let j = 0; j < userPublishProjs.proj_list.length; j++ ){
							// 	if ( userPublishProjs.proj_list[j].proj_id == publishARProjs.proj_list[i].proj_id  ){
							// 		if ( userPublishProjs.proj_list[j].web_ar == false ){	

							// 		}else{
							// 			proj_allow = true;
							// 		}
							// 		break;
							// 	}
							// }

							// if ( window.allowedMakarIDUseWeb == true || proj_allow == true ){
							// 	if ( window.publishARProjs.proj_list[i].targets_gcss_urls ){
							// 		targetsNumber += window.publishARProjs.proj_list[i].targets_gcss_urls.length;
							// 	}else{
							// 		targetsNumber++;
							// 	}

							// }else{
							// 	continue;
							// }

							///// 不判斷「用戶允許」或是「專案允許」，都導入
							if ( window.publishARProjs.proj_list[i].targets_gcss_urls ){
								targetsNumber += window.publishARProjs.proj_list[i].targets_gcss_urls.length;
							}else{
								targetsNumber++;
							}

						}
						console.log("three.js: _load: the total target number = " , targetsNumber );
						
						//// 設定的辨識圖上限為 20 超過的話不進行後續流程。
						if (targetsNumber > 19){
							console.log("three.js: _load: languageType = " , languageType );
							warnModal.style.display = "block";
							warnModalInfo.textContent = worldContent.targetNumberError[languageType] ;

							warnModalButton.onclick = function(){
								console.log("three.js: the warnModalButton is clicked ");
								warnModal.style.display = "none";
								// parent.aUI.closeCoreIframe();
							}
							return;
						}

						let onloadNFTMarker = function(ev){
							
							console.log('three.js: _onloadNFTMarker: ev = ', ev );

							// let markerRoot =    arController.createThreeNFTMarker(ev.result[0] ); //the ev is from  makarWebAR.worker.js not from makarWebAR.api.js 
							
							let markerRoot   =  arController.createAframeNFTMarker(ev.result[0] );
							
							let markerRoot2D =  arController.createThreeNFTMarker2D(ev.result[0] );

							// arScene.videoScene.add(markerRoot2D);
							arScene.scene2D.add(markerRoot2D);
							
							// arScene.glScene.add(markerRoot);
							arController.arfScene.appendChild( markerRoot );


							//////// 載入所有 targets 完成後在讓畫面啟動
							// if ( Object.values(arController.threeNFTMarkers).length == targetsNumber ){
							if ( Object.values(arController.aframeNFTMarkers).length == targetsNumber ){
								// var bgcanvas = document.getElementById("bgcanvas");
								// bgcanvas.style.display = "none";

								//// 20201029 為了解決 iphone上畫面卡住問題
								// 假如先執行 video.play() 等待 一段時間 再執行 tick 則畫面高機率卡住
								// 假如先執行 tick 等待 n ms 再執行 video.play() 則畫面高機率順暢（沒遇到卡住）
								console.log("three.js: _onloadNFTMarker done, call arScene.video.play() " );

								proxy.processingDone = true;
								console.log("three.js:arScene.video.play()=>tick()" );
								tick();
								setTimeout(function(){

									arScene.video.play().then(function(){
										console.log("three.js:arScene.video.play()=> succes" );
									}).catch(function(error){
										console.error("three.js:arScene.video.play()=> error", error);	
									});

								}, 1000);
								//// 啟動計時器
								arController.userStartTime = new Date().getTime();
								arController.projStartTimeList = [];


								////
								//// 最後一張辨識圖載入完成，往下判斷啟動方式為「模型觀看」還是「AR」
								//// 會很麻煩 
								////

								let homePage = document.getElementById('homePage');

								if ( parent.selectedProject ){
									if ( parent.selectedProject.viewMode == 'XR' ){
										
										let pSetViewMode = arController.setViewMode( 'AR' );
										pSetViewMode.then(function(){
											if (homePage){homePage.style.display = "none"; }
										});

									}else if (parent.selectedProject.viewMode == 'model'){
										let pSetViewMode = arController.setViewMode( 'model' );
										pSetViewMode.then(function(){
											if (homePage){homePage.style.display = "none"; }
										});
									}else{
										let pSetViewMode = arController.setViewMode( 'AR' );
										pSetViewMode.then(function(){
											if (homePage){homePage.style.display = "none"; }
										});
									}
								}else{
									let pSetViewMode = arController.setViewMode( 'AR' );
									pSetViewMode.then(function(){
										if (homePage){homePage.style.display = "none"; }
									});
								}
								

								//// 最後一張辨識圖載入完成，執行隱藏UI
								if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
									typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
								){
									if ( parent.projectUIController.status == -1 ){
										parent.projectUIController.showUI();
									}
								}

								
								//// debug 直接載入場景
								// let debug_loadFirst = true ;
								let debug_loadFirst = false;
								if ( debug_loadFirst == true ){

									let sceneNo = 0;
									if ( parent.selectedProject  ){
										if ( parent.selectedProject.proj_id ){
											publishARProjs.result.forEach( (e, i )=>{
												if ( e.proj_id == parent.selectedProject.proj_id  ){
													sceneNo = i;
													console.log(' +++++++ get id ', i, e );
												}
											} )
										}
									}
									
									arController.currentProjectIndex = sceneNo;
									let obj = arController.aframeNFTMarkers[ sceneNo ]; // get the right index for the right model
									let obj2D =  arController.threeNFTMarkers2D[ sceneNo ];
									obj.loadedObjects = obj2D.loadedObjects = true;
									
									let pAll = arController.loadMakarScene( sceneNo , obj, obj2D);
									
									if ( Array.isArray( publishARProjs.proj_list[ arController.currentProjectIndex ].xml_urls ) && publishARProjs.proj_list[ arController.currentProjectIndex ].xml_urls[ 0 ]  )
									{	
										console.log('three.js: _debug : get _logic xml ' , arController.currentProjectIndex, publishARProjs.proj_list[ arController.currentProjectIndex ].xml_urls[ 0 ]  );
										let pXML = arController.parseLogicXML( arController.currentProjectIndex , 0 );

										pAll.push( pXML );
									}

									if ( Array.isArray(pAll) ){
										Promise.all( pAll ).then( function( ret ){
											console.log('three.js: _debug _loadMakarScene done: ret = ' , ret  );
											if ( Array.isArray( publishARProjs.proj_list[ arController.currentProjectIndex ].xml_urls ) && 
											publishARProjs.proj_list[ arController.currentProjectIndex ].xml_urls[ 0 ]  )
											{
												arController.logicList[ arController.currentProjectIndex ].parseXML();
											}

											arController.setupSceneBehav( sceneNo );
										});
									}

									obj2D.visible = true;

									obj.setAttribute('visible' , true ); //// 改為 aframe 之後，這樣設定比較穩
									obj.object3D.visible = true; //// 這個可能不夠
									obj.object3D.matrixAutoUpdate = true;
									obj.object3D.position.set( -60, 40, 250 );
									obj.object3D.rotation.x =  90 * Math.PI/180;
									// obj.rotation.z =  10 * Math.PI/180;
									obj.object3D.updateMatrix();
									obj.object3D.updateMatrixWorld();
								}
								

							}
						}
						
						console.log(" three.js: load publishARProjs proj_list =", window.publishARProjs.proj_list , userPublishProjs  );


						///// 先載入環景圖片後，再進行各個AR專案辨識圖載入
						let loader = new THREE.TextureLoader();
						loader.load(
						"https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg" ,
						function ( texture ) {

							// let targetCube = new THREE.WebGLRenderTargetCube(1024, 1024);
							let targetCube;
							if ( THREE.WebGLRenderTargetCube ){
								targetCube = new THREE.WebGLRenderTargetCube(1024, 1024);
							}else{
								targetCube = new THREE.WebGLCubeRenderTarget( 1024 );
							}

							let renderer = arController.GLRenderer;

							let cubeTex = targetCube.fromEquirectangularTexture(renderer, texture);
							arController.cubeTex = cubeTex;

							//////// add the objects(2D, 3D) from makar editor.
							for (let i in window.publishARProjs.proj_list ){

								//// 判斷「用戶是否允許」跟「專案是否允許」，只要其中之一通過即可
								// let proj_allow = false;
								// if ( window.allowedMakarIDUseWeb != true ){
								// 	for ( let j = 0; j < userPublishProjs.proj_list.length; j++ ){
								// 		if ( userPublishProjs.proj_list[j].proj_id == publishARProjs.proj_list[i].proj_id  ){
								// 			if ( userPublishProjs.proj_list[j].web_ar == false ){
								// 				console.log(" three.js: load publishARProjs proj_list( proj disable ) = ", publishARProjs.proj_list[i] );
								// 			} else {
								// 				console.log(" three.js: load publishARProjs proj_list( proj enable ) = ", publishARProjs.proj_list[i] );
								// 				proj_allow = true;
								// 			}
								// 			break;
								// 		}
								// 	}
								// }

								// if ( window.allowedMakarIDUseWeb == true || proj_allow == true ){
									
								// } else {
								// 	console.log(" three.js: load publishARProjs proj_list( user enable ) = ", publishARProjs.proj_list[i] );
								// 	continue;
								// }

								let gcssURL = window.publishARProjs.proj_list[i].target_gcss_url;
								//// load GCSS and Scene its work

								//// check the project type: coloring, scratch card, collection-point card. NOW ONLY FOR coloring, by proj_descr 
								let findColoring = window.publishARProjs.proj_list[i].proj_descr.indexOf("_coloring");
								if ( findColoring > 0  ){
									// console.log("three.js: there is '_coloring', projectID= ", i , window.sceneResult[i] );
									window.sceneResult[i].module = "coloring";
									
									if ( Array.isArray(window.sceneResult[i].data.module_type) ){
										window.sceneResult[i].data.module_type.push("coloring");
									}

								}

								if ( window.publishARProjs.proj_list[i].module_type ){
									//// 只有集點卡模組 有超過一個 辨識圖
									let getModule = window.publishARProjs.proj_list[i].module_type.find(function(item){
										let ret;
										if ( item == "point_card" || item == "quiz" ){
											ret = item
										}
										return ret;
									});

									if (getModule == "point_card"  || getModule == "quiz" ){
										for (let j = 0; j < window.publishARProjs.proj_list[i].targets_gcss_urls.length; j++ ){
											sceneTargetList[targetNo] = {projIndex: i , target_id: window.publishARProjs.proj_list[i].target_ids[j] };
											gcssURL = window.publishARProjs.proj_list[i].targets_gcss_urls[j];
											// console.log("three.js: _load: module_type(point_card), targetNo=", targetNo , window.publishARProjs.proj_list[i].target_ids , getModule );
											proxy.loadNFTMarker( gcssURL.substring(0, gcssURL.length-5), targetNo, targetsNumber , onloadNFTMarker );
											targetNo++;
										}
									}else{
										sceneTargetList[targetNo] = {projIndex: i , target_id: window.publishARProjs.proj_list[i].target_id };
										// console.log("three.js: _load: module_type(else), targetNo=", targetNo , window.publishARProjs.proj_list[i].target_ids , getModule );
										proxy.loadNFTMarker( gcssURL.substring(0, gcssURL.length-5), targetNo, targetsNumber , onloadNFTMarker );
										targetNo++;
									}
									
								}else{
									sceneTargetList[targetNo] = {projIndex: i , target_id: window.publishARProjs.proj_list[i].target_id };
									// console.log("three.js: _load: module_type(not_exist), targetNo=", targetNo , window.publishARProjs.proj_list[i].target_ids , getModule );
									proxy.loadNFTMarker( gcssURL.substring(0, gcssURL.length-5), targetNo, targetsNumber , onloadNFTMarker );
									targetNo++;
								}

							}

							
							console.log("three.js: _load: , sceneTargetList = ", sceneTargetList );

						});
					
					}
				});
				document.body.className = arController.orientation;


	//[start-20190315-fei0061-add]//
				// var CSS3DRenderer = new THREE.CSS3DRenderer({alpha:true});
				// CSS3DRenderer.domElement.id = 'CSS3DRenderer';
				// CSS3DRenderer.domElement.style.position = 'absolute';
				// // CSS3DRenderer.domElement.style.background = "rgba( 0, 0, 0, 1 )" ;
				// CSS3DRenderer.domElement.style.zIndex = 1 ; 
				// CSS3DRenderer.domElement.style.top = "0px";
				// CSS3DRenderer.domElement.style.left = "0px";
				// var container = document.getElementById( 'container' );
				// container.appendChild( CSS3DRenderer.domElement );
				////// container.insertBefore( CSS3DRenderer.domElement, container.childNodes[1] );
				////// document.body.appendChild( CSS3DRenderer.domElement );
	//[end---20190315-fei0061-add]//

				// let bottomProjs = document.getElementById("bottomProjs");
				// let projsInfo = document.getElementById("projsInfo");
				// let bottomArrow = document.getElementById("bottomArrow");

				if (arController.orientation === 'portrait') {  // most cell phone
					//// fei: because the arController(videoWidth, videoHeight) are equal to the device video(width height) so dont need to reverse
					
					////// width full
					// var w = window.innerWidth;
					// var h = (window.innerWidth/arController.videoWidth) * arController.videoHeight;

					////// height full
					// var w = (window.innerHeight/arController.videoHeight) * arController.videoWidth ;
					// var h = window.innerHeight;

					////// cut full
		
					let w , h;
					if ( window.innerWidth/window.innerHeight > arController.videoWidth/arController.videoHeight ){
						w = window.innerWidth ;
						h = (window.innerWidth/arController.videoWidth)*arController.videoHeight;
					}else{
						w = (window.innerHeight/arController.videoHeight) * arController.videoWidth ;
						h = window.innerHeight;
					}
		
					//// 20200514 fei: 我們將呈現畫面的 canvas 拉伸至上下滿板 左右等比例的拉寬 假如有被拉寬的話，則要往左平移來修正呈現位置。
					GLRenderer.setSize( w , h  );
					// GLRenderer.setViewport( 0 , 0 , innerWidth , innerHeight );
					console.log("3 three.js:portrait GLRenderer.setSize=", w , h  );


					//// 改版為 aframe 架構
					arfCanvas.style.left = ( innerWidth - w )/2 + "px" ;
					arfCanvas.style.top  = ( innerHeight - h )/2 + "px" ;


					// GLRenderer.domElement.style.paddingBottom = (w-h) + 'px';

				} else {
					// console.log("not portrait GLRenderer.setSize=", window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight)
					if (/Android|mobile|iPad|iPhone/i.test(navigator.userAgent)) {
						console.log("4 three.js:GLRenderer.setSize=", window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight)

						// GLRenderer.setSize(window.innerWidth, (window.innerWidth / arController.videoWidth) * arController.videoHeight);

						let w , h;
						if ( window.innerWidth/window.innerHeight > arController.videoWidth/arController.videoHeight ){
							w = window.innerWidth ;
							h = (window.innerWidth/arController.videoWidth)*arController.videoHeight;
						}else{
							w = (window.innerHeight/arController.videoHeight) * arController.videoWidth ;
							h = window.innerHeight;
						}

						GLRenderer.setSize( w , h  );
						//// 改版為 aframe 架構
						arfCanvas.style.left = ( innerWidth - w )/2 + "px" ;
						arfCanvas.style.top  = ( innerHeight - h )/2 + "px" ;


					} else {
						// console.log("portrait: PC: ", arController.videoWidth, arController.videoHeight);

						
						// GLRenderer.setSize(arController.videoWidth, arController.videoHeight);

						let w , h;
						if ( window.innerWidth/window.innerHeight > arController.videoWidth/arController.videoHeight ){
							w = window.innerWidth ;
							h = (window.innerWidth/arController.videoWidth)*arController.videoHeight;
						}else{
							w = (window.innerHeight/arController.videoHeight) * arController.videoWidth ;
							h = window.innerHeight;
						}

						GLRenderer.setSize( w , h  );
						//// 改版為 aframe 架構
						arfCanvas.style.left = ( innerWidth - w )/2 + "px" ;
						arfCanvas.style.top  = ( innerHeight - h )/2 + "px" ;

						document.body.className += ' desktop';
						// console.log("three.js: iwh , cwh = " , innerWidth, innerHeight, GLRenderer.getSize(), GLRenderer.domElement.width );
						console.log("5 three.js: landscape GLRenderer.setSize=", arController.videoWidth ,  arController.videoHeight   );

					}
				}

	//[start-20190318-fei0062-mod]//
	//////////////// add CSSRenderer click event, basicly we dont need GLRender event /////////////
				// CSS3DRenderer.domElement.addEventListener( 'click', endEvent, false );

				GLRenderer.domElement.addEventListener( 'touchend', endEvent, false ); //// depend the renderer.
				GLRenderer.domElement.addEventListener( 'mouseup', endEvent, false ); //// depend the renderer.

				////// for choose the makarObject for control
				GLRenderer.domElement.addEventListener( 'touchmove', moveEvent, false );
				GLRenderer.domElement.addEventListener( 'mousemove', moveEvent, false );

				GLRenderer.domElement.addEventListener( 'touchstart', startEvent, false );
				GLRenderer.domElement.addEventListener( 'mousedown', startEvent, false );


	//[end---20190318-fei0062-mod]//

	//[start-20190703-fei0069-add]//

				//////  set the temporary empty object, will replace it by the touchstart(cell phone)/mouseDown(PC)
				var objectControls = new THREE.ObjectControls( GLRenderer.domElement, new THREE.Object3D() );  
				objectControls.enableVerticalRotation();
				objectControls.setRotationSpeed( 0.1 ); // for PC 
				objectControls.setRotationSpeedTouchDevices( 0.05 ); // for cell phone
				// objectControls.setDistance( -1000, 1000); // set min - max distance for zoom
				// objectControls.setZoomSpeed( 2 ); // set zoom speed
				
				var setControlObject = function(event){
					if (arController.controlObject != null && arController.controlObject != 0 ){
						// console.log("setControlObject: arController.controlObject=", arController.controlObject );
						this.setObjectToMove( arController.controlObject );
						this.setCurrentControllObject( arController.currentControllObject )

					}else{
						this.setObjectToMove( null );
					}
				};
				objectControls.addEventListener( 'mouseDown' , setControlObject) ;
				objectControls.addEventListener( 'onTouchStart' , setControlObject) ;

				arController.objectControls = objectControls;
				
	//[end---20190703-fei0069-add]//

				var preMouse = new THREE.Vector2();
				var mouse = new THREE.Vector2();
				var raycaster = new THREE.Raycaster();
				function endEvent( event ) {
					// console.log("endEvent: event type=", event.type, "pageXY=", event.pageX, event.pageY, ", clientXY=", event.clientX , event.clientY );
					// console.log("endEvent: arScene.video=", arScene.video.videoWidth, arScene.video.videoHeight );
					if (arController.objectControlState == 2){
						return;
					}

					event.preventDefault();
					let rect = GLRenderer.domElement.getBoundingClientRect();
					switch ( event.type ) {
						case "mouseup":
							// console.log("mousedown: event  =", event  );
							mouse.x = ( (event.clientX - rect.left) / GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
							mouse.y = - ( (event.clientY - rect.top) / GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
							
							break;
						case "touchend":////// 20190709 Fei: add this event type for cellphone
							// console.log("endEvent: touchend: event.touches  = ", event.changedTouches[0].clientX, event.changedTouches[0].clientY );
							mouse.x = ( (event.changedTouches[0].clientX - rect.left) / GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
							mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
							break;
						default:
							console.log(" endEvent: event.type=", event.type, " not mouseup/touchend, return ");
							return ;
					}

					//// 紀錄此次點擊是否有「觸發事件」，不論是「2D」「3D」「點擊事件」「邏輯功能」
					let eventTriggered = {};

					//// 2d part 
					// raycaster.setFromCamera( mouse, arScene.videoCamera );
					
					raycaster.setFromCamera( mouse, arScene.camera2D );

					// let intersects2D = raycaster.intersectObjects(  Object.values( arController.threeNFTMarkers2D ), true ); 

					if ( arController.currentProjectIndex != null ){

						//// 邏輯上，同一時間只會顯示一個AR專案，固只要檢測其下物件即可
						let currentTargetObject2D = arController.threeNFTMarkers2D[ arController.currentProjectIndex ];
						let intersects2D = raycaster.intersectObject(  currentTargetObject2D , true );

						// console.log(" 0  currentTargetObject2D =", currentTargetObject2D, ", intersects2D=", intersects2D );
						if (intersects2D.length != 0 ){
							console.log(" intersects2D =", intersects2D );
							let touchIndex = 0;
							for (var i = 0; i < intersects2D.length; i++){
								if (intersects2D[i].object.defaultTexture ){
									touchIndex = i;
									// console.log("three.js: there are defaultTexture be touched, i=", i);
								}
							}
							let touchObject2D = arController.getMakarObject( intersects2D[touchIndex].object );
							console.log("three.js: endEvent: 2D intersects touchObject2D =",  touchObject2D );
							if (touchObject2D.behav){
								// console.log(" touchObject.behav =", touchObject2D.behav );

								let reset = false;
								for(let i = 0; i < touchObject2D.behav.length; i++ ){
									if (touchObject2D.behav[i].simple_behav == "CloseAndResetChildren"){
										reset = true;
									}
								}

								let projIndex = arController.sceneTargetList[ arController.currentProjectIndex ].projIndex ;
								arController.dealAllGroupHide( touchObject2D , projIndex );


								for ( let i = 0; i < touchObject2D.behav.length; i++ ){

									let gObj;
									if ( touchObject2D.behav[i].obj_id ){
										gObj = arController.getObjectTypeByObj_id( touchObject2D.behav[i].obj_id );
									}

									if (touchObject2D.behav[i].simple_behav == "ShowImage"){

										if ( gObj.obj_type == '2d' ){
											var tempBehav = Object.assign({}, touchObject2D.behav[i]);
											tempBehav.simple_behav = "ShowImage2D"; //// seperate from ShowImage
											arController.triggerEvent( tempBehav, touchObject2D, reset );
										}else if ( gObj.obj_type == '3d' ) {
											arController.triggerEvent( touchObject2D.behav[i] , touchObject2D, reset   );
										}

									}else if ( touchObject2D.behav[i].simple_behav == "ShowText" ) {

										// arController.triggerEvent( touchObject2D.behav[i], touchObject2D, reset );

										let tempBehav = Object.assign({}, touchObject2D.behav[i]);
										tempBehav.simple_behav = "ShowText2D"; //// seperate from ShowImage
		
										arController.triggerEvent( tempBehav, touchObject2D, reset );

										if ( gObj.obj_type == '2d' ){
											let tempBehav = Object.assign({}, touchObject2D.behav[i]);
											tempBehav.simple_behav = "ShowText2D"; //// seperate from ShowImage
											arController.triggerEvent( tempBehav, touchObject2D, reset );
										}else if ( gObj.obj_type == '3d' ){
											arController.triggerEvent( touchObject2D.behav[i] , touchObject2D , reset );
										}
									
									}else if ( touchObject2D.behav[i].simple_behav == "Coloring" ){

										arController.triggerEvent( touchObject2D.behav[i], touchObject2D, reset );

									}else {

										arController.triggerEvent( touchObject2D.behav[i], touchObject2D, reset );

									}

									// arController.triggerEvent( touchObject2D.behav[i], touchObject2D ); // 20190827: add the parameter obj( makarObject)
								}

								
							}

							if (touchObject2D.main_type == "button"){
								console.log("three.js: button click " , touchObject2D );
								arController.clickQuiz2DButton( touchObject2D );
							}

							return;
						}

						//// 3d model part
						// raycaster.setFromCamera( mouse, arScene.camera );
						raycaster.setFromCamera( mouse, arController.camera );


						// let intersects = raycaster.intersectObjects(  Object.values( arController.threeNFTMarkers ), true ); 

						let makarTHREEObjects = [];
						for ( let i = 0; i < arController.makarObjects.length; i++ ){
							let makarObject = arController.makarObjects[i];
							if ( makarObject.object3D ){
									makarTHREEObjects.push(makarObject.object3D );
							}
						}

						//// 邏輯上，同一時間只會顯示一個AR專案，固只要檢測其下物件即可
						// let intersects = raycaster.intersectObjects(  makarTHREEObjects , true ); 
						let currentTargetObject = arController.aframeNFTMarkers[ arController.currentProjectIndex ];
						let intersects = raycaster.intersectObject(  currentTargetObject.object3D , true ); 
					

						if (intersects.length != 0 ){
							// console.log("endEvent: intersects =", intersects );
							let touchObject = arController.getMakarObject( intersects[0].object );
							// console.log("three.js: endEvent: 3D intersects touchObject =", touchObject );

							//// 處理「邏輯功能的點擊事件」，設定上「邏輯功能」跟「點擊事件」是不會同時存在的。
							let intersectObject3D = touchObject.el ;
							console.log("three.js: _setupFunction: endEvent, intersectObject3D=", intersectObject3D.object3D ) ;
							if ( intersectObject3D ) {
								if(intersectObject3D.onclickBlock){	
									for(let i = 0; i < intersectObject3D.onclickBlock.length; i++){
										if(intersectObject3D.onclickBlockState[i]){
											intersectObject3D.onclickBlockState[i] = false;

											arController.logicList[ arController.currentProjectIndex ].parseBlock( intersectObject3D.onclickBlock[i], function(){
												intersectObject3D.onclickBlockState[i] = true;
											}) ; 

											//// 紀錄觸發到的事件
											eventTriggered['3d_logic'] = intersectObject3D.onclickBlock[i] ;

										}
									}
								}
							}


							/////  MAKAR 標準點擊觸發事件
							if (touchObject.behav){
								// console.log(" touchObject.behav =", touchObject.behav );


								//// 紀錄觸發到的事件
								eventTriggered['3d_behav'] = touchObject.behav ;

								let projIndex = arController.sceneTargetList[ arController.currentProjectIndex ].projIndex ;
								arController.dealAllGroupHide( touchObject , projIndex );

								//// deal the group	
								//// 找出此次觸發事件中含有 group 的部份
								// for (let i = 0; i < touchObject.behav.length; i++ ){
								// 	if (touchObject.behav[i].group){
								// 		//// 找出所有場上物件中，掛有觸發事件的物件
								// 		for ( let j = 0; j < arController.makarObjects.length; j++ ){

								// 			let makarObject = arController.makarObjects[j];
								// 			if (makarObject.object3D){
								// 				if (makarObject.object3D.makarObject && makarObject.object3D.behav ){

								// 					for (let k = 0; k < makarObject.object3D.behav.length; k++ ){
								// 						//// 找出除了自己以外掛有相同 group 的物件
								// 						if (makarObject.object3D.behav[k].group == touchObject.behav[i].group &&  makarObject.object3D != touchObject ){
								// 							// console.log(" ************* " , i , j , k , makarObject.object3D.behav[k] , touchObject.behav[i].group );
								// 							let groupObj = document.getElementById(makarObject.object3D.behav[k].obj_id);
								// 							if ( groupObj ){
								// 								arController.hideAframeGroupObjectEvent(groupObj);
								// 							}
								// 						}
								// 					}

								// 				}
								// 			}


								// 		}
								// 	}
								// }

								let reset = false;
								for(let i = 0; i < touchObject.behav.length; i++ ){
									if (touchObject.behav[i].simple_behav == "CloseAndResetChildren"){
										reset = true;
									}
								}

								for (let i=0; i < touchObject.behav.length; i++ ){
									if (touchObject.behav[i].simple_behav != "CloseAndResetChildren" ){


										// arController.triggerEvent( touchObject.behav[i], touchObject , reset ); // 20190827: add the parameter obj( makarObject)

										let gObj;
										if ( touchObject.behav[i].obj_id ){
											gObj = arController.getObjectTypeByObj_id( touchObject.behav[i].obj_id );
										} 

										if (touchObject.behav[i].simple_behav == "ShowImage"){
											
											if ( gObj.obj_type == '2d' ){
												let tempBehav = Object.assign({}, touchObject.behav[i]);
												tempBehav.simple_behav = "ShowImage2D"; //// seperate from ShowImage
												arController.triggerEvent( tempBehav, touchObject , reset );
											}else if ( gObj.obj_type == '3d' ){
												arController.triggerEvent( touchObject.behav[i], touchObject , reset );
											}
											
										}else if ( touchObject.behav[i].simple_behav == "ShowText" ){

											if ( gObj.obj_type == '2d' ){
												let tempBehav = Object.assign({}, touchObject.behav[i]);
												tempBehav.simple_behav = "ShowText2D"; //// seperate from ShowText
												arController.triggerEvent( tempBehav, touchObject , reset );
											}else if ( gObj.obj_type == '3d' ){
												arController.triggerEvent( touchObject.behav[i], touchObject , reset );
											}
											
										}else{
											
											arController.triggerEvent( touchObject.behav[i], touchObject , reset );

										}

									}
								}
								// arController.triggerEvent( touchObject.behav[0], touchObject ); // 20190827: add the parameter obj( makarObject)

								// return;
							}
							console.log("three.js: touchObject" , touchObject );
							if (touchObject.main_type == "button"){
								console.log("three.js: button click " , touchObject );
								arController.pushButton( touchObject );
							}
						}
					}

					if ( Object.keys( eventTriggered ).length == 0 ){
						console.log(' _entEvent: not touch anything ');

						if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
							typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
						){
							if ( parent.projectUIController.status == 1){
								//// 假如當前狀態是「顯示」，判斷是否超過一定時間，超過的話延續，還未到的話執行「隱藏」
								if ( parent.projectUIController.g_tl_show._time > 3 ){
									parent.projectUIController.showUI();
								}else{
									parent.projectUIController.hideUI();
								}
							}else if ( parent.projectUIController.status == 0 ) {
								parent.projectUIController.showUI();
							}else{
								parent.projectUIController.showUI();
							}
						}

					}else{
						console.log(' _entEvent:  touch somethong ', eventTriggered );
					}

				}
	//[start-20190709-fei0069-add]//
				function startEvent(event){
					// console.log(" three.js: moveEvent: event type=", event.type );
					arController.objectControlState = 1;
					event.preventDefault();
					let rect = GLRenderer.domElement.getBoundingClientRect();
					switch ( event.type ) {
						case "mousedown": ////// 20190709 Fei: add this event type for PC mouse
							// console.log("mousedown: event  =", event  );
							preMouse.x = event.clientX ;
							preMouse.y = event.clientY ;

							mouse.x = ( (event.clientX - rect.left) / GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
							mouse.y = - ( (event.clientY - rect.top) / GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
							break;
						case "touchstart": ////// 20190709 Fei: add this event type for cellphone
							// console.log("endEvent: touchend: event.touches  = ", event.changedTouches[0].clientX, event.changedTouches[0].clientY );
							preMouse.x = event.changedTouches[0].clientX;
							preMouse.y = event.changedTouches[0].clientY;
							
							mouse.x = ( (event.changedTouches[0].clientX - rect.left) / GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
							mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
							break;

						default:
							console.log(" startEvent: event.type=", event.type, " not mousedown/touchstart, return ");
							return ;

					}
					//// 3d model part
					// raycaster.setFromCamera( mouse, arScene.camera );
					raycaster.setFromCamera( mouse, arController.camera );

					// let makarTHREEObjects = [];
					// for ( let i = 0; i < arController.makarObjects.length; i++ ){
					// 	let makarObject = arController.makarObjects[i];
					// 	if ( makarObject.object3D ){
					// 			makarTHREEObjects.push(makarObject.object3D );
					// 	}
					// }

					// let intersects = raycaster.intersectObjects(  Object.values( arController.threeNFTMarkers ), true ); 
					// let intersects = raycaster.intersectObjects(  makarTHREEObjects , true ); 

					if ( arController.currentProjectIndex != null ){

						let currentTargetObject = arController.aframeNFTMarkers[ arController.currentProjectIndex ];
						
						// let intersects = raycaster.intersectObject(  currentTargetObject.object3D , true ); 
						let intersects = raycaster.intersectObjects( [ currentTargetObject.object3D ]  , true ); 

						console.log(' _startEvent: ' , raycaster , arController.camera , currentTargetObject.object3D );


						if (intersects.length != 0 ){
							console.log("startEvent: intersects =", intersects );
							let touchObject = arController.getMakarObject( intersects[0].object );
							// console.log("startEvent: touchObject =", touchObject );

							//// 點擊起始，要因應物件掛載的「 FingerGesture 」事件，是否為「active」來決定是否要將此物件加入「手指操控」
							//// 版本控制上，  3.3.0 版之前物件可能完全沒帶有事件，所以無條件啟動「手指操控」。
							if ( touchObject.behav ){
								let gotFingerGesture = false; //// 紀錄是否物件有找到「手指操控事件」，舊版本編輯器出的物件不會有
								let fingerActive = true; //// 紀錄「手指操控事件」的狀態

								if ( touchObject.behav ){
									touchObject.behav.forEach( e => {
										if ( e.simple_behav == 'FingerGesture' ){
											gotFingerGesture = true;
											if ( e.active == true ){
												fingerActive = true;
											}else{
												fingerActive = false;
											}
										}
									});
								}

								//// 先判斷是否物件有「手指操控事件」，有的話再判斷「是否可以操控」。假如物件沒有「手指操控事件」，無條件視為「可以操控」
								if ( gotFingerGesture == true ){
									if ( fingerActive == true){
										arController.controlObject = touchObject;
										arController.currentControllObject = touchObject;
									}else{
										arController.controlObject = null;
									}
								}else{
									arController.controlObject = touchObject;
									arController.currentControllObject = touchObject;
								}

								
							} else {
								//// 假如物件沒有帶有任何「事件」，預設物件為「可控制」，因為舊版本如此。
								arController.controlObject = touchObject;
								arController.currentControllObject = touchObject;
							}
						}else{
							console.log("2 startEvent: intersects =", intersects );
							arController.controlObject = null;
						}


					}
					

					////// collapse the project table
					// bottomProjs.className =  'collapsed' ;
					// projsInfo.className =  'collapsed' ;
					// bottomArrow.className =  'collapsed' ;
					// snapShotCamera.className = 'collapsed';

				}

				function moveEvent(event){
					switch ( event.type ) {
						case "mousemove":
							if ( arController.objectControlState == 1 ){
								if ( Math.abs(preMouse.x - event.clientX ) > 2 || Math.abs( preMouse.y - event.clientY  ) > 2 ){
									// console.log("moveEvent: event type=", event.type, arController.objectControlState, ", diffMouseXY=", preMouse.x - event.clientX  , preMouse.y - event.clientY );
									arController.objectControlState = 2;
								}
							}
							break;
						case "touchmove":////// 20190709 Fei: add this event type for cellphone
							if ( Math.abs(preMouse.x - event.changedTouches[0].clientX) > 2 || Math.abs( preMouse.y - event.changedTouches[0].clientY )>2 ){
								// console.log("moveEvent: event type=", event.type, ", diffMouseXY=", preMouse.x - event.changedTouches[0].clientX, preMouse.y - event.changedTouches[0].clientY );
								arController.objectControlState = 2;
							}
							break;
						default:
							console.log(" startEvent: event.type=", event.type, " not mousemove/touchmove, return ");
							return ;
					}
				}

				
	//[end---20190709-fei0069-add]//


				var tick = function() {
					let tstart = new Date().getTime();

					if ( arController.enableTracking == true ){
						proxy.process(arScene.video);
					}

					//// check if the model (visible) have animation, update it.
					var dt = arController.clock.getDelta();

					for (let i = 0; i < arController.makarObjects.length; i++ ){
						if ( arController.makarObjects[i].playAnimation == true &&  arController.makarObjects[i].visible == true ){
							// for (let j = 0; j < arController.makarObjects[i].children.length; j++ ){
							// 	if (arController.makarObjects[i].children[j].type == "Scene" ){
							// 		arController.checkAimation( arController.makarObjects[i].children[j] , dt);
							// 	}
								
							// }
							arController.checkAimation( arController.makarObjects[i].children[0] , dt);
						}
					}

					// arScene.renderOn(GLRenderer, CSS3DRenderer);
					arScene.renderOn(GLRenderer, null);


					let tend = new Date().getTime(); // small to millisecond
					let td = 30;
					if ( (tend-tstart) < 30 ) td = 30 - (tend - tstart)+1;
					else td = 1;
					setTimeout(tick, td  ); // surprisingly, use this will make the "hanging" on iphone disappear. I think the reason is frameRate.  

					// requestAnimationFrame(tick); // dont use it, because of the haning problem

				};

			}});
				
		});

		delete window.ARThreeOnLoad;

	};

	
	function tick_ARThreeOnLoad() {
		// if (window.ARController && ARController.getUserMediaThreeScene ) {
		if (window.ARController && ARController.getUserMediaThreeScene && window.ARThreeOnLoad ) {
			if (typeof sceneResult !== 'undefined') { //// general start AR by Start button
				console.log("three.js: the sceneResult is exist, do _ARThreeOnLoad user_id=", sceneResult.user_id );
				window.ARThreeOnLoad();

				////// 假如判定為『不可使用web服務』的帳號，多判斷該作者底下專案是否帶有 license，假如有license 且沒有過期，則顯示於專案列表。
				if (window.allowedMakarIDUseWeb == false){

					//// 20201029 取消此判斷，保留架構，待後續使用。基本上流程不會進來這裡

					// checkLicenseInProjs( window.serverUrl , function(licenseInfos){
					// 	console.log("three.js: _tick_ARThreeOnLoad: licenseInfos=", licenseInfos );
					// 	//// 將是否帶有『有效憑證』的資訊放入 userPublishProjs 內各專案裡面。
					// 	for (let j = 0, len = userPublishProjs.proj_list.length; j < len; j++ ){
					// 		for (let k = 0, len = licenseInfos.length; k < len; k++){
					// 			if (userPublishProjs.proj_list[j].proj_id == licenseInfos[k].proj_id ){
					// 				userPublishProjs.proj_list[j].isLicense = licenseInfos[k].isLicense;
					// 			}
					// 		}
					// 	}
					// 	arUI.setProjectTable();
					//  });

					// arUI.setProjectTable();
				}else{
					// arUI.setProjectTable();
				}

			}else{
				///// start AR by exchange button( GLScene ) or the fixedID customized project.
			
				// console.log("three.js: the sceneResult isnt exist, do _getARSceneByUserID then call _tick_ARThreeOnLoad again, LSmakarID=", LSmakarID );
				if ( window.serverUrl &&  window.makarID ){
					getARSceneByUserID( window.serverUrl, window.makarID, function(sceneData){

						console.log(' _getARSceneByUserID_: ' , sceneData  );

						// if ( sceneData.name){
						// 	str = sceneData.name ; 
						// }

						if (typeof(sceneData) == "string"){ // error occur
							
							let str = '';

							str = sceneData;
							if (document.getElementById("freeUserWarnDiv")){
								document.getElementById("freeUserWarnDiv").style.display = "block";
								document.getElementById("pUserInfo").innerHTML =  str  ;
								// document.getElementById("pUserInfo").style.color = "red";
								leaveIframe.onclick = function(event){
									event.preventDefault();
									if (parent.aUI){
										// parent.aUI.closeCoreIframe();
									}

								}
							}

						}else{ // general state.
							if (document.getElementById("freeUserWarnDiv")){
								document.getElementById("freeUserWarnDiv").style.display = "none";
							}

							//// d
							// if (window.allowedMakarIDUseWeb == false ){
							// 	let gotAllowWebAR = false;
							// 	for ( let j = 0; j < userPublishProjs.proj_list.length; j++ ){
							// 		if ( userPublishProjs.proj_list[j].web_ar == true ){
							// 			gotAllowWebAR = true;
							// 		}
							// 	}
							// 	if ( gotAllowWebAR == false ){

							// 		if (document.getElementById("freeUserWarnDiv")){
							// 			document.getElementById("freeUserWarnDiv").style.display = "block";
							// 			document.getElementById("pUserInfo").innerHTML =  str  ;
							// 			document.getElementById("pUserInfo").style.color = "red";
							// 			leaveIframe.onclick = function(event){
							// 				event.preventDefault();
							// 				if (parent.aUI){
							// 					parent.aUI.closeCoreIframe();
							// 				}
		
							// 			}
							// 		}

							// 	}
							// }

							tick_ARThreeOnLoad(); // redo this process with sceneResult, will trigger the first part.
						}
					});
				}else{
					console.log("three.js: fail, the makarID=", winodw.makarID , ", serverURL=", serverUrl );
				}
				
			}

		}
		else {
			console.log("three.js: _tick_ARThreeOnLoad: tick again, absence ARC && gMT && ART" );
			setTimeout(tick_ARThreeOnLoad, 500);
		}
	};

//[end---20190219-fei0055-add]//



//[start-20190723-fei0070-add]//
	//// check the mifly host, the url is fixed in cpp( safe ), will compare the location.hostname and the whiteList.  
	//// if you dont want to check white list, remove the _startARProcess() , directly call tick_ARThreeOnLoad.
	var startARProcess = function() {
		if ( typeof(checkHost) != "undefined" ){
			if ( checkHost == "yet" ){
				// console.log("1 three.js: checkHost = yet");
				setTimeout(startARProcess, 50);
			}else{
				if ( checkHost == "correct" ){

					tick_ARThreeOnLoad(); 

				} else if ( checkHost == "fail" ){

					//// remove all childrens of documnet
					while (document.body.firstChild) {
						document.body.removeChild(document.body.firstChild);
					}
					//// add the warning about Host 
					var divHostWarn = document.createElement('div');
					divHostWarn.innerHTML = "<br>The host of webAR seems unauthorized,<br> please contact MIFLY ";
					divHostWarn.style.fontSize = "18px"; 
					divHostWarn.style.margin = "5px";
					divHostWarn.style.fontWeight = "700";
					document.body.append( divHostWarn );
					
				}
			}
		} else {
			console.log("three.js: checkHost = undefined, something ERROR.");
			// setTimeout(startARProcess, 50);
		}
	};
	window.startARProcess = startARProcess;

//[end---20190723-fei0070-add]//


//[start-20181128-fei0038-add]//
	var scope;
	if (typeof window !== 'undefined') {
		scope = window;
		// console.log("artk.three.js: scope = window ", window);
	} else {
		scope = self;
		// console.log("artk.three.js: scope = self ", self);
	}

	var integrateTick = function() {
		// console.log("artk.three.js: integrateTick, scope=", scope );
		if (scope.ARController && scope.THREE) {

			// console.log("artk.three.js: call integrate");
			integrate();

			window.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					// Cancel the default action, if needed
					event.preventDefault();
					// Trigger the button element with a click
					console.log("enter keyup");
					// getScenes();
				}
			});

		} else {
			setTimeout(integrateTick, 50);
		}
	};
//[end---20181128-fei0038-add]//

	if (typeof window !== 'undefined') {
		integrateTick();
	}

	//// 輸出文字改為由網址的頁面判斷
	let languageType;
	if (parent){
		let indexOfFirst = parent.location.pathname.indexOf('/', 0);
		let indexOfSecond = parent.location.pathname.indexOf('/', indexOfFirst + 1);
		languageType = window.languageType = parent.location.pathname.substring(1, indexOfSecond);
	}

	languageType = 'tw';

	// let languageType;
	// if (navigator.languages[0].includes("zh")) {
	// 	// Chinese
	// 	languageType = window.languageType = "tw";
	// } else {
	// 	// English
	//     languageType = window.languageType = "en";
	// }


	let worldContent = window.worldContent= {
		inputSearch: {tw: "搜尋", en: "Search"},
		labelSelected: {tw: "精選", en: "Selected"},

		userAlreadyPlayed:{tw:"此登入用戶已經遊玩過", en:"This user already played"},
		userNotLoginInfo:{tw:"必須要登入MAKAR後才可遊玩", en:"Please login at first"},
		clickToPlay:{tw:"點擊開始遊玩", en:"Click to play"},

		targetNumberError:{tw:"辨識圖的數量不可超過20 ", en:"the max number of image targets can't larger than 20 " },
		backToHome:{tw:"專案標題", en:"back"},
		GPSDistanceMsg:{tw:"需在GPS的範圍內才能開啟 \r\n 距離：", en:"please to the right place"},
		GPSErrorMsg:{tw:"GPS 錯誤", en:"GPS error"},
		GPSnotSupportMsg:{tw:"沒有支援 GPS ", en:"GPS not support"},
		comfirm:{tw:"確認", en:"comfire"},

		timeIsUp:{ tw:"時間到" , en: "Time is up" }
		
	};
  
	// if(languageType == "en"){
	// 	let rs = leftTopButton.children[0].innerHTML.replace("專案標題" , worldContent.backToHome[languageType] );
	// 	leftTopButton.children[0].innerHTML = rs;
	// }

})();
