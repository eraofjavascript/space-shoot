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

  // Continuous movement with physics-like rotation
  useFrame((state) => {
    if (modelRef.current) {
      // Store previous position
      const prevZ = modelRef.current.position.z
      const prevY = modelRef.current.position.y
      
      // Base forward movement
      const forwardSpeed = 0.1
      
      // Apply vertical input with physics-like behavior
      if (verticalInput !== 0) {
        // Vertical movement
        modelRef.current.position.y += verticalInput * 0.05
        
        // Rotation based on vertical movement (pitch)
        modelRef.current.rotation.x += verticalInput * 0.02
        
        // Adjust forward direction based on rotation
        const direction = new THREE.Vector3(0, 0, -1)
        direction.applyQuaternion(modelRef.current.quaternion)
        
        modelRef.current.position.add(direction.multiplyScalar(forwardSpeed))
      } else {
        // Regular forward movement when no vertical input
        modelRef.current.position.z -= forwardSpeed
      }
      
      // Calculate movement deltas
      const deltaZ = modelRef.current.position.z - prevZ
      const deltaY = modelRef.current.position.y - prevY
      
      // Update orbit controls target and camera to follow the model
      if (controlsRef?.current) {
        controlsRef.current.target.copy(modelRef.current.position)
        
        // Move camera to maintain distance
        state.camera.position.z += deltaZ
        state.camera.position.y += deltaY
        
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