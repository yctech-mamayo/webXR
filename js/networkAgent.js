// (function() {
// 	'use strict'

// 	window.parseUserData = function( url, callback ) {
// 		let xhr = new XMLHttpRequest(); // why use const ??
// 		xhr.open( 'GET', url , true ) //  
// 		xhr.responseType = 'json' // set reponse as arraybuffer or text or json
// 		xhr.onload = function(e) {
			
// 			if (xhr.response.data){
// 				window.file = xhr.response.data ;
// 			}else{
// 				window.file = xhr.response ;
// 			}
// 			//// parse the transform from string to float array
// 			for (var i in window.file.scene_objs_v2){
// 				for (var j in window.file.scene_objs_v2[i].transform){
// 					var strings = window.file.scene_objs_v2[i].transform[j].split(",");
// 					if (strings.length != 3) { return -1; } 
// 					var floats = [ parseFloat(strings[0]), parseFloat(strings[1]), parseFloat(strings[2]) ];
// 					window.file.scene_objs_v2[i].transform[j]= floats;
// 				}	
// 			}

// 			return window.file;
// 		}
// 		xhr.send();
// 		return xhr.response ;
// 	}

// //[start-20190215-fei0054-add]//
// 	function parseDiaoyurar( diaoyurarData ){
// 		let b64Data = diaoyurarData;
// 		// Decode base64 (convert ascii to binary)
// 		let strData     = atob(b64Data);
// 		// Convert binary string to character-number array
// 		let charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
// 		// Turn number array into byte-array
// 		let binData     = new Uint8Array(charData);
// 		// Pako magic
// 		let data        = pako.inflate(binData);
// 		// Convert gunzipped byteArray back to ascii string:
// 		let resData     = String.fromCharCode.apply(null, new Uint16Array(data));
// 		// Convert string to JSON object  
// 		let resJsonData = JSON.parse(resData);

// 		return resJsonData;
// 	}
// //[end---20190215-fei0054-add]//

// 	////// query server for basic data by user_id
// 	////// 20190921: Fei abandon this function on server V3 



// //[start-20190905-fei0073-add]//

// 	// window.getMessageByUserID = function( url, user_id, callback ) {
// 	// 	if (!url ) return -1;
// 	// 	if (!user_id) user_id = "makarvr";
// 	// 	let xhr = new XMLHttpRequest();
// 	// 	let data = {
// 	// 		"user_id": user_id,
// 	// 	}
// 	// 	//////
// 	// 	///////// for V3 server and Editor
// 	// 	//////
// 	// 	if ( serverVersion == "3.0.0"){
// 	// 		let specificUrl = url+"get_message";
// 	// 		let request = {
// 	// 			"ver":"3.0.0",
// 	// 			"cid": 5,
// 	// 			"data":data
// 	// 		};
// 	// 		let jsonReq = JSON.stringify(request);
// 	// 		// console.log("netWorkAgent.js: getMessageByUserID: POST open, specificUrl=", specificUrl);
// 	// 		xhr.open( 'POST', specificUrl , true );

// 	// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 	// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 	// 		xhr.onload = function(e) {
// 	// 			console.log("networkAgent.js: getMessageByUserID,  onload xhr.response = ", xhr.response );			 
// 	// 		}
// 	// 		console.log("networkAgent.js: getMessageByUserID, jsonReq=", jsonReq );
// 	// 		xhr.send( jsonReq );
// 	// 	}
// 	// }

// 	window.getUserPublishProjsByUserID = function( url, user_id, main_type, sub_type, callback ) {
// 		if (!url ) return -1;
// 		if (!user_id) user_id = "makarvr";
// 		if (!main_type) main_type = "";
// 		if (!sub_type) sub_type = "";

// 		// console.log("networkAgent.js: _getUserPublishProjs: ");
// 		let xhr = new XMLHttpRequest();
// 		let data = {
// 			"user_id": user_id,
// 			'web_ar': true,
// 		}
// 		//////
// 		///////// for V3 server and Editor
// 		//////
// 		if ( serverVersion == "3.0.0"){
// 			getResByUserID(url, user_id, main_type, sub_type, function( userProjResDict ){
// 				// console.log("netWorkAgent.js: _getUserPublishProjs: _getResByUserID: callback");
// 				getUsrOnlineRes(url, user_id, main_type, sub_type , "" , function( userOnlineResDict ){
// 					let specificUrl = url+"get_usr_publish_projs";
// 					let request = {
// 						"ver":"3.0.0",
// 						"cid": 5,
// 						"data":data
// 					};
// 					let jsonReq = JSON.stringify(request);
// 					// console.log("netWorkAgent.js: _getUserPublishProjs: POST open, specificUrl=", specificUrl);
// 					xhr.open( 'POST', specificUrl , true );
		
// 					xhr.setRequestHeader('Content-Type', 'application/json');
// 					xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 					xhr.onload = function(e) {
// 						// console.log("networkAgent.js: _getUserPublishProjs,  onload xhr.response = ", xhr.response );
// 						let userPublishProjs;
// 						if (!xhr.response.error){
		
// 							if (xhr.response.data){
// 								userPublishProjs = xhr.response.data;
// 								// save the userData in window  
// 								if (!window.userPublishProjs){
// 									window.userPublishProjs = userPublishProjs; 
// 								}else{
// 									// console.log("networkAgent.js: _getUserPublishProjs: window.userPublishProjs already exist, replace it..");
// 									window.userPublishProjs = userPublishProjs; 
// 								}
		
// 								if (callback){
// 									// console.log("networkAgent.js: _getUserPublishProjs,  onload, do callback");
// 									callback(userPublishProjs , userProjResDict , userOnlineResDict );
// 								}  
// 							}else{
// 								if (callback) callback("networkAgent.js:error: no xhr.response.data"); 
// 							}
		
// 						}else{
// 							if (callback) callback( xhr.response.error ); 
// 							console.log('%cnetworkAgent.js: _getUserPublishProjs: oops something wrong: ', 'color:red', xhr.response.error);
// 						}
		
// 					}
// 					// console.log("networkAgent.js: _getUserPublishProjs, jsonReq=", jsonReq );
// 					xhr.send( jsonReq );

