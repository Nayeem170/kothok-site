import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Device, type Theme } from "./Device";
import { Particles } from "./Particles";
import { buildScreenTextures, type ScreenState } from "./screenTextures";

function IdleRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = reducedMotion ? -0.25 : Math.sin(t * 0.22) * 0.5 - 0.2;
    const radius = 6.6;
    camera.position.set(Math.sin(angle) * radius, 0.32, Math.cos(angle) * radius);
    look.current.set(0, 0, 0);
    camera.lookAt(look.current);
  });

  return null;
}

export function HeroStage({
  theme,
  reducedMotion,
  className,
}: {
  theme: Theme;
  reducedMotion: boolean;
  className?: string;
}) {
  const textures = useRef<Record<ScreenState, THREE.CanvasTexture> | null>(null);
  if (!textures.current) textures.current = buildScreenTextures();
  const shadowOpacity = theme === "dark" ? 0.5 : 0.4;

  return (
    <div className={className} style={{ pointerEvents: "none" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.32, 6.6], fov: 38 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 8, 6]} intensity={1.3} />
        <directionalLight position={[-7, 4, -4]} intensity={1.1} color="#dceaff" />

        <Environment resolution={256}>
          <Lightformer intensity={1.5} position={[0, 6, 5]} scale={[9, 5, 1]} />
          <Lightformer intensity={0.9} position={[-6, 3, -2]} scale={[4, 7, 1]} color="#dfeaff" />
          <Lightformer intensity={0.7} position={[6, 2, 3]} scale={[3, 3, 1]} />
          <Lightformer intensity={0.5} position={[0, -4, 2]} scale={[8, 3, 1]} />
        </Environment>

        <Device autoCycle theme={theme} reducedMotion={reducedMotion} textures={textures.current} />
        <ContactShadows position={[0, -1.78, 0]} opacity={shadowOpacity} scale={7} blur={2.4} far={4} color={theme === "dark" ? "#000000" : "#0A0A0A"} />
        <Particles theme={theme} reducedMotion={reducedMotion} />
        <IdleRig reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
