import net from './networkAgent.js';
import { UrlExists, checkDefaultObj } from "./vrUtility.js";
import { setTransform } from "./vrObjectModules/setTransform.js";
import { loadSky } from "./vrObjectModules/SkyModule.js";
import { loadAudio } from "./vrObjectModules/AudioModule.js";
import { loadGLTFModel, loadWebViewNotSupport, loadWebViewNotSupport2D } from "./vrObjectModules/GLTFModelModule.js";
import { loadTexture, loadTexture2D } from "./vrObjectModules/ImageModule.js"; 
import { loadLight } from "./vrObjectModules/LightModule.js"
import { loadText, loadText2D } from "./vrObjectModules/TextModule.js";
import * as VideoModule from "./vrObjectModules/VideoModule.js"
import { loadCurve, bezierPathAnime } from "./vrObjectModules/CurveModule.js";

//// v3.5 Quiz已被獨立出來 (在runtime可從 window.aQuizVR 取得)
import "./Quiz.js";

import { verionControl as VC } from "./MakarWebXRVersionControl.js";

// import MakarEvents from './MakarEvents.js';
import MakarEvents from '../../scripts/MakarEvents.js';

class VRController {

    //// scene 2D part
    GLRenderer = null;
    scene2D = null;
    camera2D = null;
    light = null;
    videoScene = null;
    videoCamera = null;

    //// 依照當前裝置大小算出的「2D物件比例」
    scaleRatioXY = null;

    //// MAKAR part
    vrScene = null;


    makarVRscenes = {};

    makarObjects = [];

    makarObjects2D = [];

    ///// 此陣列只會在「每次載入場景完成之後作修改」，目前為了讓「點擊移動功能」可以在 滑鼠移動時候作判斷使用
    currentSceneMakarObjects = [];

    //20200528-thonsha-add-start
    loadSceneCount = 0
    module = null;
    cursorEntity = null;
    //20200528-thonsha-add-end
    
    //20200807-thonsha-add-start
    projectIdx = null;
    //20200807-thonsha-add-end

    //20220105-thonsha-add-start
    intervalList = [];
    //20220105-thonsha-add-end

    materials_texture_dict = {};

    init_gyro = null;

    //// for update
    FUNCTION_ENABLED = false;
    clock = new THREE.Clock();
    delta = this.time = 0;

    //// 沒有特別的用意，主要是為了讓每次 create <video> 的 id 不相同
    triggerEnable = false;

    //// 紀錄『滑鼠』『觸碰』狀態
    touchMouseState = -1;

    //// 紀錄「觸發事件」中帶有「群組」的事件
    groupDict = {
        0: {activeObj:null,objs:[]},
        1: {activeObj:null,objs:[]},
        2: {activeObj:null,objs:[]},
        3: {activeObj:null,objs:[]},
        4: {activeObj:null,objs:[]},
        5: {activeObj:null,objs:[]},
        6: {activeObj:null,objs:[]},
        7: {activeObj:null,objs:[]},
    };

    //// 紀錄「注視事件」
    // lookAtObjectList = [];
    lookAtTimelineDict = {};

    loadingTickOn;

    //[start-20230726-howardhsu-add]//
    //// 紀錄編輯器版本
    editor_version = [];
    sceneIndex = 0;

    type;
    currentProjData;
    scenesData;
    userOnlineResDict;
    userProjResDict;

    currentSceneIndex;

    //// ios safari 複數影片播放時 只能讓1個影片有聲音 其他靜音
    safariUnMutedVideo;

    //// 原本在VRFunc.js的語言、翻譯文字
    languageType;
    worldContent;

    //// html elements on this page, (不只這些)
    domElement = {
        "loadPage": document.getElementById("loadPage"),
        "homePage": document.getElementById("homePage"),
        "startQuiz": document.getElementById("startQuiz"),
        "gsapEmpty": document.getElementById("gsapEmpty"),

    }

    //// 
    //// 隨著 for_makarSDK 而新增的: behav觸發時給html發布event 
    ////      MakarEvents 以目前的使用方式 應該可以加上單例模式 (vrController ←→ makarEvents)
    makarEvents = new MakarEvents(self, vrDiv)

    //// fei v3.5.0.0 修改
    constructor( makarUserData ){
        
        this.type = 'VRController';

        if ( makarUserData.oneProjData ){
            this.currentProjData = makarUserData.oneProjData
        }

        if ( makarUserData.scenesData ){
            this.scenesData = makarUserData.scenesData
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


        //[start-20231108-renhaohsu-add]//
        //// set those load_object functions as VRController's method
        this.setTransform = setTransform
        this.loadSky = loadSky
        this.loadAudio = loadAudio
        this.loadGLTFModel = loadGLTFModel
        this.loadWebViewNotSupport = loadWebViewNotSupport
        this.loadWebViewNotSupport2D = loadWebViewNotSupport2D
        this.loadText = loadText
        this.loadText2D = loadText2D
        this.loadTexture2D = loadTexture2D
        this.loadTexture =  loadTexture
        this.loadLight = loadLight
        this.loadVideo = VideoModule.loadVideo
        this.loadVideo2D = VideoModule.loadVideo2D
        this.loadCurve = loadCurve
        this.bezierPathAnime = bezierPathAnime
        this.UnMutedAndPlayAllVisibleVideo = VideoModule.UnMutedAndPlayAllVisibleVideo
        this.mute2dVideos = VideoModule.mute2dVideos
        this.mute3dVideos = VideoModule.mute3dVideos
        this.pause2dVideos = VideoModule.pause2dVideos
        this.pause3dVideos = VideoModule.pause3dVideos
        this.loadYouTubeNotSupport = VideoModule.loadYouTubeNotSupport
        this.loadYouTubeNotSupport2D = VideoModule.loadYouTubeNotSupport2D
        //[start-20231108-renhaohsu-add]//


        this.languageType = window.languageType = 'tw';
        
        this.worldContent = {

            userAlreadyPlayed:{tw:"此登入用戶已經遊玩過", en:"This user already played"},
            userNotLoginInfo:{tw:"必須要登入MAKAR後才可遊玩", en:"Please login at first"},
            clickToPlay:{tw:"點擊開始遊玩", en:"Click to play"},
    
            backToHome:{tw:"專案標題", en:"back"},
            GPSDistanceMsg:{tw:"需在GPS的範圍內才能開啟 \r\n 距離：", en:"Please to the right place"},
            GPSErrorMsg:{tw:"GPS 錯誤", en:"GPS error"},
            GPSnotSupportMsg:{tw:"沒有支援 GPS ", en:"GPS not support"},
            comfirm:{tw:"確認", en:"Confirm"},
            
        };

        //// for_makarSDK
        if(window.makarSDK && window.makarSDK.vrDiv){        
            console.log("window.makarSDK.vrDiv", window.makarSDK.vrDiv)
            //// 準備 js custom event 
            const event_vrControllerCreated = new CustomEvent("vrControllerCreated", {
                detail: {
                    "name": "(for webSDK) vrController is created.",
                    "vrController": this,
                    "currentActiveController": this
                },
            });
            window.makarSDK.vrDiv.dispatchEvent(event_vrControllerCreated);
        }

    }

    get2DScaleRatio(){

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
        //// 2022 1123以後， 3.3.8 上線，修改資料
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
            let userWidth = self.vrScene.clientWidth;
            let userHeight = self.vrScene.clientHeight;

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

                    // console.log(' _getResolution350: sss ' , i , e.width, e.height, e.nrdScore );

                    if ( e.nrdScore < minScore ){
                        minScore = e.nrdScore 
                        selectedResolutionIndex = i
                    }

                });

                let selectResolution = screenList[ selectedResolutionIndex ];
                //// 紀錄「當前使用的 寬高比例 index 」	
                self.selectedResolutionIndex = selectedResolutionIndex