// 				}); // get the ARResList and create ARResDict 

// 			});				
		
// 		}
// 	}

// 	window.getNewestPublishProjs = function( url, proj_type, callback ) {
// 		if (!url ) return -1;
// 		if (!proj_type) proj_type = "ar";
// 		let xhr = new XMLHttpRequest();
// 		let data = {
// 			"proj_type": proj_type,
// 		}
// 		//////
// 		///////// for V3 server and Editor
// 		//////
// 		if ( serverVersion == "3.0.0"){
// 			let specificUrl = url+"get_newest_publish_projs";
// 			let request = {
// 				"ver":"3.0.0",
// 				"cid": 5,
// 				"data":data
// 			};
// 			let jsonReq = JSON.stringify(request);
// 			// console.log("netWorkAgent.js: getNewestPublishProjs: POST open, specificUrl=", specificUrl);
// 			xhr.open( 'POST', specificUrl , true );

// 			xhr.setRequestHeader('Content-Type', 'application/json');
// 			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 			xhr.onload = function(e) {
// 				console.log("networkAgent.js: getNewestPublishProjs,  onload xhr.response = ", xhr.response );
// 			}
// 			console.log("networkAgent.js: getNewestPublishProjs, jsonReq=", jsonReq );
// 			xhr.send( jsonReq );
// 		}
// 	}
// //[end---20190905-fei0073-add]//


// //[start-20191113-thonsha-add]//
// 	function readTextFile(file, callback)
// 	{
// 		var rawFile = new XMLHttpRequest();
// 		var txtcontent;
// 		// rawFile.open("GET", file, false);
// 		rawFile.open("GET", file, true);
// 		rawFile.onreadystatechange = function ()
// 		{
// 			if(rawFile.readyState === 4)
// 			{
// 				if(rawFile.status === 200 || rawFile.status == 0)
// 				{
// 					let allText = rawFile.responseText;
// 					txtcontent = allText;
// 					if (callback) callback( txtcontent );
// 				}
// 			}
// 		}
// 		rawFile.send(null);
// 	}
// //[end---20191113-thonsha-add]//
// 	//// 檢查所有的AR專案是否帶有『有效的憑證』
// 	function checkProjLicense(publishARProjs, callback){
// 		console.log("networkAgent.js: _checkProjLicense , publishARProjs=" , publishARProjs );
// 		//// 先loop一次所有AR專案判斷是否任何有『帶有憑證』
// 		let gotLicense = false;
// 		for (let i = 0, len = publishARProjs.result.length; i < len; i++ ){
// 			if (publishARProjs.result[i].editor_license_key != "" ){
// 				gotLicense = true;
// 				break;
// 			}
// 		}
// 		//// 假如沒有任何專案帶有憑證，直接返回即可
// 		if (gotLicense == false){
// 			if (callback) callback([]);
// 			return;
// 		}
// 		//// 假如有任何專案帶有憑證，則檢查是否有效，並且重新整理成為一個新的 array 
// 		let count = 0, result = [];
// 		for (let i = 0, len = publishARProjs.result.length; i < len; i++ ){
// 			if (publishARProjs.result[i].editor_license_key != "" ){
// 				getELicenseInfo( window.serverUrl , publishARProjs.result[i].editor_license_key , function(res){
// 					count++;
// 					if (res.error != ""){
// 						console.log("networkAgent.js: _checkProjLicense: getELicenseInfo error ", res );
// 					}else{
// 						console.log("networkAgent.js: _checkProjLicense: getELicenseInfo res = ", res );
// 						result.push(publishARProjs.result[i]);
// 					}
// 					//// 假如所有憑證都判定完成，回傳
// 					if ( count == len ) {
// 						console.log("networkAgent.js: _checkProjLicense: end, result= = ", result );
// 						if (callback) callback( result );
// 					}
// 				});
// 			}else{
// 				//// 由於跑到這代表一定會有專案帶有憑證，所以不需要在此判斷結束
// 				// console.log("networkAgent.js: _checkProjLicense: editor_license_key empty " , publishARProjs.result[i].editor_license_key );
// 				count++;				
// 			}
// 		}
// 	}

// 	//// get one scene by project id
// 	window.getARSceneByUserID = function( url, user_id, callback ) {
// 		if (!url ) return -1;
// 		if (!user_id) user_id = "makarvr";

// 		let sceneResult = [];
// 		sceneResult.user_id = user_id;

// //[start-20190904-fei0073-add]//
// 						//////
// 						////// server V3 part, getUserPublishProjsByUserID -> find proj_type=="ar"
// 						//////
// 		if ( serverVersion == "3.0.0"){
// 			var main_type = "";
// 			var sub_type = "";
			
// 			var getUserPublishProjsCallback = function(userPublishProjs , userProjResDict , userOnlineResDict ){
// 				if (typeof(userPublishProjs) == "string"){ // error log is string... 
// 					if(callback) callback(userPublishProjs);
// 					return;
// 				}
// 				// console.log("networkAgent.js:_getUserPublishProjs: userPublishProjs=", userPublishProjs, "\n userProjResDict=", userProjResDict );
// 				let count = 0;

// 				if (userPublishProjs.proj_list.length > 0){
// 					//////
// 					////// use get_ar_projs_by_proj_id to filter the AR proj 
// 					//////
// 					sceneResult.name = userPublishProjs.proj_list[0].name;

// 					let projIDList = [];
// 					for (let i in userPublishProjs.proj_list){
// 						if (userPublishProjs.proj_list[i].proj_type == "ar"){
// //[start-20200521-fei0095-add]//
// 							//// 判斷只有在 editor 勾選「開啟網頁展示」的專案會顯示。為了不造成顯示錯誤，統一由 interface 控管
// 							if (parent.useEditorWebTag){
// 								if ( !userPublishProjs.proj_list[i].proj_platform.find( item => item == "web") ){
// 									continue;
// 								}
// 							}
// //[end---20200521-fei0095-add]//

