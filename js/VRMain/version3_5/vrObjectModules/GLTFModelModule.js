import { UrlExists, unicodeToChar } from "../vrUtility.js"
import { setTransform } from "./setTransform.js";
import { verionControl as VC } from "../MakarWebXRVersionControl.js";

export function checkGLTFMaterialIndex( target, material ) {
        
    if ( !target || !target.object3D || !target.object3D.children[0] ){
        console.log('VRFunc.js: _checkGLTFMaterialIndex: target error', target );
        return;
    }

    if ( !material ){
        console.log('VRFunc.js: _checkGLTFMaterialIndex: material error', material );
        return;
    }

    //// 當前紀錄要調整材質的方式 很奇特：
    //// 第一個數值是： nodes 下面，撇除不帶有 mesh 的項目，的index，此 node 帶有的 「mesh」代表 meshes 下的 index
    //// 第二個數值是： meshes 下的 mesh，底下的 primitives 下的 material index 
    // let nodeMeshIndex = material.rendererIndex;
    // let primitiveIndex = material.materialIndex;
    let nodeMeshIndex = material.mesh_idx;
    let primitiveIndex = material.primitive_idx;

    //// 確認模型物件下面的scene
    let meshIndex = -1;
    let materialIndex = -1;

    //// 查找「nodes」底下「帶有 mesh」的node
    let nodes = target.object3D.children[0].ModelJson.nodes;
    let nodeMeshCount = -1;
    for ( let i = 0; i < nodes.length; i++ ){
        //// 假如此 node 帶有 mesh ，加一
        if ( typeof( nodes[i].mesh ) == 'number' ){
            nodeMeshCount++;
        }
        //// 確認是否為「對應 index 」
        if ( nodeMeshIndex == nodeMeshCount ){
            meshIndex = nodes[i].mesh;
            // console.log('VRFunc.js: _checkGLTFMaterialIndex: get nodeMeshIndex ', nodes[i] );
            break;
        }

    }

    //// 確認模型物件下的 meshes 下 特定 index 是否存在
    // console.log('VRFunc.js: _checkGLTFMaterialIndex: meshIndex = ', meshIndex , material  );
    if ( meshIndex >= 0 ){

        let meshData = target.object3D.children[0].ModelJson.meshes[ meshIndex ];
        // console.log('VRFunc.js: _checkGLTFMaterialIndex: get meshData ', meshIndex , meshData  );
        if ( meshData ){
            //// 確認模型物件下的 primitives 是否存在
            if ( meshData.primitives  ){
                let primitiveData = meshData.primitives[ primitiveIndex ];
                //// 確認模型物件下的 primitives 下 material 是否有值
                if ( primitiveData && primitiveData.material >= 0 ){
                    //// 確認 materials 下是否有此 index
                    materialIndex = primitiveData.material;

                    console.log('VRFunc.js: _checkGLTFMaterialIndex: materialIndex=' , materialIndex );
                }
            }
        }
    }
    
    // if ( materialIndex >= 0 ){

    // 	target.object3D.traverse(function(child){
    // 		if (child.isMesh){
    // 			//// 我們在 load GLTF 的時候把每一個 material name 最後面加上 _[index]，這邊找出最後一個來比較
    // 			let nameSlice = child.material.name.split("_");
    // 			let mIndex = nameSlice[ nameSlice.length - 1 ];
    // 			if ( mIndex == materialIndex){
    // 				console.log('VRFunc.js: _checkGLTFMaterialIndex: child.material =', child.material );
    // 			}
    // 		}
    // 	});
    // }

    return [materialIndex, meshIndex];

}

