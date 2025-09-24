import { NormalizerInterface } from '../../interfaces/normalizer.interface';

export class RuleBasedNormalizer implements NormalizerInterface {
  normalize(text: string): string {
    const lower = (text || '').toLowerCase();
    const noDiacritics = lower.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
    const noPunct = noDiacritics.replace(/[\p{P}\p{S}]+/gu, ' ');
    return noPunct.replace(/\s+/g, ' ').trim();
  }
}

