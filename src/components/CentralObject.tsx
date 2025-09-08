import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const CentralObject = () => {
  const { scene } = useGLTF('/scene.gltf')
  const modelRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Gentle rotation of the X-Wing
    if (modelRef.current) {
      modelRef.current.rotation.y = time * 0.3
      modelRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
    }
  })

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