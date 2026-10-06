import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x60a5fa, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.set(-3.5, 0.5, 0)
    scene.add(cube)

    const cubeInner = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.8 })
    )
    cubeInner.position.copy(cube.position)
    scene.add(cubeInner)

    const torusGeometry = new THREE.TorusGeometry(1.8, 0.4, 16, 100)
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.75,
      wireframe: true,
    })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.set(3.5, 0.5, -1)
    scene.add(torus)

    const sphereGeometry = new THREE.IcosahedronGeometry(0.7, 1)
    const sphere = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.6 })
    )
    sphere.position.set(0, -2.5, -2)
    scene.add(sphere)

    const starGeometry = new THREE.BufferGeometry()
    const starCount = 800
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40
      positions[i + 1] = (Math.random() - 0.5) * 25
      positions[i + 2] = (Math.random() - 0.5) * 20 - 5
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.8 })
    )
    scene.add(stars)

    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      cube.rotation.x += 0.005
      cube.rotation.y += 0.008
      cubeInner.rotation.y -= 0.015
      torus.rotation.x += 0.006
      torus.rotation.y += 0.004
      sphere.rotation.y += 0.01
      stars.rotation.y += 0.0004
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      cubeGeometry.dispose()
      cubeMaterial.dispose()
      torusGeometry.dispose()
      torusMaterial.dispose()
      starGeometry.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0" aria-hidden="true" />
}
