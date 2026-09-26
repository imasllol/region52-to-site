"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const ACCENT = "#ff5a1f";

type Vec2Ref = { current: { x: number; y: number } };
type NumberRef = { current: number };

/** Силуэт кузова: профиль сбоку (перед по +X), вытянутый по ширине. */
function createBodyGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.95, 0.35);
  s.lineTo(-1.95, 0.8);
  s.lineTo(-1.7, 0.95);
  s.lineTo(-1.1, 1.0);
  s.lineTo(-0.7, 1.4);
  s.lineTo(0.35, 1.42);
  s.lineTo(0.95, 1.0);
  s.lineTo(1.8, 0.88);
  s.lineTo(1.98, 0.7);
  s.lineTo(1.98, 0.38);
  s.lineTo(1.7, 0.35);
  s.absarc(1.25, 0.35, 0.45, 0, Math.PI, false);
  s.lineTo(-0.8, 0.35);
  s.absarc(-1.25, 0.35, 0.45, 0, Math.PI, false);
  s.lineTo(-1.95, 0.35);
  const geometry = new THREE.ExtrudeGeometry(s, {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geometry.translate(0, 0, -0.75);
  return geometry;
}

function createWindowGeometry(): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(-1.0, 1.02);
  s.lineTo(-0.65, 1.34);
  s.lineTo(0.3, 1.36);
  s.lineTo(0.85, 1.02);
  s.lineTo(-1.0, 1.02);
  const geometry = new THREE.ExtrudeGeometry(s, { depth: 1.68, bevelEnabled: false });
  geometry.translate(0, 0, -0.84);
  return geometry;
}

function Wheel({ position }: { position: [number, number, number] }) {
  const spin = useRef<THREE.Group>(null);
  const side = position[2] > 0 ? 1 : -1;

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.z -= delta * 2.4;
  });

  return (
    <group position={position}>
      <group ref={spin}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 0.28, 40]} />
          <meshStandardMaterial color="#0d0d10" roughness={0.85} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * 0.142]}>
          <cylinderGeometry args={[0.23, 0.23, 0.02, 6]} />
          <meshStandardMaterial color="#9d9da6" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, side * 0.146]}>
          <torusGeometry args={[0.28, 0.012, 8, 56]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Car() {
  const group = useRef<THREE.Group>(null);
  const body = useMemo(createBodyGeometry, []);
  const windows = useMemo(createWindowGeometry, []);
  const edges = useMemo(() => new THREE.EdgesGeometry(body, 28), [body]);

  useEffect(
    () => () => {
      body.dispose();
      windows.dispose();
      edges.dispose();
    },
    [body, windows, edges],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!group.current) return;
    group.current.position.y = 0.01 + Math.sin(t * 1.6) * 0.012;
    group.current.rotation.y = -0.35 + Math.sin(t * 0.3) * 0.08;
  });

  return (
    <group ref={group}>
      <mesh geometry={body}>
        <meshStandardMaterial color="#1a1a20" metalness={0.55} roughness={0.32} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.55} toneMapped={false} />
      </lineSegments>
      <mesh geometry={windows}>
        <meshStandardMaterial
          color="#0b1016"
          metalness={0.9}
          roughness={0.08}
          emissive={ACCENT}
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Боковые неоновые полосы */}
      {[0.838, -0.838].map((z) => (
        <mesh key={z} position={[0, 0.62, z]}>
          <boxGeometry args={[3.3, 0.03, 0.01]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      ))}

      {/* Фары и задние фонари */}
      {[0.52, -0.52].map((z) => (
        <group key={z}>
          <mesh position={[2.02, 0.74, z]}>
            <boxGeometry args={[0.05, 0.09, 0.36]} />
            <meshBasicMaterial color="#fff4e6" toneMapped={false} />
          </mesh>
          <mesh position={[-2.0, 0.78, z]}>
            <boxGeometry args={[0.05, 0.08, 0.34]} />
            <meshBasicMaterial color="#ff2323" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight position={[2.8, 0.75, 0]} color="#fff1dd" intensity={12} distance={6} decay={2} />

      <Wheel position={[1.25, 0.35, 0.7]} />
      <Wheel position={[1.25, 0.35, -0.7]} />
      <Wheel position={[-1.25, 0.35, 0.7]} />
      <Wheel position={[-1.25, 0.35, -0.7]} />

      {/* Тень и неоновая подсветка снизу */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]} scale={[2.3, 1.05, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} scale={[2.7, 1.35, 1]}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/** Линия диагностического сканера, которая ходит вдоль автомобиля. */
function Scanner() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) group.current.position.x = Math.sin(clock.elapsedTime * 0.8) * 2.3;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.015, 1.9, 2.2]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.28}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.05, 0.01, 2.6]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1, 0]} color={ACCENT} intensity={8} distance={3.5} decay={2} />
    </group>
  );
}

/** Камера следует за курсором и облетает автомобиль при прокрутке первого экрана. */
function CameraRig({ pointer, progress }: { pointer: Vec2Ref; progress: NumberRef }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = progress.current;
    const angle = 0.9 + p * 0.7 + pointer.current.x * 0.12;
    const radius = 7.4 - p * 1.8;
    target.set(
      Math.sin(angle) * radius,
      1.9 + pointer.current.y * 0.35 + p * 0.6,
      Math.cos(angle) * radius,
    );
    camera.position.lerp(target, 1 - Math.exp(-3.5 * delta));
    camera.lookAt(0.3, 0.75, 0);
  });

  return null;
}

interface HeroSceneProps {
  onReady: () => void;
  coarse: boolean;
}

export default function HeroScene({ onReady, coarse }: HeroSceneProps) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      progress.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };
    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Когда первый экран уходит из вида, сцена не отрисовывается.
  useEffect(() => {
    const node = container.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      setVisible(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} className="absolute inset-0">
      <Canvas
        dpr={coarse ? [1, 1.25] : [1, 1.5]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [5.8, 1.9, 4.6], fov: 32, near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          onReady();
        }}
      >
        <fog attach="fog" args={["#0a0a0c", 7, 20]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffffff", "#15151a", 0.7]} />
        <directionalLight position={[5, 8, 5]} intensity={2} />
        <pointLight position={[-4, 2.5, -3]} color={ACCENT} intensity={40} distance={12} decay={2} />
        <pointLight position={[4, 3, -4]} color="#8fb4ff" intensity={14} distance={12} decay={2} />
        <gridHelper args={[40, 40, ACCENT, "#26262d"]} />
        <Car />
        <Scanner />
        <CameraRig pointer={pointer} progress={progress} />
      </Canvas>
    </div>
  );
}
