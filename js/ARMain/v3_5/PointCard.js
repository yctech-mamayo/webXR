import net from './networkAgent.js';
import { makeid, checkDefaultImage } from "./utility.js";

class _PointCard {
    //// 每一張集點卡 只負責記錄資料  (html與mdb的操作 則是由aPointCard來完成)
    currentScene2DRoot = null;
    canExchange = false;
    
    //[start-20240104-renhaohsu-modify]//
    obj_id = "";
    proj_id = window.makarUserData.oneProjData.proj_id
    exchanged = -1;
    pointCardState = 0;  //// [ 0: init , 1: all points collected , 2: exchanged ]   目前只是記錄狀態
    
    // //// 集點卡空白物件(顯示在場景中的本體)
    //// 移到 PointCardModule.js 處理 並將其作為 arController 的method之一
    // pointCardEntity = new THREE.Object3D();

    //// 為了方便尋找子物件 點數物件
    pointCardObjs = []

    pointCardInfo = {}

    constructor(scene2DRoot, scene_obj, proj_id){
        this.obj_id = scene_obj.generalAttr.obj_id
        this.scene_obj = scene_obj
        this.proj_id = proj_id
        this.module = scene_obj.typeAttr.module
        this.currentScene2DRoot = scene2DRoot;
    }

    //// "假如專案沒有紀錄過" 則初始化這張集點卡 
    init(targetID, pPointCardBGUrl){
        this.pointCardObjs.push(pPointCardBGUrl)
        
        ////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }

        this.pointCardInfo = {
            "user_id": window.makarUserData.oneProjData.user_id,
            "proj_id": this.proj_id,
            "device_id": device_id,
            "module_id": this.scene_obj.typeAttr.module.moduleID,

            "obj_id": this.obj_id,
            "is_exchanged": false,
            "can_reward_point_count": this.scene_obj.typeAttr.module.canRewardPointCount,
            "collected_points": [ targetID ],
            'type':"point_card"
        }

        this.currentScene2DRoot.exchanged = -1
        this.exchanged = -1
    }

    //// "假如專案有紀錄過" 則更新這張集點卡
    update(pointCardInfo, pPointCardBGUrl=null){

        if(pPointCardBGUrl != null) this.pointCardObjs.push(pPointCardBGUrl);
        
        this.pointCardInfo = pointCardInfo

        this.currentScene2DRoot.exchanged = pointCardInfo.is_exchanged ? 1 : -1
        this.exchanged = pointCardInfo.is_exchanged ? 1 : -1
        
        //// pointCardState 記錄集點卡當前狀態，目前只是記錄，沒有用它來作流程判斷(有exchanged足矣)   [ 0: init , 1: all points collected , 2: exchanged ]
        if(this.exchanged == 1){
            this.pointCardState = 2
        } else {
            if(pointCardInfo.collected_points.length >= pointCardInfo.can_reward_point_count){
                this.pointCardState = 1 
            }
        }
    }

}

//// According to wiki https://en.wikipedia.org/wiki/Flyweight_pattern#Implementation_details
//// the factory interface is commonly implemented as a singleton to provide global access for creating flyweights.
//// 
//// factory for pointCard objects
class PointCardFactory {
    //// flyweight pattern (享元模式): 由一個只存在單一instance的class，來管理其他重複出現的小單元，類似於 工廠模式 + 單例模式
    mdb = null;
    
    //// 這次runtime時載入過的集點卡
    loadedPointCards = {};

    //// 當前掃描到辨識圖 正要顯示的 pointCard 的 obj_id
    currentPointCardObjId = "";

    constructor(){
        if (!parent.mdb){
            console.warn("pointCard.js: parent.mdb does not exist, error");
        }else{
            this.mdb = parent.mdb;
        };

        //// singleton pattern 利用單例模式讓aPointCard只存在唯一一個
        if(PointCardFactory.exists)
        {
            return PointCardFactory.instance
        }
        PointCardFactory.instance = this
        PointCardFactory.exists = true

        return this
    }
    
    //// flywieght pattern: 每張集點卡要被創建出來之前，先檢查是否已存在 ? 直接拿現存的 : 否則新增 
    createPointCard(scene2DRoot, scene_obj, proj_id=window.makarUserData.oneProjData.proj_id){
        this.currentPointCardObjId = scene_obj.generalAttr.obj_id

        let pointCard = this.getPointCard(this.currentPointCardObjId);
        if (pointCard) {
            //// 若這張集點卡已存在，維持get拿到的
        } else {
            //// 若這張集點卡還沒初始化，新增
            pointCard = new _PointCard(scene2DRoot, scene_obj, proj_id);
        }        

        //// 這次runtime時載入過的集點卡
        this.loadedPointCards[this.currentPointCardObjId] = pointCard

        //// setup the bottom div 
        this.setupExchangeButtonDiv()

        //// 設置輸入密碼 div 的大小位置
        this.setupPasswordDiv()
        
        return pointCard;
    }