// 							///// debug ，只載入特定專案
// 							// if ( userPublishProjs.proj_list[i].proj_name != 'webar_demo' && 
// 		 					// 	 userPublishProjs.proj_list[i].proj_name != 'cube test9' && 
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'makar webAR Demo9' && 
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'sc39' && 
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'ctv509' && 
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'lena_collect9' &&
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'quizz29' &&
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'arBlockly' &&
// 							// 	 userPublishProjs.proj_list[i].proj_name != 'color_mother9' )
// 							// {
// 							// 	continue;
// 							// }

// 							projIDList.push( userPublishProjs.proj_list[i].proj_id  );
// 						}
// 					}


// 					let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 					let data = {
// 						"proj_id_list": projIDList
// 					}
// 					let specificUrl = url+"get_ar_projs_by_proj_id";
// 					let request = {
// 						"ver":"3.0.0",
// 						"cid": 5,
// 						"data":data
// 					};
// 					let jsonReq = JSON.stringify(request);
// 					// console.log("networkAgent.js: get_ar_projs_by_proj_id: jsonReqt=", jsonReq );
// 					xhr.open( 'POST', specificUrl , true );
// 					xhr.setRequestHeader('Content-Type', 'application/json');
// 					xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 					xhr.onload = function(e) {
// 						console.log("networkAgent.js: get_ar_projs_by_proj_id: onload, response=", xhr.response );
						
// 						//// do this only working around, make the member proj_list same as result. us  
// 						// window.userARData = xhr.response.data;
// 						// window.userARData.proj_list = xhr.response.data.result; 
// 						// window.userARData.user_id = user_id;

// 						let publishARProjs = xhr.response.data;
// 						//// 假如用戶本身為『不可使用web』，需要多判斷底下AR專案是否帶有 license 
// 						if (window.allowedMakarIDUseWeb == false){
// 							if(callback) callback("this ID[" + user_id + "] is free user, not allow to use webAR");

// 							// checkProjLicense(xhr.response.data , function(result){
// 							// 	if (result.length == 0){
// 							// 		if(callback) callback("this ID[" + user_id + "] is free user and there is none AR project with license");
// 							// 		return;
// 							// 	} else {
// 							// 		publishARProjs.result = result;
// 							// 		setARProjScene();
// 							// 	}
// 							// });
// 						} else {
// 							setARProjScene();
// 						}

// 						function setARProjScene(){
// 							publishARProjs.proj_list = publishARProjs.result;
// 							publishARProjs.user_id = user_id;
// 							window.publishARProjs = publishARProjs;


// 							//// v3.5.0.0 改版後， AR 專案會改為「可有多場景」。
// 							//// 所以讀取舊版本 AR 專案必須要忽略 新版專案

// 							if ( publishARProjs && Array.isArray(publishARProjs.result) 
// 								// && publishARProjs.result.length < 20
// 							){

// 								//// 要保留的 專案 
// 								let keepProj = [];

// 								for (let i = 0; i < publishARProjs.result.length; i++ ){
// 									let editor_ver = publishARProjs.result[ i ].editor_ver;

// 									if ( typeof( editor_ver ) == 'string' ){
										
// 										let vl = editor_ver.split( '.' );
// 										//// 版本長度必定是 3 or 4
// 										//// 4 碼代表 3.5.0.0 以上， 3 碼再來判斷是否 符合 
// 										//// 目前只有 3.4.0 含以下才可以通過。
// 										if ( vl.length == 3 ){
											
// 											if ( vl[0] == 3 && vl[1] < 5 ){

// 												if ( keepProj.length < 20 ){
// 													keepProj.push( publishARProjs.result[ i ] )
// 												}
// 											}

// 										}else{

// 										}

// 									}
// 								}

// 								publishARProjs.result = keepProj;
// 								publishARProjs.proj_list = keepProj;

// 							}


							
// 							if ( publishARProjs ){
// 								if ( publishARProjs.result ){
// 									if ( publishARProjs.result.length ){
// 										if (publishARProjs.result.length < 20){
// 											for (let i = 0; i < publishARProjs.result.length; i++ ){
// 												// console.log("networkAgent.js: get_ar_projs_by_proj_id: onload, publishARProjs.result=", i, publishARProjs.result[i] );
// 												let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 												let data = {
// 													"user_id": publishARProjs.result[i].user_id,
// 													"proj_id": publishARProjs.result[i].proj_id
// 												}
		
// 												let specificUrl = url+"get_ar_proj_scene"; // get_ar_proj_scene 
// 												let request = {
// 													"ver":"3.0.0",
// 													"cid": 5,
// 													"data":data
// 												};
// 												let getARProjSceneJsonReq = JSON.stringify(request);
// 												// console.log("netWorkAgent.js: _getUserPublishProjs: POST open, specificUrl=", specificUrl);
// 												xhr.open( 'POST', specificUrl , true );
// 												xhr.setRequestHeader('Content-Type', 'application/json');
// 												xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		
// 												xhr.onload = function(e) {
// 													count++;
// 													sceneResult[i] = xhr.response;
// 													// console.log("%cnetworkAgent.js: get_ar_proj_scene: onload, response=", "color:blue", i, xhr.response );
		
// 													//////
// 													////// check the consistency between every objects inside sceneResult and userProjResDict 
// 													////// save the res_url into scene
// 													//////
// 													for (let j = 0; j < sceneResult[i].data.scene_objs_v2.length; j++){
// 														if (sceneResult[i].data.scene_objs_v2[j].res_id){
// 															// console.log("networkAgent.js: _getUserPublishProjs: ", i, ", res", j );
// 															let res_id = sceneResult[i].data.scene_objs_v2[j].res_id;
// 															if (userProjResDict[res_id] ){ ////// the res_id in scene is exist in ARResDict. 
																
// 																if (userProjResDict[res_id].res_url == sceneResult[i].data.scene_objs_v2[j].res_url){
// 																	// console.log("%cnetworkAgent.js: _getUserPublishProjs: ARResDict.res_url same as scene.url", "color:black", i, j );
// 																}else{
// 																	console.log("networkAgent.js: _getUserPublishProjs: ARResDict.res_url different as scene.url, replace it" );
// 																	sceneResult[i].data.scene_objs_v2[j].res_url = userProjResDict[res_id].res_url;
// 																}
																
