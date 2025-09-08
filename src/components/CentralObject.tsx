import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const CentralObject = () => {
  const { scene } = useGLTF('/scene.gltf')
  const modelRef = useRef<THREE.Group>(null!)

  // No auto-rotation - user controls only

  useEffect(() => {
    // Debug: confirm component render and GLTF path
    console.log('CentralObject: using GLTF at /scene.gltf')
  }, [])

  return (
    <group ref={modelRef} position={[0, 0, 0]} scale={0.6}>
      <primitive object={scene} />
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/scene.gltf')