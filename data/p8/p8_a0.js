

let projData = {
    proj_id: "p7",
    name: {
        tw: "專案 森林 7",
        en: "Project forest 7"
    },

    scenesData:{
        scenes: [
            {
                info:{
                    id:'s1', //// 必須為 專案內唯一
                    name:{
                        tw:'場景 1',
                        en:'Scene 1'
                    },
                    type:'vr',
                },
                environment: {
                    shader: "Skybox/Panoramic",
                    ground_shadow: false,
                    ground_shadow_color: "0,0,0,0.6",
                    scene_skybox_res_id: "1bfa00c43fe108e103841345a86e786f",
                    sceneSky_info:{
                        main_type: 'spherical_image',
                        // res_url: '../resource/sky/gray2.jpg',
                        color: '#ffffff',

                    },
                    oCameraInfo:{
                        position:[ -9.34 , 6.62 , -1.51 ],
                        target: [ 1.47 , 2.07 , 0.8 ],
                    },
                    ambientLight:{
                        intensity: 1.7 ,
                    }
                },
                objs: [
                    {
                        //// 平行光
                        main_type: 'light',
                        sub_type: "light",
                        generalAttr: {
                            logic: false,
                            active: true,
                            obj_id: "d_light_1", //// 必須為 場景內唯一
                            obj_name: "direct_light_1",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "0,7.228968,2.956055",
                                "0.222, 0.421, -0.107 , 0.876 ",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        typeAttr: {
                            color: "1,1,1",
                            intensity: 0.6,
                            light_type: "directional",
                            shadow: "Soft",
                            shadow_strength: 1,
                            helper: false,
                            
                        }
                    },
                    // {
                    //     //// 聚光燈
                    //     main_type: 'light',
                    //     sub_type: "light",
                    //     generalAttr: {
                    //         logic: false,
                    //         active: true,
                    //         obj_id: "s_light_1", //// 必須為 場景內唯一
                    //         obj_name: "direct_light_1",
                    //         obj_type: "3d",
                    //         interactable: true,
                    //         obj_parent_id: ""
                    //     },
                    //     transformAttr: {
                    //         transform: [
                    //             "0, 8 , 0",
                    //             "0.707,0,0,0.707",
                    //             "1,1,1"
                    //         ],
                    //         rect_transform: [],
                    //         simulated_rotation: "0,0,0"
                    //     },
                    //     typeAttr: {
                    //         color: "1,1,1",
                    //         intensity: 2,
                    //         light_type: "spot",
                    //         range: 10,
                    //         shadow: "Soft",
                    //         shadow_strength: 1,
                    //         spotAngle: 90,
                    //         helper: true,
                    //     }
                    // },
                    
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'../resource/model/frost/樹樂園(a0).glb',
                        behav:[{type:'showData'}],
                        generalAttr: {
                            logic: false,
                            active: true,
                            obj_id: "obj_1", //// 必須為 場景內唯一
                            obj_name: "step_1_c_1",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "0,0,0",
                                "0,0,0,1",
                                "14,14,14"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},
                        //// 由於 此專案的材質為【 多數磁力片 相同顏色 】，故設計為【 材質類別 】 對應【 Mesh 名稱 】
                        cust_materials:[
                            //// 要隱藏的物件
                            // {
                            //     id:'mHide', 
                            //     visible: false,
                            //     names:[ '7-1','7-2','42-1','42-2','26-1',,'26-2','28-1','28-2' ]
                            // },
                            //// 磁力片 磁鐵 金屬 棒
                            { 
                                id:'mag_stick', 
                                trans: false, 
                                opacity: 1, 
                                color: [20, 20, 20], 
                                roughness: 0.2, 
                                metalness: 1,
                                names:[
                                    '01-1-2','01-2-2','01-4-2','01-5-2','01-6-2','01-7-2','01-8-2','01-9-2','01-10-2',
                                    '01-11-2','01-12-2','01-14-2','01-15-2','01-16-2','01-17-2','01-18-2','01-19-2','01-20-2',
                                    '01-21-0_0','01-22-0_0','01-24-0_0','01-25-2','01-26-2','01-27-2',
                                    '02-1-2','02-2-2','02-4-2','02-5-2','02-6-2','02-7-2','02-8-2','02-9-2',
                                    '03-1-2','03-2-2','04-1-2','04-2-2',

                                ]
                            },
                            //// 透明管 
                            { 
                                id:'trans_tube', 
                                trans: true, 
                                opacity: 0.5, 
                                color: [235, 235, 235], 
                                roughness: 0.2, 
                                metalness: 0.1,
                                depthWrite: false,
                                names:[
                                    
                                ]
                            },
                            //// 紫色磁力片 面 
                            {
                                id:'purple_plane', 
                                trans: true, 
                                color: [ 135, 52, 237 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '01-4-1','01-5-1','01-7-1',
                                    
                                ]
                            },
                            //// 藍色磁力片 面 
                            {
                                id:'blue_plane', 
                                trans: true, 
                                color: [ 31 , 28 , 217 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '03-1-1',
                                ]
                            },
                            //// 綠色磁力片 面 
                            { 
                                id:'green_plane', 
                                trans: true, 
                                color: [ 40 , 199 , 199 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '01-17-1','01-15-1','01-20-1',
                                    '01-25-1','01-26-1',
                                    '02-2-1','02-1-1','02-4-1','02-5-4',

                                ]
                            },
                            //// 紅色磁力片 面  
                            {
                                id:'red_plane', 
                                trans: true, 
                                color: [ 255, 10, 10 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[

                                ]
                            },
                            //// 橘色磁力片 面  
                            {
                                id:'orange_plane', 
                                trans: true, 
                                color: [ 235, 116, 30 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '02-8-1','02-9-1',

                                ]
                            },
                            //// 黃色磁力片 面 
                            {
                                id:'yallow_plane', 
                                trans: true, 
                                color: [ 247, 214, 27 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '01-1-1','01-2-1','01-6-1',
                                    '01-8-1','01-9-1','01-10-1',
                                    '01-11-1','01-12-1','01-14-1',
                                    '01-27-1',
                                    '03-2-1','04-2-1',

                                ]
                            },
                            //// 粉紅色磁力片 面 
                            {
                                id:'pink_plane', 
                                trans: true, 
                                color: [ 255, 102, 102 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    

                                ]
                            },
                            //// 白色磁力片 面 
                            {
                                id:'white_plane', 
                                trans: true, 
                                color: [ 204, 204, 204 ], 
                                opacity: 0.5, 
                                roughness: 0.5, 
                                metalness: 0.15,
                                depthWrite: false,
                                names:[
                                    '01-18-1','01-19-1','01-16-1',
                                    '01-22-0_1','01-21-0_1','01-24-0_1',
                                    '02-7-1','02-6-1',
                                    '02-5-1',
                                    '04-1-1',
                                    
                                ]
                            },
                            
                            //// 白色 眼睛
                            { 
                                id:'white_circle', 
                                trans: false, 
                                opacity: 0.5, 
                                color: [ 250, 250, 250 ], 
                                roughness: 0.5, 
                                metalness: 0.5,
                                names:[
                                    
                                ]
                            },
                            //// 黑色 眼睛
                            { 
                                id:'black_circle', 
                                trans: false, 
                                opacity: 0.5, 
                                color: [ 20, 20, 20 ], 
                                roughness: 0.5, 
                                metalness: 0.5,
                                names:[

                                ]
                            },

                        ],

                    },
                ],

                stepData:{
                    step_type:'mesh',
                    //// 要控制的所有物件，避免影響到 root 層級
                    controlChildrenNames:[
                        { o: 'obj_1', n:'01-1' },
                        { o: 'obj_1', n:'01-2' },
                        { o: 'obj_1', n:'01-4' },
                        { o: 'obj_1', n:'01-5' },
                        { o: 'obj_1', n:'01-6' },
                        { o: 'obj_1', n:'01-7' },
                        { o: 'obj_1', n:'01-8' },
                        { o: 'obj_1', n:'01-9' },
                        { o: 'obj_1', n:'01-10' },
                        { o: 'obj_1', n:'01-11' },
                        { o: 'obj_1', n:'01-12' },
                        { o: 'obj_1', n:'01-13' },
                        { o: 'obj_1', n:'01-14' },
                        { o: 'obj_1', n:'01-15' },
                        { o: 'obj_1', n:'01-16' },
                        { o: 'obj_1', n:'01-17' },
                        { o: 'obj_1', n:'01-18' },
                        { o: 'obj_1', n:'01-19' },
                        { o: 'obj_1', n:'01-20' },
                        { o: 'obj_1', n:'01-21' },
                        // { o: 'obj_1', n:'01-21-0_triangles' },
                        { o: 'obj_1', n:'01-22' },
                        // { o: 'obj_1', n:'01-22-0_triangles' },
                        { o: 'obj_1', n:'01-24' },
                        // { o: 'obj_1', n:'01-24-0_triangles' },
                        { o: 'obj_1', n:'01-25' },
                        { o: 'obj_1', n:'01-26' },
                        { o: 'obj_1', n:'01-27' },
                        { o: 'obj_1', n:'02-1' },
                        { o: 'obj_1', n:'02-2' },
                        { o: 'obj_1', n:'02-4' },
                        { o: 'obj_1', n:'02-5' },
                        { o: 'obj_1', n:'02-6' },
                        { o: 'obj_1', n:'02-7' },
                        { o: 'obj_1', n:'02-8' },
                        { o: 'obj_1', n:'02-9' },
                        { o: 'obj_1', n:'03-1' },
                        { o: 'obj_1', n:'03-2' },
                        { o: 'obj_1', n:'04-1' },
                        { o: 'obj_1', n:'04-2' },
                        // { o: 'obj_1', n:'41' },
                        // { o: 'obj_1', n:'42' },
                        // { o: 'obj_1', n:'43' },
                        // { o: 'obj_1', n:'44' },
                        // { o: 'obj_1', n:'45' },
                        // { o: 'obj_1', n:'46' },
                        // { o: 'obj_1', n:'47' },
                        // { o: 'obj_1', n:'48' },
                        // { o: 'obj_1', n:'49' },
                        // { o: 'obj_1', n:'50' },
                        // { o: 'obj_1', n:'51' },
                        // { o: 'obj_1', n:'52' },
                        // { o: 'obj_1', n:'53' },
                        // { o: 'obj_1', n:'54' },
                        // { o: 'obj_1', n:'55' },
                        // { o: 'obj_1', n:'56' },
                        // { o: 'obj_1', n:'57' },
                        // { o: 'obj_1', n:'58' },
                        // { o: 'obj_1', n:'59' },
                        // { o: 'obj_1', n:'60' },
                        // { o: 'obj_1', n:'61' },
                        // { o: 'obj_1', n:'62' },
                        // { o: 'obj_1', n:'63' },
                        // { o: 'obj_1', n:'64' },
                        // { o: 'obj_1', n:'65' },
                        // { o: 'obj_1', n:'66' },
                        // { o: 'obj_1', n:'67' },
                        // { o: 'obj_1', n:'68' },
                        // { o: 'obj_1', n:'69' },
                        // { o: 'obj_1', n:'70' },

                    ],
                    steps:[
                        {
                            id:'step_1', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 1',
                                en:'Step 1'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01-7', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-1', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-2', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-6', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-5', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-4', type: 'direct'},


                            ],

                        },
                        {
                            id:'step_2', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 2',
                                en:'Step 2'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01-14', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-8', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-9', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-11', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '01-12', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-10', type: 'direct'},


                            ],
                            

                        },
                        {
                            id:'step_3', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 3',
                                en:'Step 3'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01-15', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-19', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-20', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-18', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '01-16', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-17', type: 'direct'},
                                
                            ],

                        },
                        {
                            id:'step_4', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 4',
                                en:'Step 4'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                // { obj_id: 'obj_1', name: '01-21-0_triangles', type: 'direct'},
                                // { obj_id: 'obj_1', name: '01-22-0_triangles', type: 'direct'},
                                // { obj_id: 'obj_1', name: '01-24-0_triangles', type: 'direct'},

                                { obj_id: 'obj_1', name: '01-21', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-22', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-24', type: 'direct'},


                            ],

                        },
                        {
                            id:'step_5', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 5',
                                en:'Step 5'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01-25', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-26', type: 'direct'},
                                { obj_id: 'obj_1', name: '01-27', type: 'direct'},

                            ],
                            // cameraAttr:{
                            //     p: [ 1.16, 4.51,  -6.80],
                            //     target:[ 0 , 0 , 0 ],
                            //     t: 1,
                            // }

                        },
                        {
                            id:'step_6', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 6',
                                en:'Step 6'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '02-2', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-1', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-4', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-5', type: 'direct'},

                            ],

                        },
                        {
                            id:'step_7', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 7',
                                en:'Step 7'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '02-6', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-7', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-8', type: 'direct'},
                                { obj_id: 'obj_1', name: '02-9', type: 'direct'},
                                

                            ],

                        },
                        {
                            id:'step_8', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 8',
                                en:'Step 8'
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '03-1', type: 'direct'},
                                { obj_id: 'obj_1', name: '03-2', type: 'direct'},
                                { obj_id: 'obj_1', name: '04-1', type: 'direct'},
                                { obj_id: 'obj_1', name: '04-2', type: 'direct'},
                     
                            ],

                        },
                        // {
                        //     id:'step_9', //// 必須為 專案內唯一
                        //     name:{
                        //         tw:'步驟 9',
                        //         en:'Step 9'
                        //     },
                        //     scene_id:'s1',
                        //     obj_id: 'obj_1',
                        //     show_objs: [
                        //         { obj_id: 'obj_1', name: '13', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '12', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '51', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '18', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '19', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '15', type: 'direct'},

                        //         { obj_id: 'obj_1', name: '14', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '16', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '44', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '45', type: 'direct'},
                        //     ],

                        // },
                    ],
                },
                

            },
        ]
    },

    //// 以下為 MAKAR 基底資料 原則上不使用。 但因為使用引擎的關係，所以必須要有。
    makarUserData:{
        oneProjData:{},
        materials:{},
        onlineResourcesList:{},
        resourcesList:{},
        scenesData:{},
        userMaterialDict:{},
        userOnlineResDict:{},
        userProjResDict:{},
    }
}

