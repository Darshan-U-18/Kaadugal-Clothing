import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GodRaysProps {
  reducedMotion?: boolean;
}

export const GodRays: React.FC<GodRaysProps> = ({ reducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Sunlight shafts angles and positions through canopy
  const shafts = [
    { pos: [-4, 8, -12], rot: [0.35, 0.2, -0.4], scale: [1.8, 16, 1.8], opacity: 0.22 },
    { pos: [3, 9, -18], rot: [0.4, -0.15, 0.35], scale: [2.2, 18, 2.2], opacity: 0.28 },
    { pos: [-1, 10, -28], rot: [0.3, 0.05, -0.25], scale: [2.5, 20, 2.5], opacity: 0.2 },
    { pos: [6, 11, -36], rot: [0.45, -0.2, 0.4], scale: [3.0, 22, 3.0], opacity: 0.18 },
  ];

  useFrame(({ clock }) => {
    if (reducedMotion || !groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((mesh, i) => {
      // Subtle atmospheric shimmer
      const mat = (mesh as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = shafts[i].opacity + Math.sin(t * 1.2 + i * 1.5) * 0.05;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shafts.map((shaft, idx) => (
        <mesh
          key={idx}
          position={shaft.pos as [number, number, number]}
          rotation={shaft.rot as [number, number, number]}
          scale={shaft.scale as [number, number, number]}
        >
          <cylinderGeometry args={[0.3, 1.8, 1, 12, 1, true]} />
          <meshBasicMaterial
            color="#FFF4CC"
            transparent
            opacity={shaft.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
