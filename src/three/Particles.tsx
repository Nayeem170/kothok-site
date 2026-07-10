import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Theme } from "./Device";

const PARTICLE_COLOR: Record<Theme, string> = {
  light: "#9CA3AF",
  dark: "#6E747C",
};

function makeDotTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(128,128,128,1)");
  g.addColorStop(1, "rgba(128,128,128,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function Particles({
  count = 320,
  theme = "light",
  reducedMotion = false,
}: {
  count?: number;
  theme?: Theme;
  reducedMotion?: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);
  const texture = useMemo(makeDotTexture, []);

  useEffect(() => {
    if (mat.current) mat.current.color.set(PARTICLE_COLOR[theme]);
  }, [theme]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    points.current.rotation.y = t * 0.02;
    points.current.rotation.x = Math.sin(t * 0.08) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.07}
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        color={PARTICLE_COLOR[theme]}
      />
    </points>
  );
}