// 																if (userProjResDict[res_id].main_type=="model"){ ////// if the object is model 
// 																	if (userProjResDict[res_id].res_url_fbx){ ////// if the url of FBX exist( V3 Editor)
// 																		// console.log("networkAgent.js: _getUserPublishProjs: ARResDict.res_url_fbx exit, add it" );
// 																		sceneResult[i].data.scene_objs_v2[j].res_url_fbx = userProjResDict[res_id].res_url_fbx;
// 																	}else{
// 																		// ////// at v2 editor, Fei manually upload some FBX model to same path of .ios   
// 																		// if (userProjResDict[res_id].res_url_ios ){ ////// if the url of ios exist( V2 Editor)
// 																		// 	// console.log("%cnetworkAgent.js: _getUserPublishProjs: ARResDict.res_url_fbx not exit, use .ios", "color:green", userProjResDict[res_id] );
// 																		// 	var assest_name_arr = userProjResDict[res_id].res_url_ios.split(".ios");
// 																		// 	sceneResult[i].data.scene_objs_v2[j].res_url_fbx = assest_name_arr[0] + ".FBX";
// 																		// }else{
// 																		// 	console.log("%cnetworkAgent.js: _getUserPublishProjs: ARResDict. res_url_fbx and res_url_ios not exit, something worng ", "color:red" , userProjResDict[res_id]);
// 																		// }
// 																		console.log("networkAgent.js: _getUserPublishProjs: ARResDict.res_url_fbx not exit ", userProjResDict[res_id]);
		
// 																	}
// 																}
																
// 															} else {
																
// 															}
// 														} else {
// 															////// the object which main_type == prefab
// 															console.log("networkAgent.js: _getUserPublishProjs: prefab or error, res_id not exist ", sceneResult[i].data.scene_objs_v2[j] );
// 														}
// 													}
		
		
// 													if ( count == publishARProjs.result.length ){
// 														//// save the userData in window  
// 														console.log("networkAgent.js: _getARSceneByUserID: _getUserPublishProjs: count=", count, "sceneResult=", sceneResult);
// 														window.sceneResult = sceneResult; 
// 														window.userProjResDict = userProjResDict; 
// 														window.userOnlineResDict = userOnlineResDict; 
		
		
// 														if(callback) callback( sceneResult );
// 													}
		
// 												}
// 												xhr.send( getARProjSceneJsonReq );
		
// 											}
// 										}else{ //// publishARProjs.result.length > 20
// 											console.log("networkAgent.js: _getUserPublishProjs: count > 20 =", count, ", too many targets,.. can't afford " );
// 											if(callback) callback( "There are too many AR projects [" + count +"], cannot affort, please reduce some project" );
// 										}
// 									}
// 								}
// 							}
// 						}
// 					}
// 					xhr.send( jsonReq );

// 				}else{
// 					if(callback) callback("this ID doesn't publish any projects");
// 				}
// 			};

// 			// getUserPublishProjsByUserID(url, user_id, main_type, sub_type, getUserPublishProjsCallback );

// 			searchUserIDByUserID( url, user_id,  function(userIDs){
// 				for (let userID in userIDs.result ){
// 					if ( user_id.toLowerCase() === userIDs.result[userID].user_id.toLowerCase()  ){
// 						console.log("networkAgentVR.js: _searchUserIDByUserID: match, replace from [" , user_id , "] to [", userIDs.result[userID].user_id, "]"  );
// 						user_id = userIDs.result[userID].user_id;
// 					}
// 				}

// 				getPayInfoByUserID( url, user_id ,function( userPayInfo ){
// 					let expire_date, expire_date_ymd, expire_date_ymd_arr, ISOexpire_date;
	
// 	//[start-20191113-thonsha-mod]//
// 					let userIDWhiteList = 'https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/web_white_list/webVR_UserID_WhiteList.txt';
// 					readTextFile(userIDWhiteList, function(txtfile){
	
// 						let jsonObj = JSON.parse(txtfile);
// 						let userIDList = jsonObj["customizedUserID"]["list"];
// 						let nameList = [];
// 						for (let i = 0; i < userIDList.length; i++){
// 							nameList.push( userIDList[i]["name"].toLowerCase() );
// 						}
// 						let isInNameList = (nameList.indexOf(user_id.toLowerCase() ) > -1);
// 						console.log("networkAgent.js: _getPayInfoByUserID: nameList= ", nameList);
	
// 						if (userPayInfo.data){
// 							console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: user_type=", userPayInfo.data );
	
// 							////// 改為使用 web_ar 這個 key 來判斷是否可以體驗，基本上 free 用戶 一定是 false, 而註冊送的一個月用戶也是 false, proA/B/C是true
// 							////// 假如在 白名單列表裡面，直接設定為可以使用
// 							////// 後續有一狀況，假如用戶本身為不可使用，但是透過 license 發出的專案卻需要判定可用，需要額外判斷。固在此無條件往下執行。
// 							window.allowedMakarIDUseWeb = userPayInfo.data.web_ar || isInNameList;

// 							if ( userPayInfo.data.user_type == 'proA' || userPayInfo.data.user_type == 'proB' || userPayInfo.data.user_type == 'proC' || userPayInfo.data.user_type == 'custom' ){
// 								window.allowedMakarIDUseWeb = true;
// 							}

// 							// window.allowedMakarIDUseWeb = true;

// 							// if (window.allowedMakarIDUseWeb == false){
// 							// 	if(callback) callback("this ID[" + user_id + "] is free user, not allow to use webAR");
// 							// }
	
// 							getUserPublishProjsByUserID(url, user_id, main_type, sub_type, getUserPublishProjsCallback );
	
// 						}else{
// 							console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: error, userPayInfo=", userPayInfo );	
// 							if(callback) callback("this ID <br> [" + user_id + "] <br> user data error, please contact MIFLY for more information. ");
// 						}
	
// 					});
// 	//[end---20191113-thonsha-mod]//
	
// 				});


// 			});

			

		



// 		}
// //[end---20190904-fei0073-add]//

// 	}


// 	//// 依照「使用者 ID 」取得「 辨識圖 」
// 	window.getGCSSByUserID = function ( url , user_id ){
// 		if ( !user_id ) user_id = 'fefe';
// 		if (!url ) return -1;

