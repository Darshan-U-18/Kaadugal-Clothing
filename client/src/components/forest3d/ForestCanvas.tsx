import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ForestScene } from './ForestScene';

export const ForestCanvas: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (!hasWebGL) {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B2419]/70 via-[#0B2419]/40 to-[#0B2419]" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B2419]">
      <Canvas
        camera={{ position: [0, 2.2, 5], fov: 48, near: 0.1, far: 120 }}
        shadows
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        onCreated={() => setIsLoaded(true)}
      >
        <Suspense fallback={null}>
          <ForestScene reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>

      {/* Atmospheric depth vignette and bottom gradient fade into content */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-[#0B2419]/20 to-[#0B2419]/80" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#071910] via-[#0B2419]/50 to-transparent" />

      {/* Elegant initial scene transition */}
      <div
        className={`pointer-events-none absolute inset-0 bg-[#0B2419] transition-opacity duration-1000 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
