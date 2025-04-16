Logic.prototype.parse_events_block = function( block, cb ) {
    let blockType = block.getAttribute( 'type' ) ;
    let result = new Object() ;

    switch( blockType ) {
        case "events_on_click" :
            result.data = this.events_on_click( block ) ;
            break ;
        case "events_on_collide" :
            result.data = this.events_on_collide( block ) ;
            break ;
    } 

    if ( cb ) cb() ;

    return result ;
}

Logic.prototype.events_on_click = function( block ) {

    let self = this;
    
    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    if ( target.object3D.el ) {
        if (target.object3D.el.onclickBlock){
            
            //// 需要多判定「 假如已經掛載過同樣事件，則不再掛一次 」
            //// 因為Unity 運作邏輯上，重複掛載類似於 onclick 而非 addEventListener 多次
            let sameBlockCheck = false;
            target.object3D.el.onclickBlock.forEach( e =>{
                if ( e == doBlock ){
                    sameBlockCheck = true;
                    return;
                }
            });
            if ( sameBlockCheck == true ){
                return;
            }

            // if ( target.object3D.el.onclickBlock.length > 10 ){
            //     // console.log(' over 10 !!!! ')
            //     return;
            // }

            target.object3D.el.onclickBlock.push(doBlock);
            target.object3D.el.onclickBlockState.push(true);
        }
        else{
            target.object3D.el.onclickBlock = [];
            target.object3D.el.onclickBlockState = [];
            target.object3D.el.onclickBlock.push(doBlock);
            target.object3D.el.onclickBlockState.push(true);
        }

        self.onclickObjectDict[ block.id ] = [ target.object3D.el.onclickBlock , target.object3D.el.onclickBlockState ];
    }
    

}

Logic.prototype.events_on_collide = function( block ) {
    
    let self = this;

    let  objA_Block = this.getBlockByValueName(block, "GAME_OBJECT_A");
    if(objA_Block == null) return;
    let objA_id = this.parseBlock(objA_Block).data;
    if (objA_id == null || objA_id.type != "TEXT") return;

    let  objB_Block = this.getBlockByValueName(block, "GAME_OBJECT_B");
    if(objB_Block == null) return;
    let objB_id = this.parseBlock(objB_Block).data;
    if (objB_id == null || objB_id.type != "TEXT") return;

    let doBlock = self.getBlockByValueName( block, 'DO0' ) ;
    if ( doBlock == null ) return ;

    let objA = document.getElementById( objA_id.value );
    let objB = document.getElementById( objB_id.value );
    if ( objA == null || objB == null ) return ;

    let boxA = new THREE.Box3().setFromObject( objA.object3D ); ;
    let boxB = new THREE.Box3().setFromObject( objB.object3D ) ; 

    let collide = boxA.intersectsBox( boxB ) ;
    let canDo = true ;

    let interval_id = window.setInterval( function() {
        boxA = new THREE.Box3().setFromObject( objA.object3D ) ;
        boxB = new THREE.Box3().setFromObject( objB.object3D ) ; 

        if ( canDo && collide == false && boxA.intersectsBox( boxB ) == true ) {
            collide = true ;
            canDo = false ;
            
            //[start-20240422-renhaohsu-modify]//
            //// 由 是否可見 來決定 是否觸發碰撞事件
            let objAWorldVisible = self.checkObjectWorldVisible( objA );
            let objBWorldVisible = self.checkObjectWorldVisible( objB );

            if( objAWorldVisible == true && objBWorldVisible == true ){            
                self.parseBlock( doBlock, function(){        
                    canDo = true ;
                    console.log("collide canDo", collide, canDo)
                }) ;
            }
            //[end-20240422-renhaohsu-modify]//
        }
        else if ( collide == true && boxA.intersectsBox( boxB ) == false ) {
            collide = false ;
        }
    }, 1 ) ;

    // vrController.intervalList.push(interval_id);

    self.intervalList.push(interval_id);
}