export function loadGLTFModel( obj, position, rotation, scale, cubeTex) {
    //20191025-start-thonsha-add  
    //// 這邊 this 必須等於 vrController
    let self = this  

    let pModel = new Promise( function( modelResolve ){
                
        UrlExists( obj.res_url , function( retStatus ){

            if ( retStatus == true ){

                let promiseList = [];
                
                //// 作檔案存在與否判斷
                //// 沒有檔案位址，
                if ( obj.res_url == '' || 
                ( obj.sub_type != 'glb' && obj.sub_type != 'gltf'  && obj.sub_type != 'gltf_sketchFab'  && obj.sub_type != 'gltf_sketchfab' &&
                    obj.sub_type != 'gltf_poly'
                ) ){
                    console.log("VRFunc.js: _loadGFLTFModel: obj not support ", obj );
                    modelResolve( -1 );
                    return;
                }

                let assets = document.getElementById("makarAssets");

                let assetsitem = document.createElement("a-asset-item")
                assetsitem.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id);
                assetsitem.setAttribute("src",obj.res_url);
                assetsitem.setAttribute("response-type", 'arraybuffer');
                // assetsitem.setAttribute("src", 'model/tga.glb' );
                
                // assetsitem.setAttribute("src", 'https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/Resource/56a0a86b2d694c48bc7179d05a9f2c8cc833455ddc4442d481a73214d39aab4c.glb' );

                assetsitem.setAttribute('crossorigin', 'anonymous');
                assets.appendChild(assetsitem);
                
                //20191128-start-thonsha-add
                var animationSlices= null;	
                var mainAnimation;	
                if(obj.animationAttr){
                    animationSlices= [];
                    
                    ////
                    //// 2022 1123 這邊從 3.4.0 之後要作版本控制
                    //// 注意，在執行的程式碼端，將 key 結構改為 新版本
                    //// v3.5 editor_version 是個 object，帶有 v0, v1, v2, v3 四個key-value pair
                    if (typeof(self.editor_version) == "object"  && Object.keys( self.editor_version).length == 4 ){
                        
                        let largeV  = Number( self.editor_version.v0 );
                        let middleV = Number( self.editor_version.v1 );
                        let smallV  = Number( self.editor_version.v2 );

                        //// 版本在4以上 或 大於等於3.5， obj的第1層是駝峰式大小寫，第2層換字使用底線 _ 且都是小寫
                        if ( largeV > 3 || (largeV == 3 && middleV >= 5) ){
                            for(let i=0; i<obj.animationAttr.length; i++){
                                if (obj.animationAttr[i].is_default || obj.animationAttr[i].is_active){
                                    animationSlices.push({
                                        idle:obj.animationAttr[i].uid, 
                                        loop:obj.animationAttr[i].uid, 
                                        uid:obj.animationAttr[i].uid, 
                                        changed: false, 
                                        reset: true, 
                                        count: 0
                                    });
                                    mainAnimation = unicodeToChar(obj.animationAttr[i].animation_name);
                                }
                            }
                            for(let i=0; i<obj.animationAttr.length; i++){
                                animationSlices.push({
                                    name:obj.animationAttr[i].name,
                                    animationName:unicodeToChar(obj.animationAttr[i].animation_name),
                                    startTime:obj.animationAttr[i].start_time,
                                    endTime:obj.animationAttr[i].end_time,
                                    uid:obj.animationAttr[i].uid
                                });
                            }

                        }

                    }
                    
                }
                //20191128-end-thonsha-add

                let modelEntity = document.createElement('a-entity');

                if(!obj.res_url){ return };
    
                modelEntity.setAttribute("gltf-model", "#"+obj.generalAttr.obj_id+"_"+obj.res_id);
                
                if(obj.animationAttr){
                    modelEntity.setAttribute("animation-mixer", "clip: "+mainAnimation);
                }
                
                if (obj.behav){
                    modelEntity.setAttribute('class', "clickable" ); //// fei add
                }
                //[start-20231229-renhaohsu-add]//
                else if (obj.generalAttr.logic){
                    modelEntity.setAttribute('class', "clickable" ); 
                }
                //[end-20231229-renhaohsu-add]//
                else{
                    modelEntity.setAttribute('class', "unclickable" ); //// fei add
                }
                modelEntity.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 

                modelEntity.setAttribute('crossorigin', 'anonymous');

                //20200608-thonsha-add-start
                modelEntity.setAttribute("shadow","");
                //20200608-thonsha-add-end
                //20200619-thonsha0add-start
                if (obj.model_shift){  //// 3.5 這邊直接沒有 model_shift 不確定怎麼處理
                    let model_shift = new THREE.Vector3().fromArray(obj.model_shift.split(",").map(function(x){return Number(x)}) );
                    model_shift.multiply(scale);
                    position.add(model_shift);
                }
                //20200619-thonsha0add-end

                setTransform(modelEntity, position, rotation, scale);
                self.makarObjects.push( modelEntity );

                //20191125-start-thonsha-add
                modelEntity.addEventListener("model-loaded", function(evt){ // model-loaded  / object3dset
                    // console.log("VRFunc.js: VRController: _loadGLTFModel, object3dset: evt=", evt );
                    if ( evt.target ==  evt.currentTarget ){

                        //// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
                        let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
                        evt.detail.model.traverse( ( object ) => {
                            if ( object.isMesh === true && object.material.map !== null ) {
                            object.material.map.anisotropy = maxAnisotropy;
                            object.material.map.needsUpdate = true;
                            }
                        });
                        
                        // setTimeout(function(){
                        // 	modelEntity.setAttribute("cursor-listener", true ); //// fei add
                        // }, 500 );        

                        if ( modelEntity.object3D ){
                            modelEntity.object3D["makarObject"] = true;
                            modelEntity.object3D["makarType"] = 'model';

                            if ( obj.behav ){
                                modelEntity.object3D["behav"] = obj.behav ;
                                
                                //// 載入時候建制「群組物件資料」「注視事件」
                                self.setObjectBehavAll( obj );
                            }
                            if(obj.behav_reference){
                                modelEntity.object3D["behav_reference"] = obj.behav_reference ;
                            }

                            let objj = modelEntity.getObject3D('mesh');
                            // console.log('VRFunc.js: gltf model objj=', objj );

                            objj.traverse(node => {
                                //// 取消所有「模型自帶光」
                                if (node.type){
                                    if (typeof(node.type) == 'string' ){
                                        if (node.type.toLowerCase().includes('light') ){
                                            console.log("loadGLTFModel: _取消所有「模型自帶光」 node=", node)
                                            node.visible = false;
                                        }
                                    }
                                }
                            });
                            
                            //20191203-start-thonsha-add
                            if (obj.materialAttr.materials && obj.materialAttr.materials.length > 0){

                                for(let i = 0; i < obj.materialAttr.materials.length; i++){

                                    if ( objj.ModelJson ){
                                        let materialArray = checkGLTFMaterialIndex( modelEntity, obj.materialAttr.materials[i] );

                                        //[start-20240411-renhaohsu-modify]//
                                        //// 檢查是不是 "舊版(v3.4)材質球"
                                        let material_idx = obj.materialAttr.materials[i].material_idx;
                                        if(!material_idx){
                                            //// 表示它是舊版(v3.4)材質球 但是專案升到新版(v3.5.0.0)
                                            loadMaterial_v340(self, modelEntity, obj, objj, i)
                                            continue;
                                        }
                                        //[start-20240411-renhaohsu-modify]//

                                        let pMaterial = loadMaterialTexture(self, obj);
                                        promiseList.push(pMaterial)
                                        pMaterial.then(textures =>{
                                            loadMaterial(self, modelEntity, obj.materialAttr.materials[i].material_idx, materialArray );
                                        });
                                    }
                                    
                                }

                            }
                            else if (obj.default_shader_name){
                                console.log("run default_shader_name: ",obj.default_shader_name)

                                switch(obj.default_shader_name){

                                    case "standard":
                                        // 不處理
                                        break;

                                    case "Unlit/Transparent":
                                        // 編輯器那邊錯誤 實際上是去背
                                        if ( objj.ModelJson ){
                                            objj.traverse(node => {
                                                if (node.material) {
                                                    node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                    node.material.opacity = 1;
                                                    node.material.alphaTest = 0.5;
                                                }
                                            });
                                        }

                                        break
                                    
                                    case "Unlit/Transparent Cutout":
                                        // 編輯器那邊錯誤 實際上是透明
                                        if ( objj.ModelJson ){
                                            objj.traverse(node => {
                                                if (node.material) {
                                                    node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                    node.material.opacity = 0.5;
                                                    node.material.depthWrite = false;
                                                    //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                                                    node.renderOrder = 1;
                                                }
                                            });
                                        }

                                        break

                                    case "Unlit/Color":
                                        if ( objj.ModelJson ){
                                            objj.traverse(node => {
                                                if (node.material) {
                                                    node.material = new THREE.MeshBasicMaterial({color: node.material.color, name: node.material.name, skinning: node.material.skinning});
                                                }
                                            });
                                        }
                                        break;

                                    case "Unlit/Texture":
                                        objj.traverse(node => {
                                            if (node.material) {
                                 
                                                node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                if (node.material.map){
                                                    node.material.map.encoding = THREE.GammaEncoding;
                                                    node.material.map.needsUpdate = true;
                                                }
                                                node.material.needsUpdate = true;
                                            }

                                        });
                                        break;
                                }
                            }
                            else{
                                if ( objj.ModelJson ){

                                    if(objj.ModelJson.materials){
                                        console.log("run alphaMode: ",objj.ModelJson.materials)
                                        let renderer = modelEntity.sceneEl.renderer;

                                        for (let i = 0; i<objj.ModelJson.materials.length; i++){
                                            if(objj.ModelJson.materials[i].alphaMode){
                                                switch(objj.ModelJson.materials[i].alphaMode){

                                                    case "OPAQUE":

                                                        objj.traverse(node => {
                                                            if (node.material) {
                                                                let nameSlice = node.material.name.split("_");
                                                                let mIndex = nameSlice[ nameSlice.length - 1 ];
                                                                if(mIndex == i){
                                                                    // node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                                    node.material.opacity = 1;
                                                                    renderer.setClearAlpha(1);
                                        
                                                                    node.material.blending = THREE.CustomBlending;
                                                                    node.material.blendEquation = THREE.AddEquation;
                                                                    node.material.blendSrc = THREE.OneFactor;
                                                                    node.material.blendDst = THREE.ZeroFactor;
                                                                    node.material.blendSrcAlpha = THREE.ZeroFactor;
                                                                    node.material.blendDstAlpha = THREE.OneFactor;

                                                                }
                                                            }
                                                        });
                                                        
                                                        break;
                                

                                                    case "MASK":

                                                        objj.traverse(node => {
                                                            if (node.material) {
                                                                let nameSlice = node.material.name.split("_");
                                                                let mIndex = nameSlice[ nameSlice.length - 1 ];
                                                                if(mIndex == i){
                                                                    // node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                                    node.material.opacity = 1;
                                                                    node.material.alphaTest = 0.5;
                                                                    renderer.setClearAlpha(1);
                                        
                                                                    node.material.blending = THREE.CustomBlending;
                                                                    node.material.blendEquation = THREE.AddEquation;
                                                                    node.material.blendSrc = THREE.OneFactor;
                                                                    node.material.blendDst = THREE.ZeroFactor;
                                                                    node.material.blendSrcAlpha = THREE.ZeroFactor;
                                                                    node.material.blendDstAlpha = THREE.OneFactor;
                                        
                                                                    node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                        depthPacking: THREE.RGBADepthPacking,
                                                                        skinning: true,
                                                                        map: node.material.map,
                                                                        alphaTest: 0.5
                                                                    } );

                                                                }
                                                            }
                                                        });
                                                        
                                                        break;

                                                    case "BLEND":
                                                        objj.traverse(node => {
                                                            if (node.material) {
                                                                let nameSlice = node.material.name.split("_");
                                                                let mIndex = nameSlice[ nameSlice.length - 1 ];
                                                                if(mIndex == i){
                                                                    // node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
                                                                    node.material.opacity = 0.5;
                                                                    node.material.depthWrite = false;
                                                                    node.material.blending = THREE.CustomBlending;
                                                                    node.material.blendEquation = THREE.AddEquation;
                                                                    node.material.blendSrc = THREE.OneFactor;
                                                                    node.material.blendDst = THREE.OneMinusSrcAlphaFactor;
                                                                    node.material.blendSrcAlpha = THREE.OneFactor;
                                                                    node.material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;
                                                                    //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                                                                    node.renderOrder = 1;

                                                                    node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                                                        depthPacking: THREE.RGBADepthPacking,
                                                                        skinning: true,
                                                                        map: node.material.map,
                                                                        alphaTest: 0.5
                                                                    } );
                                                                }
                                                            }
                                                        });
                                                        
                                                        break

                                                }
                                            }
                                        }
                                    }

                                    
                                    
                                }
                            }
                            //20191203-start-thonsha-add		
                            //// if there is animation exist in GLTF, but the editor not contain the animation slices, the mixer will not init.
                            //// use the first animation( usually only one), to setup animationSlice.
                            if (Array.isArray(evt.detail.model.animations)){
                                if ( evt.detail.model.animations.length>0 && !modelEntity.getAttribute("animation-mixer") ){
                                    console.log("VRFunc.js: loadGFLTFModel: the model with animation but no animation-mixer, probabily older version of editor ", evt.detail.model );
                                    modelEntity.setAttribute("animation-mixer", "clip: "+ evt.detail.model.animations[0].name );
                                    animationSlices = [];
                                    animationSlices.push({ changed:false, idle:"mifly168", uid:"mifly168" });
                                    animationSlices.push({
                                        animationName: evt.detail.model.animations[0].name,
                                        name: evt.detail.model.animations[0].name,
                                        endTime: evt.detail.model.animations[0].duration ,
                                        startTime: 0,
                                        uid:"mifly168"
                                    });
                                }
                            }
                            evt.detail.model.animationSlices = animationSlices;

                            // 等待promiseList裡的東西都好了才resolve，以後有其他需要等的可以塞進去，目前是只有塞貼圖載入
                            Promise.all( promiseList ).then( function( ){
                
                                modelResolve(modelEntity);
                            
                            })


                        }
                    }else{
                        // console.log("VRFunc.js: VRController: _loadFBXModel, target!=currentTarget", obj.res_name, modelEntity.object3D.children );
                    }
                });

                //20191125-end-thonsha-add

                //20191226-start-thonsha-mod

                //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                if ( obj.generalAttr.active == false ){
                    modelEntity.setAttribute("visible", false);
                    modelEntity.setAttribute('class', "unclickable" );
                }

                // if(obj.behav_reference){
                //     for(let i=0; i<obj.behav_reference.length;i++){
                //         // if (obj.behav_reference[i].behav_name == 'ShowModel'){
                //         if (obj.behav_reference[i].behav_type == 'Display'){
                //             modelEntity.setAttribute("visible", false);
                //             modelEntity.setAttribute('class', "unclickable" );
                //             break;
                //         }
                //     }
                    
                // }
                //20191029-start-thonhsa-add
                if(obj.generalAttr.obj_parent_id){
                    // modelEntity.setAttribute("visible", false);
                    // modelEntity.setAttribute('class', "unclickable" );
                    let timeoutID = setInterval( function () {
                        let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                        if (parent){ 
                            if(parent.object3D.children.length > 0){
                                parent.appendChild(modelEntity);
                                window.clearInterval(timeoutID);
                            } 
                        }
                    }, 1);
                }
                else{
                    self.vrScene.appendChild(modelEntity);
                }


            }else{

                console.log("VRFunc.js: _loadGLTFModel , obj url not exist ", obj );
                
                obj.main_type = 'model';
                obj.sub_type = 'glb';
                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
                
                self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );
                modelResolve( 1 );

            }

        });            

    });

    return pModel;

