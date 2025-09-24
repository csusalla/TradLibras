import { Injectable } from '@nestjs/common';
import { SignGenerateDto, PoseTimelineDto, KeyframeDto } from './dto/signs.dto';

@Injectable()
export class SignsService {
  async generatePoseTimeline(dto: SignGenerateDto): Promise<PoseTimelineDto> {
    const fps = 30;
    const baseDurationPerGloss = 1.0; // segundos
    const glosses = dto.glosses || [];
    // adiciona 0.2s entre glosas para coarticulação/transition
    const transitionDuration = 0.2;
    const totalDuration = glosses.length > 0
      ? glosses.length * baseDurationPerGloss + Math.max(0, glosses.length - 1) * transitionDuration
      : 0;

    const keyframes: KeyframeDto[] = [];

    let time = 0;
    // posição base inicial
    let prevPose = {
      left: { x: -0.4, y: 1.0, z: 0.3 },
      right: { x: 0.4, y: 1.0, z: 0.3 },
      head: { pitch: 0, yaw: 0, roll: 0 },
    };

    for (let gi = 0; gi < glosses.length; gi++) {
      const gloss = glosses[gi];
      const duration = gloss.includes('-') ? 1.2 : gloss.includes('_') ? 1.4 : 1.0;
      const steps = Math.max(2, Math.floor(duration * fps / 6));

      // alvo simples por glosa: variar ligeiramente por índice para mãos
      const glossSeed = gi + 1;
      const targetPose = {
        left: {
          x: -0.4 + Math.sin(glossSeed * 0.9) * 0.15,
          y: 1.0 + Math.cos(glossSeed * 0.7) * 0.08,
          z: 0.3 + Math.sin(glossSeed * 0.5) * 0.08,
        },
        right: {
          x: 0.4 + Math.sin(glossSeed * 1.1) * 0.15,
          y: 1.0 + Math.cos(glossSeed * 0.8) * 0.08,
          z: 0.3 + Math.sin(glossSeed * 0.6) * 0.08,
        },
        head: { pitch: Math.sin(glossSeed * 0.6) * 4, yaw: Math.cos(glossSeed * 0.4) * 6, roll: Math.sin(glossSeed * 0.3) * 2 },
      };

      // envelope NMF básico (0..1) por glosa
      const nmfPeak = gloss.includes('_') ? 0.8 : 0.5; // frases compostas enfatizam sobrancelha
      const nmf = (alpha: number) => {
        // ataque-decay simples
        const attack = Math.min(1, alpha * 2);
        const decay = Math.max(0, 1 - Math.max(0, alpha - 0.5) * 2);
        return nmfPeak * Math.min(attack, decay);
      };

      for (let i = 0; i <= steps; i++) {
        const localAlpha = i / steps;
        const t = time + localAlpha * duration;

        // coarticulação: interpolar de prevPose -> targetPose
        const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
        const leftHand = {
          x: lerp(prevPose.left.x, targetPose.left.x, localAlpha),
          y: lerp(prevPose.left.y, targetPose.left.y, localAlpha),
          z: lerp(prevPose.left.z, targetPose.left.z, localAlpha),
        };
        const rightHand = {
          x: lerp(prevPose.right.x, targetPose.right.x, localAlpha),
          y: lerp(prevPose.right.y, targetPose.right.y, localAlpha),
          z: lerp(prevPose.right.z, targetPose.right.z, localAlpha),
        };
        // head nod leve + rotação baseada no envelope NMF
        const nmfVal = nmf(localAlpha);
        const head = {
          pitch: lerp(prevPose.head.pitch, targetPose.head.pitch, localAlpha) + Math.sin(t * 2.0) * 1.0 + nmfVal * 2.0,
          yaw: lerp(prevPose.head.yaw, targetPose.head.yaw, localAlpha),
          roll: lerp(prevPose.head.roll, targetPose.head.roll, localAlpha),
        };

        keyframes.push({ time: parseFloat(t.toFixed(3)), head, leftHand, rightHand, nmf: { brow: parseFloat(nmfVal.toFixed(3)) } });
      }

      time += duration;

      // transição de coarticulação para a próxima glosa
      if (gi < glosses.length - 1) {
        const transSteps = Math.max(1, Math.floor(transitionDuration * fps / 6));
        const startPose = targetPose;
        // próxima pose alvo (prevista) para orientar a transição
        const nextSeed = gi + 2;
        const nextPose = {
          left: {
            x: -0.4 + Math.sin(nextSeed * 0.9) * 0.15,
            y: 1.0 + Math.cos(nextSeed * 0.7) * 0.08,
            z: 0.3 + Math.sin(nextSeed * 0.5) * 0.08,
          },
          right: {
            x: 0.4 + Math.sin(nextSeed * 1.1) * 0.15,
            y: 1.0 + Math.cos(nextSeed * 0.8) * 0.08,
            z: 0.3 + Math.sin(nextSeed * 0.6) * 0.08,
          },
          head: { pitch: Math.sin(nextSeed * 0.6) * 4, yaw: Math.cos(nextSeed * 0.4) * 6, roll: Math.sin(nextSeed * 0.3) * 2 },
        };

        for (let i = 1; i <= transSteps; i++) {
          const alpha = i / transSteps;
          const t = time + alpha * transitionDuration;
          const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
          const leftHand = {
            x: lerp(startPose.left.x, nextPose.left.x, alpha),
            y: lerp(startPose.left.y, nextPose.left.y, alpha),
            z: lerp(startPose.left.z, nextPose.left.z, alpha),
          };
          const rightHand = {
            x: lerp(startPose.right.x, nextPose.right.x, alpha),
            y: lerp(startPose.right.y, nextPose.right.y, alpha),
            z: lerp(startPose.right.z, nextPose.right.z, alpha),
          };
          const head = {
            pitch: lerp(startPose.head.pitch, nextPose.head.pitch, alpha),
            yaw: lerp(startPose.head.yaw, nextPose.head.yaw, alpha),
            roll: lerp(startPose.head.roll, nextPose.head.roll, alpha),
          };
          keyframes.push({ time: parseFloat(t.toFixed(3)), head, leftHand, rightHand, nmf: { brow: 0 } });
        }
        time += transitionDuration;
        prevPose = nextPose; // preparar pose anterior para a próxima glosa
      } else {
        prevPose = targetPose;
      }
    }

    return { fps, totalDuration: parseFloat(totalDuration.toFixed(2)), keyframes };
  }
}

