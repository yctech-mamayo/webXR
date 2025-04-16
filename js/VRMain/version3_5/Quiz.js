import net from './networkAgent.js';
import AddObjectToVrController from "./AddObjectToVrController.js"
import { isPromise, getRandomInt, checkDefaultImage, checkDefaultObj } from "./vrUtility.js"

import { verionControl as VC } from "./MakarWebXRVersionControl.js";

////  AddObjectToVrController 是一個 "與VRController互動" 的Class。 Quiz繼承它 表示Quiz可以和VRController互動
class Quiz extends AddObjectToVrController {
    
    //[start-20231117-howardhsu-modify]//
    type = "Quiz";
    obj_id;
    obj_type;

    //// 避免user連續點擊造成pushButton重複呼叫
    isButtonPushed = false;

	//// 當有多個quiz同時在場景中，且有quiz已經載入且顯示時，阻止其他quiz物件載入  (註: Quiz獨立出來後 已確認同時顯示多個quiz可行。但計時器和提示的html元素尚未分開 所以用此方式阻擋)
    isPlaying = true;
    isPlayed = false;
    module = {}

    //// 從VRController取得的資料
    currentProjData = {};

	//[start-20231123-renhaohsu-add]//
    //// 記錄遊玩狀態 (原本記載於 module.record)
    //// 提問之後的結論是: 暫時不進行更多改動，但若要讓 module 維持"來自編輯器的json"的理念，擇日再把 record 和 record_time, record_score, qClock 等"遊玩記錄相關" 從 module 拿出來。
    record = []
	//[end-20231123-renhaohsu-add]//
    
    constructor(obj){
        super();
        
        this.obj_id = obj.generalAttr.obj_id
        this.obj_type = obj.generalAttr.obj_type

        //// 從VRController取得資料: 在 updateRecordModule() 時需要post到後端API的資料
        if(window.vrController){
            this.currentProjData.user_id         = window.vrController.currentProjData.user_id
            this.currentProjData.proj_id         = window.vrController.currentProjData.proj_id
            this.currentProjData.head_pic        = window.vrController.currentProjData.head_pic
            this.currentProjData.loc             = window.vrController.currentProjData.loc
            this.currentProjData.module_type     = window.vrController.currentProjData.module_type
            this.currentProjData.name            = window.vrController.currentProjData.name
            this.currentProjData.proj_cover_urls = window.vrController.currentProjData.proj_cover_urls
            this.currentProjData.proj_name       = window.vrController.currentProjData.proj_name
            this.currentProjData.shared_id       = window.vrController.currentProjData.shared_id
            this.currentProjData.snapshot_url    = window.vrController.currentProjData.snapshot_url
        }

        this.module = obj.typeAttr.module
        //// 2023.11.23 討論結果 暫時先維持與v3.4一樣，不進行改動
        //// 目前的流程: 
        //// 在 load() 時又把 "來自編輯器的 module" 放到 module.json 底下
        //// 再給 this.module 多加上quiz物件&相關遊玩記錄
        //[end-20231117-howardhsu-modify]//
    }
    
    //// ----------------
    //// 為了與vrController互動 先覆寫: "把物件加入到 場景 或 vrController 常用到的函式們" 

    addTextToScene( jsonObj, position, rotation, scale, index=0, sceneObjNum=1 ){
        //// 把文字物件加入場景
        if( jsonObj.generalAttr.obj_type == "3d" ){
            return window.vrController.loadText( jsonObj, position, rotation, scale )
        } else {
            return window.vrController.loadText2D( jsonObj, index, sceneObjNum, position, rotation, scale )
        }
    }
    
    addTextureToScene( jsonObj, position, rotation, scale, index=0, sceneObjNum=1 ){
        //// 把圖片物件加入場景
        if( jsonObj.generalAttr.obj_type == "3d" ){
            return window.vrController.loadTexture( jsonObj, position, rotation, scale )
        } else {
            return window.vrController.loadTexture2D( jsonObj, index, sceneObjNum, position, rotation, scale )
        }
    }

    addGLTFModelToScene( jsonObj, position, rotation, scale ){
        //// 把模型物件加入場景
        if( jsonObj.generalAttr.obj_type == "3d" ){
            return window.vrController.loadGLTFModel( jsonObj, position, rotation, scale, vrController.cubeTex )  
        } else {
            console.log("%c quiz loadGLTFModel: quiz currently does not support GLTFModel in 2D scene.", "color:tomato;")
        }
    }

    addAudioToScene( jsonObj, position, rotation, scale ){
        //// 把聲音物件加入場景
        if( jsonObj.generalAttr.obj_type == "3d" ){
            return window.vrController.loadAudio( jsonObj, position, rotation, scale )
        } else {
            console.log("%c quiz loadAudio: quiz currently does not support Audio in 2D scene.", "color:tomato;")
        }
    }

    addVideoToScene( jsonObj, position, rotation, scale, index=0, sceneObjNum=1 ){
        //// 把影片物件加入場景
        if( jsonObj.generalAttr.obj_type == "3d" ){
            return window.vrController.loadVideo( jsonObj, position, rotation, scale )
        } else {
            return window.vrController.loadVideo2D( jsonObj, index, sceneObjNum, position, rotation, scale )
        }
    }

    pushToMakarObjects( makarObject ){
        //// 把3D物件加入到 makarObjects 陣列
        window.vrController.makarObjects.push( makarObject );
    }

    pushToMakarObjects2d( makarObject ){
        //// 把3D物件加入到 makarObjects 陣列
        window.vrController.makarObjects2D.push( makarObject );
    }

    setTransform(base, circlePos, circleRot, circleScale){
        //// 把物件放到對應的場景位置
        window.vrController.setTransform(base, circlePos, circleRot, circleScale);
    }

    appendToVrScene(quizEntity, jsonObj){
        // window.vrController.vrScene.appendChild(quizEntity);

            if(jsonObj.generalAttr.obj_parent_id){
                // console.log("jsonObj.generalAttr.obj_parent_id", jsonObj.generalAttr.obj_parent_id)
                // this.scene3DRoot.appendChild(quizEntity);

                let timeoutID = setInterval( function () {
                    let parent = document.getElementById(jsonObj.generalAttr.obj_parent_id);
                    if (parent){ 
                        if(parent.object3D.children.length > 0){
                            parent.appendChild(quizEntity);
                            window.clearInterval(timeoutID);
                        } 
                    }
                }, 1);

            } else {
                // console.log("quizEntity", quizEntity)

                window.vrController.vrScene.appendChild(quizEntity);
            }
        }

    appendToVrScene2d(quizEntity, jsonObj){
        // window.vrController.scene2D.add(quizEntity.object3D);
        
        if(jsonObj.generalAttr.obj_parent_id){
        
            let timeoutID = setInterval( function () {
                let parent = null
                for (let i = 0; i < window.vrController.makarObjects2D.length; i++ ){
                    if ( window.vrController.makarObjects2D[i].obj_id == jsonObj.generalAttr.obj_parent_id  ){
                        parent = window.vrController.makarObjects2D[i];
                    }
                }

                if (parent){ 
                    // console.log("quiz2d find parentObj=", parent)
                    if(parent.children.length > 0){
                        parent.add(quizEntity.object3D)
                        // console.log("quizEntity.object3D", quizEntity.object3D)
                        window.clearInterval(timeoutID);
                    } 
                }
            }, 10);
        }
        else{
            window.vrController.scene2D.add(quizEntity.object3D)
        }

    }

