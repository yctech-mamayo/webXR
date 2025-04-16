import { UrlExists } from "../vrUtility.js"
import { setTransform } from "./setTransform.js";
import { loadGLTFModel } from "./GLTFModelModule.js"
import { verionControl as VC } from "../MakarWebXRVersionControl.js";

export function loadVideo( obj, position, rotation, scale ) {	
    let self = this
    let pVideo = new Promise( function( videoResolve ){

        UrlExists( obj.res_url , function( retStatus ){
            //// 先檢查「影片物件網址是否存在」，否的話，載入「問號模型物件」
            if ( retStatus == true ){
                let assets = document.getElementById("makarAssets");

                var mp4Video, mp4Texture ;
        
                mp4Video = document.createElement('video');
                mp4Video.src = obj.res_url; // url, "Data/makarVRDemo.mp4"
                mp4Video.playsInline = true;
                mp4Video.autoplay = true;
                //thonsha add
                mp4Video.loop = true;
                //thonsha add           

                mp4Video.setAttribute('crossorigin', 'anonymous');
                mp4Video.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount );

                assets.appendChild(mp4Video); ////// add video into a-assets

                //// 只是為了方便safari debug
                mp4Video["name4debug"] = obj.generalAttr.obj_name; 

                mp4Video.setAttribute("preload", "auto");

                
                //// 開發需要，先將所有影片禁音
                // mp4Video.muted = true;
                
                if (window.Browser){
                    if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location )  ){
                    // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                        mp4Video.muted = true;
                    }
                    
                    if (window.Browser.mobile == true){
                        mp4Video.muted = true;
                        // mp4Video.currentTime = 0.1
                        mp4Video.play()
                    }
                }
                
                // mp4Texture = new THREE.VideoTexture( mp4Video );
                // mp4Texture.minFilter = THREE.LinearFilter;
                // mp4Texture.magFilter = THREE.LinearFilter;
                // //// mp4Texture.flipY = false;
                // mp4Texture.format = THREE.RGBFormat;

                mp4Video.onloadedmetadata = function() {
                    var videoWidth , videoHeight;
                    if (mp4Video.videoWidth >= mp4Video.videoHeight){
                        videoWidth = 1;
                        videoHeight = 1*mp4Video.videoHeight/mp4Video.videoWidth;
                    }else{
                        videoWidth = 1*mp4Video.videoWidth/mp4Video.videoHeight;
                        videoHeight = 1;
                    }

                    // console.log("VRFunc.js: video WH=", mp4Video.videoWidth , mp4Video.videoHeight);
                    let videoPlane = document.createElement("a-video");
                
                    //[start-20240408-renhaohsu-modify]//
                    let chromaKey, slope, threshold, transparentBehav;                    
                    //20191108-start-thonsha-add
                    let transparentVideo = false
                    if(makarUserData.scenesData.scenes[self.sceneIndex].behav && Array.isArray(makarUserData.scenesData.scenes[self.sceneIndex].behav)){

                        transparentBehav = makarUserData.scenesData.scenes[self.sceneIndex].behav.find(b => b.obj_id == obj.generalAttr.obj_id && b.behav_type == "Transparent")
                        if(transparentBehav){
                            console.log("%c VideoModule.js _loadVideo: transparentBehav=", 'color:BlanchedAlmond;', transparentBehav)
                            transparentVideo = true;
                            [chromaKey, slope, threshold] = [transparentBehav.color, transparentBehav.slope, transparentBehav.threshold]
                        }
                    }
                    //[end-20240408-renhaohsu-modify]//

                    if (transparentVideo && transparentBehav){
                        let rgba = chromaKey.split(",");
                        var color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

                        if (transparentBehav.mode == 'RGB' || !transparentBehav.mode){
                            videoPlane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
                        }
                        else if (transparentBehav.mode == 'HSV'){
                            // let HSV = transparentBehav.color.split(",");
                            // let keyH = parseFloat(HSV[0]);
                            // let keyS = parseFloat(HSV[1]);
                            // let keyV = parseFloat(HSV[2]);

                            //[start-20240408-renhaohsu-modify]//
                            //// rgb2hsv source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript/54070620#54070620
                            function rgb2hsv(r,g,b) {
                                let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
                                let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
                                return [60*(h<0?h+6:h), v&&c/v, v];
                            }
                            
                            let _hsv = rgb2hsv( parseFloat(rgba[0]), parseFloat(rgba[1]), parseFloat(rgba[2]) )
                            _hsv[0] /= 360;
                            console.log(`rgb: ${rgba} ,\n _hsv: (${ _hsv })`)
                            //[end-20240408-renhaohsu-modify]//

                            // console.log("VRFunc.js: video HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
                            // videoPlane.setAttribute( "material", "shader: HSVMatting; transparent: true; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+transparentBehav.hue+"; _deltaS:"+transparentBehav.saturation+"; _deltaV:"+transparentBehav.brightness+";" ); //// thonsha add shader
                            videoPlane.setAttribute( "material", "shader: HSVMatting; transparent: true; _keyingColorH:"+_hsv[0]+"; _keyingColorS:"+_hsv[1]+"; _keyingColorV:"+_hsv[2]+"; _deltaH:"+transparentBehav.hue+"; _deltaS:"+transparentBehav.saturation+"; _deltaV:"+transparentBehav.brightness+";" ); //// thonsha add shader
                        }
                        //20191126-end-thonsha-mod
                    }
                    else{
                        videoPlane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
                    }
                    //20191108-end-thonsha-add

                    if (obj.behav){
                        if (obj.behav.length==0 && transparentVideo){
                            videoPlane.setAttribute('class', "unclickable" ); //// fei add
                        }
                        else{
                            videoPlane.setAttribute('class', "clickable" );
                        }
                    }
                    //[start-20231229-renhaohsu-add]//
                    else if (obj.generalAttr.logic){
                        videoPlane.setAttribute('class', "clickable" ); 
                    }
                    //[end-20231229-renhaohsu-add]//
                    else{
                        videoPlane.setAttribute('class', "unclickable" ); //// fei add
                    }                    

                    videoPlane.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
                    videoPlane.setAttribute("src", "#"+obj.generalAttr.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount ); //  

                    videoPlane.mp4Video = mp4Video;
                    
                    // videoPlane.setAttribute("src", obj.res_url);

                    // position = new THREE.Vector3( 1.5 , 0.0 , 4.0 ); ////// set for test
                    // rotation = new THREE.Vector3( 0 , 0 , 0 ); ////// set for test
                    // scale.multiply( new THREE.Vector3(videoWidth, videoHeight, 1) ); ////// need calculate from elements paraemter.

                    //// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
                    let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
                    videoPlane.addEventListener("materialtextureloaded", function(evt){
                        console.log("VRFunc.js: _loadVideo: _materialtextureloaded: videoPlane = " , videoPlane.object3D , evt );
                        evt.detail.texture.anisotropy = maxAnisotropy;
                        evt.detail.texture.needsUpdate = true;
                    });

                    setTransform(videoPlane, position, rotation, scale);
                    videoPlane.addEventListener("loaded", function(evt){
                    
                        if (evt.target == evt.currentTarget){

                            // setTimeout(function(){
                            // 	videoPlane.setAttribute("cursor-listener", true ); //// fei add
                            // }, 500 );

                            // videoPlane.object3D.children[0].scale.multiply(new THREE.Vector3(videoWidth, videoHeight, 1));
                            videoPlane.object3D.children[0].scale.set(videoWidth , videoHeight, 1 );
                            
                            //[start-20230809-howardhsu-modify]//
                            let r = new THREE.Vector3();
                            r.set(0, -1 * Math.PI, 0);
                            videoPlane.object3D.children[0].rotation.setFromVector3(r);
                            //[end-20230809-howardhsu-modify]//

                            // var r = videoPlane.object3D.children[0].rotation.toVector3();
                            // r.add( new THREE.Vector3(0,Math.PI, 0) );
                            // videoPlane.object3D.children[0].rotation.setFromVector3(r);
                            videoPlane.object3D["makarObject"] = true; 
                            videoPlane.object3D["makarType"] = 'video'; 
            
                            //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                            const tempBehav = {
                                behav_type : "videoTogglePlayPause",
                                // delay : false,
                                // is_front : true,
                                obj_id : obj.generalAttr.obj_id,
                                // toward_id : "7e30d242-3485-4f2f-8e61-e55ff9723e44",
                                // trigger_obj_id : "d60e0385-9037-41dd-a899-d1479293b1db",
                                // trigger_type : "Click"
                            }

                            if ( obj.behav ){
                                videoPlane.object3D["behav"] = obj.behav ;
                                videoPlane.object3D["behav"].push(tempBehav)

                                //// 載入時候建制「群組物件資料」「注視事件」
                                self.setObjectBehavAll( obj );
                            } else {
                                //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                                videoPlane.object3D["behav"] = [ tempBehav ]
                            }

                            //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                            videoPlane.setAttribute('class', "clickable" )


                            if(obj.behav_reference){
                                videoPlane.object3D["behav_reference"] = obj.behav_reference ;
                            }

                            videoResolve( videoPlane );
                        }
                    });
                    
                    self.makarObjects.push( videoPlane );

                    //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                    if ( obj.generalAttr.active == false ){
                        videoPlane.setAttribute("visible", false);
                        videoPlane.setAttribute('class', "unclickable" );
                    }

                    //20191227-start-thonsha-mod
                    // let videoBehavRef = false;
                    // if(obj.behav_reference){
                    //     for(let i=0; i<obj.behav_reference.length;i++){
                    //         // if (obj.behav_reference[i].behav_name == 'Media'){
                    //         if (obj.behav_reference[i].behav_type == 'Display'){
                    //             videoBehavRef = true;
                    //             videoPlane.setAttribute("visible", false);
                    //             videoPlane.setAttribute('class', "unclickable" );
                    //             break;
                    //         }
                    //     }
                        
                    // }
                    //20191227-end-thonsha-mod

                    //20191029-start-thonhsa-add
                    if(obj.generalAttr.obj_parent_id){
                        // videoPlane.setAttribute("visible", false);
                        // videoPlane.setAttribute('class', "unclickable" );
                        mp4Video.autoplay = false;
                        let timeoutID = setInterval( function () {
                            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                            if (parent){
                                if(parent.object3D.children.length > 0){
                                    parent.appendChild(videoPlane);
                                    window.clearInterval(timeoutID);
                                    //// deal the behavior or not.
                                    parent.addEventListener("child-attached", function(el){
                                        console.log("VRFunc.js: VRController: _loadVideo,: parent child-attached, el=", el );

                                        //// 假如有掛載「邏輯功能」，需要禁止一般事件操控，在這邊無條件暫停影片
                                        if ( obj.generalAttr.logic ){

                                            videoPlane.blockly = obj.generalAttr.logic;
                                            mp4Video.pause();
                                            mp4Video.currentTime = 0;

                                        } else {

                                            let parentVisible = true;
                                            videoPlane.object3D.traverseAncestors( function(parent) {
                                                if (parent.type != "Scene"){
                                                    // console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: not Scene parent=", parent );
                                                    if (parent.visible == false){
                                                        parentVisible = false;
                                                    }
                                                } else {
                                                    // if (parentVisible == true && videoPlane.object3D.visible == true && videoBehavRef == false ){
                                                    if (parentVisible == true && videoPlane.object3D.visible == true ){
                                                        console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: all parent visible true=", videoPlane.object3D );
                                                        
                                                        mp4Video.autoplay = true;
                                                        //[start-20240611-renhaohsu-mod]//
                                                        //// seems like if a video object is a child, should call play() 
                                                        mp4Video.play();

                                                        //// set video attr according to the obj in makar with autoplay, volume, loop
                                                        checkVideoTypeAttr(obj, mp4Video)
                                                        //[end-20240611-renhaohsu-mod]//                     
                                                    
                                                        //// 提醒用戶點擊開啟聲音
                                                        if (window.Browser){
                                                            if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                                dealVideoMuted( mp4Video, true );
                                                            } else if (window.Browser.mobile == true){
                                                                //// safari 以外的手機瀏覽器
                                                                dealVideoMuted( mp4Video, false );
                                                            }
                                                        }

                                                    }else{
                                                        console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: not all parent visible true=", parentVisible, videoPlane.object3D.visible );
                                                        //// rootObject.visible = false; 
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

                        if ( obj.generalAttr.logic ){
                            videoPlane.blockly = obj.generalAttr.logic;
                            mp4Video.pause();
                            mp4Video.currentTime = 0;
                        } else {
                            mp4Video.autoplay = true;
                            mp4Video.play();//// this is not necessary 

                            //[start-20230815-howardhsu-add]//
                            //// set video attr according to the obj in makar with autoplay, volume, loop
                            checkVideoTypeAttr(obj, mp4Video)
                            //[end-20230815-howardhsu-add]//                     
                            
                            //// 提醒用戶點擊開啟聲音
                            if (window.Browser){
                                if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                    dealVideoMuted( mp4Video, true );
                                } else if (window.Browser.mobile == true){
                                    //// safari 以外的手機瀏覽器
                                    dealVideoMuted( mp4Video, false );
                                }
                            }
                            
                        }
                        
                        self.vrScene.appendChild(videoPlane);
                    }
                    //20191029-end-thonhsa-add
                

                    // }, 1 );
                    // self.vrScene.appendChild(videoPlane);

                    // console.log("VRFunc.js: VRController: loadVideo, videoPlane=", videoPlane );
                }


            }else{

                console.log("VRFunc.js: _loadVideo , obj url not exist ", obj );
                
                obj.main_type = 'model';
                obj.sub_type = 'glb';
                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
                
                //[start-20230726-howardhsu-modify]//                               
                loadGLTFModel( obj , position, rotation, scale , self.cubeTex )
                //[end-20230726-howardhsu-modify]//

                videoResolve( 1 );

            }
        });
        

    });


    return pVideo;
    
}

//// set video attr according to the obj in makar with autoplay, volume, loop
//// 自動播放、音量、循環
function checkVideoTypeAttr(obj, mp4Video, videoBehavRef=false){
    // console.log("checkVideoTypeAttr obj=", obj)

    //[start-20230807-howardhsu-add]//
    //// 這要去確認app的行為
    if ( obj.generalAttr.active == false || videoBehavRef){
        mp4Video.autoplay = false
        mp4Video.pause();
        mp4Video.currentTime = 0;
    }
    //[end-20230807-howardhsu-add]//       
        
    //[start-20230811-howardhsu-add]//
    else if(obj.typeAttr){       
        //// 20240516 沒看到 is_play 這個key    
        // if(obj.typeAttr.is_play != undefined){ 
        //     mp4Video.autoplay = obj.typeAttr.is_play;
        //     if( obj.typeAttr.is_play == false ){                                        
        //         mp4Video.pause();
        //         mp4Video.currentTime = 0;
        //     }
        // }    
        if(obj.typeAttr.is_loop != undefined){ 
            mp4Video.loop = obj.typeAttr.is_loop;

            //// 多影片在手機chrome上不會loop 多影片的情況暫時以靜音來讓它繼續播放
            if (window.Browser){
                if (window.Browser.mobile == true && window.Browser.name != "safari" ){
                    //// safari 以外的手機瀏覽器
                    if(obj.typeAttr.is_loop){
                        mp4Video.loop = false; 
                        // console.log("影片還沒結束", obj.generalAttr.obj_name)
                        mp4Video.addEventListener('ended', function() { 
                            // console.log("影片結束", mp4Video.name4debug)
                            //// 20240617 renhaohsu 測試chrome看似是每次重播時都要先靜音才能播      
                            if( document.getElementsByTagName('a-video').length + window.vrController.makarObjects2D.filter( o=>o.makarType == "video2D").length == 1 ){
                                mp4Video.muted = false
                                mp4Video.currentTime=0.1;
                                mp4Video.play(); 
                            } else {
                                // console.log("你播ㄚㄚㄚㄚ")
                                mp4Video.muted = true
                                mp4Video.currentTime=0.1;
                                mp4Video.play()
                                UnMutedAndPlayAllVisibleVideo()
                            }
                        }, false);
                    }
                }
            }

        }    
        if(obj.typeAttr.volume  != undefined){ 
            mp4Video.volume = obj.typeAttr.volume;
            // if(obj.typeAttr.volume == 0){
            //     // console.log("音量是0會被瀏覽器自動暫停?!")  //// 20240611 test by renhaohsu
            //     mp4Video.play()
            // }
        }
    }
    //[end-20230811-howardhsu-add]//             
}


//// 注意，當前影片、聲音是共用「確認面板」
//// ios safari, mobile browser(例如chrome) 可能呼叫到這
//// 處理影片物件是否播放聲音
function dealVideoMuted( video, isSafari=false ){      
    console.log("dealVideoMuted")  

    //// html確認面板"允許聲音播放"
    let clickToPlayAudio = document.getElementById("clickToPlayAudio");

    clickToPlayAudio.onclick = function(){
        clickToPlayAudio.setAttribute("didUserClick", true)
        clickToPlayAudio.style.display = "none";
        clickToPlayAudio.onclick = null;
        window.allowAudioClicked = true;
        
        if( isSafari ){
            //// safari: 讓全部影片靜音但播放，然後挑一個影片發出聲音
            mute3dVideos(true)
            mute2dVideos(true)
            UnMutedAndPlayAllVisibleVideo();
        } else {
            //// chrome(或其他): 需要user互動後才能發出聲音
            console.log("isSafari=", isSafari)
            unmute3dVideos(true)
            unmute2dVideos(true)
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
            UnMutedAndPlayAllVisibleVideo();
        // } else {
        //  ////   20240618 renhaohsu觀察到在chrome放5個影片物件 會出現有些影片不播放的情形 但他們明明走同樣的code...
        //     console.log("isSafari=", isSafari)
        //     unmute3dVideos(true, true)
        //     unmute2dVideos(true, true)
        // }
    }
}

//// 為了 iOS 無法同時播放「超過一個有聲音的影片」，在場景中尋找是否有「當前可見的影片」，只能有一隻切換為切換為「有聲音」
//// 流程分兩種： 1. 點擊觸發「顯示任意物件」 2. 點擊觸發「關閉任意物件」 
//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
////
export function UnMutedAndPlayAllVisibleVideo( targetVideo_in ) {
    //// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
    let targetVideo;
    let targetVideo2D;
    if (targetVideo_in){
        if ( targetVideo_in.localName == 'a-video' ){
            //// 3D影片物件
            targetVideo = targetVideo_in;
        } else if ( targetVideo_in.makarType == "video2D" ){
            //// 2D影片物件
            targetVideo2D = targetVideo_in;
        }
    }        

    //// 取得「所有影片」  3D
    let aVideos = document.getElementsByTagName('a-video');
    console.log("VRFunc.js: _UnMutedAndPlayAllVideo: aVideos.length=", aVideos.length );

    //// 取得「所有影片」  2D
    let videos2D = window.vrController.makarObjects2D

    //// 靜音所有2D影片物件
    // mute2dVideos()

    if ( targetVideo ){
        //// 假如有「要顯示的影片」 3D影片物件
        for ( let i = 0; i < aVideos.length; i++ ){

            let videoPlane = aVideos[i];
            let mp4Video = aVideos[i].mp4Video;

            //// 開啟此影片聲音
            if ( videoPlane == targetVideo ){

                targetVideo.mp4Video.muted = false;
                targetVideo.mp4Video.autoplay = true;
                targetVideo.mp4Video.play();
                self.safariUnMutedVideo = targetVideo;

            }else{

                let parentVisible = true;
                videoPlane.object3D.traverseAncestors( function(parent) {
                    if (parent.type != "Scene"){
                        // console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
                        if (parent.visible == false){
                            parentVisible = false;
                        }
                    } else {

                        console.log("VRFunc.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );

                        //// 這邊選定影片改為「靜音」，不論是否是「邏輯操控」
                        if (parentVisible == true && videoPlane.object3D.visible == true && mp4Video.volume!=0 ){
                            
                            mp4Video.muted = true;
                            mp4Video.autoplay = true;
                            mp4Video.play();

                        }

                        //// 我擔心「先後順序會影響」，所以多次將「此影片」執行「切換為非靜音」
                        targetVideo.mp4Video.muted = false;
                        targetVideo.mp4Video.autoplay = true;
                        targetVideo.mp4Video.play();

                    }
                });

            }

        }

    } else if ( !targetVideo && targetVideo2D ){
        //// 傳入的是2D影片物件 
        
        //// 把3D影片 可見的 全部靜音
        mute3dVideos()

        //// 檢查該2D影片 若可見就解除靜音
        let parentVisible2D = true;
        targetVideo2D.traverseAncestors( function(parent) {
            if (parent.type != "Scene"){
                // console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
                if (parent.visible == false){
                    parentVisible2D = false;
                }
            } else {
                //// 假如「已經找到場景本體」、「母體都可見」、「本體也可見」 ，解除靜音
                if (parentVisible2D == true && targetVideo2D.visible == true ){
                    //// 錯誤處理  (理論上影片2D物件 都該有以下這些)
                    if( targetVideo2D.makarType != "targetVideo2D" ){ return; }
                    if( targetVideo2D.children.length == 0 ){ return; }
                    if( !targetVideo2D.children[0].material ){ return; }
                    if( !targetVideo2D.children[0].material.map ){ return; }
                    if( !targetVideo2D.children[0].material.map.image ){ return; }

                    if( targetVideo2D.children[0].material.map.image.tagName == "VIDEO"){
                        const video = targetVideo2D.children[0].material.map.image
                        if(video && video.volume!=0){
                            video.muted = false
                            video.autoplay = true;
                            self.safariUnMutedVideo = targetVideo2D;
                        }
                    }
                }
            }
        });

    } else if ( !targetVideo && !targetVideo2D ){
        //// 假如沒有「傳入影片」，則挑選一隻「改為非靜音」，其他隻都保持靜音
        //// 挑選方式尚未決定
        // console.log("應該是進這裡了才對")

        let setVideoUnMuted = false;

        for ( let i = 0; i < aVideos.length; i++ ){

            let videoPlane = aVideos[i];
            let mp4Video = aVideos[i].mp4Video;

            //// 只挑選正在播放的影片
            const isVideoPlaying = (material) => !!(material.currentTime >= 0 && !material.paused && !material.ended && material.readyState > 2);
            if( !isVideoPlaying(mp4Video) ){ 
                console.log("mp4Video", isVideoPlaying(mp4Video))
                continue;
            }

            let parentVisible = true;
            videoPlane.object3D.traverseAncestors( function(parent) {
                if (parent.type != "Scene"){
                    // console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
                    if (parent.visible == false){
                        parentVisible = false;
                    }
                } else {
                    //// 假如「已經找到場景本體」、「母體都可見」、「本體也可見」、「尚未設定一隻影片有聲音」，則設定「此影片」為「有聲音」，同時紀錄「已經設定過」

                    console.log("VRFunc.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );

                    //// 這邊注意，要撇除「邏輯控制的影片」
                    if (parentVisible == true && videoPlane.object3D.visible == true && !videoPlane.blockly && mp4Video.volume!=0 ){
                        
                        if ( setVideoUnMuted == false ){
                            console.log("VRFunc.js: _UnMutedAndPlayAllVideo: all parent visible true , _setVideoUnMuted false ", videoPlane.object3D.name4debug );
                        
                            mp4Video.muted = false;
                            mp4Video.autoplay = true;

                            //// 正在播放且沒有被user按暫停
                            const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

                            //// 跳轉場景時的影片可能還沒播 但可以播放 (不是被user暫停的)
                            const isVideoReadyToPlay = (video) => !!(video.currentTime >= 0 && !video.paused && !video.ended && video.readyState >= 1);

                            if(mp4Video && (isVideoPlaying(mp4Video) || isVideoReadyToPlay(mp4Video)) && mp4Video.volume!=0 ){
                                mp4Video.play();
                            }
                            
                            setVideoUnMuted = true;
                            self.safariUnMutedVideo = videoPlane;
                        
                        } else {
                            console.log("VRFunc.js: _UnMutedAndPlayAllVideo: all parent visible true, _setVideoUnMuted true", videoPlane.object3D );
                            if(mp4Video.volume!=0){
                                mp4Video.muted = true;
                                mp4Video.autoplay = true;

                                //// 理論上此影片已正在播放 只是為了保險多讓呼叫一下play
                                const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                                if(isVideoPlaying(mp4Video)){
                                    mp4Video.play();
                                }
                            }
                        }
                    }

                }
            });	

        }

        //// 如果沒有3D影片物件 找1個 "正在播放的2D影片" 解除靜音
        if(aVideos.length == 0 || setVideoUnMuted==false){
            // console.log("沒有3D影片物件或不合條件") 
            videos2D.forEach( video2d =>{
                let parentVisible2D = true;
                video2d.traverseAncestors( function(parent) {
                    if (parent.type != "Scene"){
                        // console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
                        if (parent.visible == false){
                            parentVisible2D = false;
                        }
                    } else {
                        //// 假如「已經找到場景本體」、「母體都可見」、「本體也可見」、「尚未設定一隻影片有聲音」，則設定「此影片」為「有聲音」，同時紀錄「已經設定過」
                        if (parentVisible2D == true && video2d.visible == true && setVideoUnMuted == false ){
                            //// 雖然不應該出現 makarType 已是 video2D 的影片2D物件卻沒有以下這些，但還是寫一下錯誤處理
                            if( video2d.makarType != "video2D" ){ return; }
                            if( video2d.children.length == 0 ){ return; }
                            if( !video2d.children[0].material ){ return; }
                            if( !video2d.children[0].material.map ){ return; }
                            if( !video2d.children[0].material.map.image ){ return; }

                            if( video2d.children[0].material.map.image.tagName == "VIDEO"){
                                const video = video2d.children[0].material.map.image

                                //// 正在播放且沒有被user按暫停
                                const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

                                //// 跳轉場景時的影片可能還沒播 但可以播放 (不是被user暫停的)
                                const isVideoReadyToPlay = (video) => !!(video.currentTime >= 0 && !video.paused && !video.ended && video.readyState >= 1);

                                if(video && (isVideoPlaying(video) || isVideoReadyToPlay(video)) && video.volume!=0 ){
                                    // console.log("播一下聲音阿 2d", video.name4debug );
                                    video.muted = false
                                    video.autoplay = true;

                                    // const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                                    // if(!isVideoPlaying){
                                        video.play()
                                    // }
                            
                                    setVideoUnMuted = true;
                                    self.safariUnMutedVideo = video2d;
                                } else {
                                    video.muted = true
                                    video.autoplay = true;  
                                    // const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                                    // if(!isVideoPlaying){
                                        video.play()
                                    // }
                                }
                            }
                        }
                    }
                });
            })
        
        }

    }

}

//// for safari: 20240612 autoplay+muted失效, 先靜音全部、播放全部 再呼叫 UnMutedAndPlayAllVisibleVideo() 給它挑一個影片解除靜音
export function mute2dVideos(playVideo=false){
    //// 取得「所有影片」  2D
    let videos2D = window.vrController.makarObjects2D

    //// 靜音所有2D影片物件
    videos2D.forEach( video2d =>{
        //// 雖然不應該出現 makarType 已是 video2D 的影片2D物件卻沒有以下這些，但還是寫一下錯誤處理
        if( video2d.makarType != "video2D" ){ return; }
        if( video2d.children.length == 0 ){ return; }
        if( !video2d.children[0].material ){ return; }
        if( !video2d.children[0].material.map ){ return; }
        if( !video2d.children[0].material.map.image ){ return; }
        
        if( video2d.children[0].material.map.image.tagName == "VIDEO" ){
            const video = video2d.children[0].material.map.image
            if(video){
                // console.log("靜音2D影片", video)
                video.muted = true
                if(playVideo){
                    video.play()
                }
            }
        }
    })
}

//// 3D影片物件需要特地再全部呼叫一次play
export function mute3dVideos(playVideo=false){
    //// 取得「所有影片」  3D
    let aVideos = document.getElementsByTagName('a-video');

    //// 把3D影片 可見的 全部靜音
    Array.from(aVideos).forEach( videoPlane => {
        let mp4Video = videoPlane.mp4Video;

        let parentVisible = true;
        videoPlane.object3D.traverseAncestors( function(parent) {
            if (parent.type != "Scene"){
                if (parent.visible == false){
                    parentVisible = false;
                }
            } else {
                //// 這邊注意，要撇除「邏輯控制的影片」      20240611 v3.5要確認一下viewer是否還是如此
                if (parentVisible == true && videoPlane.object3D.visible == true && !videoPlane.blockly ){
                    mp4Video.muted = true;
                    if(playVideo){
                        console.log("拜託播阿", mp4Video.name4debug)
                        // mp4Video.currentTime = 0
                        mp4Video.play()
                        mp4Video.muted = false
                    }
                }
            }
        });	
    })
}


//// for safari: 20240612 autoplay+muted失效, 先靜音全部、播放全部 再呼叫 UnMutedAndPlayAllVisibleVideo() 給它挑一個影片解除靜音
export function unmute2dVideos(playVideo=false, playFromStart=false){
    //// 取得「所有影片」  2D
    let videos2D = window.vrController.makarObjects2D

    //// 靜音所有2D影片物件
    videos2D.forEach( video2d =>{
        //// 雖然不應該出現 makarType 已是 video2D 的影片2D物件卻沒有以下這些，但還是寫一下錯誤處理
        if( video2d.makarType != "video2D" ){ return; }
        if( video2d.children.length == 0 ){ return; }
        if( !video2d.children[0].material ){ return; }
        if( !video2d.children[0].material.map ){ return; }
        if( !video2d.children[0].material.map.image ){ return; }
        
        if( video2d.children[0].material.map.image.tagName == "VIDEO" ){
            const video = video2d.children[0].material.map.image
            if(video){
                let parentVisible = true;
                video2d.traverseAncestors( function(parent) {
                    if (parent.type != "Scene"){
                        if (parent.visible == false){
                            parentVisible = false;
                        }
                    } else {
                        //// 這邊注意，要撇除「邏輯控制的影片」      20240611 v3.5要確認一下viewer是否還是如此
                        // if (parentVisible == true && videoPlane.object3D.visible == true && !videoPlane.blockly ){
                        if (parentVisible == true && video2d.visible == true ){
                            console.log("解除靜音 2D影片", video.name4debug, video.currentTime)
                            if(playFromStart){
                                video.currentTime = 0.1
                            }
                            if(playVideo){
                                video.autoplay = true
                                video.play()
                            }
                            video.muted = false
                        }
                    }
                });	
            }
        }
    })
}

//// 3D影片物件需要特地再全部呼叫一次play
export function unmute3dVideos(playVideo=false, playFromStart=false){
    //// 取得「所有影片」  3D
    let aVideos = document.getElementsByTagName('a-video');

    //// 把3D影片 可見的 全部靜音
    Array.from(aVideos).forEach( videoPlane => {
        let mp4Video = videoPlane.mp4Video;

        let parentVisible = true;
        videoPlane.object3D.traverseAncestors( function(parent) {
            if (parent.type != "Scene"){
                if (parent.visible == false){
                    parentVisible = false;
                }
            } else {
                //// 這邊注意，要撇除「邏輯控制的影片」      20240611 v3.5要確認一下viewer是否還是如此
                if (parentVisible == true && videoPlane.object3D.visible == true && !videoPlane.blockly ){
                    // mp4Video.muted = true;
                    console.log("解除靜音 3D影片",mp4Video.name4debug, mp4Video.currentTime)
                    // mp4Video.currentTime = 0.1
                    // mp4Video.play()
                    if(playFromStart){
                        mp4Video.currentTime = 0.1
                    }
                    if(playVideo){
                        mp4Video.autoplay = true
                        mp4Video.play()
                    }
                    mp4Video.muted = false
                }
            }
        });	
    })
}


//// 暫停所有2D影片物件
export function pause2dVideos(){
    //// 取得「所有影片」  2D
    let videos2D = window.vrController.makarObjects2D

    //// 靜音所有2D影片物件
    videos2D.forEach( video2d =>{
        //// 雖然不應該出現 makarType 已是 video2D 的影片2D物件卻沒有以下這些，但還是寫一下錯誤處理
        if( video2d.makarType != "video2D" ){ return; }
        if( video2d.children.length == 0 ){ return; }
        if( !video2d.children[0].material ){ return; }
        if( !video2d.children[0].material.map ){ return; }
        if( !video2d.children[0].material.map.image ){ return; }
        
        if( video2d.children[0].material.map.image.tagName == "VIDEO" ){
            const video = video2d.children[0].material.map.image
            if(video){
                // console.log("暫停2D影片", video)
                const isVideoPlaying = (material) => !!(material.currentTime > 0 && !material.paused && !material.ended && material.readyState > 2);
                if(isVideoPlaying(video)){
                    try {
                        video.pause()                        
                    } catch (error) {
                        console.log("VideoModule.js, video pause error=", error)
                    }
                }
            }
        }
    })
}

//// 暫停所有3D影片物件
export function pause3dVideos(){
    //// 取得「所有影片」  3D
    let aVideos = document.getElementsByTagName('a-video');

    //// 把3D影片 可見的 全部靜音
    Array.from(aVideos).forEach( videoPlane => {
        let mp4Video = videoPlane.mp4Video;

        const isVideoPlaying = (material) => !!(material.currentTime > 0 && !material.paused && !material.ended && material.readyState > 2);
        if(isVideoPlaying(mp4Video)){
            try {
                mp4Video.pause()                    
            } catch (error) {
                console.log("VideoModule.js, video pause error=", error)
            }
        }

    })
}

//[start-20231031-renhaohsu-modify]//
export function loadVideo2D( obj, index, sceneObjNum, position, rotation, scale ){
    let self = this;

    let pVideo2D = new Promise( ( video2DResolve ) => {

        //// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
        //// 位置    縮放    尺寸   旋轉
        let rectP, rectSizeDelta, rectScale , rectR ; 
        if ( Object.keys( self.editor_version ).length == 4 ){
            let largeV  = Number( self.editor_version.v0 );
            let middleV = Number( self.editor_version.v1 );
            let smallV  = Number( self.editor_version.v2 );	

            //[start-20231013-howardhsu-modify]//
            let trans;
            if ( largeV > 3 || 
                ( largeV == 3 && middleV >= 5 ) 
            ){
                trans = getObj2DInfo350();
            } else{
                trans = getObj2DInfo350();                                              
            }

            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                rectP = trans.rectP;
                rectSizeDelta = trans.rectSizeDelta;
                rectScale = trans.rectScale;
                rectR = trans.rectR;
            }else{
                video2DResolve( false );
                return;
            }
            //[end-20231013-howardhsu-modify]//

        }else{
            let trans = getObj2DInfo350();
            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                rectP=trans.rectP;
                rectSizeDelta=trans.rectSizeDelta;
                rectScale=trans.rectScale;
                rectR = trans.rectR;
            }else{
                video2DResolve( false );
                return;
            }
        }

        //[start-20231013-howardhsu-add]//
        function getObj2DInfo350 (){
            let tempInfo = {};
            //// 位置    縮放    尺寸   旋轉
            let rectP, rectSizeDelta, rectScale , rectR ; 
            if ( obj.transformAttr.rect_transform && Array.isArray( obj.transformAttr.rect_transform ) && obj.transformAttr.rect_transform.length > 0 ){

                if ( !Number.isFinite( self.selectedResolutionIndex )   ){
                    console.log(' _getObj2DInfo350: error, missing _selectedResolutionIndex' );
                    self.selectedResolutionIndex = 0;
                }
                let selectedObj2DInfo = obj.transformAttr.rect_transform[ self.selectedResolutionIndex ];

                if ( selectedObj2DInfo.position && selectedObj2DInfo.size_delta && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
                    rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
                    rectSizeDelta = selectedObj2DInfo.size_delta.split(",").map(function(x){return Number(x)}); 
                    rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
                    rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

                    let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]), parseFloat(rectR[1]), parseFloat(rectR[2]), parseFloat(rectR[3]))
                    let eulerAngle = new THREE.Euler().setFromQuaternion( quaternionRotation, "YXZ");
                    let _rectR = new THREE.Vector3( eulerAngle.x ,  eulerAngle.y ,  eulerAngle.z );

                    //// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
                    // rotation.z = b.z/Math.PI * 180 ;                    
                    _rectR.z =  -1 * _rectR.z

                    //// 為了相容 ，把「縮放資料」取代 「原本 scale」
                    scale.x = rectScale[0];
                    scale.y = rectScale[1];

                    tempInfo = {
                        rectP: rectP,
                        rectSizeDelta: rectSizeDelta,
                        rectScale: rectScale,
                        rectR: _rectR
                    }
                }

            }
            return tempInfo;
        }
        //[end-20231013-howardhsu-add]//
        
        let mp4Video, mp4Texture ;

        mp4Video = document.createElement('video');
        mp4Video.src = obj.res_url; // url, "Data/makarVRDemo.mp4"
        mp4Video.playsInline = true;
        mp4Video.autoplay = true;
        mp4Video.loop = true;
        mp4Video.setAttribute('crossorigin', 'anonymous');
        mp4Video.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount );
        mp4Video["name4debug"] = obj.generalAttr.obj_name; 

        mp4Video.setAttribute("preload", "auto");
        // mp4Video.setAttribute("playsinline ", true);

        //// 開發需要，先將所有影片禁音
        // mp4Video.muted = true;
        if (window.Browser){
            if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location )  ){
            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                mp4Video.muted = true;
            }
            
            if (window.Browser.mobile == true){
                mp4Video.muted = true;
                // mp4Video.currentTime = 0.1
                mp4Video.play()
            }
        }
        
        mp4Texture = new THREE.VideoTexture( mp4Video );
        mp4Texture.colorSpace = THREE.SRGBColorSpace;
        mp4Texture.flipY = false;
        console.log("_loadVideo2D: mp4Texture", mp4Texture)

        mp4Video.onloadedmetadata = function() {
            // var videoWidth , videoHeight;
            // if (mp4Video.videoWidth >= mp4Video.videoHeight){
            //     videoWidth = 1;
            //     videoHeight = 1*mp4Video.videoHeight/mp4Video.videoWidth;
            // }else{
            //     videoWidth = 1*mp4Video.videoWidth/mp4Video.videoHeight;
            //     videoHeight = 1;
            // }

            let width, height;
            let scaleRatioXY = self.scaleRatioXY;
            // width  = rectSizeDelta[0] * scale.x * scaleRatioXY ;
            // height = rectSizeDelta[1] * scale.y * scaleRatioXY ;
            
            //// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
            width  = rectSizeDelta[0] * scaleRatioXY ;
            height = rectSizeDelta[1] * scaleRatioXY ;
                
            let rootObject = new THREE.Object3D();
            rootObject.makarType = "video2D";

            //[start-20240408-renhaohsu-modify]//
            let chromaKey, slope, threshold, transparentBehav;                    
            //20191108-start-thonsha-add
            let transparentVideo = false
            if(makarUserData.scenesData.scenes[self.sceneIndex].behav && Array.isArray(makarUserData.scenesData.scenes[self.sceneIndex].behav)){

                transparentBehav = makarUserData.scenesData.scenes[self.sceneIndex].behav.find(b => b.obj_id == obj.generalAttr.obj_id && b.behav_type == "Transparent")
                if(transparentBehav){
                    console.log("%c VideoModule.js _loadVideo: transparentBehav=", 'color:BlanchedAlmond;', transparentBehav)
                    transparentVideo = true;
                    let _color = transparentBehav.color.split(",")
                    chromaKey = [parseFloat(_color[0]), parseFloat(_color[1]), parseFloat(_color[2])] 
                    slope = transparentBehav.slope 
                    threshold = transparentBehav.threshold
                }
            }
            //[end-20240408-renhaohsu-modify]//

            let plane;
            if (transparentVideo && transparentBehav){
                        
                let chromaKeyMaterial;

                if (transparentBehav.mode == "RGB"){
                    chromaKeyMaterial = new THREE.ChromaKeyMaterial({
                        map: mp4Texture , 
                        keyColor: chromaKey ,
                        side: THREE.DoubleSide, 
                        slope: slope,
                        threshold: threshold,
                    });
                    
                } else if (transparentBehav.mode == "HSV"){

                    //[start-20240408-renhaohsu-modify]//
                    //// rgb2hsv source: https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript/54070620#54070620
                    function rgb2hsv(r,g,b) {
                        let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
                        let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
                        return [60*(h<0?h+6:h), v&&c/v, v];
                    }
                    let _hsv = rgb2hsv( chromaKey[0], chromaKey[1], chromaKey[2] )
                    _hsv[0] /= 360;
                    console.log(`rgb: ${chromaKey} ,\n _hsv: (${ _hsv })`)
                    //[end-20240408-renhaohsu-modify]//

                    chromaKeyMaterial = new THREE.HSVMattingMaterial({
                        map: mp4Texture , 
                        side: THREE.DoubleSide, // DoubleSide
                        _keyingColorH: _hsv[0],
                        _keyingColorS: _hsv[1],
                        _keyingColorV: _hsv[2],
                        _deltaH: transparentBehav.hue,
                        _deltaS: transparentBehav.saturation,
                        _deltaV: transparentBehav.brightness,
                    });
                }
                // plane = THREE.SceneUtils.createMultiMaterialObject( new THREE.PlaneBufferGeometry(
                // 	mp4Texture.image.width*25.4/dpi ,
                // 	mp4Texture.image.height*25.4/dpi , 0 ), [ 
                // 		chromaKeyMaterial,
                // 		new THREE.MeshBasicMaterial( { color: 0xC0C0C0 , side: THREE.BackSide } ) 
                // 	]
                // );
                plane = new THREE.Mesh( 
                    new THREE.PlaneBufferGeometry( width , height , 0 ), 
                    chromaKeyMaterial,
                );                
                
            } else {
                    
                plane = new THREE.Mesh( 
                    new THREE.PlaneBufferGeometry( width, height , 0 ), 
                    new THREE.MeshBasicMaterial( { map: mp4Texture, side: THREE.DoubleSide, transparent: true  } ),
                );

            }

            // let videoBehavRef = false;                    
            // if (obj.behav_reference){
            //     rootObject.behav_reference = obj.behav_reference;
            //     for (let j = 0;j<obj.behav_reference.length; j++){
            //         if ( obj.behav_reference[j].behav_type == "Display" ){
            //             videoBehavRef = true;
            //             rootObject.visible = false;
            //             mp4Video.pause();
            //             mp4Video.autoplay = false;
            //             mp4Video.currentTime = 0;     
            //             break;                   
            //         }
            //     }
            // }

            // // for double side 
            // var plane = new THREE.Mesh(
            // 	new THREE.PlaneBufferGeometry( width , height , 0 ),
            // 	new THREE.MeshBasicMaterial( { map : texture,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
            // );
            
            //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
            const tempBehav = {
                behav_type : "videoTogglePlayPause",
                // delay : false,
                // is_front : true,
                obj_id : obj.generalAttr.obj_id,
                // toward_id : "7e30d242-3485-4f2f-8e61-e55ff9723e44",
                // trigger_obj_id : "d60e0385-9037-41dd-a899-d1479293b1db",
                // trigger_type : "Click"
            }

            if ( obj.behav ){
                rootObject["behav"] = obj.behav ;

                //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                rootObject["behav"].push(tempBehav)

                //// 載入時候建制「群組物件資料」「注視事件」
                self.setObjectBehavAll( obj );
            } else {
                //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
                rootObject["behav"] = [ tempBehav ]
            }

            //// 依照 v3.5 viewer的設定: 所有影片物件都多了 "點擊時toggle播放暫停"
            // videoPlane.setAttribute('class', "clickable" )
            
            if (obj.generalAttr.active == false){
                rootObject.visible = false;
            }

            // plane.makarType = 'video2D';
            rootObject["makarObject"] = true ;
            rootObject["obj_id"] = obj.generalAttr.obj_id ;

            //20191029-start-thonhsa-add
            if(obj.generalAttr.obj_parent_id){
                // console.log("______VRFunc.js: _loadTexture2D: obj(parent) ", obj );

                mp4Video.autoplay = false;
                
                let setIntoParent = function(){
                    let isParentSet = false;
                    for (let i = 0; i < self.makarObjects2D.length; i++ ){
                        if ( self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id  ){
                            isParentSet = true;
                        }
                    }

                    if ( isParentSet == false ) {
                        setTimeout(setIntoParent, 500 );
                        // console.log("______VRFunc.js: _loadTexture2D: isParentSet   ", obj , self.makarObjects2D );

                    }else{
                        for (let i = 0; i < self.makarObjects2D.length; i++){
                            if (self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id){

                                //// 大小
                                rootObject.scale.set( scale.x , scale.y, 1 );

                                //// 改為統一移動比例
                                rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                                rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
                                rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

                                //// 旋轉
                                rootObject.rotateZ( rectR.z )             

                                rootObject.add( plane );
                                self.makarObjects2D[i].add(rootObject);
                                self.makarObjects2D.push(rootObject);

                                let parentVisible = true;
                                rootObject.traverseAncestors( function(parent) {                                    
                                    if (parent.visible == false){
                                        parentVisible = false;
                                    }
                                                                            
                                    // if (parentVisible == true && rootObject.visible == true && videoBehavRef == false ){
                                    if (parentVisible == true && rootObject.visible == true ){
                                        console.log("VideoModule.js: _loadVideo2D: traverseAncestors: all parent visible true=", rootObject );
                                        
                                        mp4Video.autoplay = true;
                                        //[start-20240611-renhaohsu-mod]//
                                        //// seems like if a video object is a child, should call play() 
                                        mp4Video.play();

                                        //// set video attr according to the obj in makar with autoplay, volume, loop
                                        checkVideoTypeAttr(obj, mp4Video)
                                        //[end-20240611-renhaohsu-add]//                     
                                    
                                        //// 提醒用戶點擊開啟聲音
                                        if (window.Browser){
                                            if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                dealVideoMuted( mp4Video, true );
                                            } else if (window.Browser.mobile == true){
                                                //// safari 以外的手機瀏覽器
                                                dealVideoMuted( mp4Video, false );
                                            }
                                        }

                                    }else{
                                        console.log("VideoModule.js: _loadVideo2D: traverseAncestors: not all parent visible true=", parentVisible);
                                        //// rootObject.visible = false; 
                                        mp4Video.muted = false;
                                        mp4Video.autoplay = false;
                                        mp4Video.pause();
                                        mp4Video.currentTime = 0;

                                    }                                        
                                });

                                video2DResolve( rootObject );
                                // console.log("______VRFunc.js: _loadTexture2D: parent exist, set obj(parent) ", obj , plane );

                            }
                        }

                    }
                };
                setIntoParent();

            } else {
                console.log("______VRFunc.js: _loadTexture2D: obj() ", obj );

                //// 大小
                rootObject.scale.set( scale.x , scale.y, 1 );

                //// 位置
                rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
                rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 
                
                // console.log("______VRFunc.js: _loadTexture2D: rectP", rectP );                
                
                //// 旋轉
                rootObject.rotateZ( rectR.z )        
                
                mp4Video.autoplay = true;

                //// set video attr according to the obj in makar with autoplay, volume, loop
                checkVideoTypeAttr(obj, mp4Video)
                
                //// 提醒用戶點擊開啟聲音
                if (window.Browser){
                    if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                    // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                        dealVideoMuted( mp4Video, true );
                    } else if (window.Browser.mobile == true){
                        //// safari 以外的手機瀏覽器
                        dealVideoMuted( mp4Video, false );
                    }
                    
                    // else if (window.Browser.mobile == true){
                    //     mp4Video.muted = true;
                    //     mp4Video.currentTime = 0.1
                    //     mp4Video.play()
                    //     dealVideoMuted( mp4Video , true);
                    // }
                }

                self.makarObjects2D.push(rootObject);
                self.scene2D.add(rootObject);


                // const loader = new THREE.TextureLoader();
                // const texture1 = loader.load( 'https://threejs.org/examples/textures/brick_diffuse.jpg' );                    
                // texture1.colorSpace = THREE.SRGBColorSpace;
                // const material = new THREE.MeshBasicMaterial( { map: texture1 } );
                // plane.material.map = material.map
                // console.log("....", plane.material.map)

                rootObject.add(plane);
                rootObject["makarObject"] = true ;
                rootObject["obj_id"] = obj.generalAttr.obj_id ;
                
                video2DResolve( rootObject );

            }
            //20191029-end-thonhsa-add



        }



    })

    return pVideo2D;
}
//[end-20231031-renhaohsu-modify]//


