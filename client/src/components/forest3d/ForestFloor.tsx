import React, { useMemo } from 'react';
import * as THREE from 'three';

export const ForestFloor: React.FC = () => {
  // Create an undulating terrain geometry with a winding path
  const { geometry, pathCurve } = useMemo(() => {
    const width = 80;
    const depth = 120;
    const segmentsX = 40;
    const segmentsZ = 60;
    const geo = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    // Elevate the sides and form a subtle hollow for the winding path
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Path equation: xCenter = sin(z * 0.05) * 3
      const pathCenter = Math.sin(z * 0.05) * 3;
      const distFromPath = Math.abs(x - pathCenter);

      // Gentle natural rolling hills away from path
      const hillNoise = Math.sin(x * 0.15) * Math.cos(z * 0.1) * 0.8;
      const slope = Math.min(2.5, (distFromPath / 15) * 1.5);
      
      pos.setY(i, slope + hillNoise - 0.5);
    }

    geo.computeVertexNormals();

    // Winding path curve points for placing trail stones & markers
    const curvePoints = [];
    for (let z = 10; z >= -90; z -= 5) {
      curvePoints.push(new THREE.Vector3(Math.sin(z * 0.05) * 3, 0.05, z));
    }
    const pathCurve = new THREE.CatmullRomCurve3(curvePoints);

    return { geometry: geo, pathCurve };
  }, []);

  return (
    <group position={[0, -0.2, -20]}>
      {/* Main Moss Terrain */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#143422"
          roughness={0.95}
          metalness={0.02}
          flatShading={false}
        />
      </mesh>

      {/* Winding Soil Path overlay */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 110, 8, 30]} />
        <meshStandardMaterial
          color="#292017"
          roughness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
};
