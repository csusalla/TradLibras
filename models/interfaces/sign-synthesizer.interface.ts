export interface PoseKeyframe {
  time: number;
  head: { pitch: number; yaw: number; roll: number };
  leftHand: { x: number; y: number; z: number };
  rightHand: { x: number; y: number; z: number };
}

export interface PoseTimeline {
  fps: number;
  totalDuration: number;
  keyframes: PoseKeyframe[];
}

export interface SignSynthesizerInterface {
  generateTimeline(glosses: string[]): PoseTimeline;
}