console.log('p2.js: _projData', projData);

export default projData;



// Part1 - Part16
// 這是用來測試的資料
// ee.children.forEach((e,i)=>{ 
//     if ( e.name == 'Part1' ){
//         e.visible = false;
//     }
// })

// ee.children.forEach((e,i)=>{ 
//     e.visible = true;
// })

// ee.children.forEach((e,i)=>{ 
//     console.log(i, e.name );
// })


function test(){

    obj_1.object3D.traverse( (c,i)=>{
        if ( c.name == '59' ){
            console.log( c );
            window.d = c ;
            // c.visible=false;
        }
    })

    //// 檢查名稱是否重複
    let names = [];
    obj_1.object3D.traverse( (c,i)=>{
        if ( c.name != '' || c.name != ' ' ){
            if ( names.includes( c.name ) ){
                console.log( '重複名稱:', c.name , c );
            }else{
                names.push( c.name );
            }
        }else{
            console.log( '空白名稱:', c.name , c );
        }
    })
    
    obj_1.object3D.traverse( (c,i)=>{
        if ( c.type == 'Mesh'){
            console.log('M:', c.name );
        }
        // if ( c.type == 'Object3D'){
        //     console.log('O:', c.name );
        // }
        // if ( c.type == 'Scene'){
        //     console.log('S:', c.name );
        // }
        // if ( c.type == 'Group'){
        //     console.log('G:', c.name );
        // }
    })

    obj_1.object3D.traverse( (c,i)=>{
        c.visible=true;
    })

    obj_1.object3D.traverse( (c,i)=>{
        if ( c.isMesh){
            // console.log( c.name );
            c.visible = true;
            c.material.transparent=true;
            c.material.opacity=0.5;
        }
    })

    obj_1.object3D.traverse( c=>{
        if ( c.isMesh && c.name == 'Part1'  ){
            window.c = c ;      
        }
    })
    
    obj_1.object3D.traverse( c=>{
        if ( c.isMesh && c.name == '01-21-0_triangles'  ){
            console.log(  c.id, c );
        }
    })

    obj_1.object3D.getObjectByName('01-22-0_triangles') 

    // 266  268
    
}

