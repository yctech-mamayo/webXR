"use strict";
(self["webpackChunkvr"] = self["webpackChunkvr"] || []).push([["js_VRMain_version3_4_VRFunc_js"],{

/***/ "./js/VRMain/version3_4/AddObjectToVrController.js":
/*!*********************************************************!*\
  !*** ./js/VRMain/version3_4/AddObjectToVrController.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//// 主因: 3D物件載入都在 VRController 底下，要呼叫load系列都要透過 VRController
//// 同時 Quiz 物件要獨立出來，但 Quiz 會需要把物件加入場景 (要呼叫load系列)

//// 目的: 將額外的3D物件加到場景裡，因此它會和 vrController 互動

////           ________________________         ____________ 
////     介面: |AddObjectToVrController| -使用→ |VRController|
////           ¯¯¯¯¯¯¯↑¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯         ¯¯¯¯¯¯¯¯¯¯¯¯¯
////                  | 實作該介面　　　　　　
////                _____
////                |Quiz|　　　　　　　　                             (因此Quiz可以將3D物件加入場景)
////                ¯¯¯¯¯¯

//// 原本是想寫 interface 但發現 js 似乎還沒有，因此寫成 class  (上圖的實作其實是用extends繼承)

//// 有實作/繼承這個Class的 就表示它能跟vrController互動
class AddObjectToVrController {
        
    //// 此時 只要 Quiz 繼承這個 class 並實作它的方法，就能把物件加入場景
    //// howardhsu has not comfirm that this is good or not, yet. 
    
    //// 考慮了如果場中存在複數個 vrController 的情況(指定是與哪個vrController互動)
    // vrController = null
    // constructor(vrController){
    //     this.vrController = vrController
    // }
    //// 但，如果寫了 constructor 就變質了  (它會連 Abstract Class 都不是，也不是 interface。 Orz


    //// ----------------
    //// 以下是 "把物件加入到場景 或 vrController 常用到的函式們" 
    ////     實作或繼承了此抽象類別的class需要去覆寫它們 以便與vrController互動

    getProjectIdx(){
        // return window.vrController.projectIdx
    }

    addTextToScene(){
        //// 把文字物件加入場景
    }

    addTextureToScene(){
        //// 把圖片物件加入場景
    }

    addGLTFModelToScene(){
        //// 把模型物件加入場景
    }

    addAudioToScene(){
        //// 把聲音物件加入場景
    }

    addVideoToScene(){
        //// 把影片物件加入場景
    }

    pushObjectToMakarObjects(){
        //// 把3D物件加入到 makarObjects 陣列
    }

    setTransform(){
        //// 把物件放到對應的場景位置
    }

    appendToVrScene(){
        //// 把物件加入到場景裡
    }
    //// ----------------

    initTest(){
        console.log("AddObjectToVrController.initTest: ", window.vrController)
    }

    // static testStaticMethod(){
    //     console.log('static method test')
    // }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AddObjectToVrController);

/***/ }),

/***/ "./js/VRMain/version3_4/Quiz.js":
/*!**************************************!*\
  !*** ./js/VRMain/version3_4/Quiz.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AddObjectToVrController_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddObjectToVrController.js */ "./js/VRMain/version3_4/AddObjectToVrController.js");


function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Quiz extends _AddObjectToVrController_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    
    //[start-2023mmdd-howardhsu-add]//
    ////  - to do	    
    //// 	- quiz能去操控 html 的quiz介面	
    //// 	- 讓quiz顯示的2D正確錯誤介面可以共用

	//// 	- 要考慮能讓兩個quiz同時在場景中
	//// 		- 例如如果場景設定多個quiz都是載入時開始問答，點擊開始遊玩就都開始
    //[end-2023mmdd-howardhsu-add]//

    module = {'placeholder': 'quiz test.'}
    
    constructor(obj){
        super();
        this.module = obj.module
    }
    
    //// ----------------
    //// override "把物件加入到場景 或 vrController 常用到的函式們"   以便與vrController互動

    getProjectIdx(){
        return window.vrController.projectIdx
    }

    addTextToScene( questions_json, position, rotation, scale ){
        //// 把文字物件加入場景
        return window.vrController.loadText( questions_json, position, rotation, scale )
    }
    
    addTextureToScene( questions_json, position, rotation, scale ){
        //// 把圖片物件加入場景
        return window.vrController.loadTexture( questions_json, position, rotation, scale )                        
    }

    addGLTFModelToScene( questions_json, position, rotation, scale ){
        //// 把模型物件加入場景
        return window.vrController.loadGLTFModel( questions_json, position, rotation, scale, vrController.cubeTex )  
    }

    addAudioToScene( questions_json, position, rotation, scale ){
        //// 把聲音物件加入場景
        return window.vrController.loadAudio( questions_json, position, rotation, scale )
    }

    addVideoToScene( questions_json, position, rotation, scale ){
        //// 把影片物件加入場景
        return window.vrController.loadVideo( questions_json, position, rotation, scale )
    }

    pushToMakarObjects( makarObject ){
        //// 把3D物件加入到 makarObjects 陣列
        window.vrController.makarObjects.push( makarObject );
    }

    setTransform(base, circlePos, circleRot, circleScale){
        //// 把物件放到對應的場景位置
        window.vrController.setTransform(base, circlePos, circleRot, circleScale);
    }

    appendToVrScene(obj){
        window.vrController.vrScene.appendChild(obj);
    }

    //// ---------------- 其他會用到 vrController 的細項們
    clearObject(item){
        //// 把物件從 vrController.makarObject 清除、從頁面上移除
        for (let i = 0; i < window.vrController.makarObjects.length; i++ ){
            if (window.vrController.makarObjects[i].id == item.id){
                let makarObject = window.vrController.makarObjects[i];
                if(makarObject.getAttribute("src")){
                    let id = makarObject.getAttribute("src").split('#')[1];
                    if (document.getElementById(id)){
                        document.getElementById(id).remove();
                    }
                }
                makarObject.remove();
                window.vrController.makarObjects.splice(i,1);
            }
        }
    }

    adjustCursorEntity(setOrRemove, attr, value=""){
        // 調整 window.vrController.cursorEntity
        setOrRemove = setOrRemove.toLowerCase()
        switch (setOrRemove) {
            case "set":
                window.vrController.cursorEntity.setAttribute(attr, value);                
                break;

            case "remove":                
                window.vrController.cursorEntity.removeAttribute(attr);
                break;
        
            default:
                console.log("Quiz.js adjustCursorEntity: error")
                break;
        }
    }
    //// ----------------
    

    //// 載入 Quiz
    load( obj, position, rotation, scale) {

        //// for dev
        window.quiz = this

        let self = this

        //// 載入之前先檢查是否網頁端有用戶登入，並檢查是否玩過此專案
        // console.log("VRFunc.js: _loadQuiz: obj=", obj);
        let quizEntity = document.createElement("a-entity");
        quizEntity.setAttribute("id", obj.obj_id);

        this.pushToMakarObjects(quizEntity)
        
        console.log("Quiz.js: _load: quizEntity=", quizEntity.object3D);
    
        quizEntity.addEventListener( 'loaded' , function(){
            // console.log(' -------- quizEntity loaded ');
            ///// 增加一個「空物件」，代表此 entity 已經自身載入完成
            let QObject3D = new THREE.Object3D();
            quizEntity.object3D.add( QObject3D );
        });
        
        let randomQuestionList = [];
        for (let i=0; i<obj.module[0].question_list.length; i++){
            if (obj.module[0].question_list[i].allowRandom){
                randomQuestionList.push(i);
            }
        }
    
        //// 當user沒有在quiz設定題目順序時的error
        if(!obj.module[0].display_order_list){
            console.log("Quiz.js _load: ERROR - user has not set display_order_list. obj.module[0]=", obj.module[0])
            return
        }

        let totalActiveScoreQuestion = 0
        for (let i=0;i<obj.module[0].display_order_list.length;i++){
            let tempIdx =  obj.module[0].display_order_list[i].index;
            if (tempIdx == -1){
                let randInt = getRandomInt(randomQuestionList.length);
                let randomIdx = randomQuestionList[randInt];
                obj.module[0].display_order_list[i].index = randomIdx
                tempIdx = randomIdx;
                randomQuestionList.splice(randInt,1);
            }
            if (obj.module[0].question_list[tempIdx].active_score){
                totalActiveScoreQuestion += 1;
            }
        }
    
        let idx = obj.module[0].display_order_list[0].index;
        let first_question = obj.module[0].question_list[idx];
    
        let timerContent = document.getElementById('timerContent');
    
        let firstTimer = -1;
        if (obj.module[0].timer_type == "Total"){
            firstTimer = obj.module[0].total_time;
            let timer = document.getElementById("timerDiv");
            timer.style.display = "block";
    
            let hour = Math.floor(firstTimer/3600);
            let min = Math.floor((firstTimer-hour*3600)/60);
            let sec = firstTimer-hour*3600-min*60;
            timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
        }
        else if(obj.module[0].timer_type == "Custom"){
            firstTimer = first_question.time_limit;
            let timer = document.getElementById("timerDiv");
            timer.style.display = "block";
    
            let hour = Math.floor(firstTimer/3600);
            let min = Math.floor((firstTimer-hour*3600)/60);
            let sec = firstTimer-hour*3600-min*60;
            timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
        }
    
        let tipButtonDiv = document.getElementById("tipButtonDiv");
        if(first_question.show_tips){
            tipButtonDiv.style.display = "block";
            tipButtonDiv.addEventListener("click",function(){
                let tipDiv = document.getElementById("tipDiv");
                let tipConfirmButton = document.getElementById("tipConfirmButton");
                let tipContent = document.getElementById("tipContent");
                tipDiv.style.display = "block";
                tipContent.textContent = first_question.tips_content;
                tipConfirmButton.addEventListener("click",function(){
                    tipDiv.style.display = "none";
                });
            });
        }
        else{
            tipButtonDiv.style.display = "none";
        }
    
        this.module = {
            "json":obj.module[0], 
            "quizEntity":quizEntity, 
            "currentIndex":0, 
            "score":0, 
            "choices":[], 
            "correctAnswer":0, 
            "totalActiveScoreQuestion":totalActiveScoreQuestion, 
            "record":new Array(obj.module[0].question_list.length), 
            "timer":{"currentTimer":null,"counter":firstTimer } , 
            "record_time":0 , 
            "qClock": Date.now() 
        }
    
        let scoreDiv = document.getElementById("scoreDiv")
        scoreDiv.addEventListener("click",function(){
            scoreDiv.style.display = "none";
            self.nextQuestion();
        });
    
        console.log("Quiz.js: _load: _first_question=", first_question );
    
        if ( first_question.questions_json && Array.isArray( first_question.questions_json ) ){
            for(let i=0; i<first_question.questions_json.length; i++){
                let position = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
                let rotation = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
                let scale    = new THREE.Vector3().fromArray(first_question.questions_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
                let type = first_question.questions_json[i].main_type;
                switch(type){
                    case "text":                        
                        //[start-20230919-howardhsu-modify]//
                        this.addTextToScene( first_question.questions_json[i], position, rotation, scale )
                        break;
                    case "image":
                        this.addTextureToScene( first_question.questions_json[i], position, rotation, scale )
                        break;
                    case "video":
                        this.addVideoToScene( first_question.questions_json[i], position, rotation, scale );
                        break;
                    case "model":   
                        this.addGLTFModelToScene( first_question.questions_json[i], position, rotation, scale )            
                        break;
                    case "audio":
                        this.addAudioToScene( first_question.questions_json[i], position, rotation, scale );
                        //[end-20230919-howardhsu-modify]//
                        break;
                }
            }
        }
        
        if ( first_question.options_json ){
    
            for(let i=0; i<first_question.options_json.length; i++){
                let position = new THREE.Vector3().fromArray(first_question.options_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
                let rotation = new THREE.Vector3().fromArray(first_question.options_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
                let scale    = new THREE.Vector3().fromArray(first_question.options_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
                let type = first_question.options_json[i].sub_type;
                console.log("Quiz.js: _load: _loadOption: ", i , type , first_question.options_json[i] )
                let Entity;
                let pOption;
                switch(type){
                    case "txt":
                        // first_question.options_json[i].main_type = "text";
                        
                        //[start-20230919-howardhsu-modify]//
                        pOption = this.addTextToScene( first_question.options_json[i], position, rotation, scale)
    
                        break;
                    case "gif":
                    case "jpg":
                    case "jpeg":
                    case "png":
                        pOption = this.addTextureToScene( first_question.options_json[i], position, rotation, scale)
                        break;
                    case "button":
                        first_question.options_json[i].res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
                        
                        pOption = this.addTextureToScene( first_question.options_json[i], position, rotation, scale)
                        //[end-20230919-howardhsu-modify]//
                        break;
                }
                
                if (type != "button" && (first_question.option_type == "MutiOption_Text"|| first_question.option_type == "MutiOption_Image")){
    
                    if ( isPromise( pOption ) == false ){
                        continue;
                    }
    
                    pOption.then( function( ret ){
                        Entity = ret;
    
                        if(first_question.option_type == "MutiOption_Text"){
    
                            console.log(" *** loaded: " , Entity.object3D );
    
                            let circlePos = new THREE.Vector3(0,0,0);
                            let circleRot = new THREE.Vector3(0,0,0);
                            let circleScale = new THREE.Vector3(1,1,1);
    
                            let base = document.createElement("a-plane");
                            base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                            base.setAttribute("id","circle_base");
                            base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                            // self.setTransform(base, circlePos, circleRot, circleScale);
                            Entity.appendChild(base);
    
                            let circle = document.createElement("a-plane");
                            circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                            circle.setAttribute("id","circle_out");
                            circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                            // self.setTransform(circle, circlePos, circleRot, circleScale);
                            Entity.appendChild(circle);
                            
                            let circle2 = document.createElement("a-plane");
                            circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                            circle2.setAttribute("id","circle_in");
                            circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                            circle2.setAttribute( "visible", false);
                            // circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                            // self.setTransform(circle2, circlePos, circleRot, circleScale);
                            Entity.appendChild(circle2);
    
                            /////////////
                            // console.log(" *** geometry-set: " , Entity.object3D , Entity.getObject3D("mesh").geometry.attributes.position.array[0] );
                            // console.log('VRFunc.js: _loadQuiz: scale ', Entity.object3D.parent.scale , Entity.object3D  );
    
                            let width = Math.abs(Entity.getObject3D("mesh").geometry.attributes.position.array[0])*2;
                            circlePos.x = circlePos.x + width*0.5 + 0.3/Entity.object3D.parent.el.getAttribute("scale").x;
                            circlePos.z = circlePos.z - 0.01;
                            base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                            circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                            circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
    
                            //[start-20230706-howardhsu-modify]//
                            circleScale.multiply( new THREE.Vector3( 0.2, 0.2, 0.2 ) );
                            //[start-20230706-howardhsu-modify]//
    
                            circleScale.divide(Entity.object3D.parent.el.getAttribute("scale"))
    
                            base.setAttribute("scale" , circleScale );
                            circle.setAttribute("scale" , circleScale );
                            circle2.setAttribute("scale" , circleScale.clone().multiply( new THREE.Vector3( 0.7,0.7,0.7 ) ) );
    
    
                            let f_setRenderOrder = function( evt ){
                                if (evt.target == evt.currentTarget){
                                    // console.log('1 ************ evt= ', evt.target.object3D.children[0] );
                                    if ( evt.target.object3D ){
                                        if ( evt.target.object3D.children[0] ){
                                            evt.target.object3D.children[0].renderOrder = 1;
                                        }
                                    }
                                }
                            }
                            base.addEventListener("loaded", f_setRenderOrder );
                            circle.addEventListener("loaded", f_setRenderOrder );
                            circle2.addEventListener("loaded", f_setRenderOrder );
    
                            /////////////
    
                            // Entity.addEventListener("geometry-set", function(evt){
                            // 	console.log(" *** geometry-set: " , Entity.object3D , Entity.getObject3D("mesh").geometry.attributes.position.array[0] );
                            // 	let width = Math.abs(Entity.getObject3D("mesh").geometry.attributes.position.array[0])*2;
                            // 	circlePos.x = circlePos.x + width*0.5 + 0.3/Entity.object3D.parent.el.getAttribute("scale").x;
                            // 	circlePos.z = circlePos.z - 0.01;
                            // 	base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                            // 	circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                            // 	circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                            // });
    
                            // Entity.addEventListener("loaded", function(evt){
                            // 	Entity.object3D.parent.el.addEventListener("loaded", function(evt){
                            // 		let circleScale = new THREE.Vector3(1,1,1);
                            // 		console.log('VRFunc.js: _loadQuiz: scale ', Entity.object3D.parent.el.getAttribute("scale") , Entity.object3D );
    
                            // 		circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                            // 		circleScale.divide(Entity.object3D.parent.el.getAttribute("scale"))
    
                            // 		base.setAttribute("scale" , circleScale );
                            // 		circle.setAttribute("scale" , circleScale );
                            // 		circle2.setAttribute("scale" , circleScale.clone().multiply( new THREE.Vector3( 0.7,0.7,0.7 ) ) );
                            // 	});
                            // });
    
                        }
                        else{
    
                            ///////
    
                            let circlePos = new THREE.Vector3(0,0,0);
                            let circleRot = new THREE.Vector3(0,0,0);
                            let circleScale = new THREE.Vector3(1,1,1);
    
                            let timeoutID = setInterval( function () {

                                //[start-20230923-howardhsu-add]//    
                                //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                                if (self.module.currentIndex >= self.module.json.display_order_list.length){
                                    window.clearInterval(self.module.timer.currentTimer)
                                }                             
                                //[end-20230923-howardhsu-add]//

                                if (Entity.getAttribute("heightForQuiz")){ 
                                    let height = Entity.getAttribute("heightForQuiz");
    
                                    circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                                    circleScale.divide(Entity.getAttribute("scale"))
                                    circlePos.y = circlePos.y - height/2 - (0.3/Entity.getAttribute("scale").y);
    
                                    let base = document.createElement("a-plane");
                                    base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                    base.setAttribute("id","circle_base");
                                    base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                                    self.setTransform(base, circlePos, circleRot, circleScale);
                                    Entity.appendChild(base);
        
                                    let circle = document.createElement("a-plane");
                                    circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                                    circle.setAttribute("id","circle_out");
                                    circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                                    self.setTransform(circle, circlePos, circleRot, circleScale);
                                    Entity.appendChild(circle);
                                    
                                    let circle2 = document.createElement("a-plane");
                                    circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                    circle2.setAttribute("id","circle_in");
                                    circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                                    circle2.setAttribute( "visible", false);
                                    circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                                    self.setTransform(circle2, circlePos, circleRot, circleScale);
                                    Entity.appendChild(circle2);
    
    
                                    let f_setRenderOrder = function( evt ){
                                        if (evt.target == evt.currentTarget){
                                            // console.log('2 ************ evt= ', evt.target.object3D.children[0] );
                                            if ( evt.target.object3D ){
                                                if ( evt.target.object3D.children[0] ){
                                                    evt.target.object3D.children[0].renderOrder = 1;
                                                }
                                            }
                                        }
                                    }
                                    base.addEventListener("loaded", f_setRenderOrder );
                                    circle.addEventListener("loaded", f_setRenderOrder );
                                    circle2.addEventListener("loaded", f_setRenderOrder );
    
                                    
    
                                    window.clearInterval(timeoutID);
                                }
                            }, 1);
    
                            ///////
    
    
                            // Entity.addEventListener("loaded", function(evt){
                            // 	let circlePos = new THREE.Vector3(0,0,0);
                            // 	let circleRot = new THREE.Vector3(0,0,0);
                            // 	let circleScale = new THREE.Vector3(1,1,1);
    
                            // 	let timeoutID = setInterval( function () {
                            // 		if (Entity.getAttribute("heightForQuiz")){ 
                            // 			let height = Entity.getAttribute("heightForQuiz");
    
                            // 			circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                            // 			circleScale.divide(Entity.getAttribute("scale"))
                            // 			circlePos.y = circlePos.y - height/2 - (0.3/Entity.getAttribute("scale").y);
    
                            // 			let base = document.createElement("a-plane");
                            // 			base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                            // 			base.setAttribute("id","circle_base");
                            // 			base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                            // 			self.setTransform(base, circlePos, circleRot, circleScale);
                            // 			Entity.appendChild(base);
            
                            // 			let circle = document.createElement("a-plane");
                            // 			circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                            // 			circle.setAttribute("id","circle_out"); 
                            // 			circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                            // 			self.setTransform(circle, circlePos, circleRot, circleScale);
                            // 			Entity.appendChild(circle);
                                        
                            // 			let circle2 = document.createElement("a-plane");
                            // 			circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                            // 			circle2.setAttribute("id","circle_in");
                            // 			circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                            // 			circle2.setAttribute( "visible", false);
                            // 			circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                            // 			self.setTransform(circle2, circlePos, circleRot, circleScale);
                            // 			Entity.appendChild(circle2);
        
                            // 			window.clearInterval(timeoutID);
                            // 		}
                            // 	}, 1);
                                
                            // });
    
                            
                        }
    
                    });
    
                    
    
                }
            }
        }
    
        //// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
        if (this.module.timer.counter >= 0){
            this.module.qClock = Date.now();
            let timeoutID = setInterval(function() {                
                self.module.timer.currentTimer = timeoutID;
                self.module.timer.counter -= 1;
                
                //[start-20230923-howardhsu-add]//    
                //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                if (self.module.currentIndex >= self.module.json.display_order_list.length){
                    window.clearInterval(self.module.timer.currentTimer)
                }                             
                //[end-20230923-howardhsu-add]//

                let hour = Math.floor(self.module.timer.counter/3600);
                let min = Math.floor((self.module.timer.counter-hour*3600)/60);
                let sec = self.module.timer.counter-hour*3600-min*60;
                timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
                // console.log(self.module.timer.counter);
                if (self.module.timer.counter == 0){
    
                    window.clearInterval(self.module.timer.currentTimer);
                    if (obj.module[0].timer_type == "Custom"){
                        if (first_question.show_score){
                            let scoreDiv = document.getElementById("scoreDiv");
                            let score = document.getElementById("score");
                            scoreDiv.style.display = "block";
                            score.textContent = self.module.score;
                            
                        }
                        else{
                            self.nextQuestion();
                        }
                    }
                    else{
                        let temp = []
                        let quizEntity = self.module.quizEntity;
                        for (let item of quizEntity.children) {
                            temp.push(item);
                        }
                        temp.forEach( (item) => {self.clearObject(item)} );
    
                        let tipButtonDiv = document.getElementById("tipButtonDiv");
                        let tipDiv = document.getElementById("tipDiv");
                        tipButtonDiv.style.display = "none";
                        tipDiv.style.display = "none";
    
                        let startQuiz = document.getElementById("startQuiz");
                        let QuizStartButton = document.getElementById("QuizStartButton");
                        let QuizStartContent = document.getElementById("QuizStartContent");
                        startQuiz.style.display = "block";
                        QuizStartContent.textContent = "時間到"
                        
                        let quizIndex = {
                            question: idx ,
                            get_score:  0,
                            answer_time: self.module.json.question_list[idx].time_limit ,
                            answer_options: [],
                            answer_cloze: "",
                            answer_is_enable: false,
                            answer_is: false,
                        }
                        self.module.record[idx] = quizIndex;
                        self.module.record_time += self.module.json.question_list[idx].time_limit;
                        self.module.qClock = Date.now();
    
                        // let timeup = document.getElementById("timeup");
                        // timeup.style.display = "block";
                        // let timeupConfirmButton = document.getElementById("timeupConfirmButton");
                        QuizStartButton.addEventListener("click",function(){
                            startQuiz.style.display = "none";
                            // self.nextQuestion();
                            //[start-20230712-howardhsu-add]//
                            //// 存檔: 沒有下一題，預定紀錄答題狀態上雲端 (就是this.nextQusetion底下else的全部)
                            self.saveQuizStatus();
                            //[end-20230712-howardhsu-add]//
                        });
    
                    }
                }
            },1000);
        }
        //// ---------------------------------------------------------------- ////	
        
        self.setTransform(quizEntity, position, rotation, scale);
        self.appendToVrScene(quizEntity)
    }


    
    //20200723-thonsha-add-start
	pushButton(target){
        
        let self = this

        let goNext = false;
        let answer_options = []; //// 答題 index
        let answer_is = false; //// 答對與否
        let get_score = 0;
        let idx = this.module.json.display_order_list[this.module.currentIndex].index;
        let currectQuestion = this.module.json.question_list[idx];
        let scoreType = this.module.json.score_type;

        let makarDragon = document.getElementById("makarDragon");
        let imgRight = document.getElementById("imgRight");
        let imgWrong = document.getElementById("imgWrong");
        if (currectQuestion.option_type == "Option_Text" || currectQuestion.option_type == "Option_Image"){
            if (currectQuestion.answer_list == null){
                currectQuestion.answer_list = []
            }
            let correctAnswerIdx = currectQuestion.answer_list[0];
            let correctAnswer = currectQuestion.options_json[correctAnswerIdx-1];
            
            let targetId;
            if (target.localName=='a-text'){
                targetId = target.parentNode.id;
            }
            else{
                targetId = target.id;
            }

            //// 查找紀錄『選了哪個選項』
            for (let i = 0, len=currectQuestion.options_json.length; i < len; i++ ){
                if ( currectQuestion.options_json[i].obj_id == targetId ){
                    // console.log(" ***********   " , i , currectQuestion.options_json );
                    answer_options.push(i);
                }
            }

            if (correctAnswer && correctAnswer.obj_id == targetId){
                if (currectQuestion.active_score){
                    if (scoreType == 'Custom'){
                        self.module.score += currectQuestion.score;
                        get_score = currectQuestion.score;
                    }
                    else if(scoreType == 'Total'){
                        let scoreTotal = self.module.json.total_score;
                        self.module.correctAnswer += 1;
                        self.module.score =  Math.round(scoreTotal * self.module.correctAnswer/self.module.totalActiveScoreQuestion);
                        get_score = Math.round( scoreTotal/self.module.totalActiveScoreQuestion );
                    }
                }
                answer_is = true;
                makarDragon.style.display = "block";
                imgRight.style.display = "block";
                imgWrong.style.display = "none";
                console.log("Quiz.js: _pushButton: Congratulations! Correct Answer!");
            }
            else{
                answer_is = false;
                makarDragon.style.display = "block";
                imgRight.style.display = "none";
                imgWrong.style.display = "block";
                console.log("Quiz.js: _pushButton: 叭叭~ Incorrect Answer!");
            }
            
            window.clearInterval(self.module.timer.currentTimer);
            
            self.adjustCursorEntity('remove', 'cursor')

            let counter = self.module.timer.counter;
            setTimeout(function(){
               
                makarDragon.style.display = "none";
                // 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
                let quizIndex = {
                    question: idx ,
                    get_score:  get_score,
                    answer_time: Math.round( (Date.now() - self.module.qClock)/1000 ),
                    answer_options: answer_options,
                    answer_cloze: "",
                    answer_is_enable: true,
                    answer_is: answer_is,
                }
                self.module.record[idx] = quizIndex;
                self.module.record_time += Math.round( (Date.now() - self.module.qClock)/1000 );
                self.module.qClock = Date.now();

                if (currectQuestion.show_score){
                    let scoreDiv = document.getElementById("scoreDiv");
                    let score = document.getElementById("score");
                    scoreDiv.style.display = "block";
                    score.textContent = self.module.score;
                    
                }
                else{
                    self.nextQuestion();
                }

            },1600);
            console.log("Quiz.js: _pushButton: score: ", self.module.score , currectQuestion );
            // goNext = true;
        }
        else{

            //// 由於「多選圖片」跟「多選文字」的層級不同，改為完整尋找
            target.object3D.traverse( function( child ){ 
                if ( child.type=='Group' && child.el && child.el.getAttribute('id') == 'circle_in' ){ 
                    let item = child.el;
                    item.setAttribute("visible", !item.getAttribute("visible"));
                    let targetId;
                    if (target.localName=='a-text'){
                        targetId = target.parentNode.id;
                    } else{
                        targetId = target.id;
                    }
                    if (self.module["choices"].includes(targetId)){
                        let choices_idx = self.module["choices"].indexOf(targetId);
                        self.module["choices"].splice(choices_idx,1);
                    }
                    else{
                        self.module["choices"].push(targetId);
                    }
                    console.log("Quiz.js: _pushButton: choices = ", self.module["choices"]);

                } 
                else if ( child.type=='Group' && child.el && child.el.getAttribute('id') == 'circle_out' ){
                    let item = child.el;
                    if (item.getAttribute( "material",).color == "#7B7B7B"){
                        item.setAttribute( "material", "color:#00d1c1;" ); 
                    }
                    else if (item.getAttribute( "material",).color == "#00d1c1"){
                        item.setAttribute( "material", "color:#7B7B7B;" ); 
                    }
                }

            });

            // for (let item of target.children) {
            // 	if (item.getAttribute("id") == "circle_in"){
            // 		item.setAttribute("visible", !item.getAttribute("visible"));
            // 		//20200901-text-geometry-test
            // 		// if (target.object3D.parent.parent.el){
            // 		//20200901-text-geometry-test
            // 		if (target.localName=='a-text'){
            // 			targetId = target.parentNode.id;
            // 		}
            // 		else{
            // 			targetId = target.id;
            // 		}

            // 		if (self.module["choices"].includes(targetId)){
            // 			choices_idx = self.module["choices"].indexOf(targetId);
            // 			self.module["choices"].splice(choices_idx,1);
            // 		}
            // 		else{
            // 			self.module["choices"].push(targetId);
            // 		}
            // 		console.log("VRFunc.js: _nextQuestion: choices = ", self.module["choices"]);
            // 	}
            // 	else if(item.getAttribute("id") == "circle_out"){
            // 		if (item.getAttribute( "material",).color == "#7B7B7B"){
            // 			item.setAttribute( "material", "color:#00d1c1;" ); 
            // 		}
            // 		else if (item.getAttribute( "material",).color == "#00d1c1"){
            // 			item.setAttribute( "material", "color:#7B7B7B;" ); 
            // 		}
            // 	}
            // }


            if (target.object3D.sub_type == "button"){
                let correctCount = 0;
                if (currectQuestion.answer_list == null){
                    currectQuestion.answer_list = []
                }
                for (let correct_idx of currectQuestion.answer_list){
                    let correctAnswer = currectQuestion.options_json[correct_idx];
                    if (correctAnswer){
                        for (let choicesId of self.module["choices"]){
                            if(choicesId == correctAnswer.obj_id){
                                correctCount += 1;
                            }
                        }
                    }
                }


                for (let i = 0, len = currectQuestion.options_json.length; i < len; i++ ){
                    for (let j = 0, len2 = self.module["choices"].length; j < len2; j++ ){
                        if (currectQuestion.options_json[i].obj_id == self.module["choices"][j] ){
                            answer_options.push( i-1 );
                        }
                    }
                }

                if (correctCount == currectQuestion.answer_list.length && currectQuestion.answer_list.length == self.module["choices"].length){
                    if (currectQuestion.active_score){
                        if (scoreType == 'Custom'){
                            self.module.score += currectQuestion.score;
                            get_score = currectQuestion.score;
                        }
                        else if(scoreType == 'Total'){
                            let scoreTotal = self.module.json.total_score;
                            self.module.correctAnswer += 1;
                            self.module.score =  Math.round(scoreTotal * self.module.correctAnswer/self.module.totalActiveScoreQuestion);
                            get_score = Math.round( scoreTotal/self.module.totalActiveScoreQuestion );
                        }
                    }
                    answer_is = true;
                    makarDragon.style.display = "block";
                    imgRight.style.display = "block";
                    imgWrong.style.display = "none";
                    console.log("Quiz.js: _pushButton: Congratulations! Correct Answer!");
                }
                else{
                    answer_is = false;
                    makarDragon.style.display = "block";
                    imgRight.style.display = "none";
                    imgWrong.style.display = "block";
                    console.log("Quiz.js: _pushButton: 叭叭~ Incorrect Answer!");
                }
                window.clearInterval(self.module.timer.currentTimer);                
                
                let counter = self.module.timer.counter;
                setTimeout(function(){
                    self.adjustCursorEntity('set', 'geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;")
                    // vrController.cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;" );

                    makarDragon.style.display = "none";
                    // 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
                    // console.log("Quiz.js: score , currectQuestion = ", idx, self.module , self.module["choices"] , answer_options , get_score );
                    console.log("Quiz.js: _pushButton: " , self.module.json.question_list[idx].time_limit, counter, Math.round( (Date.now() - self.module.qClock)/1000 ) );
                    let quizIndex = {
                        question: idx ,
                        get_score:  get_score,
                        answer_time:  Math.round( (Date.now() - self.module.qClock)/1000 ) ,
                        answer_options: answer_options,
                        answer_cloze: "",
                        answer_is_enable: true,
                        answer_is: answer_is,
                    }
                    self.module.record[idx] = quizIndex;
                    self.module.record_time += Math.round( (Date.now() - self.module.qClock)/1000 );
                    self.module.qClock = Date.now();

                    if (currectQuestion.show_score){
                        let scoreDiv = document.getElementById("scoreDiv");
                        let score = document.getElementById("score");
                        scoreDiv.style.display = "block";
                        score.textContent = self.module.score;
                        
                    }
                    else{
                        self.nextQuestion();
                    }
                    
                },1600);
                console.log("Quiz.js: _pushButton: score: ", self.module.score , currectQuestion );
                // goNext = true;
            }
        }
        
    }
    //20200723-thonsha-add-end


    nextQuestion(){

        this.module["choices"] = []
        let temp = []

        //[start-20230921-howardhsu-add]//
        // console.log("clear previous question's timer", self.module.timer)
        window.clearInterval(this.module.timer.currentTimer)
        //[end-20230921-howardhsu-add]//
        
        // let quizEntity;
        //20200901-text-geometry-test
        // if (target.object3D.parent.parent.el){
        //20200901-text-geometry-test
        // if (target.localName == "a-text"){
        // 	quizEntity = target.object3D.parent.parent.el;
        // }
        // else{
        // 	quizEntity = target.object3D.parent.el;
        // }
        let self = this

        let quizEntity = this.module.quizEntity;
        for (let item of quizEntity.children) {
            temp.push(item);
        }
        temp.forEach( (item) => {self.clearObject(item)} );

        this.module.currentIndex += 1;
        if (this.module.currentIndex < this.module.json.display_order_list.length){
            let idx = this.module.json.display_order_list[this.module.currentIndex].index
            let next_question = this.module.json.question_list[idx];

            if(this.module.json.timer_type == "Custom"){
                this.module.timer.counter = next_question.time_limit;
            }

            let tipButtonDiv = document.getElementById("tipButtonDiv");
            if(next_question.show_tips){
                tipButtonDiv.style.display = "block";
                tipButtonDiv.addEventListener("click",function(){
                    let tipDiv = document.getElementById("tipDiv");
                    let tipConfirmButton = document.getElementById("tipConfirmButton");
                    let tipContent = document.getElementById("tipContent");
                    tipDiv.style.display = "block";
                    tipContent.textContent = next_question.tips_content;
                    tipConfirmButton.addEventListener("click",function(){
                        tipDiv.style.display = "none";
                    });
                });
            }
            else{
                tipButtonDiv.style.display = "none";
            }

            if ( next_question.questions_json && Array.isArray( next_question.questions_json ) ){
                for(let i=0; i<next_question.questions_json.length; i++){
                    let position = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
                    let rotation = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
                    let scale    = new THREE.Vector3().fromArray(next_question.questions_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
                    let type = next_question.questions_json[i].main_type;
                    switch(type){
                        case "text":
                            this.addTextToScene(next_question.questions_json[i], position, rotation, scale);
                            break;
                        case "image":
                            this.addTextureToScene(next_question.questions_json[i], position, rotation, scale);
                            break;
                        case "video":
                            this.addVideoToScene(next_question.questions_json[i], position, rotation, scale);
                            break;
                        case "model":
                            this.addGLTFModelToScene(next_question.questions_json[i], position, rotation, scale );
                            break;
                    }
                }
            }
            

            if ( next_question.options_json && Array.isArray( next_question.options_json ) ){

                for(let i=0; i<next_question.options_json.length; i++){
                    let position = new THREE.Vector3().fromArray(next_question.options_json[i].transform[0].split(",").map(function(x){return Number(x)}) );
                    let rotation = new THREE.Vector3().fromArray(next_question.options_json[i].transform[1].split(",").map(function(x){return Number(x)}) );
                    let scale    = new THREE.Vector3().fromArray(next_question.options_json[i].transform[2].split(",").map(function(x){return Number(x)}) );
                    let sub_type = next_question.options_json[i].sub_type;
                    let Entity;

                    let pOption;

                    switch(sub_type){
                        case "txt":
                            pOption = this.addTextToScene(next_question.options_json[i], position, rotation, scale);
                            break;
                        case "gif":
                        case "jpg":
                        case "jpeg":
                        case "png":
                            pOption = this.addTextureToScene(next_question.options_json[i], position, rotation, scale);
                            break;
                        case "button":
                            next_question.options_json[i].res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
                            pOption = this.addTextureToScene(next_question.options_json[i], position, rotation, scale);
                            break;
                    }
                    if (sub_type != "button" && (next_question.option_type == "MutiOption_Text"|| next_question.option_type == "MutiOption_Image")){

                        if ( isPromise( pOption ) == false ){
                            continue;
                        }

                        pOption.then( function( ret ){

                            Entity = ret;

                            if(next_question.option_type == "MutiOption_Text"){

                                let circlePos = new THREE.Vector3(0,0,0);
                                let circleRot = new THREE.Vector3(0,0,0);
                                let circleScale = new THREE.Vector3(1,1,1);

                                let base = document.createElement("a-plane");
                                base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                base.setAttribute("id","circle_base");
                                base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                                // self.setTransform(base, circlePos, circleRot, circleScale);
                                Entity.appendChild(base);

                                let circle = document.createElement("a-plane");
                                circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                                circle.setAttribute("id","circle_out");
                                circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                                // self.setTransform(circle, circlePos, circleRot, circleScale);
                                Entity.appendChild(circle);
                                
                                let circle2 = document.createElement("a-plane");
                                circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                circle2.setAttribute("id","circle_in");
                                circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                                circle2.setAttribute( "visible", false);
                                // circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                                // self.setTransform(circle2, circlePos, circleRot, circleScale);
                                Entity.appendChild(circle2);

                                let f_setRenderOrder = function( evt ){
                                    if (evt.target == evt.currentTarget){
                                        if ( evt.target.object3D ){
                                            if ( evt.target.object3D.children[0] ){
                                                evt.target.object3D.children[0].renderOrder = 1;
                                            }
                                        }
                                    }
                                }
                                base.addEventListener("loaded", f_setRenderOrder );
                                circle.addEventListener("loaded", f_setRenderOrder );
                                circle2.addEventListener("loaded", f_setRenderOrder );

                                /////////

                                // console.log(" *** geometry-set: " , Entity.object3D , Entity.getObject3D("mesh").geometry.attributes.position.array[0] );
                                // console.log('Quiz.js: _load: scale ', Entity.object3D.parent.scale , Entity.object3D  );

                                let width = Math.abs(Entity.getObject3D("mesh").geometry.attributes.position.array[0])*2;
                                circlePos.x = circlePos.x + width*0.5 + 0.3/Entity.object3D.parent.el.getAttribute("scale").x;
                                circlePos.z = circlePos.z - 0.01;
                                base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                                circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                                circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );

                                circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                                circleScale.divide(Entity.object3D.parent.el.getAttribute("scale"))

                                base.setAttribute("scale" , circleScale );
                                circle.setAttribute("scale" , circleScale );
                                circle2.setAttribute("scale" , circleScale.clone().multiply( new THREE.Vector3( 0.7,0.7,0.7 ) ) );

                                /////////

                                // Entity.addEventListener("geometry-set", function(evt){
                                // 	console.log(" *** geometry-set: " , Entity.object3D , Entity.getObject3D("mesh").geometry.attributes.position.array[0] );
                                // 	let width = Math.abs(Entity.getObject3D("mesh").geometry.attributes.position.array[0])*2;
                                // 	circlePos.x = circlePos.x + width*0.5 + 0.3/Entity.object3D.parent.el.getAttribute("scale").x;
                                // 	circlePos.z = circlePos.z - 0.01;
                                // 	base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                                // 	circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                                // 	circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
                                // });
    
                                // Entity.addEventListener("loaded", function(evt){
                                // 	Entity.object3D.parent.el.addEventListener("loaded", function(evt){
                                // 		circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                                // 		circleScale.divide(Entity.object3D.parent.el.getAttribute("scale"))
    
                                // 		base.setAttribute("scale" , circleScale );
                                // 		circle.setAttribute("scale" , circleScale );
                                // 		circle2.setAttribute("scale" , circleScale.clone().multiply( new THREE.Vector3( 0.7,0.7,0.7 ) ) );
                                // 	});
                                // });
                                

                                
                            }
                            else{


                                ////////

                                let circlePos = new THREE.Vector3(0,0,0);
                                let circleRot = new THREE.Vector3(0,0,0);
                                let circleScale = new THREE.Vector3(1,1,1);

                                let timeoutID = setInterval( function () {

                                    //[start-20230923-howardhsu-add]//    
                                    //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                                    if (self.module.currentIndex >= self.module.json.display_order_list.length){
                                        window.clearInterval(self.module.timer.currentTimer)
                                    }                             
                                    //[end-20230923-howardhsu-add]//

                                    if (Entity.getAttribute("heightForQuiz")){ 
                                        let height = Entity.getAttribute("heightForQuiz");
                                        // console.log("20200831",height)
                                        // circlePos.x = circlePos.x + (width/2 + 0.1);
                                        // circlePos.y = circlePos.y - height/2 - 0.2;
                                        circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                                        circleScale.divide(Entity.getAttribute("scale"))
                                        circlePos.y = circlePos.y - height/2 - 0.3/Entity.getAttribute("scale").y;

                                        let base = document.createElement("a-plane");
                                        base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                        base.setAttribute("id","circle_base");
                                        base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                                        self.setTransform(base, circlePos, circleRot, circleScale);
                                        Entity.appendChild(base);
            
                                        let circle = document.createElement("a-plane");
                                        circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                                        circle.setAttribute("id","circle_out");
                                        circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                                        self.setTransform(circle, circlePos, circleRot, circleScale);
                                        Entity.appendChild(circle);
                                        
                                        let circle2 = document.createElement("a-plane");
                                        circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                        circle2.setAttribute("id","circle_in");
                                        circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                                        circle2.setAttribute( "visible", false);
                                        circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                                        self.setTransform(circle2, circlePos, circleRot, circleScale);
                                        Entity.appendChild(circle2);

                                        let f_setRenderOrder = function( evt ){
                                            if (evt.target == evt.currentTarget){
                                                if ( evt.target.object3D ){
                                                    if ( evt.target.object3D.children[0] ){
                                                        evt.target.object3D.children[0].renderOrder = 1;
                                                    }
                                                }
                                            }
                                        }
                                        base.addEventListener("loaded", f_setRenderOrder );
                                        circle.addEventListener("loaded", f_setRenderOrder );
                                        circle2.addEventListener("loaded", f_setRenderOrder );
        
                                        window.clearInterval(timeoutID);
                                    }
                                }, 1);

                                ////////

                                // Entity.addEventListener("loaded", function(evt){
                                // 	let circlePos = new THREE.Vector3(0,0,0);
                                // 	let circleRot = new THREE.Vector3(0,0,0);
                                // 	let circleScale = new THREE.Vector3(1,1,1);

                                // 	let timeoutID = setInterval( function () {
                                // 		if (Entity.getAttribute("heightForQuiz")){ 
                                // 			let height = Entity.getAttribute("heightForQuiz");
                                // 			// console.log("20200831",height)
                                // 			// circlePos.x = circlePos.x + (width/2 + 0.1);
                                // 			// circlePos.y = circlePos.y - height/2 - 0.2;
                                // 			circleScale.multiply( new THREE.Vector3( 0.4, 0.4, 0.4 ) );
                                // 			circleScale.divide(Entity.getAttribute("scale"))
                                // 			circlePos.y = circlePos.y - height/2 - 0.3/Entity.getAttribute("scale").y;

                                // 			let base = document.createElement("a-plane");
                                // 			base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                // 			base.setAttribute("id","circle_base");
                                // 			base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#3C3C3C; depthWrite:false" );
                                // 			self.setTransform(base, circlePos, circleRot, circleScale);
                                // 			Entity.appendChild(base);
                
                                // 			let circle = document.createElement("a-plane");
                                // 			circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
                                // 			circle.setAttribute("id","circle_out");
                                // 			circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
                                // 			self.setTransform(circle, circlePos, circleRot, circleScale);
                                // 			Entity.appendChild(circle);
                                            
                                // 			let circle2 = document.createElement("a-plane");
                                // 			circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
                                // 			circle2.setAttribute("id","circle_in");
                                // 			circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
                                // 			circle2.setAttribute( "visible", false);
                                // 			circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
                                // 			self.setTransform(circle2, circlePos, circleRot, circleScale);
                                // 			Entity.appendChild(circle2);
            
                                // 			window.clearInterval(timeoutID);
                                // 		}
                                // 	}, 1);
                                    
                                // });

                            }

                        });
                    }
                }

            }
            

            let timerContent = document.getElementById('timerContent');

            if(self.module.json.timer_type == "Custom"){
                if (self.module.timer.counter >= 0){
                    let hour = Math.floor(self.module.timer.counter/3600);
                    let min = Math.floor((self.module.timer.counter-hour*3600)/60);
                    let sec = self.module.timer.counter-hour*3600-min*60;
                    timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
                }
            }

            setTimeout(function(){                
                //// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
    
                if (self.module.timer.counter >= 0){
                    self.module.qClock = Date.now();
                    
                    window.clearInterval(self.module.timer.currentTimer)
                    
                    let timeoutID = setInterval(function() {
                        
                        self.module.timer.currentTimer = timeoutID;
                        self.module.timer.counter -= 1;

                        //[start-20230923-howardhsu-add]//
                        //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                        if (self.module.currentIndex >= self.module.json.display_order_list.length){
                            window.clearInterval(self.module.timer.currentTimer)
                        }
                        //[end-20230923-howardhsu-add]//

                        let hour = Math.floor(self.module.timer.counter/3600);
                        let min = Math.floor((self.module.timer.counter-hour*3600)/60);
                        let sec = self.module.timer.counter-hour*3600-min*60;
                        timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
                        // console.log("Quiz.js: _nextQuestion: this.module.timer.counter=", self.module.timer.counter);
                        if (self.module.timer.counter <= 0){
                            window.clearInterval(self.module.timer.currentTimer);
                            if (self.module.json.timer_type == "Custom"){
                                if (next_question.show_score){
                                    let scoreDiv = document.getElementById("scoreDiv");
                                    let score = document.getElementById("score");
                                    scoreDiv.style.display = "block";
                                    score.textContent = self.module.score;
                                    
                                }
                                else{
                                    self.nextQuestion();
                                }
                            }
                            else{
                                let temp = []
                                let quizEntity = self.module.quizEntity;
                                for (let item of quizEntity.children) {
                                    temp.push(item);
                                }
                                temp.forEach( (item) => {self.clearObject(item)} );
                                
                                let tipButtonDiv = document.getElementById("tipButtonDiv");
                                let tipDiv = document.getElementById("tipDiv");
                                tipButtonDiv.style.display = "none";
                                tipDiv.style.display = "none";
                                
                                let startQuiz = document.getElementById("startQuiz");
                                let QuizStartButton = document.getElementById("QuizStartButton");
                                let QuizStartContent = document.getElementById("QuizStartContent");
                                QuizStartContent.textContent = "時間到"

                                //[start-2023mmdd-howardhsu-modify]//
                                if(self.module.timer.counter == 0){
                                    startQuiz.style.display = "block";
                                }
                                //[end-2023mmdd-howardhsu-modify]//

                                let quizIndex = {
                                    question: idx ,
                                    get_score:  0,
                                    answer_time: self.module.json.question_list[idx].time_limit ,
                                    answer_options: [],
                                    answer_cloze: "",
                                    answer_is_enable: false,
                                    answer_is: false,
                                }
                                self.module.record[idx] = quizIndex;
                                self.module.record_time += self.module.json.question_list[idx].time_limit;
                                self.module.qClock = Date.now();

                                QuizStartButton.addEventListener("click",function(){
                                    startQuiz.style.display = "none";
                                    // self.nextQuestion();													
                                    //[start-20230712-howardhsu-add]//
                                    //// 存檔: 沒有下一題，預定紀錄答題狀態上雲端 (就是底下else的全部)
                                    self.saveQuizStatus();
                                    //[end-20230712-howardhsu-add]//
                                });
                            }
                        }
                    },1000);
                }
                
                //// -------------------------------------------------------------- ////
                // cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.04; radiusInner: 0.02; thetaLength: 360; thetaStart: 0;" );
            }, 3000);
        }else{
            //// 沒有下一題，把『觸控』開回來
            // vrController.cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );

            //// 沒有下一題，預定紀錄答題狀態上雲端            
            window.clearInterval(self.module.timer.currentTimer);
            let timer = document.getElementById("timerDiv");
            timer.style.display = "none";
            let tipButtonDiv = document.getElementById("tipButtonDiv");
            let tipDiv = document.getElementById("tipDiv");
            tipButtonDiv.style.display = "none";
            tipDiv.style.display = "none";

            let quizEndDiv = document.getElementById("quizEndDiv");
            quizEndDiv.style.display = "block";
            quizEndDiv.addEventListener("click", function(){
                quizEndDiv.style.display = "none";
            });

            let projectIdx = self.getProjectIdx()
            // console.log("Quiz.js: this.module: ", self.module , projectIdx,  publishVRProjs.result[projectIdx] );
            console.log("Quiz.js: quiz end , this.module.record = " , self.module.record  );
            let playing_user = "", device_id = "";
            if (localStorage.getItem("login_shared_id") ){
                playing_user = localStorage.getItem("login_shared_id");
            }
            if (localStorage.getItem("device_id")){
                device_id = localStorage.getItem("device_id");
            }
            //quiz_log
            let quizVRLogData  = {
                user_id: publishVRProjs.result[projectIdx].user_id ,
                playing_user: playing_user , //// 在還沒有登入流程時候 一定要設為空字串
                proj_id: publishVRProjs.result[projectIdx].proj_id ,
                proj_type: "vr" ,
                device_id: device_id ,
                brand:"",
                os: navigator.userAgent , 
                location_long:0.0,
                location_lan:0.0,
                module:[ self.module.json ],
                record_time: self.module.record_time,
                record_score: self.module.score ,
                record:self.module.record,

            }

            //// 目前存放分為 『log資訊』給『數據分析』 跟 『專案遊玩資訊』給『viewer 查詢』 
            quizLog( window.serverUrl , quizVRLogData);
            
            for (let i = 0, len = userPublishProjs.proj_list.length; i < len; i++){
                if (userPublishProjs.proj_list[i].proj_id == publishVRProjs.result[projectIdx].proj_id ){
                    // quizVRRecord = userPublishProjs.proj_list[i];
                    // quizVRRecord.playing_user_id = playing_user;
                    let quizVRRecord = {
                        head_pic: userPublishProjs.proj_list[i].head_pic,
                        loc: userPublishProjs.proj_list[i].loc,
                        module_type: userPublishProjs.proj_list[i].module_type,
                        name: userPublishProjs.proj_list[i].name,
                        playing_user_id: playing_user,
                        proj_cover_urls: userPublishProjs.proj_list[i].proj_cover_urls,
                        proj_id: userPublishProjs.proj_list[i].proj_id,
                        proj_name: userPublishProjs.proj_list[i].proj_name,
                        proj_type: "vr",
                        shared_id: userPublishProjs.proj_list[i].shared_id,
                        snapshot_url: userPublishProjs.proj_list[i].snapshot_url,
                        user_id: userPublishProjs.proj_list[i].user_id,
                    }
                    updateRecordModule(window.serverUrl , quizVRRecord );
                    console.log("Quiz.js: quiz end, " , i , userPublishProjs.proj_list[i] , quizVRRecord );
                }
            }
            
            console.log("Quiz.js: quiz end , quizVRLogData = " , quizVRLogData );
            
        }
    }



    //[start-20230712-howardhsu-add]//
    saveQuizStatus(){				
        //// 沒有下一題，把『觸控』開回來
        // vrController.cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );

        //// 沒有下一題，預定紀錄答題狀態上雲端        
        console.log("find timer 1400", this.module.timer)

        window.clearInterval(this.module.timer.currentTimer);
        let timer = document.getElementById("timerDiv");
        timer.style.display = "none";
        let tipButtonDiv = document.getElementById("tipButtonDiv");
        let tipDiv = document.getElementById("tipDiv");
        tipButtonDiv.style.display = "none";
        tipDiv.style.display = "none";

        let quizEndDiv = document.getElementById("quizEndDiv");
        quizEndDiv.style.display = "block";
        quizEndDiv.addEventListener("click", function(){
            quizEndDiv.style.display = "none";
        });

        const projectIdx = this.getProjectIdx()
        // console.log("VRFunc.js: this.module: ", this.module , projectIdx,  publishVRProjs.result[projectIdx] );
        console.log("VRFunc.js: quiz end , this.module.record = " , this.module.record  );
        let playing_user = "", device_id = "";
        if (localStorage.getItem("login_shared_id") ){
            playing_user = localStorage.getItem("login_shared_id");
        }
        if (localStorage.getItem("device_id")){
            device_id = localStorage.getItem("device_id");
        }
        //quiz_log
        let quizVRLogData  = {
            user_id: publishVRProjs.result[projectIdx].user_id ,
            playing_user: playing_user , //// 在還沒有登入流程時候 一定要設為空字串
            proj_id: publishVRProjs.result[projectIdx].proj_id ,
            proj_type: "vr" ,
            device_id: device_id ,
            brand:"",
            os: navigator.userAgent , 
            location_long:0.0,
            location_lan:0.0,
            module:[ this.module.json ],
            record_time: this.module.record_time,
            record_score: this.module.score ,
            record:this.module.record,

        }

        //// 目前存放分為 『log資訊』給『數據分析』 跟 『專案遊玩資訊』給『viewer 查詢』 
        quizLog( window.serverUrl , quizVRLogData);
        
        for (let i = 0, len = userPublishProjs.proj_list.length; i < len; i++){
            if (userPublishProjs.proj_list[i].proj_id == publishVRProjs.result[projectIdx].proj_id ){
                // quizVRRecord = userPublishProjs.proj_list[i];
                // quizVRRecord.playing_user_id = playing_user;
                let quizVRRecord = {
                    head_pic: userPublishProjs.proj_list[i].head_pic,
                    loc: userPublishProjs.proj_list[i].loc,
                    module_type: userPublishProjs.proj_list[i].module_type,
                    name: userPublishProjs.proj_list[i].name,
                    playing_user_id: playing_user,
                    proj_cover_urls: userPublishProjs.proj_list[i].proj_cover_urls,
                    proj_id: userPublishProjs.proj_list[i].proj_id,
                    proj_name: userPublishProjs.proj_list[i].proj_name,
                    proj_type: "vr",
                    shared_id: userPublishProjs.proj_list[i].shared_id,
                    snapshot_url: userPublishProjs.proj_list[i].snapshot_url,
                    user_id: userPublishProjs.proj_list[i].user_id,
                }
                updateRecordModule(window.serverUrl , quizVRRecord );
                console.log("VRFunc.js: quiz end, " , i , userPublishProjs.proj_list[i] , quizVRRecord );
            }
        }

        console.log("VRFunc.js: quiz end , quizVRLogData = " , quizVRLogData );	
    }
    //[end-20230712-howardhsu-add]//    

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Quiz);


