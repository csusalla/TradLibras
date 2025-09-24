/**
 * Interface para o módulo NLU (Natural Language Understanding)
 */

export interface Entity {
  text: string;
  label: string;
  start: number;
  end: number;
  confidence: number;
}

export interface Token {
  text: string;
  pos: string;
  lemma: string;
  isStop: boolean;
  isAlpha: boolean;
}

export interface Intent {
  name: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export interface NLUResult {
  text: string;
  entities: Entity[];
  tokens: Token[];
  intent?: Intent;
  sentiment?: {
    polarity: number; // -1 a 1
    subjectivity: number; // 0 a 1
  };
  language: string;
  complexity: 'simple' | 'medium' | 'complex';
  metadata?: {
    processingTime: number;
    model: string;
    confidence: number;
  };
}

export interface NLUConfig {
  language: string;
  model: 'spacy' | 'bert' | 'transformer' | 'custom';
  enableSentiment?: boolean;
  enableEntities?: boolean;
  customEntities?: string[];
  intentClassification?: boolean;
}

export interface NLUInterface {
  /**
   * Processa texto e extrai informações semânticas
   */
  process(text: string, config?: NLUConfig): Promise<NLUResult>;
  
  /**
   * Analisa sentimento do texto
   */
  analyzeSentiment(text: string): Promise<{
    polarity: number;
    subjectivity: number;
  }>;
  
  /**
   * Extrai entidades nomeadas
   */
  extractEntities(text: string): Promise<Entity[]>;
  
  /**
   * Classifica intenção do texto
   */
  classifyIntent(text: string): Promise<Intent>;
  
  /**
   * Tokeniza texto
   */
  tokenize(text: string): Promise<Token[]>;
  
  /**
   * Verifica complexidade do texto para tradução
   */
  assessComplexity(text: string): Promise<'simple' | 'medium' | 'complex'>;
}