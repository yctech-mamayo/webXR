//// an extension to deal with makar events
//// 為了讓event在sdk上能更直接的處理 但又不想在 vrController增加東西


//// 問:  Dialing, email, url, display2D, videoTogglePlayPause 的對應方式
class MakarEvents{

    currentController;

    eventDispatchTarget;

    constructor(currentController, eventDispatchTarget){
        this.currentController = currentController;
        this.eventDispatchTarget = eventDispatchTarget;
    }

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

        //// 把不 general 的東西提出來     注意"底線分隔"or"駝峰式大小寫" (由於editor歷經多次改版 命名方式不一定相同)
        ////     這邊看到"底線分隔"出現最多 於是在typeAttr都改為底線分隔
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
                "mail_to": originalEventData.mail_to,
                "subject": originalEventData.subject,
            },
            "Animation": {
                "uid": originalEventData.uid,
                "loop": originalEventData.loop,
                "reset": originalEventData.reset,
                "toward_id": originalEventData.obj_id,
            },
            "TTS": {
                "pitch": originalEventData.pitch,
                "speed": originalEventData.speed,
                "language": originalEventData.language,
                "toward_id": originalEventData.obj_id,
            },
            "Scenes": {
                "scene_id": originalEventData.scene_id,
                "previous_id": originalEventData.previousID
            },
            "Skybox": {
                "skybox_id": originalEventData.skybox_id,
                "previous_id": originalEventData.previousID
            },
            "Display": {
                "group": originalEventData.group,
                "toward_id": originalEventData.obj_id,
                "switch_type": originalEventData.switch_type,
                "reset": originalEventData.reset,
            },
            "Facing": {
                "is_front": originalEventData.is_front,
                "toward_id": originalEventData.toward_id,
            },
        }

        // customEvent.detail.typeAttr = _typeAttr
        customEvent.detail.typeAttr = _typeAttrDict[originalEventData.behav_type] 
        return customEvent
    }
}

export default MakarEvents