//20191025-end-thonsha-add
}

//// 不會用到
// export function loadFBXModel( obj, position, rotation, scale ) {
//     let self = this
//     // console.log("VRFunc.js: VRController: loadFBXModel, obj=", obj, position, rotation, scale );
//     // console.log("VRFunc.js: VRController: loadFBXModel, obj res_url_fbx=", obj.res_url_fbx  );

//     let modelEntity = document.createElement('a-entity');
    
//     if ( !obj.res_url_fbx ){ return };
    
//     modelEntity.setAttribute('fbx-model', 'src:' + obj.res_url_fbx ); // res_url_fbx, load model first?

//     //20191028-end-thonsha-add
//     modelEntity.setAttribute("animation-mixer", "");
//     //20191028-end-thonsha-add
//     if (obj.behav){
//         modelEntity.setAttribute('class', "clickable" ); //// fei add
//     }
//     else{
//         modelEntity.setAttribute('class', "unclickable" ); //// fei add
//     }
//     modelEntity.setAttribute( "id", obj.obj_id );//// fei add 

//     // setTimeout(function(){
//     // 	modelEntity.setAttribute("cursor-listener", true ); //// fei add
//     // }, 500 );

//     self.setTransform(modelEntity, position, rotation, scale);
//     self.makarObjects.push( modelEntity );