    //// ---------------- 其他會用到 vrController 的細項們
    clearObject(){
        //// 把物件從 vrController.makarObject 清除、從頁面上移除
        
        if(this.obj_type == "3d"){

            let temp = []
            let quizEntity = this.module.quizEntity;

            for (let item of quizEntity.children) {
                temp.push(item);
            }
            temp.forEach( item => {
                // console.log("%c _quiz _clearObject item=", "color:salmon", item)
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
            });

        } else if(this.obj_type == "2d"){
            // console.log("%c 2d quizzzzzzzz children=", "color: salmon; font-size: 20px", this.module.quizEntity.object3D.children[0].children)

            // let childrens = this.module.quizEntity.object3D.children[0].children
            let childrens = this.module.quizEntity.object3D.children
            childrens.forEach( child => {
                vrController.makarObjects2D = vrController.makarObjects2D.filter(item => item !== child)
            })
            childrens.length = 0
            // console.log("%c quiz nextQuestion clearObjects childrens=", "color:cyan; font-size:20px", childrens)
        } else {
            console.log("_Quiz _loadQuestion: There shall not be any type except for 2d3d")
        }

    }
    //// ----------------
    
    
    //[start-20231006-howardhsu-add]//
    //// 從user線上素材庫拿json
    ////   (只有在 loadQuestion 使用，因為 loadOption 需要檢查不同東西)
    setTypesFromUserRes(obj){
        //// res_url and main_type no longer exist in ver. 3.5's VRSceneResult
        //// get res_url, main_type from userProjResDict or userOnlineResDict
        if( makarUserData.userProjResDict || typeof( makarUserData.userOnlineResDict ) == 'object' ){  
    
            if(makarUserData.userProjResDict[obj.res_id]){

                if(makarUserData.userProjResDict[obj.res_id].res_url){
                    obj.res_url = makarUserData.userProjResDict[obj.res_id].res_url
                }
                if(makarUserData.userProjResDict[obj.res_id].main_type){
                    obj.main_type = makarUserData.userProjResDict[obj.res_id].main_type
                }
                if(makarUserData.userProjResDict[obj.res_id].sub_type){
                    obj.sub_type = makarUserData.userProjResDict[obj.res_id].sub_type
                }

            } else if(makarUserData.userOnlineResDict[obj.res_id]){

                if(makarUserData.userOnlineResDict[obj.res_id].res_url){
                    obj.res_url = makarUserData.userOnlineResDict[obj.res_id].res_url
                }
                if(makarUserData.userOnlineResDict[obj.res_id].main_type){
                    obj.main_type = makarUserData.userOnlineResDict[obj.res_id].main_type
                }
                if(makarUserData.userOnlineResDict[obj.res_id].sub_type){
                    obj.sub_type = makarUserData.userOnlineResDict[obj.res_id].sub_type
                }

            } else {
                // checkDefaultImage(obj)
                checkDefaultObj(obj)
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
                            console.warn("Quiz.js: setTypesFromUserRes: main_type does not exist. obj=", obj)        
                        }
                        break;
                }
                
                console.log("Quiz.js: setTypesFromUserRes: obj=", obj)
            }
    
        } else {
            console.warn("Quiz.js: setTypesFromUserRes: userProjResDict or userOnlineResDict does not exist. obj=", obj)    
        }
    
        return obj
    }
    //[end-20231006-howardhsu-add]//


    //// 載入 quiz
    load( obj, position, rotation, scale) {

        //// 載入之前已經先檢查是否網頁端有用戶登入，也已檢查是否玩過此專案，這裡只要進行載入
        let quizEntity = document.createElement("a-entity");
        quizEntity.setAttribute("id", obj.generalAttr.obj_id);

        let qObject3D = new THREE.Object3D();


        if(obj.generalAttr.obj_type == "3d"){
            this.pushToMakarObjects(quizEntity)
            quizEntity.addEventListener( 'loaded' , function(){
                ///// 增加一個「空物件」，代表此 entity 已經自身載入完成
                qObject3D["obj_id"]  = obj.generalAttr.obj_id
                qObject3D["makarType"] = 'quiz';
                qObject3D["makarObject"]  = true ;
                
                //// 2d似乎不影響 3d必須用add
                quizEntity.object3D.add( qObject3D );
            });

        } else if(obj.generalAttr.obj_type == "2d"){
            // let qObject3D = new THREE.Object3D();
            // qObject3D.obj_id = obj.generalAttr.obj_id
            // qObject3D.makarType = 'quiz2D';
            // qObject3D.makarObject = true ;
            // quizEntity.object3D.add( qObject3D );
            // this.pushToMakarObjects2d(qObject3D)

            
            let scaleRatioXY = window.vrController.scaleRatioXY
            let selectedResolutionIndex = window.vrController.selectedResolutionIndex
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
    
            // //// 為了相容 ，把「旋轉資料」取代 「原本 rotation」
            _rectR.z =  -1 * _rectR.z


            // let qObject3D = new THREE.Object3D();
            qObject3D["obj_id"]  = obj.generalAttr.obj_id
            qObject3D["makarType"] = 'quiz2D';
            qObject3D["makarObject"]  = true ;

            //// 2d似乎不影響 3d必須用add
            // quizEntity.object3D.add( qObject3D );
            quizEntity.object3D = qObject3D 


            // //// 位置
            qObject3D.translateX(  _position.x*scaleRatioXY ) ;
            qObject3D.translateY( - _position.y*scaleRatioXY ) ;
            // qObject3D.translateZ( -1 + i/sceneObjNum );// [-1, 0] 
            qObject3D.translateZ( 1 );// [-1, 0] 
    
            qObject3D.rotateZ( _rectR.z ) 
    
            qObject3D.scale.set( _scale.x , _scale.y, 1 );



            this.pushToMakarObjects2d(qObject3D)

                
            


        } else {
            console.log("_Quiz _loadQuestion: There shall not be any type except for 2d3d")
        }

        
        
        if ( obj.behav ){
            qObject3D["behav"] = obj.behav ;

            //// 載入時候建制「群組物件資料」「注視事件」
            self.setObjectBehavAll( obj );
        }


        //[end-20240124-renhaohsu-modify]//


        
        qObject3D.visible = true
        if (obj.generalAttr.active == false){
            qObject3D.visible = false;
        }


        //// 處理亂序出題
        let randomQuestionList = [];
        for (let i=0; i<obj.typeAttr.module.question_list.length; i++){
            if (obj.typeAttr.module.question_list[i].allowRandom){
                randomQuestionList.push(i);
            }
        }
    
        //// user設定的題目排序方式 這邊判斷「呈現題目」是否有值。沒有的話直接返回
        if( !obj.typeAttr.module.display_order_list || obj.typeAttr.module.display_order_list.length == 0 ){
            console.warn("Quiz.js _load: ERROR - user has not set display_order_list. obj.typeAttr.module=", obj.typeAttr.module)
            return
        }

        let totalActiveScoreQuestion = 0
        for (let i=0;i<obj.typeAttr.module.display_order_list.length;i++){
            let tempIdx =  obj.typeAttr.module.display_order_list[i].index;
            if (tempIdx == -1){
                let randInt = getRandomInt(randomQuestionList.length);
                let randomIdx = randomQuestionList[randInt];
                obj.typeAttr.module.display_order_list[i].index = randomIdx
                tempIdx = randomIdx;
                randomQuestionList.splice(randInt,1);
            }
            if (obj.typeAttr.module.question_list[tempIdx].active_score){
                totalActiveScoreQuestion += 1;
            }
        }
    
        //// 起始題目
        let idx = obj.typeAttr.module.display_order_list[0].index;
        let first_question = obj.typeAttr.module.question_list[idx];
    
        //// 計時器
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
    
        //// 提示區域
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
        scoreDiv.addEventListener("click", ()=>{
            scoreDiv.style.display = "none";
            this.nextQuestion();
        });
    
        // console.log("Quiz.js: _load: _first_question=", first_question );
    
        //// 載入第一題「題目物件」
        if ( first_question.questions_json && Array.isArray( first_question.questions_json ) ){
            for(let i=0; i<first_question.questions_json.length; i++){

                //[start-20231004-howardhsu-modify]//
                this.loadQuestion(first_question.questions_json[i])      
                //[end-20231004-howardhsu-modify]//          
            }
        }
        
        //// 載入第一題選項
        if ( first_question.options_json && Array.isArray( first_question.options_json ) ){
    
            for(let i=0; i<first_question.options_json.length; i++){

                //[start-20231006-howardhsu-modify]//
                let {pOption, sub_type} = this.loadOption(first_question.options_json[i])
                // console.log("Quiz.js: _load: _loadOption: pOption=", pOption )                
                //[end-20231006-howardhsu-modify]//
                
                //// 多選題要讓「選項物件」增加「圓圈」
                if (sub_type != "button" && (first_question.option_type == "MutiOption_Text"|| first_question.option_type == "MutiOption_Image")){
    
                    if ( isPromise( pOption ) == false ){
                        continue;
                    }
    
                    pOption.then( ( ret ) => {
                        //[start-20240227-renhaohsu-modify]//	
                        let optionObject = ret;
    
                        let circlePos = new THREE.Vector3(0,0,0);
                        let circleRot = new THREE.Vector3(0,0,0);
                        let circleScale = new THREE.Vector3(1,1,1);
                        let quaternion = new THREE.Quaternion( );
    
                        if(first_question.option_type == "MutiOption_Text"){
                            switch (this.obj_type) {
                                case "3d":
                                    this.multiOptionTextCircle3d(optionObject, circlePos, circleRot, circleScale)
                                    break;

                                case "2d":
                                    this.multiOptionTextCircle2d(optionObject, circlePos, circleRot, circleScale)
                                    break;
                            
                                default:
                                    console.log("_Quiz _load: There shall not be any type except for 2d3d")
                                    break;
                            }    
                        } else if (first_question.option_type == "MutiOption_Image"){
                            switch (this.obj_type) {
                                case "3d":
                                    let timeoutID = setInterval( () => {
                                        //[start-20230923-renhaohsu-add]//    
                                        //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                                        if (this.module.currentIndex >= this.module.json.display_order_list.length){
                                            window.clearInterval(this.module.timer.currentTimer)
                                        }                             
                                        //[end-20230923-renhaohsu-add]//

                                        if (optionObject.getAttribute("heightForQuiz")){ 
                                            let height = optionObject.getAttribute("heightForQuiz");

                                            this.multiOptionImageCircle3d(optionObject, circlePos, circleRot, circleScale)
                                            
                                            window.clearInterval(timeoutID);
                                        }
                                    }, 1);
                                    break;

                                case "2d":
                                    this.multiOptionImageCircle2d(optionObject, circlePos, circleRot, circleScale)
                                    break;
                            
                                default:
                                    console.log("_Quiz _load: There shall not be any type except for 2d3d")
                                    break;
                            }
                        } else {
                            console.warn("MultiOption should be either MutiOption_Text or MutiOption_Image.")
                        }
                        //[end-20240227-renhaohsu-modify]//
                    });
                }
            }
        } else {
            console.warn("_quiz _load: data might be incorrect, first_question.options_json=", first_question.options_json)
            return
        }
    
        //// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
        if (this.module.timer.counter >= 0){
            this.module.qClock = Date.now();
            let timeoutID = setInterval( () => {                
                this.module.timer.currentTimer = timeoutID;
                this.module.timer.counter -= 1;
                
                //[start-20230923-howardhsu-add]//    
                //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                if (this.module.currentIndex >= this.module.json.display_order_list.length){
                    window.clearInterval(this.module.timer.currentTimer)
                }                             
                //[end-20230923-howardhsu-add]//

                let hour = Math.floor(this.module.timer.counter/3600);
                let min = Math.floor((this.module.timer.counter-hour*3600)/60);
                let sec = this.module.timer.counter-hour*3600-min*60;
                timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
                // console.log(this.module.timer.counter);
                if (this.module.timer.counter == 0){
    
                    window.clearInterval(this.module.timer.currentTimer);
                    if (obj.typeAttr.module.timer_type == "Custom"){
                        if (first_question.show_score){
                            let scoreDiv = document.getElementById("scoreDiv");
                            let score = document.getElementById("score");
                            scoreDiv.style.display = "block";
                            score.textContent = this.module.score;
                            
                        }
                        else{
                            this.nextQuestion();
                        }
                    }
                    else{
                        this.clearObject()
    
                        let tipButtonDiv = document.getElementById("tipButtonDiv");
                        let tipDiv = document.getElementById("tipDiv");
                        tipButtonDiv.style.display = "none";
                        tipDiv.style.display = "none";
    
                        // let startQuiz = document.getElementById("startQuiz");
                        let startQuiz = window.aQuizVR.UIs.startQuiz;
                        let QuizStartButton = document.getElementById("QuizStartButton");
                        let QuizStartContent = document.getElementById("QuizStartContent");
                        startQuiz.style.display = "block";
                        QuizStartContent.textContent = "時間到"
                        
                        let quizIndex = {
                            question: idx ,
                            get_score:  0,
                            answer_time: this.module.json.question_list[idx].time_limit ,
                            answer_options: [],
                            answer_cloze: "",
                            answer_is_enable: false,
                            answer_is: false,
                        }
                        this.module.record[idx] = quizIndex;

                        //[start-20231117-renhaohsu-add]//
                        this.record[idx] = quizIndex
                        //[end-20231117-renhaohsu-add]//

                        this.module.record_time += this.module.json.question_list[idx].time_limit;
                        this.module.qClock = Date.now();
    
                        // let timeup = document.getElementById("timeup");
                        // timeup.style.display = "block";
                        // let timeupConfirmButton = document.getElementById("timeupConfirmButton");
                        QuizStartButton.addEventListener("click", () => {
                            startQuiz.style.display = "none";
                            
                            //[start-20230712-howardhsu-add]//
                            //// 存檔: 沒有下一題，預定紀錄答題狀態上雲端 (就是this.nextQusetion底下else的全部)
                            this.saveQuizStatus();
                            //[end-20230712-howardhsu-add]//
                        });
    
                    }
                }
            },1000);
        }
        //// ---------------------------------------------------------------- ////	
        if(obj.generalAttr.obj_type == "3d"){
            this.setTransform(quizEntity, position, rotation, scale);
            this.appendToVrScene(quizEntity, obj)
        } else {
            //// 2D setransform 會正確 ?!  待測試
            this.setTransform(quizEntity, position, rotation, scale);
            this.appendToVrScene2d(quizEntity, obj)
        }
    }


    //[start-20231006-howardhsu-modify]//
    loadQuestion(question_json){
        
        //// 為每個物件設定 position、quaternion、scale
        let objTranform = VC.getObjTransform( window.vrController.scenesData , question_json );
        let position = objTranform.position;
        let rotation = objTranform.rotation;
        let scale = objTranform.scale;
        let quaternion = objTranform.quaternion;
        
        //// get position, rotation, scale 
        if(question_json.generalAttr.obj_type == "3d"){
            console.log("Quiz _loadQuestion VC objTranform", position, rotation, scale)
        } else if (question_json.generalAttr.obj_type == "2d"){

            //// 2d物件 這裡給scale即可  (會從json裡的rect_transform找到position和rotation)
            let selectedResolutionIndex = window.vrController.selectedResolutionIndex
            if( !window.vrController.selectedResolutionIndex ) selectedResolutionIndex = 0;
            // scale = new THREE.Vector3().fromArray(question_json.transformAttr.rect_transform[selectedResolutionIndex].scale.split(",").map(x => Number(x) ) );

        } else {
            console.log("_Quiz _loadQuestion: There shall not be any type except for 2d3d")
        }


        let obj = this.setTypesFromUserRes(question_json)

        let pQuestion;

        let main_type = obj.main_type;       
        switch(main_type){
            case "text":                        
                pQuestion = this.addTextToScene( obj, position, rotation, scale )
                break;
            case "image":
                pQuestion = this.addTextureToScene( obj, position, rotation, scale, 0, 1 )
                break;
            case "video":
                pQuestion = this.addVideoToScene( obj, position, rotation, scale );
                break;
            case "model":   
                pQuestion = this.addGLTFModelToScene( obj, position, rotation, scale )            
                break;
            case "audio":
                pQuestion = this.addAudioToScene( obj, position, rotation, scale );
                break;
        }

        return pQuestion
    }

    loadOption(option_json){
        
        //// 為每個物件設定 position、quaternion、scale
        let objTranform = VC.getObjTransform( window.vrController.scenesData , option_json );
        let position = objTranform.position;
        let rotation = objTranform.rotation;
        let scale = objTranform.scale;
        let quaternion = objTranform.quaternion;

        //// get position, rotation, scale 
        if(option_json.generalAttr.obj_type == "3d"){
            console.log("Quiz loadOption VC objTranform", position, rotation, scale)
        } else if (option_json.generalAttr.obj_type == "2d"){

            //// 2d物件 這裡給scale即可  (會從json裡的rect_transform找到position和rotation)
            let selectedResolutionIndex = window.vrController.selectedResolutionIndex
            if( !window.vrController.selectedResolutionIndex ) selectedResolutionIndex = 0;
            // scale = new THREE.Vector3().fromArray(option_json.transformAttr.rect_transform[selectedResolutionIndex].scale.split(",").map(x => Number(x) ) );

        } else {
            console.log("_Quiz _loadQuestion: There shall not be any type except for 2d3d")
        }

        //// get res_url and sub_type from user online resources dict
        let obj = option_json
        if( makarUserData.userProjResDict || typeof( makarUserData.userOnlineResDict ) == 'object' ){  
    
            if(makarUserData.userProjResDict[obj.res_id]){

                if(makarUserData.userProjResDict[obj.res_id].res_url) obj.res_url = makarUserData.userProjResDict[obj.res_id].res_url;

                if(makarUserData.userProjResDict[obj.res_id].sub_type) obj.sub_type = makarUserData.userProjResDict[obj.res_id].sub_type; 

            } else if(makarUserData.userOnlineResDict[obj.res_id]){

                if(makarUserData.userOnlineResDict[obj.res_id].res_url) obj.res_url = makarUserData.userOnlineResDict[obj.res_id].res_url;

                if(makarUserData.userOnlineResDict[obj.res_id].sub_type) obj.sub_type = makarUserData.userOnlineResDict[obj.res_id].sub_type;

            } else {
                //// if the obj doesn't exist in userProjResDict or userOnlineResDict, then it should be Makar default assets.
                // checkDefaultImage(obj)
                checkDefaultObj(obj)                
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
                        // console.warn("Quiz.js: loadOption: res does not exist. obj=", obj)      
                        break;
                }
                
                console.log("Quiz.js: loadOption: obj=", obj)
            }
    
        } else {
            console.warn("Quiz.js: loadOption: userProjResDict or userOnlineResDict does not exist. obj=", obj)    
        }

        //// 改用 behav 來觸發 quiz 點擊事件
        if( obj.behav ){

            //// 如果 behav 已經有 QuizOption 那就不再加
            let isPushButtonExist = false
            obj.behav.forEach(b => {
                if(b.behav_type == "QuizOption") isPushButtonExist = true;
            })

            if(!isPushButtonExist) obj.behav.push({behav_type: "QuizOption"});

        } else {
            obj.behav = [ {behav_type: "QuizOption"} ]
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

    //// 3d 文字多選 在文字選項左側加上圓圈
    multiOptionTextCircle3d(optionObject, circlePos, circleRot, circleScale, scaleCoefficient=25){
        let base = document.createElement("a-plane");
        base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
        base.setAttribute("id","circle_base");
        base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#2a2c31; depthWrite:false" );
        // this.setTransform(base, circlePos, circleRot, circleScale);
        optionObject.appendChild(base);

        let circle = document.createElement("a-plane");
        circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
        circle.setAttribute("id","circle_out");
        circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
        // this.setTransform(circle, circlePos, circleRot, circleScale);
        optionObject.appendChild(circle);
        
        let circle2 = document.createElement("a-plane");
        circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
        circle2.setAttribute("id","circle_in");
        circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
        circle2.setAttribute( "visible", false);
        // circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
        // this.setTransform(circle2, circlePos, circleRot, circleScale);
        optionObject.appendChild(circle2);

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

        // console.log(" *** geometry-set: " , optionObject.object3D , optionObject.getObject3D("mesh").geometry.attributes.position.array[0] );
        // console.log('Quiz.js: _load: scale ', optionObject.object3D.parent.scale , optionObject.object3D  );

        let width = Math.abs(optionObject.getObject3D("mesh").geometry.attributes.position.array[0])*2;
        // circlePos.x = circlePos.x + width*0.5 + 0.3/optionObject.object3D.parent.el.getAttribute("scale").x;
        circlePos.x = circlePos.x + width*0.5 + 0.1/optionObject.object3D.parent.el.getAttribute("scale").x;
        circlePos.z = circlePos.z - 0.01;
        base.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
        circle.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );
        circle2.setAttribute("position" , circlePos.clone().multiply( new THREE.Vector3( -1, 1, 1 ) ) );

        //[start-20240223-howardhsu-modify]//
        optionObject.object3D.parent.el.addEventListener("loaded", ()=>{
            // console.log("%c optionObject.object3D.el.parentEl", "color: magenta", optionObject.object3D.el.parentEl.object3D.scale)

            //// source: v3.4 artoolkit.three.js _loadQuiz
            //// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」。## 備註一下： getWorldScale 並不一定會返回「正確的數值」，原因猜測跟取得方式是「worldMatrix」相關
            //// 這樣確保圓圈比例維持，且大小隨著選項而變動
            let optionTextWorldScale = new THREE.Vector3(1,1,1).multiply( optionObject.object3D.scale ).multiply( optionObject.object3D.parent.scale ).multiply( optionObject.object3D.parent.parent.scale );
            let optionTextBGWroldScale = optionObject.object3D.children[1].scale.clone().multiply( optionTextWorldScale );
            let maxS = Math.max( optionTextBGWroldScale.x , optionTextBGWroldScale.y );

            //// 微調圓圈比例 數值來自trial and error
            // const scaleCoefficient = 25
            circleScale.multiply(new THREE.Vector3(scaleCoefficient, scaleCoefficient, scaleCoefficient).multiplyScalar( maxS ));
            circleScale.divide(optionObject.object3D.parent.el.getAttribute("scale"))
            
            base.setAttribute("scale" , circleScale );
            circle.setAttribute("scale" , circleScale );
            circle2.setAttribute("scale" , circleScale.multiplyScalar( 0.7 )  );
        })
        //[end-20240223-howardhsu-modify]//
    }
    
    //// 2d 文字多選 : 在文字選項左側加上圓圈
    multiOptionTextCircle2d(optionObject, circlePos, circleRot, circleScale, scaleCoefficient=0.5){

        //// source: artoolkit.three.js 3329
        let optionTextBG = optionObject.children[0].children[1];
        let optionText2DBGLocalScale = optionTextBG.scale.clone();
        let optionText2DCoWorldScale = optionObject.children[0].getWorldScale( new THREE.Vector3() ) ;

        //[start-20240207-renhaohsu-modify]//
        //// v3.5.0.0 似乎編輯器改用最大值決定縮放
        // let minS = Math.min( optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , 
        //                         optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height ,
        //                         1000000 );
        let maxS = Math.max( optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , 
            optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height );

        //// 微調圓圈比例 數值來自trial and error
        // const scaleCoefficient = 0.5
        circleScale.multiply(new THREE.Vector3(scaleCoefficient, scaleCoefficient, scaleCoefficient).multiplyScalar( maxS ));
        circleScale.divide( optionText2DCoWorldScale );

        // console.log(' optionText2DBGLocalScale: ' , optionText2DBGLocalScale , 
        // '\noptionText2DBGWorldScale: ', optionText2DBGWorldScale, 
        // '\noptionText2DCoWorldScale: ', optionText2DCoWorldScale, 
        // '\noptionText2DCoLocalScale: ', optionText2DCoLocalScale, 
        // '\ncircleScale:' , circleScale ,'\n222' ,
        // optionTextBG.geometry.parameters.width , optionTextBG.geometry.parameters.height, '\n555' ,
        // optionText2DBGLocalScale.x * optionTextBG.geometry.parameters.width , optionText2DBGLocalScale.y * optionTextBG.geometry.parameters.height );

        //// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
        let optionImageScale = optionTextBG.geometry.parameters.width * optionText2DBGLocalScale.x  ;

        let tLoader = new THREE.TextureLoader();

        //// 內層圓圈 、 選到圓圈
        let resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
        tLoader.load(resUrl, function(texture){

            circlePos.x = -optionImageScale * 0.5 - 80 * 0.8 * circleScale.x ;

            let circle_base = new THREE.Mesh( 
                // new THREE.PlaneBufferGeometry( texture.image.width, texture.image.height ), 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
            );
            circle_base.name = "circle_base";
            circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
            optionObject.children[0].add( circle_base );

            //// 選到圓圈
            let circle_in = new THREE.Mesh( 
                // new THREE.PlaneBufferGeometry(texture.image.width, texture.image.height ), 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
            );
            circle_in.name = "circle_in";
            circle_in.renderOrder = 1;
            circle_in.visible = false; //// 預設為『沒有選取』
            circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
            optionObject.children[0].add( circle_in );
        });

        resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
        tLoader.load(resUrl, function(texture){
            
            circlePos.x = -optionImageScale * 0.5 - 80 * 0.8 * circleScale.x ;

            // //// 外層圓圈
            let circle_out = new THREE.Mesh( 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
            );
            circle_out.name = "circle_out";
            circle_out.renderOrder = 1;
            circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
            optionObject.children[0].add( circle_out );
        });
        //[end-20240207-renhaohsu-modify]//
    }

    //// 3d 圖片多選 : 在圖片選項下方加上圓圈
    multiOptionImageCircle3d(optionObject, circlePos, circleRot, circleScale, scaleCoefficient=1){
        //// source: v3.4 artoolkit.three.js _loadQuiz
        //// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
        //// 這樣確保圓圈比例維持，且大小隨著選項而變動
        let optionImgWorldScale = optionObject.object3D.getWorldScale(new THREE.Vector3());
        let optionImgLocalScale = optionObject.object3D.scale.clone()  ;
        let maxS = Math.max( optionImgLocalScale.x , optionImgLocalScale.y );
            
        //[start-20240222-howardhsu-modify]//                
        //// 微調圓圈比例 數值來自trial and error
        // const scaleCoefficient = 1
        circleScale.multiply(new THREE.Vector3(scaleCoefficient, scaleCoefficient, scaleCoefficient).multiplyScalar( maxS ));
        circleScale.divide( optionImgWorldScale );

        //// v3.4 原本圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
        let optionImageScale = optionObject.object3D.children[0].scale.clone() ;
        // // circlePos.y = circlePos.y - height/2 - 0.3/optionObject.getAttribute("scale").y;
        // circlePos.y = circlePos.y - height - (0.3/optionObject.getAttribute("scale").y);

        //// v3.5 位置在視覺上與編輯器不同而調整 
        circlePos.y = -circleScale.y*0.5 - optionImageScale.y * 0.6;
        //[end-20240222-howardhsu-modify]//

        let base = document.createElement("a-plane");
        base.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
        base.setAttribute("id","circle_base");
        base.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#2a2c31; depthWrite:false" );
        this.setTransform(base, circlePos, circleRot, circleScale);
        optionObject.appendChild(base);

        let circle = document.createElement("a-plane");
        circle.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png");
        circle.setAttribute("id","circle_out");
        circle.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#7B7B7B; depthWrite:false" ); 
        this.setTransform(circle, circlePos, circleRot, circleScale);
        optionObject.appendChild(circle);

        let circle2 = document.createElement("a-plane");
        circle2.setAttribute("src","https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png");
        circle2.setAttribute("id","circle_in");
        circle2.setAttribute( "material", "shader:flat; side:double; opacity: 1.0; transparent: true; color:#00d1c1; depthWrite:false" );
        circle2.setAttribute( "visible", false);
        circleScale.multiply( new THREE.Vector3( 0.7,0.7,0.7 ) );
        this.setTransform(circle2, circlePos, circleRot, circleScale);
        optionObject.appendChild(circle2);

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
    }

    //// 2d 圖片多選 : 在圖片選項下方加上圓圈
    multiOptionImageCircle2d(optionObject, circlePos, circleRot, circleScale, scaleCoefficient=0.0025){
        //// 圓圈大小設定方式為 「經驗大小」*「寬高中最大者」/「選項的世界大小」
        //// 這樣確保圓圈比例維持，且大小隨著選項而變動
        let optionImgWorldScale = optionObject.getWorldScale(new THREE.Vector3());
        let optionImgLocalScale = optionObject.scale.clone();  
        let maxS = Math.max( optionImgLocalScale.x * optionObject.children[0].geometry.parameters.width , 
                                optionImgLocalScale.y * optionObject.children[0].geometry.parameters.height  );

        //[start-20240207-renhaohsu-modify]//
        //// 微調圓圈比例 數值來自trial and error
        // const scaleCoefficient = 0.0025
        circleScale.multiply(new THREE.Vector3(scaleCoefficient, scaleCoefficient, scaleCoefficient).multiplyScalar( maxS )  );
        circleScale.divide( optionImgWorldScale );
        //[end-20240207-renhaohsu-modify]//

        //// 圓圈位置設定方式為「選項圖片高度」 + 「圓圈本身高度」 
        let optionImageScale = optionObject.children[0].scale.clone() ;
        let optionImageHeight = optionObject.children[0].geometry.parameters.height;

        let tLoader = new THREE.TextureLoader();

        //// 內層圓圈 、 選到圓圈
        let resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle.png";
        tLoader.load(resUrl, function(texture){
            circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;

            let circle_base = new THREE.Mesh( 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x3c3c3c, depthWrite:false } ),
            );
            circle_base.name = "circle_base";
            circle_base.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_base.scale.copy(  circleScale.clone() ); //// 大小normalize 上層大小
            optionObject.add( circle_base );

            //// 選到圓圈
            let circle_in = new THREE.Mesh( 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x00d1c1 , depthWrite:false } ),
            );
            circle_in.name = "circle_in";
            circle_in.renderOrder = 1;
            circle_in.visible = false; //// 預設為『沒有選取』
            circle_in.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_in.scale.copy( circleScale.clone().multiplyScalar( 0.7 ) ); //// 大小normalize 上層大小
            optionObject.add( circle_in );
        });

        resUrl = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/button/circle_frame.png";
        tLoader.load(resUrl, function(texture){
            circlePos.y =  optionImageScale.y * optionImageHeight * 0.5 + 80 * 0.6 * circleScale.y ;

            // //// 外層圓圈
            let circle_out = new THREE.Mesh( 
                new THREE.PlaneGeometry( texture.image.width, texture.image.height ), 
                new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color:0x7B7B7B , depthWrite:false} ),
            );
            circle_out.name = "circle_out";
            circle_out.renderOrder = 1;
            circle_out.position.copy( circlePos.clone() ) ;//// 向下位移經驗上固定距離，需要normalize 上層大小
            circle_out.scale.copy( circleScale.clone().multiplyScalar( 0.9 ) ); //// 大小normalize 上層大小
            optionObject.add( circle_out );

        });
    }

    //20200723-thonsha-add-start
	quizOption(target){

        //[start-20231117-howardhsu-modify]//   (舊稱: "PushButton" 由於在vrcontroller.triggerEvent改名 這裡跟著改)
        //// 避免同時有其它quiz正在顯示 答對/錯 的2D動畫html元素
        if( window.aQuizVR.checkIs2DPictureShowing() ) return;
        
        //// 避免user連續點擊造成pushButton重複呼叫
        if( this.isButtonPushed ) return;
        //[end-20231117-howardhsu-modify]//

        let answer_options = []; //// 答題 index
        let answer_is = false; //// 答對與否
        let get_score = 0;
        let idx = this.module.json.display_order_list[this.module.currentIndex].index;
        let currectQuestion = this.module.json.question_list[idx];
        let scoreType = this.module.json.score_type;

        let makarDragon = document.getElementById("makarDragon");
        let imgRight = document.getElementById("imgRight");
        let imgWrong = document.getElementById("imgWrong");

        //[start-20240207-renhaohsu-add]//
        let targetId;
        if( this.obj_type == "3d" ){
            if (target.localName=='a-text'){
                targetId = target.parentNode.id;
            }
            else{
                targetId = target.id;
            }
        } else if ( this.obj_type == "2d" ){
            targetId = target.obj_id;
        } else {
            console.log("%c _quiz _quizOption: target=", "color:tomato;", target)
        }
        //[end-20240207-renhaohsu-add]//

        if (currectQuestion.option_type == "Option_Text" || currectQuestion.option_type == "Option_Image"){
            
            //[start-20231019-howardhsu-add]//
            //// 避免user連續點擊造成pushButton重複呼叫
            this.isButtonPushed = true
            //[end-20231019-howardhsu-add]//

            if (currectQuestion.answer_list == null){
                currectQuestion.answer_list = []
            }
            let correctAnswerIdx = currectQuestion.answer_list[0];
            let correctAnswer = currectQuestion.options_json[correctAnswerIdx-1];
            
            //// 查找紀錄『選了哪個選項』
            for (let i = 0, len=currectQuestion.options_json.length; i < len; i++ ){
                if ( currectQuestion.options_json[i].generalAttr.obj_id == targetId ){
                    answer_options.push(i);
                }
            }

            if (correctAnswer && correctAnswer.generalAttr.obj_id == targetId){
                if (currectQuestion.active_score){
                    if (scoreType == 'Custom'){
                        this.module.score += currectQuestion.score;
                        get_score = currectQuestion.score;
                    }
                    else if(scoreType == 'Total'){
                        let scoreTotal = this.module.json.total_score;
                        this.module.correctAnswer += 1;
                        this.module.score =  Math.round(scoreTotal * this.module.correctAnswer/this.module.totalActiveScoreQuestion);
                        get_score = Math.round( scoreTotal/this.module.totalActiveScoreQuestion );
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
            
            window.clearInterval(this.module.timer.currentTimer);
            
            setTimeout( () => {
            
                makarDragon.style.display = "none";
                // 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
                let quizIndex = {
                    question: idx ,
                    get_score:  get_score,
                    answer_time: Math.round( (Date.now() - this.module.qClock)/1000 ),
                    answer_options: answer_options,
                    answer_cloze: "",
                    answer_is_enable: true,
                    answer_is: answer_is,
                }
                this.module.record[idx] = quizIndex;
                //[start-20231117-renhaohsu-add]//
                this.record[idx] = quizIndex
                //[end-20231117-renhaohsu-add]//
                
                this.module.record_time += Math.round( (Date.now() - this.module.qClock)/1000 );
                this.module.qClock = Date.now();

                if (currectQuestion.show_score){
                    let scoreDiv = document.getElementById("scoreDiv");
                    let score = document.getElementById("score");
                    scoreDiv.style.display = "block";
                    // scoreDiv.onclick = function(){
                    //     scoreDiv.style.display = "none";
                    //     self.nextQuestion();
                    // }
                    score.textContent = this.module.score;
                    
                }
                else{
                    this.nextQuestion();
                }

            },1600);
            console.log("Quiz.js: _pushButton: score: ", this.module.score , currectQuestion );

        }
        else if(currectQuestion.option_type == "MutiOption_Text" || currectQuestion.option_type == "MutiOption_Image"){
            
            console.log(" MutiOption_Text target", target)
            let targetObject = (this.obj_type == "3d") ? target.object3D : target;
            console.log(" MutiOption_Text targetObject", targetObject)

            //// 更改選項「選取狀態」
            //// 由於「多選圖片」跟「多選文字」的層級不同，改為完整尋找
            targetObject.traverse( ( child ) => { 

                if(this.obj_type == "3d"){

                    if ( child.type=='Group' && child.el && child.el.getAttribute('id') == 'circle_in' ){ 
                        let item = child.el;
                        item.setAttribute("visible", !item.getAttribute("visible"));
                        let targetId;
                        if (target.localName=='a-text'){
                            targetId = target.parentNode.id;
                        } else{
                            targetId = target.id;
                        }
                        //// 假如此選項曾經選擇過，需要移除。反之，加入 
                        if (this.module["choices"].includes(targetId)){
                            let choices_idx = this.module["choices"].indexOf(targetId);
                            this.module["choices"].splice(choices_idx,1);
                        }
                        else{
                            this.module["choices"].push(targetId);
                        }
                        console.log("Quiz.js: _pushButton: choices = ", this.module["choices"]);
    
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

                } else if( this.obj_type == "2d" && (target.makarType == 'text2D' || target.makarType == 'image2D') ){
                    if ( child.isMesh ){
                        if ( child.name == 'circle_in' ){
                            child.visible = !child.visible;
                            //// 假如此選項曾經選擇過，需要移除。反之，加入 
                            if ( this.module["choices"].includes(targetId) ){
                                let choices_idx = this.module["choices"].indexOf(targetId);
                                this.module["choices"].splice(choices_idx,1);
                            }else{
                                this.module["choices"].push(targetId);
                            }
                        }

                        if ( child.name == 'circle_out' ){
                            if (child.material.color.getHexString() == "7b7b7b" ){
                                child.material.color.setStyle( "#00d1c1" );
                            }else if ( child.material.color.getHexString() == "00d1c1" ){
                                child.material.color.setStyle( "#7b7b7b" );
                            }
                        }
                    }
                }
                else {
                    console.log("_Quiz _loadQuestion: There shall not be any type except for 2d3d")
                }

            });


            //// 判斷是否點擊到『確認按鈕』
            if (targetObject.sub_type == "button"){
                
                //[start-20231019-howardhsu-add]//
                //// 避免user連續點擊造成pushButton重複呼叫
                this.isButtonPushed = true
                //[end-20231019-howardhsu-add]//
                
                let correctCount = 0;
                if (currectQuestion.answer_list == null){
                    currectQuestion.answer_list = []
                }
                for (let correct_idx of currectQuestion.answer_list){
                    let correctAnswer = currectQuestion.options_json[correct_idx];
                    if (correctAnswer){
                        for (let choicesId of this.module["choices"]){
                            if(choicesId == correctAnswer.generalAttr.obj_id){
                                correctCount += 1;
                            }
                        }
                    }
                }


                for (let i = 0, len = currectQuestion.options_json.length; i < len; i++ ){
                    for (let j = 0, len2 = this.module["choices"].length; j < len2; j++ ){
                        if (currectQuestion.options_json[i].generalAttr.obj_id == this.module["choices"][j] ){
                            answer_options.push( i-1 );
                        }
                    }
                }

                if (correctCount == currectQuestion.answer_list.length && currectQuestion.answer_list.length == this.module["choices"].length){
                    if (currectQuestion.active_score){
                        if (scoreType == 'Custom'){
                            this.module.score += currectQuestion.score;
                            get_score = currectQuestion.score;
                        }
                        else if(scoreType == 'Total'){
                            let scoreTotal = this.module.json.total_score;
                            this.module.correctAnswer += 1;
                            this.module.score =  Math.round(scoreTotal * this.module.correctAnswer/this.module.totalActiveScoreQuestion);
                            get_score = Math.round( scoreTotal/this.module.totalActiveScoreQuestion );
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
                window.clearInterval(this.module.timer.currentTimer);                
                
                //// 播放動畫 1.6 second
                let counter = this.module.timer.counter;
                setTimeout( () => {

                    makarDragon.style.display = "none";
                    // 完成前一題，預定紀錄於本地的 database，但是viewer 端並沒有如此操作，之後再說
                    // console.log("Quiz.js: score , currectQuestion = ", idx, this.module , this.module["choices"] , answer_options , get_score );
                    console.log("Quiz.js: _pushButton: " , this.module.json.question_list[idx].time_limit, counter, Math.round( (Date.now() - this.module.qClock)/1000 ) );
                    let quizIndex = {
                        question: idx ,
                        get_score:  get_score,
                        answer_time:  Math.round( (Date.now() - this.module.qClock)/1000 ) ,
                        answer_options: answer_options,
                        answer_cloze: "",
                        answer_is_enable: true,
                        answer_is: answer_is,
                    }
                    this.module.record[idx] = quizIndex;
                    //[start-20231117-renhaohsu-add]//
                    this.record[idx] = quizIndex
                    //[end-20231117-renhaohsu-add]//

                    this.module.record_time += Math.round( (Date.now() - this.module.qClock)/1000 );
                    this.module.qClock = Date.now();

                    if (currectQuestion.show_score){
                        let scoreDiv = document.getElementById("scoreDiv");
                        let score = document.getElementById("score");
                        scoreDiv.style.display = "block";
                        // scoreDiv.onclick = function(){
                        //     scoreDiv.style.display = "none";
                        //     self.nextQuestion();
                        // }
                        score.textContent = this.module.score;
                        
                    }
                    else{
                        this.nextQuestion();
                    }
                    
                },1600);
                console.log("Quiz.js: _pushButton: score: ", this.module.score , currectQuestion );
                
            }
        } else {
            //// 未知狀況

            return;
        }
        
    }
    //20200723-thonsha-add-end


    nextQuestion(){
        //[start-20231019-howardhsu-add]//
        //// 避免user連續點擊造成pushButton重複呼叫
        this.isButtonPushed = false
        //[end-20231019-howardhsu-add]//

        this.module["choices"] = []

        //[start-20230921-howardhsu-add]//
        window.clearInterval(this.module.timer.currentTimer)
        //[end-20230921-howardhsu-add]//

        this.clearObject()

        this.module.currentIndex += 1;
        if (this.module.currentIndex < this.module.json.display_order_list.length){
            let idx = this.module.json.display_order_list[this.module.currentIndex].index
            let next_question = this.module.json.question_list[idx];

            //// 時間限制部份       
            if(this.module.json.timer_type == "Custom"){
                this.module.timer.counter = next_question.time_limit;
            }

            //// 提示部份
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

            ////載入下一題的場景
            //// 載入題目
            if ( next_question.questions_json && Array.isArray( next_question.questions_json ) ){
                for(let i=0; i<next_question.questions_json.length; i++){

                    //[start-20231006-howardhsu-modify]//
                    this.loadQuestion(next_question.questions_json[i])    
                    //[end-20231006-howardhsu-modify]//
                    
                }
            }
            

            //// 載入選項
            if ( next_question.options_json && Array.isArray( next_question.options_json ) ){

                for(let i=0; i<next_question.options_json.length; i++){
                    
                    //[start-20231006-howardhsu-modify]//
                    let {pOption, sub_type} = this.loadOption(next_question.options_json[i])                    
                    //[end-20231006-howardhsu-modify]//
                    
                    //// 多選題要讓「選項物件」增加「圓圈」
                    if (sub_type != "button" && (next_question.option_type == "MutiOption_Text"|| next_question.option_type == "MutiOption_Image")){

                        if ( isPromise( pOption ) == false ){
                            continue;
                        }

                        pOption.then( ( ret ) => {
                            //[start-20240227-renhaohsu-modify]//
                            let optionObject = ret;

                            let circlePos = new THREE.Vector3(0,0,0);
                            let circleRot = new THREE.Vector3(0,0,0);
                            let circleScale = new THREE.Vector3(1,1,1);

                            if(next_question.option_type == "MutiOption_Text"){                                
                                switch (this.obj_type) {
                                    case "3d":
                                        this.multiOptionTextCircle3d(optionObject, circlePos, circleRot, circleScale)
                                        break;
                                
                                    case "2d":
                                        this.multiOptionTextCircle2d(optionObject, circlePos, circleRot, circleScale)
                                        break;
                            
                                    default:
                                        console.log("_Quiz _load: There shall not be any type except for 2d3d")
                                        break;
                                }
                            } else if (next_question.option_type == "MutiOption_Image"){
                                switch (this.obj_type) {
                                    case "3d":
                                        let timeoutID = setInterval( () => {
                                            //[start-20230923-howardhsu-add]//    
                                            //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                                            if (this.module.currentIndex >= this.module.json.display_order_list.length){
                                                window.clearInterval(this.module.timer.currentTimer)
                                            }                             
                                            //[end-20230923-howardhsu-add]//
    
                                            if (optionObject.getAttribute("heightForQuiz")){ 
                                                let height = optionObject.getAttribute("heightForQuiz");
    
                                                this.multiOptionImageCircle3d(optionObject, circlePos, circleRot, circleScale)
                                                
                                                window.clearInterval(timeoutID);
                                            }
                                        }, 1);
                                        break;
                                
                                    case "2d":
                                        this.multiOptionImageCircle2d(optionObject, circlePos, circleRot, circleScale)
                                        break;
                            
                                    default:
                                        console.log("_Quiz _load: There shall not be any type except for 2d3d")
                                        break;
                                }
                            } else {
                                console.warn("MultiOption should be either MutiOption_Text or MutiOption_Image.")
                            }
                            //[end-20240227-renhaohsu-modify]//
                        });
                    }
                }

            } else {
                console.warn("_quiz _load: data might be incorrect, first_question.options_json=", first_question.options_json)
                return
            }
            

            let timerContent = document.getElementById('timerContent');

            //// 處理『自訂時間』
            if(this.module.json.timer_type == "Custom"){
                if (this.module.timer.counter >= 0){
                    let hour = Math.floor(this.module.timer.counter/3600);
                    let min = Math.floor((this.module.timer.counter-hour*3600)/60);
                    let sec = this.module.timer.counter-hour*3600-min*60;
                    timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');
                }
            }

            setTimeout( () => {                
                //// 20210107-每一秒執行一次，將counter減一，並顯示剩餘秒數，到0會跳時間到 ////
    
                if (this.module.timer.counter >= 0){
                    this.module.qClock = Date.now();
                    
                    window.clearInterval(this.module.timer.currentTimer)
                    
                    let timeoutID = setInterval( () => {
                        
                        this.module.timer.currentTimer = timeoutID;
                        this.module.timer.counter -= 1;

                        //[start-20230923-howardhsu-add]//
                        //// 在user點答案點很快的情況下 quiz的計時器不會被清除 因此補上這段                      
                        if (this.module.currentIndex >= this.module.json.display_order_list.length){
                            window.clearInterval(this.module.timer.currentTimer)
                        }
                        //[end-20230923-howardhsu-add]//

                        let hour = Math.floor(this.module.timer.counter/3600);
                        let min = Math.floor((this.module.timer.counter-hour*3600)/60);
                        let sec = this.module.timer.counter-hour*3600-min*60;
                        timerContent.textContent = hour.toString().padStart(2,'0')+":"+min.toString().padStart(2,'0')+":"+sec.toString().padStart(2,'0');

                        if (this.module.timer.counter <= 0){
                            window.clearInterval(this.module.timer.currentTimer);
                            if (this.module.json.timer_type == "Custom"){
                                if (next_question.show_score){
                                    let scoreDiv = document.getElementById("scoreDiv");
                                    let score = document.getElementById("score");
                                    scoreDiv.style.display = "block";
                                    // scoreDiv.onclick = function(){
                                    //     scoreDiv.style.display = "none";
                                    //     self.nextQuestion();
                                    // }
                                    score.textContent = this.module.score;
                                    
                                }
                                else{
                                    this.nextQuestion();
                                }
                            }
                            else{
                                this.clearObject()

                                let tipButtonDiv = document.getElementById("tipButtonDiv");
                                let tipDiv = document.getElementById("tipDiv");
                                tipButtonDiv.style.display = "none";
                                tipDiv.style.display = "none";
                                
                                // let startQuiz = document.getElementById("startQuiz");
                                let startQuiz = window.aQuizVR.UIs.startQuiz;
                                let QuizStartButton = document.getElementById("QuizStartButton");
                                let QuizStartContent = document.getElementById("QuizStartContent");
                                QuizStartContent.textContent = "時間到"

                                //[start-2023mmdd-howardhsu-modify]//
                                if(this.module.timer.counter == 0){
                                    startQuiz.style.display = "block";
                                }
                                //[end-2023mmdd-howardhsu-modify]//

                                let quizIndex = {
                                    question: idx ,
                                    get_score:  0,
                                    answer_time: this.module.json.question_list[idx].time_limit ,
                                    answer_options: [],
                                    answer_cloze: "",
                                    answer_is_enable: false,
                                    answer_is: false,
                                }
                                this.module.record[idx] = quizIndex;
                                //[start-20231117-renhaohsu-add]//
                                this.record[idx] = quizIndex
                                //[end-20231117-renhaohsu-add]//
                                
                                this.module.record_time += this.module.json.question_list[idx].time_limit;
                                this.module.qClock = Date.now();

                                QuizStartButton.addEventListener("click", () => {
                                    startQuiz.style.display = "none";

                                    //[start-20230712-howardhsu-add]//
                                    //// 存檔: 沒有下一題，預定紀錄答題狀態上雲端 (就是底下else的全部)
                                    this.saveQuizStatus();
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
            //// 沒有下一題
            this.saveQuizStatus()
        }
    }



    //[start-20240305-renaohsu-modify]//
    saveQuizStatus(){				
        //// 沒有下一題，把『觸控』開回來
        // vrController.cursorEntity.setAttribute('cursor', "fuse: true; fuseTimeout: 5" );
        this.isPlayed = true;

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

        console.log("VRFunc.js: quiz end , this.module.record = " , this.module.record  );
        let playing_user = "", device_id = "";

        //// 推測 localStorage 有 MakarUserID 表示user已經登入
        if (localStorage.getItem("MakarUserID") ){
            playing_user = localStorage.getItem("MakarUserID")           
        }
        if (localStorage.getItem("device_id")){
            device_id = localStorage.getItem("device_id");
        }

        //// 目前存放分為 『log資訊』給『數據分析』 跟 『專案遊玩資訊』給『viewer 查詢』 
        //// 『log資訊』給『數據分析』  quiz_log
        let quizLogData  = {
            "user_id":       this.currentProjData.user_id ,
            "playing_user":  playing_user , //// 在還沒有登入流程時候 一定要設為空字串
            "proj_id":       this.currentProjData.proj_id ,
            "proj_type":     "vr" ,
            "device_id":     device_id ,
            "module_id":     "",    //// Quiz 在 scenesData的typeAttr裡找不到 module_id
            "brand":         Browser.name + Browser.version ,
            "os":            Browser.platform ,
            "location_long": 0.0,
            "location_lan":  0.0,
            "module":        [ this.module.json ],
            "record_time":   this.module.record_time,
            "record_score":  this.module.score ,
            "record":        this.module.record,
        }
        net.quizLog(quizLogData).then( result => {
            console.log("_quizLog post to api: result=", result,
                        "\n\n quizLogData=", quizLogData );
        })

        //// 更新使用者紀錄模組     
        let quizProjectModuleRecord;
        net.getRecordModule( playing_user , this.currentProjData.proj_id ).then( result => {
            // console.log("getRecordModule: result=", result);
    
            //// 因為 update_record_module 是更新整筆資料，因此需要先get再post
            if( result.data.record_module_list && Array.isArray(result.data.record_module_list) ){
                if(result.data.record_module_list.length > 0){
                    if(result.data.record_module_list[0].project_module){
                        // console.log("getRecordModule: project_module", result.data.record_module_list[0].project_module );
                        quizProjectModuleRecord = result.data.record_module_list[0].project_module
                    }
                }                
            }

            let quizRecord = {
                //// 必要的keys是playing_user_id, proj_id, project_module (其他即使給錯 server端也會通過且只更新project_module)
                "head_pic":        this.currentProjData.head_pic,
                "loc":             this.currentProjData.loc,
                "module_type":     this.currentProjData.module_type,
                "name":            this.currentProjData.name,
                "playing_user_id": playing_user,
                "proj_cover_urls": this.currentProjData.proj_cover_urls,
                "proj_id":         this.currentProjData.proj_id,
                "proj_name":       this.currentProjData.proj_name,
                "proj_type":       "vr",
                "snapshot_url":    this.currentProjData.snapshot_url,
                "user_id":         this.currentProjData.user_id,
                "project_module":  quizProjectModuleRecord   //// 可以放json格式任意資料，會直接更新覆蓋掉，目前先把quiz記錄在它底下
            }
            
            if(quizProjectModuleRecord){
                //// 這裡需要提供 "Quiz id" 之後 GET 才能知道 "同專案下的哪個Quiz有遊玩記錄"
                if(quizProjectModuleRecord.playedQuizzes && Array.isArray(quizProjectModuleRecord.playedQuizzes)){
                    let quizIdExisted = quizProjectModuleRecord.playedQuizzes.find( item => item.obj_id==this.obj_id)
                    if(!quizIdExisted){
                        quizRecord.project_module.playedQuizzes.push( {"obj_id": this.obj_id, "record": this.module.record} )
                    }
                } else {
                    quizRecord.project_module.playedQuizzes = [ {"obj_id": this.obj_id, "record": this.module.record} ]
                }
            } else {
                quizRecord.project_module = {}
                quizRecord.project_module.playedQuizzes = [ {"obj_id": this.obj_id, "record": this.module.record} ]
            }

            //// 更新 同專案下的哪個Quiz有遊玩記錄
            net.updateRecordModule( quizRecord ).then( result => {
                console.log("_updateRecordModule post to api: result=", result,
                            "\n\n quizRecord=", quizRecord );
            })
        })

        this.isPlaying = false
        console.log("Quiz.js: quiz end, quiz=" , this );
    }
    //[end-20240305-renaohsu-modify]//

}
export default Quiz

//[start-20231116-renhaohsu-add]

//// 嘗試 design pattern: flywieght (享元模式)
//// 參考 https://wyattkidd.medium.com/翻譯-javascript-設計模式-fca4e2e16752#a9b3
//// 由一個只存在單一instance的class，來管理其他重複出現的小單元
////  
//// 但此處Quiz不會重複出現
//// 只是藉由上述特性來管理多個Quiz (因此只能說是參考了享元模式，但沒有使用到它最大的優點:節省記憶體)
//// 類似於 工廠模式 + 單例模式

//// According to wiki https://en.wikipedia.org/wiki/Flyweight_pattern#Implementation_details
//// the factory interface is commonly implemented as a singleton to provide global access for creating flyweights.
//// 
//// factory for quiz objects
class QuizFactory {
    
    quizData = [];
    loadedQuizzes = [];

    //// 記錄啟動物件
    triggers = [];

    //// 記錄"啟動物件"和對應的quiz物件obj_id
    quizIdOpenDirectly = [];
    quizIdWithTriggers = [];

    //// 當前被user點擊trigger 正要顯示的quiz
    currentlyTriggeredQuizId = "";

    //// 防止 QuizStartButton 的 html click event 重複呼叫
    alreadyTriggeredQuizId = "";

    constructor(){
        //// singleton pattern
        if(QuizFactory.exists)
        {
            return QuizFactory.instance
        }
        QuizFactory.instance = this
        QuizFactory.exists = true

        return this
    }

    createQuiz(objData){
        const obj_id = objData.generalAttr.obj_id
        let quiz = this.getQuiz(obj_id);
        if (quiz) {
            return quiz;
        } else {
            const newQuiz = new Quiz(objData);
            this.loadedQuizzes.push(newQuiz);
            return newQuiz;
        }
    }

    getQuiz(obj_id){
        return this.loadedQuizzes.find(quiz => quiz.obj_id === obj_id);
    }

    ////// 與 mDB 相關
    getQuizProjectFromMDB = function( proj_id ){        
        //// 20231116 rehnahowshu測試時發現這可以 .then 繼續往下chain
        return parent.mdb.getQuizProject( proj_id )
    }

    putQuizProjectToMDB = function(projInfo){
        return parent.mdb.putQuizProject( projInfo )
    }
    
    //// 確認是否正在顯示 答對/錯 動畫
    checkIs2DPictureShowing(){
        return this.loadedQuizzes.some( q => q.isButtonPushed )
    }

    //// 檢查是否有Quiz正在遊玩
    checkIsAnyQuizPlaying(){
        return this.loadedQuizzes.some( q => { return q.isPlaying == true; } )
    }

    //// 清除正在控管的quiz物件們。搭配 VRController loadScene()使用，讓場景切換時能清空aQuizVR
    clear(){
        this.quizData = [];
        this.loadedQuizzes = [];
    
        //// 記錄啟動物件
        this.triggers = [];

        //// 記錄"啟動物件"和對應的quiz物件obj_id
        this.quizIdOpenDirectly = [];
        this.quizIdWithTriggers = [];
    
        //// 當前被user點擊trigger 正要顯示的quiz
        this.currentlyTriggeredQuizId = "";
        this.alreadyTriggeredQuizId = "";
    }

    ////  載入了Quiz，記錄資料到mdb
    saveQuizDataToMDB(quiz_obj_id, user_id, project_id, device_id){   
        
        let quizzesInfo = {
            "user_id": user_id,
            "proj_id": project_id,
            "device_id": device_id,
            "obj_id": quiz_obj_id,   
            "is_played": true,
            "type":"quiz",

            "login_id": localStorage.getItem("MakarUserID") ? localStorage.getItem("MakarUserID") : "not logged in",
            "date_time": (new Date()).toString(),

            //// 記錄遊玩記錄 (暫時擱置，因為每個quiz物件底下的record或module已有記錄。)
            // "can_reward_point_count": scene_objs[j].project_module[0].can_reward_point_count,
            // "collected_points": [
            //     getPointTarget.target_id
            // ],
        }

        this.getQuizProjectFromMDB(project_id).then( getProjRet => {

            
            if ( Object.keys(getProjRet).length == 0 ) {    
                    
                //// mdb沒記錄 直接新增         
                let projInfo = {
                    "proj_id": project_id,
                    "quizzes": {}
                }
                projInfo.quizzes[quiz_obj_id] = quizzesInfo
                
                let p = this.putQuizProjectToMDB ( projInfo )    
                // p.then(data => console.log("____________mdb put!   data", data))         
                
            } else {
                //// 專案已在mdb記錄過
                let projInfo = getProjRet
                
                //// 新增or更新 該集點卡的資料
                if( !getProjRet.quizzes ){
                    //// 專案有記錄，但並非集點卡 新增
                    projInfo.quizzes = {}
                }
                projInfo.quizzes[quiz_obj_id] = quizzesInfo
                
                let p = this.putQuizProjectToMDB ( projInfo )    
                // p.then(data => console.log("____________mdb put!   data", data))         
            }

        }).catch((err) => {
            console.warn('Quiz.js _saveQuizDataToMDB: saveQuizDataToMDB but error:', err)
        });

    }

    //[start-20231207-howardhsu-modify]//	
    loadQuiz( jsonObj, transformData, proj_id, login_id, UIs, worldContent, languageType ){

        //// 要回傳給 VRController 的 Promise (需要在loadSceneObjects把這個加到 pAll)
        let pQuizCheckRecords = []

        const position = transformData.position
        const rotation = transformData.rotation
        const scale = transformData.scale


        //// v3.5.0.0 的 quiz 在 "實際要顯示" 的時候才加入 makarObjects
        this.quizData.push(jsonObj)

        //// html 2D介面 一句文字(點擊開始遊玩) + 確認按鈕
        // let startQuiz = document.getElementById("startQuiz");		
        let startQuiz = UIs.startQuiz
        
        //// 3.5.0 Quiz 啟動物件  ( 20240125 ↓ )
        //// typeAttr.module.trigger 應該就是quiz的啟動物件 但沒有 trigger_type 暫時當作有trigger就是"點擊物件啟動"   (註: 然而question_list的每個題目有trigger_type，若以後變成"每道題目"都有自己的啟動物件，這裡的流程可能要修改)
        if(jsonObj.typeAttr.module.trigger.length != 0 ){

            const trigger_id = jsonObj.typeAttr.module.trigger

            this.triggers.push(trigger_id)
            this.quizIdWithTriggers.push({ 
                "quiz_id": jsonObj.generalAttr.obj_id,
                "trigger_id": trigger_id,
                "force_login": jsonObj.typeAttr.module.force_login,
                "allow_retry": jsonObj.typeAttr.module.allow_retry
            } )
        }
    
        // let QuizStartButton = document.getElementById("QuizStartButton");
        let QuizStartButton = UIs.QuizStartButton

        let QuizStartContent = UIs.QuizStartContent

        //// click event for quiz start button
        let startQuizFunc = () => {      
            //// 如果quiz在編輯器的設定是"直接開啟"
            if(jsonObj.typeAttr.module.trigger.length == 0){    

                let quiz = this.createQuiz(jsonObj)	
                quiz.load( jsonObj, position, rotation, scale );
                startQuiz.style.display = "none";
                QuizStartButton.removeEventListener("click",startQuizFunc);
                
                ////  載入了Quiz，記錄資料到mdb
                const user_id = makarUserData.oneProjData.user_id
                // const project_id = self.scenesData.project_id
                const project_id = proj_id
                const device_id = localStorage.getItem('device_id')                                            
                this.saveQuizDataToMDB(quiz.obj_id, user_id, project_id, device_id)

            } else {
                //// 如果quiz在編輯器的設定是"點擊物件開啟"
                //// confirm which quiz should be shown
                if(this.currentlyTriggeredQuizId){
                    if( this.currentlyTriggeredQuizId == jsonObj.generalAttr.obj_id ){     
                        if( this.alreadyTriggeredQuizId == this.currentlyTriggeredQuizId ){
                            //// _QuizStartButton htmlClickEvent在轉場景時難以移除 因此要先確認是否重複呼叫
                            // console.log("_QuizStartButton htmlClickEvent在轉場景時難以移除 因此要先確認是否重複呼叫")
                        } else {
                            this.alreadyTriggeredQuizId = this.currentlyTriggeredQuizId

                            let quiz = this.createQuiz(jsonObj)	
                            quiz.load( jsonObj, position, rotation, scale )
                            startQuiz.style.display = "none"
                            QuizStartButton.removeEventListener("click", startQuizFunc)
                            
                            ////  載入了Quiz，記錄資料到mdb
                            const user_id = makarUserData.oneProjData.user_id
                            // const project_id = self.scenesData.project_id
                            const project_id = proj_id
                            const device_id = localStorage.getItem('device_id')                                            
                            this.saveQuizDataToMDB(quiz.obj_id, user_id, project_id, device_id)
                        }
                    }
                }
            }
        }							

        //// 離開quiz
        let quitQuizFunc = function(){
            startQuiz.style.display = "none";
            // QuizStartButton.removeEventListener("click",quitQuizFunc);
        }

        let url = window.serverUrl;
        
        // let proj_id = self.currentProjData.proj_id;

        ////  有MakarUserID可以代表user已經登入
        // let login_id = localStorage.getItem("MakarUserID") 
        ////  假如專案要求『強制登入作答』，檢查是否登入
        const force_login = jsonObj.typeAttr.module.force_login                            
        ////  檢查是否『允許重複作答』
        const allow_retry = jsonObj.typeAttr.module.allow_retry
        ////  確認問答開啟方式: 目前有兩種，"Directly"直接開啟，"Target"點擊物件開啟
        const showDirectly = jsonObj.typeAttr.module.trigger.length == 0
        
        //// 檢查 上述四種條件下 8+4 種組合
        if( force_login && allow_retry &&  showDirectly && login_id ){

            //// 可以重複作答，不用檢查紀錄，直接載入問答資料
            // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
            QuizStartContent.textContent = worldContent.clickToPlay[languageType];
            QuizStartButton.addEventListener("click",startQuizFunc);
            //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字
            this.quizIdOpenDirectly.push( {"quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent} )
        
        } else if(  force_login &&  allow_retry && !showDirectly && login_id ){

            //// 可以重複作答，不用檢查紀錄，直接載入問答資料
            // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
            QuizStartContent.textContent = worldContent.clickToPlay[languageType];
            QuizStartButton.addEventListener("click",startQuizFunc);
            //// html UI的 (startQuiz) 的文字、clickEvent(需要)在 triggerEvent "ShowQuiz"時再次設定

        } else if(  force_login && !allow_retry &&  showDirectly && login_id ){

            let getApiRecord = _quizCheckApiRecord(login_id, proj_id, showDirectly)
            // pObjs.push(getApiRecord)
            pQuizCheckRecords.push(getApiRecord)
            
        } else if(  force_login && !allow_retry && !showDirectly && login_id ){
            
            let getApiRecord = _quizCheckApiRecord(login_id, proj_id, showDirectly)
            // pObjs.push(getApiRecord)
            pQuizCheckRecords.push(getApiRecord)

        } else if(  force_login &&  allow_retry &&  showDirectly && !login_id ){
            //// 沒有登入，不給遊玩，跳出提示
            _userNotLoggedIn();
        } else if(  force_login &&  allow_retry && !showDirectly && !login_id ){
            _userNotLoggedIn();
        } else if(  force_login && !allow_retry &&  showDirectly && !login_id ){
            _userNotLoggedIn();
        } else if(  force_login && !allow_retry && !showDirectly && !login_id ){
            _userNotLoggedIn();        

        } else if( !force_login &&  allow_retry &&  showDirectly ){

            //// 可以重複作答，不用檢查紀錄，直接載入問答資料
            // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
            QuizStartContent.textContent = worldContent.clickToPlay[languageType];
            QuizStartButton.addEventListener("click",startQuizFunc);
            //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
            this.quizIdOpenDirectly.push( {"quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent} )
        
        } else if( !force_login &&  allow_retry && !showDirectly ){
            
            //// 可以重複作答，不用檢查紀錄，直接載入問答資料
            // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
            QuizStartContent.textContent = worldContent.clickToPlay[languageType];
            QuizStartButton.addEventListener("click",startQuizFunc);
            //// html UI的 (startQuiz) 的文字(需要)在 triggerEvent "ShowQuiz"時再次設定
            
        } else if( !force_login && !allow_retry &&  showDirectly ){

            //// 『不強制登入作答』、『不可重複遊玩』 檢查mdb 確認是否已有遊玩記錄、是否為『直接顯示』並做出對應處理
            let getMdbRecord = _quizCheckMdbRecord(proj_id, showDirectly)
            // pObjs.push(getMdbRecord)
            pQuizCheckRecords.push(getMdbRecord)

        } else if( !force_login && !allow_retry && !showDirectly ){

            let getMdbRecord = _quizCheckMdbRecord(proj_id, showDirectly)
            // pObjs.push(getMdbRecord.pQuizGetMdbRecord)
            pQuizCheckRecords.push(getMdbRecord.pQuizGetMdbRecord)

        }


        //// quiz在編輯器設定"強制登入遊玩" 但web端user沒登入：只顯示文字提示，不給遊玩 
        function _userNotLoggedIn(){
            //// 沒有登入，不給遊玩，跳出提示
            // QuizStartContent.textContent = self.worldContent.userNotLoginInfo[self.languageType];
            QuizStartContent.textContent = worldContent.userNotLoginInfo[languageType];
            QuizStartButton.addEventListener("click",quitQuizFunc);                 
            //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字               
            window.aQuizVR.quizIdOpenDirectly.push( {"quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent} )
        }

        //// 假如專案要求『強制登入作答』、『不可重複遊玩』 call後端API 來確認是否已有遊玩記錄
        function _quizCheckApiRecord(login_id, proj_id, showDirectly){
            return net.getRecordModule( login_id, proj_id ).then(ret => {
                // console.log("vrController.js: _getRecordModule: login_id=", login_id, "proj_id=", proj_id , "\n  ret= " , ret );
                if(ret.data.record_module_list.length != 0){                                                
                    //// 此登入用戶已經有遊玩記錄 

                    // console.log("record_module_list", ret.data.record_module_list)
                    let quizProjectModuleRecord;
                    if( ret.data.record_module_list && Array.isArray(ret.data.record_module_list) ){
                        if(ret.data.record_module_list[0].project_module){
                            quizProjectModuleRecord = ret.data.record_module_list[0].project_module
                        }
                    }

                    //// 從記錄裡找 Quiz obj_id 確認是否玩過
                    let played = false
                    if(quizProjectModuleRecord){
                        if(quizProjectModuleRecord.playedQuizzes && Array.isArray(quizProjectModuleRecord.playedQuizzes)){
                            played = quizProjectModuleRecord.playedQuizzes.find( item => item.obj_id==jsonObj.generalAttr.obj_id)
                        }
                    }

                    if(played){
                        //// 這Quiz 已經遊玩過，跳出提示
                        QuizStartContent.textContent = worldContent.userAlreadyPlayed[languageType];
                        QuizStartButton.addEventListener("click",quitQuizFunc);
                    } else {
                        //// 這Quiz 沒有遊玩記錄 ，直接載入問答資料
                        QuizStartContent.textContent = worldContent.clickToPlay[languageType];
                        QuizStartButton.addEventListener("click",startQuizFunc);
                    }

                } else{
                    //// 沒有遊玩記錄 ，直接載入問答資料
                    QuizStartContent.textContent = worldContent.clickToPlay[languageType];
                    QuizStartButton.addEventListener("click",startQuizFunc);
                }
                
                if( showDirectly ){
                    //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
                    window.aQuizVR.quizIdOpenDirectly.push({ "quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent })
                }
                
            })
        }

        //// 假如專案要求『不 強制登入作答』、『不可重複遊玩』 檢查mdb 確認是否已有遊玩記錄
        function _quizCheckMdbRecord(proj_id, showDirectly){
            return parent.mdb.getProject(proj_id, getEvent => {
                if ( getEvent.target.readyState == "done" && getEvent.target.result ){
                    //// 檢查 mdb 已遊玩過的quiz 是否存在
                    if( getEvent.target.result.quizzes ){
                        // if( getEvent.target.result.quiz_obj_ids.find(ele => ele==jsonObj.generalAttr.obj_id) ){
                        const obj_id = jsonObj.generalAttr.obj_id
                        if( getEvent.target.result.quizzes[obj_id] ){

                            //// 有記錄 這個Quiz 已經遊玩過，跳出提示                                
                            console.log("VRController.js: indexedDB.js _getProject: already have the project with same proj_id and the quiz have been played.", getEvent.target.result , getEvent.target.result.getAwardIndex );
                            // QuizStartContent.textContent = self.worldContent.userAlreadyPlayed[self.languageType];
                            QuizStartContent.textContent = worldContent.userAlreadyPlayed[languageType];
                            QuizStartButton.addEventListener("click",quitQuizFunc);
                            if( showDirectly ){
                                //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
                                window.aQuizVR.quizIdOpenDirectly.push({ "quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent })
                            }

                            return getEvent
                        } else {              
                            //// 有記錄 但這個Quiz還沒有遊玩過，載入問答資料
                            // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
                            QuizStartContent.textContent = worldContent.clickToPlay[languageType];
                            QuizStartButton.addEventListener("click",startQuizFunc);
                            if( showDirectly ){
                                //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
                                window.aQuizVR.quizIdOpenDirectly.push({ "quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent })
                            }
                            
                            return getEvent
                        }

                    } else {              
                        //// 沒記錄 沒有遊玩過，載入問答資料
                        // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
                        QuizStartContent.textContent = worldContent.clickToPlay[languageType];
                        QuizStartButton.addEventListener("click",startQuizFunc);
                        if( showDirectly ){
                            //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
                            window.aQuizVR.quizIdOpenDirectly.push({ "quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent })
                        }
                        
                        return getEvent
                    }
                }else{                                            
                    //// 沒有遊玩過，載入問答資料
                    // QuizStartContent.textContent = self.worldContent.clickToPlay[self.languageType];
                    QuizStartContent.textContent = worldContent.clickToPlay[languageType];
                    QuizStartButton.addEventListener("click",startQuizFunc);
                    if( showDirectly ){
                        //// 記錄有quiz是直接顯示，以便在所有scene_objs都遍歷之後，給定 html UI的 (startQuiz) 的文字  
                        window.aQuizVR.quizIdOpenDirectly.push({ "quiz_obj_id": jsonObj.generalAttr.obj_id, "quizUiTextContext": QuizStartContent.textContent })
                    }
                    
                    return getEvent
                }
            })
        }

        return pQuizCheckRecords
    }
    //[end-20231207-howardhsu-modify]//

}

window.aQuizVR = new QuizFactory();

//// 一些測試和觀察 先等到確認完成後再移除:  單例模式: 限制QuizFactory只能存在一個實例
//// 
//// singleton pattern: every instances of QuizFactory should reference to the same object
// window.qf2 = new QuizFactory();
// console.log(`%c Quiz.js: \n  using singleton pattern: aQuizVR == qf2 is ${aQuizVR == qf2}`, 'color: DarkCyan;font-size:20px')

//// 一些測試和觀察 先等到確認完成後再移除:  享元模式的特性 - QuizFactory和Quiz的關係
////
//// flyweight pattern: the objects with same obj_id created by QuizFactory should reference to the same object
// const quiz = aQuizVR.createQuiz( {'generalAttr':{'obj_id': 'quiz_unit_1'}} )
// const quizWithSameID = aQuizVR.createQuiz( {'generalAttr':{'obj_id': 'quiz_unit_1'}} )
// console.log(`%c Quiz.js: \n  using flyweight pattern: quiz == quizWithSameID is ${quiz == quizWithSameID}`, 'color: Olive;font-size:20px')
//// 但Quiz不會用到這個特性  (只是用工廠模式+單一模式 把所有Quiz整理起來)

//[end-20231116-renhaohsu-add]