    getPointCard(obj_id){
        return this.loadedPointCards[obj_id];
    }


    //// mDB get專案記錄
    getPointCardProjectFromMDB = function( proj_id ){
        console.log("pointCard.js: _getPointCardProject");
        return parent.mdb.getPointCardProject( proj_id )
    }

    //// mDB 更新 專案
    _setPointCardProjectToMDB = function( projInfo ){      
        console.log("pointCard.js: _setPointCardProject");
        return parent.mdb.setPointCardProject( projInfo )
    }

    //// mDB 更新 單張集點卡
    setPointCardtoMDB( pointCardInfo ){ 
        //// v3.5 同專案下可以有多個場景各有一張集點卡。因此要先get一下確認有無，再put更新
        return new Promise((resolve, reject) => {

            //// 先在 mdb 找 該專案的記錄 
            this.getPointCardProjectFromMDB(pointCardInfo.proj_id).then( getProjRet => {

                let projInfo = {}

                if ( Object.keys(getProjRet).length == 0 ) {
                    //// mdb沒記錄 直接新增         
                    projInfo = {
                        "proj_id": pointCardInfo.proj_id,
                        "pointCards": {}
                    }                    
                } else {
                    //// 專案已在mdb記錄過
                    projInfo = getProjRet
                    
                    //// 新增or更新 該集點卡的資料
                    if( !getProjRet.pointCards ){
                        //// 專案有記錄，但並非集點卡 新增
                        projInfo.pointCards = {}
                    }
                }

                projInfo.pointCards[pointCardInfo.obj_id] = pointCardInfo
                resolve (parent.mdb.setPointCardProject( projInfo ))
            })            
        })
    }


    //// 與 html 相關 
    
    //// 取得 html element，如果還沒建立就新增一個  (說起來其實更像是restful api的put，而不像get，但語意上通順就暫時用get命名)
    getHtmlElement(id = "tempElement", tagName = "div"){
        //// v3.5的AR可以有多個場景，可能有複數個集點卡共用html ui
        let htmlElement = document.getElementById(id)
        if( !htmlElement ){
            htmlElement = document.createElement(tagName)
            htmlElement.setAttribute("id", id) // must set 
        }
        return htmlElement
    }

    //// setup the bottom div 
    setupExchangeButtonDiv(){
        this.pointCardExchangeDiv = this.getHtmlElement("pointCardExchangeDiv");
        this.pointCardExchangeDiv.setAttribute("class", "moduleExchangeDiv"); // must set 
        this.pointCardExchangeDiv.style.display = "inline";
        this.pointCardExchangeDiv.style.width = "100%";
        this.pointCardExchangeDiv.style.left = "0%";
        this.pointCardExchangeDiv.style.bottom = "60px";

        this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
        this.pointCardExchangeDiv.innerText = "loading";

        let exChangeClick = (event) => {
            let pointCard = this.getPointCard(this.currentPointCardObjId);
            // console.log("%c PointCard _setupExchangeButtonDiv exChangeClick=", "color:salmon; font-size:20px", pointCard, this.currentPointCardObjId)
            if (pointCard.canExchange){
                this.pointCardPWDBG.style.display = "inline";
            }
        }
        this.pointCardExchangeDiv.onclick = exChangeClick;
        
        document.body.appendChild(this.pointCardExchangeDiv);
    }

