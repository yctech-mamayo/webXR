import { makeid, checkHost_tick } from "./vrUtility.js";
import { handleFusingEvent, handleClickEvent } from "./handleAframeEvent.js"
import VRController from './VRController.js';

import StepController from './StepController.js';
 
import net from './networkAgent.js';

// import "./Quiz.js";

// import { OrbitControls } from '../../../lib/three/addons/controls/OrbitControls.js';

// import { CSS2DRenderer, CSS2DObject } from '../../../lib/three/addons/renderers/CSS2DRenderer.js';

(function(){

    const integrate = () => {

		AFRAME.registerComponent('initvrscene', {
			init: function () {
				var sceneEl = this.el;
			}
		});
	
        AFRAME.registerComponent('cursor-listener', {
			init: function () {
				//20191023-start-thonsha-mod

				// this.el.addEventListener( 'touchend', endEvent, false );
				// this.el.addEventListener( 'mouseup', endEvent, false );
				// this.el.addEventListener( 'click', clickEvent, false );
				// this.el.addEventListener( 'fusing', fusingEvent, false );

				function fusingEvent(event){
					event.preventDefault();
                    handleFusingEvent( event )
				}	

				function clickEvent( event ) {
					event.preventDefault();
                    handleClickEvent( event ) 
				}				
				//20191023-end-thonsha-mod
			}
		});

        //[start-20191111-fei0079-add]//
        // checkHost_tick();
        // Module.checkMifly();
        //[end---20191111-fei0079-add]//
    
        window.showVRProjList = function( oneProjData ){

            console.log('VRFunc_cust.js: version: 2022-07-28 1650 ');

            // if ( parent && parent.selectedProject && typeof( parent.selectedProject.proj_id ) == 'string' && typeof( parent.selectedProject.user_id ) == 'string'
            if ( oneProjData && typeof( oneProjData.user_id ) == 'string' && typeof( oneProjData.proj_id ) == 'string'
            ){
                //// 使用者 ID
                // let user_id = parent.selectedProject.user_id;
                let user_id = oneProjData.user_id

                //// 專案 ID
                let project_ids = [
                    // parent.selectedProject.proj_id
                    oneProjData.proj_id
                ]
                
                //// for_makarSDK : 若有 makarSDK 則檢查 proj_id
                //// 先認定SDK是 webXR 經過小幅度修改並打包的產物
                if(window.makarSDK){
                    let makarSDK_proj_id = window.makarSDK.config.proj_id
                    let makarSDK_user_id = window.makarSDK.config.user_id

                    //// 對 proj_id 做必要的檢查
                    if ( window.makarSDK && window.makarSDK.config.proj_id && typeof( makarSDK_proj_id ) == 'string' && typeof( makarSDK_user_id ) == 'string'
                    ){
                        if( makarSDK_proj_id != oneProjData.proj_id ) {
                            console.error("MakarSDK is initiated, but config is conflict with oneProjData. makarSDK.config=", makarSDK.config)
                            return;
                        }

                        //// 目前不允許SDK取得 好友/私人 專案 (permission為3 or 4)
                        if(makarSDK_user_id){
                            //// 因此 user_id 現在並非必要 (以後若架構或api有修改時再增加判斷)  
                            if( makarSDK_user_id != oneProjData.user_id ) {
                                //// 留一個log作為提醒
                                console.warn("MakarSDK is initiated, but config is conflict with oneProjData. Using oneProjData instead of makarSDK.config.")
                            }
                        }
                        
                        //// 上述都通過表示 "正在使用makarSDK"
                        project_ids = [
                            makarSDK_proj_id
                        ]
                        user_id = makarSDK_user_id
                        
                    } else {
                        console.error("MakarSDK is initiated, but lack of config.", MakarSDK.config)
                        return ;
                    }
                }
                
                //// 暫用的「 資料物件 」，預期會帶有 「當前專案」「當前場景列表」「使用者素材」「使用者線上塑」「使用者辨識圖素材」 。未來預計新增「使用者材質庫素材」
                let makarUserData = {};
                window.makarUserData = makarUserData;

                makarUserData.oneProjData = oneProjData;

                //// 所有 net 相關 Promise 列表
                let pScenesAll = [];

                let pScenes = net.getProjectSceneList( project_ids );
				let pUOR = net.getUserOnlineResources( user_id );
				let pUR = net.getUserResources( user_id );
                let pUM = net.GetUserMaterials( user_id );

                // let pUM = net.GetUserMaterialsbyID( user_id,  makarUserData.scenesData.scenes[0].material_ids);

				pScenesAll.push( pScenes );
				pScenesAll.push( pUOR );
                pScenesAll.push( pUR );
                pScenesAll.push( pUM );

                //// 場景相關資料
                pScenes.then( function(ret){
					console.log(' _pScenes_: ' , ret );
					if ( ret.data && Array.isArray( ret.data.projectSceneList ) && ret.data.projectSceneList.length == 1 ){
						makarUserData.scenesData = ret.data.projectSceneList[0];
					}
				});
                
                //// 使用者線上素材
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

                //// 使用者上傳素材
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

                Promise.all( pScenesAll ).then( function( ret ){
					console.log(' _pScenesAll_ ' , ret );

                    //// 看到AR有delete的寫法，VR這裡也加上 ()
                    window.showVRProjList  = undefined
                    
                    activeVRScenes( 0 );
					
				})

            }

            //[end---20200211-fei0090-add]//
        
        };
        

        //// 使用本地的專案資料，完全不從雲端取得。
        window.loadCustVRProjData = function( projData ){

            //// custProject = projData
            console.log('VRFunc_cust.js: _loadVRProjData: _projData=', projData );
            
            //// projData 等同於 custProject
            let makarUserData = projData.makarUserData;
            window.makarUserData = projData.makarUserData;

            let stepController = new StepController( projData );
            window.stepController = stepController;

            //// 啟動 AFRAME 基礎設定，包含 VRController 
            activeVRScenes( 0 , projData );

        }

        //// 載入場景
        function loadScene( sceneIndex =0 , projData ){

            let self = window.vrController;

            self.loadSceneCount += 1;

            let pAll = [];
            let pSky = loadSky(projData)
            pAll.push( pSky );

            let pObjs = loadSceneObjects( projData );
            pAll = pAll.concat( pObjs );

            return pAll;
        }

        //// 載入天空
        function loadSky( projData ){
            let self = window.vrController;

            let pSky;
            if ( projData.scenesData && Array.isArray( projData.scenesData.scenes ) && projData.scenesData.scenes[0] &&
                projData.scenesData.scenes[0].environment && projData.scenesData.scenes[0].environment.sceneSky_info &&
                projData.scenesData.scenes[0].info && projData.scenesData.scenes[0].info.id
            ){
                let scene_id = projData.scenesData.scenes[0].info.id;
                let sceneSky_info = projData.scenesData.scenes[0].environment.sceneSky_info
                
                if ( sceneSky_info.res_url  ){
                    pSky = self.loadSky( self.vrScene, scene_id, sceneSky_info, self.loadSceneCount);
                }else if ( sceneSky_info.color ){
                    pSky = new Promise( function ( resolve ){
                        let aSky = document.createElement('a-sky');
                        aSky.setAttribute('id', "sky" );
                        aSky.setAttribute('color', sceneSky_info.color );
                        self.vrScene.appendChild(aSky);
                        
                        resolve( aSky );
                    });
                }else{
                    pSky = new Promise( function ( resolve ){
                        let aSky = document.createElement('a-sky');
                        aSky.setAttribute('id', "sky" );
                        self.vrScene.appendChild(aSky);
                        
                        resolve( aSky );
                    });
                }
            }

            return pSky;
        }

        //// 載入場景物件
        function loadSceneObjects( projData ){

            let self = window.vrController;

            self.loadAssets();

            //// 載入狀態陣列
            let pObjs = [];

            //// 載入場景物件
            if ( projData.scenesData && Array.isArray( projData.scenesData.scenes ) && 
                projData.scenesData.scenes.length > 0){
                
                let _scene = projData.scenesData.scenes[0];

                let scene_objs = [];
                if ( Array.isArray(_scene.objs) ){
                
                    scene_objs = _scene.objs;                    
                    for (let i = 0; i < scene_objs.length ; i++  ){

                        let objTranform = getObjTransform( scene_objs[i] );
                        let position = objTranform.position;
                        let rotation = objTranform.rotation;
                        let scale = objTranform.scale;
                        let quaternion = objTranform.quaternion;

                        switch( scene_objs[i].main_type ){  
                            case 'model':
                                let pModel = self.loadGLTFModel(scene_objs[i], position, rotation, scale , self.cubeTex );
                                pObjs.push( pModel );
                                break;

                            case 'light':
                                let pLight = self.loadLight(scene_objs[i], position, rotation, scale);
                                pObjs.push( pLight );
                                break;
                        }

                    }

                }

            }

            return pObjs;
 
        }

        //// 取得物件的位置、旋轉、縮放
        function getObjTransform( scene_obj ){
            
            let transform = {
                position: null,
                rotation: null,
                scale: null , 
                quaternion: null,
            }

            if ( scene_obj.generalAttr && scene_obj.generalAttr.obj_type == '3d'){
                transform.position = new THREE.Vector3().fromArray( scene_obj.transformAttr.transform[0].split(",").map( x => Number(x) ) );
                let quaternionArray = scene_obj.transformAttr.transform[1].split(",").map( x => Number(x) ) 
                transform.quaternion = new THREE.Quaternion( quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3] )

                let eulerAngle = new THREE.Euler().setFromQuaternion( transform.quaternion, "YXZ");
                transform.rotation = new THREE.Vector3( eulerAngle.x , 1 * eulerAngle.y , 1 * eulerAngle.z );

                transform.scale = new THREE.Vector3().fromArray(scene_obj.transformAttr.transform[2].split(",").map(function(x){return Number(x)}) );

            }

            return transform;
            
        }


        //// 客製化 調製整 物件材質，注意! 此段會於 MAKAR官方 載入完 GLTF模型後 才會發生
        //// 創建【 Material 】，掛在多個 Mesh 之上
        function setModelMaterial( projData ){
            if ( projData && projData.scenesData && projData.scenesData.scenes && projData.scenesData.scenes[0] && 
                Array.isArray( projData.scenesData.scenes[0].objs)
            ){
                let scene_objs = projData.scenesData.scenes[0].objs;
                scene_objs.forEach( (obj, i) => {
                    if ( obj.generalAttr && obj.generalAttr.obj_id && 
                         obj.main_type == 'model' &&
                        Array.isArray(  obj.cust_materials ) ){

                        let _model = document.getElementById(  obj.generalAttr.obj_id );
                        if ( _model && _model.object3D){

                            obj.cust_materials.forEach( (cm , cm_i)=>{
                                //// 必須要有超過一個【 名稱 】 
                                //// 拿第一個名稱來做材質的複製
                                if ( Array.isArray(cm.names) && cm.names.length > 0 ){
                                    let first_material_clone = null;
                                    let first_mesh_name = cm.names[0];
                                    let first_mesh = _model.object3D.getObjectByName( first_mesh_name );
                                    if ( first_mesh && first_mesh.material ){
                                        first_material_clone = first_mesh.material.clone() ;
                                        
                                        first_material_clone.name = cm.id
                                        if ( window.vrController ){
                                            if  ( !window.vrController.cust_materials){
                                                window.vrController.cust_materials = []
                                            }
                                            window.vrController.cust_materials.push( first_material_clone )
                                        }
                                        

                                        //// 顯示
                                        if ( cm.hasOwnProperty('visible') ){
                                            first_material_clone.visible = cm.visible;
                                        }
                                        //// 透明
                                        if ( cm.hasOwnProperty('trans') ){
                                            first_material_clone.transparent = cm.trans;
                                        }
                                        if ( cm.hasOwnProperty('trans') ){
                                            first_material_clone.opacity = cm.opacity;
                                        }
                                        //// 顏色
                                        if ( cm.hasOwnProperty('color') ){
                                            first_material_clone.color.setRGB( cm.color[0]/255, cm.color[1]/255, cm.color[2]/255 ); ;
                                        }
                                        
                                        //// 金屬 粗糙
                                        if ( cm.hasOwnProperty('metalness') ){
                                            first_material_clone.metalness = cm.metalness;
                                        }
                                        if ( cm.hasOwnProperty('roughness') ){
                                            first_material_clone.roughness = cm.roughness;
                                        }

                                        //// 
                                        // if ( cm.hasOwnProperty('depthWrite') ){
                                        //     first_material_clone.depthWrite = cm.depthWrite;
                                        // }
                                        

                                        //// 顯示與否
                                        // first_material_clone.visible = cm.visible;

                                        cm.names.forEach( ( n_e , n_i ) => {
                                            let mesh = _model.object3D.getObjectByName( n_e );
                                            if ( mesh && mesh.material ){
                                                mesh.material = first_material_clone;
                                            }else{
                                                //// 由於 模型設計師 可能 指定同樣名稱，掙扎一下
                                                let gotMeshName = false;
                                                if ( mesh ){
                                                    mesh.traverse( c => {
                                                        if (c.isMesh && c.name == n_e ){
                                                            gotMeshName = true;
                                                            c.material = first_material_clone;
                                                        }
                                                    })
                                                }
                                                if (!gotMeshName){
                                                    console.warn('VRFunc_cust.js: _setModelMaterial: No Mesh ', n_e );
                                                }
                                                
                                            }
                                        })
                                    }                                    
                                }
                            })
                        }
                    }
                })
            }
        }

        function setupPlane( vrController ){

            const size = 20;
            const divisions = 20;
            const gridHelper = new THREE.GridHelper( size, divisions , 0x444444 , 0xa3a3a3 );
            if ( vrController && vrController.vrScene && vrController.vrScene.object3D ){
                vrController.vrScene.object3D.add( gridHelper );
            }
            

        }


        //// 這個 _activeVRScenes 只有這裡被呼叫 似乎不必掛在window底下
        const activeVRScenes = function( sceneIndex=0 , projData ){
            ////// remove the video tag, and clean the memory, must be done before remove the div 
            let videos = document.getElementsByTagName("video");
            if ( videos.length > 0 ){
                for (let i = 0; i < videos.length; i++ ){
                    videos[i].pause();
                    videos[i].removeAttribute("src"); // empty source 	
                    videos[i].load();
                }
            }
            
            ////// set the same id=vrDiv, if load the different VR project, remove the div after remove video.
            if (document.getElementById("vrDiv")){
                document.getElementById("vrDiv").remove();
            }

            let vrDiv;
            ////// set the aframe scene
            let vrScene = document.createElement('a-scene');
            vrScene.setAttribute('id', "vrscene" ); ////// just id
            vrScene.setAttribute('crossorigin', 'anonymous');

            vrScene.setAttribute( 'embedded', "" ); ////// add this will make the scene embedded into a div
            vrScene.setAttribute( 'vr-mode-ui', "enabled: false" ); ////// disable and hide the VR button
            vrScene.setAttribute( 'debug', "true" ); ////// disable and hide the VR button

            // vrScene.setAttribute( 'device-orientation-permission-ui', "enabled: false" );

            ////// set a div above a-scene, must set one of width/height be "xxx px" 
            vrDiv = document.createElement('div');

            // vrDiv.style.width  = Math.round(document.documentElement.clientWidth *1.0 ) + "px" ;    //  "500px" or "80%"
            // vrDiv.style.height = Math.round(document.documentElement.clientHeight*0.9 ) + "px" ;//  "500px" or "80%"

            let container;
            if ( window.makarSDK && window.makarSDK.config && window.makarSDK.container ){
                //// for_makarSDK
                vrDiv = window.makarSDK.vrDiv
                container = window.makarSDK.container
            } else {
                container = document.documentElement
            }

            vrDiv.style.position = "relative" ;    //  "500px" or "80%"
            vrDiv.setAttribute('id', "vrDiv" ); ////// set the same id, if load the different VR project, remove the div first.
            vrDiv.setAttribute('crossorigin', 'anonymous');

            vrDiv.style.width = container.clientWidth + "px" ;    //  "500px" or "100%"
            vrDiv.style.height = Math.round(container.clientHeight - 0) + "px" ;//  "500px" or "80%"

            // vrDiv.style.left = window.innerWidth*0.1+"px" ; //
            vrDiv.style.top = "0px" ; //
            window.onresize = function(){
                // console.log("window resize: WH=", window.innerWidth, window.innerHeight, vrDiv.clientWidth, vrDiv.clientHeight );
                vrDiv.style.width = container.clientWidth + "px" ;    //  "500px" or "100%"
                vrDiv.style.height = Math.round(container.clientHeight - 0) + "px" ;//  "500px" or "80%"
                        
        	    //[start-20231024-howardhsu-modify]//
                //// VR也增加了2D介面 加上onresize對應的函式
                if ( window.vrController && vrController.vrScene && vrController.GLRenderer ){

                    //// 延遲觸發 「畫布縮放」跟「調整2D相機」。假如連續縮放畫面，則只會觸發最後一次
                    console.log('window _resize: _clearTimeout and _setTimeout ');

                    clearTimeout( vrController.sizeTimeOutID );
                    vrController.sizeTimeOutID = setTimeout( function(){
                        
                        let self = window.vrController;
                        let rendererSize = new THREE.Vector2();
                        self.vrScene.renderer.getSize( rendererSize );

                        // console.log(' window _rendererSize: ', rendererSize.x, rendererSize.y );

                        // let video = self.video;
                        // let videoWidth, videoHeight;
                        let w = (window.makarSDK) ? window.makarSDK.container.clientWidth : window.innerWidth;
                        let h = (window.makarSDK) ? window.makarSDK.container.clientHeight : window.innerHeight;
                        // if ( rendererSize.x/rendererSize.y > video.videoWidth/video.videoHeight ){							
                        //     w = window.innerWidth  ;
                        //     h = (window.innerWidth/video.videoWidth)* video.videoHeight;
                        // }else{							
                        //     w = (window.innerHeight/video.videoHeight) * video.videoWidth ;
                        //     h = window.innerHeight;
                        // }

                        //// 原本是「改動 div 」現在換「改動 canvas 」
                        self.GLRenderer.setSize( w , h );
                        
                        if(window.makarSDK){
                            //// for_makarSDK : 位置暫時不在這裡設定
                        } else {
                            self.vrScene.canvas.style.left = ( innerWidth - w )/2 + "px" ;
                            self.vrScene.canvas.style.top  = ( innerHeight - h )/2 + "px" ;
                        }

                        let oSR2D = vrController.scaleRatioXY;
                        let cSR2D = vrController.get2DScaleRatio();
                        
                        //// 調整 2D 相機 的「範圍」
                        self.camera2D.left = -w/2  * oSR2D/cSR2D ;
                        self.camera2D.right = w/2  * oSR2D/cSR2D ;
                        self.camera2D.top = -h/2   * oSR2D/cSR2D ;
                        self.camera2D.bottom = h/2 * oSR2D/cSR2D ;
                        self.camera2D.updateProjectionMatrix();

                        

                        // vrController.set2DScaleRatio( cSR2D ); //// 這段目前測試不該呼叫

                        self.vrScene.resize();

                        ///// 這邊發現，畫布的精細度可以依照下列方式調製整，讓手機上解析度提高

                        if (Browser){
                            let dw, dh;
                            if ( Browser.desktop == true ){
                                //// 電腦端，調整概念為「短邊一定要超過 1280 、長邊不超過 1280 」，由於目前 新版 webXR 設定 此 iframe 高度只有 600 所以這邊必定要觸發
                                //// 先預計未來 iframe 會調整大小，所以這邊還是好好寫判斷
                                let wx = rendererSize.x;
                                let wy = rendererSize.y;

                                if ( w > 2560 || h > 2560 ){
                                    if ( w > h ){
                                        dw = 2560  ;
                                        dh = 2560 * h/w ;
                                    }else{
                                        dw = 2560 * w/h ;
                                        dh = 2560 ;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }else if ( wx < 1280 || wy < 1280 ){
                                    if ( w > h ){
                                        dw = 1280 * w/h ;
                                        dh = 1280 ;
                                    }else{
                                        dw = 1280 ;
                                        dh = 1280 * h/w ;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }

                            }else if ( Browser.mobile == true ){
                                //// 手機端，調整概念為「 無條件補滿 720 」
                                if ( w < 720 || h < 720){
                                    
                                    if ( w > h ){
                                        dw = 720;
                                        dh = 720/w * h;
                                    }else{
                                        dw = 720/h * w;
                                        dh = 720;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }
                            }
                        }


                        //// 調整 3D 相機 aspect ratio
                        let camera3D = self.vrScene.camera
                        camera3D.aspect = w/h;
                        camera3D.updateProjectionMatrix();

                        let oCamera = document.getElementById('oCamera');
                        let oCamera3D = oCamera.components['camera'].camera
                        oCamera3D.aspect = w/h;
                        oCamera3D.updateProjectionMatrix();

                        console.log('2 window _resize: ', w, h, self.GLRenderer.getSize( rendererSize ) );

                    }, 50 );

                    
                }
            	//[end-20231024-howardhsu-modify]//

            };

            //// for_makarSDK 
            if(window.makarSDK){
                //// 準備 js custom event 
                const event_vrDivReady = new CustomEvent("vrDivReady", {
                    detail: {
                        "name": "(for webSDK) vrDiv is ready.",
                        "vrDiv": vrDiv
                    },
                });
                window.makarSDK.container.dispatchEvent(event_vrDivReady);

            } else {
                document.body.appendChild(vrDiv);
            }

            vrDiv.appendChild(vrScene);
        
            

            if (vrScene.hasLoaded) {
                initvrscene();
            } else {
                vrScene.addEventListener('loaded', ()=>{
                    initvrscene()
                });
            }

            vrScene.addEventListener('enter-vr', function(){
                // console.log("VRFunc_cust.js: vrScene enter-vr");
            });
            vrScene.addEventListener('renderstart', function(){
                // console.log("VRFunc_cust.js: vrScene renderstart");
            });            
        
            //////
            ////// server V3 
            //////            
            // let vrController = new VRController(VRSceneResult, publishVRProjs, projIndex, languageType, worldContent);
            // window.vrController = vrController; // 20190921 for debug   
            
            //[start-20230728-howardhsu-add]//
			///// 3.5.0 Data 
            
            //// 開發 3.5.0 「專案編號 與 場景編號 」固定
            // projIndex = 1;

            // let vrController = new VRController(new_scene , new_proj, projIndex, languageType, worldContent);
            // importModule('TextModule')
            
            let vrController = new VRController( makarUserData );
            window.vrController = vrController;
            
            //// for_makarSDK
            //// 暫時這樣 之後問一下 是否SDK也維持 vrController掛在window下
            if(window.makarSDK){
                window.makarSDK.currentActiveController = vrController
            }
            //[end-20230728-howardhsu-add]//

            //// 起始設定，由於目前 「朗讀文字」的功能棟有第一次無法取得 發聲列表 問題，所以這邊先行呼叫一次
            if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){
                let voices = speechSynthesis.getVoices();
                vrController.voices = voices;
            }

            
            //// add 2D scene
            let testCSS2D = false

            function initvrscene(){
                
                if ( vrScene.children[2].attributes ){

                }
                // vrScene.children[2].remove(); ////// 20190921: Fei want to remove the default camera, 

                ////// add the listener for show the panel or not
                // vrScene.canvas.addEventListener("touchstart", vrSceneTouch, false);
                // vrScene.canvas.addEventListener("mousedown", vrSceneTouch, false);
                // let bottomProjs = document.getElementById("bottomProjs");
                // let projsInfo = document.getElementById("projsInfo");
                // let bottomArrow = document.getElementById("bottomArrow");
                // bottomProjs.style.display = "block";
                // function vrSceneTouch(event){
                // 	//// close the author's project list 
                // 	event.preventDefault();
                // 	// console.log("VRFunc_cust.js: _vrSceneTouch: camera rotation=", document.getElementById("camera_cursor").object3D.rotation, document.getElementById("aCamera").object3D.rotation  );

                // 	bottomProjs.className =  'collapsed' ;
                // 	projsInfo.className =  'collapsed' ;
                // 	bottomArrow.className =  'collapsed' ;

                // }


    //20200604-start-thonsha-add
                vrScene.setAttribute("shadow","type: pcfsoft");
    //20200604-end-thonsha-add
                

                ////// set member into vrController
                let rendererSize = new THREE.Vector2();
                vrScene.renderer.getSize( rendererSize );
    //20191112-start-thonsha-add

                vrScene.renderer.sortObjects = true;

                //// 「 關閉 陰影自動更新 」
                // vrScene.renderer.shadowMap.autoUpdate = false;


                // vrScene.renderer.capabilities.logarithmicDepthBuffer = true;
                
                // preserveDrawingBuffer

                console.log(" **************** vrScene " , vrScene.object3D );

    //20191112-end-thonsha-add

                //[start-20231013-howardhsu-add]//
                //// try to add 2D scene
                vrScene.renderer.autoClear = false; // make the 2D Camera can render to the same WebGLRenderer of VRScene
                
				//////// add the scene for 2D object
				let scene2D = new THREE.Scene();
				vrController.scene2D = scene2D;               
                
                let w = vrDiv.clientWidth
                let h = vrDiv.clientHeight

				let camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -100, 20000);
				vrController.camera2D = camera2D;
                //[end-20231013-howardhsu-add]//
    
                vrController.vrScene = vrScene;
                vrController.GLRenderer = vrScene.renderer;

                //////// add the scene for background video  
				let videoScene = new THREE.Scene();
				vrController.videoScene = videoScene;

                // //[start-20231013-howardhsu-add]//
                // ///// 載入相機完成之後，設定對應 物件放大比例
                // let  sr2D = vrController.get2DScaleRatio();
                // vrController.set2DScaleRatio( sr2D ) ;
                // //[end-20231013-howardhsu-add]//

                vrController.setupFunction();

                ////// set cursor with animation
    //20200812-thonsha-mod-start
                setTimeout(function(){
                    cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;" );
                    cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );
                    cursorEntity.setAttribute('animation__mouseenter', "property: geometry.thetaLength; delay: 5; startEvents: mouseenter; dur: 5; from: 0.5; to: 360" );
                    cursorEntity.setAttribute('animation__mouseleave', "property: geometry.thetaLength; startEvents: mouseleave; dur: 100; from: 360; to: 0.5" );
                    // cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.04; radiusInner: 0.02; thetaLength: 360; thetaStart: 0;" );
                    vrController.cursorEntity = cursorEntity;
                }, 1);
                let cursorEntity = document.createElement('a-entity');
                cursorEntity.setAttribute('id', "cursor_main" );
                // cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );
                // cursorEntity.setAttribute('cursor', "fuse: false; fuseTimeout: 5" );
                cursorEntity.setAttribute('raycaster', "objects: .clickable" );
                // cursorEntity.setAttribute('animation__mouseenter', "property: geometry.thetaLength; delay: 5; startEvents: mouseenter; dur: 5; from: 0.5; to: 360" );
                // cursorEntity.setAttribute('animation__mouseleave', "property: geometry.thetaLength; startEvents: mouseleave; dur: 100; from: 360; to: 0.5" );
                // cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.04; radiusInner: 0.02; thetaLength: 360; thetaStart: 0;" );
                cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;" );
                cursorEntity.setAttribute('position', "0 0 -0.1" );
                cursorEntity.setAttribute('material', "color: red; shader: flat; " );
                ////// set cursor default (green)
                let cursorEntityDefault = document.createElement('a-entity');
                cursorEntityDefault.setAttribute('id', "cursor_default" );
                cursorEntityDefault.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 360; thetaStart: 0;" );
                cursorEntityDefault.setAttribute('position', "0 0 -0.1001" );
                cursorEntityDefault.setAttribute('material', "color: #2ADD2A; shader: flat; " );


                
                ////// set the entity to contain a-camera
                //// v3.5.0.0 先判斷「初始觀看模式」
                let initViewMode = 'VR';
                let activeViewModeVR = (window.makarSDK) ? true : false;
                let activeViewModeModel = false;

                if ( parent.selectedProject ){
                    if ( parent.selectedProject.viewMode == 'XR' ){
                        initViewMode = 'VR';
                        activeViewModeVR = true;
                    }else if (parent.selectedProject.viewMode == 'model'){
                        initViewMode = 'model'
                        activeViewModeModel = true;
                    }else{
                        initViewMode = 'VR';
                        activeViewModeVR = true;
                    }
                }

                //// 先設定為 Model 觀看模式
                activeViewModeVR = false; 
                activeViewModeModel = true;
                initViewMode = 'VR';

                vrController.viewMode = initViewMode;


    //20200812-thonsha-mod-end
                let aCamera = document.createElement('a-entity');
                // let aCamera = document.createElement('a-camera');

                ////// 20190921 Fei add some code inside  aframe-v0.9.2.js/aframe-v0.9.2.min.js for use touch control vertical view
                aCamera.setAttribute('camera', {active: true , fov: 80 } );
                aCamera.setAttribute('look-controls', "" ); 
                aCamera.setAttribute('wasd-controls', "" );
                // aCamera.setAttribute('wasd-controls', { enabled: true } ); 
                aCamera.setAttribute("camera", "active", activeViewModeVR);

                // aCamera.setAttribute('xytouch-look-controls', "" ); ///// 20190921 Fei stop use it for now.
                aCamera.setAttribute('id', "aCamera" );
                aCamera.setAttribute('position', { x: 0 , y: 0 , z: 0 } ); ////// it is work, but cant get value
                aCamera.setAttribute( 'camera', "fov", 60 ); ////// it is work, default is 80, 60 is unity set
                aCamera.setAttribute( 'camera', "near", 0.3 ); ////// it is work, default is 0.3
                aCamera.setAttribute( 'camera', "far", 20000 ); ////// it is work, default is 10000

                // console.log("VRFunc_cust.js: aCamera.object3D.children=", aCamera.object3D.children.length );
                // aCamera.appendChild(cursorEntity);
                // aCamera.appendChild(cursorEntityDefault);
                console.log("VRFunc_cust.js: aCamera=", aCamera );

                //// 模型觀看視角的相機，起始預設為「不啟動」。
                //// 注意：啟動指令為  oCamera.setAttribute('camera', 'active:true;')  同時會關閉所有場景中 camera （設定 active false）
                //// 反之，關閉指令為  oCamera.setAttribute('camera', 'active:false;')    
                //// 

                let oCamera = document.createElement('a-entity');
                oCamera.setAttribute('id', "oCamera" );
                
                let oCameraConfig = {
                    active: activeViewModeModel , 
                    fov: 80, 
                    near: 0.3, 
                    far:10000, 
                    aspect: rendererSize.x/ rendererSize.y
                }

                oCamera.setAttribute('camera', oCameraConfig );
                oCamera.setAttribute('orbit-controls', 
                `minPolarAngle: 0; 
                maxPolarAngle: 180; 
                minDistance: 0.1; 
                maxDistance: 1000; 
                initialPosition: -5 5 13;` ); 

                // 創建一個camera for 陀螺儀
				let cameraForGyro = document.createElement("a-entity");
				cameraForGyro.setAttribute('id', 'cameraForGyro');
				cameraForGyro.setAttribute('crossorigin', 'anonymous');
				cameraForGyro.setAttribute('camera', {active: false} );
				cameraForGyro.setAttribute('look-controls', { enabled: true , touchEnabled: false } );

                ////// set the a-entity to wrap the a-camera, the position and roation set here is the default value, will replace when load scene.
                let cameraEntity = document.createElement('a-entity');
                cameraEntity.setAttribute('id', "camera_cursor" ); ////// it is work, can get value!

                // cameraEntity.setAttribute('position', {x: 0, y: 1.7 , z: 0} );
                cameraEntity.setAttribute('position', {x: 0, y: 0 , z: 0} ); 

                cameraEntity.setAttribute('rotation', "0 0 0" ); ////// it is work too, but still can't get value

                cameraEntity.appendChild(aCamera);

                cameraEntity.appendChild(oCamera);

                cameraEntity.appendChild(cameraForGyro);

                vrScene.appendChild(cameraEntity);// this = vrScene

                let ambientLight = document.createElement("a-light");
                ambientLight.setAttribute("id", "ambientLight");
                ambientLight.setAttribute("type", "ambient" );
                ambientLight.setAttribute("color", "#808080" ); // white / gray / #fff  / #c8c8c8
                ambientLight.setAttribute("ground-color", "#fff" ); // #fff , Fei dont know how it work
                ambientLight.setAttribute("intensity", 1.0 );

                vrScene.appendChild(ambientLight);// this = vrScene


                //// v3.5.0.0 將兩種觀看模式的相機 「 aCamera 」「 oCamera 」設定， 「初始觀看模式」
                let aCameraObject = aCamera.getObject3D('camera');
                let oCameraObject = oCamera.getObject3D('camera');


                //// 假如「專案描述」帶有特定字串 _walking 增加以下功能
                //// 製作「客製化 走動功能 」

                //// v3.5.0.0 開發中，測試走路功能

                makarUserData.oneProjData.proj_descr += '_walking';

                // if (  publishVRProjs.result[ projIndex ].proj_descr.includes('_walking') == true  ){
                if ( makarUserData.oneProjData.proj_descr.includes( '_walking' ) ){


                    let self = vrController;
                    
                    ///// 紀錄當前「移動相機功能」的狀態，基本上只有「 VR 體驗 」時候可以開啟
                    //// -1: 2D UI 顯示為「尚未啟動」，3D icon 隱藏，此狀態只有點擊「開啟走動功能」才可以後續觸發走動
                    ////  0: 2D UI 顯示為「已經啟動」，3D icon 顯示白色，此狀態為可以觸發點擊移動功能，等待移動
                    ////  1: 2D UI 顯示為「已經啟動」，3D icon 顯示紅色，此狀態為移動中，不可再次移動
                    self.walkingStatus = -1;

                    let pointerSphere = document.createElement("a-entity");
                    pointerSphere.setAttribute("id" , "pointerSphere" );
                    pointerSphere.setAttribute("geometry" , "primitive: ring; radiusInner: 0.35; radiusOuter: 0.5" );
                    pointerSphere.setAttribute("material" , "shader: flat; color: white; side: double; opacity: 0.3; ");
                    pointerSphere.setAttribute('position', {x: 0, y: 0 , z: 0} ); 
                    pointerSphere.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
                    pointerSphere.setAttribute("visible", false);
                    self.vrScene.appendChild(pointerSphere); 

                    let currentPosSphere = document.createElement("a-entity");
                    currentPosSphere.setAttribute("id" , "currentPosSphere" );
                    currentPosSphere.setAttribute("geometry" , "primitive: ring; radiusInner: 0.35; radiusOuter: 0.5" );
                    currentPosSphere.setAttribute("material" , "shader: flat; color: #0AC4B6; side: double; opacity: 0.3; ");
                    currentPosSphere.setAttribute('position', {x: 0, y: 0 , z: 0} ); 
                    currentPosSphere.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
                    currentPosSphere.setAttribute("visible", false );
                    self.vrScene.appendChild(currentPosSphere); 


                    //// 地板
                    let ground = document.createElement("a-entity");
                    ground.setAttribute("id" , "__ground" );
                    ground.setAttribute("geometry" , "primitive: plane; height: 1000; width: 1000; ");
                    ground.setAttribute("material" , "shader: flat; color: blue; side: back; opacity: 0.05; visible: true ");
                    ground.setAttribute("visible" , false);
                    ground.setAttribute('position', {x: 0, y: 0.1 , z: 0} ); 
                    ground.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
                    ground.addEventListener("loaded", function(){
                        ground.object3D.renderOrder = 9999;
                    });
                    self.vrScene.appendChild(ground);


                }



                let firstCameraSetActive = function(evt){
                    // console.log("firstCameraSetActivefirstCameraSetActive")
                    vrDiv = document.getElementById("vrDiv");
                    // vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or "100%"
                    // vrDiv.style.height = Math.round(document.documentElement.clientHeight - 56) + "px" ;//  "500px" or "80%"
                    console.log("VRFunc_cust.js: _activeVRScenes: _initvrscene: vrScene.camera active = ", vrScene.camera.aspect, vrDiv.clientWidth, vrDiv.clientHeight );
                    vrScene.camera.aspect = vrDiv.clientWidth/vrDiv.clientHeight;
                    vrScene.camera.fov = 60;
                    vrScene.camera.updateProjectionMatrix();
                    
                    let cameraOpen = false;
                    // for (let i = 0; i < vrController.scenesData.scenes.length;i++){
                    //     if(vrController.scenesData.scenes[i].environment.scene_skybox_res_id == 'camera'){
                    //         cameraOpen = true;
                    //     }
                    // }

                    if(cameraOpen){
                        
                        if(window.makarSDK){
                            //// for_makarSDK 暫時先跳過     應該是要新增 method 讓SDK使用者可以在外部呼叫並切換
                        } else {
                            //// mobile browser 顯示切換前後鏡頭的按鈕
                            if(parent.projMenuMobileSwitchCam){
                                parent.projMenuMobileSwitchCam.style.display = "inline-block"
                            }
                        }

                        vrController.startWebCam(  function( camRet ){
    
                            ///// 假如沒有辦法取得「相機畫面」，則導入「預設的sky」
                            if ( camRet == false ){
                                console.log(' _XRFunc.js: _startWebCam: error ');
                                // return;
                                let aSky = document.createElement('a-sky');
                                aSky.setAttribute('id', "sky" );
                                // aSky.setAttribute("material", {src: "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png" });
                                
                                //[start-2023mmdd-howardhsu-add]//
                                aSky.setAttribute("material", {src: "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/VRProjectMipmap/740c26126aab4eeca6adf5dc268814b3_4096.jpg" });
                                //[end-2023mmdd-howardhsu-add]//
                                
                                vrController.vrScene.appendChild(aSky);
    
                                //20221207-thonsha-add-end
                                let timeoutID = setInterval( function () {
                                    if(document.getElementById("sky").object3D){
                                        vrController.onlySkyScene.add(document.getElementById("sky").object3D.clone(true))
                                        clearInterval(timeoutID);
                                    }
                                });
                                //20221207-thonsha-add-end
                            }
    
                            ///// 載入相機完成之後，設定對應 物件放大比例
                            let  sr2D = vrController.get2DScaleRatio();
                            vrController.set2DScaleRatio( sr2D ) ;
        
                            vrController.loadScene(sceneIndex);
                            vrController.userStartTime = new Date().getTime();
        
                            // checkHost_tick();
                            // Module.checkMifly();
                            //// 20201029 為了解決 iphone上畫面卡住問題
                            // 假如先執行 video.play() 等待 一段時間 再執行 tick 則畫面高機率卡住
                            // 假如先執行 tick 再執行 video.play() 則畫面高機率順暢（沒遇到卡住）
                            renderTick();
                            setTimeout(function(){
                                if ( vrController.video.play ){
                                    vrController.video.play();
                                }
                            }, 1000);
        
        
                        });
                    }
                    else{
                        //// 先將觸控關閉，再跳轉場景
                        vrController.triggerEnable = false;
                        // vrController.loadScene(projIndex, sceneIndex);
                        // vrController.loadScene( sceneIndex );

                        //// 劃出 x y 平面的 格線
                        setupPlane( vrController );

                        //// 這邊的 載入場景 並非 MAKAR 的官方流程，是客製化專案 額外撰寫
                        let pAll = loadScene( 0, projData );
                        
                        //// 調整 起始的相機設定
                        let tID = setInterval( function(){
                            if ( projData.scenesData && Array.isArray( projData.scenesData.scenes ) && 
                                projData.scenesData.scenes[0] && projData.scenesData.scenes[0].environment &&
                                projData.scenesData.scenes[0].environment.oCameraInfo
                            ){
                                let cp = projData.scenesData.scenes[0].environment.oCameraInfo.position;
                                let ct = projData.scenesData.scenes[0].environment.oCameraInfo.target;

                                let oCamera = document.getElementById('oCamera');
                                if ( oCamera && oCamera.components['orbit-controls'] && 
                                    oCamera.components['orbit-controls'].target &&
                                    oCamera.object3D && oCamera.object3D.children && oCamera.object3D.children[0]
                                ){
                                    oCamera.components['orbit-controls'].target.set( ct[0], ct[1], ct[2] );
                                    oCamera.object3D.children[0].position.set( cp[0], cp[1], cp[2] );
                                    clearInterval( tID );
                                }
                                
                            }

                        }, 300 );

                        //// 調整環境光 的亮度
                        if ( projData.scenesData && Array.isArray( projData.scenesData.scenes ) && 
                                projData.scenesData.scenes[0] && projData.scenesData.scenes[0].environment &&
                                projData.scenesData.scenes[0].environment.ambientLight
                        ){
                            let ambientLight = document.getElementById('ambientLight');
                            if ( ambientLight ){
                                let int = projData.scenesData.scenes[0].environment.ambientLight.intensity
                                ambientLight.setAttribute('intensity' , int )
                            }

                        }
                        

                        Promise.all(pAll).then( function( ret ){
                            console.log('VRFunc_cust.js: _loadScene: ret=', ret );

                            //// 關閉載入動畫:
                            let homePage = document.getElementById("homePage");
                            if (homePage){
                                homePage.style.display = "none";
                            }

                            //// 接受【 點擊事件 】
                            vrController.triggerEnable = true;

                            //// 暫時性 設定
                            if ( document.getElementById('obj_1') ){
                                let obj_1 = document.getElementById('obj_1');
                                if ( obj_1 && obj_1.object3D ){
                                    obj_1.object3D.traverse( (c,i)=>{
                                        if ( c.isMesh){
                                            // console.log( c.name );
                                            c.material.transparent=true;
                                            c.material.opacity=0.5;
                                        }
                                    })
                                }
                            }

                            //// 客製化 大象滾球遊樂 
                            //// 有 mesh 名稱重複，客製化調整
                            if ( location.pathname.includes('/p2.html') ){
                                let obj_1 = document.getElementById('obj_1');
                                if ( obj_1 && obj_1.object3D ){
                                    obj_1.object3D.traverse( (c,i)=>{
                                        if ( c.isMesh && c.name == '50-2' ){
                                            if ( c.parent && c.parent.name == '51-0' ){
                                                c.name = '51-2';
                                            }
                                        }

                                        if ( c.isMesh && c.name == '50-1' ){
                                            if ( c.parent && c.parent.name == '51-0' ){
                                                c.name = '51-1';
                                            }
                                        }

                                    })
                                }

                            }

                            //// 客製化 拱門 
                            //// 有 mesh 名稱重複
                            if ( location.pathname.includes('/p7') ){
                                let obj_1 = document.getElementById('obj_1');
                                if ( obj_1 && obj_1.object3D ){
                                    obj_1.object3D.traverse( (c,i)=>{
                                        if ( c.isMesh && c.name == '58-2' ){
                                            if ( c.parent && c.parent.name == '57' ){
                                                c.name = '57-2';
                                            }
                                        }
                                    })
                                }
                            }
                            


                            //// 客製化 調整材質
                            //// 解析 客製材質列表 每一個別類型 創建一 Material，所屬 mesh 掛載相同 matrail
                            setModelMaterial( projData );
                            

                            //// 調整步驟顯示的物件狀態
                            //// 假如是【依照 Mesh 步驟】，找出第一步驟的物件，並將它顯示出來
                            // window.stepController.ToStep(0);

                            

                        })

                        

                        vrController.userStartTime = new Date().getTime();
                        
                        // vrController.update();
                        // checkHost_tick();
                        // Module.checkMifly();

                    }


                    
                    
                    vrScene.removeEventListener('camera-set-active', firstCameraSetActive );
                }
                vrScene.addEventListener('camera-set-active', firstCameraSetActive );


                


                ////// setup the test 3D object, it is work
                // vrController.loadTexture();

                ////// setup the default button.
                //// make the stable scene2D renderer, prepare for future.
                // let test = new THREE.Object3D();
                // vrController.loadTexture2D(test, "../images/homeIcon1.png"); // homeIcon1.png, homeIcon2.jpg			
                // test.position.set( -rendererSize.x + 150 , -rendererSize.y + 150, 0 );
                // scene2D.add(test);

                // let plane = new THREE.Mesh( new THREE.PlaneBufferGeometry(100, 100, 0), new THREE.MeshBasicMaterial( {side: THREE.BackSide, color: new THREE.Color("rgb(50,150,50)") } ) );
                // plane.position.set( -rendererSize.x + 50 , -rendererSize.y + 50, 0 );
                // scene2D.add(plane);

    //20221206-thonsha-add-start
                let skyRenderTarget = new THREE.WebGLRenderTarget(1024,1024);
                vrController.skyRenderTarget = skyRenderTarget;
                vrController.needsRenderTarget = false;
                // vrController.onlySkyScene = new THREE.Scene();
    //20221206-thonsha-add-end		
                // vrController.cullFaceBackScene = new THREE.Scene();

                renderTick();

                // console.log("VRFunc_cust.js: _initvrscene, done", vrScene, vrScene.object3D );
            }

            
            let renderTick = function() {

                vrController.GLRenderer.clear();
				if ( vrController.videoCamera ){
					if ( !vrController.video.paused ){
						vrController.GLRenderer.render( vrController.videoScene, vrController.videoCamera);
					}
				}

                vrController.GLRenderer.clearDepth();
    //20221206-thonsha-add-start
                if (vrController.needsRenderTarget){
                    vrController.GLRenderer.setRenderTarget( vrController.skyRenderTarget );
                    vrController.GLRenderer.clear();
                    vrController.GLRenderer.render( vrController.onlySkyScene, vrController.vrScene.camera );
                    vrController.GLRenderer.setRenderTarget( null );
                }
    //20221206-thonsha-add-end
                vrController.GLRenderer.render( vrController.vrScene.object3D, vrController.vrScene.camera );

                if (vrController.needsCullFaceBack){
                    for(let i = 0; i <vrController.cullFaceBackScene.children.length; i++){
						let objj = document.getElementById(vrController.cullFaceBackScene.children[i]["obj_id"]).object3D;
						vrController.cullFaceBackScene.children[i].position.setFromMatrixPosition(objj.matrixWorld)
            			vrController.cullFaceBackScene.children[i].setRotationFromMatrix(objj.matrixWorld)
					}
                    
                    vrController.GLRenderer.state.setCullFace(THREE.CullFaceFront);
                    vrController.GLRenderer.render( vrController.cullFaceBackScene, vrController.vrScene.camera );
                    vrController.GLRenderer.state.setCullFace(THREE.CullFaceBack);                    
                }

                //[start-20231013-howardhsu-add]//
                //// add 2D scene
                    vrController.GLRenderer.render( vrController.scene2D, vrController.camera2D );

                // if(testCSS2D){
                //     vrController.labelRenderer.render( vrController.vrScene.object3D, vrController.vrScene.camera );
                // }

                //// for_makarSDK
                if(window.makarSDK){
                    window.makarSDK.workWithRenderTick()
                }
                //[end-20231013-howardhsu-add]//

                // console.log("renderTick");
                requestAnimationFrame(renderTick); // dont use it, because of the haning problem
            };


        }
        
    }


    let scope;
    if (typeof window !== 'undefined') {
        scope = window;
    } else {
        scope = self;
    }
    // scope.VRController = VRController;

    let integrateCount = 0;
    let integrateTick = function() {
        integrateCount++ ;
        if ( integrateCount > 3 ){
            console.log("VRFunc_cust.js: integrateTick, integrateCount=", integrateCount, ", too many times" );
            return;
        }

        if (scope.AFRAME && scope.THREE) {
            console.log("VRFunc_cust.js: integrateTick, scope=", scope , integrateCount );
            integrate();
            window.addEventListener("keyup", function(event) {
                if (event.key === 'Enter') {
                // if (event.keyCode === 13) {  //// According to MDN, event.keyCode had been Deprecated
                    event.preventDefault();
                    // getScenes();
                }
            });
        } else {
            setTimeout( function(){
                integrateTick( integrateCount );
            } , 500);
        }
    };

    if (typeof window !== 'undefined') {
        integrateTick( integrateCount );
    }

    console.log("VRFunc done, window innerWH",  window.innerWidth, window.innerHeight);

    //// 輸出文字改為由網址的頁面判斷
    let languageType = window.languageType = "tw";
    if (parent){
        let indexOfFirst = parent.location.pathname.indexOf('/', 0);
        let indexOfSecond = parent.location.pathname.indexOf('/', indexOfFirst + 1);
        let lan = parent.location.pathname.substring(1, indexOfSecond);
        if (lan == "tw" || lan == "en"){
            languageType = window.languageType = lan;
        }
    }

    let worldContent = window.worldContent = {

        userAlreadyPlayed:{tw:"此登入用戶已經遊玩過", en:"This user already played"},
        userNotLoginInfo:{tw:"必須要登入MAKAR後才可遊玩", en:"Please login at first"},
        clickToPlay:{tw:"點擊開始遊玩", en:"Click to play"},

        backToHome:{tw:"專案標題", en:"back"},
        GPSDistanceMsg:{tw:"需在GPS的範圍內才能開啟 \r\n 距離：", en:"Please to the right place"},
        GPSErrorMsg:{tw:"GPS 錯誤", en:"GPS error"},
        GPSnotSupportMsg:{tw:"沒有支援 GPS ", en:"GPS not support"},
        comfirm:{tw:"確認", en:"Comfire"},
        
    };

    if(languageType == "en"){
        //// 留下來當作範例 
        // let rs = leftTopButton.children[0].innerHTML.replace("專案標題" , worldContent.backToHome[languageType] );
        // leftTopButton.children[0].innerHTML = rs;
    }

})();