// 		let specificUrl = url+"get_img_targets";

// 		let request = {
// 			data: {
// 				user_id: user_id
// 			}
// 		}

// 		return new Promise(function (resolve) {

//             let headers = new Headers({
//                 'user-agent': 'Mozilla/4.0 MDN Example',
//                 'content-type': 'application/json',
//             });


//             fetch( specificUrl , {
//                 body: JSON.stringify( request ),
//                 headers: headers,
//                 method: 'POST',
//                 cache: 'no-cache',
//                 credentials: 'same-origin',
//                 mode: 'cors'
//             })
//             .then(res => res.json())
//             .then(function (response) {

//                 console.log('_getGCSSByUserID_: ', response );
//                 resolve( response );

//             })
//             .catch(function (err) {
//             });

//         });

// 	}



// //[start-20190904-fei0073-add]//
// 	//////
// 	////// server V3 get_res / get_usr_online_res
// 	//////
// 	window.getResByUserID = function(url, user_id, main_type, sub_type, callback ){
// 		if (!user_id) user_id = "fefe";
// 		if (!main_type) main_type = "";
// 		if (!sub_type) sub_type = "";
// 		// console.log("networkAgent.js: _getResByUserID: ");

// 		let specificUrl = url+"get_res";
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": user_id , //miflytest
// 			"main_type": main_type , // ar, vr 
// 			"sub_type": sub_type 
// 		}
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			// console.log("networkAgent: _getResByUserID,  onload xhr.response = ", xhr.response );
// 			// console.log('%cnetworkAgent: _getResByUserID,  onload error ', 'color: blue');  //// color: #bada55

// 			if ( xhr.response.error ){
// 				console.log('networkAgent: _getResByUserID,  onload error ', xhr.response );  //// color: #bada55
// 			}else{
// 				// window.userARResList = xhr.response.data.list;
// 				// console.log('networkAgent: _getResByUserID,  onload  xhr.response= ', xhr.response );  //// color: #bada55
// 				if ( xhr.response.data.list.length > 0 ){
// 					createProjResDictFromResList(xhr.response.data.list, function( userProjResDict ){
// 						if (callback){
// 							callback( userProjResDict );
// 						}
// 					});
// 				}else{
// 					if (callback){
// 						console.log('networkAgent: _getResByUserID,  onload  use res is empty ' );  //// color: #bada55
// 						callback( {} );
// 					}
// 				}
			
// 			}

// 			// if (callback){
// 			// 	callback();
// 			// }

// 		}
// 		xhr.send( jsonReq );
// 	}

// 	//////
// 	////// search the res_id from res
// 	//////
// 	var createProjResDictFromResList = function( userARResList , callback ){
// 		if (!userARResList){
// 			console.log("netWorkAgent.js: createProjResDictFromResList: error, userARResList not defined " ); // Object.keys(userARResDict).length
// 			return -1;	
// 		}
// 		let userProjResDict = {};
// 		// console.log("netWorkAgent.js: createProjResDictFromResList: userARResList.length=", userARResList.length ); // Object.keys(userARResDict).length
// 		for (let i = 0; i < userARResList.length; i++ ){
// 			userProjResDict[ userARResList[i].res_id ] = userARResList[i];
// 			if ( i == userARResList.length-1 ){
// 				// console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userARResList.length ); // Object.keys(userARResDict).length
// 				callback( userProjResDict );
// 			}
// 		}
// 		// callback( userProjResDict );

// 		// window.userProjResDict = userProjResDict;
// 		// console.log("%cnetWorkAgent.js: createProjResDictFromResList:, userProjResDict=", "color:blue",userProjResDict); // Object.keys(userARResDict).length
// 	}

// //[end---20190904-fei0073-add]//


// //[start-20200220-fei0090-add]//
// window.getUsrOnlineRes = function( url, user_id, main_type, sub_type , category , callback ){
		
// 	if (!user_id) user_id = "fefe";
// 	if (!main_type) main_type = "";
// 	if (!sub_type) sub_type = "";
// 	if (!category) category = ""

// 	//get_usr_online_res
// 	let specificUrl = url+"get_usr_online_res";
// 	let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 	let data = {
// 		"user_id": user_id , //miflytest
// 		"main_type": main_type , // ar, vr 
// 		"sub_type": sub_type ,
// 		"category": category ,
// 	}
// 	let request = {
// 		"ver":"3.0.0",
// 		"cid": 5,
// 		"data":data
// 	};
// 	let jsonReq = JSON.stringify(request);
// 	xhr.open( 'POST', specificUrl , true );
// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 	xhr.onload = function(e) {
// 		console.log("networkAgentVR.js: _getUsrOnlineRes: res = ", xhr.response );

// 		if ( xhr.response.error ){
// 			console.log('networkAgent.js: _getUsrOnlineRes,  onload error ', xhr.response );  //// color: #bada55
// 		}else{
// 			console.log('networkAgent.js: _getUsrOnlineRes,  onload save ' , xhr.response );  //// color: #bada55
			
// 			if ( xhr.response.data.online_res_list.length > 0 ){
// 				createOnlineResDictFromResList( xhr.response.data.online_res_list , function( userOnlineResDict ){
// 					if (callback){
// 						callback( userOnlineResDict );
// 					}
// 				});
// 			}else{
// 				if (callback){
// 					console.log('networkAgent: _getUsrOnlineRes,  onload  use res is empty ' );  //// color: #bada55
// 					callback( {} ); // "use res is empty"
// 				}
// 			}
// 		}

// 	}
// 	xhr.send( jsonReq );
// }


// var createOnlineResDictFromResList = function( userOnlineResList , callback ){
// 	if (!userOnlineResList) return -1;
// 	let userOnlineResDict = {};
// 	for (let i = 0; i < userOnlineResList.length; i++ ){
// 		userOnlineResDict[ userOnlineResList[i].res_id ] = userOnlineResList[i];

// 		if ( i == userOnlineResList.length-1 ){
// 			console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userOnlineResList.length ); // Object.keys(userARResDict).length
// 			if (callback){
// 				callback( userOnlineResDict );
// 			}
// 		}
// 	}
// 	// window.userOnlineResDict = userOnlineResDict;
//  }

