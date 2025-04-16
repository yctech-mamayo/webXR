Logic.prototype.parse_actions_block = function(block, cb){
    
    let self = this
    
    let blockType = block.getAttribute("type");
    let result = new Object();
    
    let waitEnd = null;
    switch(blockType){

        // Material
        case "actions_set_color":
            self.actions_set_color(block);
            break;

        case "actions_set_visibility":
            self.actions_set_visibility(block);
            break;
            
        case "actions_set_opacity":
            self.actions_set_opacity(block);
            break;

        //Animation
        case "actions_set_animation":       // old version
            self.actions_set_animation(block);
            break;

        case "actions_set_animation_by_id": // new version
            self.actions_set_animation_by_id(block);
            break;

        //Sound
        case "actions_play_sound_until_finished":
            waitEnd = self.actions_play_sound_until_finished(block, cb);
            break;

        case "actions_play_sound":
            self.actions_play_sound(block);
            break;

        case "actions_stop_sound":
            self.actions_stop_sound(block);
            break;

        //Video
        case "actions_play_video_until_finished":
            waitEnd = self.actions_play_video_until_finished(block, cb);
            break;

        case "actions_play_video":
            self.actions_play_video(block);
            break;

        case "actions_pause_video":
            self.actions_pause_video(block);
            break;

        case "actions_stop_video":
            self.actions_stop_video(block);
            break;
        
        //Light
        case "actions_set_light_color":
            self.actions_set_light_color(block);
            break;

        case "actions_set_light_intensity":
            self.actions_set_light_intensity(block);
            break;

        //Text
        case "actions_set_text":
            waitEnd = self.actions_set_text(block, cb);
            break;

        case "actions_set_text_color":
            waitEnd = self.actions_set_text_color(block, cb);
            break;

        case "actions_set_text_bgcolor":
            waitEnd = self.actions_set_text_bgcolor(block, cb);
            break;
    }

    if(block.children[block.children.length-1].tagName == "next"){
        if(waitEnd){
        }
        else{
            self.parseBlock(block.children[block.children.length-1].children[0], cb);
        }
        
    }
    else{
        if(cb){
            if(waitEnd){
            }
            else{
                cb();
            }
        }
    }

    return result;
}

