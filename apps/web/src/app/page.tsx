'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

type Keyframe = {
  time: number;
  head: { pitch: number; yaw: number; roll: number };
  leftHand: { x: number; y: number; z: number };
  rightHand: { x: number; y: number; z: number };
};
type PoseTimeline = { fps: number; totalDuration: number; keyframes: Keyframe[] };
type GlossTiming = { gloss: string; start: number; end: number };

// Componente placeholder do avatar 3D
function Avatar3D({ timeline, playing }: { timeline: PoseTimeline | null; playing: boolean }) {
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!timeline) return;
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const loop = () => {
      const elapsed = (performance.now() - start) / 1000;
      const t = Math.min(elapsed, timeline.totalDuration);
      setTime(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [timeline, playing]);

  const pose = useMemo(() => {
    if (!timeline) return null;
    const frames = timeline.keyframes;
    if (frames.length === 0) return null;
    // encontrar frames vizinhos
    let i = 0;
    while (i + 1 < frames.length && frames[i + 1].time < time) i++;
    const a = frames[i];
    const b = frames[Math.min(i + 1, frames.length - 1)];
    const span = Math.max(1e-6, b.time - a.time);
    const alpha = Math.min(1, Math.max(0, (time - a.time) / span));
    const lerp = (x: number, y: number) => x + (y - x) * alpha;
    return {
      head: {
        pitch: lerp(a.head.pitch, b.head.pitch),
        yaw: lerp(a.head.yaw, b.head.yaw),
        roll: lerp(a.head.roll, b.head.roll),
      },
      left: {
        x: lerp(a.leftHand.x, b.leftHand.x),
        y: lerp(a.leftHand.y, b.leftHand.y),
        z: lerp(a.leftHand.z, b.leftHand.z),
      },
      right: {
        x: lerp(a.rightHand.x, b.rightHand.x),
        y: lerp(a.rightHand.y, b.rightHand.y),
        z: lerp(a.rightHand.z, b.rightHand.z),
      },
    };
  }, [timeline, time]);

  useEffect(() => {
    if (!pose) return;
    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.degToRad(pose.head.pitch);
      headRef.current.rotation.y = THREE.MathUtils.degToRad(pose.head.yaw);
      headRef.current.rotation.z = THREE.MathUtils.degToRad(pose.head.roll);
    }
    if (leftArmRef.current) {
      leftArmRef.current.position.set(pose.left.x, pose.left.y, pose.left.z);
    }
    if (rightArmRef.current) {
      rightArmRef.current.position.set(pose.right.x, pose.right.y, pose.right.z);
    }
  }, [pose]);

  return (
    <group>
      <mesh ref={headRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      <mesh ref={leftArmRef} position={[-0.6, 0.8, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh ref={rightArmRef} position={[0.6, 0.8, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <Text position={[0, -1.5, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">Avatar 3D - Libras</Text>
    </group>
  );
}

export default function Home() {
  const API_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') : '';
  const [input, setInput] = useState('');
  const [caption, setCaption] = useState<string>('');
  const [glossTimings, setGlossTimings] = useState<GlossTiming[]>([]);
  const [timeline, setTimeline] = useState<PoseTimeline | null>(null);
  const [playing, setPlaying] = useState(false);

  async function handleTranslate() {
    setPlaying(false);
    setTimeline(null);
    setCaption('');
    try {
      const res = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      const data = await res.json();
      setCaption(data.caption);
      setGlossTimings(data.glosses);
      const glosses = (data.glosses || []).map((g: GlossTiming) => g.gloss);
      const res2 = await fetch(`${API_URL}/sign/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glosses })
      });
      const timelineData = await res2.json();
      setTimeline(timelineData);
      setPlaying(true);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">TradLibras</h1>
            <nav className="flex space-x-6">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Traduzir
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Sobre
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                API
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Painel de Tradução */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              Tradução para Libras
            </h2>
            
            <div className="space-y-4">
              <textarea
                placeholder="Digite ou fale o texto para traduzir..."
                className="w-full h-32 p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 resize-none focus:outline-none focus:border-white/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  🎤 Gravar Voz
                </button>
                <button onClick={handleTranslate} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                  ▶️ Traduzir
                </button>
              </div>
              
              <div className="text-sm text-white/60">
                <p>💡 Dica: Fale claramente para melhor reconhecimento</p>
              </div>
            </div>
          </div>

          {/* Player 3D */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              Intérprete Virtual 3D
            </h2>
            
            <div className="aspect-video bg-black/30 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Avatar3D timeline={timeline} playing={playing} />
                <OrbitControls enablePan={false} enableZoom={false} />
              </Canvas>
            </div>
            
            <div className="mt-4 flex justify-center space-x-2">
              <button onClick={() => setPlaying(false)} className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏪ Anterior
              </button>
              <button onClick={() => setPlaying((p) => !p)} className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏸️ Pausar
              </button>
              <button onClick={() => setPlaying(true)} className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏩ Próximo
              </button>
            </div>
            {caption && (
              <div className="mt-4 text-white text-center text-sm">
                <div className="opacity-80">{caption}</div>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Recursos */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Reconhecimento de Voz
            </h3>
            <p className="text-white/70 text-sm">
              Tecnologia ASR avançada para capturar sua fala com precisão
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Avatar 3D Realista
            </h3>
            <p className="text-white/70 text-sm">
              Intérprete virtual com animações fluidas e naturais
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Widget Embarcável
            </h3>
            <p className="text-white/70 text-sm">
              SDK para integrar em qualquer website ou aplicação
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 TradLibras. Desenvolvido com ❤️ para acessibilidade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}