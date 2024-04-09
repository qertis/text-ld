const yu = '5519222721557041240';
/**
 * @param {string} text
 * @param {string} lang
 * @returns {Promise<any>}
 */
export const suggest = async (text: string, lang: string): Promise<any[]> => {
    text = encodeURIComponent(text);
    const response = await fetch(`https://suggest.yandex.ru/suggest-ff.cgi?part=${text}&amp;uil=${lang}&amp;v=3&amp;sn=5&amp;lr=10371&amp;yu=${yu}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: AbortSignal.timeout(1000),
    });
    return response.json();
}
/**
 * @param {string} text
 * @returns {number}
 */
const getWordsCount = (text: string): number => text.split(' ').length;
/**
 * @param {string} newText
 * @param {string} oldText
 * @returns {string}
 */
const textCaseFormat = (newText: string, oldText: string) => {
    let out = '';
    for (let i = 0; i < newText.length; i++) {
        out += oldText[i]?.toLowerCase() === newText[i] ? oldText[i] : newText[i];
    }
    return out;
}
/**
 * @param {string} text
 * @param {string} lang
 * @returns {Promise<*>}
 */
export default async (text: string, lang: string): Promise<any> => {
    const wordsCount = getWordsCount(text);
    const [defaultText, result] = await suggest(text, lang);
    const resultFilter = result.filter((res: string) => {
        return wordsCount === getWordsCount(res);
    });
    if (resultFilter.length === 0) {
        return textCaseFormat(defaultText, text);
    }
    return textCaseFormat(resultFilter[0], text);
}
