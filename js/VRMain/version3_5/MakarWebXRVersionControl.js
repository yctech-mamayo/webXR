
//// 因應 3.5.0 改版，未來所有「場景相關資料」，必須要過「版本判斷」

//// 由於需要判斷「 所有版本 」， v3.5.0 以後 編輯器版本號 變為 4 碼

//// 專案相關 基本判斷 
function projDataBasicCheck( projData ){
    if ( !projData ){
        console.warn(' _projDataBasicCheck : _projData not exist ')
        return -1;
    }

    let editor_ver = projData.editor_ver;

    if ( !editor_ver || typeof( editor_ver ) != 'string' ){
        console.warn(' _projDataBasicCheck_: editor_ver error ' , editor_ver)
        return -1;
    }

    let vArr = editor_ver.split('.');
    if ( vArr.length != 3 && vArr.length != 4  ){
        console.warn(' _projDataBasicCheck_: vArr error ' , vArr)
        return -1;
    }

}


//// 場景相關 基本判斷流程
function sceneBasicCheck( sceneData ) {
    if ( !sceneData  ){
        console.warn(' _sceneBasicCheck_ : _sceneData not exist ')
        return -1;
    }

    let editor_ver = sceneData.editor_ver;

    //// 必須強制要有 「 editor_ver 」
    if ( !editor_ver || typeof( editor_ver ) != 'string' ){
        console.warn(' _sceneBasicCheck_: editor_ver error ' , editor_ver)
        return -1;
    }

    let vArr = editor_ver.split('.');
    if ( vArr.length != 3 && vArr.length != 4 ){
        console.warn(' _sceneBasicCheck_: vArr error ' , vArr)
        return -1;
    }
}

//// 取得「版本號」
function getVersion( editor_ver ){

    let vArr = editor_ver.split('.');
    
    let va = {};

    //// 確定版本號都為「正整數」
    let intCheck = true;
    vArr.forEach( e =>{
        if ( !Number.isInteger( Number( e ) ) ){
            intCheck = false;
        }
    })

    if ( intCheck ){
        va.v0 = Number( vArr[0] ) ;
        va.v1 = Number( vArr[1] ) ;
        va.v2 = Number( vArr[2] ) ;

        //// v3.5.0 以後，改為四碼 v3.5.0.0
        if ( vArr.length == 3 ){

        }else if ( vArr.length == 4 ){
            va.v3 = Number( vArr[ 3 ] ) ;
        }
    }

    return va;
    
}

class VerionControl {

    //// 3.5.0 以後，取得專案資料的 路徑有所變化，希望後續維持
    getOneProj ( projData ){

        let project = {};
        if ( projData ){
            let isBasicChecked = projDataBasicCheck( projData )
            if ( isBasicChecked < 0 ){
                return {};
            }else{
                project = projData;
            }
        }
    
        return project;
    
    }


    //// 從「 專案資料 」 跟 「 場景編號 」 取得 「 邏輯 XML 位址 」
    getSceneLogicXML( sceneData , sceneIndex ){
        
        let xmlUrl = '';
        if ( sceneData  ){

            let isBasicChecked = sceneBasicCheck( sceneData );
            if ( isBasicChecked < 0 ){
                return xmlUrl;
            }
            let editor_ver = sceneData.editor_ver;

            let vo = getVersion( editor_ver );

            let v0 = vo.v0 ;
            let v1 = vo.v1 ;
            let v2 = vo.v2 ;
            let v3 = vo.v3 ;
            if ( v0 == 3 && v1 >= 5 ){
                let scenes = sceneData.scenes ;
                if ( scenes[ sceneIndex ] ){
                    xmlUrl = scenes[ sceneIndex ].xml_url;
                }

            }else{
                
            }
            
            // let isBasicChecked = projDataBasicCheck( projData )
            // if ( isBasicChecked < 0 ){
            //     return {};
            // }else{

            //     if ( Array.isArray( projData.xml_urls ) && 
            //     projData.xml_urls[ sceneIndex ]
            //     ){
            //         xmlUrl = projData.xml_urls[ sceneIndex ];
            //     }
            // }

        }
    
        return xmlUrl ;

    }

    //// 取得「專案」的「編輯器版本」，使用上，假如「場景物件」的參數因應「編輯器版本」有不同
    //// 例如「模型物件的動畫」「模型物件的材質」
    getProjDataEditorVer( projData ){

        let isBasicChecked = projDataBasicCheck( projData )
        if ( isBasicChecked < 0 ){
            return {};
        }

        let editor_ver = projData.editor_ver;

        let vo = getVersion( editor_ver ); 
        
        return vo;

    }

