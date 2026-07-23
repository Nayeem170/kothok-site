import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { makeKoboLogoTexture } from "./screenTextures";

export type Theme = "light" | "dark";

/// Real captures off the device, not a replica. Refresh them by running a
/// `--features screenshot` build of the reader and holding the header centre.
export const SCREEN_STATES = [
  "splash",
  "library",
  "reading",
  "reading-bangla",
  "audio",
  "chapters",
  "about",
  "menu",
] as const;

export type ScreenState = (typeof SCREEN_STATES)[number];

const BODY_COLOR: Record<Theme, string> = {
  light: "#1E2229",
  dark: "#DCDCD6",
};

const KOBO_COLOR: Record<Theme, string> = {
  light: "#969ba3",
  dark: "#7c7c77",
};

// The panel is 1072x1448. Deriving the plane from that keeps the stills
// pixel-proportional; the previous 1792/2400 guess overflowed the screen.
const PANEL_W = 1072;
const PANEL_H = 1448;
const SCREEN_H = 2.48;
const SCREEN_W = SCREEN_H * (PANEL_W / PANEL_H);

export const SCREEN_ORDER: { state: ScreenState; dwell: number }[] = [
  { state: "splash", dwell: 2.4 },
  { state: "library", dwell: 3.6 },
  { state: "reading", dwell: 4.0 },
  { state: "reading-bangla", dwell: 4.0 },
  { state: "audio", dwell: 4.0 },
  { state: "chapters", dwell: 3.2 },
  { state: "about", dwell: 3.2 },
  { state: "menu", dwell: 3.6 },
  { state: "reading", dwell: 4.0 },
  { state: "library", dwell: 3.0 },
];

/// Loads every still up front so a screen change never lands on an empty plane.
/// Imperative rather than drei's `useTexture` because the Canvas has no Suspense
/// boundary - suspending here would blank the whole hero.
function useScreenTextures(maxAniso: number) {
  const [textures, setTextures] = useState<Partial<Record<ScreenState, THREE.Texture>>>({});

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let cancelled = false;
    const loaded: THREE.Texture[] = [];

    Promise.all(
      SCREEN_STATES.map((state) =>
        loader
          .loadAsync(`${import.meta.env.BASE_URL}screens/${state}.png`)
          .then((tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = maxAniso;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            loaded.push(tex);
            return [state, tex] as const;
          })
          // One missing still must not take the other five down with it.
          .catch(() => null),
      ),
    ).then((entries) => {
      if (cancelled) {
        loaded.forEach((t) => t.dispose());
        return;
      }
      const next: Partial<Record<ScreenState, THREE.Texture>> = {};
      for (const entry of entries) {
        if (entry) next[entry[0]] = entry[1];
      }
      setTextures(next);
    });

    return () => {
      cancelled = true;
      loaded.forEach((t) => t.dispose());
    };
  }, []);

  return textures;
}

export const FLASH_DURATION_SEC = 0.4;
const FLASH_PEAK_OPACITY = 0.4;
const FLOAT_SPEED = 0.6;
const FLOAT_AMPLITUDE = 0.05;
const SWAY_SPEED = 0.4;
const SWAY_AMPLITUDE = 0.01;

type DeviceProps = {
  theme: Theme;
  reducedMotion: boolean;
};

export function Device({ theme, reducedMotion }: DeviceProps) {
  const group = useRef<THREE.Group>(null);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const activeIdx = useRef(0);
  const cycleStart = useRef(0);
  const flashAt = useRef(-10);
  const [, forceTick] = useState(0);
  const maxAniso = useThree((s) => s.gl).capabilities.getMaxAnisotropy();
  const koboTex = useMemo(() => makeKoboLogoTexture(KOBO_COLOR[theme], maxAniso), [theme, maxAniso]);
  const screens = useScreenTextures(maxAniso);

  useEffect(() => {
    if (bodyMat.current) bodyMat.current.color.set(BODY_COLOR[theme]);
  }, [theme]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const elapsed = t - cycleStart.current;
    const def = SCREEN_ORDER[activeIdx.current];

    // Screen content cycles regardless of reduced motion - it's information,
    // not physical motion. Float, sway and flash are gated below.
    if (elapsed >= def.dwell) {
      activeIdx.current = (activeIdx.current + 1) % SCREEN_ORDER.length;
      cycleStart.current = t;
      forceTick((x) => x + 1);
      flashAt.current = t;
    }

    if (flashMat.current && !reducedMotion) {
      const since = t - flashAt.current;
      flashMat.current.opacity =
        since < FLASH_DURATION_SEC
          ? FLASH_PEAK_OPACITY * (1 - since / FLASH_DURATION_SEC)
          : 0;
    }

    if (group.current && !reducedMotion) {
      group.current.position.y = Math.sin(t * FLOAT_SPEED) * FLOAT_AMPLITUDE;
      group.current.rotation.z = Math.sin(t * SWAY_SPEED) * SWAY_AMPLITUDE;
    }
  });

  const current = SCREEN_ORDER[activeIdx.current].state;
  const screenTex = screens[current] ?? null;

  return (
    <group ref={group}>
      <RoundedBox args={[2.3, 3.28, 0.2]} radius={0.09} smoothness={8}>
        <meshStandardMaterial
          ref={bodyMat}
          color={BODY_COLOR[theme]}
          roughness={0.32}
          metalness={0.12}
        />
      </RoundedBox>

      <mesh position={[0, 0, 0.102]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        {/* key remount forces the map shader to recompile when the still loads
            (three only bakes map into the shader at material build). Paper-white
            until then so it never flashes black. Unlit: an e-ink panel is
            emissive paper, so a lit material lets scene lights mottle the text;
            basic shows the capture flat and full-contrast exactly as shot. */}
        <meshBasicMaterial
          key={screenTex ? screenTex.uuid : "blank"}
          map={screenTex}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial
          ref={flashMat}
          color="#FFFFFF"
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, -1.45, 0.103]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshStandardMaterial
          map={koboTex}
          emissive="#ffffff"
          emissiveMap={koboTex}
          emissiveIntensity={0.4}
          roughness={0.7}
          transparent
        />
      </mesh>
    </group>
  );
}
