import net from './version3_5/networkAgent.js';
import { verionControl as VC } from "./version3_5/MakarWebXRVersionControl.js";

( () => {

    // get publishVRProjs and VRSceneResult for version control
    // 進行版本判斷 (3.4 or 3.5)
    // 用 js ESM 動態 import 
    window.showVRProjListWithVersionControl = () => {
        


        let pList = [];
        if ( parent && parent.selectedProject && parent.selectedProject.proj_id ){
            pList.push( parent.selectedProject.proj_id );
            
            const login_id = localStorage.getItem("MakarUserID") 
            let pScenes = net.getProjectInfoList( pList, login_id );
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

                            await import("./version3_5/VRFunc.js");    
                            showVRProjList( oneProjData );     
                        }

                    }else{
                        //// 支援 3.1.0 - 3.4.0
                        if ( vo.v0 == 3 && vo.v1 >= 1 ){
                            await import("./version3_4/VRFunc.js");    
                            showVRProjList();      
                        }
                    }


                } else{
                    //// 測試用 直接開3.4.0
                    await import("./version3_4/VRFunc.js");    
                    showVRProjList();      
                }
            });

        }else if ( window.custProject && window.custProject.proj_id ){

            console.log('_showVRProjListWithVersionControl: _custProject ');

            if ( location.hostname == 'localhost' || 'yctech-mamayo.github.io' ){
                Promise.resolve().then(  async function( ){
                    await import("./version3_5/VRFunc_cust.js");
                    if ( window.loadCustVRProjData){
                        //// 建置 3D 場景
                        loadCustVRProjData( window.custProject );
    
                    }else{
                        console.log('_showVRProjListWithVersionControl: No _loadCustVRProjData');
                    }
                })
            }else{
                console.log( ' Hostname not allow, please contact MIFLY Fei ' );
            }

            
            

        }

    }

})();