    //// 取得 專案 場景列表
    getScenes ( sceneData ){
        //// 基本判斷 ，假如失敗。回傳空陣列
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return [];
        }
    
        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;

        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let scenes = [];
        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes ) ){
                scenes = sceneData.scenes ;
                console.log(' _getScenes_: success ' , vo , scenes )
            }
            
        }else{
            console.warn(' _getScenes_: vo error ' , vo)
        }
    
        return scenes ;
    
    }

    //// 從「專案場景資料」中，找出是否帶有 「AR」類型場景
    checkSceneIncludeAR( sceneData ){
        //// 基本判斷 ，假如失敗。回傳空陣列
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return false;
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;

        let vo = getVersion( editor_ver );
        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;
        let isAR = false;

        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes ) ){
                let scenes = sceneData.scenes ;
                for ( let i = 0; i < scenes.length; i++ ){
                    let scene = scenes[i];
                    if ( scene && scene.info && scene.info.type == 'ar' ){
                        isAR = true;
                    }
                }
            }
        }
        return isAR;
    }

    //// 從「專案場景資料」中，找出是否帶有 「VR」類型場景
    checkSceneIncludeVR( sceneData ){
        //// 基本判斷 ，假如失敗。回傳空陣列
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return false;
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;

        let vo = getVersion( editor_ver );
        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;
        let isVR = false;

        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes ) ){
                let scenes = sceneData.scenes ;
                for ( let i = 0; i < scenes.length; i++ ){
                    let scene = scenes[i];
                    if ( scene && scene.info && scene.info.type == 'vr' ){
                        isVR = true;
                    }
                }
            }
        }
        return isVR;
    }

    //// 從「專案場景資料」中，找出是否帶有 「VR」類型場景
    checkSceneIncludeXR( sceneData ){
        //// 基本判斷 ，假如失敗。回傳空陣列
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return false;
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;

        let vo = getVersion( editor_ver );
        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;
        let isXR = false;

        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes ) ){
                let scenes = sceneData.scenes ;
                for ( let i = 0; i < scenes.length; i++ ){
                    let scene = scenes[i];
                    if ( scene && scene.info && scene.info.type == 'ar_slam' ){
                        isXR = true;
                    }
                }
            }
        }
        return isXR;
    }


    //// 從「專案場景資料」跟「場景編號」取得「場景類型」

    getSceneType( sceneData , sceneIndex ){
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return '';
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let sceneType = '';

        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes )  ){
                let scenes = sceneData.scenes ;
                if ( scenes[ sceneIndex ]  && scenes[ sceneIndex ].info && scenes[ sceneIndex ].info.type  ){
                    sceneType = scenes[ sceneIndex ].info.type;
                }
                console.log(' _getSceneType_ : success ' , sceneType )
            }
            
        }else{
            console.warn(' _getSceneType_ : error ' , sceneIndex , sceneData )
        }

        return sceneType;

    }


    //// 從「專案場景資料」跟「場景編號」取得「場景下物件列表」
    getSceneObjs( sceneData , sceneIndex ){
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return [];
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let objs = [];

        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes )  ){
                
                let scenes = sceneData.scenes ;
                
                if ( scenes[ sceneIndex ]  && Array.isArray( scenes[ sceneIndex ].objs )  ){

                    objs = scenes[ sceneIndex ].objs;

                }

                console.log(' _getSceneObjs_ : success ' , vo , scenes )
            }
            
        }else{
            console.warn(' _getSceneObjs_ : vo error ' , vo)
        }

        return objs;

    }


    //// 取得場景「所有事件列表」
    getSceneBehav( sceneData , sceneIndex ){
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return [];
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let scene_behavs = [];

        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes )  ){
                let scenes = sceneData.scenes ;
                if ( scenes[ sceneIndex ]  && Array.isArray( scenes[ sceneIndex ].behav )  ){
                    scene_behavs = scenes[ sceneIndex ].behav;
                }
                console.log(' _getSceneBehav_ : success ' , scene_behavs )
            }
            
        }else{
            console.warn(' _getSceneBehav_ : error ' , sceneIndex , sceneData );
        }

        return scene_behavs;
    }

    //// 從 「場景所有事件」找出 與「當前物件相關」，放入物件底下
    setBehavIntoObj( sceneData , sceneIndex , obj ){
        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return [];
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let scene_behavs = [];

        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){
            if ( sceneData && Array.isArray( sceneData.scenes )  ){
                let scenes = sceneData.scenes ;
                if ( scenes[ sceneIndex ]  && Array.isArray( scenes[ sceneIndex ].behav )  ){
                    scene_behavs = scenes[ sceneIndex ].behav;
                }

                scene_behavs.forEach( behav => {    
                    if( behav.trigger_obj_id && behav.trigger_obj_id == obj.generalAttr.obj_id ){
                        if(obj.behav && Array.isArray(obj.behav) && obj.behav.length > 0){
                            obj.behav.push(behav)
                        } else {
                            obj.behav = [behav]
                        }
                    }
                })

            }
            
        }else{
            console.warn(' _setBehavIntoObj_ : version error ' , sceneIndex , sceneData );
        }

    }


    //// 取得 物件 的 基礎 「位置」「旋轉」「大小」參數
    getObjTransform( sceneData , scene_obj ){

        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return {};
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let transform = {
            position: null,
            rotation: null,
            scale: null , 
            quaternion: null,
        }
        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){
            if ( scene_obj.generalAttr && scene_obj.generalAttr.obj_type == '2d'  ){

                if ( scene_obj.transformAttr && scene_obj.transformAttr.rect_transform && 
                    scene_obj.transformAttr.rect_transform[0] )
                {

                    transform.position = new THREE.Vector3().fromArray( scene_obj.transformAttr.rect_transform[0].position.split(",").map( x => Number(x) ) );

                    transform.rotation = new THREE.Vector3().fromArray( scene_obj.transformAttr.rect_transform[0].rotation.split(",").map( x => Number(x) ) );

                    transform.scale = new THREE.Vector3().fromArray( scene_obj.transformAttr.rect_transform[0].scale.split(",").map( x => Number(x) ) );

                    

                }else{
                    console.warn(' _getObjTransform_ : v3.5.0 type 2d error ' , scene_obj );
                }


            } else if ( scene_obj.generalAttr && scene_obj.generalAttr.obj_type == '3d' ){

                if ( scene_obj.transformAttr && scene_obj.transformAttr.transform ){

                    transform.position = new THREE.Vector3().fromArray( scene_obj.transformAttr.transform[0].split(",").map( x => Number(x) ) );

                    let quaternionArray = scene_obj.transformAttr.transform[1].split(",").map( x => Number(x) ) 
                    transform.quaternion = new THREE.Quaternion( quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3] )

                    let eulerAngle = new THREE.Euler().setFromQuaternion( transform.quaternion, "YXZ");
                    transform.rotation = new THREE.Vector3( eulerAngle.x , 1 * eulerAngle.y , 1 * eulerAngle.z );

                    transform.scale = new THREE.Vector3().fromArray(scene_obj.transformAttr.transform[2].split(",").map(function(x){return Number(x)}) );

                }else{
                    console.warn(' _getObjTransform_ : v3.5.0 type 3d error ' , scene_obj );
                }

            }
            

        }else{
            console.warn(' _getObjTransform_ :  error ' , scene_obj );
        }

        return transform ;

    }

    //// 取得 物件 的「 2D/3D 型態 」
    getObjObjType( sceneData , scene_obj ){

        let isBasicChecked = sceneBasicCheck( sceneData );
        if ( isBasicChecked < 0 ){
            return '';
        }

        //// 進入版本控制
        let editor_ver = sceneData.editor_ver;
        let vo = getVersion( editor_ver );

        let v0 = vo.v0 ;
        let v1 = vo.v1 ;
        let v2 = vo.v2 ;
        let v3 = vo.v3 ;

        let obj_type = '';
        //// 3.5.0
        if ( v0 == 3 && v1 >= 5 ){

            if ( scene_obj.generalAttr && scene_obj.generalAttr.obj_type ){
                obj_type = scene_obj.generalAttr.obj_type
            }

        }else{
            console.warn(' _getObjObjType_ :  error ' , scene_obj );
        }

        return obj_type ;

    }

    //// 取得 2D物件 的 位置 旋轉 大小
    getObj2DTransform(vo, scene_obj) {
        //// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
        //// 位置    縮放    尺寸   旋轉
        let rectP, rectSizeDelta, rectScale , rectR ; 
        if ( Object.keys( vo ).length == 4 ){
            let largeV  = Number( vo.v0 );
            let middleV = Number( vo.v1 );
            let smallV  = Number( vo.v2 );

            let trans;
            if ( largeV > 3 || 
                ( largeV == 3 && middleV >= 5 ) 
            ){
                // console.log("呼叫 getObj2DTransform", "表示這裡是v3.5.1.1")
                trans = getObj2DInfo350();
            } else{
                trans = getObj2DInfo350();                                              
            }

            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                // rectP = trans.rectP;
                // rectSizeDelta = trans.rectSizeDelta;
                // rectScale = trans.rectScale;
                // rectR = trans.rectR;
                return trans;
            }else{
                // video2DResolve( false );
                console.warn(' _getObj2DInfo_ :  error ' , scene_obj );
                return false;
            }

        }else{
            let trans = getObj2DInfo350();
            if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                // rectP=trans.rectP;
                // rectSizeDelta=trans.rectSizeDelta;
                // rectScale=trans.rectScale;
                // rectR = trans.rectR;
                return trans;
            }else{
                // video2DResolve( false );
                return false;
            }
        }

        function getObj2DInfo350 (){
            let tempInfo = {};
            //// 位置    縮放    尺寸   旋轉
            let rectP, rectSizeDelta, rectScale , rectR ; 
            if ( scene_obj.transformAttr.rect_transform && Array.isArray( scene_obj.transformAttr.rect_transform ) && scene_obj.transformAttr.rect_transform.length > 0 ){

                if ( !Number.isFinite( self.selectedResolutionIndex )   ){
                    console.log(' _getObj2DInfo350: error, missing _selectedResolutionIndex' );
                    self.selectedResolutionIndex = 0;
                }
                let selectedObj2DInfo = scene_obj.transformAttr.rect_transform[ self.selectedResolutionIndex ];

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

                    // //// 為了相容 ，把「縮放資料」取代 「原本 scale」
                    // scale.x = rectScale[0];
                    // scale.y = rectScale[1];

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
    }

}

export const verionControl = new VerionControl();