    //// 設置輸入密碼 div 的大小位置
    setupPasswordDiv(){
        this.pointCardPWDBG = this.getHtmlElement("pointCardPWDBG");
        this.pointCardPWDBG.setAttribute("class" , "backgroundModal");
        document.body.appendChild(this.pointCardPWDBG);

        this.pointCardPWDiv = this.getHtmlElement("pointCardPWDiv");
        this.pointCardPWDiv.setAttribute("class", "modulePWDDiv");
        this.pointCardPWDiv.style.display = "block";
        this.pointCardPWDBG.appendChild(this.pointCardPWDiv);
        
        let ipw = innerWidth > 600 ? 300 : innerWidth*0.5;
        let iph = innerHeight > 900 ? 270 : innerHeight*0.3;
        
        this.pointCardPWDiv.style.left = (innerWidth - ipw)/2 + "px";
        this.pointCardPWDiv.style.top  = (innerHeight - iph)/2 + "px";

        this.pointCardPWDiv.style.width = ipw + "px";
        this.pointCardPWDiv.style.height = iph + "px";

        this.pointCardPWDiv.innerHTML = "<br> 輸入密碼 <br>";

        /////////////////////////////////////////////////////////////////

        ////// 密碼輸入區域
        let pointCardPWDInputText = this.getHtmlElement("pointCardPWDInputText", "input");
        pointCardPWDInputText.setAttribute("class", "modulePWDInputText"); // default
        pointCardPWDInputText.setAttribute("type", "text"); // default
        pointCardPWDInputText.setAttribute("placeholder", "pwd"); // default
        this.pointCardPWDiv.appendChild(pointCardPWDInputText);

        ////// 密碼輸入 結果區域
        let pointCardPWDRetText = this.getHtmlElement("pointCardPWDRetText");
        pointCardPWDRetText.setAttribute("class", "modulePWDRetText"); // default
        this.pointCardPWDiv.appendChild(pointCardPWDRetText);
        pointCardPWDRetText.innerText = "";

        //// 取消按鈕設置
        let pointCardPWDCancel = this.getHtmlElement("pointCardPWDCancel");
        pointCardPWDCancel.setAttribute("class", "bottomLeftCell" );
        // pointCardPWDCancel.innerHTML = "&times;";
        pointCardPWDCancel.innerText = "取消";
        this.pointCardPWDiv.appendChild(pointCardPWDCancel);
        pointCardPWDCancel.onclick = function(){
            console.log("pointCard.js: cancel button click ");
            pointCardPWDBG.style.display = "none";
            pointCardPWDInputText.value = "";
            pointCardPWDRetText.innerText = "";
		};

        ////// 確認按鈕設置
        let pointCardPWDConfirm = this.getHtmlElement("pointCardPWDConfirm");
        pointCardPWDConfirm.setAttribute("class", "bottomRightCell" );
        pointCardPWDConfirm.innerText = "確認";
        
        this.pointCardPWDiv.appendChild(pointCardPWDConfirm);

        pointCardPWDConfirm.onclick = (event) => {
            //// get current pointCard            
            let pointCard = this.getPointCard(this.currentPointCardObjId);
            console.log("pointCard.js: _passwordConfirm pointCard = ", pointCard  );

            //// get password and handle unicode
            // let arr_s = pointCard.module.rewardPassword.split("\\u")        
            // let password = arr_s.filter(x => x != '').map( s => String.fromCodePoint("0x"+s) ).join("")
            let password = pointCard.module.rewardPassword

            // console.log("scratchCard.js: _passwordConfirm: password enter: inputPasswordInputText=", pointCardPWDInputText.value, pointCard.module.rewardPassword );
            
            if (pointCardPWDInputText.value == password ){
                console.log("pointCard.js: confirm button click password correct ", pointCardPWDInputText.value , pointCard.module.rewardPassword );

                pointCardPWDRetText.innerText = "密碼正確";
                this.pointCardExchangeDiv.innerText = "已兌換";
                this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
                
                pointCard.currentScene2DRoot.exchanged = 1;
                pointCard.exchanged = 1
                pointCard.canExchange = false; 
                pointCard.pointCardState = 2

                // console.log("pointCard.js: _passwordConfirm: pointCard.currentScene2DRoot = ", pointCard.currentScene2DRoot );
                parent.mdb.getPointCardProject( pointCard.proj_id ).then( getProjRet => {
                    // console.log("pointCard.js: _passwordConfirm getProjRet = ", getProjRet  );
                    let pointCardData = getProjRet.pointCards[pointCard.obj_id]
                    // console.log("pointCard.js: _passwordConfirm pointCardData = ", pointCardData  );
                    pointCardData.is_exchanged = true;

                    parent.mdb.setPointCardProject( getProjRet ).then( setProjRet => {
                        // console.log("pointCard.js: _passwordConfirm setProjRet = ", setProjRet  );

                        //// 上傳集點卡兌換資訊至雲端         
                        let collectedPointID = pointCardData.collected_points[pointCardData.collected_points.length-1]
                        let pointCardLogData  = {
                            "user_id":                pointCardData.user_id,

                            // "playing_user":        "", //// v3.4 在還沒有登入流程時候 一定要設為空字串
                            "playing_user":           localStorage.getItem("MakarUserID") ? localStorage.getItem("MakarUserID") : "",  //// v3.5 不確定3.4註解的意思 同時，測試了後端存取也讀不到資料

                            "proj_id":                pointCardData.proj_id,
                            "proj_type":              "ar",
                            "module_id":              pointCardData.module_id,
                            // "obj_id":              pointCardData.obj_id,
                            "device_id":              pointCardData.device_id,
                            "can_reward_point_count": pointCardData.can_reward_point_count,
                            "target_id":              collectedPointID,
                            "target_img_url":         window.makarUserData.targetList.find( t => t.target_id == collectedPointID).image_url,
                            // "is_exchanged":        true,
                            "brand":                  window.Browser.name + window.Browser.version ,
                            "os":                     window.Browser.platform ,     
                            "location_long":          0.0,
                            "location_lan":           0.0
                        }
                        net.pointCardLog( pointCardLogData ).then(result => {
                            console.log("_pointCardLog post to api: result=", result,
                                        "\n\n pointCardLogData=", pointCardLogData );
                        })

                    });

                });

                setTimeout( () => {
                    window.aPointCard.pointCardPWDBG.style.display = "none";
                }, 2000);

            }else{
                console.log("pointCard.js: confirm button click password wrong ", pointCardPWDInputText.value );
                // console.log("pointCard.js: confirm button click password wrong ", pointCardPWDInputText.value , pointCard.module.rewardPassword );
                pointCardPWDRetText.innerText = "密碼錯誤";
            }
        }
    }

