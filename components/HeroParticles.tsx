"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface ParticleData {
  home: THREE.Vector3;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
}

/**
 * Generates ~500 points on a jittered ellipsoidal brain shape. Two lobes
 * (slight x-offset) to give it a brainy silhouette without needing a model.
 */
function generateBrainPoints(count: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const rx = 1.4,
    ry = 1.05,
    rz = 1.15;

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere then squish into ellipsoid
    const k = i + 0.5;
    const phi = Math.acos(1 - (2 * k) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * k;

    let x = Math.cos(theta) * Math.sin(phi) * rx;
    const y = Math.cos(phi) * ry;
    let z = Math.sin(theta) * Math.sin(phi) * rz;

    // Two-lobe split
    const lobeSign = x >= 0 ? 1 : -1;
    x += lobeSign * 0.08;

    // Radial jitter → gives it a crinkly cortex feel
    const jitter = 0.06 * (Math.sin(phi * 7) + Math.cos(theta * 5));
    const nx = x + x * jitter * 0.3;
    const ny = y + y * jitter * 0.3;
    const nz = z + z * jitter * 0.3;

    points.push(new THREE.Vector3(nx, ny, nz));
  }
  return points;
}

interface BrainProps {
  scrollProgress: number;
  mouse: { x: number; y: number };
}

function Brain({ scrollProgress, mouse }: BrainProps) {
  const PARTICLE_COUNT = 500;
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const data = useMemo<ParticleData[]>(() => {
    const homes = generateBrainPoints(PARTICLE_COUNT);
    return homes.map((h) => ({
      home: h.clone(),
      position: h.clone(),
      velocity: new THREE.Vector3(0, 0, 0)
    }));
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const colors = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const a = new THREE.Color("#00F0FF");
    const b = new THREE.Color("#8A2BE2");
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mix = Math.random();
      const c = a.clone().lerp(b, mix * 0.35);
      arr[i * 3] = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const dt = Math.min(delta, 1 / 30);
    const dissolve = Math.min(1, Math.max(0, scrollProgress));

    // Spring params
    const tension = 4.5;
    const friction = 3.2;

    const mx = mouse.x * viewport.width * 0.5;
    const my = mouse.y * viewport.height * 0.5;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = data[i];

      // Target: blend between brain home and a scattered grid pos
      const scatterX = ((i % 25) - 12) * 0.35;
      const scatterY = (Math.floor(i / 25) - 10) * 0.35;
      const scatterZ = Math.sin(i * 0.5) * 0.2;

      const tx = p.home.x * (1 - dissolve) + scatterX * dissolve;
      const ty = p.home.y * (1 - dissolve) + scatterY * dissolve;
      const tz = p.home.z * (1 - dissolve) + scatterZ * dissolve;

      // Mouse pull (only when mostly formed)
      const mousePull = 1 - dissolve;
      const dx = mx * 0.15 * mousePull;
      const dy = my * 0.15 * mousePull;

      // Subtle idle breathing
      const breathe = Math.sin(t * 0.8 + i * 0.01) * 0.02 * (1 - dissolve);

      const targetX = tx + dx + breathe;
      const targetY = ty + dy + breathe;
      const targetZ = tz;

      // Spring toward target
      const ax = (targetX - p.position.x) * tension - p.velocity.x * friction;
      const ay = (targetY - p.position.y) * tension - p.velocity.y * friction;
      const az = (targetZ - p.position.z) * tension - p.velocity.z * friction;

      p.velocity.x += ax * dt;
      p.velocity.y += ay * dt;
      p.velocity.z += az * dt;

      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.position.z += p.velocity.z * dt;

      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;
    }

    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    attr.needsUpdate = true;

    // Slow rotation while formed, stops when dissolved
    pts.rotation.y += dt * 0.15 * (1 - dissolve);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function HeroParticles() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      // Dissolve progress over the first viewport-height of scroll
      setScrollProgress(Math.min(1, y / (h * 0.8)));
    };
    const onMouse = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 55 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <Brain scrollProgress={scrollProgress} mouse={mouse} />
    </Canvas>
  );
}
