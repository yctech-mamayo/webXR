
//// 以下都不能使用，備註
// import data  from "./DefaultResource.json" ;
// import * as data from './DefaultResource.json';

// import data from "./DefaultResource.json" assert { type: "json" };

// @ts-ignore
// import  data  from "../../../../scripts/DefaultResource.json" assert { type: "json" };
// import data from "/js/scripts/DefaultResource.js";
import data from "../../scripts/DefaultResource.js";


// let data = import('/scripts/DefaultResource.json', {
//     assert: {
//         type: 'json'
//     }
// });

export function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}  


export async function UrlExistsFetch( url ){
    let ret = await fetch(url, {method: 'HEAD'})
    console.log(' _UrlExistsFetch: ret ', ret );
    if ( ret.status ){
        return ret.status == '200';
    }else{
        return false ;
    }
}

export function UrlExists(url , callback ){
  let httpRequest = new XMLHttpRequest();
  httpRequest.open('HEAD', url, true);
  httpRequest.onload = function(e){
    console.log(" VRFunc.js: _UrlExists: httpRequest status= " , httpRequest.status  );
    callback( httpRequest.status == "200" );
  }
  
  httpRequest.onerror = function(e){
    console.log( 'onerror e=', e );
    callback( httpRequest.status == "200" );

  }
  httpRequest.onabort = function(e){
    console.log( 'onabort e=', e );
    callback( httpRequest.status == "200" );
  }
  httpRequest.send();
}

export function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }
  return false;
}

//[start-20191111-fei0079-add]//
export function checkHost_tick() {
  if ( typeof(checkHost) != "undefined" ){
      if ( checkHost == "yet" ){
          // console.log("VRFunc.js: checkHost = yet");
          setTimeout(checkHost_tick, 50);
      }else{
          if ( checkHost == "correct" ){
              console.log("VRFunc.js: _checkHost_tick correct");
          } else if ( checkHost == "fail" ){
              //// remove all childrens of documnet
              while (document.body.firstChild) {
                  document.body.removeChild(document.body.firstChild);
              }
              //// add the warning about Host
              var divHostWarn = document.createElement('div');
              divHostWarn.innerHTML = "<br>The host of webVR seems unauthorized,<br> please contact MIFLY ";
              divHostWarn.style.fontSize = "18px";
              divHostWarn.style.margin = "5px";
              divHostWarn.style.fontWeight = "700";
              document.body.append( divHostWarn );
          }
      }
  } else {
      console.log("VRFunc.js: checkHost = undefined, something ERROR.");
      // setTimeout(checkHost_tick, 50);
  }
};
//[end---20191111-fei0079-add]//

export function forbidden( message ){
  if (document.getElementById("freeUserWarnDiv")){
      document.getElementById("freeUserWarnDiv").style.display = "block";
      document.getElementById("pUserInfo").textContent = message;
      // document.getElementById("pUserInfo").style.color = "red";
      leaveIframe.onclick = function(event){
          event.preventDefault();
          if (parent.aUI){
              // parent.aUI.closeCoreIframe();
          }
      }
  }
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, 
            function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
            });
}

//// check: is image default image
export function checkDefaultImage( obj ) {

    let getRes = false;
    //// v3.5.0.0 預設素材 有作過更新，先判斷新版本
    if ( data && data.data && Array.isArray( data.data.list )  ){
    // if ( data && data.default && data.default.data && Array.isArray( data.default.data.list )  ){

        // let list = data.default.data.list;
        let list = data.data.list;

        list.forEach( e => {
            if ( e.res_id == obj.res_id ){
                obj.main_type = e.main_type;
                obj.sub_type = e.sub_type;
                obj.res_url = e.res_url;
                getRes = true;
            }
        });
    }

    //// 假如沒有找到，走舊版流程
    console.log('  .getRes ' , getRes , obj );
    
    if ( getRes ){
        return ;
    }

    switch(obj.res_id){
        case "MakAR_Call":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Call.png";
            obj.main_type = "image"
            break;
        case "MakAR_Room": 
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Room.png";
            obj.main_type = "image"
            break;
        case "MakAR_Mail": 
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/MakAR_Mail.png";
            obj.main_type = "image"
            break;
        case "Line_icon":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/Line_icon.png";
            obj.main_type = "image"
            break;
        case "FB_icon":
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/2D/FB_icon.png";
            obj.main_type = "image"
            break;
        default:
            console.log("image: default, obj=",  obj );
    }

}


//// 檢查是否為「預設模型」，是的話把網址賦予
export function checkDefaultObj( obj ) {

    // console.log( ' 66666666 ' , data.default )

    let getRes = false;
    //// v3.5.0.0 預設素材 有作過更新，先判斷新版本
    if ( data && data.data && Array.isArray( data.data.list )  ){
    // if ( data && data.default && data.default.data && Array.isArray( data.default.data.list )  ){

        // let list = data.default.data.list;
        let list = data.data.list;

        list.forEach( e => {
            if ( e.res_id == obj.res_id ){
                obj.main_type = e.main_type;
                obj.sub_type = e.sub_type;
                obj.res_url = e.res_url;
                getRes = true;
            }
        });
    }

    //// 假如沒有找到，走舊版流程
    console.log('  .getRes ' , getRes , obj );
    
    if ( getRes ){
        return ;
    }

    switch(obj.res_id){ 
        //// Quiz 
        case "quiz":
            obj.main_type = "empty";
            obj.sub_type = "quiz";
            break;

        case "point_card":
            obj.main_type = "empty";
            obj.sub_type = "point_card";    
            break;

        case "scratch_card":
            obj.main_type = "empty";
            obj.sub_type = "scratch_card";    

            break;


        case "Curve":
            obj.main_type = "curve";
            break;

        default:
            if (obj.res_gltf_resource){
                break;
            }

            ///// 假如「場景物件資料」不具有「場景維度」，設定為 3d
            if ( !obj.generalAttr ){
                obj.generalAttr = {
                    obj_type: '3d'
                };
            }else{
                if ( !obj.generalAttr.obj_type ){
                    obj.generalAttr.obj_type = '3d';
                }
            }

            //// 假如「場景物件資料」不具有「位置資料」，設定在「原點」
            if ( !obj.transformAttr  ){
                obj.transformAttr = {
                    transform: [
                        '0,0,0',
                        '0,0,0,1',
                        '1,1,1',
                    ]
                }
            }else{
                if ( !obj.transformAttr.transform  ){
                    obj.transformAttr.transform = [
                        '0,0,0',
                        '0,0,0,1',
                        '1,1,1',
                    ]
                }
            }

            obj.main_type = "model";
            obj.sub_type = 'glb';
            obj.res_url = "https://s3-ap-northeast-1.amazonaws.com/makar.webar.defaultobject/makar_default_objects/3D/MissingFileBox.glb";
            break;
    }

}