    showPointCardCanvas( scene2DRoot, diffPoints, is_exchanged, obj_id ){
        this.currentPointCardObjId = obj_id
        let pointCard = this.getPointCard(this.currentPointCardObjId);

        pointCard.currentScene2DRoot = scene2DRoot;

        this.pointCardExchangeDiv.style.display = "inline";
        if (is_exchanged){ //// 假如已經兌換過，那就顯示『已兌換即可』
            this.pointCardExchangeDiv.innerText = "已兌換";
            this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
            pointCard.canExchange = false; 
        }else{
            if (diffPoints >= 0){
                pointCard.canExchange = true;            
                pointCard.pointCardState = 1;
                this.pointCardExchangeDiv.innerText = "按此兌換獎項";
                this.pointCardExchangeDiv.style.backgroundColor = "rgba(0, 201, 157, 1.0)";
            }else{
                pointCard.canExchange = false;
                this.pointCardExchangeDiv.innerText = "還差 " + (-diffPoints) + " 點就可兌換獎項";
                this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
            }
        }
    }

    hidePointCardCanvas( obj_2D ){
        console.log("PointCard.js: aPointCard.hidePointCardCanvas: obj_2D = ", obj_2D );
        if (obj_2D.loadModule = "pointCard" ){//// 再次確認模組為集點卡
            this.pointCardExchangeDiv.style.display = "none";
            this.pointCardPWDBG.style.display = "none";
            pointCardPWDInputText.value = "";
            pointCardPWDRetText.innerText = "";
        }
    }
    
