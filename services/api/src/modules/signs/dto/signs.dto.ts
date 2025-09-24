import { ApiProperty } from '@nestjs/swagger';

export class KeyframeDto {
  @ApiProperty() time: number;
  @ApiProperty({ type: 'object' }) head: { pitch: number; yaw: number; roll: number };
  @ApiProperty({ type: 'object' }) leftHand: { x: number; y: number; z: number };
  @ApiProperty({ type: 'object' }) rightHand: { x: number; y: number; z: number };
  @ApiProperty({ type: 'object', required: false, description: 'Non-manual features (e.g., brow raise)' })
  nmf?: { brow: number };
}

export class PoseTimelineDto {
  @ApiProperty({ example: 30 }) fps: number;
  @ApiProperty({ example: 4.2 }) totalDuration: number;
  @ApiProperty({ type: [KeyframeDto] }) keyframes: KeyframeDto[];
}

export class SignGenerateDto {
  @ApiProperty({ type: [String], description: 'Lista de glosas' })
  glosses: string[];
}

