
class StepController {
    constructor( projData ){
        
        this.stepStatus = 0; //// 0: 預備中 , 1. 執行中 
        
        this.projData = projData || {};
        
        //// 所有被控制的物件名稱 ( 單一模型 內部 物件 )
        this.controlChildrenNames = [];

        //// 所有被控制的物件名稱( 多個模型 名稱 )
        this.controlObjNames = [];

        // animation gsap
        this.zoomGsap;
        this.rotateCameraGsap;
        this.rotateGsap;

        // 步驟解說的 gsap
        this.stepTextGsap = gsap.timeline();

        //// 步驟資訊
        this.steps = [];
        this.step_length = 0;
        this.step_type = null;

        //// 紀錄當前步驟資訊
        this.current_step_idx = 0;
        this.current_step = null;

        //// 步驟 整理後的 控制物件 陣列 ( 單一模型 內部 物件 )
        this.stepCombineChildrenData = [];

        //// 預設語言為 中文 
        this.lang = 'tw';

        this.init();
        this.SetupStepUI();
    }

    //// 設定步驟介面
    //// 趕時間的關係，目前認定只有單一場景 0

    //// 初始化
    init(){

        let projData = this.projData;
        if ( projData.scenesData && Array.isArray( projData.scenesData.scenes ) && projData.scenesData.scenes[0] && 
            projData.scenesData.scenes[0].info && projData.scenesData.scenes[0].info.id && 
            projData.scenesData.scenes[0].stepData && projData.scenesData.scenes[0].stepData.step_type &&
            Array.isArray( projData.scenesData.scenes[0].stepData.steps )

        ){
            this.steps = projData.scenesData.scenes[0].stepData.steps;
            this.step_length = this.steps.length;

            this.step_type = projData.scenesData.scenes[0].stepData.step_type;
            this.controlChildrenNames = projData.scenesData.scenes[0].stepData.controlChildrenNames || [];
            this.controlObjNames = projData.scenesData.scenes[0].stepData.controlObjNames || [];

            //// 目前只有【 控制模型內 child 】 才需要製作 【 整合 】
            if ( this.controlChildrenNames ){
                this.createStepChildrenData();
            }
            


        }

        //// 步驟解說 動畫控制
        let stepTextContainer = document.getElementById('stepTextContainer');
        this.stepTextGsap.pause();
        this.stepTextGsap.to(stepTextContainer, {
            duration: 0.001,
            opacity: 0 ,
            visibility: 'visible',
            onComplete: () => {
                // console.log('stepTextGsap: 1' );
            },
        })
        this.stepTextGsap.to(stepTextContainer, {
            duration: 0.5,
            opacity: 1 ,
            onComplete: () => {
                // console.log('stepTextGsap: 2' );
            },
        });
        this.stepTextGsap.to(stepTextContainer, {
            duration: 2,
            opacity: 1 ,
            visibility: 'visible',
            onComplete: () => {
                // console.log('stepTextGsap: 3' );
            },
        });
        // this.stepTextGsap.to(stepTextContainer, {
        //     duration: 0.5,
        //     opacity: 0 ,
        //     visibility: 'visible',
        //     onComplete: () => {
        //         console.log('stepTextGsap: 4' );
        //     },
        // });


    }

    //// 有鑑於 不想要讓 原始資料太過冗長，固個別步驟只記錄【 當前步驟新增的物件 】
    //// 所以依照新的步驟，組成需要的物件名稱
    createStepChildrenData(){
        let self = this;
        if ( this.steps && this.steps.length > 0 ){

            let _countData = [];
            this.steps.forEach( (e, i) => {
                if ( e.show_objs && Array.isArray( e.show_objs ) ){
                    _countData = _countData.concat(e.show_objs);
                    self.stepCombineChildrenData[ i ] = _countData;
                }
            })

            //// 起始將 所有 部件 加上【 狀態 】
            self.controlChildrenNames.forEach( e => {
                e.active = true ;
            })


        }
    }