    //// 在 ARcontroller.loadMakararScene 的時候呼叫的
    //// 新增一張集點卡到mDB 並顯示集點卡和html
    loadNewCard( scene2DRoot, scene_obj, pointCard, getPointTarget, i, sceneObjsLength ){

        ////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }            

        window.aPointCard.setPointCardtoMDB(pointCard.pointCardInfo).then( setProjRet => {
            //// 顯示所有點數：當下集到的點數要顯示收集後的圖，其他都顯示收集前的圖片
            for (let m = 0; m < scene_obj.typeAttr.module.points.length ; m++ ){
                let pointObj = scene_obj.typeAttr.module.points[m];
                console.log("%c pointObj.transformAttr.rectTransform[0]", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`,m, pointObj)
                
                let selectedResolutionIndex = window.arController.selectedResolutionIndex
                if( !selectedResolutionIndex ) {
                    //// 有時候會還沒有值 預設先給0
                    selectedResolutionIndex = 0
                }
                let position = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].position.split(",").map( x => Number(x) ) )
                let rotation = new THREE.Vector4().fromArray( pointObj.rectTransform[selectedResolutionIndex].rotation.split(",").map( x => Number(x) ) )
                let scale = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].scale.split(",").map( x => Number(x) ) )
                // console.log("%c pointObj.transformAttr.rectTransform[0]", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, pointObj)
                
                //// 顯示點數    v3.5 先把attribute補齊，之後才可以呼叫 loadTexture2D
                pointObj.res_id = pointObj.collectedPointID
                pointObj.transformAttr = { "rect_transform" : pointObj.rectTransform }
                pointObj.generalAttr = { 
                    "obj_id" : "tempJson_pointObj_no" + m,
                    "obj_type": "2d",
                    "obj_parent_id": scene_obj.generalAttr.obj_id,
                    "active": true,
                    "interactable": true,
                    "logic": false
                }
                pointObj.typeAttr = { "placeholder" : "placeholder" }
                pointObj.sub_type = 'jpg';

                // console.log('%c 分隔線 \n\n m, pointObj \n ', 'color:teal;   font-size: 20px', m, pointObj, "\n")
                
                let point_after_url;
                if ( window.makarUserData.userProjResDict[pointObj.collectedPointID] ){
                    //// user上傳的圖片
                    point_after_url = window.makarUserData.userProjResDict[pointObj.collectedPointID].res_url
                } else if( pointObj.collectedPointID == "PointCard_Point_After"){
                    //// 集點卡預設圖片
                    point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
                } else {
                    //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
                }
                pointObj.res_url = point_after_url;

                if( !pointObj.res_url ){
                    console.log("pointObj 沒有pointObj.res_url", pointObj)
                    checkDefaultImage(pointObj)
                }
                
                //// 點數子物件(點數圖片)的z，要比集點卡物件本身的z來的大，且不能是0
                const pointIndex = (m + 1) / (scene_obj.typeAttr.module.points.length + 1)
                // console.log('%c 分隔線 \n\n pointObj \n\n\n ', 'color:pink; font-size: 20px', pointObj, '\n', pointIndex)
                
                //// 當下集到的點數 顯示收集後的圖
                if ( getPointTarget.targetID == pointObj.targetID ){

                    //// 顯示點數 
                    let pT2D = window.arController.loadTexture2D( scene2DRoot, pointObj, i+pointIndex, sceneObjsLength, position, rotation, scale )

                    pT2D.then( t2d => {
                        pointCard.pointCardObjs.push(t2d)

                        let moveAnimate = {
                            name: "runAnimation2D", 
                            dt:500, 
                            ds:new THREE.Vector3( 2 , 2 , 2 ), 
                            reverse: true,
                        }
                        window.arController.runAnimation2D( t2d, moveAnimate );
                    })
                    .catch(e=>console.warn("ARController _loadMakarARScene: pointCard, user got a new point, error=", e));

                    scene_obj.typeAttr.module.points[m].collected = true;         
                    
                    //// 上傳資料至雲端
                    let pointCardLogData  = {
                        "user_id":                window.makarUserData.oneProjData.user_id,

                        // "playing_user":        "", //// v3.4 在還沒有登入流程時候 一定要設為空字串
                        "playing_user":           localStorage.getItem("MakarUserID") ? localStorage.getItem("MakarUserID") : "",  //// v3.5 不確定3.4註解的意思 同時，測試了後端存取也讀不到資料

                        "proj_id":                window.makarUserData.oneProjData.proj_id,
                        "proj_type":              "ar",
                        "module_id":              scene_obj.typeAttr.module.moduleID,
                        // "obj_id":              obj_id,
                        "device_id":              device_id,
                        "can_reward_point_count": scene_obj.typeAttr.module.canRewardPointCount,
                        "target_id":              getPointTarget.targetID,
                        "target_img_url":         window.makarUserData.targetList.find( t => t.target_id == getPointTarget.targetID).image_url,
                        // "is_exchanged":        true,                        
                        "brand":                  window.Browser.name + window.Browser.version ,
                        "os":                     window.Browser.platform , 
                        "location_long":          0.0,
                        "location_lan":           0.0,
                    }
                    net.pointCardLog( pointCardLogData ).then(result => {
                        console.log("_pointCardLog post to api: result=", result,
                        "\n\n pointCardLogData=", pointCardLogData );
                    })
                
                } else {
                    //// 其他 都顯示收集前的圖片    這裡在v3.5.0.0看起來沒有url  用 "collectedPointID" 去查 window.makarUserData
                    pointObj.res_id = pointObj.uncollectedPointID

                    let point_before_url;                    
                    if ( window.makarUserData.userProjResDict[pointObj.uncollectedPointID] ){
                        //// user上傳的圖片
                        point_before_url = window.makarUserData.userProjResDict[pointObj.uncollectedPointID].res_url
                    } else if( pointObj.collectedPointID == "PointCard_Point_Before"){
                        //// 集點卡預設圖片
                        point_before_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_Before.png";
                    } else{
                        //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
                    }
                    pointObj.res_url = point_before_url;

                    if( !pointObj.res_url ){
                        checkDefaultImage(pointObj)
                    }
                    
                    //// 顯示點數 
                    let pT2D = window.arController.loadTexture2D( scene2DRoot, pointObj, i+pointIndex , sceneObjsLength, position, rotation, scale )
                    pT2D.then( t2d => {
                        pointCard.pointCardObjs.push(t2d)
                    })
                    pointObj.collected = false;
                    // console.log('%c 分隔線 \n\n m, pointObj 其他點數載入完成 \n ', 'color:teal;   font-size: 20px', pointIndex, pointObj, "\n")
                }
            }

            const diffPoints = pointCard.pointCardInfo.collected_points.length - scene_obj.typeAttr.module.canRewardPointCount
            this.showPointCardCanvas( scene2DRoot , diffPoints , pointCard.pointCardInfo.is_exchanged, pointCard.pointCardInfo.obj_id );

        })

    }

    //// 當前集點卡在mDB已存在 先判斷此次集點辨識圖是否已有記錄 ? 有集過就跳過 : 沒集過則新增一集點記錄
    addPoint( getProjRet , obj_id, targetID ){
        return new Promise( (resolve, reject) => {
            let existCardData = getProjRet.pointCards[obj_id]
            console.log("pointCard.js: _addPoint:  getProjRet: "  , existCardData , targetID);

            let gotPointTarget =  existCardData.collected_points.find( item => item == targetID );
            if (gotPointTarget){
                console.log("pointCard.js _addPoint: point exists, do nothing. \n", gotPointTarget , getProjRet );
                resolve(getProjRet);

            }else{
                console.log("pointCard.js: _addPoint: the pointCard is already there, but the target is not: " , gotPointTarget , getProjRet );
                existCardData.collected_points.push( targetID );
                this._setPointCardProjectToMDB(getProjRet).then( setProjRet => {
                    ////// 只有 get 的event 可以回傳整個資料， put 只會回傳 index
                    this.getPointCardProjectFromMDB( getProjRet.proj_id ).then( projRet => {
                        // console.log("pointCard.js: _addPoint: projRet = ", projRet );	
                        resolve(projRet);
                    })
                })
            }

        })
    }

    //// 顯示所有點數 假如此次有新增集點 則post一筆log給後端api
    ////   註:  若只要顯示當前的集點卡: getPointTarget給null, setProjRet給從mDB裡面get到的資料, isPointAdded給false 
    loadCardWithAddedPoint( scene2DRoot, pointCard, scene_obj, getPointTarget, i, sceneObjsLength, setProjRet, isPointAdded ){
        const obj_id = scene_obj.generalAttr.obj_id        
        this.currentPointCardObjId = obj_id
        let existCardData = setProjRet.pointCards[obj_id]
        
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }
        
        for (let m = 0; m < scene_obj.typeAttr.module.points.length ; m++ ){
            let pointObj = scene_obj.typeAttr.module.points[m];

            let selectedResolutionIndex = window.arController.selectedResolutionIndex
            if( !selectedResolutionIndex ) {
                //// 有時候會還沒有值 預設先給0
                // console.log("%c window.arController.selectedResolutionIndex= ", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, window.arController.selectedResolutionIndex)
                selectedResolutionIndex = 0
            }
            let position = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].position.split(",").map( x => Number(x) ) )
            let rotation = new THREE.Vector4().fromArray( pointObj.rectTransform[selectedResolutionIndex].rotation.split(",").map( x => Number(x) ) )
            let scale    = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].scale.split(",").map( x => Number(x) ) )
            // console.log("%c pointObj.transformAttr.rectTransform[0]", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, pointObj.rectTransform[0])
            
            //// 顯示點數    v3.5 先把attribute補齊，之後才可以呼叫 loadTexture2D
            pointObj.res_id = pointObj.collectedPointID
            pointObj.transformAttr = { "rect_transform" : pointObj.rectTransform }
            pointObj.generalAttr = { 
                "obj_id" : "tempJson_pointObj_no"+m,
                "obj_type": "2d",
                "obj_parent_id": scene_obj.generalAttr.obj_id,
                "active": true,
                "interactable": true,
                "logic": false
            }
            pointObj.typeAttr = { "placeholder_pointObj" : "placeholder_pointObj" }
            pointObj.sub_type = 'jpg';
            // console.log("%c pointObj.transformAttr.rectTransform[0]", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, pointObj)
            
            let point_after_url;
            if ( window.makarUserData.userProjResDict[pointObj.collectedPointID] ){
                //// user上傳的圖片
                point_after_url = window.makarUserData.userProjResDict[pointObj.collectedPointID].res_url
            } else if( pointObj.collectedPointID == "PointCard_Point_After"){
                //// 集點卡預設圖片
                point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
            } else {
                //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
            }
            pointObj.res_url = point_after_url;

            if( !pointObj.res_url ){
                console.log("pointObj 沒有pointObj.res_url", pointObj)
                checkDefaultImage(pointObj)
            }
            
            //// 點數子物件(點數圖片)的z，要比集點卡物件本身的z來的大，且不能是0
            const pointIndex = (m + 1) / (scene_obj.typeAttr.module.points.length + 1)
            let gotPointTarget = existCardData.collected_points.find( item =>  item == pointObj.targetID );
            // console.log("%c gotPointTarget", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, gotPointTarget)

            if ( gotPointTarget ){

                //// 顯示點數 
                let pT2D = window.arController.loadTexture2D( scene2DRoot, pointObj, i+pointIndex, sceneObjsLength, position, rotation, scale )

                pT2D.then( t2d => {
                    pointCard.pointCardObjs.push(t2d)
                    
                    let moveAnimate = {
                        name: "runAnimation2D", 
                        dt:500, 
                        ds:new THREE.Vector3( 2 , 2 , 2 ), 
                        reverse: true,
                    }
                    window.arController.runAnimation2D(t2d , moveAnimate );
                })
                .catch(e=>console.warn("ARController _loadMakarARScene: pointCard, user got a new point, error=", e));


                //// 假如此次有新增集點 
                if ( isPointAdded ){
                    if ( getPointTarget.targetID == pointObj.targetID  ){
                        // console.log(" PointCard.js: _loadPointCard: new target =",  pointObj );

                        let pointCardLogData  = {
                            "user_id":                window.makarUserData.oneProjData.user_id,

                            // "playing_user":        "", //// v3.4 在還沒有登入流程時候 一定要設為空字串
                            "playing_user":           localStorage.getItem("MakarUserID") ? localStorage.getItem("MakarUserID") : "",  //// v3.5 不確定3.4註解的意思 同時，測試了後端存取也讀不到資料
                            
                            "proj_id":                window.makarUserData.oneProjData.proj_id,
                            "proj_type":              "ar",
                            "module_id":              scene_obj.typeAttr.module.moduleID,
                            // "obj_id": obj_id,
                            "device_id":              device_id,
                            "can_reward_point_count": scene_obj.typeAttr.module.canRewardPointCount,
                            "target_id":              getPointTarget.targetID,
                            "target_img_url":         window.makarUserData.targetList.find( t => t.target_id == getPointTarget.targetID).image_url,
                            "brand":                  window.Browser.name + window.Browser.version ,
                            "os":                     window.Browser.platform , 
                            "location_long":          0.0,
                            "location_lan":           0.0
                        }
                        net.pointCardLog( pointCardLogData ).then(result => {
                            console.log("_pointCardLog post to api: result=", result,
                            "\n\n pointCardLogData=", pointCardLogData );
                        })
                    }
                }
            
            }else{
                pointObj.res_id = pointObj.uncollectedPointID

                let point_before_url;
                if ( window.makarUserData.userProjResDict[pointObj.uncollectedPointID] ){
                    //// user上傳的圖片
                    point_before_url = window.makarUserData.userProjResDict[pointObj.uncollectedPointID].res_url
                } else if( pointObj.collectedPointID == "PointCard_Point_Before"){
                    //// 集點卡預設圖片
                    point_before_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_Before.png";
                } else{
                    //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
                }
                pointObj.res_url = point_before_url;

                if( !pointObj.res_url ){
                    checkDefaultImage(pointObj)
                }

                //// 顯示點數 
                let pT2D = window.arController.loadTexture2D( scene2DRoot, pointObj, i+pointIndex , sceneObjsLength, position, rotation, scale )
                pT2D.then( t2d => {
                    pointCard.pointCardObjs.push(t2d)
                })

                pointObj.collected = false;
            }
        }

        const diffPoints = existCardData.collected_points.length - scene_obj.typeAttr.module.canRewardPointCount
        this.showPointCardCanvas( scene2DRoot , diffPoints , existCardData.is_exchanged, obj_id );

    }

    //// 在 ARcontroller.activeAndClearScene 的時候呼叫的
    //// 此時，已經有集點卡，只要檢查點數是否已經集過 ? 有就顯示圖片和html : 否則集點且更新mDB
    checkPointThenAdd( scene2DRoot, targetID, pointCardIndex, sceneObjsLength, playing_user ){
        
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }

        const proj_id = window.makarUserData.oneProjData.proj_id

        this.getPointCardProjectFromMDB(proj_id).then( getProjRet => {
            console.log("PointCard.js: _checkPointThenAdd: getProjRet=", getProjRet);

            if ( Object.keys(getProjRet).length == 0 ) return;

            const obj_id = scene2DRoot.project_module.obj_id
            let pointCardData = getProjRet.pointCards[obj_id]

            const pointCard = this.getPointCard(obj_id)
            if( !pointCard ) return;
            // console.log("%c \n\n PointCard.js: _checkPointThenAdd: pointCard=" , "color: tomato; font-size: 20px", pointCard)

            this.currentPointCardObjId = obj_id

            let gotPointTarget2;
            if (pointCardData.collected_points){
                gotPointTarget2 = pointCardData.collected_points.find( item => item == targetID )

                if (gotPointTarget2){
                    //// 假如此點已經集過
                    console.log("PointCard.js: _checkPointThenAdd: already collected.");
                    let diffPoints = pointCardData.collected_points.length - pointCard.module.canRewardPointCount 
                    this.showPointCardCanvas( scene2DRoot , diffPoints, pointCardData.is_exchanged, obj_id );
                    
                } else { 
                    //// 此點尚未集過
                    console.log("PointCard.js: _checkPointThenAdd: not collected ");
                    
                    this.addPoint(getProjRet, obj_id , targetID).then( setProjRet => {
                        console.log("PointCard.js: _checkPointThenAdd: setProjRet" , setProjRet );

                        let pointCardDataAfterSet = setProjRet.pointCards[obj_id]
                        pointCard.update(pointCardDataAfterSet)
                        console.log("pointCard updated", pointCard)

                        if (pointCardDataAfterSet.collected_points){
                            for (let m = 0; m < pointCard.module.points.length ; m++ ){

                                let pointObj = pointCard.module.points[m];
                                // console.log("%c pointCard.module", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, pointCard.module)

                                if ( pointObj.targetID == targetID ){

                                    let selectedResolutionIndex = window.arController.selectedResolutionIndex
                                    if( !selectedResolutionIndex ) {
                                        //// 有時候會還沒有值 預設先給0
                                        selectedResolutionIndex = 0
                                    }
                                    let position = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].position.split(",").map( x => Number(x) ) )
                                    let rotation = new THREE.Vector4().fromArray( pointObj.rectTransform[selectedResolutionIndex].rotation.split(",").map( x => Number(x) ) )
                                    let scale    = new THREE.Vector3().fromArray( pointObj.rectTransform[selectedResolutionIndex].scale.split(",").map( x => Number(x) ) )
                                    // console.log("%c pointObj.transformAttr.rectTransform[0]", `color: rgb(${100*m}, ${80*m}, ${110*m}); font-size:18px`, pointObj.rectTransform[0])
                                    
                                    //// 顯示點數    v3.5 先把attribute補齊，之後才可以呼叫 loadTexture2D
                                    pointObj.res_id = pointObj.collectedPointID
                                    pointObj.transformAttr = { "rect_transform" : pointObj.rectTransform }
                                    pointObj.generalAttr = { 
                                        "obj_id" : "tempJson_pointObj_no"+m,
                                        "obj_type": "2d",
                                        "obj_parent_id": obj_id,
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    }
                                    pointObj.typeAttr = { "placeholder" : "placeholder" }
                                    pointObj.sub_type = 'jpg';
                                    
                                    //// 取得點數物件的圖片url
                                    let point_after_url;
                                    if ( window.makarUserData.userProjResDict[pointObj.collectedPointID] ){
                                        //// user上傳的圖片
                                        point_after_url = window.makarUserData.userProjResDict[pointObj.collectedPointID].res_url
                                    } else if( pointObj.collectedPointID == "PointCard_Point_After"){
                                        //// 集點卡預設圖片
                                        point_after_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/module/PointCard/PointCard_DefaultPoint_After.png";
                                    } else {
                                        //// 是預設物件 接下來用 utility.js _checkDefaultObj 拿res_url
                                    }
                                    pointObj.res_url = point_after_url;

                                    if( !pointObj.res_url ){
                                        console.log("pointObj 沒有pointObj.res_url", pointObj)
                                        checkDefaultImage(pointObj)
                                    }
                                    
                                    //// 顯示點數: 再找到 點數子物件(點數圖片)的z，要比集點卡物件本身的z來的大，且不能是0
                                    const pointIndex = (m + 1) / (pointCard.module.points.length + 1)

                                    //// 顯示點數
                                    let pT2D = window.arController.loadTexture2D( scene2DRoot, pointObj, pointCardIndex+pointIndex, sceneObjsLength, position, rotation, scale )

                                    pT2D.then( t2d => {
                                        pointCard.pointCardObjs.push(t2d)

                                        //// 隱藏集點前的圖片
                                        let pointPrev2d = this.loadedPointCards[this.currentPointCardObjId].pointCardObjs.find(item => item.obj_id == pointObj.generalAttr.obj_id)
                                        pointPrev2d.visible = false

                                        let moveAnimate = {
                                            name: "runAnimation2D", 
                                            dt:500, 
                                            ds:new THREE.Vector3( 2 , 2 , 2 ), 
                                            reverse: true,
                                        }
                                        window.arController.runAnimation2D(t2d , moveAnimate );
                                    })
                                    .catch(e=>console.warn("ARController _loadMakarARScene: pointCard, user got a new point, error=", e));
                                    
                                    pointObj.collected = true;

                                    let pointCardLogData  = {
                                        "user_id":                window.makarUserData.oneProjData.user_id,

                                        // "playing_user":        "", //// v3.4 在還沒有登入流程時候 一定要設為空字串
                                        "playing_user":           localStorage.getItem("MakarUserID") ? localStorage.getItem("MakarUserID") : "",  //// v3.5 不確定3.4註解的意思 同時，測試了後端存取也讀不到資料

                                        "proj_id":                proj_id,
                                        "proj_type":              "ar",
                                        "module_id":              pointCard.module.moduleID,
                                        // "obj_id": obj_id,
                                        "device_id":              device_id,
                                        "can_reward_point_count": pointCard.module.canRewardPointCount,
                                        "target_id":              targetID,
                                        "target_img_url":         window.makarUserData.targetList.find( t => t.target_id == targetID).image_url,
                                        "brand":                  Browser.name + Browser.version ,
                                        "os":                     Browser.platform , 
                                        "location_long":          0.0,
                                        "location_lan":           0.0
                                    }
                                    net.pointCardLog( pointCardLogData ).then(result => {
                                        console.log("_pointCardLog post to api: result=", result,
                                                    "\n\n pointCardLogData=", pointCardLogData );
                                    })
                                }
                            }
                            let diffPoints = pointCardDataAfterSet.collected_points.length - pointCard.module.canRewardPointCount   
                            this.showPointCardCanvas( scene2DRoot , diffPoints , pointCardDataAfterSet.is_exchanged, obj_id );
                        }else{
                            console.error("PointCard.js: _checkPointThenAdd: collected_points not exist, shouldnt happen " , pointCard.module.points );
                        }
                    
                    });
                }
            }
            
        })
    }

}

window.aPointCard = new PointCardFactory();
//[start-20240104-renhaohsu-modify]//