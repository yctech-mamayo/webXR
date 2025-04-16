Logic.prototype.parse_operators_block = function(block){
    let blockType = block.getAttribute("type");
    let result = new Object();

    switch(blockType){

        //logic
        case "operators_compare":
            result.data = this.operators_compare(block);
            break;

        case "operators_operation":
            result.data = this.operators_operation(block);
            break;

        case "operators_negate":
            result.data = this.operators_negate(block);
            break;

        case "operators_ternary":
            result.data = this.operators_ternary(block);
            break;

        // math
        case "operators_arithmetic":
            result.data = this.operators_arithmetic(block);
            break;

        case "operators_random_int":
            result.data = this.operators_random_int(block);
            break;

        case "operators_random_float_between":
            result.data = this.operators_random_float_between(block);
            break;

        case "operators_constrain":
            result.data = this.operators_constrain(block);
            break;

        case "operators_number_property":
            result.data = this.operators_number_property(block);
            break;

        case "operators_is_divisable":
            result.data = this.operators_is_divisable(block);
            break;

        case "operators_round":
            result.data = this.operators_round(block);
            break;

        case "operators_round_to_decimals":
            result.data = this.operators_round_to_decimals(block);
            break;

        case "operators_single":
            result.data = this.operators_single(block);
            break;

        case "operators_trig":
            result.data = this.operators_trig(block);
            break;

        case "operators_on_list":
            result.data = this.operators_on_list(block);
            break;
    }

    return result;
}

Logic.prototype.operators_compare = function(block){

    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "A");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null) return;

    let  arg1Block = this.getBlockByValueName(block, "B");
    if(arg1Block == null) return;
    let arg1 = this.parseBlock(arg1Block).data;
    if (arg1 == null) return;
    
    if (arg0.type != arg1.type) return null;

    let newData = new Object();
    newData.type = "BOOL";
    switch(OP){
        case "EQ":
            newData.value = arg0.value == arg1.value;
            break;
        case "NEQ":
            newData.value = arg0.value != arg1.value;
            break;
        case "LT":
            if (arg0.type != "NUM") return null;
            newData.value = arg0.value < arg1.value;
            break;
        case "LTE":
            if (arg0.type != "NUM") return null;
            newData.value = arg0.value <= arg1.value;
            break;
        case "GT":
            if (arg0.type != "NUM") return null;
            newData.value = arg0.value > arg1.value;
            break;
        case "GTE":  
            if (arg0.type != "NUM") return null;                  
            newData.value = arg0.value >= arg1.value;
            break;


    }

    return newData;
    
}

Logic.prototype.operators_operation = function(block){
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "A");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || arg0.type != "BOOL") return;

    let  arg1Block = this.getBlockByValueName(block, "B");
    if(arg1Block == null) return;
    let arg1 = this.parseBlock(arg1Block).data;
    if (arg1 == null || arg1.type != "BOOL") return;

    let newData = new Object();
    newData.type = "BOOL";
    switch(OP){
        case "AND":
            newData.value = arg0.value && arg1.value;
            break;
        case "OR":
            newData.value = arg0.value || arg1.value;
            break;

    }

    return newData;
}

Logic.prototype.operators_negate = function(block){
    let  boolBlock = this.getBlockByValueName(block, "BOOL");
    if(boolBlock == null) return;
    let bool = this.parseBlock(boolBlock).data;
    if (bool == null || bool.type != "BOOL") return;

    let newData = new Object();
    newData.type = "BOOL";
    newData.value = !bool.value;

    return newData;
}

Logic.prototype.operators_ternary = function(block){
    let  ifBlock = this.getBlockByValueName(block, "IF");
    if(ifBlock == null) return;
    let ifData = this.parseBlock(ifBlock).data;
    if (ifData == null || ifData.type != "BOOL") return;
    
    let  thenBlock = this.getBlockByValueName(block, "THEN");
    if(thenBlock == null) return;
    let thenData = this.parseBlock(thenBlock).data;

    let  elseBlock = this.getBlockByValueName(block, "ELSE");
    if(elseBlock == null) return;
    let elseData = this.parseBlock(elseBlock).data;

    if(ifData.value){
        return thenData;
    }
    else{
        return elseData;
    }


}

Logic.prototype.operators_arithmetic = function(block){
  
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "A");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || arg0.type != "NUM") return;

    let  arg1Block = this.getBlockByValueName(block, "B");
    if(arg1Block == null) return;
    let arg1 = this.parseBlock(arg1Block).data;
    if (arg1 == null || arg1.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM";
    switch(OP){
        case "ADD":
            newData.value = arg0.value + arg1.value;
            break;
        case "MINUS":
            newData.value = arg0.value - arg1.value;
            break;
        case "MULTIPLY":
            newData.value = arg0.value * arg1.value;
            break;
        case "DIVIDE":
            newData.value = arg0.value / arg1.value;
            break;
        case "POWER":
            newData.value = Math.pow(arg0.value, arg1.value);
            break;
        case "MOD":                    
        newData.value = arg0.value % arg1.value;
            break;


    }

    return newData;
}

