
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

    //// 取得「專案資料」
    async getProjectInfoList ( project_ids, login_id ) {

        if ( !Array.isArray( project_ids ) ){
            console.warn( '_getProjectInfoList_: error',  project_ids )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetProjects";
        let data = {
            "login_user_id": login_id,
            // "login_user_id": "06744749-ca64-4918-b713-eaf9d3fa2f7d",
            "project_ids": project_ids,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }


    //// 取得專案列表，舊版本
    async getProjectInfoList_v340 ( project_ids ) {

        if ( !Array.isArray( project_ids ) ){
            console.warn( '_getProjectInfoList_v340_: error',  project_ids )
            return false;
        }

        let specificUrl = this.url + "get_vr_projs_by_proj_id";

        let data = {
            "proj_id_list": project_ids
        }

        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //// 取得使用者專案列表，舊版本 ，目前完全不用
    async getUserPublishProjects_v340 ( _data ) {


        let specificUrl = this.url + "get_usr_publish_projs";

        let data = _data;

        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }


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


    //// 取得場景資料列表，舊版本
    async getProjectSceneList_v340 ( project_ids ) {

        if ( !Array.isArray( project_ids ) ){
            console.warn( '_getProjectSceneList_: error',  project_ids )
            return false;
        }

        let specificUrl = this.url + "get_vr_proj_scene";

        let data = {
            "proj_id": project_ids[0]
        }

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

    //// 取得使用者材質球列表
    async GetUserMaterials ( user_id ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserMaterials_: error',  user_id )
            return false;
        }

        // let specificUrl = this.url + "WebXR/GetUserMaterials";
        let specificUrl = this.url + "Editor/GetUserMaterials";  // webXR還沒接好，先暫用editor
        let data = {
            user_id: user_id,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    async GetUserMaterialsbyID ( user_id, _in_material_ids ) {

        if ( !user_id || typeof(user_id) != 'string' ){
            console.warn( '_getUserMaterials_: error',  user_id )
            return false;
        }

        let material_ids = [];
        if ( Array.isArray( _in_material_ids ) ){
            material_ids = _in_material_ids;
        }

        let specificUrl = this.url + "WebXR/GetUserMaterials";
        let data = {
            user_id: user_id,
            ids: material_ids
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

    //[start-20240305-renhaohsu-add]//
    async getRecordModule( playing_user_id , proj_id ){   
        
        let specificUrl = this.url + "get_record_module";
        let data =  {
            "playing_user_id": playing_user_id,
            "proj_id": proj_id 
        } 
        let result = this.sendPost(specificUrl, data);

        return await result;
    }

    //// 上傳 quiz record 資訊到server，給viewer端檢驗 ，格式看起來和v3.4相比並沒有改變
    async updateRecordModule( data ){
        
        let specificUrl = this.url + "update_record_module";
        let result = this.sendPost(specificUrl, data);
        
        return await result;
    }

	////// 上傳集點卡紀錄至雲端資料庫
    async pointCardLog(data){
        let specificUrl = this.url + "point_card_log";
        return this.sendPost(specificUrl, data);
    }

	//// 上傳 quiz log資訊到server，給數據分析使用 
    async quizLog(data){
        let specificUrl = this.url + "quiz_log";
        return this.sendPost(specificUrl, data);
    }
    //[end-20240305-renhaohsu-add]//
    
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

export default net;