                tempR = String ( selectResolution.width ) + ',' + String ( selectResolution.height );
                console.log('VRController.js _get2DScaleRatio _getResolution350: ' , minScore , selectedResolutionIndex , selectResolution , tempR );

            }
            
            return tempR;

        }        
        //[end-20230818-howardhsu-modify]//

        // //// 判斷是否存在「專案大小比例」
        // if ( VRSceneResult[ self.projectIdx ] ){
        // 	if ( VRSceneResult[ self.projectIdx ].scene_objs_v2 ){
        // 		if ( VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution ){
        // 			resolutionString = VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution;
        // 		}
        // 	}
        // }



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
            let userWidth = self.vrScene.clientWidth;
            let userHeight = self.vrScene.clientHeight;

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

    set2DScaleRatio( scaleRatioXY ){
        this.scaleRatioXY = scaleRatioXY;
    }
    //[end-20230726-howardhsu-add]//

    loadAssets() {
        let assets = document.createElement("a-assets");
        assets.setAttribute('id', "makarAssets" );
        assets.setAttribute('timeout', "1000" );
        assets.setAttribute('crossorigin', 'anonymous');
        this.vrScene.appendChild(assets);
        // self.makarObjects.push( assets );
    };

    //// 清除與 MAKAR 相關的當前場景內容，包含「 場景物件 」跟「 天空物件 」
    //// 注意後續要補上 2D 界面
    clearAllSceneObjs(){

        let self = this;

        if(self.logic){
            self.logic.stopLogic();
        }
        
        //// 換場景時無條件先清除所有影片
        let videos = document.getElementsByTagName('video');
        if ( videos.length > 0 ){
            for (let i = 0; i < videos.length; i++ ){
                videos[i].pause();
                videos[i].removeAttribute("src"); // empty source 	
                videos[i].load();
            }
        }

        //// 換場景時無條件先清除所有聲音
        //[start-20231123-renhaohsu-add]//
        let audios = document.getElementsByTagName('audio');
        if ( audios.length > 0 ){
            for (let i = 0; i < audios.length; i++ ){
                audios[i].pause();
                //[start-20231123-renhaohsu-add]//
                //// 可解決 "跳轉場景後，再跳轉回原場景，聲音物件不會播放" 的問題
                // audios[i].removeAttribute("src"); // empty source 	
                // audios[i].load();                
                audios[i].remove()
                //[end-20231123-renhaohsu-add]//
            }
        }
        //[end-20231123-renhaohsu-add]//

        if (self.makarObjects){ //// clean the additional object( without default object like, camera, cursor,  )
            for (let i = 0; i < self.makarObjects.length; i++ ){
                let makarObject = self.makarObjects[i];
                // makarObject.parentNode.removeChild( makarObject ); // this will remove the children, childNodes and object3D's children

                if ( makarObject.object3D ){
                    if(makarObject.object3D.bezier){
                        makarObject.object3D.bezier.pause();
                    }
                    makarObject.object3D.traverse( c =>{
                        if ( c.isMesh ){
                            
                            if ( c.material ){
                                if ( c.material.map ){
                                    if ( c.material.map.dispose ){
                                        c.material.map.dispose();													
                                    }
                                }
                                c.material.dispose();
                            }

                            if ( c.geometry ){
                                c.geometry.dispose();
                            }
                        }
                    });
                }

                makarObject.remove();

            }
            self.makarObjects.length = 0; // clean the array.
        }

        //[start-20231102-howardhsu-add]
        if (self.makarObjects2D){ //// clean the additional object( without default object like, camera, cursor,  )
            for (let i = 0; i < self.makarObjects2D.length; i++ ){
                let makarObject2D = self.makarObjects2D[i];
                // makarObject2D.parentNode.removeChild( makarObject2D ); // this will remove the children, childNodes and object3D's children

                if ( makarObject2D.isObject3D ){
                    makarObject2D.traverse( c =>{
                        if ( c.isMesh ){
                            
                            if ( c.material ){
                                if ( c.material.map ){
                                    if ( c.material.map.image.tagName == 'VIDEO' ){
                                        //// 停止影片播放: 為了不那麼突兀 先把影片聲音漸弱 再停止播放
                                        let v = c.material.map.image
                                        let timerId = 0;
                                        let sec = 0;
                                        timerId = setInterval(function(){    
                                            if(sec >= 19) {
                                                v.volume = 0
                                                v.pause()
                                                window.clearInterval(timerId);
                                            } else {
                                                if(v.volume -0.05 >= 0) {
                                                    v.volume -= 0.05
                                                }
                                            }
                                            sec++;
                                            // console.log(sec, v.volume, timerId)
                                        }, 20);
                                    } 
                                    if ( c.material.map.dispose ) c.material.map.dispose(); 
                                }
                                c.material.dispose();
                            }

                            if ( c.geometry ){
                                c.geometry.dispose();
                            }
                        }
                    });
                }

                self.scene2D.remove(makarObject2D);

            }
            self.makarObjects2D.length = 0; // clean the array.
        }
        //[end-20231102-howardhsu-add]

        //// 清除「當前場景有的物件」
        if ( Array.isArray( self.currentSceneMakarObjects ) ){
            self.currentSceneMakarObjects.length = 0;
        }

        //// 假如曾經載入過環景圖片，清除
        if ( self.cubeTex ){
            if ( self.cubeTex.texture ){
                self.cubeTex.texture.dispose();
            }
            self.cubeTex.dispose();
        }

        //// 清除 天空 內容 ，尚未測試 圖片/影片 清除的流程 
        let aSky = document.getElementById('vrSky');
        if (aSky){
            if (aSky.localName == "a-sky"){
                aSky.remove();
            }else if (aSky.localName == "a-videosphere"){
                aSky.remove();
            }
        }

        // 清除場景事件的timeID
        for(let i = 0; i <self.intervalList.length;i++){
            window.clearInterval(self.intervalList[i]);
        }

        // 陀螺儀記錄清除
        self.init_gyro = null;

        //重置額外場景物件
        self.onlySkyScene = new THREE.Scene();
        self.cullFaceBackScene = new THREE.Scene();
        


        self.needsRenderTarget = false;

        self.needsCullFaceBack = false;



    }


    ////// load the nth scene in specific prroject
    ////// At first, will called for load the first scene. 
    loadScene( sceneIndex ) {
        
        //// 載入場景的時候，先顯示處『載入頁面』直到圖片或是影片 onload 再隱藏『載入頁面』，**** 目前不使用此功能 **** 
        
        let self = this

        self.currentSceneIndex = sceneIndex;
        
        let scenes = [];
        scenes = VC.getScenes( self.scenesData );

        ///// 看起來能拿掉，從 currentSceneIndex, sceneIndex 兩者擇一
        console.log("3.5 merge loadscene", sceneIndex)
        this.sceneIndex = sceneIndex

        // if (self.VRSceneResult[projIndex].scenes[sceneIndex] == undefined ){
        if ( scenes[ sceneIndex ] == undefined  ){
            console.log("VRFunc.js: VRController: _loadScene: error, [valid sceneIndex]=", self.scenesData , sceneIndex );
        }else{

            //// 換場景時無條件先清除所有影片
            self.clearAllSceneObjs();

            //[start-20231122-howardhsu-add]//
            window.aQuizVR.clear();
            //[end-20231122-howardhsu-add]//

            //// 判定「版本」
            let editor_version = VC.getProjDataEditorVer( self.currentProjData );

            //// 紀錄「當前使用的版本」
            self.editor_version = editor_version;

            //// 依照版本來確認「 sky 」
            let scene_skybox_url;
            
            //// v3.5.0.0
            //// 從「場景物件」取得「使用者物件」的詳細資料
            //// 由於需要「使用者素材庫」「使用者線上素材庫」，不進入個別模組使用
            let sceneSky_info = {};

            if ( editor_version.v0 == 3 && editor_version.v1 >= 5 ){

                let scene_skybox_res_id = '';
                if ( scenes[ sceneIndex ].environment && 
                    scenes[ sceneIndex ].environment.scene_skybox_res_id
                ){
                    scene_skybox_res_id = scenes[ sceneIndex ].environment.scene_skybox_res_id;

                    //// 從「使用者素材庫」查找天空物件資料
                    if ( self.userProjResDict[ scene_skybox_res_id ] ){
                        let skyObj = self.userProjResDict[ scene_skybox_res_id ]
                        if ( skyObj.main_type == 'spherical_image' || skyObj.main_type == 'spherical_video' ){
                            sceneSky_info = skyObj;
                        }                       
                    }
                    else{
                        sceneSky_info.main_type = "spherical_image"; // 找不到resources，補main type 和 url
                        sceneSky_info.res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
                    }
                }
            }


            if ( sceneSky_info.main_type == 'spherical_video' ){
                scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg";
            }else if ( sceneSky_info.main_type == 'spherical_image' ){
                if ( sceneSky_info.res_url == "DefaultResource/Spherical_Image/SphericalImage.png"  ){
                    scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
                } else {
                    scene_skybox_url = sceneSky_info.res_url;
                }
            }else {
                scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
            }



            //// 檢查 「 sky 」是否存在，否的話使用「預設灰圖」作為 環景環境圖。往下載入「場景物件」
            UrlExists( scene_skybox_url, function( retStatus ){
                if (retStatus == false){
                    scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg";
                }

                let targetCube;
                if ( THREE.WebGLRenderTargetCube ){
                    targetCube = new THREE.WebGLRenderTargetCube(1024, 1024);
                }else{
                    targetCube = new THREE.WebGLCubeRenderTarget( 1024 );
                }

                // let mPmremGenerator = new THREE.PMREMGenerator( self.vrScene.renderer );
                // mPmremGenerator.compileEquirectangularShader();    

                let renderer = self.vrScene.renderer;
                // renderer.toneMapping = THREE.ACESFilmicToneMapping;
                if ( THREE.GammaEncoding ){
                    renderer.outputEncoding = THREE.GammaEncoding;
                    // renderer.outputEncoding = THREE.sRGBEncoding;
                    renderer.gammaFactor = 1;
                }
                
                // renderer.outputEncoding = THREE.sRGBEncoding;

                //// 從「 場景資料 」來查看是否有「 behav / behav_reference 」設置錯誤，有的話把 behav_rederence 修改
                // self.checkVRSceneResultBehav();

                //// 每次載入場景，先清除「事件相關」的資料。包含「事件群組」「注視事件」
                self.clearBehavs();
                
                let envTexture = new THREE.TextureLoader().load(
                    scene_skybox_url,
                    function() 
                    {
                        //// for_makarSDK
                        if(window.makarSDK){
                            //// 實在找不到哪裡改的
                            console.log("實在找不到哪裡改的 style.cursor 總之改回來 但是改不回來 @_@")
                            document.body.style.cursor = "default"
                        }

                        let cubeTex = targetCube.fromEquirectangularTexture(renderer, envTexture);
                        self.cubeTex = cubeTex;

                        self.loadSceneCount++;
                        self.loadAssets(); //// for video elements

                        let pAll = self.loadSceneObjects( sceneIndex );                            
                        let scene_id = scenes[sceneIndex].info.id;

                        console.log(' 555555 ', scene_id, sceneSky_info, self.loadSceneCount );

                        let scene_skybox_res_id = scenes[ sceneIndex ].environment.scene_skybox_res_id;
                        if (scene_skybox_res_id != 'camera'){

                            let pSky = self.loadSky( self.vrScene, scene_id, sceneSky_info, self.loadSceneCount)   

                            pSky.then( function( ret ){
                                console.log('VRFunc.js: _loadScene: pSky then ret = ', ret );                            
                            });

                            pAll.push(pSky )
                        }
                        else{
                            if (document.getElementById("sky")){
                                let aSky = document.getElementById("sky");
                                aSky.remove();
                            }
                        }

                       //// 假如此專案的當前場景有「邏輯功能」，加入「處理列表」
                        if ( typeof( scenes[sceneIndex].xml_url ) == 'string' ){
                            //// 下載對應的「邏輯腳本」
                            // let pXML = self.parseLogicXML(projIndex , sceneIndex );
                            let pXML = self.parseLogicXMLBySceneIndex( sceneIndex );
                            
                            pAll.push( pXML );
                        }

                        Promise.all( pAll ).then( function( ret ){

                            console.log('VRFunc.js: _loadScene: pAll then ret = ', ret );

                            //// 記錄一開始手機初始陀螺儀資訊
                            if(self.init_gyro == null){
                                let cameraForGyro = document.getElementById('cameraForGyro');
                                self.init_gyro = cameraForGyro.components["look-controls"].magicWindowAbsoluteEuler.clone();
                            }


                            //20221206-thonsha-add-start
                            if(document.getElementById("sky"))
                                self.onlySkyScene.add(document.getElementById("sky").object3D.clone(true))
                            //20221206-thonsha-add-end

                            // self.vrScene.renderer.shadowMap.needsUpdate = true;
                            self.domElement.loadPage.style.display = "none";
                            self.domElement.homePage.style.display = "none";
                            
                            //// 同時關閉「起始載入畫面動畫」 和 「切換場景載入中動畫」
                            if ( window.homeTickOn ){
                                homeTickOn = false;
                            } else if ( window.makarSDK && window.makarSDK.homeTickOn ){
                                //// for_makarSDK
                                window.makarSDK.homeTickOn = false;
                            } else {
                            }

                            //[start-20230725-howardhsu-modify]//
                            //// 根據 mdn，typeof 回傳 string     
                            //// 因此底下的 if 判斷永遠會通過
                            //// 另外 這個 loadingTickOn 在原本 VRFunc.js 沒有初始化，我先試試把它加進 VRController 的屬性裡，暫時不確定其他js檔是否也有取用它。
                            // if ( typeof( loadingTickOn )  != undefined ){
                                self.loadingTickOn = false;
                            // }
                            //[end-20230725-howardhsu-modify]//

                            self.triggerEnable = true;

                            //// 假如此專案當前場景有「邏輯」，解析並且執行功能
                            // if (self.publishVRProjs.result[projIndex].xml_urls && self.publishVRProjs.result[projIndex].xml_urls[ sceneIndex ] &&
                            //     self.logic.xmlDoc != null 
                            // ) {
                            //     self.logic.parseXML();
                            // }

                            //// 假如此專案的當前場景有「貝茲曲線」，解析並且執行功能
                            if ( scenes[sceneIndex].bezier.length > 0 ){
                                for (let i = 0; i < scenes[sceneIndex].bezier.length;i++){
                                    self.bezierPathAnime( scenes[sceneIndex].bezier[i], sceneIndex );
                                }
                            }

                            //// 假如此專案的當前場景有「場景事件」，解析並且執行功能
                            if (scenes[sceneIndex].behav.length > 0){
                                for (let i = 0; i < scenes[sceneIndex].behav.length; i++){
                                    let behav = scenes[sceneIndex].behav[i];
                                    if (behav.trigger_type == 'Time'){
                                        let timeString = new Date().toTimeString();
                                        let hour = timeString.split(":")[0];
                                        if( behav.trigger_end_time - behav.trigger_start_time >= 0){
                                            if (hour >= behav.trigger_start_time && hour < behav.trigger_end_time){
                                                // self.triggerEvent(behav, false, null);
                                                handleTriggerEvent(behav)
                                            }
                                        }
                                        else{
                                            if (hour >= behav.trigger_start_time || hour < behav.trigger_end_time){
                                                // self.triggerEvent(behav, false, null);
                                                handleTriggerEvent(behav)
                                            }
                                        }
                                        
                                    }
                                    else if(behav.trigger_type == "Gyro"){
                                        let trigger = false;
                                        let tID = setInterval(function(){
                                            let yRotation;
                                            let cameraForGyro = document.getElementById('cameraForGyro');
                                            yRotation = (-(cameraForGyro.components["look-controls"].magicWindowAbsoluteEuler.y-self.init_gyro.y) / Math.PI * 180 ) % 360  ;
                                            if(yRotation < 0) yRotation += 360;

                                            // console.log(yRotation)

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
                                                        handleTriggerEvent(behav)
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
                                                        handleTriggerEvent(behav)
                                                    }
                                                }
                                                else{
                                                    trigger = false;
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
                                            self.dealAllGroupHide( tempObj );
                                            
                                            if ( gObj.obj_type == '2d' ){
                                                behav.behav_type = "Display2D"; //// seperate from Display
                                            } 
                                        }
                                    } 

                                    self.triggerEvent(behav, false, null);
    
                                }
                                //[end-20240401-renhaohsu-modify]//
                            }
                        
                            if ( self.logic &&  self.scenesData.scenes[ sceneIndex ].xml_url ){
                                // console.log("self.scenesData.scenes[ sceneIndex ].xml_url", self.scenesData.scenes[ sceneIndex ].xml_url)

                                //// 這句是 for_makarSDK (SDK將domElement封裝起來, logicSystem會因此拿不到gsapEmpty)
                                window.gsapEmpty = self.domElement.gsapEmpty

                                self.logic.parseXML();
                            }    

                            //// 載入場景完成後，解析一下場景的「事件 / behav」跟「事件參照 behav_reference 」是否有錯誤。
                            // self.setupSceneBehav();

                            
                            
                            //// 載入場景完成，解析物件所佔範圍
                            setTimeout( function(){
                                self.calcSceneArea();
                            }, 1 )
                            
                            //// 載入場景完成後，判斷當前 UI 是否顯示，顯示的話執行隱藏
                            if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
                                typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
                            ){
                                if ( parent.projectUIController.status == -1 ){
                                    parent.projectUIController.showUI();
                                }
                            }

                        }).then( () => {

                            //[start-20240614-renhaohsu-add]//
                            //// 20240614 再次為了safari重複把所有影片都靜音並播放
                            if (window.Browser){
                                if (window.Browser.name == undefined || window.Browser.name == "safari" ){
                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                    
                                    //// 發現safari的muted + play()沒有效果 乾脆把所有影片 靜音並播放  (若以後editor有設定初始播不播放 記得改這裡)
                                    self.mute3dVideos(true)
                                    self.mute2dVideos(true)
                                    
                                    //// 挑一隻可見的影片解除靜音
                                    self.UnMutedAndPlayAllVisibleVideo();
                                } else {
                                    // console.log("載完了")
                                }
                            } 
                            //[end-20240614-renhaohsu-add]//

                            //// v3.5.0.0 為 "點擊物件開啟"的quiz 的啟動物件 加上 behav
                            self.addBehavToQuizTriggerObj()
                            //// v3.5.0.0 如果有quiz是"直接顯示" 則顯示 html UI (startQuiz)
                            self.checkIfQuizOpenDirectly()                            
                            
                            
                            //// for_makarSDK : 場景物件載入完成：建立並觸發CustomEvent (for SDK)
                            let vrDiv = document.getElementById("vrDiv");

                            //// for_makarSDK
                            console.log("for_makarSDK vrDiv", vrDiv)
                            if(window.makarSDK && window.makarSDK.vrDiv){
                                console.log("for_makarSDK vrDiv", vrDiv)
                                vrDiv = window.makarSDK.vrDiv
                            }
                            console.log("%c vrScene=", 'color: pink', vrDiv)
                            //// 準備 js custom event 
                            const vrSceneObjsLoaded = new CustomEvent("vrSceneObjsLoaded", {
                                detail: {
                                    name: "vrSceneObjsLoaded",
                                    sceneId: self.scenesData.scenes[self.currentSceneIndex].info.id,
                                    scene: self.vrScene,
                                    clock: self.clock
                                },
                            });
                            vrDiv.dispatchEvent(vrSceneObjsLoaded);

                        }).catch((err) => {
                            console.warn('VRController.js _loadScene: loadScene Error, or quiz error:', err)
                        });


                    }
                );
            });
            

            //[start-20231013-howardhsu-add]//
            ///// 載入相機完成之後，設定對應 物件放大比例
            let  sr2D = self.get2DScaleRatio();
            self.set2DScaleRatio( sr2D ) ;
            //[end-20231013-howardhsu-add]//

        }
    }        

    //// 處理「觸發事件中帶有群組部份」。
    setBehavsGroup( scene_behavs ){
        
        let self = this;

        scene_behavs.forEach( behav =>{

            if ( behav.group != '' && Number.isFinite( Number( behav.group ) ) ){
                
                if ( self.groupDict[ behav.group ] ){

                    let groupObj =  self.groupDict[ behav.group ];
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


    //[start-20231206-howardhsu-modify]//
    addBehavToQuizTriggerObj(){        
        //// 載入場景完成後，掃一遍 quiz 的啟動物件，給它加上behav
        const arr_trigger_ids = window.aQuizVR.triggers
        if(!Array.isArray(arr_trigger_ids)) return;
        if(arr_trigger_ids.length == 0) return;
        
        // const objs = this.scenesData.scenes[this.sceneIndex].objs

        //// 為了方便操作，取得記錄了全部 { 有設定啟動物件的quiz_id , trigger_id } 的陣列
        const quizIdWithTriggers = window.aQuizVR.quizIdWithTriggers

        //// 在每個 Quiz啟動物件 的behav，增加 "ShowQuiz"，記錄它對應的 Quiz物件id
        quizIdWithTriggers.forEach( q_t => {

            //// 從 3D物件裡尋找啟動物件
            let quizTrigger = document.getElementById(q_t.trigger_id)   
            // quizTrigger.className = "clickable"
            // console.warn("VRController.js: _addBehavToQuizTriggerObj get quizTrigger=", quizTrigger)
            
            //// 從 2D物件裡尋找啟動物件
            let quizTriggerObj2D = this.makarObjects2D.find(item=>item.obj_id == q_t.trigger_id)
            const tempBehav = { 
                obj_id: q_t.quiz_id, 
                played: false, 
                behav_type: 'ShowQuiz', 
                force_login: q_t.force_login, 
                allow_retry: q_t.allow_retry 
            }
            // console.warn("VRController.js: _addBehavToQuizTriggerObj get quizTriggerObj2D=", quizTriggerObj2D)
            
            if (quizTrigger){	
                quizTrigger.className = "clickable"

                let quizTriggerObj3D = quizTrigger.object3D       
                
                if ( quizTriggerObj3D.behav && Array.isArray(quizTriggerObj3D.behav) ) {  
                    //// 先確認: 該 quiz 和 與它一對一對應的啟動物件 還沒加過 啟動quiz的behav
                    if( !quizTriggerObj3D.behav.find(b => b.obj_id == q_t.quiz_id)){
                        quizTriggerObj3D.behav.push( tempBehav )
                    }
                } else {
                    quizTriggerObj3D.behav = [ tempBehav ]
                }	
                
            } else if (quizTriggerObj2D){
            
                if (quizTriggerObj2D.behav) {  
                    quizTriggerObj2D.behav.push( tempBehav )
                } else {
                    quizTriggerObj2D.behav = [ tempBehav ]
                }		
                
            } else {
                console.log("VRController.js _loadScene: can not find quiz's trigger", q_t.trigger_id, " performance.now()=", performance.now(), self.makarObjects2D.slice() )
            }                 
        })
    }

    //// for multiple quizzes:  if there exist any Quiz with trigger_type=="Directly", show the UI (startQuiz).
    checkIfQuizOpenDirectly(){
        // let startQuiz = document.getElementById("startQuiz");		
        const startQuiz = this.domElement.startQuiz
        if( window.aQuizVR.quizIdOpenDirectly.length >= 1 ){	
            QuizStartContent.textContent = window.aQuizVR.quizIdOpenDirectly[0].quizUiTextContext
            startQuiz.style.display = "block"
        } else {								
            startQuiz.style.display = "none"
        }
    }
    //[end-20231206-howardhsu-modify]//

    // editorVersionControllObjs(editor_version , projIndex , sceneIndex ) {
    editorVersionControllObjs(editor_version , sceneIndex ) {
        let self = this
        let scene_objs;
        
        if ( editor_version.v0 == 3 && editor_version.v1 >=5 ){
            
            scene_objs = self.scenesData.scenes[sceneIndex].objs;

        }else{
            console.log('VRController.js: version error ' , editor_version );
        }
        
        
        return scene_objs;
    }

    ////// load all object in the scene
    loadSceneObjects( sceneIndex ) {

        let self = this

        let userProjResDict = self.userProjResDict;
        let userOnlineResDict = self.userOnlineResDict;

        if ( typeof( userProjResDict ) == 'object' && !userProjResDict){
            console.log("%cVRFunc.js: _loadSceneObjects: error userProjResDict not exist, return -1", "color:red");
            return [];
        }

        let scene_objs = [];

        //// 取得專案版本
        let editor_version = VC.getProjDataEditorVer( self.currentProjData );


        //// 版本控制，3.2.0 版本以上會有 相機設定參數在 scenes 層級，也在此函式內設定
        scene_objs = self.editorVersionControllObjs(editor_version, sceneIndex); 
        

        if (!Array.isArray(scene_objs)) return [];


        //// v3.5.0.0 新增
        //// 取得「所有事件」
        let scene_behavs = self.scenesData.scenes[ sceneIndex ].behav

        //// 處理「 事件 群組物件 」
        self.setBehavsGroup( scene_behavs );



        //// 所有物件都要作 「 完成判斷 」各自設立 promise
        let pObjs = [];
        for (let i = 0; i < scene_objs.length ; i++  ){
            
            //// 為每個物件設定 position、quaternion、scale
            let objTranform = VC.getObjTransform( self.scenesData , scene_objs[i] );
            let position = objTranform.position;
            let rotation = objTranform.rotation;
            let scale = objTranform.scale;
            let quaternion = objTranform.quaternion;
            
            // let scene_behavs = self.VRSceneResult[self.projectIdx].scenes[self.sceneIndex].behav;
            let scene_obj = scene_objs[i];

            //// 處理 場景物件 的「事件相關」，包含「從場景事件放入物件中」、「設置物件的參考事件」、「設置群組相關」
            //// 「設置特定事件：注視等等」
            self.setObjBehav( scene_obj , scene_behavs );
            
            //[start-20230809-howardhsu-add]//
            //// res_url and main_type no longer exist in ver. 3.5's VRSceneResult
            //// get res_url, main_type from userProjResDict or userOnlineResDict
            if( userProjResDict || typeof( userOnlineResDict ) == 'object' ){  

                

                //// get main_type by user resource 
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].main_type ){
                    scene_objs[i].main_type = userProjResDict[scene_objs[i].res_id].main_type
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].main_type = userOnlineResDict[scene_objs[i].res_id].main_type
                } else {
                    //// userProjResDict usually does not contain Light, Text objects. Recognize them with res_id:
                    //// in ver. 3.5: if main_type does not exist, could be default objects

                    console.log(' before _checkDefaultObj: ', i , scene_objs[i].main_type , scene_objs[i].res_id );

                    checkDefaultObj( scene_objs[i] );

                    console.log(' after _checkDefaultObj: ', i , scene_objs[i].main_type , scene_objs[i].res_id );

                }

                //// get sub_type by user resource
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].sub_type ){
                    scene_objs[i].sub_type = userProjResDict[scene_objs[i].res_id].sub_type
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].sub_type = userOnlineResDict[scene_objs[i].res_id].sub_type
                } else {
                    //// console.log("sub_type does not exist in user resource, deal with it later (in the switch block right below.)")
                }

                //// get res_url by user resource 
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].res_url ){
                    scene_objs[i].res_url = userProjResDict[scene_objs[i].res_id].res_url
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].res_url = userOnlineResDict[scene_objs[i].res_id].res_url
                } else {
                    console.log("VRFunc.js: _loadSceneObjects: res_url does not exist. scene_obj=", scene_objs[i])
                }     

                // get default_shader_name by user resource
                if( userProjResDict[ scene_obj.res_id] && userProjResDict[ scene_obj.res_id ].default_shader_name ){
                    scene_obj.default_shader_name = userProjResDict[ scene_obj.res_id ].default_shader_name
                } else if( userOnlineResDict[ scene_obj.res_id ] && userOnlineResDict[ scene_obj.res_id ].default_shader_name) {
                    scene_obj.default_shader_name = userOnlineResDict[ scene_obj.res_id ].default_shader_name
                } else {
                    console.log("VRFunc.js: default_shader_name does not exist. obj=", scene_obj )
                }


            } else {
                console.log("VRFunc.js: _loadSceneObjects: userProjResDict or userOnlineResDict does not exist. scene_obj=", scene_objs[i])    
            }
            //[end-20230809-howardhsu-add]//

            let obj_type = VC.getObjObjType( self.scenesData , scene_obj )

            switch( scene_objs[i].main_type ){  
                case "camera":
                    
                    //// ver3.5 測試相機位置正確 但推測如果位置能動 以下可能會出現些微差異 等有更多測試資料時要再確認

                    let camera_cursor = document.getElementById( "camera_cursor" );
                    
                    var setupCamera = function(){
                        if (!camera_cursor.hasLoaded){
                            setTimeout(setupCamera, 100);
                            console.log("VRFunc.js: _loadSceneObjects: camera: not loaded, wait" );							
                        }else{

                            //// v3.5.0.0 後會有「相機物件」，預計可以輸入「位置」「旋轉」「fov」
                            
                            console.log("VRFunc.js: _loadSceneObjects: camera: _objTranform ", objTranform );

                            // rotation.multiply( new THREE.Vector3(-1,-1,0) ).add( new THREE.Vector3(0, 180, 0) );
                            
                            rotation.multiply( new THREE.Vector3( -1 , -1 , 0 ) ).add( new THREE.Vector3( 0 , Math.PI , 0 ) ); 
                            
                            // camera_cursor.setAttribute("position", position ); ////// it is work
                            

                            let fov = 80;
                            if ( scene_obj && scene_obj.typeAttr && scene_obj.typeAttr.fov ){
                                fov = scene_obj.typeAttr.fov ; 
                            }

                            //// fov 相關資料，要在 「 VR觀看相機 載入完成」後才可設定
                            let aCamera = document.getElementById('aCamera');
                            let oCamera = document.getElementById('oCamera');

                            
                            function lookContorlsLoaded(){

                                let tID = setInterval( function(){
                                    let aCameraObject = aCamera.getObject3D('camera');
                                    let oCameraObject = oCamera.getObject3D('camera');
                                    if ( aCameraObject && aCameraObject.type == 'PerspectiveCamera' &&
                                        oCameraObject && oCameraObject.type == 'PerspectiveCamera'
                                    ){

                                        position.multiply( new THREE.Vector3( -1 , 1 , 1 )  );
                                        aCamera.object3D.position.copy( position );

                                        //// 設定 「VR 觀看相機」 FOV
                                        aCamera.setAttribute( 'camera', 'fov', fov );

                                        aCameraObject.fov = fov;
                                        oCameraObject.fov = fov;
                                        aCameraObject.updateProjectionMatrix();
                                        oCameraObject.updateProjectionMatrix();


                                        clearInterval( tID );
                                    }
                                }, 100 );

                                //// 設定 「VR 觀看相機」 位置 旋轉
                                // aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
                                // aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;

                                aCamera.components["look-controls"].yawObject.rotation.y = rotation.y ;
                                aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x ;


                                aCamera.removeEventListener("look-controls-loaded", lookContorlsLoaded);
                            }

                            if ( aCamera && aCamera.components && aCamera.components["look-controls"] &&
                                aCamera.components["look-controls"].yawObject && aCamera.components["look-controls"].pitchObject )
                            {
                                lookContorlsLoaded();
                            }else{
                                aCamera.addEventListener("look-controls-loaded" , lookContorlsLoaded );
                            }
                            



                        }								
                    } 

                    setTimeout(setupCamera, 10);

                    // setTransform( camera_cursor, position, rotation, scale );
                    
                    break;
                    
                case "image":
                    console.log("VRController.js: _loadSceneObjects: image: ", i, scene_objs[i] );

                	//[start-20231110-howardhsu-modify]//
                    let pTexture;
                    if ( obj_type == '3d' ){
                        pTexture = self.loadTexture( scene_obj , position, rotation, scale ) ;
                    } else if ( obj_type == '2d' ){
                        pTexture = self.loadTexture2D( scene_obj, i, scene_objs.length, position, rotation, scale )
                    } else {
                        console.log("VRController.js: _loadSceneObjects: image obj_type=", obj_type)
                    }
                    pObjs.push( pTexture );

                    break;

                    
                //20191204-start-thonsha-add
                case "text":
                    console.log("VRController.js: _loadText: text: ", i, scene_objs[i] );
                    
                    let pText;
                    if ( obj_type == '3d' ){
                        pText = self.loadText( scene_objs[i] , position, rotation, scale )
                    } else if ( obj_type == '2d' ){
                        pText = self.loadText2D( scene_obj, i, scene_objs.length, position, rotation, scale )    
                    } else {
                        console.log("VRController.js: _loadSceneObjects: text obj_type=", obj_type)
                    }                    
                    pObjs.push( pText );

                    break;

                //20191204-end-thonsha-add
                
                //20191105-start-thonsha-add
                case "audio":

                    //[start-20230802-howardhsu-add]//  
                    if( scene_objs[i].sub_type == undefined ){                                        
                        let getSubType = scene_objs[i].res_url.split('.')
                        let subType = getSubType[getSubType.length-1]
                        scene_objs[i].sub_type = subType.toLowerCase();
                    } else {
                        // console.log("VRController.js: _loadSceneObjects: audio sub_type=", scene_objs[i].sub_type)
                    }                    
                    //[end-20230802-howardhsu-add]//

                    if ((scene_objs[i].sub_type == "mp3" || scene_objs[i].sub_type == "wav" || scene_objs[i].sub_type == "ogg" ) && scene_objs[i].res_url){
                        let pAudio = self.loadAudio( scene_objs[i] , position, rotation, scale );
                        pObjs.push( pAudio );
                    }

                    break;

                //20191105-end-thonsha-add

                case "video":

                    //[start-20230802-howardhsu-add]//  
                    if( scene_objs[i].sub_type == undefined ){                                        
                        let getSubType = scene_objs[i].res_url.split('.')
                        let subType = getSubType[getSubType.length-1]
                        scene_objs[i].sub_type = subType.toLowerCase();
                    } else {
                        // console.log("VRController.js: _loadSceneObjects: video sub_type=", scene_objs[i].sub_type )
                    }
                    //[end-20230802-howardhsu-add]//

                    if ( scene_objs[i].sub_type == 'mp4' ){
                        let pVideo;
                        if ( obj_type == '3d' ){
                            pVideo = self.loadVideo( scene_objs[i] , position, rotation, scale );
                        } else if ( obj_type == '2d' ){
                            pVideo = self.loadVideo2D( scene_obj, i, scene_objs.length, position, rotation, scale )
                        } else {
                            console.log("VRController.js: _loadSceneObjects: video obj_type=", obj_type)
                        }
                        pObjs.push( pVideo );
                    } else if ( scene_objs[i].sub_type == "youtube" ){
                        console.log("makar webXR currently does not support yt video, please wait until next update")

                        if ( obj_type == '3d' ){
                            self.loadYouTubeNotSupport(scene_obj, i, scene_objs.length, position, rotation, scale)
                        } else if ( obj_type == '2d' ){
                            self.loadYouTubeNotSupport2D(scene_obj, i, scene_objs.length, position, rotation, scale)
                        } else {
                            console.log("VRController.js: _loadSceneObjects: yt video obj_type=", obj_type)
                        }
                    }

                    break;

                case "model":
                    
                    if ( scene_obj.res_id == "WebView"){
                        console.log("webview obj", scene_obj)
                        if(obj_type == '3d'){
                            // self.loadWebViewNotSupport(scene_objs[i], position, rotation, scale , self.cubeTex );
                            self.loadWebViewNotSupport(scene_obj, i, scene_objs.length, position, rotation, scale , self.cubeTex );
                        } else if(obj_type == '2d'){
                            self.loadWebViewNotSupport2D(scene_obj, i, scene_objs.length, position, rotation, scale , self.cubeTex );
                        } else {

                        }

                    } else if ( obj_type == '3d' ){
                        let pModel = self.loadGLTFModel(scene_objs[i], position, rotation, scale , self.cubeTex );
                        pObjs.push( pModel );
                    }

                    break;

                case "curve":

                    if (obj_type == '3d'){
                        let pCurve = self.loadCurve(scene_obj, position, rotation, scale);
                        pObjs.push( pCurve );
                    }

                    break;
                    
                case "light":
                        console.log("VRController.js: _loadSceneObjects: light", i, scene_objs[i]  );                        
                        self.loadLight(scene_objs[i], position, rotation, scale);
                        break;
                    
                case "empty":
                    //// 之後空物件會有其他用途，目前大多
                    switch (scene_objs[i].sub_type){        
                        case "quiz":     
                            
                            //[start-20231207-howardhsu-modify]//	
                            //// 當user沒有在編輯器設定題目順序時 直接不載入 也不顯示html ui
                            if(!scene_objs[i].typeAttr.module.display_order_list){
                                console.log("%c _vrController _loadMakarARScene: user has not set display_order_list. obj.typeAttr.module=", "color:Salmon", scene_objs[i].typeAttr.module)
                                break;
                            }
                            
                            
                            //// 開發中，檢查內容，填值 (確認有填則移除) : editor在多選按鈕的obj_parent_id沒填值 幫補上
                            let question_list = scene_objs[i].typeAttr.module.question_list
                            question_list.forEach( q => {
                                let btnJson = q.options_json.find( o => o.res_id == "Button") 
                                if( btnJson ){
                                    if( !btnJson.generalAttr.obj_parent_id ){
                                        btnJson.generalAttr.obj_parent_id = scene_objs[i].generalAttr.obj_id
                                    }                                            
                                }
                            })
                            

                            //// v3.5.0.0 的 quiz 在 "實際要顯示" 的時候才加入 makarObjects
                            const transformData = { "position": position, "rotation": rotation, "scale": scale }

                            //// 其實這些資料也能從 VRController 之外的地方取得，但為了方便控管，暫時先用參數傳遞
                            const proj_id = self.currentProjData.proj_id;
                            const login_id = localStorage.getItem("MakarUserID") 
                            
                            // const startQuiz = document.getElementById("startQuiz");	
                            const startQuiz = self.domElement.startQuiz
                            const QuizStartButton = document.getElementById("QuizStartButton");
                            const QuizStartContent = document.getElementById("QuizStartContent");
                            const UIs = { "startQuiz": startQuiz, "QuizStartButton": QuizStartButton, "QuizStartContent": QuizStartContent }
                            
                            //// 依照 force_login, allow_retry, trigger_type, 使用者是否已登入 來決定是否顯示quiz。  ( 這裡只載入"Directly"(直接顯示) 的quiz，)
                            const pQuizCheckRecords = window.aQuizVR.loadQuiz( scene_objs[i], transformData, proj_id, login_id, UIs, self.worldContent, self.languageType)

                            //// 查找後端DB or 查indexedDB 的 Promise 加入倒 pObjs，讓之後能在 pAll.then 給Quiz啟動物件加上behav & 顯示html UI
                            pObjs.concat(pQuizCheckRecords)                        
                            //[end-20231207-howardhsu-modify]//	
                            
                            console.log("VRController.js: _loadSceneObjects: empty, quiz ", i, scene_objs[i] );
                            break;

                        default:
                            console.log("VRController.js: _loadSceneObjects: empty object default, ", i, scene_objs[i] );
                    }
                    break
                
                default:
                    console.log("VRController.js: _loadSceneObjects: default", i, scene_objs[i] );
                    
            }

        }


        return pObjs;
        // console.log("VRFunc.js: _loadSceneObjects: done, self.makarObjects ", self.makarObjects.length );
    }

    checkAnimation(obj, dt) {
        if (obj.mixer){
            obj.mixer.update(dt);
        }
        if (obj.animationSlices ){
            if (obj.animationSlices[0].index){
                if (obj.animationSlices[obj.animationSlices[0].index]){
                    if (obj.mixer._actions[0].time > obj.animationSlices[obj.animationSlices[0].index].timeEnd ||
                        obj.mixer._actions[0].time < obj.animationSlices[obj.animationSlices[0].index].timeStart){
                        obj.mixer._actions[0].time = obj.animationSlices[obj.animationSlices[0].index].timeStart;
                    }
                }
            }
        }
    }

    //[start-20200617-fei0097-add]//
    showObjectEvent(target, reset, switch_type) {

        let self = this;
        if (!target){
            console.log('VRFunc.js: _showObjectEvent: target not exist', target);
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
                            console.log('VRFunc.js: _showObjectEvent: set false, video blockly: do nothing ', child );
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
                            console.log('VRFunc.js: _showObjectEvent: set false, audio blockly: do nothing ', child );
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
            console.log('target 檢查是否有2D 2D影片是否靜音', )
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
                                console.log('VRFunc.js: _showObjectEvent: set true, video blockly: do nothing  ', child );
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
                                console.log('VRFunc.js: _showObjectEvent: set true, audio blockly: do nothing ', child );
                            } else {
                                child.el.components.sound.playSound();
                            }

                        }
                    }
                }
            });
        }

    }

    hideGroupObjectEvent(target, isBehavRederenceTpyeDisplay=false) {

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
                        if (child.behav_reference || isBehavRederenceTpyeDisplay){
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

    //// 清除「場景物件的事件資料」，因為 VR 會「跳整場景」，流程上會清除所有場景物件，再載入新場景物件。所以在「載入前」，要清除就場景的事件相關
    //// 包含 「事件群組」「注視事件」
    clearBehavs() {
        
        let self = this;

        //// 「群組事件」
        for ( let i in self.groupDict ){
            if ( Array.isArray( self.groupDict[i].objs ) ){
                self.groupDict[i].objs.length = 0;

            }
        }

        // //// 「注視事件」
        // self.lookAtObjectList.length = 0;
        // self.lookAtObjectList = [];
        
        for ( let i in self.lookAtTimelineDict ){
            if ( typeof( self.lookAtTimelineDict[ i ].pause ) == 'function' && typeof( self.lookAtTimelineDict[ i ].kill ) == 'function' ){
                self.lookAtTimelineDict[ i ].pause(); 
                self.lookAtTimelineDict[ i ].kill(); 
            }
        }

        self.lookAtTimelineDict = {};

    }

    //// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
    //// 目前完全不參考「 儲存的 behav_reference 資料 」，都從「 behav 」來自製 「 behav_reference 」 
    //[20231109-renhaohsu-comment]//    v3.5 已不使用 詳見 setObjBehav  
    checkVRSceneResultBehav() {
        let self = this;

        //// 專案id 錯誤
        if ( ! Number.isFinite( Number( self.projectIdx ) )   ){
            console.error( ' _checkVRSceneResultBehav: projectIdx error ', self.projectIdx );
            return;
        }
        //// 專案資料內容錯誤
        if ( !Array.isArray( self.VRSceneResult ) ||  !self.VRSceneResult[ self.projectIdx ] || !Number.isInteger( Number( self.sceneIndex ) )  ){
            console.error( ' _checkVRSceneResultBehav: _VRSceneResult error ', self.projectIdx , self.sceneIndex , self.VRSceneResult);
            return;
        }

        if ( !self.VRSceneResult[ self.projectIdx ].editor_ver || typeof( self.VRSceneResult[ self.projectIdx ].editor_ver ) != 'string' ){
            console.error( ' _checkVRSceneResultBehav: editor_ver error ', self.VRSceneResult[ self.projectIdx] );
            return;
        }

        let editor_version = self.VRSceneResult[ self.projectIdx].editor_ver.split(".");
        let scene_objs = self.editorVersionControllObjs( editor_version, self.projectIdx , self.sceneIndex );

        console.log('_checkVRSceneResultBehav: _scene_objs ', scene_objs );

        if ( ! Array.isArray( scene_objs ) ){
            return;
        }

        //// 檢查「 behav / behav_reference 」

        ///// 建制列表
        let behavAll = {};
        let behavRefAll = {}; //// 這部份預計拿來對答案用
        let sceneObjDict = {};

        //[start-20230807-howardhsu-add]//
        //// ver. 3.5 的 VRSceneResult 的 behav 已移到與 objs 同層
        self.VRSceneResult[self.projectIdx].scenes[self.sceneIndex].behav.forEach(( behav )=>{
            if ( behavAll[ behav.trigger_obj_id ] && Array.isArray( behavAll[ behav.trigger_obj_id ] ) ){
                behavAll[ behav.trigger_obj_id ].push([behav]);
            }else if ( behavAll ){
                behavAll[ behav.trigger_obj_id ] = [behav]
            }else{
                console.error('_checkVRSceneResultBehav: cant get behavAll ', behavAll );
            }
        })
        //[end-20230807-howardhsu-add]//

        for ( let i = 0, len = scene_objs.length; i < len; i++ ){
            let sceneObj = scene_objs[i];

            //[start-20230807-howardhsu-modify]//
            //// ver. 3.5 的 VRSceneResult 的 behav 已移到與 objs 同層
            // if ( sceneObj.behav ){
            //     behavAll[ sceneObj.obj_id ] = sceneObj.behav;
            // }
            //[end-20230807-howardhsu-modify]//

            //// 無條件清除 「 儲存的  behav_reference 資料 」
            if ( sceneObj.behav_reference ){
                // behavRefAll[ sceneObj.obj_id ] = sceneObj.behav_reference;
                delete sceneObj.behav_reference;
            }

            if ( sceneObj.generalAttr.obj_id ){
                sceneObjDict[ sceneObj.generalAttr.obj_id ] = sceneObj;
            }
        }

        //// 從「 事件備註 _behavRef 」 來檢查，會不會有「明明沒有事件來觸發物件顯示，但是物件上確有掛 behav_reference 」
        //// 上述情況發生的話，會造成物件啟使的時候，被設置為「不可見」，但又沒有任何事件可以觸發顯示
        // for ( let i in behavRefAll ){
        // 	let behavRefs = behavRefAll[i];
        // 	for( let j = 0, len = behavRefs.length; j < len; j++ ){
        // 		let behavRef = behavRefs[ j ];
        // 		// console.log(' _checkVRSceneResultBehav: _behavRefAll: ', i.slice(0,6) , j , behavRef );
        // 		// let behavRefObj = sceneObjDict[i];

        // 		let getBehavObj = false;
        // 		for ( let k in behavAll ){
        // 			let behavs = behavAll[k];
        // 			for ( let m = 0; m < behavs.length; m++ ){
        // 				if ( behavs[m].obj_id == i && behavs[m].behav_type == behavRef.behav_name ){
        // 					getBehavObj = { i: m, b: behavs[m] } ;
        // 				}
        // 			}
        // 		}

        // 		if ( getBehavObj == false ){
        // 			console.error('_checkVRSceneResultBehav: _getBehavObj false', i ,j, behavRefs );

        // 			// behavRef = null;
        // 			// behavRefs = null;

        // 			// behavRefs.fuck = '12354';
        // 			// behavRef.fuck = '123';
        // 			// behavRef.behav_name = '123';
                    
        // 			behavRefs.length = 0;

        // 		}else{
        // 			// console.log('_checkVRSceneResultBehav: _getBehavObj true', i ,j, behavRefs , getBehavObj );
        // 		}
        // 	}
        // }

        //// 從 「事件 behav 」來檢查「全部場景物件」中是否有物件沒有帶到「 事件備註 behav_reference 」
        //// 沒有的話，補上
        for ( let i in behavAll ){
            let behavs = behavAll[i];
            console.log(' _checkVRSceneResultBehav: _behavAll: ', i, behavs );
            for( let j = 0, len = behavs.length; j < len; j++ ){
                let behav = behavs[ j ];
                if ( behav.behav_type != "FingerGesture" ){
                    // console.log(' _checkVRSceneResultBehav: _behavAll: ', i.slice(0,6) , j ,behav );
                }
                
                if ( behav.obj_id ){
                    let behavObj = sceneObjDict[ behav.obj_id ];
                    //// 無條件自製 「 _behav_reference 」
                    if ( behavObj && Array.isArray( behavObj.behav_reference ) ){
                        behavObj.behav_reference.push({
                            behav_name: behav.behav_type,
                            target_id: behav.obj_id,
                        });
                    }else if ( behavObj ){
                        behavObj.behav_reference = [{
                            behav_name: behav.behav_type,
                            target_id: behav.obj_id,
                        }];
                    }else{
                        console.error('_checkVRSceneResultBehav: cant get _behavObj ', behav );
                    }


                    // if ( behavObj.behav_reference ){
                        
                    // 	let getBehaveRef = false;
                    // 	for ( let k = 0; k < behavObj.behav_reference.length; k++ ){
                    // 		if ( behavObj.behav_reference[k].behav_name == behav.behav_type ){
                    // 			getBehaveRef = true;
                    // 		}
                    // 	}

                    // 	if ( getBehaveRef ){
                    // 		// console.log('_checkVRSceneResultBehav: getBehaveRef true', behav, behavObj,  );
                    // 	}else{
                    // 		console.error('_checkVRSceneResultBehav: _getBehaveRef false', behav, behavObj );
                    // 	}
                        
                    // }else{
                    // 	console.error(' _checkVRSceneResultBehav: _behavObj ref not exist error: ', behavObj );

                    // }

                }
            }
        }
    }

    //// 載入「場景物件」完成之後，作的「物件區域」計算
    calcSceneArea() {
        
        let self = this;
        let objList = {} ;

        let objMaxX = 0;
        let objMinX = 0;
        let objMaxZ = 0;
        let objMinZ = 0;

        for ( let i = 0, len = self.makarObjects.length; i< len ; i++ ){
            
            let obj3D = self.makarObjects[i].object3D;
            if ( obj3D && obj3D.el && obj3D.el.id ){
                let boxList = [];
                obj3D.traverse( function(c){

                    if ( c.isMesh && c.geometry ){
                        
                        //// 20240619 YT物件由three平面和text組成，但a-text在這會報錯  renhaohsu暫時先跳過它
                        if(c.el){
                            if(c.el.tagName=="A-TEXT"){
                                if(c.el.object3D){
                                    if(c.el.object3D.isTempTextObj){
                                        return;
                                    }
                                }
                            }
                        }

                        let box = new THREE.Box3();
                        c.geometry.computeBoundingBox();
                        box.copy( c.geometry.boundingBox ).applyMatrix4( c.matrixWorld );
                        if ( box.max.z == box.min.z ){
                            box.max.z += 0.01;
                        }

                        if ( box.max.x > objMaxX ) objMaxX = box.max.x;
                        if ( box.min.x < objMinX ) objMinX = box.min.x;
                        if ( box.max.z > objMaxZ ) objMaxZ = box.max.z;
                        if ( box.min.z < objMinZ ) objMinZ = box.min.z;
                    

                        let boxHelper = new THREE.Box3Helper( box , 0x56a5d3 );
                        boxList.push( boxHelper );								

                        //// 顯示於畫面中，測試用
                        // self.vrScene.object3D.add( boxHelper );
                        // console.log(' .... ' , self.makarObjects[i], box.max.clone() , box.min.clone() );
                        // console.log(' .... ' , self.makarObjects[i], boxHelper.position.clone() , boxHelper.rotation.clone(), boxHelper.scale.clone(), boxHelper  );

                        // console.log(' .. ' , boxHelper.position.x , boxHelper.position.z  );

                    }

                });

                objList[ obj3D.el.id ] = boxList;

            }
        }

        self.objList = objList;

        let areaMax = new THREE.Vector2( objMaxX , objMaxZ );
        let areaMin = new THREE.Vector2( objMinX , objMinZ );
        
        self.areaMax = areaMax;
        self.areaMin = areaMin;
        
        // console.log(' _calcSceneArea: x = [', objMaxX, ', ' , objMinX , '], z = [' , objMaxZ, ', ' , objMinZ, ']' );

        if ( self.currentProjData && self.currentProjData.proj_descr.includes('_walking') ){
            
            let ground = document.getElementById('__ground');
                if ( ground ){
                    let gw = (objMaxX - objMinX) *2 ;
                    let gd = (objMaxZ - objMinZ) *2 ;
                    let gc = new THREE.Vector2( (objMaxX + objMinX)/2 , (objMaxZ + objMinZ)/2 );

                    ground.setAttribute('geometry', 'width:'+ gw +'; height:'+ gd+';'   );
                    ground.setAttribute('position',  {x: gc.x, y: 0.1 , z: gc.y }  );

                    
                    console.log(' _calcSceneArea: gwdc ', gw , gd, gc );

                }
        
        }

        // if ( self.publishVRProjs && Array.isArray(self.publishVRProjs.result) && Number.isFinite( self.projectIdx ) ){
            
        //     if ( typeof( self.publishVRProjs.result[ self.projectIdx ].proj_descr ) == 'string' && self.publishVRProjs.result[ self.projectIdx ].proj_descr.includes('_walking') == true  ){
        //         console.log(' _calcSceneArea: walking project ' , self.projectIdx , self.publishVRProjs.result[ self.projectIdx ] );

        //         let ground = document.getElementById('__ground');
        //         if ( ground ){
        //             let gw = (objMaxX - objMinX) *2 ;
        //             let gd = (objMaxZ - objMinZ) *2 ;
        //             let gc = new THREE.Vector2( (objMaxX + objMinX)/2 , (objMaxZ + objMinZ)/2 );

        //             ground.setAttribute('geometry', 'width:'+ gw +'; height:'+ gd+';'   );
        //             ground.setAttribute('position',  {x: gc.x, y: 0.1 , z: gc.y }  );

                    
        //             console.log(' _calcSceneArea: gwdc ', gw , gd, gc );

        //         }

        //     }else{
        //         console.log(' _calcSceneArea: not walking project ' , self.projectIdx , self.publishVRProjs.result[ self.projectIdx ] );
        //     }
        // }else{
        //     console.log(' _calcSceneArea: _publishVRProjs error ' , self.projectIdx , self.publishVRProjs );
        // }

    }

    //// 載入「場景物件」完成之後，作的「事件」處理，目前包含「注視事件」 而已
    //// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
    //// 流程：掃一遍「場景中物件 2d/3d 」
    setupSceneBehav() {
        
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
        // for ( let i = 0, len = self.lookAtObjectList.length; i < len; i++ ){
        //     let lookAtEvent = self.lookAtObjectList[i];

        //     let lookObjId = lookAtEvent.lookObjId;
        //     let lookObj = document.getElementById( lookObjId );
            
        //     let lookBehav = lookAtEvent.lookBehav;
        //     let targetObjId = lookBehav.obj_id;
        //     let reverse = lookBehav.reverse;

        //     let targetObj = document.getElementById( targetObjId );
        //     //// 確保「目標物件」「注視物件」都存在，建立持續事件
        //     if (lookObj && lookObj.object3D && targetObj && targetObj.object3D ){
                
        //         self.addLookAtTimeLine( lookObj , targetObj , lookAtEvent );

        //     }else{
        //         console.log('_setupSceneBehav: _lookAt error, obj not exist', lookObj , targetObj );
        //     }

        // }

    }

    ///// 建立「注視事件功能」
    addLookAtTimeLine( lookObj , targetObj , facingEvent ) {

        console.log(' _addLookAtTimeLine: _facingEvent=', facingEvent );

        let self = this;

        let targetPos = new THREE.Vector3();
        targetObj.object3D.getWorldPosition(targetPos);
        
        let tl = gsap.timeline();
        self.lookAtTimelineDict[ facingEvent.lookObjId ] = tl;

        if( lookObj == document.getElementById("aCamera") ){

            if( self.viewMode == "VR" ){
                // console.log("%c 注視事件，lookObj是相機", 'color:wheat', lookObj == aCamera)
                
                //// 先停止 aframe 對相機html tag的控制
                lookObj.setAttribute('look-controls', {enabled: false});
                
                //// 旋轉相機物件 (利用THREE的lookAt)
                targetObj.object3D.getWorldPosition(targetPos);
                lookObj.object3D.lookAt(targetPos);
                
                //// 實驗結果發現：相機物件要先翻轉過來，再將rotation指定給aframe相機設定才會正確
                lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );            
                
                if ( facingEvent && facingEvent.is_front == false ){
                    //// 背對: 該物體的 "朝向z軸負向" 的那一面 面對目標物體
                    lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
                }
                
                //// 調整aframe的相機設定後，再打開look-controls
                const afterRotation = lookObj.object3D.rotation.clone()
                aCamera.components["look-controls"].yawObject.rotation.y = afterRotation.y ;
                aCamera.components["look-controls"].pitchObject.rotation.x = afterRotation.x ;
                lookObj.setAttribute('look-controls', {enabled: true})
            }

        } else {

            //// 執行一次「注視效果」
            targetObj.object3D.getWorldPosition(targetPos);
            lookObj.object3D.lookAt(targetPos);
            if ( facingEvent && facingEvent.is_front == false ){
                //// 背對: 該物體的 "朝向z軸負向" 的那一面 面對目標物體
                lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
            }

            //// 暫時不使用「持續注視」
            //// 無條件不斷重複「注視功能」
            // tl.to(lookObj.object3D, {
            //     // duration: 1100,
            //     delay: 0, 
            //     ease: 'none',
            //     repeat: -1,
            //     onUpdate: function(){
            //         targetObj.object3D.getWorldPosition(targetPos);
            //         lookObj.object3D.lookAt(targetPos);
            //         if ( facingEvent && facingEvent.is_front == false ){
            //             //// 背對: 該物體的 "朝向z軸負向" 的那一面 面對目標物體
            //             lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
            //         }
            //     }
            // });
        }
    }

    //// 所有 「物件觸發事件」 需要作的「前置動作」
    //// 1. 場景載入物件時候，假如有「觸發事件」，則往下判斷是否有「群組」，並且紀錄下來
    //// 2. 「注視事件」
    setObjectBehavAll( obj ) {
        
        // let self = this;

        // for ( let i = 0, len = obj.behav.length; i < len; i++ ){
        //     //// 群組事件紀錄
        //     if ( obj.behav[i].group != '' ){
        //         if ( self.groupDict[ obj.behav[i].group ] ){
        //             let groupObj =  self.groupDict[ obj.behav[i].group ];

        //             groupObj.objs.push({
        //                 behav:  obj.behav[i]
                        
        //             } );

        //         }else{

        //         }		
        //     }


        //     //// 注視事件紀錄
        //     if ( obj.behav[i].behav_type == 'LookAt' && obj.behav[i].obj_id ){

        //         let lookAtEvent = {
        //             lookBehav: obj.behav[i] ,
        //             lookObjId: obj.obj_id ,
        //         }

        //         self.lookAtObjectList.push( lookAtEvent );

        //     }

        // }
    }

    //// 處理全部的 群組功能 包含 2D / 3D 
    //// 注意：目前群組功能只有作用在 「顯示/隱藏」相關的功能。我們也只先處理這些，未來在新增
    dealAllGroupHide( touchObject ) {

        let self = this;

        if ( !self.groupDict ){
            console.log('_dealAllGroup: missing groupDict');
            return;
        }

        //// 符合當前群組功能的 事件
        // let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];

        // console.log(' _dealAllGroupHide_:  ', touchObject );
        
        for (let i = 0; i < touchObject.behav.length; i++ ){
            let behav = touchObject.behav[i];
            if ( behav.group != ''  && self.groupDict[ behav.group ]  ){
                let groupIndex = behav.group;

                console.log(' _dealAllGroupHide:  ', groupIndex , self.groupDict[ groupIndex ].objs );

                self.groupDict[ groupIndex ].objs.forEach( ( groupObj , groupObjIndex  )=>{

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
    speechTextObj( textObj, _speed, speechLangIndex ) {
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
    //[end---20200617-fei0097-add]//


    //// v3.5.0.0 logic XML 放於 場景
    parseLogicXMLBySceneIndex = function( sceneIndex ){

        let pXML;
        let xmlUrl = VC.getSceneLogicXML( this.scenesData , sceneIndex );
        
        if ( xmlUrl != '' ){
            let logic = new Logic();
            pXML = logic.loadXMLtoDoc(xmlUrl);
            // vrController.logicList[ sceneIndex ] = logic;
            vrController.logic = logic;
        }

        return pXML;
    }


    ////
    //// 切換觀看模式，目前有「VR」跟「模型觀看」 兩種
    //// 起始預設為「VR」模式 
    //// 假如「有指定觀看模式」，則切換。假如沒有輸入，則判斷當前模式，改為另一個
    ////
    setViewMode( mode = '' ) {

        let self = this;

        let pSet = new Promise( function( setModeResolve ){

            let aCamera = document.getElementById('aCamera');
            let oCamera = document.getElementById('oCamera');
            let cameraForGyro = document.getElementById('cameraForGyro');

            let aCameraObject = aCamera.getObject3D('camera');
            let oCameraObject = oCamera.getObject3D('camera');

            if ( aCamera && oCamera && aCameraObject && oCameraObject ){

                if ( mode == 'VR' ){

                    oCamera.setAttribute('camera', 'active' , false );
                    aCamera.setAttribute('camera', 'active' , true );	
                    cameraForGyro.play();	

                    self.vrScene.camera = aCameraObject;


                    self.viewMode = 'VR';
                    if ( Number.isFinite( self.walkingStatus ) && self.walkingStatus != -1 ){
                        let ground = document.getElementById('__ground');
                        if ( ground ) ground.setAttribute('visible' , true );
                    }

                    setModeResolve( 'VR' );

                }else if ( mode == 'model' ){
                    oCamera.setAttribute('camera', 'active' , true );
                    aCamera.setAttribute('camera', 'active' , false );
                    cameraForGyro.play();

                    self.vrScene.camera = oCameraObject;

                    self.viewMode = 'model';

                    self.setWalkingObjVisible( false );

                    setModeResolve( 'model' );

                }else{
                    if ( oCamera.getAttribute('camera').active == false ){
                    
                        oCamera.setAttribute('camera', 'active' , true );
                        aCamera.setAttribute('camera', 'active' , false );
                        cameraForGyro.play();

                        self.vrScene.camera = oCameraObject;

                        self.viewMode = 'model';

                        self.setWalkingObjVisible( false );
                        
                        setModeResolve( 'model' );

                    } else if ( aCamera.getAttribute('camera').active == false ){

                        oCamera.setAttribute('camera', 'active' , false );
                        aCamera.setAttribute('camera', 'active' , true );		

                        self.vrScene.camera = aCameraObject;

                        self.viewMode = 'VR';

                        if ( Number.isFinite( self.walkingStatus ) && self.walkingStatus != -1 ){
                            let ground = document.getElementById('__ground');
                            if ( ground ) ground.setAttribute('visible' , true );
                        }

                        setModeResolve( 'VR' );

                    }else{
                        setModeResolve( -1 );
                    }	
                }
                
            }else{
                setModeResolve( -1 );
            }
        });

        return pSet;
    }

    ////// 設計將 VR 專案中 cursor 的功能取消，改以點擊觸發。 
    ////// 因為 VR 場景中目前不讓使用者以點擊或是滑鼠來操控物件，所以不需要額外判斷 look-control 開啟與否
    ////// --------------------- debug --------------------------------
    getMakarObject( obj ) {
        let self = this
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
    getObjectTypeByObj_id( obj_id ) {

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
                console.log('_getObjectTypeByObj_id: warning, both 2D/3D object get', obj_id , ', 3d:' , getObj3DIndex , getObj3D , ', 2d:' , getObj2DIndex , getObj2D );
                getObj.obj_type = '3d';
                getObj.obj_index = getObj3DIndex;
                getObj.obj = getObj3D;
            }else{

            }

        }

        return getObj;

    } 

    cameraMoveToPoint( paraemter ) {
        let self = this
        
        let pointerSphere = document.getElementById('pointerSphere');
        let currentPosSphere = document.getElementById('currentPosSphere');

        if ( !pointerSphere || !currentPosSphere ){
            return;
        }


        let pMove = new Promise(function(resolve, reject){
            
            let pointPosition = paraemter.position;
            let px = Math.round(pointPosition.x * 1000) / 1000;
            let py = Math.round(pointPosition.y * 1000) / 1000;
            let pz = Math.round(pointPosition.z * 1000) / 1000;

            //// 隱藏「選定目標位置」
            pointerSphere.setAttribute("visible", false);

            //// 設定「目標相機位置」
            currentPosSphere.setAttribute("visible", true );
            currentPosSphere.object3D.position.set( px , py , pz );

            const cameraObject3D = self.vrScene.camera.el.object3D
            let ox = cameraObject3D.position.x;
            let oy = cameraObject3D.position.y;
            let oz = cameraObject3D.position.z;

            let direction = new THREE.Vector3(px - ox, py - oy, pz - oz);
            let direction_normalized = new THREE.Vector3(px - ox, 0, pz - oz).normalize();

            let duration = Math.round(direction.length()) * 0.2;
            // console.log(' _duration: ', duration );
            
            duration = duration > 1 ? 1 : duration;
            

            let boundRaycaster = new THREE.Raycaster(cameraObject3D.position, direction_normalized);
            if (paraemter.dealBoundary == true){
                let boundIntersect = boundRaycaster.intersectObjects( boundaries, true);
                if (boundIntersect.length > 0) {
                    console.log("_cameraMoveToPoint: initial position hit boundary, distance ", boundIntersect[0].distance );
                    if (boundIntersect[0].distance < 1) {
                        console.log("_cameraMoveToPoint: initial position hit boundary, dont run  ");

                        //// 設定「目標相機位置」
                        currentPosSphere.object3D.position.copy( cameraObject3D.position );
                        resolve( 1 );
                        return;
                    }
                }
            }
            

            let tl = gsap.timeline();
            tl.to( self.domElement.gsapEmpty, {
                duration: duration,
                delay: 0,
                onStart: function(){

                },
                onUpdate: function(){
                    //// 這裡this是gsap的tl
                    let animePos = new THREE.Vector3(ox + direction.x * this.ratio , oy, oz + direction.z * this.ratio );

                    if (paraemter.dealBoundary == true){
                        let boundIntersect = boundRaycaster.intersectObjects( boundaries, true);
                        if (boundIntersect.length > 0) {
                            // console.log(" _cameraMoveToPoint: boundIntersect=", boundIntersect[0] );
                            //// 假如與『相機與邊界的距離』小於『相機要設置下一步的距離』，不應該再往前位移
                            if (boundIntersect[0].distance < animePos.distanceTo( cameraObject3D.position ) ) {
                            // if (boundIntersect[0].distance < 1) {

                                //// 設定「目標相機位置」
                                currentPosSphere.object3D.position.copy( animePos );

                                tl.pause();
                                tl.kill();
                                tl = null;

                                resolve( 1 );
                                return;
                            }
                        }
                    }

                    cameraObject3D.position.set(animePos.x, animePos.y, animePos.z);
                    
                },
                onComplete: function(){

                    resolve( duration );

                }

            });

        });	

        return pMove;

    }

    //// 設定「點擊移動」狀態， -1: 未啟動 , 0: 已啟動,  1. 移動中。
    setWalkingStatus( _value ) {

        let self = this;

        if ( Number.isFinite( self.walkingStatus ) ){
            console.log(' _setWalkingStatus: set from [', self.walkingStatus , ']', ' to [', _value, ']' );

            let ground = document.getElementById('__ground');
            let pointerSphere = document.getElementById('pointerSphere');
            let currentPosSphere = document.getElementById('currentPosSphere');

            if ( self.walkingStatus == 0 || self.walkingStatus == -1 ){
                self.walkingStatus = _value;
            }

            if ( self.walkingStatus == -1 ){
                if ( pointerSphere && currentPosSphere && ground ){
                    // ground.setAttribute("visible", false );
                    // pointerSphere.setAttribute("visible", false );
                    // currentPosSphere.setAttribute("visible", false );
                    self.setWalkingObjVisible( false );
                }
            }

            if ( self.walkingStatus == 0 ){
                if ( ground){
                    ground.setAttribute("visible", true );
                }
            }

        }else{
            console.log(' _setWalkingStatus: status not exist ', self.walkingStatus );
        }

    }

    setWalkingObjVisible( _status ) {
        let ground = document.getElementById('__ground');
        let pointerSphere = document.getElementById('pointerSphere');
        let currentPosSphere = document.getElementById('currentPosSphere'); 

        if ( ground && pointerSphere && currentPosSphere ){
            if ( _status == true ){
                ground.setAttribute("visible", true );
                pointerSphere.setAttribute("visible", true );
                currentPosSphere.setAttribute("visible", true );
            }else{
                ground.setAttribute("visible", false );
                pointerSphere.setAttribute("visible", false );
                currentPosSphere.setAttribute("visible", false );
            }
        }
    }
    // --- 到上面為止是原本 setupFunction 的內容
    
    //// 原本的VRController.prototype.UrlExistsFetch 但我發現這個函式似乎沒有被呼叫過
    async UrlExistsFetch(url) {            
        let ret = await fetch(url, {method: 'HEAD'})

        console.log('_VRController: _UrlExists2: ret ', ret );
        if ( ret.status ){
            return ret.status == '200';
        }else{
            return false ;
        }
    }

    setupFunction() {

        if (this.FUNCTION_ENABLED) {
            return;
        }
        // console.log("VRFunc.js: VRController: setupFunction");
        this.FUNCTION_ENABLED = true;
        var self = this;  
    
        ////// add the listener for show the panel or not
        self.vrScene.canvas.addEventListener("touchstart", startEvent, false);
        self.vrScene.canvas.addEventListener("mousedown", startEvent, false);
    
        self.vrScene.canvas.addEventListener("touchmove", moveEvent, false);
        self.vrScene.canvas.addEventListener("mousemove", moveEvent, false);
    
        self.vrScene.canvas.addEventListener("touchend", endEvent, false);
        self.vrScene.canvas.addEventListener("mouseup", endEvent, false);
    
        //////
        ////// raycaster for touch and mouse 
        //////
        let preMouse = new THREE.Vector2();
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
    
        function getMouse(event){
            let rect = self.GLRenderer.domElement.getBoundingClientRect();
    
            switch ( event.type ) {
                case "mouseup":
                case "mousemove":
                case "mousedown":
                    mouse.x = ( (event.clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                    mouse.y = - ( (event.clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                    break;
                case "touchend":////// 20190709 Fei: add this event type for cellphone
                case "touchstart":
                case "touchmove":
                    mouse.x = ( (event.changedTouches[0].clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                    mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                    break;
                default:
                    console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
                    return ;
            }
            return mouse.clone();
        }
    
        function startEvent(event){
            preMouse = getMouse(event);
    
            self.touchMouseState = 0;
        }
    
        function moveEvent(event){
            
            // console.log(' _mv ' , self.touchMouseState  );
            let moveMouse = getMouse(event);
            
            if (self.touchMouseState == 0 ){
                
                if ( moveMouse.sub(preMouse).length() > 0.01 ){
                    self.touchMouseState = 1;					
                }
                // console.log("VRFunc.js: moveEvent: ", moveMouse.sub(preMouse).length()  );
            }else{
                self.touchMouseState = 1;
    
            }
    
            let ground = document.getElementById('__ground');
            let pointerSphere = document.getElementById('pointerSphere');
    
            if ( pointerSphere && ground ){
    
                if ( self.touchMouseState == 0 || self.touchMouseState == 1 ){
            
                    if (!self.triggerEnable){
                        return;
                    }
                    //// 處理「點擊移動功能」，必須要 觀看模式 為 VR 且，啟動「可移動」
                    if ( self.viewMode == 'VR' && Number.isInteger (self.walkingStatus) && self.walkingStatus >= 0  ){
                        
                        
                        if ( Array.isArray( self.currentSceneMakarObjects ) && self.currentSceneMakarObjects.length > 0  ){
    
                        }else{
                            
                            for ( let i = 0; i < self.makarObjects.length; i++ ){
                                let makarObject = self.makarObjects[i];
                                if ( makarObject.object3D && makarObject.className == "clickable" ){
    
                                    let parentVisible = true;
                                    makarObject.object3D.traverseAncestors( function(parent) {
                                        if (parent.type != "Scene"){
                                            if (parent.visible == false){
                                                parentVisible = false;
                                            }
                                        }
                                    });
    
                                    if (parentVisible){
                                        self.currentSceneMakarObjects.push(makarObject.object3D );
                                    }
                                    
                                }
                            }
                            self.currentSceneMakarObjects.push( ground.object3D );
                        }
    
                        let makarTHREEObjects = self.currentSceneMakarObjects;
                        let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];
    
                        let selectedObjWithBehav = false;
    
                        raycaster.setFromCamera( moveMouse , self.vrScene.camera );
    
                        let groundIntersect = raycaster.intersectObjects( makarTHREEObjects , true ); 
                        if (groundIntersect.length > 0){
                            
                            //// 判斷是否有點集到「有事件的物件」
                            // groundIntersect.forEach( ( e , i ) => {
    
                            // 	if ( e.object && e.object.el && e.object.el.id && e.object.el.object3D && Array.isArray( e.object.el.object3D.behav )  ){
                            // 		// console.log(' _moveEvent: ' , i, e.object.el.id, e.object.el.object3D.behav );
    
                            // 		for ( let j = 0; j < e.object.el.object3D.behav.length; j++ ){
                            // 			if ( showEventStrList.filter( ev => ev == e.object.el.object3D.behav[j].behav_type ).length > 0 ){
                            // 				selectedObjWithBehav = true;
                            // 			}
                            // 		}
                            // 	}
    
                            // });
                            
                            // console.log(' _moveEvent: _selectedObjWithBehav ' , selectedObjWithBehav );
    
                            //// 假如當前指向的物件不是地板，則不顯示
                            if ( selectedObjWithBehav == true || ( groundIntersect[0].object && groundIntersect[0].object.el && groundIntersect[0].object.el != ground ) ){
                                pointerSphere.setAttribute("visible", false );
                                // pointerSphere.object3D.position.copy(groundIntersect[0].point);
                            }else{
                                pointerSphere.setAttribute("visible", true );
                                pointerSphere.object3D.position.copy(groundIntersect[0].point);
                            }
    
                        }
                    }
    
                }else{
                    pointerSphere.setAttribute("visible", false);
                }
    
            }
            
            
    
    
        }
    
        function endEvent( event ) {
    
            // console.log("VRFunc.js: _setupFunction: endEvent: event=", event , self.triggerEnable , self.touchMouseState );
    
            if (!self.triggerEnable){
                return;
            }
            if (self.touchMouseState == 1){
                //// 假如 是手機，「觸碰結束」，要把手指指到的位置刪除
                if ( event.type == 'touchend' ){
                    let pointerSphere = document.getElementById('pointerSphere');
                    if ( pointerSphere )  pointerSphere.setAttribute("visible", false);
    
                }
                return;
            }
    
            self.touchMouseState = 2;
            
            
            event.preventDefault(); ////// if not set this, on mobile will trigger twice 
            let rect = self.GLRenderer.domElement.getBoundingClientRect();
            switch ( event.type ) {
                case "mouseup":
                    mouse.x = ( (event.clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                    mouse.y = - ( (event.clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                    break;
                case "touchend":////// 20190709 Fei: add this event type for cellphone
                    mouse.x = ( (event.changedTouches[0].clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                    mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                    break;
                default:
                    console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
                    return ;
            }
            // console.log("VRFunc.js: _setupFunction: endEvent, mouse=", mouse  );
    
            //// 紀錄此次點擊是否有「觸發事件」，不論是「2D」「3D」「點擊事件」「邏輯功能」
            let eventTriggered = {};
    
            //[start-20200315-fei0092-add]//
            ////// for the 2D scene part

            let makarTHREEObjects2D = [];
            for ( let i = 0; i < self.makarObjects2D.length; i++ ){
                let makarObject2D = self.makarObjects2D[i];
                if (makarObject2D.makarObject == true ){
                    makarTHREEObjects2D.push(makarObject2D );
                }
            }

            raycaster.setFromCamera( mouse, self.camera2D );
            let intersects2D = raycaster.intersectObjects(  makarTHREEObjects2D, true ); 
            // console.log("XRFunc.js: raycaster 2D: endEvent, intersects2D=", intersects2D , makarTHREEObjects2D );
            if (intersects2D.length != 0 ){
                let touchObject2D = self.getMakarObject( intersects2D[0].object );
                // console.log("XRFunc.js: raycaster 2D: endEvent, touchObject2D=", touchObject2D  );
                if (touchObject2D.behav){

                    //// 紀錄觸發到的事件
                    eventTriggered['2d_behav'] = touchObject2D.behav ;

                    self.dealAllGroupHide( touchObject2D );

                    let reset = false;
                    for(let i = 0; i < touchObject2D.behav.length; i++){
                        // if (touchObject2D.behav[i].simple_behav == "CloseAndResetChildren"){
                        if (touchObject2D.behav[i].behav_type == "CloseAndResetChildren"){
                            reset = true;
                        }
                    }

                    //// 從 3.3.8 版本以後， 2D/3D 物件可以互相觸發「事件」 
                    //// 所以每個物件點擊後，帶有的「 事件中物件id 」 來判斷「要觸發的物件類別」為 2D/3D                     
                    for(let i = 0; i < touchObject2D.behav.length; i++){

                        let gObj;
                        if ( touchObject2D.behav[i].obj_id ){
                            gObj = self.getObjectTypeByObj_id( touchObject2D.behav[i].obj_id );
                        }

                        if (touchObject2D.behav[i].behav_type == "Display"){
                            
                            if ( gObj.obj_type == '2d' ){
                                let tempBehav = Object.assign({}, touchObject2D.behav[i]);
                                tempBehav.behav_type = "Display2D"; //// seperate from Display
                                self.triggerEvent( tempBehav, reset , touchObject2D );
                            }else if ( gObj.obj_type == '3d' ){
                                self.triggerEvent( touchObject2D.behav[i] , reset , touchObject2D );
                            }
                            
                        // }else if ( touchObject2D.behav[i].behav_type == "Media" ){

                        //     if ( gObj.obj_type == '2d' ){
                        //         let tempBehav = Object.assign({}, touchObject2D.behav[i]);
                        //         tempBehav.behav_type = "Media2D"; //// seperate from Media2D
                        //         self.triggerEvent( tempBehav, reset , touchObject2D );
                        //     }else if ( gObj.obj_type == '3d' ){
                        //         self.triggerEvent( touchObject2D.behav[i] , reset , touchObject2D );
                        //     }
                            
                        }else{
                            self.triggerEvent( touchObject2D.behav[i], reset, touchObject2D );

                        }
                    }
                }
            }
            //[end---20200315-fei0092-add]//

            ////// for the 3D scene part
            let makarTHREEObjects = [];
            for ( let i = 0; i < self.makarObjects.length; i++ ){
                let makarObject = self.makarObjects[i];
                if ( makarObject.object3D && makarObject.className == "clickable" ){
    
                    let parentVisible = true;
                    makarObject.object3D.traverseAncestors( function(parent) {
                        if (parent.type != "Scene"){
                            if (parent.visible == false){
                                parentVisible = false;
                            }
                        }
                    });
    
                    if (parentVisible){
                        makarTHREEObjects.push(makarObject.object3D );
                    }                        
    
                }
            }
    
            raycaster.setFromCamera( mouse, self.vrScene.camera );
            let intersects = raycaster.intersectObjects(  makarTHREEObjects, true ); 
            // console.log("VRFunc.js: _setupFunction: endEvent, intersects=", intersects , makarTHREEObjects , self.makarObjects );
    
            //// 為了「移動功能」的判斷，只要觸發「邏輯事件」或是「觸發事件」則不執行「移動」
            let objectWithLogicEvent = false;
            let objectWithClickEvent = false;

            if (intersects.length != 0 ){
                // console.log("VRFunc.js: _setupFunction: 1 endEvent, intersects=", intersects );
    
                //// 客製化 磁力片 測試用: 點擊到 Mesh
                for (let i =0, l = intersects.length; i < l ; i++){
                    let e = intersects[i];
                    if ( e.object && e.object.visible ){
                        console.log('_m :', e.object.name , e.object )
                        window.c = e.object ;

                        //// 找上層 數字代號的物件，假如有的話，則隱藏
                        let gotN = false;
                        e.object.traverseAncestors( function( p ) {
                            if ( gotN == false && p && p.type == 'Object3D' && p.name && Number.isInteger( Number(p.name) )  ){
                                console.log('p :', p.type, p.name, p );
                                window.p = p;

                                // p.visible=false;
                                gotN = true;

                                if ( Number.isInteger(event.button)  ){
                                    //// 標示
                                    if ( event.button == 0 ){

                                        // if ( p.marked ){
                                        //     p.marked = false;
                                        //     p.traverse( function( c ){
                                        //         if ( c.isMesh ){
                                        //             c.material.emissive.copy( c.material.originEmissive );
                                        //             c.material.emissiveIntensity = c.material.orignEmissiveIntensity;    
                                        //         }
                                        //     })
                                        // }else{
                                        //     p.marked = true;
                                            
                                        //     p.traverse( function( c ){
                                        //         if ( c.isMesh ){
                                        //             c.material.originEmissive = c.material.emissive.clone();
                                        //             c.material.orignEmissiveIntensity = c.material.emissiveIntensity;
    
                                        //             c.material.emissive.setHex( 0x00ff00 );
                                        //             c.material.emissiveIntensity = 0.5;
                                        //         }
                                        //     })
                                        // }

                                    }else if ( event.button == 2 ){

                                        // p.visible=false;

                                    }
                                }
                            }
                        })

                        // if ( e.object && e.object.parent && e.object.parent.parent && e.object.parent.parent.type == 'Object3D' ){
                        //     console.log('pp :', i , e.object.parent.parent.type, e.object.parent.parent.name );
                        //     e.object.parent.parent.visible=false;
                        // }

                        break;
                    }else{
                        console.log('_MouseUpEvent_ 2:', i , e.object )
                    }
                }


                let touchObject = self.getMakarObject( intersects[0].object );
                // console.log("VRFunc.js: _setupFunction: endEvent, touchObject.behav=", touchObject.behav );
                // ------
                let intersectObject3D = touchObject.el ;
                if ( intersectObject3D ) {
                    if(intersectObject3D.onclickBlock){	
    
                        objectWithLogicEvent = true;
    
                        for(let i = 0; i < intersectObject3D.onclickBlock.length; i++){
                            if(intersectObject3D.onclickBlockState[i]){
                                intersectObject3D.onclickBlockState[i] = false;
                                if ( vrController.logic ){
                                    vrController.logic.parseBlock( intersectObject3D.onclickBlock[i], function(){
                                        intersectObject3D.onclickBlockState[i] = true;
                                    } ) ; 
                                    
                                    //// 紀錄觸發到的事件
                                    eventTriggered['3d_logic'] = intersectObject3D.onclickBlock[i] ;
                                }
                            }
                        }
                        
                    }
                }
                // ------
    
    //[start-20200915- fei 0101-add]//
                // console.log("VRFunc.js: _setupFunction: endEvent, touchObject.behav=", touchObject );
                touchObject.traverse(function(child){
                    if (child.isMesh){
                        // console.log("VRFunc.js: _setupFunction: endEvent, child = " , child );
                    }
    
                });
    
    //[end---20200915- fei 0101-add]//
    
                if (touchObject.behav){
                    // self.triggerEvent( touchObject.behav[0] ); // 20190827: add the parameter obj( makarObject)
                    // return;
    
                    //// 處理所有群組相關事件，目前只處理「顯示/隱藏 相關功能」，其他功能比如 「切換動畫」等之後等定義明確後再執行
                    //// 未來會有 2D/3D 物件，也一並於此處理
                    self.dealAllGroupHide( touchObject );
    
                    //[start-20230809-howardhsu-add]//
                    //// CloseAndResetChildren 在 ver. 3.5 沒出現過
                    //[end-20230809-howardhsu-add]//

                    let reset = false;
                    for(let i = 0; i < touchObject.behav.length; i++){
                        if (touchObject.behav[i].behav_type == "CloseAndResetChildren"){
                            reset = true;
                        }
                    }
                    for(let i = 0; i < touchObject.behav.length; i++){
                        if (touchObject.behav[i].behav_type != "CloseAndResetChildren"){

                            let gObj;
                            if ( touchObject.behav[i].obj_id ){
                                gObj = self.getObjectTypeByObj_id( touchObject.behav[i].obj_id );
                            } 

                            //[start-20231110-howardhsu-modify]//	
                            if(touchObject.behav[i].behav_type == "ShowQuiz"){
                                
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
                                
                            // } else if (touchObject.behav[i].behav_type == "Media"){
									
                            //     if ( gObj.obj_type == '2d' ){
                            //         let tempBehav = Object.assign({}, touchObject.behav[i]);
                            //         self.triggerEvent( tempBehav, reset , touchObject );
                            //     }else if ( gObj.obj_type == '3d' ){
                            //         self.triggerEvent( touchObject.behav[i], reset, touchObject );
                            //     }
                                
                            } else {
                                self.triggerEvent( touchObject.behav[i], reset, touchObject );
                            }
                            //[end-20231110-howardhsu-modify]//	

                        }

                        if ( touchObject.behav[i].behav_type != 'FingerGesture' && touchObject.behav[i].behav_type != 'LookAt' ){
                            objectWithClickEvent = true;

                            //// 紀錄觸發到的事件
                            eventTriggered['3d_behav'] = touchObject.behav ;
                        }

                    }

                }

            }
    
            //// 假如「點擊觸發事件」跟「邏輯點擊」都沒有執行則判斷是否「點擊地板移動」
            // console.log(' event logic check: ', objectWithLogicEvent , objectWithClickEvent );
            if (  objectWithLogicEvent == false && objectWithClickEvent == false ){
                // console.log(' both pass ', self.walkingStatus , self.viewMode );
                //// 先判斷是否有使用走動功能
                //// 也只有「VR觀看模式」可以使用
                if (  Number.isInteger (self.walkingStatus) && self.viewMode == 'VR' ){
                    //// 只有在待命狀態，才能觸發移動
                    if ( self.walkingStatus == 0 ){
    
                        let ground = document.getElementById('__ground');
                        let intersects = raycaster.intersectObjects( [ ground.object3D ], true ); 
    
                        if ( intersects.length > 0 ){
                            let selectedObject = intersects[0].object;
    
                            console.log(' selectedObject ', selectedObject );
                            
                            if ( selectedObject.el ){
                                if (selectedObject.el.getAttribute("id") == "__ground" ){
                                    console.log(' _endEvent: object is ground ');
    
                                    self.walkingStatus = 1;
                                    let pmd = self.cameraMoveToPoint( {position: intersects[0].point, dealBoundary: false } );
                                    pmd.then( function(){
                                        //// 將狀態設回來 
                                        self.walkingStatus = 0;
                                    });
    
                                    //// 紀錄觸發到的事件
                                    eventTriggered['ground_move'] = selectedObject ;
    
                                }else{
                                    console.log(' _endEvent: object is not ground ');
                                }
                            }else{
                                console.log(' _endEvent: object without el ');
                            }
                        }
    
                    }else if ( self.walkingStatus == -1 ){
                        // console.log(' _endEvent: _walkingStatus =-1')
                    }else if ( self.walkingStatus == 1 ){
                        console.log(' _endEvent: _walkingStatus = 1')
                    }
    
                }
    
            }
            
            //// 判斷點擊是否有「觸發事件」，沒有的話，判斷
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
                // console.log(' _entEvent:  touch somethong ', eventTriggered );
            }
    
        }  

    }

    triggerEvent( event, reset, makarObj ) {
        if (!this.FUNCTION_ENABLED){
            return;
        }
        var self = this;
        let target;
    
        //[start-20231130-renhaohsu-mod]
        if(typeof reset == 'undefined') reset = false;
        //[end-20231130-renhaohsu-mod]

        //[start-20230807-howardhsu-modify]//
        let obj_id = event.obj_id

        //// 觸發behav時也都dispatchEvent ( 也算是 for_makarSDK ) 
        // let vrDiv = document.getElementById("vrDiv");
        // vrDiv.addEventListener("MakarEvent", e => {
        //     console.log("%c MakarEvent(behav) e.detail=", 'color: MediumAquamarine;', e.detail)
        // })
        this.makarEvents.dispatchEvent(event);

        //// 3.5 沒有 simple_behav 了 變成 behav_type
        switch ( event.behav_type ){
            case "Dialing":
                console.log("VRFunc.js: triggerEvent: Dialing: event=", event );	
                let telTag = window.document.getElementById("phoneCall");
                telTag.href = "tel:"+event.phone ;
                telTag.click();
                break;
    
            case "Email":  
                console.log("VRFunc.js: triggerEvent: SendEmail: event=", event );	
                let mailTag = window.document.getElementById("sendEmail");
                mailTag.href = "mailto:" + event.mail_to ;
                mailTag.click();
                break;
    
            case "URL":
                console.log("VRFunc.js: triggerEvent: URL: event=", event , event.url );	
                let webTag = window.document.getElementById("openWebBrowser");
                webTag.href = event.url ;
                webTag.click();
                console.log("VRFunc.js: triggerEvent: URL: webTag=", webTag );	
                break;
                
            case "Scenes":
                console.log("VRFunc.js: triggerEvent: SceneChange: event=", event );
                            
                //[start-20240102-howarhdsu-add]//
                //// 因應 editor 有 "立即執行"、"延遲執行" 的設定
                if(event.delay == true){
                    if(event.previousID){
                        clearTimeout(event.previousID);
                    }
                    console.log("VRcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                    let timeoutID = setTimeout(() => {
                        behavScenes()
                    }, 3000); 
                    event.previousID = timeoutID;
                    
                } else {
                    behavScenes()
                }   
                //[end-20240102-howarhdsu-add]//

                function behavScenes(){
                    let sceneID = event.scene_id;
                    let idx = self.projectIdx;          
    
                    for (let i = 0;i<self.scenesData.scenes.length;i++){
                        if(self.scenesData.scenes[i].info.id == sceneID){
                            
                            // window.activeVRScenes(i,j);
                            //// 先將觸控關閉，再跳轉場景
                            self.triggerEnable = false;
                            self.domElement.loadPage.style.display = "block";
        
                            //[start-20230725-howardhsu-modify]//
                            // if ( typeof( loadingTickOn )  != undefined ){
                                self.loadingTickOn = true;
                            // }
                            //[end-20230725-howardhsu-modify]//

                            self.pause2dVideos()
                            self.pause3dVideos()
        
                            self.loadScene(i);
        
                        }
                    }
                    //20200807-thonsha-mod-end
                    //20191023-end-thonsha-add
                }
                
                break;
                
            //[start-20231208-howarhdus-modify]//   
            //// ver. 3.5 顯示圖片、文字、模型、影片、播放聲音
            case "Display":  
                console.log("VRFunc.js: triggerEvent: Display: event=", event );
                
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
                    console.log("VRcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type); 
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
                                    target.needReplay = true
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
                    console.log("VRcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
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
                    
            case "Animation":
                
                console.log("VRFunc.js: triggerEvent: Animation: event=", event );
                target = document.getElementById(obj_id);
                if (!target){
                    console.log('VRFunc.js: Animation: target not exist', target);
                    break;
                }
                
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
                break;
    
            case "TTS":
                console.log("VRFunc.js: _ReadText: ", event );
                //// 找到對應的文字物件
                if ( event.obj_id ){
                    let textObjID = event.obj_id;
                    let idx = self.projectIdx;
                    
                    if ( self.scenesData && self.scenesData.scenes[ self.sceneIndex ] && Array.isArray( self.scenesData.scenes[ self.sceneIndex ].objs ) ){
                        self.scenesData.scenes[ self.sceneIndex ].objs.forEach( e =>{
                            if ( e.generalAttr.obj_id == textObjID  ){
                                self.speechTextObj( e , event.speed, event.language);
                            }
                        });
                    }
                }
                //[end-20230808-howardhsu-modify]//
    
                break;

            //[start-20231207-howardhsu-modify]//
            case "ShowQuiz":
                //// 先確認是否已經有Quiz正在玩
                if( !window.aQuizVR.checkIsAnyQuizPlaying() ){
                    //// 若需要同時有複數個quiz
                    // if( true ){

                        const login_id = localStorage.getItem("MakarUserID") 
                        const proj_id = self.currentProjData.proj_id;

                        //// 以下將  "是否強制登入" "可否重複遊玩"  四種情形分開處理
                        if( event.force_login ){
                            //// 若該quiz在編輯器設定為"強制登入遊玩"，初步檢查是否登入。
                            if ( login_id ){
                                if(event.allow_retry){
                                    //// 該 quiz 在編輯器裡 設定為 "強制登入" "可重複遊玩"
                                    showQuizUI( self.worldContent.clickToPlay[self.languageType] )
                                } else {
                                    //// "強制登入" "不可重複遊玩" call後端api檢查是否有遊玩記錄
                                    checkApiRecordAndShowUI()
                                }                                
                            } else {
                                //// user沒有登入
                                console.log("%c VRcontroller.js: _triggerEvent ShowQuiz: user is not logged in.", "color: orange;")
                            }
                        } else if ( !event.force_login && event.allow_retry ){
                            //// 該 quiz 在編輯器裡 設定為 "不強制登入" "可重複遊玩"
                            showQuizUI(self.worldContent.clickToPlay[self.languageType])
                        } else if ( !event.force_login && !event.allow_retry ){
                            //// "不強制登入" "不可重複遊玩"    檢查 mdb 目前被點擊的 quiz 是否已遊玩過
                            checkMdbAndShowUI()
                        } else{
                            console.warn("VRControoller _triggerEvent: ShowQuiz error")
                        }


                        //// 顯示 html UI (startQuiz) 並給定文字
                        function showQuizUI(textContent){
                            //// 記錄當前被點擊要打開的quiz id
                            window.aQuizVR.currentlyTriggeredQuizId = event.obj_id
                                                                
                            const findLoadedQuiz = window.aQuizVR.loadedQuizzes.find(q => q.obj_id == event.obj_id)
                            if( findLoadedQuiz ){
                                if( findLoadedQuiz.isPlayed == true ) {
                                    return;
                                }
                            }
                            
                            //// 顯示問答初始頁面 給html UI文字
                            document.getElementById("QuizStartContent").textContent = textContent;
                            // let startQuiz = document.getElementById("startQuiz")			
                            // startQuiz.style.display = "block"
                            self.domElement.startQuiz.style.display = "block"
        
                            //// 把當前的 quiz trigger behav 記錄為已經played
                            makarObj.behav.forEach( b => {
                                if(b.behav_type == "ShowQuiz"){
                                    b.played = true
                                } 
                            })     
                        }

                        //// 檢查 後端API getRecordModule 是否有quiz遊玩記錄 ? 有的話不載入 : 否則載入quiz
                        function checkApiRecordAndShowUI(){
                            net.getRecordModule( login_id, proj_id ).then(ret => {
                                if(ret.data.record_module_list.length != 0){                                                
                                    //// 此登入用戶已經有遊玩記錄 
                            
                                    // console.log("record_module_list", ret.data.record_module_list)
                                    let quizProjectModuleRecord;
                                    if( ret.data.record_module_list && Array.isArray(ret.data.record_module_list) ){
                                        if(ret.data.record_module_list[0].project_module){
                                            quizProjectModuleRecord = ret.data.record_module_list[0].project_module
                                        }
                                    }

                                    //// 從記錄裡找 Quiz obj_id 確認是否玩過
                                    let played = false
                                    if(quizProjectModuleRecord){
                                        if(quizProjectModuleRecord.playedQuizzes && Array.isArray(quizProjectModuleRecord.playedQuizzes)){
                                            played = quizProjectModuleRecord.playedQuizzes.find( item => item.obj_id==event.obj_id)
                                            // console.log("從記錄裡找 Quiz obj_id 確認是否玩過", played) 
                                        }
                                    }
                                    
                                    if(played){
                                        //// 這Quiz已經遊玩過，跳出提示 
                                        showQuizUI( self.worldContent.userAlreadyPlayed[self.languageType] )
                                        let quitQuizFunc = function(){
                                            self.domElement.startQuiz.style.display = "none";
                                            QuizStartButton.removeEventListener("click",quitQuizFunc);
                                        }
                                        QuizStartButton.addEventListener("click",quitQuizFunc);    
                                    } else {
                                        //// 沒有遊玩記錄 ，直接載入問答資料
                                        showQuizUI( self.worldContent.clickToPlay[self.languageType] )
                                    }
                                    
                                } else{
                                    //// 沒有遊玩記錄 ，直接載入問答資料
                                    showQuizUI( self.worldContent.clickToPlay[self.languageType] )
                                }
                            })
                        }

                        //// 檢查 mdb 目前被點擊的 quiz 是否已遊玩過 ? 有的話不載入 : 否則載入quiz
                        function checkMdbAndShowUI(){
                            //// 先從mdb檢查 現在應該展示的 quiz 是否已遊玩過 (已考慮複數個quiz的情況)
                            let isThisQuizPlayed = false
                            aQuizVR.getQuizProjectFromMDB(self.scenesData.project_id).then(result => {                                        
                                if ( result ){
                                    //// 檢查 現在應該展示的 quiz 是否已遊玩過
                                    if( result.quizzes ){
                                        if( result.quizzes[event.obj_id] ){
                                            isThisQuizPlayed = true;
                                        }
                                    }
                                }
                                //// 該 quiz 尚未遊玩過
                                if(!isThisQuizPlayed){
                                    showQuizUI( self.worldContent.clickToPlay[self.languageType] )
                                } else {
                                    //// 該 quiz 已經遊玩過               
                                    showQuizUI( self.worldContent.userAlreadyPlayed[self.languageType] )                 
                                    let quitQuizFunc = function(){
                                        self.domElement.startQuiz.style.display = "none";
                                        QuizStartButton.removeEventListener("click",quitQuizFunc);
                                    }
                                    QuizStartButton.addEventListener("click",quitQuizFunc);           
                                    console.log('%c VRcontroller.js: _triggerEvent ShowQuiz: user has played this quiz already', 'color:orange')
                                }
                            })
                        }

                } else {
                    console.log("%cVRController.js _triggerEvent: ShowQuiz triggered, but user hasn't finnish previous quiz yet.", "color: orange")
                }

                break

            case "QuizOption":
                //// 考慮多個Quiz存在場上的情況，找出被點擊的是哪個Quiz的選項  (舊稱: "PushButton")
                // console.log("_vrController _triggerEvent _quizOption makarObj=", makarObj)
                aQuizVR.loadedQuizzes.forEach( q => {
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
            //[end-20231207-howardhsu-modify]//

            case "MoveAlongPath":
                let obj = document.getElementById(event.obj_id);
                obj.object3D.bezier.play();
                break;

            case "Skybox":

                //// 因應 editor 有 "立即執行"、"延遲執行" 的設定
                if(event.delay == true){
                    if(event.previousID){
                        clearTimeout(event.previousID);
                    }
                    console.log("VRcontroller.js _triggerEvent: Delayed for 3 second.", event.behav_type);
                    let timeoutID = setTimeout(() => {
                        behavSkybox()
                    }, 3000); 
                    event.previousID = timeoutID;
                } else {
                    behavSkybox()
                }

                function behavSkybox(){

                    let scene_skybox_res_id = event.skybox_id;
                    let sceneSky_info = {};

                    //// 從「使用者素材庫」查找天空物件資料
                    if ( self.userProjResDict[ scene_skybox_res_id ] ){
                        let skyObj = self.userProjResDict[ scene_skybox_res_id ]
                        if ( skyObj.main_type == 'spherical_image' || skyObj.main_type == 'spherical_video' ){
                            sceneSky_info = skyObj;
                        }                        
                    }

                    let scene_skybox_url = sceneSky_info.res_url;
                    let targetCube;
                    if ( THREE.WebGLRenderTargetCube ){
                        targetCube = new THREE.WebGLRenderTargetCube(1024, 1024);
                    }else{
                        targetCube = new THREE.WebGLCubeRenderTarget( 1024 );
                    }

                    UrlExists( scene_skybox_url, function( retStatus ){
                        if (retStatus == false){
                            scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg";
                        }

                        let envTexture = new THREE.TextureLoader().load(
                            scene_skybox_url,
                            function() 
                            {
                                let cubeTex = targetCube.fromEquirectangularTexture(self.vrScene.renderer, envTexture);
                                self.cubeTex = cubeTex;

                                let scenes = [];
                                scenes = VC.getScenes( self.scenesData );
                                let scene_id = scenes[self.currentSceneIndex].info.id;

                                let pSky = self.loadSky( self.vrScene, scene_id, sceneSky_info, self.loadSceneCount)   

                                pSky.then( function( ret ){
                                    console.log('VRFunc.js: _loadScene: pSky then ret = ', ret );     
                                    
                                    for (let i = 0; i < self.makarObjects.length;i++){
                                        let objj = self.makarObjects[i].getObject3D('mesh');
                                        if (objj){
                                            objj.traverse(node => {
                                                if (node.material) {
                                
                                                    node.material.envMap = self.cubeTex.texture;
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        );


                    });

                }

                

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

                    //// 檢查物件是不是相機
                    if( !lookObj ){
                        const findLookObjObjJson = self.scenesData.scenes[self.sceneIndex].objs.find( o => o.generalAttr.obj_id == lookObjId )
                        if( findLookObjObjJson ){
                            if( findLookObjObjJson.main_type == "camera"){
                                console.log("_triggerEvent: Facing event, lookObj is camera", event)

                                //// 20240415 目前設定為 只在VR檢視模式時旋轉oCamera
                                lookObj = document.getElementById('aCamera');
                            } 
                        }
                    }

                    if( !targetObj ){
                        const findTargetObjJson = self.scenesData.scenes[self.sceneIndex].objs.find( o => o.generalAttr.obj_id == targetObjId )
                        if( findTargetObjJson ){
                            if( findTargetObjJson.main_type == "camera"){
                                //// 注視目標如果是相機，依照檢視模式決定哪個相機
                                const viewModeCamera = { "VR": aCamera, "model": oCamera}
                                targetObj = viewModeCamera[self.viewMode];
                                console.log("_triggerEvent: Facing event, targetObj is camera", targetObj, event)
                            } 
                        }
                    }

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
                                    v.muted = true;

                                    
                                    //// ios safari 需要先把其他影片都靜音
                                    if (window.Browser){
                                        if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                        // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                            console.log("這裡應該讓其他的影片發出聲音")
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
                                        console.log("明明沒有對chrome做處理 但chrome也會自動只播放它然後停止別人  因此在點擊事件也要像ios一樣嗎")
                                        self.UnMutedAndPlayAllVisibleVideo( obj2D );
                                    }
                                }
                            }
                            
                            const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                            console.log("_videoTogglePlayPause obj2D isVideoPlaying" , isVideoPlaying)
                            if(isVideoPlaying(video)) {
                                video.pause();
                                video.muted = true;

                                if(video.volume != 0){
                                    //// ios safari 需要先把其他影片都靜音
                                    if (window.Browser){
                                        if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                        // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                            //// 這裡應該讓其他的影片發出聲音
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
                // console.log("VRFunc.js: triggerEvent: default: event=", event );	
    
                break;
        }
    
    }

    getSnapShot() {

        let self = this;
    
        let pSnapShot = new Promise( function( snapResolve ){
    
            if (!self.FUNCTION_ENABLED){
                snapResolve( -1 ); 
                return;
            }
    
            if ( !self || !self.GLRenderer || !self.vrScene || !self.GLRenderer.domElement || !self.vrScene.object3D ||
                !self.GLRenderer.domElement.clientWidth || !self.GLRenderer.domElement.clientHeight || 
                !self.GLRenderer.domElement.width || !self.GLRenderer.domElement.height 
            ){
                console.log(' _VRController: _getSnapShot: something error ', self );
                snapResolve( -1 );
                return;
            }
    
            self.GLRenderer.clearDepth();
            self.GLRenderer.render( self.vrScene.object3D, self.vrScene.camera );
            self.GLRenderer.render( self.scene2D, self.camera2D );
            
            // let size = self.GLRenderer.getSize();
    
            let dataURL = self.GLRenderer.domElement.toDataURL("image/png", 1.0);
    
            //// 改變 canvas，必須的。讓圖片原版比例改變。
            // let ccw = self.GLRenderer.domElement.clientWidth;
            // let cch = self.GLRenderer.domElement.clientHeight;
            // let cw = self.GLRenderer.domElement.width;
            // let ch = self.GLRenderer.domElement.height;
    
            // console.log('XRFunc.js: _SnapShot: canvas client wh= ',  ccw, cch, 'canvas wh=', cw, ch );
            // let newCanvas = document.createElement('canvas');
            // newCanvas.width = cw;
            // newCanvas.height = cw * ( cch / ccw );
            // let newCtx = newCanvas.getContext('2d');
            // newCtx.drawImage(self.GLRenderer.domElement, 0, 0, cw, ch, 0, 0, newCanvas.width , newCanvas.height );
            // var dataURL = newCanvas.toDataURL("image/png", 1.0);
    
    
            snapResolve( dataURL ) ; 
    
        } );
    
        return pSnapShot ;
    
    }

    startWebCam( callback ){
        let self = this
        let onError = function(err) { 
            console.error("VRController: _startWebCam error:", err); 

            self.video = { videoWidth: innerWidth, videoHeight: innerHeight };

            let w = innerWidth;
            let h = innerHeight;

            let camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -100, 20000);
            self.camera2D = camera2D;

            //////////////////////////////
            
            let camera3D = new THREE.PerspectiveCamera(  60, w/h, 0.3 ,  10000 );
            self.camera3D = camera3D;

            let aCamera = document.getElementById('aCamera');
            aCamera.setObject3D( 'camera', camera3D );
            let cameraData = {
                aspect: w/h,
                near: 0.3,
                far: 10000,
                fov: 60,
            }
            aCamera.setAttribute('camera' , cameraData );
            self.vrScene.camera = camera3D;

            let rotation = new THREE.Vector3();
            rotation.multiply( new THREE.Vector3(-1,-1,0) ).add( new THREE.Vector3(0, 180, 0) );
            aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
            aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;
            
            
            //////////////////////////////

            let oCamera = document.getElementById('oCamera');							
            let oCamera3D = new THREE.PerspectiveCamera(  60, w/h, 0.3 ,  10000 );

            let originOCameraPosition = oCamera.getObject3D('camera').position.clone();
            oCamera3D.position.copy( originOCameraPosition );

            self.oCamera3D = oCamera3D;
            oCamera.setObject3D( 'camera', oCamera3D );
            oCamera.setAttribute('camera' , cameraData );

            oCamera.components['camera'].camera = oCamera3D;
            oCamera.components['orbit-controls'].controls.object = oCamera3D;

            if ( parent.selectedProject ){
                if ( parent.selectedProject.viewMode == 'VR' ){
                    self.setViewMode( 'VR' );
                }else if (parent.selectedProject.viewMode == 'model'){
                    self.setViewMode( 'model' );
                }else{
                    self.setViewMode( 'VR' );
                }
            }else{
                self.setViewMode( 'VR' );
            }


            callback( false );

        };

        ////// check the previous camera facing
        var cameraFacing = localStorage.getItem("cameraFacing");	
        var doExchangeCamera = localStorage.getItem("doExchangeCamera");
        if ( doExchangeCamera == 1 ){
            if (cameraFacing == "environment"){ // base on last cameraFacing to reverse it 
                localStorage.setItem("cameraFacing", "user");
                console.log("------- set _cameraFacing to user");
            }else{
                localStorage.setItem("cameraFacing", "environment");
                console.log("------- set _cameraFacing to environment");
            }
        } else{
            localStorage.setItem("cameraFacing", "environment"); // reset facing to environment 
            if ( window.makarID ){  // directly startAR process if the window.makarID exist.
                localStorage.setItem( "makarID",  window.makarID );
            }else{
                console.log("three.js: doExchangeCamera != 1, window.makarID isn't exist, wait the Start AR button trigger" );	
            }
        }
        var currentCameraFacing = localStorage.getItem("cameraFacing");	
        localStorage.setItem( "doExchangeCamera", 0);

        let video = document.createElement('video');
        // let configuration = { facing: "environment", };
        let configuration = { facing: currentCameraFacing };
        let texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.flipY = false;
        // texture.format = THREE.RGBFormat; // THREE.RGBAFormat
        texture.format = THREE.RGBAFormat; // THREE.RGBAFormat

        //20221207-thonsha-add-start
        self.cameraTexture = texture;
        //20221207-thonsha-add-end

        let rendererSize = new THREE.Vector2();
        self.vrScene.renderer.getSize( rendererSize );
        

        if ( navigator.mediaDevices  ) {

            let videoSuccess = function(stream){
                console.log("VRFunc.js: _startWebCam: _videoSuccess: stream=", stream );

                window.videoStream = stream;
                // window.stopVideoStream = function(){
                // 	var track = stream.getTracks()[0];  // if only one media track
                // 	track.stop();
                // }

                video.srcObject = stream;
                let readyToPlay = true;
                video.playsInline = true;
                video.onloadedmetadata = function() {
                    function tick_video(){
                        if (video.videoWidth > 200 || video.videoHeight > 200){
                            console.log("VRFunc.js: tick_video play video[w, h]=", video.videoWidth, video.videoHeight );
                            //// 將video 物件記錄下來，在後面等 renderer 開始工作後再啟動
                            self.video  = video;
                            // video.play();

                            //////// set the div size depend on video
                            let videoWidth, videoHeight;
                            let vrDiv = document.getElementById("vrDiv");
                            let w, h;
                            if ( rendererSize.x/rendererSize.y > video.videoWidth/video.videoHeight ){
                                // videoWidth  = Math.round(rendererSize.y -0) * video.videoWidth/video.videoHeight ;
                                // videoHeight = Math.round(rendererSize.y -0);
                                
                                w = window.innerWidth  ;
                                h = (window.innerWidth/video.videoWidth)* video.videoHeight;

                                console.log(" 1 VRFunc.js: set div size = ", innerWidth, innerHeight, w ,h, videoWidth, videoHeight );
                            }else{
                                // videoWidth  = Math.round( rendererSize.x );
                                // videoHeight = Math.round( rendererSize.x * video.videoHeight/video.videoWidth );
                                
                                w = (window.innerHeight/video.videoHeight) * video.videoWidth ;
                                h = window.innerHeight;
                                
                                console.log(" 2 VRFunc.js: set div size = ", innerWidth, innerHeight, w ,h, videoWidth, videoHeight );
                            }
                            //// fill height or widht, left some area blank
                            // vrDiv.style.width  = videoWidth + "px" ;    //  
                            // vrDiv.style.height = videoHeight + "px" ;//
                            
                            // // full fill, left nothing blank
                            // vrDiv.style.width  = w + "px" ;
                            // vrDiv.style.height = h + "px" ;
                            // //// align the div and body
                            // vrDiv.style.left = ( innerWidth - w )/2 + "px" ;
                            // vrDiv.style.top  = ( innerHeight - h )/2 + "px" ;

                            //// 原本是「改動 div 」現在換「改動 canvas 」
                            self.GLRenderer.setSize( w , h );
                            self.vrScene.canvas.style.left = ( innerWidth - w )/2 + "px" ;
                            self.vrScene.canvas.style.top  = ( innerHeight - h )/2 + "px" ;

                            self.vrScene.resize(); ////// it must call after renderer resize

                            ///// 這邊發現，畫布的精細度可以依照下列方式調製整，讓手機上解析度提高                            
                            if (Browser){
                                let dw, dh;
                                if ( Browser.desktop == true ){
                                    //// 電腦端，調整概念為「短邊一定要超過 1280 、長邊不超過 2560 」，由於目前 新版 webXR 設定 此 iframe 高度只有 600 所以這邊必定要觸發
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
                                    //// 手機端，調整概念為「無條件補滿 720 」
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

                            ////// setup the camera for 2D scene( 20200314 useless )
                            // let camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -10, 20000);
                            //// 20201110 fei: 設定相機跟背景的時候直接使用『實體相機畫面尺寸』作為設定，手機端基本是[480, 640] 電腦端基本是[640, 480]
                            videoWidth = texture.image.videoWidth,  videoHeight = texture.image.videoHeight;

                            let camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -100, 20000);
                            // let camera2D = new THREE.OrthographicCamera( -videoWidth/2, videoWidth/2, -videoHeight/2, videoHeight/2, -10, 20000);

                            self.camera2D = camera2D;


                            //// 重設 3D 場景相機
                            let camera3D = new THREE.PerspectiveCamera(  60, w/h, 0.3 ,  10000 );
                            self.camera3D = camera3D;

                            //// 設定 enitity 下的「預設相機」為新創建的相機
                            let aCamera = document.getElementById('aCamera');
                            aCamera.setObject3D( 'camera', camera3D );

                            let cameraData = {
                                aspect: w/h,
                                near: 0.3,
                                far: 10000,
                                fov: 60,
                            }

                            aCamera.setAttribute('camera' , cameraData );

                            //// 原本使用「把相機新增到容器下」、「指定相機」、「移除舊相機」
                            //// 但此方式還是會在 getObject3D('camera') 時候取得 舊相機。

                            // self.vrScene.camera.parent.add( camera3D  );
                            aCamera.components['camera'].camera = camera3D;
                            // self.vrScene.camera.parent.remove( self.vrScene.camera );

                            self.vrScene.camera = camera3D;

                            let rotation = new THREE.Vector3();
                            rotation.multiply( new THREE.Vector3(-1,-1,0) ).add( new THREE.Vector3(0, 180, 0) );

                            aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
                            aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;

                            /////////////////////////////////////////////////////////

                            let oCamera = document.getElementById('oCamera');							
                            let oCamera3D = new THREE.PerspectiveCamera(  60, w/h, 0.3 ,  10000 );

                            let originOCameraPosition = oCamera.getObject3D('camera').position.clone();
                            oCamera3D.position.copy( originOCameraPosition );

                            self.oCamera3D = oCamera3D;
                            oCamera.setObject3D( 'camera', oCamera3D );
                            oCamera.setAttribute('camera' , cameraData );

                            // oCamera.object3D.add( oCamera3D );
                            // oCamera.object3D.remove( oCamera.object3D.children[0] )
                            oCamera.components['camera'].camera = oCamera3D;
                            oCamera.components['orbit-controls'].controls.object = oCamera3D;

                            if ( parent.selectedProject ){
                                if ( parent.selectedProject.viewMode == 'VR' ){
                                    self.setViewMode( 'vR' );
                                }else if (parent.selectedProject.viewMode == 'model'){
                                    self.setViewMode( 'model' );
                                }else{
                                    self.setViewMode( 'VR' );
                                }
                            }else{
                                self.setViewMode( 'VR' );
                            }


                            ////// setup the camera for background video
                            let videoCamera = new THREE.OrthographicCamera( -videoWidth/2, videoWidth/2, -videoHeight/2, videoHeight/2, -10, 20000);
                            self.videoCamera = videoCamera;
                            
                            ////// setup videoPlane
                            let videoPlane = new THREE.Mesh(
                                // new THREE.PlaneBufferGeometry(640, 480),
                                // new THREE.PlaneBufferGeometry( document.documentElement.clientWidth , document.documentElement.clientHeight ),
                                // new THREE.PlaneBufferGeometry( videoWidth , videoHeight ),
                                new THREE.PlaneGeometry( videoWidth , videoHeight ),	
                                new THREE.MeshBasicMaterial( { map:texture, side: THREE.DoubleSide } ) ,
                            );
                            // videoPlane.material.depthTest = false;
                            // videoPlane.material.depthWrite = false;
                            videoPlane.position.set(0, 0, -1 );
                            self.videoScene.add( videoPlane );

                            //// 紀錄讓後續切換相機時候使用
                            self.videoPlane = videoPlane;
                            
                            if ( callback ) { callback( true ); }

                        }else{
                            console.log("tick_video else video[w, h]=", video.videoWidth, video.videoHeight );
                            setTimeout(tick_video, 100);
                        }
                    }
                    if ( self.videoCamera ){
                        console.log("VRFunc.js: _startWebCam: videoCamera exist, donothing ");
                    }else{
                        console.log("VRFunc.js: _startWebCam: videoCamera not exist, start video ");
                        tick_video();
                    }
                    
                }
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
                    // console.log("VRFunc.js: devices=", devices[i] );
                }
                if (useDeviceID){ // PC, android chrome/FireFox, use the specific id by labels.
                    console.log("VRFunc.js: useDeviceID true, cameraID=", cameraID );
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
                        console.log("VRFunc.js: configuration.facing do exist: set facing = ", facing );
                        video_constraints = {
                            video: {
                                width: { min: 320, ideal: 640, max: 1280 },
                                height: { min: 240, ideal: 480, max: 800 }, 
                                frameRate: { min:15, ideal: 30, max: 60 },
                                facingMode: facing
                            }
                        };
                    }else{
                        console.log("api.js: configuration.facing dosent exist: set facing = environment" );
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


                ///////// start simply //////////////
                navigator.mediaDevices.getUserMedia( video_constraints ).then(videoSuccess, onError); // successCallback
            
            });
            
        } else {
            if (navigator.getUserMedia) {
                navigator.getUserMedia(hdConstraints, success, onError);
            } else {
                onError('navigator.getUserMedia is not supported on your browser');
            }
        }
        
    }


    ///// 原本「切換鏡頭」的功能很蠢，要重新載入網頁，改為只要重新啟動相機即可
    switchCamera( cc ){

        let self = this ;

        //// 預設為「後鏡頭」
        let configuration = cc ? cc : { facing: 'environment' };

        //// 先確認當前相機是哪個面向。
        let facing = localStorage.getItem("cameraFacing");
        if ( facing == null ){
            localStorage.setItem("cameraFacing", 'environment' );
        } else if ( facing == 'environment' ){
            configuration.facing = 'user';
            localStorage.setItem("cameraFacing", 'user' );
        } else if ( facing == 'user' ){
            configuration.facing = 'environment';
            localStorage.setItem("cameraFacing", 'environment' );
        }

        self.video.srcObject.getTracks().forEach( e => {
            e.stop();
        }) ;
        

        let videoSuccess = function(stream){
            console.log("three.js: _startWebCam: videoSuccess: stream=", stream );

            window.videoStream = stream;

            if ( self.videoPlane.material.map.image ){
                let video = self.videoPlane.material.map.image;
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
}

export default VRController