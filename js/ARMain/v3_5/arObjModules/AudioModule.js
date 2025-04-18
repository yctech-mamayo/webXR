import { UrlExistsFetch } from "../utility.js"
import { setARTransform } from "./setTransform.js";
import { loadGLTFModel } from "./GLTFModelModule.js";
import { verionControl as VC } from "../MakarWebXRVersionControl.js";

export function loadAudio( scene3DRoot, obj, position, rotation, scale , quaternion ) {
    
    // 這裡 this 是 arController
    let self = this;

    let editor_ver = VC.getProjDataEditorVer( arController.currentProjData );

    let pAudio = new Promise( function( audioResolve ){

        UrlExistsFetch( obj.res_url ).then( retStatus =>{

            if ( retStatus == true ){

                //// 調整位置到辨識圖中央 所需的數值
                let dpi = self.gcssTargets.dpi[ scene3DRoot.GCSSID] ; 
                let GCSSWidth= self.gcssTargets.width[ scene3DRoot.GCSSID] ; 
                let GCSSHeight= self.gcssTargets.height[ scene3DRoot.GCSSID] ; 
                console.log("dpi", dpi, GCSSWidth, GCSSHeight)

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
                    assetsitem.setAttribute("src",src);
                    assetsitem.setAttribute('crossorigin', 'anonymous');
                    assetsitem.setAttribute("loop", true);
                    assetsitem.setAttribute("preload", "auto");
                    assets.appendChild(assetsitem);
                }


                // assets.appendChild(assetsitem);

                //// 設定聲音物件並加到場景
                // assetsitem.onloadedmetadata = function() {
                function handleAudio() {
                    let soundEntity = document.createElement('a-entity');

                    //[start-20230816-howardhsu-modify]//
                    // soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; autoplay: true; loop: true; volume: 1; positional: false");
                    soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; positional: false");

                    soundEntity.setAttribute( "id", obj.generalAttr.obj_id );
                    soundEntity.setAttribute("sound", "autoplay: false");      
                    //[end-20230816-howardhsu-modify]//

                    // setARTransform( soundEntity, position, rotation, scale , quaternion )

                    self.makarObjects.push( soundEntity );

                    let audioVisible = true;

                    //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                    if ( obj.generalAttr.active == false ){
                        soundEntity.setAttribute("sound", "loop: false");
                        soundEntity.setAttribute("visible", false);
                        audioVisible = false;
                        soundEntity.setAttribute('class', "unclickable" );
                    }


                    let audioBehavRef = false;
                    //// v3.5 物件已不再設定為 "若有behav顯示事件則先隱藏" 因此以下暫時不運作
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
                                

                                soundEntity.setAttribute('class', "unclickable" );
                                soundEntity.setAttribute("sound", "autoplay: false ");
                                break;
                            }
                        }
                    }else{
                        soundEntity.setAttribute("visible", true);
                    }
                    //20191227-end-thonsha-mod
                    
                    if(obj.generalAttr.obj_parent_id){
                        soundEntity.setAttribute("sound", "autoplay: false");
                        soundEntity.setAttribute("sound", "autostart: false");
                        // soundEntity.setAttribute("visible", false);
                        // soundEntity.setAttribute('class', "unclickable" );
                        let timeoutID = setInterval( function () {
                            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                            if (parent){ 
                                if(parent.object3D.children.length > 0){
                                    parent.appendChild(soundEntity);
                                    window.clearInterval(timeoutID);

                                    parent.addEventListener("child-attached", function(el){

                                        if ( obj.generalAttr.logic ){

                                            soundEntity.blockly = obj.generalAttr.logic;
                                            soundEntity.setAttribute("sound", "autoplay: false");
                                            
                                            // console.log("%c 不應該播", "color: red; font-size: 20px")

                                        } else {

                                            let parentVisible = true;
                                            soundEntity.object3D.traverseAncestors( function(parent) {
                                                if (parent.type != "Scene"){
                                                    console.log(" _loadAudio_: traverseAncestors: not Scene parent=", parent );
                                                    //// 只需要檢查【 makarObject 】即可
                                                    if ( parent.makarObject == true && parent.visible == false){
                                                        parentVisible = false;
                                                    }
                                                } else {
                                                    if (parentVisible == true && soundEntity.object3D.visible == true && audioBehavRef == false && audioVisible == true && obj.generalAttr.active ){
                                                        console.log("_loadAudio_: traverseAncestors: all parent visible true=", soundEntity.components.sound );
                                                        
                                                        //// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
                                                        
                                                        
                                                        // if ( window.allowAudioClicked != true ){
                                                        if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) ||  (window.allowAudioClicked != true && location == parent.location ) ){


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
                                                        console.log(" _loadAudio_: traverseAncestors: not all parent visible true=", soundEntity.components.sound );
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
                        
                        if ( obj.generalAttr.logic ){
                            soundEntity.blockly = obj.generalAttr.logic;
                            soundEntity.setAttribute("sound", "autoplay: false");
                        } else if ( !obj.generalAttr.active ) {
                            soundEntity.setAttribute("sound", "autoplay: false");

                        } else {


                            //// 先判斷是否為「本體可見」和「 不是事件控制播放 」，是的話進入瀏覽器允許判斷
                            //// 沒有母物件，代表此「聲音物件」是直接放置於場景內，先判斷「是否透過事件觸發」，沒有的話就判斷「是否已經允許聲音」
                            if ( audioVisible == true && audioBehavRef == false ){

                                // if ( window.allowAudioClicked != true ){
                                if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) ||  (window.allowAudioClicked != true && location == parent.location ) ){

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
                                    
                                    //// 沒有掛「邏輯」、本體可見、沒有物件控制
                                    //// 允許聲音播放已經觸發過，設定為「自動播放」
                                    soundEntity.setAttribute("sound", "autoplay: true");
                                    checkAudioTypeAttr(obj, soundEntity, audioBehavRef)
                                
                                }

                            } else {
                                //// 沒有掛「邏輯」、本體不可見、是透過點擊觸發
                                //// 設定為 「不自動播放」
                                soundEntity.setAttribute("sound", "autoplay: false");
                                soundEntity.setAttribute("visible", false);


                            }

                        }							
                    
                        scene3DRoot.appendChild(soundEntity);
                    }

                    soundEntity.addEventListener("loaded", function(evt){
                        if (evt.target == evt.currentTarget){
                            
                            soundEntity.object3D.makarType = 'audio';
                            soundEntity.object3D["makarObject"] = true; 

                            if ( obj.behav ){
                                soundEntity.object3D["behav"] = obj.behav ;

                                //// 載入時候建制「群組物件資料」「注視事件」
                                // self.setObjectBehavAll( obj );
                                
                            }
                            if(obj.behav_reference){
                                soundEntity.object3D["behav_reference"] = obj.behav_reference ;
                            }

                            //// 依照辨識圖，調整物件位置
                            let dp = new THREE.Vector3();
                            if(obj.generalAttr.obj_parent_id){
                                //// 假如是子物件，不用位移到辨識圖中央
                                
                                dp.addScaledVector( position, 1*100*25.4/dpi );
                                
                                ///// 子物件的 z 軸要正負顛倒
                                let pz = dp.z ;
                                dp.z = -pz;
                                
                                //// y z 不需要交換，但我不知道為什麼
                                setARTransform( soundEntity, dp, rotation, scale, quaternion );
                                
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
                                
                                setARTransform( soundEntity, dp , rotation, scale, quaternion );
                                
                                //// 第一層物件必須放至於辨識圖中央										
                                soundEntity.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
                                //// 第一層物件必須垂直於辨識圖表面
                                soundEntity.object3D.rotation.x += Math.PI*90/180;
                            }

                            let pm = soundEntity.object3D;
                            pm.originTransform = { 
                                position: pm.position.clone() , 
                                rotation: pm.rotation.clone() , 
                                scale: pm.scale.clone() 
                            } ;

                            //// 場景物件帶有「邏輯功能」，重設參數，暫停
                            if ( obj.generalAttr && obj.generalAttr.logic ){
                                //// 假如聲音物件有 加上 邏輯，則在 丟失辨識圖的時候，無條件【暫停聲音】
                                pm.resetProperty = function(){
                                    if ( soundEntity.components && soundEntity.components.sound ){
                                        soundEntity.components.sound.pauseSound()
                                    }

                                    console.log(' ________sound resetProperty ', obj );

                                    //// 重設可見度
                                    if ( typeof( obj.generalAttr.active ) == 'boolean' ){
                                        // pm.visible = obj.generalAttr.active;
                                        soundEntity.setAttribute("visible", obj.generalAttr.active );

                                        // if ( obj.generalAttr.active == false){
                                        //     // soundEntity.setAttribute("sound", "loop: false");
                                        //     soundEntity.components.sound.pauseSound();
                                        // }else{
                                        //     soundEntity.components.sound.playSound()
                                        // }

                                    }
                                }
                            }

                            audioResolve( soundEntity );
                        }
                    });
                    isAudioSetted = true
                }


            }else{

                console.log(" _loadAudio_ , obj url not exist ", obj );
                
                obj.main_type = 'model';
                obj.sub_type = 'glb';
                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

                loadGLTFModel( scene3DRoot, obj, position, rotation, scale, quaternion )

                audioResolve( 1 );

            }
        }).catch( function( e ){
            
            console.log('_loadAudio_: error ', e );

        } );

    });

    return pAudio;

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