// //[end---20200220-fei0090-add]//

// 	window.getOneUserInfo = function(url , user_id, wanted_info_keys, callback){

// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			user_id: user_id,
// 			wanted_info_keys: wanted_info_keys
// 		}
// 		let specificUrl = url+"get_one_usr_info";
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: _getOneUserInfo: xhr.r=" , xhr.response );
		
// 			if (xhr.response.error == ""){
// 				if (callback){
// 					callback( xhr.response );
// 				}	
// 			}else{
// 				if (callback){
// 					callback( xhr.response.error );
// 				}
// 			}
// 		}
// 		xhr.send(jsonReq);

// 	}


// 	window.getARProjsByProjID = function(  projIDList , callback ){
// 		if (projIDList == undefined ) return;
// 		if (!Array.isArray(projIDList) ) return;
// 		if (projIDList.length < 1 ) return;
		
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"proj_id_list": projIDList
// 		}
// 		let specificUrl = window.serverUrl+"get_ar_projs_by_proj_id";
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			// console.log("networkAgentVR.js: _getARProjsByProjID: xhr.r=" , xhr.response );
		
// 			if (xhr.response.error == ""){
// 				if (callback){
// 					callback( xhr.response );
// 				}	
// 			}else{
// 				if (callback){
// 					callback( xhr.response.error );
// 				}
// 			}
			
// 		}
// 		xhr.send(jsonReq);
// 	}


// //[start-20191021-fei0076-add]//

// 	window.checkMaxScanTimes = function(url, index, callback){
// 		if (!url ) return -1;

// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": "fefe" , 
// 			"target_id": "1545795389.8544426.1988048228" , 
// 		}
// 		// console.log("networkAgent: checkMaxScanTimes, data = ", data );

// 		if ( serverVersion == "3.0.0"){
// 			let specificUrl = url+"check_max_scan_times";
// 			let request = {
// 				"ver":"3.0.0",
// 				"cid": 5,
// 				"data":data
// 			};
// 			let jsonReq = JSON.stringify(request);
			
// 			xhr.open( 'POST', specificUrl , true );

// 			xhr.setRequestHeader('Content-Type', 'application/json');
// 			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			
// 			xhr.onload = function(e) {
// 				console.log("networkAgent: checkMaxScanTimes, xhr.response.data = ", xhr.response.data );
// 			}
// 			xhr.send( jsonReq );

// 		}
// 	}

// 	// window.getScanTimes = function(url, index, callback){
// 	window.getScanTimes = function(url, user_id, callback){
// 		if (!url ) return -1;
// 		if (!user_id ) return -1;
// 		// if (!user_id ) user_id = "fefe";

// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": user_id , 
// 			"target_id": "1545795389.8544426.1988048228" ,
// 		}
// 		// console.log("networkAgent: getScanTimes, data = ", data );

// 		if ( serverVersion == "3.0.0"){
// 			let specificUrl = url+"get_scan_times";
// 			let request = {
// 				"ver":"3.0.0",
// 				"cid": 5,
// 				"data":data,
// 			};
// 			let jsonReq = JSON.stringify(request);
			
// 			xhr.open( 'POST', specificUrl , true );

// 			xhr.setRequestHeader('Content-Type', 'application/json');
// 			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			
// 			xhr.onload = function(e) {
// 				console.log("networkAgent: getScanTimes, xhr.response.data = ", xhr.response.data );
// 			}
// 			xhr.send( jsonReq );

// 		}
// 	}

// //[end---20191021-fei0076-add]//

// //[start-20190715-fei0070-add]//
// 	// window.uploadDataToServer = function(url, index, callback){
// 	window.addScanTimesByTargetID = function(url, user_id, target_id, callback){
// 		if (!url ) return -1;
// 		if (!user_id ) return -1;
// 		if (!target_id ) return -1;

// 		let data = {
// 			"user_id": user_id,
// 			"target_id": target_id, // 1545795389.8544426.1988048228
// 			"device_id":"",
// 			"location_lan":"",
// 			"location_long":"",
// 		}

// 		// console.log("The navigator userAgent: ", navigator.userAgent );
// 		if ( navigator.userAgent && Browser ){
// 			let ua = navigator.userAgent;
// 			// let uas = navigator.userAgent.toLowerCase();
	
// 			///////// get the first (...) the inner is os info.
// 			let leftm  = navigator.userAgent.indexOf( "(", 0 );
// 			let rightm = navigator.userAgent.indexOf( ")", 0 );
// 			if ( leftm > 0 && rightm > 0 ){
// 				let os = ua.slice( leftm + 1, rightm );
// 				let oss = os.toLowerCase();
// 				// console.log("left right: ", leftm, rightm, os  );
// 				// console.log("Browser platform/name/version : ", Browser.platform, Browser.name, Browser.version );
// 				data.os = os;
// 				data.brand = Browser.platform + " " + Browser.name + " " + Browser.version;
// 			}
			
// 			///////// It almost same as checkBrowser result, only mozilla <-> firefox different. 
// 			// var platform_match = /(ipad)/.exec( uas ) ||/(ipod)/.exec( uas ) ||/(windows phone)/.exec( uas ) ||/(iphone)/.exec( uas ) ||
// 			// /(kindle)/.exec( uas ) ||/(silk)/.exec( uas ) ||/(android)/.exec( uas ) ||/(win)/.exec( uas ) ||/(mac)/.exec( uas ) ||
// 			// /(linux)/.exec( uas ) ||/(cros)/.exec( uas ) ||/(playbook)/.exec( uas ) ||/(bb)/.exec( uas ) ||/(blackberry)/.exec( uas ) ||[];