Logic.prototype.actions_set_color = function(block){
    
    let MODEL = this.getContentByFieldName(block, "MODEL");
    if (MODEL == null) return;

    let MATERIAL = this.getContentByFieldName(block, "MATERIAL");
    if (MATERIAL == null || MATERIAL == "None") return;

    let  colorBlock = this.getBlockByValueName(block, "COLOUR");
    if(colorBlock == null) return;
    let colorData = this.parseBlock(colorBlock).data;
    if (colorData == null || (colorData.type != "TEXT" && colorData.type != "COLOUR")) return; 

    let nodeMeshIndex = parseFloat(MATERIAL[2])*10 + parseFloat(MATERIAL[3]);
    let primitiveIndex = parseFloat(MATERIAL[0])*10 + parseFloat(MATERIAL[1]);

    let target = document.getElementById(MODEL);
    if (target == null) return;

    console.log(' --- ', target.object3D , MATERIAL  );

    //// 當前紀錄要調整材質的方式 很奇特：
    //// 第一個數值是： nodes 下面，撇除不帶有 mesh 的項目，的index，此 node 帶有的 「mesh」代表 meshes 下的 index
    //// 第二個數值是： meshes 下的 mesh，底下的 primitives 下的 material index 
    
    //// 確認模型物件下面的scene
    let meshIndex = -1;
    let materialIndex = -1;
    if ( target.object3D.children.length > 0 ){
        //// 確認模型物件下的 json data 是否存在
        if ( target.object3D.children[0].ModelJson ){
            //// 確認模型物件下的 json data 底下的 meshes, materials 是否存在
            if ( target.object3D.children[0].ModelJson.meshes && target.object3D.children[0].ModelJson.materials && target.object3D.children[0].ModelJson.nodes ){

                //// 查找「nodes」底下「帶有 mesh」的node
                let nodes = target.object3D.children[0].ModelJson.nodes;
                let nodeMeshCount = -1;
                for ( let i = 0; i < nodes.length; i++ ){
                    //// 假如此 node 帶有 mesh ，加一
                    if ( typeof( nodes[i].mesh ) == 'number' ){
                        nodeMeshCount++;
                    }
                    //// 確認是否為「對應 index 」
                    if ( nodeMeshIndex == nodeMeshCount ){
                        meshIndex = nodes[i].mesh;
                        console.log('action.js: _actions_set_color: get nodeMeshIndex ', nodes[i] );
                        break;
                    }

                }

                //// 確認模型物件下的 meshes 下 特定 index 是否存在
                console.log('action.js: _actions_set_color: meshIndex = ', meshIndex   );
                if ( meshIndex >= 0 ){

                    let meshData = target.object3D.children[0].ModelJson.meshes[ meshIndex ];
                    console.log('action.js: _actions_set_color: get meshData ', meshIndex , meshData  );
                    if ( meshData ){
                        //// 確認模型物件下的 primitives 是否存在
                        if ( meshData.primitives  ){
                            let primitiveData = meshData.primitives[ primitiveIndex ];
                            //// 確認模型物件下的 primitives 下 material 是否有值
                            if ( primitiveData.material >= 0 ){
                                //// 確認 materials 下是否有此 index
                                materialIndex = primitiveData.material;

                                console.log('action.js: _actions_set_color: materialIndex=' , materialIndex );
                            }
                        }
                    }
                }

            }
        }
    }

    if ( materialIndex >= 0 ){

        target.object3D.traverse(function(child){
            if (child.isMesh){
                //// 確保是在「同一隻模型底下」
                if ( child.el == target.object3D.el ){
                    //// 我們在 load GLTF 的時候把每一個 material name 最後面加上 _[index]，這邊找出最後一個來比較
                    let nameSlice = child.material.name.split("_");
                    let mIndex = nameSlice[ nameSlice.length - 1 ];
                    if ( mIndex == materialIndex && child.meshIdx == meshIndex ){
                        child.material = child.material.clone();
                        child.material.color = new THREE.Color(colorData.value);
                        // console.log('action.js: _actions_set_color: child.material =', child.material );
                    }
                }
            }
        });

    }

}

Logic.prototype.actions_set_visibility = function(block){

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  boolBlock = this.getBlockByValueName(block, "BOOL");
    if(boolBlock == null) return;
    let bool = this.parseBlock(boolBlock).data;
    if (bool == null || bool.type != "BOOL") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    // target.object3D.visible = bool.value;
    
    target.setAttribute("visible", bool.value );
    target.object3D.traverse(function(child){
        if (child.type=="Group"){
            if (child.el.getAttribute("visible")){
                if(child.el.object3D.behav){
                    child.el.setAttribute('class', "clickable" );
                }
            }
        }
    });

}

