Logic.prototype.parse_data_block = function(block, cb){
    let blockType = block.getAttribute("type");
    let result = new Object();
    
    let self = this;

    switch(blockType){

        //values
        case "data_boolean":
            result.data = this.data_boolean(block);
            break;

        case "data_number":
            result.data = this.data_number(block);
            break;

        case "data_angle":
            result.data = this.data_angle(block);
            break;

        case "data_constant":
            result.data = this.data_constant(block);
            break;

        case "data_colour_random":
            result.data = this.data_colour_random(block);
            break;

        case "data_colour_of":
            result.data = this.data_colour_of(block);
            break;

        case "data_colour_picker":
            result.data = this.data_colour_picker(block);
            break;
        
        case "data_colour_rgb":
            result.data = this.data_colour_rgb(block);
            break;

        case "data_colour_blend":
            result.data = this.data_colour_blend(block);
            break;

        case "data_text":
            result.data = this.data_text(block);
            break;

        case "data_text_join":
            result.data = this.data_text_join(block);
            break;

        case "data_vector3":
            result.data = this.data_vector3(block);
            break;
        
        case "data_get_axis_from_vector3":
            result.data = this.data_get_axis_from_vector3(block);
            break;

        case "data_length":
            result.data = this.data_length(block);
            break;

        //lists
        case "data_lists_create_empty":
            result.data = this.data_lists_create_empty(block);
            break;

        case "data_lists_create_list":
            this.data_lists_create_list(block);
            break;

        case "data_lists_create_with":
            result.data = this.data_lists_create_with(block);
            break;

        case "data_lists_add":
            this.data_lists_add(block);
            break;

        case "data_lists_insert_by_index":
            this.data_lists_insert_by_index(block);
            break;

        case "data_lists_delete_by_index":
            this.data_lists_delete_by_index(block);
            break;

        case "data_lists_replace_by_index":
            this.data_lists_replace_by_index(block);
            break;

        case "data_lists_get_by_index":
            result.data = this.data_lists_get_by_index(block);
            break;

        case "data_lists_pop_by_index":
            result.data = this.data_lists_pop_by_index(block);
            break;
        
        case "data_lists_index":
            result.data = this.data_lists_index(block);
            break;

        case "data_lists_contains":
            result.data = this.data_lists_contains(block);
            break;
    }

    if (block.children > 0){
        if(block.children[block.children.length-1].tagName == "next"){
            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
        }
        else{
            if(cb){
                cb();
            }
        }
    }

    return result;
}

Logic.prototype.data_boolean = function(block){
    let newData = new Object();
    if (block.children[0].textContent == "TRUE"){
        newData.value = true;
    }
    else if (block.children[0].textContent == "FALSE"){
        newData.value = false;
    }
    newData.type = block.children[0].getAttribute("name");

    return newData;
}

Logic.prototype.data_number = function(block){
    let newData = new Object();
    newData.value = parseFloat(block.children[0].textContent);
    newData.type = block.children[0].getAttribute("name");

    return newData;
}

Logic.prototype.data_angle = function(block){
    let newData = new Object();
    newData.value = parseFloat(block.children[0].textContent);
    newData.type = block.children[0].getAttribute("name");

    return newData;
}

Logic.prototype.data_constant = function(block){
    let CONSTANT = this.getContentByFieldName(block, "CONSTANT");
    if (CONSTANT == null) return;

    let newData = new Object();
    newData.type = "NUM";

    switch(CONSTANT){

        case "PI":
            newData.value = Math.PI;
            break;
        case "E":
            newData.value = Math.E;
            break;
        case "GOLDEN_RATIO":
            newData.value = (1+Math.sqrt(5))/2;
            break;
        case "SQRT2":
            newData.value = Math.sqrt(2);
            break;
        case "SQRT1_2":
            newData.value = Math.sqrt(1/2);
            break;
        case "INFINITY":
            newData.value = Infinity;
            break;

    }

    return newData;

}

Logic.prototype.data_colour_random = function(block){

    let randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());

    let newData = new Object();
    newData.value = "#"+randomColor.getHexString().toUpperCase();
    newData.type = "COLOUR";

    return newData;
}