// 			// var match = /(edge)\/([\w.]+)/.exec( uas ) ||/(opr)[\/]([\w.]+)/.exec( uas ) ||/(chrome)[ \/]([\w.]+)/.exec( uas ) ||
// 			// 	/(iemobile)[\/]([\w.]+)/.exec( uas ) ||/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( uas ) ||
// 			// 	/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( uas ) ||/(webkit)[ \/]([\w.]+)/.exec( uas ) ||
// 			// 	/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( uas ) ||/(firefox)[ \/]([\w.]+)/.exec( uas ) ||[];
// 			// var browser = match[ 5 ] || match[ 3 ] || match[ 1 ] || "";
// 			// var version = match[ 2 ] || match[ 4 ] || "0";
// 			// var platform = platform_match[ 0 ] || "";
// 			// console.log("Browser platform/name : ", Browser.platform, Browser.name, Browser.version );
// 			// console.log(" platform_match, =", platform_match, match );
// 			// console.log("platform, browser, version =", platform, browser, version );
// 		}
		
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one

// 		if ( serverVersion == "3.0.0"){
// 			let specificUrl = url+"add_scan_times";
// 			let request = {
// 				"ver":"3.0.0",
// 				"cid": 5,
// 				"data":data
// 			};
// 			let jsonReq = JSON.stringify(request);

// 			xhr.open( 'POST', specificUrl , true );

// 			xhr.setRequestHeader('Content-Type', 'application/json');
// 			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			
// 			xhr.onload = function(e) {
// 				// console.log("networkAgent: addScanTimesByTargetID, xhr.response.data = ", xhr.response.data  );
// 			}
// 			// xhr.send( jsonReq );

// 		}

// 		if ( serverVersion == "2.0.0"){
// 			let strData = JSON.stringify(data);
// 			let FD  = new FormData();
// 			FD.append("cmd", "add_scan_times");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
// 			FD.append("data", strData );

// 			xhr.open( 'POST', url , true );
// 			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 			xhr.onload = function(e) {
// 				console.log("networkAgent: uploadDataToServer, xhr = ", xhr.response.data );
// 			}

// 			xhr.send( FD );
// 		}
// 	}

// 	window.getPayInfoByUserID = function( url, user_id, callback ){
// 		if (!url ) return -1;
// 		if (!user_id ) return -1;
// 		// if (!url ) url = "https://ssl-api-makar-v3-apps.miflyservice.com:8081/Makar/";
// 		// if (!user_id ) user_id = "fefe";

// 		let specificUrl = url + "get_pay_info"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": user_id , // user_id: miflytest
// 		}
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			// console.log("networkAgent.js: getPayInfoByUserID: xhr.response", xhr.response.data );
// 			// console.log("networkAgent.js: getPayInfoByUserID: user_type", xhr.response.data.user_type );

// 			if (callback){
// 				callback( xhr.response );
// 			}
// 		}
// 		xhr.send( jsonReq );
// 	}


// 	//// 取得 license 相關的訊息
// 	window.getELicenseInfo = function( url, license_key, callback ){
// 		if (!url ) return -1;
// 		if (!license_key ) return -1;
		
// 		let specificUrl = url + "get_e_lice_info"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"license_key": license_key , // user_id: miflytest
// 		}
// 		let request = {
// 			"ver":"3.1.1",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			// console.log("networkAgentVR.js: _getELicenseInfo: res = " , xhr.response );
// 			if (callback){
// 				callback( xhr.response );
// 			}
// 		}
// 		xhr.send( jsonReq );
// 	}

// 	////// 通用的 Post 格式 
// 	function sendPost(destination, dataObject, callback){
// 		let xhr = new XMLHttpRequest();
// 		let request = {
// 			ver: "3.1.1",
// 			cid: 5,
// 			data: dataObject
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open('POST', destination, true);
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json';
// 		xhr.addEventListener("load", function() {
// 			if (callback){
// 				callback(xhr.response);
// 			}
// 		});
// 		xhr.send(jsonReq);
// 	}

// 	////// 檢查各專案是否帶有 lisence 
// 	window.checkLicenseInProjs = function( url , callback ){
// 		let specificUrl , arList=[], vrList=[], xrList=[], projList=[] ;
// 		////先收集一次各類別 proj_id 
// 		for (let i = 0, len = userPublishProjs.proj_list.length; i < len; i++ ){
// 			switch(userPublishProjs.proj_list[i].proj_type){
// 				case "ar":
// 					arList.push( userPublishProjs.proj_list[i].proj_id );
// 					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
// 					break;
// 				case "vr":
// 					vrList.push( userPublishProjs.proj_list[i].proj_id );
// 					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
// 					break;
// 				case "ar_slam":
// 					xrList.push( userPublishProjs.proj_list[i].proj_id );
// 					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
// 					break;
// 				default:
// 					console.error("networkAgentVR.js: _checkLicenseInProjs: project type ERROR" , userPublishProjs.proj_list[i].proj_type );
// 					break;
// 			}
// 		}

// 		////// 處理各類別專案，非同步的處理
// 		let licenseInfos = [];
// 		function getProjs(res){
// 			for (let i = 0, len = projList.length; i < len; i++ ){
// 				for (let j = 0, len = res.data.result.length; j < len; j++ ){
// 					if (projList[i].proj_id == res.data.result[j].proj_id  ){
// 						if (res.data.result[j].editor_license_key != ""){
// 							getELicenseInfo(url , res.data.result[j].editor_license_key , function(res){
// 								if (res.error != ""){
// 									licenseInfos.push({proj_id: projList[i].proj_id, isLicense: false });
// 								}else{
// 									licenseInfos.push({proj_id: projList[i].proj_id, isLicense: true });
// 								}
// 								////// 檢查是否填入完成
// 								if (licenseInfos.length == projList.length){
// 									if (callback){
// 										callback(licenseInfos);
// 									}
// 								}
// 							});
// 						}else{
// 							licenseInfos.push({proj_id: projList[i].proj_id, isLicense: false });
// 						}
// 					}
// 				}	
// 			}
// 			////// 檢查是否填入完成
// 			if (licenseInfos.length == projList.length){
// 				if (callback){
// 					callback(licenseInfos);
// 				}
// 			}
// 		}
// 		//// 各類別分別查看 license 
// 		if (arList.length > 0) {
// 			sendPost(url + "get_ar_projs_by_proj_id", {proj_id_list: arList } , getProjs );
// 		}
// 		if (vrList.length > 0) {
// 			sendPost(url + "get_vr_projs_by_proj_id" , {proj_id_list: vrList }, getProjs );
// 		}
// 		if (xrList.length > 0) {
// 			sendPost(url + "get_arslam_projs_by_proj_id", {proj_id_list: xrList } , getProjs );
// 		}

