import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, Length } from 'class-validator';

export class TranslateDto {
  @ApiProperty({ description: 'Texto em PT-BR para traduzir para Libras' })
  @IsString()
  @Length(1, 500)
  text: string;

  @ApiProperty({ enum: ['pt-BR'], default: 'pt-BR', required: false })
  @IsEnum(['pt-BR'])
  @IsOptional()
  language?: 'pt-BR' = 'pt-BR';
}

export class GlossTimingDto {
  @ApiProperty({ description: 'Glosa em formato canônico', example: 'BOM_DIA' })
  gloss: string;

  @ApiProperty({ description: 'Tempo inicial em segundos', example: 0 })
  start: number;

  @ApiProperty({ description: 'Tempo final em segundos', example: 1.2 })
  end: number;
}

export class TranslateResultDto {
  @ApiProperty({ description: 'Texto normalizado', example: 'bom dia' })
  normalizedText: string;

  @ApiProperty({ type: [GlossTimingDto] })
  glosses: GlossTimingDto[];

  @ApiProperty({ description: 'Legenda de glosas concatenadas', example: 'BOM_DIA' })
  caption: string;
}

