import { createApp } from 'vue'
import App from './App.vue'
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
//导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
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
// // 创建三角几何
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// // 创建顶点数据
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
//   1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,
// ])
// // 创建顶点属性
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
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
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// 创建网格
let parentCube = new THREE.Mesh(geometry, parentMaterial)
//设置父元素为线框模式
parentMaterial.wireframe = true
const cube = new THREE.Mesh(geometry, material);
parentCube.add(cube)
parentCube.position.set(-3, 0, 0)
cube.position.set(3, 0, 0)
// parentCube.scale.set(2, 2, 2)
// 绕着x轴旋转
// 将物体添加到场景
scene.add(parentCube)
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

