import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { CentralObject } from './CentralObject'

export const SpaceScene = () => {
  return (
    <div className="w-full h-screen bg-cosmic-void">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: '#0a0a0f' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.1} />
        
        {/* Point light for central object glow */}
        <pointLight position={[0, 0, 0]} intensity={2} color="#4da6ff" />
        
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
        <CentralObject />
        
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