//// 以狀態列表來播放動畫
////   引用 "觀察者模式"
////      觀察者物件: 可以訂閱 "主題"
////      主題: 帶有狀態列表  每個狀態開始時, 通知有訂閱的觀察者
////      當觀察者收到通知 按照通知的state來播動畫

// 觀察者 interface
class Observer {
    update(subject) {}
}

// 具體觀察者
export class BoxObserver extends Observer {
    constructor(obj_id) {
        super();
        this.obj_id = obj_id
        this.element = document.getElementById(obj_id);
        //// 這裡應該要做錯誤處理
    }

    update(subject) {
        if(!subject.state){ return; }
        if(!subject.state.typeAttr){ return; }

        //// 先模仿triggerEvent的方式來寫
        let position;
        switch (subject.state.behavType) {
            case "transform":
                position = subject.state.typeAttr.position
                if(!position){ return; }

                console.log("position", position)
                anime({
                    targets: this.element.object3D.position,
                    // round: 1,
                    easing: 'linear',
                    x: (position.x || position.x === 0) ? position.x : this.element.object3D.position.x,
                    y: (position.y || position.y === 0) ? position.y : this.element.object3D.position.y,
                    z: (position.z || position.z === 0) ? position.z : this.element.object3D.position.z,
                    update: () => {
                        // console.log("update update subject.state", subject.state)
                    },
                    complete: () => {
                        console.log("position complete")
                        subject.notifyNext()
                    }
                });
                
                break;
            
            case "lookAt":
                position = subject.state.typeAttr.position
                const targetObjId = subject.state.typeAttr.targetObjId
                if(!position && !targetObjId){ return; }
                
                //// 開一個物件用來取得lookAt之後的rotation, 再用anime.js來轉動原本物件
                const tempObj = this.element.object3D.clone()
                tempObj.rotation.order = "YXZ"

                //// 可以是位置或物件id  暫時設定成position優先
                if(position){

                    this.element.object3D.lookAt(position.x, position.y, position.z);

                } else if(targetObjId){

                    let targetObj = makarSDK.sceneObjs3D_arr.find(obj => obj.obj_id === targetObjId );
                    if(targetObj){
                        //// 這裡拿到的是 makarSDK 物件Array裡的資料 它被設計成要往下拿.obj才是THREE Object3D
                        targetObj = targetObj.obj

                        let targetPos = new THREE.Vector3();
                        targetObj.getWorldPosition(targetPos);
                        // this.element.object3D.lookAt(targetPos);
                        
                        tempObj.lookAt(targetPos);
                    }

                } 
                
                console.log("rotation", tempObj.rotation)
                anime({
                    targets: this.element.object3D.rotation,
                    // round: 1,
                    easing: 'linear',
                    x: (tempObj.rotation.x || tempObj.rotation.x === 0) ? tempObj.rotation.x : this.element.object3D.rotation.x,
                    y: (tempObj.rotation.y || tempObj.rotation.y === 0) ? tempObj.rotation.y : this.element.object3D.rotation.y,
                    z: (tempObj.rotation.z || tempObj.rotation.z === 0) ? tempObj.rotation.z : this.element.object3D.rotation.z,
                    update: () => {
                        // console.log("update update subject.state", subject.state)
                    },
                    complete: () => {
                        console.log("rotation complete")
                        subject.notifyNext()
                    }
                });

                break;
            
            default:
                break;
        }
    
    }
}


//// 狀態表 或者說timeline
////        主題 → 狀態表  目前設定為 1to1, 但不是onto     (設計成每個主題要有狀態表才能運作 之後要考慮主題能不能更換狀態表)
const stateConfig = {
    stateMap: [
        {
            stateName: "bearMove1",
            obj_id: "obj_id",
            behavType: "transform",
            typeAttr: {
                position: {y: 5},
                // rotation: {y: 5},
            },
        },
        { 
            stateName: "penguinMove",
            obj_id: "obj_id",
            behavType: "transform",
            typeAttr: {
                position: {x: -4}, 
                // rotation: {x: 2},
            },
        },
    ],
    startIndex: 0
};

// 主題
export class Subject {

    stateConfig = {}

    _state = {};
    _stateMap = [];
    _startIndex = 0;
    // _stateNames = [];

    stateIndex = 0;

    constructor(newStateConfig) {
        this.observers = [];
        // this.currentObserverIndex = 0;

        this._stateMap = newStateConfig.stateMap;
        // this._stateNames = newStateConfig.stateNames;
        this.stateIndex = newStateConfig.startIndex || 0;
    }

    //// 觀察者訂閱主題
    attach(observer) {
        this.observers.push(observer);
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify() {
        // if (this._stateNames.length > 0 && this.stateIndex < this._stateNames.length) {
        if (this._stateMap.length > 0 && this.stateIndex < this._stateMap.length) {
            // const stateName = this._stateNames[this.stateIndex];
            const state = this._stateMap[this.stateIndex];
            this._state = state;
            const observer = this.observers.find(obs => obs.element.id === state.obj_id);
            if (observer) {
                observer.update(this);
            }
        }
    }

    notifyNext() {
        this.stateIndex++;
        // if (this.stateIndex < this._stateNames.length) {
        if (this.stateIndex < this._stateMap.length) {
            this.notify();
        }
    }

    //// 設定狀態表 or 更換狀態表(todo: 規劃為可以更換 但是在什麼時機呼叫? SDK怎麼呼叫?)
    /**
     * @param {{ stateMap: any[]; startIndex: number; }} newStateConfig
     */
    set stateConfig(newStateConfig) {
        console.log("subject set stateConfig")
        this._stateMap = newStateConfig.stateMap;
        // this._stateNames = newStateConfig.stateNames;
        this.stateIndex = newStateConfig.startIndex || 0;
    }

    get stateConfig() {
        // return { stateMap: this._stateMap, stateNames: this._stateNames };
        return { stateMap: this._stateMap, startIndex: this._startIndex };
    }

    get state() {
        return this._state;
    }

    set state(newState) {
        this._state = newState;
        this.notify();
    }

    triggerState(stateName) {
        this.stateIndex = this._startIndex;
        if (this.stateIndex !== -1) {
            this.notify();
        }

        //// todo: 要處理連續觸發的問題
    }





}
