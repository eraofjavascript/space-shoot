import { useRef, useEffect, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CentralObject = ({ controlsRef }: { controlsRef?: React.RefObject<any> }) => {
  const { scene } = useGLTF('/scene.gltf')
  const modelRef = useRef<THREE.Group>(null!)
  const [verticalInput, setVerticalInput] = useState(0) // -1 for down, 0 for none, 1 for up

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'w':
        setVerticalInput(1)
        break
      case 's':
        setVerticalInput(-1)
        break
    }
  }, [])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'w':
      case 's':
        setVerticalInput(0)
        break
    }
  }, [])

  useEffect(() => {
    // Debug: confirm component render and GLTF path
    console.log('CentralObject: using GLTF at /scene.gltf')
    
    // Add keyboard event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // Track orbiting interactions to blend camera control
  const isOrbitingRef = useRef(false)
  useEffect(() => {
    const controls = controlsRef?.current
    if (!controls) return
    const onStart = () => (isOrbitingRef.current = true)
    const onEnd = () => (isOrbitingRef.current = false)
    controls.addEventListener('start', onStart)
    controls.addEventListener('end', onEnd)
    return () => {
      controls.removeEventListener('start', onStart)
      controls.removeEventListener('end', onEnd)
    }
  }, [controlsRef])
  ;(CentralObject as any)._isOrbiting = () => isOrbitingRef.current

  // Continuous movement aligned with facing direction and orbit compatibility
  useFrame((state) => {
    if (modelRef.current) {
      const model = modelRef.current

      // Cache previous transforms
      const prevModelPos = model.position.clone()
      const prevCamOffset = state.camera.position.clone().sub(prevModelPos)

      const forwardSpeed = 0.1

      // Vertical input influences pitch and altitude
      if (verticalInput !== 0) {
        model.position.y += verticalInput * 0.05
        model.rotation.x += verticalInput * 0.02
        model.rotation.x = THREE.MathUtils.clamp(model.rotation.x, -0.8, 0.8)
      }

      // ALWAYS move forward in the direction the model is facing
      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(model.quaternion).normalize()
      model.position.add(forwardDir.multiplyScalar(forwardSpeed))

      // Camera follow logic
      if (controlsRef?.current) {
        controlsRef.current.target.copy(model.position)

        if ((CentralObject as any)._isOrbiting?.()) {
          // Preserve user's orbit offset while following target
          state.camera.position.copy(model.position.clone().add(prevCamOffset))
        } else {
          // Follow behind the model based on its orientation
          const desiredOffsetLocal = new THREE.Vector3(0, 2, 8) // slightly above and behind
          const desiredOffsetWorld = desiredOffsetLocal.applyQuaternion(model.quaternion)
          const desiredCamPos = model.position.clone().add(desiredOffsetWorld)
          state.camera.position.lerp(desiredCamPos, 0.15)
          state.camera.lookAt(model.position)
        }

        controlsRef.current.update()
      }
    }
  })

  // Expose vertical input control for mobile
  ;(CentralObject as any).setVerticalInput = setVerticalInput

  return (
    <group ref={modelRef} position={[0, -4.8, 0]} scale={0.6}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/scene.gltf')