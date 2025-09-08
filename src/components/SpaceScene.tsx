import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, useProgress } from '@react-three/drei'
import { CentralObject } from './CentralObject'

export const SpaceScene = () => {
  const { active } = useProgress()
  return (
    <div className="relative w-full h-screen bg-cosmic-void">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: '#0a0a0f' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[-5, 2, 5]} intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4da6ff" />
        
        {/* Static bright stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade={false}
          speed={0}
        />
        
        {/* Central glowing object */}
        <Suspense fallback={null}>
          <CentralObject />
        </Suspense>
        
        {/* Orbit controls for navigation - no auto rotation */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={50}
          autoRotate={false}
          autoRotateSpeed={0}
        />
      </Canvas>
      {active && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-400 animate-pulse shadow-[0_0_20px_#22d3ee]" />
              <div className="absolute inset-2 w-16 h-16 rounded-full border-t-2 border-cyan-300 animate-spin shadow-[0_0_15px_#67e8f9]" />
              <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-200 rounded-full animate-pulse shadow-[0_0_10px_#a5f3fc]" />
            </div>
            <div className="mt-6 text-cyan-300 font-mono text-sm animate-pulse tracking-widest">
              LOADING...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}