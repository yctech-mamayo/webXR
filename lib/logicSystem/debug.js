Logic.prototype.parse_debug_block = function(block, cb) {
    let blockType = block.getAttribute("type");
    let result = new Object();

    let self = this ;
    
    switch(blockType){

        case "debug_print":
            this.debug_print(block);
            break ;

        case "debug_comment":
            this.debug_comment();
            break ;
    }
    
    if(block.children[block.children.length-1].tagName == "next"){
        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
    }
    else{
        if(cb){
            cb();
        }
    }

    return result;

}

Logic.prototype.toString = function(data){
    
    let self = this;

    let result = "";

    if(data.type == "LIST"){
        data.value.forEach(element => {
            result += self.toString(element);
        })
    }
    else if(data.type == "VEC3"){
        value = data.value.x.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 6) : 6)));
        value = value.toString().split('e');
        result += +(value[0] + 'e' + (value[1] ? (+value[1] - 6) : -6));

        value = data.value.y.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 6) : 6)));
        value = value.toString().split('e');
        result += +(value[0] + 'e' + (value[1] ? (+value[1] - 6) : -6));

        value = data.value.z.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 6) : 6)));
        value = value.toString().split('e');
        result += +(value[0] + 'e' + (value[1] ? (+value[1] - 6) : -6));
    }
    else if(data.type == "NUM"){
        value = data.value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 6) : 6)));
        value = value.toString().split('e');
        result += +(value[0] + 'e' + (value[1] ? (+value[1] - 6) : -6));
    }
    else{
        result += data.value;
    }

    return result;
}

Logic.prototype.debug_print = function(block) {
    let data = this.parseBlock(block.children[0].children[0]).data;

    if(data != null){
        console.log(this.toString(data));
    }

}

Logic.prototype.debug_comment = function() {

    //Just For Comment, do nothing.

}

// Logic.prototype.debug_print = function( block ) {
//     let valueTag = block.children[ 0 ] ;
//     let nextTag = block.children[ 1 ] ;
//     switch ( valueTag.getAttribute( 'name' ) ) {
//         case 'TEXT' :
//             console.log( "Debug Print : ", valueTag.children[ 0 ].children[ 0 ].textContent ) ;
//             break ; 
//         default :
//             alert( "DEGUG BLOCK ERROR" ) ;
//     }
//     if ( nextTag && nextTag.tagName == 'next' ) {
//         this.parseBlock( nextTag.children[ 0 ] ) ;
//     }

//     // console.log( "56456", vrController.vrScene ) ;
//     // console.log( "56456", vrController.vrScene.getElementsByTagName( 'a-entity' ) ) ;
//     // console.log( "56456", vrController.vrScene.getElementsByTagName( 'a-entity' ) ) ;
// }


