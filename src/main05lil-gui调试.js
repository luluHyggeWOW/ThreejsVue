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

// 创建几何
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
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
parentCube.rotation.x = Math.PI / 4
cube.rotation.x = Math.PI / 4
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
// 监听窗口变化
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
// 监听鼠标移动
// var btn = document.createElement("button")
// btn.innerHTML = '点击全屏'
// btn.style.position = "absolute"
// btn.style.left = '10px'
// btn.style.top = '10px'
// btn.style.zIndex = 999
// btn.onclick = function () {
//   document.body.requestFullscreen()
// }
// document.body.appendChild(btn)
// var exitbtn = document.createElement("button")
// exitbtn.innerHTML = '退出全屏'
// exitbtn.style.position = "absolute"
// exitbtn.style.left = '10px'
// exitbtn.style.top = '100px'
// exitbtn.style.zIndex = 999
// exitbtn.onclick = function () {
//   document.exitFullscreen()
// }
// document.body.appendChild(exitbtn)
let eventObj = {
  Fullscreen: function () {
    document.body.requestFullscreen()
  },
  exitFullscreen: function () {
    document.exitFullscreen()
  }
}
// 创建GUI
const gui = new GUI()
// 添加按钮
gui.add(eventObj, "Fullscreen").name('全屏')
gui.add(eventObj, "exitFullscreen").name('退出全屏')
// 控制立方体的位置
gui.add(cube.position, "x", -5, 5).name('立方体x轴位置')
let folder = gui.addFolder("立方体位置")
folder.add(cube.position, "x").min(-10).max(10).step(1).name('立方体x轴位置2').onChange((val) => {
  console.log(val);
})
folder.add(cube.position, "y").min(-10).max(10).step(1).name('立方体y轴位置2').onFinishChange((val) => {
  console.log(val);
})
folder.add(cube.position, "z").min(-10).max(10).step(1).name('立方体z轴位置2')
createApp(App).mount('#app')
// 父元素线框模式切换
gui.add(parentMaterial, "wireframe").name("父元素线框模式")
let colorParams = {
  cubeColor: "#00ff00"
}
gui.addColor(colorParams, "cubeColor").name("立方体颜色").onChange((val) => {
  cube.material.color.set(val)
})

