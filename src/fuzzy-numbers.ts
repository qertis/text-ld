import Fuse from 'fuse.js';

// Словарь чисел на русском языке (включает порядковые формы)
const numberMap = {
    'ноль': 0, 'один': 1, 'одна': 1, 'первый': 1, 'первое': 1,
    'два': 2, 'две': 2, 'второй': 2, 'второе': 2,
    'три': 3, 'третий': 3, 'третье': 3, 'четыре': 4, 'четвертый': 4, 'четвертое': 4,
    'пять': 5, 'пятый': 5, 'пятое': 5, 'шесть': 6, 'шестой': 6, 'шестое': 6,
    'семь': 7, 'седьмой': 7, 'седьмое': 7, 'восемь': 8, 'восьмой': 8, 'восьмое': 8,
    'девять': 9, 'девятый': 9, 'девятое': 9, 'десять': 10, 'десятый': 10, 'десятое': 10,
    'одиннадцать': 11, 'двенадцать': 12, 'тринадцать': 13,
    'четырнадцать': 14, 'пятнадцать': 15, 'шестнадцать': 16,
    'семнадцать': 17, 'восемнадцать': 18, 'девятнадцать': 19,
    'двадцать': 20, 'двадцать первый': 21, 'тридцать': 30,
    'сорок': 40, 'пятьдесят': 50, 'шестьдесят': 60, 'семьдесят': 70,
    'восемьдесят': 80, 'девяносто': 90,
    'сто': 100, 'двести': 200, 'триста': 300,
    'четыреста': 400, 'пятьсот': 500, 'шестьсот': 600,
    'семьсот': 700, 'восемьсот': 800, 'девятьсот': 900,
    'тысяча': 1000, 'тысячный': 1000, 'тысячное': 1000,
};

const THRESHOLD = 0.3; // Чем ниже, тем точнее совпадение

const fuse = new Fuse(Object.keys(numberMap), {
    includeScore: true,
    threshold: THRESHOLD,
});

/**
 * @description Преобразование текста в число
 * @param {string} text
 * @returns {string}
 */
export default function (text: string): string {
    const words = text.split(' ');
    const output = [];
    let result = 0, current = 0;
    let numberFound = false;

    words.forEach((word) => {
        if (word.length < 3) {
            output.push(word);
            return;
        }
        const [match] = fuse.search(word); // Ищем ближайшее совпадение

        if (match) {
            const num = numberMap[match.item];
            numberFound = true;

            if (num >= 1_000) {
                result += (current || 1) * num;
                current = 0;
            } else if (num >= 100) {
                current = (current || 1) * num;
            } else {
                current += num;
            }
        } else {
            if (numberFound || current > 0) {
                result += current;
                output.push(result.toString());
                current = 0;
                result = 0;
                numberFound = false;
            }
            output.push(word);
        }
    });

    if (numberFound || current > 0) {
        result += current;
        output.push(String(result));
    }

    return output.join(' ');
}
