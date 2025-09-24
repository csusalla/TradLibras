import { SignSynthesizerInterface, PoseTimeline, PoseKeyframe } from '../../interfaces/sign-synthesizer.interface';

export class MockSignSynthesizer implements SignSynthesizerInterface {
  generateTimeline(glosses: string[]): PoseTimeline {
    const fps = 30;
    const keyframes: PoseKeyframe[] = [];
    let time = 0;
    for (const gloss of glosses) {
      const duration = gloss.includes('-') ? 1.2 : gloss.includes('_') ? 1.4 : 1.0;
      const steps = Math.max(2, Math.floor(duration * fps / 6));
      for (let i = 0; i <= steps; i++) {
        const t = time + (i / steps) * duration;
        keyframes.push({
          time: parseFloat(t.toFixed(3)),
          head: { pitch: Math.sin(t) * 5, yaw: Math.cos(t * 0.5) * 8, roll: Math.sin(t * 0.3) * 3 },
          leftHand: { x: -0.4 + Math.sin(t * 1.1) * 0.1, y: 1.0 + Math.cos(t * 0.9) * 0.05, z: 0.3 + Math.sin(t * 0.7) * 0.05 },
          rightHand: { x: 0.4 + Math.sin(t * 1.3) * 0.1, y: 1.0 + Math.cos(t * 1.0) * 0.05, z: 0.3 + Math.sin(t * 0.8) * 0.05 },
        });
      }
      time += duration;
    }
    return { fps, totalDuration: parseFloat(time.toFixed(2)), keyframes };
  }
}