Logic.prototype.actions_set_opacity = function(block){

    let MODEL = this.getContentByFieldName(block, "MODEL");
    if (MODEL == null) return;

    let MATERIAL = this.getContentByFieldName(block, "MATERIAL");
    if (MATERIAL == null || MATERIAL == "None") return;

    let  percentBlock = this.getBlockByValueName(block, "PERCENT");
    if(percentBlock == null) return;
    let percentData = this.parseBlock(percentBlock).data;
    if (percentData == null || percentData.type != "NUM") return; 

    // let meshIndex = parseFloat(MATERIAL[0])*10 + parseFloat(MATERIAL[1]);
    // let materialIndex = parseFloat(MATERIAL[2])*10 + parseFloat(MATERIAL[3]);

    // let target = document.getElementById(MODEL);
    // if (target == null) return;

    // target.object3D.traverse(function(child){
    //     if (child.isMesh){

    //         // let mIndex = child.material.name.split("_")[1];
    //         let nameSlice = child.material.name.split("_");
    //         let mIndex = nameSlice[ nameSlice.length - 1 ];

    //         if ( mIndex == materialIndex){
                
    //             child.material.transparent = true;
    //             child.material.opacity = percentData.value / 100;

    //         }
    //     }
    // });


    let nodeMeshIndex = parseFloat(MATERIAL[2])*10 + parseFloat(MATERIAL[3]);
    let primitiveIndex = parseFloat(MATERIAL[0])*10 + parseFloat(MATERIAL[1]);

    let target = document.getElementById(MODEL);
    if (target == null) return;

    console.log(' --- ', target.object3D , MATERIAL  );

    //// 當前紀錄要調整材質的方式 很奇特：
    //// 第一個數值是： nodes 下面，撇除不帶有 mesh 的項目，的index，此 node 帶有的 「mesh」代表 meshes 下的 index
    //// 第二個數值是： meshes 下的 mesh，底下的 primitives 下的 material index 
    
    //// 確認模型物件下面的scene
    let meshIndex = -1;
    let materialIndex = -1;
    if ( target.object3D.children.length > 0 ){
        //// 確認模型物件下的 json data 是否存在
        if ( target.object3D.children[0].ModelJson ){
            //// 確認模型物件下的 json data 底下的 meshes, materials 是否存在
            if ( target.object3D.children[0].ModelJson.meshes && target.object3D.children[0].ModelJson.materials && target.object3D.children[0].ModelJson.nodes ){

                //// 查找「nodes」底下「帶有 mesh」的node
                let nodes = target.object3D.children[0].ModelJson.nodes;
                let nodeMeshCount = -1;
                for ( let i = 0; i < nodes.length; i++ ){
                    //// 假如此 node 帶有 mesh ，加一
                    if ( typeof( nodes[i].mesh ) == 'number' ){
                        nodeMeshCount++;
                    }
                    //// 確認是否為「對應 index 」
                    if ( nodeMeshIndex == nodeMeshCount ){
                        meshIndex = nodes[i].mesh;
                        console.log('action.js: _actions_set_opacity: get nodeMeshIndex ', nodes[i] );
                        break;
                    }

                }

                //// 確認模型物件下的 meshes 下 特定 index 是否存在
                console.log('action.js: _actions_set_opacity: meshIndex = ', meshIndex   );
                if ( meshIndex >= 0 ){

                    let meshData = target.object3D.children[0].ModelJson.meshes[ meshIndex ];
                    console.log('action.js: _actions_set_opacity: get meshData ', meshIndex , meshData  );
                    if ( meshData ){
                        //// 確認模型物件下的 primitives 是否存在
                        if ( meshData.primitives  ){
                            let primitiveData = meshData.primitives[ primitiveIndex ];
                            //// 確認模型物件下的 primitives 下 material 是否有值
                            if ( primitiveData.material >= 0 ){
                                //// 確認 materials 下是否有此 index
                                materialIndex = primitiveData.material;

                                console.log('action.js: _actions_set_opacity: materialIndex=' , materialIndex );
                            }
                        }
                    }
                }

            }
        }
    }

    if ( materialIndex >= 0 ){

        target.object3D.traverse(function(child){
            if (child.isMesh){
                let nameSlice = child.material.name.split("_");
                let mIndex = nameSlice[ nameSlice.length - 1 ];
                if ( mIndex == materialIndex && child.meshIdx == meshIndex ){
                    child.material = child.material.clone();
                    child.material.transparent = true;
                    child.material.opacity = percentData.value / 100;
                    child.material.blending = THREE.NormalBlending;

                    console.log('action.js: _actions_set_opacity: child.material =', child.material );
                }
            }
        });

    }


}

