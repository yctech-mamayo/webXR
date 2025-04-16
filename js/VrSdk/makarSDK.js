//// curve物件需要 anime
// import anime from '../node_modules/animejs/lib/anime.es.js';
import anime from '../../node_modules/animejs/lib/anime.es.js';

//// 測試，之後可移除
console.log("anime\n", anime)
anime({
    targets: '#anime-animate-anything-css',
    width: "50%",
    translateX: 250,
    rotate: '1turn',
    backgroundColor: '#777',
    duration: 800
});

window.anime = anime;

//// logicSystem需要gsap
import { gsap } from "../../node_modules/gsap/src/index.js";
    
import { ScrollTrigger } from "../../node_modules/gsap/src/ScrollTrigger.js";
import { ScrollToPlugin } from "../../node_modules/gsap/src/ScrollToPlugin.js";
import { TextPlugin } from "../../node_modules/gsap/src/TextPlugin.js";

gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,TextPlugin);

//// utility
import CommonTools from './commonTools.js';

//// 狀態列表: 主題, 觀察者 
import { Subject, BoxObserver } from "./EventSubject.js";

//// 測試，之後可移除
console.log("gsap\n", gsap)

//// 這樣user都知道我們用gsap 應該沒有關係吧?
window.gsap = gsap;

gsap.set("#gsap-animate-anything-css", {
    backgroundColor: "black",
    width: "100px",
    height: "100px",
})
gsap.to("#gsap-animate-anything-css", {
    backgroundColor: "black",
    width: "100px",
    height: "100px",
    duration: 10,
    ease: "none",
    repeat: -1,
    rotation: 360,
})

console.log("2024-06-25T15:50:00+08:00")

window.addEventListener('click', () => {
    const scene = document.querySelector('a-scene');
    // scene.style.cursor = 'default';

    document.documentElement.style.cursor = 'default';
    console.log("aframe scene", scene)
});

//// 1. 出現的全域變數 都需要放到MakarSDK底下
////    例如 homeTickOn  (這種在 VRController 裡面使用的 因此VRController也要查homeTickOn然後一起改動)
////    例如 parent.proj_id 等等
//// 
//// 2. 往後傳遞的參數 例如 proj_id 和 user_id 等等 也要檢查修改
class MakarSDK{
    config = { 
        proj_id: "a826d480-736f-4517-81e8-2f322e543e79",
        // user_id: "76ad6ef7-e89e-4f35-9c8d-0f40617f64a1" 
        user_id: "" 
    }
    
    container = null;
    vrDiv = document.createElement('div');   
    currentActiveController = null;

    //// 最初認為sdk應該在必要資料有缺時不該啟動  (但似乎都能用預設值代替? 問一下哪種方式較適合)
    isEnabled = false;

    //// 增加預先載入圖片功能，目前只做用在「載入中圖片」
    imageBase = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/Loading_20220630/Loading_An000';
    
    /////// start the pop note when document ready
    homeTickOn = true;

    //// 準備 js custom event 
    constructorEvent = new CustomEvent("webSDKconstructor", {
        detail: {
            name: "webSDK constructor",
        },
    });

    
    //// --- 記錄每個場景 ---
    scenesData = [];
    currentSceneData = null;

    // //// 讓user可輕鬆取得場景物件  目前規劃為物件都載入後呼叫 getCurrentSceneObjs
    // sceneObjs3D = null;
    // sceneObjs2D = null;

    //// 狀態列表 使用觀察者模式
    // eventList = [
    //     {
    //         "behav_type": "",
    //         "obj_id": ""
    //     },
    //     {
    //         "behav_type": "",
    //         "obj_id": ""
    //     }
    // ]
    //// 狀態列表 觀察者們  (觀察者放在MakarSDK 用fly-weight pattern來避免同一個物件重複新增觀察者)
    loadedObservers = [];


    //// workWithRenderTick
    //// 物理 需要在`renderTick`寫 不太確定哪種方式比較好
    //// 先寄在這裡
    workWithRenderTick_callbacks = {}



    //// 建構子只用來做基本設定  暫時先設定user需要呼叫 init 來初始化SDK
    constructor( config={}, container=null ){
        //// 給一些預設值?
        // this.config = config
        // if( !config.user_id ){
        //     console.log("缺少user_id, 以預設值帶入")
        //     this.config.user_id = "76ad6ef7-e89e-4f35-9c8d-0f40617f64a1" 
        // }
        // this.config = container
    }


    //// 檢查專案權限
    //// 目前先不給輸入 user_id 因為user_id是公開的 以後可能會增加token的流程再加入
    checkPermission(){
        return new Promise((resolve, reject) => {
            let permission = 0
            // let pScenes = CommonTools.getProjectInfoList( [this.config.proj_id], this.config.user_id );
            let pScenes = CommonTools.getProjectInfoList( [this.config.proj_id], "" );

            pScenes.then( function( ret ){
                console.log('_checkPermission ____getProjectInfoList_: ' , ret );
                if (ret.error) {
                    reject(`Promise 失敗, ret.error=${ret.error}`)
                } else {
                    console.log('_checkPermission ____getProjectInfoList_: permission' , ret.data.projects[0].permission );
                    permission = ret.data.projects[0].permission
    
                    if (permission==1 || permission==2) {
                        resolve(`Promise 成功， permission: ${permission}  `)
                    } else {
                        reject('Promise 失敗')
                    }
                }
            })
        });
    }

