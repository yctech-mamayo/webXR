



class CanvasEvent{
    
    constructor( GLRenderer ){

        let self = this;

        self.GLRenderer = GLRenderer;

        //// 各類型控制器
        self.ARC = null;
        self.VRC = null;
        self.XRC = null;

        //// 當前場景 是用 哪個控制器
        self.currentSceneController = null;

        //// 紀錄類型
        self.currentSceneType = '';

        self.mouse =  new THREE.Vector2();

        let GD = GLRenderer.domElement;

        GD.addEventListener( 'touchend', self.endEvent.bind( self ) , false );
        GD.addEventListener( 'mouseup', self.endEvent.bind( self ), false );

        GD.addEventListener( 'touchmove', self.moveEvent.bind( self ), false );
        GD.addEventListener( 'mousemove', self.moveEvent.bind( self ), false );

        GD.addEventListener( 'touchstart', self.startEvent.bind( self ), false );
        GD.addEventListener( 'mousedown', self.startEvent.bind( self ), false );

    }

    //// 加入 AR 控制器 ARWrapper
    includeAR( controller ){
        this.ARC = controller;
    }

    //// 加入 VR 控制器 VRController
    includeVR( controller ){
        this.VRC = controller;
    }

    //// 加入 XR 控制器 XRController
    includeXR( controller ){
        this.XRC = controller;
    }

    //// 設定當前該操控哪個類型場景「控制器」
    setControllerType( type ){
        let self = this;

        self.currentSceneType = type;
        
        switch( type ){
            case 'AR':
                if ( self.ARC ){
                    self.currentSceneController = self.ARC
                }else{
                    console.warn('_setControllerType_: this project do not contain AR.' );
                }
            break;
            case 'VR':
                if ( self.VRC ){
                    self.currentSceneController = self.VRC
                }else{
                    console.warn('_setControllerType_: this project do not contain VR.' );
                }

            break;
            case 'XR':
                if ( self.XRC ){
                    self.currentSceneController = self.XRC
                }else{
                    console.warn('_setControllerType_: this project do not contain XR.' );
                }

            break;
            default:
                console.warn('_setControllerType_: type unknow', type );
        }
        
        
    }




    //// 基本的 「滑鼠抬起/觸控結束」「滑鼠移動/觸控移動」「滑鼠按下/點擊開始」
    endEvent( event ){

        event.preventDefault();

        let self = this;

        // console.log( '_CanvasEvent_ : _endEvent: ' , self , gm );

        switch ( self.currentSceneType ) {
            case "AR":
                if ( self.ARC.arController.clickEndEvent ){
                    self.ARC.arController.clickEndEvent( event )
                }
            break;
            case "VR":
                if ( self.VRC.clickEndEvent ){
                    self.VRC.clickEndEvent( event );
                }
            break;
            case "XR":
                if ( self.XRC.clickEndEvent ){
                    self.XRC.clickEndEvent( event );
                }
            break;
            
            default:
                // console.log( '_CanvasEvent_ : _endEvent: default' , self.currentSceneType );
        }

    }

    moveEvent( event ){

        let self = this;

        event.preventDefault();
        
        switch ( self.currentSceneType ) {
            case "AR":
                if ( self.ARC.arController.clickMoveEvent ){
                    self.ARC.arController.clickMoveEvent( event )
                }
            break;
            case "VR":
                if ( self.VRC.clickMoveEvent ){
                    self.VRC.clickMoveEvent( event );
                }
            break;
            case "XR":
                if ( self.XRC.clickMoveEvent ){
                    self.XRC.clickMoveEvent( event );
                }
            break;
            
            default:
                // console.log( '_CanvasEvent_ : _endEvent: default' , self.currentSceneType );
        }

    }

    startEvent( event ){
        
        let self = this;

        event.preventDefault();
        
        // console.log(' _startEvent ', self );

        switch ( self.currentSceneType ) {
            case "AR":
                if ( self.ARC.arController.clickStartEvent ){
                    self.ARC.arController.clickStartEvent( event )
                }
            break;
            case "VR":
                if ( self.VRC.clickStartEvent ){
                    self.VRC.clickStartEvent( event );
                }
            break;
            case "XR":
                if ( self.XRC.clickStartEvent ){
                    self.XRC.clickStartEvent( event );
                }
            break;
            
            default:
                // console.log( '_CanvasEvent_ : _endEvent: default' , self.currentSceneType );
        }

    }



}

// const canvasEvent = new CanvasEvent();

export default CanvasEvent;