//     //20191227-start-thonsha-mod
//     if(obj.behav_reference){
//         for(let i=0; i<obj.behav_reference.length;i++){
//             if (obj.behav_reference[i].behav_name != 'PlayAnimation'){
//                 modelEntity.setAttribute("visible", false);
//                 modelEntity.setAttribute('class', "unclickable" );
//                 break;
//             }
//         }
        
//     }
//     //20191227-end-thonsha-mod
//     //20191029-start-thonhsa-add
//     if(obj.obj_parent_id){
//         // modelEntity.setAttribute("visible", false);
//         // modelEntity.setAttribute('class', "unclickable" );
//         let timeoutID = setInterval( function () {
//             let parent = document.getElementById(obj.obj_parent_id);
//             if (parent){ 
//                 if(parent.object3D.children.length > 0){
//                     parent.appendChild(modelEntity);
//                     window.clearInterval(timeoutID);
//                 } 
//             }
//         }, 1);
//     }
//     else{	
//         self.vrScene.appendChild(modelEntity);
//     }
//     //20191029-end-thonhsa-add
//     modelEntity.addEventListener("model-loaded", function(evt){

//         if (evt.target == evt.currentTarget){
//             modelEntity.object3D["makarObject"] = true; 
//             if ( obj.behav ){
//                 modelEntity.object3D["behav"] = obj.behav ;
//             }
//         }
//     });

//     // console.log("VRFunc.js: VRController: loadFBXModel, modelEntity=", modelEntity );
//     // console.log("VRFunc.js: VRController: loadFBXModel, obj=", obj );

// }


