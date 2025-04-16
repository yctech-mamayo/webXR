(function() {
	'use strict'

	window.parseUserData = function( url, callback ) {
		let xhr = new XMLHttpRequest(); // why use const ??
		xhr.open( 'GET', url , true ) //  
		xhr.responseType = 'json' // set reponse as arraybuffer or text or json
		xhr.onload = function(e) {
			
			if (xhr.response.data){
				window.file = xhr.response.data ;
			}else{
				window.file = xhr.response ;
			}
			//// parse the transform from string to float array
			for (var i in window.file.scene_objs_v2){
				for (var j in window.file.scene_objs_v2[i].transform){
					var strings = window.file.scene_objs_v2[i].transform[j].split(",");
					if (strings.length != 3) { return -1; } 
					var floats = [ parseFloat(strings[0]), parseFloat(strings[1]), parseFloat(strings[2]) ];
					window.file.scene_objs_v2[i].transform[j]= floats;
				}	
			}

			return window.file;
		}
		xhr.send();
		return xhr.response ;
	}

//[start-20190215-fei0054-add]//
	function parseDiaoyurar( diaoyurarData ){
		let b64Data = diaoyurarData;
		// Decode base64 (convert ascii to binary)
		let strData     = atob(b64Data);
		// Convert binary string to character-number array
		let charData    = strData.split('').map(function(x){return x.charCodeAt(0);});
		// Turn number array into byte-array
		let binData     = new Uint8Array(charData);
		// Pako magic
		let data        = pako.inflate(binData);
		// Convert gunzipped byteArray back to ascii string:
		let resData     = String.fromCharCode.apply(null, new Uint16Array(data));
		// Convert string to JSON object  
		let resJsonData = JSON.parse(resData);

		return resJsonData;
	}
//[end---20190215-fei0054-add]//

	////// query server for basic data by user_id
	////// 20190921: Fei abandon this function on server V3 
	window.getARProjsByUserID = function( url, user_id, callback ) {
		if (!url ) return -1;
		if (!user_id) user_id = "makarvr";
		let xhr = new XMLHttpRequest();
		let data = {
			"user_id": user_id,
			"cid": "20"
		}
//[start-20190904-fei0073-add]//
		//////
		///////// for V3 server and Editor
		//////
		if ( serverVersion == "3.0.0"){
			console.log("%cnetWorkAgent.js: getARProjsByUserID: you shoudnt see this, Fei abandon this function in server V3", "color:red");
			getResByUserID(url, user_id, "", "", function(){
				console.log("netWorkAgent.js: getARProjsByUserID: getResByUserID: callback");

				let specificUrl = url+"get_ar_projs";
				let request = {
					"ver":"3.0.0",
					"cid": 5,
					"data":data
				};
				let jsonReq = JSON.stringify(request);
				// console.log("netWorkAgent.js: getARProjsByUserID: POST open, specificUrl=", specificUrl);
				xhr.open( 'POST', specificUrl , true );

				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
				xhr.onload = function(e) {
					console.log("networkAgent.js: getARProjsByUserID,  onload xhr.response = ", xhr.response );
					let userData;
					if (!xhr.response.error){
						if (xhr.response.data){
							userData = xhr.response.data;
							//// save the userData in window  
							if (!window.userARData){
								window.userARData = userData; 
							}else{
								// console.log("networkAgent.js: getARProjsByUserID: window.userARData already exist, replace it..");
								window.userARData = userData; 
							}

							if (callback) callback(userData); 
						}else{
							if (callback) callback("networkAgent.js:error: no xhr.response.data"); 
						}
					}else{
						if (callback) callback( xhr.response.error ); 
						console.log("networkAgent.js: getARProjsByUserID: oops something wrong:",xhr.response.error);
					}
				}
				// console.log("netWorkAgent.js: getARProjsByUserID: POST send, jsonReq=", jsonReq);
				xhr.send( jsonReq );

			}); // get the ARResList and create ARResDict 

			
		}
		

//[end---20190904-fei0073-add]//
		//////
		////// server V2 part 
		//////
		if ( serverVersion == "2.0.0"){
			let strData = JSON.stringify(data);
			//// the formData
			let FD  = new FormData();
			FD.append("cmd", "get_ar_projs");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
			FD.append("data", strData );

			xhr.open( 'POST', url , true );
			// xhr.setRequestHeader('Content-Type', 'text/plain' );		
			xhr.responseType = 'json' // set reponse as arraybuffer or text or json

			xhr.onload = function(e) {
				console.log("networkAgent.js:getARProjsByUserID:", xhr.response );
				let userData;

//[start-20190214-fei0054-mod]//
				//// MAKAR "will" all use gzip compress the text as soon as We can(?)
				if (xhr.response.diaoyurar ){
					// console.log("networkAgent.js: getARProjsByUserID: xhr.response.diaoyurar ");

					let jsonData =  parseDiaoyurar(xhr.response.diaoyurar);
					if (!jsonData.error){
						if (jsonData.data){
							userData = jsonData.data;
							//// save the userData in window  
							if (!window.userARData){
								window.userARData = userData; 
							}else{
								console.log("networkAgent.js: getARProjsByUserID: window.userARData already exist, replace it..");
								window.userARData = userData; 
							}
							if (callback) callback(userData); 
						}else{
							if (callback) callback("networkAgent.js:error: no jsonData.data"); 
						}

					}else{
						if (callback) callback( jsonData.error ); 
						console.log("networkAgent.js: getARProjsByUserID: oops something wrong:", jsonData.error);
					}

					// console.log(jsonData);
				}else{
					// console.log("networkAgent.js: getARProjsByUserID: not xhr.response.diaoyurar ", xhr.response);

					if (!xhr.response.error){
						if (xhr.response.data){
							
							userData = xhr.response.data;

							// console.log("networkAgent.js:getARProjsByUserID: onload" );
							//// save the userData in window  
							if (!window.userARData){
								window.userARData = userData; 
							}else{
								// console.log("networkAgent.js: getARProjsByUserID: window.userARData already exist, replace it..");
								window.userARData = userData; 
							}
		
							if (callback) callback(userData); 
						}else{
							if (callback) callback("networkAgent.js:error: no xhr.response.data"); 
						}
					}else{
						if (callback) callback( xhr.response.error ); 
						console.log("networkAgent.js: getARProjsByUserID: oops something wrong:",xhr.response.error);
					}
				}
//[end---20190214-fei0054-mod]//
			}
			xhr.send( FD );
		}
		

	}

//[start-20190905-fei0073-add]//

	// window.getMessageByUserID = function( url, user_id, callback ) {
	// 	if (!url ) return -1;
	// 	if (!user_id) user_id = "makarvr";
	// 	let xhr = new XMLHttpRequest();
	// 	let data = {
	// 		"user_id": user_id,
	// 	}
	// 	//////
	// 	///////// for V3 server and Editor
	// 	//////
	// 	if ( serverVersion == "3.0.0"){
	// 		let specificUrl = url+"get_message";
	// 		let request = {
	// 			"ver":"3.0.0",
	// 			"cid": 5,
	// 			"data":data
	// 		};
	// 		let jsonReq = JSON.stringify(request);
	// 		// console.log("netWorkAgent.js: getMessageByUserID: POST open, specificUrl=", specificUrl);
	// 		xhr.open( 'POST', specificUrl , true );

	// 		xhr.setRequestHeader('Content-Type', 'application/json');
	// 		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
	// 		xhr.onload = function(e) {
	// 			console.log("networkAgent.js: getMessageByUserID,  onload xhr.response = ", xhr.response );			 
	// 		}
	// 		console.log("networkAgent.js: getMessageByUserID, jsonReq=", jsonReq );
	// 		xhr.send( jsonReq );
	// 	}
	// }

	window.getUserPublishProjsByUserID = function( url, user_id, main_type, sub_type, callback ) {
		if (!url ) return -1;
		if (!user_id) user_id = "makarvr";
		if (!main_type) main_type = "";
		if (!sub_type) sub_type = "";

		// console.log("networkAgent.js: _getUserPublishProjs: ");
		let xhr = new XMLHttpRequest();
		let data = {
			"user_id": user_id,
			'web_ar': true,
		}
		//////
		///////// for V3 server and Editor
		//////
		if ( serverVersion == "3.0.0"){
			// getResByUserID(url, user_id, main_type, sub_type, function(){
			getResByUserID(url, user_id, main_type, sub_type, function( userProjResDict ){
				
				getUsrOnlineRes(url, user_id, main_type, sub_type , "" , function( userOnlineResDict ){
					// console.log("netWorkAgent.js: _getUserPublishProjs: getResByUserID: callback");

					let specificUrl = url+"get_usr_publish_projs";
					let request = {
						"ver":"3.0.0",
						"cid": 5,
						"data":data
					};
					let jsonReq = JSON.stringify(request);
					// console.log("netWorkAgent.js: _getUserPublishProjs: POST open, specificUrl=", specificUrl);
					xhr.open( 'POST', specificUrl , true );
		
					xhr.setRequestHeader('Content-Type', 'application/json');
					xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
					xhr.onload = function(e) {
						// console.log("networkAgent.js: _getUserPublishProjs,  onload xhr.response = ", xhr.response );
						let userPublishProjs;
						if (!xhr.response.error){
		
							if (xhr.response.data){
								userPublishProjs = xhr.response.data;
								//// save the userData in window  
								if (!window.userPublishProjs){
									window.userPublishProjs = userPublishProjs; 
								}else{
									// console.log("networkAgent.js: _getUserPublishProjs: window.userPublishProjs already exist, replace it..");
									window.userPublishProjs = userPublishProjs; 
								}

								if (callback){
									// console.log("networkAgent.js: _getUserPublishProjs,  onload, do callback");
									// callback(userPublishProjs);
									callback(userPublishProjs , userProjResDict , userOnlineResDict );
								}  
							}else{
								if (callback) callback("networkAgent.js:error: no xhr.response.data"); 
							}
		
						}else{
							if (callback) callback( xhr.response.error ); 
							console.log('%cnetworkAgent.js: _getUserPublishProjs: oops something wrong: ', 'color:red', xhr.response.error);
						}
		
					}
					// console.log("networkAgent.js: _getUserPublishProjs, jsonReq=", jsonReq );
					xhr.send( jsonReq );


				});


				

			}); // get the ARResList and create ARResDict 

		
		}
	}

	window.getNewestPublishProjs = function( url, proj_type, callback ) {
		if (!url ) return -1;
		if (!proj_type) proj_type = "vr";
		let xhr = new XMLHttpRequest();
		let data = {
			"proj_type": proj_type,
		}
		//////
		///////// for V3 server and Editor
		//////
		if ( serverVersion == "3.0.0"){
			let specificUrl = url+"get_newest_publish_projs";
			let request = {
				"ver":"3.0.0",
				"cid": 5,
				"data":data
			};
			let jsonReq = JSON.stringify(request);
			// console.log("netWorkAgent.js: getNewestPublishProjs: POST open, specificUrl=", specificUrl);
			xhr.open( 'POST', specificUrl , true );

			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			xhr.onload = function(e) {
				console.log("networkAgent.js: getNewestPublishProjs,  onload xhr.response = ", xhr.response );
			}
			console.log("networkAgent.js: getNewestPublishProjs, jsonReq=", jsonReq );
			xhr.send( jsonReq );
		}
	}
//[end---20190905-fei0073-add]//


//[start-20190904-fei0073-add]//
	//////
	////// server V3 get_res / get_usr_online_res
	//////
	window.getResByUserID = function(url, user_id, main_type, sub_type, callback ){
		if (!user_id) user_id = "makarvr";
		if (!main_type) main_type = "";
		if (!sub_type) sub_type = "";
		// console.log("networkAgent.js: _getResByUserID: ");

		let specificUrl = url+"get_res";
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"user_id": user_id , //miflytest
			"main_type": main_type , // ar, vr 
			"sub_type": sub_type 
		}
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			// console.log("networkAgent: _getResByUserID,  onload xhr.response = ", xhr.response );
			// console.log('%cnetworkAgent: _getResByUserID,  onload error ', 'color: blue');  //// color: #bada55

			if ( xhr.response.error ){
				console.log('%cnetworkAgent: _getResByUserID,  onload error ', 'color:red', xhr.response );  //// color: #bada55
			}else{
				console.log('%cnetworkAgent: _getResByUserID,  onload save ', 'color:blue', xhr.response.data.list );  //// color: #bada55
				
				// createProjResDictFromResList(xhr.response.data.list);

				if ( xhr.response.data.list.length > 0 ){
					createProjResDictFromResList(xhr.response.data.list, function( userProjResDict ){
						if (callback){
							callback( userProjResDict );
						}
					});
				}else{
					if (callback){
						console.log('networkAgent: _getResByUserID,  onload  use res is empty ' );  //// color: #bada55
						callback( {} ); // "use res is empty"
					}
				}

			}

			// if (callback){
			// 	callback();
			// }

		}
		xhr.send( jsonReq );
	}

	//////
	////// search the res_id from res
	//////
	var createProjResDictFromResList = function( userResList , callback ){
		if (!userResList) return -1;
		let userProjResDict = {};
		for (let i = 0; i < userResList.length; i++ ){
			userProjResDict[ userResList[i].res_id ] = userResList[i];

			if ( i == userResList.length-1 ){
				console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userResList.length ); // Object.keys(userARResDict).length
				if (callback){
					callback( userProjResDict );
				}
			}
		}
		// window.userProjResDict = userProjResDict;
		// console.log("%cnetWorkAgent.js: createProjResDictFromResList:, userProjResDict=", "color:blue",userProjResDict); // Object.keys(userARResDict).length
	}

