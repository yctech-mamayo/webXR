"use strict";
(self["webpackChunkvr"] = self["webpackChunkvr"] || []).push([["js_VRMain_version3_5_VRFunc_js"],{

/***/ "./js/VRMain/version3_5/AddObjectToVrController.js":
/*!*********************************************************!*\
  !*** ./js/VRMain/version3_5/AddObjectToVrController.js ***!
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

/***/ "./js/VRMain/version3_5/Quiz.js":
/*!**************************************!*\
  !*** ./js/VRMain/version3_5/Quiz.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AddObjectToVrController_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddObjectToVrController.js */ "./js/VRMain/version3_5/AddObjectToVrController.js");
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");



class Quiz extends _AddObjectToVrController_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    
    //[start-2023mmdd-howardhsu-add]//
	//// 	- 要考慮能讓兩個quiz同時在場景中
	//// 		- 例如如果場景設定多個quiz都是載入時開始問答，點擊開始遊玩就都開始
    //[end-2023mmdd-howardhsu-add]//

    module = {'placeholder': 'quiz test.'}
    
    constructor(obj){
        super();
        this.module = obj.module
    }
    
    //// ----------------
    //// 覆寫  "把物件加入到場景 或 vrController 常用到的函式們"   以便與vrController互動

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
    
    
    //[start-20231006-howardhsu-add]//
    //// 從user線上素材庫拿json
    setTypesFromUserRes(obj){
        //// res_url and main_type no longer exist in ver. 3.5's VRSceneResult
        //// get res_url, main_type from userProjResDict or userOnlineResDict
        if( userProjResDict || typeof( userOnlineResDict ) == 'object' ){  
    
            if(userProjResDict[obj.res_id]){

                if(userProjResDict[obj.res_id].res_url){
                    obj.res_url = userProjResDict[obj.res_id].res_url
                }
                if(userProjResDict[obj.res_id].main_type){
                    obj.main_type = userProjResDict[obj.res_id].main_type
                }
                if(userProjResDict[obj.res_id].sub_type){
                    obj.sub_type = userProjResDict[obj.res_id].sub_type
                }

            } else if(userOnlineResDict[obj.res_id]){

                if(userOnlineResDict[obj.res_id].res_url){
                    obj.res_url = userOnlineResDict[obj.res_id].res_url
                }
                if(userOnlineResDict[obj.res_id].main_type){
                    obj.main_type = userOnlineResDict[obj.res_id].main_type
                }
                if(userOnlineResDict[obj.res_id].sub_type){
                    obj.sub_type = userOnlineResDict[obj.res_id].sub_type
                }

            } else {
                (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_1__.checkDefaultImage)(obj)
                switch (obj.res_id) {

                    //// 編輯器裡，目前問答裡的物件不會是光或相機
                    // case "Camera":
                    // case "Light":
                    //     obj.main_type = obj.res_id.toLowerCase()
                    //     break
    
                    case "Text":
                        obj.main_type = obj.res_id.toLowerCase()
                        obj.sub_type = 'txt'
                        break;
                        
                    case "Button":
                        obj.main_type = obj.res_id.toLowerCase()
                        obj.main_type = 'button'
                        obj.sub_type = 'button'
                        break;

                    default:
                        //// check if obj is default model
                        let defaultModelNames = ["Cube", "Capsule", "Sphere", "ch_Bojue", "ch_Fei", "ch_Lina", "ch_Poyuan", "ch_Roger"]
                        if(defaultModelNames.find(name => name == obj.res_id)){
                            // console.log("是預設model: ", obj.res_id)
                            obj.main_type = "model"
                        } else {
                            console.log("Quiz.js: setTypesFromUserRes: main_type does not exist. obj=", obj)        
                        }
                        break;
                }
                
                console.log("Quiz.js: setTypesFromUserRes: obj=", obj)
            }
    
        } else {
            console.log("Quiz.js: setTypesFromUserRes: userProjResDict or userOnlineResDict does not exist. obj=", obj)    
        }
    
        return obj
    }
    //[end-20231006-howardhsu-add]//


    //// 載入 Quiz
    load( obj, position, rotation, scale) {

        if( window.quizzes && Array.isArray(window.quizzes) ){
            window.quizzes.push(this)
        } else {
            window.quizzes = [ this ]
        }

        let self = this

        //// 載入之前先檢查是否網頁端有用戶登入，並檢查是否玩過此專案
        // console.log("Quiz.js: _load: obj=", obj);

        let quizEntity = document.createElement("a-entity");
        quizEntity.setAttribute("id", obj.generalAttr.obj_id);

        this.pushToMakarObjects(quizEntity)
    
        quizEntity.addEventListener( 'loaded' , function(){
            // console.log(' -------- quizEntity loaded ');
            ///// 增加一個「空物件」，代表此 entity 已經自身載入完成
            let QObject3D = new THREE.Object3D();
            quizEntity.object3D.add( QObject3D );
        });
        
        let randomQuestionList = [];
        for (let i=0; i<obj.typeAttr.module.question_list.length; i++){
            if (obj.typeAttr.module.question_list[i].allowRandom){
                randomQuestionList.push(i);
            }
        }
    
        //// 當user沒有在quiz設定題目順序時的error
        if(!obj.typeAttr.module.display_order_list){
            console.log("Quiz.js _load: ERROR - user has not set display_order_list. obj.typeAttr.module=", obj.typeAttr.module)
            return
        }

        let totalActiveScoreQuestion = 0
        for (let i=0;i<obj.typeAttr.module.display_order_list.length;i++){
            let tempIdx =  obj.typeAttr.module.display_order_list[i].index;
            if (tempIdx == -1){
                let randInt = (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_1__.getRandomInt)(randomQuestionList.length);
                let randomIdx = randomQuestionList[randInt];
                obj.typeAttr.module.display_order_list[i].index = randomIdx
                tempIdx = randomIdx;
                randomQuestionList.splice(randInt,1);
            }
            if (obj.typeAttr.module.question_list[tempIdx].active_score){
                totalActiveScoreQuestion += 1;
            }
        }
    
        let idx = obj.typeAttr.module.display_order_list[0].index;
        let first_question = obj.typeAttr.module.question_list[idx];
    
        let timerContent = document.getElementById('timerContent');
    
        let firstTimer = -1;
        if (obj.typeAttr.module.timer_type == "Total"){
            firstTimer = obj.typeAttr.module.total_time;
            let timer = document.getElementById("timerDiv");
            timer.style.display = "block";
    
            let hour = Math.floor(firstTimer/3600);
            let min = Math.floor((firstTimer-hour*3600)/60);
            let sec = firstTimer-hour*3600-min*60;
            timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
        }
        else if(obj.typeAttr.module.timer_type == "Custom"){
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
            "json":obj.typeAttr.module, 
            "quizEntity":quizEntity, 
            "currentIndex":0, 
            "score":0, 
            "choices":[], 
            "correctAnswer":0, 
            "totalActiveScoreQuestion":totalActiveScoreQuestion, 
            "record":new Array(obj.typeAttr.module.question_list.length), 
            "timer":{"currentTimer":null,"counter":firstTimer } , 
            "record_time":0 , 
            "qClock": Date.now() 
        }
    
        let scoreDiv = document.getElementById("scoreDiv")
        scoreDiv.addEventListener("click",function(){
            scoreDiv.style.display = "none";
            self.nextQuestion();
        });
    
        // console.log("Quiz.js: _load: _first_question=", first_question );
    
        if ( first_question.questions_json && Array.isArray( first_question.questions_json ) ){
            for(let i=0; i<first_question.questions_json.length; i++){

                //[start-20231004-howardhsu-modify]//
                this.loadQuestion(first_question.questions_json[i])      
                //[end-20231004-howardhsu-modify]//          
            }
        }
        
        if ( first_question.options_json ){
    
            for(let i=0; i<first_question.options_json.length; i++){

                //[start-20231006-howardhsu-modify]//
                let {pOption, sub_type} = this.loadOption(first_question.options_json[i])
                
                let Entity;
                // console.log("Quiz.js: _load: _loadOption: pOption=", pOption )                
                //[end-20231006-howardhsu-modify]//
                
                if (sub_type != "button" && (first_question.option_type == "MutiOption_Text"|| first_question.option_type == "MutiOption_Image")){
    
                    if ( (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_1__.isPromise)( pOption ) == false ){
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
                    if (obj.typeAttr.module.timer_type == "Custom"){
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


    //[start-20231006-howardhsu-modify]//
    loadQuestion(question_json){
        let position = new THREE.Vector3().fromArray( question_json.transformAttr.transform[0].split(",").map( x => Number(x) ) );

        let quaternionArray = question_json.transformAttr.transform[1].split(",").map( x => Number(x) ) 
        let quaternion = new THREE.Quaternion( quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3] )
        let eulerAngle = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
        let rotation = new THREE.Vector3( eulerAngle.x , -1 * eulerAngle.y , -1 * eulerAngle.z )
        
        let scale    = new THREE.Vector3().fromArray(question_json.transformAttr.transform[2].split(",").map(x => Number(x) ) );            
    
        let obj = this.setTypesFromUserRes(question_json)

        let main_type = obj.main_type;       
        switch(main_type){
            case "text":                        
                this.addTextToScene( obj, position, rotation, scale )
                break;
            case "image":
                this.addTextureToScene( obj, position, rotation, scale )
                break;
            case "video":
                this.addVideoToScene( obj, position, rotation, scale );
                break;
            case "model":   
                this.addGLTFModelToScene( obj, position, rotation, scale )            
                break;
            case "audio":
                this.addAudioToScene( obj, position, rotation, scale );
                break;
        }
    }

    loadOption(option_json){

        //// get position, rotation, scale 
        let position = new THREE.Vector3().fromArray( option_json.transformAttr.transform[0].split(",").map( x => Number(x) ) );

        let quaternionArray = option_json.transformAttr.transform[1].split(",").map( x => Number(x) ) 
        let quaternion = new THREE.Quaternion( quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3] )
        let eulerAngle = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
        let rotation = new THREE.Vector3( eulerAngle.x , -1 * eulerAngle.y , -1 * eulerAngle.z )

        let scale    = new THREE.Vector3().fromArray(option_json.transformAttr.transform[2].split(",").map(x => Number(x) ) );  

        //// get res_url and sub_type from user online resources dict
        let obj = option_json
        if( userProjResDict || typeof( userOnlineResDict ) == 'object' ){  
    
            if(userProjResDict[obj.res_id]){

                if(userProjResDict[obj.res_id].res_url) obj.res_url = userProjResDict[obj.res_id].res_url;

                if(userProjResDict[obj.res_id].sub_type) obj.sub_type = userProjResDict[obj.res_id].sub_type; 

            } else if(userOnlineResDict[obj.res_id]){

                if(userOnlineResDict[obj.res_id].res_url) obj.res_url = userOnlineResDict[obj.res_id].res_url;

                if(userOnlineResDict[obj.res_id].sub_type) obj.sub_type = userOnlineResDict[obj.res_id].sub_type;

            } else {
                //// if the obj doesn't exist in userProjResDict or userOnlineResDict, then it should be Makar default assets.
                (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_1__.checkDefaultImage)(obj)                
                obj.main_type = 'button'
                switch (obj.res_id) {

                    //// Currently, options of quiz objects can only be text or image(has been checked by checkDefaultImage alreadly.)
                    case "Text":
                        obj.main_type = obj.res_id.toLowerCase()
                        obj.sub_type = 'txt'
                        break;                        
                        
                    case "Button":
                        obj.main_type = obj.res_id.toLowerCase()
                        obj.sub_type = 'button'
                        break;

                    default:
                        console.log("Quiz.js: loadOption: res does not exist. obj=", obj)      
                        break;
                }
                
                console.log("Quiz.js: loadOption: obj=", obj)
            }
    
        } else {
            console.log("Quiz.js: loadOption: userProjResDict or userOnlineResDict does not exist. obj=", obj)    
        }

        //// 改用 behav 來觸發 quiz 點擊事件
        if( obj.behav ){

            //// 如果 behav 已經有 pushbutton 那就不再加
            let isPushButtonExist = false
            obj.behav.forEach(b => {
                if(b.behav_type == "PushButton") isPushButtonExist = true;
            })

            if(!isPushButtonExist) obj.behav.push({behav_type: "PushButton"});

        } else {
            obj.behav = [ {behav_type: "PushButton"} ]
        }

        obj.main_type = "button"  //// 雖已改用 behav 來觸發，但VRFunc.js仍有一些需要用 main_type=="button" 來判斷的功能

        let sub_type = obj.sub_type;     
        let pOption;

        switch(sub_type){
            case "txt":                        
                console.log("Quiz.js:  sub_type=", sub_type)
                pOption = this.addTextToScene( obj, position, rotation, scale)
                break;

            case "gif":
            case "jpg":
            case "jpeg":
            case "png":
                pOption = this.addTextureToScene( obj, position, rotation, scale)
                break;

            case "button":
                obj.res_url = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/button_withText.png";
                pOption = this.addTextureToScene( obj, position, rotation, scale)
                break;
        }

        return  {
            pOption: pOption,
            sub_type: sub_type,
        }
    }
    //[end-20231006-howardhsu-modify]//
    

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
                if ( currectQuestion.options_json[i].generalAttr.obj_id == targetId ){
                    // console.log(" ***********   " , i , currectQuestion.options_json );
                    answer_options.push(i);
                }
            }

            if (correctAnswer && correctAnswer.generalAttr.obj_id == targetId){
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
                            if(choicesId == correctAnswer.generalAttr.obj_id){
                                correctCount += 1;
                            }
                        }
                    }
                }


                for (let i = 0, len = currectQuestion.options_json.length; i < len; i++ ){
                    for (let j = 0, len2 = self.module["choices"].length; j < len2; j++ ){
                        if (currectQuestion.options_json[i].generalAttr.obj_id == self.module["choices"][j] ){
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

                    //[start-20231006-howardhsu-modify]//
                    this.loadQuestion(next_question.questions_json[i])    
                    //[end-20231006-howardhsu-modify]//
                    
                }
            }
            

            if ( next_question.options_json && Array.isArray( next_question.options_json ) ){

                for(let i=0; i<next_question.options_json.length; i++){
                   
                    //[start-20231006-howardhsu-modify]//
                    let {pOption, sub_type} = this.loadOption(next_question.options_json[i])                    
                    let Entity;        
                    //[end-20231006-howardhsu-modify]//
                   
                    if (sub_type != "button" && (next_question.option_type == "MutiOption_Text"|| next_question.option_type == "MutiOption_Image")){

                        if ( (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_1__.isPromise)( pOption ) == false ){
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

/***/ "./js/VRMain/version3_5/VRController.js":
/*!**********************************************!*\
  !*** ./js/VRMain/version3_5/VRController.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _vrObjectModules_setTransform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vrObjectModules/setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");
/* harmony import */ var _vrObjectModules_SkyModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vrObjectModules/SkyModule.js */ "./js/VRMain/version3_5/vrObjectModules/SkyModule.js");
/* harmony import */ var _vrObjectModules_AudioModule_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vrObjectModules/AudioModule.js */ "./js/VRMain/version3_5/vrObjectModules/AudioModule.js");
/* harmony import */ var _vrObjectModules_GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./vrObjectModules/GLTFModelModule.js */ "./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js");
/* harmony import */ var _vrObjectModules_loadTexture2D_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./vrObjectModules/loadTexture2D.js */ "./js/VRMain/version3_5/vrObjectModules/loadTexture2D.js");
/* harmony import */ var _vrObjectModules_ImageModule_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./vrObjectModules/ImageModule.js */ "./js/VRMain/version3_5/vrObjectModules/ImageModule.js");
/* harmony import */ var _vrObjectModules_LightModule_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vrObjectModules/LightModule.js */ "./js/VRMain/version3_5/vrObjectModules/LightModule.js");
/* harmony import */ var _vrObjectModules_TextModule_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./vrObjectModules/TextModule.js */ "./js/VRMain/version3_5/vrObjectModules/TextModule.js");
/* harmony import */ var _Quiz_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Quiz.js */ "./js/VRMain/version3_5/Quiz.js");
/* harmony import */ var _vrObjectModules_VideoModule_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./vrObjectModules/VideoModule.js */ "./js/VRMain/version3_5/vrObjectModules/VideoModule.js");






 



// import { loadQuiz, nextQuestion } from "./vrObjectModules/QuizModule.js"



// import { CSS3DRenderer, CSS3DObject } from './THREEjsAddons/CSS3DRenderer.js';

class VRController {

    //// scene 2D part
    GLRenderer = null;
    scene2D = null;
    camera2D = null;
    light = null;
    makarObjects2D = [];

    scaleRatioXY;
 
    //// MAKAR part
    vrScene = null;
    publishVRProjs = null;
    VRSceneResult = null;
    makarVRscenes = {};
 
    makarObjects = [];
 
    ///// 此陣列只會在「每次載入場景完成之後作修改」，目前為了讓「點擊移動功能」可以在 滑鼠移動時候作判斷使用
    currentSceneMakarObjects = [];
 
    //20200528-thonsha-add-start
    loadSceneCount = 0
    module = null;
    cursorEntity = null;
    //20200528-thonsha-add-end
    
    //20200807-thonsha-add-start
    projectIdx = null;
    //20200807-thonsha-add-end
 
    //20220105-thonsha-add-start
    intervalList = [];
    //20220105-thonsha-add-end
 
    //// for update
    FUNCTION_ENABLED = false;
    clock = new THREE.Clock();
    delta = this.time = 0;
 
    //// 沒有特別的用意，主要是為了讓每次 create <video> 的 id 不相同
    triggerEnable = false;
 
    //// 紀錄『滑鼠』『觸碰』狀態
    touchMouseState = -1;
 
    //// 紀錄「觸發事件」中帶有「群組」的事件
    groupDict = {
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
    lookAtObjectList = [];
    lookAtTimelineDict = {};
 
    loadingTickOn;

    //[start-20230726-howardhsu-add]//
    //// 紀錄編輯器版本
    editor_version = [];
    sceneIndex = 0;

    //// 原本在VRFunc.js的語言、翻譯文字
    languageType = "tw"
    worldContent = {
        userAlreadyPlayed:{tw:"此登入用戶已經遊玩過", en:"This user already played"},
        userNotLoginInfo:{tw:"必須要登入MAKAR後才可遊玩", en:"Please login at first"},
        clickToPlay:{tw:"點擊開始遊玩", en:"Click to play"},

        backToHome:{tw:"專案標題", en:"back"},
        GPSDistanceMsg:{tw:"需在GPS的範圍內才能開啟 \r\n 距離：", en:"Please to the right place"},
        GPSErrorMsg:{tw:"GPS 錯誤", en:"GPS error"},
        GPSnotSupportMsg:{tw:"沒有支援 GPS ", en:"GPS not support"},
        comfirm:{tw:"確認", en:"Comfirm"},
    }
    
    constructor(VRSceneResult, publishVRProjs, projectIdx, languageType, worldContent){
        this.VRSceneResult = VRSceneResult
        this.publishVRProjs = publishVRProjs
        this.projectIdx = projectIdx
        this.languageType = languageType
        this.worldContent = worldContent
    }

    get2DScaleRatio(){

        let self = this;

        let scaleRatioXY;

        //// 編輯器基本上針對 AR 專案可以讓使用者選擇「2D界面比例」，由於「使用者裝置比例」無法確認，所以變成載入物件時候需要針對專案來設定物件大小位置
        //// 3:4 =「1440, 1920」
        //// 9:16 =「720, 1280」 
        //// 9:18 =「1080, 2160」
        //// 4:3 = 「1920, 1440」
        //// 16:9 =「1280, 720」 
        //// 18:9 = 「2160, 1080」

        let resolutionString = '';

        ////
        //// 2022 1123以後， 3.3.8 上線，修改資料，這邊需要作「向下相容」
        //// 3.3.8 之後需要從「2D界面列表中判斷最適合的」
        ///
        console.log("VRFunc.js: _get2DScaleRatio: self.editor_version=", self.editor_version)
        if ( Array.isArray ( self.editor_version )  && self.editor_version.length == 3 ){
            let largeV  = Number( self.editor_version[0] );
            let middleV = Number( self.editor_version[1] );
            let smallV  = Number( self.editor_version[2] );	

            //[start-20231017-howardhsu-add]//
            ////     唔 結論是這裡根本還拿不到 vrController.editor_version (因為是在 loadSceneObjects 才給vrController加上。 loadSceneObject在loadScene裡，但loadScene前會先呼叫這個get2DScaleRatio)
            ////     (考慮把取得版本的code提早呼叫或是往外移?    等等看混和專案的版本在什麼時候取得)
            //// ver. 3.5 有第二層的會用駝峰是大小寫；直接就是value的會用小寫英文，換字使用底線 _
            if ( largeV > 3 || ( largeV == 3 && middleV > 4 ) ){
                resolutionString = getResolution350();
            }
            //[start-20231017-howardhsu-add]//

            //// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
            if( largeV > 3 || (largeV == 3 && middleV >= 5)){

            } else if ( largeV > 3 || 
               ( largeV == 3 && middleV > 3 ) ||
               ( largeV == 3 && middleV == 3 && smallV > 8 )
            ){
                resolutionString = getResolution338();
            }else{
                resolutionString = getResolution330();
            }
        }else{
            resolutionString = getResolution350();
        }

        function getResolution350(){            
            let tempR = '';
            console.log('_getResolution350', self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex])
            console.log('_getResolution350', self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex].orientation)
            console.log('_getResolution350', Array.isArray( self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex].orientation ) )
            //// 當前用戶畫面大小， PC: w*600 mobile: w*300(?)
            let userWidth = self.vrScene.clientWidth;
            let userHeight = self.vrScene.clientHeight;

