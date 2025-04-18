import { makeid, checkDefaultImage } from "./utility.js";


class _ScratchCard {
    //// 每一張刮刮卡 只負責記錄資料  (html與mdb的操作 則是由aScratchCard來完成)
    currentScene2DRoot = null;
    canExchange = false;
    
    obj_id = "";
    proj_id = window.makarUserData.oneProjData.proj_id;
    exchanged = -1;
    scratchCardState = 0;  //// [ 0: init , 1: scratched, 2: getAward, 3: exchanged ] 
    
    scratchCardObjs = []
    scratchCardInfo = {}

    constructor(scene2DRoot, scene_obj, proj_id){
        this.obj_id = scene_obj.generalAttr.obj_id
        this.scene_obj = scene_obj
        this.proj_id = proj_id
        this.module = scene_obj.typeAttr.module
        this.currentScene2DRoot = scene2DRoot;
    }

    //// "假如專案沒有紀錄過" 則初始化這張刮刮卡 
    init(pScratchCardBGUrl){
        this.scratchCardObjs.push(pScratchCardBGUrl)
        
        ////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }

        this.scratchCardInfo = {
            "user_id": window.makarUserData.oneProjData.user_id,
            "proj_id": this.proj_id,
            "device_id": device_id,
            
            // "card_id": scene_objs[j].project_module[0].card_id,
            "card_id": this.scene_obj.typeAttr.module.moduleID,
            "obj_id": this.obj_id,

            "is_exchanged": false,
            "scratchCardState": this.scratchCardState,
            'type':"scratch_card"
        }

        this.currentScene2DRoot.exchanged = -1
        this.exchanged = -1
    }

    //// "假如專案有紀錄過" 則更新這張刮刮卡
    update(scratchCardInfo, pScratchCardBGUrl=null){

        if(pScratchCardBGUrl != null) this.scratchCardObjs.push(pScratchCardBGUrl);
        
        this.scratchCardInfo = scratchCardInfo

        this.currentScene2DRoot.exchanged = scratchCardInfo.is_exchanged ? 1 : -1
        this.exchanged = scratchCardInfo.is_exchanged ? 1 : -1
        
        //// scratchCardState 記錄刮刮卡當前狀態，目前只是記錄，沒有用它來作流程判斷(有exchanged足矣)   [ 0: init , 1: all scratchs collected , 2: exchanged ]
        // if(this.exchanged == 1){
        //     this.scratchCardState = 2
        // } else {
        //     if(scratchCardInfo.collected_scratchs.length >= scratchCardInfo.can_reward_scratch_count){
        //         this.scratchCardState = 1 
        //     }
        // }
    }

    //// 不需要 因為物件都掛在scene2DRoot下 
    // hide(){
    //     this.scratchCardObjs.forEach(e => e.visible = false)
    // }

    // show(){
    //     this.scratchCardObjs.forEach(e => e.visible = true )
    // }

}

//// According to wiki https://en.wikipedia.org/wiki/Flyweight_pattern#Implementation_details
//// the factory interface is commonly implemented as a singleton to provide global access for creating flyweights.
//// 
//// factory for scratchCard objects
class ScratchCardFactory {
    //// flyweight pattern (享元模式): 由一個只存在單一instance的class，來管理其他重複出現的小單元，類似於 工廠模式 + 單例模式
    mdb = null;
    
    //// 這次runtime時載入過的刮刮卡
    loadedScratchCards = {};

    //// 當前掃描到辨識圖 正要顯示的 scratchCard 的 obj_id
    currentScratchCardObjId = "";

    constructor(){
        if (!parent.mdb){
            console.warn("scratchCard.js: parent.mdb does not exist, error");
        }else{
            this.mdb = parent.mdb;
        };

        //// singleton pattern 利用單例模式讓aScratchCard只存在唯一一個
        if(ScratchCardFactory.exists)
        {
            return ScratchCardFactory.instance
        }
        ScratchCardFactory.instance = this
        ScratchCardFactory.exists = true

        return this
    }

