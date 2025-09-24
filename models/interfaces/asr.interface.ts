/**
 * Interface para o módulo ASR (Automatic Speech Recognition)
 */

export interface ASRResult {
  text: string;
  confidence: number;
  language: string;
  duration: number;
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;
  metadata?: {
    processingTime: number;
    model: string;
    sampleRate: number;
    channels: number;
  };
}

export interface ASRConfig {
  language: string;
  model: 'whisper' | 'wav2vec2' | 'vosk' | 'google' | 'azure';
  sampleRate: number;
  enableDiarization?: boolean;
  enablePunctuation?: boolean;
  vocabularyBoost?: string[];
}

export interface ASRInterface {
  /**
   * Transcreve áudio para texto
   */
  transcribe(audioData: Buffer, config?: ASRConfig): Promise<ASRResult>;
  
  /**
   * Transcrição em streaming (tempo real)
   */
  transcribeStream(audioStream: ReadableStream, config?: ASRConfig): AsyncGenerator<ASRResult>;
  
  /**
   * Valida se o áudio está em formato suportado
   */
  validateAudio(audioData: Buffer): boolean;
  
  /**
   * Obtém idiomas suportados
   */
  getSupportedLanguages(): string[];
  
  /**
   * Obtém modelos disponíveis
   */
  getAvailableModels(): string[];
}