//// YT影片物件 3D
////   (只是暫時物件，先不加入promise all的行列)
////   (或者說 未來可預期YT影片會處理較久 加入pAll會在場景載入等很久)
export function loadYouTubeNotSupport(obj, index, sceneObjNum, position, rotation, scale){
    //// 這裡this是vrController
    const self = this;
    console.log("loadYoutubeNotSupport", obj, index, sceneObjNum, position, rotation, scale)

    //// 用threeJS做一個背板 文字物件放到它的子物件
    let ytEntity = document.createElement('a-entity');

    if (obj.behav){
        ytEntity.setAttribute('class', "clickable" );
    } else if (obj.generalAttr.logic){
        ytEntity.setAttribute('class', "clickable" ); 
    } else {
        ytEntity.setAttribute('class', "unclickable" );
    }

    ytEntity.setAttribute( "id", obj.generalAttr.obj_id ) 
    ytEntity.setAttribute('crossorigin', 'anonymous');
    ytEntity.setAttribute("shadow","");
    
    //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
    if ( obj.generalAttr.active == false ){
        ytEntity.setAttribute("visible", false);
        ytEntity.setAttribute('class', "unclickable" );
    }

    //// 微調一下整體的縮放
    const scaleCoefficient = 0.9
    setTransform(ytEntity, position, rotation, scale.multiplyScalar(scaleCoefficient));
    self.makarObjects.push( ytEntity );

    ytEntity.addEventListener("loaded", e => {
        
        ytEntity.object3D["makarObject"] = true;
        ytEntity.object3D["makarType"] = 'youtube';

        if(obj.behav){
            ytEntity.object3D["behav"] = obj.behav ;
        }

        //// 準備一個three平面  作為文字背板    
        let plane, width, height;
        //// 長寬要與YT影片物件接近 數字來自經驗法則
        width  = 1.1 ;
        height = 0.65 ;
        plane = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( width, height , 0 ), 
            new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.7 } ),
        );

        //// 印象中v3.5已經不需要這個 有待確認
        if(obj.behav_reference){
            plane["behav_reference"] = obj.behav_reference ;
        }

        ytEntity.object3D.add(plane);

        //// 文字背板  給一個雜訊的視覺效果
        let paddingPlane;
        paddingPlane = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( width, height , 0 ), 
            // new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, transparent: true, opacity: 0.1 } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 } ),
        );

        //// 把小平面作為children加入
        ytEntity.object3D.add(paddingPlane)

        paddingPlane.position.set(0, 0, 0)
        paddingPlane.rotation.set(0, 0, 0)
        //// 微調一下小平面的縮放
        const paddingCoeficient = 0.95
        paddingPlane.scale.set(paddingCoeficient*1, paddingCoeficient*1, paddingCoeficient*1)
    
        //// 給一個文字物件 寫著 youtube not supported
        let tempTextObj = {
            "res_id": "Text",
            "typeAttr": {
                "color": "0.6, 0.6, 0.6, 0.6",
                "margin": 0,
                "content": "youtube is\nunsupported\ncurrently.",
                "radious": 0,
                "back_color": "1,1,1,0",
                "anchor_type": 3
            },
            "blocklyAttr": {
                "uid": "",
                "reference": false
            },
            "generalAttr": {
                "logic": false,
                "active": true,
                "obj_id": `tempTextObj_${self.currentSceneIndex}_${index}`,
                "obj_name": obj.generalAttr.obj_name + "_tempTexObj",
                "obj_type": "3d",
                "interactable": false,
                "obj_parent_id": obj.generalAttr.obj_id
            },
            "materialAttr": {
                "materials": []
            },
            "animationAttr": [],
            "transformAttr": {
                "transform": [
                    "0,0,0",
                    "0,0,0,1",
                    "1,1,1"
                ],
                "rect_transform": [],
                "simulated_rotation": "0,0,0"
            },
            "main_type": "text",
            "sub_type": "txt",
            "res_url": "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/3D/sceneDefaultModels/Text.glb"
        }
        
        let pText = self.loadText( tempTextObj , new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), true )
        
        //// 背面也需要
        pText.then(result => {
            const backSideText = result.object3D.clone()
            // console.log("YT後文字 backSideText", backSideText)
            ytEntity.object3D.add(backSideText)
            backSideText.position.set(0,0,0.005)
        })
    })
    
    if(obj.generalAttr.obj_parent_id){
        let timeoutID = setInterval( () => {
            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
            if (parent){ 
                if(parent.object3D.children.length > 0){
                    parent.appendChild(ytEntity);
                    window.clearInterval(timeoutID);
                }
            }
        }, 1);
    }
    else{
        self.vrScene.appendChild(ytEntity);
    }
}

