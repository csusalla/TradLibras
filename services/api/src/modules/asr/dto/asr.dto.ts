import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';

export class AsrDto {
  @ApiProperty({ 
    description: 'Áudio codificado em base64',
    example: 'UklGRnoGAABXQVZFZm10...' 
  })
  @IsString()
  audioData: string;

  @ApiProperty({ 
    description: 'Formato do áudio',
    enum: ['wav', 'mp3', 'ogg', 'webm'],
    default: 'wav' 
  })
  @IsEnum(['wav', 'mp3', 'ogg', 'webm'])
  @IsOptional()
  format?: string = 'wav';

  @ApiProperty({ 
    description: 'Idioma do áudio',
    enum: ['pt-BR', 'en-US'],
    default: 'pt-BR' 
  })
  @IsEnum(['pt-BR', 'en-US'])
  @IsOptional()
  language?: string = 'pt-BR';

  @ApiProperty({ 
    description: 'Duração do áudio em segundos',
    minimum: 0.1,
    maximum: 60 
  })
  @IsNumber()
  @Min(0.1)
  @Max(60)
  duration: number;

  @ApiProperty({ 
    description: 'Taxa de amostragem do áudio',
    default: 16000 
  })
  @IsNumber()
  @IsOptional()
  sampleRate?: number = 16000;
}

export class AsrResultDto {
  @ApiProperty({ 
    description: 'Texto transcrito',
    example: 'Olá, como você está?' 
  })
  text: string;

  @ApiProperty({ 
    description: 'Nível de confiança da transcrição',
    minimum: 0,
    maximum: 1,
    example: 0.87 
  })
  confidence: number;

  @ApiProperty({ 
    description: 'Idioma detectado',
    example: 'pt-BR' 
  })
  language: string;

  @ApiProperty({ 
    description: 'Duração do áudio processado',
    example: 3.5 
  })
  duration: number;

  @ApiProperty({ 
    description: 'Alternativas de transcrição',
    type: [Object],
    example: [
      { text: 'como você está hoje?', confidence: 0.85 },
      { text: 'como você está tudo bem?', confidence: 0.73 }
    ]
  })
  alternatives?: Array<{
    text: string;
    confidence: number;
  }>;

  @ApiProperty({ 
    description: 'Metadados do processamento',
    example: {
      processingTime: 1.2,
      model: 'whisper-large-v3',
      sampleRate: 16000,
      channels: 1
    }
  })
  metadata?: Record<string, any>;
}