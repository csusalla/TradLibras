'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Componente placeholder do avatar 3D
function Avatar3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // TODO: Carregar modelo 3D real do avatar aqui
    // Placeholder com geometria simples
  }, []);

  return (
    <group>
      {/* Cabeça placeholder */}
      <mesh ref={meshRef} position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      {/* Corpo placeholder */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.5, 0.4]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      
      {/* Braços placeholder */}
      <mesh position={[-0.6, 0.8, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      <mesh position={[0.6, 0.8, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Avatar 3D - Libras
      </Text>
    </group>
  );
}

export default function Home() {
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
              />
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  🎤 Gravar Voz
                </button>
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
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
            
            <div className="h-96 bg-black/30 rounded-lg overflow-hidden">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Avatar3D />
                <OrbitControls enablePan={false} enableZoom={false} />
              </Canvas>
            </div>
            
            <div className="mt-4 flex justify-center space-x-2">
              <button className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏪ Anterior
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏸️ Pausar
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white py-1 px-3 rounded text-sm transition-colors">
                ⏩ Próximo
              </button>
            </div>
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