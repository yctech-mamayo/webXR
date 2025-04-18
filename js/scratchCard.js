function scracthCard(){
  
  'use strict';
    
    let thresholdPecent = 30;

    this.moduleLoaded = false;
    this.currentMakarObject = null;
    var self = this;

    this.createContent = function(){


        //// setup the bottom div 
        this.scratchCardExchangeDiv = document.createElement("div");
        this.scratchCardExchangeDiv.setAttribute("id", "scratchCardExchangeDiv"); // must set 
        this.scratchCardExchangeDiv.innerText = "尚未完成括括卡";

        this.scratchCardExchangeDiv.style.width = "100%";
        this.scratchCardExchangeDiv.style.left = "0%";
        this.scratchCardExchangeDiv.style.bottom = "60px";

        this.scratchCardExchangeDiv.addEventListener('click', exChangeClick, false);
        //// must before  addEventListener
        function exChangeClick(event){
            // console.log("-------------------------- evet = ", event , aScratchCard.currentMakarObject );
            let makarObj = aScratchCard.currentMakarObject;
            if (makarObj.scratchedAreaPercentage > thresholdPecent && makarObj.exchanged == -1 ){
                console.log("-------------------------- can exchange show Div "  , makarObj.scratchedAreaPercentage , publishARProjs.proj_list[makarObj.parent.GCSSID] );
                document.getElementById("inputPasswordDiv").style.display = "inline";

            }else{
                console.log("-------------------------- can not exchange " , makarObj.scratchedAreaPercentage , makarObj.exchanged );
            }
        }

        document.body.appendChild(this.scratchCardExchangeDiv);

        //// setup the input password div

        this.inputPasswordDiv = document.createElement("div");
        this.inputPasswordDiv.setAttribute("id", "inputPasswordDiv"); // must set 
        document.body.appendChild(this.inputPasswordDiv);

        // var mycanvas = document.getElementById("mycanvas");
        // let offsetLeft = 0, offsetTop = 0, sceneWidth;
        // if (mycanvas.offsetLeft > 0){
        //     offsetLeft = mycanvas.offsetLeft;
        // }else{
        //     offsetLeft = 0;
        // }
        // if (mycanvas.offsetTop > 0){
        //     offsetTop = mycanvas.offsetTop;
        // }else{
        //     offsetTop = 0;
        // }
        // if (mycanvas.width > innerWidth){
        //     sceneWidth = innerWidth;
        // }else{
        //     sceneWidth = mycanvas.width;
        // }
        //// set the position of password div
        // this.inputPasswordDiv.style.left = offsetLeft + sceneWidth/2 - sceneWidth*0.4 + "px";
        // this.inputPasswordDiv.style.top  = offsetTop  + mycanvas.height/2 - 100 + "px";

        // this.inputPasswordDiv.style.width = sceneWidth*0.8 + "px";
        // this.inputPasswordDiv.style.height = 200 + "px";

        let ipw = innerWidth > 600 ? 300 : innerWidth*0.5;
        let iph = innerHeight > 900 ? 270 : innerHeight*0.3;
        
        this.inputPasswordDiv.style.left = (innerWidth - ipw)/2 + "px";
        this.inputPasswordDiv.style.top  = (innerHeight - iph)/2 + "px";

        this.inputPasswordDiv.style.width = ipw + "px";
        this.inputPasswordDiv.style.height = iph + "px";

        this.inputPasswordDiv.innerHTML = "<br> 輸入密碼 <br>";

        //// input text area
        var inputPasswordInputText = document.createElement("input");
        inputPasswordInputText.setAttribute("id", "inputPasswordInputText"); // default
        inputPasswordInputText.setAttribute("type", "text"); // default
        inputPasswordInputText.setAttribute("placeholder", "pwd"); // default
        this.inputPasswordDiv.appendChild(inputPasswordInputText);

        var inputPasswordResultText = document.createElement("div");
        inputPasswordResultText.setAttribute("id", "inputPasswordResultText"); // default
        this.inputPasswordDiv.appendChild(inputPasswordResultText);
        inputPasswordResultText.innerText = "";

        //// confirm and cancel of password div
        var scratchCardPasswordCancel = document.createElement("div");
        scratchCardPasswordCancel.setAttribute("class", "bottomLeftCell" );
        scratchCardPasswordCancel.setAttribute("id", "scratchCardPasswordCancel" );
        // scratchCardPasswordCancel.innerHTML = "&times;";
        scratchCardPasswordCancel.innerText = "取消";
        this.inputPasswordDiv.appendChild(scratchCardPasswordCancel);
        scratchCardPasswordCancel.addEventListener("click", function(){
            inputPasswordDiv.style.display = "none";
            inputPasswordInputText.value = "";
            inputPasswordResultText.innerText = "";
		});

        var scratchCardPasswordConfirm = document.createElement("div");
        scratchCardPasswordConfirm.setAttribute("class", "bottomRightCell" );
        scratchCardPasswordConfirm.setAttribute("id", "scratchCardPasswordConfirm" );
        scratchCardPasswordConfirm.innerText = "確認";
        this.inputPasswordDiv.appendChild(scratchCardPasswordConfirm);

        scratchCardPasswordConfirm.addEventListener("click", this.passwordConfirm );


    
    }

    this.passwordConfirm = function(){
        // console.log("scratchCard.js: _passwordConfirm: password enter: inputPasswordInputText=", inputPasswordInputText.value, self.currentMakarObject.password );
        if (inputPasswordInputText.value == self.currentMakarObject.password ){
            inputPasswordResultText.innerText = "密碼正確";
            scratchCardExchangeDiv.innerText = "已兌換";
            self.currentMakarObject.exchanged = 1;

            setTimeout(function(){
                inputPasswordDiv.style.display = "none";
            }, 1000);

            let rootObject = self.currentMakarObject;
            let scratchCardState = 3;
            parent.mdb.setScratchProjectStateFromProjID( publishARProjs.proj_list[rootObject.parent.GCSSID].proj_id , scratchCardState ).then( setProjRet=>{
                //// 刪除 award_list issuance_card 再新增 scratch_image_url award_image_url 
                setProjRet.is_exchanged = true;
                delete setProjRet.scratch_image_url;
                delete setProjRet.awards_image_url;
                console.log("scratchCard.js: _passwordConfirm: exchange upload setProjRet= ", setProjRet );
                scratchCardLog( window.serverUrl , setProjRet );
            });

        }else{
            inputPasswordResultText.innerText = "密碼錯誤";
        }
    };

    this.hideScratchCanvas = function( obj_2D ){

        for (let i in obj_2D.children ){
            let makarObj = obj_2D.children[i];
            if ( makarObj.main_type == "module" && makarObj.sub_type == "scratch_card" ){
                let stratchCanvasDiv =  makarObj.canvasDomElement ;
                stratchCanvasDiv.style.display = "none";
                this.scratchCardExchangeDiv.style.display = "none";
                this.inputPasswordDiv.style.display = "none";
                inputPasswordInputText.value = "";
                inputPasswordResultText.innerText = "";
            }
        }
    }

    this.showScratchCanvas = function( obj_2D ){        

        for (let i in obj_2D.children ){
            let makarObj = obj_2D.children[i];
            if ( makarObj.main_type == "module" && makarObj.sub_type == "scratch_card" ){
                let stratchCanvasDiv =  makarObj.canvasDomElement ;

                console.log("scratchCard.js: _showScratchCanvas: makarObj=", makarObj );
                if (makarObj.scratchedAreaPercentage > thresholdPecent){
                    
                    if (makarObj.exchanged > 0){
                        this.scratchCardExchangeDiv.innerText = "已兌換";
                    }else{
                        this.scratchCardExchangeDiv.innerText = "按此兌換獎項";
                    }


                }else{
                    this.scratchCardExchangeDiv.innerText = "尚未完成括括卡";
                }

                stratchCanvasDiv.style.display = "inline";
                this.scratchCardExchangeDiv.style.display = "inline";
                
                this.currentMakarObject = makarObj;
            }
        }

    }

    this.clearScratchCanvas = function(rootObject){
        

        rootObject.scratchedAreaPercentage = 100;
        let mCanvas = rootObject.canvasDomElement.children[0];//// must be the canvas
        if ( mCanvas ){
            mCanvas.parentNode.removeChild(mCanvas); //// remove canvas itself
            rootObject.canvasDomElement.parentNode.removeChild(rootObject.canvasDomElement); //// remove canvas itself    
        }

        if (rootObject.exchanged > 0){
            this.scratchCardExchangeDiv.innerText = "已兌換";
        }else{
            this.scratchCardExchangeDiv.innerText = "按此兌換獎項";
        }

    }

    this.randomChooseAward = function( scene_obj ) {
        
        // console.log("_______________ proxy.arController.getDefaultImageUrl =", proxy.arController.getDefaultImageUrl );

        let award_list=null;
        if ( Array.isArray(scene_obj.project_module) ){
            if (scene_obj.project_module.length == 1 ){
                award_list = scene_obj.project_module[0].award_list;
            }
        }

        if (!award_list){
            return -1 ;
        }

        let totalProbability = 0;
        let awardArray = [];
        for (let i in award_list){
            totalProbability += award_list[i].probability;
            awardArray.push(totalProbability);
        }
        let getNum = Math.floor(Math.random() * totalProbability ) + 1; // 1 2 3 .. totalProbability 
        let getAwardIndex = -1;
        console.log("scratchCard.js: _chooseAward: awardArray=", awardArray, ", getNum=", getNum);
        for (let i = 0; i < awardArray.length; i++ ){
            if ( getNum <= awardArray[i] ){
                getAwardIndex = i;
                break;
            }
        }

        return getAwardIndex;

    }

    //// 目前沒有地方需要呼叫..
    this.clearScratchCard = function(){
        
    };

    this.setCanvas = function( scratchCanvas , scratchCanvasDiv, rootObject ){
 
        if (!this.moduleLoaded){
            this.createContent();
            this.moduleLoaded = true;
        }
        this.scratchCardExchangeDiv.style.display = "inline";
        this.scratchCardExchangeDiv.innerText = "尚未完成括括卡";
        rootObject.scratchedAreaPercentage = -1; 
        rootObject.exchanged = -1; 
 
        this.currentMakarObject = rootObject;
 

        let canvas = scratchCanvas;
        // console.log("scratchCard.js: canvas=", canvas );

        let canvasWidth  = canvas.width,
            canvasHeight = canvas.height,
            ctx          = canvas.getContext('2d');
            
        var isDrawing, lastPoint;
        let brush = new Image();    
        // brush.crossOrigin = "anonymous";
        // brush.src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/brush.png";
        brush.onload = function(){
            // console.log("scratchCard.js: brush onload, brush=", brush );
        }

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/modules/scratchCard/brush.png" );
        xhr.responseType = "blob";
        xhr.onload =   function response(e) {
            let urlCreator = window.URL || window.webkitURL;
            let imageUrl = urlCreator.createObjectURL(this.response);
            brush.src = imageUrl;
            // console.log("scratchCard.js: request response, " , e, this , imageUrl );
        };
        xhr.send();
      
        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('touchstart', handleMouseDown, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('touchmove', handleMouseMove, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('touchend', handleMouseUp, false);
    
        function distanceBetween(point1, point2) {
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }
    
        function angleBetween(point1, point2) {
            return Math.atan2( point2.x - point1.x, point2.y - point1.y );
        }
        
        // Only test every `stride` pixel. `stride`x faster,
        // but might lead to inaccuracy
        function getFilledInPixels(stride) {
            if (!stride || stride < 1) { stride = 1; }
            
            var pixels   = ctx.getImageData(0, 0, canvasWidth, canvasHeight),
                pdata    = pixels.data,
                l        = pdata.length,
                total    = (l / stride),
                count    = 0;
            
            // Iterate over all pixels
            for(var i = count = 0; i < l; i += stride) {
                // if (parseInt(pdata[i]) === 0) {
                //     count++;
                // }

                //// 同時要 RGB 都是 0 才計算 
                if ( pdata[i + 0] + pdata[i + 1] + pdata[i + 2] === 0  )  
                {
                    count++;
                }

            }   
            // console.log("scratchCard.js: getFilledInPixels, ", total, count );
            return Math.round((count / total) * 100);
        }
        
        function getMouse(e, canvas) {
            var offsetX = 0, offsetY = 0, mx, my;

            if (canvas.offsetParent !== undefined) {
            do {
                offsetX += canvas.offsetLeft;
                offsetY += canvas.offsetTop;
            } while ((canvas = canvas.offsetParent));
            }

            mx = (e.pageX || e.touches[0].clientX) - offsetX;
            my = (e.pageY || e.touches[0].clientY) - offsetY;

            return {x: mx, y: my};
        }
        
        function handlePercentage(filledInPixels) {
            filledInPixels = filledInPixels || 0;
            
            rootObject.scratchedAreaPercentage = filledInPixels;
            // console.log( "scratchCard.js: scratch part:",  filledInPixels + '%', rootObject);
            if (filledInPixels > thresholdPecent) {
                console.log("scratchCard.js: _handlePercentage: clear scratch canvas ", self.currentMakarObject );
                self.clearScratchCanvas( self.currentMakarObject );
                
                let scratchCardState = 2;
                parent.mdb.setScratchProjectStateFromProjID( publishARProjs.proj_list[rootObject.parent.GCSSID].proj_id , scratchCardState ).then( setProjRet =>{
                    //// 刪除 award_list issuance_card 再新增 scratch_image_url award_image_url 
                    console.log("scratchCard.js: _passwordConfirm: exchange upload setProjRet= ", setProjRet );
                    scratchCardLog( window.serverUrl , setProjRet );

                } );
                // canvas.parentNode.removeChild(canvas); //// remove itself


                if (rootObject.exchanged > 0){
                    scratchCardExchangeDiv.innerText = "已兌換";
                }else{
                    scratchCardExchangeDiv.innerText = "按此兌換獎項";
                }

            }else{
                scratchCardExchangeDiv.innerText = "尚未完成括括卡";
            }
        }
        
        function handleMouseDown(e) {
            // console.log( "handleMouseDown :"  );
            isDrawing = true;
            lastPoint = getMouse(e, canvas);
        }

        function handleMouseMove(e) {
            // console.log( "handleMouseMove :",  isDrawing  );
            if (!isDrawing) { return; }
            
            e.preventDefault();

            var currentPoint = getMouse(e, canvas),
                dist = distanceBetween(lastPoint, currentPoint),
                angle = angleBetween(lastPoint, currentPoint),
                x, y;

            var offsetX = 15;
            var offsetY = 15;
            var drawWidth = 80;
            var drawHeight = 40;

            for (var i = 0; i < dist; i++) {
                x = lastPoint.x + (Math.sin(angle) * i) - offsetX;
                y = lastPoint.y + (Math.cos(angle) * i) - offsetY;
                ctx.globalCompositeOperation = 'destination-out';
                // ctx.drawImage(brush, x, y );
                ctx.drawImage(brush, x  , y , drawWidth, drawHeight ); //
                // console.log("x y=", x,y );
            }
            
            lastPoint = currentPoint;
            handlePercentage(getFilledInPixels(32));
        }

        function handleMouseUp(e) {
            isDrawing = false;
        }


    };

    
  
}

window.aScratchCard = new scracthCard();