    async init(config, container){
        this.config = config
        this.container = container

        if( !config.user_id ){
            console.log("缺少user_id, 以預設值帶入")
            this.config.user_id = "76ad6ef7-e89e-4f35-9c8d-0f40617f64a1" 
        }
        
        if( !container ){
            console.log("todo: 缺少container, 以預設值帶入 (開一個新的給他放在頁面上 ")
            this.isEnabled = false
        } 

        if( !Array.isArray(container) ){
            console.log("SDK attempt container", container)
        }

        //// 檢查專案權限
        try{
            let permission = await this.checkPermission()
        } catch (err) {
            console.log('catch err=', err); //catch Promise 失敗
            console.warn("此專案設定並非公開")
            this.isEnabled = false
            return
        }

        //// 開始載入SDK
        //// 以下部分來自 vr html
        console.log("SDK attempt makarSDK=", this)

        //// 增加預先載入圖片功能，目前只做用在「載入中圖片」
        // let imageBase = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/Loading_20220630/Loading_An000';
        for (let i = 0; i < 30; i++ ){
            let strIndex = '';
            if (i < 10){
                strIndex = String( '0'+ i ) ;
            }else{
                strIndex = String( i );
            }
            let linkElement = document.createElement('link');
            linkElement.setAttribute('as', 'image');
            linkElement.setAttribute('rel', 'preload');
            linkElement.setAttribute('href', this.imageBase + strIndex + '.png' );
            document.head.appendChild( linkElement );
        }

        // window.serverUrl = "https://ssl-api-makar-apps.miflyservice.com/Makar"; // makar server Amazon 
        //////
        ////// set the version of server, will also change the function in networkAgent.js
        //////
        window.serverVersion = "3.0.0";
        //// 20240531 renhaohsu: 其實在這裡寫這個暫時是沒用的  webxr有用是因為裡面寫 parent 但 sdk 不是 parent 是同一個頁面
        switch(serverVersion){
            case "2.0.0":
                window.serverUrl = "https://ssl-api-makar-apps.miflyservice.com/Makar/"; // makar V2 server Amazon 
                // window.serverUrl = "https://makar-ali-sh-cn.miflyservice.com/Makar" ; // makar V2 server Ali-sh-cn
            break;
            
            case "3.0.0":
                    // window.serverUrl = "https://60.250.125.146:8888/Makar/"; // local V3 makar server.
                    window.serverUrl = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/"; // official V3 makar server.
                    // window.serverUrl = "https://test1.makar.app/Makar/"; // AWS test V3 makar server.
                    // window.serverUrl = "https://makar.app/Makar/";	// local test server 20200316
            break;
            
        }

        //// 從「 母頁面取得 MAKAR server api 位址」
        if ( parent && parent.serverUrl ){
            console.log(' makarXR.html: use parent server url ', parent.serverUrl );
            window.serverUrl = parent.serverUrl;
        }
        
        
        //20200102-start-thonsha-add
        window.requestDeviceMotionPermission = function (){
            console.log("makarVR.html: requestDeviceMotionPermission  " );
            if (typeof(DeviceMotionEvent) !== 'undefined' && typeof(DeviceMotionEvent.requestPermission) === 'function') {
                DeviceMotionEvent.requestPermission().then(response => {
                    console.log("makarVR.html: requestPermission response =", response );
                    // alert('Orientation tracking '+ response);
                    if (response == 'granted') {
                        window.addEventListener('devicemotion', (e) => {
                            // but.style.visibility='hidden';
                        })
                    }
                }).catch(console.error)
            }else {
                // alert('DeviceMotionEvent is not defined');
                console.log("makarVR.html: requestPermission: DeviceMotionEvent is not defined " );
            }
        }
        //20200102-end-thonsha-add

        //// 準備 vr 需要的 html標籤們
        this.addElementToContainer()

        //// 準備並開始載入場景
        this.load()

    }

