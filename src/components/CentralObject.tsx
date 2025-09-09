import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const CentralObject = () => {
  const { scene } = useGLTF('/scene.gltf')
  const modelRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    // Debug: confirm component render and GLTF path
    console.log('CentralObject: using GLTF at /scene.gltf')
  }, [])

  // Continuous forward movement
  useFrame((state) => {
    if (modelRef.current) {
      // Move forward continuously at constant speed
      modelRef.current.position.z -= 0.1
      
      // Update camera to follow the model
      state.camera.position.z = modelRef.current.position.z + 10
      state.camera.lookAt(modelRef.current.position)
    }
  })

  return (
    <group ref={modelRef} position={[0, 4, 0]} scale={0.6}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/scene.gltf')