import { UrlExists } from "../vrUtility.js"

////// load the sky, 360 image/video    
export function loadSky( vrScene, scene_id, sceneSky_info, loadSceneCount) {
    // console.log("VRFunc.js: _loadSky: main type=", VRSceneResult[projIndex].scenes[0].main_type, VRSceneResult[projIndex].scenes[0].res_url);
    // main_type: "spherical_video"

    // let editor_version = [];
    // if (typeof(self.VRSceneResult[projIndex].editor_ver) != "string" ){
    // 	console.log("VRFunc.js: _loadSky: the editor_ver is not string, error and return ");
    // 	return -1;
    // }else{
    // 	editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
    // }

    // let sceneSky_info = self.editorVerionControllSky( editor_version , projIndex, sceneIndex );
    let pSky = new Promise( function( skyResolve ){
        
        UrlExists( sceneSky_info.res_url , function( retStatus ){
            let aSky;
            console.log(' ******  retStatus = ', retStatus, sceneSky_info.res_url );
            if (retStatus == false){
                //// 因為有些舊的專案 sky url 會404，這邊改為先檢查 url status，假如不存在，則強迫設定為預設圖片（或是直接不載入）

                if (document.getElementById("sky")){
                    aSky = document.getElementById("sky");
                    if (aSky.localName == "a-sky"){
                        //// 之前的 sky 是圖片，什麼都不用作
                    }else if (aSky.localName == "a-videosphere"){
                        //// 之前的 sky 是影片
                        aSky.remove();
                        aSky = document.createElement('a-sky');
                        aSky.setAttribute('id', "sky" );
                        vrScene.appendChild(aSky);
                    }
                }else{
                    aSky = document.createElement('a-sky');
                    aSky.setAttribute('id', "sky" );
                    vrScene.appendChild(aSky);
                }
                
                if( sceneSky_info.res_url == "DefaultResource/Spherical_Image/SphericalImage.png"){
                    
                } else{

                    //// 跳出錯誤提示
                    let errorText = document.createElement('div');
                    errorText.style.position = 'absolute';
                    errorText.style.top = '30%';
                    errorText.style.left = '0%';
                    errorText.style.width = '100%';
                    errorText.style.height = '40%';
                    errorText.style.color = 'black';
                    errorText.style.backgroundColor = 'rgba(128,128,128,0.5)';
                    errorText.style.pointerEvents = 'none';
                    errorText.style.fontSize = '24px';
                    errorText.style.zIndex = 3;

                    document.body.appendChild( errorText )

                    let text = document.createElement('div');
                    text.className = 'centerText';
                    text.style.whiteSpace = 'pre-wrap';
                    text.textContent = '此專案的環景影片/圖片無法於瀏覽器支援，改為預設場景'
                    errorText.appendChild( text );

                    setTimeout(function(){
                        errorText.remove();
                    }, 8000);

                }

                //// 判斷是否「場景相同來源」，是的話直接隱藏「載入頁面」。否的話執行載入新圖片
                let skySameSrc = false;
                if (aSky.getAttribute('material') ){
                    if (aSky.getAttribute('material').src == sceneSky_info.res_url ){
                        // console.log(' VRFunc.js: _loadSky same src '  );
                        skySameSrc = true;
                    }
                }

                if ( skySameSrc == true ){
                    console.log("VRFunc.js: _loadSky: spherical_image same as previous(404)");

                    
                    skyResolve(aSky);
                } else {

                    aSky.setAttribute("material", {src: "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png" });

                    aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite
                    
                    var handleLoadingPage = function(){
                        console.log("VRFunc.js: _loadSky: spherical_image materialtextureloaded, remove loading page ");
                        
                        //// 將自己移除事件，避免重複觸發事件
                        aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );
                    };
                    aSky.addEventListener("materialtextureloaded" , handleLoadingPage );
                    skyResolve(aSky);
                }

                
            } else {
                switch ( sceneSky_info.main_type ){
                    case "spherical_image":
                    case "image":
                        // console.log("check ver3.5 sky object", sceneSky_info)
                        if (document.getElementById("sky")){
                            aSky = document.getElementById("sky");
                            if (aSky.localName == "a-sky"){
                                //// 之前的 sky 是圖片，什麼都不用作
                            }else if (aSky.localName == "a-videosphere"){
                                //// 之前的 sky 是影片
                                aSky.remove();
                                aSky = document.createElement('a-sky');
                                aSky.setAttribute('id', "sky" );
                                vrScene.appendChild(aSky);
                            }
                        }else{
                            aSky = document.createElement('a-sky');
                            aSky.setAttribute('id', "sky" );
                            vrScene.appendChild(aSky);
                        }
                        

                        if( sceneSky_info.res_url == "DefaultResource/Spherical_Image/SphericalImage.png"){
                            sceneSky_info.res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
                        }

                        //// 判斷是否「場景相同來源」，是的話直接隱藏「載入頁面」。否的話執行載入新圖片
                        let skySameSrc = false;
                        if (aSky.getAttribute('material') ){
                            if (aSky.getAttribute('material').src == sceneSky_info.res_url ){
                                // console.log(' VRFunc.js: _loadSky same src '  );
                                skySameSrc = true;
                            }
                        }

                        if (skySameSrc == false){
                            // console.log("materialSRC", sceneSky_info.res_url)
                            aSky.setAttribute("material", {"src": sceneSky_info.res_url }); 

                            var handleLoadingPage = function(){
                                console.log("VRFunc.js: _loadSky: spherical_image materialtextureloaded, remove loading page ");
                                
                                
                                //// 將自己移除事件，避免重複觸發事件
                                aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );
                                skyResolve(aSky);
                            };
                            aSky.addEventListener("materialtextureloaded" , handleLoadingPage );

                        }else{
                            console.log("VRFunc.js: _loadSky: spherical_image same as previous  ");

                            
                            skyResolve(aSky);
                        }

                        aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite

                        break;

                    case "spherical_video":
                        ////// a-assets
                        let assets = document.getElementById("makarAssets");
                        
                        ////// mp4 video 
                        // var aSky = document.createElement('a-videosphere');
                        if (document.getElementById("sky")){
                            aSky = document.getElementById("sky");
                            if (aSky.localName == "a-sky"){
                                //// 之前的 sky 是圖片，刪掉再創新的
                                aSky.remove();
                                aSky = document.createElement('a-videosphere');
                                aSky.setAttribute('id', "sky" );
                                vrScene.appendChild(aSky);
                            }else if (aSky.localName == "a-videosphere"){
                                //// 之前的 sky 是影片，不用額外動作
                                
                            }
                        }else{
                            aSky = document.createElement('a-videosphere');
                            aSky.setAttribute('id', "sky" );
                            vrScene.appendChild(aSky);
                        }

                        // aSky.setAttribute("src", self.VRSceneResult[projIndex].scenes[0].res_url ); //  this is work, but hard to control the tag

                        let skyVideo = document.createElement("video");
                        skyVideo.src = sceneSky_info.res_url;  
                        skyVideo.playsInline = true;
                        skyVideo.autoplay = true;
                        //// 預設「靜音」								
                        skyVideo.muted = true;

                        skyVideo.setAttribute("loop", "true");
                        skyVideo.setAttribute('type', 'video/mp4');
                        if (window.Browser){
                            if ( window.Browser.name == undefined || window.Browser.name == "safari"){
                            // if ( Browser.mobile == true || Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                skyVideo.muted = true;
                            }
                        }
                        skyVideo.onloadedmetadata = function() {
                            console.log("VRFunc.js: _loadSky: spherical_video onloadedmetadata");
                            skyVideo.play();
                        }

                        skyVideo.setAttribute('crossorigin', 'anonymous');
                        // skyVideo.setAttribute('id', self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount );
                        skyVideo.setAttribute('id', scene_id + "_" + loadSceneCount );

                        // skyVideo.play(); // play pause
                        skyVideo.setAttribute("autoplay", "true" ); 
                        // skyVideo.setAttribute("loop", "true" ); 

                        assets.appendChild(skyVideo); ////// add video into a-assets
                        // aSky.setAttribute("src", "#skyVideo" );  
                        // aSky.setAttribute("src", "#"+self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount ); // 
                        aSky.setAttribute("src", "#" + scene_id + "_" + loadSceneCount ); // 


                        aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite
                        

                        var handleLoadingPage = function(){
                            console.log("VRFunc.js: _loadSky: spherical_video materialtextureloaded, remove loading page ");
                            
                            //// 將自己移除事件，避免重複觸發事件
                            aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );

                            skyResolve(aSky);
                        };
                        aSky.addEventListener("materialtextureloaded" , handleLoadingPage );

                        break;

                }
                console.log("VRFunc.js: _loadSky: aSky=", aSky );

            }
            
        });

    });    

    return pSky;

};