    makeTempObjJson(obj, tempObjName, awardIndex=0) {

        let tempObjJson = {};
    
        if (tempObjName == "Background"){
            if (obj.typeAttr.module.backgroundID){
                tempObjJson.res_id = obj.typeAttr.module.backgroundID;
                checkDefaultImage(tempObjJson);
                if(!tempObjJson.res_url){
                    tempObjJson.res_url = makarUserData.userProjResDict[obj.typeAttr.module.backgroundID].res_url;  
                    let tempSplit = tempObjJson.res_url.split(".");
                    tempObjJson.sub_type = tempSplit[tempSplit.length-1];
                }
            }else{
                tempObjJson.res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/ScratchCardBackground.png";
                tempObjJson.sub_type = 'png';
            };
    
        }
        else if(tempObjName == "Award"){
            if (obj.typeAttr.module.cards[0].awards[awardIndex].awardID ){
                tempObjJson.res_id = obj.typeAttr.module.cards[0].awards[awardIndex].awardID;
                checkDefaultImage(tempObjJson);
                if(!tempObjJson.res_url){
                    tempObjJson.res_url = makarUserData.userProjResDict[obj.typeAttr.module.cards[0].awards[awardIndex].awardID].res_url;  
                    let tempSplit = tempObjJson.res_url.split(".");
                    tempObjJson.sub_type = tempSplit[tempSplit.length-1];
                }
            }else{
                tempObjJson.res_url = "https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/AcratchCard_Default.png";
                tempObjJson.sub_type = 'png';
            };
        }
        else if(tempObjName == "Scratch"){
            if (obj.typeAttr.module.cards[0].scratchID ){
                tempObjJson.res_id = obj.typeAttr.module.cards[0].scratchID;
                checkDefaultImage(tempObjJson);
                if(!tempObjJson.res_url){
                    tempObjJson.res_url = makarUserData.userProjResDict[obj.typeAttr.module.cards[0].scratchID].res_url;  
                    let tempSplit = tempObjJson.res_url.split(".");
                    tempObjJson.sub_type = tempSplit[tempSplit.length-1];
                }
            }else{
                tempObjJson.res_url = "https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/ScratchCard_Default.png";
                tempObjJson.sub_type = 'png';
            };
        }

        // console.log(tempObjJson)
      
        
        if (tempObjName == "Background"){
            tempObjJson.transformAttr = { "rect_transform" : obj.typeAttr.module.bRectTransform }
        }
        else if (tempObjName == "Award" || "Scratch"){
            tempObjJson.transformAttr = { "rect_transform" : obj.typeAttr.module.cards[0].sRectTransform }
        }
        tempObjJson.generalAttr = { 
            "obj_id" : tempObjJson.res_id+"_"+obj.generalAttr.obj_id,
            "obj_type": "2d",
            "obj_parent_id": obj.generalAttr.obj_id,
            "active": true,
            "interactable": true,
            "logic": false
        }
        if (tempObjName == "Award") tempObjJson.generalAttr.active = false;
        tempObjJson.typeAttr = { }
    
    
        return tempObjJson;
    }
    
    //// flywieght pattern: 每張刮刮卡要被創建出來之前，先檢查是否已存在 ? 直接拿現存的 : 否則新增 
    createScratchCard(scene2DRoot, scene_obj, proj_id=window.makarUserData.oneProjData.proj_id){
        this.currentScratchCardObjId = scene_obj.generalAttr.obj_id

        let scratchCard = this.getScratchCard(this.currentScratchCardObjId);
        if (scratchCard) {
            //// 若這張刮刮卡已存在，維持get拿到的
        } else {
            //// 若這張刮刮卡還沒初始化，新增
            scratchCard = new _ScratchCard(scene2DRoot, scene_obj, proj_id);
        }        

        //// 這次runtime時載入過的刮刮卡
        this.loadedScratchCards[this.currentScratchCardObjId] = scratchCard

        //// setup the bottom div 
        this.setupExchangeButtonDiv()

        //// 設置輸入密碼 div 的大小位置
        this.setupPasswordDiv()
        
        return scratchCard;
    }

