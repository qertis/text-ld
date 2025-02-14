const test = require('node:test');
const assert = require('node:assert/strict');
const {creativeWork} = require('../dist/index.cjs');

test('currenсy Text', async () => {
    {
        const context = await creativeWork('50 рублей');
        assert.ok(context.text.includes('50 ₽'));
    }
    {
        const context = await creativeWork('В кармане миллион баксов');
        assert.ok(context.text.includes('В кармане 1000000 $'));
    }
    {
        const context = await creativeWork('тыСЯча рублей');
        assert.deepEqual(context.text, '1000 ₽');
    }
});

test('date UTC', async () => {
    process.env.TZ = 'UTC';
    const userTZ = 'Europe/Moscow';
    {
        const context = await creativeWork('Завтра в двадцать стрижка', userTZ);
        assert.ok(context.text.includes('20'));
    }
    {
        const context = await creativeWork('В субботу в 13:00 тренировка', userTZ);
        assert.ok(context.text.includes(' 13:00 '));
    }
    {
        const context = await creativeWork('Завтра в 10 стрижка', userTZ);
        assert.ok(context.text.includes(' 10:00 '));
    }
    {
        const context = await creativeWork('В полночь', userTZ);
        assert.ok(context.text.includes('00:00'));
    }
    {
        const context = await creativeWork('Через 1 час синк', userTZ);
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const timeFormat = new Intl.DateTimeFormat('ru', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: userTZ,
        }).format(currentTime);
        assert.ok(context.text.includes(timeFormat));
    }
    {
        const context = await creativeWork('Сегодня вечером синк');
        assert.ok(context.text.includes('20:00'));
    }
    {
        const context = await creativeWork('Завтра утром синк');
        assert.ok(context.text.includes('06:00'));
    }
    {
        // todo поддержать такой вид
        // const context = await creativeWork('Сегодня в обед синк');
        // console.log(context.text);
    }
});

test('date TZ', async () => {
    process.env.TZ = 'Europe/Kaliningrad';
    {
        const context = await creativeWork('В субботу в 13:00 тренировка');
        assert.ok(context.text.includes(' 13:00 '));
    }
    {
        const context = await creativeWork('Завтра в 10 стрижка');
        assert.ok(context.text.includes(' 10:00 '));
    }
    {
        const context = await creativeWork('В полночь');
        assert.ok(context.text.includes('00:00'));
    }
    {
        const context = await creativeWork('Через 1 час синк');
        const currentTime = new Date();
        currentTime.setHours(currentTime.getHours() + 1);
        const timeFormat = new Intl.DateTimeFormat('ru', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: process.env.TZ,
        }).format(currentTime);
        assert.ok(context.text.includes(timeFormat));
    }
    // todo поддержать еще такой вид "сегодня в десять двадцать"
});

test('date Rus', async () => {
    const context = await creativeWork('В субботу в тренировка');
    assert.deepEqual(context.encodingFormat, 'text/plain');
});

test('date word Rus', async () => {
    {
        const context = await creativeWork('В шестнадцать двадцать синк');
        assert.deepEqual(context.text, 'В 16 двадцать синк');
    }
    {
        const context = await creativeWork('Пять тысяч');
        assert.deepEqual(context.text, '5 тысяч');
    }
    {
        const context = await creativeWork('Посмотри двадцать пять тысяч триста сорок два');
        assert.deepEqual(context.text, 'Посмотри 20 пять тысяч триста сорок два');
    }
    {
        const context = await creativeWork('в двадцать три Синк');
        assert.deepEqual(context.text, 'в 20 три Синк');
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
