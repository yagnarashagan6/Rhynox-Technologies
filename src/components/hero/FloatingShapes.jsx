import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Floating glass cube ─────────────────────────────── */
function GlassCube({ position, scale, rotSpeed, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * rotSpeed * 0.5 + phase) * 0.25;
    ref.current.rotation.x += rotSpeed * 0.003;
    ref.current.rotation.y += rotSpeed * 0.004;
    ref.current.rotation.z += rotSpeed * 0.002;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.3}
        roughness={0.05}
        transmission={1}
        ior={1.5}
        chromaticAberration={0.04}
        color="#3b82f6"
        attenuationColor="#60a5fa"
        attenuationDistance={0.5}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

/* ─── Wireframe sphere ────────────────────────────────── */
function WireframeSphere({ position, scale, rotSpeed, phase }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.cos(t * rotSpeed * 0.4 + phase) * 0.3;
    ref.current.rotation.x += rotSpeed * 0.004;
    ref.current.rotation.y += rotSpeed * 0.006;
  });

  return (
    <lineSegments ref={ref} position={position} scale={scale} geometry={edges}>
      <lineBasicMaterial color="#818cf8" transparent opacity={0.45} linewidth={1} />
    </lineSegments>
  );
}

/* ─── Hexagonal ring ──────────────────────────────────── */
function HexRing({ position, scale, rotSpeed, phase }) {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * rotSpeed * 0.3 + phase) * 0.2;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * rotSpeed * 0.2) * 0.3;
    ref.current.rotation.z += rotSpeed * 0.003;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.05, 6, 6]} />
      <meshPhysicalMaterial
        color="#22d3ee"
        emissive="#06b6d4"
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

/* ─── AI node cluster ─────────────────────────────────── */
function AINode({ position, scale, rotSpeed, phase }) {
  const groupRef = useRef();
  const nodeCount = 5;

  const nodePositions = useMemo(() =>
    Array.from({ length: nodeCount }, (_, i) => {
      const theta = (i / nodeCount) * Math.PI * 2;
      return [Math.cos(theta) * 0.5, Math.sin(theta) * 0.5, 0];
    }),
  []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * rotSpeed * 0.35 + phase) * 0.2;
    groupRef.current.rotation.z += rotSpeed * 0.004;
    groupRef.current.rotation.x += rotSpeed * 0.002;
  });

  // Build line geometry connecting nodes
  const linePoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        pts.push(...nodePositions[i], ...nodePositions[j]);
      }
    }
    return new Float32Array(pts);
  }, [nodePositions]);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));
    return g;
  }, [linePoints]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central hub */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshPhysicalMaterial
          color="#7c3aed"
          emissive="#8b5cf6"
          emissiveIntensity={1.0}
          roughness={0.1}
          metalness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Outer nodes */}
      {nodePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            emissive="#7c3aed"
            emissiveIntensity={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      {/* Connecting lines */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#c4b5fd" transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

/* ─── Main FloatingShapes ─────────────────────────────── */
export default function FloatingShapes() {
  const shapes = useMemo(() => [
    // Glass cubes
    { type: 'cube',   position: [-5.5, 1.5, -3],   scale: 0.55, rotSpeed: 0.8,  phase: 0 },
    { type: 'cube',   position: [5.2,  -1.2, -4],   scale: 0.4,  rotSpeed: 0.6,  phase: 1.5 },
    { type: 'cube',   position: [-3.8, -2.5, -2.5], scale: 0.3,  rotSpeed: 1.0,  phase: 3.1 },
    // Wireframe spheres
    { type: 'sphere', position: [4.0,  2.0,  -3.5], scale: 0.65, rotSpeed: 0.7,  phase: 0.8 },
    { type: 'sphere', position: [-6.0, -0.5, -4],   scale: 0.5,  rotSpeed: 0.5,  phase: 2.4 },
    { type: 'sphere', position: [1.5,  3.0,  -5],   scale: 0.4,  rotSpeed: 0.9,  phase: 1.1 },
    // Hex rings
    { type: 'hexring', position: [-4.5, 2.5, -3.5], scale: 0.7,  rotSpeed: 0.6,  phase: 0.4 },
    { type: 'hexring', position: [6.0,  0.8, -4.5], scale: 0.55, rotSpeed: 0.45, phase: 2.0 },
    { type: 'hexring', position: [0.5, -3.0, -3],   scale: 0.45, rotSpeed: 0.75, phase: 3.5 },
    // AI nodes
    { type: 'ainode', position: [-2.0, 3.0, -3],    scale: 0.9,  rotSpeed: 0.6,  phase: 1.8 },
    { type: 'ainode', position: [3.5, -2.5, -3.5],  scale: 0.7,  rotSpeed: 0.8,  phase: 0.3 },
  ], []);

  return (
    <group>
      {shapes.map((s, i) => {
        const props = {
          key: i,
          position: s.position,
          scale: s.scale,
          rotSpeed: s.rotSpeed,
          phase: s.phase,
        };
        if (s.type === 'cube')    return <GlassCube {...props} />;
        if (s.type === 'sphere')  return <WireframeSphere {...props} />;
        if (s.type === 'hexring') return <HexRing {...props} />;
        if (s.type === 'ainode') return <AINode {...props} />;
        return null;
      })}
    </group>
  );
}
