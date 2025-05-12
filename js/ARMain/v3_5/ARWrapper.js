import net from './networkAgent.js';
import { isPromise, checkDefaultObj, makeid  } from "./utility.js";
import { setARTransform } from "./arObjModules/setTransform.js";
import { loadAudio } from "./arObjModules/AudioModule.js";
// import { loadGLTFModel, loadMaterialTexture } from "./arObjModules/GLTFModelModule.js";
import { loadGLTFModel, loadWebViewNotSupport, loadWebViewNotSupport2D } from "./arObjModules/GLTFModelModule.js";
import { loadTexture3D, loadTexture2D } from "./arObjModules/ImageModule.js"; 
import { loadLight } from "./arObjModules/LightModule.js"
import { loadText3D, loadText2D } from "./arObjModules/TextModule.js";
// import { loadVideo3D, UnMutedAndPlayAllVisibleVideo, loadVideo2D, mute3dVideos, mute2dVideos, loadYouTubeNotSupport, pause2dVideos, pause3dVideos } from "./arObjModules/VideoModule.js"
import * as VideoModule from "./arObjModules/VideoModule.js"
import { loadCurve, bezierPathAnime } from "./arObjModules/CurveModule.js";
import { loadScratchCard } from "./arObjModules/ScratchCardModule.js"
import { loadPointCard } from './arObjModules/PointCardModule.js';

import { verionControl as VC } from "./MakarWebXRVersionControl.js";

// import MakarEvents from '../../../../../scripts/MakarEvents.js';

import MakarEvents from './MakarEvents.js';


//// v3.5 Quiz已被獨立出來 (在runtime可從 window.aQuizAR 取得)
import './Quiz.js';

// import './PointCard.js';

// import './ScratchCard.js';

class ARWrapper {

