

let projData = {
    proj_id: "p1",
    name: {
        tw: "專案 天鵝 1",
        en: "Project swan 1"
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
                        position:[ -7.52 , 6.33 , -2.26 ],
                        target: [ 0.5 , 2.74 , 0.23 ],
                    },
                    ambientLight:{
                        intensity: 1.5 ,
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
                        res_url:'../resource/model/swan/天鵝(A3).glb',
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
                                    '01-2','02-2','04-2','05-2','06-2','07-2','08-2','09-2','10-2',
                                    '12-2','14-2','15-2','18-2','19-2','20-2','21-2','22-2','25-2',
                                    '26-2',
                                    '16-1_0','17-1_0',
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
                                    '12-1','12-2','11-1','11-2','15-1','15-2',
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
                                    '02-1','05-1','07-1',
                                    '08-1','25-1','26-1',
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
                                    '09-1','10-1',
                                ]
                            },
                            //// 紅色磁力片 面  
                            {
                                id:'red_plane', 
                                trans: true, 
                                color: [ 255, 30, 30 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                   '01-1','04-1','06-1',
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
                                    '211','241','251','221',
                                    '521','501','511','491',
                                    '711','781',
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
                                    '14-1','16-1_1','17-1_1',
                                    '18-1','19-1',
                                    '20-1','21-1','22-1',
                                ]
                            },
                            //// 粉紅色磁力片 面 
                            {
                                id:'pink_plane', 
                                trans: true, 
                                color: [ 240, 91, 91 ], 
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
                                roughness: 0.6, 
                                metalness: 0.3,
                                depthWrite: false,
                                names:[
                                    
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
                                    '24-1_0',
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
                                    '24-1_1',
                                ]
                            },

                        ],

                    },
                ],

                stepData:{
                    step_type:'mesh',
                    //// 要控制的所有物件，避免影響到 root 層級
                    controlChildrenNames:[
                        { o: 'obj_1', n:'01' },
                        { o: 'obj_1', n:'02' },
                        { o: 'obj_1', n:'03' },
                        { o: 'obj_1', n:'04' },
                        { o: 'obj_1', n:'05' },
                        { o: 'obj_1', n:'06' },
                        { o: 'obj_1', n:'07' },
                        { o: 'obj_1', n:'08' },
                        { o: 'obj_1', n:'09' },
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
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01', type: 'direct'},
                                { obj_id: 'obj_1', name: '02', type: 'direct'},
                                { obj_id: 'obj_1', name: '04', type: 'direct'},
                                { obj_id: 'obj_1', name: '05', type: 'direct'},
                                { obj_id: 'obj_1', name: '06', type: 'direct'},
                                { obj_id: 'obj_1', name: '07', type: 'direct'},

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
                                { obj_id: 'obj_1', name: '08', type: 'direct'},
                                { obj_id: 'obj_1', name: '09', type: 'direct'},
                                { obj_id: 'obj_1', name: '12', type: 'direct'},


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
                                { obj_id: 'obj_1', name: '10', type: 'direct'},
                                { obj_id: 'obj_1', name: '11', type: 'direct'},
                                
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
                                { obj_id: 'obj_1', name: '14', type: 'direct'},
                                { obj_id: 'obj_1', name: '15', type: 'direct'},

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
                                { obj_id: 'obj_1', name: '16', type: 'direct'},
                                { obj_id: 'obj_1', name: '17', type: 'direct'},
                                { obj_id: 'obj_1', name: '24', type: 'direct'},
                                
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
                                { obj_id: 'obj_1', name: '18', type: 'direct'},
                                { obj_id: 'obj_1', name: '19', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '20', type: 'direct'},
                                { obj_id: 'obj_1', name: '21', type: 'direct'},

                                { obj_id: 'obj_1', name: '22', type: 'direct'},
                                { obj_id: 'obj_1', name: '25', type: 'direct'},

                            ],

                        },
                        // {
                        //     id:'step_7', //// 必須為 專案內唯一
                        //     name:{
                        //         tw:'步驟 7',
                        //         en:'Step 7'
                        //     },
                        //     scene_id:'s1',
                        //     obj_id: 'obj_1',
                        //     show_objs: [
                        //         { obj_id: 'obj_1', name: '9', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '10', type: 'direct'},

                        //         { obj_id: 'obj_1', name: '39', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '58', type: 'direct'},
                                
                        //         { obj_id: 'obj_1', name: '62', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '63', type: 'direct'},


                        //     ],

                        // },
                        // {
                        //     id:'step_8', //// 必須為 專案內唯一
                        //     name:{
                        //         tw:'步驟 8',
                        //         en:'Step 8'
                        //     },
                        //     scene_id:'s1',
                        //     obj_id: 'obj_1',
                        //     show_objs: [
                        //         { obj_id: 'obj_1', name: '65', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '12', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '17', type: 'direct'},
                                
                        //         { obj_id: 'obj_1', name: '14', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '18', type: 'direct'},
                                
                        //         { obj_id: 'obj_1', name: '15', type: 'direct'},
                        //         { obj_id: 'obj_1', name: '13', type: 'direct'},
                     
                        //     ],

                        // },
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
        if ( c.isMesh && c.name == '25-1'  ){
            console.log(  c.id, c );
        }
    })

    // 266  268
    
}

