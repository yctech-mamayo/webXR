// import { UrlExists, checkDefaultImage } from "./vrUtility.js";
// import { editorVerionControllSky, loadSky } from "./vrObjectModules/SkyModule.js";
// import { loadAudio } from "./vrObjectModules/AudioModule.js";
// import { loadGLTFModel } from "./vrObjectModules/GLTFModelModule.js";
// import { loadTexture } from "./vrObjectModules/ImageModule.js"; 
// import { loadLight } from "./vrObjectModules/LightModule.js"
// import { loadText } from "./vrObjectModules/TextModule.js";
// import { loadQuiz, nextQuestion } from "./vrObjectModules/QuizModule.js"
// import { loadVideo } from "./vrObjectModules/VideoModule.js"
// import { CSS3DRenderer, CSS3DObject } from './THREEjsAddons/CSS3DRenderer.js';

//// 設定上專門控制「AR 場景物件 載入」
import ARWrapper from './ARWrapper.js'
import { verionControl as VC } from "./MakarWebXRVersionControl.js";


class SceneController {


    /*
        
        mixController: {
            AR: arController , 
            VR: vrController , 
            XR: xrController ,
        }

        arController : 目的是控制 AR 場景相關內容，因應 AR 比較特別，每個場景要生成對應虛擬辨識圖基底物件

        VR , XR 預設都是「清除場景內容」在「載入場景物件」

    */ 
    
    constructor( scenesData , projData , mixController,  )
    {
        this.scenesData = scenesData
        this.projData = projData
        this.arController = arController
        if ( mixController.AR  ){
            this.arController = mixController.AR ;
            this.arWrapper = new ARWrapper( scenesData, projData, arController  );

        }
        if ( mixController.VR  ){
            this.vrController = mixController.VR ;
        }
        if ( mixController.XR  ){
            this.xrController = mixController.XR ;
        }

        

    }

    //// 確認網址是否可用
    UrlExistsFetch = async function( url ){

        let ret = await fetch(url, {method: 'HEAD'})

        console.log('_ARController: _UrlExistsFetch: ret ', ret );
        if ( ret.status ){
            return ret.status == '200';
        }else{
            return false ;
        }

    };

    //// 檢查「圖片物件」的資料
    dealImageUrl ( scene_obj ){
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

    getDefaultImageUrl( imageStr ){

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

    getUserRes_onlineRes( scene_obj ){

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


    loadAssets ( index ) {

        let self = this;

        let assets = document.createElement("a-assets");
        assets.setAttribute('id', "makarAssets" );
        assets.setAttribute('timeout', "1000" );
        self.arfScene.appendChild(assets);
        // self.makarObjects.push( assets );
    };

    

    //// 取得 專案 2D 解析度
    getResolutionIndex ( projIndex ){

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

    get2DScaleRatioByProjIndex ( projIndex ){

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


    /*
        依照「不同場景」載入「對應場景內容」
        這邊預計只依照「場景編號」來「載入對應場景」
        輸入參數：
            sceneIndex: 場景編號
            scene3DRoot: 3D 空間 的母物件，可能是 scene 本體
            scene2DRoot: 2D 空間 的母物件，可能是 scene 本體

        流程：
        0. 先判斷要載入的場景類型 目前支援「 AR 」「 VR 」「 XR 」
        1. 依照類型進行前置處理
        2. 載入場景物件

    */  

    loadMakarScene( sceneIndex , scene3DRoot , scene2DRoot ){

        console.log(' _loadMakarScene_: ' , sceneIndex , scene3DRoot , scene2DRoot );

        let self = this;

        let pObjsAll = [];

        //// 取得場景 類型
        //// 在呼叫各自的載入場景功能
        let sceneType = VC.getSceneType( self.scenesData , sceneIndex )
        switch( sceneType ){

            case 'ar' : 
                let pARObjsAll = self.arWrapper.loadMakarARScene( sceneIndex , scene3DRoot , scene2DRoot )

                pObjsAll = pObjsAll.concat( pARObjsAll );
            break;

            case 'vr' : 

            break;

            case 'ar_slam' : 

            break;

            default:
                console.log(' _loadMakarScene_: type error ' , sceneIndex , sceneType );


        }

        
        return pObjsAll;


    }


    //// 控制 「當前場景顯示」與「其他場景隱藏」，包含「模組相關」、「3D場景」「2D場景」
    activeAndClearScene(){

    }

    //// 「quiz」「括括卡」「集點卡」等模組額外設立


    //// 模型物件 材質控管 取得 材質編號
    checkGLTFMaterialIndex( target , material ){

    }


    //// 模型物件調整材質
    setGLTFMaterial( modelEntity , obj ){

    }

    //// 載入物件相關功能，預計獨立出來。
    //// 包含「圖片」「文字」「影片」「模型」「聲音」等等

    




}
export default SceneController

