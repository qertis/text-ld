import Fuse from 'fuse.js';

// Словарь валют на русском языке
const currencyMap = {
    'доллар': '$', 'долларов': '$', 'бакс': '$', 'баксов': '$',
    'евро': '€',
    'рубль': '₽', 'руб.': '₽', 'рублей': '₽', 'рубли': '₽',
    'фунт': '£', 'фунтов': '£',
    'рупия': '₹', 'рупий': '₹',
};

const THRESHOLD = 0.1;

const fuse = new Fuse(Object.keys(currencyMap), {
    threshold: THRESHOLD,
});

export default function (text: string): string {
    for (let word of text.split(' ')) {
        if (word.length <= 3) {
            continue;
        }
        const [match] = fuse.search(word.toLowerCase());
        if (match) {
            const num = currencyMap[match.item];
            text = text.replace(word, String(num));
        }
    }

    return text;
}
