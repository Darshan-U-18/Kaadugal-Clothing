import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PollenProps {
  count?: number;
  reducedMotion?: boolean;
}

export const PollenParticles: React.FC<PollenProps> = ({ count = 220, reducedMotion }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30; // x: -15 to +15
      pos[i * 3 + 1] = 0.5 + Math.random() * 8; // y: 0.5 to 8.5
      pos[i * 3 + 2] = -Math.random() * 50; // z: 0 to -50

      spd[i] = 0.2 + Math.random() * 0.4;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return [pos, spd, phs];
  }, [count]);

  useFrame(({ clock }) => {
    if (reducedMotion || !pointsRef.current) return;
    const t = clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle downward drift with slight horizontal swaying
      array[idx + 1] -= speeds[i] * 0.015;
      array[idx] += Math.sin(t * 0.5 + phases[i]) * 0.005;
      array[idx + 2] += Math.cos(t * 0.4 + phases[i]) * 0.004;

      // Wrap around when reaching near ground
      if (array[idx + 1] < 0.2) {
        array[idx + 1] = 8.5;
        array[idx] = (Math.random() - 0.5) * 30;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#FDE68A"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