    getScratchCard(obj_id){
        return this.loadedScratchCards[obj_id];
    }


    //// mDB get專案記錄
    getScratchCardProjectFromMDB = function( proj_id ){
        console.log("scratchCard.js: _getScratchCardProject");
        return parent.mdb.getScratchProject( proj_id )
    }

    //// mDB 更新 專案
    _setScratchCardProjectToMDB = function( projInfo ){      
        console.log("scratchCard.js: _setScratchCardProject");
        return parent.mdb.setScratchProject( projInfo )
    }

    //// mDB 更新 單張刮刮卡
    setScratchCardtoMDB( scratchCardInfo ){ 
        //// v3.5 同專案下可以有多個場景各有一張刮刮卡。因此要先get一下確認有無，再put更新
        return new Promise((resolve, reject) => {

            //// 先在 mdb 找 該專案的記錄 
            this.getScratchCardProjectFromMDB(scratchCardInfo.proj_id).then( getProjRet => {
                if ( Object.keys(getProjRet).length == 0 ) {    
                    
                    //// mdb沒記錄 直接新增         
                    let projInfo = {
                        "proj_id": scratchCardInfo.proj_id,
                        "scratchCards": {}
                    }
                    projInfo.scratchCards[scratchCardInfo.obj_id] = scratchCardInfo
                    resolve (parent.mdb.setScratchProject( projInfo )     )    
                   
                } else {
                    //// 專案已在mdb記錄過
                    let projInfo = getProjRet
                    
                    //// 新增or更新 該刮刮卡的資料
                    projInfo.scratchCards[scratchCardInfo.obj_id] = scratchCardInfo
                    // console.log("scratchCard.js: _setScratchCardProject projInfo.scratchCards[scratchCardInfo.obj_id]=" , projInfo.scratchCards[scratchCardInfo.obj_id]);
                    resolve (parent.mdb.setScratchProject( projInfo ))
                }
            })            
        })
    }

    restProjInfoMDB (proj_id){
        let projInfo = {
            "proj_id": proj_id,
            "scratchCards": {}
        }
        return new Promise((resolve, reject) => {
            resolve (parent.mdb.setScratchProject( projInfo )     )    
        })
    }
    
    getScratchRandomAwardandUpdate(scratchCard){

        let award_list=null;
        if ( Array.isArray(scratchCard.module.cards) ){
            if (scratchCard.module.cards.length == 1 ){
                award_list = scratchCard.module.cards[0].awards;
            }
        }

        if (!award_list){
            return -1 ;
        }

        let totalProbability = 0;
        let awardArray = [];
        for (let i in award_list){
            totalProbability += award_list[i].probability;
            awardArray.push(totalProbability);
        }
        let getNum = Math.floor(Math.random() * totalProbability ) + 1; // 1 2 3 .. total
        let getAwardIndex = 0;
        console.log("scratchCard.js: _chooseAward: awardArray=", awardArray, ", getNum=", getNum);
        for (let i = 0; i < awardArray.length; i++ ){
            if ( getNum <= awardArray[i] ){
                getAwardIndex = i;
                break;
            }
        }

        scratchCard.scratchCardInfo.getAwardIndex = getAwardIndex;
        scratchCard.scratchCardInfo.scratchCardState = 1;
        // scratchCard.scratchCardInfo.scratch_image_url =  makarUserData.userProjResDict[scratchCard.module.cards[0].scratchID].res_url;
        // scratchCard.scratchCardInfo.awards_image_url  = makarUserData.userProjResDict[scratchCard.module.cards[0].awards[getAwardIndex].awardID].res_url; 


        console.log("20240227", scratchCard.scratchCardInfo)
        this.setScratchCardtoMDB( scratchCard.scratchCardInfo );


        return getAwardIndex;
    }


    //// 與 html 相關 
    
