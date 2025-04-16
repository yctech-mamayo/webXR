class Logic{
    constructor(){
        this.xmlDoc = null;
        this.variableList = [];
        this.intersectObj = [] ;

        //// 跟「隨時間控制」相關，包含「迴圈」、「轉換」等
        this.timelineDict = {};

         //// 碰撞事件容器
        this.intervalList = [];

         //// 「點擊觸發事件」，根本上是放於「物件」上，這邊一併紀錄
        this.onclickObjectDict = {}; 

        //// 紀錄「是否已經parse」，此數值設定只有在此Class 內呼叫 _parseXML 才會設定為 1
        //// -1: 尚未啟動, 0: xml載入完成, 1: 啟動中, 2:啟動完成
        this.logicSystemState = -1;
    }

    loadXMLtoDoc(xmlURL){
        let self = this;

        let pXML = new Promise( function( xmlResolve ){

            let xhr = new XMLHttpRequest();
            xhr.open("GET", xmlURL, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let xmlParser = new DOMParser();
                        let xmlDoc = xmlParser.parseFromString(xhr.responseText,"text/xml");
                        self.xmlDoc = xmlDoc;
                        console.log('logicSystem.js: _loadXMLtoDoc: xmlDoc = ',  self.xmlDoc);
                        // self.parseXML();

                        xmlResolve( self );

                    } else {
                        console.error(xhr.statusText);
                        xmlResolve( '' );
                    }
                }
            };
            xhr.onerror = function (e) {
                console.error(xhr.statusText);
                xmlResolve( '' );
            };
            xhr.send(null); 


        });

        return pXML;

    }

    parseXML(){
        // console.log(this.xmlDoc);

        let self = this;
        //// -1: 尚未啟動, 0: xml載入完成, 1: 啟動中, 2:啟動完成
        self.logicSystemState = 1;

        if (this.xmlDoc.children[0].tagName == 'xml'){
            let xml = this.xmlDoc.children[0];

            if (xml.children[0].tagName == "variables"){
                let variables = xml.children[0];
                if (variables.children.length > 0){
                    this.registLogicVariables(variables.children);
                }
            }

            if (xml.children.length > 1){
                for(let i = 1; i < xml.children.length; i++){
                    // console.log( "Parse", xml.children[ i ] ) ;
                    this.parseBlock(xml.children[i]);
                }
            }

            //// -1: 尚未啟動, 0: xml載入完成, 1: 啟動中, 2:啟動完成
            self.logicSystemState = 2;

        }
    }



    //// 對應為 _parseXML, 停止一切邏輯功能，並且清除「變數」，此動作完成後，可以再次呼叫 _parseXML 來重新啟動
    stopLogic = function(){

        let self = this;
        //// 暫停「時間事件列表」並且清除
        let timelineList = Object.values( self.timelineDict );
        timelineList.forEach( e => { e.pause(); } );
        timelineList.forEach( e => { e.kill(); } );
        //// 清空「時間事件列表」
        self.timelineDict = {};

        //// 清除「觸碰事件列表」
        let onclickObjectList = Object.values( self.onclickObjectDict );
        onclickObjectList.forEach( e => {
            e.forEach( e2 => {
                e2.length = 0;
            });
        });
        self.onclickObjectDict = {};

        //// 清除「碰撞事件列表」
        self.intervalList.forEach( e => {
            clearInterval( e );
        });
        self.intervalList.length = 0;

        //// 清空「變數列表」
        self.variableList.length = 0;
        //// 將邏輯狀態改為：xml載入完成
        //// -1: 尚未啟動, 0: xml載入完成, 1: 啟動中, 2:啟動完成
        self.logicSystemState = 0;

        console.log('logicSystem.js: _stopLogic: done');
    }





    registLogicVariables = function(variables) {
        // console.log(variables);
        for(let i=0; i<variables.length; i++){
            let newVar = new Object();
            newVar.name = variables[i].textContent;
            newVar.data = null;
            this.variableList.push(newVar);
            
        }
        console.log(this.variableList);
        
    }

    getContentByFieldName = function( block, name ){
        let childrenList = block.children;
        for(let i = 0; i<childrenList.length; i++){
            if(childrenList[i].getAttribute("name") == name){
                return childrenList[i].textContent;
            }
        }

        return null;
    }

    getBlockByValueName = function( block, name ) {
        let childrenList = block.children;
        for(let i = 0; i<childrenList.length; i++){
            if(childrenList[i].getAttribute("name") == name){
                return childrenList[i].children[0];
            }
        }

        return null;
    }

    parseBlock = function(block, cb=null){
        // console.log(block);
        if ( !block ){
            return;
        }
        
        let blockType = block.getAttribute("type");
        let splitArray = blockType.split("_");
        let blockClass = splitArray[0];

        // console.log( blockType ) ;

        let result;
        switch(blockClass){

            case "transform":
                result = this.parse_transform_block(block, cb);
                break;

            case "actions":
                result = this.parse_actions_block(block, cb);
                break;

            case "controls":
                result = this.parse_controls_block(block, cb);
                break;

            case "operators":
                result = this.parse_operators_block(block);
                break;
            
            case "data":
                result = this.parse_data_block(block, cb);
                break;

            case "items":
                result = this.parse_items_block(block);
                break;

            case "events" :
                result = this.parse_events_block( block, cb ) ;
                break ;

            // Variable API    -- chris 20211117 --
            case "variables" :
                result = this.parse_variables_block( block, cb ) ;
                break ;

            case "debug":
                result = this.parse_debug_block(block, cb);
                break;

        }

        
        return result;
        
    }

    clear = function(){
        this.xmlDoc = null;
        this.variableList.length = 0;
        delete this;
    }


    //// 檢查物件是否在「整個世界」可見
    checkObjectWorldVisible = function( target ){

        //// 起始預設「物件絕對可見」
        let worldVisible = true;
        //// 假如物件本身不可見，直街紀錄即可
        if ( target.object3D.visible == false ){
            // console.log('logicSystem.js: _checkObjectWorldVisible: target visible false', target.object3D );
            worldVisible = false
        }else {
            //// 假如物件本身可見，檢查母親直到「場景層」，任何一個不可見都紀錄為「不可見」
            let parentVisible = true;
            target.object3D.traverseAncestors( function(parent) {
                if (parent.type != "Scene"){
                    // console.log("logicSystem.js: _checkObjectWorldVisible: traverseAncestors: not Scene parent=", parent );
                    if (parent.visible == false){
                        parentVisible = false;
                    }
                } else {
                    if (parentVisible == true && target.object3D.visible == true ){
                        // console.log("logicSystem.js: _checkObjectWorldVisible: traverseAncestors: all parent visible true=", target.object3D );
                        worldVisible = true;
                    }else{
                        // console.log("logicSystem.js: _checkObjectWorldVisible: traverseAncestors: not all parent visible true=", target.object3D );
                        worldVisible = false;
                    }
                }
            });

        }

        // console.log('logicSystem.js: _checkObjectWorldVisible: worldVisible=', worldVisible );

        return worldVisible;
    }
    
    //[start-20231122-howardhsu-add]//
    //// 試著找出 編輯器裡物件取消邏輯 web卻會繼續跑的問題
    checkObjectBehav = function( result ){
        // console.log("logicSystem.js _checkObjectBehav: result=", result)
    
        //// 看起來在 result.data.type ==  "TEXT" 的情況下可以檢查到3D物件
        if( result.data && result.data.type ==  "TEXT" ){
            
            let objId = result.data.value 

            //// v3.4.x 以前
            if( Array.isArray(vrController.editor_version) && vrController.editor_version[0] <= 3 && vrController.editor_version[1] <= 4){
                let found = vrController.VRSceneResult[vrController.projectIdx].scenes[vrController.sceneIndex].objs.find( o => o.obj_id == objId ) 
                if(found){
                    //// 確認此物件在編輯器裡確實有 新增功能"邏輯"
                    if(found.blockly)
                        return true
                }

            //// v3.5.0.0 以後
            } else if (typeof(vrController.editor_version) == "object"  && Object.keys( vrController.editor_version).length == 4 ){
                        
                let largeV  = Number( vrController.editor_version.v0 );
                let middleV = Number( vrController.editor_version.v1 );
                let smallV  = Number( vrController.editor_version.v2 );

                //// 版本在4以上 或 大於等於3.5， obj的第1層是駝峰式大小寫，第2層換字使用底線 _ 且都是小寫
                if ( largeV > 3 || (largeV == 3 && middleV >= 5) ){
                    let found = vrController.scenesData.scenes[vrController.currentSceneIndex].objs.find( o => o.generalAttr.obj_id == objId ) 
                    if(found){
                        //// 確認此物件在編輯器裡確實有 新增功能"邏輯"
                        if(found.generalAttr.logic){
                            return true
                        }
                    }
                }
                
            } else {
                //// 理論上不會走到這
                return false
            }

            //// 該物件不帶有 "邏輯" 有可能是user在物件設定移除了 (但blockly xml的內容不會因此更新)
            return false
            
        }

        //// 其他情況下不檢查behav 直接通過
        return true 
    }   
    //[end-20231122-howardhsu-add]//
}

//[start-20230921-howardhsu-modify]//
if (!window.Logic) {
    window.Logic = Logic;
}
//[end-20230921-howardhsu-modify]//