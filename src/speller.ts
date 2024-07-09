// @ts-ignore
import Eyo from 'eyo-kernel';
import anglicize from 'anglicize';
import { by639_1 } from 'iso-language-codes';
import { RUS, ENG } from './detection-lang';

const safeEyo = new Eyo();
safeEyo.dictionary.loadSafeSync();

/**
 * @description Автоматическое исправление опечаток
 * @param {string} text - text
 * @param {string} lang - language
 * @returns {string}
 */
export default (text: string, lang: string): string => {
  switch (by639_1[lang]?.iso639_2T) {
    case RUS: {
      // ёфикация текста
      return safeEyo.restore(text);
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
