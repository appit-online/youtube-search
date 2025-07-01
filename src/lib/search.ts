import got from 'got';
import _jp from 'jsonpath';
import { ParserService } from './parser.service.js';

const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const durationMap: Record<string, string> = {
  under: 'EgQQARgB',     // unter 4 Minuten
  // tslint:disable-next-line:object-literal-sort-keys
  between: 'EgQQARgD',   // 4–20 Minuten
  over: 'EgQQARgC'       // über 20 Minuten
};

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchQuery: string, opts?: { duration?: 'under' | 'between' | 'over' | string }) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  const options = { type: 'video', limit: 0 };

  let spParam = '';
  if (opts?.duration) {
    spParam = durationMap[opts.duration] || opts.duration; // fallback falls direkter sp-Code übergeben wird
  }

  const searchRes: any = await got.get(
    `${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchQuery.trim())}&hl=en${spParam ? '&sp=' + spParam : ''}`,
    {
      headers: {
        'user-agent': USER_AGENT,
      },
    }
  );

  const html = searchRes.body;

  // ytInitialData extrahieren und parsen
  let data: any = null;
  try {
    const jsonStr = html.split('var ytInitialData = ')[1].split(';</script>')[0];
    data = JSON.parse(jsonStr);
  } catch (e) {
    return [];
  }

  // Items mit JSONPath auslesen
  const details = _jp.query(data, '$..itemSectionRenderer..contents[*]');
  // manchmal sind Items in primaryContents
  _jp.query(data, '$..primaryContents..contents[*]').forEach(i => details.push(i));

  if (!details.length) { return []; }

  const parserService = new ParserService();

  for (const dataItem of details) {
    if (options.limit > 0 && results.length >= options.limit) { break; }

    const parsed = parserService.parseVideo(dataItem);
    if (!parsed) { continue; }

    results.push(parsed);
  }

  return results;
}