//[end---20190904-fei0073-add]//

//[start-20200220-fei0090-add]//
	window.getUsrOnlineRes = function( url, user_id, main_type, sub_type , category , callback ){
		
		if (!user_id) user_id = "fefe";
		if (!main_type) main_type = "";
		if (!sub_type) sub_type = "";
		if (!category) category = ""

		//get_usr_online_res
		let specificUrl = url+"get_usr_online_res";
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"user_id": user_id , //miflytest
			"main_type": main_type , // ar, vr 
			"sub_type": sub_type ,
			"category": category ,
		}
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			console.log("networkAgentVR.js: _getUsrOnlineRes: res = ", xhr.response );

			if ( xhr.response.error ){
				console.log('networkAgent.js: _getUsrOnlineRes,  onload error ', xhr.response );  //// color: #bada55
			}else{
				console.log('networkAgent.js: _getUsrOnlineRes,  onload save ' , xhr.response );  //// color: #bada55
				
				if ( xhr.response.data.online_res_list.length > 0 ){
					createOnlineResDictFromResList( xhr.response.data.online_res_list , function( userOnlineResDict ){
						if (callback){
							callback( userOnlineResDict );
						}
					});
				}else{
					if (callback){
						console.log('networkAgent: _getUsrOnlineRes,  onload  use res is empty ' );  //// color: #bada55
						callback( {} ); // "use res is empty"
					}
				}
			}

		}
		xhr.send( jsonReq );
	}


	var createOnlineResDictFromResList = function( userOnlineResList , callback ){
		if (!userOnlineResList) return -1;
		let userOnlineResDict = {};
		for (let i = 0; i < userOnlineResList.length; i++ ){
			userOnlineResDict[ userOnlineResList[i].res_id ] = userOnlineResList[i];

			if ( i == userOnlineResList.length-1 ){
				console.log("netWorkAgent.js: createProjResDictFromResList: i == userARResList.length, callback", i, userOnlineResList.length ); // Object.keys(userARResDict).length
				if (callback){
					callback( userOnlineResDict );
				}
			}
		}
		// window.userOnlineResDict = userOnlineResDict;
 	}

	window.getOneUserInfo = function(url , user_id, wanted_info_keys, callback){

		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			user_id: user_id,
			wanted_info_keys: wanted_info_keys
		}
		let specificUrl = url+"get_one_usr_info";
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			// console.log("networkAgentVR.js: _getOneUserInfo: xhr.r=" , xhr.response );
		
			if (xhr.response.error == ""){
				if (callback){
					callback( xhr.response );
				}	
			}else{
				if (callback){
					callback( xhr.response.error );
				}
			}
		}
		xhr.send(jsonReq);

	}


