'use strict';

class mIndexedDB {
  constructor() {
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    };

    
    let makarWebViewerDBVersion =    1   ; // must be integer
    // this.db ;
    const dBOpenRequest = window.indexedDB.open('makarWebViewerDB',  makarWebViewerDBVersion );

    // console.log(' _______ mdb open _________ ', dBOpenRequest );

    dBOpenRequest.addEventListener('upgradeneeded', event => {
      this.db  = event.target.result;
      console.log(`Upgrading to version ${this.db .version}`);
      
      //// 建構紀錄當下使用者瀏覽過哪個專案的表單 目前預計只先紀錄 帶有模組(括括卡、集點卡)的專案
      if (!this.db.objectStoreNames.contains("loadedProject")){
        // Create an objectStore for this database
        var objectStore = this.db.createObjectStore('loadedProject', { 
          keyPath: 'proj_id' , 
          // autoIncrement: true, 
        });
        // define what data items the objectStore will contain
        objectStore.createIndex('create_date', 'create_date', { unique: false });
        objectStore.createIndex('last_update_date', 'last_update_date', { unique: false });
        objectStore.createIndex('user_id', 'user_id', { unique: false });
        objectStore.createIndex('proj_name', 'proj_name', { unique: false });
        objectStore.createIndex('proj_type', 'proj_type', { unique: false });
        objectStore.createIndex('proj_platform', 'proj_platform', { unique: false });
        objectStore.createIndex('module_type', 'module_type', { unique: false });
        objectStore.createIndex('editor_ver', 'editor_ver', { unique: false });

      }

      //// 2022 1024 此表單暫時無用
      if (!this.db.objectStoreNames.contains("searchInfo")){
        // Create an objectStore for this database
        var searchInfoOS = this.db.createObjectStore('searchInfo', { 
          keyPath: 'keyword' , 
        });
        // define what data items the searchInfoOS will contain
        searchInfoOS.createIndex('user_id', 'user_id', { unique: false });
        searchInfoOS.createIndex('proj_name', 'proj_name', { unique: false });
      }
      
      //// 2022 1024 此表單暫時無用
      //// 建構紀錄當下使用者的登入資訊
      if (!this.db.objectStoreNames.contains("user")){
        // Create an objectStore for this database
        var userOS = this.db.createObjectStore('user', { 
          keyPath: 'user_id' ,  
        });
        // define what data items the objectStore will contain
        userOS.createIndex('loginDate', 'loginDate', { unique: false });

      }

      //// 2022 1024 此表單新增
      //// 建構紀錄「拍照圖片」
      if (!this.db.objectStoreNames.contains("snapImageBase")){
        // Create an objectStore for this database
        var snapImageBaseOS = this.db.createObjectStore('snapImageBase', { 
          keyPath: 'device_id' ,  
        });
        // snapImageBaseOS.createIndex('loginDate', 'loginDate', { unique: false });
      }

      console.log("___________ upgradeneeded ______________ ", this.db   );
    });

    dBOpenRequest.onsuccess = (event) => {

      // let db = event.target.result;
      // console.log(' _______ mdb sucess 2_________ ', db );

      // if ( db && db.objectStoreNames && !db.objectStoreNames.contains("snapImageBase")){
      //   // Create an objectStore for this database
      //   var snapImageBaseOS = db.createObjectStore('snapImageBase', { 
      //     keyPath: 'device_id' ,  
      //   });
        
      // }


    }

    //// 假如判斷為「已經有較新版本，則無條件關閉」
    dBOpenRequest.onerror = (event) => {
      console.log(' _______ mdb error 2_________ ', event );

      if ( event.target.error  ){
        if ( event.target.error.name == "VersionError" ){
          window.indexedDB.deleteDatabase( 'makarWebViewerDB' );
          window.mdb = new mIndexedDB();
        }
      }

    }


