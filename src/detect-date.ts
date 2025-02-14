/// <reference types="node" />
import * as chrono from 'chrono-node';
import { format } from 'date-fns';

const FULL_TIME = 'yyyy-MM-dd\'T\'HH:mm';
const FULL_TIME_Z = 'yyyy-MM-dd\'T\'HH:mm\'Z\'';
const FULL_DATE = 'yyyy-MM-dd';

export default class ChronoText {
  private text: string;
  private readonly lang: string;
  private readonly timeZone: string;

  constructor({ text, lang = 'ru', timeZone }: { text: string, lang?: string, timeZone?: string }) {
    this.text = text;
    this.lang = lang;
    this.timeZone = timeZone;
  }

  #dateFormatFull(start: string, timeZone = globalThis?.process?.env?.TZ) {
    return new Intl.DateTimeFormat(this.lang, {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: timeZone,
    }).format(new Date(start));
  }

  #dateFormatDay(start: string, timeZone = globalThis?.process?.env?.TZ) {
    return new Intl.DateTimeFormat(this.lang, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: false,
      timeZone: timeZone,
    }).format(new Date(start));
  }

  #formatKnownDate(parse: chrono.ParsedResult): string {
    // @ts-ignore
    const { knownValues, impliedValues } = parse;
    const tags = parse.tags();
    const date = parse.date();
    console.log('tags', tags);

    if (tags.has('casualReference/morning')) {
      return this.#dateFormatFull(format(date, FULL_TIME), 'UTC');
    }
    if (tags.has('casualReference/evening')) {
      return this.#dateFormatFull(format(date, FULL_TIME), 'UTC');
    }
    if (tags.has('casualReference/midnight')) {
      return this.#dateFormatFull(format(date, FULL_TIME_Z), 'UTC');
    }
    if (tags.has('casualReference/tomorrow')) {
      console.log('knownValues', knownValues)
      if (!Reflect.has(knownValues, 'hour')) {
        console.log('aaa')
        return this.#dateFormatDay(format(date, FULL_DATE));
      }
    }
    if (tags.has('result/relativeDate')) {
      return this.#dateFormatFull(format(date, FULL_TIME), this.timeZone);
    }
    if (tags.has('result/relativeDateAndTime')) {
      return this.#dateFormatFull(format(date, FULL_TIME), this.timeZone);
    }
    // Устанавливаем точное время если есть все для этого данные
    if (knownValues.day && knownValues.month && knownValues.year && Reflect.has(knownValues, 'hour')) {
      return this.#dateFormatFull(format(date, FULL_TIME));
    }
    // Ставим весь день
    if ((knownValues.year || impliedValues.year) &&
        (knownValues.month || impliedValues.month) &&
        !(Reflect.has(knownValues, 'hour') || Reflect.has(impliedValues, 'hour'))) {
      return this.#dateFormatDay(format(date, FULL_DATE));
    }
    if (knownValues.weekday && knownValues.hour && Reflect.has(knownValues, 'minute')) {
      return this.#dateFormatFull(format(date, FULL_TIME));
    }
    // Ставим часы и минуты для ближайшего дня
    if (!(knownValues.year && knownValues.month && knownValues.weekday) &&
        Reflect.has(knownValues, 'hour') && Reflect.has(knownValues, 'minute')) {
      return this.#dateFormatFull(format(date, FULL_TIME));
    }
    if (knownValues.year && knownValues.month && knownValues.day
      && !Reflect.has(knownValues, 'hour')
    ) {
      return this.#dateFormatDay(format(date, FULL_DATE));
    }
    if (tags.has('casualReference/today')) {
      if (!Reflect.has(knownValues, 'hour')) {
        return this.#dateFormatFull(format(date, FULL_DATE));
      }
    }
    console.warn('WIP unknown date format:', parse);
  }

  processing(options = {
    forwardDate: true,
  }) {
    let { text } = this;
    // в случае если строка выглядит как-то так: "2024-07-11"
    if (text.length === 10 && !Number.isNaN(Date.parse(text))) {
      return this.#dateFormatDay(format(chrono[this.lang].parseDate(text), FULL_DATE));
    }
    const chronoResults = chrono[this.lang].parse(text, new Date(), options);
    if (!chronoResults.length) {
      return text;
    }
    for (const res of chronoResults) {
      let source = '';
      if (res.start) {
        const start = this.#formatKnownDate(res.start);
        if (start) {
          if (res.end) {
            source += 'с ';
          }
          source += (start);
        }
      }
      if (res.end) {
        const end = this.#formatKnownDate(res.end);
        if (end) {
          source += ' по ' + end;
        }
      }
      if (source) {
        text = text.replace(res.text, source);
      }
    }
    return text;
  }
}
