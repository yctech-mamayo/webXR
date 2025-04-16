
class StepController {
    constructor( projData ){
        this.projData = projData || {};
        
        //// 所有被控制的物件名稱 ( 單一模型 內部 物件 )
        this.controlChildrenNames = [];

        //// 所有被控制的物件名稱( 多個模型 名稱 )
        this.controlObjNames = [];

        // animation gsap
        this.zoomGsap;
        this.rotateCameraGsap;
        this.rotateGsap;

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
        }
    }

    //// 設定步驟介面
    SetupStepUI(){
        
        let self = this;

        if ( this.steps && this.step_length > 0 && this.step_length < 10 ){

            let stepContainer = document.createElement('div');
            stepContainer.id = 'stepContainer';
            document.body.appendChild( stepContainer );

            self.steps.forEach( ( step, idx ) => {
                let stepItem = document.createElement('div');
                stepItem.classList.add('stepItem')  
                stepItem.id = 'stepItem_' + idx;
                stepItem.innerText = step.name[ this.lang ];
                
                if ( idx == 0 ){
                    stepItem.classList.add('active');
                }
                stepItem.onclick = function(){
                    self.ToStep( idx );
                };
                stepContainer.appendChild( stepItem );

            });
        }
    }

    //// 前往特定步驟
    ToStep( step_idx ){
        console.log('ToStep: ', step_idx );

        //// 新步驟資料
        let new_step = this.steps[ step_idx ];
        if ( new_step.cameraAttr && new_step.cameraAttr.p ){
            let p = new_step.cameraAttr.p;
            let t = new_step.cameraAttr.t? new_step.cameraAttr.t : 1;

            this.GsapZoomInOutCamera(new THREE.Vector3( p[0], p[1], p[2] ) , t ).then(() => { });
        }
        // 

        if( this.step_type == 'model' ){
            this.ToStep_model( step_idx );
        } else if ( this.step_type == 'mesh' ){
            this.ToStep_model_child( step_idx );
        }

        this.SetStepUI( step_idx );

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

    //// 切換當前步驟 UI
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