    //// 取得 html element，如果還沒建立就新增一個  (說起來其實更像是restful api的put，而不像get，但語意上通順就暫時用get命名)
    getHtmlElement(id = "tempElement", tagName = "div"){
        //// v3.5的AR可以有多個場景，可能有複數個刮刮卡共用html ui
        let htmlElement = document.getElementById(id)
        if( !htmlElement ){
            htmlElement = document.createElement(tagName)
            htmlElement.setAttribute("id", id) // must set 
        }
        return htmlElement
    }

    //// setup the bottom div 
    setupExchangeButtonDiv(){
        this.scratchCardExchangeDiv = this.getHtmlElement("scratchCardExchangeDiv");
        this.scratchCardExchangeDiv.setAttribute("class", "moduleExchangeDiv"); // must set 
        this.scratchCardExchangeDiv.style.display = "inline";
        this.scratchCardExchangeDiv.style.width = "100%";
        this.scratchCardExchangeDiv.style.left = "0%";
        this.scratchCardExchangeDiv.style.bottom = "0px";

        this.scratchCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
        this.scratchCardExchangeDiv.innerText = "loading";

        let exChangeClick = (event) => {
            let scratchCard = this.getScratchCard(this.currentScratchCardObjId);
            console.log("%c ScratchCard _setupExchangeButtonDiv exChangeClick=", "color:salmon; font-size:20px", scratchCard, this.currentScratchCardObjId)
            if (scratchCard.canExchange){
                this.scratchCardPWDBG.style.display = "inline";
            }
        }
        this.scratchCardExchangeDiv.onclick = exChangeClick;
        
        document.body.appendChild(this.scratchCardExchangeDiv);
    }

    loadScratchImage(obj_id, scratchObjJson, transform, scaleRatioXY){

        let self = this;

        let pScratchImage = new Promise( function( scratchImageResolve ){
        
            let position = new THREE.Vector3().setFromMatrixPosition(transform);
            let rotation = new THREE.Euler().setFromRotationMatrix(transform);
            let ratationZDeg = Math.round(rotation.z /Math.PI * 180);
            let scale = new THREE.Vector3().setFromMatrixScale(transform);
    
            console.log(scratchObjJson)
    
            let rectSizeDelta = scratchObjJson.transformAttr.rect_transform[0].size_delta.split(",").map(function(x){return Number(x)}); 
    
            console.log(position, ratationZDeg, scale, rectSizeDelta);
    
                
            let width, height;
            width  = rectSizeDelta[0] * scale.x * scaleRatioXY ; // 2/3 is the factor = 480/720 
            height = rectSizeDelta[1] * scale.y * scaleRatioXY ;
    
            // let scratchCanvasContainer = document.createElement("div");
            let  scratchCanvasContainer = self.getHtmlElement("scratchImageDiv");
            scratchCanvasContainer.setAttribute("class", "scratchCanvasContainer");//// 這個名字不能更換 css 榜定
            // scratchCanvasContainer.setAttribute("id", obj_id );//// 這個名字不能更換 css 榜定
    
            //// set the scale of div
            scratchCanvasContainer.style.width = width + "px";
            scratchCanvasContainer.style.height = height + "px";
            scratchCanvasContainer.style.left = window.innerWidth/2 - width/2 + position.x  + "px";
            scratchCanvasContainer.style.top  = window.innerHeight/2 - height/2 + position.y + "px";
    
            scratchCanvasContainer.style.transform = "rotateZ("+ratationZDeg+"deg)";
    
            // let scratchCanvas = document.createElement("canvas");
            let scratchCanvas = self.getHtmlElement("scratchCanvas", "canvas");
            let canvasContext = scratchCanvas.getContext( '2d' );				
            scratchCanvas.setAttribute("class", "scratchCanvas");//// 這個名字不能更換 css 榜定
            scratchCanvas.setAttribute("width", width );
            scratchCanvas.setAttribute("height", height );
            // scratchCanvas.setAttribute("id", "scratchCanvas");
    
            let scratchedImage = new Image();
            scratchedImage.onload = function() {
                // console.log("_______ scratchCanvas=", scratchCanvas.width , scratchCanvas.height , scratchCanvas.style.width, scratchedImage.width  );
                // console.log("_______ self.GLRenderer=", self.GLRenderer.domElement.offsetLeft , self.GLRenderer );
    
                canvasContext.drawImage(scratchedImage, 0, 0, scratchedImage.width, scratchedImage.height, 0, 0, scratchCanvas.width, scratchCanvas.height );
    
                scratchImageResolve(scratchCanvas);
    
            };
    
            let xhr = new XMLHttpRequest();
            xhr.open("GET", scratchObjJson.res_url );
            xhr.responseType = "blob";
            xhr.onload = function(e){
                let urlCreator = window.URL || window.webkitURL;
                let imageUrl = urlCreator.createObjectURL(this.response);
                scratchedImage.src = imageUrl;
            };
            xhr.send();
    
    
            scratchCanvasContainer.appendChild(scratchCanvas);
            document.body.appendChild(scratchCanvasContainer);
        });
    
        return pScratchImage;
    
    }
    