Logic.prototype.actions_set_animation = function(block){

    // some problems in editor, do later
    
    let GAME_OBJECT = this.getContentByFieldName(block, "GAME_OBJECT");
    if (GAME_OBJECT == null) return;

    let ANIMATION = this.getContentByFieldName(block, "ANIMATION");
    if (ANIMATION == null) return;

    let target = document.getElementById(GAME_OBJECT);
    if (target == null) return;

    let mainAnimation;
    if (ANIMATION == "None"){ 
        target.object3D.children[0].animationSlices[0].uid = -1;
    }
    else{

        //// 動畫分為兩塊： 原生模型帶有、透過makar切割出來的部份

        for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
            if (target.object3D.children[0].animationSlices[i].name == ANIMATION){
                mainAnimation = target.object3D.children[0].animationSlices[i];
            }
        }

        if ( mainAnimation ){
            target.setAttribute("animation-mixer", "clip: "+mainAnimation.animationName);
            target.object3D.children[0].animationSlices[0].loop = mainAnimation.uid;
            target.object3D.children[0].animationSlices[0].uid = mainAnimation.uid;
            target.object3D.children[0].animationSlices[0].changed = true;
            target.object3D.children[0].animationSlices[0].reset = true;
        }
        
    }

}

//// 2022 0112 ：當前尚未上線，之後編輯器更新之後再處理 
Logic.prototype.actions_set_animation_by_id = function(block){

    // some problems in editor, do later
    
    let GAME_OBJECT = this.getContentByFieldName(block, "GAME_OBJECT");
    if (GAME_OBJECT == null) return;

    let ANIMATION = this.getContentByFieldName(block, "ANIMATION");
    if (ANIMATION == null) return;

    let TIMES = this.getContentByFieldName(block, "TIMES");
    if (TIMES == null) return;

    let target = document.getElementById(GAME_OBJECT);
    if (target == null) return;

    var mainAnimation;
    if (ANIMATION == "None"){ 
        target.object3D.children[0].animationSlices[0].uid = -1;
    }
    else{
        for(let i=1;i<target.object3D.children[0].animationSlices.length;i++){
            if (target.object3D.children[0].animationSlices[i].uid == ANIMATION){
                mainAnimation = target.object3D.children[0].animationSlices[i];
            }
        }

        target.setAttribute("animation-mixer", "clip: "+mainAnimation.animationName);
        target.object3D.children[0].animationSlices[0].uid = mainAnimation.uid;
        target.object3D.children[0].animationSlices[0].changed = true;

        if (TIMES == "LOOP"){ 
            target.object3D.children[0].animationSlices[0].loop = mainAnimation.uid;
            target.object3D.children[0].animationSlices[0].reset = true;
        }
        else if (TIMES == "ONCE"){
            // target.object3D.children[0].animationSlices[0].reset = true;
        }
        
       
    }

}

Logic.prototype.actions_play_sound_until_finished = function(block, cb){

    let  objBlock = this.getBlockByValueName(block, "SOUND");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    //// 判斷「是否可見」來決定「是否播放聲音」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        target.setAttribute("sound","loop:false");
        target.components.sound.playSound();

        let soundEnd = function(evt){
            target.components.sound.stopSound();
            target.removeEventListener("sound-ended", soundEnd);
            target.setAttribute("sound","loop:true");

            if(block.children[block.children.length-1].tagName == "next"){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
            }
            else{
                if(cb){
                    cb();
                }
            }
            
        }

        target.addEventListener('sound-ended', soundEnd);
        return true;

    }

    

}

Logic.prototype.actions_play_sound = function(block){

    let  objBlock = this.getBlockByValueName(block, "SOUND");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;


    //// 判斷「是否可見」來決定「是否播放聲音」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        // target.components.sound.playSound();

        //[start-20240425-renhaohsu-add]//
        //// 如果聲音物件已經在播放，不呼叫playSound (否則Aframe會一直說它components:sound:warn)
        let audioSource = target.components.sound.pool.children.find( c => c.el == target);
        if(audioSource){            
            if (!audioSource.isPlaying) {
                target.components.sound.playSound();
            }
        } else {
            target.components.sound.playSound();
        }
        //[end-20240425-renhaohsu-add]//
    }
    
}

