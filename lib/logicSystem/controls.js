Logic.prototype.parse_controls_block = function(block, cb) {
    let blockType = block.getAttribute("type");
    let result = new Object();
    
    switch(blockType){

        // loops
        case "controls_repeat_forever":
            result.tl = this.controls_repeat_forever(block, cb);
            break;

        case "controls_repeat":
            result.tl = this.controls_repeat(block, cb);
            break;

        case "controls_for":
            result.tl = this.controls_for(block, cb);
            break;

        case "controls_whileUntil":
            result.tl = this.controls_whileUntil(block, cb);
            break;

        case "controls_forEach":
            result.tl = this.controls_forEach(block, cb);
            break;

        case "controls_flow_statements":
            result.tl = this.controls_flow_statements(block, cb);
            break;

        // if
        case "controls_if":
            result.tl = this.controls_if(block, cb);
            break;

        case "controls_ifelse":
            result.tl = this.controls_ifelse(block, cb);
            break;

        // other
        case "controls_wait_time":
            result.tl = this.controls_wait_time(block, cb);
            break;

        case "controls_run_parallel":
            result.tl = this.controls_run_parallel(block,cb);
            break;

    }
    if (blockType != "controls_repeat_forever"){
        if(block.children[block.children.length-1].tagName == "next"){
            if(result.tl){
            }
            else{
                this.parseBlock(block.children[block.children.length-1].children[0], cb);
            }
        }
        else{
            if(cb){
                if(result.tl){
                }
                else{
                    cb();
                }
            }
        }
    }
   

    return result;
}

Logic.prototype.controls_repeat_forever = function(block, cb) {
    
    let self = this;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;
    
    // let tl = gsap.timeline({repeat: -1});
    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    tl.to(gsapEmpty, {
        delay: 0, 
        onStart: function(){
            self.parseBlock(doBlock, function(flow=null){
                if ( flow==null || flow=="CONTINUE" ){
                    tl.restart();
                }
                else if(flow == "BREAK"){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb();
                        }
                    }
                }
            });
        }
    });

    return tl;

}

Logic.prototype.controls_repeat = function(block, cb) {    
    
    let self = this;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;

    let  timesBlock = this.getBlockByValueName(block, "TIMES");
    if(timesBlock == null) return;
    let repeats = this.parseBlock(timesBlock).data;
    if (repeats == null || repeats.type != "NUM") return;

    let times = Math.max(0, repeats.value)-1;

    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    tl.to(gsapEmpty, {
        delay: 0, 
        onStart: function(){
            self.parseBlock(doBlock, function(flow=null){
                if ( flow==null || flow=="CONTINUE" ){
                    if( times > 0){
                        times -= 1;
                        tl.restart();
                    }
                    else{
                        if(block.children[block.children.length-1].tagName == "next"){
                            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                        }
                        else{
                            if(cb){
                                cb();
                            }
                        }
                    
                    }
                }
                else if(flow == "BREAK"){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb();
                        }
                    }
                }
                
            });
        }
    });

    return tl;

}

Logic.prototype.controls_for = function(block, cb) {
    
    let self = this;
    
    let variable = this.getContentByFieldName(block, "VAR");
    if (variable == null) return;

    let  fromBlock = this.getBlockByValueName(block, "FROM");
    if(fromBlock == null) return;
    let from = this.parseBlock(fromBlock).data;
    if (from == null || from.type != "NUM") return;
    
    let  toBlock = this.getBlockByValueName(block, "TO");
    if(toBlock == null) return;
    let to = this.parseBlock(toBlock).data;
    if (to == null || to.type != "NUM") return;

    let  byBlock = this.getBlockByValueName(block, "BY");
    if(byBlock == null) return;
    let by = this.parseBlock(byBlock).data;
    if (by == null || by.type != "NUM") return;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;

    let i = from.value;
    let vi;

    this.variableList.forEach( ( v ) => {
        if ( v.name == variable ) {
            vi = v;
        }
    } ) ;

    let newData = new Object();
    newData.value = i;
    newData.type = "NUM"

    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    if ( (i <= to.value && by.value > 0) || (i >= to.value && by.value < 0) ){
        vi.data = newData;
        tl.to(gsapEmpty, {
            delay: 0, 
            onStart: function(){
                self.parseBlock(doBlock, function(flow=null){
                    if ( flow==null || flow=="CONTINUE" ){
                        i += by.value;
                        if ( (i <= to.value && by.value > 0) || (i >= to.value && by.value < 0) ){
                            vi.data.value = i;
                            tl.restart();
                        }
                        else{
                            if(block.children[block.children.length-1].tagName == "next"){
                                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                            }
                            else{
                                if(cb){
                                    cb();
                                }
                            }

                        }
                    }
                    else if(flow == "BREAK"){
                        if(block.children[block.children.length-1].tagName == "next"){
                            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                        }
                        else{
                            if(cb){
                                cb();
                            }
                        }
                    }
                });
            }
        });

    }
    else{
        if(block.children[block.children.length-1].tagName == "next"){
            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
        }
        else{
            if(cb){
                cb();
            }
        }

    }

    return tl;



}