    //// 設定步驟介面
    SetupStepUI(){
        
        let self = this;

        if ( self.steps && self.step_length > 0 && self.step_length < 20 ){

            //// 正式版本:
            //// 「重頭開始」、「上一步」、「下一步」、「完整作品」
            let step_to_head = document.getElementById('step_to_head');
            let step_left_container = document.getElementById('step_left_container');
            let step_text_now = document.getElementById('step_text_now');
            let step_right_container = document.getElementById('step_right_container');
            let step_to_end = document.getElementById('step_to_end');
            let stepTextContainer = document.getElementById('stepTextContainer');
            let stepTextMain = document.getElementById('stepTextMain');


            if ( step_to_head && step_left_container && step_text_now && step_right_container && step_to_end 
                && stepTextContainer && stepTextMain
            ){

                //// 起始設定為【 完整作品 】最後一步
                // ToStepAndSetText(self.step_length - 1);
                self.current_step_idx = self.step_length - 1;
                // step_text_now.textContent = self.steps[ self.step_length - 1 ].name[ self.lang ];
                step_text_now.textContent =  (self.current_step_idx + 1) + '/' + (self.step_length ) ;

                //// 前往步驟 並 設定顯示文字
                function ToStepAndSetText ( idx ){

                    //// 判斷狀態 ， 還在執行中的話，就 pass           
                    if ( self.stepStatus == 1 ){
                        console.log('_ToStep: status 1, pass ' );
                        return;
                    }else{
                        self.stepStatus = 1;
                    }
                    

                    self.ToStep( idx );
                    // step_text_now.textContent = self.steps[idx].name[ self.lang ];
                    step_text_now.textContent =  ( idx + 1 ) + '/' + (self.step_length ) ;

                    
                    if (self.stepTextGsap._time > 0.5 && self.stepTextGsap._time < 2.5 ) {
                        self.stepTextGsap.seek(0.5);
                        self.stepTextGsap.play();
                    }else{
                        self.stepTextGsap.seek(0);
                        self.stepTextGsap.play();
                    }
                    
                    stepTextMain.textContent = self.steps[idx].des[ self.lang ];
                }

                //// 「重頭開始」
                step_to_head.onclick = function(){
                    ToStepAndSetText( 0 )
                }

                //// 「完整作品」
                step_to_end.onclick = function(){
                    if ( self.step_length > 0  ){
                        ToStepAndSetText( self.step_length - 1 );
                    } 
                }

                //// 「上一步」
                step_left_container.onclick = function(){
                    if ( self.current_step_idx > 0 && self.current_step_idx < self.step_length  ){
                        ToStepAndSetText( self.current_step_idx - 1 );
                    }
                }

                //// 「下一步」
                step_right_container.onclick = function(){
                    if ( self.current_step_idx >= 0 && self.current_step_idx < self.step_length - 1 ){
                        ToStepAndSetText( self.current_step_idx + 1 );
                    }
                }


            }


            //// 簡易版本 已更新
            // let stepContainer = document.createElement('div');
            // stepContainer.id = 'stepContainer';
            // document.body.appendChild( stepContainer );

            // self.steps.forEach( ( step, idx ) => {
            //     let stepItem = document.createElement('div');
            //     stepItem.classList.add('stepItem')  
            //     stepItem.id = 'stepItem_' + idx;
            //     stepItem.innerText = step.name[ this.lang ];
                
            //     if ( idx == 0 ){
            //         stepItem.classList.add('active');
            //     }
            //     stepItem.onclick = function(){
            //         self.ToStep( idx );
            //     };
            //     stepContainer.appendChild( stepItem );

            // });

        }
    }

