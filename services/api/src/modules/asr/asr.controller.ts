import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AsrService } from './asr.service';
import { AsrDto, AsrResultDto } from './dto/asr.dto';

@ApiTags('asr')
@Controller('asr')
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class AsrController {
  constructor(private readonly asrService: AsrService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Reconhecimento Automático de Fala',
    description: 'Converte áudio em texto usando ASR (Automatic Speech Recognition)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Transcrição realizada com sucesso',
    type: AsrResultDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 429, 
    description: 'Muitas requisições - limite excedido' 
  })
  async recognizeSpeech(@Body() asrDto: AsrDto): Promise<AsrResultDto> {
    return this.asrService.recognizeSpeech(asrDto);
  }

  @Post('stream')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'ASR em Tempo Real',
    description: 'Reconhecimento de fala em streaming para resultados em tempo real'
  })
  async streamRecognition(@Body() asrDto: AsrDto): Promise<AsrResultDto> {
    // TODO: Implementar streaming ASR
    return this.asrService.streamRecognition(asrDto);
  }
}