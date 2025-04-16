Logic.prototype.parse_variables_block = function( block, cb ) {
    let blockType = block.getAttribute("type") ;
    let result = new Object() ;

    switch( blockType ) {
        // each function has to return newData = { type, value } object 
        case "variables_set" :
            result.data = this.variables_set( block, cb ) ;
            break ;

        case "variables_get" :
            result.data = this.variables_get( block ) ;
            break ;
    }

    return result ;
}

// Assign variable
Logic.prototype.variables_set = function( block, cb ) {
    // console.log( this.variableList ) ;

    let newData = new Object() ;

    let blockVar = this.getContentByFieldName( block, 'VAR' ) ;
    if( blockVar == null ) return;

    let valueBlock = this.getBlockByValueName( block, 'VALUE' ) ;
    if( valueBlock == null ) return;

    this.variableList.forEach( ( v ) => {
        // console.log( v ) ;
        // Set variable to some value or nothing
        if ( v.name == blockVar ) {
            v.data = this.parseBlock( valueBlock ).data ;
            newData = v.data ;
        }
    } ) ;

    // console.log( this.variableList ) ;
    if ( block.children[ block.children.length - 1 ].tagName == 'next' ) {
        this.parseBlock( block.children[ block.children.length - 1 ].children[ 0 ], cb ) ;
    }
    else {
        if ( cb ) cb() ;
    }

    return newData ;
} ;

Logic.prototype.variables_get = function( block ) {
    let newData = new Object ;

    this.variableList.forEach( ( v ) => {
        if ( v.name == block.children[ 0 ].textContent ) {
            newData = v.data ;
        }
    } ) ;

    return newData ;
} ;



