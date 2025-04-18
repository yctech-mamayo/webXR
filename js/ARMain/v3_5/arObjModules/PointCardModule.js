import { checkDefaultObj } from "../utility.js";

//// 載入背景圖片、集點卡entity
export function loadPointCard( scene2DRoot, obj, i, sceneObjNum, targetID, position, rotation, scale) {

    console.log("ARFunc.js: ARWrapper: _loadPointCard obj=", obj );
    //// "this" must be arController
    let self = this;
    

    //// 檢查是否為「預設物件」
    // checkDefaultImage( obj );
    
    let pScratch = new Promise( function( pointcardResolve ){

        const obj_id = obj.generalAttr.obj_id
        const proj_id = makarUserData.oneProjData.proj_id


        // scene2DRoot 在 v3.4 是 markerRoot2D
        scene2DRoot.module = "PointCard"; 
        scene2DRoot.loadModule = "pointCard";
        scene2DRoot.project_module = obj.typeAttr.module;
        scene2DRoot.project_module.obj_id = obj_id;
        scene2DRoot.proj_id = proj_id;

        //// 先新增/取得這張集點卡
        const pointCard = window.aPointCard.createPointCard(scene2DRoot, obj, proj_id);

        let scaleRatioXY = self.scaleRatioXY
        let selectedResolutionIndex = self.selectedResolutionIndex
        if( !selectedResolutionIndex ) {
            //// 有時候會還沒有值 預設先給0
            selectedResolutionIndex = 0
        }
        let _position = new THREE.Vector3().fromArray( obj.transformAttr.rect_transform[selectedResolutionIndex].position.split(",").map( x => Number(x) ) )
        let _rotation = new THREE.Vector4().fromArray( obj.transformAttr.rect_transform[selectedResolutionIndex].rotation.split(",").map( x => Number(x) ) )
        let _scale = new THREE.Vector3().fromArray( obj.transformAttr.rect_transform[selectedResolutionIndex].scale.split(",").map( x => Number(x) ) )
        
        let quaternionRotation = new THREE.Quaternion( _rotation.x,  _rotation.y,  _rotation.z,  _rotation.w)
        let eulerAngle = new THREE.Euler().setFromQuaternion( quaternionRotation, "YXZ");
        let _rectR = new THREE.Vector3( eulerAngle.x ,  eulerAngle.y ,  eulerAngle.z );

        //// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
        _rectR.z =  -1 * _rectR.z

        // let pointCardEntity  = this.pointCardEntity
        let pointCardEntity  = new THREE.Object3D()
        pointCard.pointCardEntity = pointCardEntity

        //// 位置
        pointCardEntity.translateX(  _position.x*scaleRatioXY ) ;
        pointCardEntity.translateY( - _position.y*scaleRatioXY ) ;
        pointCardEntity.translateZ( -1 + i/sceneObjNum );// [-1, 0] 

        pointCardEntity.rotateZ( _rectR.z ) 

        pointCardEntity.scale.set( _scale.x , _scale.y, 1 );

        self.makarObjects2D.push(pointCardEntity);
        // scene2DRoot.add(pointCardEntity);

        if ( obj.behav ){
            pointCardEntity["behav"] = obj.behav ;

            //// 載入時候建制「群組物件資料」「注視事件」
            self.setObjectBehavAll( obj );
        }
        pointCardEntity.visible = true
        if (obj.generalAttr.active == false){
            pointCardEntity.visible = false;
        }

        pointCardEntity["makarObject"] = true ;
        pointCardEntity["makarType"] = "pointCard"
        pointCardEntity["obj_id"] = obj.generalAttr.obj_id ;
        // console.log("%c pointCard add to scene2d", "color: lime; font-size:20px", self.makarObjects2D)
        
        ////// 載入集點卡背景圖
        // console.log("arController loadMakarARScene load集點卡 要transform集點卡entity & 載入背景圖", obj)
        let pointCardBGUrl; 
        if (obj.typeAttr.module.backgroundID){
            if( obj.typeAttr.module.backgroundID == "PointCard_Background"){
                //// 集點卡預設圖片
                pointCardBGUrl = "https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/pointCard/PointCard_Background.png";
            } else if ( makarUserData.userProjResDict[obj.typeAttr.module.backgroundID] ){
                //// user上傳的圖片
                pointCardBGUrl = makarUserData.userProjResDict[obj.typeAttr.module.backgroundID].res_url;  
            } else {
                //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
            }
        }else{
            // 在v3.4.0.0的預設圖片
            pointCardBGUrl = "https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/pointCard/PointCard_Background.png";
        };

        //// 顯示集點卡背景圖    v3.5 先把attribute補齊，之後才可以呼叫 loadTexture2D
        let pointcardBG = {
            res_id: obj.typeAttr.module.backgroundID,
            transformAttr: { "rect_transform" : obj.typeAttr.module.rectTransform },
            generalAttr: { 
                "obj_id" : obj.typeAttr.module.backgroundID,
                "obj_type": "2d",
                "obj_parent_id": obj.generalAttr.obj_id,
                "active": true,
                "interactable": true,
                "logic": false
            },
            typeAttr: { "placeholder" : "placeholder" },
            sub_type: 'jpg',
            res_url: pointCardBGUrl
        }
        // console.log("arController loadMakarARScene load集點卡", pointcardBG)
        if( !pointcardBG.res_url ){
            checkDefaultObj(pointcardBG)
        }
        // console.log("arController loadMakarARScene load集點卡 checkDefaultObj之後", pointcardBG)
        let pPointCardBGUrl = self.loadTexture2D( scene2DRoot, pointcardBG, i, sceneObjNum, null, null, {x:null, y:null} )

        pPointCardBGUrl.then( pc2d => {
                
            //// 檢查集點狀況
            let playing_user = localStorage.getItem("MakarUserID")
            if ( playing_user && false){
                ////假如使用者有登入[makar or third party ] 現在還沒有這個部份，預先設置。
            }else{
                //// user未登入
                playing_user = ""

                // ////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
                let device_id = localStorage.getItem("device_id"); 
                if( !device_id ){ 
                    device_id = new Date().getTime() + "_" + makeid(10) ;
                    localStorage.setItem( "device_id",  device_id );
                }

                //// model view 和 XR view
                if( !targetID ) {
                    //// 表示現在是 model view  (在 setViewModeSceneObj 的 _loadMakarARScene 給 targetID 是 null)
                    //// 只顯示目前已經收集的點數：從 mDB 取得記錄
                    window.aPointCard.getPointCardProjectFromMDB(proj_id).then( getProjRet => {
                        // console.log('ARController _loadMakarARScene: getPointCardProjectFromMDB return=', getProjRet)

                        //// 註:  若只要顯示當前的集點卡: getPointTarget給null, setProjRet給從mDB裡面get到的資料, isPointAdded給false
                        window.aPointCard.loadCardWithAddedPoint(scene2DRoot, pointCard, obj, null, i, sceneObjNum, getProjRet, false)

                    })

                } else {
                    //// 先從 mDB 取得記錄
                    window.aPointCard.getPointCardProjectFromMDB(proj_id).then( getProjRet => {
                        // console.log('ARController _loadMakarARScene: getPointCardProjectFromMDB return=', getProjRet)
                    
                        //// 在集點卡物件的json裡找: 進場景時掃到的場景辨識圖
                        let getPointTarget = obj.typeAttr.module.points.find( item => item.targetID == targetID );

                        //// 假如專案沒有紀錄過，將此次的集點卡資訊放入mDB
                        if ( !getProjRet.proj_id ){
                            //// 先初始化這張集點卡的資料  再集一個點數，存到mDB，顯示點數和html 
                            pointCard.init(getPointTarget.targetID, pc2d)
                            window.aPointCard.loadNewCard(scene2DRoot, obj, pointCard, getPointTarget, i, sceneObjNum)
                                
                        } else {
                            //// 假如專案有紀錄過，先確認此次集點卡是否記錄過        
                            if(getProjRet.pointCards){

                                if( getProjRet.pointCards[obj_id]){

                                    //// 當前集點卡在mDB已存在 先判斷此次集點辨識圖是否已有記錄 ? 有集過就跳過 : 沒集過則新增一集點記錄                                                
                                    aPointCard.addPoint(getProjRet , obj_id, getPointTarget.targetID).then( setProjRet => {
                                        
                                        //// 先新增/取得這張集點卡，更新該集點卡的資料
                                        pointCard.update(setProjRet.pointCards[obj_id], pc2d)

                                        //// 顯示所有點數 假如此次有新增集點 則post一筆log給後端api
                                        const isPointAdded = getProjRet != setProjRet
                                        aPointCard.loadCardWithAddedPoint(scene2DRoot, pointCard, obj, getPointTarget, i, sceneObjNum, setProjRet, isPointAdded)
                                    })
                                } else {
                                    //// 有載入過這專案的其他模組(e.g. 問答或刮刮卡等) 但這張集點卡沒有記錄過    與 "假如專案沒有紀錄過，將此次的集點卡資訊放入mDB" 的流程一模一樣(905行)
                                    //// 先初始化這張集點卡的資料  再集一個點數，存到mDB，顯示點數和html 
                                    pointCard.init(getPointTarget.targetID, pc2d)
                                    window.aPointCard.loadNewCard(scene2DRoot, obj, pointCard, getPointTarget, i, sceneObjNum)
                                }

                            } else {
                                //// 這張集點卡在沒有記錄過    與 "假如專案沒有紀錄過，將此次的集點卡資訊放入mDB" 的流程一模一樣(905行)
                                //// 先初始化這張集點卡的資料  再集一個點數，存到mDB，顯示點數和html 
                                pointCard.init(getPointTarget.targetID, pc2d)
                                window.aPointCard.loadNewCard(scene2DRoot, obj, pointCard, getPointTarget, i, sceneObjNum)
                            }
                        }   
                    })
                }

                pointcardResolve(pointCardEntity);
            }
        })
        //[end-20240301-renhaohsu-modify]//


        
        if(obj.generalAttr.obj_parent_id){

            let timeoutID = setInterval( function () {
                let parent = null
                for (let i = 0; i < self.makarObjects2D.length; i++ ){
                    if ( self.makarObjects2D[i].obj_id == obj.generalAttr.obj_parent_id  ){
                        parent = self.makarObjects2D[i];
                    }
                }

                if (parent){ 
                    if(parent.children.length > 0){
                        parent.add(pointCardEntity);
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 10);
        }
        else{
            scene2DRoot.add(pointCardEntity);
        }
        
    });

    return pScratch;
}