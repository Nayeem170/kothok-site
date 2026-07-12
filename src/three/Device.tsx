import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { SCREEN_ORDER, makeKoboLogoTexture, type ScreenState } from "./screenTextures";

export type Theme = "light" | "dark";

const BODY_COLOR: Record<Theme, string> = {
  light: "#1E2229",
  dark: "#DCDCD6",
};

const KOBO_COLOR: Record<Theme, string> = {
  light: "#969ba3",
  dark: "#7c7c77",
};

type DeviceProps = {
  textures: Record<ScreenState, THREE.CanvasTexture>;
  theme: Theme;
  reducedMotion: boolean;
};

export function Device({ textures, theme, reducedMotion }: DeviceProps) {
  const group = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);
  const activeIdx = useRef(0);
  const flashAt = useRef(-10);
  const koboTex = useMemo(() => makeKoboLogoTexture(KOBO_COLOR[theme]), [theme]);

  useEffect(() => {
    if (bodyMat.current) bodyMat.current.color.set(BODY_COLOR[theme]);
  }, [theme]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const idx = Math.floor(t / 3.6) % SCREEN_ORDER.length;

    if (idx !== activeIdx.current && screenMat.current) {
      activeIdx.current = idx;
      screenMat.current.map = textures[SCREEN_ORDER[idx]];
      screenMat.current.needsUpdate = true;
      if (!reducedMotion) flashAt.current = t;
    }

    if (flashMat.current && !reducedMotion) {
      const since = t - flashAt.current;
      flashMat.current.opacity = since < 0.45 ? 0.5 * (1 - since / 0.45) : 0;
    }

    if (group.current && !reducedMotion) {
      group.current.position.y = Math.sin(t * 0.6) * 0.05;
      group.current.rotation.z = Math.sin(t * 0.4) * 0.01;
    }
  });

  return (
    <group ref={group}>
      <RoundedBox args={[2.3, 3.28, 0.2]} radius={0.09} smoothness={8}>
        <meshStandardMaterial ref={bodyMat} color={BODY_COLOR[theme]} roughness={0.32} metalness={0.12} />
      </RoundedBox>

      <mesh position={[0, 0, 0.102]}>
        <planeGeometry args={[1.86, 2.48]} />
        <meshBasicMaterial ref={screenMat} map={textures.library} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0.104]}>
        <planeGeometry args={[1.86, 2.48]} />
        <meshBasicMaterial ref={flashMat} color="#FFFFFF" transparent opacity={0} toneMapped={false} />
      </mesh>

      <mesh position={[0, -1.45, 0.103]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshBasicMaterial map={koboTex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