//[end---20200220-fei0090-add]//

//[start-20191113-thonsha-add]//
	function readTextFile(fileUrl, callback)
	{
		var rawFile = new XMLHttpRequest();
		var txtcontent;
		rawFile.open("GET", fileUrl, true);
		rawFile.onreadystatechange = function ()
		{
			if(rawFile.readyState === 4)
			{
				if(rawFile.status === 200 || rawFile.status == 0)
				{
					let allText = rawFile.responseText;
					
					txtcontent = allText;
					if (callback) callback( txtcontent );
				}
			}
		}
		rawFile.send(null);
		// return txtcontent;
	}
//[end---20191113-thonsha-add]//


	window.getViewerConfig = function(url, callback){
		if (!url ) return -1;
		let specificUrl = url + "get_viewer_config"; //set the url you want
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let request = {
			"ver":"3.1.1",
			"cid": 5,
			"data":{}
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			console.log("networkAgent.js: _getViewerConfig: xhr.response", xhr.response );
			if (callback){
				callback(xhr.response);
			}
		}
		xhr.send( jsonReq );
	}


	window.getARProjsByProjID = function(  projIDList , callback ){
		if (projIDList == undefined ) return;
		if (!Array.isArray(projIDList) ) return;
		if (projIDList.length < 1 ) return;
		
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"proj_id_list": projIDList
		}
		let specificUrl = window.serverUrl+"get_ar_projs_by_proj_id";
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			// console.log("networkAgentVR.js: _getARProjsByProjID: xhr.r=" , xhr.response );
		
			if (xhr.response.error == ""){
				if (callback){
					callback( xhr.response );
				}	
			}else{
				if (callback){
					callback( xhr.response.error );
				}
			}
			
		}
		xhr.send(jsonReq);
	}


