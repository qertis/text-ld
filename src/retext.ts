import retext from 'retext';
import retextSpell from 'retext-spell';

export default async function (text: string, dictionary: any): Promise<string> {
  const vfile = await retext().use(retextSpell, dictionary).process(text);
  const { messages } = vfile;
  for (const message of messages) {
    const { actual, expected, location: { start, end }} = message;
    // Игнорируем короткие слова
    if (actual.length < 5) {
      continue;
    }
    // todo - подключить NLP движок чтобы игнорировать имена, а пока просто пропускаем слова написанные с большой буквы
    if (actual.charAt(0) === actual.charAt(0).toUpperCase()) {
      continue;
    }
    if (expected.length) {
      text = text.replace(text.substring(start.offset, end.offset), expected[0]);
    }
  }
  return text;
}
