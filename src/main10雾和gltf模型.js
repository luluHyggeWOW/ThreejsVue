import { createApp } from 'vue'
import App from './App.vue'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
//导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
// 导入glft加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45,//视角
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  1000 //远平面
)
//创建渲染
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// 设置相机位置
camera.position.x = 2
camera.position.y = 2
camera.position.z = 5
camera.lookAt(0, 0, 0)
// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 添加轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 带阻尼的惯性
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.1
// 设置旋转速度
// controls.autoRotate = true
// 渲染函数  
function animate () {
  controls.update()
  requestAnimationFrame(animate)
  // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera);
}
animate()

let params = {}

const gui = new GUI()
// 创建长方体
// const boxGeometry = new THREE.BoxGeometry(1, 1, 100)
// const boxMaterial = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,

// })
// const box = new THREE.Mesh(boxGeometry, boxMaterial)
// scene.add(box)
//创建场景雾
// scene.fog = new THREE.Fog(0x99999, 0.1, 50)
// 创建场景指数雾
scene.fog = new THREE.FogExp2(0x99999, 0.1, 50)
scene.background = new THREE.Color(0x99999)
// 实例化加载器
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  //模型路径
  '../public/model/Duck.glb',
  //加载完成回调
  (glft) => {
    scene.add(glft.scene)
  }
)
// 实例化加载器
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("../public/draco/")
gltfLoader.setDRACOLoader(dracoLoader)
// 设置gltf加载器draco解码器
gltfLoader.load(
  //模型路径
  '../public/model/city.glb',
  //加载完成回调
  (glft) => {
    scene.add(glft.scene)
  }
)
// 加载环境贴图
//加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load("../public/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球形映射
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  //设置环境贴图
  // scene.background = envMap
  scene.environment = envMap
  // 设置环境贴图
  // planeMaterial
})