////// GET the VR project from MAKAR
//[start-20190806-fei0071-add]//

	window.getVRSceneByUserID = function( url, user_id, callback ) {
		if (!url ) return -1;
		if (!user_id) user_id = "makarvr";
		
		let VRSceneResult = [];
		VRSceneResult.user_id = user_id;

		if (serverVersion == "3.0.0"){
			// console.log("networkAgent.js: getVRSceneByUserID 22: ");
			var main_type = "";
			var sub_type = "";

			var getUserPublishProjsCallback = function(userPublishProjs, userProjResDict , userOnlineResDict ){
				console.log("networkAgent.js: getVRSceneByUserID: _getUserPublishProjsByUserID: userPublishProjs=", userPublishProjs);
				if ( typeof(userPublishProjs) != "string" ){
					
					let projIDList = [];
					for (let i in userPublishProjs.proj_list){
						if (userPublishProjs.proj_list[i].proj_type == "vr"){
//[start-20200522-fei0095-add]//
							//// 判斷只有在 editor 勾選「開啟網頁展示」的專案會顯示。為了不造成顯示錯誤，統一由 interface 控管
							if (parent.useEditorWebTag){
								if ( !userPublishProjs.proj_list[i].proj_platform.find( item => item == "web") ){
									continue;
								}
							}
//[end---20200522-fei0095-add]//
							projIDList.push( userPublishProjs.proj_list[i].proj_id  );
						}
					}
					let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
					let data = {
						"proj_id_list": projIDList
					}
					let specificUrl = url+"get_vr_projs_by_proj_id";
					let request = {
						"ver":"3.0.0",
						"cid": 5,
						"data":data
					};
					let jsonReq = JSON.stringify(request);
					xhr.open( 'POST', specificUrl , true );
					xhr.setRequestHeader('Content-Type', 'application/json');
					xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
					xhr.onload = function(e) {
						// console.log("networkAgent.js: get_vr_projs_by_proj_id: onload, response=", xhr.response );
						let publishVRProjs = xhr.response.data;
						window.publishVRProjs = publishVRProjs;
						
						let count = 0;
						if ( publishVRProjs.result ){
							if ( publishVRProjs.result.length ){
								for (let j = 0; j < publishVRProjs.result.length; j++ ){
									
									let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
									let data = {
										"user_id": publishVRProjs.result[j].user_id,
										"proj_id": publishVRProjs.result[j].proj_id
									}
									let specificUrl = url+"get_vr_proj_scene"; // get_vr_proj_scene 
									let request = {
										"ver":"3.0.0",
										"cid": 5,
										"data":data
									};
									let getVRProjSceneJsonReq = JSON.stringify(request);
									// console.log("netWorkAgent.js: _getUserPublishProjs: POST open, specificUrl=", specificUrl);
									xhr.open( 'POST', specificUrl , true );
									xhr.setRequestHeader('Content-Type', 'application/json');
									xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"

									xhr.onload = function(e) {
										count++;
										// console.log("networkAgent.js: get_vr_proj_scene: onload, response=", xhr.response );
										VRSceneResult[j] = xhr.response.data;
										
										//////
										////// check the consistency between every objects inside sceneResult and userProjResDict 
										////// save the res_url into scene
										//////

										// for ( let k = 0; k < VRSceneResult[j].scenes.length; k++ ){
										// 	if ( VRSceneResult[j].scenes[k].scene_objs ){
										// 		for ( let m = 0; m < VRSceneResult[j].scenes[k].scene_objs.length; m++ ){
										// 			let res = VRSceneResult[j].scenes[k].scene_objs[m];
										// 			let res_id = res.res_id ;

										// 			if (  res.res_id == "" ){
										// 				if (res.main_type == "camera" && res.res_name == "VR Camera" && res.sub_type == "VRcamera" ){
										// 					// console.log("networkAgentVR.js: _getVRSceneByUserID: _getUSerPublishProjs: res camera");
										// 				}else{
										// 					console.log("networkAgentVR.js: _getVRSceneByUserID: _getUSerPublishProjs: res error: ", res, i, j, k ); 
										// 				}
										// 			} else {
										// 				if (userProjResDict[res_id]){
										// 					if ( userProjResDict[res_id].res_url == res.res_url ){
										// 						// console.log("networkAgentVR.js: _getVRSceneByUserID: _getUSerPublishProjs: publish.res_url is same as res.url "  );
										// 					} else {
										// 						console.log("%cnetworkAgentVR.js: _getVRSceneByUserID: _getUSerPublishProjs: publish.res_url different as res.url, replace it", "color:red" , i, j, k );
										// 					}

										// 					if (userProjResDict[res_id].main_type=="model"){
										// 						if (userProjResDict[res_id].res_url_fbx){
										// 							// console.log("networkAgentVR.js: _getVRSceneByUserID: _getUSerPublishProjs: res model: ", res, i, j, k ); 
										// 							res.res_url_fbx = userProjResDict[res_id].res_url_fbx;
										// 						}
										// 					}
										// 				}
										// 			}
										// 		}
										// 	}
										// }
										
										if ( count == publishVRProjs.result.length ){
											// console.log("%cnetworkAgent.js: get_vr_proj_scene: onload, save VRSceneResult ", "color:red", count );
											window.VRSceneResult = VRSceneResult;
											window.userProjResDict = userProjResDict;
											window.userOnlineResDict = userOnlineResDict;
											if (callback) callback(VRSceneResult);
										}

									}
									xhr.send(getVRProjSceneJsonReq);

								}
							}
						}
						
							
					}
					xhr.send(jsonReq);

				}
			// });
			};

			searchUserIDByUserID( url, user_id,  function(userIDs){
				for (let userID in userIDs.result ){
					if ( user_id.toLowerCase() === userIDs.result[userID].user_id.toLowerCase()  ){
						console.log("networkAgentVR.js: _searchUserIDByUserID: match, replace from [" , user_id , "] to [", userIDs.result[userID].user_id, "]"  );
						user_id = userIDs.result[userID].user_id;
					}
				}

				getPayInfoByUserID( url, user_id , function( userPayInfo ){
					let expire_date, expire_date_ymd, expire_date_ymd_arr, ISOexpire_date;
	//[start-20191113-thonsha-add]//
					let userIDWhiteListUrl = 'https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/web_white_list/webVR_UserID_WhiteList.txt';
					readTextFile( userIDWhiteListUrl , function( txtfile ){
	
						let jsonObj = JSON.parse(txtfile);
						let userIDList = jsonObj["customizedUserID"]["list"];
						let nameList = [];
						for (let i = 0; i < userIDList.length; i++){
							nameList.push(userIDList[i]["name"]);
						}
						let isInNameList = (nameList.indexOf(user_id.toLowerCase() ) > -1);
	//[end---20191113-thonsha-add]//
						if (userPayInfo.data){
							console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: userPayInfo =", userPayInfo.data );

							////// 改為使用 web_ar 這個 key 來判斷是否可以體驗，基本上 free 用戶 一定是 false, 而註冊送的一個月用戶也是 false, proA/B/C是true
							////// 假如在 白名單列表裡面，直接設定為可以使用
							////// 後續有一狀況，假如用戶本身為不可使用，但是透過 license 發出的專案卻需要判定可用，需要額外判斷。固在此無條件往下執行。
							window.allowedMakarIDUseWeb = userPayInfo.data.web_ar || isInNameList ;

							if ( userPayInfo.data.user_type == 'proA' || userPayInfo.data.user_type == 'proB' || userPayInfo.data.user_type == 'proC' || userPayInfo.data.user_type == 'custom' ){
								window.allowedMakarIDUseWeb = true;
							}

							// window.allowedMakarIDUseWeb = true;
							
							getUserPublishProjsByUserID(url, user_id, main_type, sub_type, getUserPublishProjsCallback );

						}else{
							console.log("networkAgent.js:_getARSceneByUserID:_getPayInfoByUserID: error, userPayInfo=", userPayInfo );	
							if(callback) callback("this ID <br> [" + user_id + "] <br> user data error, please contact MIFLY for more information. ");
						}
	
	
					} );
	
					
				});


			});
		}
		
	}


	window.getPayInfoByUserID = function( url, user_id, callback ){
		if (!url ) return -1;
		if (!user_id ) return -1;
		// if (!url ) url = "https://ssl-api-makar-v3-apps.miflyservice.com:8081/Makar/";
		// if (!user_id ) user_id = "fefe";

		let specificUrl = url + "get_pay_info"; //set the url you want
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"user_id": user_id , // user_id: miflytest
		}
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {

			if (callback){
				callback( xhr.response );
			}
		}
		xhr.send( jsonReq );
	}

	//// 取得 license 相關的訊息
	window.getELicenseInfo = function( url, license_key, callback ){
		if (!url ) return -1;
		if (!license_key ) return -1;
		
		let specificUrl = url + "get_e_lice_info"; //set the url you want
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"license_key": license_key , // user_id: miflytest
		}
		let request = {
			"ver":"3.1.1",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			// console.log("networkAgentVR.js: _getELicenseInfo: res = " , xhr.response );
			if (callback){
				callback( xhr.response );
			}
		}
		xhr.send( jsonReq );
	}

	////// 通用的 Post 格式 
	function sendPost(destination, dataObject, callback){
		let xhr = new XMLHttpRequest();
		let request = {
			ver: "3.1.1",
			cid: 5,
			data: dataObject
		};
		let jsonReq = JSON.stringify(request);
		xhr.open('POST', destination, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json';
		xhr.addEventListener("load", function() {
			if (callback){
				callback(xhr.response);
			}
		});
		xhr.send(jsonReq);
	}

	////// 檢查各專案是否帶有 lisence 
	window.checkLicenseInProjs = function( url , callback ){
		let specificUrl , arList=[], vrList=[], xrList=[], projList=[] ;
		////先收集一次各類別 proj_id 
		for (let i = 0, len = userPublishProjs.proj_list.length; i < len; i++ ){
			switch(userPublishProjs.proj_list[i].proj_type){
				case "ar":
					arList.push( userPublishProjs.proj_list[i].proj_id );
					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
					break;
				case "vr":
					vrList.push( userPublishProjs.proj_list[i].proj_id );
					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
					break;
				case "ar_slam":
					xrList.push( userPublishProjs.proj_list[i].proj_id );
					projList.push({proj_id:userPublishProjs.proj_list[i].proj_id});
					break;
				default:
					console.error("networkAgentVR.js: _checkLicenseInProjs: project type ERROR" , userPublishProjs.proj_list[i].proj_type );
					break;
			}
		}

		////// 處理各類別專案，非同步的處理
		let licenseInfos = [];
		function getProjs(res){
			for (let i = 0, len = projList.length; i < len; i++ ){
				for (let j = 0, len = res.data.result.length; j < len; j++ ){
					if (projList[i].proj_id == res.data.result[j].proj_id  ){
						if (res.data.result[j].editor_license_key != ""){
							getELicenseInfo(url , res.data.result[j].editor_license_key , function(res){
								if (res.error != ""){
									licenseInfos.push({proj_id: projList[i].proj_id, isLicense: false });
								}else{
									licenseInfos.push({proj_id: projList[i].proj_id, isLicense: true });
								}
								////// 檢查是否填入完成
								if (licenseInfos.length == projList.length){
									if (callback){
										callback(licenseInfos);
									}
								}

							});
						}else{
							licenseInfos.push({proj_id: projList[i].proj_id, isLicense: false });
						}
					}
				}	
			}
			////// 檢查是否填入完成
			if (licenseInfos.length == projList.length){
				if (callback){
					callback(licenseInfos);
				}
			}
		}
		//// 各類別分別查看 license 
		if (arList.length > 0) {
			sendPost(url + "get_ar_projs_by_proj_id", {proj_id_list: arList } , getProjs );
		}
		if (vrList.length > 0) {
			sendPost(url + "get_vr_projs_by_proj_id" , {proj_id_list: vrList }, getProjs );
		}
		if (xrList.length > 0) {
			sendPost(url + "get_arslam_projs_by_proj_id", {proj_id_list: xrList } , getProjs );
		}

	}

	//// 從server 取得模組專案資訊
	window.getRecordModule = function(url, playing_user_id , proj_id, callback){
		if (!url ) return -1;
		sendPost(url + "get_record_module", {playing_user_id: playing_user_id, proj_id: proj_id } , function(ret){
			console.log("networkAgentVR.js: _getRecordModule: ret" , ret );
			if (callback){
				callback(ret);
			}
		});
	}

	//// 上傳 quiz log資訊到server，給數據分析使用 
	window.quizLog = function(url, data, callback){
		sendPost(url + "quiz_log", data , function(ret){
			console.log("networkAgentVR.js: _quizLog: ret" , ret );
			if (callback){
				callback(ret);
			}
		});
	}

	//// 上傳 quiz record 資訊到server，給viewer端檢驗 
	window.updateRecordModule = function(url, data, callback){
		sendPost(url + "update_record_module", data , function(ret){
			console.log("networkAgentVR.js: _updateRecordModule: ret" , ret );
			if (callback){
				callback(ret);
			}
		});
	}



	window.getVRDataByUserID = function( url, user_id, callback ) {
		if (!url ) return -1;
		if (!user_id) user_id = "makarvr";
		let xhr = new XMLHttpRequest();
		let data = {
			"user_id": user_id,
			"cid": "20"
		}
		let strData = JSON.stringify(data);
		//// the formData
		let FD  = new FormData();
		FD.append("cmd", "get_vr_projs");	 
		FD.append("data", strData );

		xhr.open( 'POST', url , true );
		// xhr.setRequestHeader('Content-Type', 'text/plain' );		//// json
		xhr.responseType = 'json' // set reponse as arraybuffer or text or json

		xhr.onload = function(e) {
			// console.log("networkAgent.js:getVRDataByUserID:", xhr.response);
			let userVRData;

	//[start-20190214-fei0054-mod]//
			//// MAKAR "will" all use gzip compress the text as soon as We can(?)
			if (xhr.response.diaoyurar ){
				// console.log("networkAgent.js: getVRDataByUserID: xhr.response.diaoyurar ");

				let jsonData =  parseDiaoyurar(xhr.response.diaoyurar);
				if (!jsonData.error){
					if (jsonData.data){
						userVRData = jsonData.data;
						//// save the userVRData in window  
						if (!window.userVRData){
							console.log("networkAgent.js: getVRDataByUserID: save window.userARData ");
							window.userVRData = userVRData; 
						}else{
							console.log("networkAgent.js: getVRDataByUserID: window.userARData already exist, replace it..");
							window.userVRData = userVRData; 
						}
						if (callback) callback(userVRData); 
					}else{
						if (callback) callback("networkAgent.js:getVRDataByUserID:error: no jsonData.data"); 
					}

				}else{
					if (callback) callback( jsonData.error ); 
					console.log("networkAgent.js: getVRDataByUserID: oops something wrong:", jsonData.error);
				}

				// console.log(jsonData);
			}else{
				// console.log("networkAgent.js: getVRDataByUserID: not xhr.response.diaoyurar ", xhr.response);

				if (!xhr.response.error){
					if (xhr.response.data){
						
						userVRData = xhr.response.data;

						// console.log("networkAgent.js:getVRDataByUserID: onload, response=", xhr.response );
						
						//// save the userVRData in window
						if (userVRData.proj_list) {

							if (!window.userVRData){
								console.log("networkAgent.js: getVRDataByUserID: save window.userARData =", userVRData);
								window.userVRData = userVRData; 
							}else{
								console.log("networkAgent.js: getVRDataByUserID: window.userARData already exist, replace it..");
								window.userVRData = userVRData; 
							}
	
							if (callback) callback(userVRData);

						}else{
							console.log("%cnetworkAgent.js:getVRDataByUserID: onload, fail userVRData.proj_list is empty", "color:red" );
							if (callback) callback("the userVRData.proj_list is empty");
						}
					

					}else{
						if (callback) callback("networkAgent.js:getVRDataByUserID:error: no xhr.response.data"); 
					}
				}else{
					if (callback) callback( xhr.response.error ); 
					console.log("networkAgent.js: getVRDataByUserID: oops something wrong:",xhr.response.error);
				}
			}
	//[end---20190214-fei0054-mod]//
		}
		xhr.send( FD );
	}



//[end---20190806-fei0071-add]//


//[start-20190715-fei0070-add]//
	window.uploadDataToServer = function(url, index, callback){
		if (!url ) return -1;

		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"user_id": userARData.user_id,
			"target_id": userARData.proj_list[index].target_id // 1545795389.8544426.1988048228
		}
		// console.log("networkAgent: uploadDataToServer, data = ", data );

		if ( serverVersion == "3.0.0"){
			let specificUrl = url+"add_scan_times";
			let request = {
				"ver":"3.0.0",
				"cid": 5,
				"data":data
			};
			let jsonReq = JSON.stringify(request);

			xhr.open( 'POST', specificUrl , true );

			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			
			xhr.onload = function(e) {
				// console.log("networkAgent: uploadDataToServer, xhr.response.data = ", xhr.response.data );
			}
			xhr.send( jsonReq );

		}

		if ( serverVersion == "2.0.0"){
			let strData = JSON.stringify(data);
			let FD  = new FormData();
			FD.append("cmd", "add_scan_times");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
			FD.append("data", strData );

			xhr.open( 'POST', url , true );
			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			xhr.onload = function(e) {
				console.log("networkAgent: uploadDataToServer, xhr = ", xhr.response.data );
			}

			xhr.send( FD );
		}
	}

	window.searchUserIDByUserID = function( url, user_id, callback ){
		if (!url ) return -1;
		if (!user_id ) return -1;

		let specificUrl = url + "get_many_usr_info_keyword"; //set the url you want
		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			keyword: user_id,
			search_keys: ["user_id"]
		};
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data
		};
		let jsonReq = JSON.stringify(request);
		xhr.open( 'POST', specificUrl , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
		xhr.onload = function(e) {
			console.log("networkAgent.js: _searchUserIDByUserID: xhr.response", xhr.response.data );
			// console.log("networkAgent.js: getPayInfoByUserID: user_type", xhr.response.data.user_type );

			if (callback){
				callback( xhr.response.data );
			}
		}
		xhr.send( jsonReq );
	}


	////// POST test
	window.testPOST = function(url, callback){
		// if (!url ) return -1;

		var url2 = "http://60.250.125.146:8081/Makar/get_usr_publish_projs"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res
		// var url2 = "https://60.250.125.146:8888/Makar/get_usr_publish_projs"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		// var url2 = "https://192.168.0.119:8887/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		// var url2 = "http://192.168.0.119:8887/generator/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res
		// var url2 = "http://192.168.0.119:8887/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		// var url2 = "https://192.168.0.119:8888/generator/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		// var url2 = "https://192.168.0.135:8881/generator/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		// var url2 = "http://192.168.0.135:8881/generator/"; // get_usr_publish_projs , get_vr_projs , get_ar_projs , get_res

		let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
		let data = {
			"user_id": "fefe", //miflytest
		}
		let request = {
			"ver":"3.0.0",
			"cid": 5,
			"data":data,
			"length":8,
		};
		let jsonReq = JSON.stringify(request);
		console.log(" jsonReq ", jsonReq);

		let FD  = new FormData();
		FD.append("cmd", "add_scan_times");	//get_ar_projs ,  get_ar_proj_scene	, get_ar_projs_by_proj_id
		FD.append("data", jsonReq );

		xhr.open( 'POST', url2 , true );
		xhr.setRequestHeader('Content-Type', 'application/json');
		// xhr.setRequestHeader('Content-type', 'application/json ; charset=UTF-8');
		// xhr.setRequestHeader('Accept', 'application/json');
		xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"

		xhr.onload = function(e) {
			console.log("networkAgent: testPOST,  onload xhr = ", xhr, xhr.response );
		}
		xhr.send( jsonReq );
		// xhr.send( FD );

	}

