import getLang from './detection-lang';
import getSpeller from './speller';
import getSuggest from './suggest';
import getKeywords from './keywords';

interface ICreativeWork {
    '@type': string
    encodingFormat: string
    text: string
    keywords: string[]
    inLanguage: string
}

export default async (text: string) => {
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
    context.inLanguage = getLang(text).iso;
    try {
        text = await getSuggest(text, context.inLanguage);
    } catch (error) {
        console.warn('Yandex Suggest ERROR:', error);
    }
    try {
        text = await getSpeller(text, context.inLanguage);
    } catch (error) {
        console.warn('Yandex Speller ERROR:', error);
    }
    context.text = text;
    context.keywords = getKeywords(text);

    return context;
}