Logic.prototype.operators_random_int = function(block){
    let  fromBlock = this.getBlockByValueName(block, "FROM");
    if(fromBlock == null) return;
    let fromData = this.parseBlock(fromBlock).data;
    if (fromData == null || fromData.type != "NUM") return;

    let  toBlock = this.getBlockByValueName(block, "TO");
    if(toBlock == null) return;
    let toData = this.parseBlock(toBlock).data;
    if (toData == null || toData.type != "NUM") return;

    let intToValue = parseInt(toData.value)
    let intFromValue = parseInt(fromData.value)

    let newData = new Object();
    newData.type = "NUM";

    newData.value = parseInt(Math.random()*(intToValue-intFromValue))+intFromValue;

    return newData;
}

Logic.prototype.operators_random_float_between = function(block){
    let  fromBlock = this.getBlockByValueName(block, "FROM");
    if(fromBlock == null) return;
    let fromData = this.parseBlock(fromBlock).data;
    if (fromData == null || fromData.type != "NUM") return;

    let  toBlock = this.getBlockByValueName(block, "TO");
    if(toBlock == null) return;
    let toData = this.parseBlock(toBlock).data;
    if (toData == null || toData.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM";

    newData.value = Math.random()*(toData.value-fromData.value)+fromData.value;

    return newData;
}

Logic.prototype.operators_constrain = function(block){
    let  valueBlock = this.getBlockByValueName(block, "VALUE");
    if(valueBlock == null) return;
    let valueData = this.parseBlock(valueBlock).data;
    if (valueData == null || valueData.type != "NUM") return;

    let  lowBlock = this.getBlockByValueName(block, "LOW");
    if(lowBlock == null) return;
    let lowData = this.parseBlock(lowBlock).data;
    if (lowData == null || lowData.type != "NUM") return;

    let  highBlock = this.getBlockByValueName(block, "HIGH");
    if(highBlock == null) return;
    let highData = this.parseBlock(highBlock).data;
    if (highData == null || highData.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM";

    newData.value = Math.min( Math.max(valueData.value, lowData.value), highData.value);

    return newData;
}

Logic.prototype.operators_number_property = function(block){
    let property = this.getContentByFieldName(block, "PROPERTY");
    if (property == null) return;

    let  numBlock = this.getBlockByValueName(block, "NUMBER_TO_CHECK");
    if(numBlock == null) return;
    let numData = this.parseBlock(numBlock).data;
    if (numData == null || numData.type != "NUM") return;

    let newData = new Object();
    newData.type = "BOOL";

    CheckPrime = function(num)
    {
        if (num== 2 || num == 3){
            return true;
        }
        if (!(num > 1) || num % 1 != 0 || num % 2 == 0 || num % 3 == 0){
            return false;
        }
        for (let x = 6; x <= Math.sqrt(num) + 1.5; x += 6){
            if (num % (x - 1) == 0 || num % (x + 1) == 0){
                return false;
            }
        }
        return true;
    }

    switch(property){

        case "EVEN":
            newData.value = numData.value % 2 == 0;
            break;
        case "ODD":
            newData.value = numData.value % 2 == 1;
            break;
        case "PRIME":
            newData.value = CheckPrime(numData.value);
            break;
        case "WHOLE":
            newData.value = numData.value % 1 == 0;
            break;
        case "POSITIVE":
            newData.value = numData.value > 0;
            break;
        case "NEGATIVE":
            newData.value = numData.value < 0;
            break;

    }

    return newData;

}

Logic.prototype.operators_is_divisable = function(block){
    let  dividendBlock = this.getBlockByValueName(block, "DIVIDEND");
    if(dividendBlock == null) return;
    let dividendData = this.parseBlock(dividendBlock).data;
    if (dividendData == null || dividendData.type != "NUM") return;

    let  divisorBlock = this.getBlockByValueName(block, "DIVISOR");
    if(divisorBlock == null) return;
    let divisorData = this.parseBlock(divisorBlock).data;
    if (divisorData == null || divisorData.type != "NUM") return;

    let newData = new Object();
    newData.type = "BOOL"
    newData.value = dividendData.value % divisorData.value == 0;

    return newData;
}

Logic.prototype.operators_round = function(block){
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "NUM");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || arg0.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM"; 

    switch(OP){

        case "ROUND":
            newData.value = Math.round(arg0.value);
            break;
        
        case "ROUNDUP":
            newData.value = Math.ceil(arg0.value);
            break;

        case "ROUNDDOWN":
            newData.value = Math.floor(arg0.value);
            break;

    }

    return newData;
}

Logic.prototype.operators_round_to_decimals = function(block){
    let  arg0Block = this.getBlockByValueName(block, "A");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || arg0.type != "NUM") return;

    let  arg1Block = this.getBlockByValueName(block, "B");
    if(arg1Block == null) return;
    let arg1 = this.parseBlock(arg1Block).data;
    if (arg1 == null || arg1.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM"

    let exp = parseInt(arg1.value);

    // Shift
    value = arg0.value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));
    // Shift back
    value = value.toString().split('e');
    newData.value = +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));

    return newData;
}