    dBOpenRequest.addEventListener('success', event => {
      //// test //// 
      this.db = event.target.result;

      // console.log(' _______ mdb sucess _________ ');

      // for ( let i = 0; i < 10; i++){
      //   let testProj = {
      //     proj_id: "pp123_" + i,
      //     type: "world",
      //     proj_name:  Math.floor(Math.random() * 10 ) ,
      //   };
      //   let objectStore = this.db.transaction("loadedProject", "readwrite").objectStore("loadedProject").put( testProj ) ;     
      // }
      // console.log("indexedDB.js: dBOpenRequest success  ", this.db , objectStore   );

      // console.log("indexedDB.js: dBOpenRequest success  ", this.db );

    });
  };

  //// 未完成 暫時不使用
  async setSearchKeyword ( keyword , callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _addProject: db null return ", this.db );  
      return;
    }
    
    //// event control
    let transaction = this.db.transaction("searchInfo", "readwrite");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _setSearchKeyword: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _setSearchKeyword: transaction error, event= ", event );  
    };

    let searchInfoOS = transaction.objectStore("searchInfo");
    let addRequest =  searchInfoOS.add( projInfo ) ;
    addRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _setSearchKeyword: addRequest success, event= ", event );
      // event.target.result will be the KeyPath ;
      if (callback){
        callback(event);
      }
    };
    addRequest.onerror = function(event){
      console.error("indexedDB.js: _setSearchKeyword: addRequest error, event= ", event );    
    };
    
    return await addRequest;
  }


  ////// customized function for makar 
  ////// Fei 測試 get 的 return await request 並不會等 onsuccess 之後再回傳 基本上還是要用 callback來處理，MDN上的範例也是如此 
  ////// 括括卡模組 相關

  async initProject( projInfo ){

    let self = this;
    return new Promise(function(resolve, reject) {
      
      if ( !self.db ) {
        console.error("indexedDB.js: _initProject: db null return ", self.db );  
        return;
      }
      if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
        console.error("indexedDB.js: _initProject: proj_id null return ", projInfo );  
        return;
      }
      
      self.getProject(projInfo.proj_id, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          // console.log("indexedDB.js: _initProject: _get: already have the project with same proj_id ", getEvent.target.result );
          resolve(getEvent.target.result);
        }else{
          // console.log("indexedDB.js: _initProject: _get no proj exist, add one, getEvent= ", getEvent.target.readyState , getEvent.target, projInfo );    
          projInfo.scratchCardState = 0; //// [ 0:init , 1:getAward , 2:scratched , 3:exchanged  ]
          projInfo.getAwardIndex = -1;
          self.addProject(projInfo);
          resolve(projInfo);
        }
      });

    });
    // return await getRequest;
  }


  //// 查找「存放照片」，基本上目前會先「固定key」方式進行，因為不需要「多組圖片」的功能
  async getSnapshopData ( device_id ){
    let self = this;

    let pGet = new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _saveSnapshop: db null return ", self.db );  
        resolve( -1 );
        return;
      }

      device_id = '20221024_snap';

      if ( device_id == undefined || device_id == '' ){
        resolve( -1 );
        return;
      }

      let transaction = self.db.transaction("snapImageBase", "readonly");
      
       //// event control
      transaction.oncomplete = function(event) {
        // console.log("indexedDB.js: _getSnapshopData: transaction complete, event= ", event );    
      };
      transaction.onerror = function(event) {
        console.error("indexedDB.js: _getSnapshopData: transaction error, event= ", event );  
      };

      let snapOS = transaction.objectStore("snapImageBase");
      let getRequest =  snapOS.get( device_id ) ;
      getRequest.onsuccess = function(event){
        console.log("indexedDB.js: _getSnapshopData: getRequest success, event= ", event, event.target.readyState, event.target.result, device_id );    
        // event.target.result will be the object ;
        resolve( event.target.result );
      };
      getRequest.onerror = function(event){
        console.error("indexedDB.js: _getSnapshopData: getRequest error, event= ", event );    
      };

    });

    return pGet;

  }

  //// 儲存「照片」，基本上目前會先「固定key」方式進行，因為不需要「多組圖片」的功能
  async saveSnapshop ( imageData = {} ){
    let self = this;
    let pSave = new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _saveSnapshop: db null return ", self.db );  
        resolve( -1 );
        return;
      }
      
      imageData.device_id = '20221024_snap';
      
      if ( !imageData || imageData.device_id == undefined ){
        resolve( -1 );
        return;
      }

      let transaction = self.db.transaction("snapImageBase", "readwrite");
      let snapOS = transaction.objectStore("snapImageBase");
      let addRequest =  snapOS.put( imageData ) ;
      addRequest.onsuccess = function(event){
        // event.target.result will be the KeyPath ;
        console.log(' _saveSnapshop: success ', event );
        resolve( event );

      };
      addRequest.onerror = function(event){
        console.error("indexedDB.js: _saveSnapshop: addRequest error, event= ", event );    
        resolve( -1 );
      };

    });

    return pSave;
  }

  async clearSnapShot(){

    let self = this;
    let pSave = new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _clearSnapShot: db null return ", self.db );  
        resolve( -1 );
        return;
      }
      

      let transaction = self.db.transaction("snapImageBase", "readwrite");
      let snapOS = transaction.objectStore("snapImageBase");
      let addRequest =  snapOS.clear();
      addRequest.onsuccess = function(event){
        // event.target.result will be the KeyPath ;
        console.log(' _clearSnapShot: success ', event );
        resolve( event );

      };
      addRequest.onerror = function(event){
        console.error("indexedDB.js: _clearSnapShot: addRequest error, event= ", event );    
        resolve( -1 );
      };

    });

    return pSave;

  }


  async getScratchProject ( proj_id ){

    let self = this;
    return new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _getScratchProjectAward: db null return ", self.db );  
        return;
      }
      if ( !proj_id || proj_id == "" ) {
        console.error("indexedDB.js: _getScratchProjectAward: proj_id null return ", proj_id );  
        return;
      }
      
      self.getProject(proj_id, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          console.log("indexedDB.js: _getScratchProjectAward: _get: already have the project with same proj_id ", getEvent.target.result , getEvent.target.result.getAwardIndex );
          //// if first time, return -1, 
          resolve( getEvent.target.result );
          
        }else{
          console.log("indexedDB.js: _getScratchProjectAward: _get no proj exist getEvent= ", getEvent.target.readyState , getEvent.target ); 
          resolve( {} );
        }
      });

    });
    // return await getRequest;
  }

  async setScratchProject ( projInfo ){

    let self = this;
    return new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _setScratchProject: db null return ", self.db );  
        return;
      }
      if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
        console.error("indexedDB.js: _setScratchProject: proj_id null return ", projInfo );  
        return;
      }
      
      self.putProject(projInfo, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          console.log("indexedDB.js: _setScratchProject: put: getEvent.target.result= ", getEvent.target.result );    
          // resolve(getEvent.target.result);
        }else{

        }
      });

    });
    // return await getRequest;
  }

  async setScratchProjectStateFromProjID ( proj_id , scratchCardState ){

    let self = this;
    return new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _setScratchProjectStateFromProjID: db null return ", self.db );  
        return;
      }
      if ( !proj_id || proj_id == "" ) {
        console.error("indexedDB.js: _setScratchProjectStateFromProjID: proj_id null return ", proj_id );  
        return;
      }
      if (!scratchCardState || !Number.isInteger(scratchCardState) || scratchCardState < 1 ){
        console.error("indexedDB.js: _setScratchProjectStateFromProjID: scratchCardState null return ", scratchCardState );  
        return;
      }
      console.log("indexedDB.js: _setScratchProjectStateFromProjID: put: start, [proj_id , scratchCardState]= ", scratchCardState , proj_id );

      self.getProject(proj_id , function(getEvent){

        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          let projInfo = getEvent.target.result;
          projInfo.scratchCardState = scratchCardState;
          self.putProject(projInfo, function(putEvent){
            if (putEvent.target.readyState == "done" && putEvent.target.result ){
              console.log("indexedDB.js: _setScratchProjectStateFromProjID: put: getEvent.target.result= ", putEvent.target.result );
              resolve(projInfo);
            }else{
              // console.log("indexedDB.js: _initProject: _get callback getEvent= ", getEvent.target.readyState , getEvent.target );    
              resolve(projInfo);
            }
          });
          
        }else{
          console.log("indexedDB.js: _getScratchProjectAward: _get no proj exist getEvent= ", getEvent.target.readyState , getEvent.target );    
          // resolve(projInfo);
        }
      });

    });
    // return await getRequest;
  }

  ////// 集點卡模組相關
  async initPointCardProject( projInfo ){

    let self = this;
    return new Promise(function(resolve, reject) {
      
      if ( !self.db ) {
        console.error("indexedDB.js: _initPointCardProject: db null return ", self.db );  
        return;
      }
      if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
        console.error("indexedDB.js: _initPointCardProject: proj_id null return ", projInfo );  
        return;
      }
      
      self.getProject(projInfo.proj_id, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          // console.log("indexedDB.js: _initPointCardProject: _get: already have the project with same proj_id ", getEvent.target.result );
          resolve(getEvent.target.result);
        }else{
          // console.log("indexedDB.js: _initPointCardProject: _get no proj exist, add one, getEvent= ", getEvent.target.readyState , getEvent.target, projInfo );    
          // projInfo.scratchCardState = 0; //// [ 0:init , 1:getAward , 2:scratched , 3:exchanged  ]
          // projInfo.getAwardIndex = -1;
          self.addProject(projInfo);
          resolve(projInfo);
        }
      });

    });
    // return await getRequest;
  }

  async getPointCardProject ( proj_id ){

    let self = this;
    return new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _getPointCardProject: db null return ", self.db );  
        return;
      }
      if ( !proj_id || proj_id == "" ) {
        console.error("indexedDB.js: _getPointCardProject: proj_id null return ", proj_id );  
        return;
      }
      
      self.getProject(proj_id, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          console.log("indexedDB.js: _getPointCardProject: _get: already have the project with same proj_id ", getEvent.target.result , getEvent.target.result.getAwardIndex );
          //// if first time, return -1, 
          resolve( getEvent.target.result );
          
        }else{
          console.log("indexedDB.js: _getPointCardProject: _get no proj exist getEvent= ", getEvent.target.readyState , getEvent.target );    
          resolve( {} );
          
        }
      });

    });
    // return await getRequest;
  }

  async setPointCardProject ( projInfo ){

    let self = this;
    return new Promise(function(resolve, reject) {
      if ( !self.db ) {
        console.error("indexedDB.js: _setPointCardProject: db null return ", self.db );  
        return;
      }
      if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
        console.error("indexedDB.js: _setPointCardProject: proj_id null return ", projInfo );  
        return;
      }
      
      self.putProject(projInfo, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          console.log("indexedDB.js: _setPointCardProject: put: getEvent.target.result= ", getEvent );    
          resolve(getEvent.target.result);
        }else{

        }
      });

    });
    

  }

  ////// 集點卡結束


  //[start-20231114-renhaohsu-add]//
  //// 問答模組相關
  //// 仿照 getPointCardProject ，多增加判斷 專案類型是否為"quiz"
  async getQuizProject ( proj_id ){
    return new Promise( (resolve, reject) => {      
      if ( !this.db ) {
        reject({ status: "rejected", message: "indexedDB.js: _getQuizProject: db null return ", db: this.db })
        return;
      }
      if ( !proj_id || proj_id == "" ) {
        reject({ status: "rejected", message: "indexedDB.js: _getQuizProject: proj_id null return ", proj_id: proj_id })
        return;
      }

      this.getProject(proj_id, function(getEvent){
        if ( getEvent.target.readyState == "done" && getEvent.target.result ){
          // if(getEvent.target.result.type == "quiz"){
            // console.log("indexedDB.js: _getQuizProject: _get: already have the project with same proj_id ", getEvent.target.result );
            resolve( getEvent.target.result );            
          // } else {
          //   console.log("indexedDB.js: _getQuizProject: _get: the project's module is not quiz", getEvent.target.result );
          //   reject('not quiz proj')
          // }
          
        }else{
          console.log("indexedDB.js: _getQuizProject: _get no proj exist getEvent= ", getEvent.target.readyState , getEvent.target );    
          resolve( {} );          
        }
      });
    })
  }

  async putQuizProject ( projInfo ){

    return new Promise( (resolve, reject) => {
      if ( !this.db ) {
        console.error("indexedDB.js: putQuizProject: db null return ", this.db );  
        return;
      }
      if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
        console.error("indexedDB.js: putQuizProject: proj_id null return ", projInfo );  
        return;
      }
      
      this.putProject(projInfo, function(getEvent){
        if (getEvent.target.readyState == "done" && getEvent.target.result ){
          console.log("indexedDB.js: putQuizProject: put: getEvent.target.result= ", getEvent );    
          resolve(getEvent.target.result);
        }else{
          //// does that means putProject failed?
          console.warn("indexedDB.js: putQuizProject: put: ", getEvent)
        }
      });
    });    

  }
  //// Quiz 結束 
	//[end-20231114-renhaohsu-add]//


  ////// general function [ add , delete, get, put, getByCursor, getByKeyCursor ]

  async addProject( projInfo , callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _addProject: db null return ", this.db );  
      return;
    }
    if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
      console.error("indexedDB.js: _addProject: proj_id null return ", proj_id );  
      return;
    }
    
    //// event control
    let transaction = this.db.transaction("loadedProject", "readwrite");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _addProject: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _addProject: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let addRequest =  projOS.add( projInfo ) ;
    addRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _addProject: addRequest success, event= ", event );
      // event.target.result will be the KeyPath ;
      if (callback){
        callback(event);
      }
    };
    addRequest.onerror = function(event){
      console.error("indexedDB.js: _addProject: addRequest error, event= ", event );    
    };
    
    return await addRequest;
  }

  async deleteProject( proj_id , callback){
    if ( !this.db ) {
      console.error("indexedDB.js: _deleteProject: db null return ", this.db );  
      return;
    }
    if ( !proj_id || proj_id == "" ) {
      console.error("indexedDB.js: _deleteProject: proj_id null return ", proj_id );  
      return;
    }
    
    //// event control
    let transaction = this.db.transaction("loadedProject", "readwrite");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _deleteProject: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _deleteProject: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let deleteRequest =  projOS.delete( proj_id ) ;
    deleteRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _deleteProject: deleteRequest success, event= ", event );    
      // event.target.result will be the KeyPath ;
      if (callback){
        callback(event);
      }
    };
    deleteRequest.onerror = function(event){
      console.error("indexedDB.js: _deleteProject: deleteRequest error, event= ", event );    
    };
    
    return await deleteRequest;
  }


  async putProject( projInfo , callback){
    if ( !this.db ) {
      console.error("indexedDB.js: _putProject: db null return ", this.db );  
      return;
    }
    if ( !projInfo.proj_id || projInfo.proj_id == "" ) {
      console.error("indexedDB.js: _putProject: proj_id null return ", projInfo.proj_id );  
      return;
    }
    
    //// event control
    let transaction = this.db.transaction("loadedProject", "readwrite");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _putProject: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _putProject: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let putRequest =  projOS.put( projInfo ) ;
    putRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _putProject: putRequest success, event= ", event );    
      // event.target.result will be the KeyPath ;
      if (callback){
        callback(event);
      }
    };
    putRequest.onerror = function(event){
      console.error("indexedDB.js: _putProject: putRequest error, event= ", event );    
    };
    
    return await putRequest;
  }

  async getProject( proj_id , callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _getProject: db null return ", this.db );  
      return;
    }
    if ( !proj_id || proj_id == "" ) {
      console.error("indexedDB.js: _getProject: proj_id null return ", proj_id );  
      return;
    }
    
    //// event control
    let transaction = this.db.transaction("loadedProject", "readonly");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _getProject: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _getProject: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let getRequest =  projOS.get( proj_id ) ;
    getRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _getProject: getRequest success, event= ", event, event.target.readyState, event.target.result, proj_id );    
      // event.target.result will be the object ;
      if (callback){
        callback(event);
      }
    };
    getRequest.onerror = function(event){
      console.error("indexedDB.js: _getProject: getRequest error, event= ", event );    
    };
    
    return await getRequest;
  }

  //// 請不要隨意呼叫這個function, 會直接清空表單
  async clearProjOS ( pwd, callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _clearProjOS: db null return ", this.db );  
      return;
    }
    if (!pwd || pwd != "deep123" ){
      console.error("indexedDB.js: _clearProjOS: pwd wrong, denied ", pwd );  
      return;
    }
    //// event control
    let transaction = this.db.transaction("loadedProject", "readwrite");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _clearProjOS: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _clearProjOS: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let projOSClearRequest = projOS.clear();

    projOSClearRequest.onsuccess = function(event){
      console.log("indexedDB.js: _clearProjOS: projOSClearRequest success, event= ", event );    
      // event.target.result will be the object ;
      if (callback){
        callback();
      }
    };
    projOSClearRequest.onerror = function(event){
      console.error("indexedDB.js: _clearProjOS: projOSClearRequest error, event= ", event );    
    };
    
    return await projOSClearRequest;
  }


  async getAllProjectByCursor( callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _getAllProjectByCursor: db null return ", this.db );  
      return;
    }    
    //// event control
    let transaction = this.db.transaction("loadedProject", "readonly");
    transaction.oncomplete = function(event) {
      // console.log("indexedDB.js: _getAllProjectByCursor: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _getAllProjectByCursor: transaction error, event= ", event );  
    };

    let getProjs = [];

    let projOS = transaction.objectStore("loadedProject");
    let cursorRequest = projOS.openCursor() ;
    cursorRequest.onsuccess = function(event){
      // console.log("indexedDB.js: _getAllProjectByCursor: cursorRequest success, event= ", event );    
      // event.target.result will be the object ;
      let cursor = event.target.result;
      if (cursor) {
        // console.log("proj_id=" + cursor.key + ",  " + Object.keys(cursor.value) , Object.values(cursor.value) ,"\n" , cursor.value  );
        let tempObj = {}
        Object.keys(cursor.value).forEach((item, index, array) =>{
          tempObj[item] = Object.values(cursor.value)[index];
          // console.log( "______", item , "::", index , "::" ,  Object.values(cursor.value)[index]  );
        });
        getProjs.push(tempObj);
        cursor.continue();
      }else{
        console.log("indexedDB.js: _getAllProjectByCursor: cursor end  ", getProjs );
        if (callback){
          callback(getProjs);
        }
      }
    };
    cursorRequest.onerror = function(event){
      console.error("indexedDB.js: _getAllProjectByCursor: cursorRequest error, event= ", event );    
    };
    
    return await cursorRequest;
  }

  async getAllProjectByKeyCursor( searchKey , callback ){
    if ( !this.db ) {
      console.error("indexedDB.js: _getAllProjectByKeyCursor: db null return ", this.db );  
      return;
    }
    if (!searchKey || searchKey == ""){
      searchKey = "proj_name";
    }
    //// event control
    let transaction = this.db.transaction("loadedProject", "readonly");
    transaction.oncomplete = function(event) {
      console.log("indexedDB.js: _getAllProjectByKeyCursor: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _getAllProjectByKeyCursor: transaction error, event= ", event );  
    };

    let projOS = transaction.objectStore("loadedProject");
    let projOSIndex = projOS.index( searchKey );

    let getKeys = [];

    let cursorRequest = projOSIndex.openKeyCursor();
    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        // cursor.key is a name, like "Bill", and cursor.value is the SSN.
        // No way to directly get the rest of the stored object.
        console.log("11 indexedDB.js: key: " + cursor.key + ", value: " + cursor.value);
        getKeys.push(cursor.key);
        cursor.continue();
      }else{
        console.log("indexedDB.js: _getAllProjectByKeyCursor: cursor end  ", event , getKeys );
        if (callback){
          callback(getKeys);
        }
      }
    }
    
    return await cursorRequest;
  }

  async getAllProjectByKeyCursorWithRange ( searchKey ){
    if ( !this.db ) {
      console.error("indexedDB.js: _getAllProjectByKeyCursor: db null return ", this.db );  
      return;
    }
    if (!searchKey || searchKey == ""){
      searchKey = "proj_name";
    }
    //// event control
    let transaction = this.db.transaction("loadedProject", "readonly");
    transaction.oncomplete = function(event) {
      console.log("indexedDB.js: _getAllProjectByKeyCursor: transaction complete, event= ", event );    
    };
    transaction.onerror = function(event) {
      console.error("indexedDB.js: _getAllProjectByKeyCursor: transaction error, event= ", event );  
    };

    var boundKeyRange = IDBKeyRange.bound( 1 , 5 , false, true);


    let projOS = transaction.objectStore("loadedProject");
    let projOSIndex = projOS.index( searchKey );
    let cursorRequest = projOSIndex.openKeyCursor(  boundKeyRange  );
    cursorRequest.onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        // cursor.key is a name, like "Bill", and cursor.value is the SSN.
        // No way to directly get the rest of the stored object.
        console.log("11 indexedDB.js: key: " + cursor.key + ", value: " + cursor.value);
        cursor.continue();
      }
    }
    
    return await cursorRequest;
  }

}

//// 基本上只有在「重新整理」後才會觸發
if ( typeof( window.mdb ) != 'object'   ){
  console.log('_mIndexedDB: create' );
  window.mdb = new mIndexedDB();
}