    constructor( makarUserData  ) {

        this.type = 'ARWrapper';

        //// 起始的資料「專案」「場景」「辨識圖」「使用者素材」「使用者線上素材」
        if ( makarUserData.oneProjData ){
            this.currentProjData = makarUserData.oneProjData
        }
        if ( makarUserData.scenesData ){
            this.scenesData = makarUserData.scenesData
        }

        if ( makarUserData.targetList ){
            this.targetList = makarUserData.targetList
        }
        if ( makarUserData.userOnlineResDict ){
            this.userOnlineResDict = makarUserData.userOnlineResDict
        }
        if ( makarUserData.userProjResDict ){
            this.userProjResDict = makarUserData.userProjResDict
        }
        if ( makarUserData.userMaterialDict ){
            this.userMaterialDict = makarUserData.userMaterialDict
        }

        let arWrapper = this;


        //// 建制此時體物件時候，同時將「 ARController 需要補完物件加入 」
        if ( window.ARController && window.THREE) {

            ARController.getUserMediaThreeScene = function(configuration) {
                let obj = {};
                for ( let i in configuration) {
                    obj[i] = configuration[i];
                }
                let onSuccess = configuration.onSuccess;
    
                obj.onSuccess = function(arController, arCameraParam) {
                    let scenes = arController.createThreeScene();
                    onSuccess(scenes, arController, arCameraParam);
                };
    
                let video = this.getUserMediaARController(obj);
                // console.log("artk.three.js: _getUserMediaThreeScene: return video(w, h):", video.videoWidth, video.videoHeight);
                return video;
            };

            ARController.prototype.createThreeScene = function(video) {
                video = video || this.image;
                
    
                this.setupThree();
    
                var videoTex = new THREE.VideoTexture(video);
                
                videoTex.minFilter = THREE.LinearFilter;
                videoTex.flipY = false;
    
                this.cameraTexture = videoTex.clone();
                this.cameraTexture.flipY = true;
    
                // Then create a plane textured with the video.
                var videoStreamPlane = new THREE.Mesh(
    

                    
                    new THREE.PlaneGeometry( videoTex.image.videoWidth, videoTex.image.videoHeight ),
    
                    // new THREE.PlaneBufferGeometry(2, 2),
    
                    new THREE.MeshBasicMaterial({map: videoTex, side: THREE.BackSide}) // DoubleSide FrontSide BackSide
                );
    
                // The video plane shouldn't care about the z-buffer.
                videoStreamPlane.material.depthTest = false;
                videoStreamPlane.material.depthWrite = false;
                videoStreamPlane.position.set(0, 0, -1 );
    
                // Create a camera and a scene for the video plane and
                // add the camera and the video plane to the scene.
    
                //// we make the aspect ratio of OrthographicCamera same as video.
                // var videoCamera = new THREE.OrthographicCamera( -1, 1, -1, 1, -1, 20000);
                // var videoCamera = new THREE.OrthographicCamera( -320/2, 320/2, -480/2, 480/2, -1, 20000);
    
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
    
    
                var videoScene = new THREE.Scene();
                videoScene.name = "videoScene";
                videoScene.add(videoStreamPlane);
                videoScene.add(videoCamera);
    
    
                var scene2D = new THREE.Scene();
                scene2D.name = "scene2D";
    
                var cssScene = new THREE.Scene();
    
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
    
    
    
                ////// camera for CSS3DRenderer, to observe the THREE CSS3DObject
                var CSScamera = new THREE.PerspectiveCamera( 45, 1.33333, 1, 20000 );  //second term(aspect) not work because we set matrixAutoUpdate = false
                // CSScamera.matrixAutoUpdate = false ;// 20190603: we cant use here, fucking wast my time 
                CSScamera.projectionMatrix.fromArray( this.getCameraMatrix() ); //// for 
    
                if (this.orientation === 'portrait') {
                    //// dont need to do that, because the video is already portrait
                    // plane.rotation.z = Math.PI/2;	
                }
        
    
    
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
                this.enableTracking = false;

                //// v3.5.0.0 在複合式專案的場景可以有多類型場景，canvas 共用，但是「畫面繪製」拆分
                //// 決定「畫面是否繪製」
                this.enableARRendering = false;


                this.needsCullFaceBack = false;
                // this.cullFaceBackScene = new THREE.Scene();
    
                var clock = new THREE.Clock();
                this.clock = clock;
    
                this.cssScene = cssScene;
    
                var self = this;

                return {

                    videoScene: videoScene,
                    scene2D: scene2D,
    
                    cssScene: cssScene,
    
                    camera: camera,
                    CSScamera: CSScamera,
                    videoCamera: videoCamera,
                    camera2D: camera2D,
                    arController: this,
                    video: video,
                    clock: clock,
                    process: function() {
                        //// 20181102Fei: the webWorker will not call this part
    
                        for (var i in self.aframeNFTMarkers) {
                            self.aframeNFTMarkers[i].object3D.visible = false;
                        }
    
                        self.process(video); //20180827-fei note: this call the .api.js: ARController.prototype.process
    
                    },
    
                    renderOn: function( GLRenderer ) {
                        videoTex.needsUpdate = true;
                        
                        GLRenderer.autoClear = false;
                        // GLRenderer.clear();
    
                        if ( !self.arScene.video.paused ){
                            GLRenderer.render(this.videoScene, this.videoCamera);
                        }
    
                        GLRenderer.clearDepth();

                        GLRenderer.render(  arfScene.object3D , arController.camera );
                        // if (arController.needsCullFaceBack){
                        //     GLRenderer.state.setCullFace(THREE.CullFaceFront);
                        //     GLRenderer.render( arController.cullFaceBackScene, arController.camera );
                        //     GLRenderer.state.setCullFace(THREE.CullFaceBack);
                        // }
    
                        GLRenderer.render(this.scene2D, this.camera2D );

                    }
                };
            };


            //// 3D 辨識圖虛擬物件
            ARController.prototype.createAframeNFTMarker = function( markerUID ) {

                //// 備註：這邊的 markerUID 基本上等同「載入辨識圖的編號」，3.5.0 改版後算是「按照順序AR場景的編號」
                //// 3.4.0 算是「按順序所有 AR 專案的辨識圖編號 」

                this.setupThree();

                let entity = document.createElement('a-entity');
                let self = this;

                // entity.setAttribute('id', self.sceneTargetList[ markerUID ].target_id );

                console.log( ' _createAframeNFTMarker_: ' , markerUID  );
                if ( self.sceneTargetList && self.sceneTargetList[ markerUID ] )	{

                    //// 這邊要紀錄 「 載入的 GCSS 與 場景的關係 」
                    let tid = self.sceneTargetList[ markerUID ].target_id;
                    entity.setAttribute('id', tid );
                    entity.GCSSID = markerUID;

                    let sIndex = self.sceneTargetList[ markerUID ].sceneIndex;

                    //// v3.5.0.0 新增 「 場景ID 」「 場景名稱 」「 場景編號 」
                    //// 統一各類型場景
                    let scenes = VC.getScenes( self.scenesData );
                    if ( Array.isArray( scenes ) && scenes[ sIndex ] ){
                        let s = scenes[ sIndex ];
                        entity.makarSceneName = s.info.name;
                        entity.makarSceneIndex = sIndex;
                        entity.makarSceneID = s.info.id ;


                        entity.setAttribute('visible', false );
                        
                        entity.loadedObjects = false; 
                        entity.showObjects = true; 
                        entity.addEventListener('loaded', function(){
                            
                            entity.object3D.matrixAutoUpdate = false;
                            entity.object3D.targetRoot = true;

                            entity.object3D.makarSceneName = s.info.name;
                            entity.object3D.makarSceneIndex = sIndex;
                            entity.object3D.makarSceneID = s.info.id ;

                        });

                        //// 先判斷「是否曾經將辨識圖物件放入場景」，會在「集點卡模組中」，第一個辨識圖以後發生
                        if ( !self.aframeNFTMarkers[ sIndex ] ){
                            console.log(' _createAframeNFTMarker_: load this scene entity ', sIndex , s );
                            self.arfScene.appendChild( entity );
                            //// 依照  複合式專案的 場景編號 為 key
                            self.aframeNFTMarkers[ sIndex ] = entity;
                            // this.aframeNFTMarkers[markerUID] = entity;
                            
                        } else {
                            console.log(' _createAframeNFTMarker_: this scene entity is already loaded ', sIndex , s );
                        }


                    }


                }


                return entity;
            };

            //// 2D 辨識圖虛擬物件
            ARController.prototype.createThreeNFTMarker2D = function(markerUID) {
                this.setupThree();

                let self = this;

                var obj2D = new THREE.Object3D();
                obj2D.visible = false;
                
                //// 在導入場景物件的時候

                if ( self.sceneTargetList && self.sceneTargetList[ markerUID ] )	{

                    let sIndex = self.sceneTargetList[ markerUID ].sceneIndex;
                    
                    //// 這邊要紀錄 「 載入的 GCSS 與 場景的關係 」
                    let tid = self.sceneTargetList[ markerUID ].target_id;
                    obj2D.targetID = tid
                    obj2D.GCSSID = markerUID;

                    obj2D.loadedObjects = false;
                    obj2D.matrixAutoUpdate = false;

                    let scenes = VC.getScenes( self.scenesData );
                    if ( Array.isArray( scenes ) && scenes[ sIndex ] ){
                        let s = scenes[ sIndex ];
                        obj2D.makarSceneName = s.info.name;
                        obj2D.makarSceneIndex = sIndex;
                        obj2D.makarSceneID = s.info.id ;

                        // this.threeNFTMarkers2D[markerUID] = obj2D;
                        //// 依照  複合式專案的 場景編號 為 key
                        // this.threeNFTMarkers2D[sIndex] = obj2D;

                        //// 先判斷「是否曾經將辨識圖物件放入場景」，會在「集點卡模組中」，第一個辨識圖以後發生
                        if ( !self.threeNFTMarkers2D[ sIndex ] ){
                            console.log(' _createThreeNFTMarker2D_: load this scene entity ', sIndex , s );

                            self.arScene.scene2D.add( obj2D );
                            //// 依照  複合式專案的 場景編號 為 key
                            self.threeNFTMarkers2D[sIndex] = obj2D;
                            
                        } else {
                            console.log(' _createThreeNFTMarker2D_: this scene entity is already loaded ', sIndex , s );
                        }

                    }


                }


                return obj2D;
            }

            //[start-20231220-renhaohsu-modify]//
            //// for 2D scene
            ARController.prototype.get2DScaleRatio = function(){

                let self = this;
        
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
                //// 3.5.0.0 之後 editor_version 是物件型式
                if ( Object.keys( this.editor_version ).length == 4 ){
                    let largeV  = Number( this.editor_version.v0 );
                    let middleV = Number( this.editor_version.v1 );
                    let smallV  = Number( this.editor_version.v2 );	
                    
                    //[start-20231024-howardhsu-modify]//
                    if ( largeV>3 || (largeV==3 && middleV>4) ){
                        resolutionString = getResolution350()
                    }else{
                        // resolutionString = getResolution330();
                    }
                }else{
                    resolutionString = getResolution350()
                    //[end-20231024-howardhsu-modify]//
                }
                
                //[start-20230818-howardhsu-modify]//
                function getResolution350(){
        
                    let tempR = '';
        
                    //// 當前用戶畫面大小， PC: w*600 mobile: w*300(?)
                    let userWidth = self.arScene.clientWidth;
                    let userHeight = self.arScene.clientHeight;
        
                    // if ( self.scenesData && Array.isArray(self.scenesData.scenes[0].orientation) ){
                    if ( makarUserData.oneProjData && Array.isArray(makarUserData.oneProjData.orientation) ){
                        let screenList = makarUserData.oneProjData.orientation;
                        
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
                        console.log(' _getResolution350: ' , minScore , selectedResolutionIndex , selectResolution , tempR );
        
                    }
                    
                    return tempR;
        
                }        
                //[end-20230818-howardhsu-modify]//
        
                if ( resolutionString == ''){
                    console.log(' _get2DScaleRatio: fucking lose resolutionString '); 
                    //[start-20240118-renhaohsu-add]//
                    self.selectedResolutionIndex = 0
                    //[end-20240118-renhaohsu-add]//
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
                            console.log(' _loadTexture2D: 1 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
                        }else{
                            let rw = userWidth;
                            let rh = userWidth * ( idealHeight / idealWidth );
        
                            let d1 = ( userWidth / ( userHeight * ( cameraWidth / cameraHeight ) ) );
                            let d2 = ( rh / userHeight ) 
                            let d3 = ( rw / idealWidth );
        
                            scaleRatioXY = d3;
                            console.log(' _loadTexture2D: 2 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
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
                            console.log(' _loadTexture2D: 3 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
                            
                        } else {
                            let rw = userWidth ;
                            let rh = userWidth * ( idealHeight / idealWidth );
                            let d1 =  ( userHeight / ( userWidth * ( cameraHeight / cameraWidth ) ) )
                            let d2 = ( rh / userHeight ) 
                            let d3 = ( rw / idealWidth );
        
                            scaleRatioXY =  d3;
                            console.log(' _loadTexture2D: 4 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
                        }
        
                    }
        
                } else {
                    console.log(' fucking lose resolutionString '); 
                }
                
                // console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY , ', cwh' , cameraWidth , cameraHeight );
                console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY );
        
                return scaleRatioXY;
            }

            ARController.prototype.set2DScaleRatio = function( scaleRatioXY ){
                this.scaleRatioXY = scaleRatioXY;
            }
            //[end-20231220-renhaohsu-modify]//
            
            /*
                依照「不同場景」載入「對應場景內容」
                這邊預計只依照「場景編號」來「載入對應場景」
                輸入參數：
                    sceneIndex: 場景編號
                    scene3DRoot: 3D 空間 的母物件，可能是 scene 本體
                    scene2DRoot: 2D 空間 的母物件，可能是 scene 本體
            */  
            //[start-20231123-renhaohsu-modify]//
            ARController.prototype.loadMakarARScene = function( sceneIndex , scene3DRoot , scene2DRoot, targetID ){
                let self = this;
                
                //[start-20231220-howardhsu-add]//
                //// 判定「版本」
                let editor_version = VC.getProjDataEditorVer( self.currentProjData );

                //// 紀錄「當前使用的版本」
                self.editor_version = editor_version;
                    
                //// 如果以後 AR 要清除遊玩中的 Quiz 物件 應該可以加在這裡
                // window.aQuizAR.clear();
                // window.aQuizAR.scene3DRoot = scene3DRoot
        
                ///// 20231220 推測放在這裡可以   載入相機完成之後，設定對應 物件放大比例
                let  sr2D = this.get2DScaleRatio();
                this.set2DScaleRatio( sr2D ) ;
                //[end-20231220-howardhsu-add]//

                //// 每次載入專案，檢查各個 專案 是否有建立過 「群組事件列表」跟「注視事件列比」
                if ( !self.groupEventTargetDict[ sceneIndex ] ){
                    self.groupEventTargetDict[ sceneIndex ] = JSON.parse( JSON.stringify( self.groupDict ) );
                }else{
                    console.log('_loadMakarARScene_: _groupEventTargetDict: already exist ' , sceneIndex );
                }
                
                // if ( !self.lookAtTargetDict[ sceneIndex ] ){
                //     self.lookAtTargetDict[ sceneIndex ] = [];
                // }else{
                //     console.log('_loadMakarScene: _groupEventTargetDict: already exist ' , sceneIndex );
                // }
                
                if ( !self.lookAtTargetTimelineDict[ sceneIndex ] ){
                    self.lookAtTargetTimelineDict[ sceneIndex ] = [];
                }else{
                    console.log('_loadMakarScene: _groupEventTargetDict: already exist ' , sceneIndex );
                }
                
                
                let scene_objs = VC.getSceneObjs( self.scenesData , sceneIndex );

                //// v3.5.0.0 新增
                //// 取得「所有事件」
                let scene_behavs = self.scenesData.scenes[ sceneIndex ].behav ;
                
                //// 處理「 事件 群組物件 」
                //// renhaohsu 覺得要問一下是否把它放到 arController 
                // self.setBehavsGroup( scene_behavs , sceneIndex );
                arWrapper.setBehavsGroup( scene_behavs , sceneIndex );
                
                
                let pObjs = [];
                
                for ( let i = 0; i < scene_objs.length; i++ ){
                    
                    let scene_obj = scene_objs[i];
                    
                    
                    //// 取得事件，依照 3.4.0 架構，掛載到「場景物件之下」
                    VC.setBehavIntoObj( self.scenesData , sceneIndex , scene_obj )
                    
                    //// 取得基本 transform 資料。 第一個參數只是為了取得「版本」
                    let objTranform = VC.getObjTransform( self.scenesData , scene_obj);
                    let position = objTranform.position;
                    let rotation = objTranform.rotation;
                    let scale = objTranform.scale;
                    let quaternion = objTranform.quaternion;
                    
                    //// renhaohsu 覺得要問一下是否把它放到 arController 
                    // self.setObjBehav( scene_obj , scene_behavs );
                    arWrapper.setObjBehav( scene_obj , scene_behavs );
                    
                    
                    // console.log(' _loadMakarARScene_: objTranform ', i , scene_obj , objTranform );
                    
                    //// 從「使用者上傳素材庫」跟「使用者線上素材庫」跟「預設素材」 中查找與場景物件相關連
                    let userProjResDict = self.userProjResDict;
                    let userOnlineResDict = self.userOnlineResDict;
                    
                    
                    //// get main_type by user resource 
                    if( userProjResDict[ scene_obj.res_id ] && userProjResDict[ scene_obj.res_id ].main_type ){
                        scene_obj.main_type = userProjResDict[ scene_obj.res_id ].main_type
                    } else if( userOnlineResDict[ scene_obj.res_id ] && userOnlineResDict[ scene_obj.res_id ].res_url) {
                        scene_obj.main_type = userOnlineResDict[ scene_obj.res_id ].main_type
                    } else {
                        //// userProjResDict usually does not contain Light, Text objects. Recognize them with res_id:
                        //// in ver. 3.5: if main_type does not exist, could be default objects
                        // checkDefaultImage( scene_obj )
                        
                        checkDefaultObj( scene_obj )
                        
                    }
                    
                    
                    //// get sub_type by user resource
                    if( userProjResDict[ scene_obj.res_id ] && userProjResDict[ scene_obj.res_id ].sub_type ){
                        scene_obj.sub_type = userProjResDict[ scene_obj.res_id ].sub_type
                    } else if( userOnlineResDict[ scene_obj.res_id ] && userOnlineResDict[ scene_obj.res_id ].res_url) {
                        scene_obj.sub_type = userOnlineResDict[ scene_obj.res_id ].sub_type
                    } else {
                        //// console.log("sub_type does not exist in user resource, deal with it later (in the switch block right below.)")
                    }
                    
                    
                    //// get res_url by user resource 
                    if( userProjResDict[ scene_obj.res_id] && userProjResDict[ scene_obj.res_id ].res_url ){
                        scene_obj.res_url = userProjResDict[ scene_obj.res_id ].res_url
                    } else if( userOnlineResDict[ scene_obj.res_id ] && userOnlineResDict[ scene_obj.res_id ].res_url) {
                        scene_obj.res_url = userOnlineResDict[ scene_obj.res_id ].res_url
                    } else {
                        console.log("_loadMakarARScene_: res_url does not exist. obj=", scene_obj )
                    }

                    // get default_shader_name by user resource
                    if( userProjResDict[ scene_obj.res_id] && userProjResDict[ scene_obj.res_id ].default_shader_name ){
                        scene_obj.default_shader_name = userProjResDict[ scene_obj.res_id ].default_shader_name
                    } else if( userOnlineResDict[ scene_obj.res_id ] && userOnlineResDict[ scene_obj.res_id ].default_shader_name) {
                        scene_obj.default_shader_name = userOnlineResDict[ scene_obj.res_id ].default_shader_name
                    } else {
                        console.log("_loadMakarARScene_: default_shader_name does not exist. obj=", scene_obj )
                    }
                    
                    
                    //// 取得物件的「 2D/3D  」
                    let obj_type = VC.getObjObjType( self.scenesData , scene_obj )
                    
                    
                    
                    
                    //// 開始進入「載入各類型 物件」
                    switch( scene_obj.main_type ){  
                        
                        case "camera":

                            break;
                        
                        case "image":
                            console.log(' _ARWrapper: load image ' , i , obj_type , scene_obj );
                            
                            //[start-20231110-howardhsu-modify]//
                            let pTexture;
                            if ( obj_type == '3d' ){
                                pTexture = self.loadTexture3D( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                            } else if ( obj_type == '2d' ){
                                pTexture = self.loadTexture2D( scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale )
                            } else {
                                console.log("VRController.js: _loadSceneObjects: image obj_type=", obj_type)
                            }
                            pObjs.push( pTexture );

                            break;
                            
                        case "video":
                            console.log(' _ARWrapper: load video ' , i , obj_type , scene_obj );
                            
                            if ( scene_objs[i].sub_type == 'mp4' ){
                                let pVideo;
                                if ( obj_type == '3d' ){                                
                                    pVideo = self.loadVideo3D( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                                } else if ( obj_type == '2d' ){
                                    pVideo = self.loadVideo2D( scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale )
                                } else {
                                    console.log("VRFunc.js: _loadSceneObjects: video obj_type=", obj_type)
                                }
                                pObjs.push( pVideo );
                            } else if ( scene_objs[i].sub_type == "youtube" ){
                                console.log("makar webXR currently does not support yt video, please wait until next update.")
                                
                                if ( obj_type == '3d' ){
                                    self.loadYouTubeNotSupport(scene3DRoot, scene_obj, i, scene_objs.length, position, rotation, scale, quaternion)
                                } else if ( obj_type == '2d' ){
                                    self.loadYouTubeNotSupport2D(scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale)
                                } else {
                                    console.log("VRController.js: _loadSceneObjects: yt video obj_type=", obj_type)
                                }
                            }        

                            
                            break;
                            
                        case "text":
                            
                            let pText;
                            if ( obj_type == '3d' ){                                
                                pText = self.loadText3D( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                            } else if ( obj_type == '2d' ){
                                pText = self.loadText2D( scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale )    
                            } else {
                                console.log("VRFunc.js: _loadSceneObjects: text obj_type=", obj_type)
                            }                    
                            pObjs.push( pText );
                            
                            break;
                            
                        case "model":
                            console.log(' _ARWrapper: load model ' , i , obj_type , scene_obj );
                            
                            if ( scene_obj.res_id == "WebView"){
                                console.log("webview obj", scene_obj)
                                if(obj_type == '3d'){
                                    // self.loadWebViewNotSupport(scene_objs[i], position, rotation, scale , self.cubeTex );
                                    self.loadWebViewNotSupport(scene3DRoot, scene_obj, i, scene_objs.length, position, rotation, scale, quaternion)

                                } else if(obj_type == '2d'){
                                    self.loadWebViewNotSupport2D(scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale)

                                    // self.loadWebViewNotSupport2D(scene_obj, i, scene_objs.length, position, rotation, scale , self.cubeTex );
                                } else {

                                }

                            } else if ( obj_type == '3d' ){
                                
                                // let pMaterial = self.loadMaterialTexture(scene_obj);
                                // pObjs.push( pMaterial );
                                let pModel = self.loadGLTFModel( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                                pObjs.push( pModel );
                            }
                            
                            break;

                        case "curve":

                            if (obj_type == '3d'){
                                let pCurve = self.loadCurve( scene3DRoot, scene_obj, position, rotation, scale, quaternion);
                                pObjs.push( pCurve );
                            }

                            break;

                        case "audio":
                            if ( scene_obj.sub_type == "mp3" || scene_obj.sub_type == "wav" ||  scene_obj.sub_type == "ogg" ){
                                
                                let pAudio = self.loadAudio( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                                pObjs.push( pAudio );
                                
                            }
                            
                            break;
                        
                        case "light":
                            console.log(' _ARWrapper: load light ' , i , obj_type , scene_obj );
                            let pLight = self.loadLight( scene3DRoot , scene_obj , position, rotation, scale , quaternion );
                            pObjs.push( pLight );
                            
                            break;

                        case "empty":
                            const proj_id = self.currentProjData.proj_id;

                            //// 之後空物件會有其他用途，目前大多
                            switch (scene_objs[i].sub_type){        
                                case "quiz":
                                    //[start-20240131-howardhsu-modify]//	
                                    //// 當user沒有在編輯器設定題目順序時 直接不載入 也不顯示html ui
                                    if(!scene_objs[i].typeAttr.module.display_order_list){
                                        console.log("%c _arController _loadMakarARScene: user has not set display_order_list. obj.typeAttr.module=", "color:Salmon", scene_objs[i].typeAttr.module)
                                        break;
                                    }

                                    if(scene3DRoot){
                                        scene3DRoot.module = "Quiz"; 
                                        scene3DRoot.loadModule = "quiz";
                                    } else if (scene2DRoot){
                                        scene2DRoot.module = "Quiz"; 
                                        scene2DRoot.loadModule = "quiz"
                                    }

                                    //// 開發中，檢查內容，填值 (確認有填則移除) : editor在多選按鈕的obj_parent_id沒填值 幫補上
                                    let question_list = scene_objs[i].typeAttr.module.question_list
                                    question_list.forEach( q => {
                                        let btnJson = q.options_json.find( o => o.res_id == "Button") 
                                        if( btnJson ){
                                            if( !btnJson.generalAttr.obj_parent_id ){
                                                btnJson.generalAttr.obj_parent_id = scene_objs[i].generalAttr.obj_id
                                                console.log("%c 多選按鈕 btnJson", "color: tomato", btnJson)
                                            }                                            
                                        }
                                    })
                                    //// v3.5.0.0 的 quiz 在 "實際要顯示" 的時候才加入 makarObjects
                                            
                                    //// 把需要的資料傳給 aQuizMix 判斷是否顯示quiz
                                    const login_id = localStorage.getItem("MakarUserID")
                                    let transformData = { "position": position, "rotation": rotation, "scale": scale, "quaternion": quaternion }

                                    let dpi = self.gcssTargets.dpi[ scene3DRoot.GCSSID] ; 
                                    let GCSSWidth= self.gcssTargets.width[ scene3DRoot.GCSSID] ; 
                                    let GCSSHeight= self.gcssTargets.height[ scene3DRoot.GCSSID] ; 
                                    const panByScene3DRoot =  { "dpi": dpi, "GCSSWidth": GCSSWidth, "GCSSHeight": GCSSHeight }
                                    transformData.panByScene3DRoot = panByScene3DRoot
                                    
                                    const startQuiz = document.getElementById("startQuiz");	
                                    const QuizStartButton = document.getElementById("QuizStartButton");
                                    const QuizStartContent = document.getElementById("QuizStartContent");
                                    const UIs = { "startQuiz": startQuiz, "QuizStartButton": QuizStartButton, "QuizStartContent": QuizStartContent }

                                    //// 依照 force_login, allow_retry, trigger_type, 使用者是否已登入 共2^4種情況 決定是否顯示quiz。 (給html UI綁上事件 點擊才顯示quiz)
                                    const _pQuizCheckRecords = window.aQuizAR.loadQuiz( scene3DRoot, scene2DRoot, scene_objs[i], transformData, proj_id, login_id, UIs, self.worldContent, self.languageType )

                                    //// 依 後端api 或 mDB 決定是否顯示html UI  (如果有 "直接顯示" 的quiz)
                                    pObjs.concat(_pQuizCheckRecords)
                                    //[end-20240131-howardhsu-modify]//	
                                    
                                    console.log("VRFunc.js: _loadSceneObjects: empty, quiz ", i, scene_objs[i] );

                                    break;

                                //[start-20240301-renhaohsu-modify]//
                                //// v3.5.0.0 集點卡
                                case "point_card":
                                    if( scene_obj.res_id != "point_card"){
                                        break;
                                    }

                                    if( !scene_obj.typeAttr.module ){
                                        break;
                                    }

                                    ////// 假如沒有 mdb 則流程不能玩 
                                    if (!parent.mdb){
                                        // return [];
                                        break;
                                    };
                                    
                                    //// 在editor若沒開啟顯示，直接跳過不載入
                                    if (!scene_obj.generalAttr.active){
                                        break;
                                    }

                                    let pPointcard = self.loadPointCard(scene2DRoot, scene_obj, i, scene_objs.length, targetID)
                                    pObjs.push( pPointcard );
                                    // //[end-20240301-renhaohsu-modify]//
                                    
                                    break;

                                case "scratch_card":

                                    console.log("ARWrapper.js: _loadMakarARScene: scratch_card ", i, scene_obj );
                                    if(scene_obj.res_id == "scratch_card" && scene_obj.typeAttr.module){
                                        ////// 假如沒有 mdb 則流程不能玩 
                                        if (!parent.mdb){
                                            // return [];
                                            break;
                                        };
                                        
                                        let pScratch = self.loadScratchCard( scene2DRoot, scene_obj, i, scene_objs.length, position, rotation, scale );
                                        pObjs.push( pScratch );

                                    }

                                    break;

                                default:
                                    console.log("VRFunc.js: _loadSceneObjects: empty object default, ", i, scene_objs[i] );
                            }

                            break;

                        default:
                            console.log(' _ARWrapper: load default ' , i , obj_type , scene_obj );
                    }
                
                }

                return pObjs;                
            }
            //[end-20231123-renhaohsu-modify]//

            ARController.prototype.setupThree = function() {

                if (this.THREE_JS_ENABLED) {
                    return;
                }
                this.THREE_JS_ENABLED = true;
    
                let self = this;
    
                ////
                //// 3.5.0 改版，預期所有跟著「 arController 的 變數/物件 」都必須要再這邊設定
                ////
    
                //// 當前選定的 場景編號
                this.currentSceneIndex = null;

                //// 當前的 辨識圖 編號
                this.currentTargetIndex = null;

                ////當前的 辨識圖 ID
                this.currentTargetID = null;
    
                //// 紀錄專案起始時間
                this.projStartTimeList = [];
    
                //// 紀錄使用者 開始體驗時間
                this.userStartTime = new Date().getTime();;

                //// 當前觀看模式 「AR觀看 」(AR) 「模型觀看」(model)
                this.currentViewMode = null;
    
    
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
    
                //// ios safari 複數影片播放時 只能讓1個影片有聲音 其他靜音
                this.safariUnMutedVideo = null;
                
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

                this.materials_texture_dict = {};

                this.init_gyro = null;
                this.intervalList = [];

                this.previousSceneIdx = -1;
                this.previousTargetID = -1;
    
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
                // this.lookAtTargetDict = {};
                // this.lookAtObjectList = [];
                this.lookAtTargetTimelineDict = {};
    
                this.gcssTargets = { a: 123 };



                //// 載入所有辨識圖完成，取得「辨識圖相關資料」
                this.addEventListener('loadNFTDone', function(ev) {
                    self.gcssTargets = ev.data;
                });

                

                //// 著色相關
                this.addEventListener('getFrameTarget', function(ev) {  // wait from artk.proxy.js   
                    console.log('three.js, listened getFrameTarget, ev=', ev );
    
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
                        // let obj2D =  this.threeNFTMarkers2D[ ev.data.index ];
                        // let objCSS = this.threeNFTMarkersCSS[ ev.data.index ];
    
                        let obj =    this.aframeNFTMarkers[ self.sceneTargetList[ev.data.index].sceneIndex ];
                        let obj2D =  this.threeNFTMarkers2D[ self.sceneTargetList[ev.data.index].sceneIndex ];
    
                        console.log('artk.three.js, listened getFrameTarget, obj=', obj, "\nobj2D=", obj2D );
                        console.log(' ************* ' , ev.data.index , self.sceneTargetList[ev.data.index] );
    
                        //// 紀錄「著色狀態」為「使用者填入」  // -1: 尚未啟動   0: 標準白色底圖    1: 使用者填入底圖  
                        obj.coloringStatus = 1;
    
                        obj.loadModel = true; //// set the _loadModel, then call _loadMakarScene to load the 3D model
    
                        // self.loadMakarScene( ev.data.index , obj , obj2D, objCSS );
    
                        let sceneIndex = self.sceneTargetList[ ev.data.index ].sceneIndex;
                        let targetID = self.sceneTargetList[marker.id].target_id
                        let pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, targetID );                  

                    }
    
                });

                this.checkColoring = function( targetIndex, obj, obj2D, allowColor){ // -1: not the coloring module, 0: coloring module and not loadModel, 1: coloring module and already loadModel
				
                    let i = self.sceneTargetList[ targetIndex ].sceneIndex;
                    
                    //// v3.5.0 ，模組資料 在 場景層級
                    // let i = self.sceneTargetList[ targetIndex ].sceneIndex;

                    if ( self.sceneTargetList[ targetIndex ].modules.includes('coloring') ){

                    // if (window.sceneResult[i].module == "coloring" ){ //// check project

                        if (obj.loadModel != true){ //// if the 3D model doesnt load, control the coloredPlane and colorButton, and return 0
    
                            if (allowColor == 1){ //// check the target is colorable
                                    
                                for (let j in obj.object3D.children ){ //// loop all children to find the "coloring" plane
                                    if (obj.object3D.children[j].name == "coloredPlane" ){
                                        obj.object3D.children[j].material.color.r = 0;
                                        obj.object3D.children[j].material.color.g = 1;
                                    }
                                }
    
    
                                for (let k in obj2D.children ){
                                    if (obj2D.children[k].name == "colorButton"){
                                        obj2D.children[k].material.opacity = 1.0;
                                        obj2D.children[k].behav[0].enable = true;
                                    }
                                }
                            }else{
        
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
    


                //// 辨認或是追蹤到辨識圖

                this.addEventListener('getNFTMarkerDraw', function(ev) { //wait from artk.proxy.js or artk.api.js, to draw object

                    let marker = ev.data.marker;
                    
                    // console.log(' _getNFTMarkerDraw_ ' , marker , self.sceneTargetList[marker.id] );
    
    
                    let obj =    this.aframeNFTMarkers[  self.sceneTargetList[marker.id].sceneIndex ];
    
                    let obj2D =  this.threeNFTMarkers2D[  self.sceneTargetList[marker.id].sceneIndex ];
    
                    let pAll = [];

                    if (obj) {
    
    
                        if( !obj.loadedObjects ||  !obj2D.loadedObjects ){ //// 20190615 add the obj2D 
                            
                            // 第一次載入模型時暫停辨識，等到載入完成才開啟辨識流程
                            self.enableTracking = false;   

                        // if( !obj.loadedObjects ){
                            //// 不能讓場景重複載入，改為則直接設定
                            obj.loadedObjects = obj2D.loadedObjects = true;
    
                            //// 當前聲音與影片在手機上播放是需要「使用者互動」，固假如之前有專案帶有「影片」「聲音」，且尚未「確認播放聲音」，則會留下滿板同意視窗。
                            //// 無條件隱藏此視窗，並且取消騎觸發事件
                            let clickToPlayAudio = document.getElementById("clickToPlayAudio");
                            clickToPlayAudio.style.display = "none";
                            clickToPlayAudio.onclick = null;

                            // let i = ev.data.marker.id;
    
                            //// v3.5.0 改版中 ... 
    
                            // if ( Array.isArray(  publishARProjs.proj_list ) &&  Array.isArray(publishARProjs.proj_list[i].loc)){
                            //     if ( publishARProjs.proj_list[i].loc.length > 1 && publishARProjs.proj_list[i].module_type.find(function(item){return item == "gps";})  ){
    
                            if ( Array.isArray( self.currentProjData.loc ) && self.currentProjData.loc.length > 0 ){

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
                                        console.log("three.js: _calculateGeosToDistanceHaversine dist=", dist );
                                        return dist;
                                    }
                                }
                                warnButtonTitle.textContent = self.worldContent.comfirm[languageType];

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

                                        let dist = calculateGeosToDistanceHaversine(geoPosition.coords.latitude, geoPosition.coords.longitude , self.currentProjData.loc[0] , self.currentProjData.loc[1] );

                                        getViewerConfig( serverUrl , function(viewerConfig){
                                            if (dist < viewerConfig.data.gps_range_distance  ){
                                                
                                                // let pAll = self.loadMakarScene( marker.id, obj , obj2D, objCSS );

                                                let sceneIndex = self.sceneTargetList[marker.id].sceneIndex;
                                                let targetID = self.sceneTargetList[marker.id].target_id
                                                pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, targetID );

                                                let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                                if ( isPromise( pXML ) ){
                                                    pAll.push( pXML );
                                                }

                                                // let cIndex = self.sceneTargetList[marker.id].projIndex;
                                                // if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
                                                // {	
                                                // 	console.log('three.js: _getNFTMarkerDraw: _GPS get _logic xml ' , cIndex , publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  );
                                                // 	let pXML = self.parseLogicXML( cIndex , 0 );
                                                // 	pAll.push( pXML );
                                                // }

                                                // if ( Array.isArray(pAll) ){
                                                //     Promise.all( pAll ).then( function( ret ){
                                                //         console.log('three.js: _getNFTMarkerDraw: _GPS _loadMakarScene done: ret = ' , ret  );
                                                //         if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && 
                                                //         publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
                                                //         {
                                                //             setTimeout( function(){
                                                //                 self.logicList[ cIndex ].parseXML();
                                                //                 if ( obj.targetState == 0 ){
                                                //                     self.logicList[ cIndex ].stopLogic();
                                                //                 }

                                                //                 self.setupSceneBehav( i );

                                                //             }, 1 );
                                                //         }
                                                //     });
                                                // }

                                            }else{
                                                console.log("three.js: showProjectInfo: get Geolocation distance not allow",  dist );
                                                warnModal.style.display = "block";
                                                warnModalInfo.textContent = self.worldContent.GPSDistanceMsg[languageType] + Math.floor(dist) + " meter" ;
                                            }
                                        });
                                    }
                                    function geoError(err){
                                        console.log("three.js: showProjectInfo: get Geolocation err=.",  err , err.code , err.message );
                                        warnModal.style.display = "block";
                                        warnModalInfo.textContent = self.worldContent.GPSErrorMsg[languageType] + "\r\n" + err.message;		
                                    }
                                } else {
                                        console.log("three.js: showProjectInfo: Geolocation is not supported by this browser.");
                                        warnModal.style.display = "block";
                                        warnModalInfo.textContent = self.worldContent.GPSnotSupportMsg[languageType] ;									
                                }

                            }else{	

                                // let pAll = self.loadMakarScene( marker.id, obj , obj2D, objCSS );

                                let sceneIndex = self.sceneTargetList[marker.id].sceneIndex;
                                let targetID = self.sceneTargetList[marker.id].target_id
                                pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, targetID );                                
                                
                                //// 圖像辨識到，第一次，開啟載入中畫面
                                let homePage = document.getElementById('homePage');
                                homePage.style.display = 'flex';

                                let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                if ( isPromise( pXML ) ){
                                    pAll.push( pXML );
                                }

                                // let cIndex = self.sceneTargetList[marker.id].projIndex;
                                // if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
                                // {	
                                // 	console.log('three.js: _getNFTMarkerDraw: get _logic xml ' , cIndex , publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  );
                                // 	let pXML = self.parseLogicXML( cIndex , 0 );
                                // 	pAll.push( pXML );
                                // }

                                if ( Array.isArray(pAll) ){
                                    Promise.all( pAll ).then( function( ret ){
                                        console.log('three.js: _getNFTMarkerDraw _loadMakarScene done: ret = ' , ret  );

                                        //// 關閉載入中畫面
                                        homePage.style.display = 'none';

                                        // 第一次載入模型時暫停辨識，等到載入完成才開啟辨識流程
                                        self.enableTracking = true;

                                        let scenes = [];
                                        scenes = VC.getScenes( self.scenesData );

                                        if ( scenes[self.currentSceneIndex].bezier.length > 0 ){
                                            for (let i = 0; i < scenes[self.currentSceneIndex].bezier.length;i++){
                                                self.bezierPathAnime( obj, scenes[self.currentSceneIndex].bezier[i], self.currentSceneIndex );
                                            }
                                        }

                                        // if ( parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84" ) ){
                                        let sendData = {
                                            user: "ARWrapper", 
                                            type: 'cust_proj_scene_done', 
                                            data: {}
                                        }
                                        window.postMessage( JSON.stringify(sendData) , location.origin );
                                        // }

                                        //// 假如此專案的當前場景有「場景事件」，解析並且執行功能
                                        // if (scenes[sceneIndex].behav.length > 0){
                                        //     self.activeSceneEvent(scenes[sceneIndex]);
                                        // }
                                       

                                        // if ( Array.isArray( publishARProjs.proj_list[ cIndex ].xml_urls ) && 
                                        // publishARProjs.proj_list[ cIndex ].xml_urls[ 0 ]  )
                                        // {
                                        //     setTimeout( function(){
                                        //         self.logicList[ cIndex ].parseXML();
                                        //         if ( obj.targetState == 0 ){
                                        //             self.logicList[ cIndex ].stopLogic();
                                        //         }

                                        //         self.setupSceneBehav( i );

                                        //     }, 1 );

                                        // }
                                    });
                                }

                            }
                        }
                            
                        // if (marker.found == 1){ // tracking ..
                        if (marker.found > 0 ){ // recognize or tracking ..


                            self.currentSceneIndex = self.sceneTargetList[ marker.id ].sceneIndex;
                            self.currentTargetID = self.sceneTargetList[ marker.id ].target_id;

                            //// for the modules , now only coloring
                            if (marker.found == 2){ //// 0: lost, 1:recognize, 2:tracking
    
                                //// 紀錄「辨識圖狀態」, 0: lost, 1: recognize, 2: tracking.
                                obj.targetState = 2;

                                // let scenes = [];
                                // scenes = VC.getScenes( self.scenesData );

                                // if ( scenes[self.currentSceneIndex].bezier.length > 0 ){
                                //     for (let i = 0; i < scenes[self.currentSceneIndex].bezier.length;i++){
                                //         bezierPathAnime( arController, scenes[self.currentSceneIndex].bezier[i] );
                                //     }
                                // }
    
                                //// 假如有「邏輯功能」，啟動
                                if ( self.logicList[ self.currentSceneIndex ]  ){
                                    // console.log( "ARcontroller _setupThree, logicSystemState=", self.logicList[ self.currentSceneIndex ].logicSystemState )
                                    if ( self.logicList[ self.currentSceneIndex ].logicSystemState == 0 ){
                                        self.logicList[ self.currentSceneIndex ].parseXML();
                                    }
                                }
    
    
                                //// -1: not the coloring module, 0: coloring module and not loadModel, 1: coloring module and already loadModel

                                var isLoadModel = this.checkColoring( self.sceneTargetList[marker.id].targetIndex , obj, obj2D, ev.data.marker.allowColor );

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
                                
                                // addScanTimesByTargetID(window.serverUrl, publishARProjs.user_id, self.sceneTargetList[marker.id].target_id );
    
                                //// if there is previous scene loaded, clear it, make the GL object visible false and deal the module in dom.  

                                //[start-20231207-howardhsu-modify]//
                                Promise.all( pAll ).then( value => {      
                                    if(self.init_gyro == null){
                                        let cameraForGyro = document.getElementById("cameraForGyro");
                                        self.init_gyro = cameraForGyro.components["look-controls"].magicWindowAbsoluteEuler.clone();
                                    }          
                                    // console.log("_activeAndClearScene")
                                    //// 這個 this 是 ARController
                                    this.activeAndClearScene( this.sceneTargetList[ marker.id ].sceneIndex , this.sceneTargetList[ marker.id ].target_id );

                                    this.previousSceneIdx = this.currentSceneIndex;
                                    this.previousTargetID = this.currentTargetID;

                                    //[start-20240614-renhaohsu-add]//
                                    //// 20240614 再次為了safari重複把所有影片都靜音並播放
                                    if (window.Browser){
                                        if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                        // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                            
                                            //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                            self.mute3dVideos(true)
                                            self.mute2dVideos(true)
                                            
                                            self.UnMutedAndPlayAllVisibleVideo();
                                        } else {
                                            // console.log("載完了")
                                        }
                                    }
                                    //[end-20240614-renhaohsu-add]//
                                    
                                    //// v3.5.0.0 為 "點擊物件開啟"的quiz 的啟動物件 加上 behav
                                    // this.addBehavToQuizTriggerObj()
                                    //// v3.5.0.0 如果有quiz是"直接顯示" 則顯示 html UI (startQuiz)
                                    // aQuizAR.checkIfQuizOpenDirectly()
        
                                }).catch((err) => {
                                    console.warn('ARController.js  load scene  error:', err)
                                });
                                //[end-20231207-howardhsu-modify]//

                                
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
    
                            }
    
                            //// check and tune the obj visible or not here, instead of in artk.proxy.js.
                            //// Base on 3D objects, because there are default 2D objects need show.
    
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
    
                            var isShowModel = this.checkColoring( ev.data.marker.id, obj, obj2D, 0 ); // for the coloring module
    
                            if ( obj.showObjects == true  ){
                            // if ( isShowModel == 1 || obj.showObjects == true  ){
    
                                //// 紀錄「辨識圖狀態」, 0: lost, 1: recognize, 2: tracking.
                                obj.targetState = 0;

    
                                //// 假如有邏輯功能，必須停止。
                                if ( arController.logicList[ arController.currentSceneIndex ]  ){
                                    //// 邏輯物件
                                    let logic = arController.logicList[ arController.currentSceneIndex ];

                                    //// 客製化: 原本在 Lost 時候，會停止邏輯功能。特定專案移除。
                                    //// 【客製化  - 遠東專案 】 記得未來移除
                                    //// 【客製化 - 農業局 2025 】，
                                    if ( parent && parent.location && 
                                        //// 遠東
                                        parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/8496ede3-0073-4b76-aba9-1c071f763dfc" ) ||
                                        parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/6a77cc74-6262-4315-824b-3b9040afb1e7" ) ||
                                        parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/4c67db1e-ac12-461d-a1e3-a28219336bc4" ) ||
                                        parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/5b1d36fa-97b6-4092-81d2-110557866856" ) ||
                                        parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/a17b0249-4357-4fc8-bdcf-4881f2b9d01f" ) ||
                                        parent.location.pathname.includes( "/fefe/9d3d4900-6be7-4bcc-b25a-4bc1030df6a0" )
                                    ){
                                        if ( logic.logicSystemState == 0 ){
                                            logic.parseXML();
                                        }

                                        if ( !arController.cust_feibxr ){
                                            arController.cust_feibxr = true;

                                            makarUserData.scenesData.scenes[0].objs.forEach( e=>{
                                                if ( e.generalAttr && e.generalAttr.obj_name && 
                                                    e.generalAttr.obj_id && (
                                                        e.generalAttr.obj_name.includes('water2') ||
                                                        e.generalAttr.obj_name.includes('w1') ||  
                                                        e.generalAttr.obj_name.includes('w2') ||  
                                                        e.generalAttr.obj_name.includes('w3') ||  
                                                        e.generalAttr.obj_name.includes('m1') ||  
                                                        e.generalAttr.obj_name.includes('m2') ||  
                                                        e.generalAttr.obj_name.includes('wi1') ||  
                                                        e.generalAttr.obj_name.includes('hu1') ||  
                                                        e.generalAttr.obj_name.includes('ch1') ||  
                                                        e.generalAttr.obj_name.includes('ow1') ||  
                                                        e.generalAttr.obj_name.includes('oh1')  
    
                                                    )
                                                ){

                                                    // console.log( e.generalAttr.obj_name )

                                                    let obj_id = e.generalAttr.obj_id ;
                                                    let obj = document.getElementById( obj_id );
                                                    if ( obj && obj.object3D && obj.object3D.type == 'Group' ){
                                                        obj.object3D.traverse( c =>{
                                                            if ( c.isMesh && c.name == 'Water' ){
                                                                // console.log( c.name )
                                                                c.material.color = new THREE.Color( 0 , 187/255 , 1);
                                                                c.material.metalness = 0;
                                                                c.material.roughness = 1;
                                                                c.material.emissive.setRGB(0.25, 0.25, 0.25 );

                                                            }
                                                        })
                                                    }

                                                }
                                            } )


                                        }


                                    }else if ( parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84") ){
                                        if ( logic.logicSystemState == 0 ){
                                            logic.parseXML();
                                        }
                                    }else if ( parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/62afc6bc-f3e1-40b3-adf1-cb8a596b8e6d" ) ||
                                        parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/5f0e2e5a-9a6b-419b-9ef5-cf98d545b7b1" ) || 
                                        parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/541820ff-3a92-470f-96f2-189dc0ca0fa2" )
                                    ){
                                        // 農業局
                                        if ( logic.logicSystemState == 0 ){
                                            logic.parseXML();
                                        }

                                    }
                                    else{
                                        logic.stopLogic();
                                    }

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

                                        //// 【客製化  - 遠東專案 】 記得未來移除
                                        if ( parent && parent.location && 
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/8496ede3-0073-4b76-aba9-1c071f763dfc" ) ||
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/6a77cc74-6262-4315-824b-3b9040afb1e7" ) ||
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/4c67db1e-ac12-461d-a1e3-a28219336bc4" ) ||
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/5b1d36fa-97b6-4092-81d2-110557866856" ) ||
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/a17b0249-4357-4fc8-bdcf-4881f2b9d01f" ) ||
                                            parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84" ) ||
                                            parent.location.pathname.includes( "/fefe/9d3d4900-6be7-4bcc-b25a-4bc1030df6a0" )
                                        ){

                                        }else if ( parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/62afc6bc-f3e1-40b3-adf1-cb8a596b8e6d" ) ||
                                            parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/5f0e2e5a-9a6b-419b-9ef5-cf98d545b7b1" ) || 
                                            parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/541820ff-3a92-470f-96f2-189dc0ca0fa2" )
                                        ){

                                        }
                                        else{

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
                                            if ( child.makarType == 'text' || child.makarType == 'light' || 
                                                 child.makarType == 'video' || child.makarType == 'model' || 
                                                 child.makarType == 'audio' ){
                                                if ( child.resetProperty ){
                                                    child.resetProperty();
                                                }
                                            }



                                        }
                                        
                                        
    
                                    }

                                    
                                });
    
                                // console.log("three.js: lost and set obj transform done");
    
    
                                obj.object3D.updateMatrix();
                                obj.object3D.matrixAutoUpdate = false;

                                //// 【客製化  - 遠東專案 】記得未來移除
                                if ( parent && parent.location && 
                                    parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/8496ede3-0073-4b76-aba9-1c071f763dfc" ) ||
                                    parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/6a77cc74-6262-4315-824b-3b9040afb1e7" ) ||
                                    parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/4c67db1e-ac12-461d-a1e3-a28219336bc4" ) ||
                                    parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/5b1d36fa-97b6-4092-81d2-110557866856" ) ||
                                    parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/a17b0249-4357-4fc8-bdcf-4881f2b9d01f" ) ||
                                    parent.location.pathname.includes( "/fefe/9d3d4900-6be7-4bcc-b25a-4bc1030df6a0" )
                                ){
                                    obj.object3D.rotation.x =  3.4 ;    
                                    obj.object3D.position.set( -dw - 2 , 80 , 180 );
                                    obj.object3D.updateMatrix();
                                    obj.object3D.updateMatrixWorld();
    
                                }else if ( parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84" ) ){
                                    obj.object3D.rotation.x =  3.4 ;    
                                    obj.object3D.position.set( -dw , 50 , 550 );
                                    obj.object3D.updateMatrix();
                                    obj.object3D.updateMatrixWorld();

                                    let sendData = {
                                        user: "ARWrapper", 
                                        type: 'cust_proj_scene_lose', 
                                        data: {}
                                    }
        							window.postMessage( JSON.stringify(sendData) , location.origin );

                                }else if ( parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/62afc6bc-f3e1-40b3-adf1-cb8a596b8e6d" ) ||
                                    parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/5f0e2e5a-9a6b-419b-9ef5-cf98d545b7b1" ) || 
                                    parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/541820ff-3a92-470f-96f2-189dc0ca0fa2" )
                                ){
                                    //// 【客製化  - 農業局 】記得未來移除 
                                    console.log(' 77777: ', arController.currentSceneIndex , obj.object3D );

                                    //// 多判斷「 場景 index 」來設定角度:
                                    if ( arController.currentSceneIndex == 0 ){
                                        obj.object3D.rotation.x =  2 ;
                                        obj.object3D.position.set( -dw - 40 , 102 , 520 );
                                        obj.object3D.updateMatrix();
                                        obj.object3D.updateMatrixWorld();
                                        let sendData = {
                                            user: "ARWrapper", 
                                            type: 'cust_proj_scene_lose', 
                                            data: {}
                                        }
                                        window.postMessage( JSON.stringify(sendData) , location.origin );
                                    }else if (arController.currentSceneIndex == 2 ){
                                        obj.object3D.rotation.x =  100 * Math.PI/180; ;
                                        obj.object3D.rotation.z =  182 * Math.PI/180; ;
                                        
                                        obj.object3D.position.set( -dw + 120 , 120 , 500 );
                                        obj.object3D.updateMatrix();
                                        obj.object3D.updateMatrixWorld();
                                    }


                                }
                                
                            }
    
                            // console.log( "lost.. obj=", obj, "\nmarker.found =", marker.found  );
    
                        }
                    }
    
                }); //// getNFTMarkerDraw end


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

                    if ( mode != '' ){
                        self.currentViewMode = mode;
                    }

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
                                oCamera.setAttribute('camera', 'active', true );

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
                                    oCamera.setAttribute('camera', 'active', true );


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


                //// v3.5.0.0
                //// 設定「當前場景」功能
                this.setCurrentSceneIndex = function( _sceneIndex ){
                    let self = this;

                    self.currentSceneIndex = _sceneIndex;

                    //// 同時設定 「 當前辨識圖編號 」
                    /*
                        原則上「所有 AR 場景的 辨識圖 」會依照順序生成「辨識圖物件」。
                        但是在「集點卡模組」，同一個 AR場景 會帶有 多個辨識圖。
                        導致最有多個「辨識圖物件」底下不會帶有「場景物件」。
                        因此，在「集點卡模組場景」，會把場景物件生成在「 此場景第一個辨識圖物件之下 」。
                        舉例：場景資訊 [ (VR), (AR), (AR, 3 collections), (AR) ]
                        辨識圖物件會以 1,2,3 編號生成
                        sceneTargetList 會紀錄為
                        [
                            {
                                sceneIndex: 1
                                targetIndex: 0
                                target_id: xxx1
                            },
                            {
                                sceneIndex: 2
                                targetIndex: 0
                                target_id: xxx2
                            },
                            {
                                sceneIndex: 2
                                targetIndex: 1
                                target_id: xxx3
                            },
                            {
                                sceneIndex: 2
                                targetIndex: 2
                                target_id: xxx4
                            },
                            {
                                sceneIndex: 3
                                targetIndex: 0
                                target_id: xxx5
                            }
                        ]

                        所以要「載入場景物件」或是「選取顯示場景物件」，要用「當前場景編號」找「此場景第一個辨識圖物件」
                        舉例： 掃描到「第三個辨識圖   」,  找到對應場景編號為 2 ，查找出應該顯示的辨識圖物件為  sceneIndex == 2 && targetIndex == 0 ,  
                    
                    */ 

                    

                }




                //// 3.5.0 改版為「從 場景取得 」
                //// 要考量的是「集點卡模組」跟「著色模組」對應流程

                this.setViewModeSceneObj = function( _viewMode ){
                    
                    let self = this;

                    let pSetViewModeSceneObj = new Promise( function( resolve, reject ){

                        //// 因應 3.5.0 這邊重新規劃流程，有鑑於「 切換觀看方式 」可能在任何場景時候觸發，先確認「當前場景」
                        /*
                            1. 確認當前場景
                            2. 判斷
                        */ 

                        //// 假如「尚未載入」，則無條件以第 0 個場景為主
                        let sceneIndex = -1; 
                        
                        if ( self.currentSceneIndex == null ){
                            //// 假如並沒有指定當前場景，則查找當前專案場景列表中，第一組 AR 場景
                            
                            let scenes = VC.getScenes( self.scenesData );
                            for ( let i = 0; i < scenes.length; i++ ){
                                let s = scenes[ i ];
                                if ( s.info.type == 'ar' ){
                                    sceneIndex = i;

                                    //// 設定「當前場景編號」跟「當前辨識圖編號」
                                    // self.currentSceneIndex = i ;
                                    self.setCurrentSceneIndex( i );

                                    break;
                                }
                            }

                        }else{
                            sceneIndex = self.currentSceneIndex;
                        }

                        //// 假如沒有設定「當前場景」，則不與進行
                        if ( sceneIndex < 0 ){
                            resolve( false );
                            return
                        }

                        // let targetIndex = 0;
                        
                        //// 從「場景-辨識圖 資料」查找
                        //// 同時查找「模組相關資料」目前只有「著色」
                        
                        let findColoring = false;
                        for ( let i = 0, len = self.sceneTargetList.length; i < len; i++ ){
                            if ( self.sceneTargetList[i].sceneIndex == sceneIndex ){
                                // targetIndex = self.sceneTargetList[i].targetIndex;

                                if ( self.sceneTargetList[i].modules.includes('coloring')  ){
                                    findColoring = true;
                                }
                            }
                        }


                        console.log(' _setViewModeSceneObj: _sceneIndex ', sceneIndex );

                        
                        //// 這邊流程：假如「 沒有選定過 當前選定專案 」，則設定為「 此頁面代表的專案 」
                        //// 假如「已經掃描過」而「選定過專案」，則保持選定的專案。
                        //// 這樣會讓「從 A 專案進入」->「點擊模型觀看」->「看 A 場景」->「點擊XR體驗」->「掃描 B 辨識圖」->「體驗場景 B 」->「點擊模型觀看」->「看 B 場景」


                        let obj = self.aframeNFTMarkers[ sceneIndex ]; // get the right index for the right model
                        let obj2D =  self.threeNFTMarkers2D[ sceneIndex ];

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
                            
                                //// 要處理「暫停影音」
                                obj.object3D.traverse( function( child ){	
                                    //// 停止影片部份
                                    if ( child.makarType == 'video' ){
                                        child.el.mp4Video.pause();									
                                    }	
                                    //// 停止聲音部份
                                    if ( child.makarType == 'audio' ){
                                        child.el.components.sound.stopSound();
                                    }
                                });


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
                                        // let pAll = self.loadMakarScene( targetIndex , obj, obj2D);
                                        // let pAll = window.sceneController.loadMakarScene( sceneIndex , obj, obj2D );
                                        
                                        // let targetID = self.sceneTargetList[marker.id].target_id
                                        let pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, null );
                                        
                                        //// v3.5.0 
                                        let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                        if ( isPromise( pXML ) ){
                                            pAll.push( pXML );
                                        }
                                        

                                        if ( Array.isArray(pAll) ){
                                            Promise.all( pAll ).then( function( ret ){
                                                console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );

                                                if ( self.logicList[ sceneIndex ]  )
                                                {
                                                    self.logicList[ sceneIndex ].parseXML();
                                                }

                                                self.setupSceneBehav( sceneIndex );

                                                
                                                //[start-20240614-renhaohsu-add]//
                                                //// 著色專案會有影片嗎?
                                                // //// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
                                                // if (window.Browser){
                                                //     if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                //     // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                        
                                                //         //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                                //         self.mute3dVideos(true)
                                                //         self.mute2dVideos(true)
                                                        
                                                //         self.UnMutedAndPlayAllVisibleVideo();
                                                //     }
                                                // }
                                                //[end-20240614-renhaohsu-add]//


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
                                // let pAll = self.loadMakarScene( targetIndex , obj, obj2D);
                                // let pAll = window.sceneController.loadMakarScene( sceneIndex , obj, obj2D );
                                // let targetID = self.sceneTargetList[marker.id].target_id
                                let pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, null );                                


                                let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                if ( isPromise( pXML ) ){
                                    pAll.push( pXML );
                                }

                                

                                if ( Array.isArray(pAll) ){
                                    Promise.all( pAll ).then( function( ret ){
                                        console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
                                        let scenes = [];
                                        scenes = VC.getScenes( self.scenesData );

                                        if ( scenes[self.currentSceneIndex].bezier.length > 0 ){
                                            for (let i = 0; i < scenes[self.currentSceneIndex].bezier.length;i++){
                                                self.bezierPathAnime( obj, scenes[self.currentSceneIndex].bezier[i], self.currentSceneIndex );
                                            }
                                        }

                                        //// 假如此專案的當前場景有「場景事件」，解析並且執行功能
                                        if (scenes[sceneIndex].behav.length > 0){
                                            self.activeSceneEvent(scenes[sceneIndex]);
                                        }

                                        if ( self.logicList[ sceneIndex ]  )
                                        {
                                            self.logicList[ sceneIndex ].parseXML();
                                        }

                                        self.setupSceneBehav( sceneIndex );

                                        //[start-20240614-renhaohsu-add]//
                                        //// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
                                        if (window.Browser){
                                            if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                
                                                //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                                self.mute3dVideos(true)
                                                self.mute2dVideos(true)
                                                
                                                self.UnMutedAndPlayAllVisibleVideo();
                                            }
                                        }
                                        //[end-20240614-renhaohsu-add]//

                                        //[start-20231207-howardhsu-modify]//
                                        //// v3.5.0.0 為 "點擊物件開啟"的quiz 的啟動物件 加上 behav
                                        self.addBehavToQuizTriggerObj();
                                        //// v3.5.0.0 如果有quiz是"直接顯示" 則顯示 html UI (startQuiz)
                                        aQuizAR.checkIfQuizOpenDirectly()                                        


                                        if ( parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84" ) ){
                                            let sendData = {
                                                user: "ARWrapper", 
                                                type: 'cust_proj_scene_done', 
                                                data: {}
                                            }
                                            window.postMessage( JSON.stringify(sendData) , location.origin );
                                        }else if ( parent.location.pathname.includes( '/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/541820ff-3a92-470f-96f2-189dc0ca0fa2') ){
                                            let sendData = {
                                                user: "ARWrapper", 
                                                type: 'cust_proj_scene_done', 
                                                data: {}
                                            }
                                            window.postMessage( JSON.stringify(sendData) , location.origin );
                                            let oCamera = document.getElementById('oCamera');
                                            if ( oCamera && oCamera.object3D && oCamera.object3D.children[0] &&
                                                oCamera.components && oCamera.components['orbit-controls'] && oCamera.components['orbit-controls'].target
                                            ){
                                                oCamera.object3D.children[0].position.set( 16 , 320, 242 );
                                                oCamera.components['orbit-controls'].target.set( 18 , 50, -45 );
                                            }
                                        }

                                        resolve( true );
                                    }).catch((err) => {
                                        console.warn('ARController.js: _setViewModeSceneObj  load scene  error:', err)
                                    });
                                    //[end-20231207-howardhsu-modify]//
                                }


                            }else{
                                //// 假如已經載入過，則啟動「邏輯相關功能」
                                if ( self.logicList[ sceneIndex ]  ){
                                    if ( self.logicList[ sceneIndex ].logicSystemState == 0 ){
                                        self.logicList[ sceneIndex ].parseXML();
                                    }
                                }

                                //// 載入專案已經載入過，則把「調整過的物件」重新設定回來
                                obj.object3D.traverse( function ( child ) {
                                    if (child.originTransform){
                                        let co = child.originTransform;

                                        child.position.copy( co.position );
                                        child.rotation.copy( co.rotation );
                                        child.scale.copy( co.scale );

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
                                        let targetID = self.sceneTargetList[marker.id].target_id
                                        let pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, targetID );


                                        let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                        if ( isPromise( pXML ) ){
                                            pAll.push( pXML );
                                        }


                                        if ( Array.isArray(pAll) ){
                                            Promise.all( pAll ).then( function( ret ){
                                                console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
                                                if ( self.logicList[ sceneIndex ]  )
                                                {
                                                    self.logicList[ sceneIndex ].parseXML();
                                                }

                                                self.setupSceneBehav( sceneIndex )

                                                //[start-20240614-renhaohsu-add]//
                                                //// 著色專案會有影片嗎 
                                                //// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
                                                // if (window.Browser){
                                                //     if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                //     // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                        
                                                //         //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                                //         self.mute3dVideos(true)
                                                //         self.mute2dVideos(true)
                                                        
                                                //         self.UnMutedAndPlayAllVisibleVideo();
                                                //     }
                                                // }
                                                //[end-20240614-renhaohsu-add]//
                                                
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


                            //// 檢查「場景物件」，「聲音」「影片」物件，執行「播放」
                            obj.object3D.traverse( function ( child ) {
                                //// 先確認物件是否可見
                                if ( child.getWorldVisible() == true ){
                                    //// 播放影片部份
                                    if ( child.makarType == 'video' ){
                                        child.el.mp4Video.play();
                                    }
                                    //// 停止聲音部份
                                    if ( child.makarType == 'audio' ){
                                        if(child.el.blockly){
                                            console.log('ARWrapper.js: _setViewModeSceneObj:  audio blockly: do nothing ', child );
                                        } else {
                                            child.el.components.sound.playSound();
                                        }
                                    }
                                }
                            });

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


                //// 3.5.0 基於 「場景編號」 載入邏輯 xml 
                this.parseLogicXMLBySceneIndex = function( sceneIndex ){
                    
                    let pXML;
                    let xmlUrl = VC.getSceneLogicXML( self.scenesData , sceneIndex );
                    
                    if ( xmlUrl != '' ){
                        let logic = new Logic();
                        pXML = logic.loadXMLtoDoc(xmlUrl);
                        arController.logicList[ sceneIndex ] = logic;
                    }

                    return pXML;
                }



                //// v3.5.0.0 依照不同辨識圖被掃描到，顯示跟隱藏 辨識圖母體物件

                this.activeAndClearScene = function( sceneIndex, targetID = -1 ){
                    
                    let self = this;

                    let targetIndex = 0;

                    if(self.previousSceneIdx != sceneIndex){
                        // 清除場景事件的timeID
                        for(let i = 0; i <self.intervalList.length;i++){
                            window.clearInterval(self.intervalList[i]);
                        }

                        // 陀螺儀記錄清除
                        self.init_gyro = null;
                    }

                    // let sceneIndex = self.sceneTargetList[ targetIndex ].sceneIndex;

                    /////////////// aframe 改版 ////////////////////

                    for ( let i in this.aframeNFTMarkers ){
                        if ( i == sceneIndex ){
                            
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
                                        if(child.el.blockly){
                                            console.log('ARWrapper.js: _activeAndClearScene:  audio blockly: do nothing ', child );
                                        } else {
                                            child.el.components.sound.playSound();
                                        }
                                    }
                                }
                            });

                            //[start-20240124-renhaohsu-add]//
                            //// 記錄辨識圖物件   讓quiz在html ui是否顯示的流程 能判斷，此場景有沒有開啟過quiz
                            window.aQuizAR.scene3DRoot = targetContainer
                            //[end-20240124-renhaohsu-add]//

                        } else {


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
                                // if ( this.aframeNFTMarkers[i].loadModule == 'quiz' ){
                                    
                                //     //// 從 makarObjects 中排除相關物件 
                                //     let quizRoot = this.aframeNFTMarkers[i];

                                //     //// 從場景中清除quiz 專案對應物件
                                //     while( quizRoot.children.length > 0 ){
                                //         quizRoot.children[0].remove();
                                //     }
                                //     //// 清除物件列表中，已經跟場景沒有關聯的物件
                                //     for ( let j = 0; j < self.makarObjects.length; j++ ){
                                //         if (  self.makarObjects[j].object3D.el == null || self.makarObjects[j].object3D.parent == null ){
                                //             self.makarObjects.splice( j , 1 );
                                //         }
                                //     }

                                //     //// 判斷「當前呈現專案」是否是 quiz ，假如是的話則不用「隱藏 UI界面」，假如不是quiz 專案，則要隱藏 quiz對應UI
                                //     let startQuiz = document.getElementById('startQuiz');
                                //     if ( this.aframeNFTMarkers[ sceneIndex ].loadModule == 'quiz' ){

                                //     } else {
                                //         startQuiz.style.display = 'none';
                                //     }

                                //     self.aframeNFTMarkers[i].loadedObjects = false;
                                //     self.threeNFTMarkers2D[i].loadedObjects = false;

                                //     // console.log(' _clearScene: remove done ');


                                // }
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
                            //     // console.log("2 three.js: recognize: previous scene _loadModule = ", i, this.threeNFTMarkers2D[i] );
                                
                                switch(this.threeNFTMarkers2D[i].loadModule){
                                    case "scratchCard":
                                        // console.log("three.js: recognize: _clearScene, deal previous scratchCard " );
                                        window.aScratchCard.hideScratchCardCanvas( this.threeNFTMarkers2D[i] );
                                        break;
                                    case "pointCard":
                                        console.log("three.js: recognize: _clearScene, processing pointCard " );
                                        aPointCard.hidePointCardCanvas( this.threeNFTMarkers2D[i] );
                                        break;

                            //         case "coloring":
                            //             console.log("three.js: recognize: _clearScene, not support coloring " );
                            //             break;
                                    default:
                                        console.log("three.js: recognize: _clearScene, not support unknown module", this.threeNFTMarkers2D[i].loadModule );

                                }
                            };


                        }

                    }

                    // 如果目前的SceneIdx跟上一次不同，則需要重新載入場景事件
                    if(self.previousSceneIdx != sceneIndex && sceneIndex != -1){
                        let scenes = [];
                        scenes = VC.getScenes( self.scenesData );

                        if (scenes[sceneIndex].behav.length > 0){
                            self.activeSceneEvent(scenes[sceneIndex]);
                        }
                    }



                    //// v3.5.0.0  2D 涉及許多「模組設定」，延後處理

                    if ( (this.previousSceneIdx != sceneIndex && sceneIndex != -1) || (this.previousTargetID != targetID && targetID!= -1) ) {
                        if (this.threeNFTMarkers2D[sceneIndex].loadModule ){
                            // console.log("2 three.js: recognize: current scene _threeNFTMarkers2D[sceneIndex] = ", this.threeNFTMarkers2D[sceneIndex] );
                            // if(startQuiz.style.display == "block") startQuiz.style.display = "none";

                            switch(this.threeNFTMarkers2D[sceneIndex].loadModule){
                                case "scratchCard":
                                    if(startQuiz.style.display == "block") startQuiz.style.display = "none";
                                    // console.log("three.js: recognize: _clearScene, deal current scratchCard " );
                                    ////// 假如沒有 mdb 則流程不能玩 
                                    if (!parent.mdb){
                                        return [];
                                    };

                                    let scene_obj;
                                    self.scenesData.scenes[self.currentSceneIndex].objs.forEach( (item, index) => {
                                        if(item.typeAttr){
                                            if(item.typeAttr.module){
                                                if(item.typeAttr.module.moduleID == self.threeNFTMarkers2D[sceneIndex].project_module.moduleID){
                                                    scene_obj = item
                                                }
                                            }
                                        }
                                    });

                                    window.aScratchCard.showScratchCardCanvas( this.threeNFTMarkers2D[sceneIndex],  scene_obj);
                                    break;

                                case "pointCard":
                                    if(startQuiz.style.display == "block") startQuiz.style.display = "none";
                                    console.log("ARController _activeAndClearScene recognize: _clearScene, pointCard processing" , self.threeNFTMarkers2D[sceneIndex] );
                                    // snapShotCamera.style.display = "none";
                                    
                                    ////// 假如沒有 mdb 則流程不能玩 
                                    if (!parent.mdb){
                                        return [];
                                    };

                                    //// 檢查集點狀況
                                    let playing_user = localStorage.getItem("MakarUserID")
                                    if ( playing_user && false){
                                        ////假如使用者有登入[makar or third party ] 現在還沒有這個部份，預先設置。
                                    }else{
                                        //// user未登入
                                        playing_user = ""

                                        let pointCardIndex;
                                        let scene_obj;
                                        self.scenesData.scenes[self.currentSceneIndex].objs.forEach( (item, index) => {
                                            if(item.typeAttr){
                                                if(item.typeAttr.module){
                                                    if(item.typeAttr.module.moduleID == self.threeNFTMarkers2D[sceneIndex].project_module.moduleID){
                                                        pointCardIndex = index
                                                        scene_obj = item
                                                    }
                                                }
                                            }
                                        })

                                        const sceneObjsLength = self.scenesData.scenes[self.currentSceneIndex].objs.length

                                        //// 此時，已經有集點卡，只要檢查點數是否已經集過 ? 有就顯示圖片和html : 否則集點且更新mDB
                                        window.aPointCard.getPointCardProjectFromMDB(makarUserData.oneProjData.proj_id).then( getProjRet => {
                                            // console.log('ARController _activeAndClearScene: getPointCardProjectFromMDB return=', getProjRet)
                                            const obj_id = scene_obj.generalAttr.obj_id

                                            //// 假如專案有紀錄過，先確認此次集點卡是否記錄過
                                            if(getProjRet.pointCards){
                                                if( getProjRet.pointCards[obj_id] ){
                                                    //// 此時，已經有集點卡，只要檢查點數是否已經集過 ? 有就顯示圖片和html : 否則集點且更新mDB
                                                    aPointCard.checkPointThenAdd(self.threeNFTMarkers2D[sceneIndex], targetID, pointCardIndex, sceneObjsLength, playing_user)
                                                } else {
                                                    //// 應該只是loadMakarARScene還沒跑完又觸發了這裡 ?
                                                    // console.log('並非初次掃到辨識圖(有載過場景) 卻又沒有集點卡 ')
                                                }
                                            } else {
                                                // console.log('理論上不應出現這狀況：並非初次掃到辨識圖(有載過場景) 卻又沒有集點卡 ')
                                            }
                                        })
                                        
                                    }
                                        
                                    break;

                //                 case "coloring":
                //                     console.log("three.js: recognize: _clearScene, not support coloring " );
                //                     break;
                                default:
                                    console.log("three.js: recognize: _clearScene, not support unknown module", this.threeNFTMarkers2D[sceneIndex].loadModule );

                            }

                        }else{

                            // snapShotCamera.style.display = "block";
                        
                        };
                    }
                }

                //// 顯示「點擊播放聲音」界面
                this.dealVideoMuted = function( video ){
                    let clickToPlayAudio = document.getElementById("clickToPlayAudio");
                    clickToPlayAudio.style.display = "block";													
                    clickToPlayAudio.onclick = function(){

                        clickToPlayAudio.setAttribute("didUserClick", true)
                        
                        // video.muted = false;
    
                        self.UnMutedAndPlayAllVisibleVideo();
    
                        window.allowAudioClicked = true;
                        clickToPlayAudio.style.display = "none";
                        clickToPlayAudio.onclick = null;
                        window.alreadyClicked = true;

                        //// 提醒用戶點擊開啟聲音
                        if (window.Browser){
                            if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                            //// safari: 讓全部影片靜音但播放，然後挑一個影片發出聲音
                            self.mute3dVideos(true)
                            self.mute2dVideos(true)
                            self.UnMutedAndPlayAllVisibleVideo();
                        } else if (window.Browser.mobile == true){
                                //// safari 以外的手機瀏覽器
                                //// chrome(或其他): 需要user互動後才能發出聲音
                                self.unmute3dVideos(true)
                                self.unmute2dVideos(true)
                            }
                        }
                    }
                                    
                    //// 初次載入, 跳轉場景 時影片聲音的處理
                    if( !clickToPlayAudio.getAttribute("didUserClick") ){
                        //// user還沒click"允許聲音播放" (頁面初次載入)
                        clickToPlayAudio.style.display = "block";
                        
                    } else {        
                        console.log("user已允許聲音播放 (跳轉場景)")
                        //// user已"允許聲音播放" (跳轉場景)
                        // if( isSafari ){
                            mute3dVideos(true)
                            mute2dVideos(true)
                            // UnMutedAndPlayAllVisibleVideo(video);
                            //// 20240618好吧不知道為什麼上面不work 總之先改這樣
                            video.muted = false
                        // } else {
                        //  ////   20240618 renhaohsu觀察到在chrome放5個影片物件 會出現有些影片不播放的情形 但他們明明走同樣的code...
                        //     console.log("isSafari=", isSafari)
                        //     unmute3dVideos(true, true)
                        //     unmute2dVideos(true, true)
                        // }
                    }
    
                }

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


                ////
                //// 處理全部的 群組功能 包含 2D / 3D 
                //// 注意：目前群組功能只有作用在 「顯示/隱藏」相關的功能。我們也只先處理這些，未來在新增
                ////
                this.dealAllGroupHide = function( touchObject , sceneIndex ){

                    let self = this;

                    let groupDict = self.groupEventTargetDict[ sceneIndex ];

                    // console.log("self.groupEventTargetDict sceneIndex", JSON.parse( JSON.stringify(self.groupEventTargetDict)), sceneIndex )

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

                                //[start-20240319-renhaohsu-modify]//
                                //// 因為 "本次behav裡有存的obj_id" 的物件接下來在triggerEvent會被顯示/關閉 因此這裡都先跳過
                                let isObjIdExistInBehav = touchObject.behav.find(b => b.obj_id == groupObj.obj_id)

                                //// 剩下的obj_id就都是 "不在本次behav裡面 但屬於同一群組"
                                if( !isObjIdExistInBehav ){
                                    //// v3.5.0.0 改版，這邊紀錄的 群組事件 是「觸發事件格式」
                                    let obj_id = groupObj.obj_id;

                                    //// 目前認定「顯示相關事件」與「媒體相關事件」，需要被群組所影響
                                    //// 「顯示相關」，隱藏物件
                                    let isBehavRederenceTpyeDisplay = false

                                    self.scenesData.scenes[self.currentSceneIndex].behav.forEach( b => {
                                        if(b.obj_id==obj_id && 
                                            ( b.behav_type == 'Display' && ( b.switch_type == 'Switch' || b.switch_type == 'Show' ) )
                                        ) {
                                            isBehavRederenceTpyeDisplay = true
                                        }
                                    })
                                    
                                    //// 透過「場景物件 ID 」取得「 實體化物件 」，回傳同時帶有 2D / 3D 類別
                                    let getObj = self.getObjectTypeByObj_id( obj_id );
                                    
                                    //// 要觸發顯示隱藏的物件 要區分為 2d/3d 
                                    if ( getObj.obj_type == '2d' ){

                                        let obj2D = getObj.obj;
                                        //// 要找到「群組事件」中「不是當前所選到物件」
                                        if ( behav.obj_id != obj_id && isBehavRederenceTpyeDisplay ){
                                            obj2D.visible = false  
                                        }

                                    }else if ( getObj.obj_type == '3d' ){

                                        let obj3D = getObj.obj;
                                        // if ( obj3D.object3D.behav_reference && Array.isArray( obj3D.object3D.behav_reference ) && behav.obj_id != obj_id  ){
                                        if ( behav.obj_id != obj_id && isBehavRederenceTpyeDisplay ){

                                            self.hideGroupObjectEvent( obj3D, isBehavRederenceTpyeDisplay );
                                            //// 「媒體相關」，目前 3D 會有「影片」「聲音」，確認類型之後，暫停
                                            //// 尚未製作
                                        }
                                    }
                                }
                                //[end-20240319-renhaohsu-modify]//

                            });

                        }

                    }

                }

                //// 朗讀文字物件功能
                this.speechTextObj = function( textObj, _speed, speechLangIndex ) {
                    console.log(' _speechTextObj: _textObj: ', textObj );
                    if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){
            
                        //// 先判斷是否已經正在說話，假如是的話，暫停說話。假如沒有正在說話，才開始說話。
                        if ( speechSynthesis.speaking == true ){
                            speechSynthesis.pause();
                            speechSynthesis.cancel();
                        } 
            
                        //// speed 預設是 1
                        let speed = 1;
                        if ( Number.isFinite( _speed ) && _speed > 0 ){
                            speed = _speed;
                        }
            
                        let content = textObj.typeAttr.content;
            
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

                this.hideGroupObjectEvent = function(target) {

                    if ( !target ){
                        console.log('VRFunc.js: _hideGroupObjectEvent: target not exist ', target );
                        return;
                    }

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
                                                
                                                //// 手動觸發 聲音播放完畢的event (如果此物件有被邏輯"播放聲音物件等待直到結束" 讓它底下的block繼續執行下去)
                                                let event = new Event('sound-ended');
                                                child.el.dispatchEvent(event);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }
                }

                

                //// 
                //// 載入「場景物件」完成之後，作的「事件」處理，目前包含「注視事件」 而已
                //// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
                //// 流程：掃一遍「場景中物件 2d/3d 」
                ////
                ////
                this.setupSceneBehav = function( sceneIndex ){
                    
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

                    // //// 從載入過程紀錄的 「注視事件列表」 來建立互動事件 「」
                    // //// 只有「3d物件」會有注視事件

                    // let lookAtObjectList = self.lookAtTargetDict[ sceneIndex ] ; 
                    // if ( Array.isArray(  lookAtObjectList  ) ){
                    //     for ( let i = 0, len = lookAtObjectList.length; i < len; i++ ){
                    //         let lookAtEvent = lookAtObjectList[i];
        
                    //         let lookObjId = lookAtEvent.lookObjId;
                    //         let lookObj = document.getElementById( lookObjId );
                            
                    //         let lookBehav = lookAtEvent.lookBehav;
                    //         let targetObjId = lookBehav.obj_id;
                    //         let reverse = lookBehav.reverse;
        
                    //         let targetObj = document.getElementById( targetObjId );
                    //         //// 確保「目標物件」「注視物件」都存在，建立持續事件
                    //         if (lookObj && lookObj.object3D && targetObj && targetObj.object3D ){
                                
                    //             self.addLookAtTimeLine( lookObj , targetObj , lookAtEvent , sceneIndex );
        
                    //         }else{
                    //             console.log('_setupSceneBehav: _lookAt error, obj not exist', lookObj , targetObj );
                    //         }
        
                    //     }
        
                    // }

                }

                ///// 建立「注視事件功能」
                this.addLookAtTimeLine = function( lookObj , targetObj , facingEvent , sceneIndex=this.currentSceneIndex ){

                    console.log(' _addLookAtTimeLine: _facingEvent=', facingEvent );

                    let self = this;

                    let lookAtTimelineDict = self.lookAtTargetTimelineDict[ sceneIndex ];


                    let targetPos = new THREE.Vector3();
                    targetObj.object3D.getWorldPosition(targetPos);
                    
                    //// 執行一次「注視效果」
                    lookObj.object3D.lookAt(targetPos);
                    lookObj.object3D.rotateOnAxis( new THREE.Vector3( 1, 0 ,0 ), Math.PI );
                    if ( facingEvent && facingEvent.is_front == false ){
                        //// 背對: 該物體的 "朝向z軸負向" 的那一面 面對目標物體
                        lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
                    }

                    //// 暫時不使用「持續注視」
                    // let tl = gsap.timeline();
                    // lookAtTimelineDict[ facingEvent.lookObjId ] = tl;
                    // //// 無條件不斷重複「注視功能」
                    // tl.to(lookObj.object3D, {
                    //     duration: 1100,
                    //     delay: 0, 
                    //     ease: 'none',
                    //     repeat: -1,
                    //     onUpdate: function(){
                    //         targetObj.object3D.getWorldPosition(targetPos);
                    //         lookObj.object3D.lookAt(targetPos);
                            
                    //         //[start-20240322-renhaohsu-start]//
                    //         //// 看起來 object3D.lookAt 在AR的效果不同，暫時以對x軸多旋轉180度調回來 
                    //         lookObj.object3D.rotateOnAxis( new THREE.Vector3( 1, 0 ,0 ), Math.PI );
                    //         //[end-20240322-renhaohsu-start]//

                    //         if ( facingEvent && facingEvent.is_front == false ){
                    //             //// 背對: 該物體的 "朝向z軸負向" 的那一面 面對目標物體
                    //             lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
                    //         }
                    //     }
                    // });

                }



                ////
                //// 所有 「物件觸發事件」 需要作的「前置動作」
                ////
                //// 1. 場景載入物件時候，假如有「觸發事件」，則往下判斷是否有「群組」，並且紀錄下來
                //// 2. 「注視事件」
                ////

                ///// v3.5.0.0 取消，不再需要從 「實體化物件」，填入事件。
                //// 改使用 json 資料，查找即可，呼叫 「 setBehavsGroup 」
                this.setObjectBehavAll = function( obj , sceneIndex ){
                    

                    // let self = this;

                    // let groupDict = self.groupEventTargetDict[ sceneIndex ];

                    // let lookAtObjectList = self.lookAtTargetDict[ sceneIndex ] ; 

                    // console.log(' _setObjectBehavAll: ' , sceneIndex );

                    // for ( let i = 0, len = obj.behav.length; i < len; i++ ){
                    //     //// 群組事件紀錄
                    //     if ( obj.behav[i].group != '' ){
                    //         if ( groupDict[ obj.behav[i].group ] ){
                    //             let groupObj =  groupDict[ obj.behav[i].group ];

                    //             groupObj.objs.push({
                    //                 behav:  obj.behav[i]
                                    
                    //             } );

                    //         }else{

                    //         }		
                    //     }


                    //     //// 注視事件紀錄
                    //     if ( obj.behav[i].simple_behav == 'LookAt' && obj.behav[i].obj_id ){

                    //         let lookAtEvent = {
                    //             lookBehav: obj.behav[i] ,
                    //             lookObjId: obj.obj_id ,
                    //         }

                    //         lookAtObjectList.push( lookAtEvent );

                    //     }

                    // }
                }



                //[start-20231206-howardhsu-modify]//
                //// v3.5.0.0 為 "點擊物件開啟"的quiz 的啟動物件 加上 behav
                this.addBehavToQuizTriggerObj = () => {
                    //// 載入場景完成後，掃一遍 quiz 的啟動物件，給它加上behav
                    const arr_trigger_ids = window.aQuizAR.triggers
                    if(!Array.isArray(arr_trigger_ids)) return;
                    if(arr_trigger_ids.length == 0) return;

                    // const objs = this.scenesData.scenes[this.currentSceneIndex].objs

                    //// 為了方便操作，取得記錄了全部 { 有設定啟動物件的quiz_id , trigger_id } 的陣列
                    const quizIdWithTriggers = window.aQuizAR.quizIdWithTriggers

                    //// 在每個 Quiz啟動物件 的behav，增加 "ShowQuiz"，記錄它對應的 Quiz物件id
                    quizIdWithTriggers.forEach( q_t => {

                        //// 從 3D物件裡尋找啟動物件
                        let quizTrigger = document.getElementById(q_t.trigger_id)   
                        // console.log("ARController.js: _addBehavToQuizTriggerObj get quizTrigger=", quizTrigger)
                        
                        //// 從 2D物件裡尋找啟動物件
                        let quizTriggerObj2D = this.makarObjects2D.find(item=>item.obj_id == q_t.trigger_id)

                        const tempBehav = { 
                            obj_id: q_t.obj_id, 
                            played: false, 
                            behav_type: 'ShowQuiz', 
                            force_login: q_t.force_login, 
                            allow_retry: q_t.allow_retry 
                        }
                        if (quizTrigger){	
                            console.log("ARController.js: _addBehavToQuizTriggerObj get quizTrigger=", quizTrigger)
                            quizTrigger.className = "clickable"

                            let quizTriggerObj3D = quizTrigger.object3D       
                            
                            if ( quizTriggerObj3D.behav && Array.isArray(quizTriggerObj3D.behav) ) {  
                                //// 先確認: 該 quiz 和 與它一對一對應的啟動物件 還沒加過 啟動quiz的behav
                                if( !quizTriggerObj3D.behav.find(b => b.obj_id == q_t.obj_id)){
                                    quizTriggerObj3D.behav.push( tempBehav )
                                    console.log("ARController.js: _addBehavToQuizTriggerObj  add behav to quizTriggerObj3D=", quizTriggerObj3D)
                                }
                            } else {
                                quizTriggerObj3D.behav = [ tempBehav ]
                                console.log("ARController.js: _addBehavToQuizTriggerObj  add behav to quizTriggerObj3D=", quizTriggerObj3D)
                            }	
                            
                        } else if (quizTriggerObj2D){
                            console.log("ARController.js: _addBehavToQuizTriggerObj get quizTriggerObj2D=", quizTriggerObj2D)    
                        
                            if (quizTriggerObj2D.behav) {  
                                //// 先確認: 該 quiz 和 與它一對一對應的啟動物件 還沒加過 啟動quiz的behav
                                if( !quizTriggerObj2D.behav.find(b => b.obj_id == q_t.obj_id)){
                                    quizTriggerObj2D.behav.push( tempBehav )
                                    console.log("ARController.js: _addBehavToQuizTriggerObj  add behav to quizTriggerObj2D=", quizTriggerObj2D)
                                }                                
                            } else {
                                quizTriggerObj2D.behav = [ tempBehav ]
                                console.log("ARController.js: _addBehavToQuizTriggerObj  add behav to quizTriggerObj2D=", quizTriggerObj2D)
                            }		
                            
                        } else {
                            console.log("VRController.js _loadScene: can not find quiz's trigger", q_t.trigger_id, " performance.now()=", performance.now(), self.makarObjects2D.slice() )
                        }                 
                    })
                }
                //[end-20231206-howardhsu-modify]//

                //// 後面預計還有「 事件系統 」跟「未知的切換場景系統」

                //// 往母層搜尋，找到「  MAKAR 物件 」
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
                this.getObjectTypeByObj_id = function( obj_id ) {

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

                        if ( self.makarObjects2D ){
                            self.makarObjects2D.forEach( (e,i) =>{
                                if ( e.obj_id == obj_id ){
                                    getObj2D = e;
                                    getObj2DIndex = i;
                                }
                            });
                        }


                        
                        if ( ( getObj3D != null && getObj3DIndex != null ) || ( getObj2D != null && getObj2DIndex != null ) ){
                            
                            if ( getObj3D != null && getObj3DIndex != null ){
                                // console.log('_getObjectTypeByObj_id: 3d: ' , getObj3DIndex , getObj3D );
                                getObj.obj_type = '3d';
                                getObj.obj_index = getObj3DIndex;
                                getObj.obj = getObj3D;

                            }else if ( getObj2D != null && getObj2DIndex != null ){
                                // console.log('_getObjectTypeByObj_id: 2d: ' , getObj2DIndex , getObj2D );
                                getObj.obj_type = '2d';
                                getObj.obj_index = getObj2DIndex;
                                getObj.obj = getObj2D;
                                
                            }else{
                                console.log('_getObjectTypeByObj_id: fucking logic trouble.' , getObj2DIndex , getObj2D );
                            }

                        }else if ( ( getObj3D != null && getObj3DIndex != null ) && ( getObj2D != null && getObj2DIndex != null ) ){
                            // console.log('_getObjectTypeByObj_id: warning, both 2D/3D object get', obj_id , ', 3d:' , getObj3DIndex , getObj3D , ', 2d:' , getObj2DIndex , getObj2D );
                            getObj.obj_type = '3d';
                            getObj.obj_index = getObj3DIndex;
                            getObj.obj = getObj3D;
                        }else{

                        }

                    }

                    return getObj;

                }



                //// 事件系統 開始
                this.triggerEvent = function( event, reset, makarObj){

                    let self = this;

                    let target = null;

                    //[start-20231130-renhaohsu-mod]
                    if(typeof reset == 'undefined') reset = false;
                    //[end-20231130-renhaohsu-mod]

                    let obj_id = event.obj_id;

                    //// 觸發behav時也都dispatchEvent ( 也算是 for_makarSDK ) 
                    let arDiv = document.getElementById("arDiv");
                    // arDiv.addEventListener("MakarEvent", e => {
                    //     console.log("%c MakarEvent(behav) e.detail=", 'color: MediumAquamarine;', e.detail)
                    // })
                    let makarEvents = new MakarEvents(self, arDiv)
                    makarEvents.dispatchEvent(event);

                    switch ( event.behav_type ){

                        case "Dialing":
                            console.log("ARWrapper.js: _triggerEvent: Dialing: event=", event );	
                            let telTag = window.document.getElementById("phoneCall");
                            if ( telTag ){
                                telTag.href = "tel:"+event.phone ;
                                telTag.click();    
                            }
                            break;
                
                        case "Email":  
                            console.log("ARWrapper.js: _triggerEvent: SendEmail: event=", event );	
                            let mailTag = window.document.getElementById("sendEmail");
                            if ( mailTag ){
                                mailTag.href = "mailto:" + event.mail_to ;
                                mailTag.click();    
                            }
                            break;
                
                        case "URL":
                            console.log("ARWrapper.js: _triggerEvent: URL: event=", event , event.url );	
                            let webTag = window.document.getElementById("openWebBrowser");
                            if ( webTag ){
                                webTag.href = event.url ;
                                webTag.click();    
                            }
                            break;
                                
                        case "Scenes":
                            console.log("ARWrapper.js: _triggerEvent: _Scenes: event=", event );
                            
                            let sceneID = event.scene_id;

                            //[start-20240102-howarhdsu-add]//
                            //// 因應 editor 有 "立即執行"、"延遲執行" 的設定
                            if(event.delay == true){
                                if(event.previousID){
                                    clearTimeout(event.previousID);
                                }
                                console.log("ARcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                                let timeoutID = setTimeout(() => {
                                    self.eventChangeScene( sceneID );
                                }, 3000); 
                                event.previousID = timeoutID;
                            } else {
                                self.eventChangeScene( sceneID );
                            }   
                            //[end-20240102-howarhdsu-add]//


                            break;

                        //[start-20231208-howarhdus-modify]//   
                        //// ver. 3.5 顯示圖片、文字、模型、影片、播放聲音
                        case "Display":
                            console.log("ARWrapper.js: _triggerEvent: _Display: event=", event );
                            target = document.getElementById(obj_id);
                            if (!target){
                                console.warn('VRFunc.js: Media: target not exist', target);
                                break;
                            }    

                            //// 因應 editor 有 "立即執行"、"延遲執行" 的設定
                            if(event.delay == true){
                                if(event.previousID){
                                    clearTimeout(event.previousID);
                                }
                                console.log("ARcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                                let timeoutID = setTimeout(() => {
                                    behavDisplay()
                                }, 3000); 
                                event.previousID = timeoutID;
                            } else {
                                behavDisplay()
                            }   
                            
                            function behavDisplay(){
                                if (target.nodeName.toLowerCase() == "a-sound"){
                                    //// 聲音
                                    if (event.switch_type == "Switch"){
                                        if(target.getAttribute("visible")){
                                            target.setAttribute("visible",false);
                                            target.setAttribute('class', "unclickable" );
                                            // target.components.sound.pauseSound();
                                            target.components.sound.stopSound();
                                            
                                            //// 手動觸發 聲音播放完畢的event (如果此物件有被邏輯"播放聲音物件等待直到結束" 讓它底下的block繼續執行下去)
                                            let event = new Event('sound-ended');
                                            target.dispatchEvent(event);
                                        }
                                        else{
                                            target.setAttribute("visible",true);
                                            if(target.object3D.behav){
                                                target.setAttribute('class', "clickable" );
                                            }   
                                            
                                            if ( target.blockly ){
                                                console.log('VRFunc.js: _showObjectEvent: set true, audio blockly: do nothing ', target );
                                            } else {
                                                target.components.sound.playSound();        
                                            }
            
                                        }
                                    }
                                    else if(event.switch_type == "Show"){
                                        target.setAttribute("visible",true);
                                        if(target.object3D.behav){
                                            target.setAttribute('class', "clickable" );
                                        }   
            
                                        if ( target.blockly ){
                                            console.log('VRFunc.js: _showObjectEvent: set true, audio blockly: do nothing ', target );
                                        } else {
                                            target.components.sound.playSound();      
                                        }
                                        
                                    }
                                    else if(event.switch_type == "Hide"){
                                        target.setAttribute("visible",false);
                                        target.setAttribute('class', "unclickable" );
                                        // target.components.sound.pauseSound();
                                        target.components.sound.stopSound();
                                        
                                        //// 手動觸發 聲音播放完畢的event (如果此物件有被邏輯"播放聲音物件等待直到結束" 讓它底下的block繼續執行下去)
                                        let event = new Event('sound-ended');
                                        target.dispatchEvent(event);
                                    }
                                    
                
                                } else {
                                    self.showObjectEvent(target, reset, event.switch_type);
                                }
                            }

                            break;

                        //// temporary behavs for 2D scene
                        case "Display2D":
                            console.log("VRFunc.js: _triggerEvent: Display2D: event=", event );	
                            
                            //// 因應 editor 有 "立即執行"、"延遲執行" 的設定
                            if(event.delay == true){
                                if(event.previousID){
                                    clearTimeout(event.previousID);
                                }
                                console.log("ARcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                                let timeoutID = setTimeout(() => {
                                    behavDisplay2D()
                                }, 3000); 
                                event.previousID = timeoutID;
                            } else {
                                behavDisplay2D()
                            }   
                            
                            function behavDisplay2D(){
                                //// 顯示or隱藏
                                let obj2D = self.makarObjects2D.find( o => o.obj_id == event.obj_id )
                                switch (event.switch_type) {
                                    case "Switch":
                                        if(obj2D) obj2D.visible = !obj2D.visible;
                                        break;
                                    case "Show":
                                        obj2D.visible = true;
                                        break;
                                    case "Hide":
                                        obj2D.visible = false;
                                        break;
                                    default:
                                        break;
                                }

                                //// 播放or暫停
                                obj2D.traverse(function(child){
                                    if( child.children.length==0 ){ return; }
                                    if( !child.children[0].material ){ return; }
                                    if( !child.children[0].material.map ){ return; }
                                    
                                    let material = child.children[0].material.map.image
                                    if( !child.children[0].material.map.image ){ return; }
                                    if( material.tagName.toLowerCase() == 'video' ){
                                        // const isVideoPlaying = (material) => !!(material.currentTime > 0 && !material.paused && !material.ended && material.readyState > 2);
                                        switch (event.switch_type) {
                                            case "Switch":
                                                if(obj2D.visible){
                                                    if (window.Browser){
                                                        if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                        // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                            self.mute3dVideos();
                                                            self.mute2dVideos();
                                                        }
                                                    }
                                                    material.play()
                                                    material.muted = false;
                                                    self.safariUnMutedVideo = obj2D;
                                                    
                                                } else {
                                                    material.pause();
                                                    
                                                    if (window.Browser){
                                                        if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                        // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                            self.UnMutedAndPlayAllVisibleVideo();
                                                        }
                                                    }
                                                }

                                                break;
                                            case "Show":
                                                material.play();
                                                material.muted = false;
                                                self.safariUnMutedVideo = obj2D;
                                                break;
                                            case "Hide":
                                                material.pause();
                                                if (window.Browser){
                                                    if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                    // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                        self.UnMutedAndPlayAllVisibleVideo();
                                                    }
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                });
                            }
                            
                            break;                

                        //// Display也包括了顯示影片、播放聲音， 而"Media"似乎暫時不會出現
                        case "Media":
                            console.warn("ARWrapper.js: _triggerEvent: _Media: event=", event );
                            // target = document.getElementById(obj_id);
                            // if (!target){
                            //     console.log('ARWrapper.js: _Media: target not exist', target);
                            //     break;
                            // }

                            // if( target.nodeName.toLowerCase() == "a-video"){

                            //     // //// 影片
                            //     self.showObjectEvent(target, reset);
                            
                            // } else if (target.nodeName.toLowerCase() == "a-sound"){
                            //     //// 聲音
                            //     if (target.getAttribute("visible")){
                            //         target.setAttribute("visible",false);
                            //         target.setAttribute('class', "unclickable" );
                            //         target.components.sound.stopSound();
                            //     } else {
                            //         target.setAttribute("visible",true);
                            //         if(target.object3D.behav){
                            //             target.setAttribute('class', "clickable" );
                            //         }   
                            //         target.components.sound.playSound();        
                            //     }
            
                            // } else {
                            //     console.log("ARWrapper.js: _triggerEvent: Media: target is neither video nor sound object.", target)
                            // }
                            //[end-20231208-howarhdus-modify]//
                            break;

                        case "Animation":
                            console.log("ARWrapper.js: _triggerEvent: _Animation: event=", event );
                            target = document.getElementById(obj_id);
                            if ( !target || !target.object3D || !target.object3D.children[0] ||
                                !Array.isArray( target.object3D.children[0].animationSlices )
                            ){
                                console.log('ARWrapper.js: _Animation: target not exist', target );
                                break;
                            }else{

                                let mainAnimation;
                                for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
                                    if (target.object3D.children[0].animationSlices[i].uid == event.uid){
                                        mainAnimation = target.object3D.children[0].animationSlices[i].animationName;
                                    }
                                }
                                target.setAttribute("animation-mixer", "clip: " + mainAnimation);
                    
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

                            }
                        
                            break;

                        case "TTS":
                            console.log("ARWrapper.js: _triggerEvent: _TTS: event=", event );
                            target = document.getElementById(obj_id);
                            if ( !target || !target.object3D ){
                                console.log('ARWrapper.js: _TTS: target not exist', target );
                                break;
                            }else{
                                
                                //// 找到對應的文字物件
                                if ( event.obj_id ){

                                    let textObjID = event.obj_id;
                                    
                                    if ( self.scenesData && self.scenesData.scenes[ self.currentSceneIndex ] && Array.isArray( self.scenesData.scenes[ self.currentSceneIndex ].objs ) ){
                                        self.scenesData.scenes[ self.currentSceneIndex ].objs.forEach( e =>{
                                            if ( e.generalAttr.obj_id == textObjID  ){
                                                self.speechTextObj( e , event.speed, event.language);
                                            }
                                        });
                                    }

                                    // let scenes = [];
                                    // scenes = VC.getScenes( self.scenesData );
                                    

                                    // if ( self.scenesData.scenes[ idx ] && Array.isArray( self.scenesData.scenes[ idx ].objs )  ){

                                    //     self.scenesData.scenes[ idx ].objs.forEach( e=>{ 
                                    //         if ( e.generalAttr.obj_id == textObjID  ){
                                    //             self.speechTextObj( e , event.speed, event.language);
                                    //         }
                                    //     });

                                    // }

                                }


                            }


                            break;
                        
                        //[start-20240130-renhaohsu-modify]//
                        case "ShowQuiz":
                            //// 先確認是否已經有Quiz正在玩
                            if( !window.aQuizAR.checkIsAnyQuizPlaying() ){
                                const startQuiz = document.getElementById("startQuiz");
                                window.aQuizAR.currentlyTriggeredQuizId = event.obj_id

                                //// 依照 force_login, allow_retry, trigger_type, 使用者是否已登入 共2^4種情況 決定是否顯示quiz。 (給html UI綁上事件 點擊才顯示quiz)
                                window.aQuizAR.checkIfQuizOpenByTrigger(startQuiz, obj_id)
                            } else {
                                console.log("%cVRController.js _triggerEvent: ShowQuiz triggered, but user hasn't finnish previous quiz yet.", "color: orange")
                            }

                        case "QuizOption":
                            //// 考慮多個Quiz存在場上的情況，找出被點擊的是哪個Quiz的選項  (舊稱: "PushButton")
                            aQuizAR.loadedQuizzes.forEach( q => {
                                q.module.json.question_list.forEach( question => {
                                    question.options_json.forEach( option => {
                                        if( makarObj.el ){
                                            //// 3d
                                            if( makarObj.el.id == option.generalAttr.obj_id){
                                                q.quizOption( makarObj.el )  //// 觸發點擊事件
                                            }

                                        } else {
                                            //// 2d
                                            if( makarObj.obj_id == option.generalAttr.obj_id){
                                                q.quizOption( makarObj )  //// 觸發點擊事件
                                            }
                                        }
                                    })
                                })
                            })
                            break
                        //[end-20240130-renhaohsu-modify]//

                        case "MoveAlongPath":
                            target = document.getElementById(obj_id);
                            target.object3D.bezier.play();
                            break;

                        case "Facing":
                            //[start-20240130-renhaohsu-add]//
                            if(event.delay == true){
                                if(event.previousID){
                                    clearTimeout(event.previousID);
                                }
                                console.log("VRcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                                let timeoutID = setTimeout(() => {
                                    behavFacing()
                                }, 3000); 
                                event.previousID = timeoutID;
                                
                            } else {
                                behavFacing()
                            }   
            
                            function behavFacing(){
                                console.log("_triggerEvent: _Facing event=", event)
                                let lookObjId = event.source_id;
                                let lookObj = document.getElementById( lookObjId );
                                let targetObjId = event.toward_id;
                                let targetObj = document.getElementById( targetObjId );
                                // console.log("_triggerEvent: _Facing event=", event, lookObj, targetObj)
            
                                //// 確保「目標物件」「注視物件」都存在，建立持續事件
                                if (lookObj && lookObj.object3D && targetObj && targetObj.object3D ){

                                    self.addLookAtTimeLine( lookObj , targetObj , event );
            
                                }else{
                                    console.log('_triggerEvent: _Facing error, obj not exist', lookObj , targetObj );
                                }
                            }
                            //[end-20240130-renhaohsu-add]//
                            break
            
                        case "videoTogglePlayPause":
                            //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                            console.log("_videoTogglePlayPause", event)

                            //// 3D
                            target = document.getElementById(obj_id);
                            //// 2D
                            let obj2D = self.makarObjects2D.find( o => o.obj_id == event.obj_id )
                            
                            //// ios safari 需要先把其他影片都靜音
                            if (window.Browser){
                                if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                    // self.UnMutedAndPlayAllVisibleVideo( target );
                                    self.mute3dVideos()
                                    self.mute2dVideos()
                                }
                            }


                            if (target){
                                //// 3D
                                if(target.localName=="a-video"){
                                    ////     假如影片物件有「邏輯」，不予以控制
                                    ////     ↑ 20240607 確認viewer行為: 場景初始時影片不播放 一旦user點擊時會播且有聲 (看似是點擊事件會忽略blockly是否有開) --renhao
                                    // if ( child.el.blockly  ){
                                    //     console.log('VRFunc.js: _videoTogglePlayPause: set false, video blockly: do nothing ', child );
                                    // } else {
                                        // let id = child.el.getAttribute("src");
                                    let id = target.getAttribute("src");
                                    if(id!=undefined){
                                        id = id.split("#").pop();
                                        let v = document.getElementById(id);
                                        if (v instanceof HTMLElement){

                                            const isVideoPlaying = (material) => !!(material.currentTime > 0 && !material.paused && !material.ended && material.readyState > 2);

                                            if(isVideoPlaying(v)) {
                                                v.pause();

                                                
                                                //// ios safari 需要先把其他影片都靜音
                                                if (window.Browser){
                                                    if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                                    // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                        console.log("這裡應該讓其他的影片發出聲音")
                                                        v.muted = true;
                                                        //// 這裡應該讓其他的影片發出聲音
                                                        self.UnMutedAndPlayAllVisibleVideo()
                                                    }
                                                }
                                                

                                            } else {
                                                v.play();
                                                v.muted = false;
                                                self.safariUnMutedVideo = target;
                                            }
                                        }
                                    }
                                    // }
                                }
                            } else if(obj2D){
                                //// 2D

                                //// 錯誤處理  (理論上影片2D物件 都該有以下這些)
                                if( obj2D.makarType != "video2D" ){ return; }
                                if( obj2D.children.length == 0 ){ return; }
                                if( !obj2D.children[0].material ){ return; }
                                if( !obj2D.children[0].material.map ){ return; }
                                if( !obj2D.children[0].material.map.image ){ return; }
                                
                                if( obj2D.children[0].material.map.image.tagName == "VIDEO" ){
                                    const video = obj2D.children[0].material.map.image
                                    if(video){
                                        console.log("video.volume", video.volume)
                                        if(video.volume != 0){
                                            //// ios safari 需要先把其他影片都靜音
                                            if (window.Browser){
                                                if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                    self.UnMutedAndPlayAllVisibleVideo( obj2D );
                                                }
                                                else if(window.Browser.mobile == true){
                                                    // console.log("明明沒有對chrome做處理 但chrome也會自動只播放它然後停止別人  因此在點擊事件也要像ios一樣嗎")
                                                    self.UnMutedAndPlayAllVisibleVideo( obj2D );
                                                }
                                            }
                                        }
                                        
                                        const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                                        console.log("_videoTogglePlayPause obj2D isVideoPlaying" , isVideoPlaying)
                                        if(isVideoPlaying(video)) {
                                            video.pause();

                                            if(video.volume != 0){
                                                //// ios safari 需要先把其他影片都靜音
                                                if (window.Browser){
                                                    if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                                    // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                        //// 這裡應該讓其他的影片發出聲音
                                                        video.muted = true;
                                                        self.UnMutedAndPlayAllVisibleVideo()
                                                    }
                                                    else if(window.Browser.mobile == true){
                                                        console.log("chrome mobile ios 為何chrome自動播放會只剩一個然後停止別人??  所以在點擊事件也要像ios一樣嗎")
                                                        self.UnMutedAndPlayAllVisibleVideo();
                                                    }
                                                }
                                            }
                                            

                                        } else {
                                            video.play();
                                            video.muted = false;
                                            self.safariUnMutedVideo = obj2D;
                                        }

                                        
                                    }
                                }


                            } else {
                                //// 2D 3D 都找不到該 obj_id, 不應該發生
                                console.warn('VRFunc.js: _videoTogglePlayPause: target not exist. obj_id=', obj_id, " target=", target);
                                break;
                            }

                            break;
                
                        default: 
                            console.log("ARWrapper.js: _triggerEvent: default: event=", event );	


                    }


                }


                this.eventChangeScene = function( sceneID ){

                    let self = this ;

                    let pSceneChange = new Promise( function( resolve ){

                        //// 後續在補上 版本控制相關
                        if ( self.scenesData && Array.isArray( self.scenesData.scenes ) ){
                            console.log(' _eventChangeScene_: _sceneID: ', sceneID  );
                        }else{
                            console.log( '_eventChangeScene_: scenesData error ', self.scenesData );
                            resolve( false );
                        }
                        
                
                        for ( let i = 0; i < self.scenesData.scenes.length; i++ ){
                            if ( self.scenesData.scenes[i].info.id == sceneID ) {

                                //// v3.5.0.0 複合型專案，跳轉場景要考慮「前後場景類型」。
                                //// 這邊可能組合 「 AR -> AR 」「 AR -> VR 」「 AR -> XR 」
                                let sInfo = self.scenesData.scenes[i].info;
                                if ( sInfo.type == 'ar' ){
                                    //// [ AR -> AR ] 依照當前操控模式處理，假如是「模型觀看模式」，切換場景物件
                                    //// 假如是 「AR觀看模式」，切換「當前顯示場景編號」即可

                                    console.log(' _Scenes_ , to AR , ' , i , sInfo );

                                    if ( self.currentViewMode == 'model' ){

                                        self.setCurrentSceneIndex( i );
                                        
                                        self.sceneTargetList.forEach( e => {
                                            if ( e.sceneIndex == i ){

                                                let sceneIndex = e.sceneIndex;

                                                let obj = self.aframeNFTMarkers[ sceneIndex ]; 
                                                let obj2D = self.threeNFTMarkers2D[ sceneIndex ];

                                                //// 先檢查是否有載入過，沒有載入過，就載入。有載入過，就執行切換
                                                
                                                if ( obj.loadedObjects == true || obj2D.loadedObjects == true ){
                                                    
                                                    console.log('three.js: _setViewModeSceneObj: already loaded, call _activeAndClearScene_ ');

                                                    //// 啟動 「新的場景」
                                                    // console.log("_activeAndClearScene")
                                                    self.activeAndClearScene( sceneIndex, e.target_id);

                                                    let dpi = self.gcssTargets.dpi[obj.GCSSID] ; 
                                                    let GCSSWidth= self.gcssTargets.width[obj.GCSSID] ; 
                                                    let GCSSHeight= self.gcssTargets.height[obj.GCSSID] ; 
                                                    
                                                    obj.object3D.position.set( 0, 0, 0 );
                                                    obj.object3D.position.add( new THREE.Vector3(  -GCSSWidth*25.4/dpi/2 , -GCSSHeight*25.4/dpi/2 , 0 ) );

                                                    //// 檢查「場景物件」，「聲音」「影片」物件，執行「播放」
                                                    obj.object3D.traverse( function ( child ) {
                                                        //// 先確認物件是否可見
                                                        if ( child.getWorldVisible() == true ){
                                                            //// 播放影片部份
                                                            if ( child.makarType == 'video' ){
                                                                child.el.mp4Video.play();
                                                            }
                                                            //// 停止聲音部份
                                                            if ( child.makarType == 'audio' ){
                                                                child.el.components.sound.playSound();
                                                            }
                                                        }
                                                    });

                                                    obj.object3D.rotation.x =  -90 * Math.PI/180;
                                                    // obj.rotation.z =  10 * Math.PI/180;
                                                    obj.object3D.updateMatrix();
                                                    obj.object3D.updateMatrixWorld();

                                                    resolve( true );

                                                } else {

                                                    console.log('three.js: _setViewModeSceneObj: not loaded, call _loadMakarARScene_ ');

                                                    obj.loadedObjects = true;
                                                    obj2D.loadedObjects = true;
                                                    let targetID = self.sceneTargetList[marker.id].target_id
                                                    let pAll = arWrapper.arController.loadMakarARScene( sceneIndex, obj, obj2D, targetID );

                                                    let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                                                    if ( isPromise( pXML ) ){
                                                        pAll.push( pXML );
                                                    }

                                                    if ( Array.isArray(pAll) ){
                                                        Promise.all( pAll ).then( function( ret ){
                                                            console.log('three.js: _setViewModeSceneObj: done: ret = ' , ret  );
                                                            let scenes = [];
                                                            scenes = VC.getScenes( self.scenesData );
                                                            if ( scenes[sceneIndex].bezier.length > 0 ){
                                                                for (let i = 0; i < scenes[sceneIndex].bezier.length;i++){
                                                                    self.bezierPathAnime( obj, scenes[sceneIndex].bezier[i], sceneIndex );
                                                                }
                                                            }

                                                            //// 假如此專案的當前場景有「場景事件」，解析並且執行功能
                                                            if (scenes[sceneIndex].behav.length > 0){
                                                                self.activeSceneEvent(scenes[sceneIndex]);
                                                            }

                                                            if ( self.logicList[ sceneIndex ]  ){
                                                                self.logicList[ sceneIndex ].parseXML();
                                                            }

                                                            self.setupSceneBehav( sceneIndex );
                                                            // console.log("_activeAndClearScene")
                                                            self.activeAndClearScene( sceneIndex, e.target_id );

                                                            //[start-20240614-renhaohsu-add]//
                                                            //// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
                                                            if (window.Browser){
                                                                if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                                    
                                                                    //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                                                    self.mute3dVideos(true)
                                                                    self.mute2dVideos(true)
                                                                    
                                                                    self.UnMutedAndPlayAllVisibleVideo();
                                                                }
                                                            }
                                                            //[end-20240614-renhaohsu-add]//
                                                            
                                                            //[start-20231207-howardhsu-modify]//
                                                            //// v3.5.0.0 為 "點擊物件開啟"的quiz 的啟動物件 加上 behav
                                                            self.addBehavToQuizTriggerObj();

                                                            //// v3.5.0.0 如果有quiz是"直接顯示" 則顯示 html UI (startQuiz)
                                                            aQuizAR.checkIfQuizOpenDirectly()

                                                            resolve( true );
                                                        
                                                        }).catch((err) => {
                                                            console.warn('ARController.js: _eventChangeScene  load scene  error:', err)
                                                        });
                                                    }
                                                    //[end-20231207-howardhsu-modify]//
                                                }

                                            }
                                        });


                                    } else if ( self.currentViewMode == 'AR' ){

                                        //// 要是當前為 AR 觀看模式，跳轉場景後，不顯示 場景內容。只設定「當前場景編號」
                                        
                                        self.setCurrentSceneIndex( i ); 

                                        self.activeAndClearScene( -1 );

                                    }


                                }else if (sInfo.type == 'vr'){
                                    //// [ AR -> VR ]
                                    console.log(' _Scenes_ , to VR , ', sInfo );

                                    if ( window.mixController && window.vrController && window.vrController ){

                                        //// 先開啟「載入頁面」
                                        let loadPage = document.getElementById('loadPage');
                                        if (loadPage){
                                            loadPage.style.display = "block";
                                        }

                                        //// 隱藏 AR 相關內容
                                        arController.activeAndClearScene( -1 );
                                        arController.enableARRendering = false;

                                        //// 開啟 VR render
                                        vrController.enableVRRendering = true;

                                        //// 設定 「場景控制器」切換為 VR 
                                        mixController.setActiveType('VR');
                                        
                                        // vrController.vrSceneRootsDict
                                        vrController.triggerEnable = false;
                                        vrController.loadScene( i );

                                        if ( self.currentViewMode == 'model' ){
                                            vrController.setViewMode( 'model' )
                                        }else if ( self.currentViewMode == 'AR' ){
                                            vrController.setViewMode( 'VR' )
                                        }


                                    }
                                    
                                }else if (sInfo.type == 'ar_slam'){

                                    console.log(' _Scenes_ , to AR_SLAM , not yet ', sInfo );

                                    if ( window.mixController && window.xrController && window.xrController ){

                                        //// 隱藏 AR 相關內容
                                        arController.activeAndClearScene( -1 );
                                        arController.enableARRendering = false;

                                        //// 開啟 XR render
                                        xrController.enableXRRendering = true;

                                        //// 設定 「場景控制器」切換為 XR 
                                        mixController.setActiveType('XR');

                                        xrController.triggerEnable = false;
                                        xrController.loadScene( i );

                                        if ( self.currentViewMode == 'model' ){
                                            xrController.setViewMode( 'model' )
                                        }else if ( self.currentViewMode == 'AR' ){
                                            xrController.setViewMode( 'VR' )
                                        }

                                    }

                                }
                
                
                            }
                        }

                    });

                    return pSceneChange
            
            
                }


                //// 顯示物件
                this.showObjectEvent = function( target ,reset, switch_type ){

                    if (!target){
                        console.log('ARWrapper.js: _showObjectEvent: target not exist', target);
                        return;
                    }

                    if(switch_type == "Switch"){
                        if (target.getAttribute("visible")){
                            hideObject();
                        }
                        else{
                            showObject();
                        }
                    }
                    else if(switch_type == "Show"){
                        showObject();
                    }
                    else if(switch_type == "Hide"){
                        hideObject();
                    }

                    function hideObject(){
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
                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                self.UnMutedAndPlayAllVisibleVideo( self.safariUnMutedVideo );
                            }
                        }
            
            
                        target.object3D.traverse(function(child){
                            if (child.type=="Group"){
                                child.el.setAttribute('class', "unclickable" );
                                if(child.el.localName=="a-video"){
            
                                    //// 假如影片物件有「邏輯」，不予以控制
                                    if ( child.el.blockly  ){
                                        console.log('ARWrapper.js: _showObjectEvent: set false, video blockly: do nothing ', child );
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
                                if(child.makarObject && child.el.getAttribute("sound")){
                                    // child.el.components.sound.stopSound();
            
                                    if ( child.el.blockly ){
                                        console.log('ARWrapper.js: _showObjectEvent: set false, audio blockly: do nothing ', child );
                                    } else {
            
                                        if (child.behav_reference){
                                            child.el.setAttribute("visible", false);
                                        }
                                        for(let i in child.children ){
                                            if ( child.children[i].children[0].type == "Audio" ){					
                                                if (child.children[i].children[0].isPlaying == true ){
                                                    child.el.components.sound.stopSound();
                                                    
                                                    //// 手動觸發 聲音播放完畢的event (如果此物件有被邏輯"播放聲音物件等待直到結束" 讓它底下的block繼續執行下去)
                                                    let event = new Event('sound-ended');
                                                    child.el.dispatchEvent(event);
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

                    function showObject(){
                        //// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
                        //// 不論是要開啟還是關閉物件，都查找整個場景一遍中所有影片是否有「可見的」，挑選一隻影片為「有聲音」，其他為「靜音」
                        if (window.Browser){
                            if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                self.UnMutedAndPlayAllVisibleVideo( target );
                            }
                        }
            
                        target.setAttribute("visible",true);
                        let id = target.getAttribute("src");
                        if(id!=undefined){
                            id = id.split("#").pop();
                            let v = document.getElementById(id);
                            if (v instanceof HTMLElement){
                                // v.load();
                                v.play();
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
                                            console.log('ARWrapper.js: _showObjectEvent: set true, video blockly: do nothing  ', child );
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
                                    if(child.makarObject && child.el.getAttribute("sound")){
                                        
                                        if ( child.el.blockly ){
                                            console.log('ARWrapper.js: _showObjectEvent: set true, audio blockly: do nothing ', child );
                                        } else {
                                            child.el.components.sound.playSound();
                                        }
            
                                    }
                                }
                            }
                        });
                    }

                } //// _showObjectEvent_ end

                this.activeSceneEvent = function(currentSceneData){

                    let self = this;

                    for (let i = 0; i < currentSceneData.behav.length; i++){
                        let behav = currentSceneData.behav[i];
                        if (behav.trigger_type == 'Time'){
                            let timeString = new Date().toTimeString();
                            let hour = timeString.split(":")[0];
                            if( behav.trigger_end_time - behav.trigger_start_time >= 0){
                                if (hour >= behav.trigger_start_time && hour < behav.trigger_end_time){
                                    // self.triggerEvent(behav, false, null);
                                    handleTriggerEvent(behav);
                                }
                            }
                            else{
                                if (hour >= behav.trigger_start_time || hour < behav.trigger_end_time){
                                    // self.triggerEvent(behav, false, null);
                                    handleTriggerEvent(behav);
                                }
                            }
                            
                        }
                        else if(behav.trigger_type == "Gyro"){
                            let trigger = false;
                            let tID = setInterval(function(){
                                if(self.init_gyro != null){
                                    let yRotation;
                                    let cameraForGyro = document.getElementById("cameraForGyro")
                                    yRotation = (-(cameraForGyro.components["look-controls"].magicWindowAbsoluteEuler.y-self.init_gyro.y) / Math.PI * 180 ) % 360  ;
                                    if(yRotation < 0) yRotation += 360;

                                    let trigger_start_angle = behav.trigger_start_vec.split(",").map( x => Number(x) )[1];
                                    let trigger_end_angle = behav.trigger_end_vec.split(",").map( x => Number(x) )[1];

                                    trigger_start_angle = trigger_start_angle % 360
                                    if(trigger_start_angle < 0) trigger_start_angle += 360;

                                    trigger_end_angle = trigger_end_angle % 360
                                    if(trigger_end_angle < 0) trigger_end_angle += 360;

                                    if (trigger_end_angle - trigger_start_angle > 0){
                                        if (yRotation >= trigger_start_angle && yRotation <= trigger_end_angle){
                                            if(!trigger){
                                                trigger = true;
                                                // self.triggerEvent(behav, false, null);
                                                handleTriggerEvent(behav);
                                            }
                                        }
                                        else{
                                            trigger = false;
                                        }
                                    }
                                    else{
                                        if (yRotation >= trigger_start_angle || yRotation <= trigger_end_angle){
                                            if(!trigger){
                                                trigger = true;
                                                // self.triggerEvent(behav, false, null);
                                                handleTriggerEvent(behav);
                                            }
                                        }
                                        else{
                                            trigger = false;
                                        }
                                    }
                                }
                                
                            }, 0);

                            self.intervalList.push(tID);
                        }
                        
                    }

                    //[start-20240401-renhaohsu-modify]//
                    function handleTriggerEvent(behav){
                        let gObj;
                        if ( behav.obj_id ){
                            gObj = self.getObjectTypeByObj_id( behav.obj_id );
                            
                            if (behav.behav_type == "Display"){
                                console.log("gObj", gObj)

                                const tempObj = { "behav": [behav] }
                                console.log("dealAllGroupHide")
                                self.dealAllGroupHide( tempObj , arController.currentSceneIndex);
                                
                                if ( gObj.obj_type == '2d' ){
                                    behav.behav_type = "Display2D"; //// seperate from Display
                                } 
                            }
                            self.triggerEvent(behav, false, null);
                        } 
                    }
                    //[end-20240401-renhaohsu-modify]//
                }
                ///// 事件系統 結束

                //// for pointCard: show points 
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




                this.getSnapShot = function(  ){

                    let self = this;
    
                    let pSnapShot = new Promise( function( snapResolve ){
    
                        // if ( !self || !self.GLRenderer || !self.arScene || !self.arScene.videoScene || !self.arScene.videoCamera ||
                        //     !self.arScene.glScene || !self.arScene.camera || !self.arScene.scene2D || !self.arScene.camera2D || !self.GLRenderer.domElement ||
                        //     !self.GLRenderer.domElement.clientWidth || !self.GLRenderer.domElement.clientHeight || 
                        //     !self.GLRenderer.domElement.width || !self.GLRenderer.domElement.height 
                        // ){
                        if (!self || !self.GLRenderer || !self.arScene || !self.arScene.videoScene || !self.arScene.videoCamera ||
                            !self.arScene.camera || !self.arScene.scene2D || !self.arScene.camera2D || !self.GLRenderer.domElement ||
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
    
                        let dataURL;

                        //// 改變 canvas，在AR不是必須的。讓圖片原版比例改變。
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
                        // dataURL = newCanvas.toDataURL("image/png", 1.0);
            
                        dataURL = self.GLRenderer.domElement.toDataURL("image/png", 1.0);
            
                        snapResolve( dataURL ) ; 
    
                    } );
    
                    return pSnapShot ;
    
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




            } //// setupThree end


        }


    }



    //// 啟動 AR 流程，目前是包含「啟動相機」功能，必須要完成，依照當前啟動場景決定是否隱藏

    //// v3.5.0.0 目前區分為「直接啟動」，或是「只要載入完辨識圖跟預備場景資料」。
    initARProcess( option ){

        let self = this;

        let pInitAR = new Promise( function( initARresolve ){
            
            if ( window.ARController && ARController.getUserMediaThreeScene && window.ARProxy ){
                console.log(' _initARProcess_: all done '  )

            }else{
                console.warn(' _initARProcess_: not loaded , _return ' )
                return;
            }

            let facing = 'environment';

            ARController.getUserMediaThreeScene({maxARVideoSize: 640, cameraParam: '../camera_para_640_480_fei.dat', facing: facing , // facing: user or environment 
            onSuccess: function(arScene, arController, arCamera) {
                // console.log("three.js: _ARThreeOnLoad onSuccess start");
                var proxy = new ARProxy(arController, '../camera_para_640_480_fei.dat', function() { //// basically, the current path is same with HTML file. NOTE: if the path is already on root, ../ will not working.  
                    // console.log("three.js: ARProxy callback done");
                });
                window.proxy = proxy;
                
                //// 改版為 aframe 架構
                let arfScene = document.getElementById('arfScene');
                
                let arfCanvas = arfScene.canvas;

                arController.arfScene = arfScene;

                //// v3.5.0 素材算為「跨場景共用」。所以創建在「 場景控制器母層 」
                // arController.loadAssets();

                arController.facing = facing;

                let GLRenderer = arfScene.renderer;

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

                // arController.ARSceneResult = sceneResult;
                window.arController = arController;

                self.arController = arController;


                //////////// 可掛載【載入物件功能】
                //[start-20231130-renhaohsu-modify]//
                self.arController.setARTransform = setARTransform
                self.arController.loadAudio = loadAudio
                self.arController.loadGLTFModel = loadGLTFModel
                // self.arController.loadMaterialTexture = loadMaterialTexture
                self.arController.loadWebViewNotSupport = loadWebViewNotSupport
                self.arController.loadWebViewNotSupport2D = loadWebViewNotSupport2D        
                self.arController.loadTexture2D = loadTexture2D
                self.arController.loadTexture3D = loadTexture3D
                self.arController.loadLight = loadLight
                self.arController.loadText2D = loadText2D
                self.arController.loadText3D = loadText3D
                self.arController.loadVideo2D = VideoModule.loadVideo2D
                self.arController.loadVideo3D = VideoModule.loadVideo3D
                self.arController.loadCurve = loadCurve
                self.arController.bezierPathAnime = bezierPathAnime
                self.arController.loadScratchCard = loadScratchCard
                self.arController.loadPointCard = loadPointCard
                self.arController.UnMutedAndPlayAllVisibleVideo = VideoModule.UnMutedAndPlayAllVisibleVideo
                self.arController.mute2dVideos = VideoModule.mute2dVideos
                self.arController.mute3dVideos = VideoModule.mute3dVideos
                self.arController.pause2dVideos = VideoModule.pause2dVideos
                self.arController.pause3dVideos = VideoModule.pause3dVideos
                self.arController.loadYouTubeNotSupport = VideoModule.loadYouTubeNotSupport
                self.arController.loadYouTubeNotSupport2D = VideoModule.loadYouTubeNotSupport2D
                
            	//// source: artoolkit.three.js 
                self.arController.languageType = window.languageType = "tw";
                
                self.arController.worldContent = {
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
                //[end-20231130-renhaohsu-modify]//

                //// 3.5.0 將「使用者素材資料」放入 arController
                if ( typeof( self.userProjResDict ) == 'object' ){
                    arController.userProjResDict = self.userProjResDict;
                }
                if ( typeof( self.userOnlineResDict ) == 'object' ){
                    arController.userOnlineResDict = self.userOnlineResDict;
                }
                if ( typeof( self.userMaterialDict ) == 'object' ){
                    arController.userMaterialDict = self.userMaterialDict
                }


                //// 起始設定，由於目前 「朗讀文字」的功能棟有第一次無法取得 發聲列表 問題，所以這邊先行呼叫一次
                if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){
                    let voices = speechSynthesis.getVoices();
                    arController.voices = voices;
                }

                proxy.addEventListener('load', function(ev) {
                    // console.log("three.js: load: ev=", ev);
                    this.processingDone = false ;

                    // if (window.publishARProjs && window.sceneResult ){
                    if ( self.currentProjData && self.scenesData && self.targetList ){

                        let currentProjData = self.currentProjData ;
                        let scenesData = self.scenesData;

                        arController.currentProjData = currentProjData;
                        arController.scenesData = self.scenesData;


                        //// 3.5.0 預計後續 「 場景控制器 」 會調派「 各類型專案場景 」
                        
                        //// add the default 2D object, note
                        // var defaultRoot2DNote1 = arController.createThreeNFTMarker2D( "-3" ); //set the GCSSID = -x, means its not user added 
                        // this.arController.loadDeaultTexture2D( defaultRoot2DNote1, "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/note1.png", // "../images/note1.png"
                        //     new THREE.Vector3(0,-50,0) , // position
                        //     new THREE.Vector3(0,0,0) , // rotation
                        //     new THREE.Vector3( 0.9, 0.9, 0.9) , // scale
                        //     [0.5, 1], //rect [-1, -0.5, 0, 0.5, 1] means left-right and down-top  , [0.5, 0]
                        //     {simple_behav: "runAnimation2D", dt:200, dopacity:0.1 }    //// behavior
                        // );
                        // defaultRoot2DNote1.name = "note1";
                        // defaultRoot2DNote1.visible = false; // not show at first, if getFrameTarget false, show it.
                        
                        // arScene.scene2D.add(defaultRoot2DNote1);

                        
                        /////// 計算所有 target 數量
                        let targetsNumber = 0;
                        //// 計算「 AR 場景數量 」
                        let arSceneNumber = 0;
                        let targetNo = 0;

                        let targetLoadedCount = 0;

                        let sceneTargetList = [];
                        arController.sceneTargetList = sceneTargetList;


                        //// 3.5.0 版本，以「專案資訊」取得「辨識圖」
                        //// 先進行「版本控制判斷」
                        let scenes = [];
                        scenes = VC.getScenes( scenesData )

                        
                        for ( let i = 0 ; i < scenes.length ; i++ ){
                            if ( Array.isArray( scenes[i].target_ids ) ){
                                targetsNumber += scenes[i].target_ids.length ;
                            }

                            let s = scenes[ i ];
                            if ( s.info && s.info.type == 'ar' ){
                                arSceneNumber += 1;
                            }
                        }


                        console.log("three.js: _load: the total target number = " , targetsNumber );
                        
                        //// 設定的辨識圖上限為 20 超過的話不進行後續流程。
                        if (targetsNumber > 19){
                            console.log("three.js: _load: languageType = " , languageType );
                            warnModal.style.display = "block";
                            warnModalInfo.textContent = self.arController.worldContent.targetNumberError[languageType] ;

                            warnModalButton.onclick = function(){
                                console.log("three.js: the warnModalButton is clicked ");
                                warnModal.style.display = "none";
                                // parent.aUI.closeCoreIframe();
                            }
                            return;
                        }

                        let onloadNFTMarker = function(ev){
                            
                            //// v3.5.0.0 這邊註記，預計改版為「每次辨識圖載入」完成後判斷「是否需要將辨識圖虛擬物件放入場景」。

                            console.log('three.js: _onloadNFTMarker: ev = ', ev );

                            // let markerRoot =    arController.createThreeNFTMarker(ev.result[0] ); //the ev is from  makarWebAR.worker.js not from makarWebAR.api.js 
                            
                            let markerRoot   =  arController.createAframeNFTMarker(ev.result[0] );
                            
                            let markerRoot2D =  arController.createThreeNFTMarker2D(ev.result[0] );

                            //// 將「辨識圖物件 上入 場景」轉移到「創建流程」，為了更好控管
                            // arScene.scene2D.add(markerRoot2D);
                            // arController.arfScene.appendChild( markerRoot );

                            //// 紀錄「載入完成辨識圖數量」
                            targetLoadedCount += 1;

                            //////// 載入所有 targets 完成後在讓畫面啟動
                            // if ( Object.values(arController.aframeNFTMarkers).length == targetsNumber ){
                            if ( Object.values(arController.aframeNFTMarkers).length == arSceneNumber ){

                                //// 將所有「辨識圖虛擬物件」的位置設定
                                
                                let self = arController;
                                
                                if ( self.aframeNFTMarkers ){
                                    for ( let i in self.aframeNFTMarkers ){
                                        let obj = self.aframeNFTMarkers[ i ];
                                        if ( Number.isInteger( Number( obj.GCSSID ) ) && 
                                            obj && obj.object3D
                                        ){
            
                                            if ( self.gcssTargets && self.gcssTargets.dpi &&
                                                 self.gcssTargets.width && self.gcssTargets.height 
                                            ){

                                                let dpi = self.gcssTargets.dpi[obj.GCSSID] ; 
                                                let GCSSWidth= self.gcssTargets.width[obj.GCSSID] ; 
                                                let GCSSHeight= self.gcssTargets.height[obj.GCSSID] ; 
                
                                                obj.object3D.matrixAutoUpdate = true;
                                                obj.object3D.position.set( 0, 0, 0 );
                                                obj.object3D.position.add( new THREE.Vector3(  -GCSSWidth*25.4/dpi/2 , -GCSSHeight*25.4/dpi/2 , 0 ) );
                
                
                                                obj.object3D.rotation.x =  -90 * Math.PI/180;
                                                // obj.rotation.z =  10 * Math.PI/180;
                                                obj.object3D.updateMatrix();
                                                obj.object3D.updateMatrixWorld();
                                            }

                                        }            
                                    }
                                }



                                //// 20201029 為了解決 iphone上畫面卡住問題
                                // 假如先執行 video.play() 等待 一段時間 再執行 tick 則畫面高機率卡住
                                // 假如先執行 tick 等待 n ms 再執行 video.play() 則畫面高機率順暢（沒遇到卡住）
                                console.log("three.js: _onloadNFTMarker done, call arScene.video.play() " );

                                proxy.processingDone = true;

                                console.log("three.js:arScene.video.play()=>tick()" );

                                //// v3.5.0.0
                                //// 假如要直接啟動 AR 繪製，才會往下判斷「體驗方式」
                                //// 反之，只讓 _arController 啟動，但是不載入「場景」
                                // if ( option && option == true ){
                                    
                                //     arController.enableARRendering = true;

                                //     ////
                                //     //// 最後一張辨識圖載入完成，往下判斷啟動方式為「模型觀看」還是「AR」
                                //     //// 會很麻煩 
                                //     ////

                                //     let homePage = document.getElementById('homePage');

                                //     if ( parent.selectedProject ){
                                //         if ( parent.selectedProject.viewMode == 'XR' ){
                                            
                                //             let pSetViewMode = arController.setViewMode( 'AR' );
                                //             pSetViewMode.then(function(){
                                //                 if (homePage){homePage.style.display = "none"; }
                                //             });

                                //         }else if (parent.selectedProject.viewMode == 'model'){
                                //             let pSetViewMode = arController.setViewMode( 'model' );
                                //             pSetViewMode.then(function(){
                                //                 if (homePage){homePage.style.display = "none"; }
                                //             });
                                //         }else{
                                //             let pSetViewMode = arController.setViewMode( 'AR' );
                                //             pSetViewMode.then(function(){
                                //                 if (homePage){homePage.style.display = "none"; }
                                //             });
                                //         }
                                //     }else{
                                //         let pSetViewMode = arController.setViewMode( 'AR' );
                                //         pSetViewMode.then(function(){
                                //             if (homePage){homePage.style.display = "none"; }
                                //         });
                                //     }
                                    

                                //     //// 最後一張辨識圖載入完成，執行隱藏UI
                                //     if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
                                //         typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
                                //     ){
                                //         if ( parent.projectUIController.status == -1 ){
                                //             parent.projectUIController.showUI();
                                //         }
                                //     }


                                // }else{

                                // }

                                ///// 回傳「 AR 流程載入完成 」
                                initARresolve();

                                //// 呼叫「固定更新」，包含「畫面繪製」「影像辨認」
                                tick();

                                setTimeout(function(){

                                    arScene.video.play().then(function(){
                                        console.log("three.js:arScene.video.play()=> succes" );
                                    }).catch(function(error){
                                        console.error("three.js:arScene.video.play()=> error", error);	
                                    });

                                }, 10 );
                                //// 啟動計時器
                                arController.userStartTime = new Date().getTime();




                            }
                        }
                        


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


                            //// 載入「辨識圖」，並且創建「場景基底」，基本區分「一般場景」跟「集點卡場景」
                            //// 另外，對於「著色場景」 後續考慮多作處理

                            //// 著色場景，規則改為 「 _coloring_sid_ 」 必須要有「 _coloring 」後面再接上 「 場景編號 」 後面必定要用「空白」收尾
                            //// 舉例 「 _coloring_0_ 其他說明 」 「 _coloring_1_2_5_ 其他文字 」 等等 
                            //// 由於目前沒有「 場景說明 」或是 「 場景模組資料紀錄 」，目前預定紀錄在 sceneTargetList 裡面

                            //// 預期只會有「一個專案」
                            let sceneWithColoring = [];
                            let projectData = VC.getOneProj( currentProjData ) ;
                            if ( projectData ){

                                if ( projectData.proj_descr ){
                                    if ( projectData.proj_descr.includes("_coloring")  ){
                                        let pd = projectData.proj_descr;
                                        let ts = pd.indexOf("_coloring") 
                                        let te = pd.slice( ts + 10 ).indexOf( ' ' )  // 10 是 _coloring_ 的長度
                                        let tnArr = pd.slice( ts + 10 , ts + 10 + te ).split( '_' ) ;
                                        for( let i = 0; i < tnArr.length; i++ ){
                                            if ( Number.isInteger( Number( tnArr[i] ) ) ){
                                                sceneWithColoring.push( Number( tnArr[i] ) )
                                            }
                                        }
                                    }
                                }
                            }


                            for ( let i = 0; i < scenes.length; i++ ){				

                                if ( Array.isArray( scenes[i].target_ids ) && 
                                    scenes[i].info && scenes[i].info.type == 'ar' )
                                {

                                    ///// 場景帶有「辨識圖列表」
                                    let target_ids = scenes[i].target_ids ;
                                    for ( let j = 0; j < target_ids.length; j++  ){
                                        let target_id = target_ids[j];

                                        //// 依照「辨識圖 ID 」查找「 GCSS 資料 」
                                        //// 這邊不管「專案是否帶有模組」，一律載入「辨識圖」
                                        // if ( window.userTargetsData && window.userTargetsData && window.userTargetsData.data && 
                                        //     Array.isArray( window.userTargetsData.data.list ) )
                                        // {
                                        
                                        if ( self.targetList ){

                                            let userTargetList = self.targetList;
                                            for ( let k = 0; k < userTargetList.length; k++ ){
                                                if ( userTargetList[k].target_id == target_id ){
                                                    let gcssURL = userTargetList[k].gcss_url;

                                                    sceneTargetList[ targetNo ] = {
                                                        // projIndex: i ,  //// 3.5.0 這個之後要取消 
                                                        sceneIndex: i , 
                                                        targetIndex: j , //// 此參數功能為「同一個場景可能有多張辨識圖/集點卡」。
                                                        // targetIndex: targetNo,
                                                        target_id: target_id ,
                                                        modules: [] , //// 3.5.0 之後「模組」可能在各個場景下，紀錄，以利載入時候判定
                                                    };

                                                    //// 假如此場景帶有「著色模組需求」。加入
                                                    if ( sceneWithColoring.includes( i ) ){
                                                        sceneTargetList[ targetNo ].modules.push( 'coloring' );
                                                    }

                                                    //// 此流程會「載入 GCSS 辨識圖 」，並且完成後呼叫 callback 來創建 「 辨識圖 場景物件 」
                                                    //// 同時將「辨識圖 ID 」設為「物件 ID」

                                                    proxy.loadNFTMarker( gcssURL.substring(0, gcssURL.length-5), targetNo, targetsNumber , onloadNFTMarker );

                                                    targetNo++;
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
                            }



                            
                            console.log("three.js: _load: , _sceneTargetList = ", sceneTargetList );

                        });
                    
                    }
                });
                
                document.body.className = arController.orientation;


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



                // GLRenderer.domElement.addEventListener( 'touchend', endEvent, false ); //// depend the renderer.
                // GLRenderer.domElement.addEventListener( 'mouseup', endEvent, false ); //// depend the renderer.

                // ////// for choose the makarObject for control
                // GLRenderer.domElement.addEventListener( 'touchmove', moveEvent, false );
                // GLRenderer.domElement.addEventListener( 'mousemove', moveEvent, false );

                // GLRenderer.domElement.addEventListener( 'touchstart', startEvent, false );
                // GLRenderer.domElement.addEventListener( 'mousedown', startEvent, false );




                //////  set the temporary empty object, will replace it by the touchstart(cell phone)/mouseDown(PC)
                var objectControls = new THREE.ObjectControls( GLRenderer.domElement, new THREE.Object3D() );  
                objectControls.enableVerticalRotation();
                // objectControls.setRotationSpeed( 0.1 ); // for PC 
                objectControls.setRotationSpeed( 0.05 ); // for PC 
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
                


                let preMouse = new THREE.Vector2();
                let mouse = new THREE.Vector2();
                let raycaster = new THREE.Raycaster();

                //// v3.5.0.0 複合形專案，點擊事件由母層監聽，點擊觸發後再傳遞進到「對應控制器」
                //// 這邊考量上，還是區分「電腦上： 滑鼠下/滑鼠動/滑鼠上 」「手機上： 點擊開始/點擊移動/點擊結束」的事件。
                arController.getMouse = function( event ) {

                    let self = arController;

                    let GLD = self.GLRenderer.domElement;
                    let rect = GLD.getBoundingClientRect();

                    let mouse = new THREE.Vector2();

                    switch ( event.type ) {
                        case "mouseup":
                        case "mousemove":
                        case "mousedown":
                            mouse.x = ( (event.clientX - rect.left) / GLD.clientWidth ) * 2 - 1; 
                            mouse.y = - ( (event.clientY - rect.top) / GLD.clientHeight ) * 2 + 1; 
                            break;
                        case "touchend":
                        case "touchstart":
                        case "touchmove":
                            mouse.x = ( (event.changedTouches[0].clientX - rect.left) / GLD.clientWidth ) * 2 - 1;
                            mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / GLD.clientHeight ) * 2 + 1; 
                            break;
                        default:
                            console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
                            return ;
                    }

                    return mouse;
                }


                //// v3.5.0.0 AR 事件系統
                
                // function endEvent( event ) {
                arController.clickEndEvent = function( event ){

                    let self = arController;

                    if (arController.objectControlState == 2){
                        return;
                    }

                    let mouse = self.getMouse(event);


                    //// 紀錄此次點擊是否有「觸發事件」，不論是「2D」「3D」「點擊事件」「邏輯功能」
                    let eventTriggered = {};

                    //// 2d part 
                    raycaster.setFromCamera( mouse, arScene.camera2D );

                    // if ( arController.currentProjectIndex != null ){
                    if ( arController.currentSceneIndex != null ){

                        //// 邏輯上，同一時間只會顯示一個AR專案，固只要檢測其下物件即可
                        let currentTargetObject2D = arController.threeNFTMarkers2D[ arController.currentSceneIndex ];
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

                                arController.dealAllGroupHide( touchObject2D , arController.currentSceneIndex  );


                                for ( let i = 0; i < touchObject2D.behav.length; i++ ){

                                    let gObj;
                                    if ( touchObject2D.behav[i].obj_id ){
                                        gObj = arController.getObjectTypeByObj_id( touchObject2D.behav[i].obj_id );
                                    }

                                    if (touchObject2D.behav[i].behav_type == "Display"){

                                        if ( gObj.obj_type == '2d' ){
                                            var tempBehav = Object.assign({}, touchObject2D.behav[i]);
                                            tempBehav.behav_type = "Display2D"; //// seperate from ShowImage
                                            arController.triggerEvent( tempBehav, reset, touchObject2D );
                                        }else if ( gObj.obj_type == '3d' ) {
                                            arController.triggerEvent( touchObject2D.behav[i] , reset, touchObject2D   );
                                        }
                                    
                                    }else if ( touchObject2D.behav[i].behav_type == "Coloring" ){
                                        arController.triggerEvent( touchObject2D.behav[i], reset, touchObject2D );
                                    }else {
                                        arController.triggerEvent( touchObject2D.behav[i], reset, touchObject2D );
                                    }

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

                        let makarTHREEObjects = [];
                        for ( let i = 0; i < arController.makarObjects.length; i++ ){
                            let makarObject = arController.makarObjects[i];
                            if ( makarObject.object3D ){
                                    makarTHREEObjects.push(makarObject.object3D );
                            }
                        }

                        //// 邏輯上，同一時間只會顯示一個AR專案，固只要檢測其下物件即可
                        // let intersects = raycaster.intersectObjects(  makarTHREEObjects , true ); 


                        let currentTargetObject = arController.aframeNFTMarkers[ arController.currentSceneIndex ];
                        let intersects = raycaster.intersectObject(  currentTargetObject.object3D , true ); 
                    

                        if (intersects.length != 0 ){

                            // console.log("endEvent: intersects =", intersects );

                            let touchObject = arController.getMakarObject( intersects[0].object );
                            // console.log("three.js: endEvent: 3D intersects touchObject =", touchObject );

                            //// 處理「邏輯功能的點擊事件」，設定上「邏輯功能」跟「點擊事件」是不會同時存在的。
                            let intersectObject3D = touchObject.el ;
                            // console.log("three.js: _setupFunction: endEvent, intersectObject3D=", intersectObject3D.object3D ) ;
                            if ( intersectObject3D ) {
                                if(intersectObject3D.onclickBlock){	
                                    for(let i = 0; i < intersectObject3D.onclickBlock.length; i++){
                                        if(intersectObject3D.onclickBlockState[i]){
                                            intersectObject3D.onclickBlockState[i] = false;

                                            arController.logicList[ arController.currentSceneIndex ].parseBlock( intersectObject3D.onclickBlock[i], function(){
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

                                // let projIndex = arController.sceneTargetList[ arController.currentProjectIndex ].projIndex ;
                                arController.dealAllGroupHide( touchObject , arController.currentSceneIndex );


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
                                            gObj = self.getObjectTypeByObj_id( touchObject.behav[i].obj_id );
                                        } 
            
                                        //[start-20231110-howardhsu-modify]//	
                                        if(touchObject.behav[i].behav_type == "ShowQuiz"){
                                            
                                            touchObject.behav[i].scene3DRoot = currentTargetObject

                                            //// 顯示 quiz 之前，先判斷 "瀏覽器本次載入場景後" 是否已經遊玩
                                            if(touchObject.behav[i].played == false){
                                                self.triggerEvent( touchObject.behav[i], reset, touchObject )
                                            } else {
                                                console.log('VRFunc.js: _setupFunction: endEvent:  Quiz had been played.', touchObject.behav[i].played)
                                            }
            
                                        } else if (touchObject.behav[i].behav_type == "Display"){
                                                
                                            if ( gObj.obj_type == '2d' ){
                                                let tempBehav = Object.assign({}, touchObject.behav[i]);
                                                tempBehav.behav_type = "Display2D"; //// seperate from Display
                                                self.triggerEvent( tempBehav, reset , touchObject );
                                            }else if ( gObj.obj_type == '3d' ){
                                                self.triggerEvent( touchObject.behav[i], reset, touchObject );
                                            }
                                            
                                        } else if (touchObject.behav[i].behav_type == "Media"){
                                                
                                            if ( gObj.obj_type == '2d' ){
                                                let tempBehav = Object.assign({}, touchObject.behav[i]);
                                                tempBehav.behav_type = "Media2D"; //// seperate from Media
                                                self.triggerEvent( tempBehav, reset , touchObject );
                                            }else if ( gObj.obj_type == '3d' ){
                                                self.triggerEvent( touchObject.behav[i], reset, touchObject );
                                            }
                                            
                                        } else {
                                            self.triggerEvent( touchObject.behav[i], reset, touchObject );
                                        }
                                        //[end-20231110-howardhsu-modify]//	

                                    }
                                }
                                // arController.triggerEvent( touchObject.behav[0], touchObject ); // 20190827: add the parameter obj( makarObject)

                                // return;
                            }
                            // console.log("three.js: touchObject" , touchObject );
                            // if (touchObject.main_type == "button"){
                            //     console.log("three.js: button click " , touchObject );
                            //     arController.pushButton( touchObject );
                            // }
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

                // function startEvent(event){
                arController.clickStartEvent = function( event ){

                    let self = arController;

                    // console.log(" three.js: moveEvent: event type=", event.type );
                    arController.objectControlState = 1;

                    event.preventDefault();

                    let mouse = self.getMouse(event);

                    preMouse = self.getMouse(event);

                    //// 3d model part
                    raycaster.setFromCamera( mouse, arController.camera );

                    if ( arController.currentSceneIndex != null ){
                        

                        let currentTargetObject = arController.aframeNFTMarkers[ arController.currentSceneIndex ];
                        
                        let intersects = raycaster.intersectObjects( [ currentTargetObject.object3D ]  , true ); 

                        if (intersects.length != 0 ){
                            // console.log("startEvent: intersects =", intersects );
                            let touchObject = arController.getMakarObject( intersects[0].object );
                            // console.log("startEvent: touchObject =", touchObject );

                            //// 點擊起始，要因應物件掛載的「 FingerGesture 」事件，是否為「active」來決定是否要將此物件加入「手指操控」
                            //// 版本控制上，  3.3.0 版之前物件可能完全沒帶有事件，所以無條件啟動「手指操控」。
                            // if ( touchObject.behav ){
                                let gotFingerGesture = false; //// 紀錄是否物件有找到「手指操控事件」，舊版本編輯器出的物件不會有
                                let fingerActive = true; //// 紀錄「手指操控事件」的狀態

                            //     if ( touchObject.behav ){
                            //         touchObject.behav.forEach( e => {
                            //             if ( e.simple_behav == 'FingerGesture' ){
                            //                 gotFingerGesture = true;
                            //                 if ( e.active == true ){
                            //                     fingerActive = true;
                            //                 }else{
                            //                     fingerActive = false;
                            //                 }
                            //             }
                            //         });
                            //     }

                            //     //// 先判斷是否物件有「手指操控事件」，有的話再判斷「是否可以操控」。假如物件沒有「手指操控事件」，無條件視為「可以操控」
                            //     if ( gotFingerGesture == true ){
                            //         if ( fingerActive == true){
                            //             arController.controlObject = touchObject;
                            //             arController.currentControllObject = touchObject;
                            //         }else{
                            //             arController.controlObject = null;
                            //         }
                            //     }else{
                            //         arController.controlObject = touchObject;
                            //         arController.currentControllObject = touchObject;
                            //     }
                                
                            // }
                            
                            
                            //// v3.5 由 generalAttr.interactable 判斷是否可以手指操控
                            const obj_id = touchObject.el.id
                            let objJson = makarUserData.scenesData.scenes[self.currentSceneIndex].objs.find(o=>o.generalAttr.obj_id == obj_id)
                            if( objJson ){
                                gotFingerGesture = true;

                                                                        //// YT(isUnsupported)物件 如果是別人的子物件 手指操控時文字距離有誤  
                                                                        //// 暫時先讓它不能被手指操控   renhaohsu持續修正中
                                if ( objJson.generalAttr.interactable && (objJson.generalAttr.obj_type == "3d" && objJson.sub_type != "youtube") ){
                                    objectControls.setObjectToMove( touchObject );
                                    objectControls.setCurrentControllObject( touchObject );
                                    
                                    fingerActive = true;
                                }else{
                                    fingerActive = false;
                                }
                            } else {
                                //// 在 objJson 找不到它的資料，則表示它是因別的物件需要而加上(例: YouTubeUnsupport的文字物件)
                                //// 通常是子物件 不開啟手指操控 (隨著母物件旋轉/縮放)
                                fingerActive = false
                                gotFingerGesture = false;
                            }

                            if ( !fingerActive && !gotFingerGesture ){                    
                                console.log("startEvent: fingerActive=", fingerActive, "gotFingerGesture=", gotFingerGesture)
                            }
                            //// 先判斷是否物件有「手指操控事件」，有的話再判斷「是否可以操控」。假如物件沒有「手指操控事件」，無條件視為「可以操控」
                            else if ( gotFingerGesture == true ){
                                if ( fingerActive == true){
                                    arController.controlObject = touchObject;
                                    arController.currentControllObject = touchObject;
                                }else{
                                    arController.controlObject = null;
                                }
                            }
                            else {
                                //// 假如物件沒有帶有任何「事件」，預設物件為「可控制」，因為舊版本如此。
                                arController.controlObject = touchObject;
                                arController.currentControllObject = touchObject;
                            }
                        }else{
                            arController.controlObject = null;
                        }

                    }

                }


                // function moveEvent(event){
                arController.clickMoveEvent = function( event ){ 

                    let self = arController;
                    //// 滑鼠移動 或是 點擊移動。
                    //// 要判斷「是否有位移超過距離」，是的話代表使用者行為是「控制物件」而不是「觸發事件」

                    let moveMouse = self.getMouse(event);

                    if ( arController.objectControlState == 1 ){
                        if ( moveMouse.sub( preMouse ).length() > 0.01 ){
                            arController.objectControlState = 2;
                        }
                    }
                    

                }

                
                let tick = function() {
                    let tstart = new Date().getTime();

                    let td = 30;

                    //// 依照「是否啟動 AR 繪製」來決定
                    if ( arController.enableARRendering == true ){

                        if ( arController.enableTracking == true ){
                            proxy.process(arScene.video);
                        }

                        //// check if the model (visible) have animation, update it.
                        let dt = arController.clock.getDelta();

                        for (let i = 0; i < arController.makarObjects.length; i++ ){
                            if ( arController.makarObjects[i].playAnimation == true &&  arController.makarObjects[i].visible == true ){
                                arController.checkAimation( arController.makarObjects[i].children[0] , dt);
                            }
                        }
                        arScene.renderOn(GLRenderer, null);
                        let tend = new Date().getTime(); // small to millisecond                        
                        if ( (tend-tstart) < 30 ) td = 30 - (tend - tstart)+1;
                        else td = 1;

                    }else{

                        td = 30;

                    }

                    

                    setTimeout(tick, td  ); // surprisingly, use this will make the "hanging" on iphone disappear. I think the reason is frameRate.  

                    // requestAnimationFrame(tick); // dont use it, because of the haning problem

                };


            }}); //// _getUserMediaThreeScene_ end

        }); //// _pInitAR_ end

        return pInitAR;

    }


    //// 開始執行 AR 流程，可能等待「 掃描辨識圖 」或是「 模型觀看 」

    startAR(){
        
        let self = arController;
                                    
        self.enableARRendering = true;

        ////
        //// 最後一張辨識圖載入完成，往下判斷啟動方式為「模型觀看」還是「AR」
        //// 會很麻煩 
        ////

        let homePage = document.getElementById('homePage');

        if ( parent.selectedProject ){
            if ( parent.selectedProject.viewMode == 'XR' ){
                
                let pSetViewMode = self.setViewMode( 'AR' );
                pSetViewMode.then(function(){
                    if (homePage){homePage.style.display = "none"; }
                });

            }else if (parent.selectedProject.viewMode == 'model'){
                let pSetViewMode = self.setViewMode( 'model' );
                pSetViewMode.then(function(){
                    if (homePage){homePage.style.display = "none"; }
                });
            }else{
                let pSetViewMode = self.setViewMode( 'AR' );
                pSetViewMode.then(function(){
                    if (homePage){homePage.style.display = "none"; }
                });
            }
        }else{
            let pSetViewMode = self.setViewMode( 'AR' );
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



    }

    //// 處理「觸發事件中帶有群組部份」。
    setBehavsGroup( scene_behavs , sceneIndex ){
        
        let self = arController ;

        let groupDict = self.groupEventTargetDict[ sceneIndex ];

        scene_behavs.forEach( behav =>{

            if ( behav.group != '' && Number.isFinite( Number( behav.group ) ) ){
                
                if ( groupDict[ behav.group ] ){

                    let groupObj =  groupDict[ behav.group ];
                    groupObj.objs.push( behav );
                    
                }
            }
        });

    }


    //// 處理 場景物件 的「事件相關」，包含「從場景事件放入物件中」、「設置物件的參考事件」、「設置群組相關」
    //// 「設置特定事件：注視等等」
    setObjBehav( scene_obj , scene_behavs ){

        //// 假如已經載入過，不再載入
        if ( scene_obj.behav && Array.isArray(scene_obj.behav) && scene_obj.behav.length > 0){

        }else{
            scene_behavs.forEach( behav => {    
                
                //// 紀錄「觸發事件的物件」
                if( behav.trigger_obj_id && behav.trigger_obj_id == scene_obj.generalAttr.obj_id ){

                    //// 假如「觸發物件」沒有放過「事件陣列」，新創陣列。假如有，添加進入頁面
                    if(scene_obj.behav && Array.isArray(scene_obj.behav) && scene_obj.behav.length > 0){
                        scene_obj.behav.push(behav)
                    } else {
                        scene_obj.behav = [behav]
                    }
                }
            })
        }

        //// 紀錄「觸發事件的要顯示物件」的「觸發事件參考」
        if ( scene_obj.behav_reference && Array.isArray(scene_obj.behav_reference) && scene_obj.behav_reference.length > 0 ){

        }else{

            scene_behavs.forEach( behav => {
                //// 紀錄「觸發事件的要顯示物件」的「觸發事件參考」
                if( behav.obj_id && behav.obj_id == scene_obj.generalAttr.obj_id ){

                    /* 
                        所有事件：
                        1. 外部相關：「撥打電話」「寄送信件」「開啟網頁」
                        2. 顯示相關：「圖片」「影片」「模型」「文字」「燈光」
                        3. 媒體相關：「影片」「聲音」
                        4. 動畫相關：「切換模型動畫」
                        5. 朗讀文字：「朗讀文字」
                        6. 去背相關：「影片去背」「圖片去背」

                        需要紀錄 「 事件參考 」 _behav_reference_ 的有「顯示相關」「媒體相關」
                        「顯示物件」，「交互切換」/「顯示」/「關閉」： [Display], [Switch]/[Show]/[Hide]
                        「播放媒體」，「交互切換」/「顯示」/「關閉」： [Media], [SwitchStop]/[SwitchPause]/[Play][Stop]

                    */
                    
                    if ( behav.behav_type == 'Display' ||  behav.behav_type == 'Media' ){

                        if ( scene_obj.behav_reference && Array.isArray( scene_obj.behav_reference ) && scene_obj.behav_reference.length > 0 ){

                            scene_obj.behav_reference.push({
                                behav_type: behav.behav_type ,
                                switch_type: behav.switch_type ,
                                trigger_obj_id: behav.trigger_obj_id ,
                            });

                        }else{

                            scene_obj.behav_reference = [{
                                behav_type: behav.behav_type ,
                                switch_type: behav.switch_type ,
                                trigger_obj_id: behav.trigger_obj_id ,
                            }];

                        }
                    }
                }
            })
        }



    }




}

export default ARWrapper

