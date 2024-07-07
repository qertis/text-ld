import getLang from './detection-lang';
import getSpeller from './speller';
import getSuggest from './suggest';
import getKeywords from './keywords';

const SUGGEST_LIMIT = 256;
const SPELLER_LIMIT = 512;

interface ICreativeWork {
    '@type': string
    encodingFormat: string
    text: string
    keywords: string[]
    inLanguage: string
}
/**
 * @param {string} text
 * @returns {Promise<ICreativeWork>}
 */
export async function creativeWork(text: string) {
    const context = {
        '@type': 'CreativeWork',
        'encodingFormat': 'plain/text',
    } as ICreativeWork;
    if (text.startsWith(' ')) {
        text = text.trimStart();
    }
    if (text.endsWith(' ')) {
        text = text.trimEnd();
    }
    context.keywords = getKeywords(text);
    context.inLanguage = getLang(text).iso;
    if (text.length < SUGGEST_LIMIT) {
        try {
            text = await getSuggest(text, context.inLanguage);
        } catch (error) {
            console.warn('Yandex Suggest disabled:', error);
        }
    }
    if (text.length < SPELLER_LIMIT) {
        try {
            text = await getSpeller(text, context.inLanguage);
        } catch (error) {
            console.warn('Yandex Speller disabled:', error);
        }
    }
    context.text = text;

    return context;
}
