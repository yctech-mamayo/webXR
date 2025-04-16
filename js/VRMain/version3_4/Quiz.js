import AddObjectToVrController from "./AddObjectToVrController.js"

function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Quiz extends AddObjectToVrController {
    
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
export default Quiz