export function loadMaterial(self, modelEntity, material_idx, materialArray){

    let objj = modelEntity.getObject3D('mesh');
    let material = self.userMaterialDict[material_idx];
    let material_data = {};
    console.log("material_idx", material);
    let materialIndex = materialArray[0];
    let meshIdx = materialArray[1];

    material_data.name = material.res_name;
    material_data.shader = material.shader;

    for(let i = 0; i < material.properties.length; i++){
        switch (material.properties[i].key){
            case "alphaMode":
                // if(material.properties[i].value == "OPAQUE")    material_data.alphaMode = 0;
                // else if(material.properties[i].value == "MASK")  material_data.alphaMode = 1;
                // else if(material.properties[i].value == "BLEND")  material_data.alphaMode = 3;
                break;
            case "doubleSided":
                material_data.doubleSided = material.properties[i].value;
                break;
            case "_Color":
                let rgba = material.properties[i].value.split(",");
                material_data.color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));
                material_data.alpha = parseFloat(rgba[3]);
                break;
            case "_MainTex":
                material_data.map = self.materials_texture_dict[material_idx].mainTex;
                break;
            case "_Cutoff":
                material_data.cutoff = material.properties[i].value;
                break;
            case "_Glossiness":
                material_data.smoothness = material.properties[i].value;
                break;
            case "_SpecGlossMap":
                material_data.specGlossMap = self.materials_texture_dict[material_idx].specGlossMap;
            case "_Metallic":
                material_data.metallic = material.properties[i].value;
                break;
            case "_MetallicGlossMap":
                material_data.metalnessMap = self.materials_texture_dict[material_idx].metalnessMap;
                break;
            case "_SpecularHighlights":
                material_data.specularHighlights = material.properties[i].value;
                break;
            case "_GlossyReflections":
                material_data.glossyReflections = material.properties[i].value;
                break;
            case "_BumpScale":
                material_data.bumpscale = material.properties[i].value;
                break;
            case "_BumpMap":
                material_data.bumpMap = self.materials_texture_dict[material_idx].bumpMap;
                break;
            case "_Parallax":
                material_data.parallax = material.properties[i].value;
                break;
            case "_ParallaxMap":
                material_data.parallaxMap = self.materials_texture_dict[material_idx].parallaxMap;
                break;
            case "_OcclusionStrength":
                material_data.aoMapIntensity  = material.properties[i].value;
                break;
            case "_OcclusionMap":
                material_data.aoMap = self.materials_texture_dict[material_idx].aoMap;
                break;
            case "_EmissionColor":
                let ergba = material.properties[i].value.split(",");
                material_data.emissionColor = new THREE.Color(parseFloat(ergba[0]),parseFloat(ergba[1]),parseFloat(ergba[2]));
                break;
            case "_EmissionMap":
                material_data.emissionMap = self.materials_texture_dict[material_idx].emissionMap;
                break;
            case "_Mode":
                material_data.mode = material.properties[i].value;
                break;

            // TSF/baseOutline
            case "_ToonShade":
                material_data.toonShade = self.materials_texture_dict[material_idx].toonShade;
                break;
            case "_TintColor":
                if(material.properties[i].value == 1)   material_data.tintColor = true;
                else material_data.tintColor = false;
                break;
            case "_Brightness":
                material_data.brightness = material.properties[i].value;
                break;
            case "_OutlineColor":
                let outlineColor = material.properties[i].value.split(",");
                material_data.outlineColor = new THREE.Color(parseFloat(outlineColor[0]),parseFloat(outlineColor[1]),parseFloat(outlineColor[2]));
                break;
            case "_Outline":
                material_data.outlineWidth = material.properties[i].value;
                break;
            
            
        }
    }
    // console.log(material_data)

    switch (material_data.shader) {
        case "Unlit/Color":
            objj.traverse(node => {
                if (node.isMesh) {

                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name === obj.materialAttr.materials[i].name) {
                        node.material = new THREE.MeshBasicMaterial({color: material_data.color, name: node.material.name, skinning: node.material.skinning});
                    }
                }
            });
            break;
        case "Standard":
        case "Autodesk Interactive":

            var renderer = modelEntity.sceneEl.renderer;
            objj.traverse(node => {

                if (node.material) {

                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name == obj.materialAttr.materials[i].name) {
                        //20200803-thonsha-add-start
                        node.material = new THREE.MeshStandardMaterial({
                            // name: obj.materialAttr.materials[i].name, 
                            // name: material_data.name,
                            name : node.material.name,
                            skinning: node.material.skinning , 
                            map: material_data.map? material_data.map: null, 
                            // map: node.material.map,
                            emissive:material_data.emissionColor? material_data.emissionColor: node.material.emissive,
                            emissiveMap:material_data.emissionMap? material_data.emissionMap: null,
                            normalMap:node.material.normalMap,
                            bumpMap: material_data.bumpMap? material_data.bumpMap: null,
                            flatShading: node.material.flatShading
                        });					
                        //20200803-thonsha-add-end
                        node.material.color = material_data.color;
                        if(material_data.metalnessMap)
                            node.material.metalnessMap = material_data.metalnessMap;
                        else{
                            node.material.metalness = material_data.metallic;
                            node.material.roughness = 1 - material_data.smoothness;
                        }
                        node.material.bumpscale = material_data.bumpscale;

                        node.material.displacementMap = material_data.displacementMap? material_data.displacementMap: null;

                        if(material_data.aoMap){
                   
                            node.geometry.attributes.uv2 = node.geometry.attributes.uv.clone();         
                            // let uv2 = node.geometry.getAttribute("uv2");
                            // if(uv2 == undefined){
                            //     // const uv1Array = node.geometry.getAttribute("uv").array;
                            //     // node.geometry.setAttribute( 'uv2', new THREE.BufferAttribute( uv1Array, 2 ) );
                            //     // node.geometry.attributes.uv2 = node.geometry.attributes.uv.clone()
                            // }
                            
                            node.material.aoMap = material_data.aoMap;
                            node.material.aoMapIntensity = material_data.aoMapIntensity;
                        }
                        
                        //// 先行取消「模型呈現環景」
                        node.material.envMap = self.cubeTex.texture;
                        node.material.envMapIntensity = 1;
                        node.material.needsUpdate = true;
                        node.material.reflectivity = 0;
                        node.material.side = material_data.doubleSided? THREE.DoubleSide: THREE.FrontSide;
                        node.material.transparent = true;

                        // node.material.polygonOffset = true;
                        
                        // console.log('VRFunc.js: _loadGLTFModel: obj.materialAttr.materials',obj.materialAttr.materials);
                        // console.log('VRFunc.js: _loadGLTFModel: standard node.material',node.material);
                        //20200730-thonsha-add-start														
                        if (node.material.map){
                            if ( THREE.GammaEncoding ){
                                node.material.map.encoding = THREE.GammaEncoding;
                            }
                            
                            node.material.map.needsUpdate = true;
                        }
                        //20200730-thonsha-add-end	
                        if(material_data.mode == 0){
                            node.material.opacity = 1;
                            renderer.setClearAlpha(1);

                            node.material.blending = THREE.CustomBlending;
                            node.material.blendEquation = THREE.AddEquation;
                            node.material.blendSrc = THREE.OneFactor;
                            node.material.blendDst = THREE.ZeroFactor;
                            node.material.blendSrcAlpha = THREE.ZeroFactor;
                            node.material.blendDstAlpha = THREE.OneFactor;

                        }
                        else if(material_data.mode == 1){
                            node.material.opacity = 1;
                            node.material.alphaTest = material_data.cutoff;
                            renderer.setClearAlpha(1);

                            node.material.blending = THREE.CustomBlending;
                            node.material.blendEquation = THREE.AddEquation;
                            node.material.blendSrc = THREE.OneFactor;
                            node.material.blendDst = THREE.ZeroFactor;
                            node.material.blendSrcAlpha = THREE.ZeroFactor;
                            node.material.blendDstAlpha = THREE.OneFactor;

                            node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                depthPacking: THREE.RGBADepthPacking,
                                skinning: true,
                                map: material_data.map,
                                alphaTest: material_data.cutoff
                            } );
                        }
                        else if(material_data.mode == 2){
                            node.material.opacity = material_data.alpha
                            node.material.depthWrite = false;
                            
                            //// 假如是「淡出材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                            node.renderOrder = 1;
                        
                            node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                depthPacking: THREE.RGBADepthPacking,
                                skinning: true,
                                map: material_data.map,
                                alphaTest: material_data.cutoff
                            } );
                        }
                        else if(material_data.mode == 3){
                            node.material.opacity = Math.max(material_data.alpha, material_data.metallic);
                            node.material.depthWrite = false;
                            node.material.blending = THREE.CustomBlending;
                            node.material.blendEquation = THREE.AddEquation;
                            node.material.blendSrc = THREE.OneFactor;
                            node.material.blendDst = THREE.OneMinusSrcAlphaFactor;
                            node.material.blendSrcAlpha = THREE.OneFactor;
                            node.material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;

                            //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                            node.renderOrder = 1;

                            node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                depthPacking: THREE.RGBADepthPacking,
                                skinning: true,
                                map: material_data.map,
                                alphaTest: material_data.cutoff
                            } );
                        }
                    }
                }
            });
            // renderer.toneMapping = THREE.ACESFilmicToneMapping;
            // renderer.outputEncoding = THREE.sRGBEncoding;
            
            
            break;
        case "Unlit/Transparent":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name == obj.materialAttr.materials[i].name) {
                        node.material.opacity = 1;
                        node.material.depthWrite = false;
                        //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                        node.renderOrder = 1;
                    }
                }
            });
    //         break;
        case "Unlit/Transparent Cutout":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex  && node.meshIdx == meshIdx){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name == obj.materialAttr.materials[i].name) {
                        node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: material_data.map});
                        node.material.opacity = 1;
                        node.material.alphaTest = material_data.cutoff;
                    }
                }
            });
            break;
        case "Unlit/Texture":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name == obj.materialAttr.materials[i].name) {
                        node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: material_data.map});
                        //20200730-thonsha-add-start
                        if (node.material.map){
                            node.material.map.encoding = THREE.GammaEncoding;
                            node.material.map.needsUpdate = true;
                            // console.log(node.material.map)

                        }
                        //20200730-thonsha-add-end
                        node.material.needsUpdate = true;
                    }
                }
            });
            break;

        case "Unlit/Vertex":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){
                        node.material = new THREE.MeshStandardMaterial({color: new THREE.Color(1,1,1),  name: node.material.name, skinning: node.material.skinning}); 
                        node.material.vertexColors = true;
                    }
                }
            });            
            break

        //20221206-thonsha-add-start
        case "Unlit/ScreenCutoutShader":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx){
                    // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                    // if (node.material.name == obj.materialAttr.materials[i].name) {
                        self.needsRenderTarget = true;
                        
                        node.material.onBeforeCompile = function ( shader ) {
                            shader.uniforms.tEquirect = { value: self.skyRenderTarget.texture };
                            shader.vertexShader = 'varying vec4 vProjection;\n' + shader.vertexShader;
                            shader.vertexShader = shader.vertexShader.replace(
                            '#include <worldpos_vertex>',
                            [
                                '#include <worldpos_vertex>',
                                '	vProjection = projectionMatrix * mvPosition;',
                            ].join( '\n' )
                            );
                            shader.fragmentShader = 'uniform sampler2D tEquirect;\nvarying vec4 vProjection;\n' + shader.fragmentShader;
                            shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <dithering_fragment>',
                            [
                                '#include <dithering_fragment>',
                                '	vec2 sampleUV;',
                                '	sampleUV.x = vProjection.x/vProjection.w*0.5 + 0.5;',
                                '	sampleUV.y = vProjection.y/vProjection.w*0.5 + 0.5;',
                                '	gl_FragColor = texture2D(tEquirect, sampleUV);',
                            ].join( '\n' )
                            );
                        };
                        
                    }
                }
            });
            break;
        //20221206-thonsha-add-end

        case "TSF/BaseOutline1":

            self.needsCullFaceBack = true;
            let objj2 = modelEntity.object3D.clone(true);
            objj2["obj_id"] = modelEntity.getAttribute("id");
            self.cullFaceBackScene.add( objj2 );

            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx){

                        let mat = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1),  name: node.material.name, skinning: node.material.skinning});

                        mat.onBeforeCompile = function ( shader ) {
                            shader.uniforms.toonShade = { value:material_data.toonShade };
                            shader.uniforms.tintColor = { value:material_data.tintColor };
                            shader.uniforms.color = { value:material_data.color };
                            shader.uniforms.brightness = { value:material_data.brightness};
                            shader.vertexShader = 'varying vec3 vProjection;\n' + shader.vertexShader;
                            shader.vertexShader = shader.vertexShader.replace(
                            '#include <begin_vertex>',
                            [   
                                '#include <beginnormal_vertex>',
                                '#include <defaultnormal_vertex>',
                                '#include <begin_vertex>',
                            ].join( '\n' )
                            );
                            shader.vertexShader = shader.vertexShader.replace(
                            '#include <worldpos_vertex>',
                            [
                                '#include <worldpos_vertex>',
                                'vProjection = normalize( transformedNormal );',
                                'vProjection.y = -vProjection.y;',
                                'vProjection.z = -vProjection.z;',
                            ].join( '\n' )
                            );
                            shader.fragmentShader = 'uniform sampler2D toonShade;\nuniform bool tintColor;\nuniform vec3 color;\nuniform float brightness;\nvarying vec3 vProjection;\n' + shader.fragmentShader;
                            shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <fog_fragment>',
                            [
                                '#include <fog_fragment>',
                                '	vec2 sampleUV;',
                                '   vec4 tmp;',
                                '	sampleUV.x = vProjection.x*0.5 + 0.5;',
                                '	sampleUV.y = vProjection.y*0.5 + 0.5;',
                                '   tmp = texture2D(toonShade, sampleUV);',
                                '   if(tintColor){',
                                '       tmp.x = tmp.x * color.x * brightness;',
                                '       tmp.y = tmp.y * color.y * brightness;',
                                '       tmp.z = tmp.z * color.z * brightness;',
                                '   }',
                                '   else{',
                                '       tmp.x = tmp.x * brightness;',
                                '       tmp.y = tmp.y * brightness;',
                                '       tmp.z = tmp.z * brightness;',
                                '   }',
                                '	gl_FragColor.x *= tmp.x;',
                                '	gl_FragColor.y *= tmp.y;',
                                '	gl_FragColor.z *= tmp.z;',
                            ].join( '\n' )
                            );
                        };

                        mat.map = material_data.map;
                        
                        // node.geometry.clearGroups();
                        // node.geometry.addGroup( 0, Infinity, 0 );
                        // node.geometry.addGroup( 0, Infinity, 1 );
                        // node.material = [ ori1, ori2 ]
                        node.material = mat;
                        
                    }
                }
            });

            objj2.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx){

                        let mat = node.material.clone();

                        mat.onBeforeCompile = function ( shader ) {
                            shader.uniforms.boarderColor = { value: material_data.outlineColor };
                            shader.uniforms.boarderWidth = { value: material_data.outlineWidth };
                            shader.vertexShader = 'uniform float boarderWidth;\nvarying vec3 vProjection;\n' + shader.vertexShader;
                            shader.vertexShader = shader.vertexShader.replace(
                            '#include <worldpos_vertex>',
                            [
                                '#include <worldpos_vertex>',
                                'mvPosition.xyz += vNormal * boarderWidth * 0.01;',
                                'gl_Position = projectionMatrix * mvPosition;'
                            ].join( '\n' )
                            );
                            shader.fragmentShader = 'uniform vec3 boarderColor;\n' + shader.fragmentShader;
                            shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <dithering_fragment>',
                            [
                                '#include <dithering_fragment>',
                                'gl_FragColor = vec4(boarderColor, 1.0);',
                            ].join( '\n' )
                            );
                        };
                        
                        node.material = mat;
                        
                    }
                }
            });
            
            break;
        //20200828-thonsha-add-start
        case "Blocks/Basic":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){
                        let mat = node.material.clone();
                        mat.color = material_data.color;
                        node.material = mat;
                    }
                }
            });
            break;

        case "Blocks/BlocksGlass":
        case "Blocks/BlocksGem":
            objj.traverse(node => {
                if (node.material) {
                    let nameSlice = node.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if( mIndex == materialIndex && node.meshIdx == meshIdx ){

                        let mat = node.material.clone();
                        mat.color = material_data.color;
                        node.material = mat;

                        node.material.depthWrite = false;
                        //// 假如是「頂點色材質」？，同時設定繪製排序往前，讓同距離的繪製可以顯示
                        node.renderOrder = 1;
                    }
                }
            });
            break;

        //20200828-thonsha-add-end
        default:
            console.log(`The shader of id ${material_idx} material is not supported currently.`);
            break;
    }

}


