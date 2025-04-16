class Effects {

    //// 預先考慮了使用 mix專案 的情況
    currentController;

    //// (還在vr的時候是vrController.vrScene.canvas)
    canvas;

    //// material map
    MeshMaterialMap = {
        // "touchObject.uuid": {
        //     "child.uuid": "uuid"
        // }
    }


    constructor(currentController, canvas){
        this.currentController = currentController;
        this.canvas = canvas;
    }

    log(touchMouseState, e){
        console.log("mouse hover", touchMouseState, e)
    }

    //// 滑鼠hover效果
    startModelHover(){

        let makarTHREEObjects = [];
        for ( let i = 0; i < this.currentController.makarObjects.length; i++ ){
            let makarObject = this.currentController.makarObjects[i];
                let parentVisible = true;
                makarObject.object3D.traverseAncestors( parent => {
                    if (parent.type != "Scene"){
                        if (parent.visible == false){
                            parentVisible = false;
                        }
                    }
                });
                if (parentVisible){
                    makarTHREEObjects.push(makarObject.object3D );
                }
        }

        //// 
        const moveEvent = (event) => {
            console.log("Effects _moveEvent:", event)

            //// 取得滑鼠xy
            let mouse = new THREE.Vector2();
            const setMouseXY = (event, mouse) => {
                let rect = this.currentController.GLRenderer.domElement.getBoundingClientRect();
        
                switch ( event.type ) {
                    case "mouseup":
                    case "mousemove":
                    case "mousedown":
                        mouse.x = ( (event.clientX - rect.left) / this.currentController.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                        mouse.y = - ( (event.clientY - rect.top) / this.currentController.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                        break;
                    case "touchend":////// 20190709 Fei: add this event type for cellphone
                    case "touchstart":
                    case "touchmove":
                        mouse.x = ( (event.changedTouches[0].clientX - rect.left) / this.currentController.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                        mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / this.currentController.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                        break;
                    default:
                        console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
                        return ;
                }
            }
            setMouseXY(event, mouse)
            
            //// raycaster
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( mouse, this.currentController.vrScene.camera );
            
            let intersects = raycaster.intersectObjects(  makarTHREEObjects, true ); 
            if (intersects.length != 0 ){

                let touchObject = this.currentController.getMakarObject( intersects[0].object );
                if( touchObject ){
                    
                    //// renhaohsu暫時設定為 不是用aframe物件流程載入的都先跳過
                    if(!touchObject.el){ return }
                    
                    const touchObjectID = touchObject.el.id
                    console.log("_Effects _startModelHover touchObjectID", touchObjectID)

                    this.currentSelect = touchObject;

                    touchObject.traverse( child => {
                        if (child.isMesh){
                            ////  for_makarSDK : 如果模型還沒被選過 先選起來
                            if( !child["devModeSelected"] ){
    
                                //// renhaohsu暫時設定為 "在editor設定的子物件不一起選取"
                                if(child.el){
                                    if(child.el.id){
                                        if(child.el.id != touchObjectID){
                                            // console.log(" 所以這是子物件 _Effects _startModelHover child.el.id", child.el.id)
                                            return;
                                        }
                                    }
                                }
                                
                                child["devModeSelected"] = true
                                let m = child.material.clone()
                                this.MeshMaterialMap[child.material.uuid] = m
                                console.log("VRFunc.js: _setupFunction: endEvent, m = " , m );
    
                                if(child.material.emissive){
                                    child.material.emissive = new THREE.Color(70,70,0)
                                }
    
                                setTimeout(()=>{
                                    console.log("child.material == m", child.material == m)
                                    child.material = m
                                    // child.material.emissive = c;
                                    child["devModeSelected"] = false
                                }, 1000)
                            }
                        }
                    })
                } else {

                }
            }
        }

        this.canvas.addEventListener("mousemove", moveEvent, false);
    }

    endModelHover(){
        //// 把上面的取消掉, 事件也應該可以移除
    }


    //// 選取物件: 滑鼠點擊
    startClickHighlight(){

        let makarTHREEObjects = [];
        for ( let i = 0; i < this.currentController.makarObjects.length; i++ ){
            let makarObject = this.currentController.makarObjects[i];
                let parentVisible = true;
                makarObject.object3D.traverseAncestors( parent => {
                    if (parent.type != "Scene"){
                        if (parent.visible == false){
                            parentVisible = false;
                        }
                    }
                });
                if (parentVisible){
                    makarTHREEObjects.push(makarObject.object3D );
                }
        }

        //// 
        const mouseDownEvent = (event) => {
            console.log("Effects _moveEvent:", event)

            //// 取得滑鼠xy
            let mouse = new THREE.Vector2();
            const setMouseXY = (event, mouse) => {
                let rect = this.currentController.GLRenderer.domElement.getBoundingClientRect();
        
                switch ( event.type ) {
                    case "mouseup":
                    case "mousemove":
                    case "mousedown":
                        mouse.x = ( (event.clientX - rect.left) / this.currentController.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                        mouse.y = - ( (event.clientY - rect.top) / this.currentController.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                        break;
                    case "touchend":////// 20190709 Fei: add this event type for cellphone
                    case "touchstart":
                    case "touchmove":
                        mouse.x = ( (event.changedTouches[0].clientX - rect.left) / this.currentController.GLRenderer.domElement.clientWidth ) * 2 - 1; // GLRenderer.domElement.clientWidth window.innerWidth
                        mouse.y = - ( (event.changedTouches[0].clientY - rect.top) / this.currentController.GLRenderer.domElement.clientHeight ) * 2 + 1; // GLRenderer.domElement.clientHeight  window.innerHeight
                        break;
                    default:
                        console.log("default endEvent: event.type=", event.type, " not mouseup/touchend, return ");
                        return ;
                }
            }
            setMouseXY(event, mouse)
            
            
            //// raycaster
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera( mouse, this.currentController.vrScene.camera );
            
            let intersects = raycaster.intersectObjects(  makarTHREEObjects, true ); 
            if (intersects.length != 0 ){

                let touchObject = this.currentController.getMakarObject( intersects[0].object );
                if( touchObject ){
                    
                    //// renhaohsu暫時設定為 不是用aframe物件流程載入的都先跳過
                    if(!touchObject.el){ return }
                    
                    const touchObjectID = touchObject.el.id
                    console.log("_Effects _startModelHover touchObjectID", touchObjectID)

                    this.currentSelect = touchObject;

                    touchObject.traverse( child => {

                        //// renhaohsu暫時設定為 "在editor設定的子物件不一起選取" 只選取該模型本身
                        if(child.el){
                            if(child.el.id){
                                if(child.el.id != touchObjectID){
                                    // console.log(" 所以這是子物件 _Effects _startModelHover child.el.id", child.el.id)
                                    return;
                                }
                            }
                        }
                        
                        if (child.isMesh){
                            console.log("child", child)
                            ////  for_makarSDK : 如果模型還沒被選過 先選起來
                            if( !child["devModeSelected"] ){
                                child["devModeSelected"] = true
                                let m = child.material.clone()
                                this.MeshMaterialMap[child.uuid] = m
                                console.log("VRFunc.js: _setupFunction: endEvent, m = " , m );
    
                                if(child.material.emissive){
                                    child.material.emissive = new THREE.Color(70,70,0)
                                }
    
                                // setTimeout(()=>{
                                //     console.log("child.material == m", child.material == m)
                                //     child.material = m
                                //     // child.material.emissive = c;
                                //     child["devModeSelected"] = false
                                // }, 1000)
                            } else {
                                child["devModeSelected"] = false
                                let m = this.MeshMaterialMap[child.uuid]
                                console.log("child.material == m", child.material == m)
                                child.material = m
                                //     // child.material.emissive = c;

                            }
                        }
                    })
                } else {

                }
            }
        }
        this.canvas.addEventListener("mousedown", mouseDownEvent, false);
    }

    clearClickHighlight(){
        console.log("this.MeshMaterialMap", this.MeshMaterialMap)
        for (const uuid in this.MeshMaterialMap){
            let m = this.MeshMaterialMap[uuid]
            console.log(uuid, m)
        }
    }

}
export default Effects