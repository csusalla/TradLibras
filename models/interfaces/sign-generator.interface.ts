/**
 * Interface para o gerador de sinais de Libras
 */

export interface SignData {
  id: string;
  word: string;
  category: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction';
  animation: {
    type: '3d' | '2d' | 'video';
    data: string; // JSON, base64, ou URL
    duration: number;
    fps: number;
  };
  handshape?: {
    dominant: string;
    nonDominant?: string;
  };
  movement?: {
    type: 'linear' | 'circular' | 'oscillating' | 'static';
    direction?: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward';
    speed: 'slow' | 'medium' | 'fast';
  };
  location?: {
    primary: string;
    secondary?: string;
  };
  metadata?: {
    difficulty: 'easy' | 'medium' | 'hard';
    frequency: number; // 0-100
    region?: 'national' | 'regional';
    variations?: SignData[];
  };
}

export interface SignSequence {
  id: string;
  signs: SignData[];
  totalDuration: number;
  transitions: Array<{
    from: string;
    to: string;
    duration: number;
    type: 'smooth' | 'pause' | 'emphasis';
  }>;
  metadata?: {
    complexity: 'simple' | 'medium' | 'complex';
    confidence: number;
    alternativeSequences?: SignSequence[];
  };
}

export interface SignGeneratorConfig {
  avatarType: '3d' | '2d' | 'video';
  quality: 'low' | 'medium' | 'high';
  speed: number; // 0.5 - 2.0
  includeTransitions: boolean;
  includeFingerSpelling: boolean;
  dialectPreference?: 'standard' | 'regional';
}

export interface SignGeneratorInterface {
  /**
   * Gera sinal individual para uma palavra
   */
  generateSign(word: string, config?: SignGeneratorConfig): Promise<SignData>;
  
  /**
   * Gera sequência de sinais para uma frase
   */
  generateSequence(
    words: string[],
    nluResult?: any,
    config?: SignGeneratorConfig
  ): Promise<SignSequence>;
  
  /**
   * Busca sinal no dicionário
   */
  lookupSign(word: string): Promise<SignData | null>;
  
  /**
   * Gera soletração digital para palavras não encontradas
   */
  generateFingerSpelling(word: string): Promise<SignData>;
  
  /**
   * Valida se um sinal existe no dicionário
   */
  hasSign(word: string): Promise<boolean>;
  
  /**
   * Obtém sinais relacionados ou similares
   */
  getSimilarSigns(word: string, limit?: number): Promise<SignData[]>;
  
  /**
   * Combina múltiplos sinais em uma sequência fluida
   */
  createFluentSequence(signs: SignData[]): Promise<SignSequence>;
  
  /**
   * Exporta sinal em diferentes formatos
   */
  exportSign(signData: SignData, format: 'json' | 'glb' | 'fbx' | 'mp4'): Promise<Buffer>;
}