

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
                        intensity: 1.8,
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
                            intensity: 0.6,
                            light_type: "directional",
                            shadow: "Soft",
                            shadow_strength: 1,
                            helper: false,
                            
                        }
                    },
                    // {
                    //     //// 平行光
                    //     main_type: 'light',
                    //     sub_type: "light",
                    //     generalAttr: {
                    //         logic: false,
                    //         active: true,
                    //         obj_id: "d_light_2", //// 必須為 場景內唯一
                    //         obj_name: "direct_light_1",
                    //         obj_type: "3d",
                    //         interactable: true,
                    //         obj_parent_id: ""
                    //     },
                    //     transformAttr: {
                    //         transform: [
                    //             "0,7.228968,2.956055",
                    //             "0.94,0,0,0.339",
                    //             "1,1,1"
                    //         ],
                    //         rect_transform: [],
                    //         simulated_rotation: "0,0,0"
                    //     },
                    //     typeAttr: {
                    //         color: "1,1,1",
                    //         intensity: 1,
                    //         light_type: "directional",
                    //         shadow: "Soft",
                    //         shadow_strength: 1,
                    //         helper: true,
                            
                    //     }
                    // },

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
                        res_url:'../resource/model/p2/elephant(無渲染A6).glb',
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
                            center: [ 0 , 0 , 0 ],
                            xyRaduis: 0.5,

                        },
                        //// 由於 此專案的材質為【 多數磁力片 相同顏色 】，故設計為【 材質類別 】 對應【 Mesh 名稱 】
                        cust_materials:[
                            //// 要隱藏的物件
                            {
                                id:'mHide', 
                                visible: false,
                                names:[ 
                                    '08-1','08-2',
                                    '29-1','29-2',
                                    '78_0','78_1',
                                    '80_0','80_1',

                                    '19-2','20-2','21-1',
                                ]
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
                                    '01-2','02-2','04-2','05-2','06-2','07-2',      ,'09-2','10-2',
                                    '11-2','12-2','14-2',      ,'16-2','17-2','18-2',
                                    '21-2','22-2','24-2','25-2','26-2','27-2','28-2',       '40-2',
                                    '41-2','42-2','44-2','45-2','46-2','47-2','48-1_0','49-2','50_0',
                                    '51-2','52-2','54_0','55-2','56-2','57-2','58-2','59-2','60-2',
                                    '61-2','62-2','64-2','65-2','66-2','67-2','68-2','69-2','70-2',
                                    '71-2','72_0','74_0','75_0','76-2',                     
                                    '81-2','82-2','84-2',

                                ]
                            },
                            //// 透明管 
                            { 
                                id:'trans_tube', 
                                trans: true, 
                                opacity: 0.5, 
                                color: [ 200, 200, 200], 
                                roughness: 0.2, 
                                metalness: 0.2,
                                depthWrite: false,
                                names:[
                                    '46-1','46-2',
                                    '45-1','45-2',
                                    '52-1','52-2',
                                          ,'21-2',
                                    '85-1','85-2',
                                    '86-1','86-2',
                                    '84-1','84-2',
                                    '82-1','82-2',
                                    '19-1',
                                    '20-1',
                                    

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
                                    '67-1','25-1','22-1','70-1',
                                    '16-1','17-1',
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
                                    '26-1','27-1','62-1','76-1',
                                    '57-1','24-1','44-1','40-1','42-1',
                                ]
                            },
                            //// 綠色磁力片 面 步驟二 大象上部 1 層
                            { 
                                id:'green_plane', 
                                trans: true, 
                                color: [ 15, 252, 82 ], 
                                opacity: 0.65, 
                                roughness: 0.5, 
                                metalness: 0.25,
                                depthWrite: false,
                                names:[
                                    '28-1','69-1','68-1','64-1',
                                    '65-1','66-1','41-1','18-1',
                                    '61-1',

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
                                    '51-1',
                                    '50_1','55-1','56-1','72_1',
                                    '47-1','49-1','71-1','48-1_1','74_1',
                                    '10-1','11-1','54_1','75_1',

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
                                    '01-1','02-1','04-1','05-1','07-1',
                                    '59-1','60-1',
                                    '14-1',
                                    '81-1',
                                ]
                            },
                            //// 白色磁力片 面 步驟六 小象 白色 
                            {
                                id:'white_plane', 
                                trans: true, 
                                color: [ 204, 204, 204 ], 
                                opacity: 0.5, 
                                roughness: 0.5, 
                                metalness: 0.15,
                                depthWrite: false,
                                names:[
                                    '12-1','58-1','06-1','09-1',
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
                                    '77_0',
                                    '80_0','79_0',
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
                                    '77_1',
                                    '79_1','80_1',
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
                        { o: 'obj_1', n:'71' },
                        { o: 'obj_1', n:'72' },
                        { o: 'obj_1', n:'74' },
                        { o: 'obj_1', n:'75' },
                        { o: 'obj_1', n:'76' },
                        { o: 'obj_1', n:'77' },
                        { o: 'obj_1', n:'78' },
                        { o: 'obj_1', n:'79' },
                        { o: 'obj_1', n:'80' },
                        { o: 'obj_1', n:'81' },
                        { o: 'obj_1', n:'82' },
                        { o: 'obj_1', n:'84' },
                        { o: 'obj_1', n:'85' },
                        { o: 'obj_1', n:'86' },
                        

                    ],
                    steps:[
                        {
                            id:'step_1', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 1',
                                en:'Step 1'
                            },
                            des:{
                                tw:'兩片著地，第二層蓋四面就不倒',
                                en:'Step description: 1 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '67', type: 'flyin'},
                                { obj_id: 'obj_1', name: '25', type: 'flyin'},
                                { obj_id: 'obj_1', name: '40', type: 'flyin'},
                                { obj_id: 'obj_1', name: '44', type: 'flyin'},
                                { obj_id: 'obj_1', name: '24', type: 'flyin'},
                                { obj_id: 'obj_1', name: '57', type: 'flyin'},

                                { obj_id: 'obj_1', name: '70', type: 'flyin'},
                                { obj_id: 'obj_1', name: '22', type: 'flyin'},
                                { obj_id: 'obj_1', name: '27', type: 'flyin'},
                                { obj_id: 'obj_1', name: '76', type: 'flyin'},
                                { obj_id: 'obj_1', name: '62', type: 'flyin'},
                                { obj_id: 'obj_1', name: '26', type: 'flyin'},

                            ],

                        },
                        {
                            id:'step_2', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 2',
                                en:'Step 2'
                            },
                            des:{
                                tw:'圓環扣住軌道頭尾，球不怕掉',
                                en:'Step description: 2 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '28', type: 'flyin'},
                                { obj_id: 'obj_1', name: '69', type: 'flyin'},
                                { obj_id: 'obj_1', name: '68', type: 'flyin'},
                                { obj_id: 'obj_1', name: '42', type: 'flyin'},
                                
                                { obj_id: 'obj_1', name: '66', type: 'flyin'},
                                { obj_id: 'obj_1', name: '65', type: 'flyin'},
                                { obj_id: 'obj_1', name: '64', type: 'flyin'},
                                { obj_id: 'obj_1', name: '18', type: 'flyin'},

                                { obj_id: 'obj_1', name: '41', type: 'flyin'},
                                { obj_id: 'obj_1', name: '46', type: 'flyin'},
                                { obj_id: 'obj_1', name: '52', type: 'flyin'},


                            ],
                            

                        },
                        {
                            id:'step_3', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 3',
                                en:'Step 3'
                            },
                            des:{
                                tw:'3段軌道，蓋出大象長鼻子',
                                en:'Step description: 3 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '51', type: 'flyin'},
                                { obj_id: 'obj_1', name: '82', type: 'flyin'},
                                
                            ],

                        },
                        {
                            id:'step_4', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 4',
                                en:'Step 4'
                            },
                            des:{
                                tw:'幫大象加頭、眼睛和耳朵',
                                en:'Step description: 4 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '50', type: 'flyin'},
                                { obj_id: 'obj_1', name: '49', type: 'flyin'},
                                { obj_id: 'obj_1', name: '74', type: 'flyin'},
                                { obj_id: 'obj_1', name: '72', type: 'flyin'},                                
                                { obj_id: 'obj_1', name: '47', type: 'flyin'},
                                { obj_id: 'obj_1', name: '71', type: 'flyin'},
                                { obj_id: 'obj_1', name: '48', type: 'flyin'},

                                { obj_id: 'obj_1', name: '56', type: 'flyin'},
                                { obj_id: 'obj_1', name: '77', type: 'flyin'},
                                // { obj_id: 'obj_1', name: '78', type: 'flyin'},
                                { obj_id: 'obj_1', name: '55', type: 'flyin'},
                            ],

                        },
                        {
                            id:'step_5', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 5',
                                en:'Step 5'
                            },
                            des:{
                                tw:'蓋小象，軌道當穩固磁力片的橋樑',
                                en:'Step description: 5 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '01', type: 'flyin'},
                                { obj_id: 'obj_1', name: '02', type: 'flyin'},
                                { obj_id: 'obj_1', name: '07', type: 'flyin'},
                                { obj_id: 'obj_1', name: '81', type: 'flyin'},
                                { obj_id: 'obj_1', name: '84', type: 'flyin'},
                                { obj_id: 'obj_1', name: '61', type: 'flyin'},
                                { obj_id: 'obj_1', name: '45', type: 'flyin'},

                            ],
                            // cameraAttr:{
                            //     p: [ 1.16, 4.51,  -6.80],
                            //     target:[ 0 , 0 , 0 ],
                            //     t: 1.5,
                            // }

                        },
                        {
                            id:'step_6', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 6',
                                en:'Step 6'
                            },
                            des:{
                                tw:'側邊貼上小腳和身體',
                                en:'Step description: 6 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '04', type: 'flyin'},
                                { obj_id: 'obj_1', name: '05', type: 'flyin'},
                                { obj_id: 'obj_1', name: '06', type: 'flyin'},
                                { obj_id: 'obj_1', name: '09', type: 'flyin'},

                                { obj_id: 'obj_1', name: '24', type: 'flyin'},
                                { obj_id: 'obj_1', name: '58', type: 'flyin'},
                                { obj_id: 'obj_1', name: '59', type: 'flyin'},
                                { obj_id: 'obj_1', name: '60', type: 'flyin'},
                                { obj_id: 'obj_1', name: '12', type: 'flyin'},
                                { obj_id: 'obj_1', name: '44', type: 'flyin'},


                            ],
                            cameraAttr:{
                                p: [ 6.94 , 3.08 , -7.79 ],
                                target:[ -1.05 , 2.68 , 1.3 ],
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
                                tw:'幫小象加頭、眼睛和耳朵',
                                en:'Step description: 7 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '54', type: 'flyin'},
                                { obj_id: 'obj_1', name: '75', type: 'flyin'},
                                { obj_id: 'obj_1', name: '10', type: 'flyin'},
                                { obj_id: 'obj_1', name: '11', type: 'flyin'},
                                { obj_id: 'obj_1', name: '79', type: 'flyin'},
                                // { obj_id: 'obj_1', name: '80', type: 'flyin'},
                                


                            ],

                        },
                        {
                            id:'step_8', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 8',
                                en:'Step 8'
                            },
                            des:{
                                tw:'把4段軌道接好再一起扣到大小象身上',
                                en:'Step description: 8 ',
                            },
                            scene_id:'s1',
                            obj_id: 'obj_1',
                            show_objs: [
                                { obj_id: 'obj_1', name: '82', type: 'flyin'},
                                { obj_id: 'obj_1', name: '14', type: 'flyin'},
                                { obj_id: 'obj_1', name: '19', type: 'flyin'},
                                { obj_id: 'obj_1', name: '16', type: 'flyin'},
                                { obj_id: 'obj_1', name: '20', type: 'flyin'},
                                { obj_id: 'obj_1', name: '15', type: 'flyin'},
                                { obj_id: 'obj_1', name: '17', type: 'flyin'},
                                { obj_id: 'obj_1', name: '21', type: 'flyin'},
                                { obj_id: 'obj_1', name: '85', type: 'flyin'},

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
    
    i = 0;
    obj_1.object3D.traverse( (c )=>{
        if ( c.type == 'Mesh'){
            i++;
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

