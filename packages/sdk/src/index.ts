/**
 * TradLibras SDK
 * SDK para integração do widget de tradução para Libras
 */

export interface TranslationOptions {
  language?: 'pt-BR' | 'en-US';
  voice?: boolean;
  avatar?: '3d' | '2d' | 'video';
  speed?: number;
  size?: 'small' | 'medium' | 'large';
}

export interface TranslationResult {
  text: string;
  signs: SignData[];
  duration: number;
  confidence: number;
}

export interface SignData {
  id: string;
  word: string;
  animation: string;
  duration: number;
  metadata?: Record<string, any>;
}

export interface ASRResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  timestamp: number;
}

/**
 * Classe principal do SDK TradLibras
 */
export class TradLibras {
  private apiUrl: string;
  private apiKey: string;
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;
  private isRecording: boolean = false;
  private onlinePreferred: boolean = true;

  constructor(apiKey: string, apiUrl: string = 'https://api.tradlibras.com.br') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  /**
   * Inicializa o widget no elemento especificado
   */
  async init(containerId: string, options: TranslationOptions = {}): Promise<void> {
    try {
      this.container = document.getElementById(containerId);
      if (!this.container) {
        throw new Error(`Elemento com ID '${containerId}' não encontrado`);
      }

      // TODO: Implementar inicialização real do widget
      this.container.innerHTML = this.createWidgetHTML(options);
      this.setupEventListeners();
      this.isInitialized = true;

      console.log('TradLibras SDK inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar TradLibras SDK:', error);
      throw error;
    }
  }

