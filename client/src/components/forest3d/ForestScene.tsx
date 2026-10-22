import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Trees } from './Trees';
import { ForestFloor } from './ForestFloor';
import { Undergrowth } from './Undergrowth';
import { GodRays } from './GodRays';
import { PollenParticles } from './PollenParticles';

interface ForestSceneProps {
  reducedMotion?: boolean;
}

export const ForestScene: React.FC<ForestSceneProps> = ({ reducedMotion }) => {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalized mouse coordinates: -1 to +1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    if (reducedMotion) {
      camera.position.set(0, 2.2, 5);
      camera.lookAt(0, 1.8, -15);
      return;
    }

    // Scroll factor: 0 at top, up to 1 over first 800px
    const scrollFactor = Math.min(1, scrollRef.current / 800);

    // Target camera position: glide along the forest path as user scrolls
    const targetX = mouseRef.current.x * 0.9 + Math.sin(scrollFactor * 2) * 1.5;
    const targetY = 2.2 - scrollFactor * 0.5 + mouseRef.current.y * 0.35;
    const targetZ = 5 - scrollFactor * 7;

    // Smooth lerping dampening
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);

    // Look along the winding path
    const lookTargetX = mouseRef.current.x * 1.2 + Math.sin((scrollFactor + 0.3) * 2) * 2;
    const lookTargetY = 1.8 - scrollFactor * 0.4 + mouseRef.current.y * 0.5;
    const lookTargetZ = -15 - scrollFactor * 8;

    camera.lookAt(lookTargetX, lookTargetY, lookTargetZ);
  });

  return (
    <>
      {/* Deep Forest Atmospheric Fog */}
      <fogExp2 attach="fog" args={['#0B2419', 0.024]} />

      {/* Lighting System */}
      <ambientLight color="#2B4E38" intensity={0.7} />
      
      {/* Warm Sunlight filtering from above canopy */}
      <directionalLight
        position={[12, 24, -8]}
        intensity={1.8}
        color="#FFF6D8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={80}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Natural Sky-Ground Hemisphere Light */}
      <hemisphereLight
        args={['#A8BFA5', '#0B2419', 0.6]}
      />

      {/* Subtle fill light from path entrance */}
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#D8E8D0" distance={15} />

      {/* Forest Components */}
      <ForestFloor />
      <Trees reducedMotion={reducedMotion} />
      <Undergrowth />
      <GodRays reducedMotion={reducedMotion} />
      <PollenParticles count={220} reducedMotion={reducedMotion} />
    </>
  );
};
