
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
            "project_ids": project_ids,
        };
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

    


}

const net = new NetworkAgent();

export default net;

