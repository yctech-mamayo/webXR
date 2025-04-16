import { UrlExists, checkDefaultImage } from "../vrUtility.js"
import { setTransform } from "./setTransform.js";
import { loadGLTFModel } from "./GLTFModelModule.js";

//// the html will use this function to load image
//// It is sad that I cant use default a-plane tag to get the image width/height 
export function loadCurve( obj, position, rotation, scale ) {
    console.log("VRFunc.js: VRController: _loadCurve, obj=", obj, position, rotation, scale );
    let self = this
    
    //// 檢查是否為「預設物件」
    checkDefaultImage( obj );
    
    let pCurve = new Promise( function( curveResolve ){
  
        let curveEntity = document.createElement('a-entity');   //最上層物件，用來放curve本身，不要apply transform
        let bezierEntity = document.createElement('a-entity');  //用來作用curve object的transformation
        
        bezierEntity.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
        bezierEntity.setAttribute('crossorigin', 'anonymous');
        setTransform(bezierEntity, position, rotation, scale);

        self.makarObjects.push( curveEntity );
        self.makarObjects.push( bezierEntity );

        curveEntity.appendChild(bezierEntity);

        curveEntity.addEventListener("loaded", function(evt){

            for (let i=0; i<obj.typeAttr.nodes.length-1; i++){

                let curve , points , geometry , material , curveObject;
                curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][1].split(",").map( x => Number(x) ) ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,    // p1
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][2].split(",").map( x => Number(x) ) ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,    // nextPoint of p1
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][0].split(",").map( x => Number(x) )  ).multiply( new THREE.Vector3( -1, 1, 1 ) )  , // prePoint of p2
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][1].split(",").map( x => Number(x) )  ).multiply( new THREE.Vector3( -1, 1, 1 ) )  , // p2
                );
                // points = curve.getPoints( 50 ); //預設切50點 可調整
                // geometry = new THREE.BufferGeometry().setFromPoints( points );
                let c = new THREE.Color( 0xffffff );
                c.setHex( Math.random() * 0xffffff );
                material = new THREE.LineBasicMaterial( { color: c } );
                // // Create the final object to add to the scene
                // curveObject = new THREE.Line( geometry, material );

                // self.vrScene.object3D.add( curveObject );
                // curveEntity.object3D.add(curveObject);

                let tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.1, 2, false);
                let meshmaterial = new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }); // MeshLambertMaterial,
                let tubeMesh = new THREE.Mesh(tubeGeometry, meshmaterial);
                tubeMesh.visible = false;
            
                curveEntity.object3D.add(tubeMesh);
            }

            if(obj.typeAttr.is_cycle){  // 首尾相連
                let curve , points , geometry , material , curveObject;
                curve = new THREE.CubicBezierCurve3(
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][1].split(",").map( x => Number(x) ) ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][2].split(",").map( x => Number(x) ) ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][0].split(",").map( x => Number(x) )  ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,
                    new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][1].split(",").map( x => Number(x) )  ).multiply( new THREE.Vector3( -1, 1, 1 ) )  ,
                );
                // points = curve.getPoints( 50 );
                // geometry = new THREE.BufferGeometry().setFromPoints( points );
                let c = new THREE.Color( 0xffffff );
                c.setHex( Math.random() * 0xffffff );
                material = new THREE.LineBasicMaterial( { color: c } );
                // // Create the final object to add to the scene
                // curveObject = new THREE.Line( geometry, material );

                let tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.1, 2, false);
                let meshmaterial = new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }); // MeshLambertMaterial,
                let tubeMesh = new THREE.Mesh(tubeGeometry, meshmaterial);
                tubeMesh.visible = false;
                
                curveEntity.object3D.add(tubeMesh);
            }
            

            curveResolve(curveEntity);
            
        });

        bezierEntity.addEventListener( 'loaded' , function(){
            ///// 增加一個「空物件」，代表此 entity 已經自身載入完成
            let bezierbject3D = new THREE.Object3D();
            bezierEntity.object3D.add( bezierbject3D );
        });


        if(obj.generalAttr.obj_parent_id){

            let timeoutID = setInterval( function () {
                let parent = document.getElementById(obj.generalAttr.obj_parent_id);

                if (parent){ 
                    if(parent.object3D.children.length > 0){
                        parent.appendChild(curveEntity);
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 100);
        }
        else{
            self.vrScene.appendChild(curveEntity);
        }
        
    });

    return pCurve;
    
}


