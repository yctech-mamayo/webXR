//// howardhsu 試著參考 networkAgentVR 
//// 把 _getResByUserID、_getUsrOnlineRes 兩函式和它會用到的callback 寫成了 promise 的方式

//// 已確認可實際取得 userProjResDict、userOnlineResDict
//// 在79行、187行 
//// 但後來沒用到
console.log('getRes')

const _getResByUserID = (url, user_id, main_type, sub_type) => {
    return new Promise((resolve, reject) => {
  
        /* stuff using url, user_id, main_type, sub_type, */
        let specificUrl = url+"get_res";
        let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
        let data = {
            "user_id": user_id , //miflytest
            "main_type": main_type , // ar, vr 
            "sub_type": sub_type 
        }
        let request = {
            "ver":"3.0.0",
            "cid": 5,
            "data":data
        };
        let jsonReq = JSON.stringify(request);
        xhr.open( 'POST', specificUrl , true );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json' 

        xhr.onload = function() {
            if ( xhr.response.error ){

                console.log('%cnetworkAgent: _getResByUserID,  onload error ', 'color:red', xhr.response );  //// color: #bada55
                reject( xhr.response.error );

            }else{
                console.log('%cnetworkAgent: _getResByUserID,  onload save ', 'color:blue', xhr.response.data.list );  //// color: #bada55
                
                if ( xhr.response.data.list.length > 0 ){
                   
                    resolve(xhr.response.data.list)

                }else{
                    console.log('networkAgent: _getResByUserID,  onload  use res is empty ' );  //// color: #bada55
                    resolve( {} )  // "use res is empty"
                }
    
            }
    
        }

        xhr.onerror = function(err) {
            reject(err);
        };
        
        xhr.send(jsonReq);

    });
};


const _createProjResDictFromResList = (userResList) => {
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


//// 實際取得 userProjResDict
const url = 'https://ssl-api-makar-v3-apps.miflyservice.com/Makar/'
const user_id = "27f649b0-cb0b-4a6e-9808-ab88c38ca5ec"

_getResByUserID(url, user_id, "", "").then((data) => {    

    return _createProjResDictFromResList(data)    //// 就是原本的 getResByUserID 的 callback (然後發現它也能寫成Promise 所以就寫)

}).then((data) => {

    // console.log('getRes: userProjResDict', Object.keys(data))
    console.log('getRes: userProjResDict', data )    //// hmmm 為何跟在網頁devtool直接拿 userProjResDict 的數量不同? 暫時先推測 前後端有新的調整

    window.userProjResDict = data    
    
}).catch(err => {

    console.log('error', err)

})



//// 參考 networkAgentVR
//// 拿拿看 userOnlineResDict
const _getUsrOnlineRes = (url, user_id, main_type, sub_type , category) => {
    return new Promise((resolve, reject) => {

        if (!user_id) user_id = "fefe";
        if (!main_type) main_type = "";
        if (!sub_type) sub_type = "";
        if (!category) category = ""
    
        //get_usr_online_res
        let specificUrl = url+"get_usr_online_res";
        let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
        let data = {
            "user_id": user_id , //miflytest
            "main_type": main_type , // ar, vr 
            "sub_type": sub_type ,
            "category": category ,
        }
        let request = {
            "ver":"3.0.0",
            "cid": 5,
            "data":data
        };
        let jsonReq = JSON.stringify(request);
        xhr.open( 'POST', specificUrl , true );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
        xhr.onload = function(e) {
            console.log("networkAgentVR.js: _getUsrOnlineRes: res = ", xhr.response );
    
            if ( xhr.response.error ){
                console.log('networkAgent.js: _getUsrOnlineRes,  onload error ', xhr.response );  //// color: #bada55
                reject( xhr.response.error );
            }else{
                console.log('networkAgent.js: _getUsrOnlineRes,  onload save ' , xhr.response );  //// color: #bada55
                
                if ( xhr.response.data.online_res_list.length > 0 ){

                    resolve(xhr.response.data.online_res_list)

                }else{
                    console.log('networkAgent: _getUsrOnlineRes,  onload  use res is empty ' );  //// color: #bada55
                        
                    resolve( {} )   // "use res is empty"                   
                }
            }
    
        }
        
        xhr.onerror = function(err) {
            reject(err);
        };

        xhr.send( jsonReq );
        
    })
}

const _createOnlineResDictFromResList = (userOnlineResList) => {
    return new Promise((resolve, reject) => {            
        // console.log(userOnlineResList)         

        if (!userOnlineResList) resolve(-1);
        let userOnlineResDict = {};
        for (let i = 0; i < userOnlineResList.length; i++ ){
            userOnlineResDict[ userOnlineResList[i].res_id ] = userOnlineResList[i];

            if ( i == userOnlineResList.length-1 ){
                console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userOnlineResList.length ); // Object.keys(userARResDict).length
                resolve( userOnlineResDict );            
            }
        }
        // window.userOnlineResDict = userOnlineResDict;

        //// 看起來在 userOnlineResList 是 {} 的情況下沒有 resolve
        //// 那要 reject 嗎? 雖然原本networkAgentVR 是 console列印出來
        if( Object.keys(userOnlineResList).length === 0){
            
            reject("userOnlineResList.length is 0")
            //// 只console.log可能是不夠的，若沒有 reject 那Promise的.then連鎖依然可以執行下去
            // console.log('Url is missing.')
        }

    })
}

//// 實際取得 userOnlineResDict
// const url = 'https://ssl-api-makar-v3-apps.miflyservice.com/Makar/'
// const user_id = "27f649b0-cb0b-4a6e-9808-ab88c38ca5ec"

// _getUsrOnlineRes(url, user_id, "", "", "").then((data) => {    


//     console.log('getRes: userOnlineResDict', Object.keys(data))
//     return _createOnlineResDictFromResList(data)

// }).then((data) => {

//     // console.log('getRes: userOnlineResDict', Object.keys(data))
//     console.log('getRes: userOnlineResDict', data )
    
//     window.userOnlineResDict = data    
    
// }).catch(err => {

//     console.log('error', err)

// })
