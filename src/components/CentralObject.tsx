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
        // Removed clamp to allow full 360-degree rotation
      }

      // ALWAYS move forward in the direction the model is facing
      const forwardDir = new THREE.Vector3(0, 0, -1).applyQuaternion(model.quaternion).normalize()
      model.position.add(forwardDir.multiplyScalar(forwardSpeed))

      // Camera follow logic
      if (controlsRef?.current) {
        controlsRef.current.target.copy(model.position)

        if ((CentralObject as any)._isOrbiting?.()) {
          // During orbit, maintain relative offset but don't interfere with user control
          const newOffset = state.camera.position.clone().sub(controlsRef.current.target)
          state.camera.position.copy(model.position.clone().add(newOffset))
        } else {
          // Follow behind the model smoothly with proper quaternion-based positioning
          const cameraOffset = new THREE.Vector3(0, 2, 8)
          
          // Apply model's rotation to the offset vector
          const rotatedOffset = cameraOffset.clone().applyQuaternion(model.quaternion)
          const targetCameraPos = model.position.clone().add(rotatedOffset)
          
          // Smooth camera transition to avoid jarring movements
          state.camera.position.lerp(targetCameraPos, 0.1)
          
          // Make camera look at model with smooth rotation
          const lookDirection = model.position.clone().sub(state.camera.position).normalize()
          const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
            new THREE.Matrix4().lookAt(state.camera.position, model.position, new THREE.Vector3(0, 1, 0))
          )
          state.camera.quaternion.slerp(targetQuaternion, 0.1)
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