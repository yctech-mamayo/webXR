//// an extension to deal with makar events
//// 為了讓event在sdk上能更直接的處理 但又不想在 vrController增加東西


//// 問:  Dialing, email, url, display2D, videoTogglePlayPause 的對應方式
class MakarEvents{

    //// 預先考慮了使用 mix專案 的情況
    currentController;

    //// 指定一個 html element 讓他發布事件 之後就監聽它
    eventDispatchTarget;

    constructor(currentController, eventDispatchTarget){
        this.currentController = currentController;
        this.eventDispatchTarget = eventDispatchTarget;
    }

    //// 發布事件
    //// 參數: originalEventData   : 來自editor記錄的behav
    ////       eventDispatchTarget : html Element
    dispatchEvent( originalEventData, eventDispatchTarget=this.eventDispatchTarget ){
        let event = this.genenrateCustomEvent(originalEventData)
        eventDispatchTarget.dispatchEvent(event)
    }

    genenrateCustomEvent( originalEventData ){
        // console.log("originalEventData", originalEventData)

        //// 原本editor傳過來的data, general的部分
        let customEvent = new CustomEvent("MakarEvent", {
            detail: {
                behavType: originalEventData.behav_type,
                sourceID: originalEventData.trigger_obj_id,
                delay: originalEventData.delay,
                triggerType: originalEventData.trigger_type,
                typeAttr: {},
                _originalData: originalEventData,
            },
        });

        //// typeAttr: 把不general的分隔出來
        //// 為了避免混淆, 都改為駝峰式大小寫     注意"底線分隔"or"駝峰式大小寫" (由於editor歷經多次改版 命名方式不一定相同)
        const _typeAttrDict = {
            "URL": {
                "url": originalEventData.url,
                "background": originalEventData.background,
            },
            "Dialing": {
                "phone": originalEventData.phone,
            },
            "Email": {
                "body": originalEventData.body,
                "mailTo": originalEventData.mail_to,
                "subject": originalEventData.subject,
            },
            "Animation": {
                "uid": originalEventData.uid,
                "loop": originalEventData.loop,
                "reset": originalEventData.reset,
                "towardID": originalEventData.obj_id,
            },
            "TTS": {
                "pitch": originalEventData.pitch,
                "speed": originalEventData.speed,
                "language": originalEventData.language,
                "towardID": originalEventData.obj_id,
            },
            "Scenes": {
                "sceneID": originalEventData.scene_id,
                "previousID": originalEventData.previousID
            },
            "Skybox": {
                "skyboxID": originalEventData.skybox_id,
                "previousID": originalEventData.previousID
            },
            "Display": {
                "group": originalEventData.group,
                "towardID": originalEventData.obj_id,
                "switchType": originalEventData.switch_type,
                "reset": originalEventData.reset,
            },
            "Facing": {
                "isFront": originalEventData.is_front,
                "towarID": originalEventData.toward_id,
            },
        }

        // customEvent.detail.typeAttr = _typeAttr
        customEvent.detail.typeAttr = _typeAttrDict[originalEventData.behav_type] 
        return customEvent
    }
}

export default MakarEvents