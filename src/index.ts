import { stripHtml } from 'string-strip-html';
import stripAnsi from 'strip-ansi';
import getLang from './detection-lang';
import getKeywords from './keywords';
import speller from './speller';

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
    text = stripHtml(text).result;
    text = stripAnsi(text);
    context.inLanguage = getLang(text);
    context.text = speller(text, context.inLanguage);
    context.keywords = getKeywords(text);

    return context;
}
