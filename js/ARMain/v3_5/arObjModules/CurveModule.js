import { UrlExistsFetch, checkDefaultImage } from "../utility.js"
import { setARTransform } from "./setTransform.js";
import { loadGLTFModel } from "./GLTFModelModule.js";

//// the html will use this function to load image
//// It is sad that I cant use default a-plane tag to get the image width/height 
export function loadCurve( scene3DRoot, obj, position, rotation, scale, quaternion ) {
    console.log("ARFunc.js: ARWrapper: _loadCurve, obj=", obj, position, rotation, scale );
    //// "this" must be arController
    let self = this
    
    //// 檢查是否為「預設物件」
    checkDefaultImage( obj );
    
    let pCurve = new Promise( function( curveResolve ){
  
        let curveEntity = document.createElement('a-entity');   //最上層物件，用來放curve本身，不要apply transform
        let bezierEntity = document.createElement('a-entity');  //用來作用curve object的transformation

        let dpi = self.gcssTargets.dpi[ scene3DRoot.GCSSID] ; 
        let GCSSWidth= self.gcssTargets.width[ scene3DRoot.GCSSID] ; 
        let GCSSHeight= self.gcssTargets.height[ scene3DRoot.GCSSID] ; 
        
        curveEntity.setAttribute( "id", obj.generalAttr.obj_id+"_curve" );
        bezierEntity.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
        bezierEntity.setAttribute('crossorigin', 'anonymous');
        // setARTransform(bezierEntity, position, rotation, scale);

        self.makarObjects.push( curveEntity );
        self.makarObjects.push( bezierEntity );

        curveEntity.appendChild(bezierEntity);

        curveEntity.addEventListener("loaded", function(evt){


            for (let i=0; i<obj.typeAttr.nodes.length-1; i++){

                let curve , points , geometry , material , curveObject;
                let pt1 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][1].split(",").map( x => Number(x) ) );
                let pt2 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][2].split(",").map( x => Number(x) ) );
                let pt3 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][0].split(",").map( x => Number(x) ) );
                let pt4 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][1].split(",").map( x => Number(x) ) );
                let tempy , tempz;
                pt1.multiplyScalar(2*100*25.4/dpi);
                tempy = pt1.y;
                tempz = pt1.z;
                pt1.y = tempz;
                pt1.z = tempy;
                pt1.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt2.multiplyScalar(2*100*25.4/dpi);
                tempy = pt2.y;
                tempz = pt2.z;
                pt2.y = tempz;
                pt2.z = tempy;
                pt2.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt3.multiplyScalar(2*100*25.4/dpi);
                tempy = pt3.y;
                tempz = pt3.z;
                pt3.y = tempz;
                pt3.z = tempy;
                pt3.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt4.multiplyScalar(2*100*25.4/dpi);
                tempy = pt4.y;
                tempz = pt4.z;
                pt4.y = tempz;
                pt4.z = tempy;
                pt4.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                curve = new THREE.CubicBezierCurve3(pt1, pt2, pt3, pt4);
                // curve = new THREE.CubicBezierCurve3(
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][1].split(",").map( x => Number(x) ) ) ,    // p1
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i][2].split(",").map( x => Number(x) ) )  ,    // nextPoint of p1
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][0].split(",").map( x => Number(x) )  )  , // prePoint of p2
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[i+1][1].split(",").map( x => Number(x) )  )  , // p2
                // );
                // points = curve.getPoints( 50 ); //預設切50點 可調整
                // geometry = new THREE.BufferGeometry().setFromPoints( points );
                let c = new THREE.Color( 0xffffff );
                c.setHex( Math.random() * 0xffffff );
                material = new THREE.LineBasicMaterial( { color: c } );
                // // Create the final object to add to the scene
                // curveObject = new THREE.Line( geometry, material );

                // self.arScene.object3D.add( curveObject );
                // curveEntity.object3D.add(curveObject);

                let tubeGeometry = new THREE.TubeGeometry(curve, 20, 1, 2, false);
                let meshmaterial = new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }); // MeshLambertMaterial,
                let tubeMesh = new THREE.Mesh(tubeGeometry, meshmaterial);
                tubeMesh.visible = false;
            
                curveEntity.object3D.add(tubeMesh);
            }

            if(obj.typeAttr.is_cycle){  // 首尾相連
                let curve , points , geometry , material , curveObject;
                let pt1 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][1].split(",").map( x => Number(x) ) );
                let pt2 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][2].split(",").map( x => Number(x) ) );
                let pt3 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][0].split(",").map( x => Number(x) ) );
                let pt4 = new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][1].split(",").map( x => Number(x) ) );
                let tempy , tempz;
                pt1.multiplyScalar(2*100*25.4/dpi);
                tempy = pt1.y;
                tempz = pt1.z;
                pt1.y = tempz;
                pt1.z = tempy;
                pt1.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt2.multiplyScalar(2*100*25.4/dpi);
                tempy = pt2.y;
                tempz = pt2.z;
                pt2.y = tempz;
                pt2.z = tempy;
                pt2.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt3.multiplyScalar(2*100*25.4/dpi);
                tempy = pt3.y;
                tempz = pt3.z;
                pt3.y = tempz;
                pt3.z = tempy;
                pt3.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                pt4.multiplyScalar(2*100*25.4/dpi);
                tempy = pt4.y;
                tempz = pt4.z;
                pt4.y = tempz;
                pt4.z = tempy;
                pt4.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );

                curve = new THREE.CubicBezierCurve3(pt1, pt2, pt3, pt4);

                // curve = new THREE.CubicBezierCurve3(
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][1].split(",").map( x => Number(x) ) )  ,
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[obj.typeAttr.nodes.length-1][2].split(",").map( x => Number(x) ) )  ,
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][0].split(",").map( x => Number(x) )  )  ,
                //     new THREE.Vector3 ().fromArray( obj.typeAttr.nodes[0][1].split(",").map( x => Number(x) )  )  ,
                // );
                // points = curve.getPoints( 50 );
                // geometry = new THREE.BufferGeometry().setFromPoints( points );
                let c = new THREE.Color( 0xffffff );
                c.setHex( Math.random() * 0xffffff );
                material = new THREE.LineBasicMaterial( { color: c } );
                // // Create the final object to add to the scene
                // curveObject = new THREE.Line( geometry, material );

                let tubeGeometry = new THREE.TubeGeometry(curve, 20, 10, 2, false);
                let meshmaterial = new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }); // MeshLambertMaterial,
                let tubeMesh = new THREE.Mesh(tubeGeometry, meshmaterial);
                tubeMesh.visible = false;
                
                curveEntity.object3D.add(tubeMesh);
            }
            

            curveResolve(curveEntity);
            
        });

        bezierEntity.addEventListener( 'loaded' , function(evt){
            ///// 增加一個「空物件」，代表此 entity 已經自身載入完成
            let bezierbject3D = new THREE.Object3D();
            bezierEntity.object3D.add( bezierbject3D );

            if ( evt.target ==  evt.currentTarget ){

                bezierEntity.object3D.children[0].scale.set( 100*25.4/dpi , 100*25.4/dpi , 100*25.4/dpi );
                bezierEntity.object3D.children[0].rotation.y = Math.PI;


                //// 假如是子物件，不用位移到中央
                let dp = new THREE.Vector3();
                if ( obj.generalAttr.obj_parent_id ){

                    bezierEntity.object3D.obj_parent_id = obj.generalAttr.obj_parent_id;

                    dp.addScaledVector( position, 1*100*25.4/dpi );

                    ///// 子物件的 z 軸要正負顛倒
                    let pz = dp.z ;
                    dp.z = -pz;

                    setARTransform ( bezierEntity, dp, rotation, scale, quaternion );

                } else {

                    switch (window.serverVersion){
                        case "2.0.0":
                            scale.multiplyScalar( 1 );
                            dp.addScaledVector( position, 1*100*25.4/dpi ); // 100 is the factor of unity
                            break;

                        case "3.0.0":
                            scale.multiplyScalar( 2 );
                            dp.addScaledVector( position, 2*100*25.4/dpi ); // 2*100 is the factor of unity
                            break;
                        default:
                            console.log(" _loadGLTFModel_: serverVersion version wrong", serverVersion);
                    }

                    //// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
                    let py = dp.y;
                    let pz = dp.z;
                    dp.y = pz;
                    dp.z = py;

                    setARTransform( bezierEntity, dp , rotation, scale, quaternion );
                    //// 第一層物件必須放置於辨識圖中央										
                    bezierEntity.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
                    //// 第一層物件必須垂直於辨識圖表面
                    bezierEntity.object3D.rotation.x += Math.PI*90/180;

                    console.log('_loadCurveModule_: loaded: no parent prs=' , bezierEntity.object3D.position , bezierEntity.object3D.rotation, bezierEntity.object3D.scale  );

                }
            }

           
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

            scene3DRoot.appendChild(curveEntity);
            // self.arfScene.appendChild(curveEntity)
        }
        
    });

    return pCurve;
    
}


