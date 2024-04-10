const test = require('node:test');
const assert = require('node:assert/strict');
const { creativeWork } = require('../dist/index.cjs');

test('Rus lang', async () => {
    const context = await creativeWork(' Какой-то #интересный текс ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'ru');
    assert.ok(context.keywords.includes('#интересный'));
    assert.deepEqual(context.text, 'Какой-то #интересный текст.');
});

test('Eng lang', async () => {
    const context = await creativeWork('Hello my frien');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'en');
    assert.deepEqual(context.text, 'Hello my friend');
});