    //// 前往特定步驟
    ToStep( step_idx ){
        console.log('_ToStep: ', step_idx );

        let self = this;

        let isCameraDone = false;
        let isStepModelDone = false;

        //// 新步驟資料
        let new_step = this.steps[ step_idx ];
        if ( new_step.cameraAttr && new_step.cameraAttr.p && new_step.cameraAttr.target ){
            let p = new_step.cameraAttr.p;
            let t = new_step.cameraAttr.t? new_step.cameraAttr.t : 1;

            //// 先設中心位置
            let oCamera = document.getElementById('oCamera');
            if ( oCamera && oCamera.components['orbit-controls'] && oCamera.components['orbit-controls'].target ){
                let tp = new_step.cameraAttr.target;
                oCamera.components['orbit-controls'].target.set( tp[0], tp[1], tp[2] );
            }

            this.GsapZoomInOutCamera(new THREE.Vector3( p[0], p[1], p[2] ) , t ).then(() => { 

                // console.log(' has stepCamra done ,  ' , isStepModelDone );
                //// 相機 設定 動畫 完成
                isCameraDone = true;
                if ( isStepModelDone == true ){
                    self.stepStatus = 0;
                    console.log(' has stepCamra done , get Model done, set status 0  ' );
                }

            });
        }else{
            
            // console.log(' no stepCamra done ,  ' , isStepModelDone );
            isCameraDone = true;
            if ( isStepModelDone == true ){
                self.stepStatus = 0;
                console.log(' no stepCamra done , get Model done, set status 0  ' );
            }

        }
        // 

        let pStepModel;
        if( this.step_type == 'model' ){
            this.ToStep_model( step_idx );
        } else if ( this.step_type == 'mesh' ){
            // this.ToStep_model_child( step_idx );

            //// 新方式，多判斷 【 mesh 狀態 】再進行顯示或隱藏
            pStepModel = this.ToStep_model_child_check( step_idx );

        }

        if ( pStepModel ){
            pStepModel.then( ()=>{

                console.log(' has stepModel done ,  ' , isCameraDone );
                isStepModelDone = true;
                if ( isCameraDone == true ){
                    self.stepStatus = 0;

                    console.log(' has stepModel done , get camera done, set status 0  ' );
                }
            });
        }else{

            // console.log(' no stepModel done, ' , isCameraDone );
            if ( isCameraDone == true ){
                self.stepStatus = 0;
                console.log(' no stepModel done , get camera done, set status 0  ' );
            }
        }

        //// 紀錄當前步驟資料
        this.current_step_idx = step_idx;
        this.current_step = new_step;

        // this.SetStepUI( step_idx );

    }

    //// 控制 場景 相機
    //移動相機 到指定位置
    GsapZoomInOutCamera(positionValue, durationValue) {

        let promise = new Promise((resolve, reject) => {

            if (this.zoomGsap) {
                this.zoomGsap.pause();
                this.zoomGsap.kill();
            }

            let oCamera = document.getElementById('oCamera');
            if ( oCamera && oCamera.object3D && oCamera.object3D.children[0] ){

                let camera = oCamera.object3D.children[0];
                this.zoomGsap = gsap.to( camera.position,
                    {
                        x: positionValue.x,
                        y: positionValue.y,
                        z: positionValue.z,
                        // duration: durationValue,
                        onUpdate: () => {
                            // console.log('_G_: ', camera.position.x, camera.position.y, camera.position.z );
                        },
                        onComplete: () => {
                            resolve();
                        }
                    });

                (durationValue) ? this.zoomGsap.duration(durationValue) : "";
            }
        });

        return promise;
    }

    //// 步驟控制的物件為【 模型 】
    ToStep_model( step_idx ){
        //// 新步驟資料
        let new_step = this.steps[ step_idx ];

        let checkStatus = true;
        if ( new_step && new_step.show_objs && new_step.show_objs.length > 0 
            && window.vrController && vrController.makarObjects
        ){
            //// 檢查 3D 場景是否有 對應物件
            new_step.show_objs.forEach( e => {
                if ( e.id ){
                    let id = e.id;
                    let obj = document.getElementById( id );
                    if ( obj && vrController.makarObjects.includes(obj) ){

                    }else{
                        checkStatus = false;
                    }
                }
            })

            //// 檢查正確 執行步驟 顯示或是隱藏
            if ( checkStatus ){

                vrController.makarObjects.forEach( oe => {
                    let obj_id = oe.id;
                    if ( new_step.show_objs.find( e => e.id == obj_id ) ){
                        oe.object3D.visible = true;
                    }else{
                        oe.object3D.visible = false;
                    }
                    
                })

            }


        }
    }

    //// 步驟控制的物件為【 模型 】
    ToStep_model_child( step_idx ){

        let self = this;

        //// 新步驟資料
        let new_step = this.steps[ step_idx ];

        let new_step_children = this.stepCombineChildrenData[ step_idx ] || [];

        let checkStatus = true;
        if ( new_step && new_step.obj_id && new_step.show_objs && new_step.show_objs.length > 0 && 
            new_step_children && new_step_children.length > 0 &&
            window.vrController && vrController.makarObjects
        ){

            //// 找出【 所有控制的名稱 】內 排除掉不需要的物件名稱
            self.controlChildrenNames.forEach( e => {
                let findC = new_step_children.find( e2 => e2.obj_id == e.o && e2.name == e.n ); 
                // console.log( 'findC: ', findC );
                //// 包含在步驟內的 物件 執行顯示
                //// 不包含在步驟內的 物件 執行隱藏
                if ( findC ){
                    let obj = document.getElementById( findC.obj_id );
                    if ( obj && obj.object3D ){
                        let c = obj.object3D.getObjectByName( findC.name );
                        if ( c ){

                            // console.log( 'findC: show ', findC );
                            c.visible = true;
                        }
                    }
                }else{
                    let obj = document.getElementById( e.o );
                    if ( obj && obj.object3D ){
                        let c = obj.object3D.getObjectByName( e.n );
                        if ( c ){
                            c.visible = false;
                        }
                    }
                }
            })



            //// 檢查 3D 場景是否有 對應物件
            // let obj_id = new_step.obj_id;
            // let obj = document.getElementById( obj_id );

            // //// 檢查正確 執行步驟 顯示或是隱藏
            // if ( obj && obj.object3D && obj.object3D.traverse ){                
            //     // obj.object3D.traverse( c =>{
            //     //     if ( c.type == 'Mesh' || c.type == 'Object3D' ){
            //     //         if ( new_step.show_objs.find( e=> e.name == c.name ) ){
            //     //             c.visible = true;
            //     //         }else{
            //     //             c.visible = false;
            //     //         }
            //     //     }
                    
            //     // })
                
            // }

        }
    }


