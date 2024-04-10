/**
 * @param {string} text
 * @returns {string[]}
 */
export default (text: string): string[] => {
    const keywords = text.match(/#\w+/g) ?? [];
    const rusKeywords = text.match(/#[а-яА-ЯЁё]+/g) ?? [];
    return [...keywords, ...rusKeywords];
}