export function loadMaterialTexture(self, obj){

    // let self = this;

    let pMaterial = new Promise( function( materialResolve ){

        if (obj.materialAttr.materials.length !=0) {

            let textures = [];  //可能會有許多貼圖須載入，每個分開promise全部通過才最終回傳            
            
            for (let i = 0; i < obj.materialAttr.materials.length;i++){

                let material_idx = obj.materialAttr.materials[i].material_idx;
                //// 暫時規避 新舊版本 材質問題
                if ( material_idx && typeof( material_idx ) == 'string' ){

                }else{
                    continue;
                }
                self.materials_texture_dict[material_idx] = {}

                let material = self.userMaterialDict[material_idx];
                for(let j = 0; j < material.properties.length; j++){

                    let texture_url = null;
                    let scale ;
                    if( material.properties[j].key == "_MainTex" || 
                        material.properties[j].key == "_MetallicGlossMap" ||
                        material.properties[j].key == "_SpecGlossMap" ||
                        material.properties[j].key == "_BumpMap" ||
                        material.properties[j].key == "_ParallaxMap" ||
                        material.properties[j].key == "_OcclusionMap" ||
                        material.properties[j].key == "_EmissionMap" || 
                        material.properties[j].key == "_ToonShade"
                    ){
                        texture_url = material.properties[j].value;
                        scale = material.properties[j].scale.split(',').map(x => Number(x));
                    }

                    let pTexture = new Promise(function(textureResolve){
                        
                        if(texture_url){
                            UrlExists( texture_url , function( retStatus ){

                                if ( retStatus == true ){

                                    let texture = new THREE.TextureLoader().load(texture_url, function(){
                                        texture.wrapS = THREE.RepeatWrapping;
                                        texture.wrapT = THREE.RepeatWrapping;
                                        texture.flipY = false;
                                        texture.repeat.x = scale[0];
                                        texture.repeat.y = scale[1];
                                        // texture.encoding = THREE.sRGBEncoding;
                                        texture.format = THREE.RGBAFormat;
                                        texture.needsUpdate = true;
                                        textureResolve(texture);
                                    });
                                    
                                    if( material.properties[j].key == "_MainTex")
                                        self.materials_texture_dict[material_idx].mainTex = texture;
                                    else if(material.properties[j].key == "_MetallicGlossMap")
                                        self.materials_texture_dict[material_idx].metalnessMap = texture;
                                    else if(material.properties[j].key == "_SpecGlossMap")
                                        self.materials_texture_dict[material_idx].specGlossMap = texture;
                                    else if(material.properties[j].key == "_BumpMap")
                                        self.materials_texture_dict[material_idx].bumpMap = texture;
                                    else if(material.properties[j].key == "_ParallaxMap")
                                        self.materials_texture_dict[material_idx].parallaxMap = texture;
                                    else if(material.properties[j].key == "_OcclusionMap")
                                        self.materials_texture_dict[material_idx].aoMap = texture;
                                    else if(material.properties[j].key == "_EmissionMap")
                                        self.materials_texture_dict[material_idx].emissionMap = texture;
                                    else if(material.properties[j].key == "_ToonShade")
                                        self.materials_texture_dict[material_idx].toonShade = texture;
                
                                }
                                else{
                                    console.log("_loadMaterialTexture: texture url not exists.")
                                    textureResolve(1);
                                }
                
                            });	
                        }
                        else
                            textureResolve(1);
                    })

                    textures.push(pTexture);
                }

                
            }

            Promise.all( textures ).then( function( ret ){
            
                console.log('GLTFModleModule.js: _loadMaterials: textures then ret = ', ret );

                materialResolve(textures);
            
            })
    
            
        }
        else{
            console.log("_loadMaterialTexture: obj no material texture");
            materialResolve(1);
        }
    
    });

    return pMaterial;

}

