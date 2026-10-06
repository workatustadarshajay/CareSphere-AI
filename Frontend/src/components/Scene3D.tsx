import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x05080f, 0.045)
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0.4, 9)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0x22405a, 1.1))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(4, 6, 6)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x34d399, 0.9)
    rimLight.position.set(-6, -2, -4)
    scene.add(rimLight)

    const group = new THREE.Group()
    scene.add(group)

    // Medical cross: 3D beveled cross built from two rounded-ish boxes
    const crossGroup = new THREE.Group()
    const crossMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x0d9488,
      emissiveIntensity: 0.35,
      metalness: 0.55,
      roughness: 0.25,
    })
    const barA = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 0.9), crossMaterial)
    const barB = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.6, 0.9), crossMaterial)
    crossGroup.add(barA, barB)
    crossGroup.position.set(0, 0.2, 0)
    group.add(crossGroup)

    // Wireframe guardian shell around the cross
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.5, 1),
      new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true, transparent: true, opacity: 0.14 })
    )
    group.add(shell)

    // Glass torus ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.3, 0.05, 16, 120),
      new THREE.MeshStandardMaterial({
        color: 0x9be8d0,
        metalness: 0.9,
        roughness: 0.15,
        transparent: true,
        opacity: 0.65,
      })
    )
    ring.rotation.x = Math.PI / 2.4
    group.add(ring)

    // DNA helix strands (spheres + rungs) with a glass feel via transparency
    const helixGroup = new THREE.Group()
    const helixMaterial = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    })
    const rungMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    })
    const nodeGeometry = new THREE.SphereGeometry(0.09, 12, 12)
    const rungGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.62, 6)
    const HELIX_COUNT = 18
    for (let i = 0; i < HELIX_COUNT; i++) {
      const t = i * 0.55
      const nodeA = new THREE.Mesh(nodeGeometry, helixMaterial)
      nodeA.position.set(Math.cos(t) * 0.5, -2.6 + i * 0.29, Math.sin(t) * 0.5)
      const nodeB = new THREE.Mesh(nodeGeometry, helixMaterial)
      nodeB.position.set(-Math.cos(t) * 0.5, -2.6 + i * 0.29, -Math.sin(t) * 0.5)
      const rung = new THREE.Mesh(rungGeometry, rungMaterial)
      rung.position.set(0, nodeA.position.y, 0)
      rung.rotation.z = Math.atan2(Math.cos(t), Math.sin(t))
      helixGroup.add(nodeA, nodeB, rung)
    }
    helixGroup.position.set(4.6, 0.6, -1.5)
    group.add(helixGroup)

    // Floating capsule pills
    const capsuleGroup = new THREE.Group()
    const capsuleGeometry = new THREE.CapsuleGeometry(0.16, 0.5, 4, 12)
    const capsuleColors = [0x34d399, 0x7dd3fc, 0xf59e0b, 0xf472b6]
    const capsules: THREE.Mesh[] = []
    const CAPSULE_COUNT = 6
    for (let i = 0; i < CAPSULE_COUNT; i++) {
      const capsule = new THREE.Mesh(
        capsuleGeometry,
        new THREE.MeshStandardMaterial({
          color: capsuleColors[i % capsuleColors.length],
          metalness: 0.3,
          roughness: 0.4,
          transparent: true,
          opacity: 0.8,
        })
      )
      capsule.position.set(
        Math.cos(i * 1.05 + 0.6) * 5.4,
        -1.4 + Math.sin(i * 2.1) * 1.8,
        Math.sin(i * 1.05) * 2.2 - 1
      )
      capsule.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      capsules.push(capsule)
      capsuleGroup.add(capsule)
    }
    group.add(capsuleGroup)

    // ECG heartbeat line pulsing through the scene floor
    const ecgPoints: THREE.Vector3[] = []
    const ecgGeometry = new THREE.BufferGeometry()
    for (let x = -14; x <= 14; x += 0.15) {
      const cycle = (x + 14) % 5.6
      let y = 0
      if (cycle > 2.2 && cycle < 2.4) y = 0.5
      else if (cycle >= 2.4 && cycle < 2.55) y = -1.7
      else if (cycle >= 2.55 && cycle < 2.75) y = 2.6
      else if (cycle >= 2.75 && cycle < 2.9) y = -1.5
      else if (cycle >= 2.9 && cycle < 3.1) y = 0.4
      else y = Math.sin(x * 0.8) * 0.05
      ecgPoints.push(new THREE.Vector3(x, y, 0))
    }
    ecgGeometry.setFromPoints(ecgPoints)
    const ecgLine = new THREE.Line(
      ecgGeometry,
      new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.5 })
    )
    ecgLine.position.set(0, -3.4, -3)
    scene.add(ecgLine)

    // Ambient particle field
    const starGeometry = new THREE.BufferGeometry()
    const STAR_COUNT = 900
    const positions = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 34
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 16 - 4
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0x9be8d0, size: 0.045, transparent: true, opacity: 0.7 })
    )
    scene.add(stars)

    const clock = new THREE.Clock()
    let frameId = 0
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      crossGroup.rotation.y = Math.sin(t * 0.4) * 0.35
      crossGroup.rotation.x = Math.cos(t * 0.3) * 0.12
      crossGroup.position.y = 0.2 + Math.sin(t * 0.9) * 0.25

      shell.rotation.y = t * 0.12
      shell.rotation.z = Math.sin(t * 0.2) * 0.15

      ring.rotation.z = t * 0.22
      ring.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.35) * 0.12

      helixGroup.rotation.y = t * 0.5
      helixGroup.position.y = 0.6 + Math.sin(t * 0.7) * 0.3

      capsuleGroup.rotation.y = -t * 0.06
      capsules.forEach((capsule, i) => {
        capsule.rotation.x += 0.004 + i * 0.0006
        capsule.rotation.y += 0.006
      })

      const pulse = 0.35 + Math.abs(Math.sin(t * 2.2)) * 0.35
      ;(ecgLine.material as THREE.LineBasicMaterial).opacity = pulse

      stars.rotation.y = t * 0.008

      group.position.x = Math.sin(t * 0.25) * 0.15
      group.position.y = Math.cos(t * 0.2) * 0.1

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
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-0" aria-hidden="true" />
}
