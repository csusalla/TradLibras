import { Injectable } from '@nestjs/common';
import { SignGenerateDto, PoseTimelineDto, KeyframeDto } from './dto/signs.dto';

@Injectable()
export class SignsService {
  async generatePoseTimeline(dto: SignGenerateDto): Promise<PoseTimelineDto> {
    const fps = 30;
    const baseDurationPerGloss = 1.0; // segundos
    const totalDuration = (dto.glosses?.length || 0) * baseDurationPerGloss;

    const keyframes: KeyframeDto[] = [];

    let time = 0;
    for (const gloss of dto.glosses || []) {
      const duration = gloss.includes('-') ? 1.2 : gloss.includes('_') ? 1.4 : 1.0;
      const steps = Math.max(2, Math.floor(duration * fps / 6));

      for (let i = 0; i <= steps; i++) {
        const t = time + (i / steps) * duration;
        // Pequenas variações para mãos e cabeça para simular animação
        const head = {
          pitch: Math.sin(t) * 5,
          yaw: Math.cos(t * 0.5) * 8,
          roll: Math.sin(t * 0.3) * 3,
        };
        const leftHand = {
          x: -0.4 + Math.sin(t * 1.1) * 0.1,
          y: 1.0 + Math.cos(t * 0.9) * 0.05,
          z: 0.3 + Math.sin(t * 0.7) * 0.05,
        };
        const rightHand = {
          x: 0.4 + Math.sin(t * 1.3) * 0.1,
          y: 1.0 + Math.cos(t * 1.0) * 0.05,
          z: 0.3 + Math.sin(t * 0.8) * 0.05,
        };
        keyframes.push({ time: parseFloat(t.toFixed(3)), head, leftHand, rightHand });
      }
      time += duration;
    }

    return { fps, totalDuration: parseFloat(totalDuration.toFixed(2)), keyframes };
  }
}

