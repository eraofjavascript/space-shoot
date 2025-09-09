import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CentralObject = ({ controlsRef }: { controlsRef?: React.RefObject<any> }) => {
  const { scene } = useGLTF('/scene.gltf')
  const modelRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    // Debug: confirm component render and GLTF path
    console.log('CentralObject: using GLTF at /scene.gltf')
  }, [])

  // Continuous forward movement with orbit controls compatibility
  useFrame(() => {
    if (modelRef.current) {
      // Move forward continuously at constant speed
      modelRef.current.position.z -= 0.1
      
      // Update orbit controls target to follow the model if available
      if (controlsRef?.current) {
        controlsRef.current.target.copy(modelRef.current.position)
        controlsRef.current.update()
      }
    }
  })

  return (
    <group ref={modelRef} position={[0, -4, 0]} scale={0.6}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/scene.gltf')