//// source: v3.4 VRFunc.js
//// 暫時以obj缺少obj.materialAttr.materials[i].material_idx來判斷
//// 表示它是舊版(v3.4)材質球 但是專案升到新版(v3.5.0.0)
function loadMaterial_v340(self, modelEntity, obj, objj, i){

    console.log("____loadGLTFModel obj.materialAttr=", obj.materialAttr)

    let materialIndex = obj.materialAttr.materials[i].materialIndex;
    if(Number.isInteger(materialIndex)){
        console.log("_loadMaterial_v340 materialIndex=", materialIndex)

        let _color = obj.materialAttr.materials[i].color

        //// 取得材質球的顏色，先預設為白色
        let rgba = [1,1,1,1];
        if( (typeof _color === 'string' || _color instanceof String) && _color.split(",").length>=3 ){
            rgba = _color.split(",");
        }
        let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));
        
        // console.log("____loadGLTFModel materialIndex=", materialIndex)
        // console.log("____loadGLTFModel rgba=", rgba)
        // console.log("____loadGLTFModel color=", color)
        //// 至此看起來都與v3.4相同 因此以下沒有改動

        switch (obj.materialAttr.materials[i].shader) {
            case "Unlit/Color":
                objj.traverse(node => {
                    if (node.isMesh) {

                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name === obj.materialAttr.materials[i].name) {
                            node.material = new THREE.MeshBasicMaterial({color: color, name: node.material.name, skinning: node.material.skinning});
                        }
                    }
                });
                break;
            case "Standard":
                console.log("obj.materialAttr.materials[i]", obj.materialAttr.materials[i])

                var renderer = modelEntity.sceneEl.renderer;
                objj.traverse(node => {

                    // console.log("obj.materialAttr.materials[i] node", node)
                    // console.log("obj.materialAttr.materials[i] node.material", node.material)

                    if (node.material) {

                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
    //20200803-thonsha-add-start
                            node.material = new THREE.MeshStandardMaterial({
                                // name: obj.materialAttr.materials[i].name, 
                                name: node.material.name,
                                skinning: node.material.skinning , 
                                map: node.material.map, 
                                emissive:node.material.emissive,
                                emissiveMap:node.material.emissiveMap,
                                normalMap:node.material.normalMap
                            });					
    //20200803-thonsha-add-end
                            node.material.color = color;
                            node.material.metalness = obj.materialAttr.materials[i].metallic;
                            node.material.roughness = 1 - obj.materialAttr.materials[i].smoothness;
                            //// 先行取消「模型呈現環景」
                            node.material.envMap = self.cubeTex.texture;
                            node.material.envMapIntensity = 1;
                            node.material.needsUpdate = true;
                            node.material.reflectivity = 0;
                            node.material.side = THREE.DoubleSide;
                            node.material.transparent = true;

                            // node.material.polygonOffset = true;
                            
                            // console.log('VRFunc.js: _loadGLTFModel: obj.materialAttr.materials',obj.materialAttr.materials);
                            // console.log('VRFunc.js: _loadGLTFModel: standard node.material',node.material);
    //20200730-thonsha-add-start														
                            if (node.material.map){
                                if ( THREE.GammaEncoding ){
                                    node.material.map.encoding = THREE.GammaEncoding;
                                }
                                
                                node.material.map.needsUpdate = true;
                            }
    //20200730-thonsha-add-end	

                            // console.log("obj.materialAttr.materials[i].mode", obj.materialAttr.materials[i].mode)


                            if(obj.materialAttr.materials[i].mode == 0){
                                node.material.opacity = 1;
                                renderer.setClearAlpha(1);

                                node.material.blending = THREE.CustomBlending;
                                node.material.blendEquation = THREE.AddEquation;
                                node.material.blendSrc = THREE.OneFactor;
                                node.material.blendDst = THREE.ZeroFactor;
                                node.material.blendSrcAlpha = THREE.ZeroFactor;
                                node.material.blendDstAlpha = THREE.OneFactor;

                            }
                            else if(obj.materialAttr.materials[i].mode == 1){
                                node.material.opacity = 1;
                                node.material.alphaTest = obj.materialAttr.materials[i].cut_off;
                                renderer.setClearAlpha(1);

                                node.material.blending = THREE.CustomBlending;
                                node.material.blendEquation = THREE.AddEquation;
                                node.material.blendSrc = THREE.OneFactor;
                                node.material.blendDst = THREE.ZeroFactor;
                                node.material.blendSrcAlpha = THREE.ZeroFactor;
                                node.material.blendDstAlpha = THREE.OneFactor;

                                node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                    depthPacking: THREE.RGBADepthPacking,
                                    skinning: true,
                                    map: node.material.map,
                                    alphaTest: obj.materialAttr.materials[i].cut_off
                                } );
                            }
                            else if(obj.materialAttr.materials[i].mode == 2){
                                node.material.opacity = parseFloat(rgba[3]);
                                console.log("node.material.opacity", node.material.opacity)

                                node.material.depthWrite = false;
                                
                                //// 假如是「淡出材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                                node.renderOrder = 1;
                            
                                node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                    depthPacking: THREE.RGBADepthPacking,
                                    skinning: true,
                                    map: node.material.map,
                                    alphaTest: obj.materialAttr.materials[i].cut_off
                                } );
                            }
                            else if(obj.materialAttr.materials[i].mode == 3){
                                node.material.opacity = Math.max(parseFloat(rgba[3]), obj.materialAttr.materials[i].metallic);
                                node.material.depthWrite = false;
                                node.material.blending = THREE.CustomBlending;
                                node.material.blendEquation = THREE.AddEquation;
                                node.material.blendSrc = THREE.OneFactor;
                                node.material.blendDst = THREE.OneMinusSrcAlphaFactor;
                                node.material.blendSrcAlpha = THREE.OneFactor;
                                node.material.blendDstAlpha = THREE.OneMinusSrcAlphaFactor;

                                //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                                node.renderOrder = 1;

                                node.customDepthMaterial = new THREE.MeshDepthMaterial( {
                                    depthPacking: THREE.RGBADepthPacking,
                                    skinning: true,
                                    map: node.material.map,
                                    alphaTest: obj.materialAttr.materials[i].cut_off
                                } );
                            }
                        }
                    }
                });
                // renderer.toneMapping = THREE.ACESFilmicToneMapping;
                // renderer.outputEncoding = THREE.sRGBEncoding;
                
                
                break;
            case "Unlit/Transparent":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            node.material.opacity = 1;
                            node.material.depthWrite = false;
                            //// 假如是「透明材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
                            node.renderOrder = 1;
                        }
                    }
                });
                break;
            case "Unlit/Transparent Cutout":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            node.material.opacity = 1;
                            node.material.alphaTest = 0.5;
                        }
                    }
                });
                break;
            case "Unlit/Texture":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            node.material = new THREE.MeshBasicMaterial({color: new THREE.Color(1,1,1), name: node.material.name, skinning: node.material.skinning, map: node.material.map});
    //20200730-thonsha-add-start
                            if (node.material.map){
                                node.material.map.encoding = THREE.GammaEncoding;
                                node.material.map.needsUpdate = true;
                                // console.log(node.material.map)

                            }
    //20200730-thonsha-add-end
                            node.material.needsUpdate = true;
                        }
                    }
                });
                break;

    //20221206-thonsha-add-start
            case "Unlit/ScreenCutoutShader":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            self.needsRenderTarget = true;
                            
                            node.material.onBeforeCompile = function ( shader ) {
                                shader.uniforms.tEquirect = { value: self.skyRenderTarget.texture };
                                shader.vertexShader = 'varying vec4 vProjection;\n' + shader.vertexShader;
                                shader.vertexShader = shader.vertexShader.replace(
                                '#include <worldpos_vertex>',
                                [
                                    '#include <worldpos_vertex>',
                                    '	vProjection = projectionMatrix * mvPosition;',
                                ].join( '\n' )
                                );
                                shader.fragmentShader = 'uniform sampler2D tEquirect;\nvarying vec4 vProjection;\n' + shader.fragmentShader;
                                shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <dithering_fragment>',
                                [
                                    '#include <dithering_fragment>',
                                    '	vec2 sampleUV;',
                                    '	sampleUV.x = vProjection.x/vProjection.w*0.5 + 0.5;',
                                    '	sampleUV.y = vProjection.y/vProjection.w*0.5 + 0.5;',
                                    '	gl_FragColor = texture2D(tEquirect, sampleUV);',
                                ].join( '\n' )
                                );
                            };
                            
                        }
                    }
                });
                break;
    //20221206-thonsha-add-end

    //20200828-thonsha-add-start
            case "Blocks/Basic":
                // console.log("20200828",objj);
                break;

            case "Blocks/BlocksGem":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            node.material.depthWrite = false;
                            //// 假如是「頂點色材質」？，同時設定繪製排序往前，讓同距離的繪製可以顯示
                            node.renderOrder = 1;
                        }
                    }
                });
                break;
            case "Blocks/BlocksGlass":
                objj.traverse(node => {
                    if (node.material) {
                        let nameSlice = node.material.name.split("_");
                        let mIndex = nameSlice[ nameSlice.length - 1 ];
                        if( mIndex == materialIndex ){
                        // if( mIndex == obj.materialAttr.materials[i].materialIndex){
                        // if (node.material.name == obj.materialAttr.materials[i].name) {
                            node.material.depthWrite = false;
                            //// 假如是「頂點色材質」？，同時設定繪製排序往前，讓同距離的繪製可以顯示
                            node.renderOrder = 1;
                        }
                    }
                });
                break;
    //20200828-thonsha-add-end
            default:
                console.log(`The shader of no. ${i} material is not supported currently.`);
                break;
        }

    }
}

