import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT_DESKTOP = 1000;
const PARTICLE_COUNT_TABLET = 600;
const LINE_DISTANCE = 0.55; // world units

function getParticleCount() {
  if (typeof window === 'undefined') return PARTICLE_COUNT_DESKTOP;
  return window.innerWidth < 1024 ? PARTICLE_COUNT_TABLET : PARTICLE_COUNT_DESKTOP;
}

export default function Particles() {
  const meshRef = useRef();
  const linesRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const { size, camera, invalidate } = useThree();

  const count = useMemo(() => getParticleCount(), []);

  // ── Particle data ─────────────────────────────────────
  const { positions, phases, speeds, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.25;
      scales[i] = 0.5 + Math.random() * 0.5;
    }
    return { positions, phases, speeds, scales };
  }, [count]);

  // ── Instance matrix setup ─────────────────────────────
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      const s = scales[i] * 0.035;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, positions, scales]);

  // ── Mouse tracking ────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate();
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [invalidate]);

  // ── Animation loop ────────────────────────────────────
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    const mx = mouseRef.current.x * 0.3;
    const my = mouseRef.current.y * 0.2;

    for (let i = 0; i < count; i++) {
      const px = positions[i * 3] + Math.sin(t * speeds[i] + phases[i]) * 0.12 + mx * scales[i] * 0.08;
      const py = positions[i * 3 + 1] + Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.08 + my * scales[i] * 0.06;
      const pz = positions[i * 3 + 2];
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(t * speeds[i] * 1.5 + phases[i]));
      const s = scales[i] * 0.035 * twinkle;

      dummy.position.set(px, py, pz);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // ── Line connections ──────────────────────────────
    if (!linesRef.current) return;
    const linePositions = [];

    // Only check a subset for performance
    const step = count > 800 ? 3 : 2;
    for (let i = 0; i < count; i += step) {
      const ax = positions[i * 3] + Math.sin(t * speeds[i] + phases[i]) * 0.12;
      const ay = positions[i * 3 + 1] + Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.08;
      const az = positions[i * 3 + 2];

      for (let j = i + step; j < count; j += step) {
        const bx = positions[j * 3] + Math.sin(t * speeds[j] + phases[j]) * 0.12;
        const by = positions[j * 3 + 1] + Math.cos(t * speeds[j] * 0.7 + phases[j]) * 0.08;
        const bz = positions[j * 3 + 2];
        const dx = ax - bx, dy = ay - by, dz = az - bz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < LINE_DISTANCE) {
          linePositions.push(ax, ay, az, bx, by, bz);
        }
      }
    }

    const lineGeo = linesRef.current.geometry;
    if (linePositions.length > 0) {
      const arr = new Float32Array(linePositions);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      lineGeo.setDrawRange(0, linePositions.length / 3);
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.computeBoundingSphere();
    }
  });

  return (
    <group>
      {/* ── Particles ── */}
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
      </instancedMesh>

      {/* ── Connecting lines ── */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.12}
          linewidth={1}
        />
      </lineSegments>
    </group>
  );
}
