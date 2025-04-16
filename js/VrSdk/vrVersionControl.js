import net from '../VRMain/version3_5/networkAgent.js';
import { verionControl as VC } from "../VRMain/version3_5/MakarWebXRVersionControl.js";

( () => {

    // get publishVRProjs and VRSceneResult for version control
    // 進行版本判斷 (3.4 or 3.5)
    // 用 js ESM 動態 import 
    window.showVRProjListWithVersionControl = () => {
        
        console.log("這裡?")

        let pList = [];
        // const proj_id = "5d6f66e5-1eb8-40c3-8951-558ee450dc34"

        // if ( parent && parent.selectedProject && parent.selectedProject.proj_id ){
        if ( makarSDK && makarSDK.config && makarSDK.config.proj_id ){
            pList.push( makarSDK.config.proj_id );
            
            //// url 暫時先這樣處理 感覺不適合去動其他script
            console.log("_getProjectInfoList_ net.url", net.url )
            net.url = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/"

            let pScenes = net.getProjectInfoList( pList, makarSDK.config.user_id );
            pScenes.then(  async function( ret ){

                console.log('_getProjectInfoList_: ' , ret );

                if ( ret && ret.data && Array.isArray( ret.data.projects ) &&
                    ret.data.projects.length == 1
                ){
                    let oneProjData = ret.data.projects[0];                    
                    let vo = VC.getProjDataEditorVer( oneProjData );

                    console.log('_getProjectInfoList_: vo' , vo );

                    //// 先判斷是 3碼 還是 4碼。
                    if ( Number.isInteger( Number( vo.v3 ) ) ){
                        //// 目前支援 v3.5.0.0
                        if ( vo.v0 == 3 && vo.v1 >= 5 ){

                            await import("../VRMain/version3_5/VRFunc.js");    
                            showVRProjList( oneProjData );     
                        }

                    }else{
                        //// 支援 3.1.0 - 3.4.0
                        if ( vo.v0 == 3 && vo.v1 >= 1 ){
                            await import("../VRMain/version3_4/VRFunc.js");    
                            showVRProjList();      
                        }
                    }


                } else{

                    if ( ret && ret.error ){
                        console.log(`%c got data but with error:${ret.error}, ret=`, 'color:tomato;font-size:1rem', ret)
                        console.log(`%c might be the case of user_id does not get permission of the project with proj_id`, 'color:tomato;')

                        //// SDK 應該需要一個流程 顯示錯誤訊息、或是給出原因讓user能接著進行錯誤處理
                    } else {
                        //// 測試用 直接開3.4.0   
                        //// 不明原因的錯誤
                        await import("../VRMain/version3_4/VRFunc.js");    
                        showVRProjList();      
                    }

                }
            });

        }

    }

})();