            if ( self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex] && self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex].orientation &&
                Array.isArray( self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex].orientation )
            ){
                let screenList = self.VRSceneResult[ self.projectIdx ].scenes[self.sceneIndex].orientation;
                
                let minScore = 1000;
                let selectedResolutionIndex = 0;
                screenList.forEach( ( e , i )=>{
                    
                    //// 比例差距，比例相同為 1 、比例差距極端值為 0 or 無限大 
                    let resolutionDiff = ( e.width/e.height ) / ( userWidth/userHeight );

                    //// 寬高差距 比值，比例相同為 1 、比例差距極端值為 0 or 無限大
                    let widthDIff = e.width / userWidth;
                    let heightDIff = e.height / userHeight;

                    let nrd = resolutionDiff>1? resolutionDiff: 1/resolutionDiff;
                    let nwd = widthDIff>1? widthDIff: 1/widthDIff;
                    let nhd = heightDIff>1? heightDIff: 1/heightDIff;

                    e.nrdScore = nrd * ( nwd + nhd );

                    if ( e.nrdScore < minScore ){
                        minScore = e.nrdScore 
                        selectedResolutionIndex = i
                    }

                });

                let selectResolution = screenList[ selectedResolutionIndex ];
                //// 紀錄「當前使用的 寬高比例 index 」	
                self.selectedResolutionIndex = selectedResolutionIndex

                tempR = String ( selectResolution.width ) + ',' + String ( selectResolution.height );
                console.log(' _getResolution350: ' , minScore , selectedResolutionIndex , selectResolution , tempR );

            }
            
            return tempR;
        }

        function getResolution338(){

            let tempR = '';

            //// 當前用戶畫面大小， PC: w*600 mobile: w*300(?)
            let userWidth = self.vrScene.clientWidth;
            let userHeight = self.vrScene.clientHeight;

            if ( VRSceneResult[ self.projectIdx ] && VRSceneResult[ self.projectIdx ].scene_objs_v2 && VRSceneResult[ self.projectIdx ].scene_objs_v2.screen &&
                Array.isArray( VRSceneResult[ self.projectIdx ].scene_objs_v2.screen.orientationData )
            ){
                let screenList = VRSceneResult[ self.projectIdx ].scene_objs_v2.screen.orientationData;
                
                let minScore = 1000;
                let selectedResolutionIndex = 0;
                screenList.forEach( ( e , i )=>{
                    
                    //// 比例差距，比例相同為 1 、比例差距極端值為 0 or 無限大 
                    let resolutionDiff = ( e.width/e.height ) / ( userWidth/userHeight );

                    //// 寬高差距 比值，比例相同為 1 、比例差距極端值為 0 or 無限大
                    let widthDIff = e.width / userWidth;
                    let heightDIff = e.height / userHeight;

                    let nrd = resolutionDiff>1? resolutionDiff: 1/resolutionDiff;
                    let nwd = widthDIff>1? widthDIff: 1/widthDIff;
                    let nhd = heightDIff>1? heightDIff: 1/heightDIff;

                    e.nrdScore = nrd * ( nwd + nhd );

                    if ( e.nrdScore < minScore ){
                        minScore = e.nrdScore 
                        selectedResolutionIndex = i
                    }

                });

                let selectResolution = screenList[ selectedResolutionIndex ];
                //// 紀錄「當前使用的 寬高比例 index 」	
                self.selectedResolutionIndex = selectedResolutionIndex

                tempR = String ( selectResolution.width ) + ',' + String ( selectResolution.height );
                console.log(' _getResolution338: ' , minScore , selectedResolutionIndex , selectResolution , tempR );

            }
            
            return tempR;

        }

        function getResolution330(){
            //// 判斷是否存在「專案大小比例」
            let tempR = '';
            if ( VRSceneResult[ self.projectIdx ] ){
                if ( VRSceneResult[ self.projectIdx ].scene_objs_v2 ){
                    if ( VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution ){
                        tempR = VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution;
                    }
                }
            }
            return tempR;
        }

        // //// 判斷是否存在「專案大小比例」
        // if ( VRSceneResult[ self.projectIdx ] ){
        // 	if ( VRSceneResult[ self.projectIdx ].scene_objs_v2 ){
        // 		if ( VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution ){
        // 			resolutionString = VRSceneResult[ self.projectIdx ].scene_objs_v2.resolution;
        // 		}
        // 	}
        // }



        if ( resolutionString == ''){
            console.log(' _get2DScaleRatio: fucking lose resolutionString '); 
            resolutionString = "720,1280";
        }

        let cameraWidth, cameraHeight;

        //// 假如有找到「專案大小比例」，調整
        if ( resolutionString != '' ){
            let resArr = resolutionString.split(',');

            //// 專案設定理想大小
            let idealWidth = Number( resArr[0] );
            let idealHeight = Number( resArr[1] );
            
            //// 使用者當下裝置大小
            let userWidth = self.vrScene.clientWidth;
            let userHeight = self.vrScene.clientHeight;

            //// 使用者當前 camera 2D 的比例
            cameraWidth = Math.abs( self.camera2D.right - self.camera2D.left );
            cameraHeight = Math.abs( self.camera2D.bottom - self.camera2D.top );

            //// 2D 相機預設寬度比例 跟 使用者裝置比例比較。
            //// 2D 相機基本上電腦為寬比例( 640x480 ) 手機上通常為高比例(480,640)
            if ( cameraWidth/cameraHeight >= userWidth/userHeight ){

                //// 使用者裝置 與 理想界面 比例比較
                if ( userWidth/userHeight >= idealWidth/idealHeight ){
                    let rw = userHeight * (idealWidth/idealHeight );
                    let rh = userHeight;
                    let d1 = ( userWidth / ( userHeight * ( cameraWidth / cameraHeight ) ) );
                    let d2 = ( rw / userWidth );
                    let d3 = ( rw / idealWidth );

                    scaleRatioXY = d3;
                    console.log(' _loadTexture2D: 1 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
                }else{
                    let rw = userWidth;
                    let rh = userWidth * ( idealHeight / idealWidth );

                    let d1 = ( userWidth / ( userHeight * ( cameraWidth / cameraHeight ) ) );
                    let d2 = ( rh / userHeight ) 
                    let d3 = ( rw / idealWidth );

                    scaleRatioXY = d3;
                    console.log(' _loadTexture2D: 2 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY  );
                }

            }else{
                //// 假如相機比裝置寬，計算出對應轉化比例

                if ( userWidth/userHeight >= idealWidth/idealHeight ){
                    let rw = userHeight * ( idealWidth / idealHeight );
                    let rh = userHeight ;
                    let d1 = ( userHeight / ( userWidth * ( cameraHeight / cameraWidth ) ) );
                    let d2 = ( rw / userWidth );
                    let d3 = ( rw / idealWidth );

                    scaleRatioXY =   d3;
                    console.log(' _loadTexture2D: 3 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
                    
                } else {
                    let rw = userWidth ;
                    let rh = userWidth * ( idealHeight / idealWidth );
                    let d1 =  ( userHeight / ( userWidth * ( cameraHeight / cameraWidth ) ) )
                    let d2 = ( rh / userHeight ) 
                    let d3 = ( rw / idealWidth );

                    scaleRatioXY =  d3;
                    console.log(' _loadTexture2D: 4 ' , idealWidth, idealHeight, userWidth , userHeight, scaleRatioXY , d1 , d2, d3  );
                }

            }

        } else {
            console.log(' fucking lose resolutionString '); 
        }
        
        // console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY , ', cwh' , cameraWidth , cameraHeight );
        console.log(' _get2DScaleRatio: srxy=' , scaleRatioXY );

        return scaleRatioXY;
    }


    set2DScaleRatio( scaleRatioXY ){
        this.scaleRatioXY = scaleRatioXY;
    }


    setTransform( obj, position, rotation, scale ) {
        (0,_vrObjectModules_setTransform_js__WEBPACK_IMPORTED_MODULE_1__.setTransform)( obj, position, rotation, scale ) 
    }

    editorVerionControllSky( editor_version , projIndex , currentScene, VRSceneResult ) {
        return (0,_vrObjectModules_SkyModule_js__WEBPACK_IMPORTED_MODULE_2__.editorVerionControllSky)( editor_version , projIndex , currentScene, VRSceneResult ) 
    }

    loadSky( vrScene, scene_id, sceneSky_info, loadSceneCount ){
        return (0,_vrObjectModules_SkyModule_js__WEBPACK_IMPORTED_MODULE_2__.loadSky)( vrScene, scene_id, sceneSky_info, loadSceneCount )
    }

    loadAudio( obj , position, rotation, scale ){
        return (0,_vrObjectModules_AudioModule_js__WEBPACK_IMPORTED_MODULE_3__.loadAudio)( this, obj , position, rotation, scale )
    }

    loadGLTFModel( obj, position, rotation, scale, cubeTex ){
        return (0,_vrObjectModules_GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_4__.loadGLTFModel)( this, obj, position, rotation, scale, cubeTex )
    }
    
    loadTexture2D( obj, index, sceneObjNum, position, rotation, scale ){
        return (0,_vrObjectModules_loadTexture2D_js__WEBPACK_IMPORTED_MODULE_5__.loadTexture2D)( this, obj, index, sceneObjNum, position, rotation, scale )
    }

    loadTexture( obj, position, rotation, scale ) {
        return (0,_vrObjectModules_ImageModule_js__WEBPACK_IMPORTED_MODULE_6__.loadTexture)( this, obj, position, rotation, scale ) 
    } 

    loadLight( obj, position, rotation, scale ){
        return (0,_vrObjectModules_LightModule_js__WEBPACK_IMPORTED_MODULE_7__.loadLight)( this, obj, position, rotation, scale )
    }

    loadText( obj, position, rotation, scale ) {
        return (0,_vrObjectModules_TextModule_js__WEBPACK_IMPORTED_MODULE_8__.loadText)( this, obj, position, rotation, scale )
    }
    
        // import { loadQuiz, nextQuestion } from "./vrObjectModules/QuizModule.js"

    loadVideo( obj, position, rotation, scale ){
        return (0,_vrObjectModules_VideoModule_js__WEBPACK_IMPORTED_MODULE_10__.loadVideo)( this, obj, position, rotation, scale )
    }

    UnMutedAndPlayAllVisibleVideo( targetVideo_in ){
        (0,_vrObjectModules_VideoModule_js__WEBPACK_IMPORTED_MODULE_10__.UnMutedAndPlayAllVisibleVideo)( targetVideo_in )
    }
    //[end-20230726-howardhsu-add]//

    loadAssets() {
        let assets = document.createElement("a-assets");
        assets.setAttribute('id', "makarAssets" );
        assets.setAttribute('timeout', "1000" );
        assets.setAttribute('crossorigin', 'anonymous');
        this.vrScene.appendChild(assets);
        // self.makarObjects.push( assets );
    };

    ////// load the nth scene in specific prroject
    ////// At first, will called for load the first scene. 
    loadScene(projIndex, sceneIndex) {
        // console.log("VRFunc.js: VRController: _loadScene: [projectIndex, sceneIndex]=", projIndex, sceneIndex);
        //// 載入場景的時候，先顯示處『載入頁面』直到圖片或是影片 onload 再隱藏『載入頁面』，**** 目前不使用此功能 **** 
        
        let self = this

        //[start-20230728-howardhsu-add]//
        //// 3.5 版本下目前也是預設打開第1個場景
        this.sceneIndex = sceneIndex
        //[end-20230728-howardhsu-add]//
        
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
            let sceneSky_info = self.editorVerionControllSky( editor_version , projIndex, self.VRSceneResult[projIndex].scenes[sceneIndex], self.VRSceneResult);
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
            (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( scene_skybox_url, function( retStatus ){
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

                //// 從「 場景資料 」來查看是否有「 behav / behav_reference 」設置錯誤，有的話把 behav_rederence 修改
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

                        //[start-20230728-howardhsu-modify]//
                        let pAll = self.loadSceneObjects(projIndex, sceneIndex);    
                        let scene_id = self.VRSceneResult[projIndex].scenes[sceneIndex].id
                        let pSky = self.loadSky( self.vrScene, scene_id, sceneSky_info, self.loadSceneCount)                        
                        //[end-20230726-howardhsu-modify]//

                        pSky.then( function( ret ){
                            console.log('VRFunc.js: _loadScene: pSky then ret = ', ret );                            
                        });

                        //// 假如此專案的當前場景有「邏輯功能」，加入「處理列表」
                        if (self.publishVRProjs.result[projIndex].xml_urls && self.publishVRProjs.result[projIndex].xml_urls[ sceneIndex ] ){
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

                            //[start-20230725-howardhsu-modify]//
                            //// 根據 mdn，typeof 回傳 string     
                            //// 因此底下的 if 判斷永遠會通過
                            //// 另外 這個 loadingTickOn 在原本 VRFunc.js 沒有初始化，我先試試把它加進 VRController 的屬性裡，暫時不確定其他js檔是否也有取用它。
                            // if ( typeof( loadingTickOn )  != undefined ){
                                self.loadingTickOn = false;
                            // }
                            //[end-20230725-howardhsu-modify]//

                            self.triggerEnable = true;

                            //// 假如此專案當前場景有「邏輯」，解析並且執行功能
                            if (self.publishVRProjs.result[projIndex].xml_urls && self.publishVRProjs.result[projIndex].xml_urls[ sceneIndex ] &&
                                self.logic.xmlDoc != null 
                            ) {
                                self.logic.parseXML();
                            }
                        
                            //// 載入場景完成後，解析一下場景的「事件 / behav」跟「事件參照 behav_reference 」是否有錯誤。
                            self.setupSceneBehav();

                            //[start-20231012-howardhsu-add]//
                            //// 3.5.0 Quiz 啟動物件
                            //// 為了方便操作，準備一個 quiz、trigger物件 對應的 list     ( 順便避免 O(n)變成N三方， 一舉兩得(?) )
                            let q_t_list = []
                            self.VRSceneResult[projIndex].scenes[sceneIndex].target_ids.forEach( target_id => {
                                // console.log("quiz trigger type == target", target_id)
                                //// 找到 Quiz 啟動物件對應的 Quiz
                                self.VRSceneResult[projIndex].scenes[sceneIndex].objs.forEach( obj => {
                                    if(obj.res_id == 'quiz'){
                                        //// 若以後變成每道題目都有啟動物件，這裡的流程可能要修改
                                        if(target_id == obj.typeAttr.module.question_list[0].target_id){
                                            q_t_list.push( { 
                                                quiz_id: obj.generalAttr.obj_id,
                                                trigger_id: target_id
                                            } )
                                        }
                                    }
                                })
                            })
                            // console.log("quiz trigger type == target", q_t_list)

                            //// 在每個 Quiz啟動物件 的behav，增加 "ShowQuiz"，記錄它對應的 Quiz物件id
                            q_t_list.forEach( q_t => {
                                let quizTriggerObj = document.getElementById(q_t.trigger_id).object3D           
                                if (quizTriggerObj){	
                                    // console.log("quiz trigger type == target", quizTriggerObj)
                                    if (quizTriggerObj.behav) {  
                                        quizTriggerObj.behav.push({ obj_id: q_t.quiz_id, played: false, behav_type: 'ShowQuiz' })
                                    } else {
                                        quizTriggerObj.behav = [{ obj_id: q_t.quiz_id, played: false, behav_type: 'ShowQuiz' }]
                                    }										
                                }                                
                            })
                            //[end-20231012-howardhsu-add]//

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

    editorVersionControllObjs(editor_version , projIndex , sceneIndex ) {
        let self = this
        let scene_objs;

        //// 一定要含有大中小三個版號
        if (editor_version.length == 3) {
            
            //// 大中小版號
            let v0 = editor_version[0], v1 = editor_version[1], v2 = editor_version[2];

            switch(v0){
                case "3":
                    // if ( v1 == 0 && v2 <= 6 ){
                    //     if ( !Array.isArray(self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs ) ){
                    //         console.log("VRFunc.js: _editorVerionControll the scenes[sceneIndex] is not Array, error", self.VRSceneResult[projIndex] );
                    //         return -1;
                    //     }
                    //     console.log("VRFunc.js: _editorVerionControll: the editor version before 3.0.6", self.VRSceneResult[projIndex] );
                    //     scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs;
                    // } else if ( v1 == 1 || ( v1 ==0 && v2 >= 7 ) ) {
                    //     console.log("VRFunc.js: _editorVerionControll: the editor version after 3.0.7", self.VRSceneResult[projIndex] );
                    //     scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
                    // } else
                    if ( v1 >= 5  ){
                        console.log("VRFunc.js: _editorVerionControll: the editor version is 3.2.n or 3.3.n", self.VRSceneResult[projIndex] );
                        scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
                            
                        //// 此版本需要由 scenes 下調整相機參數 
                        // if (self.VRSceneResult[projIndex].scenes[sceneIndex].camera_rotation && self.VRSceneResult[projIndex].scenes[sceneIndex].fov){  
                                            
                            //[start-20230811-howardhsu-modify]//       
                        //// 因為 ver. 3.5 VRSceneResult 沒有 camera_rotation 
                        //// 要從 objs 找到 Camera        
                        let defaultCamera = self.VRSceneResult[projIndex].scenes[sceneIndex].objs.filter(item => item.res_id == "Camera")[0];  

                        if(defaultCamera && defaultCamera.typeAttr.fov){
                                                        
                            let quaternionArray = defaultCamera.transformAttr.transform[1].split(",").map( x => Number(x) )                        
                            let quaternion = new THREE.Quaternion( quaternionArray[1], quaternionArray[2], quaternionArray[3], quaternionArray[0] )
                            let eulerAngle = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
                            let rotation = new THREE.Vector3(eulerAngle.x , -1 * eulerAngle.y , -1 * eulerAngle.z )
                            //[end-20230811-howardhsu-modify]//
                            
                            let aCamera = document.getElementById( "aCamera" );
                            let oCamera = document.getElementById( "oCamera" );
                            
                            // camera_cursor.setAttribute("rotation", rotation ); ////// it is work
                            function lookContorlsLoaded(){
                                
                                console.log("VRFunc.js: _editorVerionControll: aCamera set fov = ", defaultCamera.typeAttr.fov );
                                let vrScene = document.getElementById("vrscene");
                                vrScene.camera.fov = defaultCamera.typeAttr.fov;

                                //// 依照「外部選擇」來調整起始「觀看模式」


                                aCamera.setAttribute('camera', { fov: defaultCamera.typeAttr.fov } );
                                oCamera.setAttribute('camera', { fov: defaultCamera.typeAttr.fov } );
                                
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
                        console.error("VRFunc.js: _editorVerionControll: the editor version after 3.5 , error ", self.VRSceneResult[projIndex] );
                        //// use version 3.0.6
                        scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs;
                    }

                    break;
                    
                // case "2":
                // case "1":
                //     console.log("VRFunc.js: _editorVerionControll: largeVersion below 3" , self.VRSceneResult[projIndex] );
                //     scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs;
                //     break;

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

    ////// load all object in the scene
    loadSceneObjects( projIndex, sceneIndex ) {
        let self = this
        if ( typeof( userProjResDict ) == 'object' && !userProjResDict){
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
        
        //[start-20230728-howardhsu-add]//
        ////  上面這個 editorVersionControllObjs 如果 ver. 3.5 外層已經判斷了版本 似乎就不用再判斷一次?
        ////  但是裡面有 scene_objs = self.VRSceneResult[projIndex].scenes[sceneIndex].objs 感覺這句是重點 因為會 return scene_objs
        ////  其他似乎都是在設定相機的部分
        ////  覺得似乎也可以單獨把那句拿出來 其他放進設定相機的函式裡面
        // console.log("35 scene_objs=", scene_objs)
        //[end-20230728-howardhsu-add]//

        if (!Array.isArray(scene_objs)) return [];

        //[start-20231013-howardhsu-add]//
        //// for multiple quizzes:  if there exist any Quiz with trigger_type=="Directly", show the UI (startQuiz).
        let isAnyQuizWithDirectlyShow = false
        //[end-20231013-howardhsu-add]//

        //// 所有物件都要作 「 完成判斷 」各自設立 promise
        let pObjs = [];
        for (let i = 0; i < scene_objs.length ; i++  ){
            // console.log("VRFunc.js: _loadSceneObjects: obj=", self.VRSceneResult[projIndex].scenes[sceneIndex].scene_objs[i] );  //// 這句似乎print不出東西 scene_objs 會 undefined
            
            //// 為每個物件設定 position、quaternion、scale
            let position = new THREE.Vector3().fromArray( scene_objs[i].transformAttr.transform[0].split(",").map( x => Number(x) ) );

            //[start-20230815-howardhsu-modify]//
            let quaternionArray = scene_objs[i].transformAttr.transform[1].split(",").map( x => Number(x) ) 
            let quaternion = new THREE.Quaternion( quaternionArray[0], quaternionArray[1], quaternionArray[2], quaternionArray[3] )
            let eulerAngle = new THREE.Euler().setFromQuaternion(quaternion, "XYZ")
            let rotation = new THREE.Vector3( eulerAngle.x , -1 * eulerAngle.y , -1 * eulerAngle.z )
            
            //// check simulatedRotation when ver.3.5's VRSCeneResult is accessible
            // let _rotation = new THREE.Vector3(eulerAngle.x * (180/Math.PI), eulerAngle.y * (180/Math.PI), eulerAngle.z * (180/Math.PI))
            // console.log("3.5 rotation=", rotation)
            // console.log("3.5 _rotation=", _rotation)
            // console.log("3.5 simulatedRotation=", scene_objs[i].transformAttr.simulated_rotation ) //// howardhsu does not figure out why they are slightly different, yet.
            //[end-20230815-howardhsu-modify]//
            
            let scale    = new THREE.Vector3().fromArray(scene_objs[i].transformAttr.transform[2].split(",").map(function(x){return Number(x)}) );
            
            //[start-20230804-howardhsu-add]//
            //// 加上 behav
            //// 把 VRSceneResult 的 behav 加到這個 obj 的屬性裡 (用 trigger_obj_id 判斷是它的behav)               
            let obj = scene_objs[i]         
            let scene_behavs = self.VRSceneResult[self.projectIdx].scenes[self.sceneIndex].behav
            scene_behavs.forEach( behav => {    
                if( behav.trigger_obj_id && behav.trigger_obj_id == obj.generalAttr.obj_id ){
                    if(obj.behav && Array.isArray(obj.behav) && obj.behav.length > 0){
                        obj.behav.push(behav)
                    } else {
                        obj.behav = [behav]
                    }
                }
            })            
            //[end-20230804-howardhsu-add]//
            
            //[start-20230809-howardhsu-add]//
            //// res_url and main_type no longer exist in ver. 3.5's VRSceneResult
            //// get res_url, main_type from userProjResDict or userOnlineResDict
            if( userProjResDict || typeof( userOnlineResDict ) == 'object' ){  

                //// get res_url by user resource 
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].res_url ){
                    scene_objs[i].res_url = userProjResDict[scene_objs[i].res_id].res_url
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].res_url = userOnlineResDict[scene_objs[i].res_id].res_url
                } else {
                    console.log("VRFunc.js: _loadSceneObjects: res_url does not exist. obj=", scene_objs[i])
                }     

                //// get main_type by user resource 
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].main_type ){
                    scene_objs[i].main_type = userProjResDict[scene_objs[i].res_id].main_type
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].main_type = userOnlineResDict[scene_objs[i].res_id].main_type
                } else {
                    //// userProjResDict usually does not contain Light, Text objects. Recognize them with res_id:
                    //// in ver. 3.5: if main_type does not exist, could be default objects
                    (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.checkDefaultImage)(scene_objs[i])
                    switch (scene_objs[i].res_id) {
                        case "Camera":
                        case "Light":
                        case "Text":
                            scene_objs[i].main_type = scene_objs[i].res_id.toLowerCase()
                            break;
                        
                        //[start-20231013-howardhsu-modify]//
                        //// ver. 3.5.0 quiz不再帶有 main_type、sub_type，而 userProjResDict、userProjResDict 也找不到 id 是 'quiz' 的object
                        case "quiz":
                            scene_objs[i].main_type = "empty"
                            scene_objs[i].sub_type = "quiz"
                            break;
                        //[end-20231013-howardhsu-modify]//
                            
                        default:
                            //// check if obj is default model
                            let defaultModelNames = ["Cube", "Capsule", "Sphere", "ch_Bojue", "ch_Fei", "ch_Lina", "ch_Poyuan", "ch_Roger"]
                            if(defaultModelNames.find(name => name == scene_objs[i].res_id)){
                                // console.log("是預設model: ", scene_objs[i].res_id)
                                scene_objs[i].main_type = "model"
                            } else {
                                console.log("VRFunc.js: _loadSceneObjects: main_type does not exist. obj=", scene_objs[i])        
                            }
                            break;
                    }
                }

                //// get sub_type by user resource
                if( userProjResDict[scene_objs[i].res_id] && userProjResDict[scene_objs[i].res_id].sub_type ){
                    scene_objs[i].sub_type = userProjResDict[scene_objs[i].res_id].sub_type
                } else if( userOnlineResDict[scene_objs[i].res_id] && userOnlineResDict[scene_objs[i].res_id].res_url) {
                    scene_objs[i].sub_type = userOnlineResDict[scene_objs[i].res_id].sub_type
                } else {
                    //// console.log("sub_type does not exist in user resource, deal with it later (in the switch block right below.)")
                }

            } else {
                console.log("VRFunc.js: _loadSceneObjects: userProjResDict or userOnlineResDict does not exist. obj=", scene_objs[i])    
            }
            //[end-20230809-howardhsu-add]//

            switch( scene_objs[i].main_type ){  
                case "camera":
                    //// 假如編輯器版本大於 3.2.0 不參考 camera 物件
                    // if (self.VRSceneResult[projIndex].editor_ver ){
                    //     if ( typeof(self.VRSceneResult[projIndex].editor_ver) == "string" ){
                    //         var editor_version = self.VRSceneResult[projIndex].editor_ver.split(".");
                    //         if (editor_version.length == 3){
                    //             if (editor_version[0] == 3 && editor_version[1] == 2 ){
                    //                 console.log("VRFunc.js: _loadSceneObjects: camera: editor vesion is 3.2.n , dont set" );
                    //                 break;
                    //             }
                    //         }
                    //     }
                    // }
                    //// ver3.5 測試相機位置正確 但推測如果位置能動 以下可能會出現些微差異 等有更多測試資料時要再確認

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
                            console.log("camera_cursor position", position)
                            //// reset the aCamera 
                            if (aCamera.components["look-controls"].yawObject && aCamera.components["look-controls"].pitchObject){

                                //// 編輯器上相機旋轉資訊更新於此，可解決子母旋轉問題
                                aCamera.components["look-controls"].yawObject.rotation.y = rotation.y/180*Math.PI;
                                aCamera.components["look-controls"].pitchObject.rotation.x = rotation.x/180*Math.PI;

                                // aCamera.object3D.position.set(0,0,0); 
                                console.log("VRFunc.js: _loadSceneObjects aCamera: yawr=", aCamera.components["look-controls"].yawObject.rotation ,
                                                                            ", pitchr=" , aCamera.components["look-controls"].pitchObject.rotation  );
                            }

                            // camera_cursor.object3D.rotation.set( 0, 180 * Math.PI/180 , 0 , "YXZ" ); ///// actually, looks control will control this object3D, but I cant modify it directly..  
                            console.log("VRFunc.js: _loadSceneObjects: camera: ", i, scene_objs[i], position, rotation, camera_cursor, self.vrScene );							
                        }								
                    } 

                    setTimeout(setupCamera, 10);

                    // setTransform( camera_cursor, position, rotation, scale );
                    
                    break;
                    
                case "image":
                    console.log("VRFunc.js: _loadSceneObjects: image: ", i, scene_objs[i] );
                    if (userProjResDict[ obj.res_id ] ){
                        // console.log("VRFunc.js: _loadSceneObjects: image res_url", i, obj.res_url, userProjResDict[obj.res_id].res_url  );
                        if ( obj.res_url == userProjResDict[obj.res_id].res_url ){
                            // console.log("%cVRFunc.js: _loadSceneObjects: image res_url is same as userProjResDict", "color:blue"   );
                            // console.log("%cVRFunc.js: _loadSceneObjects: image res_url is same as userProjResDict", "color:blue" , obj  );
                            
                            //[start-20230815-howardhsu-modify]//
                            if(obj.sub_type == undefined){                                      
                                let getSubType = obj.res_url.split('.')
                                let subType = getSubType[getSubType.length-1]
                                obj.sub_type = subType.toLowerCase();
                            } else {
                                console.log("VRFunc.js: _loadSceneObjects: image sub_type is undefined!")
                            }
                            let pTexture = self.loadTexture( obj, position, rotation, scale )                            
                            //[end-20230815-howardhsu-modify]//

                            pObjs.push( pTexture );

                        }else{
                            console.log("%cVRFunc.js: _loadSceneObjects: image res_url is different from userProjResDict!", "color:red" , i , obj, userProjResDict[obj.res_id] );	
                        }
                    }else{
                        // console.log("%cVRFunc.js: _loadSceneObjects: image res_id not exist!", "color:red" , i );	

                        switch(obj.res_id){
                            case "MakAR_Call":
                                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
                                obj.sub_type = "png"
                                break;
                            case "MakAR_Room": 
                                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
                                obj.sub_type = "png"
                                break;
                            case "MakAR_Mail": 
                                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
                                obj.sub_type = "png"
                                break;
                            case "Line_icon":
                                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
                                obj.sub_type = "png"
                                break;
                            case "FB_icon":
                                obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
                                obj.sub_type = "png"
                                break;
                            default:
                                // console.log("image: default, obj=", window.sceneResult[i].data.scene_objs_v2[j]);
                                console.log("%c VRFunc.js: _loadSceneObjects: image res_id not exist!", "color:red" , obj );	
                                // obj.res_url = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/icon/qm256.png';
                        }

                        if (obj.generalAttr.obj_type == "2d"){
                            console.log("XRFunc.js 2d22dd", obj.generalAttr.obj_type)
                            self.loadTexture2D(obj , i , scene_objs.length , position, rotation, scale );
                        } else if(obj.obj_type == "3d") {
                            let pTexture = self.loadTexture( obj, position, rotation, scale )
                            pObjs.push( pTexture );
                        }
                        

                        // pObjs.push( pTexture );
                        
                    }

                    break;
                    
                //20191204-start-thonsha-add
                case "text":
                    console.log("VRFunc.js: _loadText: text: ", i, scene_objs[i] );
                    
                    let pText = self.loadText( scene_objs[i] , position, rotation, scale )

                    pObjs.push( pText );
                    break;

                //20191204-end-thonsha-add
                
                //20191105-start-thonsha-add
                case "audio":

                    //[start-20230802-howardhsu-add]//  
                    if( scene_objs[i].sub_type == undefined ){                                        
                        let getSubType = scene_objs[i].res_url.split('.')
                        let subType = getSubType[getSubType.length-1]
                        scene_objs[i].sub_type = subType.toLowerCase();
                    } else {
                        console.log("VRFunc.js: _loadSceneObjects: audio sub_type is undefined!")
                    }                    
                    //[end-20230802-howardhsu-add]//

                    if ((scene_objs[i].sub_type == "mp3" || scene_objs[i].sub_type == "wav" || scene_objs[i].sub_type == "ogg" ) && scene_objs[i].res_url){
                        let pAudio = self.loadAudio( scene_objs[i] , position, rotation, scale );
                        pObjs.push( pAudio );
                    }

                    break;

                //20191105-end-thonsha-add

                case "video":

                    //[start-20230802-howardhsu-add]//  
                    if( scene_objs[i].sub_type == undefined ){                                        
                        let getSubType = scene_objs[i].res_url.split('.')
                        let subType = getSubType[getSubType.length-1]
                        scene_objs[i].sub_type = subType.toLowerCase();
                    } else {
                        console.log("VRFunc.js: _loadSceneObjects: video sub_type is undefined!")
                    }                     
                    //[end-20230802-howardhsu-add]//

                    console.log("VRFunc.js: _loadSceneObjects: video, scene_objs=", scene_objs[i] );
                    if ( scene_objs[i].sub_type == "mp4" && scene_objs[i].res_url  ){
                        let pVideo = self.loadVideo( scene_objs[i] , position, rotation, scale );
                        pObjs.push( pVideo );

                        //[start-20230815-howardhsu-add]//
                        //// 測試 css3dRenderer 來加上 yt iframe
                    } else if ( scene_objs[i].sub_type == "youtube" && scene_objs[i].res_url ){
                        console.log("currently youtube is not supportted.")

                        // const div = document.createElement( 'div' );
                        // div.style.width = '480px';
                        // div.style.height = '360px';
                        // div.style.backgroundColor = '#000';
                        
                        // console.log("YTTYTTYT", scene_objs[i].res_url)
                        // const id = scene_objs[i].res_url.split("https://www.youtube.com/watch?v=")[1]
                        // console.log("YTTYTTYT", id)
    
                        // // id = DiTShNUKSow
                        // const iframe = document.createElement( 'iframe' );
                        // iframe.style.width = '480px';
                        // iframe.style.height = '360px';
                        // iframe.style.border = '0px';
                        // iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
                        // div.appendChild( iframe );
        
                        // const object = new CSS3DObject( div );
                        // object.position.set( x, y, z );
                        // object.rotation.y = ry;
        
                        // self.vrScene.add(object)

                    }
                    //[end-20230815-howardhsu-add]//

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
                    
                    
                    //[start-20230802-howardhsu-add]//  
                    if( scene_objs[i].sub_type == undefined ){                                        
                        let getSubType = scene_objs[i].res_url.split('.')
                        let subType = getSubType[getSubType.length-1]
                        scene_objs[i].sub_type = subType.toLowerCase();
                    } else {
                        console.log("VRFunc.js: _loadSceneObjects: model sub_type is undefined!")
                    }                     
                    
                    let pModel = self.loadGLTFModel(scene_objs[i], position, rotation, scale , self.cubeTex );
                    //[end-20230802-howardhsu-modify]//

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
                            
                            let startQuiz = document.getElementById("startQuiz");		
                            
                            //[start-20231013-howardhsu-modify]//	
                            //// 3.5.0 Quiz 啟動物件 (推測應該是這個)
                            ////                                              p.s. 我發現它在 question_list[i] 底下，可能要等3.5出來 才知道是否"每一個題目都可以有一個啟動物件"
                            if(scene_objs[i].typeAttr.module.question_list[0].trigger_type == "Directly"){	
                                isAnyQuizWithDirectlyShow = true   //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，打開 startQuiz 介面
                            } 
                        
                            let QuizStartButton = document.getElementById("QuizStartButton");
                            //// click event for quiz start button
                            let startQuizFunc = function(){      

                                if(scene_objs[i].typeAttr.module.question_list[0].trigger_type == "Directly"){
                                    let quiz = new _Quiz_js__WEBPACK_IMPORTED_MODULE_9__["default"](scene_objs[i])	
                                    quiz.load( scene_objs[i], position, rotation, scale );		
    
                                    startQuiz.style.display = "none";
                                    QuizStartButton.removeEventListener("click",startQuizFunc);
                                } else {
                                    //// confirm which quiz should be shown
                                    let str_q_id_list = startQuiz.dataset.q_id_list //// html元素startQuiz 在quiz啟動物件觸發triggerEvent時，會加上 要觸發的quiz的obj_id
                                    if(str_q_id_list) {

                                        let q_id_list = str_q_id_list.split(' ')
                                        q_id_list.forEach( q_id => {    
                                            
                                            if( q_id == scene_objs[i].generalAttr.obj_id){
                                                let quiz = new _Quiz_js__WEBPACK_IMPORTED_MODULE_9__["default"](scene_objs[i])	
                                                quiz.load( scene_objs[i], position, rotation, scale );		
                                                startQuiz.style.display = "none";
                                                QuizStartButton.removeEventListener("click", startQuizFunc);
                                            }
    
                                        })    
                                    } 
                                }
                            }		
                            //[end-20231013-howardhsu-modify]//						

                            //// 離開quiz
                            let quitQuizFunc = function(){
                                startQuiz.style.display = "none";
                                QuizStartButton.removeEventListener("click",quitQuizFunc);
                            }
                            // QuizStartButton.addEventListener("click",startQuizFunc);

                            let url = window.serverUrl;
                            
                            //[start-20231012-howardhsu-modify]//
                            // let login_id = localStorage.getItem("login_shared_id")    //// renhaohsu在vscode搜尋、在瀏覽器localStorage都找不到它。 
                            let login_id = localStorage.getItem("MakarUserID")           //// renhaohsu暫時推測 有MakarUserID可以代表user已經登入
                            //[end-20231012-howardhsu-modify]//

                            let proj_id = self.publishVRProjs.result[self.projectIdx].proj_id;

                            //// 假如專案要求『強制登入作答』，檢查是否登入
                            if (scene_objs[i].typeAttr.module.force_login == true){
                                if (login_id ){
                                    //// 再檢查是否『允許重複作答』
                                    if (scene_objs[i].typeAttr.module.allow_retry == false ){
                                        console.log("VRFunc.js: _getRecordModule: get remote: ", login_id, proj_id );
                                        getRecordModule( url, login_id, proj_id, function(ret){
                                            console.log("VRFunc.js: _getRecordModule: ret= " , ret );
                                            if (ret.data.record_module_list ){
                                                QuizStartContent.textContent = self.worldContent.userAlreadyPlayed[self.languageType];
                                                QuizStartButton.addEventListener("click",quitQuizFunc);
                                            }else{
                                                //// 可以重複作答，不用檢查紀錄，直接開始遊玩
                                                QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
                                                QuizStartButton.addEventListener("click",startQuizFunc);
                                            }
                                        });
                                    }else{
                                        //// 可以重複作答，不用檢查紀錄，直接開始遊玩
                                        QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
                                        QuizStartButton.addEventListener("click",startQuizFunc);
                                    }
                                }else{
                                    //// 沒有登入，不給遊玩，跳出提示
                                    QuizStartContent.textContent = self.worldContent.userNotLoginInfo[self.languageType];
                                    QuizStartButton.addEventListener("click",quitQuizFunc);
                                }
                            }else{
                                //// 不需要『檢查登入』，直接開始遊玩
                                QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
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

        //[start-20231013-howardhsu-add]//
        //// for multiple quizzes:  if there exist any Quiz with trigger_type=="Directly", show the UI (startQuiz).
        let startQuiz = document.getElementById("startQuiz");		
        if( isAnyQuizWithDirectlyShow ){	
            startQuiz.style.display = "block"
        } else {								
            startQuiz.style.display = "none"
        }
        //[end-20231013-howardhsu-add]//

        return pObjs;
        // console.log("VRFunc.js: _loadSceneObjects: done, self.makarObjects ", self.makarObjects.length );
    }
       
    checkAnimation(obj, dt) {
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
    showObjectEvent(target, reset) {
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
                    
                    this.UnMutedAndPlayAllVisibleVideo( targetVideo_in );
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
                    this.UnMutedAndPlayAllVisibleVideo( target );
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

    hideGroupObjectEvent(target) {

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

    //// 清除「場景物件的事件資料」，因為 VR 會「跳整場景」，流程上會清除所有場景物件，再載入新場景物件。所以在「載入前」，要清除就場景的事件相關
    //// 包含 「事件群組」「注視事件」
    clearBehavs() {
        
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

    //// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
    //// 目前完全不參考「 儲存的 behav_reference 資料 」，都從「 behav 」來自製 「 behav_reference 」 
    checkVRSceneResultBehav() {
        let self = this;

        //// 專案id 錯誤
        if ( ! Number.isFinite( Number( self.projectIdx ) )   ){
            console.error( ' _checkVRSceneResultBehav: projectIdx error ', self.projectIdx );
            return;
        }
        //// 專案資料內容錯誤
        if ( !Array.isArray( self.VRSceneResult ) ||  !self.VRSceneResult[ self.projectIdx ] || !Number.isInteger( Number( self.sceneIndex ) )  ){
            console.error( ' _checkVRSceneResultBehav: _VRSceneResult error ', self.projectIdx , self.sceneIndex , self.VRSceneResult);
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

        //[start-20230807-howardhsu-add]//
        //// ver. 3.5 的 VRSceneResult 的 behav 已移到與 objs 同層
        self.VRSceneResult[self.projectIdx].scenes[self.sceneIndex].behav.forEach(( behav )=>{
            if ( behavAll[ behav.trigger_obj_id ] && Array.isArray( behavAll[ behav.trigger_obj_id ] ) ){
                behavAll[ behav.trigger_obj_id ].push([behav]);
            }else if ( behavAll ){
                behavAll[ behav.trigger_obj_id ] = [behav]
            }else{
                console.error('_checkVRSceneResultBehav: cant get behavAll ', behavAll );
            }
        })
        //[end-20230807-howardhsu-add]//

        for ( let i = 0, len = scene_objs.length; i < len; i++ ){
            let sceneObj = scene_objs[i];

            //[start-20230807-howardhsu-modify]//
            //// ver. 3.5 的 VRSceneResult 的 behav 已移到與 objs 同層
            // if ( sceneObj.behav ){
            //     behavAll[ sceneObj.obj_id ] = sceneObj.behav;
            // }
            //[end-20230807-howardhsu-modify]//

            //// 無條件清除 「 儲存的  behav_reference 資料 」
            if ( sceneObj.behav_reference ){
                // behavRefAll[ sceneObj.obj_id ] = sceneObj.behav_reference;
                delete sceneObj.behav_reference;
            }

            if ( sceneObj.generalAttr.obj_id ){
                sceneObjDict[ sceneObj.generalAttr.obj_id ] = sceneObj;
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
        // 				if ( behavs[m].obj_id == i && behavs[m].behav_type == behavRef.behav_name ){
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
                if ( behav.behav_type != "FingerGesture" ){
                    // console.log(' _checkVRSceneResultBehav: _behavAll: ', i.slice(0,6) , j ,behav );
                }
                
                if ( behav.obj_id ){
                    let behavObj = sceneObjDict[ behav.obj_id ];
                    //// 無條件自製 「 _behav_reference 」
                    if ( behavObj && Array.isArray( behavObj.behav_reference ) ){
                        behavObj.behav_reference.push({
                            behav_name: behav.behav_type,
                            target_id: behav.obj_id,
                        });
                    }else if ( behavObj ){
                        behavObj.behav_reference = [{
                            behav_name: behav.behav_type,
                            target_id: behav.obj_id,
                        }];
                    }else{
                        console.error('_checkVRSceneResultBehav: cant get _behavObj ', behav );
                    }


                    // if ( behavObj.behav_reference ){
                        
                    // 	let getBehaveRef = false;
                    // 	for ( let k = 0; k < behavObj.behav_reference.length; k++ ){
                    // 		if ( behavObj.behav_reference[k].behav_name == behav.behav_type ){
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

    //// 載入「場景物件」完成之後，作的「物件區域」計算
    calcSceneArea() {
        
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

        if ( self.publishVRProjs && Array.isArray(self.publishVRProjs.result) && Number.isFinite( self.projectIdx ) ){
            
            if ( typeof( self.publishVRProjs.result[ self.projectIdx ].proj_descr ) == 'string' && self.publishVRProjs.result[ self.projectIdx ].proj_descr.includes('_walking') == true  ){
                console.log(' _calcSceneArea: walking project ' , self.projectIdx , self.publishVRProjs.result[ self.projectIdx ] );

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
                console.log(' _calcSceneArea: not walking project ' , self.projectIdx , self.publishVRProjs.result[ self.projectIdx ] );
            }
        }else{
            console.log(' _calcSceneArea: _publishVRProjs error ' , self.projectIdx , self.publishVRProjs );
        }

    }

    //// 載入「場景物件」完成之後，作的「事件」處理，目前包含「注視事件」 而已
    //// 檢查場景中物件的「 事件 / behav 」與「 事件備註 / behav_reference 」 的狀況，因為目前編輯器有出現過錯誤
    //// 流程：掃一遍「場景中物件 2d/3d 」
    setupSceneBehav() {
        
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
    addLookAtTimeLine( lookObj , targetObj , lookAtEvent ) {

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

    //// 所有 「物件觸發事件」 需要作的「前置動作」
    //// 1. 場景載入物件時候，假如有「觸發事件」，則往下判斷是否有「群組」，並且紀錄下來
    //// 2. 「注視事件」
    setObjectBehavAll( obj ) {
        
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
            if ( obj.behav[i].behav_type == 'LookAt' && obj.behav[i].obj_id ){

                let lookAtEvent = {
                    lookBehav: obj.behav[i] ,
                    lookObjId: obj.obj_id ,
                }

                self.lookAtObjectList.push( lookAtEvent );

            }

        }
    }

    //// 處理全部的 群組功能 包含 2D / 3D 
    //// 注意：目前群組功能只有作用在 「顯示/隱藏」相關的功能。我們也只先處理這些，未來在新增
    dealAllGroupHide( touchObject ) {

        let self = this;

        if ( !self.groupDict ){
            console.log('_dealAllGroup: missing groupDict');
            return;
        }

        //// 符合當前群組功能的 事件
        let showEventStrList = ['ShowImage2D', 'ShowImage' , 'ShowText2D', 'ShowText', 'ShowModel', 'PlayMusic', 'ShowVideo'];

                
        //[start-20230804-howardhsu-modify]//
        //// 3.5 behav 在obj外層 要從那裡去找到對應的 behav
        // let obj_id = touchObject.obj_id
        // console.log("找behav self.VRSceneResult.behav", self.VRSceneResult.behav)
        //[end-20230804-howardhsu-modify]//


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
    //[start-20230808-howardhsu-modify]//
    speechTextObj( textObj, speed, speechLangIndex ) {
        console.log(' _speechTextObj: _textObj: ', textObj );
        if ( typeof( speechSynthesis ) == 'object' && typeof( SpeechSynthesisUtterance ) == 'function' ){

            //// 先判斷是否已經正在說話，假如是的話，暫停說話。假如沒有正在說話，才開始說話。
            if ( speechSynthesis.speaking == true ){
                speechSynthesis.pause();
                speechSynthesis.cancel();
            } 

            // let speed = textObj.speed;
            // let speechLangIndex = textObj.language;
            //[end-20230808-howardhsu-modify]//

            let content = textObj.typeAttr.content;

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
    parseLogicXML(projIndex, sceneIndex) {
        let pXML;
        //// 假如是切換場景，前面的場景可能有邏輯功能，清除
        if ( vrController.logic && typeof( vrController.logic.stopLogic ) == 'function'  ){
            vrController.logic.stopLogic();
        }
        
        if(this.publishVRProjs.result[projIndex].xml_urls && this.publishVRProjs.result[projIndex].xml_urls[sceneIndex]  ){
            let xmlURL = this.publishVRProjs.result[projIndex].xml_urls[sceneIndex];

            console.log('VRFunc.js: _parseLogicXML: xmlURL = ' , xmlURL);

            let logic = new Logic();
            pXML = logic.loadXMLtoDoc(xmlURL);
            vrController.logic = logic;
        }

        return pXML;
    }
    //20211116-thonsha-add-end

    ////
    //// 切換觀看模式，目前有「VR」跟「模型觀看」 兩種
    //// 起始預設為「VR」模式 
    //// 假如「有指定觀看模式」，則切換。假如沒有輸入，則判斷當前模式，改為另一個
    ////
    setViewMode( mode = '' ) {

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
    getMakarObject( obj ) {
        let self = this
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
    getObjectTypeByObj_id( obj_id ) {

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

    cameraMoveToPoint( paraemter ) {
        let self = this
        
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
    setWalkingStatus( _value ) {

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

    setWalkingObjVisible( _status ) {
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
    // --- 到上面為止是原本 setupFunction 的內容
    
    //// 原本的VRController.prototype.UrlExistsFetch 但我發現這個函式似乎沒有被呼叫過
    async UrlExistsFetch(url) {            
        let ret = await fetch(url, {method: 'HEAD'})

        console.log('_VRController: _UrlExists2: ret ', ret );
        if ( ret.status ){
            return ret.status == '200';
        }else{
            return false ;
        }
    }

    setupFunction() {

        if (this.FUNCTION_ENABLED) {
            return;
        }
        // console.log("VRFunc.js: VRController: setupFunction");
        this.FUNCTION_ENABLED = true;
        var self = this;
        console.log("this in vrcontroller setupfunction", this)    
    
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
                            // 			if ( showEventStrList.filter( ev => ev == e.object.el.object3D.behav[j].behav_type ).length > 0 ){
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
    
                    //[start-20230809-howardhsu-add]//
                    //// CloseAndResetChildren 在 ver. 3.5 沒出現過
                    //[end-20230809-howardhsu-add]//

                    let reset = false;
                    for(let i = 0; i < touchObject.behav.length; i++){
                        if (touchObject.behav[i].behav_type == "CloseAndResetChildren"){
                            reset = true;
                        }
                    }
                    for(let i = 0; i < touchObject.behav.length; i++){
                        if (touchObject.behav[i].behav_type != "CloseAndResetChildren"){

                            //[start-20230920-howardhsu-modify]//	
                            if(touchObject.behav[i].behav_type == "ShowQuiz"){
                                
                                //// 顯示 quiz 之前，先判斷 "瀏覽器本次載入場景後" 是否已經遊玩
                                if(touchObject.behav[i].played == false){
                                    touchObject.behav[i].played = true	
                                    self.triggerEvent( touchObject.behav[i], reset, self.GLRenderer, null, touchObject )
                                } else {
                                    console.log('VRFunc.js: _setupFunction: endEvent:  Quiz had been played.', touchObject.behav[i].played)
                                }

                            } else {
                                self.triggerEvent( touchObject.behav[i], reset, self.GLRenderer, null, touchObject );
                            }
                            //[end-20230920-howardhsu-modify]//	

                        }

                        if ( touchObject.behav[i].behav_type != 'FingerGesture' && touchObject.behav[i].behav_type != 'LookAt' ){
                            objectWithClickEvent = true;

                            //// 紀錄觸發到的事件
                            eventTriggered['3d_behav'] = touchObject.behav ;
                        }

                        //[start-20230920-howardhsu-modify]//	
                        if(touchObject.behav[i].behav_type == "PushButton"){
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

    triggerEvent( event, reset, GLRenderer, arScene, makarObj ) {
        if (!this.FUNCTION_ENABLED){
            return;
        }
        var self = this;
        let target;
    
        //[start-20230807-howardhsu-modify]//
        let obj_id = event.obj_id

        //// 3.5 沒有 simple_behav 了 變成 behav_type
        switch ( event.behav_type ){
            case "Dialing":
                console.log("VRFunc.js: triggerEvent: Dialing: event=", event );	
                let telTag = window.document.getElementById("phoneCall");
                telTag.href = "tel:"+event.phone ;
                telTag.click();
                break;
    
            case "Email":  
                console.log("VRFunc.js: triggerEvent: SendEmail: event=", event );	
                let mailTag = window.document.getElementById("sendEmail");
                mailTag.href = "mailto:" + event.mail_to ;
                mailTag.click();
                break;
    
            case "URL":
                console.log("VRFunc.js: triggerEvent: URL: event=", event , event.url );	
                let webTag = window.document.getElementById("openWebBrowser");
                webTag.href = event.url ;
                webTag.click();
                console.log("VRFunc.js: triggerEvent: URL: webTag=", webTag );	
                break;
                      
            case "Scenes":
                console.log("VRFunc.js: triggerEvent: SceneChange: event=", event );
    
                let sceneID = event.scene_id;
                let idx = self.projectIdx;          

                for (let i = 0;i<self.VRSceneResult[idx].scenes.length;i++){
                    if(self.VRSceneResult[idx].scenes[i].info.id == sceneID){
                        //[end-20230807-howardhsu-modify]//
                           
                        // window.activeVRScenes(i,j);
                        //// 先將觸控關閉，再跳轉場景
                        self.triggerEnable = false;
                        loadPage.style.display = "block";
    
                        //[start-20230725-howardhsu-modify]//
                        // if ( typeof( loadingTickOn )  != undefined ){
                            self.loadingTickOn = true;
                        // }
                        //[end-20230725-howardhsu-modify]//
    
                        self.loadScene(idx,i);
    
                    }
                }
                //20200807-thonsha-mod-end
                //20191023-end-thonsha-add
                break;
    
            //[start-20230808-howardhsu-modify]//            
            case "Display":  //// ver. 3.5 顯示圖片、文字、模型的keys都相同  另外，多一個key名為"switch_type" 暫不知其用途 
                console.log("VRFunc.js: triggerEvent: Display: event=", event );
                target = document.getElementById(obj_id);
                
                self.showObjectEvent(target, reset);
                break;

            case "Media":
                target = document.getElementById(obj_id);    
                if (!target){
                    console.log('VRFunc.js: Media: target not exist', target);
                    break;
                }                
                console.log("VRFunc.js: triggerEvent: Media: event=", event );
                
                //// 從 ver. 3.5的AllEventsExpectSceneSwitch.json來看 看起來在3.5影片和聲音的keys完全一樣 (behav_type: "Media", switch_type: "Switch")
                //// 因此 先判斷target是聲音還是影片
                if(target.nodeName.toLowerCase() == "a-video"){
                    //// 影片
                    self.showObjectEvent(target, reset);
                
                } else if (target.nodeName.toLowerCase() == "a-sound"){
                    //// 聲音
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
                        target.components.sound.playSound();        
                    }

                } else {
                    console.log("VRFunc.js: triggerEvent: Media: target is neither video nor sound object.", target)
                }
                break;
                   
            case "Animation":
                
                console.log("VRFunc.js: triggerEvent: Animation: event=", event );
                target = document.getElementById(obj_id);
                if (!target){
                    console.log('VRFunc.js: Animation: target not exist', target);
                    break;
                }
                
                var mainAnimation;
                for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
                    if (target.object3D.children[0].animationSlices[i].uid == event.uid){
                        mainAnimation = target.object3D.children[0].animationSlices[i].animationName;
                    }
                }
                target.setAttribute("animation-mixer", "clip: " + mainAnimation);
    
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
    
            case "TTS":
                console.log("VRFunc.js: _ReadText: ", event );
                //// 找到對應的文字物件
                if ( event.obj_id ){
                    let textObjID = event.obj_id;
                    let idx = self.projectIdx;
                    
                    if ( self.VRSceneResult && self.VRSceneResult[idx] && self.VRSceneResult[idx].scenes[ self.sceneIndex ] && Array.isArray( self.VRSceneResult[idx].scenes[ self.sceneIndex ].objs ) ){
                        self.VRSceneResult[idx].scenes[ self.sceneIndex ].objs.forEach( e =>{
                            if ( e.generalAttr.obj_id == textObjID  ){
                                console.log("tts測試", e)
                                self.speechTextObj( e , event.speed, event.language);
                            }
                        });
                    }
                }
                //[end-20230808-howardhsu-modify]//
    
                break;

            //[start-1012-howardhsu-add]//
            case "ShowQuiz":
                //// 顯示問答初始頁面 "點擊開始遊玩"
                let startQuiz = document.getElementById("startQuiz")				
                let q_ids = startQuiz.dataset.q_id_list
                console.log("  asdf event=", event)
                startQuiz.setAttribute('data-q_id_list', `${event.obj_id}${q_ids? " "+q_ids : ""}`)
                startQuiz.style.display = "block"
                break

            case "PushButton":
                //// 考慮多個Quiz存在場上的情況，找出被點擊的是哪個Quiz的選項
                window.quizzes.forEach( q => {
                    q.module.json.question_list.forEach( question => {
                        question.options_json.forEach( option => {
                            if( makarObj.el.id == option.generalAttr.obj_id){                               
                                q.pushButton( makarObj.el )  //// 觸發點擊事件
                            }
                        })
                    })
                })		
                break					
            //[end-1012-howardhsu-add]//

            default:
                console.log("VRFunc.js: triggerEvent: default: event=", event );	
    
                break;
        }
    
    }

    getSnapShot() {

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

}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VRController);

/***/ }),

/***/ "./js/VRMain/version3_5/VRFunc.js":
/*!****************************************!*\
  !*** ./js/VRMain/version3_5/VRFunc.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _handleAframeEvent_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handleAframeEvent.js */ "./js/VRMain/version3_5/handleAframeEvent.js");
/* harmony import */ var _VRController_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VRController.js */ "./js/VRMain/version3_5/VRController.js");




(function(){

    const integrate = () => {

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
                    (0,_handleAframeEvent_js__WEBPACK_IMPORTED_MODULE_1__.handleFusingEvent)( event )
				}	

				function clickEvent( event ) {
					event.preventDefault();
                    (0,_handleAframeEvent_js__WEBPACK_IMPORTED_MODULE_1__.handleClickEvent)( event ) 
				}				
				//20191023-end-thonsha-mod
			}
		});

        //[start-20191111-fei0079-add]//
        (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.checkHost_tick)();
        Module.checkMifly();
        //[end---20191111-fei0079-add]//
    
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
                vrDiv.style.width = document.documentElement.clientWidth + "px" ;    //  "500px" or

                vrDiv.style.height = Math.round(document.documentElement.clientHeight - 0) + "px" ;//  "500px" or "80%

                //[start-20231017-howardhsu-modify]//
                //// try to add 2D scene onresize            
                if ( window.vrController && vrController.vrScene && vrController.GLRenderer ){

                    //// 延遲觸發 「畫布縮放」跟「調整2D相機」。假如連續縮放畫面，則只會觸發最後一次
                    console.log('window _resize: _clearTimeout and _setTimeout ');

                    clearTimeout( vrController.sizeTimeOutID );
                    vrController.sizeTimeOutID = setTimeout( function(){
                        
                        let self = vrController;
                        let rendererSize = new THREE.Vector2();
                        self.vrScene.renderer.getSize( rendererSize );

                        console.log(' window _rendererSize: ', rendererSize.x, rendererSize.y );

                        let video = self.video;
                        let videoWidth, videoHeight;
                        let w, h;
                        // if ( rendererSize.x/rendererSize.y > video.videoWidth/video.videoHeight ){							
                            w = window.innerWidth;
                            // h = (window.innerWidth/video.videoWidth)* video.videoHeight;
                        // }else{							
                            // w = (window.innerHeight/video.videoHeight) * video.videoWidth;
                            h = window.innerHeight;
                        // }

                        //// 原本是「改動 div 」現在換「改動 canvas 」
                        self.GLRenderer.setSize( w , h );
                        self.vrScene.canvas.style.left = ( innerWidth - w )/2 + "px" ;
                        self.vrScene.canvas.style.top  = ( innerHeight - h )/2 + "px" ;

                        let oSR2D = vrController.scaleRatioXY;
                        let cSR2D = vrController.get2DScaleRatio();
                        
                        //// 調整 2D 相機 的「範圍」
                        self.camera2D.left = -w/2  * oSR2D/cSR2D ;
                        self.camera2D.right = w/2  * oSR2D/cSR2D ;
                        self.camera2D.top = -h/2   * oSR2D/cSR2D ;
                        self.camera2D.bottom = h/2 * oSR2D/cSR2D ;
                        self.camera2D.updateProjectionMatrix();

                        

                        // vrController.set2DScaleRatio( cSR2D ); //// 這段目前測試不該呼叫

                        self.vrScene.resize();

                        ///// 這邊發現，畫布的精細度可以依照下列方式調製整，讓手機上解析度提高

                        if (Browser){
                            let dw, dh;
                            if ( Browser.desktop == true ){
                                //// 電腦端，調整概念為「短邊一定要超過 1280 、長邊不超過 1280 」，由於目前 新版 webXR 設定 此 iframe 高度只有 600 所以這邊必定要觸發
                                //// 先預計未來 iframe 會調整大小，所以這邊還是好好寫判斷
                                let wx = rendererSize.x;
                                let wy = rendererSize.y;

                                if ( w > 2560 || h > 2560 ){
                                    if ( w > h ){
                                        dw = 2560  ;
                                        dh = 2560 * h/w ;
                                    }else{
                                        dw = 2560 * w/h ;
                                        dh = 2560 ;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }else if ( wx < 1280 || wy < 1280 ){
                                    if ( w > h ){
                                        dw = 1280 * w/h ;
                                        dh = 1280 ;
                                    }else{
                                        dw = 1280 ;
                                        dh = 1280 * h/w ;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }

                            }else if ( Browser.mobile == true ){
                                //// 手機端，調整概念為「 無條件補滿 720 」
                                if ( w < 720 || h < 720){
                                    
                                    if ( w > h ){
                                        dw = 720;
                                        dh = 720/w * h;
                                    }else{
                                        dw = 720/h * w;
                                        dh = 720;
                                    }
                                    self.GLRenderer.setSize( dw , dh , false );
                                }
                            }
                        }

                        //// seems like vr's camera will resize itself.
                        //// renhaohsu doesn't know the exact reason why we should comment this, but it works... 
                        //// 調整 3D 相機 aspect ratio
                        // self.camera3D.aspect = w/h;
                        // self.camera3D.updateProjectionMatrix();

                        // self.oCamera3D.aspect = w/h;
                        // self.oCamera3D.updateProjectionMatrix();

                        console.log('2 window _resize: ', w, h, self.GLRenderer.getSize( rendererSize ) );

                    }, 50 );

                }
                //[end-20231017-howardhsu-modify]//
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
            
            // let vrController = new VRController(VRSceneResult, publishVRProjs, projIndex, languageType, worldContent);
            // window.vrController = vrController; // 20190921 for debug   
            
            //[start-20230728-howardhsu-add]//
			///// 3.5.0 Data 
			let new_proj = {
                result: [
                    {},
                    {
                        "proj_id": "46a38add-5e9e-406a-a6d8-80d16ca35d56",
                        "proj_name": "testCubeTex",
                        "user_id": "76ad6ef7-e89e-4f35-9c8d-0f40617f64a1",
                        "proj_type": "vr",
                        "proj_descr": "_walking",
                        "snapshot_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/ProjectSnapshot/7a0786ede4aa4f148f78d727c3909c04_snapshot.jpg",
                        "proj_cover_urls": [],
                        "proj_platform": [
                            "app"
                        ],
                        "create_date": "2023-07-18T02:29:37.948Z",
                        "last_update_date": "2023-07-18T02:29:37.948Z",
                        "proj_size": "97938",
                        "permission": 1,
                        "permission_friend": [],
                        "tags": [],
                        "category": ["ArtDesign"],
                        "module_type": [],
                        "xml_urls": [
                            "",
                            "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/XML/c5c149c0-da58-4f63-83b5-000ff68767bc.xml"
                        ],
                        "loc": [],
                        "target_ids": [],
                        "editor_license_key": ""
                    }
                ]
            }
			let new_scene = [
                {

                },
                {
                    "editor_ver": "3.5.0",				
                    "scenes": [
                        {
                            "info": {
                                "id": "2d5594a553a94d6aa730eae410cf979e",
                                "name": "Scene 1",
                                "size": 0
                            },
                            "environment": {
                                "shader": "Skybox/Panoramic",
                                "scene_skybox_res_id": "SphericalImage",
                                "scene_skybox_snapshot_4096": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/10967167216a4d1f8a1e3f3243908971.png",
                                "scene_skybox_snapshot_2048": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/VRProjectMipmap/f91d71ef9a2844ba93a2d4dd7adb66dc_2048.jpg",
                                "scene_skybox_snapshot_1024": ""
                            },
                            "objs": [
                                {   //// ver. 3.5 相機物件
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
                                },
                                {   //// ver. 3.5 (不是預設物件的)GLTF模型物件
                                    "res_id": "7f3af322-9250-41c7-a397-9e862d3858dd",
                                    "transformAttr": {
                                    "transform": [
                                        "0,-1,5",
                                        "0,0,0,1",
                                        "10,0.1,10"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation":  "0,0,0"
                                    },
                                    "materialAttr": {
                                    "default_shader_name": "",
                                    "materials": [
                                        {
                                        "mode": 0,
                                        "name": "Default-Material",
                                        "color": "1,1,1,1",
                                        "shader": "Standard",
                                        "cut_off": 0.5,
                                        "metallic": 0,
                                        "smoothness": 0.5,
                                        "render_queue": 2450,
                                        "materialIndex": 0,
                                        "rendererIndex": 0
                                        }
                                    ]
                                    },
                                    "generalAttr": {
                                        "obj_id": "1a5d8ad4c55746619438d492eb877d24",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {}
                                },                         
                                {   //// ver. 3.5 文字物件
                                    "res_id": "Text",
                                    "generalAttr": {
                                        "obj_id": "cfae13e1b2624d49afb24bc7be6d4ff3",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "content": "3.5ver. 測試",
                                        "color": "1,1,1,1",
                                        "back_color": "1,1,1,0",
                                        "radious": 0.0,
                                        "margin": 0.0,
                                        "anchor_type": 3
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "0,3,3",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    }
                                },                         
                                {   //// ver. 3.5 圖片物件
                                    "res_id": "MakAR_Room",
                                    "transformAttr": {
                                    "transform": [
                                        "20,0,20",
                                        "0,0,0,1",
                                        "1,1,1"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation": "0,0,0"
                                    },
                                    "generalAttr": {
                                        "obj_id": "176f166abc0342b197e5b2e288d1038d",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "is_play": true,
                                        "volume": 1.0,
                                        "is_loop": true,
                                        "matting": {
                                        "HSV": "0,0,1",
                                        "hue": 0.2,
                                        "mode": "RGB",
                                        "slope": 0.2,
                                        "chromakey": "1,1,1,1",
                                        "threshold": 0.8,
                                        "brightness": 0.1,
                                        "saturation": 0.1
                                        }
                                    }
                                },                          
                                {   //// ver. 3.5 光源物件
                                    "res_id": "Light",
                                    "generalAttr": {
                                        "obj_id": "3d3270a3301c4067a8cb7c7e1afe6286",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "color": "1,0.5,0",
                                        "intensity": 5,
                                        "light_type": "spot",
                                        "range": 50,
                                        "shadow": "Soft",
                                        "shadow_strength": 1.0,
                                        "spotAngle": 40
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "0,5,5",
                                            "0.7132504,0,0,0.7009093",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "90,0,0"
                                    }
                                },                          
                                {   //// ver. 3.5 video 物件
                                    "res_id": "cdeb1966-4f3e-479c-9ebd-9a14a7cbb4fc",
                                    "transformAttr": {
                                        "transform": [
                                            "1,2,2",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "generalAttr": {
                                        "obj_id": "14ec425d07bd4965999a534c86a0ad2b",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "is_play": true,
                                        "volume": 1,
                                        "is_loop": true
                                    }
                                },                         
                                {   //// ver. 3.5 audio 物件
                                    "res_id": "cfb9db71-ca55-4f9e-aacb-da6e85747717",
                                    "transformAttr": {
                                    "transform": [
                                        "-3,0,2",
                                        "0,0,0,1",
                                        "1,1,1"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation": "0,0,0"
                                    },
                                    "generalAttr": {
                                        "obj_id": "cb7ac8752bb9460e801ee0ab6970400b",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": false,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "is_play": true,
                                        "volume": 1.0,
                                        "is_loop": true
                                    }
                                },                         
                                {   //// ver. 3.5 有動畫的(預設的)GLTF模型物件
                                    "res_id": "ch_Bojue",
                                    "transformAttr": {
                                    "transform": [
                                        "3,0,3",
                                        "0,0,0,1",
                                        "1,1,1"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation":  "0,0,0"
                                    },
                                    "materialAttr": {
                                    "default_shader_name": "",
                                    "materials": [
                                        {
                                        "mode": 0,
                                        "name": "Material #25",
                                        "color": "1,1,1,1",
                                        "shader": "Standard",
                                        "cut_off": 0.5,
                                        "metallic": 0.2,
                                        "smoothness": 0.2,
                                        "render_queue": 2450,
                                        "materialIndex": 0,
                                        "rendererIndex": 0
                                        }
                                    ]
                                    },
                                    "animationAttr": [
                                    {
                                        "uid": "2ba9f6c10b9044759f075917e4c8641d",
                                        "name": "Take 001",
                                        "group": 0,
                                        "like_it": false,
                                        "end_time": 5.116667,
                                        "is_active": true,
                                        "next_data": "-1",
                                        "wrap_mode": 0,
                                        "is_default": true,
                                        "is_playing": true,
                                        "start_time": 3.916667,
                                        "animation_name": "Take 001",
                                        "override_frame_rate": 60
                                    },
                                    {
                                        "uid": "1c7cfa76c6c841d3b715a892d77ee5a0",
                                        "name": "Take 002",
                                        "group": 0,
                                        "like_it": false,
                                        "end_time":  8.366667,
                                        "is_active": false,
                                        "next_data": "-1",
                                        "wrap_mode": 0,
                                        "is_default": false,
                                        "is_playing": true,
                                        "start_time": 5.15,
                                        "animation_name": "Take 001",
                                        "override_frame_rate": 60
                                    }
                                    ],
                                    "generalAttr": {
                                        "obj_id": "c22f9f4ee9624103ae741b68b57968c7",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {}
                                },                         
                                {   //// ver. 3.5 測試群組功能: 預設方塊 * 2 (3.5的group要去外層的behav找)
                                    "res_id": "Cube",
                                    "transformAttr": {
                                    "transform": [
                                        "-1,1,5",
                                        "0,0,0,1",
                                        "1,1,1"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation":  "0,0,0"
                                    },
                                    "materialAttr": {
                                    "default_shader_name": "",
                                    "materials": [
                                        {
                                            "mode": 0,
                                            "name": "Default-Material",
                                            "color": "1,1,1,1",
                                            "shader": "Standard",
                                            "cut_off": 0.5,
                                            "metallic": 0,
                                            "smoothness": 0.5,
                                            "render_queue": 2450,
                                            "materialIndex": 0,
                                            "rendererIndex": 0
                                        }
                                    ]
                                    },
                                    "generalAttr": {
                                        "obj_id": "testCube1",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": false,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {}
                                },
                                {
                                    "res_id": "Cube",
                                    "transformAttr": {
                                    "transform": [
                                        "1,1,5",
                                        "0,0,0,1",
                                        "1,1,1"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation":  "0,0,0"
                                    },
                                    "materialAttr": {
                                    "default_shader_name": "",
                                    "materials": [
                                        {
                                        "mode": 0,
                                        "name": "Default-Material",
                                        "color": "1,1,1,1",
                                        "shader": "Standard",
                                        "cut_off": 0.5,
                                        "metallic": 0,
                                        "smoothness": 0.5,
                                        "render_queue": 2450,
                                        "materialIndex": 0,
                                        "rendererIndex": 0
                                        }
                                    ]
                                    },
                                    "generalAttr": {
                                        "obj_id": "testCube2",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {}
                                },
                                {   //// ver. 3.5 文字物件 for 換場景
                                    "res_id": "Text",
                                    "generalAttr": {
                                        "obj_id": "Text4SceneChanging",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "content": "3.5ver. 換場景",
                                        "color": "1,1,1,1",
                                        "back_color": "1,1,1,0",
                                        "radious": 0.0,
                                        "margin": 0.0,
                                        "anchor_type": 3
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "4,3,4",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    }
                                },    
                                {   //// ver. 3.5.0 quiz物件 (點擊testCube2顯示)
                                    "res_id": "quiz",
                                    "generalAttr": {
                                        "obj_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                        "obj_name": "Quiz",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "logic": false,
                                        "interactable": true,
                                        "active": true
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "-3,3,3",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "materialAttr": {
                                        "materials": [],
                                        "default_shader_name": ""
                                    },
                                    "animationAttr": [],
                                    "typeAttr": {
                                        "module": {
                                            "name": "quiz",
                                            "subject_name": "\\u0051\\u0075\\u0069\\u007A",
                                            "timer_type": "Off",
                                            "total_time": 0,
                                            "score_type": "Off",
                                            "total_score": 0,
                                            "force_login": false,
                                            "allow_retry": false,
                                            "show_start_popup": true,
                                            "show_end_popup": true,
                                            "question_list": [
                                                {
                                                    "name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
                                                    "trigger_type": "Target",
                                                    "target_id": "testCube2",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "56b202b29f1e4cc88ad8d002d5a74ccf",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0.1632531,0",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "Q_u_e_s_t_i_o_n_1",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "MutiOption_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Button",
                                                            "generalAttr": {
                                                                "obj_id": "a2be1e49f14e420eb6aaf02f9877bc14",
                                                                "obj_name": "Button",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                    {
                                                                        "name": "Background",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "UI/Default",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    },
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Standard",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0.5,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "MakAR_Room",
                                                            "generalAttr": {
                                                                "obj_id": "bcb606a086504cbfb47eb642fb7e8e83",
                                                                "obj_name": "MakAR_Room",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "74b8f7fb-b8fc-4115-bd97-f80fc6de7e6e",
                                                            "generalAttr": {
                                                                "obj_id": "2462be1327a44454a2c2b3baa7608dfb",
                                                                "obj_name": "2-20612_light-png-free-download-flash-light-png",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "3,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        }
                                                    ],
                                                    "answer_list": [],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "3de7542a-4049-459e-aed4-7081fd494268"
                                                },
                                                {
                                                    "name": "Scene 2",
                                                    "trigger_type": "Directly",
                                                    "target_id": "c9870b6c0ec6b211650f946100eb86f2",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1544233643.065045.7871761158",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "1,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "default_shader_name": "",
                                                                "materials": [
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Material #25",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ]
                                                            },
                                                            "animationAttr": [
                                                                {
                                                                    "uid": "3d269ce763984e97a4755c9ca7563d85",
                                                                    "name": "Take 001",
                                                                    "group": 0,
                                                                    "like_it": false,
                                                                    "end_time": 2.166667,
                                                                    "is_active": true,
                                                                    "next_data": "-1",
                                                                    "wrap_mode": 0,
                                                                    "is_default": true,
                                                                    "is_playing": true,
                                                                    "start_time": 0,
                                                                    "animation_name": "Take 001",
                                                                    "override_frame_rate": 60
                                                                }
                                                            ],
                                                            "generalAttr": {
                                                                "obj_id": "f0d8ca76e91a4d9490c38c83475c87b9",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {}
                                                        },
                                                        {
                                                            "res_id": "f1284c00-eec3-4221-b549-6d70a21c83fd",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "ad5da2f8e8e645b09df8aec51abcdc0a",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                              "is_play": true,
                                                              "volume": 1.0,
                                                              "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Text",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "2e492f9689c54a58bf3134da15fb4ab3",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,-1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "option_2",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }                        
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/24230d15ada14a548d237b3da02b0066_quiz_snapshot.jpg"    
                                                },
                                                {
                                                    "name": "Scene 3",
                                                    "trigger_type": "Directly",
                                                    "target_id": "",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1258649b-3d5d-4d7f-9ecb-31f988305197",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "6550b5a1727c41c088ed66cd1511a845",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "cdeb1966-4f3e-479c-9ebd-9a14a7cbb4fc",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "ba4b4844779c43aa8a3e720fb220325b",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "c30688ae-db29-48e1-ade6-4ce62bf7fd94",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "8d45df65c9ca42f795ea1f4c844005f4",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "c2d83f21-0a60-4e37-ab88-a6be8102a78b",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "302d5b02a27849df9be7089863e7b96d",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "4d37f0ae5bcf4e788b05f5df2571b66f",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }             
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/2d8cba02361942c4a0e6674426eec217_quiz_snapshot.jpg"
                                                }
                                            ],
                                            "display_order_list": [
                                                {
                                                    "name": "NO.1",
                                                    "index": 0,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.2",
                                                    "index": 1,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.3",
                                                    "index": 2,
                                                    "sort_type": "Fixed"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {   //// ver. 3.5.0 quiz物件 (直接顯示 + 同時有兩個 quiz 存在場上的情況 )
                                    "res_id": "quiz",
                                    "generalAttr": {
                                        "obj_id": "multiple_quizzes_test",
                                        "obj_name": "Quiz",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "logic": false,
                                        "interactable": true,
                                        "active": true
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "7,6,5",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "materialAttr": {
                                        "materials": [],
                                        "default_shader_name": ""
                                    },
                                    "animationAttr": [],
                                    "typeAttr": {
                                        "module": {
                                            "name": "quiz",
                                            "subject_name": "\\u0051\\u0075\\u0069\\u007A",
                                            "timer_type": "Off",
                                            "total_time": 60,
                                            "score_type": "Off",
                                            "total_score": 0,
                                            "force_login": false,
                                            "allow_retry": false,
                                            "show_start_popup": true,
                                            "show_end_popup": true,
                                            "question_list": [
                                                {
                                                    "name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
                                                    "trigger_type": "Directly",
                                                    "target_id": "c9870b6c0ec6b211650f946100eb86f2",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_text1",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0.1632531,0",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "Q_u_e_s_t_i_o_n_1",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "MutiOption_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Button",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_Button1",
                                                                "obj_name": "Button",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                    {
                                                                        "name": "Background",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "UI/Default",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    },
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Standard",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0.5,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "MakAR_Room",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_text1_MarAR_Room",
                                                                "obj_name": "MakAR_Room",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "74b8f7fb-b8fc-4115-bd97-f80fc6de7e6e",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_text1_image",
                                                                "obj_name": "2-20612_light-png-free-download-flash-light-png",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "3,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        }
                                                    ],
                                                    "answer_list": [],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "3de7542a-4049-459e-aed4-7081fd494268"
                                                },
                                                {
                                                    "name": "Scene 2",
                                                    "trigger_type": "Directly",
                                                    "target_id": "c9870b6c0ec6b211650f946100eb86f2",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1544233643.065045.7871761158",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "1,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "default_shader_name": "",
                                                                "materials": [
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Material #25",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ]
                                                            },
                                                            "animationAttr": [
                                                                {
                                                                    "uid": "3d269ce763984e97a4755c9ca7563d85",
                                                                    "name": "Take 001",
                                                                    "group": 0,
                                                                    "like_it": false,
                                                                    "end_time": 2.166667,
                                                                    "is_active": true,
                                                                    "next_data": "-1",
                                                                    "wrap_mode": 0,
                                                                    "is_default": true,
                                                                    "is_playing": true,
                                                                    "start_time": 0,
                                                                    "animation_name": "Take 001",
                                                                    "override_frame_rate": 60
                                                                }
                                                            ],
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_model1",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {}
                                                        },
                                                        {
                                                            "res_id": "f1284c00-eec3-4221-b549-6d70a21c83fd",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_audio1",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                              "is_play": true,
                                                              "volume": 1.0,
                                                              "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Text",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_text2",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,-1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "option_2",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }                        
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/24230d15ada14a548d237b3da02b0066_quiz_snapshot.jpg"    
                                                },
                                                {
                                                    "name": "Scene 3",
                                                    "trigger_type": "Directly",
                                                    "target_id": "",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1258649b-3d5d-4d7f-9ecb-31f988305197",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_imageQ",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "cdeb1966-4f3e-479c-9ebd-9a14a7cbb4fc",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_imageQ2",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "c30688ae-db29-48e1-ade6-4ce62bf7fd94",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_imageA",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "c2d83f21-0a60-4e37-ab88-a6be8102a78b",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_audio2",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }             
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/2d8cba02361942c4a0e6674426eec217_quiz_snapshot.jpg"
                                                }
                                            ],
                                            "display_order_list": [
                                                {
                                                    "name": "NO.1",
                                                    "index": 0,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.2",
                                                    "index": 1,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.3",
                                                    "index": 2,
                                                    "sort_type": "Fixed"
                                                }
                                            ]
                                        }
                                    }
                                },
                                {   //// ver. 3.5.0 quiz物件 (點擊testCube1顯示 + 同時有三個 quiz 存在場上的情況 )
                                    "res_id": "quiz",
                                    "generalAttr": {
                                        "obj_id": "multiple_quizzes_test_2",
                                        "obj_name": "Quiz",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "logic": false,
                                        "interactable": true,
                                        "active": true
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "3,4,6",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "materialAttr": {
                                        "materials": [],
                                        "default_shader_name": ""
                                    },
                                    "animationAttr": [],
                                    "typeAttr": {
                                        "module": {
                                            "name": "quiz",
                                            "subject_name": "\\u0051\\u0075\\u0069\\u007A",
                                            "timer_type": "Off",
                                            "total_time": 0,
                                            "score_type": "Off",
                                            "total_score": 0,
                                            "force_login": false,
                                            "allow_retry": false,
                                            "show_start_popup": true,
                                            "show_end_popup": true,
                                            "question_list": [
                                                {
                                                    "name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
                                                    "trigger_type": "Target",
                                                    "target_id": "testCube1",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_text1",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0.1632531,0",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "Q_u_e_s_t_i_o_n_1",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "MutiOption_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Button",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_Button1",
                                                                "obj_name": "Button",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                    {
                                                                        "name": "Background",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "UI/Default",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    },
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Standard",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0.5,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "MakAR_Room",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_text1_MarAR_Room",
                                                                "obj_name": "MakAR_Room",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "74b8f7fb-b8fc-4115-bd97-f80fc6de7e6e",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_text1_image",
                                                                "obj_name": "2-20612_light-png-free-download-flash-light-png",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "3,5,3",
                                                                    "0,0,0,1",
                                                                    "0.5,0.5,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [
                                                                        {
                                                                        "name": "MiflyShader/DoubleFace",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "MiflyShader/DoubleFace",
                                                                        "render_queue": 3000,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        }
                                                    ],
                                                    "answer_list": [],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "3de7542a-4049-459e-aed4-7081fd494268"
                                                },
                                                {
                                                    "name": "Scene 2",
                                                    "trigger_type": "Directly",
                                                    "target_id": "c9870b6c0ec6b211650f946100eb86f2",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1544233643.065045.7871761158",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "1,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "default_shader_name": "",
                                                                "materials": [
                                                                    {
                                                                        "mode": 0,
                                                                        "name": "Material #25",
                                                                        "color": "1,1,1,1",
                                                                        "shader": "Standard",
                                                                        "cut_off": 0.5,
                                                                        "metallic": 0,
                                                                        "smoothness": 0,
                                                                        "render_queue": 2450,
                                                                        "materialIndex": 0,
                                                                        "rendererIndex": 0
                                                                    }
                                                                ]
                                                            },
                                                            "animationAttr": [
                                                                {
                                                                    "uid": "3d269ce763984e97a4755c9ca7563d85",
                                                                    "name": "Take 001",
                                                                    "group": 0,
                                                                    "like_it": false,
                                                                    "end_time": 2.166667,
                                                                    "is_active": true,
                                                                    "next_data": "-1",
                                                                    "wrap_mode": 0,
                                                                    "is_default": true,
                                                                    "is_playing": true,
                                                                    "start_time": 0,
                                                                    "animation_name": "Take 001",
                                                                    "override_frame_rate": 60
                                                                }
                                                            ],
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_model1",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {}
                                                        },
                                                        {
                                                            "res_id": "f1284c00-eec3-4221-b549-6d70a21c83fd",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,0,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_audio1",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                              "is_play": true,
                                                              "volume": 1.0,
                                                              "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Text",
                                                    "options_json": [
                                                        {
                                                            "res_id": "Text",
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_text2",
                                                                "obj_name": "Text",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "logic": false,
                                                                "interactable": true,
                                                                "active": true
                                                            },
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,-1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "materialAttr": {
                                                                "materials": [],
                                                                "default_shader_name": ""
                                                            },
                                                            "animationAttr": [],
                                                            "typeAttr": {
                                                                "content": "option_2",
                                                                "color": "1,1,1,1",
                                                                "back_color": "1,1,1,0",
                                                                "radious": 0.0,
                                                                "margin": 0.0,
                                                                "anchor_type": 3
                                                            }
                                                        }                        
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/24230d15ada14a548d237b3da02b0066_quiz_snapshot.jpg"    
                                                },
                                                {
                                                    "name": "Scene 3",
                                                    "trigger_type": "Directly",
                                                    "target_id": "",
                                                    "questions_json": [
                                                        {
                                                            "res_id": "1258649b-3d5d-4d7f-9ecb-31f988305197",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_imageQ",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "cdeb1966-4f3e-479c-9ebd-9a14a7cbb4fc",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,3,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_imageQ2",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }
                                                    ],
                                                    "allowRandom": false,
                                                    "option_type": "Option_Image",
                                                    "options_json": [
                                                        {
                                                            "res_id": "c30688ae-db29-48e1-ade6-4ce62bf7fd94",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "-3,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_imageA",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "render_queue": 3000
                                                            }
                                                        },
                                                        {
                                                            "res_id": "c2d83f21-0a60-4e37-ab88-a6be8102a78b",
                                                            "transformAttr": {
                                                                "transform": [
                                                                    "0,1,3",
                                                                    "0,0,0,1",
                                                                    "1,1,1"
                                                                ],
                                                                "rect_transform": [],
                                                                "simulated_rotation": "0,0,0"
                                                            },
                                                            "generalAttr": {
                                                                "obj_id": "multiple_quizzes_test_2_audio2",
                                                                "obj_type": "3d",
                                                                "obj_parent_id": "multiple_quizzes_test_2",
                                                                "active": true,
                                                                "interactable": true,
                                                                "logic": false
                                                            },
                                                            "typeAttr": {
                                                                "is_play": true,
                                                                "volume": 1.0,
                                                                "is_loop": true
                                                            }
                                                        }             
                                                    ],
                                                    "answer_list": [
                                                        1
                                                    ],
                                                    "score": 0,
                                                    "time_limit": 60,
                                                    "show_score": false,
                                                    "active_score": true,
                                                    "show_tips": false,
                                                    "tips_content": "",
                                                    "tips_image_id": "",
                                                    "cover_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/2d8cba02361942c4a0e6674426eec217_quiz_snapshot.jpg"
                                                }
                                            ],
                                            "display_order_list": [
                                                {
                                                    "name": "NO.1",
                                                    "index": 0,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.2",
                                                    "index": 1,
                                                    "sort_type": "Fixed"
                                                },
                                                {
                                                    "name": "NO.3",
                                                    "index": 2,
                                                    "sort_type": "Fixed"
                                                }
                                            ]
                                        }
                                    }
                                },                         
                                {   //// ver. 3.5 2d圖片物件
                                    "res_id": "MakAR_Mail",
                                    "transformAttr": {
                                        "transform": [
                                            "-213.5894,490.18,0",
                                            "0,0,0,1",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [
                                            {
                                                "scale": "1,1,1",
                                                "position": "-213.5894,490.18,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            },
                                            {
                                                "scale": "1,1,1",
                                                "position": "-676.7153,215.0036,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            },
                                            {
                                                "scale": "1,1,1",
                                                "position": "217.0869,695.6343,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            }
                                        ],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "generalAttr": {
                                        "obj_id": "test_2D_image",
                                        "obj_type": "2d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "is_play": true,
                                        "volume": 1.0,
                                        "is_loop": true,
                                        "matting": {
                                            "HSV": "0,0,1",
                                            "hue": 0.2,
                                            "mode": "RGB",
                                            "slope": 0.2,
                                            "chromakey": "1,1,1,1",
                                            "threshold": 0.8,
                                            "brightness": 0.1,
                                            "saturation": 0.1
                                        }
                                    }
                                },                         
                                {   //// ver. 3.5 2d圖片物件
                                    "res_id": "MakAR_Room",
                                    "transformAttr": {
                                        "transform": [
                                            "213.5894,-484.0336,0",
                                            "0,0,0,1",  
                                            "1,1,1"
                                        ],
                                        "rect_transform": [
                                            {
                                                "scale": "1,1,1",
                                                "position": "213.5894,-484.0336,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            },
                                            {
                                                "scale": "1,1,1",
                                                "position": "680.0355,210.1138,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            },
                                            {
                                                "scale": "1,1,1",
                                                "position": "-204.986,-693.1133,0",
                                                "rotation": "0,0,0,1",
                                                "size_dalta": "270,270",
                                                "simulated_rotation": "0,0,0"
                                            }
                                        ],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "generalAttr": {
                                        "obj_id": "test_2D_image",
                                        "obj_type": "2d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "is_play": true,
                                        "volume": 1.0,
                                        "is_loop": true,
                                        "matting": {
                                            "HSV": "0,0,1",
                                            "hue": 0.2,
                                            "mode": "RGB",
                                            "slope": 0.2,
                                            "chromakey": "1,1,1,1",
                                            "threshold": 0.8,
                                            "brightness": 0.1,
                                            "saturation": 0.1
                                        }
                                    }
                                }

                            ],
                            "behav": [
                                {   //// 展示音樂 / 影片
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "cfae13e1b2624d49afb24bc7be6d4ff3",
                                    "behav_type": "Media",
                                    "switch_type": "Switch",
                                    "obj_id": "14ec425d07bd4965999a534c86a0ad2b",
                                    "group": ""
                                },
                                {   //// 展示模型 群組1
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "176f166abc0342b197e5b2e288d1038d",
                                    "behav_type": "Display",
                                    "switch_type": "Switch",
                                    "obj_id": "testCube1",
                                    "group": "1"
                                },
                                {   //// 展示模型 群組2
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "176f166abc0342b197e5b2e288d1038d",
                                    "behav_type": "Display",
                                    "switch_type": "Switch",
                                    "obj_id": "testCube2",
                                    "group": "2"
                                },
                                {   //// 展示模型 群組3
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "1a5d8ad4c55746619438d492eb877d24",
                                    "behav_type": "Display",
                                    "switch_type": "Switch",
                                    "obj_id": "testCube1",
                                    "group": "1"
                                },
                                {   //// 切換動畫1
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "testCube1",
                                    "behav_type": "Animation", //// ver. 3.5                   
                                    "obj_id": "c22f9f4ee9624103ae741b68b57968c7",
                                    "uid": "2ba9f6c10b9044759f075917e4c8641d",
                                    "loop": false,
                                    "reset": true
                                },
                                {   //// 切換動畫2
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "testCube2",
                                    "behav_type": "Animation", //// ver. 3.5                   
                                    "obj_id": "c22f9f4ee9624103ae741b68b57968c7",
                                    "uid": "1c7cfa76c6c841d3b715a892d77ee5a0",
                                    "loop": false,
                                    "reset": true
                                }, 
                                {   //// 播放語音
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "c22f9f4ee9624103ae741b68b57968c7",
                                    "behav_type": "TTS",
                                    "obj_id": "cfae13e1b2624d49afb24bc7be6d4ff3",
                                    "language": 1,
                                    "pitch": 1,
                                    "speed": 1
                                },
                                {   //// 轉換場景
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "Text4SceneChanging",
                                    "behav_type": "Scenes",
                                    "scene_id": "testScene2"
                                }
                            ],
                            "target_ids": [
                                "testCube2",
                                "testCube1"
                            ],
                            "blocklyXML_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/XML/c5c149c0-da58-4f63-83b5-000ff68767bc.xml",
                            "orientation": [
                                {
                                    "type": 9,
                                    "title": "9:16",
                                    "width": 720,
                                    "height": 1280,
                                    "platform": 0
                                },
                                {
                                    "type": 0,
                                    "title": "21:9",
                                    "width": 1680,
                                    "height": 720,
                                    "platform": 0
                                },
                                {
                                    "type": 1,
                                    "title": "9:21",
                                    "width": 720,
                                    "height": 1680,
                                    "platform": 0
                                }
                            ]
                        },
                        {                        
                            "info": {
                                "id": "testScene2",
                                "name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
                                "size": 4235
                            },
                            "environment": {
                                "shader": "Skybox/Panoramic",
                                "scene_skybox_res_id": "SphericalImage",
                                "scene_skybox_snapshot_4096": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/VRProjectMipmap/331f7ef86300497e85183edb9dcd066c_4096.jpg",
                                "scene_skybox_snapshot_2048": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/VRProjectMipmap/3ddbec96918c4c91b466e693eea93a42_2048.jpg",
                                "scene_skybox_snapshot_1024": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/Resource/87414abd86254b6990f7808b64f9517b.png"
                            },
                            "objs": [
                                {   //// ver. 3.5 相機物件
                                    "res_id": "Camera",
                                    "generalAttr": {
                                        "obj_id": "e953091e-bf9c-4460-bb0c-807944dae33e",
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
                                },
                                {   //// ver. 3.5 圖片物件
                                    "res_id": "2ff220b7-e7bd-457a-ae32-735203882cb8",
                                    "transformAttr": {
                                        "transform": [
                                        "0,1.25,2",
                                        "0,0,0,1",
                                        "0.5,0.5,0.5"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "0,0,0"
                                    },
                                    "materialAttr": {
                                        "default_shader_name": "",
                                        "materials": [
                                        {
                                            "name": "MiflyShader/DoubleFace",
                                            "color": "1,1,1,1",
                                            "shader": "MiflyShader/DoubleFace",
                                            "render_queue": 3000,
                                            "materialIndex": 0,
                                            "rendererIndex": 0
                                        }
                                        ]
                                    },
                                    "animationAttr": [],
                                    "generalAttr": {
                                        "obj_id": "fd064cdbf80247c8b5484afa2f277144",
                                        "obj_name": "flash",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {}
                                },
                                {   //// ver. 3.5 模型: 古怪動物-角蜥
                                    "res_id": "f82f0bd3183f16a3e8abb0a9614610c1",
                                    "transformAttr": {
                                    "transform": [
                                        "0.1,1,2",
                                        "-0.9576622, 0.126079, -0.2566046, -0.03378274",
                                        "0.5,0.5,0.5"
                                    ],
                                    "rect_transform": [],
                                    "simulated_rotation": "-15,30,0"
                                    },
                                    "materialAttr": {
                                    "default_shader_name": "",
                                    "materials": [
                                        {
                                        "mode": 0,
                                        "name": "HornedLizard",
                                        "color": "1,1,1,1",
                                        "shader": "Unlit/Texture",
                                        "cut_off": 0.5,
                                        "metallic": 0.9,
                                        "smoothness": 0.2,
                                        "render_queue": 2000,
                                        "materialIndex": 0,
                                        "rendererIndex": 0
                                        }
                                    ]
                                    },
                                    "animationAttr": [
                                        {
                                        "uid": "0ec55d300e9941ce84b945a27dd45d4b",
                                        "name": "Take 001",
                                        "group": 0,
                                        "like_it": false,
                                        "end_time": 0.4166667,
                                        "is_active": true,
                                        "next_data": "-1",
                                        "wrap_mode": 0,
                                        "is_default": true,
                                        "is_playing": true,
                                        "start_time": 0,
                                        "animation_name": "Take 001",
                                        "override_frame_rate": 60
                                        },
                                    ],                                  
                                    "generalAttr": {
                                        "obj_id": "fbd92500c66046bfb8699f7a8b040466",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": true
                                    },
                                    "typeAttr": {}                              
                                },                         
                                {   //// ver. 3.5 光源物件
                                    "res_id": "Light",
                                    "generalAttr": {
                                        "obj_id": "3d3270a3301c4067a8cb7c7e1afe6286",
                                        "obj_type": "3d",
                                        "obj_parent_id": "",
                                        "active": true,
                                        "interactable": true,
                                        "logic": false
                                    },
                                    "typeAttr": {
                                        "color": "1,0.5,0",
                                        "intensity": 5,
                                        "light_type": "spot",
                                        "range": 50,
                                        "shadow": "Soft",
                                        "shadow_strength": 1.0,
                                        "spotAngle": 90
                                    },
                                    "transformAttr": {
                                        "transform": [
                                            "0,10,5",
                                            "0.7132504,0,0,0.7009093",
                                            "1,1,1"
                                        ],
                                        "rect_transform": [],
                                        "simulated_rotation": "90,0,0"
                                    }
                                }
                            ],
                            "behav": [
                                {    //// ver. 3.5 轉換場景
                                    "trigger_type": "Click",
                                    "trigger_obj_id": "59a65b3ab56f4ed5b537cc6dd299037c",
                                    "behav_type": "Scenes",
                                    "scene_id": "2d5594a553a94d6aa730eae410cf979e"
                                }
                            ],
                            "target_ids": [],
                            "blocklyXML_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/76ad6ef7-e89e-4f35-9c8d-0f40617f64a1/XML/c4d367d2-702c-438d-8879-95fd9b58778c.xml"
                            
                        }
                    ]
                }
            ]

            //// for 測試機
            // let test_proj = {
            //     result: [
            //         {},
            //         {
            //             "proj_id": "0189d919-111f-84c1-910e-1205349cc0f0",
            //             "proj_name": "\\u0032\\u0030\\u0032\\u0033\\u002D\\u0030\\u0038\\u002D\\u0030\\u0039\\u002D\\u0030\\u0032",
            //             "proj_type": "vr",
            //             "proj_descr": "",
            //             "user_id": "miflytest",
            //             "proj_platform": [
            //                 "app"
            //             ],
            //             "snapshot_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/ProjectSnapshot/4a8e274fa8e44043afd64edcd813a66f_snapshot.jpg",
            //             "proj_cover_urls": [],
            //             "create_date": "2023-08-09T07:00:45.978Z",
            //             "last_update_date": "2023-08-09T07:00:50.287Z",
            //             "proj_size": "17106216",
            //             "permission": 1,
            //             "permission_friend": [],
            //             "tags": [],
            //             "category": [
            //                 "ArtDesign"
            //             ],
            //             "default_resolution": "720,1080",
            //             "orientation": [
            //                 {
            //                     "type": 9,
            //                     "title": "\\u0039\\u003A\\u0031\\u0036",
            //                     "width": 720,
            //                     "height": 1280,
            //                     "platform": 0
            //                 }
            //             ],
            //             "module_type": [],
            //             "xml_urls": [
            //                 "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/98f4d067-c262-455a-9322-795e604937e9.xml"
            //             ],
            //             "loc": [],
            //             "target_ids": [],
            //             "use_gyro_instead_slam": false,
            //             "show_target": true,
            //             "editor_ver": "3.4.5",
            //         }
            //     ]
            // }
            // let test_scene = [
            //     {

            //     },
            //     {                                    
            //         "editor_ver": "3.4.5",
            //         "scenes": [
            //         {
            //             "info": {
            //                 "id": "\\u0035\\u0038\\u0062\\u0061\\u0034\\u0062\\u0039\\u0030\\u0063\\u0030\\u0032\\u0062\\u0034\\u0066\\u0034\\u0062\\u0062\\u0066\\u0038\\u0030\\u0036\\u0061\\u0034\\u0065\\u0036\\u0063\\u0065\\u0031\\u0030\\u0039\\u0065\\u0032",
            //                 "name": "\\u0053\\u0063\\u0065\\u006E\\u0065\\u0020\\u0031",
            //                 "size": 17106216
            //             },
            //             "environment": {
            //                 "shader": "Skybox/Panoramic",
            //                 "scene_skybox_res_id": "SphericalImage",
            //                 "scene_skybox_snapshot_4096": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/VRProjectMipmap/8dab7534e4874a1a9331d566a637602e_4096.jpg",
            //                 "scene_skybox_snapshot_2048": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/VRProjectMipmap/78efeff0ba864d0599ffa61c0a33833e_2048.jpg",
            //                 "scene_skybox_snapshot_1024": ""
            //             },
            //             "objs": [
            //             {
            //                 "res_id": "Camera",
            //                 "generalAttr": {
            //                     "obj_id": "1d6cc72d-d856-4753-8f15-1d300194ab0a",
            //                     "obj_name": "Camera",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "transformAttr": {
            //                 "transform": [
            //                     "0,1.7,0",
            //                     "0,0,0,1",
            //                     "1,1,1"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "materialAttr": {
            //                 "default_shader_name": "",
            //                 "materials": []
            //                 },
            //                 "animationAttr": [],
            //                 "blocklyAttr": {},
            //                 "typeAttr": {
            //                 "fov": 80.0
            //                 }
            //             },
            //             {
            //                 "res_id": "2ce9a560c0f19b84c8731e9e4bc60c21",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "0,0,10",
            //                     "0,0,0,1",
            //                     "1,1,1"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "2c0688bb34114db68194889618c60bbb",
            //                     "obj_name": "chicken",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                 "render_queue": 3000
            //                 }
            //             },
            //             {   //// video
            //                 "res_id": "253f7713c9ba4b33f3e4f980090b31e1",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "2,1.851923,7",
            //                     "0,0.2996256,0,0.9540569",
            //                     "3.797745,3.797745,3.797745"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,34.87024,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "d9cff487658a4a409836b8b19a5454d2",
            //                     "obj_name": "SampleVideo_1280x720_10mb",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                     "is_play": true,
            //                     "volune": 1,
            //                     "is_loop": true
            //                 }
            //             },
            //             {
            //                 "res_id": "e36a0f270a8aca017e6b376c11101b07",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "1,2.230011,13.12077",
            //                     "0,0,0,1",
            //                     "1,1,1"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "a55cf13bc5df4ee084f603871e6ebe4f",
            //                     "obj_name": "雞毛毯子-uu字",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                 "clips": [
            //                     {
            //                     "uid": "53a37367-24bc-4b2f-9eb4-0ff7d090be2a",
            //                     "is_default": true,
            //                     "name": "Default",
            //                     "is_active": true,
            //                     "is_playing": true,
            //                     "start_shift": 0,
            //                     "end_shift": 132
            //                     }
            //                 ],
            //                 "render_queue": 3000
            //                 }
            //             },
            //             {   //// youtube video
            //                 "res_id": "1556242033.6027513.0482515298",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "-5.949663,1.533665,9.229993",
            //                     "0,0.186963,0,-0.982367",
            //                     "5.329144,5.329144,5.329144"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,-21.55119,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "2afeb4ee677c48ce8497f6fbf6388918",
            //                     "obj_name": "MAKAR VIDEO",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                 "volune": 1.0,
            //                 "is_loop": true
            //                 }
            //             },
            //             {
            //                 "res_id": "b9629a2033b509c0fc411313faba80e8",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "-3,0,6",
            //                     "0,0,0,1",
            //                     "0.6781418,0.6781418,0.6781418"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "materialAttr": {
            //                 "default_shader_name": "",
            //                 "materials": [
            //                     {
            //                     "mode": 0,
            //                     "name": "Material #88",
            //                     "color": "1,1,1,1",
            //                     "shader": "Standard",
            //                     "cut_off": 0.5,
            //                     "metallic": 0.4,
            //                     "smoothness": 0.2928932,
            //                     "render_queue": 2450,
            //                     "materialIndex": 0,
            //                     "rendererIndex": 0
            //                     },
            //                     {
            //                     "mode": 0,
            //                     "name": "Material #89",
            //                     "color": "1,1,1,1",
            //                     "shader": "Standard",
            //                     "cut_off": 0.5,
            //                     "metallic": 0.4,
            //                     "smoothness": 0.2928932,
            //                     "render_queue": 2450,
            //                     "materialIndex": 1,
            //                     "rendererIndex": 0
            //                     }
            //                 ]
            //                 },
            //                 "animationAttr": [
            //                 {
            //                     "uid": "0ad4b819cf2b4d259d41aa428c57d9b9",
            //                     "name": "Bravo_swimsuit(old)",
            //                     "group": 0,
            //                     "like_it": false,
            //                     "end_time": 10,
            //                     "is_active": true,
            //                     "next_data": "-1",
            //                     "wrap_mode": 0,
            //                     "is_default": true,
            //                     "is_playing": true,
            //                     "start_time": 0,
            //                     "animation_name": "Bravo_swimsuit(old)",
            //                     "override_frame_rate": 60
            //                 }
            //                 ],
            //                 "generalAttr": {
            //                     "obj_id": "318359baa5cd4ac5b5d3ce771e41f4cc",
            //                     "obj_name": "swimsuit",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {}
            //             },
            //             {   //// audio
            //                 "res_id": "fTAcktXU0v0azxo4kxbkibr3",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "1,0,5",
            //                     "0,0,0,1",
            //                     "1,1,1"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "f052dbcc6df740e3b83bedb766ab6e6b",
            //                     "obj_name": "button3020",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     // "active": false,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                     // "is_play": true,
            //                     "volume": 0.1,
            //                     "is_loop": false
            //                 }
            //             },
            //             {
            //                 "res_id": "Text",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "-2,0.6942763,4",
            //                     "0,0,0,1",
            //                     "1.598131,1.598131,1.598131"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "0,0,0"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "776f4fe06be2403487373a7e442e45cc",
            //                     "obj_name": "Text",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                 "content": "Text",
            //                 "color": "0.9686275,0.1882353,0.4196078,1",
            //                 "back_color": "0.3529412,0.9843137,0.1921569,1",
            //                 "radious": 0.4210526,
            //                 "margin": 34.0,
            //                 "anchor_type": 4,
            //                 "language": 0,
            //                 "pitch": 1.0,
            //                 "speed": 1.0
            //                 }
            //             },
            //             {
            //                 "res_id": "Light",
            //                 "transformAttr": {
            //                 "transform": [
            //                     "-4.94288,1.280694,4.760359",
            //                     "0.2646706,0.137911,0.01817114,0.9542535",
            //                     "1,1,1"
            //                 ],
            //                 "rect_transform": [],
            //                 "simulated_rotation": "30.99743,15.81992,-2.471623"
            //                 },
            //                 "generalAttr": {
            //                     "obj_id": "f3fcdecf85c3498aa7f25c4b776c5286",
            //                     "obj_name": "Light",
            //                     "obj_type": "3d",
            //                     "obj_parent_id": "",
            //                     "active": true,
            //                     "interactable": true,
            //                     "logic": false
            //                 },
            //                 "typeAttr": {
            //                 "color": "1,1,1",
            //                 "intensity": 2.558442,
            //                 "light_type": "spot",
            //                 "range": 10.0,
            //                 "shadow": "Soft",
            //                 "shadow_strength": 1.0,
            //                 "spotAngle": 30.0
            //                 }
            //             }
            //             ],
            //             "behav": [],
            //             "target_ids": [],
            //             "blocklyXML_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets0test/Users/miflytest/XML/98f4d067-c262-455a-9322-795e604937e9.xml"
            //         }
            //         ]
            //     }
            // ]
            // let vrController = new VRController(test_scene, test_proj, projIndex, languageType, worldContent);

            //// 開發 3.5.0 「專案編號 與 場景編號 」固定
            projIndex = 1;

            let vrController = new _VRController_js__WEBPACK_IMPORTED_MODULE_2__["default"](new_scene , new_proj, projIndex, languageType, worldContent);
            window.vrController = vrController;
            //[end-20230728-howardhsu-add]//

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

                //[start-20231013-howardhsu-add]//
                //// try to add 2D scene
                vrScene.renderer.autoClear = false; // make the 2D Camera can render to the same WebGLRenderer of VRScene
                
				//////// add the scene for 2D object
				let scene2D = new THREE.Scene();
				vrController.scene2D = scene2D;               
                
                let w = vrDiv.clientWidth
                let h = vrDiv.clientHeight

				let camera2D = new THREE.OrthographicCamera( -w/2, w/2, -h/2, h/2, -100, 20000);
				vrController.camera2D = camera2D;
                //[end-20231013-howardhsu-add]//
    
                vrController.vrScene = vrScene;
                vrController.GLRenderer = vrScene.renderer;

                // //[start-20231013-howardhsu-add]//
                // ///// 載入相機完成之後，設定對應 物件放大比例
                // let  sr2D = vrController.get2DScaleRatio();
                // vrController.set2DScaleRatio( sr2D ) ;
                // //[end-20231013-howardhsu-add]//

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

                    //[start-20231013-howardhsu-add]//
                    ///// 載入相機完成之後，設定對應 物件放大比例
                    let  sr2D = vrController.get2DScaleRatio();
                    vrController.set2DScaleRatio( sr2D ) ;
                    //[end-20231013-howardhsu-add]//

                    //// 先將觸控關閉，再跳轉場景
                    vrController.triggerEnable = false;
                    vrController.loadScene(projIndex, sceneIndex);
                    vrController.userStartTime = new Date().getTime();
                    
                    // vrController.update();
                    (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.checkHost_tick)();
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

            
            let renderTick = function() {
                vrController.GLRenderer.clearDepth();
    //20221206-thonsha-add-start
                if (vrController.needsRenderTarget){
                    vrController.GLRenderer.setRenderTarget( vrController.skyRenderTarget );
                    vrController.GLRenderer.render( vrController.onlySkyScene, vrController.vrScene.camera );
                    vrController.GLRenderer.setRenderTarget( null );
                }
    //20221206-thonsha-add-end
                vrController.GLRenderer.render( vrController.vrScene.object3D, vrController.vrScene.camera );

                //[start-20231013-howardhsu-add]//
                //// try to add 2D scene

                //// 測試 確認真的有scene2D之後直接移除這段
                // const geometry = new THREE.BoxGeometry( 200, 200, 200 );
                // const material = new THREE.MeshBasicMaterial( { color: 0x44aa88 } ); // greenish blue
                // const cube = new THREE.Mesh( geometry, material );
                // vrController.scene2D.add( cube );
                // console.log( 'performance.now() = ', performance.now()  )

				vrController.GLRenderer.render( vrController.scene2D, vrController.camera2D );
                //[end-20231013-howardhsu-add]//

                // console.log("renderTick");
                requestAnimationFrame(renderTick); // dont use it, because of the haning problem
            };


        }
        
    }

    // function makeid(length) {
    //     var result           = '';
    //     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     var charactersLength = characters.length;
    //     for ( var i = 0; i < length; i++ ) {
    //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
    //     }
    //     return result;
    // }

	let leavedSendLog = window.leavedSendLog = function(e) {
		if (!window.publishVRProjs) return;
		if (!publishVRProjs.result) return;
		if (!publishVRProjs.result[0].user_id) return;

		let device_id;
		if (localStorage.getItem("device_id")){
			if (localStorage.getItem("device_id") >= 24 ){
				device_id = localStorage.getItem("device_id");
			}else{
				device_id = new Date().getTime() + "_" + (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.makeid)(10) ;
				localStorage.setItem( "device_id",  device_id );
			}
		}else{
			device_id = new Date().getTime() + "_" + (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.makeid)(10) ;
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

    let scope;
    if (typeof window !== 'undefined') {
        scope = window;
    } else {
        scope = self;
    }
    // scope.VRController = VRController;

    let integrateCount = 0;
    let integrateTick = function() {
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

    let worldContent = window.worldContent = {

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

/***/ }),

/***/ "./js/VRMain/version3_5/handleAframeEvent.js":
/*!***************************************************!*\
  !*** ./js/VRMain/version3_5/handleAframeEvent.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleClickEvent: () => (/* binding */ handleClickEvent),
/* harmony export */   handleFusingEvent: () => (/* binding */ handleFusingEvent)
/* harmony export */ });
function handleFusingEvent( event ){

    //20191023-start-thonsha-mod
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

function handleClickEvent( event ) {

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
                if (this.object3D.behav[i].behav_type == "CloseAndResetChildren"){
                    reset = true;
                }
            }

            for(let i=0;i<this.object3D.behav.length;i++){
                if (this.object3D.behav[i].behav_type != "CloseAndResetChildren"){
                   //[start-20230919-howardhsu-modify]//
                    if(touchObject.behav[i].behav_type == "ShowQuiz"){
                            
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
        // [end-20230920-howardhsu-modify]//	
    }
    //20191023-end-thonsha-mod

}

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/AudioModule.js":
/*!*************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/AudioModule.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadAudio: () => (/* binding */ loadAudio)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GLTFModelModule.js */ "./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js");



function loadAudio(vrController, obj , position, rotation, scale) {
    //20191105-start-thonsha-add
    console.log("VRFunc.js: _loadAudio , obj=", obj );
    let self = vrController
    let pAudio = new Promise( function( audioResolve ){

        ;(0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( obj.res_url , function( retStatus ){
            //// 先檢查「聲音物件網址是否存在」，否的話，載入「問號模型物件」
            if ( retStatus == true ){

                let assets = document.getElementById("makarAssets");

                let assetsitem = document.createElement("audio");
                assetsitem.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id);
                assetsitem.setAttribute("src",obj.res_url);
                assetsitem.setAttribute('crossorigin', 'anonymous');
                assetsitem.setAttribute("loop", true);
                assetsitem.setAttribute("preload", "auto");
                assets.appendChild(assetsitem);

                
                assetsitem.onloadedmetadata = function() {
                    let soundEntity = document.createElement('a-sound');  

                    //[start-20230816-howardhsu-modify]//
                    // soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; autoplay: true; loop: true; volume: 1; positional: false");
                    soundEntity.setAttribute("sound", "src: "+"#"+obj.generalAttr.obj_id+"_"+obj.res_id+"; positional: false");
                    //[end-20230816-howardhsu-modify]//

                    soundEntity.setAttribute( "id", obj.generalAttr.obj_id );
                    soundEntity.setAttribute("sound", "autoplay: false");                  
                        
                    ////[start-20230817-howardhsu-comment] XR有setTransform耶，vr不用嗎
                    self.makarObjects.push( soundEntity );

                    //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                    if ( obj.generalAttr.active == false ){
                        soundEntity.setAttribute("sound", "loop: false");
                        soundEntity.setAttribute("visible", false);
                        soundEntity.setAttribute('class', "unclickable" );
                    }

                    let audioBehavRef = false;
                    if(obj.behav_reference){
                        for(let i=0; i<obj.behav_reference.length;i++){
                            if (obj.behav_reference[i].behav_name == 'Media'){
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

                    if(obj.generalAttr.obj_parent_id){
                        
                        let timeoutID = setInterval( function () {
                            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
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

                                                            //[start-20230815-howardhsu-add]//                                                         
                                                            checkAudioTypeAttr(obj, soundEntity, audioBehavRef)
                                                            //[end-20230815-howardhsu-add]//
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
                              
                        }  else {        

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
                                //[start-20230815-howardhsu-add]//
                                //// 看到XR有多這個判斷而加上
                                if ( audioBehavRef == true ){
                                    soundEntity.setAttribute("sound", "autoplay: false");
                                    soundEntity.setAttribute("visible", true);

                                }else{
                                    soundEntity.setAttribute("sound", "autoplay: true");

                                    //[start-20230815-howardhsu-add]//
                                    checkAudioTypeAttr(obj, soundEntity, audioBehavRef)
                                    
                                }
                                //[end-20230815-howardhsu-add]//
                            }    

                        }                       
                        
                        self.vrScene.appendChild(soundEntity);
                    }

                    soundEntity.addEventListener("loaded", function(evt){

                        if (evt.target == evt.currentTarget){
                            console.log("3 VRFunc.js: VRController: _loadAudio,: loaded, soundEntity.object3D.children[0]=", soundEntity.object3D.children[0] );
                            soundEntity.object3D["makarObject"] = true; 
                            if ( obj.behav ){
                                soundEntity.object3D["behav"] = obj.behav ;

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

                //[start-20230726-howardhsu-modify]//                    
                // self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );                  
                (0,_GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_1__.loadGLTFModel)( vrController, obj , position, rotation, scale , self.cubeTex )
                //[end-20230726-howardhsu-modify]//

                audioResolve( 1 );
            }

        });

    });

    return pAudio;

//20191105-end-thonsha-add
}


//// set audio attr according to the obj in makar with autoplay, volume, loop
//// 自動播放、音量、循環
function checkAudioTypeAttr(obj, soundEntity, audioBehavRef){  
    //[start-20230815-howardhsu-add]//
    if ( obj.generalAttr.active == false || audioBehavRef){                                                           
        soundEntity.setAttribute("sound", "autoplay: false");
    }  
        
    if(obj.typeAttr){           
        if(obj.typeAttr.is_play != undefined){                                                                         
            soundEntity.setAttribute("sound", `autoplay: ${obj.typeAttr.is_play}`);
        }    
        if(obj.typeAttr.is_play != undefined){ 
            soundEntity.setAttribute("sound", `loop: ${obj.typeAttr.is_loop}`); 
        }    
        if(obj.typeAttr.volume != undefined){ 
            soundEntity.setAttribute("sound", `volume: ${obj.typeAttr.volume}`); 
        }       
    } 
    //[end-20230815-howardhsu-add]//      
 }
 

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js":
/*!*****************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkGLTFMaterialIndex: () => (/* binding */ checkGLTFMaterialIndex),
/* harmony export */   loadGLTFModel: () => (/* binding */ loadGLTFModel)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _setTransform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");



function checkGLTFMaterialIndex( target, material ) {
        
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

function loadGLTFModel(vrController, obj, position, rotation, scale, cubeTex) {
    //20191025-start-thonsha-add  
    let self = vrController

    let pModel = new Promise( function( modelResolve ){
                
        ;(0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( obj.res_url , function( retStatus ){

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
                            for(let i=0; i<obj.animationAttr.length; i++){
                                if (obj.animationAttr[i].is_default || obj.animationAttr[i].is_active){
                                    animationSlices.push({
                                        idle:obj.animationAttr[i].uid, 
                                        loop:obj.animationAttr[i].uid, 
                                        uid:obj.animationAttr[i].uid, 
                                        changed: false, 
                                        reset: true, 
                                        count: 0});
                                    mainAnimation = obj.animationAttr[i].animation_name;
                                }
                            }
                            for(let i=0; i<obj.animationAttr.length; i++){
                                animationSlices.push({
                                    name:obj.animationAttr[i].name,
                                    animationName:obj.animationAttr[i].animation_name,
                                    startTime:obj.animationAttr[i].start_time,
                                    endTime:obj.animationAttr[i].end_time,
                                    uid:obj.animationAttr[i].uid
                                });
                            }

                        }
                        

                        //[start-20230808-howardhsu-comment]//       
                        // else{
                        //     //// 假如版本小於 3.3.8 使用舊版本 key , 小寫英文開頭，換字改為大寫英文
                            
                        //     for(let i=0; i<obj.animation.length; i++){
                        //         if (obj.animation[i].defaultAnimation || obj.animation[i].isActive){
                        //             animationSlices.push({
                        //                 idle:obj.animation[i].uid, 
                        //                 loop:obj.animation[i].uid, 
                        //                 uid:obj.animation[i].uid, 
                        //                 changed: false, 
                        //                 reset: true, 
                        //                 count: 0});
                        //             mainAnimation = obj.animation[i].animationName;
                        //         }
                        //     }
                        //     for(let i=0; i<obj.animation.length; i++){
                        //         animationSlices.push({
                        //             name:obj.animation[i].name,
                        //             animationName:obj.animation[i].animationName,
                        //             startTime:obj.animation[i].startTime,
                        //             endTime:obj.animation[i].endTime,
                        //             uid:obj.animation[i].uid
                        //         });
                        //     }
                        // }
                        //[end-20230808-howardhsu-comment]//


                    }
                    //[start-20230808-howardhsu-comment]//   
                    // else{
                    //     //// 假如本版檢查有誤，執行「最新版本」3.3.8的架構
                    //     for(let i=0; i<obj.animationAttr.length; i++){
                    //         // if (obj.animationAttr[i].is_active){
                    //         // 	animationSlices.push({idle:obj.animationAttr[i].uid, uid:obj.animationAttr[i].uid, changed: false});
                    //         // 	mainAnimation = obj.animationAttr[i].animation_name;
                    //         // }
                    //         if (obj.animationAttr[i].is_default || obj.animationAttr[i].is_active){
                    //             animationSlices.push({
                    //                 idle:obj.animationAttr[i].uid, 
                    //                 loop:obj.animationAttr[i].uid, 
                    //                 uid:obj.animationAttr[i].uid, 
                    //                 changed: false, 
                    //                 reset: true, 
                    //                 count: 0});							
                    //             mainAnimation = obj.animationAttr[i].animation_name;
                    //         }
                    //     }
                    //     for(let i=0; i<obj.animationAttr.length; i++){
                    //         animationSlices.push({
                    //             name:obj.animationAttr[i].name,
                    //             animationName:obj.animationAttr[i].animation_name,
                    //             startTime:obj.animationAttr[i].start_time,
                    //             endTime:obj.animationAttr[i].end_time,
                    //             uid:obj.animationAttr[i].uid
                    //         });
                    //     }

                    // }
                    //[end-20230808-howardhsu-comment]//
                    

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

                (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_1__.setTransform)(modelEntity, position, rotation, scale);
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
                                modelEntity.object3D["behav"] = obj.behav ;
                                
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
                            if (obj.materialAttr.materials){

                                for(let i = 0; i < obj.materialAttr.materials.length; i++){

                                    if ( objj.ModelJson ){
                                        materialIndex = checkGLTFMaterialIndex( modelEntity, obj.materialAttr.materials[i] );
                                    }

                                    let rgba = obj.materialAttr.materials[i].color.split(",");
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

                                            var renderer = modelEntity.sceneEl.renderer;
                                            objj.traverse(node => {

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
                if ( obj.generalAttr.active == false ){
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
                
                this.loadGLTFModel( vrController, obj , position, rotation, scale , self.cubeTex );
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

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/ImageModule.js":
/*!*************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/ImageModule.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadTexture: () => (/* binding */ loadTexture)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _setTransform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");
/* harmony import */ var _GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GLTFModelModule.js */ "./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js");




//// the html will use this function to load image
//// It is sad that I cant use default a-plane tag to get the image width/height 
function loadTexture( vrController, obj, position, rotation, scale ) {
    console.log("VRFunc.js: VRController: _loadTexture, obj=", obj, position, rotation, scale );
    let self = vrController
    
    //// 檢查是否為「預設物件」
    ;(0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.checkDefaultImage)( obj );
    
    let pTexture = new Promise( function( textureResolve ){
        //// ver. 3.5 res_url 是 vrController 在 loadSceneObjects 加上的
        (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( obj.res_url , function( retStatus ){
            if ( retStatus == true ){

                var texture = new THREE.TextureLoader().load( obj.res_url );
                
                let url_spit_length = obj.res_url.split(".").length
                let imgType = obj.res_url.split(".")[url_spit_length-1].toLowerCase();

                let plane;                
                
                // console.log(" _loadTexture_: _sub_type  ", obj.sub_type)

                if ( obj.sub_type == 'png' || obj.sub_type == 'jpg' || obj.sub_type == 'jpeg' || obj.sub_type == 'bmp' ){
                    imgType = obj.sub_type;
                    
                    // console.log(" _loadTexture_: _imgType ", imgType)

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

                plane.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
                plane.setAttribute('crossorigin', 'anonymous');
                
                //[start-20230725-howardhsu-add]//
                let chromaKey, slope, threshold, transparentBehav;
                //[end-20230725-howardhsu-add]//

                //[start-20230811-howardhsu-modify]//
                let transparentImage = false
                if (obj.typeAttr.matting){
                    transparentImage = true;
                    chromaKey = obj.typeAttr.matting.chromakey;
                    slope = obj.typeAttr.matting.slope;
                    threshold = obj.typeAttr.matting.threshold;
                    transparentBehav = obj.typeAttr.matting;
                      
                }
                //[end-20230811-howardhsu-modify]//

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
                    //[start-20230811-howardhsu-modify]//
                    if (obj.behav.length==0 && transparentImage){                        
                    //[end-20230811-howardhsu-modify]//
                        plane.setAttribute('class', "unclickable" ); //// fei add
                    }
                    else{
                        plane.setAttribute('class', "clickable" );
                    }
                }
                else{
                    plane.setAttribute('class', "unclickable" ); //// fei add
                }
                //20191101-end-thonsha-mod


                (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_1__.setTransform)(plane, position, rotation, scale);
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
                            plane.object3D["behav"] = obj.behav ;
                            
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
                        }

                        textureResolve( plane );

                    }else{
                        console.log("VRFunc.js: _loadTexture: loaded target different" );
                    }
                });
                //20191031-end-thonsha-mod

                //// 編輯器「場景物件」上 「眼睛開啟關閉」判斷
                if ( obj.generalAttr.active == false ){
                    plane.setAttribute("visible", false);
                    plane.setAttribute('class', "unclickable" );
                }

                //20191227-start-thonsha-add
                // console.log("VRFunc.js: _loadTexture: image behav_reference: ",obj.behav_reference);
                if(obj.behav_reference){
                    for(let i=0; i<obj.behav_reference.length;i++){
                        
                        //[start-20231017-howardhsu-modify]//
                        //// ver. 3.5 應該是改名成 "Display" 但由於不確定實際如何，先留著註解
                        // if (obj.behav_reference[i].behav_name == 'ShowImage'){
                        if (obj.behav_reference[i].behav_name == 'Display'){
                        //[end-20231017-howardhsu-modify]//
                            plane.setAttribute("visible", false);
                            plane.setAttribute('class', "unclickable" );
                            break;
                        }
                    }
                    
                }
                //20191227-end-thonsha-add

                //20191029-start-thonhsa-add
                if(obj.generalAttr.obj_parent_id){
                    // plane.setAttribute("visible", false);
                    // plane.setAttribute('class', "unclickable" );
                    let timeoutID = setInterval( function () {
                        let parent = document.getElementById(obj.generalAttr.obj_parent_id);
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

                //[start-20230726-howardhsu-modify]//
                // self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );
                (0,_GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_2__.loadGLTFModel)(vrController, obj , position, rotation, scale , self.cubeTex )
                //[end-20230726-howardhsu-modify]//


                textureResolve( 1 );

            }
        });



    });

    return pTexture;
    
}


/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/LightModule.js":
/*!*************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/LightModule.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadLight: () => (/* binding */ loadLight)
/* harmony export */ });
/* harmony import */ var _setTransform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");


function loadLight( vrController, obj, position, rotation, scale ) {
    let self = vrController
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
            
            (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_0__.setTransform)(Light, position, rotation, scale);

            //// 子物件修改
            //[start-20230629-howardhsu-add]//
            //// 祥霆給的正解: 
            //// 備註：這邊確認 Light.object3D.children[0].target 沒有用處，因為不再場景內部
            //// 備註：方向光假如沒有設定 target 或是 target 未在場景內，那此方向光指向「場景原點」
            //// 假如此方向光有 target 在
            Light.addEventListener( 'loaded' , function( e ){
                if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "DirectionalLight" ){
                    
                    //[start-20230817-howardhsu-modify]// ver. 3.5時發現光的目標又跑掉了Orz
                    // let normalVector = new THREE.Vector3( 0, 0, 1 );
                    let normalVector = new THREE.Vector3( 0, -1, 0 );  //// howardhsu has not figure out why, yet.
                    //[end-20230817-howardhsu-modify]//
                    
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
        else if (obj.typeAttr.light_type == "spot"){						
            (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_0__.setTransform)(Light, position, rotation, scale);
            console.log("3.5 rotation in loadLight spotLight", rotation)
            Light.addEventListener( 'loaded' , function( e ){
                if ( Light.object3D && Light.object3D.children && Light.object3D.children[0] && Light.object3D.children[0].type == "SpotLight" ){
                    //// 調整聚光燈照射方向
                    
                    //[start-20230817-howardhsu-modify]// ver. 3.5時發現光的目標又跑掉了Orz
                    // let normalVector = new THREE.Vector3( 0, 0, 1 );
                    let normalVector = new THREE.Vector3( 0, -1, 0 );  //// howardhsu has not figure out why, yet.
                    //[end-20230817-howardhsu-modify]//
                    
                    let lightTarget = Light.object3D.children[0].target;
                    lightTarget.position.copy( normalVector );     
                    Light.object3D.children[0].add( lightTarget ); 
                }
            })
        }
        else if (obj.typeAttr.light_type == "point"){
            (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_0__.setTransform)(Light, position, rotation, scale);
            // console.log("VRFunc.js: _loadLight: obj.light.light_type=", obj.light.light_type)
        }
        //[end-20230630-howardhsu-add]//
        else{
            //// 目前沒有 平行光、聚光燈、點光源 以外的光源類型，不應該會走進這段
            (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_0__.setTransform)(Light, position, rotation, scale);
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

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/SkyModule.js":
/*!***********************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/SkyModule.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   editorVerionControllSky: () => (/* binding */ editorVerionControllSky),
/* harmony export */   loadSky: () => (/* binding */ loadSky)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");


//// 依照不同編輯器版本，控制「天空物件」    
function editorVerionControllSky(editor_version , projIndex , currentScene, VRSceneResult ) {
    let sceneSky_info = {
        scene_skybox_url:'',
        scene_skybox_main_type: '',
    };
    console.log("VRFunc.js: _editorVerionControllSky: " , editor_version, currentScene  );

    //// 一定要含有大中小三個版號
    if (editor_version.length == 3) {
        //// 大中小版號
        let v0 = editor_version[0], v1 = editor_version[1], v2 = editor_version[2];
        switch(v0){
            case "3":
                ///// 只要是 3.3.2 以下 的版本
                // if ( ( v1 < 3  ) ){
                //     sceneSky_info.scene_skybox_url = currentScene.scene_skybox_url;
                //     sceneSky_info.scene_skybox_main_type = currentScene.scene_skybox_main_type;
                //     sceneSky_info.scene_snapshot_url = currentScene.scene_snapshot_url;

                //     console.log("VRFunc.js: _editorVerionControllSky: below 3.3.2 " , currentScene );

                // } else if ( v1 >= 3 && v2 >= 2 ){
                //     sceneSky_info.scene_skybox_url = currentScene.environment.scene_skybox_url;
                //     sceneSky_info.scene_skybox_main_type = currentScene.environment.scene_skybox_main_type;
                //     sceneSky_info.scene_snapshot_url = currentScene.environment.scene_snapshot_url;
                //     console.log("VRFunc.js: _editorVerionControllSky: after 3.3.2 " , currentScene );
                // }else 
                if ( v1 >= 4 ){
                    sceneSky_info.scene_skybox_url = currentScene.environment.scene_skybox_url;
                    sceneSky_info.scene_skybox_main_type = currentScene.environment.scene_skybox_main_type;
                    sceneSky_info.scene_snapshot_url = currentScene.environment.scene_snapshot_url;
                                            
                    //[start-20230728-howardhsu-add]//
                    sceneSky_info.scene_skybox_url = currentScene.environment.scene_skybox_snapshot_4096

                    //// scene_skybox_main_type 沒了，有點找不到這該怎麼判斷 
                    //// 先試試看直接由 url 結尾的副檔名來判斷  (但如果 3.5 scene_skybox_url 不是 3.4 scene_skybox_snapshot_4096 那可能就要改)
                    let skybox_arr = currentScene.environment.scene_skybox_snapshot_4096.split('.')                        
                    let skybox_type = skybox_arr[skybox_arr.length -1] 
                    switch (skybox_type) {
                        case "jpg":
                        case "png":
                        case "gif":
                            sceneSky_info.scene_skybox_main_type = "image"
                            break;
                        case "mp4":
                            sceneSky_info.scene_skybox_main_type = "spherical_video"                        
                        default:
                            break;
                    }        

                    sceneSky_info.scene_snapshot_url = currentScene.environment.scene_skybox_snapshot_2048            
                    //[end-20230728-howardhsu-add]//

                    console.log("VRFunc.js: _editorVerionControllSky: after 3.4.0 " , currentScene );
                }else{
                    console.log("VRFunc.js: _editorVerionControllSky: large version error " , currentScene );
                }
                break;
            // case "2":
            // case "1":
            //     console.log("VRFunc.js: _editorVerionControllSky: largeVersion below 3" , VRSceneResult[projIndex] );
            //     sceneSky_info.scene_skybox_url = currentScene.scene_skybox_url;
            //     sceneSky_info.scene_skybox_main_type = currentScene.scene_skybox_main_type;
            //     sceneSky_info.scene_snapshot_url = currentScene.scene_snapshot_url;
            //     break;

            default:
                console.log("VRFunc.js: _editorVerionControllSky: missing large version " , VRSceneResult[projIndex] );
        }

    } else {
        if ( VRSceneResult[projIndex].editor_ver == "" ){
            ////// the empty editor_ver , do version below 3.0.6 
            if ( !Array.isArray(currentScene.scene_skybox_url ) ){
                console.log("VRFunc.js: _editorVerionControllSky the scene_skybox_url is not exist, error", VRSceneResult[projIndex] );
                return -1;
            }
            console.log("VRFunc.js: _editorVerionControllSky: the editor version empty", VRSceneResult[projIndex] );
            sceneSky_info.scene_skybox_url = currentScene.scene_skybox_url;
            sceneSky_info.scene_skybox_main_type = currentScene.scene_skybox_main_type;
            sceneSky_info.scene_snapshot_url = currentScene.scene_snapshot_url;
        }
    }

    return sceneSky_info;
}

////// load the sky, 360 image/video    
function loadSky( vrScene, scene_id, sceneSky_info, loadSceneCount) {
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
        
        (0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( sceneSky_info.scene_skybox_url , function( retStatus ){
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
                        vrScene.appendChild(aSky);
                    }
                }else{
                    aSky = document.createElement('a-sky');
                    aSky.setAttribute('id', "sky" );
                    vrScene.appendChild(aSky);
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
                        console.log("確認 3.5 天空物件", sceneSky_info)
                        if (document.getElementById("sky")){
                            aSky = document.getElementById("sky");
                            if (aSky.localName == "a-sky"){
                                //// 之前的 sky 是圖片，什麼都不用作
                            }else if (aSky.localName == "a-videosphere"){
                                //// 之前的 sky 是影片
                                aSky.remove();
                                aSky = document.createElement('a-sky');
                                aSky.setAttribute('id', "sky" );
                                vrScene.appendChild(aSky);
                            }
                        }else{
                            aSky = document.createElement('a-sky');
                            aSky.setAttribute('id', "sky" );
                            vrScene.appendChild(aSky);
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
                            // console.log("materialSRC", sceneSky_info.scene_skybox_url)
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
                                vrScene.appendChild(aSky);
                            }else if (aSky.localName == "a-videosphere"){
                                //// 之前的 sky 是影片，不用額外動作
                                
                            }
                        }else{
                            aSky = document.createElement('a-videosphere');
                            aSky.setAttribute('id', "sky" );
                            vrScene.appendChild(aSky);
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
                        // skyVideo.setAttribute('id', self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount );
                        skyVideo.setAttribute('id', scene_id + "_" + loadSceneCount );

                        // skyVideo.play(); // play pause
                        skyVideo.setAttribute("autoplay", "true" ); 
                        // skyVideo.setAttribute("loop", "true" ); 

                        assets.appendChild(skyVideo); ////// add video into a-assets
                        // aSky.setAttribute("src", "#skyVideo" );  
                        // aSky.setAttribute("src", "#"+self.VRSceneResult[projIndex].scenes[sceneIndex].scene_id + "_" + self.loadSceneCount ); // 
                        aSky.setAttribute("src", "#" + scene_id + "_" + loadSceneCount ); // 


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


/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/TextModule.js":
/*!************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/TextModule.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadText: () => (/* binding */ loadText)
/* harmony export */ });
/* harmony import */ var _setTransform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");


function loadText( vrController, obj, position, rotation, scale ) {
    //20191204-start-thonsha-add  
    // console.log("VRFunc.js: _laodText: obj, position, rotation, scale = ", obj, position, rotation, scale	);
    let self = vrController
    
    let pText = new Promise( function( textResolve ){

        let anchor = document.createElement('a-entity');
            
        // anchor.setAttribute("geometry","primitive: sphere; radius: 0.05" );
        // anchor.setAttribute("material","roughness: 0.48; color:	#FF0000");
        (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_0__.setTransform)(anchor, position, rotation, scale);
        anchor.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
        self.makarObjects.push( anchor );

        if (obj.behav){  
            anchor.setAttribute('class', "clickable" ); //// fei add
        }else if (obj.main_type == "button"){  //// Quiz 單選題的文字選項、多選題的OK按鈕，在quiz載入時會被加上main_type "button"
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

        let textList = obj.typeAttr.content.split('\n');
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
        textEntity.setAttribute("value",obj.typeAttr.content);
        // textEntity.setAttribute("width",longestSplit*0.08)	// 4 for 0.46  per 0.115  20201027：這個數值目前沒有用處
        // textEntity.setAttribute("wrap-count",longestSplit); // 1 for 1    20201027：這個數值目前沒有用處
        textEntity.setAttribute("anchor","center");
        textEntity.setAttribute("align","left");

        textEntity.setAttribute("backcolor", obj.typeAttr.back_color ); //// 這邊注意一重點，自己設定的 attribute 不能使用 『大寫英文』，否則aframe data內會找不到，參照 text物件
        textEntity.setAttribute("textcolor", obj.typeAttr.color ); //// 暫時沒有用，假如未來文字支援『透明度』功能時候會需要
        textEntity.setAttribute("side","double");

        var fontUrl = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/resource/fonts/";
        let fonts = [  fontUrl + "1-msdf.json", fontUrl + "2-msdf.json" , fontUrl + "3-msdf.json", fontUrl + "4-msdf.json", fontUrl + "5-msdf.json", 
                fontUrl + "6-msdf.json", fontUrl + "7-msdf.json" , fontUrl + "8-msdf.json", fontUrl + "9-msdf.json", fontUrl + "10-msdf.json", 
                fontUrl + "11-msdf.json", fontUrl + "12-msdf.json" ];
        // fonts = [ fontUrl + "1-msdf.json" ];
        textEntity.setAttribute("font", fonts );

        textEntity.setAttribute("negate","false");
        textEntity.setAttribute('crossorigin', 'anonymous');

        let rgb = obj.typeAttr.color.split(",");
        let color = new THREE.Color(parseFloat(rgb[0]),parseFloat(rgb[1]),parseFloat(rgb[2])); 
        textEntity.setAttribute("color", "#"+color.getHexString());

        // textEntity.setAttribute( "id", obj.typeAttr.obj_id );//// fei add 
        // if (obj.behav){
        // 	textEntity.setAttribute('class', "clickable" ); //// fei add
        // }
        // else if (obj.main_type == "button"){
        // 	textEntity.setAttribute('class', "clickable" ); //// fei add
        // }
        // else{
        // 	textEntity.setAttribute('class', "unclickable" ); //// fei add
        // }
        
        // setTransform(textEntity, position, rotation, scale);
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
                    anchor.object3D["behav"] = obj.behav ;

                    //// 載入時候建制「群組物件資料」「注視事件」
                    self.setObjectBehavAll( obj );
                }
                if(obj.behav_reference){  
                    anchor.object3D["behav_reference"] = obj.behav_reference ;
                }
                if (obj.main_type=="button"){
                    // textEntity.object3D["main_type"] = obj.main_type;  
                    anchor.object3D["main_type"] = obj.main_type;
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
        if ( obj.generalAttr.active == false ){
            anchor.setAttribute("visible", false);
            anchor.setAttribute('class', "unclickable" );
        }

        //20191227-start-thonsha-add
        if(obj.behav_reference){  
            for(let i=0; i<obj.behav_reference.length;i++){
                if (obj.behav_reference[i].behav_name == 'Display'){
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
        if(obj.generalAttr.obj_parent_id){
            // textEntity.setAttribute("visible", false);
            // textEntity.setAttribute('class', "unclickable" );
            let timeoutID = setInterval( function () {
                let parent = document.getElementById(obj.generalAttr.obj_parent_id);
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

//20191204-end-thonsha-add
}

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/VideoModule.js":
/*!*************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/VideoModule.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UnMutedAndPlayAllVisibleVideo: () => (/* binding */ UnMutedAndPlayAllVisibleVideo),
/* harmony export */   loadVideo: () => (/* binding */ loadVideo)
/* harmony export */ });
/* harmony import */ var _vrUtility_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vrUtility.js */ "./js/VRMain/version3_5/vrUtility.js");
/* harmony import */ var _setTransform_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setTransform.js */ "./js/VRMain/version3_5/vrObjectModules/setTransform.js");
/* harmony import */ var _GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GLTFModelModule.js */ "./js/VRMain/version3_5/vrObjectModules/GLTFModelModule.js");




function loadVideo( vrController, obj, position, rotation, scale ) {	
    let self = vrController
    let pVideo = new Promise( function( videoResolve ){

        ;(0,_vrUtility_js__WEBPACK_IMPORTED_MODULE_0__.UrlExists)( obj.res_url , function( retStatus ){
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
                mp4Video.setAttribute("id", obj.generalAttr.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount );
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
                
                    //[start-20230811-howardhsu-modify]//
                    let chromaKey, slope, threshold, transparentBehav;                    
                    //20191108-start-thonsha-add
                    let transparentVideo = false
                    if (obj.typeAttr.matting){
                        // for(let i=0;i<obj.behav.length;i++){
                            // if (obj.behav[i].behav_type == "TransparentVideo"){
                                // console.log(obj.behav[i])
                                transparentVideo = true;
                                chromaKey = obj.typeAttr.matting.chromakey;
                                slope = obj.typeAttr.matting.slope;
                                threshold = obj.typeAttr.matting.threshold;
                                transparentBehav = obj.typeAttr.matting;
                            // }
                        // }
                    }
                    //[end-20230811-howardhsu-modify]//

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
                        if (obj.behav.length==0 && transparentVideo){
                            videoPlane.setAttribute('class', "unclickable" ); //// fei add
                        }
                        else{
                            videoPlane.setAttribute('class', "clickable" );
                        }
                    }
                    else{
                        videoPlane.setAttribute('class', "unclickable" ); //// fei add
                    }                    

                    videoPlane.setAttribute( "id", obj.generalAttr.obj_id );//// fei add 
                    videoPlane.setAttribute("src", "#"+obj.generalAttr.obj_id+"_"+obj.res_id+"_"+self.loadSceneCount ); //  

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

                    (0,_setTransform_js__WEBPACK_IMPORTED_MODULE_1__.setTransform)(videoPlane, position, rotation, scale);
                    videoPlane.addEventListener("loaded", function(evt){
                    
                        if (evt.target == evt.currentTarget){

                            // setTimeout(function(){
                            // 	videoPlane.setAttribute("cursor-listener", true ); //// fei add
                            // }, 500 );

                            // videoPlane.object3D.children[0].scale.multiply(new THREE.Vector3(videoWidth, videoHeight, 1));
                            videoPlane.object3D.children[0].scale.set(videoWidth , videoHeight, 1 );
                            
                            //[start-20230809-howardhsu-modify]//
                            let r = new THREE.Vector3();
                            r.set(0, -0.2 * Math.PI, 0);   //// howardhsu has not figure out why, yet. (that happens to video but other objs do not).
                            videoPlane.object3D.children[0].rotation.setFromVector3(r);
                            //[end-20230809-howardhsu-modify]//

                            // var r = videoPlane.object3D.children[0].rotation.toVector3();
                            // r.add( new THREE.Vector3(0,Math.PI, 0) );
                            // videoPlane.object3D.children[0].rotation.setFromVector3(r);
                            videoPlane.object3D["makarObject"] = true; 
                            if ( obj.behav ){
                                videoPlane.object3D["behav"] = obj.behav ;

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
                    if ( obj.generalAttr.active == false ){
                        videoPlane.setAttribute("visible", false);
                        videoPlane.setAttribute('class', "unclickable" );
                    }

                    //20191227-start-thonsha-mod
                    let videoBehavRef = false;
                    if(obj.behav_reference){
                        for(let i=0; i<obj.behav_reference.length;i++){
                            if (obj.behav_reference[i].behav_name == 'Media'){
                                videoBehavRef = true;
                                videoPlane.setAttribute("visible", false);
                                videoPlane.setAttribute('class', "unclickable" );
                                break;
                            }
                        }
                        
                    }
                    //20191227-end-thonsha-mod

                    //20191029-start-thonhsa-add
                    if(obj.generalAttr.obj_parent_id){
                        // videoPlane.setAttribute("visible", false);
                        // videoPlane.setAttribute('class', "unclickable" );
                        mp4Video.autoplay = false;
                        let timeoutID = setInterval( function () {
                            let parent = document.getElementById(obj.generalAttr.obj_parent_id);
                            if (parent){
                                if(parent.object3D.children.length > 0){
                                    parent.appendChild(videoPlane);
                                    window.clearInterval(timeoutID);
                                    //// deal the behavior or not.
                                    parent.addEventListener("child-attached", function(el){
                                        console.log("VRFunc.js: VRController: _loadVideo,: parent child-attached, el=", el );

                                        //// 假如有掛載「邏輯功能」，需要禁止一般事件操控，在這邊無條件暫停影片
                                        if ( obj.generalAttr.logic ){

                                            videoPlane.blockly = obj.generalAttr.logic;
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

                                                        //[start-20230815-howardhsu-add]//
                                                        checkVideoTypeAttr(obj, mp4Video, videoBehavRef)
                                                        //[end-20230815-howardhsu-add]//                     
                                                    
                                                        //// 提醒用戶點擊開啟聲音
                                                        if (window.Browser){
                                                            if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                                            // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                                                dealVideoMuted( mp4Video );
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

                        if ( obj.generalAttr.logic ){
                            videoPlane.blockly = obj.generalAttr.logic;
                            mp4Video.pause();
                            mp4Video.currentTime = 0;
                        } else {
                            mp4Video.autoplay = true;
                            mp4Video.play();//// this is not necessary 

                            //[start-20230815-howardhsu-add]//
                            checkVideoTypeAttr(obj, mp4Video, videoBehavRef)
                            //[end-20230815-howardhsu-add]//                     
                            
                            //// 提醒用戶點擊開啟聲音
                            if (window.Browser){
                                if (window.Browser.name == undefined || window.Browser.name == "safari" || (window.allowAudioClicked != true && location == parent.location ) ){
                                // if ( window.Browser.mobile == true || window.Browser.iOS == true || navigator.platform.includes('armv8l') == true  ){
                                    dealVideoMuted( mp4Video );
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
                
                //[start-20230726-howardhsu-modify]//                    
                // self.loadGLTFModel( obj , position, rotation, scale , self.cubeTex );                
                (0,_GLTFModelModule_js__WEBPACK_IMPORTED_MODULE_2__.loadGLTFModel)(self, obj , position, rotation, scale , self.cubeTex )
                //[end-20230726-howardhsu-modify]//

                videoResolve( 1 );

            }
        });
        

    });


    return pVideo;
    
}

//// set video attr according to the obj in makar with autoplay, volume, loop
//// 自動播放、音量、循環
function checkVideoTypeAttr(obj, mp4Video, videoBehavRef){
    //[start-20230807-howardhsu-add]//
    //// 這要去確認app的行為
    if ( obj.generalAttr.active == false || videoBehavRef){
        mp4Video.autoplay = false
        mp4Video.pause();
        mp4Video.currentTime = 0;
    }
    //[end-20230807-howardhsu-add]//       
        
    //[start-20230811-howardhsu-add]//
    if(obj.typeAttr){           
        if(obj.typeAttr.is_play != undefined){ 
            mp4Video.autoplay = obj.typeAttr.is_play;
            if( obj.typeAttr.is_play == false ){                                        
                mp4Video.pause();
                mp4Video.currentTime = 0;
            }
        }    
        if(obj.typeAttr.is_play != undefined){ mp4Video.loop = obj.typeAttr.is_loop; }    
        if(obj.typeAttr.volune  != undefined){ mp4Video.volume = obj.typeAttr.volune; }       
    }
    //[end-20230811-howardhsu-add]//             
}


//// 注意，當前影片、聲音是共用「確認面板」
//// 處理影片物件是否播放聲音
//// 處理影片物件是否播放聲音，目前只有 ios safari 可能呼叫到這
function dealVideoMuted( video ){        
    // let self = this
    let clickToPlayAudio = document.getElementById("clickToPlayAudio");
    clickToPlayAudio.style.display = "block";													
    clickToPlayAudio.onclick = function(){
        
        // video.muted = false;

        UnMutedAndPlayAllVisibleVideo();
        
        clickToPlayAudio.style.display = "none";
        clickToPlayAudio.onclick = null;
        window.allowAudioClicked = true;
    }

}

//// 為了 iOS 無法同時播放「超過一個有聲音的影片」，在場景中尋找是否有「當前可見的影片」，只能有一隻切換為切換為「有聲音」
//// 流程分兩種： 1. 點擊觸發「顯示任意物件」 2. 點擊觸發「關閉任意物件」 
//// 確定是否傳入的物件為「影片」，假如是的話，以「此影片」為主，開啟聲音
////
function UnMutedAndPlayAllVisibleVideo( targetVideo_in ) {
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

                        //// 我擔心「先後順序會影響」，所以多次將「此影片」執行「切換為非靜音」
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

/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/loadTexture2D.js":
/*!***************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/loadTexture2D.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadTexture2D: () => (/* binding */ loadTexture2D)
/* harmony export */ });

//[start-20200315-fei0092-add]//
function loadTexture2D ( VRController, obj, index, sceneObjNum, position, rotation, scale ){
    console.log("VRController: loadTexture2D.js , obj=", obj, position, rotation, scale );

    let self = VRController;

    let pTexture2D = new Promise( function( texture2DResolve ){
        var loader = new THREE.TextureLoader();
        loader.load(
            obj.res_url,
            function ( texture ) {
                console.log("VRController: loadTexture2D.js: texture WH=", texture.image.width , texture.image.height );
                
                //// 2022 1123 之後 3.3.8 版本上線， 2D 物件的尺寸需要版本相容
                //// 位置    縮放    尺寸   旋轉
                let rectP, rectSizeDelta, rectScale , rectR ; 
                if ( Array.isArray ( self.editor_version )  && self.editor_version.length == 3 ){
                    let largeV  = Number( self.editor_version[0] );
                    let middleV = Number( self.editor_version[1] );
                    let smallV  = Number( self.editor_version[2] );	

                    //[start-20231013-howardhsu-modify]//
                    let trans;
                    //// 版本3.5 有第二層的會用駝峰是大小寫；直接就是value的會用小寫英文，換字使用底線 _
                    if ( largeV > 3 || ( largeV == 3 && middleV > 4 ) ){
                        trans = getObj2DInfo350();

                    //// 只要版本大於 3.3.8 都使用新的 key， 都是小寫英文，換字使用底線 _ 
                    } else if ( largeV > 3 || 
                        ( largeV == 3 && middleV > 3 ) ||
                        ( largeV == 3 && middleV == 3 && smallV > 8 )
                    ){
                        trans = getObj2DInfo338();  

                    }else{
                        trans = getObj2DInfo300();                                               
                    }

                    if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                        rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
                    }else{
                        texture2DResolve( false );
                    }

                }else{
                    let trans = getObj2DInfo350();
                    //[end-20231013-howardhsu-modify]//
                    if ( trans.rectP && trans.rectSizeDelta && trans.rectScale  ){
                        rectP=trans.rectP;rectSizeDelta=trans.rectSizeDelta;rectScale=trans.rectScale;
                    }else{
                        texture2DResolve( false );
                    }

                }

                //[start-20231013-howardhsu-add]//
                function getObj2DInfo350(){
                    console.log('VRFunc.js: _loadSceneObjects: image: --------- 2d image    getObj2DInfo350')

                    let tempInfo = {};
                    //// 位置    縮放    尺寸   旋轉
                    let rectP, rectSizeDelta, rectScale , rectR ; 
                    if ( obj.transformAttr.rect_transform && Array.isArray( obj.transformAttr.rect_transform ) && obj.transformAttr.rect_transform.length > 0 ){

                        if ( !Number.isFinite( self.selectedResolutionIndex )   ){
                            console.log(' _getObj2DInfo338: error, missing _selectedResolutionIndex' );
                            self.selectedResolutionIndex = 0;
                        }
                        let selectedObj2DInfo = obj.transformAttr.rect_transform[ self.selectedResolutionIndex ];

                        if ( selectedObj2DInfo.position && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
                            rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
                            rectSizeDelta = selectedObj2DInfo.size_dalta.split(",").map(function(x){return Number(x)}); 
                            rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
                            rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

                            let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]),parseFloat(rectR[1]),parseFloat(rectR[2]),parseFloat(rectR[3]))
                            let b = new THREE.Euler();
                            b.setFromQuaternion(quaternionRotation);

                            //// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
                            rotation.z = b.z/Math.PI * 180 ;

                            //// 為了相容 ，把「縮放資料」取代 「原本 scale」
                            scale.x = rectScale[0];
                            scale.y = rectScale[1];

                            tempInfo = {
                                rectP: rectP,
                                rectSizeDelta: rectSizeDelta,
                                rectScale: rectScale
                            }
                        }
                        

                    }

                    return tempInfo;
                }
                //[end-20231013-howardhsu-add]//


                function getObj2DInfo338 (){


                    let tempInfo = {};
                    //// 位置    縮放    尺寸   旋轉
                    let rectP, rectSizeDelta, rectScale , rectR ; 
                    if ( obj.rect_transform && Array.isArray( obj.rect_transform ) && obj.rect_transform.length > 0 ){

                        if ( !Number.isFinite( self.selectedResolutionIndex )   ){
                            console.log(' _getObj2DInfo338: error, missing _selectedResolutionIndex' );
                            self.selectedResolutionIndex = 0;
                        }
                        let selectedObj2DInfo = obj.rect_transform[ self.selectedResolutionIndex ];

                        if ( selectedObj2DInfo.position && selectedObj2DInfo.rotation && selectedObj2DInfo.scale ){
                            rectP = selectedObj2DInfo.position.split(",").map(function(x){return Number(x)}); 
                            rectSizeDelta = selectedObj2DInfo.size_dalta.split(",").map(function(x){return Number(x)}); 
                            rectScale = selectedObj2DInfo.scale.split(",").map(function(x){return Number(x)}); 
                            rectR = selectedObj2DInfo.rotation.split(",").map(function(x){return Number(x)});

                            let quaternionRotation = new THREE.Quaternion(parseFloat(rectR[0]),parseFloat(rectR[1]),parseFloat(rectR[2]),parseFloat(rectR[3]))
                            let b = new THREE.Euler();
                            b.setFromQuaternion(quaternionRotation);

                            //// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
                            rotation.z = b.z/Math.PI * 180 ;

                            //// 為了相容 ，把「縮放資料」取代 「原本 scale」
                            scale.x = rectScale[0];
                            scale.y = rectScale[1];

                            tempInfo = {
                                rectP: rectP,
                                rectSizeDelta: rectSizeDelta,
                                rectScale: rectScale
                            }
                        }
                        

                    }

                    return tempInfo;
                }

                function getObj2DInfo300(){

                    //// 位置    縮放    尺寸   旋轉
                    let rectP, rectSizeDelta , rectScale ; 
                    if (obj.rect_transform){
                        if(obj.rect_transform.length != 5 ){
                            console.log("XRFunc.js: _loadTexture2D: fail, rect_transform.length !=5", obj.rect_transform.length);
                            return ;
                        }
                        rectP = obj.rect_transform[0].split(",").map(function(x){return Number(x)}); 
                        rectSizeDelta = obj.rect_transform[1].split(",").map(function(x){return Number(x)}); 
                        rectScale = obj.rect_transform[2].split(",").map(function(x){return Number(x)}); //// 3.3.0 版本此數值無用
                        console.log("XRFunc.js: _loadTexture2D: rect PSO=", rectP, rectSizeDelta, rectScale, rotation, scale);

                        return {
                            rectP: rectP,
                            rectSizeDelta: rectSizeDelta,
                            rectScale: rectScale,
                        }
                    }else{
                        console.log("XRFunc.js: _loadTexture2D: fail, no rect_transform");
                        return;
                    }

                }

                console.log(' ppppppppppppppp ' , rectP, rectSizeDelta, rectScale , scale );
                

                texture.flipY = false ; 
                //// scale part only x, y , temp work on both android and iOS
                console.log("XRFunc.js: _loadTexture2D: innerWH , camera2D ", innerWidth, innerHeight , self.vrScene.clientWidth, self.vrScene.clientHeight );

                let width, height;
                let scaleRatioXY = self.scaleRatioXY;
                // width  = rectSizeDelta[0] * scale.x * scaleRatioXY ;
                // height = rectSizeDelta[1] * scale.y * scaleRatioXY ;
                
                //// 因應 3.3.8 以上版本，物件本身的 transform 不會作用在容器上 也不會作用在 圖片本身 
                width  = rectSizeDelta[0] * scaleRatioXY ;
                height = rectSizeDelta[1] * scaleRatioXY ;


                let textureUrl = obj.res_url;
                let imgType = obj.sub_type ;

                let rootObject = new THREE.Object3D();
                rootObject.makarType = "image2D";

                let transparentImage = false
                //[start-20231017-howardhsu-modify]//                
                let arrayColor, slope, threshold, transparentBehav;
                if (obj.typeAttr.matting){
                    transparentImage = true;
                    // arrayColor = obj.behav[i].chromakey.split(",") ;
                    arrayColor = obj.typeAttr.matting.chromakey;
                    slope = obj.typeAttr.matting.slope;
                    threshold = obj.typeAttr.matting.threshold;
                    transparentBehav = obj.typeAttr.matting;
                    console.log("XRFunc.js: _loadTexture2D: TransparentImage" , obj.typeAttr.matting);
                }
                //[end-20231017-howardhsu-modify]//

                let plane;
                let gifObject ;

                if (transparentImage){
                    
                    let HSV = transparentBehav.HSV.split(",");
                    let keyH = parseFloat(HSV[0]);
                    let keyS = parseFloat(HSV[1]);
                    let keyV = parseFloat(HSV[2]);
                    let chromaKeyMaterial;
                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){
                        if (transparentBehav.mode == "RGB"){
                            chromaKeyMaterial = new THREE.ChromaKeyMaterial({
                                map: texture , 
                                keyColor: arrayColor ,
                                side: THREE.DoubleSide, 
                                slope: slope,
                                threshold: threshold,
                            });
                            
                        } else if (transparentBehav.mode == "HSV"){
                            chromaKeyMaterial = new THREE.HSVMattingMaterial({
                                map: texture , 
                                side: THREE.DoubleSide, // DoubleSide
                                _keyingColorH: keyH,
                                _keyingColorS: keyS,
                                _keyingColorV: keyV,
                                _deltaH: transparentBehav.hue,
                                _deltaS: transparentBehav.saturation,
                                _deltaV: transparentBehav.brightness,
                            });
                        }
                        // plane = THREE.SceneUtils.createMultiMaterialObject( new THREE.PlaneBufferGeometry(
                        // 	texture.image.width*25.4/dpi ,
                        // 	texture.image.height*25.4/dpi , 0 ), [ 
                        // 		chromaKeyMaterial,
                        // 		new THREE.MeshBasicMaterial( { color: 0xC0C0C0 , side: THREE.BackSide } ) 
                        // 	]
                        // );
                        plane = new THREE.Mesh( 
                            new THREE.PlaneBufferGeometry( width , height , 0 ), 
                            chromaKeyMaterial,
                        );
                    }else if (imgType == "gif"){
                        gifObject = new THREE.gifAnimator();
                        gifObject.init({ src: textureUrl , side: THREE.DoubleSide, transparent: true, opacity: 1.0, autoplay: true, chroma: transparentBehav });
                        rootObject.gifObject = gifObject;

                        //// 上下顛倒
                        if ( gifObject.__texture.flipY ){
                            gifObject.__texture.flipY = false;
                        }

                        plane = new THREE.Mesh(
                            new THREE.PlaneBufferGeometry( width, height , 0 ),
                            gifObject.material,
                        );
                    }
                    
                    
                } else {

                    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == 'button' ){

                        plane = new THREE.Mesh( 
                            new THREE.PlaneBufferGeometry( width, height , 0 ), 
                            new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true  } ),
                        );

                    } else if (imgType == "gif"){
                        gifObject = new THREE.gifAnimator();
                        gifObject.init({ src: textureUrl , side: THREE.DoubleSide, transparent: true, opacity: 1.0, autoplay: true });
                        rootObject.gifObject = gifObject;

                        //// 上下顛倒
                        if ( gifObject.__texture.flipY ){
                            gifObject.__texture.flipY = false;
                        }

                        plane = new THREE.Mesh(
                            new THREE.PlaneBufferGeometry( width, height , 0 ),
                            gifObject.material,
                        );
                    }

                }

                if (obj.behav_reference){
                    rootObject.behav_reference = obj.behav_reference;
                    for (let j = 0;j<obj.behav_reference.length; j++){
                        
                        //[start-20231017-howardhsu-modify]//
                        //// ver. 3.5 應該是改名成 "Display" 但由於不確定實際如何，先留著註解
                        // if (obj.behav_reference[i].behav_name == 'ShowImage'){
                        if (obj.behav_reference[i].behav_name == 'Display'){
                        //[end-20231017-howardhsu-modify]//
                            rootObject.visible = false;
                            if (imgType == "gif" ){
                                //// 這邊只有 pause不恰當，因為 gifAnimator 中的[__ready]在被呼叫的時候，會以 autoplay 為標準決定是否執行play
                                //// 無法確定 __ready執行的時間，假如已經執行過，這邊 pause則會暫停更新畫面，假如還沒執行過，這邊設 autoplay false會讓 ready時不 play
                                gifObject.pause();
                                gifObject.__autoplay = false;

                            }
                        }
                    }
                }


                // // for double side 
                // var plane = new THREE.Mesh(
                // 	new THREE.PlaneBufferGeometry( width , height , 0 ),
                // 	new THREE.MeshBasicMaterial( { map : texture,  side: THREE.DoubleSide,  transparent: true   } ) // DoubleSide, FrontSide
                // );
                
                if ( obj.behav ){
                    rootObject["behav"] = obj.behav ;

                    //// 載入時候建制「群組物件資料」「注視事件」
                    self.setObjectBehavAll( obj );
                }
                
                if (obj.active == false){
                    rootObject.visible = false;
                }

                if (obj.behav_reference){
                    rootObject.behav_reference = obj.behav_reference;
                    for (let j = 0; j < obj.behav_reference.length; j++){
                           
                        //[start-20231017-howardhsu-modify]//
                        //// ver. 3.5 應該是改名成 "Display" 但由於不確定實際如何，先留著註解
                        // if (obj.behav_reference[i].behav_name == 'ShowImage'){
                        if (obj.behav_reference[i].behav_name == 'Display'){
                        //[end-20231017-howardhsu-modify]//

                            rootObject.visible = false;
                        }
                    }
                }

                // plane.makarType = 'image2D';
                rootObject["makarObject"] = true ;
                rootObject["obj_id"] = obj.obj_id ;

                //20191029-start-thonhsa-add
                if(obj.obj_parent_id){
                    // console.log("______XRFunc.js: _loadTexture2D: obj(parent) ", obj );

                    let setIntoParent = function(){
                        let isParentSet = false;
                        for (let i = 0; i < self.makarObjects2D.length; i++ ){
                            if ( self.makarObjects2D[i].obj_id == obj.obj_parent_id  ){
                                isParentSet = true;
                            }
                        }

                        if ( isParentSet == false ) {
                            setTimeout(setIntoParent, 500 );
                            // console.log("______XRFunc.js: _loadTexture2D: isParentSet   ", obj , self.makarObjects2D );

                        }else{
                            for (let i = 0; i < self.makarObjects2D.length; i++){
                                if (self.makarObjects2D[i].obj_id == obj.obj_parent_id){
                                    
                                    //// 大小
                                    rootObject.scale.set( scale.x , scale.y, 1 );

                                    //// 改為統一移動比例
                                    rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                                    rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

                                    rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 
            
                                    // //// rotation only at z direction
                                    rootObject.rotateZ( -rotation.z /180*Math.PI);
                                    
                                    rootObject.add( plane );
                                    self.makarObjects2D[i].add(rootObject);
                                    self.makarObjects2D.push(rootObject);

                                    texture2DResolve( rootObject );

                                    console.log("______XRFunc.js: _loadTexture2D: parent exit, set obj(parent) ", obj , plane );

                                }
                            }

                        }
                    };
                    setIntoParent();

                } else{
                    // console.log("______XRFunc.js: _loadTexture2D: obj() ", obj );

                    //// 大小
                    rootObject.scale.set( scale.x , scale.y, 1 );

                    //// 位置
                    rootObject.translateX(  rectP[0]*scaleRatioXY ) ;
                    rootObject.translateY( -rectP[1]*scaleRatioXY ) ;

                    rootObject.translateZ( -1 + index/sceneObjNum );// [-1, 0] 

                    // //// rotation only at z direction
                    rootObject.rotateZ( -rotation.z /180*Math.PI);
                    
                    self.makarObjects2D.push(rootObject);
                    self.scene2D.add(rootObject);

                    rootObject.add(plane);
                    rootObject["makarObject"] = true ;
                    rootObject["obj_id"] = obj.obj_id ;

                    texture2DResolve( rootObject );

                }
                //20191029-end-thonhsa-add
                
                // console.log("XRFunc.js: XRController: _loadTexture2D ,obj=", obj );

            },
            undefined,
            function ( err ) {
                console.error( 'An error happened. _loadTexture2D , err=', err);
            }
        );

    });
    
    return pTexture2D;

}


/***/ }),

/***/ "./js/VRMain/version3_5/vrObjectModules/setTransform.js":
/*!**************************************************************!*\
  !*** ./js/VRMain/version3_5/vrObjectModules/setTransform.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setTransform: () => (/* binding */ setTransform)
/* harmony export */ });
function setTransform( obj, position, rotation, scale ) {
        
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

/***/ }),

/***/ "./js/VRMain/version3_5/vrUtility.js":
/*!*******************************************!*\
  !*** ./js/VRMain/version3_5/vrUtility.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UrlExists: () => (/* binding */ UrlExists),
/* harmony export */   checkDefaultImage: () => (/* binding */ checkDefaultImage),
/* harmony export */   checkHost_tick: () => (/* binding */ checkHost_tick),
/* harmony export */   forbidden: () => (/* binding */ forbidden),
/* harmony export */   getRandomInt: () => (/* binding */ getRandomInt),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   makeid: () => (/* binding */ makeid)
/* harmony export */ });
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

//[start-20191111-fei0079-add]//
function checkHost_tick() {
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

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//// check: is image default image
function checkDefaultImage( obj ) {
    // console.log("vrUtility.js _checkDefaultImage: obj.red_id=", obj.res_id)
    switch(obj.res_id){
        case "MakAR_Call":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
            obj.main_type = "image"
            obj.sub_type = "png"
            break;
        case "MakAR_Room": 
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
            obj.main_type = "image"
            obj.sub_type = "png"
            break;
        case "MakAR_Mail": 
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
            obj.main_type = "image"
            obj.sub_type = "png"
            break;
        case "Line_icon":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
            obj.main_type = "image"
            obj.sub_type = "png"
            break;
        case "FB_icon":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
            obj.main_type = "image"
            obj.sub_type = "png"
            break;
        default:
            console.log("vrUtility.js: _checkDefaultImage, obj=",  obj );
    }

}

/***/ })

}]);