// 	}

// 	//// 從server 取得模組專案資訊
// 	window.getRecordModule = function(url, playing_user_id , proj_id, callback){
// 		if (!url ) return -1;
// 		sendPost(url + "get_record_module", {playing_user_id: playing_user_id, proj_id: proj_id } , function(ret){
// 			console.log("networkAgentVR.js: _getRecordModule: ret" , ret );
// 			if (callback){
// 				callback(ret);
// 			}
// 		});
// 	}

// 	//// 上傳 quiz log資訊到server，給數據分析使用 
// 	window.quizLog = function(url, data, callback){
// 		sendPost(url + "quiz_log", data , function(ret){
// 			console.log("networkAgentVR.js: _quizLog: ret" , ret );
// 			if (callback){
// 				callback(ret);
// 			}
// 		});
// 	}

// 	//// 上傳 quiz record 資訊到server，給viewer端檢驗 
// 	window.updateRecordModule = function(url, data, callback){
// 		sendPost(url + "update_record_module", data , function(ret){
// 			console.log("networkAgentVR.js: _updateRecordModule: ret" , ret );
// 			if (callback){
// 				callback(ret);
// 			}
// 		});
// 	}

// 	window.getViewerConfig = function(url, callback){
// 		if (!url ) return -1;
// 		let specificUrl = url + "get_viewer_config"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let request = {
// 			"ver":"3.1.1",
// 			"cid": 5,
// 			"data":{}
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: _getViewerConfig: xhr.response", xhr.response );
// 			if (callback){
// 				callback(xhr.response);
// 			}
// 		}
// 		xhr.send( jsonReq );

// 	}

// 	////// 上傳集點卡紀錄至雲端資料庫
// 	window.pointCardLog = function( url , data , callback){
// 		if (!url ) return -1;
// 		if (!webARVersion ) return -1;
// 		let specificUrl = url + "point_card_log"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let request = {
// 			"ver": webARVersion,
// 			"cid": 5,
// 			"data": data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: _pointCardLog: xhr.response = ", xhr.response );
// 			if (callback){
// 				callback(xhr.response);
// 			}
// 		}
// 		xhr.send( jsonReq );
// 	}

// 	////// 上傳括括卡紀錄至雲端資料庫
// 	window.scratchCardLog = function( url , data , callback){
// 		if (!url ) return -1;
// 		if (!webARVersion ) return -1;
// 		let specificUrl = url + "scratch_card_log"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let request = {
// 			"ver": webARVersion,
// 			"cid": 5,
// 			"data": data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: _scratchCardLog: xhr.response = ", xhr.response );
// 			if (callback){
// 				callback(xhr.response);
// 			}
// 		}
// 		xhr.send( jsonReq );
// 	}


// 	window.testMakarApi = function(){
		
// 		// let specificUrl = "https://ssl-api-makar-v3-apps.miflyservice.com:8081/Makar/" + "get_viewer_config"; //set the url you want
// 		let specificUrl = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/" + "get_viewer_config"; //set the url you want

// 		specificUrl = "https://ssl-api-makar-apps.miflyservice.com/Makar/get_viewer_config";
// 		// specificUrl = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/get_viewer_config";
// 		// let specificUrl = serverUrl + "get_viewer_config"; //set the url you want

// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": "fefe" , // user_id: miflytest
// 			"main_type": "" , // main_type: image, video, model
// 			"sub_type": "" // sub_type : ""
// 		}
// 		let request = {
// 			"ver":"3.1.1",
// 			"cid": 5,
// 			"data":{}
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: testMakarApi: xhr.response", xhr.response );
// 		}
// 		xhr.send( jsonReq );

// 	}

// //[start-20191115-fei0079-debug]//
// 	// // Encrypt
// 	// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
// 	// // Decrypt
// 	// var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
// 	// var originalText = bytes.toString(CryptoJS.enc.Utf8);
// 	// console.log("networkAgent.js: originalText=", originalText );
// //[end---20191115-fei0079-debug]//



// 	window.searchUserIDByUserID = function( url, user_id, callback ){
// 		if (!url ) return -1;
// 		if (!user_id ) return -1;

// 		let specificUrl = url + "get_many_usr_info_keyword"; //set the url you want
// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			keyword: user_id,
// 			search_keys: ["user_id"]
// 		};
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		xhr.open( 'POST', specificUrl , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
// 		xhr.onload = function(e) {
// 			console.log("networkAgent.js: _searchUserIDByUserID: xhr.response", xhr.response.data );
// 			// console.log("networkAgent.js: getPayInfoByUserID: user_type", xhr.response.data.user_type );

// 			if (callback){
// 				callback( xhr.response.data );
// 			}
// 		}
// 		xhr.send( jsonReq );
// 	}


// 	////// POST test
// 	window.testPOST = function(url, callback){
// 		// if (!url ) return -1;

// 		var url2 = "http://60.250.125.146:8081/Makar/get_usr_publish_projs"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res
// 		// var url2 = "https://60.250.125.146:8888/Makar/get_usr_publish_projs"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

// 		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
// 		let data = {
// 			"user_id": "fefe", //miflytest
// 		}
// 		let request = {
// 			"ver":"3.0.0",
// 			"cid": 5,
// 			"data":data,
// 			"length":8,
// 		};
// 		let jsonReq = JSON.stringify(request);
// 		console.log(" jsonReq ", jsonReq);

// 		let FD  = new FormData();
// 		FD.append("cmd", "add_scan_times");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
// 		FD.append("data", jsonReq );

// 		xhr.open( 'POST', url2 , true );
// 		xhr.setRequestHeader('Content-Type', 'application/json');
// 		// xhr.setRequestHeader('Content-type', 'application/json ; charset=UTF-8');
// 		// xhr.setRequestHeader('Accept', 'application/json');
// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"

// 		xhr.onload = function(e) {
// 			console.log("networkAgent: testPOST,  onload xhr = ", xhr, xhr.response );
// 		}
// 		xhr.send( jsonReq );
// 		// xhr.send( FD );

// 	}

// //[end---20190715-fei0070-add]//

// })();
