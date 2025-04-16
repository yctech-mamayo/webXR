export function handleFusingEvent( event ){

    //20191023-start-thonsha-mod
    event.preventDefault();
    // console.log('I was fusing, this.object3D = ', this.object3D , event );
    if (event.target == event.currentTarget){
        // console.log('I was fusing, this.object3D = ', this.object3D , event );.
        if (this.object3D.behav){
            delay = this.object3D.behav[0].display*1000+5;
            // console.log("======= delay :"+delay+" =====");
            let cursor = document.getElementById("cursor_main");
            cursor.setAttribute('cursor', "fuseTimeout:"+ delay);
            cursor.setAttribute('animation__mouseenter', "dur: "+delay );
        }

        if (this.object3D.main_type == "button"){
            delay = 3*1000+5;
            // console.log("======= delay :"+delay+" =====");
            let cursor = document.getElementById("cursor_main");
            cursor.setAttribute('cursor', "fuseTimeout:"+ delay);
            cursor.setAttribute('animation__mouseenter', "dur: "+delay );
        }

    }   

}	

export function handleClickEvent( event ) {

    event.preventDefault();
    console.log('I was clicked, this.object3D = ', this.object3D , event );
    if (event.target == event.currentTarget){
        // console.log('I was clicked, this.object3D = ', this.object3D , event );
        
        if ( this.object3D.behav ){

            if (!vrController.triggerEnable){
                console.log("VRFunc.js: _clickEvent: please wait three second for _triggerEanble");
                return;
            }

            //// deal the group	
            //// 找出此次觸發事件中含有 group 的部份
            for (let i = 0; i < this.object3D.tWorldVisiblebehav.length; i++ ){
                if (this.object3D.behav[i].group){
                    //// 找出所有場上物件中，掛有觸發事件的物件
                    for ( let j = 0; j < vrController.makarObjects.length; j++ ){
                        let makarObject = vrController.makarObjects[j];
                        if (makarObject.object3D){
                            if (makarObject.object3D.makarObject && makarObject.object3D.behav ){

                                for (let k = 0; k < makarObject.object3D.behav.length; k++ ){
                                    //// 找出除了自己以外掛有相同 group 的物件
                                    if (makarObject.object3D.behav[k].group == this.object3D.behav[i].group &&  makarObject.object3D != this.object3D ){
                                        // console.log(" ************* " , i , j , k , makarObject.object3D.behav[k] , this.object3D.behav[i].group );
                                        let groupObj = document.getElementById(makarObject.object3D.behav[k].obj_id);
                                        vrController.hideGroupObjectEvent(groupObj);
                                    }
                                }

                            }
                        }
                    }
                }
            }




            let reset = false;
            for(let i=0;i<this.object3D.behav.length;i++){
                if (this.object3D.behav[i].behav_type == "CloseAndResetChildren"){
                    reset = true;
                }
            }

            for(let i=0;i<this.object3D.behav.length;i++){
                if (this.object3D.behav[i].behav_type != "CloseAndResetChildren"){
                   //[start-20230919-howardhsu-modify]//
                    if(touchObject.behav[i].behav_type == "ShowQuiz"){
                            
                        //// 顯示 quiz 之前，先判斷 "瀏覽器本次載入場景後" 是否已經遊玩
                        if(touchObject.behav[i].played == false){
                            touchObject.behav[i].played = true	
                            vrController.triggerEvent( touchObject.behav[i], reset, touchObject )
                        } else {
                            console.log('VRFunc.js: _setupFunction: endEvent:  Quiz had been played.', touchObject.behav[i].played)
                        }

                    } else {
                        vrController.triggerEvent( touchObject.behav[i], reset, self.GLRenderer, null, touchObject );
                    }
                    
                }
            }            
        }

        // if (this.object3D.main_type == "button"){
        // 	console.log("VRFunc.js: button click " , this.object3D );
        // 	vrController.pushButton(this);
        // }
        // [end-20230920-howardhsu-modify]//	
    }
    //20191023-end-thonsha-mod

}