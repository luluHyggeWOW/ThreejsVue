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
camera.position.x = 5
camera.position.y = 5
camera.position.z = 15
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

// 创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
)
sphere1.position.x = -4
scene.add(sphere1)
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff
  })
)
scene.add(sphere2)
const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff
  })
)
sphere3.position.x = 4
scene.add(sphere3)

// 创建射线
const raycaster = new THREE.Raycaster()
// 创建鼠标向量
const mouse = new THREE.Vector2()
// 监听点击事件
window.addEventListener("click", (e) => {
  // 设置鼠标向量的xy
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
  // 通过摄像机和鼠标位置更新焦点
  raycaster.setFromCamera(mouse, camera)
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([sphere1, sphere2, sphere3])
  if (intersects.length > 0) {
    if (intersects[0].object._isSelect) {
      intersects[0].object.material.color.set(intersects[0].object._orginColor)
      intersects[0].object._isSelect = false
      return
    }
    intersects[0].object._isSelect = true
    intersects[0].object._orginColor = intersects[0].object.material.color.getHex()
    intersects[0].object.material.color.set(0xff0000)
  }

  console.log(intersects);
})