Logic.prototype.data_colour_of = function(block){

    let MODEL = this.getContentByFieldName(block, "MODEL");
    if (MODEL == null) return;

    let MATERIAL = this.getContentByFieldName(block, "MATERIAL");
    if (MATERIAL == null || MATERIAL == "None") return;

    // let meshIndex = parseFloat(MATERIAL[0])*10 + parseFloat(MATERIAL[1]);
    // let materialIndex = parseFloat(MATERIAL[2])*10 + parseFloat(MATERIAL[3]);

    let target = document.getElementById(MODEL);
    if (target == null) return;


    let nodeMeshIndex = parseFloat(MATERIAL[0])*10 + parseFloat(MATERIAL[1]);
    let primitiveIndex = parseFloat(MATERIAL[2])*10 + parseFloat(MATERIAL[3]);

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
                        console.log('data.js: _data_colour_of: get nodeMeshIndex ', nodes[i] );
                        break;
                    }

                }

                //// 確認模型物件下的 meshes 下 特定 index 是否存在
                console.log('data.js: _data_colour_of: meshIndex = ', meshIndex   );
                if ( meshIndex >= 0 ){

                    let meshData = target.object3D.children[0].ModelJson.meshes[ meshIndex ];
                    console.log('data.js: _data_colour_of: get meshData ', meshIndex , meshData  );
                    if ( meshData ){
                        //// 確認模型物件下的 primitives 是否存在
                        if ( meshData.primitives  ){
                            let primitiveData = meshData.primitives[ primitiveIndex ];
                            //// 確認模型物件下的 primitives 下 material 是否有值
                            if ( primitiveData.material ){
                                //// 確認 materials 下是否有此 index
                                materialIndex = primitiveData.material;
                                console.log('data.js: _data_colour_of: materialIndex=' , materialIndex );
                            }
                        }
                    }
                }

            }
        }
    }

    
    let newData = new Object();
    newData.type = "COLOUR";
    if ( materialIndex >= 0 ){
        let targetMaterial;
        target.object3D.traverse(function(child){
            if (child.isMesh){
                //// 我們在 load GLTF 的時候把每一個 material name 最後面加上 _[index]，這邊找出最後一個來比較
                let nameSlice = child.material.name.split("_");
                let mIndex = nameSlice[ nameSlice.length - 1 ];
                if ( mIndex == materialIndex){
                    targetMaterial = child.material;
                    console.log('action.js: _data_colour_of: child.material =', child.material );
                }
            }
        });

        newData.value = "#"+targetMaterial.color.getHexString().toUpperCase();
        console.log('action.js: _data_colour_of: get material success color =', newData.value );
    } else {
        newData.value = "#C8C8C8";
        console.log('action.js: _data_colour_of: get material fail color =', newData.value );
    }

    // let targetMaterial;
    // target.object3D.traverse(function(child){
    //     if (child.isMesh){
    //         let mIndex = child.material.name.split("_")[1];
    //         if ( mIndex == materialIndex){
    //             targetMaterial = child.material;
    //             return;
    //         }
    //     }
    // });
    
    // let newData = new Object();
    // newData.value = "#"+targetMaterial.color.getHexString().toUpperCase();
    // newData.type = "COLOUR";

    return newData;
}

Logic.prototype.data_colour_picker = function(block){
    let COLOUR = this.getContentByFieldName(block, "COLOUR");
    if (COLOUR == null) return;

    let newData = new Object();
    newData.value = COLOUR;
    newData.type = "COLOUR";

    return newData;
}

Logic.prototype.data_colour_rgb = function(block){
    let COLOUR = this.getContentByFieldName(block, "COLOUR");
    if (COLOUR == null) return;

    let newData = new Object();
    newData.value = COLOUR;
    newData.type = "COLOUR";

    return newData;
}

Logic.prototype.data_colour_blend = function(block){

    let  color1Block = this.getBlockByValueName(block, "COLOUR1");
    if(color1Block == null) return;
    let color1Data = this.parseBlock(color1Block).data;
    if (color1Data == null || (color1Data.type != "TEXT" && color1Data.type != "COLOUR")) return;

    let  color2Block = this.getBlockByValueName(block, "COLOUR2");
    if(color2Block == null) return;
    let color2Data = this.parseBlock(color2Block).data;
    if (color2Data == null || (color2Data.type != "TEXT" && color2Data.type != "COLOUR")) return;

    let  ratioBlock = this.getBlockByValueName(block, "RATIO");
    if(ratioBlock == null) return;
    let ratioData = this.parseBlock(ratioBlock).data;
    if (ratioData == null || ratioData.type != "NUM") return;

    let ratio = Math.min(100, Math.max(0, ratioData.value))/100;
    console.log(ratio)

    let color1 = new THREE.Color(color1Data.value);
    let color2 = new THREE.Color(color2Data.value);
    console.log(color1)
    console.log(color2)

    let lerpColor = color1.lerp(color2, ratio);

    console.log(lerpColor)

    let newData = new Object();
    newData.value = "#"+lerpColor.getHexString().toUpperCase();
    newData.type = "COLOUR";

    return newData;


}

