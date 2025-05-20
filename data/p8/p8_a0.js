

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
                        target: [ 1.47 , 1.57 , 0.8 ],
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
                        res_url:'../resource/model/forest/樹樂園(a2).glb',
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
                        //// 客製化 模型中心 與 希望涵蓋半徑
                        custModelAttr:{
                            center: [ 0.0 , 0.0 , 0 ],
                            xyRaduis: 0.3,

                        },
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
                                    '03-1-2','03-2-2','04-1-2','04-2-2',
                                    '01-2','02-2','04-2','05-2','06-2','07-2','08-2','09-2','10-2',
                                    '11-2','12-2','14-2','15-2','16-2','17-2','18-2','19-2','20-2',
                                    '21-0_0','22-0_0','24-0_0','25-2','26-2','27-2','28-2','29-2','40-2',
                                    '41-2','42-2','44-2','45-2','46-2','47-2','48-2','49-2','50-2',

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
                                    '04-1','07-1','01-1',
                                    
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
                                    '48-1','49-1','50-1',

                                ]
                            },
                            //// 綠色磁力片 面 
                            { 
                                id:'green_plane', 
                                trans: true, 
                                color: [ 15, 252, 82 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '25-1','26-1','28-1',
                                    '29-1','40-1','41-1',
                                    '42-4',
                                    '18-1','16-1','19-1',

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
                                    '46-1','47-1',
                                    
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
                                    '02-1','05-1','06-1',
                                    '08-1','09-1','10-1',
                                    '11-1','12-1','14-1',
                                    '27-1',
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
                                    '15-1','17-1','20-1',
                                    '22-0_1','21-0_1','24-0_1',
                                    '42-1',
                                    '44-1','45-1',
                                    '04-1-1',
                                    
                                ]
                            },
                            
                            //// 白色 眼睛
                            { 
                                id:'white_circle', 
                                trans: false, 
                                opacity: 1, 
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
                                opacity: 1, 
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
                        { o: 'obj_1', n:'01' },
                        { o: 'obj_1', n:'02' },
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
                        { o: 'obj_1', n:'24' },
                        { o: 'obj_1', n:'25' },
                        { o: 'obj_1', n:'26' },
                        { o: 'obj_1', n:'27' },
                        { o: 'obj_1', n:'28' },
                        { o: 'obj_1', n:'29' },
                        { o: 'obj_1', n:'40' },
                        { o: 'obj_1', n:'41' },
                        { o: 'obj_1', n:'42' },
                        { o: 'obj_1', n:'44' },
                        { o: 'obj_1', n:'45' },
                        { o: 'obj_1', n:'46' },
                        { o: 'obj_1', n:'47' },
                        { o: 'obj_1', n:'48' },
                        { o: 'obj_1', n:'49' },
                        { o: 'obj_1', n:'50' },
                        { o: 'obj_1', n:'04_1' },
                        { o: 'obj_1', n:'04_2' },
                        { o: 'obj_1', n:'03-1' },
                        { o: 'obj_1', n:'03-2' },
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
                            des:{
                                tw:'6個小三角，變出六邊型',
                                en:'Step description: 1',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01', type: 'flyin'},
                                { obj_id: 'obj_1', name: '02', type: 'flyin'},
                                { obj_id: 'obj_1', name: '04', type: 'flyin'},
                                { obj_id: 'obj_1', name: '05', type: 'flyin'},
                                { obj_id: 'obj_1', name: '06', type: 'flyin'},
                                { obj_id: 'obj_1', name: '07', type: 'flyin'},


                            ],

                        },
                        {
                            id:'step_2', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 2',
                                en:'Step 2'
                            },
                            des:{
                                tw:'往下加上厚度，樹幹長高啦',
                                en:'Step description: 2',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '08', type: 'flyin'},
                                { obj_id: 'obj_1', name: '09', type: 'flyin'},
                                { obj_id: 'obj_1', name: '10', type: 'flyin'},
                                { obj_id: 'obj_1', name: '11', type: 'flyin'},
                                { obj_id: 'obj_1', name: '12', type: 'flyin'},
                                { obj_id: 'obj_1', name: '14', type: 'flyin'},


                            ],
                            

                        },
                        {
                            id:'step_3', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 3',
                                en:'Step 3'
                            },
                            des:{
                                tw:'沿著線在樹幹上立6片樹葉',
                                en:'Step description: 3',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '15', type: 'flyin'},
                                { obj_id: 'obj_1', name: '19', type: 'flyin'},
                                { obj_id: 'obj_1', name: '20', type: 'flyin'},
                                { obj_id: 'obj_1', name: '18', type: 'flyin'},
                                
                                { obj_id: 'obj_1', name: '16', type: 'flyin'},
                                { obj_id: 'obj_1', name: '17', type: 'flyin'},
                                
                            ],

                        },
                        {
                            id:'step_4', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 4',
                                en:'Step 4'
                            },
                            des:{
                                tw:'第三層葉子記得錯開長',
                                en:'Step description: 4',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                // { obj_id: 'obj_1', name: '01-21-0_triangles', type: 'flyin'},
                                // { obj_id: 'obj_1', name: '01-22-0_triangles', type: 'flyin'},
                                // { obj_id: 'obj_1', name: '01-24-0_triangles', type: 'flyin'},

                                { obj_id: 'obj_1', name: '21', type: 'flyin'},
                                { obj_id: 'obj_1', name: '22', type: 'flyin'},
                                { obj_id: 'obj_1', name: '24', type: 'flyin'},


                            ],

                        },
                        {
                            id:'step_5', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 5',
                                en:'Step 5'
                            },
                            des:{
                                tw:'頭上放尖尖，大樹完成！',
                                en:'Step description: 5',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '25', type: 'flyin'},
                                { obj_id: 'obj_1', name: '26', type: 'flyin'},
                                { obj_id: 'obj_1', name: '27', type: 'flyin'},
                                { obj_id: 'obj_1', name: '28', type: 'flyin'},

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
                                tw:'小樹幹先蓋一個沒有底的盒子',
                                en:'Step description: 6',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '29', type: 'flyin'},
                                { obj_id: 'obj_1', name: '40', type: 'flyin'},
                                { obj_id: 'obj_1', name: '41', type: 'flyin'},
                                { obj_id: 'obj_1', name: '42', type: 'flyin'},

                            ],
                            cameraAttr:{
                                p: [ -9.34, 6.62,  -1.51],
                                target:[ 1.47 , 1.57 , 0.8 ],
                                t: 1,
                            }

                        },
                        {
                            id:'step_7', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 7',
                                en:'Step 7'
                            },
                            des:{
                                tw:'長出像尖屋頂的葉子',
                                en:'Step description: 7',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '44', type: 'flyin'},
                                { obj_id: 'obj_1', name: '45', type: 'flyin'},
                                { obj_id: 'obj_1', name: '46', type: 'flyin'},
                                { obj_id: 'obj_1', name: '47', type: 'flyin'},
                                

                            ],

                        },
                        {
                            id:'step_8', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 8',
                                en:'Step 8'
                            },
                            des:{
                                tw:'樹頂貼2片小三角並裝飾小配件',
                                en:'Step description: 8',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '03-1', type: 'flyin'},
                                { obj_id: 'obj_1', name: '03-2', type: 'flyin'},
                                { obj_id: 'obj_1', name: '04_1', type: 'flyin'},
                                { obj_id: 'obj_1', name: '04_2', type: 'flyin'},

                                { obj_id: 'obj_1', name: '48', type: 'flyin'},
                                { obj_id: 'obj_1', name: '49', type: 'flyin'},
                                { obj_id: 'obj_1', name: '50', type: 'flyin'},
                     
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
        if (  c.name == '04-1'  ){
            window.c = c ;      
        }
    })
    
    obj_1.object3D.traverse( c=>{
        if (  c.name == '04-2'  ){
            console.log(  c.id, c );
        }
    })

    obj_1.object3D.getObjectByName('01-22-0_triangles') 

    // 266  268
    
}

