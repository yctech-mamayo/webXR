import { setTransform } from "./setTransform.js";

export function loadLight( obj, position, rotation, scale ) {
    let self = this
    let pLight = new Promise( function( lightResolve ){

        console.log("VRFunc.js: _loadLight: obj=", obj);  
        let Light = document.createElement("a-entity");
        Light.setAttribute("id", obj.generalAttr.obj_id);

        //[start-20230725-howardhsu-modify]//
        //// 原本的 attr 參數前面沒有 var 或 let，這裡因為要寫成module而加上 暫時不確定是否有其他js檔會用到它
        let attr = "type:" + obj.typeAttr.light_type    
        //[end-20230725-howardhsu-modify]//

        let rgb = obj.typeAttr.color.split(",");
        let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2]));
        attr += "; color:#"+color.getHexString()

        attr += ";intensity:"+obj.typeAttr.intensity

        if (obj.typeAttr.light_type == "point" || obj.typeAttr.light_type == "spot" ){
            attr += ";distance:"+obj.typeAttr.range
            attr += ";decay: 4"
        }

        if (obj.typeAttr.light_type == "spot"){
            attr += ";angle:"+(parseFloat(obj.typeAttr.spotAngle)/2).toString()
            attr += ";penumbra: 0.2";
        }

        if (obj.typeAttr.shadow != "None"){
            Light.setAttribute("castShadow", true);
            attr += ";castShadow: true ;shadowCameraVisible: false; shadowBias:-0.0005; shadowCameraTop:10; shadowCameraBottom:-10; shadowCameraRight:10; shadowCameraLeft:-10; shadowMapHeight:1024; shadowMapWidth:1024; shadowCameraFar: 500; shadowCameraNear: 0.5"
        }

        Light.setAttribute("light", attr);
                
        if (obj.typeAttr.light_type == "directional"){
            
            setTransform(Light, position, rotation, scale);

            //// 子物件修改
            //[start-20230629-howardhsu-add]//
            //// 祥霆給的正解: 
            //// 備註：這邊確認 Light.object3D.children[0].target 沒有用處，因為不再場景內部
            //// 備註：方向光假如沒有設定 target 或是 target 未在場景內，那此方向光指向「場景原點」
            //// 假如此方向光有 target 在
            Light.addEventListener( 'loaded' , function( e ){
                if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "DirectionalLight" ){
                    
                    Light.object3D["makarObject"] = true; 
                    Light.object3D["makarType"] = 'light'; 

                    let normalVector = new THREE.Vector3( 0, 0, 1 );
                    // console.log('VRFunc.js: _loadLight: normalVector=' , normalVector );

                    let lightTarget = Light.object3D.children[0].target;
                    lightTarget.position.copy( normalVector );     
                    // console.log('VRFunc.js: _loadLight: normalVector=' , lightTarget );

                    Light.object3D.children[0].add( lightTarget ); 

                    if ( obj.typeAttr.helper ){
                        let helper  = new THREE.DirectionalLightHelper( Light.object3D.children[0] , 1 );
                        self.vrScene.object3D.add( helper  );
                        Light.object3D.children[0].helper = helper ;
                    }
                }
            })
            //[end-20230629-howardhsu-add]//
            
            //// 強制「平行光」不產生陰影，編輯器也是如此
            Light.setAttribute("castShadow", false);
            Light.setAttribute("light", 'castShadow: false; ');
        }

        //[start-20230630-howardhsu-add]//
        else if (obj.typeAttr.light_type == "spot"){						
            setTransform(Light, position, rotation, scale);
            console.log("3.5 rotation in loadLight spotLight", rotation)
            Light.addEventListener( 'loaded' , function( e ){
                if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "SpotLight" ){
                    //// 調整聚光燈照射方向
                    let normalVector = new THREE.Vector3( 0, 0, 1 );                    
                    let lightTarget = Light.object3D.children[0].target;
                    lightTarget.position.copy( normalVector );     
                    Light.object3D.children[0].add( lightTarget ); 

                    if ( obj.typeAttr.helper ){
                        let spotLightHelper = new THREE.SpotLightHelper( Light.object3D.children[0] );
                        self.vrScene.object3D.add( spotLightHelper );
                        Light.object3D.children[0].helper = spotLightHelper;
                    }

                }
            })
        }
        else if (obj.typeAttr.light_type == "point"){
            setTransform(Light, position, rotation, scale);
        }
        //[end-20230630-howardhsu-add]//
        else{
            //// 目前沒有 平行光、聚光燈、點光源 以外的光源類型，不應該會走進這段
            setTransform(Light, position, rotation, scale);
            console.log("VRFunc.js: _loadLight: Unexpected light type!!  obj.typeAttr.light_type=", obj.typeAttr.light_type)
        }

        //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
        if ( obj.generalAttr.active == false ){
            Light.setAttribute("visible", false);
        }

        console.log("VRFunc.js: _loadLight: Light=", Light);
        self.makarObjects.push( Light );
        // self.vrScene.appendChild(Light);// this = vrScene

        if(obj.generalAttr.obj_parent_id){
            let timeoutID = setInterval( function () {
                let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                if (parent){ 
                    if(parent.object3D.children.length > 0){
                        parent.appendChild(Light);
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 1);
        }
        else{
            self.vrScene.appendChild(Light);
        }


        lightResolve( Light );

    });

    return pLight;
}