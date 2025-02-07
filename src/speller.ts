// @ts-ignore
import Eyo from 'eyo-kernel';
import anglicize from 'anglicize';
import { by639_1 } from 'iso-language-codes';
import dictionaryRu from 'dictionary-ru';
import { RUS, ENG } from './detection-lang';
import retextCorrectionText from './retext';
import wordsToNumbersRu from './fuzzy-numbers';

const safeEyo = new Eyo();
safeEyo.dictionary.loadSafeSync();

/**
 * @description Автоматическое исправление опечаток
 * @param {string} text - text
 * @param {string} lang - language
 * @returns {string}
 */
export default async (text: string, lang: string): Promise<string> => {
  switch (by639_1[lang]?.iso639_2T) {
    case RUS: {
      // ёфикация текста
      try {
        text = safeEyo.restore(text);
      } catch (error) {
        console.warn('eyo: ', error.message);
      }
      try {
        text = await retextCorrectionText(text, dictionaryRu);
      } catch (error) {
        console.warn('Retext: ', error.message);
      }

      text = wordsToNumbersRu(text);

      return text;
    }
    case ENG: {
      // англификация текста
      return anglicize(text);
    }
    default: {
      return text;
    }
  }
};
