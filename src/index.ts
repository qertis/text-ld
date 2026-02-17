import Typograf from 'typograf';
import { stripHtml } from 'string-strip-html';
import stripAnsi from 'strip-ansi';
import getLang from './detection-lang';
import getKeywords from './keywords';
import speller from './speller';
import wordsToNumbersRu from './fuzzy-numbers';
import wordsToCurrencyRu from './detect-currencies';

interface ICreativeWork {
    '@type': string
    encodingFormat: string
    text: string
    keywords: string[]
    inLanguage: string
}

export async function creativeWork(text: string): Promise<ICreativeWork> {
    const context = {
        '@type': 'CreativeWork',
        'encodingFormat': 'text/plain',
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
    context.text = await speller(text, context.inLanguage);
    context.text = wordsToCurrencyRu(context.text);
    context.text = wordsToNumbersRu(context.text);

    // todo поддержать язык en-US для Typograf
    if (['ru'].includes(context.inLanguage)) {
        const tp = new Typograf({ locale: [context.inLanguage] });
        context.text = tp.execute(context.text);
    }

    context.keywords = getKeywords(context.text);

    return context;
}
