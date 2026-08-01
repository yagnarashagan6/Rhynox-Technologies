import React, { useRef, useEffect } from 'react';
import { ParticlesSwarm } from '../../../vex.js';

export default function ParticleNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let swarm = null;
    try {
      const count = window.innerWidth < 768 ? 4000 : 9000;
      swarm = new ParticlesSwarm(container, count);
    } catch (err) {
      console.error("Vex Swarm initialization error:", err);
    }

    const handleResize = () => {
      if (swarm && swarm.renderer && swarm.camera && swarm.composer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        swarm.camera.aspect = width / height;
        swarm.camera.updateProjectionMatrix();
        swarm.renderer.setSize(width, height);
        swarm.composer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (swarm) {
        if (swarm.dispose) swarm.dispose();
        if (container) container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}
