

let projData = {
    proj_id: "p1",
    name: {
        tw: "專案 火車 6",
        en: "Project train 6"
    },

    //// 以下為 MAKAR 基底資料 原則上不使用。 但因為使用引擎的關係，所以必須要有。
    makarUserData:{
        oneProjData: {
            proj_id: "541820ff-3a92-470f-96f2-189dc0ca0fa2",
            proj_name: "火車",
            proj_type: "ar",
            proj_descr: "遊戲說明：\n「遊戲計時1分鐘，透過「點擊雨滴」方式，防止降雨量持續增高，幫助小山度過這場危機吧！\n\n新北市土石流守護神：\nhttps://lin.ee/bETMrJb\r",
            user_id: "a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5",
            shared_id: "agriculture.ntpc",
            name: "agriculture",
            head_pic: "",
            proj_platform: [
                "app",
                "web"
            ],
            snapshot_url: "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/ProjectSnapshot/9e3921fa2e864b0285a7ce7002a0e2f4_snapshot.jpg",
            proj_cover_urls: [],
            create_date: "2025-03-17T12:54:21.951Z",
            last_update_date: "2025-04-01T12:15:36.765Z",
            proj_size: "245936883",
            permission: 2,
            permission_friend: [],
            tags: [],
            category: [
                "NaturalScience"
            ],
            module_type: [],
            xml_urls: [
                "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/XML/37570236e7e243d4a9e58ec169d5e33e.xml",
                "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/XML/4bc2e559e10f4525923ffd74f06cb954.xml",
                "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/XML/a820abc1120d42afbf9383ab3ca75e8e.xml"
            ],
            loc: [],
            target_ids: [
                "00000006-7dd5-4b24-8fb0-fb774ba6d8c6",
            ],
            use_gyro_instead_slam: false,
            show_target: true,
            editor_license_key: "",
            editor_ver: "3.5.3.4",
            default_resolution: "720,1280",
            orientation: [
                {
                    "type": 9,
                    "title": "9:16",
                    "width": 720,
                    "height": 1280,
                    "platform": 0
                }
            ]
        },
        targetList: [
            
            {
                target_id: "00000006-7dd5-4b24-8fb0-fb774ba6d8c6",
                gcss_url: "../resource/ARtarget/train.gcss",
                image_url: "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/ImageTarget/118e23394f0a454e9e6b36b63812cae3_256.jpg"
            },
            
        ],
        onlineResourcesList: [
            {
                "res_id": "672bb9116b0b1bc81266da0fba3990e5",
                "res_name": "Button_Caveat",
                "res_url": "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/OnlineResource/Models/223ddb6994f440378f35b1350c51922bf43171c2430346beb94f03cd6853e91b.glb",
                "main_type": "model",
                "sub_type": "glb",
                "size": "48704 bytes",
                "default_shader_name": "Unlit/Color",
                "has_anim": false
            }
        ],
        userOnlineResDict: {
            "672bb9116b0b1bc81266da0fba3990e5": {
                res_id: "672bb9116b0b1bc81266da0fba3990e5",
                res_name: "Button_Caveat",
                res_url: "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/OnlineResource/Models/223ddb6994f440378f35b1350c51922bf43171c2430346beb94f03cd6853e91b.glb",
                main_type: "model",
                sub_type: "glb",
                size: "48704 bytes",
                default_shader_name: "Unlit/Color",
                has_anim: false
            },
            //// 客製化 直接指定類型 位址 
            "00000006-2fe3-4a05-b7ba-5dade414cadc":{
                res_id: "00000006-2fe3-4a05-b7ba-5dade414cadc",
                res_name: "elephant",
                res_url: "../resource/model/train/火車(A0).glb",
                main_type: "model",
                sub_type: "glb",
                size: "48704 bytes",
                default_shader_name: "standard",
                has_anim: false
            }
        },
        resourcesList: [
        ],
        userProjResDict: {
        },
        scenesData: {
            project_id: "541820ff-3a92-470f-96f2-189dc0ca0fa2",
            editor_ver: "3.5.3.4",
            proj_type: "ar",
            module_type: [],
            scenes: [
                {
                    info: {
                        id: "d7abbd10-5796-4c70-8054-e83cbbebf567",
                        name: "Untitled 1",
                        size: 395345,
                        type: "ar"
                    },
                    objs: [
                        {
                            //// 平行光
                            res_id: "Light",
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
                            materialAttr: {
                                // materials:[],
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
                                intensity: 1.0 ,
                                light_type: "directional",
                                shadow: "Soft",
                                shadow_strength: 1,
                                helper: false,
                                
                            }
                        },
                        {
                            //// 客製化 直接指定類型 位址 
                            behav:[{type:'showData'}],
                            //// 素材 id 要回歸 素材字典 尋找
                            res_id: "00000006-2fe3-4a05-b7ba-5dade414cadc", 
                            typeAttr: {
                                render_queue: 3000
                            },
                            blocklyAttr: {
                                uid: "",
                                reference: false
                            },
                            generalAttr: {
                                logic: false,
                                active: true,
                                isFold: false,
                                obj_id: "obj_1", //// 必須為 專案內 唯一
                                obj_name: "火車",
                                obj_type: "3d",
                                interactable: true,
                                obj_parent_id: ""
                            },
                            materialAttr: {
                                // materials:[],
                            },
                            animationAttr: [],
                            transformAttr: {
                                "transform": [
                                    "0,0,0",
                                    "0,0,0,1",
                                    "6,6,6"
                                ],
                                "rect_transform": [
                                    {
                                        "scale": "1,1,1",
                                        "position": "0,2.191781,1",
                                        "rotation": "0,0,0,1",
                                        "size_delta": "483.7534,122.9178",
                                        "simulated_rotation": "0,0,0"
                                    }
                                ],
                                "simulated_rotation": "0,0,0"
                            },
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
                                        '01-2','Pad202-2','06-2','07-2',                                    
                                        '05-2','09-2','04-2','08-2',
                                        '27-2','26-2','24-2','25-2',
    
                                        '10-2','11-2','12-2','14-2',
                                        '17-2','18-2','21-2','22-2',
    
                                        '15-2','16-2','19-2','20-2',
                                        '28-2','29-2',
                                        '40-2','41-2','42-2','44-2',
                                        '45-2','46-2','47-2','48-2',
    
                                        '49-2','50-2','51-2','52-2','54-2','55-2',
                                        '56-2','57-2','58-2','59-2','60-2','61-2',
                                        '62-2','64-2','65-2','66-2','67-2','68-2',
    
                                        '69-1','70-2','71-0_0','72-0_0',
                                        '74-2','75-2','76-2','77-2',
                                        '78-2','79-2','80-2','81-2',
    
                                    ]
                                },
                                //// 透明管 
                                // { 
                                //     id:'trans_tube', 
                                //     trans: true, 
                                //     opacity: 0.5, 
                                //     color: [235, 235, 235], 
                                //     roughness: 0.2, 
                                //     metalness: 0.1,
                                //     depthWrite: false,
                                //     names:[
                                //         '19-1',
                                //         '31-1','32-1','38-1',
                                //         '66-1','67-1',
                                //         '65-0','17-1','18-1','13-1'
                                //     ]
                                // },
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
                                        '01-1','02-1','06-1','07-1',
                                        '29-1','41-1',
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
                                        '04-1','05-1','08-1','09-1',
                                        '45-1','46-1','47-1','48-1',
                                        '76-1','75-1','79-1','81-1',
    
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
                                        '55-4',
                                        '62-1','64-1','65-1','66-1',
                                        '67-1','68-1',
                                        '74-1','77-1','78-1','80-1',
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
                                        '49-1','50-1','51-1','52-1',
                                        '59-1','61-1',
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
                                        '10-1','11-1','21-1','22-1',
                                        '15-1','16-1',
                                    ]
                                },
                                //// 黃色磁力片 面  
                                {
                                    id:'yallow_plane', 
                                    trans: true, 
                                    color: [ 247, 156, 27 ], 
                                    opacity: 0.65, 
                                    roughness: 0.5, 
                                    metalness: 0.25,
                                    depthWrite: false,
                                    names:[
                                        '12-1','14-1','18-1','17-1',
                                        '19-1','20-1',
                                        '72-0_1',
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
                                        '26-1','27-1','24-1','25-1',
                                        '54-4',
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
                                        '40-1','42-1','28-1','44-1',
                                        '54-1','55-1',
                                        '57-1','56-1',
                                        '60-1','58-1',
                                        '71-0_1','69-2','70-2'
                                    ]
                                },
                                
                                // //// 白色 眼睛
                                // { 
                                //     id:'white_circle', 
                                //     trans: false, 
                                //     opacity: 0.5, 
                                //     color: [ 250, 250, 250 ], 
                                //     roughness: 0.5, 
                                //     metalness: 0.5,
                                //     names:[
                                //         '60-1','61-1',
                                //         '62-1','63-1',
                                //     ]
                                // },
                                // //// 黑色 眼睛
                                // { 
                                //     id:'black_circle', 
                                //     trans: false, 
                                //     opacity: 0.5, 
                                //     color: [ 20, 20, 20 ], 
                                //     roughness: 0.5, 
                                //     metalness: 0.5,
                                //     names:[
                                //         '60-2','61-2',
                                //         '63-2','62-2',
                                //     ]
                                // },
    
                            ],

                        }
                    ],
                    behav: [
                        // {
                        //     "url": "https://webxr.makerar.com/project-info/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/2e0dd925-6fc3-4d5a-a0b4-4945299fdd55",
                        //     "delay": true,
                        //     "background": false,
                        //     "behav_type": "URL",
                        //     "trigger_type": "Click",
                        //     "trigger_obj_id": "9e446da9f96c497785f7a6f34968e1a9"
                        // }
                    ],
                    bezier: [],
                    xml_url: "https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/a8b05d24-e6ea-4d4f-a8f0-f6a3f41c90b5/XML/4bc2e559e10f4525923ffd74f06cb954.xml",
                    target_ids: [
                        "00000006-7dd5-4b24-8fb0-fb774ba6d8c6"
                    ],
                    environment: {
                        shader: "Skybox/Panoramic",
                        ground_shadow: true,
                        ground_shadow_color: "0,0,0,0.6",
                        scene_skybox_res_id: "",
                        scene_skybox_snapshot_1024: "",
                        scene_skybox_snapshot_2048: "",
                        scene_skybox_snapshot_4096: "",
                        ambientLight:{
                            intensity: 1.7 ,
                        }
                    },
                    material_ids: []
                }
                
            ]
        },
        materials: [],
        userMaterialDict: {}
    }

}

console.log('p1.js: _projData', projData);

export default projData;
