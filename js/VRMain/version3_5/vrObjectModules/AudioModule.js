import { UrlExists } from "../vrUtility.js"
import { loadGLTFModel } from "./GLTFModelModule.js"

export function loadAudio( obj , position, rotation, scale) {
    //20191105-start-thonsha-add
    console.log("VRFunc.js: _loadAudio , obj=", obj );
    let self = this
    let pAudio = new Promise( function( audioResolve ){

        UrlExists( obj.res_url , function( retStatus ){
            //// 先檢查「聲音物件網址是否存在」，否的話，載入「問號模型物件」
            if ( retStatus == true ){

                let assets = document.getElementById("makarAssets");

                console.log("_loadAudio: checkFileExtension", obj)

                //// 測試 "沒有副檔名的聲音檔"
                // let testUrl = "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/80226cb1-a28b-4803-b3f4-92508ce5d3fa/Resource/625e3651-04b1-4fb7-8324-3d140558c559"
                // obj.res_url = testUrl

                //// 目前編輯器支援的聲音檔案格式 "mp3", "wav", "ogg"  且編輯器v3.5都會帶有副檔名
                let getTailOf_res_url = obj.res_url.substring(obj.res_url.lastIndexOf('.') + 1)

                //// 暫時當作 "檔案取名為.mp3 但該檔案其實沒有副檔名" 不會發生
                console.log("_loadAudio: checkFileExtension getTail" , getTailOf_res_url);

                let assetsitem = document.createElement("audio");
                
                let isAudioSetted = false
                switch (getTailOf_res_url) {
                    case "mp3":
                    case "wav":
                    case "ogg":
                        //// 有副檔名，且是 mp3 wav ogg
                        setAudioAttr(assetsitem, obj.res_url)
                        assetsitem.onloadedmetadata = function() {
                            // console.log("%c 到底會不會觸發?", "color: yellow;font-size:25px")
                            handleAudio()
                        }
                        
                        break;

                    default:
                        //// 沒有副檔名
                        fetch( obj.res_url, {
                            // headers: {
                            //     "Content-Type": "audio/mpeg",
                            // },
                            method: 'GET',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            mode: 'cors', // no-cors, cors, *same-origin
                        }).then(function( response ){
                            return response.blob();
                        }).then( function( audioBlob ){
                            let vid = URL.createObjectURL(audioBlob);
                            // assetsitem.setAttribute("src", vid );
                            console.log('__AudioModules.js: before _onloadedmetadata ' , vid );
                            
                            //// 沒有副檔名的情況下 ios 不會觸發 onloadedmetadata 因此底下多聽一個loadstart
                            assetsitem.onloadedmetadata = function() {
                                console.log(' 7777777777777777777 AudioModules.js: _onloadedmetadata ' , vid );
                                // console.log("%c 還是不會觸發orz", "color: yellow;font-size:25px")

                                if( !isAudioSetted ) {
                                    handleAudio()
                                }
                            }
                            
                            //// 這裡可以認定為audioBlob已經載完  使用loadstart事件應該沒問題
                            assetsitem.addEventListener("loadstart", function( event ) {
                                console.log('__AudioModules.js: loadstart  \n\n' , vid );

                                if( !isAudioSetted ) {
                                    handleAudio()
                                }
                                
                            })
                            
                            setAudioAttr(assetsitem, vid)
                            
                        })

                        break;
                }

                //// 設定 assets item 的屬性
                function setAudioAttr(assetsitem, src=obj.res_url){
                    assetsitem.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id);
                    assetsitem.setAttribute("src", src);
                    assetsitem.setAttribute('crossorigin', 'anonymous');
                    assetsitem.setAttribute("loop", true);
                    assetsitem.setAttribute("preload", "auto");
                    assets.appendChild(assetsitem);
                }

                //// 設定聲音物件並加到場景
                function handleAudio() {

                    let soundEntity = document.createElement('a-sound');  

                    //[start-20230816-howardhsu-modify]//
                    // soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; autoplay: true; loop: true; volume: 1; positional: false");
                    soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; positional: false");
                    //[end-20230816-howardhsu-modify]//

                    soundEntity.setAttribute( "id", obj.generalAttr.obj_id );
                    soundEntity.setAttribute("sound", "autoplay: false");                  
                        
                    self.setTransform(soundEntity, position, rotation, scale);
                    self.makarObjects.push( soundEntity );

                    //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                    let audioVisible = true;
                    if ( obj.generalAttr.active == false ){
                        audioVisible = false;
                        
                        soundEntity.setAttribute("sound", "loop: false");
                        soundEntity.setAttribute("visible", false);
                        soundEntity.setAttribute('class', "unclickable" );
                    }

                    let audioBehavRef = false;
                    if(obj.behav_reference){
                        for(let i=0; i<obj.behav_reference.length;i++){
                            if (obj.behav_reference[i].behav_type == 'Display' && 
                                (obj.behav_reference[i].switch_type == 'Show'   || 
                                obj.behav_reference[i].switch_type == 'Switch' )
                            ){
                                audioVisible = false;
                                audioBehavRef = true;
                                soundEntity.setAttribute("sound", "loop: false");
                                soundEntity.setAttribute("visible", false);
                                // soundEntity.setAttribute('class', "unclickable" );
                                break;
                            }
                        }
                        
                    }else{
                        soundEntity.setAttribute("visible", true);
                    }
                    //20191227-end-thonsha-mod

                    if(obj.generalAttr.obj_parent_id){
                        
                        let timeoutID = setInterval( function () {
                            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                            if (parent){ 
                                if(parent.object3D.children.length > 0){
                                    parent.appendChild(soundEntity);
                                    window.clearInterval(timeoutID);

                                    parent.addEventListener("child-attached", function(el){

                                        console.log("VRFunc.js: VRController: _loadAudio,: parent child-attached, el=", el );

                                        if ( obj.generalAttr.logic ){

                                            soundEntity.blockly = obj.generalAttr.logic;
                                            soundEntity.setAttribute("sound", "autoplay: false");

                                        } else {

                                            let parentVisible = true;
                                            soundEntity.object3D.traverseAncestors( function(parent) {
                                                if (parent.type != "Scene"){
                                                    console.log("VRFunc.js: VRController: _loadAudio,: traverseAncestors: not Scene parent=", parent );
                                                    if (parent.visible == false){
                                                        parentVisible = false;
                                                    }
                                                } else {
                                                    if (parentVisible == true && soundEntity.object3D.visible == true && audioBehavRef == false && audioVisible == true && obj.generalAttr.active ){
                                                        console.log("VRFunc.js: VRController: _loadAudio,: traverseAncestors: all parent visible true=", soundEntity.object3D );

                                                        //// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
                                                        if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
                                                            (window.allowAudioClicked != true && location == parent.location ) ){
                                    
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

                                                            //[start-20230815-howardhsu-add]//                                                         
                                                            checkAudioTypeAttr(obj, soundEntity, audioBehavRef)
                                                            //[end-20230815-howardhsu-add]//
                                                        }

                                                    }else{
                                                        console.log("2 VRFunc.js: VRController: _loadAudio,: traverseAncestors: not all parent visible true=", soundEntity.object3D.children[0] );
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
                        console.log("VRFunc.js: _loadAudio: no parent set autoplay true", soundEntity.object3D , location );
                        
                        if ( obj.generalAttr.logic ){
                            soundEntity.blockly = obj.generalAttr.logic;
                            soundEntity.setAttribute("sound", "autoplay: false");
                        } else if ( !obj.generalAttr.active ) {
                            soundEntity.setAttribute("sound", "autoplay: false");
                        
                        }  else {        

                            //// 先判斷是否為「本體可見」和「 不是事件控制播放 」，是的話進入瀏覽器允許判斷
                            if ( audioVisible == true && audioBehavRef == false ){

                                //// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
                                // if ( true ){
                                // if ( window.allowAudioClicked != true ){
                                if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
                                (window.allowAudioClicked != true && location == parent.location ) ){
                                
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
                                    checkAudioTypeAttr(obj, soundEntity, audioBehavRef)
                                    
                                }   

                            }else{
                                //// 假如 此聲音物件是被「 顯示事件 」所操控，那目前在 MAKAR App 強制設定為 此聲音物件「不可見」
                                //// 沒有掛「邏輯」、是透過顯示事件控制
                                //// 設定為「不自動播放」、「不可見」
                                soundEntity.setAttribute("sound", "autoplay: false");
                                soundEntity.setAttribute("visible", false );

                            }
                             

                        }                       
                        
                        self.vrScene.appendChild(soundEntity);
                    }

                    soundEntity.addEventListener("loaded", function(evt){

                        if (evt.target == evt.currentTarget){
                            console.log("3 VRFunc.js: VRController: _loadAudio,: loaded, soundEntity.object3D.children[0]=", soundEntity.object3D.children[0] );
                            soundEntity.object3D["makarObject"] = true; 
                            soundEntity.object3D["makarType"] = 'audio'; 
                            
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
                    isAudioSetted = true
                }

            }else{							
                console.log("VRFunc.js: _loadAudio , obj url not exist ", obj );
                
                obj.main_type = 'model';
                obj.sub_type = 'glb';
                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

                //[start-20230726-howardhsu-modify]//                                   
                loadGLTFModel( obj , position, rotation, scale , self.cubeTex )
                //[end-20230726-howardhsu-modify]//

                audioResolve( 1 );
            }

        });

    });

    return pAudio;

//20191105-end-thonsha-add
}


//// set audio attr according to the obj in makar with autoplay, volume, loop
//// 自動播放、音量、循環
function checkAudioTypeAttr(obj, soundEntity, audioBehavRef){  
    //[start-20230815-howardhsu-add]//
    if ( obj.generalAttr.active == false || audioBehavRef){                                                           
        soundEntity.setAttribute("sound", "autoplay: false");
    }  
    else if(obj.typeAttr){           
        
        if(obj.typeAttr.is_play != undefined){                                                                         
            soundEntity.setAttribute("sound", `autoplay: ${obj.typeAttr.is_play}`);
        }    
        if(obj.typeAttr.is_loop != undefined){ 
            soundEntity.setAttribute("sound", `loop: ${obj.typeAttr.is_loop}`); 
        }    
        if(obj.typeAttr.volume != undefined){ 
            soundEntity.setAttribute("sound", `volume: ${obj.typeAttr.volume}`); 
        }       
    } 
    //[end-20230815-howardhsu-add]//      
}