//// WebView 物件 3D
////   (只是暫時物件，先不加入promise all的行列)
////   (或者說 未來可預期  WebView 會處理較久 加入pAll會在場景載入等很久)
export function loadWebViewNotSupport(obj, index, sceneObjNum, position, rotation, scale, cubeTex){
    //// 這裡this是vrController
    const self = this;
    console.log("loadWebViewNotSupport", obj, index, sceneObjNum, position, rotation, scale)

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
        ytEntity.object3D["makarType"] = 'webview';

        if(obj.behav){
            ytEntity.object3D["behav"] = obj.behav ;
        }

        //// 準備一個three平面  作為文字背板    
        let plane, width, height;
        //// 長寬要與YT影片物件接近 數字來自經驗法則
        width  = 1.1 ;
        height = 1.2 ;
        plane = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( width, height , 0 ), 
            new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide, transparent: true, opacity: 0.7 } ),
        );

        //// 印象中v3.5已經不需要這個 有待確認
        if(obj.behav_reference){
            plane["behav_reference"] = obj.behav_reference ;
        }

        ytEntity.object3D.add(plane);
        plane.position.set(0, 0.05, 0)

        //// 文字背板  給一個雜訊的視覺效果
        let paddingPlane;
        paddingPlane = new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( width, height , 0 ), 
            // new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide, transparent: true, opacity: 0.1 } ),
            new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 } ),
        );

        //// 把小平面作為children加入
        ytEntity.object3D.add(paddingPlane)

        paddingPlane.position.set(0, 0.05, 0)
        paddingPlane.rotation.set(0, 0, 0)
        //// 微調一下小平面的縮放
        const paddingCoeficient = 0.95
        paddingPlane.scale.set(paddingCoeficient*1, paddingCoeficient*1, paddingCoeficient*1)
    
        //// 給一個文字物件 寫著 webview not supported
        let tempTextObj = {
            "res_id": "Text",
            "typeAttr": {
                "color": "0.6, 0.6, 0.6, 0.6",
                "margin": 0,
                "content": "webview is\nunsupported\ncurrently.",
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
        
        let pText = self.loadText( tempTextObj , new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,1), true )
        
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

//// WebView 物件 2D
////   (只是暫時物件，先不加入promise all的行列)
export function loadWebViewNotSupport2D(obj, index, sceneObjNum, position, rotation, scale, cubeTex){

    //// 這裡this是vrController
    const self = this;
    console.log("loadWebViewNotSupport2D", obj, index, sceneObjNum, position, rotation, scale)

    // console.log("呼叫 getObj2DTransform VC=", VC)

    const trans = VC.getObj2DTransform(self.editor_version, obj, index, sceneObjNum, position, rotation, scale)
    
    // console.log("呼叫 getObj2DTransform trans=", trans)

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


    //// 給一個文字物件 寫著 WebView not supported
    let tempTextObj = {
        "res_id": "Text",
        "typeAttr": {
            "color": "0.6, 0.6, 0.6, 0.6",
            "margin": 0,
            "content": "WebView is\nunsupported\ncurrently.",
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
        result.position.z = 0.05;
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