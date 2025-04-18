
import { setARTransform } from "./setTransform.js";
import { verionControl as VC } from "../MakarWebXRVersionControl.js";

export function loadLight( scene3DRoot, obj, position, rotation, scale , quaternion ) {

    // 這裡 this 是 arController
    let self = this;

    let editor_ver = VC.getProjDataEditorVer( arController.currentProjData );


    let pLight = new Promise( function( lightResolve ){

        let dpi = self.gcssTargets.dpi[ scene3DRoot.GCSSID] ; 
        let GCSSWidth= self.gcssTargets.width[ scene3DRoot.GCSSID] ; 
        let GCSSHeight= self.gcssTargets.height[ scene3DRoot.GCSSID] ; 

        

        let Light = document.createElement("a-entity");

        // LightContainer.appendChild( Light );

        if ( editor_ver && editor_ver.v0 == 3 && editor_ver.v1 >= 5
        ){
            Light.setAttribute("id", obj.generalAttr.obj_id);

            let attr = "type:" + obj.typeAttr.light_type;
            let rgb = obj.typeAttr.color.split(",");
            let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2]));
            attr += "; color:#"+color.getHexString()

            attr += ";intensity:"+obj.typeAttr.intensity

            if (obj.typeAttr.light_type == "point" || obj.typeAttr.light_type == "spot" ){
                attr += ";distance:" + ( obj.typeAttr.range*2*100*25.4/dpi )
                attr += ";decay: 2"
            }

            if (obj.typeAttr.light_type == "spot"){
                attr += ";angle:"+(parseFloat(obj.typeAttr.spotAngle)/2).toString()
                attr += ";penumbra: 0.2";
            }

            if (obj.typeAttr.shadow != "None"  && false ){
                Light.setAttribute("castShadow", true);
                attr += ";castShadow: true ;shadowCameraVisible: false; shadowBias:-0.0005; shadowCameraTop:10; shadowCameraBottom:-10; shadowCameraRight:10; shadowCameraLeft:-10; shadowMapHeight:1024; shadowMapWidth:1024; shadowCameraFar: 500; shadowCameraNear: 0.5"
            }

            Light.setAttribute("light", attr);


            if (obj.typeAttr.light_type == "directional"){
                //// 強制「平行光」不產生陰影，編輯器也是如此
                Light.setAttribute("castShadow", false);
                Light.setAttribute("light", 'castShadow: false; ');

            }

            //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
            if ( obj.generalAttr.active == false ){
                Light.setAttribute("visible", false);
            }


            Light.addEventListener('loaded', function( evt ){
                if (evt.target == evt.currentTarget){
                    //// 很怪，「聚光燈」會預設生成「target」，但是「平行光」並不會
                    if (obj.typeAttr.light_type == "directional"){

                        //// 設置「方向光」角度
                        Light.object3D.children[0].position.set( 0, 0, 0 );
                        let lightTarget = new THREE.Object3D();
                        lightTarget.name = 'lightTarget';
                        lightTarget.position.set(0, 0, -1);
                        Light.object3D.children[0].target = lightTarget;
                        Light.object3D.add( lightTarget );

                        //// 測試加入 「 輔助器 」
                        // let DLhelper = new THREE.DirectionalLightHelper( Light.object3D.children[0], 5 );
                        // Light.object3D.add( DLhelper );

                    }else if ( obj.typeAttr.light_type == "spot"  ){

                        //// 測試加入 「 輔助器 」
                        // let spotLightHelper = new THREE.SpotLightHelper( Light.object3D.children[0] );
                        // Light.object3D.add( spotLightHelper );

                    }else if ( obj.typeAttr.light_type == "point"  ){

                    }

                    let dp = new THREE.Vector3();
                    if (obj.generalAttr.obj_parent_id ){
                        Light.object3D.obj_parent_id = obj.generalAttr.obj_parent_id;
                        dp.addScaledVector( position, 1*100*25.4/dpi );
                        ///// 子物件的 z 軸要正負顛倒
                        let pz = dp.z ;
                        dp.z = -pz;
                        setARTransform( Light, dp, rotation, scale, quaternion );

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
                                console.log("three.js: _loadAframeLight: serverVersion version wrong", serverVersion);
                        }

                        //// 假如沒有「母物件」，代表此物件是直接掛載在「基礎辨識圖」，所以位置上要平移到中央，旋轉上 x 要多加 90 度
                        let py = dp.y;
                        let pz = dp.z;
                        dp.y = pz;
                        dp.z = py;

                        setARTransform( Light, dp, rotation, scale, quaternion );

                        //// 第一層物件必須放置於辨識圖中央
                        Light.object3D.position.add( new THREE.Vector3( GCSSWidth*25.4/dpi/2 , GCSSHeight*25.4/dpi/2 , 0 ) );
                        //// 第一層物件必須垂直於辨識圖表面
                        Light.object3D.rotation.x += Math.PI*90/180;

                    }

                    //// 光源物件，紀錄強度、顏色
                    let pm = Light.object3D;
                    pm.originTransform = { position: pm.position.clone() , rotation: pm.rotation.clone() , scale: pm.scale.clone() } ;
                    //// 邏輯物件：設立「重設參數功能」
                    if ( obj.generalAttr.logic ){
                        pm.resetProperty = function(){
                            pm.children[0].intensity = obj.typeAttr.intensity
                            pm.children[0].color.copy( color ); 

                            //// 重設可見度
                            if ( typeof( obj.generalAttr.active ) == 'boolean' ){
                                Light.setAttribute("visible", obj.generalAttr.active );
                            }

                        }
                    }


                    Light.object3D.makarType = 'light';
                    Light.object3D["makarObject"] = true; 

                    self.makarObjects.push(Light); 

                    lightResolve( Light );
                }
            });


            if (obj.generalAttr.obj_parent_id ){
                // console.log("three.js: _loadTexture: with parent, obj=", obj );
                let timeoutID = setInterval( function () {
                    let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                    if (parent){ 
                        if(parent.object3D.children.length > 0){
                            parent.appendChild( Light );
                            window.clearInterval(timeoutID);
                        } 
                    }
                }, 1);

            }else{
                
                console.log('three.js: _loadAframeLight: loaded: no parent prs=' , Light.object3D.position , Light.object3D.rotation, Light.object3D.scale  );
                scene3DRoot.appendChild( Light );
                
            }


        }

        


    } );

    return pLight;


}