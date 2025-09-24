import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TranslateService } from './translate.service';
import { TranslateDto, TranslateResultDto } from './dto/translate.dto';

@ApiTags('translate')
@Controller('translate')
@Throttle({ default: { limit: 50, ttl: 60000 } })
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Tradução para Libras',
    description: 'Converte texto em português para sequência de sinais em Libras'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tradução realizada com sucesso',
    type: TranslateResultDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Texto inválido ou muito longo' 
  })
  async translateToLibras(@Body() translateDto: TranslateDto): Promise<TranslateResultDto> {
    return this.translateService.translateToLibras(translateDto);
  }
}