Logic.prototype.actions_stop_sound = function(block){

    let  objBlock = this.getBlockByValueName(block, "SOUND");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    //// 判斷「是否可見」來決定「是否暫停聲音」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        target.components.sound.stopSound();
    }

}

Logic.prototype.actions_play_video_until_finished = function(block, cb){

    let  objBlock = this.getBlockByValueName(block, "VIDEO");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    //// 判斷「是否可見」來決定「是否播放影片」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        let id = target.getAttribute("src");
        if(id!=undefined){
            id = id.split("#").pop();
            let v = document.getElementById(id);
            if (v instanceof HTMLElement){
                v.loop = false;
                v.muted = false;
                v.play();

                let videoEnd = function(evt){
                    v.currentTime = 0;
                    v.pause();

                    v.removeEventListener("ended", videoEnd);
                    v.loop = true;
        
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb();
                        }
                    }
                    
                }

                v.addEventListener('ended', videoEnd);
                return true;
            }
        }
    }

}

Logic.prototype.actions_play_video = function(block){

    let  objBlock = this.getBlockByValueName(block, "VIDEO");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    // console.log('action.js: _actions_play_video: target ', target );

    //// 判斷「是否可見」來決定「是否播放影片」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        let id = target.getAttribute("src");
        if(id!=undefined){
            id = id.split("#").pop();
            let v = document.getElementById(id);
            if (v instanceof HTMLElement){
                v.loop = true;
                v.muted = false;
                v.play();
            }
        }
    }
			
}

Logic.prototype.actions_pause_video = function(block){

    let  objBlock = this.getBlockByValueName(block, "VIDEO");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    //// 判斷「是否可見」來決定「是否暫停影片」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        let id = target.getAttribute("src");
        if(id!=undefined){
            id = id.split("#").pop();
            let v = document.getElementById(id);
            if (v instanceof HTMLElement){
                v.pause();
            }
        }
    }

}

Logic.prototype.actions_stop_video = function(block){

    let  objBlock = this.getBlockByValueName(block, "VIDEO");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    //// 判斷「是否可見」來決定「是否停止影片」
    let self = this;
    let targetWorldVisible = self.checkObjectWorldVisible( target );

    if( targetWorldVisible == true ){
        let id = target.getAttribute("src");
        if(id!=undefined){
            id = id.split("#").pop();
            let v = document.getElementById(id);
            if (v instanceof HTMLElement){
                v.currentTime = v.duration;
                v.loop = false;
            }
        }
    }

}