    //// 準備 vr 需要的 html標籤們
    addElementToContainer(){

        //// 先開一個容器放html需要的標籤
        const tempElement = document.createElement('div')
        tempElement.setAttribute("id", "tempElement");
        console.log("tempElement", tempElement)


        tempElement.innerHTML = `
            <div id="freeUserWarnDiv">
            <div id = 'freeUserWarnContent'>
                <p id="pUserInfo" >  info  </p>
                <div id = "leaveIframe">
                    返回
                </div>
            </div>
            </div>


            <div style="position: relative; height:100%">
            <div id = "homePage" style = "display: block;">
                <div id = 'homeImageContainer'></div>
            </div>

            <div id = "loadPage">
                <div class="centerText"> 
                    Loading
                    <div class="lds-ellipsis">
                        <div>.</div><div>.</div><div>.</div><div>.</div><div>.</div>
                    </div>
                </div>
            </div>

            <div id = "clickToPlayAudio">
                請點擊畫面來播放聲音
            </div>

            <div id = "clickToUnMuteVideo">
                請點擊來播放影片聲音
            </div>

            <div id = "timerDiv"  style="display: none" >
                <p id = "timerContent" class="centerText"> 答題計時 </p>
            </div>

            <div id = "tipButtonDiv"  style="display: none" >
                <p id = "tipButtonContent" class="centerText"> 提示 </p>
            </div>

            <div id = "tipDiv" class="modal" style="display: none">
                <div id="tipModalContent" class="modal-content" >
                    <div id="tipContentDiv">
                        <p id = "tipContent" class="centerText"> 提示內文 </p>
                    </div>
                    <div id = "tipConfirmButton">
                        <p id = "tipConfirmConetent" class="centerText"> 確認 </p>
                    </div>
                </div>
            </div>

            <div id = "startQuiz" class="modal" style="display: none">
                <div id="QuizModalContent" class="modal-content" >
                    <div id="QuizStartContentDiv">
                        <p id = "QuizStartContent" class="centerText"> 點擊開始問答 </p>
                    </div>
                    <div id = "QuizStartButton">
                        <p id = "QuizstartTitle" class="centerText"> 確認 </p>
                    </div>
                </div>
            </div>

            <div id = "makarDragon" style="display: none">
                <img id = "mdTail" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/tail.png"></img>
                <img id = "mdBody" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/body.png"></img>
                <div id = "leftEye">
                <img id = "leftCloseEye" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/close eyes.png"></img>
                <img id = "leftOpenEye" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/open eyes.png"></img>
                </div>
                <img id = "mdOpenEye2" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/open eyes.png"></img>
                <img id = "mdCloseEye" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/close eyes.png"></img>
                <img id = "mdSign" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/sign.png"></img>

                <img id = "imgRight" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/right.png" style="display: none"></img>
                <img id = "imgWrong" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/wrong.png" style="display: none"></img>

                <img id = "mdRightHand" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/right hand.png"></img>
                <img id = "mdLeftHand" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/MD/left hand.png"></img>
            </div>


            <div id="quizEndDiv" class="blocker" style="display: none">
                <img id ="quizEndImg" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/quiz/bg_quiz_zh.png"></img>
            </div>

            <div id="scoreDiv" class="blocker" style="display: none">
                <img id ="scoreImg" src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/quiz/bg_quiz_score.png"></img>
                <div id = scoreContentDiv>
                    <p id = "scoreContent"> 目前分數 </p>
                </div>
                <div id ="scoreNumDiv">
                    <p id = "score"> 0 </p>
                </div>
            </div>
            </div> 


            <div id = 'gsapEmpty'></div>
            <a href = "tel:666666" id ="phoneCall"></a>
            <a href = "https://www.miflydesign.com" id ="openWebBrowser" target="_blank" ></a>

            <a href="mailto:infomakar@miflydesign.com" id ="sendEmail"></a>
        `


        // //// 把html標籤都用 js 加到頁面上
        // //// 之後把 tempElement 那個用 innerHTML 的改過來 ?
        // function createDivWithIDandAppend(id, parent=document.body){
        //     const element = document.createElement('div')
        //     // element.classList.add('class-name')
        //     element.setAttribute("id", id);
        //     parent.appendChild(element)
        //     return element;
        // }

        // //// html需要的標籤們
        // const ids = ["homePage", "loadPage", "clickToPlayAudio", "clickToUnMuteVideo", "timerDiv", "tipButtonDiv", "tipDiv", "startQuiz", "makarDragon", "quizEndDiv", "scoreDiv"]
        // let tempArray = []
        // // homePage, loadPage, clickToPlayAudio, clickToUnMuteVideo, timerDiv, tipButtonDiv, tipDiv, startQuiz, makarDragon, quizEndDiv, scoreDiv, 
        // ids.forEach(id=>{
        //     tempArray.push( createDivWithIDandAppend(id, tempElement) )
        // })


        // let [ homePage, loadPage, clickToPlayAudio, clickToUnMuteVideo, timerDiv, tipButtonDiv, tipDiv, startQuiz, makarDragon, quizEndDiv, scoreDiv ] = [...tempArray]
        // homePage.style.display = "block"
        // createDivWithIDandAppend("homeImageContainer", homePage)




        // document.body.appendChild(tempElement)
        tempElement.style.width = "100%"
        tempElement.style.height = "100%"
        tempElement.style.position = "relative"
        tempElement.style.zIndex = "5"
        tempElement.style.pointerEvents = "none"

        this.container.appendChild(tempElement)


        const homePage = document.getElementById("homePage")
        homePage.style.display = "block"
        homePage.style.position = "relative"
        homePage.style.top = "0"
        homePage.style.left = "0"
        homePage.style.width = "100%"
        homePage.style.height = "100%"
        homePage.style.objectFit = "cover"

        const homeImageContainer = document.getElementById("homeImageContainer")
        homeImageContainer.style.position = "relative"
        homeImageContainer.style.top = "0"
        homeImageContainer.style.left = "0"
        homeImageContainer.style.width = "100%"
        homeImageContainer.style.height = "100%"
        // homeImageContainer.style.zIndex = "5"
        homeImageContainer.style.pointerEvents = "none"
        
        //// 這個br不應該縮短 當前用 CSSStyleSheet 的做法(css selector)有可能改動到user的頁面
        //// 目前只能想到給他加上 makarSDK_id 之類的方式    (沒有其他方法嗎)
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
            #vrscene {
                cursor: default;
            }

            #freeUserWarnDiv {
                display: none; 
                position: fixed; 
                z-index: 1; 
                left: 0;
                top: 0;
                width: 100%; 
                height: 100%; 
                overflow: auto; 
                background-color: rgba(0,0,0,0.1); 
            