    ToStep_model_child_check( step_idx ){
        let self = this;

        
        let pStepMesh = new Promise( ( pStepMesh_resolve , reject) => {


            //// 原本步驟資料
            let old_step = self.steps[ self.current_step_idx ];
            let old_step_children = self.stepCombineChildrenData[ self.current_step_idx ] || [];

            //// 新步驟資料
            let new_step = self.steps[ step_idx ];

            let new_step_children = self.stepCombineChildrenData[ step_idx ] || [];

            let checkStatus = true;
            if ( new_step && new_step.obj_id && new_step.show_objs && new_step.show_objs.length > 0 && 
                new_step_children && new_step_children.length > 0 &&
                window.vrController && vrController.makarObjects
            ){

                //// 紀錄【 需要飛入的物件 】
                let show_flyin_objs = [];

                //// 紀錄【 需要放大出現的物件 】
                let show_growupin_objs = [];

                //// 找出【 所有控制的名稱 】內 排除掉不需要的物件名稱
                self.controlChildrenNames.forEach( e => {
                    //// 先找到 新步驟資料內的物件
                    let findC = new_step_children.find( e2 => e2.obj_id == e.o && e2.name == e.n ); 

                    //// 判斷是否是 當前 步驟下已經為【 顯示狀態 】的物件
                    // let findO = old_step_children.find( e2 => e2.obj_id == e.o && e2.name == e.n );
                    
                    // console.log( 'findC: ', findC );
                    //// 包含在步驟內的 物件 執行顯示
                    //// 不包含在步驟內的 物件 執行隱藏
                    if ( findC ){

                        let obj = document.getElementById( findC.obj_id );
                        //// 資料中的 模型中心 取得世界座標
                        let model_w_c_p = obj.object3D.localToWorld( obj.object3D.makarCenter.clone() );
                        //// 資料中的 模型半徑 取得世界座標
                        let model_w_r = obj.object3D.localToWorld( new THREE.Vector3(obj.object3D.makarXYRaduis,0,0) ).x ;

                        //// 假如原本就已經是顯示狀態，則不需要進行顯示
                        //// 假如原本是【 未啟動狀態 】，則進行顯示(依照顯示方式)
                        if ( e.active == true  ){
                            
                        }else{
                            
                            if ( obj && obj.object3D ){
                                let c = obj.object3D.getObjectByName( findC.name );
                                if ( c ){

                                    //// 顯示的處理方式 目前區分為 【 直接 】【 飛入 】
                                    if ( findC.type == 'direct' ){
                                        c.visible = true;
                                    }else if ( findC.type == 'flyin' ){

                                        //// 假如有加上 【 起始相對座標 】就直接使用，否則用計算的
                                        let m_p_local;
                                        if ( Array.isArray(findC.lp) && findC.lp.length == 3 ){
                                            m_p_local = new THREE.Vector3().fromArray( findC.lp );
                                        }else{
                                            //// 部件 的世界座標
                                            let mesh_w_p = c.getWorldPosition( new THREE.Vector3() );
                                            //// 模型中心 到 部件 的向量

                                            //// 基本貼地，由於各 mesh 會因為模型中心 不在 y=0 範圍。而太下方。
                                            //// 固計算完座標後，無條件 加上 部件的世界座標的 y
                                            let v_om = new THREE.Vector3( 
                                                mesh_w_p.x - model_w_c_p.x , 
                                                0, 
                                                mesh_w_p.z - model_w_c_p.z
                                            );
                    
                                            //// 模型放在 環圈上面的 世界座標位置 : 模型中心 位置 加上 兩點向量的單位向量乘與圓環倍數
                                            let p_w_r = model_w_c_p.clone().add(  
                                                v_om.clone().normalize().multiplyScalar( model_w_r )
                                                .add( new THREE.Vector3( 0, mesh_w_p.y, 0 ) )
                                            );
                                            //// 模型放在 環圈上面的 本地座標位置
                                            m_p_local = c.parent.worldToLocal( p_w_r.clone() ); 

                                            // console.log(' _fliyin:  ', c.name  , m_p_local , p_w_r );

                                        }
                                        
                                        //// 資料: 物件、原始位置、大小
                                        let data = {
                                            // o_scale: c.scale.clone(),
                                            o_pos: c.position.clone(),
                                            obj: c,
                                        }
                                        show_flyin_objs.push( data );

                                        c.position.copy( m_p_local );


                                        
                                        c.visible = true;

                                    }
                                    else if ( findC.type == 'growupin' ){
                                        //// 放大出現
                                        let sn = 1000 ;
                                        let data = {
                                            sn: sn,
                                            obj: c,
                                        }
                                        show_growupin_objs.push( data );
                                        let e_os = c.scale;
                                        c.scale.copy( e_os.multiplyScalar( 1/sn ) );
                                        c.visible = true;
                                    }
                                    else{
                                        c.visible = true;
                                    }

                                }
                            }
                            //// 將狀態改為【 啟動 】
                            e.active = true;

                        }

                    }else{
                        //// 不包含在步驟內的 物件 執行隱藏

                        //// 假如原本是顯示狀態，則需要進行隱藏
                        //// 假如原本已經是【 未啟動狀態 】，則不用動作
                        if ( e.active == true  ){
                            let obj = document.getElementById( e.o );
                            if ( obj && obj.object3D ){
                                let c = obj.object3D.getObjectByName( e.n );
                                if ( c ){
                                    c.visible = false;
                                }
                            }
                            e.active = false;
                        }else{

                        }

                        
                    }
                })


                let pActiveAll = [];
                if ( show_flyin_objs.length > 0 ){

                    show_flyin_objs.forEach( e => {
                        // console.log( '2 _show_flyin_objs: ' , e );
                        if ( e.o_pos && e.obj  ){
                            let o_pos = e.o_pos;
                            let pg = gsap.to( e.obj.position, {
                                duration: 1,
                                delay: 1,
                                x: o_pos.x,
                                y: o_pos.y,
                                z: o_pos.z,
                                onUpdate: () => {
                                    // console.log('_G_: ', camera.position.x, camera.position.y, camera.position.z );
                                },
                                onComplete: () => {
                                    
                                }
                            })

                            pActiveAll.push( pg );
                            
                            // pg.then( function( e ){
                            //     console.log( '2 _show_flyin_objs: pg then ' , e );
                            // });

                            
                        }
                    })


                }

                if (show_growupin_objs.length > 0 ){
                    show_growupin_objs.forEach( e => {
                        if ( e.sn && e.obj  ){

                            let e_os = e.obj.scale;
                            let pg = gsap.to( e.obj.scale, {
                                duration: 1,
                                x: e_os.x * e.sn ,
                                y: e_os.y * e.sn,
                                z: e_os.z * e.sn,
                                onUpdate: () => {
                                    // console.log('_G_: ', camera.position.x, camera.position.y, camera.position.z );
                                },
                                onComplete: () => {
                                    
                                }
                            });
                            pActiveAll.push( pg );

                        }
                    })
                        
                }

                
                Promise.all( pActiveAll ).then( e =>{
                    console.log( '3 _pActiveAll : pg all then ' , e );
                    pStepMesh_resolve();

                });


            }else{

                console.log(' _ToStep_model_child_check_: step data error ' , new_step );
                pStepMesh_resolve();
            }

        });

        return pStepMesh;

    }

    //// 切換當前步驟 UI ，已棄置
    SetStepUI( step_idx ){
        let stepContainer = document.getElementById('stepContainer');
        let stepItems = stepContainer.getElementsByClassName('stepItem');
        for( let i = 0; i < stepItems.length; i++ ){
            if ( i == step_idx ){
                stepItems[i].classList.add('active');
            }else{
                stepItems[i].classList.remove('active');
            }
        }
    }

}

export default StepController;
