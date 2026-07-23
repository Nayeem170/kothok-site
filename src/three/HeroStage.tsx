import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Device, type Theme } from "./Device";

const IDLE_DRIFT_SPEED = 0.08;

type DragState = {
  active: boolean;
  lastX: number;
};

function DragRig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera, gl } = useThree();
  const targetYaw = useRef(-0.2);
  const yaw = useRef(-0.2);
  const drag = useRef<DragState>({ active: false, lastX: 0 });
  const look = useRef(new THREE.Vector3());

  useEffect(() => {
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      drag.current = { active: true, lastX: e.clientX };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.lastX;
      drag.current.lastX = e.clientX;
      targetYaw.current += dx * 0.01;
    };
    const onUp = (e: PointerEvent) => {
      drag.current.active = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!drag.current.active && !reducedMotion) {
      targetYaw.current += Math.sin(t * IDLE_DRIFT_SPEED) * 0.0009;
    }
    yaw.current += (targetYaw.current - yaw.current) * 0.08;
    const radius = typeof window !== "undefined" && window.innerWidth < 768 ? 5.2 : 6.6;
    camera.position.set(Math.sin(yaw.current) * radius, 0.32, Math.cos(yaw.current) * radius);
    look.current.set(0, 0, 0);
    camera.lookAt(look.current);
  });

  return null;
}

function useInView(rootMargin = "200px 0px") {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return { ref, inView };
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
  const shadowOpacity = theme === "dark" ? 0.5 : 0.4;
  const dprMax = typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 2;
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className={className} style={{ touchAction: "pan-y", cursor: "grab" }}>
      {inView && (
        <Canvas
          dpr={[1, dprMax]}
          camera={{ position: [0, 0.32, 6.6], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.35} />
          <directionalLight position={[5, 8, 6]} intensity={1.3} />
          <directionalLight position={[-7, 4, -4]} intensity={1.1} color="#dceaff" />

          <Environment resolution={256}>
            <Lightformer intensity={1.5} position={[0, 6, 5]} scale={[9, 5, 1]} />
            <Lightformer intensity={0.9} position={[-6, 3, -2]} scale={[4, 7, 1]} color="#dfeaff" />
            <Lightformer intensity={0.7} position={[6, 2, 3]} scale={[3, 3, 1]} />
            <Lightformer intensity={0.5} position={[0, -4, 2]} scale={[8, 3, 1]} />
          </Environment>

          <Device theme={theme} reducedMotion={reducedMotion} />
          <ContactShadows
            position={[0, -1.78, 0]}
            opacity={shadowOpacity}
            scale={7}
            blur={2.4}
            far={4}
            color={theme === "dark" ? "#000000" : "#0A0A0A"}
          />
          <DragRig reducedMotion={reducedMotion} />
        </Canvas>
      )}
    </div>
  );
}