  /**
   * Traduz texto para Libras
   */
  async translate(text: string, options: TranslationOptions = {}): Promise<TranslationResult> {
    if (!this.isInitialized) {
      throw new Error('SDK não foi inicializado. Chame init() primeiro.');
    }

    try {
      // Escolher pipeline online/offline
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const useOnline = this.onlinePreferred && isOnline;

      if (useOnline) {
        // pipeline online (API)
        const res = await fetch(`${this.apiUrl.replace(/\/$/, '')}/translate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        this.displayTranslation({
          text,
          signs: this.mockSignsData(data.caption || text),
          duration: data.glosses?.length || 0,
          confidence: 0.95,
        });
        return {
          text,
          signs: this.mockSignsData(data.caption || text),
          duration: data.glosses?.length || 0,
          confidence: 0.95,
        };
      } else {
        // pipeline offline
        const { offlinePipeline } = await import('./offline');
        const out = offlinePipeline(text);
        this.displayTranslation({
          text,
          signs: this.mockSignsData(out.caption),
          duration: out.glosses.length,
          confidence: 0.9,
        });
        return {
          text,
          signs: this.mockSignsData(out.caption),
          duration: out.glosses.length,
          confidence: 0.9,
        };
      }
    } catch (error) {
      console.error('Erro na tradução online, tentando offline:', error);
      const { offlinePipeline } = await import('./offline');
      const out = offlinePipeline(text);
      this.displayTranslation({
        text,
        signs: this.mockSignsData(out.caption),
        duration: out.glosses.length,
        confidence: 0.9,
      });
      return {
        text,
        signs: this.mockSignsData(out.caption),
        duration: out.glosses.length,
        confidence: 0.9,
      };
    }
  }

  /**
   * Inicia gravação de voz
   */
  async startMic(callback?: (result: ASRResult) => void): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('SDK não foi inicializado. Chame init() primeiro.');
    }

    try {
      // TODO: Implementar ASR real
      this.isRecording = true;
      console.log('Iniciando gravação de voz...');

      // Mock do reconhecimento de voz
      setTimeout(() => {
        const mockResult: ASRResult = {
          text: 'Olá, como você está?',
          confidence: 0.89,
          isFinal: true,
          timestamp: Date.now()
        };

        if (callback) {
          callback(mockResult);
        }

        this.isRecording = false;
      }, 3000);

    } catch (error) {
      console.error('Erro ao iniciar microfone:', error);
      this.isRecording = false;
      throw error;
    }
  }

  /**
   * Para gravação de voz
   */
  stopMic(): void {
    this.isRecording = false;
    console.log('Gravação de voz parada');
  }

  /**
   * Verifica se está gravando
   */
  isListening(): boolean {
    return this.isRecording;
  }

  /**
   * Destrói o widget e limpa recursos
   */
  destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.isInitialized = false;
    this.isRecording = false;
    console.log('TradLibras SDK destruído');
  }

  // Métodos privados para implementação interna

  private createWidgetHTML(options: TranslationOptions): string {
    const size = options.size || 'medium';
    const sizeClass = {
      small: 'w-64 h-48',
      medium: 'w-96 h-64',
      large: 'w-128 h-96'
    }[size];

    return `
      <div class="tradlibras-widget ${sizeClass} bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg shadow-lg overflow-hidden">
        <div class="p-4 bg-white/10 backdrop-blur-sm">
          <h3 class="text-white font-semibold text-sm">TradLibras</h3>
        </div>
        <div class="p-4">
          <textarea 
            id="tradlibras-input" 
            placeholder="Digite ou fale o texto para traduzir..."
            class="w-full h-16 p-2 bg-white/20 border border-white/30 rounded text-white placeholder-white/60 text-sm resize-none focus:outline-none focus:border-white/50"
          ></textarea>
          <div class="flex mt-2 space-x-2">
            <button id="tradlibras-mic" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs transition-colors">
              🎤 Gravar
            </button>
            <button id="tradlibras-translate" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs transition-colors">
              ▶️ Traduzir
            </button>
          </div>
          <div id="tradlibras-output" class="mt-4 h-20 bg-black/30 rounded flex items-center justify-center text-white/60 text-xs">
            Avatar 3D aparecerá aqui
          </div>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    const micButton = this.container.querySelector('#tradlibras-mic');
    const translateButton = this.container.querySelector('#tradlibras-translate');
    const input = this.container.querySelector('#tradlibras-input') as HTMLTextAreaElement;

    micButton?.addEventListener('click', () => {
      if (this.isRecording) {
        this.stopMic();
        micButton.textContent = '🎤 Gravar';
      } else {
        this.startMic((result) => {
          if (input) {
            input.value = result.text;
          }
        });
        micButton.textContent = '⏹️ Parar';
      }
    });

    translateButton?.addEventListener('click', () => {
      if (input?.value.trim()) {
        this.translate(input.value);
      }
    });
  }

  private mockSignsData(text: string): SignData[] {
    // Mock de dados de sinais baseado no texto
    const words = text.split(' ');
    return words.map((word, index) => ({
      id: `sign_${index}`,
      word,
      animation: `animation_${word.toLowerCase()}`,
      duration: 1.5,
      metadata: { difficulty: 'medium' }
    }));
  }

  private displayTranslation(result: TranslationResult): void {
    if (!this.container) return;

    const output = this.container.querySelector('#tradlibras-output');
    if (output) {
      output.innerHTML = `
        <div class="text-center">
          <div class="text-green-300 text-xs mb-1">Tradução concluída</div>
          <div class="text-white text-xs">${result.signs.length} sinais</div>
          <div class="text-white/60 text-xs">Confiança: ${Math.round(result.confidence * 100)}%</div>
        </div>
      `;
    }
  }
}

// Função de conveniência para uso via UMD
export function createWidget(apiKey: string, containerId: string, options?: TranslationOptions): TradLibras {
  const widget = new TradLibras(apiKey);
  widget.init(containerId, options);
  return widget;
}

// Exportação para uso global (UMD)
if (typeof window !== 'undefined') {
  (window as any).TradLibras = { TradLibras, createWidget, registerWidget };
}

// Exportações padrão
export default TradLibras;

// Web Component
export { LibrasTranslatorWidget, registerWidget } from './widget';