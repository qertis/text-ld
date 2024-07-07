// @ts-ignore
import francNode from '@qertis/franc-node';
import {by639_2T} from 'iso-language-codes';
/**
 * @constant
 * @type {string}
 */
export const UNDEFINED: string = 'und';
/**
 * @constant
 * @type {string}
 */
export const ENG: string = 'eng';
/**
 * @constant
 * @type {string}
 */
export const RUS: string = 'rus';
export const ARB: string = 'arb';
export const SPA: string = 'spa';
export const FRA: string = 'fra';
export const CMN: string = 'cmn';
/**
 * @param  {string} languageCode - lang
 * @returns {boolean}
 */
// eslint-disable-next-line
export const isENG = (languageCode: string): boolean => {
  return /en/.test(languageCode);
};
/**
 * @param {string} languageCode - lang
 * @returns {boolean}
 */
export const isRUS = (languageCode: string): boolean => {
  return /ru/.test(languageCode);
};
/**
 * @param {string} query
 * @returns {string}
 */
function getLangCode(query: string) {
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
 * @param {string} query - query
 * @returns {object}
 */
export default (query: string): {code: string, language: string, iso: string} => {
  const langCode = getLangCode(query);
  const language = by639_2T[langCode];
  return {
    code: langCode,
    language: language.name ?? 'simple',
    iso: language.iso639_1,
  }
}
