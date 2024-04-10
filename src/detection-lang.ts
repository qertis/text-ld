// @ts-ignore
import francNode from '@qertis/franc-node';

/**
 * @constant
 * @type {string}
 */
export const UNDEFINED = 'und';
/**
 * @constant
 * @type {string}
 */
export const ENG = 'eng';
/**
 * @constant
 * @type {string}
 */
export const RUS = 'rus';
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
 * rus -> ru; eng -> en
 *
 * @param {string} language - lang
 * @returns {string}
 */
const langISO = (language: string): string => {
  return language.slice(0, 2);
}
/**
 * @param {string} langCode - query
 * @returns {string}
 */
const fullLangCode = (langCode: string): string => {
  switch (langCode) {
    case RUS:
      return 'russian';
    case ENG:
      return 'english';
    default:
      return 'simple';
  }
}
/**
 * @param {string} query
 * @returns {string}
 */
function getlangCode(query: string) {
  let langCode = francNode.franc(query, { whitelist: [RUS, ENG] });
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
  const langCode = getlangCode(query);
  const language = fullLangCode(langCode);
  return {
    code: langCode,
    language: language,
    iso: langISO(language),
  };
};
