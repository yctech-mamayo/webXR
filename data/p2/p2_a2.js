

let projData = {
    proj_id: "p2",
    name: {
        tw: "專案 大象 2",
        en: "Project elephant 2"
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
                        position:[ 4.87 , 7.68 , -8.01 ],
                        target: [ -1.05 , 2.68 , 1.30 ],
                    },
                    ambientLight:{
                        intensity: 1.5,
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
                                "0.247,0,0,0.968",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        typeAttr: {
                            color: "1,1,1",
                            intensity: 1,
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
                        // res_url:'/resource/model/p2/elephant(無渲染).glb',
                        res_url:'../resource/model/p2/elephant(無渲染A2-3).glb',
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
                            {
                                id:'mHide', 
                                visible: false,
                                names:[ '7-1','7-2','42-1','42-2','26-1',,'26-2','28-1','28-2' ]
                            },
                            //// 磁力片 磁鐵 金屬 棒
                            { 
                                id:'mag_stick', 
                                trans: false, 
                                opacity: 1, 
                                color: [20, 20, 20], 
                                roughness: 0.2, 
                                metalness: 1,
                                names:[
                                    '1-2','2-2',
                                    '3-1','4-1','5-1','8-1','9-1','10-1',
                                    '11-1',
                                    '12-2','14-2','15-2','16-2','20-1',

                                    '21-1','22-1','24-1','25-1','27-1','30-1',
                                    '33-1','34-1','35-1','36-1','37-2',
                                    '39-1','40-1',
                                    '41-1','43-1','44-1','45-1','46-2','47-1','48-1','49-1','50-1',
                                    '51-1','52-1','53-1','54-1','55-1','56-1','57-1','58-1','59-1','60-1',
                                    '61-1','62-1','63-1','68-1',
                                    '64-2',
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
                                    '19-1',
                                    '31-1','32-1','38-1',
                                    '66-1','67-1',
                                    '65-0','17-1','18-1','13-1'
                                ]
                            },
                            //// 紫色磁力片 面 步驟一 大象底部兩層
                            {
                                id:'purple_plane', 
                                trans: true, 
                                color: [ 135, 52, 237 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '20-2','54-2',
                                    '22-2','51-2',
                                    '14-1','15-1',
                                ]
                            },
                            //// 藍色磁力片 面 步驟一 大象第二層
                            {
                                id:'blue_plane', 
                                trans: true, 
                                color: [ 31 , 28 , 217 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '24-2','59-2','47-2',
                                    '21-2','30-2','27-2',
                                ]
                            },
                            //// 綠色磁力片 面 步驟二 大象上部 1 層
                            { 
                                id:'green_plane', 
                                trans: true, 
                                color: [ 40 , 199 , 199 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '25-2','52-2','53-2','16-2','29-2','50-2','49-2','48-2',
                                    '46-1',
                                    '16-1','29-1',
                                ]
                            },
                            //// 黃色磁力片 面 步驟三、四、七 大小象 上方 
                            {
                                id:'yallow_plane', 
                                trans: true, 
                                color: [ 247, 156, 27 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '37-1','56-2','33-2','34-2','57-2','35-2','36-2','41-2','40-2','55-2',
                                    '39-2','58-2','9-2','10-2',
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
                                    '1-1','2-1','64-1','68-1',
                                    '12-1',
                                    '3-2','4-2','44-2','45-2'
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
                                    '8-2','5-2','11-2','43-2',
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
                                    '60-1','61-1',
                                    '62-1','63-1',
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
                                    '60-2','61-2',
                                    '63-2','62-2',
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
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '20', type: 'direct'},
                                { obj_id: 'obj_1', name: '54', type: 'direct'},
                                { obj_id: 'obj_1', name: '51', type: 'direct'},
                                { obj_id: 'obj_1', name: '22', type: 'direct'},

                                { obj_id: 'obj_1', name: '24', type: 'direct'},
                                { obj_id: 'obj_1', name: '47', type: 'direct'},
                                { obj_id: 'obj_1', name: '59', type: 'direct'},

                                { obj_id: 'obj_1', name: '27', type: 'direct'},
                                { obj_id: 'obj_1', name: '21', type: 'direct'},
                                { obj_id: 'obj_1', name: '30', type: 'direct'},

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
                                { obj_id: 'obj_1', name: '16', type: 'direct'},
                                { obj_id: 'obj_1', name: '25', type: 'direct'},
                                { obj_id: 'obj_1', name: '48', type: 'direct'},
                                { obj_id: 'obj_1', name: '49', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '50', type: 'direct'},
                                { obj_id: 'obj_1', name: '52', type: 'direct'},
                                { obj_id: 'obj_1', name: '53', type: 'direct'},
                                { obj_id: 'obj_1', name: '29', type: 'direct'},

                                { obj_id: 'obj_1', name: '31', type: 'direct'},
                                { obj_id: 'obj_1', name: '32', type: 'direct'},


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
                                { obj_id: 'obj_1', name: '38', type: 'direct'},
                                { obj_id: 'obj_1', name: '37', type: 'direct'},
                                
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
                                { obj_id: 'obj_1', name: '40', type: 'direct'},
                                { obj_id: 'obj_1', name: '41', type: 'direct'},

                                { obj_id: 'obj_1', name: '34', type: 'direct'},
                                { obj_id: 'obj_1', name: '57', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '33', type: 'direct'},
                                { obj_id: 'obj_1', name: '35', type: 'direct'},

                                { obj_id: 'obj_1', name: '36', type: 'direct'},
                                { obj_id: 'obj_1', name: '56', type: 'direct'},

                                { obj_id: 'obj_1', name: '60', type: 'direct'},
                                { obj_id: 'obj_1', name: '61', type: 'direct'},

                                { obj_id: 'obj_1', name: '55', type: 'direct'},
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
                                { obj_id: 'obj_1', name: '1', type: 'direct'},
                                { obj_id: 'obj_1', name: '2', type: 'direct'},
                                { obj_id: 'obj_1', name: '19', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '66', type: 'direct'},
                                { obj_id: 'obj_1', name: '64', type: 'direct'},
                                { obj_id: 'obj_1', name: '67', type: 'direct'},
                                { obj_id: 'obj_1', name: '68', type: 'direct'},
                                { obj_id: 'obj_1', name: '46', type: 'direct'},
                            ],
                            cameraAttr:{
                                p: [ 1.16, 4.51,  -6.80],
                                target:[ 0 , 0 , 0 ],
                                t: 1,
                            }

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
                                { obj_id: 'obj_1', name: '8', type: 'direct'},
                                { obj_id: 'obj_1', name: '5', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '11', type: 'direct'},
                                { obj_id: 'obj_1', name: '43', type: 'direct'},

                                { obj_id: 'obj_1', name: '3', type: 'direct'},
                                { obj_id: 'obj_1', name: '4', type: 'direct'},

                                { obj_id: 'obj_1', name: '44', type: 'direct'},
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
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '9', type: 'direct'},
                                { obj_id: 'obj_1', name: '10', type: 'direct'},

                                { obj_id: 'obj_1', name: '39', type: 'direct'},
                                { obj_id: 'obj_1', name: '58', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '62', type: 'direct'},
                                { obj_id: 'obj_1', name: '63', type: 'direct'},


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
                                { obj_id: 'obj_1', name: '65', type: 'direct'},
                                { obj_id: 'obj_1', name: '12', type: 'direct'},
                                { obj_id: 'obj_1', name: '17', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '14', type: 'direct'},
                                { obj_id: 'obj_1', name: '18', type: 'direct'},
                                
                                { obj_id: 'obj_1', name: '15', type: 'direct'},
                                { obj_id: 'obj_1', name: '13', type: 'direct'},
                     
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
        if ( c.name != '' ){
            if ( names.includes( c.name ) ){
                console.log( '重複名稱:', c.name , c );
            }else{
                names.push( c.name );
            }
        }
    })
    
    obj_1.object3D.traverse( (c,i)=>{
        if ( c.type == 'Mesh'){
            console.log('M:', c.name );
        }
        if ( c.type == 'Object3D'){
            console.log('O:', c.name );
        }
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

