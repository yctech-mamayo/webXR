function UI(){
    
    // this.setProjectModal = function( proj_type, proj_name, userName, proj_desc , last_update_date , targetUrl ){
    this.setProjectModal = function( chooseProject ){

        ////// clear old data
        projectPicture.innerHTML = "";

        ////// set general data(AR VR XR)
        projectNameInfo.innerHTML = chooseProject.proj_name;
        projectUserName.innerHTML = chooseProject.name;
        // projectDescription.innerHTML = chooseProject.proj_descr;
        projectLastUpdateDate.textContent = chooseProject.last_update_date.substring(0, 10);

        if (Array.isArray(chooseProject.loc) ){

            if (chooseProject.loc.length > 1 && chooseProject.module_type.find(function(item){return item == "gps";})  ){
                console.log("vrUI.js: showProjectInfo: project with gps ", chooseProject , "\n" , chooseProject.loc[0] + ", " + chooseProject.loc[1] );
                //// 顯示 GPS 欄位 以及先關閉『開始體驗』按鈕功能與圖示
                projectGPSDiv.style.display = "block";
                projectGPSDivEndLine.style.display = "block";
                projectStartButton.style.pointerEvents = "none";
                startBGImage.style.display = "none";
                startTitle.textContent = "wait for GPS";
          
                projectGPSInfo.textContent = chooseProject.loc[0] + ", " + chooseProject.loc[1];
                //// 處理 GPS， 假如可以取得則呼叫一次位置。
                if (navigator.geolocation) {
                    var options = {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    };
                    function calculateGeosToDistanceHaversine(lat1, lon1, lat2, lon2, unit="M" ) {
                        if ((lat1 == lat2) && (lon1 == lon2)) {
                            return 0;
                        } else {
                            let radlat1 = Math.PI * lat1/180;
                            let radlat2 = Math.PI * lat2/180;
                            let radlon1 = Math.PI * lon1/180;
                            let radlon2 = Math.PI * lon2/180;
                            let dradlat = radlat1-radlat2;
                            let dradlon = radlon1-radlon2;
                            let dist = 2*Math.asin( Math.sqrt( Math.pow(Math.sin(dradlat/2), 2) + Math.cos(radlat1)*Math.cos(radlat2)*Math.pow( Math.sin(dradlon/2), 2) ) );
                            if (unit=="M") { dist = dist * 6378137 }
                            console.log("vrUI.js: calculateGeosToDistanceHaversine dist=", dist );
                            return dist;
                        }
                    }
                    navigator.geolocation.getCurrentPosition(geoSuccess, geoError , options );
                    function geoSuccess(geoPosition) {  

                        console.log("vrUI.js: showProjectInfo: geoPosition = ", geoPosition.coords.latitude, geoPosition.coords.longitude );
                        let dist = calculateGeosToDistanceHaversine(geoPosition.coords.latitude, geoPosition.coords.longitude , chooseProject.loc[0] , chooseProject.loc[1]);
                        projectGPSInfo.textContent = chooseProject.loc[0] + ", " + chooseProject.loc[1] + ", dist=" + Math.floor(dist) ;                        
                        getViewerConfig( serverUrl , function(viewerConfig){
                            if (dist < viewerConfig.data.gps_range_distance ){
                            // if (dist < 10000 ){
                                projectStartButton.style.pointerEvents = "auto";
                                startBGImage.style.display = "inline";
                                startTitle.textContent = parent.htmlContent.modalButtonStart[parent.languageType];
                            }else{
                                projectStartButton.style.pointerEvents = "none";
                                startBGImage.style.display = "none";
                                startTitle.textContent = parent.htmlContent.modalButtonDisable[parent.languageType];
                            }
                        });

                    }
                    function geoError(e){
                        console.warn("vrUI.js: showProjectInfo: e=", e.code , e.message );
                        projectStartButton.style.pointerEvents = "none";
                        startBGImage.style.display = "none";
                        startTitle.textContent = "GPS error";
                    }
                } else {
                    console.log("vrUI.js: showProjectInfo: Geolocation is not supported by this browser.");

                    console.warn("vrUI.js: showProjectInfo: not allow GPS " );
                    projectStartButton.style.pointerEvents = "none";
                    startBGImage.style.display = "none";
                    startTitle.textContent = "GPS not support"; 
                }
            }else{
                //// 處理沒帶有 GPS 的專案，隱藏不必要的 UI 界面 
                projectGPSDiv.style.display = "none";
                projectGPSDivEndLine.style.display = "none";
                projectStartButton.style.pointerEvents = "auto";
                startBGImage.style.display = "inline";
                startTitle.textContent = parent.htmlContent.modalButtonStart[parent.languageType];
            }
        }




        switch(chooseProject.proj_type){
            case "ar":
                projectTypeInfo.innerHTML = "AR 圖像辨識";
                projectUsageInfo.innerHTML = "掃描辨識圖即可觀賞AR";
                scanList.style.display = "block";

                getARProjsByProjID( [chooseProject.proj_id] , function( arProjectInfo ){

                    let imgArr = arProjectInfo.data.result[0].targets_img_urls;
                    if (Array.isArray(imgArr)) {
                        scanList.style.display = "block";
                        scanListEndLine.style.display = "block";
                        for (let j = 0; j < imgArr.length; j++) {
                          // It is not `aUI.createProjectSnapshot`. Instead, it is identification map.
                          let img = document.createElement("img");
                          img.src = imgArr[j];
                          projectPicture.appendChild(img);
                        }
                    }
                    else {
                        scanList.style.display = "none";
                        scanListEndLine.style.display = "none";
                    }
                   
                    
                } );
                
                projectStartButton.onclick = function(){
                    console.log("UI.js: vr to ar, click");

                    leavedSendLog();//// 保存遊玩專案的紀錄，會在下面程序時候上傳至雲端
                    parent.aUI.startCoreIframe(chooseProject , true );// need to jump

                }

                break;
            case "vr":
                
                projectTypeInfo.innerHTML = "VR 虛擬實境";
                projectUsageInfo.innerHTML = "開啟專案即可觀賞VR";
                projectPicture.style.display = "none";
                scanList.style.display = "none";
                scanListEndLine.style.display = "none";
                
                projectStartButton.onclick = function(){
                    console.log("UI.js: vr to vr, click");
                    document.getElementById("snapshot_" + parent.selectedProject.proj_id ).className = "circular--square";
                    leavedSendLog();//// 保存遊玩專案的紀錄，會在下面程序時候上傳至雲端
                    parent.aUI.startCoreIframe(chooseProject , false );// no need to jump

                    for (let i = 0 ; i < publishVRProjs.result.length ; i++  ){
						if (publishVRProjs.result[i].proj_id == chooseProject.proj_id ){
                            console.log("UI.js: _setProjectModal: activeVRScenes: i=", i );
                            document.getElementById("snapshot_" +  chooseProject.proj_id ).className = "circular--square-marker";
                            projectModal.style.display = "none";
							activeVRScenes(i);
							break;
						}
					}

                }

                break;
            case "ar_slam":
                projectTypeInfo.innerHTML = "AR 空間辨識";
                projectUsageInfo.innerHTML = "開啟專案即可觀賞XR";
                projectPicture.style.display = "none";                
                scanList.style.display = "none";
                scanListEndLine.style.display = "none";

                projectStartButton.onclick = function(){
                    console.log("UI.js: vr to xr, click");
                    leavedSendLog();//// 保存遊玩專案的紀錄，會在下面程序時候上傳至雲端
                    parent.aUI.startCoreIframe(chooseProject , true );// need to jump

                }

                break;

        }
        var remainingHeight = projectStartButton.offsetTop - projectDescriptionDiv.offsetTop - projectDescriptionTitle.offsetHeight - 10;
        projectDescription.style.height = remainingHeight + "px";
        projectDescription.textContent = chooseProject.proj_descr;
        
    };

    this.cleanProjectModal = function(){

    };

    this.setProjectTable = function(){
        ////// get the variables
        let projsTable = document.getElementById("projsTable");
        let snapShotRow = projsTable.rows.proj_snapshot;
        let projNameRow = projsTable.rows.proj_name;
        let snapShotNumber = snapShotRow.children.length;
        let projNameNumber = projNameRow.children.length;
        ////// clear the table
        for (let i=0; i<snapShotNumber; i++) snapShotRow.deleteCell(0);
        for (let i=0; i<projNameNumber; i++) projNameRow.deleteCell(0);

        if (userPublishProjs){

            let projCount = 0;
            for (let i = 0; i<userPublishProjs.proj_list.length; i++){
//[start-20200522-fei0095-add]//
                //// 判斷只有在 editor 勾選「開啟網頁展示」的專案會顯示。為了不造成顯示錯誤，統一由 interface 控管
                if (parent.useEditorWebTag){
                    if ( !userPublishProjs.proj_list[i].proj_platform.find( item => item == "web") ){
                        continue;
                    }
                }
//[end---20200522-fei0095-add]//

                //// 假如原專案本身是因為 license 而可以開啟使用，需要多判斷其他『專案』是否同樣帶有 license
                if (window.allowedMakarIDUseWeb == false){
                    // console.log("  " , userPublishProjs.proj_list[i].isLicense );
                    // if (userPublishProjs.proj_list[i].isLicense == false){
                    //     continue;
                    // }
                }

                ////// insert project name
                let projNameCell = projNameRow.insertCell( projCount );
                if (projCount==0){
                    projNameCell.style.paddingLeft = "16px";
                }else{
                    projNameCell.style.paddingLeft = "8px";
                }
                // projNameCell.style.paddingRight = "8px";

                let _div = document.createElement('div');
                _div.innerText = userPublishProjs.proj_list[i].proj_name;
                _div.className = "projNameOneRow";
                projNameCell.appendChild(_div);

                ////// insert project snapShot
                let snapShotCell = snapShotRow.insertCell( projCount );
                snapShotCell.className = 'snapShotCell';
                if (projCount==0){
                    snapShotCell.style.paddingLeft = "16px";
                }else{
                    snapShotCell.style.paddingLeft = "8px";
                }

                //// 判定此用戶的專案是否允許使用 webAR, 基於「用戶權限」與「專案權限」(憑證)
                if ( window.allowedMakarIDUseWeb == true || userPublishProjs.proj_list[i].web_ar == true ){

                }else{
                    snapShotCell.style.opacity = 0.5;
                    snapShotCell.style.pointerEvents = 'none';
                    _div.style.opacity = 0.5;
                    _div.style.pointerEvents = 'none';
                }


                // snapShotCell.style.paddingRight = "8px";
                let _img = document.createElement('img');
                _img.src = userPublishProjs.proj_list[i].snapshot_url;
                _img.width = 50;
                _img.height = 50;
                _img.className = "circular--square";
                _img.setAttribute("id", "snapshot_"+userPublishProjs.proj_list[i].proj_id );
                ////// marker the current project by the circular color border.
                
                if (userPublishProjs.proj_list[i].proj_id == parent.selectedProject.proj_id ){
                    _img.className = "circular--square-marker";
                }

                _img.onclick = function(){
                    // chooseVRProject(this , userPublishProjs.proj_list[i] );

                    if ( window.allowedMakarIDUseWeb == true || userPublishProjs.proj_list[i].web_ar == true ){
                        console.log('UI.js: _img click, switch project( allow ) ', window.allowedMakarIDUseWeb , userPublishProjs.proj_list[i].web_ar );
                    } else {
                        console.log('UI.js: _img click, switch project( denied ) ', window.allowedMakarIDUseWeb , userPublishProjs.proj_list[i].web_ar );
                        return;
                    }

                    projectModal.style.display = "block";
                    vrUI.setProjectModal( userPublishProjs.proj_list[i] ); 

                }

                snapShotCell.appendChild(_img);
                projCount++;
            }

            let authorCell = projNameRow.insertCell( 0 );
            authorCell.style.paddingLeft = "25px";
            authorCell.style.paddingRight = "15px";
            authorCell.style.borderRight = "1px solid white";

            let _div = document.createElement('div');
            _div.innerText = "作者頁面";
            _div.className = "projNameOneRow";
            authorCell.appendChild(_div);

            let authorImgCell = snapShotRow.insertCell( 0 );
            authorImgCell.style.paddingLeft = "25px";
            authorImgCell.style.paddingRight = "15px";
            authorImgCell.style.borderRight = "1px solid white";

            let _img = document.createElement('img');

            getOneUserInfo( window.serverUrl , userPublishProjs.proj_list[0].user_id , ["head_pic"] , function(res){
                if (res.data.head_pic != ""){
                    _img.src = res.data.head_pic;
                }else{
                    _img.src = "https://mifly0makar0assets.s3-ap-northeast-1.amazonaws.com/DefaultResource/2D/icon/me2.png";
                }
            } );

            _img.style.borderRadius = "50%";
            _img.width = 50;
            _img.height = 50;
            authorImgCell.appendChild(_img);

        }

    }

}

let vrUI = new UI(); //// this will set vrUI as "Global" variable, can call from this window
