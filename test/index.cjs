const test = require('node:test');
const assert = require('node:assert/strict');
const {creativeWork} = require('../dist/index.cjs');

test('date Rus', async () => {
    const context = await creativeWork('В субботу в 13:00 тренировка');
    assert.deepEqual(context.encodingFormat, 'text/plain');
    console.log('context', context);
});

test('date word Rus', async () => {
    {
        const context = await creativeWork('Посмотри двадцать пять тысяч триста сорок два');
        assert.deepEqual(context.text, 'Посмотри 25342');
    }
    {
        const context = await creativeWork('в двадцать три Синк');
        assert.deepEqual(context.text, 'в 23 Синк');
    }
});

test('lang Rus OCR', async () => {
    const context = await creativeWork('«Говорят, цифры управляют миром? | Зы\nНо я знаю, что они точно показывают, | ЭС |\nхорошо или плохо UM управляют» CAN №:\n\n| о SSE, SD ч\nOre | 7 =\"\nК `® 49 © 2 | ®\n\n‚Иоганн Вольфганг фон Гёте © = \\\n31 января 620 года EE\n');
    assert.deepEqual(context.encodingFormat, 'text/plain');
    assert.deepEqual(context.inLanguage, 'ru');
});

test('lang Rus', async () => {
    const context = await creativeWork(' \u001B[4mКакой-то\u001B[0m #интересный падвид <b>ежик</b> ');
    assert.deepEqual(context.encodingFormat, 'text/plain');
    assert.deepEqual(context.inLanguage, 'ru');
    assert.ok(context.keywords.includes('#интересный'));
    assert.ok(context.text.startsWith('Какой-то #интересный подвид ёжик'));
});

test('lang Spanish', async () => {
    const context = await creativeWork('hola erizo como estas #hola #mundo hoy');
    assert.deepEqual(context.encodingFormat, 'text/plain');
    assert.deepEqual(context.inLanguage, 'es');
    assert.ok(context.keywords.includes('#hola'));
});

test('lang Eng', async () => {
    const context = await creativeWork('Hello my friend. How are şüñ ');
    assert.deepEqual(context.encodingFormat, 'text/plain');
    assert.deepEqual(context.inLanguage, 'en');
    assert.ok(context.text.startsWith('Hello my friend. How are sun'));
});

test('lang Und', async () => {
    const context = await creativeWork(' 8:00');
    assert.deepEqual(context.text, '8:00');
});