                z-index:3;
                text-align: left;
            }
                    
            #freeUserWarnContent{
                position: absolute;
                top: calc( 50% - 90px );
                left: calc( 50% - 150px);
                width: 300px;
                height: 180px;
            
                background-color: #D9D9D9;
                border-radius: 8px;
            }
            
            @media only screen and (max-width:300px)
            {   
                #freeUserWarnContent{
                top: calc( 50% - 80px );
                left: calc( 50% - 133px);
                width: 266px;
                height: 160px;
                }
            }
            
            #pUserInfo{
                color: black;
                text-align: center;
                font-size: 16pt;
            }
            
            #leaveIframe {
                position: absolute;
                top: 66.66%;
                border-radius: 8px;
                width: 26.66%;
                left: 36.66%;
                background-color:#3973ED;
                z-index: 1;
                padding: 10px;
                text-align: center;
            }
            
            #leaveIframe:active {
                background-color: #274ea1;
            }
            
            #homePage{
                display: block;
                position: relative;
                top:0px;
                width:100%;
                height:100%;
                /* background-color: rgba(128,128,128,0.5); */
                z-index: 1;
                text-align: center;
                font-size: 32pt;
                line-height: 80vh;
                overflow: hidden;
                -webkit-user-select: none;
                user-select: none;
                pointer-events: none;
            }
            
            #loadImg,
            #homeImg{
                width:100%;
                height:100%;
                object-fit: cover;
            }
            
            #loadingImageContainer, #homeImageContainer{
                position: relative;
                top: 0%;
                left: 0%;
                width: 100%;
                height: 100%;
            }
            
            .homePlayImage { 
                position: absolute;
                width: 100%;
                height: 100%;
            
                object-fit: contain;
                display: none;
            }

            .loadingPlayImage.show , .homePlayImage.show {
            display: block;
            }
            
            #clickToPlayAudio , #clickToUnMuteVideo {
                display: none;
                position: absolute;
                top:0px;
                width: 100vw;
                height: 100vh;
                background-color: rgba(128,128,128,0.5);
                z-index: 1;
                text-align: center;
                font-size: 24pt;
                line-height: 90vh;
                overflow: hidden;
                /* -webkit-user-select: none;
                user-select: none;
                pointer-events: none; */
            }
            
            /* 跳轉場景載入頁面 start */
            
            #loadPage{
                display: none;
                position: absolute;
                top:0px;
                width:100vw;
                height:100vh;
                background-color: rgba(128,128,128,0.5);
                z-index: 1;
                text-align: center;
                font-size: 32pt;
                line-height: 80vh;
                overflow: hidden;
                -webkit-user-select: none;
                user-select: none;
                pointer-events: none;
            }
            
            .lds-ellipsis {
                display: inline-block;
                position: relative;
                left: -10px;
                width: 50%;
                height: 20%;
                top:0%;
                font-size: 32pt;
            }
            
            .lds-ellipsis > div {
                position: absolute;
                top: -15px;
                width: 33px;
                height: 33px;
                border-radius: 50%;
                /* background: #000000; */
                animation-timing-function: cubic-bezier(0, 1, 1, 0);
                line-height: 0pt;
            }
            
            .lds-ellipsis img {
                position: absolute;
                top: 0;
                left: 0;
                object-fit: contain;
                width:100%;
                height:100%;
            }
            
            .lds-ellipsis div:nth-child(1) {
                left: 0px;
                animation: lds-ellipsis1 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(2) {
                left: 0px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(3) {
                left: 16px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(4) {
                left: 32px;
                animation: lds-ellipsis2 0.6s infinite;
            }
            .lds-ellipsis div:nth-child(5) {
                left: 48px;
                animation: lds-ellipsis3 0.6s infinite;
            }
            
            @keyframes lds-ellipsis1 {
                0% {
                /* transform: scale(0); */
                opacity: 0;
                }
                100% {
                /* transform: scale(1); */
                opacity: 1;
                }
            }
            @keyframes lds-ellipsis3 {
                0% {
                /* transform: scale(1); */
                opacity: 1;
                }
                100% {
                /* transform: scale(0); */
                opacity: 0;
                }
            }
            @keyframes lds-ellipsis2 {
                0% {
                transform: translate(0, 0);
                }
                100% {
                transform: translate(16px, 0);
                }
            }
            
            /* 跳轉場景載入頁面 end */
            
            
            #homeStartButton{
                display: none;
                position: absolute;
                bottom: 9%;
                border-radius: 100px;
                width: 60%;
                left:20%;
                /* height: 100px; */
                background-color:#1ADAD6;
                z-index: 1;
                padding: 20px;
                text-align: center;
            }
            
            #homeStartP{
                margin:0px;
                font-size: 20px;
                color:white;
            }
            
            /* 留著這個作為提醒: 這樣子會讓user的頁面出現他預期不到的變化*/
            hr {
                position: relative;
                top: 0px;
                left: 0px;
                width: 90%;
                border: 1px solid #4a4d54;
            }
            
            #bottomProjs {
                position:absolute;
                float:left;
                bottom:100px;
                right:0px;
                height:34px;
                width: 120px;
                z-index:2;
                cursor:pointer;
            
                border-top-left-radius: 5px;
                background: rgba(49, 51, 63, 0.85); 
            
                transition: bottom .1s ease-in-out;
                -webkit-transition: bottom .1s ease-in-out;
                -moz-transition: bottom .1s ease-in-out;
            }
            
            #bottomProjs.collapsed {
                bottom:0px;
                right:0px;
                height:34px;
                width: 120px;
            
            }
            
            #bottomProjs h4 {
                text-align: left;
                margin: 1px;
                padding-left: 10px;
            
                color: rgba(200, 200, 200, 1.0);
            }
            
            
            #bottomProjs i {
                border: solid rgba(255, 255, 255, 1.0);
                border-width: 0 3px 3px 0;
                display: inline-block;
                padding: 3px;
            
                transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
            }
            
            #bottomProjs i.collapsed {
                transform: rotate(-135deg);
                -webkit-transform: rotate(-135deg);
            }
            
            #projsInfo {
                position:absolute;
                bottom:0;
                float:left;
                right:0px;
                width:100%;
                height:100px;
                cursor:pointer;
                overflow-x:auto;
                overflow-y:hidden;
                text-align:center;
                z-index:2;
                background: rgba(49, 51, 63, 0.85); 
            
                transition: height .1s ease-in-out;
                -webkit-transition: height .1s ease-in-out;
                -moz-transition: height .1s ease-in-out;
            }
            
            #projsInfo.collapsed {
                height:1px;
            }
            
            #projsTable{
                float: left;
                margin-top: 5px;
                left: 0px;
                position: relative;
                border-spacing: 0px;
            }
            
            #proj_name{
                font-size: 12px;
                color: white;
            }
            
            #leftTopButton {
                position: absolute;
                top: 20px;
                left: 10px;
                cursor:pointer;
                z-index: 2;
            
                user-select: none;
            }
            
            #leftTopButton p {
                color: rgba(200,200,200,1.0);
                font-size: 24px;
                margin: 10px;
            }
            
            #leftTopArrow{
                vertical-align: -10%;
                width:25px;
                height:25px;
            }
            
            .projNameOneRow{
                width:50px;
                text-align: center;
                overflow: hidden;
                white-space : nowrap;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
            }
            
            
            .circular--square {
                border-radius: 50%;
            }
            
            .circular--square-marker {
                
                border-width: 3px;
                border-style: solid;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
            
                border-radius: 50%;
                border-color: rgb(33, 184, 187);
            }
            
            /* The Modal (background) */
            .modal {
                display: none; /* Hidden by default */
                position: fixed; /* Stay in place */
                z-index: 1; /* Sit on top */
                left: 0;
                top: 0;
                width: 100%; /* Full width */
                height: 100%; /* Full height */
                overflow: auto; /* Enable scroll if needed */
                background-color: rgb(0,0,0); /* Fallback color */
                background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
            
                z-index:3;
                text-align: left;
            }
            /* Modal Content/Box */
            .modal-content {
            
                position: relative;
                background-color: #202125;
                margin: 3% auto;
                border-radius: 16px;
                width: 85vw;
                height: 85vh;
                overflow: auto;
            
            }
            
            .modal-content > div {
                position: relative;
                margin-left: 2%;
                margin-right: 2%;
                width: 90%;
            }
            
            #projectTypeDiv{
                position: relative;
                /* width:90%; */
                margin-top: 15px;
                min-height: 30px;
            }
            
            #projectTypeImg{
                position: absolute;
                width:30px;
                height:30px;
                left:5px ;
                /* bottom: 6px; */
            }
            
            #projectTypeInfo{
                position: relative;
                font-size: 12pt;
                color: #8b93a6;
                left:  45px ;
            }
            
            #projectNameDiv{
                position: relative;
                width:95%;
                margin-top: 20px;
            }
            
            #projectNameInfo {
                margin:0px;
                font-size: 14pt;
                color: #ffffff;
            }
            
            #projectUserImage {
                width: 30px;
                height: 30px;
                margin-top: 5px;
                border-radius: 50%;
            }
            
            #projectUserName {
                position: relative;
                top: -12px;
                margin-left: 5px;
                font-size: 9pt;
                color: #8b93a6;
            }
            
            #projectLastUpdateDate {
                position: absolute;
                font-size: 9pt;
                right: 0%;
                top: 40px;
                color: #8b93a6;
            }
            
            #scanList{
                position: relative;
            }
            
            #projectUsageDiv{
                margin-top: 7px;
                position: relative;
            
            }
            
            #projectDescriptionDiv
            {
                margin-top: 5px;
                position: relative;
            }
            
            #scanListTitle,
            #projectUsageTitle,
            #projectDescriptionTitle
            {
                margin-top: 3px;
                font-size: 10pt;
                margin: 0px;
                color: #8b93a6;
            }
            
            #projectUsageInfo{
                color:#ffffff;
                font-size: 8pt;
                margin: 0px;
            }
            
            #projectDescription
            {
                color:#ffffff;
                overflow-y: auto;
                font-size: 8pt;
                margin: 0px;
                height: 40px;
            }
            
            #projectPicture{
                height:100px;
            }
            
            #projectPicture > img {
                margin-top: 3px;
                margin-right: 15px;
                width: 90px;
                height: 90px;
            }
            
            #scanListEndLine{
                display: none;
            }
            
            #projectGPSDiv{
                color:#8b93a6;
                margin-top: 7px;
                position: relative;
                display: none;
                /* margin-bottom: 3px; */
            }
            #projectGPStitle{
                font-size: 10pt;
                margin:2px;
            }
            
            #projectGPSInfo{
                background-color: #4a4d54;
                border-radius:10px;
                padding-left:10px;
                padding-top:3px;
                padding-bottom:3px;
                font-size: 8pt;
                color: rgba(240,240,240,1);
            }
            #projectGPSDivEndLine{
                display: none;
            }
            
            #projectStartButton {
                position: absolute;
                bottom: 10px;
                width: 96%;
                height: 54px;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
                border: 0;
                padding: 0px 0 0 0px;
                background: #31333f;
                cursor: pointer;
            }
            
            #projectStartButton:active {
                background-color: #4a4d54;
            }
            
            #startTitle{
                position: relative;
                top:16px;
                margin: 0px;
                font-size: 12pt;
                left:calc( 25% + 20px  ) ;
                width:50%;
            }
            
            #startBGImage{
                position: absolute;
                width:40px;
                height:40px;
                left:calc(50% - 90px) ;
                bottom: 6px;
            }
            
            /* The Close Button */
            .close {
                color: #aaa;
                /* float: right; */
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
            }
            
            .close:hover,
            .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            } 
            
            
            #timerDiv{
            
                position: absolute;
                top: 15%;
                /* margin-left: 2%; */
                left:calc(50% - 50px) ;
                width: 100px;
                height: 30px;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
                background: #18e2d8de;
                z-index: 1;
            
            }
            
            #tipButtonDiv{
            
                position: absolute;
                top: 20%;
                /* margin-left: 2%; */
                left:calc(50% - 40px) ;
                width: 80px;
                height: 30px;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
                background: #18e2d8de;
                z-index: 1;
                cursor: pointer;
            
            }
            
            #tipContentDiv{
            
                position: absolute;
                top: 20px;
                /* margin-left: 2%; */
            
                width: 96%;
                height: 85%;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
            }
            
            #tipConfirmButton{
            
                position: absolute;
                bottom: 10px;
                /* margin-left: 2%; */
            
                width: 96%;
                height: 54px;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
                border: 0;
                /* 273 = 203 + 45 + 25 */
                padding: 0px 0 0 0px;
                /* background: 203px 34px / 45px 45px no-repeat url(/images/icon/start/start.png),#31333f; */
                background: #31333f;
                cursor: pointer;
                pointer-events:"none";
            }
            
            #tipConfirmButton:active {
                background-color: #4a4d54;
            }
            
            
            #QuizStartContentDiv{
            
                position: absolute;
                top: 20px;
                /* margin-left: 2%; */
            
                width: 96%;
                height: 85%;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
            }
            
            #QuizStartButton{
            
                position: absolute;
                bottom: 10px;
                /* margin-left: 2%; */
            
                width: 96%;
                height: 54px;
                border-radius: 16px;
                color: #ffffff;
                text-align: center;
            
                border: 0;
                /* 273 = 203 + 45 + 25 */
                padding: 0px 0 0 0px;
                /* background: 203px 34px / 45px 45px no-repeat url(/images/icon/start/start.png),#31333f; */
                background: #31333f;
                cursor: pointer;
                pointer-events:"none";
            }
            
            #QuizStartButton:active {
                background-color: #4a4d54;
            }
            
            .centerText {
                margin: 0;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                white-space:nowrap;
            }
            
            .blocker {
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.7);
                z-index: 1;
            }
            
            #quizEndImg{
                position: absolute;
                top:50%;
                left:50%;
                height:80%;
                transform: translate(-50%, -50%);
                z-index: 1;
            
            }
            
            #scoreImg{
                position: absolute;
                top:50%;
                left:50%;
                height:70%;
                transform: translate(-50%, -50%);
                z-index: 1;
            
            }
            
            #scoreContentDiv{
                position: absolute;
                top:60%;
                left:50%;
                width: 100%;
                height: 20%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            
            #scoreContent{
                margin: 0;
                position: absolute;
                top:50%;
                left:50%;
                font-size: 30px;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            
            #scoreNumDiv{
                position: absolute;
                top:33%;
                left:50%;
                width: 50%;
                height: 20%;
                transform: translate(-50%, -50%);
                z-index: 1;
            }
            
            #score{
                margin: 0;
                position: absolute;
                top:50%;
                left:50%;
                font-size: 100px;
                transform: translate(-50%, -50%);
                z-index: 1;
                color: #ffffff;
            }
        `);
        document.adoptedStyleSheets.push(sheet);


    }



    //// 準備並開始載入場景
    load(){
        console.log("\n MakarSDK loading \n", "config=", this.config)


        setTimeout( () => {

            console.log("makarVR.html: document is ready");

            //// 建制「起始載入動畫」
            // let imageBase = 'https://mifly0makar0assets.s3.ap-northeast-1.amazonaws.com/DefaultResource/2D/Loading_20220630/Loading_An000';
            let homeImageContainer = document.getElementById('homeImageContainer');

            // homeImageContainer.style.


            let hicw = homeImageContainer.clientWidth;
            let hich = homeImageContainer.clientHeight;
            let imgW = ( hicw > 210 ) ?  210 : hicw;
            let imgH = ( hich > 240 ) ?  240 : hich;

            console.log('_makarVR.html: hicw h = ', hicw , hich );

            for( let i = 0; i < 30; i++ ){
                let strIndex = '';
                if (i < 10){
                    strIndex = String( '0'+ i ) ;
                }else{
                    strIndex = String( i );
                }
                let imgElement = document.createElement('img');
                //// 調整位置大小
                imgElement.style.top = (hich - imgH)/2 + 'px' ; 
                imgElement.style.left = (hicw - imgW)/2 + 'px' ; 
                imgElement.style.width = imgW + 'px' ;
                imgElement.style.height = imgH + 'px' ;
                
                imgElement.setAttribute('src', this.imageBase + strIndex + '.png' );
                imgElement.classList.add('homePlayImage');
                homeImageContainer.appendChild( imgElement );

            }
            let homePlayImages = document.getElementsByClassName('homePlayImage');
            // console.log(' homePlayImages length ' , homePlayImages.length  );

            this.homeTickOn = true;
            let homeImageCount = 0;
            let playHomeImageTick = () => {

                //// 假如累積播放到最後一張，則記數歸零
                if ( homeImageCount > homePlayImages.length - 1 ){
                    homeImageCount = 0;
                }

                if ( homePlayImages[ homeImageCount ] ){

                    homePlayImages[ homeImageCount ].classList.add('show');

                    if ( homeImageCount > 0 ){
                        homePlayImages[ homeImageCount - 1 ].classList.remove('show');
                    }else{
                        homePlayImages[ homePlayImages.length - 1 ].classList.remove('show');
                    }

                    if ( homeImageCount < homePlayImages.length - 1 ){
                        homePlayImages[ homeImageCount + 1 ].classList.remove('show');
                    }else{
                        homePlayImages[ 0 ].classList.remove('show');
                    }
                }
                // console.log("homeImageCount", homeImageCount)
                homeImageCount++;

                //// 起始畫面，只要載入完成，就不會再使用了
                if ( this.homeTickOn == true ){
                    setTimeout( playHomeImageTick , 50 );
                }
                // requestAnimationFrame(playHomeImageTick); 
                
            }
            playHomeImageTick(); //// 執行

            //// 判斷是 3.4 或 3.5 再呼叫對應的 showVRProjectList()
            showVRProjListWithVersionControl()
            //// 覺得需要有一個return/event/then來得知 "showVRProjListWithVersionControl" 完成了      還需要判斷是ar/xr/vr
            

            //// 在 vr html 裡看到的 好像SDK可以有類似的概念
            // document.getElementById("testButton").onclick = showVRProjList;


            //// 實在找不到哪裡改的
            document.body.style.cursor = "default"
            //// 怎麼改都沒有用阿


            //// 調整html元素在視覺上的位置
            this.container.addEventListener("vrDivReady", (e) => {
                console.log("vrDivReady e=", e)
                document.getElementById("vrDiv").style.top = "-100%"
                
                if(  e.detail.vrDiv ){
                    console.log("vrDivReady vrDiv=", this.vrDiv)
                    this.vrDiv = e.detail.vrDiv
                    
                    //// 場景載入: 接收 vrDiv 傳來的 vrScene 物件載入完成的 custom event
                    this.vrDiv.addEventListener("vrSceneObjsLoaded", (e)=>{
                        console.log("vrSceneObjsLoaded e=", e)
                        const sceneId = e.detail.sceneId

                        let sceneData = this.scenesData.find(s => s.get(sceneId))
                        if( !sceneData ){
                            //// 表示這個場景沒載入過
                            sceneData = new Map([
                                ['sceneId', sceneId],
                                ['sceneObjs3D', new Map()],
                                ['sceneObjs2D', new Map()],
                                ['timelineDict', {}],
                                
                                // ['scene', vrScene],
                            ])
                            this.scenesData.push( sceneData )
                        }
                        this.currentSceneData = sceneData


                        const [sceneObjs3D, sceneObjs2D] = this.getCurrentSceneObjs(sceneData)
                        // console.log("場景物件載入完成, \n sceneObjs3D=", sceneObjs3D, "\n sceneObjs2D=", sceneObjs2D)
                        console.log("場景物件載入完成, \n this.scenesData=", this.scenesData)

                        const vrSceneLoaded = new CustomEvent("vrSceneLoaded", {
                            detail: {
                                name: "vrSceneLoaded",
                                // scene: vrScene
                            },
                        });
                        vrDiv.dispatchEvent(vrSceneLoaded);

                                
                        document.addEventListener('keydown', (event)=>{

                            // 阻止使用AWSD鍵移動
                            if (event.key === 'w' || event.key === 'a' || event.key === 's' || event.key === 'd') {
                                event.stopPropagation();
                            }

                        })
                        

                    })
                }
                
            })
            



        }, 50 );


    }

    //// 讓user可輕鬆取得場景物件  目前規劃為物件都載入後呼叫 getCurrentSceneObjs
    getCurrentSceneObjs(sceneData = this.currentSceneData){

        //// 先試試 array 的寫法
        this.sceneObjs3D_arr = [];
        this.sceneObjs2D_arr = [];
 
        sceneData.set('sceneObjs3D', new Map());
        sceneData.set('sceneObjs2D', new Map());
        
        this.currentActiveController.scenesData.scenes[this.currentActiveController.currentSceneIndex].objs.forEach(jsonObj => {
            if ( jsonObj.res_id != "camera" ) {

                let getObj = this.currentActiveController.getObjectTypeByObj_id( jsonObj.generalAttr.obj_id )
                
                getObj.obj_id = jsonObj.generalAttr.obj_id
                getObj.obj = (getObj.obj_type == "3d") ? getObj.obj.object3D : getObj.obj;
                
                let _sceneObjsMap = (getObj.obj_type == "3d") ? sceneData.get('sceneObjs3D') : sceneData.get('sceneObjs2D');
                _sceneObjsMap.set(getObj.obj_id, getObj);

                let _sceneObjs_arr = (getObj.obj_type == "3d") ? this.sceneObjs3D_arr : this.sceneObjs2D_arr;
                _sceneObjs_arr.push(getObj);

            }
        });

        return [sceneData.get('sceneObjs3D'), sceneData.get('sceneObjs2D')]

        //// todo: 如果user在同一個場景呼叫 直接return結果
    }


    //// ---  準備一些給user自由使用的基本互動功能  ---

    //// 顯示/隱藏物件
    toggleShowHide(sceneObj){
        sceneObj.visible = !sceneObj.visible;
    }

    //// 直接設定物件位置
    setSceneObjPosition(sceneObj, position=[0,2,2]){
        sceneObj.position.set(position[0], position[1], position[2]);
    }

    //// gsap動畫 - 移動物件 到某處 花幾秒
    moveSceneObjTo(sceneObj, position=[0,2,2], duration=2){
        let tl = gsap.timeline();
        this.currentSceneData.get('timelineDict')[ sceneObj.obj_id ] = tl ;
        tl.to(sceneObj.position, {
            'duration': duration,
            'delay': 0, 
            // 'ease': 'none',
            'ease': "elastic.out(1,0.3)",
            'x' : position[0],
            'y' : position[1],
            'z' : position[2]
        });
    }

    //// 翻桌    數值來自經驗法則與視覺效果
    flipTheTable(){
        if(this.currentSceneData){
            this.currentSceneData.get('sceneObjs3D').forEach((objData,i)=>{
                let tl = gsap.timeline();
                this.currentSceneData.get('timelineDict')[ objData.obj_id ] = tl ;
                tl.to(objData.obj.position, {
                    'duration': Math.random()*10,
                    'delay': 0, 
                    'ease': "elastic.out(1,0.2)",
                    'x' : Math.random()*20-10,
                    'y' : Math.random()*20-10,
                    'z' : Math.random()*20+5
                });
                
                let tl_rotation = gsap.timeline();
                tl_rotation.to(objData.obj.rotation, {
                    'duration': Math.random()*10,
                    'delay': 0, 
                    'ease': "power4.out",
                    'x' : Math.random()*20,
                    'y' : Math.random()*20,
                    'z' : Math.random()*20
                });
            })
            
            this.currentSceneData.get('sceneObjs2D').forEach((objData,i)=>{
                let tl = gsap.timeline();
                this.currentSceneData.get('timelineDict')[ objData.obj_id ] = tl ;
                tl.to(objData.obj.position, {
                    'duration': Math.random()*10,
                    'delay': 0, 
                    'ease': "elastic.out(1,0.3)",
                    'x' : Math.random()*1000 - 500,
                    'y' : Math.random()*1000 - 500
                });
                let tl_scale = gsap.timeline();
                tl_scale.to(objData.obj.scale, {
                    'duration': Math.random()*2,
                    'delay': 0, 
                    'ease': "elastic.out(1,0.3)",
                    'x' : CommonTools.gaussianRandom(),
                    'y' : CommonTools.gaussianRandom()
                });
            })
        }
    }


    //// 新增一個function給tick的時候執行
    workWithRenderTick( callbackID, callback ){
        // console.log("makarSDK", this)
        if( typeof(callback)==='function' ){
            // console.log("makarSDK ", callback)
            this.workWithRenderTick_callbacks[callbackID] = callback
        }

        for (const [key, value] of Object.entries(this.workWithRenderTick_callbacks)) {
            // console.log(`${key}: ${value}`);
            value()
        }

        
    }


    //// 先在這裡讓 makarObject 對 BoxObserver 之間是 FlyWieght 模式
    createObserver(obj_id){
        let observer = this.getObserver(obj_id);
        if (observer) {
            return observer;
        } else {
            const newObserver = new BoxObserver(obj_id);
            this.loadedObservers.push(newObserver);
            return newObserver;
        }
    }
    getObserver(obj_id){
        return this.loadedObservers.find(observer => observer.obj_id === obj_id);
    }

    //// 播放動畫: 依照狀態列表 建立"主題, 觀察者們"
    startEventList( stateConfig ){
        
        //// 初始化: 每次都新建一個主題
        const makarSubject = new Subject(stateConfig);
        
        // makarSubject.stateConfig = stateConfig;

        this.makarSubject = makarSubject
        // console.log( "stateConfig.stateNames", stateConfig.stateNames)

        ////

        stateConfig.stateMap.forEach( state => {
            console.log("state", state)
            const objObserver = this.createObserver( state.obj_id );
            makarSubject.attach(objObserver)
            console.log("new objObserver", objObserver)
        })



        // makarSubject.triggerState( stateConfig.stateNames[stateConfig.startIndex] );
        makarSubject.triggerState(stateConfig.startIndex);


    }

}


////  todo: 預想的使用方式 - 使用事件
// dispatch the events
// document.dispatchEvent(window.makarSDK.constructorEvent);

//// 目前user確認頁面載入後 可直接取用 window.makarSDK
const config = { proj_id: "5d6f66e5-1eb8-40c3-8951-558ee450dc34" }
window.makarSDK = new MakarSDK(config)