export function bezierPathAnime( scene3DRoot, bezierInfo, sceneIdx ){
    //// "this" must be arController
    let self = this;

    let targetCurve = document.getElementById(bezierInfo.bezier_id).parentNode.object3D;
    let speed = bezierInfo.period;
    if (speed <= 0) return ;
    let offsetTranslate = bezierInfo.shift_position.split(",").map(x => Number(x));
    let offsetRotation = bezierInfo.shift_rotation.split(",").map(x => Number(x));
    let offsetQuaternion =  new THREE.Quaternion(offsetRotation[0], offsetRotation[1], offsetRotation[2], offsetRotation[3])
    let offsetEuler = new THREE.Euler().setFromQuaternion( offsetQuaternion, "XYZ");
    offsetQuaternion.setFromEuler(new THREE.Euler(offsetEuler.x, offsetEuler.y, offsetEuler.z) );
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

    let dpi = self.gcssTargets.dpi[ scene3DRoot.GCSSID ] ; 
    let GCSSWidth= self.gcssTargets.width[ scene3DRoot.GCSSID] ; 
    let GCSSHeight= self.gcssTargets.height[ scene3DRoot.GCSSID] ; 
    
    let duration =  curveTotalLength * 1000 / (speed* 2*100*25.4/dpi);

    let steps = 3000; //// 步數，代表要多精細的呈現 時間

    //// 使用 three 的 curve
    //// 計算位置與角度的變量
    let direction = new THREE.Vector3(), binormal = new THREE.Vector3(), normal = new THREE.Vector3(), position = new THREE.Vector3(), lookat = new THREE.Vector3(), matrixR = new THREE.Matrix4(), quaternion = new THREE.Quaternion();

    //// 先計算出來沿著曲線的『位置』跟『角度』以避免即時計算效能不足
    let PR = calculateCurvePRList(steps);
    console.log(" -- PR = ", PR);

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

            // direction.multiply( new THREE.Vector3( -1, -1, -1 ) );  // 網頁和MAKAR中的forward方向相反(觀察結果)，故將direction轉反方向
            
            // 取得『法向量』
            let currentQuater = quaternionList[currentGeoIdx].clone();
            currentQuater.slerp(quaternionList[currentGeoIdx+1], lengths[Math.floor(t * (pathMeshList[currentGeoIdx].geometry.parameters.path.getLength()/curveTotalLength * count))]/meshGeo.parameters.path.getLength());
            normal.set(0,1,0);
            normal.applyAxisAngle(new THREE.Vector3(1,0,0), Math.PI*90/180);
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
    let rootWorldQuat = new THREE.Quaternion();
    scene3DRoot.object3D.getWorldQuaternion(rootWorldQuat);

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

            // if(isCameraObj){
            //     let aCamera = document.getElementById('aCamera');
            //     aCameraInitPos = aCamera.object3D.position.clone();
            //     aCamera.object3D.position.set(0,0,0);

            //     if (self.viewMode == 'model'){
            //         let oCamera = document.getElementById('oCamera');
            //         oCamera.setAttribute('camera', 'active' , false );
            //         aCamera.setAttribute('camera', 'active' , true );	
            //     }
                
            // }

        },
        update: function () {

            //// 藉由『事先計算出來的位置旋轉』，代入所選物件
            let localPosition = PR[0][degree.ratio - 1].clone();
            let shift = new THREE.Vector3(offsetTranslate[0], offsetTranslate[1], offsetTranslate[2]);

            if(movingObj.object3D.obj_parent_id){

                localPosition.applyMatrix4(scene3DRoot.object3D.matrix)
                movingObj.parentNode.object3D.worldToLocal(localPosition);

                shift.multiplyScalar(100*25.4/dpi);
                shift.z = -shift.z
                localPosition.add(shift);
            }
            else{
                let tempy , tempz;
                shift.multiplyScalar(2*100*25.4/dpi);
                tempy = shift.y;
                tempz = shift.z;
                shift.y = tempz;
                shift.z = tempy;
                localPosition.add(shift);
               
            }
            
            
            

            let localQuaternion = PR[1][degree.ratio - 1].clone();

            localQuaternion.premultiply(rootWorldQuat.clone());
            localQuaternion.premultiply(parentWorldQuat.clone().inverse());
            localQuaternion.multiply(offsetQuaternion);

            movingObj.object3D.position.copy(localPosition);
            movingObj.object3D.quaternion.copy(localQuaternion);

        

        },
        complete: function () {
            
            movingObj.object3D.position.copy(objInitPos);
            movingObj.object3D.quaternion.copy(objInitQuat);

            // console.log(" complete: ", self.vrScene.camera.el.object3D.position.clone(), self.vrScene.camera.el.object3D.rotation.clone());
            // if(isCameraObj ){
            //     aCamera.object3D.position.copy(aCameraInitPos);

            //     if(self.viewMode == 'model'){
            //         let aCamera = document.getElementById('aCamera');
            //         let oCamera = document.getElementById('oCamera');
            //         oCamera.setAttribute('camera', 'active' , true );
            //         aCamera.setAttribute('camera', 'active' , false );	
            //     }
            // }
        }
    });

    movingObj.object3D['bezier'] = pBezier;

}