//[end---20190715-fei0070-add]//

	//[start-20230923-howardhsu-add]//
	//// 取得 projIDList 裡的每個 proj_id 對應的資料
	//// 以 promise 形式來寫
	//// 使用時改為呼叫函式後加上 .then((data) => { ////原本的callback函式要做的事 })  
	window.getVRProjsByProjId = function(url, projIDList){
		return new Promise((resolve, reject)=>{

			//get_usr_online_res
			let xhr = new XMLHttpRequest(); // dont use var!!! will override the previous one
			let data = {
				"proj_id_list": projIDList
			}
			let specificUrl = url+"get_vr_projs_by_proj_id";
			let request = {
				"ver":"3.0.0",
				"cid": 5,
				"data":data
			}
			let jsonReq = JSON.stringify(request);
			xhr.open( 'POST', specificUrl , true );
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.responseType = 'json' // set reponse as "arraybuffer" or "text" or "json"
			xhr.onload = function(e) {
				// console.log("networkAgent.js: getVRProjsByProjId: onload, response=", xhr.response );
		
				if ( xhr.response.error ){
					console.log('networkAgent.js: _getUsrOnlineRes,  onload error ', xhr.response ); 
					reject( xhr.response.error );
				}else{
					console.log('networkAgent.js: _getUsrOnlineRes,  onload ' , xhr.response );  				
					resolve(  xhr.response.data )  
				}
		
			}
			
			xhr.onerror = function(err) {
				reject(err);
			};
	
			xhr.send( jsonReq );
			
		})
	}



	//[end-20230923-howardhsu-add]//


})();
