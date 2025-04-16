import { UrlExists, checkDefaultImage } from "../vrUtility.js"
import { setTransform } from "./setTransform.js";

//// the html will use this function to load image
//// It is sad that I cant use default a-plane tag to get the image width/height 
export function loadTexture( obj, position, rotation, scale ) {
    // console.log("VRFunc.js: VRController: _loadTexture, obj=", obj, position, rotation, scale );
    let self = this
    
    //// 檢查是否為「預設物件」
    checkDefaultImage( obj );
    
    let pTexture = new Promise( function( textureResolve ){
        //// ver. 3.5 res_url 是 vrController 在 loadSceneObjects 加上的
        UrlExists( obj.res_url , function( retStatus ){
            if ( retStatus == true ){

                var texture = new THREE.TextureLoader().load( obj.res_url );
                
                let url_spit_length = obj.res_url.split(".").length
                let imgType = obj.res_url.split(".")[url_spit_length-1].toLowerCase();

                let plane;                
                
                // console.log(" _loadTexture_: _sub_type  ", obj.sub_type)

                if ( obj.sub_type == 'png' || obj.sub_type == 'jpg' || obj.sub_type == 'jpeg' || obj.sub_type == 'bmp' ){
                    imgType = obj.sub_type;
                    
                    // console.log(" _loadTexture_: _imgType ", imgType)

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
                    console.log('VRFunc.js: _loadTexture: sub_type empty, create empty plane ');
                    plane = document.createElement("a-plane");
                    textureResolve( plane );
                    return;
                }
                //20191101-end-thonsha-mod

                plane.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
                plane.setAttribute('crossorigin', 'anonymous');
                

                //[start-20240408-renhaohsu-modify]//
                let chromaKey, slope, threshold, transparentBehav;                    
                //20191108-start-thonsha-add
                let transparentImage = false
                if(makarUserData.scenesData.scenes[self.sceneIndex].behav && Array.isArray(makarUserData.scenesData.scenes[self.sceneIndex].behav)){

                    transparentBehav = makarUserData.scenesData.scenes[self.sceneIndex].behav.find(b => b.obj_id == obj.generalAttr.obj_id && b.behav_type == "Transparent")
                    if(transparentBehav){
                        console.log("%c ImageModule.js _loadImage: transparentBehav=", 'color:BlanchedAlmond;', transparentBehav)
                        transparentImage = true;
                        [chromaKey, slope, threshold] = [transparentBehav.color, transparentBehav.slope, transparentBehav.threshold]
                    }
                }
                //[end-20240408-renhaohsu-modify]//

                if (transparentImage && transparentBehav){
                    let rgba = chromaKey.split(",");
                    let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

                    
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

                    //20191127-start-thonsha-mod
                    // let HSV = transparentBehav.color.split(",");
                    // let keyH = parseFloat(HSV[0]);
                    // let keyS = parseFloat(HSV[1]);
                    // let keyV = parseFloat(HSV[2]);

                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
                        if (transparentBehav.mode == 'RGB'){
                            // console.log("===============RGB==============")
                            plane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; side:double; depthWrite:false; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
                        }
                        else if (transparentBehav.mode == 'HSV'){
                            // console.log("VRFunc.js: image HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
                            // plane.setAttribute( "material", "shader: HSVMatting; transparent: true; side:double; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";" ); //// thonsha add shader
                            plane.setAttribute( "material", "shader: HSVMatting; transparent: true; side:double; depthWrite:false; _keyingColorH:"+_hsv[0]+"; _keyingColorS:"+_hsv[1]+"; _keyingColorV:"+_hsv[2]+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";" ); //// thonsha add shader
                        }
                    }
                    else if (imgType == "gif"){
                        
                        if (transparentBehav.mode == 'RGB'){
                            plane.setAttribute("geometry", "primitive: plane");
                            plane.setAttribute("material", "shader:gif_RGB;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; color: #"+color.getHexString()+"; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";");
                        }
                        else if (transparentBehav.mode == 'HSV'){
                            plane.setAttribute("geometry", "primitive: plane");
                            // plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
                            plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; _keyingColorH:"+_hsv[0]+"; _keyingColorS:"+_hsv[1]+"; _keyingColorV:"+_hsv[2]+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
                        }

                    }
                    //20191127-end-thonsha-mod
                }
                else{
                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
                        // plane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
                        plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:false" ); //// 圖片不受場上光源影響
                        // plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:true" ); //// 圖片不受場上光源影響
                        // plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:false; depthTest:false;"); //// 圖片不受場上光源影響

                        plane.setAttribute("geometry", "primitive: plane");

                    }
                    else if (imgType == "gif"){
                        plane.setAttribute("geometry", "primitive: plane");
                        plane.setAttribute("material", "side:double; shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false");
                    }
                    
                }

                if (obj.behav){                      
                    //[start-20230811-howardhsu-modify]//
                    if (obj.behav.length==0 && transparentImage){                        
                    //[end-20230811-howardhsu-modify]//
                        plane.setAttribute('class', "unclickable" ); //// fei add
                    }
                    else{
                        plane.setAttribute('class', "clickable" );
                    }
                }
                //[start-20231229-renhaohsu-add]//
                else if (obj.generalAttr.logic){
                    plane.setAttribute('class', "clickable" ); 
                }
                //[end-20231229-renhaohsu-add]//
                else{
                    plane.setAttribute('class', "unclickable" ); //// fei add
                }
                //20191101-end-thonsha-mod


                setTransform(plane, position, rotation, scale);
                self.makarObjects.push( plane );

                //// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
                let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
                plane.addEventListener("materialtextureloaded", function(evt){
                    // console.log("VRFunc.js: _loadTexture: _materialtextureloaded: plane = " , plane.object3D , evt );
                    evt.detail.texture.anisotropy = maxAnisotropy;
                    evt.detail.texture.needsUpdate = true;
                });

                plane.addEventListener("loaded", function(evt){
                    
                    // console.log(evt);
                    if (evt.target == evt.currentTarget){
                        // console.log("VRFunc.js: _loadTexture: loaded target same" );

                        // setTimeout(function(){
                        // 	plane.setAttribute("cursor-listener", true ); //// fei add
                        // }, 500 );

                        let timeoutID = setInterval( function () {
                            // let tempTexture = plane.object3D.children[0].material.map;
                            if (texture.image){ 											
                                plane.object3D.children[0].scale.set(texture.image.width*0.01, texture.image.height*0.01 , 1);
                                plane.setAttribute("heightForQuiz", texture.image.height*0.01 ); //// fei add
                                window.clearInterval(timeoutID);
                            }
                        }, 1);

                        plane.object3D.children[0].material.reflectivity = 0;
                        
                        let r = new THREE.Vector3();
                        r.set(0,Math.PI, 0); 
                        plane.object3D.children[0].rotation.setFromVector3(r);

                        //// 由於圖片設定為無光標準，且深度寫入為否，故設定繪製排序往前，讓同距離的繪製可以顯示
                        plane.object3D.children[0].renderOrder = 1;

                        plane.object3D["makarObject"] = true; 
                        plane.object3D["makarType"] = 'image'; 


                        if ( obj.behav ){
                            plane.object3D["behav"] = obj.behav ;
                            
                            //// 載入時候建制「群組物件資料」「注視事件」
                            self.setObjectBehavAll( obj );
                        }
                        if(obj.behav_reference){
                            plane.object3D["behav_reference"] = obj.behav_reference ;
                        }
                        
                        if (obj.main_type=="button"){
                            plane.object3D["main_type"] = obj.main_type ;
                            plane.object3D["sub_type"] = obj.sub_type ;
                            plane.setAttribute('class', "clickable" );
                        }

                        textureResolve( plane );

                    }else{
                        console.log("VRFunc.js: _loadTexture: loaded target different" );
                    }
                });
                //20191031-end-thonsha-mod

                //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                if ( obj.generalAttr.active == false ){
                    plane.setAttribute("visible", false);
                    plane.setAttribute('class', "unclickable" );
                }

                //20191227-start-thonsha-add
                console.log("VRFunc.js: _loadTexture: image behav_reference: ",obj.behav_reference);
                // if(obj.behav_reference){
                //     for(let i=0; i<obj.behav_reference.length;i++){
                //         // if (obj.behav_reference[i].behav_name == 'ShowImage'){
                //         if (obj.behav_reference[i].behav_type == 'Display'){
                //             plane.setAttribute("visible", false);
                //             plane.setAttribute('class', "unclickable" );
                //             break;
                //         }
                //     }
                    
                // }
                //20191227-end-thonsha-add

                //20191029-start-thonhsa-add
                if(obj.generalAttr.obj_parent_id){
                    // plane.setAttribute("visible", false);
                    // plane.setAttribute('class', "unclickable" );
                    let timeoutID = setInterval( function () {
                        let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                        if (parent){ 
                            if(parent.object3D.children.length > 0){
                                parent.appendChild(plane);
                                window.clearInterval(timeoutID);
                            }
                        }
                    }, 1);
                }
                else{
                    self.vrScene.appendChild(plane);
                }
                //20191029-end-thonhsa-add

                // if (obj.main_type=="button"){
                // 	return plane;
                // }

            }else{
                

                console.log("VRFunc.js: _loadTexture , obj url not exist ", obj );
                
                obj.main_type = 'model';
                obj.sub_type = 'glb';
                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

                self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex )

                textureResolve( 1 );

            }
        });



    });

    return pTexture;
    
}