Logic.prototype.controls_whileUntil = function(block, cb) {
    
    let self = this;

    let mode = this.getContentByFieldName(block, "MODE");
    if (mode == null) return;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;

    let  boolBlock = this.getBlockByValueName(block, "BOOL");
    if(boolBlock == null) return;
    let bool = this.parseBlock(boolBlock).data;
    if (bool == null || bool.type != "BOOL") return;

    
    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    if( (mode=="WHILE" && bool.value) || (mode=="UNTIL" && !bool.value) ){
        tl.to(gsapEmpty, {
            delay: 0, 
            onStart: function(){
                self.parseBlock(doBlock, function(flow=null){
                    if ( flow==null || flow=="CONTINUE" ){
                        bool = self.parseBlock(boolBlock).data;
                        if( (mode=="WHILE" && bool.value) || (mode=="UNTIL" && !bool.value) ){
                            tl.restart();
                        }
                        else{
                            if(block.children[block.children.length-1].tagName == "next"){
                                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                            }
                            else{
                                if(cb){
                                    cb();
                                }
                            }
                        }
                    }
                    else if(flow == "BREAK"){
                        if(block.children[block.children.length-1].tagName == "next"){
                            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                        }
                        else{
                            if(cb){
                                cb();
                            }
                        }
                    }

                });
            }
        });
    }
    else{
        if(block.children[block.children.length-1].tagName == "next"){
            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
        }
        else{
            if(cb){
                cb();
            }
        }
    }

    return tl;
}

Logic.prototype.controls_forEach = function(block, cb) {
    
    let self = this;

    let variable = this.getContentByFieldName(block, "VAR");
    if (variable == null) return;

    let  listBlock = this.getBlockByValueName(block, "LIST");
    if(listBlock == null) return;
    let list = this.parseBlock(listBlock).data;
    if (list == null || list.type != "LIST") return;
    if (list.value.length < 1) return;

    let  doBlock = this.getBlockByValueName(block, "DO");
    if(doBlock == null) return;

    let i=0, vi;

    this.variableList.forEach( ( v ) => {
        if ( v.name == variable ) {
            vi = v;
        }
    } ) ;

    let newData = new Object();
    newData.value = list.value[i].value;
    newData.type = list.value[i].type;
    vi.data = newData; 

    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    tl.to(gsapEmpty, {
        delay: 0, 
        onStart: function(){
            self.parseBlock(doBlock, function(flow=null){
                if ( flow==null || flow=="CONTINUE" ){
                    i += 1;
                    if ( i < list.value.length ){
                        vi.data.value = list.value[i].value;
                        vi.data.type = list.value[i].type;
                        tl.restart();
                    }
                    else{
                        if(block.children[block.children.length-1].tagName == "next"){
                            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                        }
                        else{
                            if(cb){
                                cb();
                            }
                        }

                    }
                }
                else if(flow == "BREAK"){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb();
                        }
                    }
                }
            });
        }
    });




}

Logic.prototype.controls_flow_statements = function(block, cb) {
    
    let self = this;

    let flow = this.getContentByFieldName(block, "FLOW");
    if (flow == null) return;

    if(cb){
        cb(flow);
    }

}

