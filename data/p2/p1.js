

let projData = {
    proj_id: "p1",
    name: {
        tw: "專案 1",
        en: "Project 1"
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
                        res_url: '/resource/sky/gray2.jpg',
                    }
                },
                objs: [
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Circle.glb',
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
                                "-4,1.5,6",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Circle.glb',
                        generalAttr: {
                            logic: false,
                            active: true,
                            obj_id: "obj_2", //// 必須為 場景內唯一
                            obj_name: "step_1_c_2",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "-4,1.5,4",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Circle.glb',
                        generalAttr: {
                            logic: false,
                            active: true,
                            obj_id: "obj_3", //// 必須為 場景內唯一
                            obj_name: "step_1_c_2",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "-4,1.5,2",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Rectangle.glb',
                        generalAttr: {
                            logic: false,
                            active: false,
                            obj_id: "obj_4", //// 必須為 場景內唯一
                            obj_name: "Rectangle",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "-2,1.5,6",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Rectangle.glb',
                        generalAttr: {
                            logic: false,
                            active: false,
                            obj_id: "obj_5", //// 必須為 場景內唯一
                            obj_name: "Rectangle",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "-2,1.5,4",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Square.glb',
                        generalAttr: {
                            logic: false,
                            active: false,
                            obj_id: "obj_6", //// 必須為 場景內唯一
                            obj_name: "Square",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "0,1.5,6",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                    {
                        main_type: 'model',
                        sub_type:'glb',
                        res_url:'/resource/model/default/Square.glb',
                        generalAttr: {
                            logic: false,
                            active: false,
                            obj_id: "obj_7", //// 必須為 場景內唯一
                            obj_name: "Square",
                            obj_type: "3d",
                            interactable: true,
                            obj_parent_id: ""
                        },
                        transformAttr: {
                            transform: [
                                "0,1.5,4",
                                "0,0,0,1",
                                "1,1,1"
                            ],
                            rect_transform: [],
                            simulated_rotation: "0,0,0"
                        },
                        materialAttr:{},

                    },
                ],

                //// 步驟資訊運作
                stepData:{
                    step_type:'model',
                    steps:[
                        {
                            id:'step_1', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 1',
                                en:'Step 1'
                            },
                            scene_id:'s1',
                            show_objs:[
                                {
                                    id: "obj_1",
                                    type: "direct",
                                },
                                {
                                    id: "obj_2",
                                    type: "direct",
                                },
                                {
                                    id: "obj_3",
                                    type: "direct",
                                },
                            ]
                        },
                        {
                            id:'step_2', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 2',
                                en:'Step 2'
                            },
                            scene_id:'s1',
                            show_objs:[
                                {
                                    id: "obj_1",
                                    type: "direct",
                                },
                                {
                                    id: "obj_2",
                                    type: "direct",
                                },
                                {
                                    id: "obj_3",
                                    type: "direct",
                                },
                                {
                                    id: "obj_4",
                                    type: "direct",
                                },
                                {
                                    id: "obj_5",
                                    type: "direct",
                                },
                            ]
                        },
                        {
                            id:'step_3', //// 必須為 專案內唯一
                            name:{
                                tw:'步驟 3',
                                en:'Step 3'
                            },
                            scene_id:'s1',
                            show_objs:[
                                {
                                    id: "obj_1",
                                    type: "direct",
                                },
                                {
                                    id: "obj_2",
                                    type: "direct",
                                },
                                {
                                    id: "obj_3",
                                    type: "direct",
                                },
                                {
                                    id: "obj_4",
                                    type: "direct",
                                },
                                {
                                    id: "obj_5",
                                    type: "direct",
                                },
                                {
                                    id: "obj_6",
                                    type: "direct",
                                },
                                {
                                    id: "obj_7",
                                    type: "direct",
                                },
                            ]
                        }
                    ]
                },
                
            }
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

console.log('p1.js: _projData', projData);

export default projData;