//[start-20200315-fei0092-add]//
export function loadTexture2D ( obj, index, sceneObjNum, position=null, rotation=null, scale=null ){
    // console.log("VRFunc.js: VRController: _loadTexture2D , obj=", obj, position, rotation, scale );

    let self = this;

    let pTexture2D = new Promise( function( texture2DResolve ){
        var loader = new THREE.TextureLoader();
        loader.load(
            obj.res_url,
            function ( texture ) {
                console.log("VRFunc.js: _loadTexture2D: texture WH=", texture.image.width , texture.image.height );
                
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
                        rectP=trans.rectP; rectSizeDelta=trans.rectSizeDelta; rectScale=trans.rectScale; rectR=trans.rectR;
                    }else{
                        texture2DResolve( false );
                        return;
                    }
                    //[end-20231013-howardhsu-modify]//

                }else{
                    let trans = getObj2DInfo350();
                    if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                        rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale; rectR=trans.rectR;
                    }else{
                        texture2DResolve( false );
                        return;
                    }

                }

                //[start-20231013-howardhsu-add]//
                function getObj2DInfo350 (){
                    // console.log('VRFunc.js: _loadSceneObjects: image: --------- 2d image    getObj2DInfo350')

                    let tempInfo = {};
                    //// 位置    縮放    尺寸   旋轉
                    let rectP, rectSizeDelta, rectScale , rectR ; 
                    if ( obj.transformAttr.rect_transform && Array.isArray( obj.transformAttr.rect_transform ) && obj.transformAttr.rect_transform.length > 0 ){

                        if ( !Number.isFinite( self.selectedResolutionIndex )   ){
                            console.warn(' _getObj2DInfo350: error, missing _selectedResolutionIndex', self.selectedResolutionIndex );
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
                            rectScale.x = rectScale[0];
                            rectScale.y = rectScale[1];

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

                // console.log(' ppppppppppppppp ' , rectP, rectSizeDelta, rectScale , scale );
                
                texture.flipY = false ; 
                //// scale part only x, y , temp work on both android and iOS
                console.log("VRFunc.js: _loadTexture2D: innerWH , camera2D ", innerWidth, innerHeight , self.vrScene.clientWidth, self.vrScene.clientHeight );

                let width, height;
                let scaleRatioXY = self.scaleRatioXY;
                // width  = rectSizeDelta[0] * scale.x * scaleRatioXY ;
                // height = rectSizeDelta[1] * scale.y * scaleRatioXY ;
                
                //// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
                width  = rectSizeDelta[0] * scaleRatioXY ;
                height = rectSizeDelta[1] * scaleRatioXY ;


                let textureUrl = obj.res_url;
                let imgType = obj.sub_type ;

                let rootObject = new THREE.Object3D();
                rootObject.makarType = "image2D";

                let transparentImage = false

                //[start-20240408-renhaohsu-modify]//
                let chromaKey, slope, threshold, transparentBehav;                    
                //20191108-start-thonsha-add
                if(makarUserData.scenesData.scenes[self.sceneIndex].behav && Array.isArray(makarUserData.scenesData.scenes[self.sceneIndex].behav)){

                    transparentBehav = makarUserData.scenesData.scenes[self.sceneIndex].behav.find(b => b.obj_id == obj.generalAttr.obj_id && b.behav_type == "Transparent")
                    if(transparentBehav){
                        console.log("%c  ImageModule.js _loadImage: transparentBehav=", 'color:BlanchedAlmond;', transparentBehav)
                        transparentImage = true;
                        let _color = transparentBehav.color.split(",")
                        chromaKey = [parseFloat(_color[0]), parseFloat(_color[1]), parseFloat(_color[2])] 
                        slope = transparentBehav.slope 
                        threshold = transparentBehav.threshold
                    }
                }
                //[end-20240408-renhaohsu-modify]//

                let plane;
                let gifObject ;
                if (transparentImage && transparentBehav){
                    
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

                    // let HSV = transparentBehav.HSV.split(",");
                    // let keyH = parseFloat(HSV[0]);
                    // let keyS = parseFloat(HSV[1]);
                    // let keyV = parseFloat(HSV[2]);
                    let chromaKeyMaterial;
                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){
                        if (transparentBehav.mode == "RGB"){
                            chromaKeyMaterial = new THREE.ChromaKeyMaterial({
                                map: texture , 
                                keyColor: chromaKey ,
                                side: THREE.DoubleSide, 
                                slope: slope,
                                threshold: threshold,
                            });
                            
                        } else if (transparentBehav.mode == "HSV"){
                            chromaKeyMaterial = new THREE.HSVMattingMaterial({
                                map: texture , 
                                side: THREE.DoubleSide, // DoubleSide
                                _keyingColorH: _hsv[0],
                                _keyingColorS: _hsv[1],
                                _keyingColorV: _hsv[2],
                                // _keyingColorH: keyH,
                                // _keyingColorS: keyS,
                                // _keyingColorV: keyV,
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
                            new THREE.PlaneBufferGeometry( width , height , 0 ), 
                            chromaKeyMaterial,
                        );
                    }else if (imgType == "gif"){

                        // gifObject = new THREE.gifAnimator();
                        // gifObject.init({ src: textureUrl , side: THREE.DoubleSide, transparent: true, opacity: 1.0, autoplay: true, chroma: transparentBehav });
                        // rootObject.gifObject = gifObject;

                        // //// 上下顛倒
                        // if ( gifObject.__texture.flipY ){
                        //     gifObject.__texture.flipY = false;
                        // }

                        // plane = new THREE.Mesh(
                        //     new THREE.PlaneBufferGeometry( width, height , 0 ),
                        //     gifObject.material,
                        // );


                        plane = document.createElement("a-entity");
                        // plane.setAttribute("geometry", "primitive: plane; width:" + width +"; height:" + height + ";" );
                        plane.setAttribute("material", "side:double; shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false; visible: false; ");


                        // let rgba = chromaKey.split(",");
                        let color = new THREE.Color(parseFloat(chromaKey[0]),parseFloat(chromaKey[1]),parseFloat(chromaKey[2]));
                        console.log("three color", color)
                        
                        if (transparentBehav.mode == 'RGB'){
                            plane.setAttribute("geometry", "primitive: plane; width:" + width +"; height:" + height + ";" );
                            plane.setAttribute("material", "shader:gif_RGB;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; color: #"+color.getHexString()+"; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";");
                        }
                        else if (transparentBehav.mode == 'HSV'){
                            plane.setAttribute("geometry", "primitive: plane; width:" + width +"; height:" + height + ";" );
                            // plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
                            plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; _keyingColorH:"+_hsv[0]+"; _keyingColorS:"+_hsv[1]+"; _keyingColorV:"+_hsv[2]+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
                        }

                    }
                    
                    
                } else {

                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){

                        plane = new THREE.Mesh( 
                            new THREE.PlaneBufferGeometry( width, height , 0 ), 
                            new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true  } ),
                        );

                    } else if (imgType == "gif"){

                        plane = document.createElement("a-entity");
                        plane.setAttribute("geometry", "primitive: plane; width:" + width +"; height:" + height + ";" );
                        plane.setAttribute("material", "side:double; shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false; visible: false; ");

                    }

                }

                // if (obj.behav_reference){
                //     rootObject.behav_reference = obj.behav_reference;
                //     for (let j = 0; j < obj.behav_reference.length; j++){
                //         if (obj.behav_reference[j].behav_type == "Display"  ){
                //             rootObject.visible = false;
                //             if (imgType == "gif" ){
                //                 //// 這邊只有 pause不恰當，因為 gifAnimator 中的[__ready]在被呼叫的時候，會以 autoplay 為標準決定是否執行play
                //                 //// 無法確定 __ready執行的時間，假如已經執行過，這邊 pause則會暫停更新畫面，假如還沒執行過，這邊設 autoplay false會讓 ready時不 play
                //                 gifObject.pause();
                //                 gifObject.__autoplay = false;

                //             }
                //         }
                //     }
                // }


                // // for double side 
                // var plane = new THREE.Mesh(
                // 	new THREE.PlaneBufferGeometry( width , height , 0 ),
                // 	new THREE.MeshBasicMaterial( { map : texture,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
                // );
                
                if ( obj.behav ){
                    rootObject["behav"] = obj.behav ;

                    //// 載入時候建制「群組物件資料」「注視事件」
                    self.setObjectBehavAll( obj );
                }
                
                if (obj.generalAttr.active == false){
                    rootObject.visible = false;
                }

                // plane.makarType = 'image2D';
                rootObject["makarObject"] = true ;
                rootObject["obj_id"] = obj.generalAttr.obj_id ;

                if (obj.main_type=="button"){
                    // console.log("for 2d quiz button")
                    // rootObject["main_type"] = obj.main_type ;
                    rootObject["sub_type"] = obj.sub_type ;
                }

                //20191029-start-thonhsa-add
                if(obj.generalAttr.obj_parent_id){
                    // console.log("______VRFunc.js: _loadTexture2D: obj(parent) ", obj );

                    let setIntoParent = function(){
                        let isParentSet = false;
                        for (let i = 0; i < self.makarObjects2D.length; i++ ){
                            if ( self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id  ){
                                isParentSet = true;
                            }
                        }

                        if ( isParentSet == false ) {
                            setTimeout(setIntoParent, 500 );
                            console.log("______VRFunc.js: _loadTexture2D: isParentSet   ", obj , self.makarObjects2D );

                        }else{
                            for (let i = 0; i < self.makarObjects2D.length; i++){
                                if (self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id){
                                    
                                    //// 大小
                                    // rootObject.scale.set( scale.x , scale.y, 1 );
                                    rootObject.scale.set( rectScale.x , rectScale.y, 1 );

                                    //// 改為統一移動比例
                                    rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                                    rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
                                    rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

                                    //// 旋轉
                                    // rootObject.rotateZ( -1*rectR.z )                                
                                    rootObject.rotateZ( rectR.z )                                

                                    if ( imgType == 'gif'  ){

                                        plane.addEventListener("loaded", function(evt){
                                    
                                            if (evt.target == evt.currentTarget){
                
                                                //// 取得圖片原始大小
                                                if ( plane && plane.object3D && plane.object3D.children && plane.object3D.children.length == 1  &&
                                                    plane.object3D.children[0] && plane.object3D.children[0].material
                                                ){

                                                    let m = plane.object3D.children[0].material ;

                                                    //// 由於"有去背behav的gif"使用的shader流程不同，分開判斷。 沒去背：
                                                    if ( m && m.map && m.map.image && m.map.image.width > 2 && m.map.image.height > 2 ){
                                                        //// gif上下顛倒
                                                        m.map.flipY = false;
                                                    }
                                                    
                                                    //// 有去背behav的gif (沒去背的gif也有可能沒進上面的區塊)  註: gif.self是在 aframe-gif-shader為此而新增的
                                                    if ( plane && plane.gif && plane.gif.self && plane.gif.self.__texture ){
                                                        //// gif上下顛倒
                                                        plane.gif.self.__texture.flipY  = false

                                                        //// 貼圖模糊問題: 把anisotropy提升到maxAnisotropy (但測試時看不出效果 暫時擱置) 
                                                        let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
                                                        if(maxAnisotropy){
                                                            plane.gif.self.__texture.anisotropy = maxAnisotropy
                                                            plane.gif.self.__texture.needsUpdate = true 
                                                            // console.log( "plane loaded maxAnisotropy needsUpdate" , plane.gif.self.__texture.needsUpdate)
                                                        }
                                                    }
                                                    
                                                    m.visible = true;
                                                    // console.log("_loadTexture2D: gif iwh ", m.map.image.width , m.map.image.height );
                                                    // plane.object3D.children[0].scale.set( m.map.image.width * 1, m.map.image.height * 1 , 1);
                                                    // clearInterval ( timeoutID );

                                                    rootObject.add( plane.object3D );
                                                    self.makarObjects2D[i].add(rootObject);
                                                    self.makarObjects2D.push(rootObject);

                                                    rootObject["makarObject"] = true ;
                                                    rootObject["obj_id"] = obj.generalAttr.obj_id ;
                                
                                                    plane.removeFromParent();
                                                    plane.remove();

                                                    texture2DResolve( rootObject );

                                                
                                                }

                        
                                            }else{
                                                console.log("_loadTexture2D: loaded target different" );
                                            }
                                        });

                                        self.vrScene.appendChild(plane);

                                    }else{

                                        rootObject.add( plane );
                                        self.makarObjects2D[i].add(rootObject);
                                        self.makarObjects2D.push(rootObject);

                                        texture2DResolve( rootObject );

                                        console.log("______VRFunc.js: _loadTexture2D: parent exit, set obj(parent) ", obj , plane , self.makarObjects2D.slice() , performance.now());

                                    }



                                }
                            }

                        }
                    };
                    setIntoParent();

                } else{
                    console.log("VRFunc.js: VRController: _loadTexture2D: obj() ", obj );

                    //// 大小
                    // rootObject.scale.set( scale.x , scale.y, 1 );
                    rootObject.scale.set( rectScale.x , rectScale.y, 1 );

                    //// 位置
                    rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                    rootObject.translateY( -rectP[1]*scaleRatioXY ) ;
                    rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

                    //// 旋轉
                    rootObject.rotateZ( rectR.z )      

                    // console.log("______VRFunc.js: _loadTexture2D: rectP", rectP );

                    self.makarObjects2D.push(rootObject);
                    self.scene2D.add(rootObject);

                    //// 2024 05 07 圖片類型會影響載入
                    if ( imgType == 'gif' ){
                        
                        //// gif 流程，基本上等同於 3D gif
                        // 1. 由 aframe 流程載入，先放置於 3D 場景下，但是材質不可見
                        // 2. 等待載入完成，找到 three 物件
                        // 3. 將 three 物件放入 2D 場景，刪除 3D 場景物件，並將材質可見打開
                        
                        plane.addEventListener("loaded", function(evt){

                            if (evt.target == evt.currentTarget){

                                console.log("_loadTexture2D: gif loaded target same" );

                                //// 取得圖片原始大小
                                if ( plane && plane.object3D && plane.object3D.children && plane.object3D.children.length == 1  &&
                                    plane.object3D.children[0] && plane.object3D.children[0].material
                                ){

                                    let m = plane.object3D.children[0].material ;
                                    
                                    //// 由於"有去背behav的gif"使用的shader流程不同，分開判斷。 沒去背：
                                    if ( m && m.map && m.map.image && m.map.image.width > 2 && m.map.image.height > 2 ){
                                        //// gif上下顛倒
                                        m.map.flipY = false;
                                    }

                                    //// 有去背behav的gif (沒去背的gif也有可能沒進上面的區塊)  註: gif.self是在 aframe-gif-shader為此而新增的
                                    if ( plane && plane.gif && plane.gif.self && plane.gif.self.__texture ){
                                        //// gif上下顛倒
                                        plane.gif.self.__texture.flipY  = false

                                        //// 貼圖模糊問題: 把anisotropy提升到maxAnisotropy (但測試時看不出效果 暫時擱置) 
                                        let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
                                        if(maxAnisotropy){
                                            plane.gif.self.__texture.anisotropy = maxAnisotropy
                                            plane.gif.self.__texture.needsUpdate = true 
                                            // console.log( "plane loaded maxAnisotropy needsUpdate" , plane.gif.self.__texture.needsUpdate)
                                        }
                                    }

                                    m.visible = true;

                                    rootObject.add( plane.object3D );
                                    rootObject["makarObject"] = true ;
                                    rootObject["obj_id"] = obj.generalAttr.obj_id ;
                
                                    plane.removeFromParent();
                                    plane.remove();

                                    texture2DResolve( rootObject );
                                    console.log("______VRFunc.js: _loadTexture2D: self.makarObjects2D.slice()=", self.makarObjects2D.slice() , performance.now())

                                }

        
                            }else{
                                console.log("_loadTexture2D: loaded target different" );
                            }
                        });

                        self.vrScene.appendChild(plane);
    

                    }else{
                        rootObject.add(plane);
                        rootObject["makarObject"] = true ;
                        rootObject["obj_id"] = obj.generalAttr.obj_id ;
    
                        texture2DResolve( rootObject );
                        console.log("______VRFunc.js: _loadTexture2D: self.makarObjects2D.slice()=", self.makarObjects2D.slice() , performance.now())
    
                    }


                }
                //20191029-end-thonhsa-add
                
                // console.log("VRFunc.js: VRController: _loadTexture2D ,obj=", obj );

            },
            undefined,
            function ( err ) {
                console.error( 'An error happened. _loadTexture2D , err=', err);
            }
        );

    });
    
    return pTexture2D;

}