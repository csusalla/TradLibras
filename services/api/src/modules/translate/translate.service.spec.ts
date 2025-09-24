import { Test, TestingModule } from '@nestjs/testing';
import { TranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: TranslateService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TranslateService],
    }).compile();

    service = module.get<TranslateService>(TranslateService);
  });

  it('traduz "Bom dia" para glosa BOM_DIA', async () => {
    const result = await service.translateToLibras({ text: 'Bom dia' });
    expect(result.caption).toContain('BOM_DIA');
  });

  it('traduz "Tudo bem?" para glosa TUDO_BEM', async () => {
    const result = await service.translateToLibras({ text: 'Tudo bem?' });
    expect(result.caption).toContain('TUDO_BEM');
  });

  it('traduz "Meu nome é Ana" usando dactilologia para ANA', async () => {
    const result = await service.translateToLibras({ text: 'Meu nome é Ana' });
    // Espera conter glosas para EU e NOME e soletração de ANA -> A-N-A
    expect(result.caption).toMatch(/EU/);
    expect(result.caption).toMatch(/NOME/);
    expect(result.caption).toMatch(/A-N-A/);
  });
});

