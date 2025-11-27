import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// First-person controls with keyboard (WASD/Arrows), pointer lock mouse look, and accessibility fallbacks
function FirstPersonControls({ controlsRef }) {
  const { camera, gl } = useThree()
  const keys = useRef({})
  const rotation = useRef({ yaw: 0, pitch: 0 })
  const pointerLocked = useRef(false)
  const speedRef = useRef(2.0) // base units / second
  const moveVec = useRef(new THREE.Vector3())
  const tempDir = useRef(new THREE.Vector3())

  // Initialize camera position & angles
  useEffect(() => {
    camera.position.set(0, 2, 4)
    rotation.current.yaw = camera.rotation.y
    rotation.current.pitch = camera.rotation.x
  }, [camera])

  // Pointer lock handlers
  useEffect(() => {
    const domEl = gl.domElement
    const onPointerLockChange = () => {
      pointerLocked.current = document.pointerLockElement === domEl
    }
    const onMouseMove = (e) => {
      if (!pointerLocked.current) return
      const sensitivity = 0.0025
      rotation.current.yaw -= e.movementX * sensitivity
      rotation.current.pitch -= e.movementY * sensitivity
      const maxPitch = Math.PI / 2 - 0.05
      rotation.current.pitch = Math.max(-maxPitch, Math.min(maxPitch, rotation.current.pitch))
    }
    domEl.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    return () => {
      domEl.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
    }
  }, [gl])

  // Keyboard handling
  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true
      if (e.code === 'Enter') {
        gl.domElement.requestPointerLock()
      }
      if (e.code === 'Escape' && pointerLocked.current) {
        document.exitPointerLock()
      }
    }
    const up = (e) => { keys.current[e.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [gl])

  // Public control functions (exposed via ref)
  useEffect(() => {
    if (!controlsRef) return
    controlsRef.current = {
      goToShelfView: () => {
        camera.position.set(5.5, 2, -2.5) // vantage in front of reagent shelf
        rotation.current.yaw = Math.PI / 2 // look towards +X (shelf at x≈8)
        rotation.current.pitch = 0
      },
      goToTableView: () => {
        camera.position.set(0, 2, 4)
        rotation.current.yaw = 0
        rotation.current.pitch = 0
      }
    }
  }, [camera, controlsRef])

  // Movement + rotation update each frame
  useFrame((_, delta) => {
    // Adjust speed (Shift for sprint)
    const base = 2.2
    const sprint = keys.current['ShiftLeft'] || keys.current['ShiftRight'] ? 1.8 : 1.0
    speedRef.current = base * sprint

    // Direction vectors
    const forward = keys.current['KeyW'] || keys.current['ArrowUp'] ? 1 : (keys.current['KeyS'] || keys.current['ArrowDown'] ? -1 : 0)
    const strafe = keys.current['KeyD'] || keys.current['ArrowRight'] ? 1 : (keys.current['KeyA'] || keys.current['ArrowLeft'] ? -1 : 0)

    // Update rotation if not pointer locked (keyboard look)
    if (!pointerLocked.current) {
      if (keys.current['ArrowLeft']) rotation.current.yaw += 0.9 * delta
      if (keys.current['ArrowRight']) rotation.current.yaw -= 0.9 * delta
    }

    // Apply rotation to camera
    camera.rotation.set(rotation.current.pitch, rotation.current.yaw, 0)

    // Build movement vector in camera space (XZ plane)
    moveVec.current.set(0, 0, 0)
    if (forward !== 0) {
      tempDir.current.set(0, 0, -1).applyEuler(camera.rotation)
      moveVec.current.addScaledVector(tempDir.current, forward)
    }
    if (strafe !== 0) {
      tempDir.current.set(1, 0, 0).applyEuler(camera.rotation)
      moveVec.current.addScaledVector(tempDir.current, strafe)
    }
    if (moveVec.current.lengthSq() > 0) {
      moveVec.current.normalize().multiplyScalar(speedRef.current * delta)
      camera.position.add(moveVec.current)
    }

    // Constrain within room bounds (slightly inset from walls)
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -11, 11)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -8, 8)
    camera.position.y = 2 // fixed eye height
  })

  return null
}

export default FirstPersonControls
