import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { CentralObject } from './CentralObject'
import LoadingScreen from './LoadingScreen'

export const SpaceScene = () => {
  return (
    <div className="w-full h-screen bg-cosmic-void">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: '#0a0a0f' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[-5, 2, 5]} intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4da6ff" />
        
        {/* Stars scattered throughout space */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade={true}
        />
        
        {/* Central glowing object */}
        <Suspense fallback={<LoadingScreen />}>
          <CentralObject />
        </Suspense>
        
        {/* Orbit controls for navigation */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={50}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}