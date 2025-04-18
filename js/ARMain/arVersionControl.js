import net from './v3_5/networkAgent.js';
import { verionControl as VC } from "./v3_5/MakarWebXRVersionControl.js";

( () => {

    // get publishVRProjs and VRSceneResult for version control
    // 進行版本判斷 (3.4 or 3.5)
    // 用 js ESM 動態 import 
    window.startARWithVersionControl = () => {
        


        let pList = [];
        if ( parent && parent.selectedProject && parent.selectedProject.proj_id ){
            pList.push( parent.selectedProject.proj_id );

            const login_id = localStorage.getItem("MakarUserID") 
            let pScenes = net.getProjectInfoList( pList, login_id );
            pScenes.then(  async function( ret ){

                console.log(' _pScenes_: ' , ret );

                //// 在 3.5.0.0 才帶有「 複合性專案 」，可同時擁有多類型場景

                //// 先判斷「 專案版本 」，目前大方向區分「 3.5.0.0 」 之前和之後
                

                if ( ret && ret.data && Array.isArray( ret.data.projects ) &&
                    ret.data.projects.length == 1
                ){
                    let oneProjData = ret.data.projects[0];                    
                    let vo = VC.getProjDataEditorVer( oneProjData );

                    //// 判斷版本
                    if ( vo.v0 == 3 && vo.v1 >= 5 && Number.isInteger( Number( vo.v3 ) )  ){

                        console.log(' _startARWithVersionControl_ : ver 3.5.0.0 and above ' , oneProjData , vo );

                        await import( './v3_5/ARFunc.js' );

                        //// 客製化 遠東 樂樂
                        if ( parent.location.pathname.includes( "/15b8c2fc-4222-4922-aadd-13ae441f9052/f22d9da4-a359-45a1-b677-1aba895a8b84") ){
                            await import( '../customizedProject/feibxr_lala.js' );
                        }

                        //// 客製化 農業局 2025
                        if ( parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/62afc6bc-f3e1-40b3-adf1-cb8a596b8e6d") ||
                            parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/5f0e2e5a-9a6b-419b-9ef5-cf98d545b7b1") || 
                            parent.location.pathname.includes( "/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/541820ff-3a92-470f-96f2-189dc0ca0fa2" )
                        ){
                            await import( '../customizedProject/agriculture2025.js' );
                        }

                        if ( window.startARProcess ){
                            startARProcess( oneProjData );
                        }
                        
                    } else if ( vo.v0 == 3 && vo.v1 < 5 ){
                        console.log(' _startARWithVersionControl_ : ver below 3.5.0.0, use 3.4.0 ' , oneProjData , vo );

                        //// 載入 必要 script 
                        let arThreeScript = document.createElement('script');
                        // arThreeScript.setAttribute('src' , '../js/ARMain/v3_4/artoolkit.three.js' )
                        arThreeScript.setAttribute('src' , '../lib/webpack/makarThree.min.js' )
                        document.body.appendChild( arThreeScript );

                        //// 等待 AR 功能完成之後，再進行
                        let tID = setInterval( function(){
                            if ( window.ARController && window.startARProcess ) {
                                clearInterval( tID );
                                console.log(' _startARWithVersionControl_ with AR: ARController load done' );

                                window.startARProcess();

                            }else{
                                console.log(' _startARWithVersionControl_ with AR: ARController load not done' );
                            }
                        }, 500 );


                    }


                }

            });

        }else if ( window.custProject && window.custProject.proj_id ){
            console.log(' _startARWithVersionControl_ : custProject ' , window.custProject );

            Promise.resolve().then(  async function( ){
                await import("./v3_5/ARFunc_cust.js");

                if ( window.startARWithoutMakar){
                    //// 建置 3D 場景
                    startARWithoutMakar( window.custProject );

                }else{
                    console.log('_arVersionControl: No _startARWithoutMakar');
                }
            })

        }   

    
    }


})();