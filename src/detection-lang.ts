// @ts-ignore
import francNode from '@qertis/franc-node';
import {by639_2T} from 'iso-language-codes';
/**
 * @constant
 */
export const UNDEFINED: string = 'und';
/**
 * @constant
 */
export const ENG: string = 'eng';
/**
 * @constant
 */
export const RUS: string = 'rus';
export const ARB: string = 'arb';
export const SPA: string = 'spa';
export const FRA: string = 'fra';
export const CMN: string = 'cmn';

function getLangCode(query: string): string {
  const langCode = francNode.franc(query, {
    whitelist: [RUS, ENG, ARB, SPA, FRA, CMN],
  });
  if (langCode === UNDEFINED) {
    if (/[А-Я]/i.test(query)) {
      return RUS;
      // eslint-disable-next-line
    } else if (/[A-Z]/i.test(query)) {
      return ENG;
    }
  }
  return langCode;
}
/**
 * @description Извлечение языка текста
 */
export default (query: string): string => {
  const langCode = getLangCode(query);
  return by639_2T[langCode]?.iso639_1 ?? 'eng';
}
