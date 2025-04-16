
function checkAllSceneObjs(){

    let scenes = makarUserData.scenesData.scenes;
    scenes.forEach( ( se , si )=>{

        let objs = se.objs;
        objs.forEach( ( oe, oi ) =>{

            if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'audio'   ){

                // console.log( si , se.info.name, oi, oe.generalAttr.obj_name, makarUserData.userProjResDict[ oe.res_id ].res_name )
                console.log( si , oi,  makarUserData.userProjResDict[ oe.res_id ].res_name )

            }
 
        });
    });
}

////
makarUserData.scenesData.scenes.forEach( ( se , si )=>{
    console.log( si, se.info.name )
})

makarUserData.scenesData.scenes.forEach( ( se , si )=>{
    se.objs.forEach( ( oe, oi ) =>{
        if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'audio'   ){
            console.log( si , se.info.name, oi, makarUserData.userProjResDict[ oe.res_id ].sub_type ,oe.generalAttr.obj_name )
        }
    })
})

makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'audio'   ){
        console.log( oi, oe.generalAttr.obj_name , makarUserData.userProjResDict[ oe.res_id ].res_name );
    }
})


makarUserData.scenesData.scenes[0].objs.forEach( (e, i)=>{
    if ( e.generalAttr && e.generalAttr.obj_name){
        console.log( i , e.generalAttr.obj_name )
    }
})

si = 0;
makarUserData.scenesData.scenes[ si ].objs.forEach( (e, i)=>{
    if ( e.generalAttr && e.generalAttr.obj_name){
        if ( e.generalAttr.obj_parent_id ){
            let obj_parent = makarUserData.scenesData.scenes[ si ].objs.find( e2 => e2.generalAttr.obj_id == e.generalAttr.obj_parent_id );
            let obj_parent_index = makarUserData.scenesData.scenes[ si ].objs.indexOf( obj_parent );

            if (obj_parent){
                console.log( i , e.generalAttr.obj_name , obj_parent_index, obj_parent.generalAttr.obj_name )
            }
        }
    }
})

//// 顯示名稱: 
makarUserData.scenesData.scenes[0].objs.forEach( (e, i )=>{
    if ( e.generalAttr && e.generalAttr.obj_name && makarUserData.userProjResDict[ e.res_id ]  ){
        console.log( i , ', u:' , e.main_type, e.generalAttr.obj_name , makarUserData.userProjResDict[ e.res_id ] )
    }

    // if ( e.generalAttr && e.generalAttr.obj_name && makarUserData.userOnlineResDict[ e.res_id ]  ){
    //     console.log( i , ', c:', e.generalAttr.obj_name , makarUserData.userOnlineResDict[ e.res_id ].res_name )
    // }
})


//// 找名稱 顯示: 
makarUserData.scenesData.scenes[0].objs.forEach( (e, i )=>{
    if ( e.generalAttr && e.generalAttr.obj_name == '03落石防護網' && makarUserData.userProjResDict[ e.res_id ]  ){
        console.log( i , ', u:' , e.main_type, e.generalAttr.obj_name , makarUserData.userProjResDict[ e.res_id ].res_name )
    }

    if ( e.generalAttr && e.generalAttr.obj_name == '03落石防護網' && makarUserData.userOnlineResDict[ e.res_id ]  ){
        console.log( i , ', c:', e.generalAttr.obj_name , makarUserData.userOnlineResDict[ e.res_id ].res_name )
    }
})

//// 顯示名稱:  類型
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    console.log( oi, oe.generalAttr.obj_name , oe.main_type  );
})


//// 依照 物件名稱 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe.generalAttr.obj_name == '防砂壩'  ){
        console.log( oi, oe.main_type , oe.generalAttr.obj_name , oe );
    }
})

let originLogicObjs = [
    {c: '聲音_開始', s: [{n:'none', t: 'none'}], a: '開始' },
    {c: '落石', s: [ {n:'落石介紹', t:'image'},{n:'rain落石', t:'model'} ], a: '落石' },
    {c: '土石流', s: [ {n:'土石流介紹', t:'image'},{n:'rain_土石流', t:'model'} ], a: '土石流' },
    {c: '崩塌', s: [ {n:'崩塌介紹', t:'image'},{n:'rain崩塌', t:'model'} ], a: '崩塌' },
    {c: '地滑', s: [ {n:'地滑介紹', t:'image'},{n:'rain_地滑', t:'model'} ], a: '地滑' },
    {c: '大規模崩塌', s: [ {n:'大規模崩塌介紹', t:'image'},{n:'rain_大規模', t:'model'} ], a: '大規模崩塌' },
]