Logic.prototype.controls_if = function(block, cb) {
    
    let self = this;
    
    let elseifCount = parseInt(block.children[0].getAttribute("elseif"));
    // let elseCount = parseInt(block.children[0].getAttribute("else"));
    let n = 0;
    let tl = gsap.timeline()
    self.timelineDict[ block.id ] = tl ;

    while(true){

        let  ifBlock = this.getBlockByValueName(block, "IF"+n);
        if(ifBlock == null) break;
        let bool = this.parseBlock(ifBlock).data;
        if (bool == null || bool.type != "BOOL") break;

        let  doBlock = this.getBlockByValueName(block, "DO"+n);

        if (bool.value){
            if(doBlock){
                tl.to(gsapEmpty, {
                    delay: 0, 
                    onStart: function(){
                        self.parseBlock(doBlock, function(flow=null){
                            if(block.children[block.children.length-1].tagName == "next"){
                                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                            }
                            else{
                                if(cb){
                                    cb(flow);
                                }
                            }
                        });
                    }
                });
                return tl;
            }
            else{
                return;
            }
        }

        n+=1;
    }

    let  elseBlock = this.getBlockByValueName(block, "ELSE");

    if(elseBlock && n == elseifCount+1){
        tl.to(gsapEmpty, {
            delay: 0, 
            onStart: function(){
                self.parseBlock(elseBlock, function(flow=null){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb(flow);
                        }
                    }
                });
            }
        });
        return tl;

    }
    else{
        if(block.children[block.children.length-1].tagName == "next"){
            self.parseBlock(block.children[block.children.length-1].children[0], cb);  
        }
        else{
            if(cb){
                cb();
            }
        }
    }

    return;

}

Logic.prototype.controls_ifelse = function(block, cb) {
    
    let self = this;

    let  doBlock = this.getBlockByValueName(block, "DO0");
    let  elseBlock = this.getBlockByValueName(block, "ELSE");
    if(doBlock == null && elseBlock == null) return;

    let  ifBlock = this.getBlockByValueName(block, "IF0");
    if(ifBlock == null) return;
    let bool = this.parseBlock(ifBlock).data;
    if (bool == null || bool.type != "BOOL") return;

    let tl = gsap.timeline()
    self.timelineDict[ block.id ] = tl ;

    if (bool.value){
        tl.to(gsapEmpty, {
            delay: 0, 
            onStart: function(){
                self.parseBlock(doBlock, function(flow=null){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb(flow);
                        }
                    }
                });
            }
        });
    }
    else{
        tl.to(gsapEmpty, {
            delay: 0, 
            onStart: function(){
                self.parseBlock(elseBlock, function(flow=null){
                    if(block.children[block.children.length-1].tagName == "next"){
                        self.parseBlock(block.children[block.children.length-1].children[0], cb);  
                    }
                    else{
                        if(cb){
                            cb(flow);
                        }
                    }
                });
            }
        });
    }

    return tl;
}

Logic.prototype.controls_wait_time = function(block, cb){
    
    let self = this;

    let unit = this.getContentByFieldName(block, "UNIT");
    if (unit == null) return;

    let  timeBlock = this.getBlockByValueName(block, "TIME");
    if(timeBlock == null) return;
    let time = this.parseBlock(timeBlock).data;
    if (time == null || time.type != "NUM") return;

    switch(unit){

        case "SECONDS":
            time.value = time.value;
            break;
        case "MILLISECOND":
            time.value = time.value / 1000;
            break;
        case "MINUTES":
            time.value = time.value * 60;
            break;

    }

    let tl = gsap.timeline();
    self.timelineDict[ block.id ] = tl ;

    tl.to(gsapEmpty, {
        delay: time.value, 
        onStart: function(){
            if(block.children[block.children.length-1].tagName == "next"){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);  
            }
            else{
                if(cb){
                    cb();
                }
            }
            
        }
    });

    return tl;

 
} 

Logic.prototype.controls_run_parallel = function(block, cb) {
    
    let self = this;

    let doCount = parseInt(block.children[0].getAttribute("do"));
    let doBlockList = [];
    
    for(let i = 0; i < doCount; i++){
        let  doBlock = this.getBlockByValueName(block, "DO"+(i+1));
        if (doBlock) doBlockList.push(doBlock);
    }

    if (doBlockList.length < 1) return;

    for(let i = 0; i < doBlockList.length; i++){
        this.parseBlock(doBlockList[i]);
    }

}