    clearScratchImage(canvas){
        if(canvas){
            let div = canvas.parentNode;
            if(div){
                div.removeChild(canvas); //// remove canvas itself
                div.parentNode.removeChild(div);
            }
    
        }
    }
    
    loadBrushSetting(canvas, transform){

        let self = this;
    
        if(!canvas) return;
    
        let canvasWidth  = canvas.width,
            canvasHeight = canvas.height,
            ctx          = canvas.getContext('2d');
            
        var isDrawing, lastPoint;
        let brush = new Image();    
        brush.onload = function(){
            // console.log("scratchCard.js: brush onload, brush=", brush );
        }
    
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/brush.png" );
        xhr.responseType = "blob";
        xhr.onload =   function response(e) {
            let urlCreator = window.URL || window.webkitURL;
            let imageUrl = urlCreator.createObjectURL(this.response);
            brush.src = imageUrl;
            // console.log("scratchCard.js: request response, " , e, this , imageUrl );
        };
        xhr.send();
        
        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('touchstart', handleMouseDown, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('touchmove', handleMouseMove, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('touchend', handleMouseUp, false);
    
        canvas.addEventListener('mouseleave', handleMouseLeaveCanvas, false);
    
        function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }
    
        function angleBetween(point1, point2) {
            return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        }
        
        // Only test every `stride` pixel. `stride`x faster,
        // but might lead to inaccuracy
        function getFilledInPixels(stride) {
            if (!stride || stride < 1) { stride = 1; }
            
            var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
                pdata    = pixels.data,
                l        = pdata.length,
                total    = (l / stride),
                count    = 0;
            
            // Iterate over all pixels
            for(var i = count = 0; i < l; i += stride) {
                // if (parseInt(pdata[i]) === 0) {
                //     count++;
                // }
    
                //// 同時要 RGB 都是 0 才計算 
                if ( pdata[i + 0] + pdata[i + 1] + pdata[i + 2] === 0  )  
                {
                    count++;
                }
    
            }   
            // console.log("scratchCard.js: getFilledInPixels, ", total, count );
            return Math.round((count / total) * 100);
        }
        
        function getMouse(e, canvas) {
            // console.log(e)
            let offsetX = 0, offsetY = 0, mx, my;
    
            // if (canvas.offsetParent !== undefined) {
            // do {
            //     offsetX += canvas.offsetLeft;
            //     offsetY += canvas.offsetTop;
            // } while ((canvas = canvas.offsetParent));
            // }
    
            // console.log(offsetX, offsetY)
    
            // mx = (e.pageX || e.touches[0].clientX) - offsetX;
            // my = (e.pageY || e.touches[0].clientY) - offsetY;
    
            let rotation = new THREE.Euler().setFromRotationMatrix(transform);
    
            if (e.touches){
                let x = e.touches[0].clientX - e.target.offsetParent.offsetLeft;
                let y = e.touches[0].clientY - e.target.offsetParent.offsetTop;
    
                x =  x - e.target.offsetParent.offsetWidth/2;
                y =  y - e.target.offsetParent.offsetHeight/2;
    
                mx = Math.cos(-rotation.z) *x - Math.sin(-rotation.z) * y;
                my = Math.sin(-rotation.z) *x + Math.cos(-rotation.z) * y;
    
                mx = mx + e.target.offsetParent.offsetWidth/2;
                my =  my + e.target.offsetParent.offsetHeight/2;
            }
            else{
                mx = e.offsetX;
                my = e.offsetY;
            }
    
            // console.log("mouse: ", mx, my)
    
            return {x: mx, y: my};
        }
        
        function handlePercentage(filledInPixels) {
    
            let scratchCardExchangeDiv = window.aScratchCard.scratchCardExchangeDiv;
    
            let thresholdPecent = 70;
            
            // rootObject.scratchedAreaPercentage = filledInPixels;
            // console.log( "scratchCard.js: scratch part:",  filledInPixels + '%', rootObject);
            if (filledInPixels > thresholdPecent) {
                // console.log("scratchCard.js: _handlePercentage: clear scratch canvas ", canvas );
                self.clearScratchImage( canvas );
                
                let scratchCard = window.aScratchCard.getScratchCard(window.aScratchCard.currentScratchCardObjId);
                scratchCard.scratchCardInfo.scratchCardState = 2;
                window.aScratchCard.setScratchCardtoMDB( scratchCard.scratchCardInfo );
                scratchCard.canExchange = true;
                scratchCardExchangeDiv.style.backgroundColor = "rgba(0, 201, 157, 1.0)";
                scratchCardExchangeDiv.innerText = "按此兌換獎項";
    
            }else{
                scratchCardExchangeDiv.innerText = "尚未完成刮刮卡";
            }
        }
        
        function handleMouseDown(e) {
            // console.log( "handleMouseDown :"  );
            isDrawing = true;
            lastPoint = getMouse(e, canvas);
        }
    
        function handleMouseMove(e) {
            if (!isDrawing) { return; }
            
            e.preventDefault();
    
            var currentPoint = getMouse(e, canvas),
                dist = distanceBetween(lastPoint, currentPoint),
                angle = angleBetween(lastPoint, currentPoint),
                x, y;
    
            var offsetX = 15;
            var offsetY = 15;
            var drawWidth = 80;
            var drawHeight = 40;
    
            for (var i = 0; i < dist; i++) {
                x = lastPoint.x + (Math.sin(angle) * i) - offsetX;
                y = lastPoint.y + (Math.cos(angle) * i) - offsetY;
                ctx.globalCompositeOperation = 'destination-out';
                // ctx.drawImage(brush, x, y );
                ctx.drawImage(brush, x  , y , drawWidth, drawHeight ); //
                // console.log("x y=", x,y );
            }
            
            lastPoint = currentPoint;
            handlePercentage(getFilledInPixels(32));
        }
    
        function handleMouseUp(e) {
            isDrawing = false;
        }
    
        function handleMouseLeaveCanvas(e){
            isDrawing = false;
        }
    
    }

    //// 設置輸入密碼 div 的大小位置
    setupPasswordDiv(){
        this.scratchCardPWDBG = this.getHtmlElement("scratchCardPWDBG");
        this.scratchCardPWDBG.setAttribute("class" , "backgroundModal");
        document.body.appendChild(this.scratchCardPWDBG);

        this.scratchCardPWDiv = this.getHtmlElement("scratchCardPWDiv");
        this.scratchCardPWDiv.setAttribute("class", "modulePWDDiv");
        this.scratchCardPWDiv.style.display = "block";
        this.scratchCardPWDBG.appendChild(this.scratchCardPWDiv);
        
        let ipw = innerWidth > 600 ? 300 : innerWidth*0.5;
        let iph = innerHeight > 900 ? 270 : innerHeight*0.3;
        
        this.scratchCardPWDiv.style.left = (innerWidth - ipw)/2 + "px";
        this.scratchCardPWDiv.style.top  = (innerHeight - iph)/2 + "px";

        this.scratchCardPWDiv.style.width = ipw + "px";
        this.scratchCardPWDiv.style.height = iph + "px";

        this.scratchCardPWDiv.innerHTML = "<br> 輸入密碼 <br>";

        /////////////////////////////////////////////////////////////////

        ////// 密碼輸入區域
        let scratchCardPWDInputText = this.getHtmlElement("scratchCardPWDInputText", "input");
        scratchCardPWDInputText.setAttribute("class", "modulePWDInputText"); // default
        scratchCardPWDInputText.setAttribute("type", "text"); // default
        scratchCardPWDInputText.setAttribute("placeholder", "pwd"); // default
        this.scratchCardPWDiv.appendChild(scratchCardPWDInputText);

        ////// 密碼輸入 結果區域
        let scratchCardPWDRetText = this.getHtmlElement("scratchCardPWDRetText");
        scratchCardPWDRetText.setAttribute("class", "modulePWDRetText"); // default
        this.scratchCardPWDiv.appendChild(scratchCardPWDRetText);
        scratchCardPWDRetText.innerText = "";

        //// 取消按鈕設置
        let scratchCardPWDCancel = this.getHtmlElement("scratchCardPWDCancel");
        scratchCardPWDCancel.setAttribute("class", "bottomLeftCell" );
        // scratchCardPWDCancel.innerHTML = "&times;";
        scratchCardPWDCancel.innerText = "取消";
        this.scratchCardPWDiv.appendChild(scratchCardPWDCancel);
        scratchCardPWDCancel.onclick = function(){
            console.log("scratchCard.js: cancel button click ");
            scratchCardPWDBG.style.display = "none";
            scratchCardPWDInputText.value = "";
            scratchCardPWDRetText.innerText = "";
		};

        ////// 確認按鈕設置
        let scratchCardPWDConfirm = this.getHtmlElement("scratchCardPWDConfirm");
        scratchCardPWDConfirm.setAttribute("class", "bottomRightCell" );
        scratchCardPWDConfirm.innerText = "確認";
        
        this.scratchCardPWDiv.appendChild(scratchCardPWDConfirm);

        scratchCardPWDConfirm.onclick = (event) => {
            //// get current scratchCard            
            let scratchCard = this.getScratchCard(this.currentScratchCardObjId);
            console.log("scratchCard.js: _passwordConfirm scratchCard = ", scratchCard  );

            let password = scratchCard.module.rewardPassword

            // console.log("scratchCard.js: _passwordConfirm: password enter: inputPasswordInputText=", scratchCardPWDInputText.value, scratchCard.module.rewardPassword );
            
            if (scratchCardPWDInputText.value == password ){
                console.log("scratchCard.js: confirm button click password correct ", scratchCardPWDInputText.value , scratchCard.module.rewardPassword );

                scratchCardPWDRetText.innerText = "密碼正確";
                this.scratchCardExchangeDiv.innerText = "已兌換";
                this.scratchCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
                
                scratchCard.currentScene2DRoot.exchanged = 1;
                scratchCard.exchanged = 1
                scratchCard.canExchange = false; 
                scratchCard.scratchCardState = 3

                scratchCard.scratchCardInfo.scratchCardState = 3;
                scratchCard.scratchCardInfo.is_exchanged = true;

                this.setScratchCardtoMDB( scratchCard.scratchCardInfo );

                setTimeout( () => {
                    window.aScratchCard.scratchCardPWDBG.style.display = "none";
                }, 2000);

            }else{
                console.log("scratchCard.js: confirm button click password wrong ", scratchCardPWDInputText.value );
                // console.log("scratchCard.js: confirm button click password wrong ", scratchCardPWDInputText.value , scratchCard.module.rewardPassword );
                scratchCardPWDRetText.innerText = "密碼錯誤";
            }
        }
    }

    showScratchCardCanvas( scene2DRoot, obj ){
        this.currentScratchCardObjId = obj.generalAttr.obj_id
        let scratchCard = this.getScratchCard(this.currentScratchCardObjId);

        scratchCard.currentScene2DRoot = scene2DRoot;

        console.log(scratchCard)

        let pScratchImage;
        let awardObj;
        let getAwardIndex = scratchCard.scratchCardInfo.getAwardIndex;
        for (let i = 0; i < arController.makarObjects2D.length; i++ ){
            if ( arController.makarObjects2D[i].obj_id == obj.typeAttr.module.cards[0].awards[getAwardIndex].awardID+"_"+obj.generalAttr.obj_id ){
                awardObj = arController.makarObjects2D[i];
            }
        }

        if(!awardObj) return;

        this.scratchCardExchangeDiv.style.display = "inline";
        let scratchTempOBjJson = window.aScratchCard.makeTempObjJson(obj, "Scratch");

        switch(scratchCard.scratchCardInfo.scratchCardState){ //// [ 0:init , 1:scratched , 2:getAward , 3:exchanged ]

            // case 0:
            //     awardObj.updateMatrixWorld();
            //     pScratchImage =  window.aScratchCard.loadScratchImage( obj, scratchTempOBjJson, awardObj.matrixWorld.clone(), self.scaleRatioXY);
            //     pScratchImage.then(scratchCanvas =>{
            //         awardObj.visible = true;
            //         window.aScratchCard.scratchCardExchangeDiv.innerText = "尚未完成刮刮卡"
            //         window.aScratchCard.loadBrushSetting(scratchCanvas, awardObj.matrixWorld.clone());
            //     })
            //     console.log("init, getAwardIndex = ", getAwardIndex)
            //     break;

            case 1:
                awardObj.updateMatrixWorld();
                pScratchImage =  this.loadScratchImage( obj.generalAttr.obj_id, scratchTempOBjJson, awardObj.matrixWorld.clone(), arController.scaleRatioXY);
                pScratchImage.then(scratchCanvas =>{
                    awardObj.visible = true;
                    this.scratchCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
                    this.scratchCardExchangeDiv.innerText = "尚未完成刮刮卡"
                    this.loadBrushSetting(scratchCanvas, awardObj.matrixWorld.clone());
                })
                break;

            case 2:
                awardObj.visible = true;
                scratchCard.canExchange = true;
                this.scratchCardExchangeDiv.style.backgroundColor = "rgba(0, 201, 157, 1.0)";
                this.scratchCardExchangeDiv.innerText = "按此兌換獎項";
                break;

            case 3:
                awardObj.visible = true;
                this.scratchCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
                this.scratchCardExchangeDiv.innerText = "已兌換";


                
                break;


        }
        
    }

    hideScratchCardCanvas( obj_2D ){
        console.log("ScratchCard.js: aScratchCard.hideScratchCardCanvas: obj_2D = ", obj_2D );
        if (obj_2D.loadModule = "scratchCard" ){//// 再次確認模組為刮刮卡
            this.clearScratchImage(document.getElementById("scratchCanvas"))
            this.scratchCardExchangeDiv.style.display = "none";
            this.scratchCardPWDBG.style.display = "none";
            scratchCardPWDInputText.value = "";
            scratchCardPWDRetText.innerText = "";
        }
    }
    
    //// 在 ARcontroller.loadMakararScene 的時候呼叫的
    //// 新增一張刮刮卡到mDB 並顯示刮刮卡和html
    loadNewCard( scene2DRoot, scene_obj, scratchCard, i, sceneObjsLength ){
        //// 當確認都沒問題後 從 arController 移過來

        ////// 創造出一個亂數的字串作為裝置參數 device_id ，在上傳資料時候必須用到
        let device_id = localStorage.getItem("device_id"); 
        if( !device_id ){ 
            device_id = new Date().getTime() + "_" + makeid(10) ;
            localStorage.setItem( "device_id",  device_id );
        }            

        window.aScratchCard.setScratchCardtoMDB(scratchCard.scratchCardInfo).then( setProjRet => {

            // const diffScratchs = scratchCard.scratchCardInfo.collected_scratchs.length - scene_obj.typeAttr.module.canRewardScratchCount
            // this.showScratchCardCanvas( scene2DRoot , diffScratchs , scratchCard.scratchCardInfo.is_exchanged, scratchCard.scratchCardInfo.obj_id );

        })

    }

    

    

}

window.aScratchCard = new ScratchCardFactory();