import { Test, TestingModule } from '@nestjs/testing';
import { SignsService } from './signs.service';

describe('SignsService', () => {
  let service: SignsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignsService],
    }).compile();
    service = module.get(SignsService);
  });

  it('gera timeline com fps 30 para glosas simples', async () => {
    const result = await service.generatePoseTimeline({ glosses: ['BOM_DIA', 'EU', 'NOME', 'A-N-A'] });
    expect(result.fps).toBe(30);
    expect(result.totalDuration).toBeGreaterThan(0);
    expect(result.keyframes.length).toBeGreaterThan(0);
  });
});

