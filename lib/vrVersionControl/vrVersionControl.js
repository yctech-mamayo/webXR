/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/VRMain/networkAgent.js":
/*!***********************************!*\
  !*** ./js/VRMain/networkAgent.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

//// v3.5.0 修改 「網路相關功能」。

class NetworkAgent {

    constructor(){

        // this.url = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/";
        this.url = "https://test1.makar.app/Makar/"; // local test V3 makar server.

        //// 上一層基本上是「 next 框架 」，「 專案頁面 」「首頁」「內嵌頁面」都有可能。 取得「 MAKAR Server Url 」 來同步雲端資料。
        if ( typeof( parent ) == 'object' && parent.serverUrl ){
            // console.log(' _MakarServerApi_serverside: ' , process.env.serverUrl );
            this.url = parent.serverUrl;
        }

        //// 網頁版本：比照 四碼 辦理
        this.webVersion = '3.5.0.0';
        
        //[start-20230927-howardhsu-add]//
        //// for version 3.4.0 
        this.url_v340 = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/";
        this.webVersion_v340 = '3.0.0';
        //[end-20230927-howardhsu-add]//
    }

            
    sendPost(destination, dataObject) {
        // Reference: https://developers.google.com/web/fundamentals/primers/promises?hl=zh-tw

        let self = this;

        return new Promise(function(resolve, reject) {

            let request = {
                ver: self.webVersion,
                cid: 5,
                data: dataObject
            };
            
            fetch( destination, {
                body: JSON.stringify( request ),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                mode: 'cors', // no-cors, cors, *same-origin  
            }).then( res => res.json() ).then(function( response ){

                setTimeout( function(){
                    resolve( response );
                }, 1 ) 

            })
        });
    }


    //// 使用範例

    async getTest(user_id, info_keys = [] ) {
        let specificUrl = this.url + "get_test";
        let data = {
          user_id: user_id,
          wanted_info_keys: info_keys
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// v3.5.0 新版使用 api

    //// 依照關鍵字搜尋作者
    //// 依照關鍵字搜尋專案


    //// 取得場景資料列表
    async getProjectSceneList ( project_ids ) {

        if ( !Array.isArray( project_ids ) ){
            console.warn( '_getProjectSceneList_: error',  project_ids )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetProjectSceneList";
        let data = {
            project_ids: project_ids,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得辨識圖資料列表
    async getTargetList ( target_ids ) {

        if ( !Array.isArray( target_ids ) ){
            console.warn( '_getTargetList_: error',  target_ids )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetTargetList";
        let data = {
            target_ids: target_ids,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者資料
    async getUserInfo ( user_id ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserInfo_: error',  user_id )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetUserInfo";
        let data = {
            user_id: user_id,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者線上素材庫物件
    async getUserOnlineResources ( user_id ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserOnlineResources_: error',  user_id )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetUserOnlineResources";
        let data = {
            user_id: user_id,
            language: ''
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者已發佈專案資料
    async getUserPublishedProjects ( user_id , _in_proj_type ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserPublishedProjects_: error',  user_id )
            return false;
        }

        //// 可以選擇「請求 專案類型」
        let proj_type = [];
        if ( Array.isArray( _in_proj_type ) ){
            proj_type = _in_proj_type;
        }

        let specificUrl = this.url + "WebXR/GetUserPublishedProjects";
        let data = {
            user_id: user_id,
            proj_type: proj_type
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者上傳素材
    async getUserResources ( user_id ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserResources_: error',  user_id )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetUserResources";
        let data = {
            user_id: user_id,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者辨識圖資料列表
    async getUserTargetList ( user_id ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserTargetList_: error',  user_id )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetUserTargetList";
        let data = {
            user_id: user_id,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }


    //// 以下為「 3.4.0 以前版本 」

    //[start-20230927-howardhsu-add]//
    //// sendPost ver.3.4.0以前，與sendPost不同的只有request.ver的值 
    sendPost_v340(destination, dataObject, ver=self.webVersion_v340) {
        // Reference: https://developers.google.com/web/fundamentals/primers/promises?hl=zh-tw

        let self = this;

        return new Promise(function(resolve, reject) {

            let request = {
                ver: ver,
                cid: 5,
                data: dataObject
            };
            
            fetch( destination, {
                body: JSON.stringify( request ),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                mode: 'cors', // no-cors, cors, *same-origin  
            }).then( res => res.json() ).then(function( response ){

                setTimeout( function(){
                    resolve( response );
                }, 1 ) 

            })
        });
    }

    ////  ver. 3.4.0 取得使用者資料
    async getUserInfo_v340 ( user_id, wanted_info_keys = [] ){

        let specificUrl = this.url_v340 + "get_one_usr_info";
        let data = {
            "user_id": user_id,
            "wanted_info_keys": wanted_info_keys
        }
        let result = this.sendPost_v340(specificUrl, data);

        return await result;
    }

    //// ver. 3.4.0 舊稱 getUsrOnlineRes 取得使用者線上素材庫物件 
    async getUserOnlineResources_v340 ( user_id, main_type, sub_type, category ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserOnlineResources_v340_: error, user_id=',  user_id )
            user_id = "fefe";
            // return false;    //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
        }
        if ( !main_type || typeof(main_type) != 'string' ){
            console.warn( '_getUserOnlineResources_v340_: error, main_type=',  main_type )
            main_type = "";
            // return false;
        }
        if ( !sub_type || typeof(sub_type) != 'string' ){
            console.warn( '_getUserOnlineResources_v340_: error, sub_type=',  sub_type )
            sub_type = "";
            // return false;
        }
        if ( !category || typeof(category) != 'string' ){
            console.warn( '_getUserOnlineResources_v340_: error, category=',  category )
            category = "";
            // return false;
        }

        let self = this
        let specificUrl = this.url_v340 + "get_usr_online_res";
        let data = {
            "user_id": user_id , //miflytest
            "main_type": main_type , // ar, vr 
            "sub_type": sub_type ,
            "category": category 
        };

        let result = self.sendPost_v340(specificUrl, data).then(response => {
            return self._createOnlineResDictFromResList(response.data.online_res_list)
        })
    
        return await result;
    }
    
    //// ver. 3.4.0 搭配 getUserOnlineResources_v340 使用
    _createOnlineResDictFromResList = (userOnlineResList) => {
        return new Promise((resolve, reject) => {            
            // console.log(userOnlineResList)         

            if (!userOnlineResList) resolve(-1);
            let userOnlineResDict = {};
            for (let i = 0; i < userOnlineResList.length; i++ ){
                // console.log(userOnlineResList[i].res_id)
                userOnlineResDict[ userOnlineResList[i].res_id ] = userOnlineResList[i];

                if ( i == userOnlineResList.length-1 ){
                    console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userOnlineResList.length ); // Object.keys(userARResDict).length
                    resolve( userOnlineResDict );            
                }
            }
            // window.userOnlineResDict = userOnlineResDict;

            //// 看起來在 userOnlineResList 是 {} 的情況下沒有 resolve
            //// 那要 reject 嗎? 反正也只是 console列印出來?
            if( Object.keys(userOnlineResList).length === 0){
                console.log('reject')
                reject("userOnlineResList.length is 0")
            }

        })
    }

    //// ver. 3.4.0 舊稱 getResByUserID 取得使用者上傳素材
    async getUserResources_v340 ( user_id, main_type, sub_type ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserResources_v340_: error, user_id=',  user_id )
            user_id = "makarvr"
            // return false;    //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
        }
        if ( !main_type || typeof(main_type) != 'string' ){
            console.warn( '_getUserResources_v340_: error, main_type=',  main_type )
            main_type = ""
            // return false;
        }
        if ( !sub_type || typeof(sub_type) != 'string' ){
            console.warn( '_getUserResources_v340_: error, sub_type=',  sub_type )
            sub_type = ""
            // return false;
        }

        let self = this
        let specificUrl = this.url_v340 + "get_res";
        let data = {
            "user_id": user_id , //miflytest
            "main_type": main_type , // ar, vr 
            "sub_type": sub_type 
        }
        let result = self.sendPost_v340(specificUrl, data).then(response => {
            console.log(353, response.data.list)
            return self._createProjResDictFromResList(response.data.list)
        })
    
        return await result;
    }

    //// ver. 3.4.0 搭配 getUserResources_v340 使用
    _createProjResDictFromResList = (userResList) => {
        return new Promise((resolve, reject) => {
            
            if (!userResList) resolve(-1);
    
            let userProjResDict = {};
            for (let i = 0; i < userResList.length; i++ ){
                userProjResDict[ userResList[i].res_id ] = userResList[i];
    
                if ( i == userResList.length-1 ){
                    console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userResList.length ); // Object.keys(userARResDict).length
                    resolve(userProjResDict)
                }
            }
    
        })
    }

    
    //// ver. 3.4.0 給定[ ProjId₀, ProjId₁ , ... ] 取得VR專案資料
    async getVRProjsByProjId_v340 (projIDList){       

        let specificUrl = this.url_v340 + "get_vr_projs_by_proj_id";
        let data = {
            "proj_id_list": projIDList
        };
        let result = this.sendPost_v340(specificUrl, data);

        return await result;
	}

    //// ver. 3.4.0 get_vr_proj_scene
    async getVRProjScene_v340(user_id, proj_id){

        let specificUrl = this.url_v340 + "get_vr_proj_scene";
        let data = {
            "user_id": user_id,
            "proj_id": proj_id
        };
        let result = this.sendPost_v340(specificUrl, data);

        return await result;	
    }

    //// 改寫自 ver. 3.4.0 networkAgent 的 getUserPublishProjsByUserID
    async getUserPublishProjsByUserID_v340 ( user_id, main_type, sub_type ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserPublishProjsByUserID_v340_: error, user_id=',  user_id )
            user_id = "makarvr"
            // return false;    //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
        }
        if ( !main_type || typeof(main_type) != 'string' ){
            console.warn( '_getUserPublishProjsByUserID_v340_: error, main_type=',  main_type )
            main_type = ""
            // return false;
        }
        if ( !sub_type || typeof(sub_type) != 'string' ){
            console.warn( '_getUserPublishProjsByUserID_v340_: error, sub_type=',  sub_type )
            sub_type = ""
            // return false;
        }    
        
        //// for V3 server and Editor
		if ( window.serverVersion == "3.0.0"){

            let userProjResDict = this.getUserResources_v340(user_id)

            let userOnlineResDict = this.getUserOnlineResources_v340(user_id)

            let userPublishProjs = this.getUsrPublishProjs_v340(user_id).then(response => {
                window.userPublishProjs = response.data
                return  response.data
            })       

            return await Promise.all( [userPublishProjs, userProjResDict, userOnlineResDict] );
        }

        else {
            //// 要reject嗎?
            return Promise.reject(new Error(`_getUserPublishProjsByUserID_v340_:\n serverVersion= ${serverVersion}`))
        }
        // return await result;
    }

    //// ver. 3.4.0 的 getUserPublishProjsByUserID_v340 會用到它
    async getUsrPublishProjs_v340(user_id){

        let specificUrl = this.url_v340 + "get_usr_publish_projs";
        let data = {
			"user_id": user_id,
			'web_ar': true,
		}
        let result = this.sendPost_v340(specificUrl, data);
        
        return await result;
    }

    //// ver. 3.4.0 getNewestPublishProjs
    async getNewestPublishProjs_v340( proj_type ){

        if ( !proj_type || typeof(proj_type) != 'string' ){
            console.warn( '_getNewestPublishProjs_v340_: error, proj_type=',  proj_type )
            proj_type = "vr"
            // return false;    //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
        }
        let specificUrl = this.url_v340 + "get_newest_publish_projs";
        let data = {
            "proj_type": proj_type,
        }
        let result = this.sendPost_v340(specificUrl, data);

        return await result;
    }

    async readTextFile_v340(fileUrl) {

        return new Promise(function(resolve, reject) {
            fetch( fileUrl, {
                method: 'GET',
                cache: 'no-cache',
                credentials: 'same-origin',
                mode: 'cors', // no-cors, cors, *same-origin  
            }).then( res => res.json() ).then(function( response ){

                setTimeout( function(){
                    resolve( response );
                }, 1 ) 

            })
        }); 
	}

    //// ver. 3.4.0 getViewerConfig
    async getViewerConfig_v340(){

        let specificUrl = this.url_v340 + "get_viewer_config";
        let data = {}
        let result = this.sendPost_v340(specificUrl, data, "3.1.1");

        return await result;
    }

    //// ver. 3.4.0 getARProjsByProjID
    async getARProjsByProjID_v340( projIDList ){
        
        //// 因為 networkAgent 3.4.0 有檢查這個 但我覺得檢查isArray已足矣
        // if ( !projIDList || typeof(projIDList) != 'object' ){
        //     console.warn( '_getARProjsByProjID_v340_: error, projIDList=',  projIDList )
        //     return false;
        // }  
        if (  !projIDList || !Array.isArray(projIDList) ){
            console.warn( '_getARProjsByProjID_v340_: error, projIDList=',  projIDList )
            return false;
        }
        if ( projIDList.length < 1 ){
            console.warn( '_getARProjsByProjID_v340_: error, projIDList=',  projIDList )
            return false;
        }

        let specificUrl = this.url_v340 + "get_ar_projs_by_proj_id";
        let data = {
            "proj_id_list": projIDList
        }
        let result = this.sendPost_v340(specificUrl, data);

        return await result;
    }

  
    //// ver. 3.4.0 getVRSceneByUserID
    async getVRSceneByUserID_v340( user_id ){
        
        if ( !user_id || typeof(user_id) != 'object' ){
            console.warn( '_getVRSceneByUserID_v340_: error, user_id=',  user_id )
            user_id = "makarvr"
            // return false;  //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
        }  

        let self = this;
        let VRSceneResult = [];
		VRSceneResult.user_id = user_id;

        let result;
        
        if (serverVersion == "3.0.0"){
			// console.log("networkAgent.js: getVRSceneByUserID 22: ");
			var main_type = "";
			var sub_type = "";

            var getUserPublishProjsCallback = function(userPublishProjs, userProjResDict , userOnlineResDict){
				console.log("networkAgent.js: getVRSceneByUserID_v340: _getUserPublishProjsByUserID: userPublishProjs=", userPublishProjs);
                
                //// source: networkAgent 3.4.0 629行
                if ( typeof(userPublishProjs) != "string" ){

                    //// 
                    let projIDList = [];
                    for (let i in userPublishProjs.proj_list){
						if (userPublishProjs.proj_list[i].proj_type == "vr"){
                            //[start-20200522-fei0095-add]//
							//// 判斷只有在 editor 勾選「開啟網頁展示」的專案會顯示。為了不造成顯示錯誤，統一由 interface 控管
							if (parent.useEditorWebTag){
								if ( !userPublishProjs.proj_list[i].proj_platform.find( item => item == "web") ){
									continue;
								}
							}
                            //[end---20200522-fei0095-add]//
							projIDList.push( userPublishProjs.proj_list[i].proj_id  );
						}
					}
                    
                    self.getVRProjsByProjId_v340(projIDList).then( response => {
                        let publishVRProjs = response.data;
						window.publishVRProjs = publishVRProjs;

                        let count = 0;
						if ( publishVRProjs.result ){
							if ( publishVRProjs.result.length ){
								for (let j = 0; j < publishVRProjs.result.length; j++ ){	

                                    self.getVRProjScene_v340( publishVRProjs.result[j].user_id, publishVRProjs.result[j].proj_id ).then( response => {
										count++;
                                        // console.log("networkAgent.js: get_vr_proj_scene: onload, response=", response );
										VRSceneResult[j] = response.data;
                                        
                                        if ( count == publishVRProjs.result.length ){
											// console.log("%cnetworkAgent.js: get_vr_proj_scene: onload, save VRSceneResult ", "color:red", count );
											window.VRSceneResult = VRSceneResult;
											window.userProjResDict = userProjResDict;
											window.userOnlineResDict = userOnlineResDict;

											return VRSceneResult;
										}
                                    })

								}
							}
						}
                    })  
                }
            };

            self.searchUserIDByUserID_v340( user_id ).then( res => {
                for (let userID in  res.data.result ){
                    if ( user_id.toLowerCase() === res.data.result[userID].user_id.toLowerCase()  ){
                        console.log("networkAgentVR.js: _searchUserIDByUserID: match, replace from [" , user_id , "] to [", res.data.result[userID].user_id, "]"  );
                        user_id = res.data.result[userID].user_id;
                    }
                }            

                return self.getPayInfoByUserID_v340(user_id)
    
            }).then(userPayInfo => {                
            
                let userIDWhiteListUrl = 'https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/web_white_list/webVR_UserID_WhiteList.txt';
            
                return Promise.all([userPayInfo, self.readTextFile_v340(userIDWhiteListUrl)]); 
            
            }).then( ([userPayInfo, jsonObj])  => {
                // console.log("readTextFile_v340, userPayInfo=", userPayInfo)
                // console.log("readTextFile_v340, jsonObj=", jsonObj)
                
                let userIDList = jsonObj["customizedUserID"]["list"];
                let nameList = [];
                for (let i = 0; i < userIDList.length; i++){
                    nameList.push(userIDList[i]["name"]);
                }
                let isInNameList = (nameList.indexOf(user_id.toLowerCase() ) > -1);
            
                if (userPayInfo.data){
                    console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: userPayInfo =", userPayInfo.data );
            
                    ////// 改為使用 web_ar 這個 key 來判斷是否可以體驗，基本上 free 用戶 一定是 false, 而註冊送的一個月用戶也是 false, proA/B/C是true
                    ////// 假如在 白名單列表裡面，直接設定為可以使用
                    ////// 後續有一狀況，假如用戶本身為不可使用，但是透過 license 發出的專案卻需要判定可用，需要額外判斷。固在此無條件往下執行。
                    window.allowedMakarIDUseWeb = userPayInfo.data.web_ar || isInNameList ;
            
                    if ( userPayInfo.data.user_type == 'proA' || userPayInfo.data.user_type == 'proB' || userPayInfo.data.user_type == 'proC' || userPayInfo.data.user_type == 'custom' ){
                        window.allowedMakarIDUseWeb = true;
                    }
                    
                    // self.getUserPublishProjsByUserID( user_id, main_type, sub_type, getUserPublishProjsCallback );
                    self.getUserPublishProjsByUserID_v340( user_id, main_type, sub_type ).then( ([userPublishProjs, userProjResDict, userOnlineResDict]) => {
                        result = getUserPublishProjsCallback(userPublishProjs, userProjResDict , userOnlineResDict)
                    })
            
                }else{
                    console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: error, userPayInfo=", userPayInfo );	
                    // if(callback) callback("this ID <br> [" + user_id + "] <br> user data error, please contact MIFLY for more information. ");
                    reject("this ID <br> [" + user_id + "] <br> user data error, please contact MIFLY for more information. ");
                }
                
            })
            
        }
        
        return await result;
    }

  
    //// ver. 3.4.0 getPayInfoByUserID
    async getPayInfoByUserID_v340( user_id ){
        
        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getPayInfoByUserID_v340_: error, user_id=',  user_id )
            return false;
        }  
        let specificUrl = this.url_v340 + "get_pay_info";
        let data = {
            "user_id": user_id
        }
        let result = this.sendPost_v340(specificUrl, data);

        return await result;
    }

    //// ver. 3.4.0 取得 license 相關的訊息 getELicenseInfo
    async getELicenseInfo_v340( license_key ){
        
        if ( !license_key || typeof(license_key) != 'string' ){
            console.warn( '_getELicenseInfo_v340_: error, license_key=',  license_key )
            return false;
        }  
        let specificUrl = this.url_v340 + "get_e_lice_info";
        let data = {
            "license_key": license_key
        }
        let result = this.sendPost_v340(specificUrl, data, '3.1.1');

        return await result;
    }

    //// 需要先寫好 userPublishProjs 才能往下
    ////// 檢查各專案是否帶有 lisence 
	// window.checkLicenseInProjs =

    //// ver. 3.4.0 從server 取得模組專案資訊
    async getRecordModule_v340( playing_user_id , proj_id ){
        
        let specificUrl = this.url_v340 + "get_record_module";
        let data =  {
            "playing_user_id": playing_user_id,
            "proj_id": proj_id 
        } 
        let result = this.sendPost_v340(specificUrl, data, '3.1.1');

        //// 此函示尚未測試
        //// 暫時在專案裡找不到 playing_user_id (在VR看來是在localStorage，但搜尋不到 setItem("login_shared_id") 的段落)
        console.log("networkAgentVR.js: _getRecordModule: ret" , ret );

        return await result;
    }

    //// ver. 3.4.0 上傳 quiz log資訊到server，給數據分析使用 
    async quizLog_v340( data ){
        
        let specificUrl = this.url_v340 + "quiz_log";
        let result = this.sendPost_v340(specificUrl, data, '3.1.1');
        
        return await result;
    }
    
    //// ver. 3.4.0 上傳 quiz record 資訊到server，給viewer端檢驗 
    async updateRecordModule_v340( data ){
        
        let specificUrl = this.url_v340 + "update_record_module";
        let result = this.sendPost_v340(specificUrl, data, '3.1.1');
        
        return await result;
    }    
    
    //// ver. 3.4.0 getVRDataByUserID
    //// 這個 getVRDataByUserID 函式在makar-web-xr裡搜尋找不到在哪裡被呼叫，
    //// 而用 postman 測試API網址會not found 因此這整段code並沒有測試過
    // async getVRDataByUserID_v340( user_id ){
        
    //     if ( !user_id || typeof(user_id) != 'string' ){
    //         console.warn( '_getVRDataByUserID_v340_: error, user_id=',  user_id )
    //         user_id = "makarvr"
    //         // return false;    //// 依照 3.4.0 以前的 neworkAgent 的內容 這裡似乎就讓它通過?
    //     }  

    //     let destination = this.url_v340

    //     return new Promise(function(resolve, reject) {
            
    //         let data = {
    //             "user_id": user_id,
    //             "cid": "20"
    //         }                   
    //         let strData = JSON.stringify(data);
    //         //// the formData
    //         let FD  = new FormData();
    //         FD.append("cmd", "get_vr_projs");	 
    //         FD.append("data", strData );
            
    //         fetch( destination, {
    //             body: FD,
    //             method: 'POST',
    //             cache: 'no-cache',
    //             credentials: 'same-origin',
    //             mode: 'cors', // no-cors, cors, *same-origin  
    //         }).then( res => res.json() ).then(function( response ){

    //             //// MAKAR "will" all use gzip compress the text as soon as We can(?)
    //             if (response.diaoyurar ){
    //                 // console.log("networkAgent.js: getVRDataByUserID: response.diaoyurar ");

    //                 let jsonData =  parseDiaoyurar(response.diaoyurar);
    //                 if (!jsonData.error){
    //                     if (jsonData.data){
    //                         userVRData = jsonData.data;
    //                         //// save the userVRData in window  
    //                         if (!window.userVRData){
    //                             console.log("networkAgent.js: getVRDataByUserID: save window.userARData ");
    //                             window.userVRData = userVRData; 
    //                         }else{
    //                             console.log("networkAgent.js: getVRDataByUserID: window.userARData already exist, replace it..");
    //                             window.userVRData = userVRData; 
    //                         }
    //                         // if (callback) callback(userVRData);                             
    //                         setTimeout( function(){
    //                             resolve( response );
    //                         }, 1 )

    //                     }else{
    //                         // if (callback) callback("networkAgent.js:getVRDataByUserID:error: no jsonData.data"); 
    //                         reject("networkAgent.js:getVRDataByUserID:error: no jsonData.data")
    //                     }

    //                 }else{
    //                     // if (callback) callback( jsonData.error ); 
    //                     console.log("networkAgent.js: getVRDataByUserID: oops something wrong:", jsonData.error);
    //                     reject(jsonData.error)
    //                 }

    //                 // console.log(jsonData);
    //             }else{
    //                 // console.log("networkAgent.js: getVRDataByUserID: not response.diaoyurar ", response);

    //                 if (!response.error){
    //                     if (response.data){
                            
    //                         userVRData = response.data;

    //                         // console.log("networkAgent.js:getVRDataByUserID: onload, response=", response );
                            
    //                         //// save the userVRData in window
    //                         if (userVRData.proj_list) {

    //                             if (!window.userVRData){
    //                                 console.log("networkAgent.js: getVRDataByUserID: save window.userARData =", userVRData);
    //                                 window.userVRData = userVRData; 
    //                             }else{
    //                                 console.log("networkAgent.js: getVRDataByUserID: window.userARData already exist, replace it..");
    //                                 window.userVRData = userVRData; 
    //                             }
        
    //                             // if (callback) callback(userVRData);
    //                             setTimeout( function(){
    //                                 resolve( response );
    //                             }, 1 )

    //                         }else{
    //                             console.log("%cnetworkAgent.js:getVRDataByUserID: onload, fail userVRData.proj_list is empty", "color:red" );
    //                             // if (callback) callback("the userVRData.proj_list is empty");
    //                             reject("the userVRData.proj_list is empty")
    //                         }
                        

    //                     }else{
    //                         // if (callback) callback("networkAgent.js:getVRDataByUserID:error: no response.data"); 
    //                         reject("networkAgent.js:getVRDataByUserID:error: no response.data")
    //                     }
    //                 }else{
    //                     // if (callback) callback( response.error ); 
    //                     console.log("networkAgent.js: getVRDataByUserID: oops something wrong:", response.error);
    //                     reject(response.error)
    //                 }
    //             }


    //         })
    //     });

    // }

    //// ver. 3.4.0 uploadDataToServer
    //// 這個 uploadDataToServer 函式在makar-web-xr裡搜尋找不到在哪裡被呼叫，data 內的資料暫時不知怎麼給 
    ////  因此這整段code並沒有測試過
    // async uploadDataToServer_v340( index ){
        
	// 	if ( serverVersion == "3.0.0"){
    //         let specificUrl = this.url_v340 + "add_scan_times";
    //         let data = {
    //             "user_id": userARData.user_id,
    //             "target_id": userARData.proj_list[index].target_id // 1545795389.8544426.1988048228
    //         }
    //         let result = this.sendPost_v340(specificUrl, data);
            
    //         return await result;
    //     } 
        
	// 	if ( serverVersion == "2.0.0"){
	// 		let strData = JSON.stringify(data);
	// 		let FD  = new FormData();
	// 		FD.append("cmd", "add_scan_times");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
	// 		FD.append("data", strData );

    //         fetch( destination, {
    //             body: FD,
    //             method: 'POST',
    //             cache: 'no-cache',
    //             credentials: 'same-origin',
    //             mode: 'cors', // no-cors, cors, *same-origin  
    //         }).then( res => res.json() ).then(function( response ){    
	// 			console.log("networkAgent: uploadDataToServer, response.data = ", response.data );
    //             resolve(response.data)
	// 		})

	// 	}
    // }        

    //// ver. 3.4.0 searchUserIDByUserID 
    async searchUserIDByUserID_v340( user_id ){
        
        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_searchUserIDByUserID_v340_: error, user_id=',  user_id )
            return false;
        }  
        let specificUrl = this.url_v340 + "get_many_usr_info_keyword";
        let data =  {
			"keyword": user_id,
			"search_keys": ["user_id"]
        } 
        let result = this.sendPost_v340(specificUrl, data);
        
        return await result;
    }

    //[end-20230927-howardhsu-add]//
    


}

const net = new NetworkAgent();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (net);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".vrVersionControl.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "vr:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkvr"] = self["webpackChunkvr"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./js/VRMain/vrVersionControl.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _networkAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./networkAgent.js */ "./js/VRMain/networkAgent.js");