export function bezierPathAnime( bezierInfo, sceneIdx ){
    let self = this;

    let targetCurve = document.getElementById(bezierInfo.bezier_id).parentNode.object3D;
    let speed = bezierInfo.period;
    if (speed <= 0) return ;
    let offsetTranslate = bezierInfo.shift_position.split(",").map(x => Number(x));
    let offsetRotation = bezierInfo.shift_rotation.split(",").map(x => Number(x));
    let offsetQuaternion =  new THREE.Quaternion(offsetRotation[0], offsetRotation[1], offsetRotation[2], offsetRotation[3])
    let offsetEuler = new THREE.Euler().setFromQuaternion( offsetQuaternion, "XYZ");
    offsetQuaternion.setFromEuler(new THREE.Euler(offsetEuler.x, -offsetEuler.y, -offsetEuler.z) );
    let nodeNormals = [];
    let quaternionList = [];

    let pathMeshList = []; 
    let curveTotalLength = 0;
    for (let i = 0; i < targetCurve.children.length; i++) { // 找出curve geometry
        if(targetCurve.children[i].type == 'Mesh'){
            pathMeshList.push(targetCurve.children[i]);
            curveTotalLength += targetCurve.children[i].geometry.parameters.path.getLength();
        }
    }

    let objs= self.scenesData.scenes[sceneIdx].objs;
    let targetCurveData;
    let isCameraObj = false;
    for (let i = 0; i < objs.length; i++){
        if(objs[i].generalAttr.obj_id == bezierInfo.bezier_id)   targetCurveData = objs[i];
        if(objs[i].generalAttr.obj_id == bezierInfo.obj_id){
            if(objs[i].res_id == "camera"){
                isCameraObj = true;
            }  
        }
    }

    let movingObj;
    if (isCameraObj){
        bezierInfo.obj_id = "camera_cursor";   //若移動物件為相機，將obj_id改為camera_cursor
    } 

    movingObj = document.getElementById(bezierInfo.obj_id);

    for (let i = 0; i < targetCurveData.typeAttr.nodes.length; i++){    // 計算主要nodes的normal和quaternion
        let position = targetCurveData.typeAttr.nodes[i][1].split(",").map(x => Number(x));
        let normal = targetCurveData.typeAttr.nodes[i][3].split(",").map(x => Number(x));
        // let nodeQuaterData = targetCurveData.typeAttr.nodes[i][4].split(",").map(x => Number(x));
        // let nodeQuater = new THREE.Quaternion(nodeQuaterData[0], nodeQuaterData[1], nodeQuaterData[2], nodeQuaterData[3]);

        nodeNormals.push(new THREE.Vector3(-normal[0], normal[1], normal[2]).sub(new THREE.Vector3(-position[0], position[1], position[2])));
        // let inverseMatrix = new THREE.Matrix4().makeRotationFromQuaternion(nodeQuater);
        // inverseMatrix.getInverse(inverseMatrix);
        
        let quat =  new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), nodeNormals[i].normalize());
        // let quatMatrix = new THREE.Matrix4().makeRotationFromQuaternion(quat);
        // nodeNormals[i].applyMatrix4(inverseMatrix.multiply(quatMatrix));
        // let quat2 =  new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), nodeNormals[i].normalize());
        // quaternionList.push(quat2);
        quaternionList.push(quat);
    }
    if(targetCurveData.typeAttr.is_cycle){  //若有首尾相連多加第一個點為結尾
        nodeNormals.push(nodeNormals[0]);
        quaternionList.push(quaternionList[0]);
    }

    let duration =  curveTotalLength * 1000 / speed;

    let steps = 3000; //// 步數，代表要多精細的呈現 時間

    //// 使用 three 的 curve
    //// 計算位置與角度的變量
    let direction = new THREE.Vector3(), binormal = new THREE.Vector3(), normal = new THREE.Vector3(), position = new THREE.Vector3(), lookat = new THREE.Vector3(), matrixR = new THREE.Matrix4(), quaternion = new THREE.Quaternion();

    //// 先計算出來沿著曲線的『位置』跟『角度』以避免即時計算效能不足
    let PR = calculateCurvePRList(steps);
    // console.log(" -- PR = ", PR);

    function calculateCurvePRList(count) {

        let pList = new Array(count), rList = new Array(count);
        
        let t = 0;

        let currentGeoIdx = 0;
        let previosGeoLength = 0;
        let meshGeo;
    
        let lengths = pathMeshList[currentGeoIdx].geometry.parameters.path.getLengths((pathMeshList[currentGeoIdx].geometry.parameters.path.getLength()/curveTotalLength * count));
        for (let i = 0; i < count; i++) {
           
            if(i > (previosGeoLength + pathMeshList[currentGeoIdx].geometry.parameters.path.getLength())/curveTotalLength * count){
                previosGeoLength += pathMeshList[currentGeoIdx].geometry.parameters.path.getLength();
                currentGeoIdx +=1 ;
                lengths = pathMeshList[currentGeoIdx].geometry.parameters.path.getLengths((pathMeshList[currentGeoIdx].geometry.parameters.path.getLength()/curveTotalLength * count));

            }
            
            meshGeo = pathMeshList[currentGeoIdx].geometry;
            t = (i- previosGeoLength/curveTotalLength * count) / (pathMeshList[currentGeoIdx].geometry.parameters.path.getLength()/curveTotalLength * count);
            
            meshGeo.parameters.path.getPoint(t, position);

            // 取得線段方向
            direction = meshGeo.parameters.path.getTangent(t);

            direction.multiply( new THREE.Vector3( -1, -1, -1 ) );  // 網頁和MAKAR中的forward方向相反(觀察結果)，故將direction轉反方向
            
            // 取得『法向量』
            let currentQuater = quaternionList[currentGeoIdx].clone();
            currentQuater.slerp(quaternionList[currentGeoIdx+1], lengths[Math.floor(t * (pathMeshList[currentGeoIdx].geometry.parameters.path.getLength()/curveTotalLength * count))]/meshGeo.parameters.path.getLength());
            normal.set(0,1,0);
            normal.applyQuaternion(currentQuater);

            // 加上物件的中心位置
            pList[i] = position.clone();
            // 設置『視角方向』，基本的就是沿著行進路線方向
            lookat.copy( position ).add( direction );

            matrixR.lookAt(position, lookat, normal);
            quaternion.setFromRotationMatrix(matrixR);

            rList[i] = quaternion.clone();
        }

        return [pList, rList ];
    }

    let autoplay = false;
    if(bezierInfo.trigger_type == "Direct"){
        autoplay = true;
    }     
    else{   // 塞觸發事件到相關物件上
        let trigger_obj = document.getElementById(bezierInfo.trigger_id);
        trigger_obj.setAttribute('class', "clickable" );
        if (trigger_obj.object3D["behav"] == undefined) trigger_obj.object3D["behav"] = []
        trigger_obj.object3D["behav"].push(
            {
                "trigger_type": "Click",
                "trigger_obj_id": bezierInfo.trigger_id,
                "behav_type": "MoveAlongPath",
                "switch_type": "On",
                "obj_id": bezierInfo.obj_id,
                "group": "",
                "reset": false,
            }
        );
    }

    //// 以下為設定anime動作
    let aCameraInitPos;   //紀錄camera初始位置
    let objInitPos;       //紀錄targetObj初始位置
    let objInitQuat;      //紀錄targetObj初始旋轉
    let parentWorldQuat = new THREE.Quaternion();
    movingObj.parentNode.object3D.getWorldQuaternion(parentWorldQuat);

    var degree = {
        ratio: 0
    };
    let pBezier = anime({
        targets: degree,
        ratio: steps,
        loop: bezierInfo.loop, 
        easing: 'linear',
        round: 1,
        duration: duration,
        autoplay: autoplay,
        begin: function(){

            objInitPos = movingObj.object3D.position.clone();
            objInitQuat = movingObj.object3D.quaternion.clone();

            if(isCameraObj){
                let aCamera = document.getElementById('aCamera');
                aCameraInitPos = aCamera.object3D.position.clone();
                aCamera.object3D.position.set(0,0,0);

                if (self.viewMode == 'model'){
                    let oCamera = document.getElementById('oCamera');
                    oCamera.setAttribute('camera', 'active' , false );
                    aCamera.setAttribute('camera', 'active' , true );	
                }
                
            }

        },
        update: function () {

            //// 藉由『事先計算出來的位置旋轉』，代入所選物件『相機』，後面需要處理 VR 的 look-controls 衍生的 Yaw pitch
            let localPosition = PR[0][degree.ratio - 1].clone();
            movingObj.parentNode.object3D.worldToLocal(localPosition);
            localPosition.add(new THREE.Vector3(-offsetTranslate[0], offsetTranslate[1], offsetTranslate[2]));

            let localQuaternion = PR[1][degree.ratio - 1].clone();

            localQuaternion.premultiply(parentWorldQuat.clone().inverse());
            localQuaternion.multiply(offsetQuaternion);

            movingObj.object3D.position.copy(localPosition);
            if( !isCameraObj ){
                movingObj.object3D.quaternion.copy(localQuaternion);
            }
            
        

        },
        complete: function () {
            

            movingObj.object3D.position.copy(objInitPos);
            movingObj.object3D.quaternion.copy(objInitQuat);

            // console.log(" complete: ", self.vrScene.camera.el.object3D.position.clone(), self.vrScene.camera.el.object3D.rotation.clone());
            if(isCameraObj ){
                let aCamera = document.getElementById('aCamera');
                aCamera.object3D.position.copy(aCameraInitPos);

                if(self.viewMode == 'model'){
                    let aCamera = document.getElementById('aCamera');
                    let oCamera = document.getElementById('oCamera');
                    oCamera.setAttribute('camera', 'active' , true );
                    aCamera.setAttribute('camera', 'active' , false );	
                }
            }
        }
    });

    movingObj.object3D['bezier'] = pBezier;

}