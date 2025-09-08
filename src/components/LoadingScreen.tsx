import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LoadingScreen = () => {
  const outerRingRef = useRef<THREE.Mesh>(null!)
  const innerRingRef = useRef<THREE.Mesh>(null!)
  const centerDotRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += 0.02
    }
    if (outerRingRef.current) {
      outerRingRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
    if (centerDotRef.current) {
      centerDotRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2)
    }
  })

  return (
    <group>
      {/* Outer pulsing ring */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.8, 2, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.6} />
      </mesh>
      
      {/* Inner rotating ring */}
      <mesh ref={innerRingRef}>
        <ringGeometry args={[1.2, 1.4, 32, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.8} />
      </mesh>
      
      {/* Center dot */}
      <mesh ref={centerDotRef}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#a5f3fc" />
      </mesh>
      
      {/* Glowing point lights for neon effect */}
      <pointLight position={[0, 0, 1]} intensity={0.5} color="#22d3ee" />
    </group>
  )
}

export default LoadingScreen