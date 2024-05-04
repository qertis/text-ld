// @ts-ignore
import Eyo from 'eyo-kernel';
import { isENG, isRUS } from './detection-lang';

/**
 * @constant
 * @type {string}
 */
const SPELLER_HOST: string = 'speller.yandex.net';
/**
 * @param {object} obj - object
 * @param {string} obj.text - Текст для проверки
 * @param {string} obj.lang - Языки проверки
 * @param {string} obj.format - Формат проверяемого текста
 * @param {number} obj.options - Опции Яндекс.Спеллера. Значением параметра является сумма значений требуемых опций
 * @returns {Promise<Array<Object>|ReferenceError>}
 */
const spellText = async ({
  text,
  lang = 'ru,en',
  options = 0,
  format = 'plain',
}: { text: string; lang?: string; options?: number; format?: string }): Promise<{ s: string, len: number, pos: number }[] | ReferenceError> => {
  const response = await fetch(`https://${SPELLER_HOST}/services/spellservice.json/checkText`, {
    method: "POST",
    body: `text=${text}&lang=${lang}&options=${options}&format=${format}`,
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    signal: AbortSignal.timeout(1000),
  });
  const result = await response.json();
  if (!Array.isArray(result)) {
    throw new ReferenceError('spellCheck API changes');
  }
  return result;
};

/**
 * @param {string} string - string
 * @param {number} start - start
 * @param {number} end - end
 * @param {string} what - what text
 * @returns {string}
 */
const replaceBetween = (string: string, start: number, end: number, what: string): string => {
  return string.slice(0, start) + what + string.slice(end);
};

/**
 * @description Исправляем очевидные ошибки. Важно! Данные берутся относительно текущего месторасположения, включая VPN
 * @example // рублей
 * spellText('рублкй');
 *
 * @param {string} text - user text
 * @param {string} [lang] - text language
 * @returns {Promise<string>}
 */
const correctionText = async (text: string, lang?: string): Promise<string> => {
  if (!text) {
    throw new Error('Text is undefined');
  }
  let out = text;
  const array = await spellText({
    text,
    lang,
  });
  // @ts-ignore
  for (const {s, len, pos} of array) {
    const [replacedWord] = s;
    out = replaceBetween(out, pos, pos + len, replacedWord);
  }

  return out;
};

/**
 * @description Автоматическое исправление опечаток
 * @param {string} text - text
 * @param {string} language - text
 * @returns {Promise<string>}
 */
export default (text: string, language: string): Promise<string> => {
  if (isRUS(language)) {
    // ёфикация текста
    const safeEyo = new Eyo();
    safeEyo.dictionary.loadSafeSync();
    text = safeEyo.restore(text);
  } else if (isENG(language)) {
    // english rules
    // ...
  } else {
    // пока только поддерживаем языки EN, RU
    console.warn('Unsupported language');
    return Promise.resolve(text);
  }
  return correctionText(text, language);
};