Logic.prototype.operators_single = function(block){
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "NUM");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || arg0.type != "NUM") return;

    let newData = new Object();
    newData.type = "NUM"

    switch (OP){
        case "ROOT":
            newData.value = Math.sqrt(arg0.value);
            break;
        case "ABS":
            newData.value = Math.abs(arg0.value);
            break;
        case "NEG":
            newData.value = -arg0.value;
            break;
        case "LN":
            newData.value = Math.log(arg0.value);
            break;
        case "LOG10":
            newData.value = Math.log10(arg0.value);
            break;
        case "EXP":
            newData.value = Math.exp(arg0.value);
            break;
        case "POW10":
            newData.value = Math.pow(10, arg0.value);
            break;
    }

    return newData;

}

Logic.prototype.operators_trig = function(block){
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  arg0Block = this.getBlockByValueName(block, "NUM");
    if(arg0Block == null) return;
    let arg0 = this.parseBlock(arg0Block).data;
    if (arg0 == null || (arg0.type != "NUM" && arg0.type != "DEGREE")) return;

    if(arg0.type == "DEGREE"){
        arg0.value = Math.PI * arg0.value / 180;
    }

    let newData = new Object();
    newData.type = "NUM"

    switch (OP){
        case "SIN":
            newData.value = Math.sin(arg0.value);
            break;
        case "COS":
            newData.value = Math.cos(arg0.value);
            break;
        case "TAN":
            newData.value = Math.tan(arg0.value);
            break;
        case "ASIN":
            newData.value = Math.asin(arg0.value);
            break;
        case "ACOS":
            newData.value = Math.acos(arg0.value);
            break;
        case "ATAN":
            newData.value = Math.atan(arg0.value);
            break;

    }

    return newData;
}

Logic.prototype.operators_on_list = function(block){
    let OP = this.getContentByFieldName(block, "OP");
    if (OP == null) return;

    let  listBlock = this.getBlockByValueName(block, "LIST");
    if(listBlock == null) return;
    let listData = this.parseBlock(listBlock).data;
    if (listData == null || listData.type != "LIST") return;

    let tmpList = [];
    let tmpDict = {};
    for (let i = 0; i < listData.value.length; i++) {
        if(listData.value[i].type != "NUM") return;
        tmpList.push(listData.value[i].value);
        if(tmpDict[listData.value[i].value]){
            tmpDict[listData.value[i].value] +=1;
        }
        else{
            tmpDict[listData.value[i].value] = 1;
        }
    }

    let newData = new Object();
    newData.type = "NUM"

    switch(OP){

        case "SUM":
            newData.value = tmpList.reduce((a, b) => a + b, 0)
            break;
        case "MIN":
            newData.value = Math.min(...tmpList);
            break;
        case "MAX":
            newData.value = Math.max(...tmpList);
            break;
        case "AVERAGE":
            newData.value = tmpList.reduce((a, b) => a + b, 0) / tmpList.length;
            break;
        case "MEDIAN":
            tmpList.sort(function(a, b) {
                return a - b;
            });
            if(tmpList.length % 2 == 1){
                newData.value = tmpList[parseInt(tmpList.length/2)];
            }
            else{
                newData.value = (tmpList[parseInt(tmpList.length/2)-1] + tmpList[parseInt(tmpList.length/2)]) /2 ;
            }
            break;
        case "MODE":
            let maxValue = Math.max(...Object.values(tmpDict));
            let returnList = [];
            Object.keys(tmpDict).forEach(key => {
                if(tmpDict[key] == maxValue){
                    let tmpData = new Object();
                    tmpData.value = parseFloat(key);
                    tmpData.type = "NUM";
                    returnList.push(tmpData);
                }
            });
            newData.value = returnList;
            newData.type = "LIST";
            break;
        case "STD_DEV":
            let avg = tmpList.reduce((a, b) => a + b, 0) / tmpList.length;
            let acc = 0;
            tmpList.forEach(x => {
                let diff = x - avg;
                acc += diff*diff;
            });
            newData.value = Math.sqrt(acc/tmpList.length);
            break;
        case "RANDOM":
            newData.value = tmpList[parseInt(Math.random()*tmpList.length)]
            break;

    }

    return newData;


}