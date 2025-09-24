import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SignsService } from './signs.service';
import { SignGenerateDto, PoseTimelineDto } from './dto/signs.dto';

@ApiTags('signs')
@Controller('sign')
@Throttle({ default: { limit: 50, ttl: 60000 } })
export class SignsController {
  constructor(private readonly signsService: SignsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gerar timeline de poses do avatar',
    description: 'Converte glosas em sequência de keyframes de mãos e cabeça (fake)'
  })
  @ApiResponse({ status: 200, description: 'Timeline gerada', type: PoseTimelineDto })
  async generate(@Body() dto: SignGenerateDto): Promise<PoseTimelineDto> {
    return this.signsService.generatePoseTimeline(dto);
  }
}

