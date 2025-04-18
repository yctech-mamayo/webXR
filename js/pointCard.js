function pointCard(){
  
    'use strict';
    
    this.moduleLoaded = false;
    this.currentMarkerRoot2D = null;
    this.mdb = null;
    this.canExchange = false;
    let self = this;
    

    if (!parent.mdb){
        console.log("pointCard.js: the parent mdb not existm, error");
    }else{
        this.mdb = parent.mdb;
    };



    this.createPointCardContent = function(markerRoot2D){

        if (this.moduleLoaded){
            return;
        }else{
            this.moduleLoaded = true;
        }

        this.currentMarkerRoot2D = markerRoot2D;
        this.currentMarkerRoot2D.exchanged = -1;

        //// setup the bottom div 
        this.pointCardExchangeDiv = document.createElement("div");
        this.pointCardExchangeDiv.setAttribute("id", "pointCardExchangeDiv"); // must set 
        this.pointCardExchangeDiv.setAttribute("class", "moduleExchangeDiv"); // must set 
        this.pointCardExchangeDiv.style.display = "inline";
        this.pointCardExchangeDiv.style.width = "100%";
        this.pointCardExchangeDiv.style.left = "0%";
        this.pointCardExchangeDiv.style.bottom = "60px";

        this.pointCardExchangeDiv.innerText = "text";

        
        function exChangeClick(event){
            console.log("pointCard.js: _exChangeClick: self.canExchange = ", self.canExchange  );
            if (self.canExchange){
                self.pointCardPWDBG.style.display = "inline";

            }
        }

        this.pointCardExchangeDiv.onclick = exChangeClick;
        
        document.body.appendChild(this.pointCardExchangeDiv);

        //// 設置輸入密碼 div 的大小位置

        this.pointCardPWDBG = document.createElement("div");
        this.pointCardPWDBG.setAttribute("id" , "pointCardPWDBG");
        this.pointCardPWDBG.setAttribute("class" , "backgroundModal");
        document.body.appendChild(this.pointCardPWDBG);

        this.pointCardPWDiv = document.createElement("div");
        this.pointCardPWDiv.setAttribute("id", "pointCardPWDiv"); 
        this.pointCardPWDiv.setAttribute("class", "modulePWDDiv");
        this.pointCardPWDiv.style.display = "block";
        this.pointCardPWDBG.appendChild(this.pointCardPWDiv);

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
        // this.pointCardPWDiv.style.left = offsetLeft + sceneWidth/2 - sceneWidth*0.4 + "px";
        // this.pointCardPWDiv.style.top  = offsetTop  + mycanvas.height/2 - 100 + "px";

        // this.pointCardPWDiv.style.width = sceneWidth*0.8 + "px";
        // this.pointCardPWDiv.style.height = 200 + "px";

        let ipw = innerWidth > 600 ? 300 : innerWidth*0.5;
        let iph = innerHeight > 900 ? 270 : innerHeight*0.3;
        
        this.pointCardPWDiv.style.left = (innerWidth - ipw)/2 + "px";
        this.pointCardPWDiv.style.top  = (innerHeight - iph)/2 + "px";

        this.pointCardPWDiv.style.width = ipw + "px";
        this.pointCardPWDiv.style.height = iph + "px";


        this.pointCardPWDiv.innerHTML = "<br> 輸入密碼 <br>";

/////////////////////////////////////////////////////////////////

        ////// 密碼輸入區域
        var pointCardPWDInputText = document.createElement("input");
        pointCardPWDInputText.setAttribute("id", "pointCardPWDInputText"); // default
        pointCardPWDInputText.setAttribute("class", "modulePWDInputText"); // default
        pointCardPWDInputText.setAttribute("type", "text"); // default
        pointCardPWDInputText.setAttribute("placeholder", "pwd"); // default
        this.pointCardPWDiv.appendChild(pointCardPWDInputText);

        ////// 密碼輸入 結果區域
        var pointCardPWDRetText = document.createElement("div");
        pointCardPWDRetText.setAttribute("id", "pointCardPWDRetText"); // default
        pointCardPWDRetText.setAttribute("class", "modulePWDRetText"); // default
        this.pointCardPWDiv.appendChild(pointCardPWDRetText);
        pointCardPWDRetText.innerText = "";

        //// 取消按鈕設置
        var pointCardPWDCancel = document.createElement("div");
        pointCardPWDCancel.setAttribute("class", "bottomLeftCell" );
        pointCardPWDCancel.setAttribute("id", "pointCardPWDCancel" );
        // pointCardPWDCancel.innerHTML = "&times;";
        pointCardPWDCancel.innerText = "取消";
        this.pointCardPWDiv.appendChild(pointCardPWDCancel);
        // pointCardPWDCancel.addEventListener("click", function(){
        pointCardPWDCancel.onclick = function(){
            console.log("pointCard.js: cancel button click ");
            pointCardPWDBG.style.display = "none";
            pointCardPWDInputText.value = "";
            pointCardPWDRetText.innerText = "";
		};

        ////// 確認按鈕設置
        var pointCardPWDConfirm = document.createElement("div");
        pointCardPWDConfirm.setAttribute("class", "bottomRightCell" );
        pointCardPWDConfirm.setAttribute("id", "pointCardPWDConfirm" );
        pointCardPWDConfirm.innerText = "確認";
        this.pointCardPWDiv.appendChild(pointCardPWDConfirm);

        // pointCardPWDConfirm.addEventListener("click", this.passwordConfirm );
        pointCardPWDConfirm.onclick = this.passwordConfirm;

    };

    this.passwordConfirm = function(){
        // console.log("scratchCard.js: _passwordConfirm: password enter: inputPasswordInputText=", inputPasswordInputText.value, self.currentMarkerRoot2D.password );
        if (pointCardPWDInputText.value == self.currentMarkerRoot2D.project_module.reward_password ){
            console.log("pointCard.js: confirm button click password correct ", pointCardPWDInputText.value , self.currentMarkerRoot2D.project_module.reward_password );

            pointCardPWDRetText.innerText = "密碼正確";
            self.pointCardExchangeDiv.innerText = "已兌換";
            self.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
            self.currentMarkerRoot2D.exchanged = 1;
            self.canExchange = false; 

            console.log("pointCard.js: _passwordConfirm: self.currentMarkerRoot2D = ", self.currentMarkerRoot2D );
            parent.mdb.getPointCardProject( self.currentMarkerRoot2D.proj_id ).then( getProjRet=>{
                console.log("pointCard.js: _passwordConfirm getProjRet = ", getProjRet  );
                getProjRet.is_exchanged = true;
                parent.mdb.setPointCardProject( getProjRet ).then( setProjRet=>{
                    console.log("pointCard.js: _setPointCardProject setProjRet = ", setProjRet  );

                    //// 上傳集點卡兌換資訊至雲端 
                    let pointCardLogData  = {
                        "user_id": getProjRet.user_id,
                        "playing_user": "", //// 在還沒有登入流程時候 一定要設為空字串
                        "proj_id": getProjRet.proj_id,
                        "proj_type": "ar",
                        "card_id": getProjRet.card_id,
                        "device_id": getProjRet.device_id,
                        "can_reward_point_count": getProjRet.can_reward_point_count,
                        "is_exchanged": true,
                        "brand":"",
                        "os": Browser.name + Browser.version , 
                        "location_long":0.0,
                        "location_lan":0.0
                    }
                    console.log(" pointCard.js: _passwordConfirm: collect target upload=",  pointCardLogData );
                    pointCardLog(window.serverUrl , pointCardLogData  );

                });

            });


            setTimeout(function(){
                self.pointCardPWDBG.style.display = "none";
            }, 2000);

            
            // parent.mdb.setScratchProjectStateFromProjID( publishARProjs.proj_list[rootObject.parent.GCSSID].proj_id , scratchCardState );

        }else{
            console.log("pointCard.js: confirm button click password wrong ", pointCardPWDInputText.value , self.currentMarkerRoot2D.project_module.reward_password );
            pointCardPWDRetText.innerText = "密碼錯誤";
        }
    };
    
    this.showPointCardCanvas = function( markerRoot2D , diffPoints , is_exchanged ){
        console.log("pointCard.js: _showPointCardCanvas: diffPoints=" , diffPoints , is_exchanged );
        self.currentMarkerRoot2D = markerRoot2D;

        this.pointCardExchangeDiv.style.display = "inline";
        if (is_exchanged){ //// 假如已經兌換過，那就顯示『以兌換即可』
            this.pointCardExchangeDiv.innerText = "已兌換";
            this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
            self.canExchange = false; 
        }else{
            if (diffPoints >= 0){
                self.canExchange = true;            
                this.pointCardExchangeDiv.innerText = "按此兌換獎項";
                this.pointCardExchangeDiv.style.backgroundColor = "rgba(0, 201, 157, 1.0)";
            }else{
                self.canExchange = false;
                this.pointCardExchangeDiv.innerText = "還差 " + (-diffPoints) + " 點就可兌換獎項";
                this.pointCardExchangeDiv.style.backgroundColor = "rgba( 49, 51, 63, 0.9 )";
            }
        }

       

    }
    
    this.hidePointCardCanvas = function( obj_2D ){

        console.log("pointCard.js: _hidePointCardCanvas: obj_2D = ", obj_2D );

        if (obj_2D.loadModule = "pointCard" ){//// 再次確認模組為集點卡
            this.pointCardExchangeDiv.style.display = "none";
            this.pointCardPWDBG.style.display = "none";
            pointCardPWDInputText.value = "";
            pointCardPWDRetText.innerText = "";

        }

    }


    ////// 與 DB 相關
    this.setPointCardProject = function(projInfo , callback){
        parent.mdb.setPointCardProject( projInfo ).then( projRet=>{
            console.log("pointCard.js: _setPointCardProject projRet = ", projRet  );
            if (callback) callback(projRet);
        });

    }

    this.getPointCardProject = function(proj_id , callback ){
        parent.mdb.getPointCardProject( proj_id ).then( projRet=>{
            console.log("pointCard.js: _getPointCardProject projRet = ", projRet  );
            if (callback) callback(projRet);
        });
    }

    this.addPoint = function( getProjRet , target_id , callback ){
        let gotPointTarget =  getProjRet.collected_points.find(function(item){
            return item == target_id ;
        });
        if (gotPointTarget){
            console.log("pointCard.js: _addPoint: there alreay are project, and got target: ", gotPointTarget , getProjRet );
            if (callback){
                callback(getProjRet);
            }

        }else{
            console.log("pointCard.js: _addPoint: there alreay are project, but no got target: " , gotPointTarget , getProjRet );
            getProjRet.collected_points.push( target_id );
            self.setPointCardProject(getProjRet , setProjRet => {
                ////// 只有 get 的event 可以回傳整個資料， put 只會回傳 index 
                parent.mdb.getPointCardProject( getProjRet.proj_id ).then( projRet => {
                    console.log("pointCard.js: _addPoint: projRet = ", projRet );	
                    if (callback){
                        callback(projRet);                
                    }
                });

                
            }) ;
        }

    }


}

let aPointCard = new pointCard();
