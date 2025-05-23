
import { isPromise } from './utility.js';
// import MixController from './MixController.js';
import { verionControl as VC } from "./MakarWebXRVersionControl.js";

import net from './networkAgent.js';
import CanvasEvent from './CanvasEvent.js';


//// AR
import ARWrapper from './ARWrapper.js'

//// VR

// import VRController from './VRController.js'

// //// XR
// import XRController from './XRController.js'


(function(){



    //// 啟動 AR 專案的入口
    let startARProcess = function( oneProjData ) {
		
		let checkHost = 'correct';

		if ( typeof(checkHost) != "undefined" ){
			if ( checkHost == "yet" ){
				setTimeout( function(){
					startARProcess( oneProjData )
				} , 50);
			}else{
				if ( checkHost == "correct" ){

					// tick_ARThreeOnLoad (); 
					startInitProjAndScene( oneProjData );

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
    

	function startInitProjAndScene( oneProjData ) {

		//// v3.5.0.0 改版， 基本上只要透過「一個專案 id 」拿取「一個專案的場景列表」
		//// 使用者上傳素材
		//// 使用者線上素材
		//// 使用者辨識圖列表

		if ( parent && parent.selectedProject && typeof( parent.selectedProject.proj_id ) == 'string' && 
		     typeof( parent.selectedProject.user_id ) == 'string'
		){
			//// 使用者 ID
			let user_id = parent.selectedProject.user_id;

			//// 專案 ID
			let project_ids = [
				parent.selectedProject.proj_id
			]

			//// 暫用的「 資料物件 」，預期會帶有 「當前專案」「當前場景列表」「使用者素材」「使用者線上塑」「使用者辨識圖素材」 。未來預計新增「使用者材質庫素材」
			let makarUserData = {};
			window.makarUserData = makarUserData;

			makarUserData.oneProjData = oneProjData;

			//// 所有 net 相關 Promise 列表
			let pScenesAll = [];

			//// 先進行版本控制
			let vo = VC.getProjDataEditorVer( oneProjData );
			if ( vo.v0 == 3 && vo.v1 >= 5  ){

				//// 專案可能帶有「辨識圖資料」，是的話也要取得
				if ( oneProjData && Array.isArray( oneProjData.target_ids )  ){
					let pTargets = net.getTargetList( oneProjData.target_ids );
					pScenesAll.push( pTargets );

					pTargets.then( function(ret){
						// console.log(' _pTargets_: ' , ret );
						if ( ret.data && Array.isArray( ret.data.targetList ) ){
							makarUserData.targetList = ret.data.targetList;
						}
					});
				}

				let pScenes = net.getProjectSceneList( project_ids );
				let pUOR = net.getUserOnlineResources( user_id );
				let pUR = net.getUserResources( user_id );
				let pUM = net.GetUserMaterials( user_id );

				pScenesAll.push( pScenes );
				pScenesAll.push( pUOR );
				pScenesAll.push( pUR );
				pScenesAll.push( pUM );

				pScenes.then( function(ret){
					console.log(' _pScenes_: ' , ret );
					if ( ret.data && Array.isArray( ret.data.projectSceneList ) && ret.data.projectSceneList.length == 1 ){
						makarUserData.scenesData = ret.data.projectSceneList[0];
					}
				});
				pUOR.then( function(ret){
					// console.log(' _pUOR_: ' , ret );
					if ( ret.data && Array.isArray( ret.data.onlineResourcesList ) ){
						let onlineResourcesList = ret.data.onlineResourcesList;

						makarUserData.onlineResourcesList = onlineResourcesList;

						//// 為了方便使用，將「使用者線上素材列表」轉換為「素材字典」
						/*
							userProjResDict={
								res_id: {}
							}

						*/
						
						let userOnlineResDict = {};
						for (let i = 0; i < onlineResourcesList.length; i++ ){
							userOnlineResDict[ onlineResourcesList[i].res_id ] = onlineResourcesList[i];
						}
						makarUserData.userOnlineResDict = userOnlineResDict;

					}
				});
				pUR.then( function(ret){
					// console.log(' _pUR_: ' , ret );
					if ( ret.data && Array.isArray( ret.data.resourcesList ) ){
						let resourcesList = ret.data.resourcesList;
						makarUserData.resourcesList = resourcesList;

						//// 為了方便使用，將「素材列表」轉換為「素材字典」
						/*
							userProjResDict={
								res_id: {}
							}

						*/
						let userProjResDict = {};
						for (let i = 0; i < resourcesList.length; i++ ){
							userProjResDict[ resourcesList[i].res_id ] = resourcesList[i];
						}
						makarUserData.userProjResDict = userProjResDict;


					}
				});

				//// 使用者材質球
                pUM.then( function(ret){
					console.log(' _pUM_: ' , ret );
					if ( ret.data && Array.isArray( ret.data.materials ) ){
						let materials = ret.data.materials;
						makarUserData.materials = materials;

                        let userMaterialDict = {};
						for (let i = 0; i < materials.length; i++ ){
							userMaterialDict[ materials[i].id ] = materials[i];
						}
						makarUserData.userMaterialDict = userMaterialDict;

					}
				});

				//// 必要雲端資料完成之後，開始建制場景。
				//// 先判斷「是否有AR場景」，是的話往下載入對應 scripts
				Promise.all( pScenesAll ).then( function( ret ){
					// console.log(' _pScenesAll_ ' , ret );

					window.startSceneController();

				})


			}else{
				console.warn(' _startInitProjAndScene_: VC error ', oneProjData );
			}

			

		}
				

    };
	
	

	//// v3.5.0 重整一下 「複合型 專案」的不同類型場景載入流程
	//// 邏輯上，同一套流程要可以處理「 AR 」「 VR 」「 XR 」 專案
	/*
		0. 判斷 專案 底下的場景類型
		1. 啟動 Aframe / THREE 基底功能
		2. 創建「 場景管理器 / SceneController 」 來控制切換場景要作的項目
		3. 依照「所有場景」，建立「 場景母體物件 scene_root  」 用來載入「場景物件」
		4. 創建各類型控制器 「 arController / vrController / xrController 」- 或是統一管理？
		5. 


	*/

	window.startSceneController = function(){

		console.log(' _startSceneController_  start');
		
		//// 複合場景控制器，原則上為最大層容器，包含「 AR/VR/XR 控制器 」「 場景事件控制器 」 等等
		//// 當要「切換場景類型」時候，統一由此控制。

		// let mixController = new MixController();
		// window.mixController = mixController;

		//// 1. 啟動 Aframe / THREE 基底功能
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

			// 創建一個camera for 陀螺儀
			let cameraForGyro = document.createElement("a-entity");
			cameraForGyro.setAttribute('id', 'cameraForGyro');
			cameraForGyro.setAttribute('crossorigin', 'anonymous');
			cameraForGyro.setAttribute('camera', {active: false} );
			cameraForGyro.setAttribute('look-controls', { enabled: true , touchEnabled: false } ); 

			arfScene.appendChild( cameraForGyro );

			//// assets 也共用
			let assets = document.createElement("a-assets");
            assets.setAttribute('id', "makarAssets" );
            assets.setAttribute('timeout', "1000" );
            assets.setAttribute('crossorigin', 'anonymous');
			arfScene.appendChild(assets);
			
			
			if (arfScene.hasLoaded) {
				aframeResolve();
			} else {
				arfScene.addEventListener('loaded', function(){
					aframeResolve();
				});
			}
		});

		//// 2. 創建「 場景管理器 / SceneController 」 來控制切換場景要作的項目
		aframeP.then( function(){

			//// 共用的部份
			/*
			
				1. canvas 點擊功能
				2. 場景切換前置功能
			
			*/

			let arfScene = document.getElementById('arfScene');


			//// 分別檢查 是否帶有「 AR 」「 VR 」「 XR 」場景
			let makarUserData = window.makarUserData;

			let isARScenes = VC.checkSceneIncludeAR( makarUserData.scenesData );
			// let isVRScenes = VC.checkSceneIncludeVR( makarUserData.scenesData );
			// let isXRScenes = VC.checkSceneIncludeXR( makarUserData.scenesData );

			//// AR專案，基本上只有 AR 場景
			
			let pControllerLoaded = [];

			if ( isARScenes ){

				let pAR = new Promise( function( arCResolve ){
					console.log(' _startInitProjAndScene_ with AR: load scripts ' );

					// let arScript = document.createElement('script');
					// arScript.setAttribute('src' , '../lib/makarWebAR.min.js' )
					// document.body.appendChild( arScript );

					// let proxyScript = document.createElement('script');
					// proxyScript.setAttribute('src' , '../js/artoolkit.proxy.js' )
					// document.body.appendChild( proxyScript );

					//// 等待 AR 功能完成之後，再進行
					let tID = setInterval( function(){

						if ( window.ARController ) {
							clearInterval( tID );
							console.log(' _startInitProjAndScene_ with AR: ARController load done' );

							//// 傳入 「專案資訊」 「場景資訊」
							let arWrapper = new ARWrapper( makarUserData );
							
							window.arWrapper = arWrapper;

							window.postMessage( JSON.stringify({user: "ARFunc", type: 'arWrapperDone', data: {}}) , location.origin );

							arCResolve( arWrapper );

						}else{
							console.log(' _startInitProjAndScene_ with AR: ARController load not done' );
						}

					}, 500 );

				});
				pControllerLoaded.push( pAR )

			}


			//// 各「類型場景控制器」載入完成，判斷起始場景，啟動
			//// 
			Promise.all( pControllerLoaded ).then( function( controllersRet ){

				console.log(' _pControllerLoaded_ ', controllersRet );

				//// 每個類別 啟動一次即可
				let gotAR = false;
				
				let arWrapper;

				let pTypeAll = [];
				
				// //// 等到所有「控制器載入完成」，建構 「畫面點擊控制器」，後續陸續掛載各個類型場景控制器
				let canvasEvent = new CanvasEvent( arfScene.renderer );
				
				// mixController.canvasEvent = canvasEvent;

				for( let i = 0; i < controllersRet.length; i++ ){
					let controller = controllersRet[ i ];
					if ( gotAR == false && controller.type == 'ARWrapper' ){

						gotAR = true;

						arWrapper = controller;

						//// 掛載 AR 控制器到「點擊系統」
						canvasEvent.includeAR( arWrapper );

						let pInitAR = arWrapper.initARProcess();
	
						pTypeAll.push( pInitAR );

					}
					
				}

				
				//// 等到「所有控制器載入完成」，啟動「第一個場景的控制器」
				Promise.all( pTypeAll ).then( function( ret ){


					let scenes = VC.getScenes( makarUserData.scenesData );

					if ( scenes[0] ){
						let firstScene = scenes[0];
						if ( firstScene.info.type == 'ar' ){

							//// 初始場景為 AR ，將「場景控制系統」設定
							//// 會同時設定「點擊系統」
							// mixController.setActiveType('AR');

							canvasEvent.setControllerType('AR');

							arWrapper.arController.enableARRendering = true;
							arWrapper.startAR();

						} 
						

					}

				});
				
				


			})
			

		});


		delete window.startSceneController;
	}




})()

