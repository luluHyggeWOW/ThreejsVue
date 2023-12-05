import { createApp } from 'vue'
import App from './App.vue'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
//导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
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

// 索引绘制
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建顶点数据
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1, 1, 0

])
// 创建顶点属性
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
// 设置2个顶点组 形成2个材质
geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
const cube = new THREE.Mesh(geometry, material);

cube.position.set(3, 0, 0)
// parentCube.scale.set(2, 2, 2)
// 绕着x轴旋转
// 将物体添加到场景
scene.add(cube)
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
// 创建纹理加载器
let textureLoader = new THREE.TextureLoader()
let texture = textureLoader.load("../public/texture/watercover/CityNewYork002_COL_VAR1_1K.png")
// texture.colorSpace = THREE.SRGBColorSpace;
// texture.colorSpace = THREE.LinearSRGBColorSpace;
// 加载ao贴图
let aoMap = textureLoader.load("../public/texture/watercover/CityNewYork002_AO_1K.jpg")
//透明度贴图
let alphaMap = textureLoader.load("../public/texture/door/height.jpg")
//光照贴图
let lightMap = textureLoader.load("../public/texture/colors.png")
// 高光贴图
let specularMap = textureLoader.load("../public/texture/watercover/CityNewYork002_GLOSS_1K.jpg")
//加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load("../public/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球形映射
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  //设置环境贴图
  scene.background = envMap
  // 设置环境贴图
  planeMaterial
})
let planeGeometry = new THREE.PlaneGeometry(1, 1)
let planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: texture,
  transparent: true, //允许透明
  aoMap: aoMap, //设置ao
  // alphaMap: alphaMap, //设置透明度贴图
  // lightMap: lightMap, //光照贴图
  specularMap: specularMap, //高光贴图
  reflectivity: 0.5,
})
let plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
gui.add(planeMaterial, "aoMapIntensity").min(0).max(1).name("ao强度")
gui.add(texture, "colorSpace", {
  sRBG: THREE.SRGBColorSpace,
  Linear: THREE.LinearSRGBColorSpace
}).onChange(() => {
  texture.needsUpdate = true
})