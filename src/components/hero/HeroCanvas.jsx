import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingShapes from './FloatingShapes';
import Particles from './Particles';

/**
 * HeroCanvas — wraps the R3F scene.
 * Performance settings:
 *   dpr=[1,1.5]              limits pixel ratio
 *   frameloop="demand"       only renders on invalidate
 *   powerPreference="high"   requests GPU
 *   shadows={false}          no shadow maps
 */
export default function HeroCanvas() {
  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: 2, pointerEvents: 'none' }}
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
        }}
        camera={{ position: [0, 0, 7], fov: 55, near: 0.1, far: 50 }}
        shadows={false}
      >
        {/* Minimal lighting — no HDRI, no expensive processing */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow={false} />
        <pointLight position={[-4, -2, 3]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[4, 3, -2]} intensity={0.4} color="#8b5cf6" />

        <Suspense fallback={null}>
          <FloatingShapes />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
