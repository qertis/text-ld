const test = require('node:test');
const assert = require('node:assert/strict');
const { creativeWork } = require('../dist/index.cjs');

test('Rus lang', async () => {
    const context = await creativeWork(' Какой-то #интересный текс ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'ru');
    assert.ok(context.keywords.includes('#интересный'));
    assert.ok(context.text.startsWith('Какой-то #интересный текст'));
});

test('Spanish lang', async () => {
    const context = await creativeWork('hola erizo como estas #hola #mundo hoy');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'es');
    assert.ok(context.keywords.includes('#hola'));
})

test('Eng lang', async () => {
    const context = await creativeWork('Hello my friend. How are ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'en');
    assert.ok(context.text.startsWith('Hello my friend'));
});