originLogicObjs.forEach( (e,i)=>{
    makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{

        //// 顯示 【要顯示的物件】
        e.s.forEach( (se, si)=>{
            if ( oe.generalAttr.obj_name == se.n  ){
                console.log( i, oi, oe.main_type , oe.generalAttr.obj_name  );
            }
        })

        // //// 顯示【被點擊的物件】
        // if ( oe.generalAttr.obj_name == e.c  ){
        //     console.log( i, oi, oe.main_type , oe.generalAttr.obj_name  );
        // }
    })
})



//// 依照 物件類型 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'audio'   ){
        console.log( oi, oe.generalAttr.obj_name , makarUserData.userProjResDict[ oe.res_id ].res_name );
    }
})

//// 依照 物件類型 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'model'   ){
        console.log( oi, oe.generalAttr.obj_name , makarUserData.userProjResDict[ oe.res_id ].res_name );
    }
})

//// 依照 物件類型 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type == 'image'   ){
        console.log( oi, oe.generalAttr.obj_name , makarUserData.userProjResDict[ oe.res_id ].res_name );
    }
})

//// 依照 物件名稱 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe && oe.generalAttr && oe.generalAttr.obj_name == 'Trophy (2)'  ){
        console.log( oi, oe.generalAttr.obj_name , oe, makarUserData.userOnlineResDict[ oe.res_id ]  );
        console.log( oi, oe.generalAttr.obj_id , oe,  );
    }
})


//// 依照 物件id 找物件
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe && oe.generalAttr && oe.generalAttr.obj_id == "2a8ce1d0-7955-41f6-8765-233c18943dd3"  ){
        // console.log( oi, oe.generalAttr.obj_name , oe, makarUserData.userProjResDict[ oe.res_id ]  );
        console.log( oi, oe.generalAttr.obj_id , oe,  );
    }
})



//// 依照 物件名稱 找物件 在找材質球
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe && oe.generalAttr && oe.generalAttr.obj_name == 'tree4'  ){
        if ( oe.materialAttr && Array.isArray( oe.materialAttr.materials ) && 
            oe.materialAttr.materials[0] && oe.materialAttr.materials[0].material_idx ){
            
            console.log(oe.materialAttr.materials);    
            console.log( makarUserData.userMaterialDict[ oe.materialAttr.materials[0].material_idx ] );
            
        }
        
     }
})

//// 依照 物件id 找物件 在找材質球
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe && oe.generalAttr && oe.generalAttr.obj_id == '0b9d2da2-a40a-4c36-ae1f-acc5b0daab2e'  ){
        if ( oe.materialAttr && Array.isArray( oe.materialAttr.materials ) && 
            oe.materialAttr.materials[5] && oe.materialAttr.materials[5].material_idx ){
            
            console.log( makarUserData.userMaterialDict[ oe.materialAttr.materials[5].material_idx ] );
            
        }
        
     }
})

//// 依照 場景物件 找，素材的 類型 與 名稱，為了遺失素材用的
makarUserData.scenesData.scenes[0].objs.forEach( ( oe, oi )=>{
    if ( oe && oe.res_id   ){

        if ( makarUserData.userProjResDict[ oe.res_id ] && makarUserData.userProjResDict[ oe.res_id ].main_type ){
            console.log( oi, oe.generalAttr.obj_name , makarUserData.userProjResDict[ oe.res_id ].res_name );
        }

        if ( oe.materialAttr && Array.isArray( oe.materialAttr.materials ) && 
            oe.materialAttr.materials[5] && oe.materialAttr.materials[5].material_idx ){
            
            console.log( makarUserData.userMaterialDict[ oe.materialAttr.materials[5].material_idx ] );
            
        }
        
     }
})

setTimeout( function(){ www.getUserPublishProjsByUserID('fefe').then(e=>{console.log('1', e)}) ; },1);
setTimeout( function(){ www.getUserPublishProjsByUserID('fefe').then(e=>{console.log('2', e)}) ; },50);
setTimeout( function(){ www.getUserPublishProjsByUserID('fefe').then(e=>{console.log('3', e)}); },100);
setTimeout( function(){ www.getUserPublishProjsByUserID('fefe').then(e=>{console.log('4', e)}); },150);
setTimeout( function(){ www.getViewerConfig('').then(e=>{console.log('5', e)}); },200);
setTimeout( function(){ www.getViewerConfig('').then(e=>{console.log('6', e)}); },200);
setTimeout( function(){ www.getViewerConfig('').then(e=>{console.log('7', e)}); },200);




// a: 463f10b8-84bc-47af-8484-db12e3c0145c
// b: 63c6b880-cc9f-46e3-b426-8be28cb10bda


// https://localhost:8081/buy_list?skey=ac0445ed-6e11-45d6-a11f-4d75b7bc050b
