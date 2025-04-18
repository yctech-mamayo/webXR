//// 主因: 3D物件載入都在 ARController 底下，要呼叫load系列都要透過 ARController
//// 同時 Quiz 物件要獨立出來，但 Quiz 會需要把物件加入場景 (要呼叫load系列)

//// 目的: 將額外的3D物件加到場景裡，因此它會和 ArController 互動

////           ________________________         ____________ 
////     介面: |AddObjectToArController| -使用→ |ARController|
////           ¯¯¯¯¯¯¯↑¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯         ¯¯¯¯¯¯¯¯¯¯¯¯¯
////                  | 實作該介面　　　　　　
////                _____
////                |Quiz|　　　　　　　　                             (因此Quiz可以將3D物件加入場景)
////                ¯¯¯¯¯¯

//// 原本是想寫 interface 但發現 js 似乎還沒有，因此寫成 class  (上圖的實作其實是用extends繼承)

//// 有實作/繼承這個Class的 就表示它能跟vrController互動
class AddObjectToArController {
        
    //// 此時 只要 Quiz 繼承這個 class 並實作它的方法，就能把物件加入場景
    //// howardhsu has not comfirm that this is good or not, yet. 
    
    //// 考慮了如果場中存在複數個 ArController 的情況(指定是與哪個vrController互動)
    // ArController = null
    // constructor(ArController){
    //     this.ArController = ArController
    // }
    //// 但，如果寫了 constructor 就變質了  (它會連 Abstract Class 都不是，也不是 interface。 Orz


    //// ----------------
    //// 以下是 "把物件加入到場景 或 ArController 常用到的函式們" 
    ////     實作或繼承了此抽象類別的class需要去覆寫它們 以便與vrController互動

    getProjectIdx(){
        // return window.ArController.projectIdx
    }

    addTextToScene(){
        //// 把文字物件加入場景
    }

    addTextureToScene(){
        //// 把圖片物件加入場景
    }

    addGLTFModelToScene(){
        //// 把模型物件加入場景
    }

    addAudioToScene(){
        //// 把聲音物件加入場景
    }

    addVideoToScene(){
        //// 把影片物件加入場景
    }

    pushObjectToMakarObjects(){
        //// 把3D物件加入到 makarObjects 陣列
    }

    setTransform(){
        //// 把物件放到對應的場景位置
    }

    appendToArScene(){
        //// 把物件加入到場景裡
    }
    //// ----------------

    initTest(){
        console.log("AddObjectToArController.initTest: ", window.ArController)
    }

    // static testStaticMethod(){
    //     console.log('static method test')
    // }
}
export default AddObjectToArController