

let projData = {
    proj_id: "p4",
    name: {
        tw: "專案 趣味滾球 4",
        en: "Project rocket 4"
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
                        // res_url: '../resource/sky/VR01.jpg',
                        color: '#ffffff',
                    },
                    oCameraInfo:{
                        position:[ 2.82 , 6.15 , 12.03 ],
                        target: [ -0.359 , 4.05 , -1.10 ],
                    },
                    ambientLight:{
                        intensity: 1.7 ,
                    },
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
                                "0.247,0,0,0.968",
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
                        res_url:'../resource/model/rollball/趣味滾球(a0).glb',
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
                                "0 , 1.35 , 0",
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
                                    '1-2','2-2','4-2','5-2','6-2','7-2','8-2','9-2','10-2',
                                    '11-2','12-2','14-2','15-2','16-2','17-2','18-2','19-2','20-2',
                                    '21-2','22-2','24-2','25-2','26-2','27-2','28-2','29-2','40-2',
                                    '41-2','42-2','44-2','45-2','46-2','47-2','48-2','49-2','50-2',
                                    '51-2','52-2','54-2','55-2','56-2','57-2','58-2','59-2','60-2',
                                    '61-2','62-2','64-2','65-2','66-2','67-2','68-2','69-2',


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
                                    '54-1','55-1',
                                    '57-1','58-1','59-1','60-1','61-1',

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
                                    '45-1','46-1','47-1',
                                    '48-1','49-1','50-1','51-1','52-1',
                                    '66-1','67-1',

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
                                    '1-1','4-1','5-1','7-1','8-1','9-1',
                                    '26-1','27-1','28-1',
                                    '64-1',

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
                                    '11-1','12-1','14-1',
                                    '15-1','16-1',

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
                                    '20-1','21-1','22-1','24-1','25-1',
                                    '56-1',

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
                                    '17-1','18-1','19-1',
                                    '29-1','40-1','41-1','42-1','44-1',
                                    '62-1','65-1',

                                ]
                            },
                            //// 粉紅色磁力片 面 步驟五 六 小象 粉紅色 
                            {
                                id:'pink_plane', 
                                trans: true, 
                                color: [ 240, 91, 91 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '68-1','69-1',
                                ]
                            },
                            //// 白色磁力片 面 步驟六 小象 白色 
                            {
                                id:'white_plane', 
                                trans: true, 
                                color: [ 204, 204, 204 ], 
                                opacity: 0.5, 
                                roughness: 0.6, 
                                metalness: 0.3,
                                depthWrite: false,
                                names:[
                                    '2-1','6-1','10-1',
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
                        { o: 'obj_1', n:'1' },
                        { o: 'obj_1', n:'2' },
                        { o: 'obj_1', n:'3' },
                        { o: 'obj_1', n:'4' },
                        { o: 'obj_1', n:'5' },
                        { o: 'obj_1', n:'6' },
                        { o: 'obj_1', n:'7' },
                        { o: 'obj_1', n:'8' },
                        { o: 'obj_1', n:'9' },
                        { o: 'obj_1', n:'10' },
                        { o: 'obj_1', n:'11' },
                        { o: 'obj_1', n:'12' },
                        { o: 'obj_1', n:'13' },
                        { o: 'obj_1', n:'14' },
                        { o: 'obj_1', n:'15' },
                        { o: 'obj_1', n:'16' },
                        { o: 'obj_1', n:'17' },
                        { o: 'obj_1', n:'18' },
                        { o: 'obj_1', n:'19' },
                        { o: 'obj_1', n:'20' },
                        { o: 'obj_1', n:'21' },
                        { o: 'obj_1', n:'22' },
                        { o: 'obj_1', n:'23' },
                        { o: 'obj_1', n:'24' },
                        { o: 'obj_1', n:'25' },
                        { o: 'obj_1', n:'26' },
                        { o: 'obj_1', n:'27' },
                        { o: 'obj_1', n:'28' },
                        { o: 'obj_1', n:'29' },
                        { o: 'obj_1', n:'30' },
                        { o: 'obj_1', n:'31' },
                        { o: 'obj_1', n:'32' },
                        { o: 'obj_1', n:'33' },
                        { o: 'obj_1', n:'34' },
                        { o: 'obj_1', n:'35' },
                        { o: 'obj_1', n:'36' },
                        { o: 'obj_1', n:'37' },
                        { o: 'obj_1', n:'38' },
                        { o: 'obj_1', n:'39' },
                        { o: 'obj_1', n:'40' },
                        { o: 'obj_1', n:'41' },
                        { o: 'obj_1', n:'42' },
                        { o: 'obj_1', n:'43' },
                        { o: 'obj_1', n:'44' },
                        { o: 'obj_1', n:'45' },
                        { o: 'obj_1', n:'46' },
                        { o: 'obj_1', n:'47' },
                        { o: 'obj_1', n:'48' },
                        { o: 'obj_1', n:'49' },
                        { o: 'obj_1', n:'50' },
                        { o: 'obj_1', n:'51' },
                        { o: 'obj_1', n:'52' },
                        { o: 'obj_1', n:'53' },
                        { o: 'obj_1', n:'54' },
                        { o: 'obj_1', n:'55' },
                        { o: 'obj_1', n:'56' },
                        { o: 'obj_1', n:'57' },
                        { o: 'obj_1', n:'58' },
                        { o: 'obj_1', n:'59' },
                        { o: 'obj_1', n:'60' },
                        { o: 'obj_1', n:'61' },
                        { o: 'obj_1', n:'62' },
                        { o: 'obj_1', n:'63' },
                        { o: 'obj_1', n:'64' },
                        { o: 'obj_1', n:'65' },
                        { o: 'obj_1', n:'66' },
                        { o: 'obj_1', n:'67' },
                        { o: 'obj_1', n:'68' },
                        { o: 'obj_1', n:'69' },
                        { o: 'obj_1', n:'70' },

                    ],
                    steps:[
                        {
                            id:'step_1', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 1',
                                en:'Step 1'
                            },
                            des:{
                                tw:'步驟說明: 1 的說明',
                                en:'Step description: 1 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '1', type: 'direct'},
                                { obj_id: 'obj_1', name: '2', type: 'direct'},
                                { obj_id: 'obj_1', name: '4', type: 'direct'},
                                { obj_id: 'obj_1', name: '5', type: 'direct'},

                                { obj_id: 'obj_1', name: '6', type: 'direct'},
                                { obj_id: 'obj_1', name: '7', type: 'direct'},
                                { obj_id: 'obj_1', name: '8', type: 'direct'},
                                { obj_id: 'obj_1', name: '9', type: 'direct'},
                                { obj_id: 'obj_1', name: '10', type: 'direct'},
                                

                            ],

                        },
                        {
                            id:'step_2', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 2',
                                en:'Step 2'
                            },
                            des:{
                                tw:'步驟說明: 2 的說明',
                                en:'Step description: 2 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '11', type: 'direct'},
                                { obj_id: 'obj_1', name: '12', type: 'direct'},
                                { obj_id: 'obj_1', name: '14', type: 'direct'},
                                

                            ],
                            

                        },
                        {
                            id:'step_3', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 3',
                                en:'Step 3'
                            },
                            des:{
                                tw:'步驟說明: 3 的說明',
                                en:'Step description: 3 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '15', type: 'direct'},
                                { obj_id: 'obj_1', name: '16', type: 'direct'},
                                
                            ],

                        },
                        {
                            id:'step_4', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 4',
                                en:'Step 4'
                            },
                            des:{
                                tw:'步驟說明: 4 的說明',
                                en:'Step description: 4 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '17', type: 'direct'},
                                { obj_id: 'obj_1', name: '18', type: 'direct'},
                                { obj_id: 'obj_1', name: '19', type: 'direct'},
                                
                            ],

                        },
                        {
                            id:'step_5', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 5',
                                en:'Step 5'
                            },
                            des:{
                                tw:'步驟說明: 5 的說明',
                                en:'Step description: 5 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '20', type: 'direct'},
                                { obj_id: 'obj_1', name: '21', type: 'direct'},
                                { obj_id: 'obj_1', name: '22', type: 'direct'},
                                { obj_id: 'obj_1', name: '24', type: 'direct'},
                                { obj_id: 'obj_1', name: '25', type: 'direct'},

                                { obj_id: 'obj_1', name: '26', type: 'direct'},
                                { obj_id: 'obj_1', name: '27', type: 'direct'},
                                { obj_id: 'obj_1', name: '28', type: 'direct'},

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
                            des:{
                                tw:'步驟說明: 6 的說明',
                                en:'Step description: 6 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '41', type: 'direct'},
                                { obj_id: 'obj_1', name: '42', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '44', type: 'direct'},

                                { obj_id: 'obj_1', name: '29', type: 'direct'},
                                { obj_id: 'obj_1', name: '40', type: 'direct'},

                                { obj_id: 'obj_1', name: '47', type: 'direct'},
                                { obj_id: 'obj_1', name: '45', type: 'direct'},
                                { obj_id: 'obj_1', name: '46', type: 'direct'},

                            ],

                        },
                        {
                            id:'step_7', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 7',
                                en:'Step 7'
                            },
                            des:{
                                tw:'步驟說明: 7 的說明',
                                en:'Step description: 7 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '50', type: 'direct'},
                                { obj_id: 'obj_1', name: '51', type: 'direct'},
                                { obj_id: 'obj_1', name: '52', type: 'direct'},

                                { obj_id: 'obj_1', name: '48', type: 'direct'},
                                { obj_id: 'obj_1', name: '49', type: 'direct'},

                                { obj_id: 'obj_1', name: '54', type: 'direct'},
                                { obj_id: 'obj_1', name: '55', type: 'direct'},
                                { obj_id: 'obj_1', name: '56', type: 'direct'},


                            ],

                        },
                        {
                            id:'step_8', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 8',
                                en:'Step 8'
                            },
                            des:{
                                tw:'步驟說明: 8 的說明',
                                en:'Step description: 8 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '58', type: 'direct'},
                                { obj_id: 'obj_1', name: '59', type: 'direct'},
                                { obj_id: 'obj_1', name: '60', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '57', type: 'direct'},
                                { obj_id: 'obj_1', name: '61', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '62', type: 'direct'},
                                { obj_id: 'obj_1', name: '64', type: 'direct'},
                                { obj_id: 'obj_1', name: '65', type: 'direct'},
                     
                            ],

                        },
                        {
                            id:'step_9', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 9',
                                en:'Step 9'
                            },
                            des:{
                                tw:'步驟說明: 9 的說明',
                                en:'Step description: 9 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '66', type: 'direct'},
                                { obj_id: 'obj_1', name: '67', type: 'direct'},
                                { obj_id: 'obj_1', name: '68', type: 'direct'},
                                { obj_id: 'obj_1', name: '69', type: 'direct'},

                            ],

                        },
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
        if ( c.isMesh && c.name == '50-1'  ){
            console.log(  c.id, c );
        }
    })

    // 266  268
    
}