Logic.prototype.data_text = function(block){
    let newData = new Object();
    newData.value = block.children[0].textContent;
    newData.type = block.children[0].getAttribute("name");

    return newData;

}

Logic.prototype.data_text_join = function(block){

    let itemCount = parseInt(block.children[0].getAttribute("items"));
    let newData = new Object();
    newData.value = "";
    newData.type = "TEXT";

    

    for(let i = 0; i < itemCount; i++){
        let  addBlock = this.getBlockByValueName(block, "ADD"+i);
        if(addBlock){
            let item = this.parseBlock(addBlock).data;
            newData.value += this.toString(item);
        }
    }

    return newData;

}

Logic.prototype.data_vector3 = function(block){
    let newData = new Object();
    
    if (block.children[0].getAttribute("name") != "X") return null;
    let X = this.parseBlock(block.children[0].children[0]).data;
    if (X == null || X.type != "NUM") return null;

    if (block.children[1].getAttribute("name") != "Y") return null;
    let Y = this.parseBlock(block.children[1].children[0]).data;
    if (Y == null || Y.type != "NUM") return null;

    if (block.children[2].getAttribute("name") != "Z") return null;
    let Z = this.parseBlock(block.children[2].children[0]).data;
    if (Z == null || Z.type != "NUM") return null;

    newData.value = new THREE.Vector3(X.value,Y.value,Z.value);
    newData.type = "VEC3";
    
    return newData;

}

Logic.prototype.data_get_axis_from_vector3 = function(block){
    let AXIS = this.getContentByFieldName(block, "AXIS");
    if (AXIS == null) return;

    let  posBlock = this.getBlockByValueName(block, "POSITION");
    if(posBlock == null) return;
    let pos = this.parseBlock(posBlock).data;
    if (pos == null || pos.type != "VEC3") return;

    let newData = new Object();
    newData.type = "NUM";

    switch(AXIS){

        case "X":
            newData.value = pos.value.x;
            break;
        case "Y":
            newData.value = pos.value.y;
            break;
        case "Z":
            newData.value = pos.value.z;
            break;

    }

    return newData;

}

Logic.prototype.data_length = function(block){

    let  valueBlock = this.getBlockByValueName(block, "VALUE");
    if(valueBlock == null) return;
    let valueData = this.parseBlock(valueBlock).data;
    if (valueData == null || (valueData.type != "TEXT" && valueData.type != "LIST")) return;

    let newData = new Object();
    newData.value = valueData.value.length;
    newData.type = "NUM";

    return newData;

}

// Lists implementation

Logic.prototype.data_lists_create_empty = function(block){
    let newData = new Object();
    newData.value = [];
    newData.type = "LIST";

    return newData;
}

Logic.prototype.data_lists_create_list = function(block){

    let self = this;

    let variable = this.getContentByFieldName(block, "VAR");
    if (variable == null) return;

    let vL;

    this.variableList.forEach( ( v ) => {
        if ( v.name == variable ) {
            vL = v;
        }
    } ) ;

    let newData = new Object();
    newData.value = [];
    newData.type = "LIST";
    vL.data = newData ;

}

Logic.prototype.data_lists_create_with = function(block){
    
    let self = this;

    let newData = new Object();
    newData.value = [];
    newData.type = "LIST";

    let itemCount = parseInt(block.children[0].getAttribute("items"));
    let itemList = [];
    
    for(let i = 0; i < itemCount; i++){
        let  addBlock = this.getBlockByValueName(block, "ADD"+i);
        if (addBlock) itemList.push(addBlock);
    }

    for(let i = 0; i < itemList.length; i++){
        let item = this.parseBlock(itemList[i]).data;

        if(item){
            let newItem = new Object();
            newItem.value = item.value;
            newItem.type = item.type;

            newData.value.push(newItem);
        }
    }

    return newData;

}

