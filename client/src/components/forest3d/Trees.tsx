import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TreesProps {
  reducedMotion?: boolean;
}

export const Trees: React.FC<TreesProps> = ({ reducedMotion }) => {
  const foliageRef = useRef<THREE.Group>(null);

  // Generate realistic tree placements along both sides of a winding forest path
  const treeData = useMemo(() => {
    const trees = [];
    const count = 48; // Dense, layered forest

    for (let i = 0; i < count; i++) {
      // z positions from foreground (z: -4) to deep background (z: -70)
      const z = -4 - (i / count) * 66 + (Math.random() * 4 - 2);
      
      // Path winds gently: pathCenter = sin(z * 0.05) * 3
      const pathCenter = Math.sin(z * 0.05) * 3;
      
      // Place trees to left or right of path with natural clearance
      const side = i % 2 === 0 ? 1 : -1;
      const distanceFromPath = 3.5 + Math.random() * 12;
      const x = pathCenter + side * distanceFromPath;
      
      const height = 9 + Math.random() * 8; // Tall majestic trees
      const scale = 0.8 + Math.random() * 0.5;
      const rotationY = Math.random() * Math.PI * 2;
      
      // Color variations: deep pine, forest green, moss leaf green
      const colorTier = i % 4;
      const foliageColor = 
        colorTier === 0 ? '#163D2B' :
        colorTier === 1 ? '#0B2419' :
        colorTier === 2 ? '#224D33' : '#2F5A38';

      trees.push({ x, z, height, scale, rotationY, foliageColor });
    }
    return trees;
  }, []);

  // Subtle wind sway animation
  useFrame(({ clock }) => {
    if (reducedMotion || !foliageRef.current) return;
    const t = clock.getElapsedTime();
    foliageRef.current.children.forEach((group, index) => {
      // Phase shifted subtle wind sway
      const sway = Math.sin(t * 0.8 + index * 0.3) * 0.015;
      group.rotation.z = sway;
      group.rotation.x = Math.cos(t * 0.6 + index * 0.4) * 0.01;
    });
  });

  return (
    <group>
      {/* Shared Trunk Material for performance */}
      {treeData.map((tree, idx) => (
        <group key={idx} position={[tree.x, 0, tree.z]} rotation={[0, tree.rotationY, 0]} scale={tree.scale}>
          {/* Tree Trunk with subtle taper */}
          <mesh position={[0, tree.height * 0.4, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.45, tree.height * 0.8, 7]} />
            <meshStandardMaterial
              color="#211812"
              roughness={0.9}
              metalness={0.05}
            />
          </mesh>

          {/* Lower Canopy Cluster */}
          <mesh position={[0, tree.height * 0.55, 0]} castShadow>
            <coneGeometry args={[2.8, tree.height * 0.45, 6]} />
            <meshStandardMaterial
              color={tree.foliageColor}
              roughness={0.8}
              flatShading
            />
          </mesh>

          {/* Middle Canopy Cluster */}
          <mesh position={[0, tree.height * 0.75, 0]} castShadow>
            <coneGeometry args={[2.2, tree.height * 0.4, 6]} />
            <meshStandardMaterial
              color={tree.foliageColor}
              roughness={0.75}
              flatShading
            />
          </mesh>

          {/* Crown Top Canopy */}
          <mesh position={[0, tree.height * 0.92, 0]} castShadow>
            <coneGeometry args={[1.5, tree.height * 0.35, 6]} />
            <meshStandardMaterial
              color="#386641"
              roughness={0.7}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
