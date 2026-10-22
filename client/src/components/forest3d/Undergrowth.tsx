import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Undergrowth: React.FC = () => {
  // Generate foreground and midground rocks and fern clusters
  const elements = useMemo(() => {
    const rocks = [];
    const ferns = [];

    // Rocks scattered naturally along trail edges
    for (let i = 0; i < 24; i++) {
      const z = -2 - (i / 24) * 45 + (Math.random() * 2 - 1);
      const pathCenter = Math.sin(z * 0.05) * 3;
      const side = i % 2 === 0 ? 1 : -1;
      const x = pathCenter + side * (2.2 + Math.random() * 4);
      const scale = 0.3 + Math.random() * 0.45;
      const rot = Math.random() * Math.PI;
      rocks.push({ x, z, scale, rot });
    }

    // Fern clusters with multi-petal fronds
    for (let j = 0; j < 36; j++) {
      const z = -1 - (j / 36) * 50 + (Math.random() * 3 - 1.5);
      const pathCenter = Math.sin(z * 0.05) * 3;
      const side = j % 2 === 0 ? 1 : -1;
      const x = pathCenter + side * (2.5 + Math.random() * 6);
      const scale = 0.5 + Math.random() * 0.6;
      ferns.push({ x, z, scale });
    }

    return { rocks, ferns };
  }, []);

  return (
    <group>
      {/* Mossy Rocks */}
      {elements.rocks.map((rock, idx) => (
        <mesh
          key={`rock-${idx}`}
          position={[rock.x, 0.15, rock.z]}
          rotation={[rock.rot * 0.5, rock.rot, 0]}
          scale={[rock.scale * 1.3, rock.scale * 0.8, rock.scale]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial
            color="#2E3830"
            roughness={0.9}
            flatShading
          />
        </mesh>
      ))}

      {/* Fern / Low Vegetation Fronds */}
      {elements.ferns.map((fern, idx) => (
        <group key={`fern-${idx}`} position={[fern.x, 0, fern.z]} scale={fern.scale}>
          {[0, 60, 120, 180, 240, 300].map((angle, leafIdx) => (
            <mesh
              key={leafIdx}
              position={[0, 0.25, 0]}
              rotation={[0.4, (angle * Math.PI) / 180, 0]}
            >
              <coneGeometry args={[0.4, 0.9, 4]} />
              <meshStandardMaterial
                color={idx % 2 === 0 ? '#265435' : '#386641'}
                roughness={0.7}
                flatShading
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};
