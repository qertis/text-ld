const test = require('node:test');
const assert = require('node:assert/strict');
const {creativeWork} = require('../dist/index.cjs');

test('lang Rus', async () => {
    const context = await creativeWork(' \u001B[4mКакой-то\u001B[0m #интересный <b>ежик</b> ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'ru');
    assert.ok(context.keywords.includes('#интересный'));
    assert.ok(context.text.startsWith('Какой-то #интересный ёжик'));
});

test('lang Spanish', async () => {
    const context = await creativeWork('hola erizo como estas #hola #mundo hoy');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'es');
    assert.ok(context.keywords.includes('#hola'));
});

test('lang Eng', async () => {
    const context = await creativeWork('Hello my friend. How are şüñ ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'en');
    assert.ok(context.text.startsWith('Hello my friend. How are sun'));
});

test('lang Und', async () => {
    const context = await creativeWork(' 8:00');
    assert.deepEqual(context.text, '8:00');
});