Logic.prototype.actions_set_light_color = function(block){

    let  objBlock = this.getBlockByValueName(block, "LIGHT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  colorBlock = this.getBlockByValueName(block, "COLOUR");
    if(colorBlock == null) return;
    let colorData = this.parseBlock(colorBlock).data;
    if (colorData == null || (colorData.type != "TEXT" && colorData.type != "COLOUR")) return; 

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    target.object3D.children[0].color = new THREE.Color(colorData.value);

}

Logic.prototype.actions_set_light_intensity = function(block){

    let  objBlock = this.getBlockByValueName(block, "LIGHT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  percentBlock = this.getBlockByValueName(block, "PERCENT");
    if(percentBlock == null) return;
    let percentData = this.parseBlock(percentBlock).data;
    if (percentData == null || percentData.type != "NUM") return; 

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    target.object3D.children[0].intesity = percentData.value / 100;
}

Logic.prototype.actions_set_text = function(block, cb){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "TEXT_ITEM");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  textBlock = this.getBlockByValueName(block, "TEXT");
    if(textBlock == null) return;
    let textData = this.parseBlock(textBlock).data;
    // if (textData == null || textData.type != "TEXT") return;
    if (textData == null) return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let new_str = self.toString( textData );

    if(target.children[0].getAttribute("value") != new_str){
        target.children[0].components.text.textMesh.children.length = 0;
        target.children[0].object3D.children.length = 1;
        // target.children[0].setAttribute("value", textData.value);
        target.children[0].setAttribute("value", new_str);

        let textList = new_str.split('\n');
        let longestSplit = 0;
        const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
        const isChinese = (str) => REGEX_CHINESE.test(str);
        for (let i = 0; i < textList.length;i++) {
            let textLength = 0;
            for (let j = 0; j <  textList[i].length; j++) {
                if(isChinese(textList[i][j])){  // chinese
                    textLength += 1.6;
                }
                else if(textList[i][j] == textList[i][j].toUpperCase() && textList[i][j] != textList[i][j].toLowerCase()){ // upper-case
                    textLength += 1;
                }
                else if(textList[i][j] == textList[i][j].toLowerCase() && textList[i][j] != textList[i][j].toUpperCase()){ // lower-case
                    // textLength += 0.85;
                    textLength += 1.0;
                }
                else if(!isNaN(textList[i][j] * 1)){ //numeric
                    textLength += 1;
                }
                else{ // other symbols
                    textLength += 1.25;
                }
                
            }
            // console.log( textList[i], textLength);
            if (textLength > longestSplit) longestSplit =textLength;
        }
        target.children[0].setAttribute("wrap-count", longestSplit + 1 );


        let updateEnd = function(evt){

            target.children[0].removeEventListener("geometry-set", updateEnd);

            if(block.children[block.children.length-1].tagName == "next"){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
            }
            else{
                if(cb){
                    cb();
                }
            }
            
        }

        target.children[0].addEventListener('geometry-set', updateEnd);
        return true;
    }
    
    

}

Logic.prototype.actions_set_text_color = function(block, cb){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "TEXT_ITEM");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  colorBlock = this.getBlockByValueName(block, "COLOUR");
    if(colorBlock == null) return;
    let colorData = this.parseBlock(colorBlock).data;
    if (colorData == null || (colorData.type != "TEXT" && colorData.type != "COLOUR")) return; 

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    if(target.children[0].getAttribute("color") != colorData.value){
        target.children[0].components.text.textMesh.children.length = 0;
        target.children[0].object3D.children.length = 1;
        target.children[0].setAttribute("color", colorData.value);

        let updateEnd = function(evt){

            target.children[0].removeEventListener("geometry-set", updateEnd);

            if(block.children[block.children.length-1].tagName == "next"){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
            }
            else{
                if(cb){
                    cb();
                }
            }
            
        }

        target.children[0].addEventListener('geometry-set', updateEnd);
        return true;
    }

}

Logic.prototype.actions_set_text_bgcolor = function(block, cb){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "TEXT_ITEM");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  colorBlock = this.getBlockByValueName(block, "COLOUR");
    if(colorBlock == null) return;
    let colorData = this.parseBlock(colorBlock).data;
    if (colorData == null || (colorData.type != "TEXT" && colorData.type != "COLOUR")) return; 

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let tmpColor = new THREE.Color(colorData.value);
    let tmpColorString = tmpColor.r + "," + tmpColor.g + "," + tmpColor.b + "," + "1";

    if(target.children[0].getAttribute("backcolor") != tmpColorString){
        // if ( target.children[0].components.text ){
        //     if ( target.children[0].components.text.textMesh ){
        //         target.children[0].components.text.textMesh.children.length = 0;
        //     }
        // }
        target.children[0].components.text.textMesh.children.length = 0;
        target.children[0].object3D.children.length = 1;
        target.children[0].setAttribute("backcolor", tmpColorString);

        let updateEnd = function(evt){

            target.children[0].removeEventListener("geometry-set", updateEnd);

            if(block.children[block.children.length-1].tagName == "next"){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
            }
            else{
                if(cb){
                    cb();
                }
            }
            
        }

        target.children[0].addEventListener('geometry-set', updateEnd);
        return true;
    }

}