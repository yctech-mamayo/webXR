Logic.prototype.parse_items_block = function( block ){
    let blockType = block.getAttribute( "type" ) ;
    
    let sceneObjList;
    if( Array.isArray(vrController.editor_version) && vrController.editor_version[0] <= 3 && vrController.editor_version[1] <= 4){
        sceneObjList = vrController.VRSceneResult[ vrController.projectIdx ].scenes[vrController.sceneIndex].objs;
    }
    else if (typeof(vrController.editor_version) == "object"  && Object.keys( vrController.editor_version).length == 4 ){
        let largeV  = Number( vrController.editor_version.v0 );
        let middleV = Number( vrController.editor_version.v1 );
        let smallV  = Number( vrController.editor_version.v2 );

        //// 版本在4以上 或 大於等於3.5， obj的第1層是駝峰式大小寫，第2層換字使用底線 _ 且都是小寫
        if ( largeV > 3 || (largeV == 3 && middleV >= 5) ){
            sceneObjList = vrController.scenesData.scenes[ vrController.currentSceneIndex ].objs ;
        }
    }
    
    let result = new Object() ;
    
    switch( blockType ){

        case "items_get_gameobject":
        case "items_get_model" : 
        case "items_get_text" :
        case "items_get_light" :
        case "items_get_sound" :
        case "items_get_video" :
            result.data = this.items_get_gameobject( block ) ;
            break;
        case "items_get_name" :
            result.data = this.items_get_name( block, sceneObjList ) ;
            break ;
        case "items_get_by_name" :
            result.data = this.items_get_by_name( block, sceneObjList ) ;
            break ;
        case "items_is_video_playing" :
            result.data = this.items_is_video_playing( block ) ;
            break ;
    }

    //[start-20231122-howardhsu-add]//        
    //// 試著找出 編輯器裡物件取消邏輯 web還會繼續跑的問題
    if(blockType != "items_get_name"){
        if( !this.checkObjectBehav(result) ){     
            // console.log("logicSystem.js _checkObjectBehav: 這是個被移除邏輯功能的物件 result=", result, this.checkObjectBehav(result) )    
            result.data = null
        }
    }
    //[end-20231122-howardhsu-add]//

    return result;
}

// Returns ID for any gameObject
Logic.prototype.items_get_gameobject = function(block){

    let newData = new Object();
    newData.value = block.children[0].textContent;
    newData.type = "TEXT";
    // newData.type = block.children[0].getAttribute("name");

    return newData;

}

// Use id to find name
Logic.prototype.items_get_name = function( block, sceneObjList ) {
    let newData = new Object() ;

    let valueBlock = this.getBlockByValueName( block, 'GAME_OBJECT' ) ;
    let objId = this.parseBlock( valueBlock ).data.value ;
    
    newData.type = "TEXT" ;

    sceneObjList.forEach( obj => {
        if ( obj.obj_id == objId ) {
            newData.value = obj.res_name ;
        }
    } ) ;

    return newData ;
}

// Use name to find id
Logic.prototype.items_get_by_name = function( block, sceneObjList ) {
    let newData = new Object() ;

    let valueBlock = this.getBlockByValueName( block, 'NAME' ) ;
    let objName = this.parseBlock( valueBlock ).data.value ;
    newData.type = "TEXT" ;

    // console.log( "56456", vrController.VRSceneResult ) ;
    // console.log( vrController.VRSceneResult[ 0 ].scenes[ 0 ].objs ) ;
    sceneObjList.forEach( obj => {
        if ( obj.res_name == objName ) {
            newData.value = obj.obj_id ;
        }
    } ) ;

    return newData ;
}

Logic.prototype.items_is_video_playing = function( block ) {
    let newData = new Object() ;

    let valueBlock = this.getBlockByValueName( block, 'VIDEO' ) ;
    let objId = this.parseBlock( valueBlock ).data.value ;
    let tag = document.getElementById( objId ) ;

    tag = document.getElementById( objId ) ;
    let src = document.querySelector( 'video' ) ;
    // console.log( 'Video playing ?', ! src.paused ) ;
    
    if ( tag ) {
        // window.clearInterval( timeId ) ;
        newData.type = "BOOL" ;
        newData.value = ! src.paused ;
        // console.log( newData.data ) ;

        return newData ;
    }

    // var timeId = window.setInterval( () => {
    //     tag = document.getElementById( objId ) ;
    //     let src = document.querySelector( 'video' ) ;
    //     // console.log( 'Video playing ?', ! src.paused ) ;
        
    //     if ( tag ) {
    //         window.clearInterval( timeId ) ;
    //         newData.data = ! src.paused ;
    //         console.log( newData.data ) ;

    //         return newData
    //     }
    // }, 100 )
}