( () => {

    // get publishVRProjs and VRSceneResult for version control
    // 進行版本判斷 (3.4 or 3.5)
    // 用 js ESM 動態 import 
    window.showVRProjListWithVersionControl = () => {
        
        //// 目前 3.5.0 的版本測試比較麻煩 ， 包含「載入專案」「載入場景」「載入使用者素材」
        //// 所以必須連同 專案資料 一起修改
        let useVer35;
        useVer35 = true;
        // useVer35 = false;
        if ( useVer35 && parent && parent.selectedProject ){
            parent.selectedProject[ 'user_id' ] = '76ad6ef7-e89e-4f35-9c8d-0f40617f64a1';
            parent.selectedProject[ 'proj_id' ] = 'f6eb806f-2c97-443b-bc44-ce8df1740ae0';
        }

        //[start-20231018-howardhsu-modify]//        
        //// 取得 projIDList 裡的每個 proj_id 對應的資料 (networkAgentVR 新增 getVRProjsByProjId)
        //// 這裡只傳入當前專案的 proj_id
        getVRProjsByProjId( window.serverUrl, [parent.selectedProject.proj_id]).then(async (data) => {
            // console.log("data", data.result[0].editor_ver)
            let editor_version_arr = data.result[0].editor_ver.split('.')

            //// 假裝現在是 ver. 3.5
            if ( useVer35 ){
                editor_version_arr = [3,5,0]
            }
            
            if(editor_version_arr[0]>=3 && editor_version_arr[1]>=5 ){
                console.log("vrVersionControl: editor_version_arr=", editor_version_arr)
                
                // js dynamic import                           
                await __webpack_require__.e(/*! import() */ "js_VRMain_version3_5_VRFunc_js").then(__webpack_require__.bind(__webpack_require__, /*! ./version3_5/VRFunc.js */ "./js/VRMain/version3_5/VRFunc.js"));    

                //// 呼叫 3.5 的 showVRProjList()    
                showVRProjList();      
            }
            else{
                console.log("vrVersionControl: 不是 ver. 3.5 editor_version_arr=", editor_version_arr)
                await __webpack_require__.e(/*! import() */ "js_VRMain_version3_4_VRFunc_js").then(__webpack_require__.bind(__webpack_require__, /*! ./version3_4/VRFunc.js */ "./js/VRMain/version3_4/VRFunc.js"));    
                // await import("../../lib/testWebpack/VRFunc.min.js");    

                //// 呼叫 3.4 的 showVRProjList()    
                showVRProjList();      
            }

        })

        
        //// 參考ver. 3.5 AR混和專案的做法
        //// 但
        //// 要打 API 才能取得 editor_ver 來判斷 3.4 or 3.5
        //// 但是 3.5 API 目前似乎是拿不到 3.4 的資料
        //// 就卡住:  "要用editor_ver來判斷要扣3.4或3.5的API，但沒打API之前不知道editor_ver"
        
        //// source: arVersionControl
        // console.log(' __startARWithVersionControl__ ');
        console.log(' __showVRProjListWithVersionControl__ ');

        let pList = [];
        if ( parent && parent.selectedProject && parent.selectedProject.proj_id ){
            pList.push( parent.selectedProject.proj_id );

            //// 假設目前是 ver. 3.5 且 新API能取得ver. 3.4的資料
            if(useVer35){
                //// 在這裡參考混和專案

            } else {
                //// 原本的東西
                //// 可以推測 當新API能取得ver. 3.4的資料時，就能棄用這裡

            }

            // let pScenes = net.getProjectInfoList( pList );
            let pScenes = _networkAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"].getVRProjsByProjId_v340( pList );
            pScenes.then( async function( ret ){

                console.log(' _pScenes_: ' , ret );
                // if ( ret && ret.data && Array.isArray( ret.data.projects ) &&
                //     ret.data.projects.length == 1
                // )
                if ( ret && ret.data && Array.isArray( ret.data.result ) &&
                    ret.data.result.length == 1
                ){
                    let oneProjData = ret.data.result[0];                    
                    // let vo = VC.getProjDataEditorVer( oneProjData );

                    console.log("__showVRProjListWithVersionControl__", oneProjData.editor_ver)
                }

            })
        }



        //[end-20231018-howardhsu-modify]//
    }

})();
})();

/******/ })()
;