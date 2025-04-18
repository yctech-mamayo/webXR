import { UrlExistsFetch, checkDefaultImage } from "../utility.js"
import { setARTransform } from "./setTransform.js";

export function loadScratchCard( scene2DRoot, obj, index, sceneObjNum, position, rotation, scale) {

    console.log("ARFunc.js: ARWrapper: _loadScratchCard obj=", obj, position, rotation, scale );
    //// "this" must be arController
    let self = this;

    //// 檢查是否為「預設物件」
    checkDefaultImage( obj );
    
    let pScratch = new Promise( function( scratchResolve ){


        const obj_id = obj.generalAttr.obj_id
        const proj_id = makarUserData.oneProjData.proj_id

        // scene2DRoot 在 v3.4 是 markerRoot2D
        scene2DRoot.module = "ScratchCard"; 
        scene2DRoot.loadModule = "scratchCard";
        scene2DRoot.project_module = obj.typeAttr.module;
        scene2DRoot.project_module.obj_id = obj_id;
        scene2DRoot.proj_id = proj_id;

        // let scratchEntity = document.createElement('a-entity');  //最上層物件 用來apply transform
        // scratchEntity.setAttribute( "id", obj_id );
        // scratchEntity.setAttribute('crossorigin', 'anonymous');

        let rootObject = new THREE.Object3D();
        rootObject.makarType = "scratchCard";

        rootObject.visible = true;
        if (obj.generalAttr.active == false){
            rootObject.visible = false;
        }

        rootObject["makarObject"] = true ;
        rootObject["obj_id"] = obj_id ;

        //// 大小
        rootObject.scale.set( scale.x , scale.y, 1 );

        //// 改為統一移動比例
        rootObject.translateX(  position.x*self.scaleRatioXY ) ;
        rootObject.translateY( -position.y*self.scaleRatioXY ) ;
        rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

        //// 旋轉                       
        rootObject.rotateZ( rotation.z )                           

        self.makarObjects2D.push( rootObject );
        
        ////// 載入刮刮卡背景圖
        let bgTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Background")
        let pScratchCardBG = self.loadTexture2D( scene2DRoot, bgTempOBjJson, index, sceneObjNum);

        pScratchCardBG.then(sc2d => {
                                
            //// 檢查刮刮卡狀態
            let playing_user = localStorage.getItem("MakarUserID")
            if ( playing_user && false){
                ////假如使用者有登入[makar or third party ] 現在還沒有這個部份，預先設置。
            }else{
                //// user未登入
                playing_user = ""

                    //// model view 和 XR view
                // if( !targetID ) {
                if( !true ) {
                    //// 表示現在是 model view  (在 setViewModeSceneObj 的 _loadMakarARScene 給 targetID 是 null)
                    //// 只顯示目前已經收集的點數：從 mDB 取得記錄
                    // window.aPointCard.getPointCardProjectFromMDB(makarUserData.oneProjData.proj_id).then( getProjRet => {
                    //     console.log('ARController _loadMakarARScene: getPointCardProjectFromMDB return=', getProjRet)
        
                    //     //// 先新增/取得這張集點卡
                    //     const pointCard = window.aPointCard.createPointCard(scene2DRoot, obj, window.makarUserData.proj_id);

                    //     //// 註:  若只要顯示當前的集點卡: getPointTarget給null, setProjRet給從mDB裡面get到的資料, isPointAdded給false
                    //     window.aPointCard.loadCardWithAddedPoint(scene2DRoot, pointCard, obj, null, i, sceneObjNum, getProjRet, false)

                    // })

                } 
                else {
                    
                    window.aScratchCard.getScratchCardProjectFromMDB(makarUserData.oneProjData.proj_id).then( getProjRet => {

                        console.log('ARController _loadMakarARScene: getScratchCardProjectFromMDB return=', getProjRet)
                        const scratchCard = window.aScratchCard.createScratchCard(scene2DRoot, obj, proj_id);
                        
                        //// 假如專案沒有紀錄過，將此次的刮刮卡資訊放入mDB
                        if ( !getProjRet.proj_id ){

                            //// 初始化刮刮卡
                            scratchCard.init(sc2d);
                            window.aScratchCard.loadNewCard(scene2DRoot, obj, scratchCard, index, sceneObjNum);
                                
                        } 
                        else {

                            const obj_id = obj.generalAttr.obj_id;

                            if(getProjRet.scratchCards && getProjRet.scratchCards[obj_id]){

                                let scratchCardInfo = getProjRet.scratchCards[obj_id];
                                scratchCard.update(scratchCardInfo, sc2d)
                            }
                            else{

                                scratchCard.init(sc2d);
                                window.aScratchCard.loadNewCard(scene2DRoot, obj, scratchCard, index, sceneObjNum);
                            }


                        }

                        console.log(scratchCard.scratchCardInfo)
                        let getAwardIndex;
                        let awardTempOBjJson;
                        let scratchTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Scratch");
                        let pAward, pScratchImage;
                        window.aScratchCard.clearScratchImage(document.getElementById("scratchCanvas"))
                        
                        switch(scratchCard.scratchCardInfo.scratchCardState){ //// [ 0:init , 1:scratched , 2:getAward , 3:exchanged ]

                            case 0:
                                getAwardIndex = window.aScratchCard.getScratchRandomAwardandUpdate(scratchCard);
                                awardTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Award", getAwardIndex);
                                pAward = self.loadTexture2D( scene2DRoot, awardTempOBjJson, index, sceneObjNum);
                                pAward.then(awardObj =>{
                                    awardObj.updateMatrixWorld();
                                    pScratchImage =  window.aScratchCard.loadScratchImage( obj.generalAttr.obj_id, scratchTempOBjJson, awardObj.matrixWorld.clone(), self.scaleRatioXY);
                                    pScratchImage.then(scratchCanvas =>{
                                        awardObj.visible = true;
                                        window.aScratchCard.scratchCardExchangeDiv.innerText = "尚未完成刮刮卡"
                                        window.aScratchCard.loadBrushSetting(scratchCanvas, awardObj.matrixWorld.clone());
                                    })
                                    
                                    
                                })
                                console.log("init, getAwardIndex = ", getAwardIndex)
                                break;

                            case 1:
                                getAwardIndex = scratchCard.scratchCardInfo.getAwardIndex;
                                awardTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Award", getAwardIndex);
                                pAward = self.loadTexture2D( scene2DRoot, awardTempOBjJson, index, sceneObjNum);
                                pAward.then(awardObj =>{
                                    awardObj.updateMatrixWorld();
                                    pScratchImage =  window.aScratchCard.loadScratchImage( obj.generalAttr.obj_id, scratchTempOBjJson, awardObj.matrixWorld.clone(), self.scaleRatioXY);
                                    pScratchImage.then(scratchCanvas =>{
                                        awardObj.visible = true;
                                        window.aScratchCard.scratchCardExchangeDiv.innerText = "尚未完成刮刮卡"
                                        window.aScratchCard.loadBrushSetting(scratchCanvas, awardObj.matrixWorld.clone());
                                    })
                                    
                                    
                                })
                                
                                console.log("scratched, getAwardIndex = ", getAwardIndex)
                                break;

                            case 2:
                                getAwardIndex = scratchCard.scratchCardInfo.getAwardIndex;
                                awardTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Award", getAwardIndex);
                                pAward = self.loadTexture2D( scene2DRoot, awardTempOBjJson, index, sceneObjNum);
                                pAward.then(awardObj =>{
                                    awardObj.visible = true;
                                    let scratchCard = window.aScratchCard.getScratchCard(window.aScratchCard.currentScratchCardObjId);
                                    scratchCard.canExchange = true;
                                    window.aScratchCard.scratchCardExchangeDiv.style.backgroundColor = "rgba(0, 201, 157, 1.0)";
                                    window.aScratchCard.scratchCardExchangeDiv.innerText = "按此兌換獎項";
                                    
                                })
                                console.log("getAward, getAwardIndex = ", getAwardIndex)
                                break;

                            case 3:
                                getAwardIndex = scratchCard.scratchCardInfo.getAwardIndex;
                                awardTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Award", getAwardIndex);
                                pAward = self.loadTexture2D( scene2DRoot, awardTempOBjJson, index, sceneObjNum);
                                pAward.then(awardObj =>{
                                    awardObj.visible = true;
                                    window.aScratchCard.scratchCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
                                    window.aScratchCard.scratchCardExchangeDiv.innerText = "已兌換";
                                    
                                })
                                console.log("exchanged, getAwardIndex = ", getAwardIndex)


                                
                                break;


                        }

                        scratchResolve(rootObject);
                    
                    });
                    
                    

                }
            }
            
        });
    
        

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
                        parent.add(rootObject);
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 10);
        }
        else{
            scene2DRoot.add(rootObject);
        }
        
    });

    return pScratch;
}