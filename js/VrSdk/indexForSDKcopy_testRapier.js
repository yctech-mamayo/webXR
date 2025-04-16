// import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import RAPIER from '@dimforge/rapier3d-compat'


//// rapier example source: https://sbedit.net/f06b5aef06fb48c2777501f643dfa21f765c9485
class RapierDebugRenderer {
    mesh
    world
    enabled = true

    constructor(scene, world) {
        this.world = world
        this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
        this.mesh.frustumCulled = false
        scene.add(this.mesh)
    }

    update() {
        if (this.enabled) {
            const { vertices, colors } = world.debugRender()
            this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
            this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
            this.mesh.visible = true
        } else {
            this.mesh.visible = false
        }
    }
}



await RAPIER.init() // This line is only needed if using the compat version
const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0)
const world = new RAPIER.World(gravity)
const dynamicBodies = []

window.addEventListener("load", (event) => {
    console.log("page is fully loaded");

    //// 模擬user在html使用 makarSDK 的功能

    makarSDK.vrDiv.addEventListener("vrSceneLoaded", e=>{
        console.log("user html vrSceneLoaded", e)
        console.log("多一個這樣可行嗎?")

        const rapierDebugRenderer = new RapierDebugRenderer(vrController.vrScene.object3D, world)

        // Cuboid Collider
        const cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial())
        cubeMesh.castShadow = true

        vrController.vrScene.object3D.add(cubeMesh)
        let cube_position = [2,2,5]
        cubeMesh.position.set(...cube_position)

        const cubeBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(...cube_position).setCanSleep(false))
        const cubeShape = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5).setMass(1).setRestitution(0.5)
        world.createCollider(cubeShape, cubeBody)
        dynamicBodies.push([cubeMesh, cubeBody])


                
        // ConvexHull Collider
        const icosahedronMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshNormalMaterial())
        icosahedronMesh.castShadow = true
        
        vrController.vrScene.object3D.add(icosahedronMesh)
        let icosphere_position = [2,5,5]
        let icosphere_rotation = [0,45,90]
        icosahedronMesh.position.set(...icosphere_position)
        icosahedronMesh.rotation.set(...icosphere_rotation)
        //// 好麻煩阿 rapier的rigidBody的rotation居然吃quaternion
        const rot1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(...icosphere_rotation, 'YXZ'));

        const icosahedronBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().
                                                        setTranslation(...icosphere_position)
                                                        .setRotation(rot1)
                                                        .setCanSleep(false))
        
        console.log("icosahedronMesh.geometry.attributes", icosahedronMesh.geometry.vertices)
        let tempArray = [];
        icosahedronMesh.geometry.vertices.forEach(element => {
            tempArray.push(element.x)
            tempArray.push(element.y)
            tempArray.push(element.z)
        });

        // const points = new Float32Array(icosahedronMesh.geometry.attributes.position.array)
        const points = new Float32Array(tempArray)
        const icosahedronShape = RAPIER.ColliderDesc.convexHull(points).setMass(1).setRestitution(0.5)
        world.createCollider(icosahedronShape, icosahedronBody)
        dynamicBodies.push([icosahedronMesh, icosahedronBody])



        ////----

        console.log("好我們以北極熊為例" , makarSDK.sceneObjs3D_arr[2].obj)
        console.log("好我們以北極熊為例" , makarSDK.sceneObjs3D_arr[2].obj.children[0].children[0].children[1])
        console.log("好我們以北極熊為例" , makarSDK.sceneObjs3D_arr[2].obj.children[0].children[0].children[1].geometry)
        console.log("好我們以北極熊為例" , makarSDK.sceneObjs3D_arr[2].obj.children[0].children[0].children[1].geometry.attributes.position.array)
        // const points = new Float32Array(icosahedronMesh.geometry.attributes.position.array)
        const polarBear_points = new Float32Array(makarSDK.sceneObjs3D_arr[2].obj.children[0].children[0].children[1].geometry.attributes.position.array)




        // ConvexHull Collider
        // const icosahedronMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshNormalMaterial())
        // icosahedronMesh.castShadow = true
        
        // vrController.vrScene.object3D.add(icosahedronMesh)
        let polarBear_position = makarSDK.sceneObjs3D_arr[2].obj.position
        let polarBear_rotation = makarSDK.sceneObjs3D_arr[2].obj.rotation
        // icosahedronMesh.position.set(...icosphere_position)
        // icosahedronMesh.rotation.set(...icosphere_rotation)
        //// 好麻煩阿 rapier的rigidBody的rotation居然吃quaternion
        const polarBear_rot1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(polarBear_rotation, 'YXZ'));

        const polarBear_Body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().
                                                        setTranslation(polarBear_position)
                                                        .setRotation(polarBear_rot1)
                                                        .setCanSleep(false))

        // const points = new Float32Array(icosahedronMesh.geometry.attributes.position.array)
        // const polarBear_points = new Float32Array(tempArray)
        const polarBear_Shape = RAPIER.ColliderDesc.convexHull(polarBear_points).setMass(1).setRestitution(0.5)
        world.createCollider(polarBear_Shape, polarBear_Body)
        dynamicBodies.push([makarSDK.sceneObjs3D_arr[2].obj, polarBear_Body])










        ////----

        // the floor (using a cuboid)
        // const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(50, 1, 50), new THREE.MeshPhongMaterial())
        // floorMesh.receiveShadow = true
        // floorMesh.position.y = -1
        // scene.add(floorMesh)
        const floorBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0))
        const floorShape = RAPIER.ColliderDesc.cuboid(25, 0.5, 25)
        world.createCollider(floorShape, floorBody)





        const stats = new Stats()
        document.body.appendChild(stats.dom)

        const gui = new GUI()
        gui.add(rapierDebugRenderer, 'enabled').name('Rapier Degug Renderer')
        
        const physicsFolder = gui.addFolder('Physics')
        physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
        physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
        physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
        
        const clock = new THREE.Clock()
        let delta
        

        makarSDK.workWithRenderTick( "testRapier", ()=>{
            // console.log("外部呼叫 testRapier")


            delta = clock.getDelta()
            world.timestep = Math.min(delta, 0.01)
            world.step()
        
            for (let i = 0, n = dynamicBodies.length; i < n; i++) {
                // console.log( dynamicBodies[i][0].position )
                // console.log( dynamicBodies[i][1].translation() )
                dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
                dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
            }
        
            // // car.update()
        
            rapierDebugRenderer.update()
        
            // controls.update()
        
        
            stats.update()



        })

    })

});
