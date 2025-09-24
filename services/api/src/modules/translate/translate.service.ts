import { Injectable, Logger } from '@nestjs/common';
import { TranslateDto, TranslateResultDto, GlossTimingDto } from './dto/translate.dto';

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);

  private readonly phraseDictionary: Record<string, string> = {
    'bom dia': 'BOM_DIA',
    'tudo bem': 'TUDO_BEM',
  };

  private readonly wordDictionary: Record<string, string> = {
    'eu': 'EU',
    'meu': 'EU',
    'minha': 'EU',
    'nome': 'NOME',
    'oi': 'OLA',
    'olá': 'OLA',
    'ola': 'OLA',
    'bom': 'BOM',
    'dia': 'DIA',
    'tudo': 'TUDO',
    'bem': 'BEM',
  };

  async translateToLibras(dto: TranslateDto): Promise<TranslateResultDto> {
    const normalized = this.normalizeText(dto.text);
    this.logger.log(`Traduzindo: "${normalized}"`);

    const glosses = this.textToGlosses(normalized);

    // Gerar timing simples: 1s por glosa
    const timings: GlossTimingDto[] = [];
    let currentTime = 0;
    for (const gloss of glosses) {
      const duration = this.estimateGlossDuration(gloss);
      timings.push({ gloss, start: currentTime, end: currentTime + duration });
      currentTime += duration;
    }

    return {
      normalizedText: normalized,
      glosses: timings,
      caption: glosses.join(' '),
    };
  }

  private normalizeText(text: string): string {
    // lower, trim, remove punctuation, collapse spaces, remove diacritics
    const lower = (text || '').toLowerCase();
    const noDiacritics = lower.normalize('NFD').replace(/\p{Diacritic}+/gu, '');
    const noPunct = noDiacritics.replace(/[\p{P}\p{S}]+/gu, ' ');
    const normalized = noPunct.replace(/\s+/g, ' ').trim();
    // remove stopwords simples que não afetam glosas (ex.: artigos, preps curtas)
    const stopwords = new Set(['o','a','os','as','de','do','da','dos','das','um','uma','e','é','ser','que']);
    const filtered = normalized
      .split(' ')
      .filter((t) => !stopwords.has(t))
      .join(' ')
      .trim();
    return filtered || normalized;
  }

  private textToGlosses(normalized: string): string[] {
    if (!normalized) return [];

    // 1) frase inteira conhecida
    if (this.phraseDictionary[normalized]) {
      return [this.phraseDictionary[normalized]];
    }

    // 2) tentar casar bigramas
    const tokens = normalized.split(' ');
    const result: string[] = [];
    let i = 0;
    while (i < tokens.length) {
      const bigram = i + 1 < tokens.length ? `${tokens[i]} ${tokens[i + 1]}` : '';
      if (bigram && this.phraseDictionary[bigram]) {
        result.push(this.phraseDictionary[bigram]);
        i += 2;
        continue;
      }

      const token = tokens[i];
      // 3) palavra conhecida
      if (this.wordDictionary[token]) {
        result.push(this.wordDictionary[token]);
      } else {
        // 4) dactilologia para palavras desconhecidas
        result.push(this.fingerspell(token));
      }
      i += 1;
    }
    return result;
  }

  private fingerspell(word: string): string {
    // Soletração em letras maiúsculas separadas por '-'
    const letters = (word || '').replace(/[^a-zA-ZçÇáàâãéèêíïóôõúüñ]/g, '');
    if (!letters) return '';
    const ascii = letters
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .toUpperCase();
    return ascii.split('').join('-');
  }

  private estimateGlossDuration(gloss: string): number {
    // Glosas compostas levemente mais longas
    if (gloss.includes('_')) return 1.4;
    // Soletração: 0.4s por letra, min 1.0s
    if (gloss.includes('-')) return Math.max(1.0, gloss.split('-').length * 0.4);
    return 1.0;
  }
}

