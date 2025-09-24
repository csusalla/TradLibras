import { GlossTranslatorInterface } from '../../interfaces/gloss-translator.interface';

export class RuleBasedGlossTranslator implements GlossTranslatorInterface {
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

  translateToGlosses(normalizedText: string): string[] {
    if (!normalizedText) return [];

    if (this.phraseDictionary[normalizedText]) {
      return [this.phraseDictionary[normalizedText]];
    }

    const tokens = normalizedText.split(' ');
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
      if (this.wordDictionary[token]) {
        result.push(this.wordDictionary[token]);
      } else {
        result.push(this.fingerspell(token));
      }
      i += 1;
    }
    return result;
  }

  private fingerspell(word: string): string {
    const letters = (word || '').replace(/[^a-zA-ZçÇáàâãéèêíïóôõúüñ]/g, '');
    if (!letters) return '';
    const ascii = letters
      .normalize('NFD')
      .replace(/\p{Diacritic}+/gu, '')
      .toUpperCase();
    return ascii.split('').join('-');
  }
}