Logic.prototype.data_lists_add = function(block){
    
    let self = this;

    let  itemBlock = this.getBlockByValueName(block, "ITEM");
    if(itemBlock == null) return;
    let item = this.parseBlock(itemBlock).data;
    if (item == null) return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    let newItem = new Object();
    newItem.value = item.value;
    newItem.type = item.type;

    list.value.push(newItem);

}

Logic.prototype.data_lists_insert_by_index = function(block){
    
    let self = this;

    let  itemBlock = this.getBlockByValueName(block, "TARGET");
    if(itemBlock == null) return;
    let item = this.parseBlock(itemBlock).data;
    if (item == null) return;

    let  indexBlock = this.getBlockByValueName(block, "INDEX");
    if(indexBlock == null) return;
    let index = this.parseBlock(indexBlock).data;
    if (index == null || index.type != "NUM") return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    if(index.value >=0 && index.value <= list.value.length){

        let newItem = new Object();
        newItem.value = item.value;
        newItem.type = item.type;

        list.value.splice(index.value, 0, newItem);

    }
}

Logic.prototype.data_lists_delete_by_index = function(block){
    
    let self = this;

    let  indexBlock = this.getBlockByValueName(block, "INDEX");
    if(indexBlock == null) return;
    let index = this.parseBlock(indexBlock).data;
    if (index == null || index.type != "NUM") return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    if(index.value >=0 && index.value < list.value.length){

        list.value.splice(index.value, 1);

    }

}

Logic.prototype.data_lists_replace_by_index = function(block){
    
    let self = this;

    let  itemBlock = this.getBlockByValueName(block, "TARGET");
    if(itemBlock == null) return;
    let item = this.parseBlock(itemBlock).data;
    if (item == null) return;

    let  indexBlock = this.getBlockByValueName(block, "INDEX");
    if(indexBlock == null) return;
    let index = this.parseBlock(indexBlock).data;
    if (index == null || index.type != "NUM") return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    if(index.value >=0 && index.value < list.value.length){

        let newItem = new Object();
        newItem.value = item.value;
        newItem.type = item.type;

        list.value.splice(index.value, 1, newItem);

    }

}

Logic.prototype.data_lists_get_by_index = function(block){
    
    let self = this;

    let  indexBlock = this.getBlockByValueName(block, "INDEX");
    if(indexBlock == null) return;
    let index = this.parseBlock(indexBlock).data;
    if (index == null || index.type != "NUM") return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    let newData = new Object();
    if(index.value >=0 && index.value < list.value.length){

        newData = list.value[index.value];

    }

    return newData;

}

Logic.prototype.data_lists_pop_by_index = function(block){
    
    let self = this;

    let  indexBlock = this.getBlockByValueName(block, "INDEX");
    if(indexBlock == null) return;
    let index = this.parseBlock(indexBlock).data;
    if (index == null || index.type != "NUM") return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    let newData = new Object();
    if(index.value >=0 && index.value < list.value.length){

        newData = list.value[index.value];
        list.value.splice(index.value, 1)

    }

    return newData;

}

Logic.prototype.data_lists_index = function(block){
    
    let self = this;

    let  itemBlock = this.getBlockByValueName(block, "TARGET");
    if(itemBlock == null) return;
    let item = this.parseBlock(itemBlock).data;
    if (item == null) return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    let tmpList = [];
    list.value.forEach(element => {
        tmpList.push(element.value);
    });

    let newData = new Object();
    newData.type = "NUM";
    
    newData.value = tmpList.indexOf(item.value);

    return newData;
}

Logic.prototype.data_lists_contains = function(block){
    
    let self = this;

    let  itemBlock = this.getBlockByValueName(block, "TARGET");
    if(itemBlock == null) return;
    let item = this.parseBlock(itemBlock).data;
    if (item == null) return;

    let  listBlock = this.getBlockByValueName(block, "VALUE");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;

    let tmpList = [];
    list.value.forEach(element => {
        tmpList.push(element.value);
    });

    let newData = new Object();
    newData.type = "BOOL";
    
    let test = tmpList.indexOf(item.value);
    if (test == -1){
        newData.value = false;
    }
    else{
        newData.value = true;
    }

    return newData;
}
