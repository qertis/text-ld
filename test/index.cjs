const test = require('node:test');
const assert = require('node:assert/strict');
const textLD = require('../dist/index.cjs').default;

test('Text LD', async () => {
    const context = await textLD(' Какой-то #интересный текс ');
    assert.deepEqual(context.encodingFormat, 'plain/text');
    assert.deepEqual(context.inLanguage, 'ru');
    assert.ok(context.keywords.includes('#интересный'));
    assert.deepEqual(context.text, 'Какой-то #интересный текст.');
});
