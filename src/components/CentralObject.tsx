import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export const CentralObject = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Gentle rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
    
    // Pulsing glow effect
    if (glowRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {/* Main central sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#4da6ff"
          emissive="#1a4d80"
          shininess={100}
          transparent={true}
          opacity={0.9}
        />
      </Sphere>
      
      {/* Outer glow effect */}
      <Sphere ref={glowRef} args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4da6ff"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[0.3, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#ffffff"
        />
      </Sphere>
    </group>
  )
}