/***/ }),

/***/ "./js/VRMain/version3_4/VRFunc.js":
/*!****************************************!*\
  !*** ./js/VRMain/version3_4/VRFunc.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Quiz_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Quiz.js */ "./js/VRMain/version3_4/Quiz.js");


////// developVR 20191021 
(function() {
	
	var integrate = function(){
		console.log("window.Module", window.Module)

		AFRAME.registerComponent('initvrscene', {
			init: function () {
				var sceneEl = this.el;
			}
		});
	
		AFRAME.registerComponent('cursor-listener', {
			init: function () {
				//20191023-start-thonsha-mod

				// this.el.addEventListener( 'touchend', endEvent, false );
				// this.el.addEventListener( 'mouseup', endEvent, false );
				// this.el.addEventListener( 'click', clickEvent, false );
				// this.el.addEventListener( 'fusing', fusingEvent, false );

				function fusingEvent(event){
					event.preventDefault();
					// console.log('I was fusing, this.object3D = ', this.object3D , event );
					if (event.target == event.currentTarget){
						// console.log('I was fusing, this.object3D = ', this.object3D , event );.
						if (this.object3D.behav){
							delay = this.object3D.behav[0].display*1000+5;
							// console.log("======= delay :"+delay+" =====");
							let cursor = document.getElementById("cursor_main");
							cursor.setAttribute('cursor', "fuseTimeout:"+ delay);
							cursor.setAttribute('animation__mouseenter', "dur: "+delay );
						}

						if (this.object3D.main_type == "button"){
							delay = 3*1000+5;
							// console.log("======= delay :"+delay+" =====");
							let cursor = document.getElementById("cursor_main");
							cursor.setAttribute('cursor', "fuseTimeout:"+ delay);
							cursor.setAttribute('animation__mouseenter', "dur: "+delay );
						}

					}
					

				}	

				function clickEvent( event ) {
					event.preventDefault();
					console.log('I was clicked, this.object3D = ', this.object3D , event );
					if (event.target == event.currentTarget){
						// console.log('I was clicked, this.object3D = ', this.object3D , event );
						
						if ( this.object3D.behav ){

							if (!vrController.triggerEnable){
								console.log("VRFunc.js: _clickEvent: please wait three second for _triggerEanble");
								return;
							}

							//// deal the group	
							//// 找出此次觸發事件中含有 group 的部份
							for (let i = 0; i < this.object3D.tWorldVisiblebehav.length; i++ ){
								if (this.object3D.behav[i].group){
									//// 找出所有場上物件中，掛有觸發事件的物件
									for ( let j = 0; j < vrController.makarObjects.length; j++ ){
										let makarObject = vrController.makarObjects[j];
										if (makarObject.object3D){
											if (makarObject.object3D.makarObject && makarObject.object3D.behav ){

												for (let k = 0; k < makarObject.object3D.behav.length; k++ ){
													//// 找出除了自己以外掛有相同 group 的物件
													if (makarObject.object3D.behav[k].group == this.object3D.behav[i].group &&  makarObject.object3D != this.object3D ){
														// console.log(" ************* " , i , j , k , makarObject.object3D.behav[k] , this.object3D.behav[i].group );
														let groupObj = document.getElementById(makarObject.object3D.behav[k].obj_id);
														vrController.hideGroupObjectEvent(groupObj);
													}
												}

											}
										}
									}
								}
							}




							let reset = false;
							for(let i=0;i<this.object3D.behav.length;i++){
								if (this.object3D.behav[i].simple_behav == "CloseAndResetChildren"){
									reset = true;
								}
							}

							for(let i=0;i<this.object3D.behav.length;i++){
								if (this.object3D.behav[i].simple_behav != "CloseAndResetChildren"){
									
									//[start-20230919-howardhsu-modify]//
									if(touchObject.behav[i].simple_behav == "ShowQuiz"){
											
										//// 顯示 quiz 之前，先判斷 "瀏覽器本次載入場景後" 是否已經遊玩
										if(touchObject.behav[i].played == false){
											touchObject.behav[i].played = true	
											vrController.triggerEvent( touchObject.behav[i], reset, touchObject )
										} else {
											console.log('VRFunc.js: _setupFunction: endEvent:  Quiz had been played.', touchObject.behav[i].played)
										}

									} else {
										vrController.triggerEvent( touchObject.behav[i], reset, self.GLRenderer, null, touchObject );
									}
									
								}
							}
							
						}
						// if (this.object3D.main_type == "button"){
						// 	console.log("VRFunc.js: button click " , this.object3D );
						// 	vrController.pushButton(this);
						// }
						//[end-20230920-howardhsu-modify]//	
					}
				}
				
				//20191023-end-thonsha-mod

			}
		});
	
		var VRController = function(){
			//// scene 2D part
			this.GLRenderer = null;
			this.scene2D = null;
			this.camera2D = null;
			this.light = null;
	
			//// MAKAR part
			this.vrScene = null;
			this.publishVRProjs = null;
			this.VRSceneResult = null;
			this.makarVRscenes = {};

			this.makarObjects = [];

			///// 此陣列只會在「每次載入場景完成之後作修改」，目前為了讓「點擊移動功能」可以在 滑鼠移動時候作判斷使用
			this.currentSceneMakarObjects = [];

//20200528-thonsha-add-start
			this.loadSceneCount = 0
			this.module = null;
			this.cursorEntity = null;
//20200528-thonsha-add-end
//20200807-thonsha-add-start
			this.projectIdx = null;
//20200807-thonsha-add-end

//20220105-thonsha-add-start
			this.intervalList = [];
//20220105-thonsha-add-end

			//// for update
			this.FUNCTION_ENABLED = false;
			this.clock = new THREE.Clock();
			this.delta = this.time = 0;

			//// 沒有特別的用意，主要是為了讓每次 create <video> 的 id 不相同
			this.triggerEnable = false;

			//// 紀錄『滑鼠』『觸碰』狀態
			this.touchMouseState = -1;


			//// 紀錄「觸發事件」中帶有「群組」的事件
			this.groupDict = {
				0: {activeObj:null,objs:[]},
				1: {activeObj:null,objs:[]},
				2: {activeObj:null,objs:[]},
				3: {activeObj:null,objs:[]},
				4: {activeObj:null,objs:[]},
				5: {activeObj:null,objs:[]},
				6: {activeObj:null,objs:[]},
				7: {activeObj:null,objs:[]},
			};

			//// 紀錄「注視事件」
			this.lookAtObjectList = [];
			this.lookAtTimelineDict = {};


		}

		function UrlExists(url , callback ){
			let httpRequest = new XMLHttpRequest();
			httpRequest.open('HEAD', url, true);
			httpRequest.onload = function(e){
				console.log(" VRFunc.js: _UrlExists: httpRequest status= " , httpRequest.status  );
				callback( httpRequest.status == "200" );
			}
			
			httpRequest.onerror = function(e){
				console.log( 'onerror e=', e );
				callback( httpRequest.status == "200" );

			}
			httpRequest.onabort = function(e){
				console.log( 'onabort e=', e );
				callback( httpRequest.status == "200" );
			}
			httpRequest.send();
		}

		function isPromise(p) {
			if (typeof p === 'object' && typeof p.then === 'function') {
			  return true;
			}
			return false;
		}
		
		VRController.prototype.UrlExistsFetch = async function( url ){

			let ret = await fetch(url, {method: 'HEAD'})

			console.log('_VRController: _UrlExists2: ret ', ret );
			if ( ret.status ){
				return ret.status == '200';
			}else{
				return false ;
			}


		};
	
		VRController.prototype.setupFunction = function(){
			if (this.FUNCTION_ENABLED) {
				return;
			}
			// console.log("VRFunc.js: VRController: setupFunction");
			this.FUNCTION_ENABLED = true;
			var self = this;
	
			this.loadAssets = function(index){
				let assets = document.createElement("a-assets");
				assets.setAttribute('id', "makarAssets" );
				assets.setAttribute('timeout', "1000" );
				assets.setAttribute('crossorigin', 'anonymous');
				self.vrScene.appendChild(assets);
				// self.makarObjects.push( assets );
			};
			//////
			////// load the nth scene in specific prroject
			////// At first, will called for load the first scene. 
			this.loadScene = function(projIndex, sceneIndex) {
				// console.log("VRFunc.js: VRController: _loadScene: [projectIndex, sceneIndex]=", projIndex, sceneIndex);
				//// 載入場景的時候，先顯示處『載入頁面』直到圖片或是影片 onload 再隱藏『載入頁面』，**** 目前不使用此功能 **** 

				if (self.VRSceneResult[projIndex].scenes[sceneIndex] == undefined ){
					console.log("VRFunc.js: VRController: _loadScene: error, [valid sceneIndex]=", self.VRSceneResult[projIndex].scenes.length, sceneIndex);
				}else{

					//// 紀錄 場景 編號
					this.sceneIndex = sceneIndex;

					//// 換場景時無條件先清除所有影片
					let videos = document.getElementsByTagName('video');
					if ( videos.length > 0 ){
						for (let i = 0; i < videos.length; i++ ){
							videos[i].pause();
							videos[i].removeAttribute("src"); // empty source 	
							videos[i].load();
						}
					}

					//// 換場景時無條件先清除所有聲音
					let audios = document.getElementsByTagName('audio');
					if ( audios.length > 0 ){
						for (let i = 0; i < audios.length; i++ ){
							audios[i].pause();
							audios[i].removeAttribute("src"); // empty source 	
							audios[i].load();
						}
					}

					if (self.makarObjects){ //// clean the additional object( without default object like, camera, cursor,  )
						for (let i = 0; i < self.makarObjects.length; i++ ){
							let makarObject = self.makarObjects[i];
							// makarObject.parentNode.removeChild( makarObject ); // this will remove the children, childNodes and object3D's children

							if ( makarObject.object3D ){
								makarObject.object3D.traverse( c =>{
									if ( c.isMesh ){
										
										if ( c.material ){
											if ( c.material.map ){
												if ( c.material.map.dispose ){
													c.material.map.dispose();													
												}
											}
											c.material.dispose();
										}

										if ( c.geometry ){
											c.geometry.dispose();
										}

									}
								});
							}

							makarObject.remove();

						}
						self.makarObjects.length = 0; // clean the array.
					}

					//// 清除「當前場景有的物件」
					if ( Array.isArray( self.currentSceneMakarObjects ) ){
						self.currentSceneMakarObjects.length = 0;
					}

					//// 假如曾經載入過環景圖片，清除
					if ( self.cubeTex ){
						if ( self.cubeTex.texture ){
							self.cubeTex.texture.dispose();
						}
						self.cubeTex.dispose();
					}

					self.needsRenderTarget = false;

					//// 判定「版本」
					var editor_version = [];
					if (typeof(self.VRSceneResult[projIndex].editor_ver) != "string" ){
						console.log("VRFunc.js: _loadSceneObjects: the editor_ver is not string, error and return ");
						return -1;
					}else{
						editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
					}

					//// 紀錄「當前使用的版本」
					self.editor_version = editor_version;

					//// 依照版本來確認「 sky 」
					let scene_skybox_url;
					let sceneSky_info = self.editorVerionControllSky( editor_version , projIndex, sceneIndex );
					if ( sceneSky_info.scene_skybox_main_type == 'spherical_video' ){
						scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg";
					}else if ( sceneSky_info.scene_skybox_main_type == 'spherical_image' ){
						if ( sceneSky_info.scene_skybox_url == "DefaultResource/Spherical_Image/SphericalImage.png"  ){
							scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
						} else {
							scene_skybox_url = sceneSky_info.scene_skybox_url;
						}
					}else {
						scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
					}

					//// 檢查 「 sky 」是否存在，否的話使用「預設灰圖」作為 環景環境圖。往下載入「場景物件」
					UrlExists( scene_skybox_url, function( retStatus ){
						if (retStatus == false){
							scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/spherical_image/defaultGray2.jpg";
						}
	
						let targetCube;
						if ( THREE.WebGLRenderTargetCube ){
							targetCube = new THREE.WebGLRenderTargetCube(1024, 1024);
						}else{
							targetCube = new THREE.WebGLCubeRenderTarget( 1024 );
						}

						// let mPmremGenerator = new THREE.PMREMGenerator( self.vrScene.renderer );
						// mPmremGenerator.compileEquirectangularShader();
						


						let renderer = self.vrScene.renderer;
						// renderer.toneMapping = THREE.ACESFilmicToneMapping;
						if ( THREE.GammaEncoding ){
							renderer.outputEncoding = THREE.GammaEncoding;
							// renderer.outputEncoding = THREE.sRGBEncoding;
							renderer.gammaFactor = 1;
						}

						
						// renderer.outputEncoding = THREE.sRGBEncoding;
	
						//// 從「 場景資料 」來查看是否有「 behav / behav_rederence 」設置錯誤，有的話把 behav_rederence 修改
						self.checkVRSceneResultBehav();

						//// 每次載入場景，先清除「事件相關」的資料。包含「事件群組」「注視事件」
						self.clearBehavs();


						let envTexture = new THREE.TextureLoader().load(
							scene_skybox_url,
							function() 
							{
								let cubeTex = targetCube.fromEquirectangularTexture(renderer, envTexture);
								self.cubeTex = cubeTex;

								self.loadSceneCount++;
								self.loadAssets(); //// for video elements
								let pAll = self.loadSceneObjects(projIndex, sceneIndex);
								let pSky = self.loadSky(projIndex, sceneIndex, sceneSky_info);

								pSky.then( function( ret ){
									console.log('VRFunc.js: _loadScene: pSky then ret = ', ret );
									
								});

								//// 假如此專案的當前場景有「邏輯功能」，加入「處理列表」
								if (publishVRProjs.result[projIndex].xml_urls && publishVRProjs.result[projIndex].xml_urls[ sceneIndex ] ){
									//// 下載對應的「邏輯腳本」
									let pXML = self.parseLogicXML(projIndex , sceneIndex );
									pAll.push( pXML );

								}

								Promise.all( pAll.concat( pSky ) ).then( function( ret ){

									console.log('VRFunc.js: _loadScene: pAll then ret = ', ret );

									//20221206-thonsha-add-start
									self.onlySkyScene.add(document.getElementById("sky").object3D.clone(true))
									//20221206-thonsha-add-end

									// self.vrScene.renderer.shadowMap.needsUpdate = true;

									loadPage.style.display = "none";
									homePage.style.display = "none";
									
									//// 同時關閉「起始載入畫面動畫」 和 「切換場景載入中動畫」
									if ( homeTickOn ){
										homeTickOn = false;
									}

									if ( typeof( self.loadingTickOn )  != undefined ){
										self.loadingTickOn = false;
									}

									self.triggerEnable = true;

									//// 假如此專案當前場景有「邏輯」，解析並且執行功能
									if (publishVRProjs.result[projIndex].xml_urls && publishVRProjs.result[projIndex].xml_urls[ sceneIndex ] &&
										self.logic.xmlDoc != null 
									){
										self.logic.parseXML();
									}
								
									//// 載入場景完成後，解析一下場景的「事件 / behav」跟「事件參照 behav_reference 」是否有錯誤。
									self.setupSceneBehav();

									//// 載入場景完成，解析物件所佔範圍
									setTimeout( function(){
										self.calcSceneArea();
									}, 1 )

									
									//// 載入場景完成後，判斷當前 UI 是否顯示，顯示的話執行隱藏
									if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
										typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
									){
										if ( parent.projectUIController.status == -1 ){
											parent.projectUIController.showUI();
										}
									}

								});


							}
						);
					});
					
				}
			}




			//// 依照不同編輯器版本，控制「天空物件」
			this.editorVerionControllSky = function (editor_version , projIndex , sceneIndex ){
				let sceneSky_info = {
					scene_skybox_url:'',
					scene_skybox_main_type: '',
				};

				console.log("VRFunc.js: _editorVerionControllSky: " ,editor_version, VRSceneResult[projIndex].scenes[sceneIndex]  );

				//// 一定要含有大中小三個版號
				if (editor_version.length == 3) {
					//// 大中小版號
					let v0 = editor_version[0], v1 = editor_version[1], v2 = editor_version[2];
					switch(v0){
						case "3":
							///// 只要是 3.3.2 以下 的版本
							if ( ( v1 < 3  ) ){

								sceneSky_info.scene_skybox_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_url;
								sceneSky_info.scene_skybox_main_type = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_main_type;
								sceneSky_info.scene_snapshot_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_snapshot_url;

								console.log("VRFunc.js: _editorVerionControllSky: below 3.3.2 " , VRSceneResult[projIndex].scenes[sceneIndex] );

							} else if ( v1 >= 3 && v2 >= 2 ){
								sceneSky_info.scene_skybox_url = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_skybox_url;
								sceneSky_info.scene_skybox_main_type = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_skybox_main_type;
								sceneSky_info.scene_snapshot_url = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_snapshot_url;
								console.log("VRFunc.js: _editorVerionControllSky: after 3.3.2 " , VRSceneResult[projIndex].scenes[sceneIndex] );
							}else if ( v1 >= 4 ){
								sceneSky_info.scene_skybox_url = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_skybox_url;
								sceneSky_info.scene_skybox_main_type = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_skybox_main_type;
								sceneSky_info.scene_snapshot_url = VRSceneResult[projIndex].scenes[sceneIndex].environment.scene_snapshot_url;
								console.log("VRFunc.js: _editorVerionControllSky: after 3.4.0 " , VRSceneResult[projIndex].scenes[sceneIndex] );
							}else{
								console.log("VRFunc.js: _editorVerionControllSky: large version error " , VRSceneResult[projIndex].scenes[sceneIndex] );
							}
							break;
						case "2":
						case "1":
							console.log("VRFunc.js: _editorVerionControllSky: largeVersion below 3" , self.VRSceneResult[projIndex] );
							sceneSky_info.scene_skybox_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_url;
							sceneSky_info.scene_skybox_main_type = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_main_type;
							sceneSky_info.scene_snapshot_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_snapshot_url;
							break;

						default:
							console.log("VRFunc.js: _editorVerionControllSky: missing large version " , self.VRSceneResult[projIndex] );
					}

				} else {
					if ( self.VRSceneResult[projIndex].editor_ver == "" ){
						////// the empty editor_ver , do version below 3.0.6 
						if ( !Array.isArray(self.VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_url ) ){
							console.log("VRFunc.js: _editorVerionControllSky the scene_skybox_url is not exist, error", self.VRSceneResult[projIndex] );
							return -1;
						}
						console.log("VRFunc.js: _editorVerionControllSky: the editor version empty", self.VRSceneResult[projIndex] );
						sceneSky_info.scene_skybox_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_url;
						sceneSky_info.scene_skybox_main_type = VRSceneResult[projIndex].scenes[sceneIndex].scene_skybox_main_type;
						sceneSky_info.scene_snapshot_url = VRSceneResult[projIndex].scenes[sceneIndex].scene_snapshot_url;
					}
				}

				return sceneSky_info;
			}
			







			this.editorVersionControllObjs = function (editor_version , projIndex , sceneIndex ){
				let scene_objs;

				//// 一定要含有大中小三個版號
				if (editor_version.length == 3) {
					
					//// 大中小版號
					let v0 = editor_version[0], v1 = editor_version[1], v2 = editor_version[2];

					switch(v0){
						case "3":
							if ( v1 == 0 && v2 <= 6 ){
								if ( !Array.isArray(self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs ) ){
									console.log("VRFunc.js: _editorVerionControll the scenes[sceneIndex] is not Array, error", self.VRSceneResult[projIndex] );
									return -1;
								}
								console.log("VRFunc.js: _editorVerionControll: the editor version before 3.0.6", self.VRSceneResult[projIndex] );
								scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs;
							} else if ( v1 == 1 || ( v1 ==0 && v2 >= 7 ) ) {
								console.log("VRFunc.js: _editorVerionControll: the editor version after 3.0.7", self.VRSceneResult[projIndex] );
								scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
							} else if ( v1 == 2 || v1 >= 3  ){
								console.log("VRFunc.js: _editorVerionControll: the editor version is 3.2.n or 3.3.n", self.VRSceneResult[projIndex] );
								scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
								//// 此版本需要由 scenes 下調整相機參數 
								if (self.VRSceneResult[projIndex].scenes[sceneIndex].camera_rotation && self.VRSceneResult[projIndex].scenes[sceneIndex].fov){

									let rotation = new THREE.Vector3().fromArray(self.VRSceneResult[projIndex].scenes[sceneIndex].camera_rotation.split(",").map(function(x){return Number(x)}) );
									rotation.multiply( new THREE.Vector3(-1,-1,0) ).add( new THREE.Vector3(0, 180, 0) );
									
									let aCamera = document.getElementById( "aCamera" );
									let oCamera = document.getElementById( "oCamera" );
									
									// camera_cursor.setAttribute("rotation", rotation ); ////// it is work
									function lookContorlsLoaded(){
										
										console.log("VRFunc.js: _editorVerionControll: aCamera set fov = ", VRSceneResult[projIndex].scenes[sceneIndex].fov );
										let vrScene = document.getElementById("vrscene");
										vrScene.camera.fov = VRSceneResult[projIndex].scenes[sceneIndex].fov;

										//// 依照「外部選擇」來調整起始「觀看模式」


										aCamera.setAttribute('camera', { fov: VRSceneResult[projIndex].scenes[sceneIndex].fov } );
										oCamera.setAttribute('camera', { fov: VRSceneResult[projIndex].scenes[sceneIndex].fov } );
										
										if ( parent.selectedProject ){
											if ( parent.selectedProject.viewMode == 'XR' ){
												self.setViewMode( 'VR' );
											}else if (parent.selectedProject.viewMode == 'model'){
												
												self.setViewMode( 'model' );
											}else{
												self.setViewMode( 'VR' );
											}
										}else{
											self.setViewMode( 'VR' );
										}

										vrScene.camera.updateProjectionMatrix();

										console.log("VRFunc.js: _editorVerionControll: aCamera loaded rotation=", rotation );
										
										// aCamera.components["look-controls"].yawObject.rotation.set(0,0,0);
										// aCamera.components["look-controls"].pitchObject.rotation.set(0,0,0);

										aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
										aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;
										// aCamera.object3D.position.set(0,1.7,0);
										
										console.log("VRFunc.js: _loadSceneObjects aCamera: yawr=", aCamera.components["look-controls"].yawObject.rotation ,
																					   ", pitchr=" , aCamera.components["look-controls"].pitchObject.rotation  );
										
										aCamera.removeEventListener("look-controls-loaded", lookContorlsLoaded); // 假如重新載入場景，不能再執行一次
									}

									//// reset the aCamera 
									if ( aCamera ){
										if (aCamera.components["look-controls"].yawObject && aCamera.components["look-controls"].pitchObject){

											console.log("VRFunc.js: _editorVerionControll: aCamera look-controls already set" );
											lookContorlsLoaded({});
										}else{
											console.log("VRFunc.js: _editorVerionControll: aCamera look-controls not set yet" );
											aCamera.addEventListener("look-controls-loaded" , lookContorlsLoaded );
										}
									}
									
								}


							}else {
								console.error("VRFunc.js: _editorVerionControll: the editor version after 3.2 , error ", self.VRSceneResult[projIndex] );
								//// use version 3.0.6
								scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
							}

							break;
						case "2":
						case "1":
							console.log("VRFunc.js: _editorVerionControll: largeVersion below 3" , self.VRSceneResult[projIndex] );
							scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs;
							break;

						default:
							console.log("VRFunc.js: _editorVerionControll: missing large version " , self.VRSceneResult[projIndex] );
					}


 				}else{

					if ( self.VRSceneResult[projIndex].editor_ver == "" ){
						////// the empty editor_ver , do version below 3.0.6 
						if ( !Array.isArray(self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs ) ){
							console.log("VRFunc.js: _loadSceneObjects the scene_objs_v2 is not Array, error", self.VRSceneResult[projIndex] );
							return -1;
						}
						console.log("VRFunc.js: _loadSceneObjects: the editor version empty", self.VRSceneResult[projIndex] );
						scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs;
					}


				}
				  
				
				return scene_objs;
			}

	////// load the sky, 360 image/video
			this.loadSky = function( projIndex, sceneIndex, sceneSky_info ){
				// console.log("VRFunc.js: _loadSky: main type=", VRSceneResult[projIndex].scenes[0].scene_skybox_main_type, VRSceneResult[projIndex].scenes[0].scene_skybox_url);
				// scene_skybox_main_type: "spherical_video"


				// let editor_version = [];
				// if (typeof(self.VRSceneResult[projIndex].editor_ver) != "string" ){
				// 	console.log("VRFunc.js: _loadSky: the editor_ver is not string, error and return ");
				// 	return -1;
				// }else{
				// 	editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
				// }

				// let sceneSky_info = self.editorVerionControllSky( editor_version , projIndex, sceneIndex );

				let pSky = new Promise( function( skyResolve ){

					UrlExists( sceneSky_info.scene_skybox_url , function( retStatus ){
					
						let aSky;
						console.log(' ******  retStatus = ', retStatus, sceneSky_info.scene_skybox_url );
						if (retStatus == false){
							//// 因為有些舊的專案 sky url 會404，這邊改為先檢查 url status，假如不存在，則強迫設定為預設圖片（或是直接不載入）
	
							if (document.getElementById("sky")){
								aSky = document.getElementById("sky");
								if (aSky.localName == "a-sky"){
									//// 之前的 sky 是圖片，什麼都不用作
								}else if (aSky.localName == "a-videosphere"){
									//// 之前的 sky 是影片
									aSky.remove();
									aSky = document.createElement('a-sky');
									aSky.setAttribute('id', "sky" );
									self.vrScene.appendChild(aSky);
								}
							}else{
								aSky = document.createElement('a-sky');
								aSky.setAttribute('id', "sky" );
								self.vrScene.appendChild(aSky);
							}
							
							if( sceneSky_info.scene_skybox_url == "DefaultResource/Spherical_Image/SphericalImage.png"){
								
							} else{
	
								//// 跳出錯誤提示
								let errorText = document.createElement('div');
								errorText.style.position = 'absolute';
								errorText.style.top = '30%';
								errorText.style.left = '0%';
								errorText.style.width = '100%';
								errorText.style.height = '40%';
								errorText.style.color = 'black';
								errorText.style.backgroundColor = 'rgba(128,128,128,0.5)';
								errorText.style.pointerEvents = 'none';
								errorText.style.fontSize = '24px';
								errorText.style.zIndex = 3;
	
								document.body.appendChild( errorText )
	
								let text = document.createElement('div');
								text.className = 'centerText';
								text.style.whiteSpace = 'pre-wrap';
								text.textContent = '此專案的環景影片/圖片無法於瀏覽器支援，改為預設場景'
								errorText.appendChild( text );
	
								setTimeout(function(){
									errorText.remove();
								}, 8000);
	
							}

							//// 判斷是否「場景相同來源」，是的話直接隱藏「載入頁面」。否的話執行載入新圖片
							let skySameSrc = false;
							if (aSky.getAttribute('material') ){
								if (aSky.getAttribute('material').src == sceneSky_info.scene_skybox_url ){
									// console.log(' VRFunc.js: _loadSky same src '  );
									skySameSrc = true;
								}
							}

							if ( skySameSrc == true ){
								console.log("VRFunc.js: _loadSky: spherical_image same as previous(404)");

								
								skyResolve(aSky);
							} else {

								aSky.setAttribute("material", {src: "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png" });
	
								aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite
								
								var handleLoadingPage = function(){
									console.log("VRFunc.js: _loadSky: spherical_image materialtextureloaded, remove loading page ");
									
									//// 將自己移除事件，避免重複觸發事件
									aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );
								};
								aSky.addEventListener("materialtextureloaded" , handleLoadingPage );
								skyResolve(aSky);
							}

							
						} else {
							switch ( sceneSky_info.scene_skybox_main_type ){
								case "spherical_image":
								case "image":
	
									if (document.getElementById("sky")){
										aSky = document.getElementById("sky");
										if (aSky.localName == "a-sky"){
											//// 之前的 sky 是圖片，什麼都不用作
										}else if (aSky.localName == "a-videosphere"){
											//// 之前的 sky 是影片
											aSky.remove();
											aSky = document.createElement('a-sky');
											aSky.setAttribute('id', "sky" );
											self.vrScene.appendChild(aSky);
										}
									}else{
										aSky = document.createElement('a-sky');
										aSky.setAttribute('id', "sky" );
										self.vrScene.appendChild(aSky);
									}
									
		
									if( sceneSky_info.scene_skybox_url == "DefaultResource/Spherical_Image/SphericalImage.png"){
										sceneSky_info.scene_skybox_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/sceneDefaultImages/SphericalImage.png";
									}
		
									//// 判斷是否「場景相同來源」，是的話直接隱藏「載入頁面」。否的話執行載入新圖片
									let skySameSrc = false;
									if (aSky.getAttribute('material') ){
										if (aSky.getAttribute('material').src == sceneSky_info.scene_skybox_url ){
											// console.log(' VRFunc.js: _loadSky same src '  );
											skySameSrc = true;
										}
									}
		
									if (skySameSrc == false){
										aSky.setAttribute("material", {"src": sceneSky_info.scene_skybox_url }); 
				
										var handleLoadingPage = function(){
											console.log("VRFunc.js: _loadSky: spherical_image materialtextureloaded, remove loading page ");
											
											
											//// 將自己移除事件，避免重複觸發事件
											aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );
											skyResolve(aSky);
										};
										aSky.addEventListener("materialtextureloaded" , handleLoadingPage );
				
									}else{
										console.log("VRFunc.js: _loadSky: spherical_image same as previous  ");
		
										
										skyResolve(aSky);
									}
		
									aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite
		
									break;
				
								case "spherical_video":
									////// a-assets
									let assets = document.getElementById("makarAssets");
									
									////// mp4 video 
									// var aSky = document.createElement('a-videosphere');
									if (document.getElementById("sky")){
										aSky = document.getElementById("sky");
										if (aSky.localName == "a-sky"){
											//// 之前的 sky 是圖片，刪掉再創新的
											aSky.remove();
											aSky = document.createElement('a-videosphere');
											aSky.setAttribute('id', "sky" );
											self.vrScene.appendChild(aSky);
										}else if (aSky.localName == "a-videosphere"){
											//// 之前的 sky 是影片，不用額外動作
											
										}
									}else{
										aSky = document.createElement('a-videosphere');
										aSky.setAttribute('id', "sky" );
										self.vrScene.appendChild(aSky);
									}
		
									// aSky.setAttribute("src", self.VRSceneResult[projIndex].scenes[0].scene_skybox_url ); //  this is work, but hard to control the tag
		
									let skyVideo = document.createElement("video");
									skyVideo.src = sceneSky_info.scene_skybox_url;  
									skyVideo.playsInline = true;
									skyVideo.autoplay = true;
									//// 預設「靜音」								
									skyVideo.muted = true;
		
									skyVideo.setAttribute("loop", "true");
									skyVideo.setAttribute('type', 'video/mp4');
									if (window.Browser){
										if ( window.Browser.name == undefined || window.Browser.name == "safari"){
										// if ( Browser.mobile == true || Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
											skyVideo.muted = true;
										}
									}
									skyVideo.onloadedmetadata = function() {
										console.log("VRFunc.js: _loadSky: spherical_video onloadedmetadata");
										skyVideo.play();
									}
		
									skyVideo.setAttribute('crossorigin', 'anonymous');
									skyVideo.setAttribute('id', self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount );
		
									// skyVideo.play(); // play pause
									skyVideo.setAttribute("autoplay", "true" ); 
									// skyVideo.setAttribute("loop", "true" ); 
				
									assets.appendChild(skyVideo); ////// add video into a-assets
									// aSky.setAttribute("src", "#skyVideo" );  
									aSky.setAttribute("src", "#"+self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount ); // 
		
				
									aSky.setAttribute("radius", 2000 ); // if not set this, will be infinite
									
		
									var handleLoadingPage = function(){
										console.log("VRFunc.js: _loadSky: spherical_video materialtextureloaded, remove loading page ");
										
										//// 將自己移除事件，避免重複觸發事件
										aSky.removeEventListener("materialtextureloaded" , handleLoadingPage );
	
										skyResolve(aSky);
									};
									aSky.addEventListener("materialtextureloaded" , handleLoadingPage );
		
									break;
		
							}
							console.log("VRFunc.js: _loadSky: aSky=", aSky );

						}
						
					});

				});
				

				return pSky;

			};
			//////
			////// load all object in the scene
			//////
			this.loadSceneObjects = function( projIndex, sceneIndex ){
				if (!userProjResDict){
					console.log("%cVRFunc.js: _loadSceneObjects: error userProjResDict not exist, return -1", "color:red");
					return [];
				}

				let scene_objs = [];
				var editor_version = [];
				if (typeof(self.VRSceneResult[projIndex].editor_ver) != "string" ){
					console.log("VRFunc.js: _loadSceneObjects: the editor_ver is not string, error and return ");
					return [];
				}else{
					editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
				}

				//// 版本控制，3.2.0 版本以上會有 相機設定參數在 scenes 層級，也在此函式內設定
				scene_objs = self.editorVersionControllObjs(editor_version, projIndex , sceneIndex);
				if (!Array.isArray(scene_objs)) return [];

				//// 所有物件都要作 「 完成判斷 」各自設立 promise
				let pObjs = [];

				for (let i = 0; i < scene_objs.length ; i++  ){
					// console.log("VRFunc.js: _loadSceneObjects: obj=", self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs[i] );  //// 這句似乎print不出東西 scene_objs 會 undefined
					
					let position = new THREE.Vector3().fromArray(scene_objs[i].transform[0].split(",").map(function(x){return Number(x)}) );
					let rotation = new THREE.Vector3().fromArray(scene_objs[i].transform[1].split(",").map(function(x){return Number(x)}) );
					let scale    = new THREE.Vector3().fromArray(scene_objs[i].transform[2].split(",").map(function(x){return Number(x)}) );
					
					switch( scene_objs[i].main_type ){
						case "camera":
							
							//// 假如編輯器版本大於 3.2.0 不參考 camera 物件
							if (self.VRSceneResult[projIndex].editor_ver ){
								if ( typeof(self.VRSceneResult[projIndex].editor_ver) == "string" ){
									var editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
									if (editor_version.length == 3){
										if (editor_version[0] == 3 && editor_version[1] == 2 ){
											console.log("VRFunc.js: _loadSceneObjects: camera: editor vesion is 3.2.n , dont set" );
											break;
										}
									}
								}
							}

							let camera_cursor = document.getElementById( "camera_cursor" );
							
							var setupCamera = function(){
								if (!camera_cursor.hasLoaded){
									setTimeout(setupCamera, 100);
									console.log("VRFunc.js: _loadSceneObjects: camera: not loaded, wait" );							
								}else{
									// camera_cursor.setAttribute("randomN", Math.random() ); ////// it is work
									// camera_cursor.setAttribute("rotation", { x: 0 , y: 180, z: 0 } ); ////// it is work
									// rotation = new THREE.Vector3( 0 , 180 , 0 ); ////// set for test
									rotation.multiply( new THREE.Vector3(-1,-1,0) ).add( new THREE.Vector3(0, 180, 0) ); //// because the makar editor coordinate
									
									// camera_cursor.setAttribute("rotation", rotation ); ////// it is work, 不再將旋轉資訊放置於此，改為更新 aCamera 上
									camera_cursor.setAttribute("position", position ); ////// it is work

									//// reset the aCamera 
									if (aCamera.components["look-controls"].yawObject && aCamera.components["look-controls"].pitchObject){

										//// 編輯器上相機旋轉資訊更新於此，可解決子母旋轉問題
										aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
										aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;

										aCamera.object3D.position.set(0,0,0);
										console.log("VRFunc.js: _loadSceneObjects aCamera: yawr=", aCamera.components["look-controls"].yawObject.rotation ,
																					", pitchr=" , aCamera.components["look-controls"].pitchObject.rotation  );
									}

									// camera_cursor.object3D.rotation.set( 0, 180 * Math.PI/180 , 0 , "YXZ" ); ///// actually, looks control will control this object3D, but I cant modify it directly..  
									console.log("VRFunc.js: _loadSceneObjects: camera: ", i, scene_objs[i], position, rotation, camera_cursor, self.vrScene );							
								}								
							} 

							setTimeout(setupCamera, 10);

							// this.setTransform( camera_cursor,
							// 	position, rotation, scale
							// );
							
							break;
						case "image":

							let obj = scene_objs[i];
							console.log("VRFunc.js: _loadSceneObjects: image: ", i, scene_objs[i] );
							if (userProjResDict[ obj.res_id ] ){
								// console.log("VRFunc.js: _loadSceneObjects: image res_url", i, obj.res_url, userProjResDict[obj.res_id].res_url  );
								if ( obj.res_url == userProjResDict[obj.res_id].res_url ){
									// console.log("%cVRFunc.js: _loadSceneObjects: image res_url is same as userProjResDict", "color:blue"   );
									// console.log("%cVRFunc.js: _loadSceneObjects: image res_url is same as userProjResDict", "color:blue" , obj  );

									let pTexture = self.loadTexture(obj, position, rotation, scale );
									pObjs.push( pTexture );

								}else{
									console.log("%cVRFunc.js: _loadSceneObjects: image res_url is different from userProjResDict!", "color:red" , i , obj, userProjResDict[obj.res_id] );	
								}
							}else{
								// console.log("%cVRFunc.js: _loadSceneObjects: image res_id not exist!", "color:red" , i );	

								switch(obj.res_id){
									case "MakAR_Call":
										obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
										break;
									case "MakAR_Room": 
										obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
										break;
									case "MakAR_Mail": 
										obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
										break;
									case "Line_icon":
										obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
										break;
									case "FB_icon":
										obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
										break;
									default:
										// console.log("image: default, obj=", window.sceneResult[i].data.scene_objs_v2[j]);
										console.log("%c VRFunc.js: _loadSceneObjects: image res_id not exist!", "color:red" , obj );	
										// obj.res_url = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/icon/qm256.png';
								}

								let pTexture = self.loadTexture(obj, position, rotation, scale );
								pObjs.push( pTexture );
								
							}

							break;
							
						//20191204-start-thonsha-add
						case "text":
							console.log("VRFunc.js: _loadText: text: ", i, scene_objs[i] );
							let pText = self.loadText( scene_objs[i] , position, rotation, scale);
							pObjs.push( pText );
							break;

						//20191204-end-thonsha-add
						
						//20191105-start-thonsha-add
						case "audio":

							if ((scene_objs[i].sub_type == "mp3" || scene_objs[i].sub_type == "wav" || scene_objs[i].sub_type == "ogg" ) && scene_objs[i].res_url){
								let pAudio = self.loadAudio(scene_objs[i] , position, rotation, scale );
								pObjs.push( pAudio );
							}

							break;

						//20191105-end-thonsha-add

						case "video":

							// console.log("VRFunc.js: _loadSceneObjects: video, scene_objs=", scene_objs[i] );
							if ( scene_objs[i].sub_type == "mp4" && scene_objs[i].res_url  ){
								let pVideo = self.loadVideo( scene_objs[i] , position, rotation, scale );
								pObjs.push( pVideo );
							}

							break;

						case "model":
							
							////// check by user resource 
							console.log("VRFunc.js: _loadSceneObjects: model", i, scene_objs[i]  );
							if ( userProjResDict[ scene_objs[i].res_id ]  ){
								// console.log("VRFunc.js: _loadSceneObjects: model from user resource");
								scene_objs[i].res_url = userProjResDict[scene_objs[i].res_id].res_url ;
							} else if ( userOnlineResDict[ scene_objs[i].res_id ] ) { 
								// console.log("VRFunc.js: _loadSceneObjects: model from online resource" , userOnlineResDict[scene_objs[i].res_id].res_url );
								scene_objs[i].res_url = userOnlineResDict[scene_objs[i].res_id].res_url ;
							} else {
								// console.log(" __________VRFunc.js: _loadSceneObjects: model not exist");

								switch(scene_objs[i].res_id){
									case "Cube":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Cube.glb";
										break;
									case "Capsule":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Capsule.glb";
										break;
									case "Sphere":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/Sphere.glb";
										break;
									case "ch_Bojue":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Bojue.glb";
										break;
									case "ch_Fei":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Fei.glb";
										break;
									case "ch_Lina":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Lina.glb";
										break;
									case "ch_Poyuan":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Poyuan.glb";
										break;
									case "ch_Roger":
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/ch_Roger.glb";
										break;
									default:
										
										if (scene_objs[i].res_gltf_resource){												
											break;
										}

										scene_objs[i].material = [];
										scene_objs[i].res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
										break;
								}


							}
							let pModel = self.loadGLTFModel(scene_objs[i], position, rotation, scale , self.cubeTex );
								
							pObjs.push( pModel );

							break;
							
						case "light":
								console.log("VRFunc.js: _loadSceneObjects: light", i, scene_objs[i]  );
								self.loadLight(scene_objs[i], position, rotation, scale);
								break;
							
						case "empty":
							//// 之後空物件會有其他用途，目前大多
							
							switch (scene_objs[i].sub_type){
								case "quiz":
									
									//[start-20230920-howardhsu-modify]//							
									//// 如果 Quiz 有設定啟動物件
									if(scene_objs[i].module[0].trigger){	

										//// 在 Quiz 的啟動物件 的 behav，增加"ShowQuiz"屬性，用來記錄和啟動對應的 Quiz 物件																	
										let timeoutID = setInterval( function () {
																		
											let quizTrigger = document.getElementById(scene_objs[i].module[0].trigger);
											if (quizTrigger){
												window.clearInterval(timeoutID);	
												
												if (quizTrigger.object3D.behav) {  
													quizTrigger.object3D.behav.push({ obj_id: scene_objs[i].obj_id, played: false, simple_behav: 'ShowQuiz' })
												} else {
													quizTrigger.object3D.behav = [{ obj_id: scene_objs[i].obj_id, played: false, simple_behav: 'ShowQuiz' }]
												}														
								
												//// 上面的沒加到 應該是quiz啟動物件還沒loaded (因為在loaded時behav會被覆蓋) 可是加監聽器卻又沒效果
												// quizTrigger.addEventListener("loaded", () => {
												// 	console.log("loadSceneObjs - empty: quizTrigger scene_objs[i]= loaded之前", quizTrigger.object3D)

												// 	if (quizTrigger.object3D.behav) {  
												// 		quizTrigger.object3D.behav.push({ obj_id: scene_objs[i].obj_id, played: false, simple_behav: 'ShowQuiz' })
												// 	} else {
												// 		quizTrigger.object3D.behav = [{ obj_id: scene_objs[i].obj_id, played: false, simple_behav: 'ShowQuiz' }]
												// 	}	
													
												// 	console.log("loadSceneObjs - empty: quizTrigger scene_objs[i]= loaded之後", quizTrigger.object3D.behav)
												// })
												
												quizTrigger.object3D.triggerQuiz = { obj_id: scene_objs[i].obj_id, played: false }

												//// 如果可以一個物件啟動多個 quiz
												// if (quizTrigger.object3D.triggerQuiz) {  
												// 	quizTrigger.object3D.triggerQuiz.push({obj_id: scene_objs[i].obj_id, played: false})
												// } else {
													// quizTrigger.object3D.triggerQuiz = [{ obj_id: scene_objs[i].obj_id, played: false}]
												// }											
											}
										}, 1);
									}
									//[end-20230920-howardhsu-modify]//

									// break;
									let startQuiz = document.getElementById("startQuiz");		
									
									//[start-20230706-howardhsu-modify]//	
									if(scene_objs[i].module[0].trigger){									
										startQuiz.style.display = "none"
									} else {
										startQuiz.style.display = "block"
									}
									//[end-20230706-howardhsu-modify]//

									let QuizStartButton = document.getElementById("QuizStartButton");
									let startQuizFunc = function(){
												
										//[start-20230920-howardhsu-modify]//
										// self.loadQuiz(scene_objs[i], position, rotation, scale );
										
										let quiz = new _Quiz_js__WEBPACK_IMPORTED_MODULE_0__["default"](scene_objs[i])										
										quiz.load( scene_objs[i], position, rotation, scale );										
										//[end-20230920-howardhsu-modify]//
										
										startQuiz.style.display = "none";
										QuizStartButton.removeEventListener("click",startQuizFunc);
									}
									//// 離開quiz
									let quitQuizFunc = function(){
										startQuiz.style.display = "none";
										QuizStartButton.removeEventListener("click",quitQuizFunc);
									}
									// QuizStartButton.addEventListener("click",startQuizFunc);

									let url = window.serverUrl;
									let login_id = localStorage.getItem("login_shared_id"), proj_id = publishVRProjs.result[self.projectIdx].proj_id;

									//// 假如專案要求『強制登入作答』，檢查是否登入
									if (scene_objs[i].module[0].force_login == true ){
										if (login_id ){
											//// 再檢查是否『允許重複作答』
											if (scene_objs[i].module[0].allow_retry == false ){
												console.log("VRFunc.js: _getRecordModule: get remote: ", login_id, proj_id );
												getRecordModule( url, login_id, proj_id, function(ret){
													console.log("VRFunc.js: _getRecordModule: ret= " , ret );
													if (ret.data.record_module_list ){
														QuizStartContent.textContent = worldContent.userAlreadyPlayed[languageType];
														QuizStartButton.addEventListener("click",quitQuizFunc);
													}else{
														//// 可以重複作答，不用檢查紀錄，直接開始遊玩
														QuizStartContent.textContent = worldContent.clickToPlay[languageType];
														QuizStartButton.addEventListener("click",startQuizFunc);
													}
												});
											}else{
												//// 可以重複作答，不用檢查紀錄，直接開始遊玩
												QuizStartContent.textContent = worldContent.clickToPlay[languageType];
												QuizStartButton.addEventListener("click",startQuizFunc);
											}
										}else{
											//// 沒有登入，不給遊玩，跳出提示
											QuizStartContent.textContent = worldContent.userNotLoginInfo[languageType];
											QuizStartButton.addEventListener("click",quitQuizFunc);
										}
									}else{
										//// 不需要『檢查登入』，直接開始遊玩
										QuizStartContent.textContent = worldContent.clickToPlay[languageType];
										QuizStartButton.addEventListener("click",startQuizFunc);

										//[start-20230712-howardhsu-add]//
										//// 可能這裡也要檢查是否『允許重複作答』?
										//// fei 給的 hint: indexedDB 或 mDB
										//[end-20230712-howardhsu-add]//
									}
									
									console.log("VRFunc.js: _loadSceneObjects: empty, quiz ", i, scene_objs[i] );

									break;
								default:
									console.log("VRFunc.js: _loadSceneObjects: empty object default, ", i, scene_objs[i] );
							}

							break
						default:
							console.log("VRFunc.js: _loadSceneObjects: default", i, scene_objs[i] );
							
					}

				}


				return pObjs;
				// console.log("VRFunc.js: _loadSceneObjects: done, self.makarObjects ", self.makarObjects.length );
			}
	

			//// chkeck is image default image
			//// 
			this.checkDefaultImage = function( obj ){

				switch(obj.res_id){
					case "MakAR_Call":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
						break;
					case "MakAR_Room": 
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
						break;
					case "MakAR_Mail": 
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
						break;
					case "Line_icon":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
						break;
					case "FB_icon":
						obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
						break;
					default:
						console.log("image: default, obj=",  obj );
				}

			}

			//
			// the html will use this function to load image
			// It is sad that I cant use default a-plane tag to get the image width/height 
			//
			this.loadTexture = function( obj, position, rotation, scale ){
				// console.log("VRFunc.js: VRController: _loadTexture, obj=", obj, position, rotation, scale );
				
				//// 檢查是否為「預設物件」
				self.checkDefaultImage( obj );

				let pTexture = new Promise( function( textureResolve ){

					UrlExists( obj.res_url , function( retStatus ){
						if ( retStatus == true ){

							var texture = new THREE.TextureLoader().load( obj.res_url );
							
							let url_spit_length = obj.res_url.split(".").length
							let imgType = obj.res_url.split(".")[url_spit_length-1].toLowerCase();

							let plane;
							

							obj.sub_type = obj.sub_type.toLowerCase();
							if ( obj.sub_type == 'png' || obj.sub_type == 'jpg' || obj.sub_type == 'jpeg' || obj.sub_type == 'bmp' ){
								imgType = obj.sub_type;
								plane = document.createElement("a-plane");
								plane.setAttribute( "src", obj.res_url ); //// origin
							}else if ( obj.sub_type == 'gif' ) {
								imgType = obj.sub_type;
								plane = document.createElement("a-entity")
							}else if ( obj.sub_type == 'button' ){
								
								///// 因為預設 附型態 是「按鈕」，我又擔心會有物件副檔名不存在，那就設定為 png
								if ( imgType != 'png' && imgType != 'jpg' && imgType != 'jpeg' ){
									imgType = 'png';
								}

								plane = document.createElement("a-plane");
								plane.setAttribute( "src", obj.res_url ); //// origin
							}else {
								console.log('VRFunc.js: _loadTexture: sub_type empty, create empty plane ');
								plane = document.createElement("a-plane");
								textureResolve( plane );
								return;
							}
							//20191101-end-thonsha-mod

							plane.setAttribute( "id", obj.obj_id );//// fei add 
							plane.setAttribute('crossorigin', 'anonymous');
							

							let transparentImage = false
							let chromaKey, slope, threshold, transparentBehav
							if (obj.behav){
								for(let i=0;i<obj.behav.length;i++){
									if (obj.behav[i].simple_behav == "TransparentVideo" || obj.behav[i].simple_behav == "TransparentImage"){
										transparentImage = true;
										chromaKey = obj.behav[i].chromakey;
										slope = obj.behav[i].slope;
										threshold = obj.behav[i].threshold;
										transparentBehav = obj.behav[i];
										// console.log(obj.behav[i]);
									}
								}
							}

							if (transparentImage){
								let rgba = chromaKey.split(",");
								let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

								//20191127-start-thonsha-mod
								let HSV = transparentBehav.HSV.split(",");
								let keyH = parseFloat(HSV[0]);
								let keyS = parseFloat(HSV[1]);
								let keyV = parseFloat(HSV[2]);

								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
									if (transparentBehav.mode == 'RGB'){
										// console.log("===============RGB==============")
										plane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; side:double; depthWrite:false; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
									}
									else if (transparentBehav.mode == 'HSV'){
										// console.log("VRFunc.js: image HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
										plane.setAttribute( "material", "shader: HSVMatting; transparent: true; side:double; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";" ); //// thonsha add shader
									}
								}
								else if (imgType == "gif"){
									
									if (transparentBehav.mode == 'RGB'){
										plane.setAttribute("geometry", "primitive: plane");
										plane.setAttribute("material", "shader:gif_RGB;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; color: #"+color.getHexString()+"; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";");
									}
									else if (transparentBehav.mode == 'HSV'){
										plane.setAttribute("geometry", "primitive: plane");
										plane.setAttribute("material", "shader:gif_HSV;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; side:double; depthWrite:false; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+parseFloat(transparentBehav.hue)+"; _deltaS:"+parseFloat(transparentBehav.saturation)+"; _deltaV:"+parseFloat(transparentBehav.brightness)+";");
									}

								}
								//20191127-end-thonsha-mod
							}
							else{
								if (imgType == "jpg" || imgType == "jpeg" || imgType == "png"){
									// plane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
									plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:false" ); //// 圖片不受場上光源影響
									// plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:true" ); //// 圖片不受場上光源影響
									// plane.setAttribute( "material", "shader: flat; side:double; opacity: 1.0; transparent: true; depthWrite:false; depthTest:false;"); //// 圖片不受場上光源影響

									plane.setAttribute("geometry", "primitive: plane");
									
								}
								else if (imgType == "gif"){
									plane.setAttribute("geometry", "primitive: plane");
									plane.setAttribute("material", "side:double; shader:gif;  src: url("+ obj.res_url+"); opacity: 1; transparent: true; depthWrite:false");
								}
								
							}


							if (obj.behav){
								if (obj.behav.length==1 && transparentImage){
									plane.setAttribute('class', "unclickable" ); //// fei add
								}
								else{
									plane.setAttribute('class', "clickable" );
								}
							}
							else{
								plane.setAttribute('class', "unclickable" ); //// fei add
							}

							self.setTransform(plane, position, rotation, scale);
							self.makarObjects.push( plane );

							//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
							let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
							plane.addEventListener("materialtextureloaded", function(evt){
								// console.log("VRFunc.js: _loadTexture: _materialtextureloaded: plane = " , plane.object3D , evt );
								evt.detail.texture.anisotropy = maxAnisotropy;
								evt.detail.texture.needsUpdate = true;
							});

							plane.addEventListener("loaded", function(evt){
								
								// console.log(evt);
								if (evt.target == evt.currentTarget){
									// console.log("VRFunc.js: _loadTexture: loaded target same" );

									// setTimeout(function(){
									// 	plane.setAttribute("cursor-listener", true ); //// fei add
									// }, 500 );

									let timeoutID = setInterval( function () {
										// let tempTexture = plane.object3D.children[0].material.map;
										if (texture.image){ 											
											plane.object3D.children[0].scale.set(texture.image.width*0.01, texture.image.height*0.01 , 1);
											plane.setAttribute("heightForQuiz", texture.image.height*0.01 ); //// fei add
											window.clearInterval(timeoutID);
										}
									}, 1);
									
									let r = new THREE.Vector3();
									r.set(0,Math.PI, 0); 
									plane.object3D.children[0].rotation.setFromVector3(r);

									//// 由於圖片設定為無光標準，且深度寫入為否，故設定繪製排序往前，讓同距離的繪製可以顯示
									plane.object3D.children[0].renderOrder = 1;

									plane.object3D["makarObject"] = true; 
									if ( obj.behav ){

										//[start-20230920-howardhsu-modify]//
										//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
										if(plane.object3D["behav"] && plane.object3D["behav"].length != 0){
											obj.behav.forEach((b) => { plane.object3D["behav"].push(b) })												
										} else {
											plane.object3D["behav"] = obj.behav ;
										}
										//[end-20230920-howardhsu-modify]//		
										
										//// 載入時候建制「群組物件資料」「注視事件」
										self.setObjectBehavAll( obj );
									}
									if(obj.behav_reference){
										plane.object3D["behav_reference"] = obj.behav_reference ;
									}
									if (obj.main_type=="button"){
										plane.object3D["main_type"] = obj.main_type ;
										plane.object3D["sub_type"] = obj.sub_type ;
										plane.setAttribute('class', "clickable" );
										console.log("VRFunc.js: _loadTexture: button " , plane );

										//[start-20230920-howardhsu-add]//
										//// Quiz的按鈕 (例如 選項底下的ok) 改為使用 behav 來觸發
										if( Array.isArray(plane.object3D.behav) ){
											plane.object3D.behav.push( { simple_behav: "PushButton" } )
										} else {
											plane.object3D.behav = [ {simple_behav: "PushButton"} ]
										}
										//[end-20230920-howardhsu-add]//		
									}

									textureResolve( plane );

								}else{
									console.log("VRFunc.js: _loadTexture: loaded target different" );
								}
							});
							//20191031-end-thonsha-mod

							//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
							if ( obj.active == false ){
								plane.setAttribute("visible", false);
								plane.setAttribute('class', "unclickable" );
							}

							//20191227-start-thonsha-add
							// console.log("VRFunc.js: _loadTexture: image behav_reference: ",obj.behav_reference);
							if(obj.behav_reference){
								for(let i=0; i<obj.behav_reference.length;i++){
									if (obj.behav_reference[i].behav_name == 'ShowImage'){
										plane.setAttribute("visible", false);
										plane.setAttribute('class', "unclickable" );
										break;
									}
								}
								
							}
							//20191227-end-thonsha-add

							//20191029-start-thonhsa-add
							if(obj.obj_parent_id){
								// plane.setAttribute("visible", false);
								// plane.setAttribute('class', "unclickable" );
								let timeoutID = setInterval( function () {
									let parent = document.getElementById(obj.obj_parent_id);
									if (parent){ 
										if(parent.object3D.children.length > 0){
											parent.appendChild(plane);
											window.clearInterval(timeoutID);
										}
									}
								}, 1);
							}
							else{
								self.vrScene.appendChild(plane);
							}
							//20191029-end-thonhsa-add

							// if (obj.main_type=="button"){
							// 	return plane;
							// }

						}else{
							

							console.log("VRFunc.js: _loadTexture , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

							self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );
							textureResolve( 1 );

						}
					});



				});

				return pTexture;
				
			}
			
			//20191204-start-thonsha-add
			
			this.loadText = function( obj, position, rotation, scale ){
				// console.log("VRFunc.js: _laodText: obj = ", obj	);
				
				let pText = new Promise( function( textResolve ){

					let anchor = document.createElement('a-entity');
						
					// anchor.setAttribute("geometry","primitive: sphere; radius: 0.05" );
					// anchor.setAttribute("material","roughness: 0.48; color:	#FF0000");
					self.setTransform(anchor, position, rotation, scale);
					anchor.setAttribute( "id", obj.obj_id );//// fei add 
					self.makarObjects.push( anchor );

					if (obj.behav){
						anchor.setAttribute('class', "clickable" ); //// fei add
					}else if (obj.main_type == "button"){
						anchor.setAttribute('class', "clickable" );
					}
					else{
						anchor.setAttribute('class', "unclickable" ); //// fei add
					}
					
					// let textEntity = document.createElement('a-entity');
					// // textEntity.setAttribute("geometry","primitive: plane; width: auto; height: auto; width: auto");
					// // textEntity.setAttribute("material","color: #FFFFFF");
					// // textEntity.setAttribute("text","value: "+obj.content+"; color:red; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/notosans/NotoSans-Regular.json");
					// // textEntity.setAttribute("text","value: hello; color:red; shader: msdf; font:https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/creepster/Creepster-Regular.json");
					// textEntity.setAttribute("text","value: "+obj.content+"; color:blue; font:font/edukai-4.0-msdf.json");
					// =======================================================================
					let textEntity = document.createElement('a-text');
					//// 還是要加預設的 mesh，為了觸碰事件 
					textEntity.setAttribute("geometry","primitive:plane; width: auto; height: auto; skipCache: true;");
					textEntity.setAttribute("material","opacity: 0.0 ; depthWrite:false; color:#000000; side:double;");

					let textList = obj.content.split('\n');
					let longestSplit = 0;
					const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
					const isChinese = (str) => REGEX_CHINESE.test(str);
					for (let i = 0; i < textList.length;i++) {
						let textLength = 0;
						for (let j = 0; j <  textList[i].length; j++) {
							if(isChinese(textList[i][j])){  // chinese
								textLength += 1.6;
							}
							else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
								textLength += 1;
							}
							else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
								// textLength += 0.85;
								textLength += 1.0;
							}
							else if(!isNaN(textList[i][j] * 1)){ //numeric
								textLength += 1;
							}
							else{ // other symbols
								textLength += 1.25;
							}
							
						}
						// console.log( textList[i], textLength);
						if (textLength > longestSplit) longestSplit =textLength;
					}
					textEntity.setAttribute("value",obj.content);
					// textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115  20201027：這個數值目前沒有用處
					// textEntity.setAttribute("wrap-count",longestSplit); // 1 for 1    20201027：這個數值目前沒有用處
					textEntity.setAttribute("anchor","center");
					textEntity.setAttribute("align","left");

					textEntity.setAttribute("backcolor", obj.back_color ); //// 這邊注意一重點，自己設定的 attribute 不能使用 『大寫英文』，否則aframe data內會找不到，參照 text物件
					textEntity.setAttribute("textcolor", obj.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要
					textEntity.setAttribute("side","double");

					var fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
					let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
							fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
							fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
					// fonts = [ fontUrl + "1-msdf.json" ];
					textEntity.setAttribute("font", fonts );

					textEntity.setAttribute("negate","false");
					textEntity.setAttribute('crossorigin', 'anonymous');

					let rgb = obj.color.split(",");
					let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
					textEntity.setAttribute("color", "#"+color.getHexString());

					// textEntity.setAttribute( "id", obj.obj_id );//// fei add 
					// if (obj.behav){
					// 	textEntity.setAttribute('class', "clickable" ); //// fei add
					// }
					// else if (obj.main_type == "button"){
					// 	textEntity.setAttribute('class', "clickable" ); //// fei add
					// }
					// else{
					// 	textEntity.setAttribute('class', "unclickable" ); //// fei add
					// }
					
					// self.setTransform(textEntity, position, rotation, scale);
					// self.makarObjects.push( textEntity );

					//// 因為無法確認「形狀確認」「物件載入完成」那個先行完成，所以增加判定
					let loadedCheck = 0;

					function checkGeometrySet(evt){
						console.log("VRFunc.js: _loadText: textEntity geometry-set: evt=" , evt  );
						if ( loadedCheck == 0 ){
							loadedCheck = 1;
						}else if ( loadedCheck == 1 ){
							textResolve( textEntity );
						}
						textEntity.removeEventListener("geometry-set", checkGeometrySet );
					}
					textEntity.addEventListener("geometry-set", checkGeometrySet );

					// textEntity.addEventListener("geometry-set", function(evt){
					// 	console.log(" textEntity geometry-set: evt=" , evt , textEntity.object3D  );
					// 	textResolve( textEntity );
					// });

					textEntity.addEventListener("loaded", function(evt){
						if (evt.target == evt.currentTarget){

							console.log("VRFunc.js: _loadText loaded textEntity=" , textEntity.object3D, textEntity.object3D.parent.scale.x );

							// setTimeout(function(){
							// 	textEntity.setAttribute("cursor-listener", true ); //// fei add
							// }, 500 );

							let r = new THREE.Vector3();
							r.set(0,Math.PI, 0); 
							textEntity.object3D.rotation.setFromVector3(r);
							// textEntity.object3D.children[0].rotation.setFromVector3(r);
							// textEntity.object3D.children[0].position.x = -textEntity.object3D.children[0].position.x;

							// textEntity.object3D["makarObject"] = true; 
							anchor.object3D["makarObject"] = true; 
							if ( obj.behav ){
								// textEntity.object3D["behav"] = obj.behav ;
										
								//[start-20230920-howardhsu-modify]//
								//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
								if(anchor.object3D["behav"] && anchor.object3D["behav"].length != 0){
									obj.behav.forEach((b) => { anchor.object3D["behav"].push(b) })												
								} else {
									anchor.object3D["behav"] = obj.behav ;
								}
								//[end-20230920-howardhsu-modify]//										

								//// 載入時候建制「群組物件資料」「注視事件」
								self.setObjectBehavAll( obj );
							}
							if(obj.behav_reference){
								// textEntity.object3D["behav_reference"] = obj.behav_reference ;
								anchor.object3D["behav_reference"] = obj.behav_reference ;
							}
							if (obj.main_type=="button"){
								// textEntity.object3D["main_type"] = obj.main_type;
								anchor.object3D["main_type"] = obj.main_type;
								
								//[start-20230920-howardhsu-add]
								//// (Quiz的選項文字) 點擊事件改用 behav 來觸發，因此給它加上 behav 
								if( Array.isArray(anchor.object3D.behav) ){
									anchor.object3D.behav.push( { simple_behav: "PushButton" } )
								} else {
									anchor.object3D.behav = [ {simple_behav: "PushButton"} ]
								}
								//[end-20230920-howardhsu-add] 
							}

							if ( loadedCheck == 0 ){
								loadedCheck = 1;
							}else if ( loadedCheck == 1 ){
								textResolve( textEntity );
							}
							
						}
					});


					///
					anchor.appendChild(textEntity);
					///

					//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
					if ( obj.active == false ){
						anchor.setAttribute("visible", false);
						anchor.setAttribute('class', "unclickable" );
					}

					//20191227-start-thonsha-add
					if(obj.behav_reference){
						for(let i=0; i<obj.behav_reference.length;i++){
							if (obj.behav_reference[i].behav_name == 'ShowText'){
								// textEntity.setAttribute("visible", false);
								// textEntity.setAttribute('class', "unclickable" );
								anchor.setAttribute("visible", false);
								anchor.setAttribute('class', "unclickable" );
								break;
							}
						}
						
					}
					//20191227-end-thonsha-add
					console.log(" VRFunc.js: _loadText: anchor= ", anchor.object3D , ", obj=", obj );
					if(obj.obj_parent_id){
						// textEntity.setAttribute("visible", false);
						// textEntity.setAttribute('class', "unclickable" );
						let timeoutID = setInterval( function () {
							let parent = document.getElementById(obj.obj_parent_id);
							// console.log("0 VRFunc.js: _loadText: parent= ", parent.object3D  );

							if (parent){ 
								if(parent.object3D.children.length > 0){
									parent.appendChild(anchor);
									window.clearInterval(timeoutID);
								} 
							}
						}, 100);
					}
					else{
						self.vrScene.appendChild(anchor);
						// self.vrScene.appendChild(textEntity);
					}
					
					// if (obj.main_type=="button"){
					// 	return textEntity;
					// }


				});

				return pText;

			}

			//20191204-end-thonsha-add


			this.checkGLTFMaterialIndex = function( target, material ){

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
				let nodeMeshIndex = material.rendererIndex;
				let primitiveIndex = material.materialIndex;
	
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

				return materialIndex;

			}

			//20191025-start-thonsha-add
			
			this.loadGLTFModel = function(obj, position, rotation, scale, cubeTex){

				let pModel = new Promise( function( modelResolve ){
							
					UrlExists( obj.res_url , function( retStatus ){
						if ( retStatus == true ){

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
							assetsitem.setAttribute("id", obj.obj_id+"_"+obj.res_id);
							assetsitem.setAttribute("src",obj.res_url);
							assetsitem.setAttribute("response-type", 'arraybuffer');
							// assetsitem.setAttribute("src", 'model/tga.glb' );
							
							// assetsitem.setAttribute("src", 'https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/Resource/56a0a86b2d694c48bc7179d05a9f2c8cc833455ddc4442d481a73214d39aab4c.glb' );

							assetsitem.setAttribute('crossorigin', 'anonymous');
							assets.appendChild(assetsitem);
							
							//20191128-start-thonsha-add
							var animationSlices= null;	
							var mainAnimation;	
							if(obj.animation){
								animationSlices= [];
								
								////
								//// 2022 1123 這邊從 3.4.0 之後要作版本控制
								//// 注意，在執行的程式碼端，將 key 結構改為 新版本
								////
								if ( Array.isArray ( self.editor_version )  && self.editor_version.length == 3 ){

									let largeV  = Number( self.editor_version[0] );
									let middleV = Number( self.editor_version[1] );
									let smallV  = Number( self.editor_version[2] );

									//// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
									if ( largeV > 3 || 
									( largeV == 3 && middleV > 3 ) ||
									( largeV == 3 && middleV == 3 && smallV > 8 )
									){
										for(let i=0; i<obj.animation.length; i++){
											if (obj.animation[i].is_default || obj.animation[i].is_active){
												animationSlices.push({
													idle:obj.animation[i].uid, 
													loop:obj.animation[i].uid, 
													uid:obj.animation[i].uid, 
													changed: false, 
													reset: true, 
													count: 0});
												mainAnimation = obj.animation[i].animation_name;
											}
										}
										for(let i=0; i<obj.animation.length; i++){
											animationSlices.push({
												name:obj.animation[i].name,
												animationName:obj.animation[i].animation_name,
												startTime:obj.animation[i].start_time,
												endTime:obj.animation[i].end_time,
												uid:obj.animation[i].uid
											});
										}

									}else{
										//// 假如版本小於 3.3.8 使用舊版本 key , 小寫英文開頭，換字改為大寫英文
										
										for(let i=0; i<obj.animation.length; i++){
											if (obj.animation[i].defaultAnimation || obj.animation[i].isActive){
												animationSlices.push({
													idle:obj.animation[i].uid, 
													loop:obj.animation[i].uid, 
													uid:obj.animation[i].uid, 
													changed: false, 
													reset: true, 
													count: 0});
												mainAnimation = obj.animation[i].animationName;
											}
										}
										for(let i=0; i<obj.animation.length; i++){
											animationSlices.push({
												name:obj.animation[i].name,
												animationName:obj.animation[i].animationName,
												startTime:obj.animation[i].startTime,
												endTime:obj.animation[i].endTime,
												uid:obj.animation[i].uid
											});
										}
									}


								}else{
									//// 假如本版檢查有誤，執行「最新版本」3.3.8的架構
									for(let i=0; i<obj.animation.length; i++){
										// if (obj.animation[i].is_active){
										// 	animationSlices.push({idle:obj.animation[i].uid, uid:obj.animation[i].uid, changed: false});
										// 	mainAnimation = obj.animation[i].animation_name;
										// }
										if (obj.animation[i].is_default || obj.animation[i].is_active){
											animationSlices.push({
												idle:obj.animation[i].uid, 
												loop:obj.animation[i].uid, 
												uid:obj.animation[i].uid, 
												changed: false, 
												reset: true, 
												count: 0});							
											mainAnimation = obj.animation[i].animation_name;
										}
									}
									for(let i=0; i<obj.animation.length; i++){
										animationSlices.push({name:obj.animation[i].name,
											animationName:obj.animation[i].animation_name,
											startTime:obj.animation[i].start_time,
											endTime:obj.animation[i].end_time,
											uid:obj.animation[i].uid
										});
									}

								}
								

							}
							//20191128-end-thonsha-add

							let modelEntity = document.createElement('a-entity');

							if(!obj.res_url){ return };
				
							modelEntity.setAttribute("gltf-model", "#"+obj.obj_id+"_"+obj.res_id);
							
							if(obj.animation){
								modelEntity.setAttribute("animation-mixer", "clip: "+mainAnimation);
							}

							if (obj.behav){
								modelEntity.setAttribute('class', "clickable" ); //// fei add
							}
							else{
								modelEntity.setAttribute('class', "unclickable" ); //// fei add
							}
							modelEntity.setAttribute( "id", obj.obj_id );//// fei add 

							modelEntity.setAttribute('crossorigin', 'anonymous');

			//20200608-thonsha-add-start
							modelEntity.setAttribute("shadow","");
			//20200608-thonsha-add-end
			//20200619-thonsha0add-start
							if (obj.model_shift){
								let model_shift = new THREE.Vector3().fromArray(obj.model_shift.split(",").map(function(x){return Number(x)}) );
								model_shift.multiply(scale);
								position.add(model_shift);
							}
			//20200619-thonsha0add-end

							self.setTransform(modelEntity, position, rotation, scale);
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
										if ( obj.behav ){
															
											//[start-20230920-howardhsu-modify]//
											//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
											if(modelEntity.object3D["behav"] && modelEntity.object3D["behav"].length != 0){
												obj.behav.forEach((b) => { modelEntity.object3D["behav"].push(b) })												
											} else {
												modelEntity.object3D["behav"] = obj.behav ;
											}
											//[end-20230920-howardhsu-modify]//		
											
											//// 載入時候建制「群組物件資料」「注視事件」
											self.setObjectBehavAll( obj );
										}
										if(obj.behav_reference){
											modelEntity.object3D["behav_reference"] = obj.behav_reference ;
										}

										let objj = modelEntity.getObject3D('mesh');
										// console.log('VRFunc.js: gltf model objj=', objj );
										let materialIndex = -1;

							//20191203-start-thonsha-add
										if (obj.material){

											for(let i = 0; i < obj.material.length; i++){

												if ( objj.ModelJson ){
													materialIndex = self.checkGLTFMaterialIndex( modelEntity, obj.material[i]  );
												}

												let rgba = obj.material[i].color.split(",");
												let color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

												objj.traverse(node => {
													//// 取消所有「模型自帶光」
													if (node.type){
														if (typeof(node.type) == 'string' ){
															if (node.type.toLowerCase().includes('light') ){
																node.visible = false;
															}
														}
													}
												});

												switch (obj.material[i].shader) {
													case "Unlit/Color":
														objj.traverse(node => {
															if (node.isMesh) {

																let nameSlice = node.material.name.split("_");
																let mIndex = nameSlice[ nameSlice.length - 1 ];
																if( mIndex == materialIndex ){
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name === obj.material[i].name) {
																	node.material = new THREE.MeshBasicMaterial({color: color, name: node.material.name, skinning: node.material.skinning});
																}
															}
														});
														break;
													case "Standard":

														var renderer = modelEntity.sceneEl.renderer;
														objj.traverse(node => {

															if (node.material) {

																let nameSlice = node.material.name.split("_");
																let mIndex = nameSlice[ nameSlice.length - 1 ];
																if( mIndex == materialIndex ){
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
			//20200803-thonsha-add-start
																	node.material = new THREE.MeshStandardMaterial({
																		// name: obj.material[i].name, 
																		name: node.material.name,
																		skinning: node.material.skinning , 
																		map: node.material.map, 
																		emissive:node.material.emissive,
																		emissiveMap:node.material.emissiveMap,
																		normalMap:node.material.normalMap
																	});					
			//20200803-thonsha-add-end
																	node.material.color = color;
																	node.material.metalness = obj.material[i].metallic;
																	node.material.roughness = 1 - obj.material[i].smoothness;
																	//// 先行取消「模型呈現環景」
																	node.material.envMap = self.cubeTex.texture;
																	node.material.envMapIntensity = 1;
																	node.material.needsUpdate = true;
																	node.material.reflectivity = 0;
																	node.material.side = THREE.DoubleSide;
																	node.material.transparent = true;

																	// node.material.polygonOffset = true;
																	
																	// console.log('VRFunc.js: _loadGLTFModel: obj.material',obj.material);
																	// console.log('VRFunc.js: _loadGLTFModel: standard node.material',node.material);
			//20200730-thonsha-add-start														
																	if (node.material.map){
																		if ( THREE.GammaEncoding ){
																			node.material.map.encoding = THREE.GammaEncoding;
																		}
																		
																		node.material.map.needsUpdate = true;
																	}
			//20200730-thonsha-add-end	
																	if(obj.material[i].mode == 0){
																		node.material.opacity = 1;
																		renderer.setClearAlpha(1);

																		node.material.blending = THREE.CustomBlending;
																		node.material.blendEquation = THREE.AddEquation;
																		node.material.blendSrc = THREE.OneFactor;
																		node.material.blendDst = THREE.ZeroFactor;
																		node.material.blendSrcAlpha = THREE.ZeroFactor;
																		node.material.blendDstAlpha = THREE.OneFactor;

																	}
																	else if(obj.material[i].mode == 1){
																		node.material.opacity = 1;
																		node.material.alphaTest = obj.material[i].cut_off;
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
																			alphaTest: obj.material[i].cut_off
																		} );
																	}
																	else if(obj.material[i].mode == 2){
																		node.material.opacity = parseFloat(rgba[3]);
																		node.material.depthWrite = false;
																		
																		//// 假如是「淡出材質」，同時設定繪製排序往前，讓同距離的繪製可以顯示
																		node.renderOrder = 1;
																	
																		node.customDepthMaterial = new THREE.MeshDepthMaterial( {
																			depthPacking: THREE.RGBADepthPacking,
																			skinning: true,
																			map: node.material.map,
																			alphaTest: obj.material[i].cut_off
																		} );
																	}
																	else if(obj.material[i].mode == 3){
																		node.material.opacity = Math.max(parseFloat(rgba[3]), obj.material[i].metallic);
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
																			alphaTest: obj.material[i].cut_off
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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
																// if( mIndex == obj.material[i].materialIndex){
																// if (node.material.name == obj.material[i].name) {
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

										modelResolve( modelEntity );


									}
								}else{
									// console.log("VRFunc.js: VRController: _loadFBXModel, target!=currentTarget", obj.res_name, modelEntity.object3D.children );
								}
							});

							//20191125-end-thonsha-add

							//20191226-start-thonsha-mod

							//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
							if ( obj.active == false ){
								modelEntity.setAttribute("visible", false);
								modelEntity.setAttribute('class', "unclickable" );
							}

							if(obj.behav_reference){
								for(let i=0; i<obj.behav_reference.length;i++){
									if (obj.behav_reference[i].behav_name == 'ShowModel'){
										modelEntity.setAttribute("visible", false);
										modelEntity.setAttribute('class', "unclickable" );
										break;
									}
								}
								
							}
							//20191029-start-thonhsa-add
							if(obj.obj_parent_id){
								// modelEntity.setAttribute("visible", false);
								// modelEntity.setAttribute('class', "unclickable" );
								let timeoutID = setInterval( function () {
									let parent = document.getElementById(obj.obj_parent_id);
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

			}

			//20191025-end-thonsha-add

			this.loadFBXModel = function( obj, position, rotation, scale ){
				
				// console.log("VRFunc.js: VRController: loadFBXModel, obj=", obj, position, rotation, scale );
				// console.log("VRFunc.js: VRController: loadFBXModel, obj res_url_fbx=", obj.res_url_fbx  );

				let modelEntity = document.createElement('a-entity');
				
				if ( !obj.res_url_fbx ){ return };
				
				modelEntity.setAttribute('fbx-model', 'src:' + obj.res_url_fbx ); // res_url_fbx, load model first?

				//20191028-end-thonsha-add
				modelEntity.setAttribute("animation-mixer", "");
				//20191028-end-thonsha-add
				if (obj.behav){
					modelEntity.setAttribute('class', "clickable" ); //// fei add
				}
				else{
					modelEntity.setAttribute('class', "unclickable" ); //// fei add
				}
				modelEntity.setAttribute( "id", obj.obj_id );//// fei add 

				// setTimeout(function(){
				// 	modelEntity.setAttribute("cursor-listener", true ); //// fei add
				// }, 500 );

				self.setTransform(modelEntity, position, rotation, scale);
				self.makarObjects.push( modelEntity );

				//20191227-start-thonsha-mod
				if(obj.behav_reference){
					for(let i=0; i<obj.behav_reference.length;i++){
						if (obj.behav_reference[i].behav_name != 'PlayAnimation'){
							modelEntity.setAttribute("visible", false);
							modelEntity.setAttribute('class', "unclickable" );
							break;
						}
					}
					
				}
				//20191227-end-thonsha-mod
				//20191029-start-thonhsa-add
				if(obj.obj_parent_id){
					// modelEntity.setAttribute("visible", false);
					// modelEntity.setAttribute('class', "unclickable" );
					let timeoutID = setInterval( function () {
						let parent = document.getElementById(obj.obj_parent_id);
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
				//20191029-end-thonhsa-add
				modelEntity.addEventListener("model-loaded", function(evt){

					if (evt.target == evt.currentTarget){
						modelEntity.object3D["makarObject"] = true; 
						if ( obj.behav ){

							//[start-20230920-howardhsu-modify]//
							//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
							if(modelEntity.object3D["behav"] && modelEntity.object3D["behav"].length != 0){
								obj.behav.forEach((b) => { modelEntity.object3D["behav"].push(b) })												
							} else {
								modelEntity.object3D["behav"] = obj.behav ;
							}
							//[end-20230920-howardhsu-modify]//
						}
					}
				});

				// console.log("VRFunc.js: VRController: loadFBXModel, modelEntity=", modelEntity );
				// console.log("VRFunc.js: VRController: loadFBXModel, obj=", obj );

			}

			//20191105-start-thonsha-add
			this.loadAudio = function(obj , position, rotation, scale){
				console.log("VRFunc.js: _loadAudio , obj=", obj );

				let pAudio = new Promise( function( audioResolve ){

					UrlExists( obj.res_url , function( retStatus ){
						//// 先檢查「聲音物件網址是否存在」，否的話，載入「問號模型物件」
						if ( retStatus == true ){

							let assets = document.getElementById("makarAssets");

							let assetsitem = document.createElement("audio");
							assetsitem.setAttribute("id", obj.obj_id+"_"+obj.res_id);
							assetsitem.setAttribute("src",obj.res_url);
							assetsitem.setAttribute('crossorigin', 'anonymous');
							assetsitem.setAttribute("loop", true);
							assetsitem.setAttribute("preload", "auto");
							assets.appendChild(assetsitem);

							assetsitem.onloadedmetadata = function() {
								let soundEntity = document.createElement('a-sound');
								soundEntity.setAttribute("sound", "src: "+"#"+obj.obj_id+"_"+obj.res_id+"; autoplay: true; loop: true; volume: 1; positional: false");
								soundEntity.setAttribute( "id", obj.obj_id );
								soundEntity.setAttribute("sound", "autoplay: false"); 


								self.makarObjects.push( soundEntity );

								//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
								if ( obj.active == false ){
									soundEntity.setAttribute("sound", "loop: false");
									soundEntity.setAttribute("visible", false);
									soundEntity.setAttribute('class', "unclickable" );
								}

								let audioBehavRef = false;
								if(obj.behav_reference){
									for(let i=0; i<obj.behav_reference.length;i++){
										if (obj.behav_reference[i].behav_name == 'PlayMusic'){
											audioBehavRef = true;
											soundEntity.setAttribute("sound", "loop: false");
											soundEntity.setAttribute("visible", false);
											soundEntity.setAttribute('class', "unclickable" );
											break;
										}
									}
									
								}else{
									soundEntity.setAttribute("visible", true);
								}
								//20191227-end-thonsha-mod

								if(obj.obj_parent_id){
									
									let timeoutID = setInterval( function () {
										let parent = document.getElementById(obj.obj_parent_id);
										if (parent){ 
											if(parent.object3D.children.length > 0){
												parent.appendChild(soundEntity);
												window.clearInterval(timeoutID);

												parent.addEventListener("child-attached", function(el){

													console.log("VRFunc.js: VRController: _loadAudio,: parent child-attached, el=", el );

													if ( obj.blockly ){

														soundEntity.blockly = obj.blockly;
														soundEntity.setAttribute("sound", "autoplay: false");

													} else {

														let parentVisible = true;
														soundEntity.object3D.traverseAncestors( function(parent) {
															if (parent.type != "Scene"){
																console.log("VRFunc.js: VRController: _loadAudio,: traverseAncestors: not Scene parent=", parent );
																if (parent.visible == false){
																	parentVisible = false;
																}
															} else {
																if (parentVisible == true && soundEntity.object3D.visible == true && audioBehavRef == false ){
																	console.log("VRFunc.js: VRController: _loadAudio,: traverseAncestors: all parent visible true=", soundEntity.object3D );

																	//// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
																	if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
																		(window.allowAudioClicked != true && location == parent.location ) ){
												
																		soundEntity.setAttribute("sound", "autoplay: false");
										
																		let clickToPlayAudio = document.getElementById("clickToPlayAudio");
																		clickToPlayAudio.style.display = "block";
																		
																		clickToPlayAudio.addEventListener('click', f_clickToPlayAudio );
																		function f_clickToPlayAudio (){
																			soundEntity.components.sound.playSound();

																			clickToPlayAudio.style.display = "none";
																			clickToPlayAudio.removeEventListener( 'click', f_clickToPlayAudio )
																			window.allowAudioClicked = true;
																		}
										
																	}else{
																		soundEntity.setAttribute("sound", "autoplay: true");
																	}

																}else{
																	console.log("2 VRFunc.js: VRController: _loadAudio,: traverseAncestors: not all parent visible true=", soundEntity.object3D.children[0] );
																	soundEntity.setAttribute("sound", "autoplay: false"); 
																}
															}
														});

													}

												})

											} 
										}
									}, 1);
								}
								else{	
									console.log("VRFunc.js: _loadAudio: no parent set autoplay true", soundEntity.object3D , location );
									

									if ( obj.blockly ){

										soundEntity.blockly = obj.blockly;
										soundEntity.setAttribute("sound", "autoplay: false");

									} else {

										//// 由於這邊是『載入場景』時候希望自動播放聲音，所以這邊需要用戶額外點擊
										// if ( true ){
										// if ( window.allowAudioClicked != true ){
										if ( (window.Browser.mobile == true && window.Browser.name == "safari" && window.allowAudioClicked != true) || 
										(window.allowAudioClicked != true && location == parent.location ) ){
										
											soundEntity.setAttribute("sound", "autoplay: false");

											let clickToPlayAudio = document.getElementById("clickToPlayAudio");
											clickToPlayAudio.style.display = "block";
											
											clickToPlayAudio.addEventListener('click', f_clickToPlayAudio );
											function f_clickToPlayAudio (){
												soundEntity.components.sound.playSound();
												clickToPlayAudio.style.display = "none";
												clickToPlayAudio.removeEventListener( 'click', f_clickToPlayAudio )
												window.allowAudioClicked = true;
											}

										}else{
											soundEntity.setAttribute("sound", "autoplay: true");
										}

									}

									
									
									self.vrScene.appendChild(soundEntity);
								}

								soundEntity.addEventListener("loaded", function(evt){

									if (evt.target == evt.currentTarget){
										console.log("3 VRFunc.js: VRController: _loadAudio,: loaded, soundEntity.object3D.children[0]=", soundEntity.object3D.children[0] );
										soundEntity.object3D["makarObject"] = true; 
										if ( obj.behav ){

											//[start-20230920-howardhsu-modify]//
											//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
											if(soundEntity.object3D["behav"] && soundEntity.object3D["behav"].length != 0){
												obj.behav.forEach((b) => { soundEntity.object3D["behav"].push(b) })												
											} else {
												soundEntity.object3D["behav"] = obj.behav ;
											}
											//[end-20230920-howardhsu-modify]//		


											//// 載入時候建制「群組物件資料」「注視事件」
											self.setObjectBehavAll( obj );
										}
										if(obj.behav_reference){
											soundEntity.object3D["behav_reference"] = obj.behav_reference ;
										}

										audioResolve( soundEntity );
									}
								});
							}


						}else{							
							console.log("VRFunc.js: _loadAudio , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

							self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );

							audioResolve( 1 );
						}

					});

				});

				return pAudio;

			}
			//20191105-end-thonsha-add

			this.loadVideo = function( obj, position, rotation, scale ){	

				let pVideo = new Promise( function( videoResolve ){

					UrlExists( obj.res_url , function( retStatus ){
						//// 先檢查「影片物件網址是否存在」，否的話，載入「問號模型物件」
						if ( retStatus == true ){

							let assets = document.getElementById("makarAssets");

							var mp4Video, mp4Texture ;
					
							mp4Video = document.createElement('video');
							mp4Video.src = obj.res_url; // url, "Data/makarVRDemo.mp4"
							mp4Video.playsInline = true;
							mp4Video.autoplay = false;
							//thonsha add
							mp4Video.loop = true;
							//thonsha add
							mp4Video.setAttribute('crossorigin', 'anonymous');
							mp4Video.setAttribute("id", obj.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount );
							// mp4Video.setAttribute("hidden", "true");
							// mp4Video.setAttribute("loop", "true");
							assets.appendChild(mp4Video); ////// add video into a-assets

							
							//// 開發需要，先將所有影片禁音
							// mp4Video.muted = true;
							
							if (window.Browser){
								if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location )  ){
								// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
									mp4Video.muted = true;
								}
							}
							
							// mp4Texture = new THREE.VideoTexture( mp4Video );
							// mp4Texture.minFilter = THREE.LinearFilter;
							// mp4Texture.magFilter = THREE.LinearFilter;
							// //// mp4Texture.flipY = false;
							// mp4Texture.format = THREE.RGBFormat;

							mp4Video.onloadedmetadata = function() {
								var videoWidth , videoHeight;
								if (mp4Video.videoWidth >= mp4Video.videoHeight){
									videoWidth = 1;
									videoHeight = 1*mp4Video.videoHeight/mp4Video.videoWidth;
								}else{
									videoWidth = 1*mp4Video.videoWidth/mp4Video.videoHeight;
									videoHeight = 1;
								}

								// console.log("VRFunc.js: video WH=", mp4Video.videoWidth , mp4Video.videoHeight);
								let videoPlane = document.createElement("a-video");
								//20191108-start-thonsha-add
								let transparentVideo = false
								if (obj.behav){
									for(let i=0;i<obj.behav.length;i++){
										if (obj.behav[i].simple_behav == "TransparentVideo"){
											// console.log(obj.behav[i])
											transparentVideo = true;
											chromaKey = obj.behav[i].chromakey;
											slope = obj.behav[i].slope;
											threshold = obj.behav[i].threshold;
											transparentBehav = obj.behav[i];
										}
									}
								}

								if (transparentVideo){
									let rgba = chromaKey.split(",");
									var color = new THREE.Color(parseFloat(rgba[0]),parseFloat(rgba[1]),parseFloat(rgba[2]));

									if (transparentBehav.mode == 'RGB' || !transparentBehav.mode){
										videoPlane.setAttribute( "material", "shader: chromaKey; color: #"+color.getHexString()+";transparent: true; _slope: "+parseFloat(slope)+"; _threshold: "+parseFloat(threshold)+";" ); //// thonsha add shader
									}
									else if (transparentBehav.mode == 'HSV'){
										let HSV = transparentBehav.HSV.split(",");
										let keyH = parseFloat(HSV[0]);
										let keyS = parseFloat(HSV[1]);
										let keyV = parseFloat(HSV[2]);
										// console.log("VRFunc.js: video HSV---------------" , keyH , keyS , keyV , transparentBehav.hue , transparentBehav.saturation , transparentBehav.brightness  );
										videoPlane.setAttribute( "material", "shader: HSVMatting; transparent: true; _keyingColorH:"+keyH+"; _keyingColorS:"+keyS+"; _keyingColorV:"+keyV+"; _deltaH:"+transparentBehav.hue+"; _deltaS:"+transparentBehav.saturation+"; _deltaV:"+transparentBehav.brightness+";" ); //// thonsha add shader
									}

									//20191126-end-thonsha-mod
								}
								else{
									videoPlane.setAttribute( "material", "side:double; opacity: 1.0; transparent: true; " ); //// it is work
								}
								//20191108-end-thonsha-add

								if (obj.behav){
									if (obj.behav.length==1 && transparentVideo){
										videoPlane.setAttribute('class', "unclickable" ); //// fei add
									}
									else{
										videoPlane.setAttribute('class', "clickable" );
									}
								}
								else{
									videoPlane.setAttribute('class', "unclickable" ); //// fei add
								}

								

								videoPlane.setAttribute( "id", obj.obj_id );//// fei add 
								videoPlane.setAttribute("src", "#"+obj.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount ); //  

								videoPlane.mp4Video = mp4Video;
								
								// videoPlane.setAttribute("src", obj.res_url);

								// position = new THREE.Vector3( 1.5 , 0.0 , 4.0 ); ////// set for test
								// rotation = new THREE.Vector3( 0 , 0 , 0 ); ////// set for test
								// scale.multiply( new THREE.Vector3(videoWidth, videoHeight, 1) ); ////// need calculate from elements paraemter.

								//// 假如『原始圖片像素』高於『進場景材質大小』，就需要『縮小』，原始『各向異性』設為 1，以下流程改設為最高
								let maxAnisotropy = self.vrScene.renderer.capabilities.getMaxAnisotropy();
								videoPlane.addEventListener("materialtextureloaded", function(evt){
									console.log("VRFunc.js: _loadVideo: _materialtextureloaded: videoPlane = " , videoPlane.object3D , evt );
									evt.detail.texture.anisotropy = maxAnisotropy;
									evt.detail.texture.needsUpdate = true;
								});

								self.setTransform(videoPlane, position, rotation, scale);
								videoPlane.addEventListener("loaded", function(evt){
								
									if (evt.target == evt.currentTarget){

										// setTimeout(function(){
										// 	videoPlane.setAttribute("cursor-listener", true ); //// fei add
										// }, 500 );

										// videoPlane.object3D.children[0].scale.multiply(new THREE.Vector3(videoWidth, videoHeight, 1));
										videoPlane.object3D.children[0].scale.set(videoWidth , videoHeight, 1 );
										let r = new THREE.Vector3();
										r.set(0,Math.PI, 0); 
										videoPlane.object3D.children[0].rotation.setFromVector3(r);
										// var r = videoPlane.object3D.children[0].rotation.toVector3();
										// r.add( new THREE.Vector3(0,Math.PI, 0) );
										// videoPlane.object3D.children[0].rotation.setFromVector3(r);
										videoPlane.object3D["makarObject"] = true; 
										if ( obj.behav ){

											//[start-20230920-howardhsu-modify]//
											//// 因目前quiz啟動物件的 behav 是在loadSceneObjs手動加上去的，所以這裡檢查一下
											if(videoPlane.object3D["behav"] && videoPlane.object3D["behav"].length != 0){
												obj.behav.forEach((b) => { videoPlane.object3D["behav"].push(b) })												
											} else {
												videoPlane.object3D["behav"] = obj.behav ;	
											}
											//[end-20230920-howardhsu-modify]//		

											//// 載入時候建制「群組物件資料」「注視事件」
											self.setObjectBehavAll( obj );
										}
										if(obj.behav_reference){
											videoPlane.object3D["behav_reference"] = obj.behav_reference ;
										}

										videoResolve( videoPlane );
									}
								});
								
								self.makarObjects.push( videoPlane );

								//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
								if ( obj.active == false ){
									videoPlane.setAttribute("visible", false);
									videoPlane.setAttribute('class', "unclickable" );
								}

								//20191227-start-thonsha-mod
								let videoBehavRef = false;
								if(obj.behav_reference){
									for(let i=0; i<obj.behav_reference.length;i++){
										if (obj.behav_reference[i].behav_name == 'ShowVideo'){
											videoBehavRef = true;
											videoPlane.setAttribute("visible", false);
											videoPlane.setAttribute('class', "unclickable" );
											break;
										}
									}
									
								}
								//20191227-end-thonsha-mod

								//20191029-start-thonhsa-add
								if(obj.obj_parent_id){
									// videoPlane.setAttribute("visible", false);
									// videoPlane.setAttribute('class', "unclickable" );
									mp4Video.autoplay = false;
									let timeoutID = setInterval( function () {
										let parent = document.getElementById(obj.obj_parent_id);
										if (parent){
											if(parent.object3D.children.length > 0){
												parent.appendChild(videoPlane);
												window.clearInterval(timeoutID);
												//// deal the behavior or not.
												parent.addEventListener("child-attached", function(el){
													console.log("VRFunc.js: VRController: _loadVideo,: parent child-attached, el=", el );

													//// 假如有掛載「邏輯功能」，需要禁止一般事件操控，在這邊無條件暫停影片
													if ( obj.blockly ){

														videoPlane.blockly = obj.blockly;
														mp4Video.pause();
														mp4Video.currentTime = 0;

													} else {

														let parentVisible = true;
														videoPlane.object3D.traverseAncestors( function(parent) {
															if (parent.type != "Scene"){
																// console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: not Scene parent=", parent );
																if (parent.visible == false){
																	parentVisible = false;
																}
															} else {
																if (parentVisible == true && videoPlane.object3D.visible == true && videoBehavRef == false ){
																	console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: all parent visible true=", videoPlane.object3D , videoBehavRef );
																	
																	mp4Video.autoplay = true;
																	mp4Video.play();

																	//// 提醒用戶點擊開啟聲音
																	if (window.Browser){
																		if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
																		// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
																			self.dealVideoMuted( mp4Video );
																		}
																	}

																}else{
																	console.log("VRFunc.js: VRController: _loadVideo,: traverseAncestors: not all parent visible true=", parentVisible, videoPlane.object3D.visible, videoBehavRef );
																	//// rootObject.visible = false; 
																	mp4Video.muted = false;
																	mp4Video.autoplay = false;
																	mp4Video.pause();
																	mp4Video.currentTime = 0;

																}
															}
														});

													}
												});

											} 
										}
									}, 1);
								}
								else{

									if ( obj.blockly ){
										videoPlane.blockly = obj.blockly;
										mp4Video.pause();
										mp4Video.currentTime = 0;
									} else {
										mp4Video.autoplay = true;
										mp4Video.play();//// this is not necessary 

										//// 提醒用戶點擊開啟聲音
										if (window.Browser){
											if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
											// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
												self.dealVideoMuted( mp4Video );
											}
										}
										
									}
									
									self.vrScene.appendChild(videoPlane);
								}
								//20191029-end-thonhsa-add
							

								// }, 1 );
								// self.vrScene.appendChild(videoPlane);

								// console.log("VRFunc.js: VRController: loadVideo, videoPlane=", videoPlane );
							}


						}else{

							console.log("VRFunc.js: _loadVideo , obj url not exist ", obj );
							
							obj.main_type = 'model';
							obj.sub_type = 'glb';
							obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";

							self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );

							videoResolve( 1 );

						}
					});
					

				});


				return pVideo;
				
			}
						
			this.loadLight = function( obj, position, rotation, scale ){

				let pLight = new Promise( function( lightResolve ){

					// console.log("VRFunc.js: _loadLight: obj=", obj);  
					let Light = document.createElement("a-entity");
					Light.setAttribute("id", obj.obj_id);
					let attr = "type:"+obj.light.light_type
			
					let rgb = obj.light.color.split(",");
					let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2]));
					attr += "; color:#"+color.getHexString()

					attr += ";intensity:"+obj.light.intensity

					if (obj.light.light_type == "point" || obj.light.light_type == "spot" ){
						attr += ";distance:"+obj.light.range
						attr += ";decay: 4"
					}

					if (obj.light.light_type == "spot"){
						attr += ";angle:"+(parseFloat(obj.light.spotAngle)/2).toString()
						attr += ";penumbra: 0.2";
					}

					if (obj.light.shadow != "None"){
						Light.setAttribute("castShadow", true);
						attr += ";castShadow: true ;shadowCameraVisible: false; shadowBias:-0.0005; shadowCameraTop:10; shadowCameraBottom:-10; shadowCameraRight:10; shadowCameraLeft:-10; shadowMapHeight:1024; shadowMapWidth:1024; shadowCameraFar: 500; shadowCameraNear: 0.5"
					}

					Light.setAttribute("light", attr);
							
					if (obj.light.light_type == "directional"){
						let a = new THREE.Vector3( 0, 0, -100 );
						let b = new THREE.Euler();
						let quaternion = obj.quaternionRotation.split(",");
						let quaternionRotation = new THREE.Quaternion(parseFloat(quaternion[1]),parseFloat(quaternion[2]),parseFloat(quaternion[3]),parseFloat(quaternion[0]))
						b.setFromQuaternion(quaternionRotation)
						b.y = -b.y
						b.z = -b.z
						a.applyEuler(b);

						// Light.setAttribute( "position", a );//// origin
						self.setTransform(Light, position, rotation, scale);

						//// 子物件修改
    					//[start-20230629-howardhsu-add]//
						//// 祥霆給的正解: 
						//// 備註：這邊確認 Light.object3D.children[0].target 沒有用處，因為不再場景內部
                        //// 備註：方向光假如沒有設定 target 或是 target 未在場景內，那此方向光指向「場景原點」
                        //// 假如此方向光有 target 在
                        Light.addEventListener( 'loaded' , function( e ){
                            if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "DirectionalLight" ){
                                let normalVector = new THREE.Vector3( 0, 0, 1 );
                                // console.log('VRFunc.js: _loadLight: normalVector=' , normalVector );

                                let lightTarget = Light.object3D.children[0].target;
                                lightTarget.position.copy( normalVector );     
                                // console.log('VRFunc.js: _loadLight: normalVector=' , lightTarget );

                                Light.object3D.children[0].add( lightTarget ); 
                            }
                        })
						//[end-20230629-howardhsu-add]//
						
						//// 強制「平行光」不產生陰影，編輯器也是如此
						Light.setAttribute("castShadow", false);
						Light.setAttribute("light", 'castShadow: false; ');
					}

					//[start-20230630-howardhsu-add]//
					else if (obj.light.light_type == "spot"){						
						self.setTransform(Light, position, rotation, scale);
						Light.addEventListener( 'loaded' , function( e ){
                            if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "SpotLight" ){
                                //// 調整聚光燈照射方向
								let normalVector = new THREE.Vector3( 0, 0, 1 );
                                let lightTarget = Light.object3D.children[0].target;
                                lightTarget.position.copy( normalVector );     
                                Light.object3D.children[0].add( lightTarget ); 
                            }
                        })
					}
					else if (obj.light.light_type == "point"){
						self.setTransform(Light, position, rotation, scale);
						// console.log("VRFunc.js: _loadLight: obj.light.light_type=", obj.light.light_type)
					}
					//[end-20230630-howardhsu-add]//
					else{
						//// 目前沒有 平行光、聚光燈、點光源 以外的光源類型，不應該會走進這段
						self.setTransform(Light, position, rotation, scale);
						console.log("VRFunc.js: _loadLight: Unexpected light type!!  obj.light.light_type=", obj.light.light_type)
					}

					//// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
					if ( obj.active == false ){
						Light.setAttribute("visible", false);
					}

					console.log("VRFunc.js: _loadLight: Light=", Light);
					self.makarObjects.push( Light );
					// self.vrScene.appendChild(Light);// this = vrScene

					if(obj.obj_parent_id){
						let timeoutID = setInterval( function () {
							let parent = document.getElementById(obj.obj_parent_id);
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

			function getRandomInt(max) {
				return Math.floor(Math.random() * Math.floor(max));
			}


			this.setTransform = function( obj, position, rotation, scale ){
				// console.log("VRFunc.js: setTransform: obj=", obj, "\n position=", position , "\n rotation=", rotation , "\n scale=", scale); 
				let pos = position.clone(); 
				pos.multiply( new THREE.Vector3( -1, 1, 1 ) ); ////// reverse the x direction 
				obj.setAttribute( "position", pos );//// origin 

				let rot = rotation.clone(); 
				rot.multiply( new THREE.Vector3( 1 , -1 , -1 ) ); ////// reverse x y direction
				obj.setAttribute( "rotation", rot );//// origin 

				obj.setAttribute( "scale", scale );//// origin 

				// obj.setAttribute( "width" , scale.x );////// the unit ratio is 1:100
				// obj.setAttribute( "height", scale.y );

			}

			this.checkAnimation = function (obj, dt){
				if (obj.mixer){
					obj.mixer.update(dt);
				}
				if (obj.animationSlices ){
					if (obj.animationSlices[0].index){
						if (obj.animationSlices[obj.animationSlices[0].index]){
							if (obj.mixer._actions[0].time > obj.animationSlices[obj.animationSlices[0].index].timeEnd ||
								obj.mixer._actions[0].time < obj.animationSlices[obj.animationSlices[0].index].timeStart){
								obj.mixer._actions[0].time = obj.animationSlices[obj.animationSlices[0].index].timeStart;
							}
						}
					}
				}
			}

//[start-20200617-fei0097-add]//
			this.showObjectEvent = function(target, reset ){

				if (!target){
					console.log('VRFunc.js: _showObjectEvent: target not exist', target);
					return;
				}

				if (target.getAttribute("visible")){
					target.setAttribute("visible",false);
					target.setAttribute('class', "unclickable" );
					if(target.localName=="a-video"){
						let id = target.getAttribute("src");
						if(id!=undefined){
							id = id.split("#").pop();
							let v = document.getElementById(id);
							if (v instanceof HTMLElement){
								v.pause();
							}
						}
					}

					
					//// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
					//// 不論是要開啟還是關閉物件，都查找整個場景一遍中所有影片是否有「可見的」，挑選一隻影片為「有聲音」，其他為「靜音」
					if (window.Browser){
						if (window.Browser.name == undefined || window.Browser.name == "safari" ){
						// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
							self.UnMutedAndPlayAllVisibleVideo();
						}
					}


					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							child.el.setAttribute('class', "unclickable" );
							if(child.el.localName=="a-video"){

								//// 假如影片物件有「邏輯」，不予以控制
								if ( child.el.blockly  ){
									console.log('VRFunc.js: _showObjectEvent: set false, video blockly: do nothing ', child );
								} else {

									let id = child.el.getAttribute("src");
									if(id!=undefined){
										id = id.split("#").pop();
										let v = document.getElementById(id);
										if (v instanceof HTMLElement){
											v.pause();
										}
									}
								}
							}
							if(child.makarObject && child.el.getAttribute("sound")){
								// child.el.components.sound.stopSound();

								if ( child.el.blockly ){
									console.log('VRFunc.js: _showObjectEvent: set false, audio blockly: do nothing ', child );
								} else {

									if (child.behav_reference){
										child.el.setAttribute("visible", false);
									}
									for(let i in child.children ){
										if ( child.children[i].children[0].type == "Audio" ){					
											if (child.children[i].children[0].isPlaying == true ){
												child.el.components.sound.stopSound();
											}
										}
									}
									
								}

							}
						}
					});
					if (reset){
						target.object3D.traverse(function(child){
							if (child.type=="Group"){
								child.el.setAttribute("visible",false);
								child.el.setAttribute('class', "unclickable" );
							}
						});
					}
				}
				else{

					//// iOS 中，同時只能存在一隻「有聲音影片」，所以需要判定。
					//// 不論是要開啟還是關閉物件，都查找整個場景一遍中所有影片是否有「可見的」，挑選一隻影片為「有聲音」，其他為「靜音」
					if (window.Browser){
						if (window.Browser.name == undefined || window.Browser.name == "safari" ){
						// if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
							self.UnMutedAndPlayAllVisibleVideo( target );
						}
					}

					target.setAttribute("visible",true);
					let id = target.getAttribute("src");
					if(id!=undefined){
						id = id.split("#").pop();
						let v = document.getElementById(id);
						if (v instanceof HTMLElement){
							// v.load();
							v.play();
						}
					}
					if(target.object3D.behav){
						target.setAttribute('class', "clickable" );
					}
					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							if (child.el.getAttribute("visible")){
								if(child.el.object3D.behav){
									child.el.setAttribute('class', "clickable" );
								}
								if(child.el.localName=="a-video"){

									if ( child.el.blockly  ){
										console.log('VRFunc.js: _showObjectEvent: set true, video blockly: do nothing  ', child );
									} else {
										let id = child.el.getAttribute("src");
										if(id!=undefined){
											id = id.split("#").pop();
											let v = document.getElementById(id);
											if (v instanceof HTMLElement){
												v.play();
											}
										}

									}

									
								}
								if(child.makarObject && child.el.getAttribute("sound")){
									
									if ( child.el.blockly ){
										console.log('VRFunc.js: _showObjectEvent: set true, audio blockly: do nothing ', child );
									} else {
										child.el.components.sound.playSound();
									}

								}
							}
						}
					});
				}

			}

			this.hideGroupObjectEvent = function(target){

				if ( !target ){
					console.log('VRFunc.js: _hideGroupObjectEvent: target not exist ', target );
					return;
				}

				if (target.getAttribute("visible")){
					target.setAttribute("visible",false);
					target.setAttribute('class', "unclickable" );
					target.object3D.traverse(function(child){
						if (child.type=="Group"){
							child.el.setAttribute('class', "unclickable" );
							if(child.el.localName=="a-video"){
								let id = child.el.getAttribute("src");
								if(id!=undefined){
									id = id.split("#").pop();
									let v = document.getElementById(id);
									if (v instanceof HTMLElement){
										v.pause();
									}
								}
							}
							if(child.makarObject && child.el.getAttribute("sound")){
								//// 假如此聲音物件有掛 behav_reference[ PlayMusic ], 則將visible 改為 false ，只有觸發 PlayMusic 才能再次開啟
								if (child.behav_reference){
									child.el.setAttribute("visible", false);
								}
								//// 假如聲音物件本來在播放，則停止。因應在手機上假如在沒播放的狀況下呼叫 stop，會報錯誤
								for(let i in child.children ){
									if ( child.children[i].children[0].type == "Audio" ){					
										if (child.children[i].children[0].isPlaying == true ){
											child.el.components.sound.stopSound();
										}
									}
								}
							}
						}
					});
				}
			}


			////
			//// 清除「場景物件的事件資料」，因為 VR 會「跳整場景」，流程上會清除所有場景物件，再載入新場景物件。所以在「載入前」，要清除就場景的事件相關
			//// 包含 「事件群組」「注視事件」
			////
			this.clearBehavs = function(){
				
				let self = this;

				//// 「群組事件」
				for ( let i in self.groupDict ){
					if ( Array.isArray( self.groupDict[i].objs ) ){
						self.groupDict[i].objs.length = 0;

					}
				}

				//// 「注視事件」
				self.lookAtObjectList.length = 0;
				self.lookAtObjectList = [];
				
				for ( let i in self.lookAtTimelineDict ){
					if ( typeof( self.lookAtTimelineDict[ i ].pause ) == 'function' && typeof( self.lookAtTimelineDict[ i ].kill ) == 'function' ){
						self.lookAtTimelineDict[ i ].pause(); 
						self.lookAtTimelineDict[ i ].kill(); 
					}
				}

				self.lookAtTimelineDict = {};

			}


			////
			//// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
			//// 目前完全不參考「 儲存的 behav_reference 資料 」，都從「 behav 」來自製 「 behav_reference 」 
			////
			this.checkVRSceneResultBehav = function(){
				let self = this;
				//// 專案id 錯誤
				if ( ! Number.isFinite( Number( self.projectIdx ) )   ){
					console.error( ' _checkVRSceneResultBehav: projectIdx error ', self.projectIdx );
					return;
				}
				//// 專案資料內容錯誤
				if ( !Array.isArray( VRSceneResult ) ||  !VRSceneResult[ self.projectIdx ] || !Number.isInteger( Number( self.sceneIndex ) )  ){
					console.error( ' _checkVRSceneResultBehav: _VRSceneResult error ', self.projectIdx , self.sceneIndex , VRSceneResult);
					return;
				}

				if ( !self.VRSceneResult[ self.projectIdx ].editor_ver || typeof( self.VRSceneResult[ self.projectIdx ].editor_ver ) != 'string' ){
					console.error( ' _checkVRSceneResultBehav: editor_ver error ', self.VRSceneResult[ self.projectIdx] );
					return;
				}

				let editor_version = self.VRSceneResult[ self.projectIdx].editor_ver.split(".");
				let scene_objs = self.editorVersionControllObjs( editor_version, self.projectIdx , self.sceneIndex );

				console.log('_checkVRSceneResultBehav: _scene_objs ', scene_objs );

				if ( ! Array.isArray( scene_objs ) ){
					return;
				}

				//// 檢查「 behav / behav_reference 」

				///// 建制列表
				let behavAll = {};
				let behavRefAll = {}; //// 這部份預計拿來對答案用
				let sceneObjDict = {};
				
				for ( let i = 0, len = scene_objs.length; i < len; i++ ){
					let sceneObj = scene_objs[i];

					if ( sceneObj.behav ){
						behavAll[ sceneObj.obj_id ] = sceneObj.behav;
					}

					//// 無條件清除 「 儲存的  behav_reference 資料 」
					if ( sceneObj.behav_reference ){
						// behavRefAll[ sceneObj.obj_id ] = sceneObj.behav_reference;
						delete sceneObj.behav_reference;
					}

					if ( sceneObj.obj_id ){
						sceneObjDict[ sceneObj.obj_id ] = sceneObj;
					}
				}


				//// 從「 事件備註 _behavRef 」 來檢查，會不會有「明明沒有事件來觸發物件顯示，但是物件上確有掛 behav_reference 」
				//// 上述情況發生的話，會造成物件啟使的時候，被設置為「不可見」，但又沒有任何事件可以觸發顯示
				// for ( let i in behavRefAll ){
				// 	let behavRefs = behavRefAll[i];
				// 	for( let j = 0, len = behavRefs.length; j < len; j++ ){
				// 		let behavRef = behavRefs[ j ];
				// 		// console.log(' _checkVRSceneResultBehav: _behavRefAll: ', i.slice(0,6) , j , behavRef );
				// 		// let behavRefObj = sceneObjDict[i];

				// 		let getBehavObj = false;
				// 		for ( let k in behavAll ){
				// 			let behavs = behavAll[k];
				// 			for ( let m = 0; m < behavs.length; m++ ){
				// 				if ( behavs[m].obj_id == i && behavs[m].simple_behav == behavRef.behav_name ){
				// 					getBehavObj = { i: m, b: behavs[m] } ;
				// 				}
				// 			}
				// 		}

				// 		if ( getBehavObj == false ){
				// 			console.error('_checkVRSceneResultBehav: _getBehavObj false', i ,j, behavRefs );

				// 			// behavRef = null;
				// 			// behavRefs = null;

				// 			// behavRefs.fuck = '12354';
				// 			// behavRef.fuck = '123';
				// 			// behavRef.behav_name = '123';
							
				// 			behavRefs.length = 0;

				// 		}else{
				// 			// console.log('_checkVRSceneResultBehav: _getBehavObj true', i ,j, behavRefs , getBehavObj );
				// 		}
				// 	}
				// }

				//// 從 「事件 behav 」來檢查「全部場景物件」中是否有物件沒有帶到「 事件備註 behav_reference 」
				//// 沒有的話，補上
				for ( let i in behavAll ){
					let behavs = behavAll[i];
					// console.log(' _checkVRSceneResultBehav: _behavAll: ', i, behavs );
					for( let j = 0, len = behavs.length; j < len; j++ ){
						let behav = behavs[ j ];
						if ( behav.simple_behav != "FingerGesture" ){
							// console.log(' _checkVRSceneResultBehav: _behavAll: ', i.slice(0,6) , j ,behav );
						}
						
						if ( behav.obj_id ){
							let behavObj = sceneObjDict[ behav.obj_id ];

							//// 無條件自製 「 _behav_reference 」
							if ( behavObj && Array.isArray( behavObj.behav_reference ) ){
								behavObj.behav_reference.push({
									behav_name: behav.simple_behav,
									target_id: behav.obj_id,
								});
							}else if ( behavObj ){
								behavObj.behav_reference = [{
									behav_name: behav.simple_behav,
									target_id: behav.obj_id,
								}];
							}else{
								console.error('_checkVRSceneResultBehav: cant get _behavObj ', behav );
							}


							// if ( behavObj.behav_reference ){
								
							// 	let getBehaveRef = false;
							// 	for ( let k = 0; k < behavObj.behav_reference.length; k++ ){
							// 		if ( behavObj.behav_reference[k].behav_name == behav.simple_behav ){
							// 			getBehaveRef = true;
							// 		}
							// 	}

							// 	if ( getBehaveRef ){
							// 		// console.log('_checkVRSceneResultBehav: getBehaveRef true', behav, behavObj,  );
							// 	}else{
							// 		console.error('_checkVRSceneResultBehav: _getBehaveRef false', behav, behavObj );
							// 	}
								
							// }else{
							// 	console.error(' _checkVRSceneResultBehav: _behavObj ref not exist error: ', behavObj );

							// }

						}
					}
				}
			}


			////
			//// 載入「場景物件」完成之後，作的「物件區域」計算
			////
			this.calcSceneArea = function(){
				
				let self = this;
				let objList = {} ;

				let objMaxX = 0;
				let objMinX = 0;
				let objMaxZ = 0;
				let objMinZ = 0;

				for ( let i = 0, len = self.makarObjects.length; i< len ; i++ ){
					
					let obj3D = self.makarObjects[i].object3D;
					if ( obj3D && obj3D.el && obj3D.el.id ){
						let boxList = [];
						obj3D.traverse( function(c){

							if ( c.isMesh && c.geometry ){
								
								let box = new THREE.Box3();
								c.geometry.computeBoundingBox();
								box.copy( c.geometry.boundingBox ).applyMatrix4( c.matrixWorld );
								if ( box.max.z == box.min.z ){
									box.max.z += 0.01;
								}

								if ( box.max.x > objMaxX ) objMaxX = box.max.x;
								if ( box.min.x < objMinX ) objMinX = box.min.x;
								if ( box.max.z > objMaxZ ) objMaxZ = box.max.z;
								if ( box.min.z < objMinZ ) objMinZ = box.min.z;
							

								let boxHelper = new THREE.Box3Helper( box , 0x56a5d3 );
								boxList.push( boxHelper );								

								//// 顯示於畫面中，測試用
								// self.vrScene.object3D.add( boxHelper );
								// console.log(' .... ' , self.makarObjects[i], box.max.clone() , box.min.clone() );
								// console.log(' .... ' , self.makarObjects[i], boxHelper.position.clone() , boxHelper.rotation.clone(), boxHelper.scale.clone(), boxHelper  );

								// console.log(' .. ' , boxHelper.position.x , boxHelper.position.z  );

							}

						});

						objList[ obj3D.el.id ] = boxList;

					}
				}

				self.objList = objList;


				let areaMax = new THREE.Vector2( objMaxX , objMaxZ );
				let areaMin = new THREE.Vector2( objMinX , objMinZ );
				
				self.areaMax = areaMax;
				self.areaMin = areaMin;
				
				// console.log(' _calcSceneArea: x = [', objMaxX, ', ' , objMinX , '], z = [' , objMaxZ, ', ' , objMinZ, ']' );

				if ( publishVRProjs && Array.isArray(publishVRProjs.result) && Number.isFinite( self.projectIdx ) ){
					
					if ( typeof( publishVRProjs.result[ self.projectIdx ].proj_descr ) == 'string' && publishVRProjs.result[ self.projectIdx ].proj_descr.includes('_walking') == true  ){
						console.log(' _calcSceneArea: walking project ' , self.projectIdx , publishVRProjs.result[ self.projectIdx ] );

						let ground = document.getElementById('__ground');
						if ( ground ){
							let gw = (objMaxX - objMinX) *2 ;
							let gd = (objMaxZ - objMinZ) *2 ;
							let gc = new THREE.Vector2( (objMaxX + objMinX)/2 , (objMaxZ + objMinZ)/2 );

							ground.setAttribute('geometry', 'width:'+ gw +'; height:'+ gd+';'   );
							ground.setAttribute('position',  {x: gc.x, y: 0.1 , z: gc.y }  );

							
							console.log(' _calcSceneArea: gwdc ', gw , gd, gc );

						}

					}else{
						console.log(' _calcSceneArea: not walking project ' , self.projectIdx , publishVRProjs.result[ self.projectIdx ] );
					}
				}else{
					console.log(' _calcSceneArea: _publishVRProjs error ' , self.projectIdx , publishVRProjs );
				}


			}


			//// 
			//// 載入「場景物件」完成之後，作的「事件」處理，目前包含「注視事件」 而已
			//// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
			//// 流程：掃一遍「場景中物件 2d/3d 」
			////
			////
			this.setupSceneBehav = function(){
				
				let self = this;

				let behavObj = {};
				for ( let i = 0, len = self.makarObjects.length; i< len ; i++ ){
					
					let obj3D = self.makarObjects[i].object3D;
					if ( obj3D ){

						if ( obj3D.behav ){
							
						}

						if ( obj3D.behav_reference ){

						}

					}else{	
						console.error(' _setupSceneBehav: 3d obj error', i, self.makarObjects[i] );
					}

				}

				// for ( let i = 0, len = self.makarObjects2D.length; i< len ; i++ ){

				// }


				//// 從載入過程紀錄的 「注視事件列表」 來建立互動事件 「」
				//// 只有「3d物件」會有注視事件
				for ( let i = 0, len = self.lookAtObjectList.length; i < len; i++ ){
					let lookAtEvent = self.lookAtObjectList[i];

					let lookObjId = lookAtEvent.lookObjId;
					let lookObj = document.getElementById( lookObjId );
					
					let lookBehav = lookAtEvent.lookBehav;
					let targetObjId = lookBehav.obj_id;
					let reverse = lookBehav.reverse;

					let targetObj = document.getElementById( targetObjId );
					//// 確保「目標物件」「注視物件」都存在，建立持續事件
					if (lookObj && lookObj.object3D && targetObj && targetObj.object3D ){
						
						self.addLookAtTimeLine( lookObj , targetObj , lookAtEvent );

					}else{
						console.log('_setupSceneBehav: _lookAt error, obj not exist', lookObj , targetObj );
					}

				}

			}



			///// 建立「注視事件功能」
			this.addLookAtTimeLine = function( lookObj , targetObj , lookAtEvent ){

				console.log(' _addLookAtTimeLine: ', lookAtEvent );

				let self = this;

				let targetPos = new THREE.Vector3();
				targetObj.object3D.getWorldPosition(targetPos);
				
				let tl = gsap.timeline();
				self.lookAtTimelineDict[ lookAtEvent.lookObjId ] = tl;
				//// 無條件不斷重複「注視功能」
				tl.to(lookObj.object3D, {
					duration: 1100,
					delay: 0, 
					ease: 'none',
					repeat: -1,
					onUpdate: function(){
						targetObj.object3D.getWorldPosition(targetPos);
						lookObj.object3D.lookAt(targetPos);
						if ( lookAtEvent.lookBehav && lookAtEvent.lookBehav.reverse == false ){
							lookObj.object3D.rotateOnAxis( new THREE.Vector3( 0, 1 ,0 ), Math.PI );
						}
					}
				});

			}


			////
			//// 所有 「物件觸發事件」 需要作的「前置動作」
			////
			//// 1. 場景載入物件時候，假如有「觸發事件」，則往下判斷是否有「群組」，並且紀錄下來
			//// 2. 「注視事件」
			////
			this.setObjectBehavAll = function( obj ){
				
				let self = this;

				for ( let i = 0, len = obj.behav.length; i < len; i++ ){
					//// 群組事件紀錄
					if ( obj.behav[i].group != '' ){
						if ( self.groupDict[ obj.behav[i].group ] ){
							let groupObj =  self.groupDict[ obj.behav[i].group ];

							groupObj.objs.push({
								behav:  obj.behav[i]
								
							} );

						}else{

						}		
					}


					//// 注視事件紀錄
					if ( obj.behav[i].simple_behav == 'LookAt' && obj.behav[i].obj_id ){

						let lookAtEvent = {
							lookBehav: obj.behav[i] ,
							lookObjId: obj.obj_id ,
						}

						self.lookAtObjectList.push( lookAtEvent );

					}

				}
			}


			////
			//// 處理全部的 群組功能 包含 2D / 3D 
			//// 注意：目前群組功能只有作用在 「顯示/隱藏」相關的功能。我們也只先處理這些，未來在新增
			////
			this.dealAllGroupHide = function( touchObject ){

				let self = this;

				if ( !self.groupDict ){
					console.log('_dealAllGroup: missing groupDict');
					return;
				}

				//// 符合當前群組功能的 事件
				let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];

				for (let i = 0; i < touchObject.behav.length; i++ ){
					let behav = touchObject.behav[i];
					if ( behav.group != ''  && self.groupDict[ behav.group ]  ){
						let groupIndex = behav.group;

						// console.log(' _dealAllGroupHide:  ', groupIndex , self.groupDict[ groupIndex ].objs );

						self.groupDict[ groupIndex ].objs.forEach( ( groupObj , groupObjIndex  )=>{
							let obj_id = groupObj.behav.obj_id;
							let getObj = self.getObjectTypeByObj_id( obj_id );

							//// 要觸發顯示隱藏的物件 要區分為 2d/3d 
							if ( getObj.obj_type == '2d'  ){
								let obj2D = getObj.obj;
								//// 「 點擊到的事件的『要觸發顯示隱藏的物件id』 」 跟 「 群組中的個別物件的物件id  」 不一樣的話，全部隱藏。
								if (  behav.obj_id != obj_id ){
									//// 檢查事件是否符合所要
									// console.log(' ...2d  ', touchObject , obj2D );
									if ( obj2D.behav_reference ){
										for ( let j = 0; j < obj2D.behav_reference.length; j++ ){
											// console.log(' ...  ', obj2D.behav_reference[j] );
											if ( showEventStrList.filter( e => e == obj2D.behav_reference[j].behav_name ).length > 0 ){
												obj2D.visible = false;
												break;
											}
										}
									}

								}

							}else if ( getObj.obj_type == '3d' ){
								let obj3D = getObj.obj;

								// console.log(' ... _obj3D: ' , obj3D.object3D );

								// console.log(' ... obj3D: behav: ', obj3D.object3D );
								if ( obj3D.object3D.behav_reference && Array.isArray( obj3D.object3D.behav_reference ) && behav.obj_id != obj_id  ){
									for ( let j = 0; j < obj3D.object3D.behav_reference.length; j++ ){
										// console.log(' ...  ', groupObjIndex , obj3D.object3D.behav_reference[j] );
										if ( showEventStrList.filter( e => e == obj3D.object3D.behav_reference[j].behav_name ).length > 0 ){

											self.hideGroupObjectEvent( obj3D );

											// obj3D.setAttribute('visible' , false );
											// obj3D.object3D.visible = false;

											break;
										}
									}
								}
								
							}

						});

					}
				}
			}


			//// 朗讀文字物件功能
			this.speechTextObj = function( textObj ){

				console.log(' _speechTextObj: _textObj: ', textObj );
				if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){

					//// 先判斷是否已經正在說話，假如是的話，暫停說話。假如沒有正在說話，才開始說話。
					if ( speechSynthesis.speaking == true ){
						speechSynthesis.pause();
						speechSynthesis.cancel();
					} 

					let speed = textObj.speed;
					let speechLangIndex = textObj.language;
					let content = textObj.content;

					let utterance = new SpeechSynthesisUtterance( content );

					//// makar / web = 2 / 1.67
					//// makar / web = 1.5 / 1.38
					//// makar / web = 1 / 1
					//// makar / web = 0.75 / 0.76
					//// makar / web = 0.5 / 0.42
					//// 速度方面怪怪的 沒辦法，經驗判斷加上 2 階 fitting 
					//// https://mycurvefit.com/ 
					 
					// utterance.rate = ( speed **2 ) * (-0.2963) + ( speed )*1.556 - 0.266 ; // 二階
					utterance.rate = ( speed**3 ) * ( 0.1837 ) + ( speed**2 ) * ( -0.9948 ) + ( speed )* ( 2.3352 ) + ( -0.5196 ) ; // 三階
					utterance.pitch = 1;

					//// 發音語言，目前測試由 lang / voice 來控制
					//// 1. 在沒有設置 voice 情況下， lang 改變的確會影響
					//// 2. 在有設定 voice 情況下，lang 就沒有效果了
					//// 所以先判斷 voice 沒有成功的話再設定 lang 

					//// MAKAR 設定
					//// 0: en 1: zh-Hant 2: zh-Hans 3: ja 4: ko
					let setLang = 'en';
					let voiceLang = 'en-US';

					switch( speechLangIndex ){
						case 0:
							setLang = 'en';
							voiceLang = 'en-US';
							break;
						case 1:
							setLang = 'zh-TW';
							voiceLang = 'zh-TW';
							break;
						case 2:
							setLang = 'zh-CN';
							voiceLang = 'zh-CN';
							break;
						case 3:
							setLang = 'ja';
							voiceLang = 'ja-JP';
							break;
						case 4:
							setLang = 'ko';
							voiceLang = 'ko-KR';
							break;
						default:
							setLang = 'en';
							voiceLang = 'en-US';
					}
					
					
					//// 發音標準，20230530, 美語 國語（台灣） 日本語（）
					//// 另外，以下可能無法取得，判斷
					
					let tID = setInterval( function(){
						let getVoice = false;
						let voices = speechSynthesis.getVoices();
						if ( voices.length > 0 ){
							clearInterval( tID );

							//// safari 的各語言發音效果怪怪的，改為只使用預設語言來選定聲音。
							if ( window.Browser && window.Browser.name != "safari"  ){

								voices.forEach( e => {
									if ( e.lang == voiceLang ){
										getVoice = true;
										utterance.voice = e;
									}
								});
	
							}

							if ( getVoice == false ){
								utterance.lang = setLang;
							}

							speechSynthesis.speak(utterance);
							
						}
						
					}, 1);

					
				}
				
			}



//[end---20200617-fei0097-add]//


//20211116-thonsha-add-start
			this.parseLogicXML = function(projIndex, sceneIndex){
				let pXML;

				//// 假如是切換場景，前面的場景可能有邏輯功能，清除
				if ( vrController.logic && typeof( vrController.logic.stopLogic ) == 'function'  ){
					vrController.logic.stopLogic();
				}
				
				if(publishVRProjs.result[projIndex].xml_urls && publishVRProjs.result[projIndex].xml_urls[sceneIndex]  ){
					let xmlURL = publishVRProjs.result[projIndex].xml_urls[sceneIndex];

					console.log('VRFunc.js: _parseLogicXML: xmlURL = ' , xmlURL);

					let logic = new Logic();
					pXML = logic.loadXMLtoDoc(xmlURL);
					vrController.logic = logic;
				}

				return pXML;
			}



//20211116-thonsha-add-end

			//// 注意，當前影片、聲音是共用「確認面板」

			//// 處理影片物件是否播放聲音
			//// 處理影片物件是否播放聲音，目前只有 ios safari 可能呼叫到這
			this.dealVideoMuted = function( video ){
				let clickToPlayAudio = document.getElementById("clickToPlayAudio");
				clickToPlayAudio.style.display = "block";													
				clickToPlayAudio.onclick = function(){
					
					// video.muted = false;

					self.UnMutedAndPlayAllVisibleVideo();
					
					clickToPlayAudio.style.display = "none";
					clickToPlayAudio.onclick = null;
					window.allowAudioClicked = true;
				}

			}

			//// 為了 iOS 無法同時播放「超過一個有聲音的影片」，在場景中尋找是否有「當前可見的影片」，只能有一隻切換為切換為「有聲音」
			//// 流程分兩種： 1. 點擊觸發「顯示任意物件」 2. 點擊觸發「關閉任意物件」 
			//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
			////
			this.UnMutedAndPlayAllVisibleVideo = function( targetVideo_in ){

				//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
				let targetVideo;
				if (targetVideo_in){
					if ( targetVideo_in.localName == 'a-video' ){
						targetVideo = targetVideo_in;
					}
				}
				

				//// 取得「所有影片」
				let aVideos = document.getElementsByTagName('a-video');

				console.log("VRFunc.js: _UnMutedAndPlayAllVideo: aVideos.length=", aVideos.length );


				if ( targetVideo ){
					//// 假如有「要顯示的影片」
					for ( let i = 0; i < aVideos.length; i++ ){

						let videoPlane = aVideos[i];
						let mp4Video = aVideos[i].mp4Video;

						//// 開啟此影片聲音
						if ( videoPlane == targetVideo ){

							targetVideo.mp4Video.muted = false;
							targetVideo.mp4Video.autoplay = true;
							targetVideo.mp4Video.play();

						}else{

							let parentVisible = true;
							videoPlane.object3D.traverseAncestors( function(parent) {
								if (parent.type != "Scene"){
									// console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
									if (parent.visible == false){
										parentVisible = false;
									}
								} else {
		
									console.log("VRFunc.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );
		
									//// 這邊選定影片改為「靜音」，不論是否是「邏輯操控」
									if (parentVisible == true && videoPlane.object3D.visible == true ){
										
										mp4Video.muted = true;
										mp4Video.autoplay = true;
										mp4Video.play();

									}

									//// 我擔心「先後順訊會影響」，所以多次將「此影片」執行「切換為非靜音」
									targetVideo.mp4Video.muted = false;
									targetVideo.mp4Video.autoplay = true;
									targetVideo.mp4Video.play();

								}
							});

						}
	
					}

				} else {
					//// 假如沒有「傳入影片」，則挑選一隻「改為非靜音」，其他隻都保持靜音
					//// 挑選方式尚未決定

					let setVideoUnMuted = false;

					for ( let i = 0; i < aVideos.length; i++ ){

						let videoPlane = aVideos[i];
						let mp4Video = aVideos[i].mp4Video;
	
						let parentVisible = true;
						videoPlane.object3D.traverseAncestors( function(parent) {
							if (parent.type != "Scene"){
								// console.log("VRFunc.js: VRController: _UnMutedAndPlayAllVideo,: traverseAncestors: not Scene parent=", parent );
								if (parent.visible == false){
									parentVisible = false;
								}
							} else {
								//// 假如「已經找到場景本體」、「母體都可見」、「本體也可見」、「尚未設定一隻影片有聲音」，則設定「此影片」為「有聲音」，同時紀錄「已經設定過」
	
								console.log("VRFunc.js: _UnMutedAndPlayAllVideo: videoPlane =", i, parentVisible , videoPlane.object3D.visible, videoPlane );

								//// 這邊注意，要撇除「邏輯控制的影片」
								if (parentVisible == true && videoPlane.object3D.visible == true &&  !videoPlane.blockly ){
									
									if ( setVideoUnMuted == false ){
										console.log("VRFunc.js: _UnMutedAndPlayAllVideo: all parent visible true , _setVideoUnMuted false ", videoPlane.object3D );
									
										mp4Video.muted = false;
										mp4Video.autoplay = true;
										mp4Video.play();
										
										setVideoUnMuted = true;
									
									} else {
										console.log("VRFunc.js: _UnMutedAndPlayAllVideo: all parent visible true, _setVideoUnMuted true", videoPlane.object3D );
									
										mp4Video.muted = true;
										mp4Video.autoplay = true;
										mp4Video.play();
										
									}
								}
	
							}
						});	

					}

				}

			}

			////
			//// 切換觀看模式，目前有「VR」跟「模型觀看」 兩種
			//// 起始預設為「VR」模式 
			//// 假如「有指定觀看模式」，則切換。假如沒有輸入，則判斷當前模式，改為另一個
			////
			this.setViewMode = function( mode = '' ){

				let self = this;

				let pSet = new Promise( function( setModeResolve ){

					let aCamera = document.getElementById('aCamera');
					let oCamera = document.getElementById('oCamera');

					let aCameraObject = aCamera.getObject3D('camera');
					let oCameraObject = oCamera.getObject3D('camera');

					if ( aCamera && oCamera && aCameraObject && oCameraObject ){

						if ( mode == 'VR' ){

							oCamera.setAttribute('camera', 'active' , false );
							aCamera.setAttribute('camera', 'active' , true );		

							self.vrScene.camera = aCameraObject;

							self.viewMode = 'VR';
							if ( Number.isFinite( self.walkingStatus ) && self.walkingStatus != -1 ){
								let ground = document.getElementById('__ground');
								if ( ground ) ground.setAttribute('visible' , true );
							}

							setModeResolve( 'VR' );

						}else if ( mode == 'model' ){
							
							oCamera.setAttribute('camera', 'active' , true );
							aCamera.setAttribute('camera', 'active' , false );

							self.vrScene.camera = oCameraObject;

							self.viewMode = 'model';

							self.setWalkingObjVisible( false );

							setModeResolve( 'model' );

						}else{
							if ( oCamera.getAttribute('camera').active == false ){
							
								oCamera.setAttribute('camera', 'active' , true );
								aCamera.setAttribute('camera', 'active' , false );

								self.vrScene.camera = oCameraObject;

								self.viewMode = 'model';

								self.setWalkingObjVisible( false );
								
								setModeResolve( 'model' );
	
							} else if ( aCamera.getAttribute('camera').active == false ){
	
								oCamera.setAttribute('camera', 'active' , false );
								aCamera.setAttribute('camera', 'active' , true );		

								self.vrScene.camera = aCameraObject;

								self.viewMode = 'VR';

								if ( Number.isFinite( self.walkingStatus ) && self.walkingStatus != -1 ){
									let ground = document.getElementById('__ground');
									if ( ground ) ground.setAttribute('visible' , true );
								}

								setModeResolve( 'VR' );

							}else{
								setModeResolve( -1 );
							}	
						}
						
					}else{
						setModeResolve( -1 );
					}
				});

				return pSet;
			}



			////// 設計將 VR 專案中 cursor 的功能取消，改以點擊觸發。 
			////// 因為 VR 場景中目前不讓使用者以點擊或是滑鼠來操控物件，所以不需要額外判斷 look-control 開啟與否
			////// --------------------- debug --------------------------------

			this.getMakarObject = function( obj ){
				if (obj.makarObject != true){
					if ( obj.parent ){
						// console.log("obj.parent exist, goto");
						return ( self.getMakarObject( obj.parent ) );
					}else{
						// console.log("obj.parent not exist, return 0");
						return 0;
					}
				}else{
					// console.log("obj.makarObject == true, return", obj);
					return obj ;
				}
			}


			//// 依照「 obj_id 」 來判斷 「物件型態」為 「 2d / 3d 」
			this.getObjectTypeByObj_id = function( obj_id ){

				let self = this;

				let getObj3D = null;
				let getObj3DIndex = null;
				let getObj2D = null;
				let getObj2DIndex = null;

				//// 基本上沒有道理「同一個 obj_id 」同時在「 2d / 3d 物件」
				let getObj = {
					obj_type: '',
					obj_index: null,
					obj: null,
				}

				if ( obj_id ){

					self.makarObjects.forEach( (e,i) =>{
						if ( e.id == obj_id ){
							getObj3D = e;
							getObj3DIndex = i;
						}
					});

					//// 目前 VR 沒有 2D 界面 
					// if ( self.makarObjects2D ){
					// 	self.makarObjects2D.forEach( (e,i) =>{
					// 		if ( e.obj_id == obj_id ){
					// 			getObj2D = e;
					// 			getObj2DIndex = i;
					// 		}
					// 	});
					// }


					
					if ( ( getObj3D != null && getObj3DIndex != null ) || ( getObj2D != null && getObj2DIndex != null ) ){
						
						if ( getObj3D != null && getObj3DIndex != null ){
							console.log('_getObjectTypeByObj_id: 3d: ' , getObj3DIndex , getObj3D );
							getObj.obj_type = '3d';
							getObj.obj_index = getObj3DIndex;
							getObj.obj = getObj3D;

						}else if ( getObj2D != null && getObj2DIndex != null ){
							console.log('_getObjectTypeByObj_id: 2d: ' , getObj2DIndex , getObj2D );
							getObj.obj_type = '2d';
							getObj.obj_index = getObj2DIndex;
							getObj.obj = getObj2D;
							
						}else{
							console.log('_getObjectTypeByObj_id: fucking logic trouble.' , getObj2DIndex , getObj2D );
						}

					}else if ( ( getObj3D != null && getObj3DIndex != null ) && ( getObj2D != null && getObj2DIndex != null ) ){
						console.log('_getObjectTypeByObj_id: warning, both 2D/3D object get', obj_id , ', 3d:' , getObj3DIndex , getObj3D , ', 2d:' , getObj2DIndex , getObj2D );
						getObj.obj_type = '3d';
						getObj.obj_index = getObj3DIndex;
						getObj.obj = getObj3D;
					}else{

					}

				}

				return getObj;

			} 


			this.cameraMoveToPoint = function( paraemter ){

				
				let pointerSphere = document.getElementById('pointerSphere');
				let currentPosSphere = document.getElementById('currentPosSphere');

				if ( !pointerSphere || !currentPosSphere ){
					return;
				}


				let pMove = new Promise(function(resolve, reject){
					
					let pointPosition = paraemter.position;
					let px = Math.round(pointPosition.x * 1000) / 1000;
					let py = Math.round(pointPosition.y * 1000) / 1000;
					let pz = Math.round(pointPosition.z * 1000) / 1000;

					//// 隱藏「選定目標位置」
					pointerSphere.setAttribute("visible", false);

					//// 設定「目標相機位置」
					currentPosSphere.setAttribute("visible", true );
					currentPosSphere.object3D.position.set( px , py , pz );


					let ox = self.vrScene.camera.el.object3D.position.x;
					let oy = self.vrScene.camera.el.object3D.position.y;
					let oz = self.vrScene.camera.el.object3D.position.z;

					let direction = new THREE.Vector3(px - ox, py - oy, pz - oz);
					let direction_normalized = new THREE.Vector3(px - ox, 0, pz - oz).normalize();

					let duration = Math.round(direction.length()) * 0.2;
					// console.log(' _duration: ', duration );
					
					duration = duration > 1 ? 1 : duration;
					

					let boundRaycaster = new THREE.Raycaster(self.vrScene.camera.el.object3D.position, direction_normalized);
					if (paraemter.dealBoundary == true){
						let boundIntersect = boundRaycaster.intersectObjects( boundaries, true);
						if (boundIntersect.length > 0) {
							console.log("_cameraMoveToPoint: initial position hit boundary, distance ", boundIntersect[0].distance );
							if (boundIntersect[0].distance < 1) {
								console.log("_cameraMoveToPoint: initial position hit boundary, dont run  ");

								//// 設定「目標相機位置」
								currentPosSphere.object3D.position.copy( self.vrScene.camera.el.object3D.position );
								resolve( 1 );
								return;
							}
						}
					}
					

					let tl = gsap.timeline();
					tl.to( gsapEmpty, {
						duration: duration,
						delay: 0,
						onStart: function(){

						},
						onUpdate: function(){
							let animePos = new THREE.Vector3(ox + direction.x * this.ratio , oy, oz + direction.z * this.ratio );

							if (paraemter.dealBoundary == true){
								let boundIntersect = boundRaycaster.intersectObjects( boundaries, true);
								if (boundIntersect.length > 0) {
									// console.log(" _cameraMoveToPoint: boundIntersect=", boundIntersect[0] );
									//// 假如與『相機與邊界的距離』小於『相機要設置下一步的距離』，不應該再往前位移
									if (boundIntersect[0].distance < animePos.distanceTo( self.vrScene.camera.el.object3D.position ) ) {
									// if (boundIntersect[0].distance < 1) {

										//// 設定「目標相機位置」
										currentPosSphere.object3D.position.copy( animePos );

										tl.pause();
										tl.kill();
										tl = null;

										resolve( 1 );
										return;
									}
								}
							}

							self.vrScene.camera.el.object3D.position.set(animePos.x, animePos.y, animePos.z);
							
						},
						onComplete: function(){

							resolve( duration );

						}

					});

				});	

				return pMove;

			}

			//// 設定「點擊移動」狀態， -1: 未啟動 , 0: 已啟動,  1. 移動中。
			this.setWalkingStatus = function( _value ){

				let self = this;

				if ( Number.isFinite( self.walkingStatus ) ){
					console.log(' _setWalkingStatus: set from [', self.walkingStatus , ']', ' to [', _value, ']' );

					let ground = document.getElementById('__ground');
					let pointerSphere = document.getElementById('pointerSphere');
					let currentPosSphere = document.getElementById('currentPosSphere');

					if ( self.walkingStatus == 0 || self.walkingStatus == -1 ){
						self.walkingStatus = _value;
					}

					if ( self.walkingStatus == -1 ){
						if ( pointerSphere && currentPosSphere && ground ){
							// ground.setAttribute("visible", false );
							// pointerSphere.setAttribute("visible", false );
							// currentPosSphere.setAttribute("visible", false );
							self.setWalkingObjVisible( false );
						}
					}

					if ( self.walkingStatus == 0 ){
						if ( ground){
							ground.setAttribute("visible", true );
						}
					}

				}else{
					console.log(' _setWalkingStatus: status not exist ', self.walkingStatus );
				}

			}


			this.setWalkingObjVisible = function( _status ){

				let ground = document.getElementById('__ground');
				let pointerSphere = document.getElementById('pointerSphere');
				let currentPosSphere = document.getElementById('currentPosSphere'); 

				if ( ground && pointerSphere && currentPosSphere ){
					if ( _status == true ){
						ground.setAttribute("visible", true );
						pointerSphere.setAttribute("visible", true );
						currentPosSphere.setAttribute("visible", true );
					}else{
						ground.setAttribute("visible", false );
						pointerSphere.setAttribute("visible", false );
						currentPosSphere.setAttribute("visible", false );
					}
				}
			}


			self.vrScene.canvas.addEventListener("touchstart", startEvent, false);
			self.vrScene.canvas.addEventListener("mousedown", startEvent, false);

			self.vrScene.canvas.addEventListener("touchmove", moveEvent, false);
			self.vrScene.canvas.addEventListener("mousemove", moveEvent, false);

			self.vrScene.canvas.addEventListener("touchend", endEvent, false);
			self.vrScene.canvas.addEventListener("mouseup", endEvent, false);

			//////
			////// raycaster for touch and mouse 
			//////
			let preMouse = new THREE.Vector2();
			var mouse = new THREE.Vector2();
			var raycaster = new THREE.Raycaster();

			function getMouse(event){
				let rect = self.GLRenderer.domElement.getBoundingClientRect();

				switch ( event.type ) {
					case "mouseup":
					case "mousemove":
					case "mousedown":
						mouse.x = ( (event.clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
						mouse.y = - ( (event.clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
						break;
					case "touchend":////// 20190709 Fei: add this event type for cellphone
					case "touchstart":
					case "touchmove":
						mouse.x = ( (event.changedTouches[0].clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
						mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
						break;
					default:
						console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
						return ;
				}
				return mouse.clone();
			}

			function startEvent(event){
				preMouse = getMouse(event);

				self.touchMouseState = 0;
			}

			function moveEvent(event){
				
				// console.log(' _mv ' , self.touchMouseState  );
				let moveMouse = getMouse(event);
				
				if (self.touchMouseState == 0 ){
					
					if ( moveMouse.sub(preMouse).length() > 0.01 ){
						self.touchMouseState = 1;					
					}
					// console.log("VRFunc.js: moveEvent: ", moveMouse.sub(preMouse).length()  );
				}else{
					self.touchMouseState = 1;

				}

				let ground = document.getElementById('__ground');
				let pointerSphere = document.getElementById('pointerSphere');

				if ( pointerSphere && ground ){

					if ( self.touchMouseState == 0 || self.touchMouseState == 1 ){
				
						if (!self.triggerEnable){
							return;
						}
						//// 處理「點擊移動功能」，必須要 觀看模式 為 VR 且，啟動「可移動」
						if ( self.viewMode == 'VR' && Number.isInteger (self.walkingStatus) && self.walkingStatus >= 0  ){
							
							
							if ( Array.isArray( self.currentSceneMakarObjects ) && self.currentSceneMakarObjects.length > 0  ){

							}else{
								
								for ( let i = 0; i < self.makarObjects.length; i++ ){
									let makarObject = self.makarObjects[i];
									if ( makarObject.object3D && makarObject.className == "clickable" ){

										let parentVisible = true;
										makarObject.object3D.traverseAncestors( function(parent) {
											if (parent.type != "Scene"){
												if (parent.visible == false){
													parentVisible = false;
												}
											}
										});

										if (parentVisible){
											self.currentSceneMakarObjects.push(makarObject.object3D );
										}
										
									}
								}
								self.currentSceneMakarObjects.push( ground.object3D );
							}

							let makarTHREEObjects = self.currentSceneMakarObjects;
							let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];

							let selectedObjWithBehav = false;

							raycaster.setFromCamera( moveMouse , self.vrScene.camera );
		
							let groundIntersect = raycaster.intersectObjects( makarTHREEObjects , true ); 
							if (groundIntersect.length > 0){
								
								//// 判斷是否有點集到「有事件的物件」
								// groundIntersect.forEach( ( e , i ) => {

								// 	if ( e.object && e.object.el && e.object.el.id && e.object.el.object3D && Array.isArray( e.object.el.object3D.behav )  ){
								// 		// console.log(' _moveEvent: ' , i, e.object.el.id, e.object.el.object3D.behav );

								// 		for ( let j = 0; j < e.object.el.object3D.behav.length; j++ ){
								// 			if ( showEventStrList.filter( ev => ev == e.object.el.object3D.behav[j].simple_behav ).length > 0 ){
								// 				selectedObjWithBehav = true;
								// 			}
								// 		}
								// 	}

								// });
								
								// console.log(' _moveEvent: _selectedObjWithBehav ' , selectedObjWithBehav );

								//// 假如當前指向的物件不是地板，則不顯示
								if ( selectedObjWithBehav == true || ( groundIntersect[0].object && groundIntersect[0].object.el && groundIntersect[0].object.el != ground ) ){
									pointerSphere.setAttribute("visible", false );
									// pointerSphere.object3D.position.copy(groundIntersect[0].point);
								}else{
									pointerSphere.setAttribute("visible", true );
									pointerSphere.object3D.position.copy(groundIntersect[0].point);
								}

							}
						}
	
					}else{
						pointerSphere.setAttribute("visible", false);
					}

				}
				
				


			}

			function endEvent( event ) {

				// console.log("VRFunc.js: _setupFunction: endEvent: event=", event , self.triggerEnable , self.touchMouseState );

				if (!self.triggerEnable){
					return;
				}
				if (self.touchMouseState == 1){
					//// 假如 是手機，「觸碰結束」，要把手指指到的位置刪除
					if ( event.type == 'touchend' ){
						let pointerSphere = document.getElementById('pointerSphere');
						if ( pointerSphere )  pointerSphere.setAttribute("visible", false);

					}
					return;
				}

				self.touchMouseState = 2;
				
				
				event.preventDefault(); ////// if not set this, on mobile will trigger twice 
				let rect = self.GLRenderer.domElement.getBoundingClientRect();
				switch ( event.type ) {
					case "mouseup":
						mouse.x = ( (event.clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
						mouse.y = - ( (event.clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
						break;
					case "touchend":////// 20190709 Fei: add this event type for cellphone
						mouse.x = ( (event.changedTouches[0].clientX - rect.left) / self.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
						mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / self.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
						break;
					default:
						console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
						return ;
				}
				// console.log("VRFunc.js: _setupFunction: endEvent, mouse=", mouse  );

				//// 紀錄此次點擊是否有「觸發事件」，不論是「2D」「3D」「點擊事件」「邏輯功能」
				let eventTriggered = {};

				////// for the 3D scene part
				let makarTHREEObjects = [];
				for ( let i = 0; i < self.makarObjects.length; i++ ){
					let makarObject = self.makarObjects[i];
					if ( makarObject.object3D && makarObject.className == "clickable" ){

						let parentVisible = true;
						makarObject.object3D.traverseAncestors( function(parent) {
							if (parent.type != "Scene"){
								if (parent.visible == false){
									parentVisible = false;
								}
							}
						});

						if (parentVisible){
							makarTHREEObjects.push(makarObject.object3D );
						}
							

					}
				}

				raycaster.setFromCamera( mouse, self.vrScene.camera );
				let intersects = raycaster.intersectObjects(  makarTHREEObjects, true ); 
				// console.log("VRFunc.js: _setupFunction: endEvent, intersects=", intersects , makarTHREEObjects , self.makarObjects );

				//// 為了「移動功能」的判斷，只要觸發「邏輯事件」或是「觸發事件」則不執行「移動」
				let objectWithLogicEvent = false;
				let objectWithClickEvent = false;

				if (intersects.length != 0 ){
					console.log("VRFunc.js: _setupFunction: 1 endEvent, intersects=", intersects );

					let touchObject = self.getMakarObject( intersects[0].object );
					// console.log("VRFunc.js: _setupFunction: endEvent, touchObject.behav=", touchObject.behav );
					// ------
					let intersectObject3D = touchObject.el ;
					if ( intersectObject3D ) {
						if(intersectObject3D.onclickBlock){	

							objectWithLogicEvent = true;

							for(let i = 0; i < intersectObject3D.onclickBlock.length; i++){
								if(intersectObject3D.onclickBlockState[i]){
									intersectObject3D.onclickBlockState[i] = false;
									if ( vrController.logic ){
										vrController.logic.parseBlock( intersectObject3D.onclickBlock[i], function(){
											intersectObject3D.onclickBlockState[i] = true;
										} ) ; 
										
										//// 紀錄觸發到的事件
										eventTriggered['3d_logic'] = intersectObject3D.onclickBlock[i] ;
									}
								}
							}
							
						}
					}
					// ------

//[start-20200915- fei 0101-add]//
					// console.log("VRFunc.js: _setupFunction: endEvent, touchObject.behav=", touchObject );
					touchObject.traverse(function(child){
						if (child.isMesh){
							// console.log("VRFunc.js: _setupFunction: endEvent, child = " , child );
						}

					});

//[end---20200915- fei 0101-add]//

					if (touchObject.behav){
						// self.triggerEvent( touchObject.behav[0] ); // 20190827: add the parameter obj( makarObject)
						// return;

						//// 處理所有群組相關事件，目前只處理「顯示/隱藏 相關功能」，其他功能比如 「切換動畫」等之後等定義明確後再執行
						//// 未來會有 2D/3D 物件，也一並於此處理
						self.dealAllGroupHide( touchObject );


						let reset = false;
						for(let i = 0; i < touchObject.behav.length; i++){
							if (touchObject.behav[i].simple_behav == "CloseAndResetChildren"){
								reset = true;
							}
						}
						for(let i = 0; i < touchObject.behav.length; i++){
							if (touchObject.behav[i].simple_behav != "CloseAndResetChildren"){

								//[start-20230920-howardhsu-modify]//	
								if(touchObject.behav[i].simple_behav == "ShowQuiz"){
									
									//// 顯示 quiz 之前，先判斷 "瀏覽器本次載入場景後" 是否已經遊玩
									if(touchObject.behav[i].played == false){
										touchObject.behav[i].played = true	
										self.triggerEvent( touchObject.behav[i], reset, touchObject )
									} else {
										console.log('VRFunc.js: _setupFunction: endEvent:  Quiz had been played.', touchObject.behav[i].played)
									}

								} else {
									console.log("behav=", touchObject.behav[i] )
									self.triggerEvent( touchObject.behav[i], reset, self.GLRenderer, null, touchObject );
								}
								//[end-20230920-howardhsu-modify]//	

							}

							if ( touchObject.behav[i].simple_behav != 'FingerGesture' && touchObject.behav[i].simple_behav != 'LookAt' ){
								objectWithClickEvent = true;

								//// 紀錄觸發到的事件
								eventTriggered['3d_behav'] = touchObject.behav ;
							}

							//[start-20230920-howardhsu-modify]//	
							if(touchObject.behav[i].simple_behav == "PushButton"){
								//// 紀錄觸發到的事件
								eventTriggered['3d_quizButton'] = touchObject ;
							}
							//[end-20230920-howardhsu-modify]//	
						}

					}

				}

				//// 假如「點擊觸發事件」跟「邏輯點擊」都沒有執行則判斷是否「點擊地板移動」
				console.log(' event logic check: ', objectWithLogicEvent , objectWithClickEvent );
				if (  objectWithLogicEvent == false && objectWithClickEvent == false ){
					// console.log(' both pass ', self.walkingStatus , self.viewMode );
					//// 先判斷是否有使用走動功能
					//// 也只有「VR觀看模式」可以使用
					if (  Number.isInteger (self.walkingStatus) && self.viewMode == 'VR' ){
						//// 只有在待命狀態，才能觸發移動
						if ( self.walkingStatus == 0 ){

							let ground = document.getElementById('__ground');
							let intersects = raycaster.intersectObjects( [ ground.object3D ], true ); 

							if ( intersects.length > 0 ){
								let selectedObject = intersects[0].object;

								console.log(' selectedObject ', selectedObject );
								
								if ( selectedObject.el ){
									if (selectedObject.el.getAttribute("id") == "__ground" ){
										console.log(' _endEvent: object is ground ');

										self.walkingStatus = 1;
										let pmd = self.cameraMoveToPoint( {position: intersects[0].point, dealBoundary: false } );
										pmd.then( function(){
											//// 將狀態設回來 
											self.walkingStatus = 0;
										});

										//// 紀錄觸發到的事件
										eventTriggered['ground_move'] = selectedObject ;
		
									}else{
										console.log(' _endEvent: object is not ground ');
									}
								}else{
									console.log(' _endEvent: object without el ');
								}
							}

						}else if ( self.walkingStatus == -1 ){
							console.log(' _endEvent: _walkingStatus =-1')
						}else if ( self.walkingStatus == 1 ){
							console.log(' _endEvent: _walkingStatus = 1')
						}

					}

				}

				//// 判斷點擊是否有「觸發事件」，沒有的話，判斷
				if ( Object.keys( eventTriggered ).length == 0 ){
					console.log(' _entEvent: not touch anything ');
					
					if ( parent && parent.projMenuGroup && parent.controlGroup && parent.pictureBackground && parent.projectUIController && 
						typeof(parent.projectUIController.showUI) == 'function' && typeof( parent.projectUIController.hideUI ) == 'function' 
					){
						if ( parent.projectUIController.status == 1){
							//// 假如當前狀態是「顯示」，判斷是否超過一定時間，超過的話延續，還未到的話執行「隱藏」
							if ( parent.projectUIController.g_tl_show._time > 3 ){
								parent.projectUIController.showUI();
							}else{
								parent.projectUIController.hideUI();
							}
						}else if ( parent.projectUIController.status == 0 ) {
							parent.projectUIController.showUI();
						}else{
							parent.projectUIController.showUI();
						}
					}

				}else{
					console.log(' _entEvent:  touch somethong ', eventTriggered );
				}

			}


		}

		VRController.prototype.triggerEvent = function( event, reset, GLRenderer, arScene, makarObj ){
			if (!this.FUNCTION_ENABLED){
				return;
			}
			var self = this;
			let obj_id
			let target;
			switch ( event.simple_behav ){
				case "PhoneCall":
					console.log("VRFunc.js: triggerEvent: PhoneCall: event=", event );	
					let telTag = window.document.getElementById("phoneCall");
					telTag.href = "tel:"+event.phone ;
					telTag.click();
					break;

				case "SendEmail": 
					console.log("VRFunc.js: triggerEvent: SendEmail: event=", event );	
					let mailTag = window.document.getElementById("sendEmail");
					mailTag.href = "mailto:" + event.mail_to ;
					mailTag.click();
					break;

				case "OpenWebPage":
					console.log("VRFunc.js: triggerEvent: OpenWebPage: event=", event , event.url );	
					let webTag = window.document.getElementById("openWebBrowser");
					webTag.href = event.url ;
					webTag.click();
					console.log("VRFunc.js: triggerEvent: OpenWebPage: webTag=", webTag );	
					break;

				case "SceneChange":
					console.log("VRFunc.js: triggerEvent: SceneChange: event=", event );

					let sceneID = event.scene_id;

					let idx = self.projectIdx;
					for (let i = 0;i<VRSceneResult[idx].scenes.length;i++){
						if(VRSceneResult[idx].scenes[i].scene_id == sceneID){
							// window.activeVRScenes(i,j);
							//// 先將觸控關閉，再跳轉場景
							self.triggerEnable = false;
							loadPage.style.display = "block";

							if ( typeof( self.loadingTickOn )  != undefined ){
								self.loadingTickOn = true;
							}

							self.loadScene(idx,i);

						}
					}
//20200807-thonsha-mod-end
					//20191023-end-thonsha-add
					break;

				case "ShowImage":
					console.log("VRFunc.js: triggerEvent: ShowImage: event=", event );	
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);
					// console.log(target)

					self.showObjectEvent(target, reset);

					break;
				case "ShowText":
					console.log("VRFunc.js: triggerEvent: ShowText: event=", event );	
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);
					
					//// 同時要處理 reset  子物件 影片播放 聲音播放
					self.showObjectEvent(target, reset);	
					break;
				
				case "ShowModel":
					console.log("VRFunc.js: triggerEvent: ShowModel: event=", event );	
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);

					self.showObjectEvent(target, reset);

					break;

				case "PlayMusic":
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);

					if (!target){
						console.log('VRFunc.js: _PlayMusic: target not exist', target);
						break;
					}

					console.log("VRFunc.js: triggerEvent: PlayMusic: event=", event );

					if(target.getAttribute("visible")){
						target.setAttribute("visible",false);
						target.setAttribute('class', "unclickable" );
						// target.components.sound.pauseSound();
						target.components.sound.stopSound();
					}
					else{
						target.setAttribute("visible",true);
						if(target.object3D.behav){
							target.setAttribute('class', "clickable" );
						}
						// target.components.sound.playSound();

						target.components.sound.playSound();

					}

					break;
					
				case "ShowVideo":
					console.log("VRFunc.js: triggerEvent: ShowVideo: event=", event );	
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);
					// console.log(target)

					self.showObjectEvent(target, reset);

					break;
				
				case "PlayAnimation":
					
					console.log("VRFunc.js: triggerEvent: _PlayAnimation: event=", event );	
					obj_id = event.obj_id;
					target = document.getElementById(obj_id);

					if (!target){
						console.log('VRFunc.js: _PlayAnimation: target not exist', target);
						break;
					}
					
					var mainAnimation;
					for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
						if (target.object3D.children[0].animationSlices[i].uid == event.uid){
							mainAnimation = target.object3D.children[0].animationSlices[i].animationName;
						}
					}
					target.setAttribute("animation-mixer", "clip: "+mainAnimation);

					if(event.loop){
						target.object3D.children[0].animationSlices[0].loop = event.uid;
						// target.object3D.children[0].animationSlices[0].idle = event.uid;
						target.object3D.children[0].animationSlices[0].uid = event.uid;
						target.object3D.children[0].animationSlices[0].changed = true;
						target.object3D.children[0].animationSlices[0].reset = true;
						// target.setAttribute('class', "unclickable" );
					}
					else{
						target.object3D.children[0].animationSlices[0].uid = event.uid;
						target.object3D.children[0].animationSlices[0].changed = true;
						target.object3D.children[0].animationSlices[0].reset = event.reset;
					}

					break;

				case "ReadText":
					console.log("VRFunc.js: _ReadText: ", event );
					//// 找到對應的文字物件
					if ( event.obj_id ){
						let textObjID = event.obj_id;
						let idx = self.projectIdx;

						if ( VRSceneResult && VRSceneResult[idx] && VRSceneResult[idx].scenes[ self.sceneIndex ] && Array.isArray( VRSceneResult[idx].scenes[ self.sceneIndex ].objs ) ){
							VRSceneResult[idx].scenes[ self.sceneIndex ].objs.forEach( e =>{
								if ( e.obj_id == textObjID  ){
									self.speechTextObj( e );
								}
							});
						}
					}

					break;

				//[start-20230920-howardhsu-add]//
				case "ShowQuiz":
					//// 顯示問答初始頁面 "點擊開始遊玩"
					let startQuiz = document.getElementById("startQuiz")				
					startQuiz.style.display = "block"
					break

				case "PushButton":
					//// 看起來會用到原本pushButton函式的只有問答
					quiz.pushButton( makarObj.el )				
					break					
				//[end-20230920-howardhsu-add]//
				default:
					console.log("VRFunc.js: triggerEvent: default: event=", event );	

					break;
			}

		}


		VRController.prototype.getSnapShot = function(){

			let self = this;

			let pSnapShot = new Promise( function( snapResolve ){

				if (!self.FUNCTION_ENABLED){
					snapResolve( -1 ); 
					return;
				}

				if ( !self || !self.GLRenderer || !self.vrScene || !self.GLRenderer.domElement || !self.vrScene.object3D ||
					!self.GLRenderer.domElement.clientWidth || !self.GLRenderer.domElement.clientHeight || 
					!self.GLRenderer.domElement.width || !self.GLRenderer.domElement.height 
				){
					console.log(' _VRController: _getSnapShot: something error ', self );
					snapResolve( -1 );
					return;
				}
	
				self.GLRenderer.clearDepth();
				self.GLRenderer.render( self.vrScene.object3D, self.vrScene.camera );
				
				// let size = self.GLRenderer.getSize();
	
				let dataURL = self.GLRenderer.domElement.toDataURL("image/png", 1.0);
	
				//// 改變 canvas，必須的。讓圖片原版比例改變。
				// let ccw = self.GLRenderer.domElement.clientWidth;
				// let cch = self.GLRenderer.domElement.clientHeight;
				// let cw = self.GLRenderer.domElement.width;
				// let ch = self.GLRenderer.domElement.height;
	
				// console.log('XRFunc.js: _SnapShot: canvas client wh= ',  ccw, cch, 'canvas wh=', cw, ch );
				// let newCanvas = document.createElement('canvas');
				// newCanvas.width = cw;
				// newCanvas.height = cw * ( cch / ccw );
				// let newCtx = newCanvas.getContext('2d');
				// newCtx.drawImage(self.GLRenderer.domElement, 0, 0, cw, ch, 0, 0, newCanvas.width , newCanvas.height );
				// var dataURL = newCanvas.toDataURL("image/png", 1.0);
	
	
				snapResolve( dataURL ) ; 

			} );

			return pSnapShot ;

		}


		//////
		////// just update the VRController, not the renderer, so it is not consistent with renderer
		//////
		// VRController.prototype.update = function(){
		// 	if (!this.FUNCTION_ENABLED){
		// 		return;
		// 	}
		// 	var self = this;
			
		// 	this.delta = this.clock.getDelta() * 1;
		// 	this.time = this.clock.elapsedTime * 1;
			
		// 	// console.log("VRFunc.js: VRController update: this.time = ", this.time, this.delta, this.vrScene.delta );
		// 	// console.log("VRFunc.js: VRController update: self.vrScene = ", self.vrScene );

		// 	for ( let i = 0; i < self.makarObjects.length; i++ ){
		// 		let makarObject = self.makarObjects[i];
		// 		if ( makarObject.object3D ){
		// 			if ( makarObject.object3D.makarObject ){
		// 				if ( makarObject.object3D.children ){
		// 					if ( makarObject.object3D.children[0] ){ // it must have only one child. 

		// 						// console.log("VRFunc.js: VRController update: makarObject, model = ", makarObject.object3D.children[0] );
		// 						self.checkAnimation( makarObject.object3D.children[0], this.delta );

		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		// 	setTimeout(  function(){
		// 		self.update();
		// 	},  this.vrScene.delta );


			
		// 	// let tstart = new Date().getTime();
		// 	////// do something

		// 	// let tend = new Date().getTime(); // small to millisecond
		// 	// let td = 30;
		// 	// if ( (tend-tstart) < 30 ) td = 30 - (tend - tstart)+1;
		// 	// else td = 1;

			
		// 	// setTimeout( this.update() );
		// }

		// }

//[start-20191111-fei0079-add]//
        var checkHost_tick = function() {
            if ( typeof(checkHost) != "undefined" ){
                if ( checkHost == "yet" ){
                    // console.log("VRFunc.js: checkHost = yet");
                    setTimeout(checkHost_tick, 50);
                }else{
                    if ( checkHost == "correct" ){
                        console.log("VRFunc.js: _checkHost_tick correct");
                    } else if ( checkHost == "fail" ){
                        //// remove all childrens of documnet
                        while (document.body.firstChild) {
                            document.body.removeChild(document.body.firstChild);
                        }
                        //// add the warning about Host
                        var divHostWarn = document.createElement('div');
                        divHostWarn.innerHTML = "<br>The host of webVR seems unauthorized,<br> please contact MIFLY ";
                        divHostWarn.style.fontSize = "18px";
                        divHostWarn.style.margin = "5px";
                        divHostWarn.style.fontWeight = "700";
                        document.body.append( divHostWarn );
                    }
                }
            } else {
                console.log("VRFunc.js: checkHost = undefined, something ERROR.");
                // setTimeout(checkHost_tick, 50);
            }
        };
		checkHost_tick();
		Module.checkMifly();
//[end---20191111-fei0079-add]//

		function forbidden( message ){
			if (document.getElementById("freeUserWarnDiv")){
				document.getElementById("freeUserWarnDiv").style.display = "block";
				document.getElementById("pUserInfo").textContent = message;
				// document.getElementById("pUserInfo").style.color = "red";
				leaveIframe.onclick = function(event){
					event.preventDefault();
					if (parent.aUI){
						// parent.aUI.closeCoreIframe();
					}
				}
			}
		}


		window.showVRProjList = function(){

			console.log('VRFunc.js: version: 2022-07-28 1650 ');

//20200102-start-thonsha-add
			// requestDeviceMotionPermission();
//20200102-end-thonsha-add
			let url = window.serverUrl;
			let makarID;

//[start-20200211-fei0090-add]//
			////// 
			////// the user_id and project from main page
			//////

			////// check the webpage is iframe or not
			if ( window.top != window.self || true ){ 
				// console.log("__VRFunc.js: _showVRProjList: _getVRSceneByUserID: parent selectedProject=", parent.selectedProject , ", _userPublishProjs=" , parent._userPublishProjs);
				
				
				makarID = parent.selectedProject.user_id;
				
				//// 這邊指定「userID」
				// makarID = "thonsha" ;
				// makarID = "fefe" ;
				// makarID = "class05" ;
				// makarID = "1626f751-f2d6-4416-8e54-a1cb6b32f870" ;


				console.log("VRFunc.js: _showVRProjList: : makarID=", makarID);
				getVRSceneByUserID(url, makarID, function(data){

					console.log("VRFunc.js: _showVRProjList: _getVRSceneByUserID: VRSceneResult=", VRSceneResult , publishVRProjs , userPublishProjs );				
					
					if (typeof(data) == "string"){ // error occur
						str = data;
						if (document.getElementById("freeUserWarnDiv")){
							document.getElementById("freeUserWarnDiv").style.display = "block";
							document.getElementById("pUserInfo").textContent =  str  ;
							// document.getElementById("pUserInfo").style.color = "red";
							leaveIframe.onclick = function(){
								event.preventDefault();
								if (parent.aUI){
									// parent.aUI.closeCoreIframe();
								}
							}
						}

					}else{ // general state.
						if (document.getElementById("freeUserWarnDiv")){
							document.getElementById("freeUserWarnDiv").style.display = "none";
						}
						for (let i = 0 ; i < publishVRProjs.result.length ; i++  ){
							
							if (publishVRProjs.result[i].proj_id == parent.selectedProject.proj_id ){
								console.log("VRFunc.js: _showVRProjList: _getVRSceneByUserID: i=", i , publishVRProjs.result[i] , VRSceneResult[i] );		


								////// 假如判定為『不可使用web服務』的帳號，多判斷所選的專案是否帶有 license，假如有license 且沒有過期，則可以使用。
								if (window.allowedMakarIDUseWeb == false ){
								// if (window.allowedMakarIDUseWeb == false && false ){

									for ( let j = 0; j < userPublishProjs.proj_list.length; j++ ){
										//// 找到「對應的專案」
										if ( publishVRProjs.result[i].proj_name.toLowerCase() == userPublishProjs.proj_list[j].proj_name.toLowerCase()  ){											
											if ( userPublishProjs.proj_list[j].web_ar == true ){
												console.log("VRFunc.js: _showVRProjList: _getVRSceneByUserID( allow by license ): i=", i );
												
												activeVRScenes(i);
												// vrUI.setProjectTable();
											
											}else{
												forbidden( "this ID <br> [" + makarID + "] <br> is free user, not allow to use webVR" );
											}

											break;
										}
									}

									// forbidden( "this ID <br> [" + makarID + "] <br> is free user, not allow to use webVR" );

								}else{

									console.log("VRFunc.js: _showVRProjList: _getVRSceneByUserID( allow by user ): i=", i );

									activeVRScenes(i);
									// vrUI.setProjectTable();
								}
							}


							//// 這邊指定專案名稱
							// // if ( publishVRProjs.result[i].proj_name == "logicTest" ){
							// if ( publishVRProjs.result[i].proj_name == "log_1" ){
							// // if ( publishVRProjs.result[i].proj_name == "t1" ){
							// 	activeVRScenes( i );
							// }

						}
						

					}
				});
							
			}


			
//[end---20200211-fei0090-add]//
	
		};
	
		window.activeVRScenes = function( projIndex, sceneIndex=0){

			////// remove the video tag, and clean the memory, must be done before remove the div 
			let videos = document.getElementsByTagName("video");
			if ( videos.length > 0 ){
				for (let i = 0; i < videos.length; i++ ){
					videos[i].pause();
					videos[i].removeAttribute("src"); // empty source 	
					videos[i].load();
				}
			}
			
			////// set the same id=vrDiv, if load the different VR project, remove the div after remove video.
			if (document.getElementById("vrDiv")){
				document.getElementById("vrDiv").remove();
			}
 
			let vrDiv;
			////// set the aframe scene
			let vrScene = document.createElement('a-scene');
			vrScene.setAttribute('id', "vrscene" ); ////// just id
			vrScene.setAttribute('crossorigin', 'anonymous');

			vrScene.setAttribute( 'embedded', "" ); ////// add this will make the scene embedded into a div
			vrScene.setAttribute( 'vr-mode-ui', "enabled: false" ); ////// disable and hide the VR button
			vrScene.setAttribute( 'debug', "true" ); ////// disable and hide the VR button

			// vrScene.setAttribute( 'device-orientation-permission-ui', "enabled: false" );

			////// set a div above a-scene, must set one of width/height be "xxx px" 
			vrDiv = document.createElement('div');
			vrDiv.style.position = "relative" ;    //  "500px" or "80%"
			vrDiv.setAttribute('id', "vrDiv" ); ////// set the same id, if load the different VR project, remove the div first.
			vrDiv.setAttribute('crossorigin', 'anonymous');

			// console.log("VRFunc.js: activeVRScenes: documentDE.WH=", document.documentElement.clientWidth, document.documentElement.clientHeight);

			// vrDiv.style.width  = Math.round(document.documentElement.clientWidth *1.0 ) + "px" ;    //  "500px" or "80%"
			// vrDiv.style.height = Math.round(document.documentElement.clientHeight*0.9 ) + "px" ;//  "500px" or "80%"
			
			vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or "100%"
			vrDiv.style.height = Math.round(document.documentElement.clientHeight - 0) + "px" ;//  "500px" or "80%"

			// vrDiv.style.left = window.innerWidth*0.1+"px" ; //
			vrDiv.style.top = "0px" ; //
			window.onresize = function(){
				// console.log("window resize: WH=", window.innerWidth, window.innerHeight, vrDiv.clientWidth, vrDiv.clientHeight );
				vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or "100%"
				vrDiv.style.height = Math.round(document.documentElement.clientHeight - 0) + "px" ;//  "500px" or "80%"
			};
			document.body.appendChild(vrDiv);
			vrDiv.appendChild(vrScene);
		
			
	
			if (vrScene.hasLoaded) {
				initvrscene();
			} else {
				vrScene.addEventListener('loaded', initvrscene);
			}
	
			vrScene.addEventListener('enter-vr', function(){
				// console.log("VRFunc.js: vrScene enter-vr");
			});
			vrScene.addEventListener('renderstart', function(){
				// console.log("VRFunc.js: vrScene renderstart");
			});
			
			
			//////
			////// server V3 
			//////
	
			let vrController = new VRController();
			vrController.VRSceneResult = VRSceneResult;
			vrController.publishVRProjs = publishVRProjs;

			///// 3.5.0 Data 
			let new_proj = {
				"proj_id": "018966d4-ee1e-8ca8-85aa-cb1a3c1fcef8",
				"proj_name": "\\u0032\\u0030\\u0032\\u0033\\u002D\\u0030\\u0037\\u002D\\u0031\\u0038\\u002D\\u0030\\u0032",
				"user_id": "miflytest",
				"proj_type": "vr",
				"proj_descr": "",
				"snapshot_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/ProjectSnapshot/31e1a7eb6bea4fd5b415c55c1738fa6a_snapshot.jpg",
				"proj_cover_urls": [],
				"proj_platform": [
					"app"
				],
				"create_date": "2023-07-18T02:29:37.948Z",
				"last_update_date": "2023-07-18T02:29:37.948Z",
				"proj_size": "0",
				"permission": 1,
				"permission_friend": [],
				"tags": [],
				"category": [],
				"module_type": [],
				"xml_urls": [
					"https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/c51d6028-50e6-44df-8dbc-6864a27c17d2.xml",
					"https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/035d0108-ba94-4b68-b088-ffa9cd8c3006.xml"
				],
				"loc": [],
				"target_ids": [],
				"editor_license_key": "",	
				"editor_ver": "3.4.5"
			}
			let new_scene = {
				"editor_ver": "3.4.5",				
				"scenes": [
					{
						"info": {
							"id": "\\u0031\\u0066\\u0063\\u0034\\u0034\\u0039\\u0065\\u0030\\u0032\\u0066\\u0063\\u0033\\u0034\\u0037\\u0033\\u0064\\u0061\\u0064\\u0037\\u0033\\u0038\\u0064\\u0061\\u0039\\u0062\\u0063\\u0035\\u0038\\u0030\\u0033\\u0033\\u0037",
							"name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
							"size": 0
						},
						"environment": {
							"shader": "Skybox/Panoramic",
							"scene_skybox_res_id": "SphericalImage",
							"scene_skybox_snapshot_4096": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/VRProjectMipmap/412918e164d54e6696a465fba025f494_4096.jpg",
							"scene_skybox_snapshot_2048": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/VRProjectMipmap/f91d71ef9a2844ba93a2d4dd7adb66dc_2048.jpg",
							"scene_skybox_snapshot_1024": ""
						},
						"objs": [
							{
								"res_id": "Camera",
								"generalAttr": {
									"obj_id": "89db0641-9d8e-4e97-9a6c-590cca241f81",
									"obj_name": "Camera",
									"obj_type": "3d",
									"obj_parent_id": "",
									"active": true,
									"interactable": true,
									"logic": false
								},
								"transformAttr": {
									"transform": [
										"0,1.7,0",
										"0,0,0,1",
										"1,1,1"
									],
									"rect_transform": [],
									"simulatedRotation": "0,0,0"
								},
								"materialAttr": {
									"default_shader_name": "",
									"materials": []
								},
								"animationAttr": [],
								"blocklyAttr": {},
								"typeAttr": {
									"fov": 80.0
								}
							}
						],
						"behav": [],
						"target_ids": [],
						"blocklyXML_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/c51d6028-50e6-44df-8dbc-6864a27c17d2.xml"
					},
					{
						"info": {
							"id": "\\u0061\\u0066\\u0037\\u0039\\u0039\\u0063\\u0030\\u0034\\u0061\\u0039\\u0034\\u0039\\u0034\\u0065\\u0030\\u0062\\u0062\\u0038\\u0035\\u0066\\u0034\\u0038\\u0062\\u0031\\u0030\\u0036\\u0064\\u0032\\u0030\\u0034\\u0032\\u0038",
							"name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0032",
							"size": 0
						},
						"environment": {
							"shader": "Skybox/Panoramic",
							"scene_skybox_res_id": "c5f081e011205ca1a37b652cf66391d5",
							"scene_skybox_snapshot_4096": "",
							"scene_skybox_snapshot_2048": "",
							"scene_skybox_snapshot_1024": ""
						},
						"objs": [
							{
								"res_id": "Camera",
								"generalAttr": {
									"obj_id": "9619563d-014a-49ce-8b0f-1bf21573f08c",
									"obj_name": "Camera",
									"obj_type": "3d",
									"obj_parent_id": "",
									"active": true,
									"interactable": true,
									"logic": false
								},
								"transformAttr": {
									"transform": [
										"0,1.7,0",
										"0.1238961,0.08882516,-0.01113619,0.9882488",
										"1,1,1"
									],
									"rect_transform": [],
									"simulatedRotation": "14.2917,10.27204,-2.863382E-05"
								},
								"typeAttr": {
									"fov": 80.0
								}
							}
						],
						"behav": [],
						"target_ids": [],
						"blocklyXML_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/035d0108-ba94-4b68-b088-ffa9cd8c3006.xml"
					}
				]
			}

			window.vrController = vrController; // 20190921 for debug

			vrController.projectIdx = projIndex;

			//// 起始設定，由於目前 「朗讀文字」的功能棟有第一次無法取得 發聲列表 問題，所以這邊先行呼叫一次
			if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){
				let voices = speechSynthesis.getVoices();
				vrController.voices = voices;
			}

			function initvrscene(){
				
				// console.log("VRFunc.js: activeVRScenes: initvrscene vrScene=", vrScene  );
				if ( vrScene.children[2].attributes ){

				}
				// vrScene.children[2].remove(); ////// 20190921: Fei want to remove the default camera, 

				////// add the listener for show the panel or not
				// vrScene.canvas.addEventListener("touchstart", vrSceneTouch, false);
				// vrScene.canvas.addEventListener("mousedown", vrSceneTouch, false);
				// let bottomProjs = document.getElementById("bottomProjs");
				// let projsInfo = document.getElementById("projsInfo");
				// let bottomArrow = document.getElementById("bottomArrow");
				// bottomProjs.style.display = "block";
				// function vrSceneTouch(event){
				// 	//// close the author's project list 
				// 	event.preventDefault();
				// 	// console.log("VRFunc.js: _vrSceneTouch: camera rotation=", document.getElementById("camera_cursor").object3D.rotation, document.getElementById("aCamera").object3D.rotation  );

				// 	bottomProjs.className =  'collapsed' ;
				// 	projsInfo.className =  'collapsed' ;
				// 	bottomArrow.className =  'collapsed' ;

				// }


//20200604-start-thonsha-add
				vrScene.setAttribute("shadow","type: pcfsoft");
//20200604-end-thonsha-add
				

				////// set member into vrController
				let rendererSize = new THREE.Vector2();
				vrScene.renderer.getSize( rendererSize );
//20191112-start-thonsha-add

				vrScene.renderer.sortObjects = true;

				//// 「 關閉 陰影自動更新 」
				// vrScene.renderer.shadowMap.autoUpdate = false;


				// vrScene.renderer.capabilities.logarithmicDepthBuffer = true;
				
				// preserveDrawingBuffer

				console.log(" **************** vrScene " , vrScene.object3D );

//20191112-end-thonsha-add
	
				vrController.vrScene = vrScene;
				vrController.GLRenderer = vrScene.renderer;

				vrController.setupFunction();
	
				////// set cursor with animation
//20200812-thonsha-mod-start
				setTimeout(function(){
					cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;" );
					cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );
					cursorEntity.setAttribute('animation__mouseenter', "property: geometry.thetaLength; delay: 5; startEvents: mouseenter; dur: 5; from: 0.5; to: 360" );
					cursorEntity.setAttribute('animation__mouseleave', "property: geometry.thetaLength; startEvents: mouseleave; dur: 100; from: 360; to: 0.5" );
					// cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.04; radiusInner: 0.02; thetaLength: 360; thetaStart: 0;" );
					vrController.cursorEntity = cursorEntity;
				}, 1);
				let cursorEntity = document.createElement('a-entity');
				cursorEntity.setAttribute('id', "cursor_main" );
				// cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );
				// cursorEntity.setAttribute('cursor', "fuse: false; fuseTimeout: 5" );
				cursorEntity.setAttribute('raycaster', "objects: .clickable" );
				// cursorEntity.setAttribute('animation__mouseenter', "property: geometry.thetaLength; delay: 5; startEvents: mouseenter; dur: 5; from: 0.5; to: 360" );
				// cursorEntity.setAttribute('animation__mouseleave', "property: geometry.thetaLength; startEvents: mouseleave; dur: 100; from: 360; to: 0.5" );
				// cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.04; radiusInner: 0.02; thetaLength: 360; thetaStart: 0;" );
				cursorEntity.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 0; thetaStart: 0;" );
				cursorEntity.setAttribute('position', "0 0 -0.1" );
				cursorEntity.setAttribute('material', "color: red; shader: flat; " );
				////// set cursor default (green)
				let cursorEntityDefault = document.createElement('a-entity');
				cursorEntityDefault.setAttribute('id', "cursor_default" );
				cursorEntityDefault.setAttribute('geometry', "primitive: ring; radiusOuter: 0.002; radiusInner: 0.0014; thetaLength: 360; thetaStart: 0;" );
				cursorEntityDefault.setAttribute('position', "0 0 -0.1001" );
				cursorEntityDefault.setAttribute('material', "color: #2ADD2A; shader: flat; " );
				////// set the entity to contain a-camera
//20200812-thonsha-mod-end
				let aCamera = document.createElement('a-entity');
				// let aCamera = document.createElement('a-camera');

				////// 20190921 Fei add some code inside  aframe-v0.9.2.js/aframe-v0.9.2.min.js for use touch control vertical view
				aCamera.setAttribute('camera', {active: true , fov: 80 } );
				aCamera.setAttribute('look-controls', "" ); 
				aCamera.setAttribute('wasd-controls', "" );
				// aCamera.setAttribute('wasd-controls', { enabled: true } ); 

				// aCamera.setAttribute('xytouch-look-controls', "" ); ///// 20190921 Fei stop use it for now.
				aCamera.setAttribute('id', "aCamera" );
				aCamera.setAttribute('position', { x: 0 , y: 0 , z: 0 } ); ////// it is work, but cant get value
				aCamera.setAttribute( 'camera', "fov", 60 ); ////// it is work, default is 80, 60 is unity set
				aCamera.setAttribute( 'camera', "near", 0.3 ); ////// it is work, default is 0.3
				aCamera.setAttribute( 'camera', "far", 20000 ); ////// it is work, default is 10000

				// console.log("VRFunc.js: aCamera.object3D.children=", aCamera.object3D.children.length );
				// aCamera.appendChild(cursorEntity);
				// aCamera.appendChild(cursorEntityDefault);
				console.log("VRFunc.js: aCamera=", aCamera );
	
				//// 模型觀看視角的相機，起始預設為「不啟動」。
				//// 注意：啟動指令為  oCamera.setAttribute('camera', 'active:true;')  同時會關閉所有場景中 camera （設定 active false）
				//// 反之，關閉指令為  oCamera.setAttribute('camera', 'active:false;')    
				//// 

				let oCamera = document.createElement('a-entity');
				oCamera.setAttribute('id', "oCamera" );
				oCamera.setAttribute('camera', {active: true, fov: 80 } );
				oCamera.setAttribute('orbit-controls', 
				`minPolarAngle: 0; 
				maxPolarAngle: 180; 
				minDistance: 0.1; 
				maxDistance: 1000; 
				initialPosition: -5 5 13;` ); 


				////// set the a-entity to wrap the a-camera, the position and roation set here is the default value, will replace when load scene.
				let cameraEntity = document.createElement('a-entity');
				cameraEntity.setAttribute('id', "camera_cursor" ); ////// it is work, can get value!
				cameraEntity.setAttribute('position', {x: 0, y: 1.7 , z: 0} ); ////// it is work, but cant get value
				cameraEntity.setAttribute('rotation', "0 0 0" ); ////// it is work too, but still can't get value

				cameraEntity.appendChild(aCamera);

				cameraEntity.appendChild(oCamera);

				vrScene.appendChild(cameraEntity);// this = vrScene

				let ambientLight = document.createElement("a-light");
				ambientLight.setAttribute("id", "ambientLight");
				ambientLight.setAttribute("type", "ambient" );
				ambientLight.setAttribute("color", "#808080" ); // white / gray / #fff  / #c8c8c8
				ambientLight.setAttribute("ground-color", "#fff" ); // #fff , Fei dont know how it work
				ambientLight.setAttribute("intensity", 1.0 );

				vrScene.appendChild(ambientLight);// this = vrScene


				//// 假如「專案描述」帶有特定字串 _walking 增加以下功能
				//// 製作「客製化 走動功能 」
				if (  publishVRProjs.result[ projIndex ].proj_descr.includes('_walking') == true  ){

					let self = vrController;
					
					///// 紀錄當前「移動相機功能」的狀態，基本上只有「 VR 體驗 」時候可以開啟
					//// -1: 2D UI 顯示為「尚未啟動」，3D icon 隱藏，此狀態只有點擊「開啟走動功能」才可以後續觸發走動
					////  0: 2D UI 顯示為「已經啟動」，3D icon 顯示白色，此狀態為可以觸發點擊移動功能，等待移動
					////  1: 2D UI 顯示為「已經啟動」，3D icon 顯示紅色，此狀態為移動中，不可再次移動
					self.walkingStatus = -1;

					let pointerSphere = document.createElement("a-entity");
					pointerSphere.setAttribute("id" , "pointerSphere" );
					pointerSphere.setAttribute("geometry" , "primitive: ring; radiusInner: 0.35; radiusOuter: 0.5" );
					pointerSphere.setAttribute("material" , "shader: flat; color: white; side: double; opacity: 0.3; ");
					pointerSphere.setAttribute('position', {x: 0, y: 0 , z: 0} ); 
					pointerSphere.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
					pointerSphere.setAttribute("visible", false);
					self.vrScene.appendChild(pointerSphere); 

					let currentPosSphere = document.createElement("a-entity");
					currentPosSphere.setAttribute("id" , "currentPosSphere" );
					currentPosSphere.setAttribute("geometry" , "primitive: ring; radiusInner: 0.35; radiusOuter: 0.5" );
					currentPosSphere.setAttribute("material" , "shader: flat; color: #0AC4B6; side: double; opacity: 0.3; ");
					currentPosSphere.setAttribute('position', {x: 0, y: 0 , z: 0} ); 
					currentPosSphere.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
					currentPosSphere.setAttribute("visible", false );
					self.vrScene.appendChild(currentPosSphere); 


					//// 地板
					let ground = document.createElement("a-entity");
					ground.setAttribute("id" , "__ground" );
					ground.setAttribute("geometry" , "primitive: plane; height: 1000; width: 1000; ");
					ground.setAttribute("material" , "shader: flat; color: blue; side: back; opacity: 0.05; visible: true ");
					ground.setAttribute("visible" , false);
					ground.setAttribute('position', {x: 0, y: 0.1 , z: 0} ); 
					ground.setAttribute('rotation', {x: 90, y: 0 , z: 0} ); 
					ground.addEventListener("loaded", function(){
						ground.object3D.renderOrder = 9999;
					});
					self.vrScene.appendChild(ground);


				}



				let firstCameraSetActive = function(evt){
					vrDiv = document.getElementById("vrDiv");
					// vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or "100%"
					// vrDiv.style.height = Math.round(document.documentElement.clientHeight - 56) + "px" ;//  "500px" or "80%"
					console.log("VRFunc.js: activeVRScenes: initvrscene: vrScene.camera active = ", vrScene.camera.aspect, vrDiv.clientWidth, vrDiv.clientHeight );
					vrScene.camera.aspect = vrDiv.clientWidth/vrDiv.clientHeight;
					vrScene.camera.fov = 60;
					vrScene.camera.updateProjectionMatrix();

					//// 先將觸控關閉，再跳轉場景
					vrController.triggerEnable = false;
					vrController.loadScene(projIndex, sceneIndex);
					vrController.userStartTime = new Date().getTime();
					
					// vrController.update();
					checkHost_tick();
					Module.checkMifly();

					vrScene.removeEventListener('camera-set-active', firstCameraSetActive );
				}
				vrScene.addEventListener('camera-set-active', firstCameraSetActive );


				////// try to modify the aspect ratio of camera, 20190917 Fei fail, I check the vrScene.camera is same as aCamera.object3D.children[2].
				////// But it need wait for the camera loading, at first, it is default camera, then it is the a-camera's object3D
				// console.log("VRFunc.js: activeVRScenes: initvrscene: vrScene.camera = ", vrScene.camera, vrScene );
				// vrScene.addEventListener('camera-set-active', function(evt) { 
				// 	vrDiv = document.getElementById("vrDiv");
				// 	// vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or "100%"
				// 	// vrDiv.style.height = Math.round(document.documentElement.clientHeight - 56) + "px" ;//  "500px" or "80%"
				// 	console.log("VRFunc.js: activeVRScenes: initvrscene: vrScene.camera active = ", vrScene.camera.aspect, vrDiv.clientWidth, vrDiv.clientHeight );
				// 	vrScene.camera.aspect = vrDiv.clientWidth/vrDiv.clientHeight;
				// 	vrScene.camera.fov = 60;
				// 	vrScene.camera.updateProjectionMatrix();

				// 	//// 先將觸控關閉，再跳轉場景
				// 	vrController.triggerEnable = false;
				// 	vrController.loadScene(projIndex, sceneIndex);
				// 	vrController.userStartTime = new Date().getTime();
					
				// 	// vrController.update();
				// 	checkHost_tick();
				// 	Module.checkMifly();

				// });

	
				////// setup the test 3D object, it is work
				// vrController.loadTexture();
	
				////// setup the default button.
				//// make the stable scene2D renderer, prepare for future.
				// let test = new THREE.Object3D();
				// vrController.loadTexture2D(test, "../images/homeIcon1.png"); // homeIcon1.png, homeIcon2.jpg			
				// test.position.set( -rendererSize.x + 150 , -rendererSize.y + 150, 0 );
				// scene2D.add(test);
	
				// let plane = new THREE.Mesh( new THREE.PlaneBufferGeometry(100, 100, 0), new THREE.MeshBasicMaterial( {side: THREE.BackSide, color: new THREE.Color("rgb(50,150,50)") } ) );
				// plane.position.set( -rendererSize.x + 50 , -rendererSize.y + 50, 0 );
				// scene2D.add(plane);

//20221206-thonsha-add-start
				let skyRenderTarget = new THREE.WebGLRenderTarget(1024,1024);
				vrController.skyRenderTarget = skyRenderTarget;
				vrController.needsRenderTarget = false;
				vrController.onlySkyScene = new THREE.Scene();
//20221206-thonsha-add-end		
				
				renderTick();
	
				// console.log("VRFunc.js: initvrscene, done", vrScene, vrScene.object3D );
			}
	
			
			var renderTick = function() {
				vrController.GLRenderer.clearDepth();
//20221206-thonsha-add-start
				if (vrController.needsRenderTarget){
					vrController.GLRenderer.setRenderTarget( vrController.skyRenderTarget );
					vrController.GLRenderer.render( vrController.onlySkyScene, vrController.vrScene.camera );
					vrController.GLRenderer.setRenderTarget( null );
				}
//20221206-thonsha-add-end
				vrController.GLRenderer.render( vrController.vrScene.object3D, vrController.vrScene.camera );
				// console.log("renderTick");
				requestAnimationFrame(renderTick); // dont use it, because of the haning problem
			};
	

		}

		
	}

	function makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	var leavedSendLog = window.leavedSendLog = function(e) {
		if (!window.publishVRProjs) return;
		if (!publishVRProjs.result) return;
		if (!publishVRProjs.result[0].user_id) return;

		let device_id;
		if (localStorage.getItem("device_id")){
			if (localStorage.getItem("device_id") >= 24 ){
				device_id = localStorage.getItem("device_id");
			}else{
				device_id = new Date().getTime() + "_" + makeid(10) ;
				localStorage.setItem( "device_id",  device_id );
			}
		}else{
			device_id = new Date().getTime() + "_" + makeid(10) ;
			localStorage.setItem( "device_id",  device_id );
		}

		let leavedTime = new Date().getTime();

		let projData = {
			"brand": Browser.name + Browser.version ,
			"os": navigator.userAgent ,
			"device_id": device_id ,
			"client": "viewer" , //// 等amos修改玩之後再改為 web 
			"user_id": publishVRProjs.result[0].user_id ,
			"proj_id": "" ,
			"proj_type":"vr" ,
			"duration_time": 0 ,
			"explore_time": 0 ,
			"play_time": 0 ,
			"location_long":0.0 ,
			"location_lan":0.0 ,
		};
		projData.proj_id = publishVRProjs.result[ vrController.projectIdx ].proj_id;
		projData.duration_time = (leavedTime - vrController.userStartTime)/1000; // 單位是秒
		projData.play_time = (leavedTime - vrController.userStartTime)/1000; // 單位是秒
		console.log("VRFunc.js: project[" + vrController.projectIdx + "] playing time = " , projData.duration_time , projData.play_time , projData.explore_time );
		let savedProjLogs  = [projData];
		localStorage.setItem("savedProjLogs", JSON.stringify(savedProjLogs) );

		return undefined;
	}
	window.onbeforeunload = leavedSendLog;
	
	// let leftTopButton = document.getElementById("leftTopButton");
	// leftTopButton.addEventListener('click', function(event){
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	event.stopImmediatePropagation();

	// 	if ( window.vrController ){
	// 		let pSet = vrController.setViewMode();
	// 		pSet.then( function(ret){
	// 			if ( ret == 'VR' ){
	// 				leftTopButton.children[0].innerHTML = '切換觀看模式(VR)';
	// 			}else if (ret == 'model'){
	// 				leftTopButton.children[0].innerHTML = '切換觀看模式(Model)';
	// 			}
	// 		});
	// 	}

	// 	// leavedSendLog();
	// 	// //// check if in iFrame?
	// 	// if ( window.top != window.self ){
	// 	// 	console.log("makarVR.html: get iframe = " , parent.document.getElementById("vrIframe") );
	// 	// 	// parent.document.getElementById("vrIframe").remove();
	// 	// 	parent.aUI.closeCoreIframe();
	// 	// }

	// });

	var scope;
	if (typeof window !== 'undefined') {
		scope = window;
	} else {
		scope = self;
	}
	// scope.VRController = VRController;
	
	let integrateCount = 0;
	var integrateTick = function() {
		integrateCount++ ;
		if ( integrateCount > 3 ){
			console.log("VRFunc.js: integrateTick, integrateCount=", integrateCount, ", too many times" );
			return;
		}

		if (scope.AFRAME && scope.THREE) {
			console.log("VRFunc.js: integrateTick, scope=", scope , integrateCount );
			integrate();
			window.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					// getScenes();
				}
			});
		} else {
			setTimeout( function(){
				integrateTick( integrateCount );
			} , 500);
		}
	};

	if (typeof window !== 'undefined') {
		integrateTick( integrateCount );
	}

	console.log("VRFunc done, window innerWH",  window.innerWidth, window.innerHeight);


	//// 輸出文字改為由網址的頁面判斷
	let languageType = window.languageType = "tw";
	if (parent){
		let indexOfFirst = parent.location.pathname.indexOf('/', 0);
		let indexOfSecond = parent.location.pathname.indexOf('/', indexOfFirst + 1);
		let lan = parent.location.pathname.substring(1, indexOfSecond);
		if (lan == "tw" || lan == "en"){
			languageType = window.languageType = lan;
		}
	}

	let worldContent = window.worldContent= {

		userAlreadyPlayed:{tw:"此登入用戶已經遊玩過", en:"This user already played"},
		userNotLoginInfo:{tw:"必須要登入MAKAR後才可遊玩", en:"Please login at first"},
		clickToPlay:{tw:"點擊開始遊玩", en:"Click to play"},

		backToHome:{tw:"專案標題", en:"back"},
		GPSDistanceMsg:{tw:"需在GPS的範圍內才能開啟 \r\n 距離：", en:"Please to the right place"},
		GPSErrorMsg:{tw:"GPS 錯誤", en:"GPS error"},
		GPSnotSupportMsg:{tw:"沒有支援 GPS ", en:"GPS not support"},
		comfirm:{tw:"確認", en:"Comfire"},
		
	};
  
	if(languageType == "en"){
		//// 留下來當作範例 
		// let rs = leftTopButton.children[0].innerHTML.replace("專案標題" , worldContent.backToHome[languageType] );
		// leftTopButton.children[0].innerHTML = rs;
	}


})();


/***/ })

}]);