//// YT影片物件 2D
////   (只是暫時物件，先不加入promise all的行列)
export function loadYouTubeNotSupport2D(obj, index, sceneObjNum, position, rotation, scale){

    //// 這裡this是vrController
    const self = this;
    console.log("loadYoutubeNotSupport", obj, index, sceneObjNum, position, rotation, scale)

    console.log("呼叫 getObj2DTransform VC=", VC)

    const trans = VC.getObj2DTransform(self.editor_version, obj, index, sceneObjNum, position, rotation, scale)
    
    console.log("呼叫 getObj2DTransform trans=", trans)

    let rectP, rectSizeDelta, rectScale , rectR ; 
    if( trans ){
        rectP = trans.rectP;
        rectSizeDelta = trans.rectSizeDelta;
        rectScale = trans.rectScale;
        rectR = trans.rectR;
    
        //// 為了相容 ，把「縮放資料」取代 「原本 scale」
        scale.x = trans.rectScale[0]
        scale.y = trans.rectScale[1]
    } else {
        // video2DResolve( false );
        return false;
    }
    
    
    let width, height;
    let scaleRatioXY = self.scaleRatioXY;

    //// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
    width  = rectSizeDelta[0] * scaleRatioXY ;
    height = rectSizeDelta[1] * scaleRatioXY ;
        
    let rootObject = new THREE.Object3D();
    
    rootObject["makarObject"] = true ;
    rootObject["makarType"] = 'youtube2D';
    rootObject["obj_id"] = obj.generalAttr.obj_id ;

    //// 20240619 目前webXR不支援YT物件  去背事件應該也暫時不支援
    
    if ( obj.behav ){
        rootObject["behav"] = obj.behav ;
    }
    
    
    if (obj.generalAttr.active == false){
        rootObject.visible = false;
    }


    //// 準備一個three平面  作為文字背板    
    let plane;
    //// 長寬要與YT影片物件接近 數字來自經驗法則
    // width  = 1.1 ;
    // height = 0.65 ;
    plane = new THREE.Mesh( 
        new THREE.PlaneBufferGeometry( width, height , 0 ), 
        new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.7 } ),
    );

    //// 文字背板  給一個雜訊的視覺效果
    let paddingPlane;
    paddingPlane = new THREE.Mesh( 
        new THREE.PlaneBufferGeometry( width, height , 0 ), 
        // new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, transparent: true, opacity: 0.1 } ),
        new THREE.MeshBasicMaterial( { color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.1 } ),
    );
    paddingPlane.position.set(0, 0, 0)
    paddingPlane.rotation.set(0, 0, 0)
    //// 微調一下小平面的縮放
    const paddingCoeficient = 0.9
    paddingPlane.scale.set(paddingCoeficient*1, paddingCoeficient*1, paddingCoeficient*1)

    rootObject.add(plane);
    rootObject.add(paddingPlane);


    //// 給一個文字物件 寫著 youtube not supported
    let tempTextObj = {
        "res_id": "Text",
        "typeAttr": {
            "color": "0.6, 0.6, 0.6, 0.6",
            "margin": 0,
            "content": "youtube is\nunsupported\ncurrently.",
            "radious": 0,
            "back_color": "1,1,1,0",
            "anchor_type": 3
        },
        "blocklyAttr": {
            "uid": "",
            "reference": false
        },
        "generalAttr": {
            "logic": false,
            "active": true,
            "obj_id": `tempTextObj2D_${self.currentSceneIndex}_${index}`,
            "obj_name": obj.generalAttr.obj_name + "_tempTextObj2D",
            "obj_type": "2d",
            "interactable": false,
            "obj_parent_id": obj.generalAttr.obj_id
        },
        "materialAttr": {
            "materials": []
        },
        "animationAttr": [],
        "transformAttr": {
            "transform": [],
            "rect_transform": [
                {
                    "scale": "1,1,1",
                    "position": "0,0,0",
                    "rotation": "0,0,0,1",
                    // "size_delta": "100,100",
                    "size_delta": obj.transformAttr.rect_transform[self.selectedResolutionIndex].size_delta,
                    "simulated_rotation": "0,0,0"
                }
            ],
            "simulated_rotation": ""
        },
        "main_type": "text",
        "sub_type": "txt",
        "res_url": "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/3D/sceneDefaultModels/Text.glb"
    }

    let pText = self.loadText2D( tempTextObj , index, sceneObjNum, null, null, null, true)  
    
    //// 文字的z值不好決定 由於YT物件2D只有一個文字子物件 renhaohsu暫時先等載入後在parent下再調整為0.01
    pText.then(result => {
        console.log("YT後文字 result", result)
        result.position.z = 0.01;
    })

    if(obj.generalAttr.obj_parent_id){
        
        let setIntoParent = () => {
            let isParentSet = false;
            for (let i = 0; i<self.makarObjects2D.length; i++ ){
                if ( self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id  ){
                    isParentSet = true;
                }
            }

            if ( isParentSet == false ){
                setTimeout(setIntoParent, 200 );
            }else{
                for (let i = 0; i < self.makarObjects2D.length; i++){
                    if (self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id){
                    
                        rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                        rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
                        rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 
                        
                        //// 旋轉
                        // rootObject.rotateZ( -rotation.z /180*Math.PI);                            
                        rootObject.rotateZ( rectR.z )   

                        rootObject.scale.set( rectScale[0] , rectScale[1] , 1 );

                        rootObject["makarObject"] = true ;
                        rootObject["obj_id"] = obj.generalAttr.obj_id ;
                        rootObject["obj_parent_id"] = obj.generalAttr.obj_parent_id ;
                        self.makarObjects2D[i].add(rootObject);
                        self.makarObjects2D.push(rootObject); 
                    
                        break;
                    }
                    
                }
            }
    
        }
        setIntoParent();

    } else {
        //// 大小
        rootObject.scale.set( scale.x , scale.y, 1 );

        //// 位置
        rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
        rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
        rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

        //// 旋轉
        rootObject.rotateZ( rectR.z )        
        
        self.scene2D.add(rootObject);
        self.makarObjects2D.push(rootObject);
        
        // video2DResolve( rootObject );
    }
}