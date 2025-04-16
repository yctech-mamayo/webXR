import { setTransform } from "./setTransform.js";

export function loadText( obj, position, rotation, scale, isTempTextObj=false ) {
    //20191204-start-thonsha-add  
    // console.log("VRFunc.js: _laodText: obj, position, rotation, scale = ", obj, position, rotation, scale	);
    
    // let self = this
    
    let pText = new Promise( ( textResolve ) => {

        let anchor = document.createElement('a-entity');
            
        // anchor.setAttribute("geometry","primitive: sphere; radius: 0.05" );
        // anchor.setAttribute("material","roughness: 0.48; color:	#FF0000");
        setTransform(anchor, position, rotation, scale);
        anchor.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 

        // this.scaleRatioXY = this.scaleRatioXY*1.2
        console.log("scaleRatioXY=", this.scaleRatioXY)

        if( !isTempTextObj ){
            this.makarObjects.push( anchor );
        } else {
            //// isTempTextObj: 是 YT(not supported)物件底下的文字物件 暫時不放到makarObjects
        }

        if (obj.behav){  
            anchor.setAttribute('class', "clickable" ); //// fei add
        } else if (obj.main_type == "button"){  //// Quiz 單選題的文字選項、多選題的OK按鈕，在quiz載入時會被加上main_type "button"
            anchor.setAttribute('class', "clickable" ); 
        }
        //[start-20231229-renhaohsu-add]//
        else if (obj.generalAttr.logic){
            anchor.setAttribute('class', "clickable" ); 
        }
        //[end-20231229-renhaohsu-add]//
        else{
            anchor.setAttribute('class', "unclickable" ); //// fei add
        }
        
        // let textEntity = document.createElement('a-entity');
        // // textEntity.setAttribute("geometry","primitive: plane; width: auto; height: auto; width: auto");
        // // textEntity.setAttribute("material","color: #FFFFFF");
        // // textEntity.setAttribute("text","value: "+obj.content+"; color:red; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json");
        // // textEntity.setAttribute("text","value: hello; color:red; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/creepster/Creepster-Regular.json");
        // textEntity.setAttribute("text","value: "+obj.content+"; color:blue; font:font/edukai-4.0-msdf.json");
        // =======================================================================
        let textEntity = document.createElement('a-text');
        //// 還是要加預設的 mesh，為了觸碰事件 
        textEntity.setAttribute("geometry","primitive:plane; width: auto; height: auto; skipCache: true;");
        textEntity.setAttribute("material","opacity: 0.0 ; depthWrite:false; color:#000000; side:double;");

        let textList = obj.typeAttr.content.split('\n');
        let longestSplit = 0;
        const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
        const isChinese = (str) => REGEX_CHINESE.test(str);
        for (let i = 0; i < textList.length;i++) {
            let textLength = 0;
            for (let j = 0; j <  textList[i].length; j++) {
                if(isChinese(textList[i][j])){  // chinese
                    textLength += 1.6;
                }
                else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
                    textLength += 1;
                }
                else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
                    // textLength += 0.85;
                    textLength += 1.0;
                }
                else if(!isNaN(textList[i][j] * 1)){ //numeric
                    textLength += 1;
                }
                else{ // other symbols
                    textLength += 1.25;
                }
                
            }
            // console.log( textList[i], textLength);
            if (textLength > longestSplit) longestSplit =textLength;
        }
        textEntity.setAttribute("value",obj.typeAttr.content);
        // textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115  20201027：這個數值目前沒有用處
        // textEntity.setAttribute("wrap-count",longestSplit); // 1 for 1    20201027：這個數值目前沒有用處
        textEntity.setAttribute("anchor","center");
        textEntity.setAttribute("align","left");

        textEntity.setAttribute("backcolor", obj.typeAttr.back_color ); //// 這邊注意一重點，自己設定的 attribute 不能使用 『大寫英文』，否則aframe data內會找不到，參照 text物件
        textEntity.setAttribute("textcolor", obj.typeAttr.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要
        textEntity.setAttribute("side","double");

        var fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
        let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
                fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
                fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
        // fonts = [ fontUrl + "1-msdf.json" ];
        textEntity.setAttribute("font", fonts );

        textEntity.setAttribute("negate","false");
        textEntity.setAttribute('crossorigin', 'anonymous');

        let rgb = obj.typeAttr.color.split(",");
        let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
        textEntity.setAttribute("color", "#"+color.getHexString());

        // textEntity.setAttribute( "id", obj.typeAttr.obj_id );//// fei add 
        // if (obj.behav){
        // 	textEntity.setAttribute('class', "clickable" ); //// fei add
        // }
        // else if (obj.main_type == "button"){
        // 	textEntity.setAttribute('class', "clickable" ); //// fei add
        // }
        // else{
        // 	textEntity.setAttribute('class', "unclickable" ); //// fei add
        // }
        
        // setTransform(textEntity, position, rotation, scale);
        // this.makarObjects.push( textEntity );

        //// 因為無法確認「形狀確認」「物件載入完成」那個先行完成，所以增加判定
        let loadedCheck = 0;

        function checkGeometrySet(evt){
            console.log("VRFunc.js: _loadText: textEntity geometry-set: evt=" , evt  );
            if ( loadedCheck == 0 ){
                loadedCheck = 1;
            }else if ( loadedCheck == 1 ){
                textResolve( textEntity );
            }
            textEntity.removeEventListener("geometry-set", checkGeometrySet );
        }
        textEntity.addEventListener("geometry-set", checkGeometrySet );

        // textEntity.addEventListener("geometry-set", function(evt){
        // 	console.log(" textEntity geometry-set: evt=" , evt , textEntity.object3D  );
        // 	textResolve( textEntity );
        // });

        textEntity.addEventListener("loaded", (evt) => {
            if (evt.target == evt.currentTarget){

                // console.log("VRFunc.js: _loadText loaded textEntity=" , textEntity.object3D, textEntity.object3D.parent.scale.x );

                // console.log("tttexttt", obj)
                // setTimeout(function(){
                // 	textEntity.setAttribute("cursor-listener", true ); //// fei add
                // }, 500 );

                let r = new THREE.Vector3();
                r.set(0,Math.PI, 0); 
                textEntity.object3D.rotation.setFromVector3(r);
                // textEntity.object3D.children[0].rotation.setFromVector3(r);
                // textEntity.object3D.children[0].position.x = -textEntity.object3D.children[0].position.x;
                // textEntity.object3D["makarObject"] = true; 
                
                if( isTempTextObj ){
                    //// isTempTextObj 是 YT(not supported)物件底下的文字物件 加上Attribute方便區別
                    textEntity.object3D["isTempTextObj"] = true;
                } else {
                    anchor.object3D["makarObject"] = true; 
                }

                if ( obj.behav ){  
                    anchor.object3D["behav"] = obj.behav ;

                    //// 載入時候建制「群組物件資料」「注視事件」
                    this.setObjectBehavAll( obj );
                }
                if(obj.behav_reference){  
                    anchor.object3D["behav_reference"] = obj.behav_reference ;
                }
                if (obj.main_type=="button"){
                    // textEntity.object3D["main_type"] = obj.main_type;  
                    anchor.object3D["main_type"] = obj.main_type;
                }

                if ( loadedCheck == 0 ){
                    loadedCheck = 1;
                }else if ( loadedCheck == 1 ){
                    textResolve( textEntity );
                }
                
            }
        });


        ///
        anchor.appendChild(textEntity);
        ///

        //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
        if ( obj.generalAttr.active == false ){
            anchor.setAttribute("visible", false);
            anchor.setAttribute('class', "unclickable" );
        }

        //20191227-start-thonsha-add
        // if(obj.behav_reference){  
        //     for(let i=0; i<obj.behav_reference.length;i++){
        //         if (obj.behav_reference[i].behav_type == 'Display'){
        //             // textEntity.setAttribute("visible", false);
        //             // textEntity.setAttribute('class', "unclickable" );
        //             anchor.setAttribute("visible", false);
        //             anchor.setAttribute('class', "unclickable" );
        //             break;
        //         }
        //     }
            
        // }
        //20191227-end-thonsha-add
        console.log(" VRFunc.js: _loadText: anchor= ", anchor.object3D , ", obj=", obj );
        if(obj.generalAttr.obj_parent_id){
            // textEntity.setAttribute("visible", false);
            // textEntity.setAttribute('class', "unclickable" );
            let timeoutID = setInterval( function () {
                let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                // console.log("0 VRFunc.js: _loadText: parent= ", parent.object3D  );

                if (parent){ 
                    if(parent.object3D.children.length > 0){
                        parent.appendChild(anchor);
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 100);
        }
        else{
            this.vrScene.appendChild(anchor);
            // this.vrScene.appendChild(textEntity);
        }
        
        // if (obj.main_type=="button"){
        // 	return textEntity;
        // }


    });

    return pText;

//20191204-end-thonsha-add
}

//// 載入「 2D 文字 」 
export function loadText2D( obj, index, sceneObjNum, position=null, rotation=null, scale=null, isTempTextObj=false ){

    let pText2D = new Promise( ( text2DResolve , text2DReject ) => {

        //// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
        //// 位置    縮放    尺寸   旋轉
        let rectP, rectSizeDelta, rectScale , rectR ; 

        //[start-20231103-howardhsu-add]//   
        let getObj2DInfo350 = () => {

            let tempInfo = {};
            //// 位置    縮放    尺寸   旋轉
            let rectP, rectSizeDelta, rectScale , rectR ; 
            if ( obj.transformAttr.rect_transform && Array.isArray( obj.transformAttr.rect_transform ) && obj.transformAttr.rect_transform.length > 0 ){

                if ( !Number.isFinite( this.selectedResolutionIndex )   ){
                    console.log(' _loadText2D: _getObj2DInfo350: error, missing _selectedResolutionIndex', this.selectedResolutionIndex );
                    this.selectedResolutionIndex = 0;
                }
                let selectedObj2DInfo = obj.transformAttr.rect_transform[ this.selectedResolutionIndex ];

                if ( selectedObj2DInfo.position && selectedObj2DInfo.size_delta && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
                    rectP = selectedObj2DInfo.position.split(",").map( x =>  Number(x) ); 
                    rectSizeDelta = selectedObj2DInfo.size_delta.split(",").map( x =>  Number(x) ); 
                    rectScale = selectedObj2DInfo.scale.split(",").map( x =>  Number(x) ); 
                    rectR = selectedObj2DInfo.rotation.split(",").map( x =>  Number(x) );

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
        //[end-20231103-howardhsu-add]//

        if ( Object.keys( this.editor_version ).length == 4 ){
            let largeV  = Number( this.editor_version.v0 );
            let middleV = Number( this.editor_version.v1 );
            let smallV  = Number( this.editor_version.v2 );	
            
            let trans
            if(  largeV > 3 || 
                (largeV == 3 && middleV >= 5)
            ){  
                trans = getObj2DInfo350();
            } else {
                trans = getObj2DInfo350();
            }

            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  && trans.rectR ){
                rectP = trans.rectP; 
                rectSizeDelta = trans.rectSizeDelta; 
                rectScale = trans.rectScale; 
                rectR = trans.rectR;
            }else{
                text2DResolve( false );
                return;
            }
            
        }else{
            let trans = getObj2DInfo350();
            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  && trans.rectR ){
                rectP = trans.rectP; 
                rectSizeDelta = trans.rectSizeDelta; 
                rectScale = trans.rectScale; 
                rectR = trans.rectR;
            }else{
                text2DResolve( false );
                return;
            }
        }
        // console.log('_loadText2D: info: ', obj, position, rotation, scale);
        console.log('_loadText2D: info: _rectAll= ', obj.typeAttr.content, rectP, rectSizeDelta, rectScale , rectR );

        let width, height;
        let scaleRatioXY = this.scaleRatioXY;

        width  = rectSizeDelta[0] * scaleRatioXY;
        height = rectSizeDelta[1] * scaleRatioXY;
        
        console.log('_loadText2D: info: wh = ',  width , height , scaleRatioXY );

        let maxWords = 0 ;
        let textObjList = obj.typeAttr.content.split('\n');
        for( let i = 0; i < textObjList.length; i++ ){
            if ( textObjList[i].length > maxWords ){
                maxWords = textObjList[i].length;
            }
        }

        let ws = width/maxWords * 1.0 ;
        let hs = height/textObjList.length * 0.9;
        // let ms = 150 * scaleRatioXY ;
        let ms = 175 * scaleRatioXY ; //// 最大可以接受的大小，此數值只跟編輯器端 設定 有關

        //[start-20240314-renhaohsu-modify]//
        //// 特定比例下 文字為2個英文字(例如NO)時 會超出文字背板範圍 原本推測跟scaleRatioXY的係數有關 但看來不是 (應該是換行?
        // if(scaleRatioXY > 0.7){
        //     ms = 100 * scaleRatioXY
        // }
        //[end-20240314-renhaohsu-modify]//

        let fontsize = Math.min( ws , hs, ms );
        console.log(' ******** ' , obj.typeAttr.content, fontsize,maxWords , '[', ws, ',', width , ']', ', [', hs, ',', height , '], ' , ms );

        let rootObject = new THREE.Object3D();
        rootObject.makarType = "text2D";
                
        if ( obj.behav ){
            rootObject["behav"] = obj.behav ;
            
            //// 載入時候建制「群組物件資料」「注視事件」
            this.setObjectBehavAll( obj );
        }

        //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
        if ( obj.generalAttr.active == false ){
            rootObject.visible = false;
        }

        //// 假如物件本身帶有『事件參考』，同時是『顯示模型』，則判定起始為『不可見』
        // if (obj.behav_reference){
        //     rootObject.behav_reference = obj.behav_reference;
        //     for (let j = 0;j<obj.behav_reference.length; j++){
        //         if (obj.behav_reference[j].behav_type == "Display"  ){
        //             rootObject.visible = false;
        //         }
        //     }
        // }

        let textEntity = document.createElement('a-text');
        textEntity.object3D.renderOrder = index
        textEntity.setAttribute("geometry","primitive:plane; width: auto; height: auto; skipCache: true;");
        textEntity.setAttribute("material","opacity: 0.0 ; depthWrite:false; color:#000000; side:double;");


        let textList = obj.typeAttr.content.split('\n');
        let longestSplit = 0;
        const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
        const isChinese = (str) => REGEX_CHINESE.test(str);
        for (let i = 0; i < textList.length;i++) {
            let textLength = 0;
            for (let j = 0; j <  textList[i].length; j++) {
                if(isChinese(textList[i][j])){  // chinese
                    textLength += 1.6;
                }
                else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
                    textLength += 1;
                }
                else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
                    // textLength += 0.85;
                    textLength += 1.0;
                }
                else if(!isNaN(textList[i][j] * 1)){ //numeric
                    textLength += 1;
                }
                else{ // other symbols
                    textLength += 1.25;
                }
                
            }
            // console.log( textList[i], textLength);
            if (textLength > longestSplit) longestSplit =textLength;
        }

        //[start-20231026-howardhsu-add]//
        // console.log("_loadText2D obj.generalAttr.obj_id", obj.generalAttr.obj_id)
        textEntity.setAttribute( "id", obj.generalAttr.obj_id );
        //[end-20231026-howardhsu-add]//

        textEntity.setAttribute("value", obj.typeAttr.content);
        textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115  20201027：這個數值目前沒有用處
        
        textEntity.setAttribute("width", width );
        textEntity.setAttribute("height", height );
        textEntity.setAttribute("fontsize", fontsize );
        
        textEntity.setAttribute("wrap-count",longestSplit); // 1 for 1    20201027：這個數值目前沒有用處
        textEntity.setAttribute("anchor","center");
        textEntity.setAttribute("align","left");
        textEntity.setAttribute("baseline","center");
        
        textEntity.setAttribute("backcolor", obj.typeAttr.back_color ); //// 這邊注意一重點，自己設定的 attribute 不能使用 『大寫英文』，否則aframe data內會找不到，參照 text物件
        textEntity.setAttribute("textcolor", obj.typeAttr.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要
        textEntity.setAttribute("side","double");

        let fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
        let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
                fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
                fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
        // fonts = [ fontUrl + "1-msdf.json" ];
        textEntity.setAttribute("font", fonts );

        textEntity.setAttribute("negate","false");
        textEntity.setAttribute('crossorigin', 'anonymous');

        let rgb = obj.typeAttr.color.split(",");
        let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
        textEntity.setAttribute("color", "#"+color.getHexString());

        let aTempDiv;
        let aTempScene;

        if( document.getElementById("aTempScene") && document.getElementById("aTempDiv") ){
            aTempScene = document.getElementById("aTempScene");
        }else{

            aTempDiv = document.createElement('div');
            aTempDiv.style.display = "none";

            aTempScene = document.createElement("a-scene");
            aTempScene.setAttribute("id", "aTempScene");
            aTempScene.setAttribute("embedded", "");
            
            document.body.appendChild( aTempDiv );
            aTempDiv.appendChild( aTempScene );

        }
        
        aTempScene.appendChild(textEntity);


        textEntity.addEventListener("geometry-set", function(evt){
            
            let textObject = textEntity.object3D;
            if ( textObject ){
                if ( textObject.children[2] ){
                    if ( textObject.children[2] ){

                    }
                }
                console.log( '_loadText2D: textEntity geometry-set: textObject=' , textObject , evt );

            }

            text2DResolve( rootObject );
        });

        textEntity.addEventListener("loaded", (evt)=>{
            // console.log(" **** textEntity loaded evt " , textEntity.object3D );
            
            let textObject = textEntity.object3D;
            // if (obj.main_type=="button"){
            // 	rootObject["main_type"] = obj.main_type;
            // }
            
            //// 測試看 文字底板
            // let plane = new THREE.Mesh(
            // 	new THREE.PlaneBufferGeometry( width , height , 0 ),
            // 	new THREE.MeshBasicMaterial( { color: 0x424a54 ,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
            // );
            // plane.position.z = -1;
            // rootObject.add( plane ); 

            rootObject.add(textObject);

            //// 2D 物件基底都要「反轉」
            textObject.rotation.x = Math.PI;

            //// 基礎大小調整
            const baseScale = 190
            textObject.scale.set( baseScale , baseScale , 1 );
            
            if(obj.generalAttr.obj_parent_id){
                textObject.obj_parent_id = obj.generalAttr.obj_parent_id;

                let setIntoParent = () => {
                    let isParentSet = false;
                    for (let i = 0; i<this.makarObjects2D.length; i++ ){
                        if ( this.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id  ){
                            isParentSet = true;
                        }
                    }

                    if ( isParentSet == false ){
                        setTimeout(setIntoParent, 200 );
                    }else{
                        for (let i = 0; i < this.makarObjects2D.length; i++){
                            if (this.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id){
                            
                                rootObject.add(textObject);

                                rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                                rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

                                rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 
                                
                                //// 旋轉
                                // rootObject.rotateZ( -rotation.z /180*Math.PI);                            
                                rootObject.rotateZ( rectR.z )   

                                rootObject.scale.set( rectScale.x , rectScale.y , 1 );

                                rootObject["makarObject"] = true ;
                                rootObject["obj_id"] = obj.generalAttr.obj_id ;
                                rootObject["obj_parent_id"] = obj.generalAttr.obj_parent_id ;
                                this.makarObjects2D[i].add(rootObject);
                                
                                if( !isTempTextObj ){
                                    this.makarObjects2D.push(rootObject); 
                                } else {
                                    //// isTempTextObj: 是 YT(not supported)物件底下的文字物件 暫時不放到makarObjects 2D
                                }
                            
                                break;
                            }
                            
                        }
                    }
            
                }
                setIntoParent();
                
            }else{

                rootObject.add(textObject);

                rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

                // // translate the plane lower, will not be smaller because the camera is OrthographicCamera, but make it must behind the default texture                
                rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

                // //// rotation only at z direction
                // rootObject.rotateZ( -rotation.z /180*Math.PI);                    
                rootObject.rotateZ( rectR.z )

                rootObject.scale.set( rectScale.x , rectScale.y , 1 );
                
                rootObject["makarObject"] = true ;
                rootObject["obj_id"] = obj.generalAttr.obj_id ;

                if( !isTempTextObj ){
                    this.makarObjects2D.push(rootObject); 
                } else {
                    //// isTempTextObj: 是 YT(not supported)物件底下的文字物件 暫時不放到makarObjects 2D
                }

                this.scene2D.add( rootObject );

            }

            // text2DResolve( rootObject );

        })

        // text2DResolve( true );

    });

    return pText2D;

}    