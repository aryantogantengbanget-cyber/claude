'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Custom 3D AI Avatar Character
function Avatar({ isTalking }: { isTalking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Idle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }

    if (headRef.current) {
      // Gentle head rotation
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Blinking animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = state.clock.elapsedTime * 2;
      const blink = Math.sin(blinkTime) < 0.98 ? 1 : 0.1;
      leftEyeRef.current.scale.y = blink;
      rightEyeRef.current.scale.y = blink;
    }

    // Talking animation
    if (mouthRef.current && isTalking) {
      mouthRef.current.scale.y = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 10)) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.15, 1.6, 0.35]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.15, 1.6, 0.35]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.5, 0.38]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color="#ffb380" />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 1.35, 0.35]}>
        <boxGeometry args={[0.2, 0.05, 0.05]} />
        <meshStandardMaterial color="#d63447" />
      </mesh>

      {/* Body/Torso */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.9, 32]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>

      {/* Arms */}
      <group position={[-0.5, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.07, 0.6, 16]} />
          <meshStandardMaterial color="#4a90e2" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>

      <group position={[0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.07, 0.6, 16]} />
          <meshStandardMaterial color="#4a90e2" />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </group>

      {/* Legs */}
      <group position={[-0.15, -0.3, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.8, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, -0.85, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>

      <group position={[0.15, -0.3, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.8, 16]} />
          <meshStandardMaterial color="#2c3e50" />
        </mesh>
        <mesh position={[0, -0.85, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
      </group>

      {/* Antenna (AI indicator) */}
      <group position={[0, 1.9, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Ambient glow */}
      <pointLight position={[0, 1.5, 0.5]} intensity={0.5} color="#4a90e2" />
    </group>
  );
}

// Floating particles around avatar
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4a90e2" transparent opacity={0.6} />
    </points>
  );
}

// Main component
export default function AIAvatar3D({ isTalking = false }: { isTalking?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
        <div className="text-white text-xl">Loading AI Avatar...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 4]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#a78bfa" />

        {/* Environment */}
        <Environment preset="sunset" />

        {/* Avatar */}
        <Avatar isTalking={isTalking} />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a2e" opacity={0.5} transparent />
        </mesh>

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
