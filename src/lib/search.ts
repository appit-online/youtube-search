import { ParserService } from './parser.service.js';
import got from 'got';
import _jp from 'jsonpath';

const USER_AGENT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) (yt-search; https://www.npmjs.com/package/yt-search)';

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchQuery: string) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];
  const options = { type: 'video', limit: 0 };

  const searchRes: any = await got.get(
    `${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchQuery.trim())}&hl=en`,
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

  if (!details.length) return [];

  const parserService = new ParserService();

  for (let i = 0; i < details.length; i++) {
    if (options.limit > 0 && results.length >= options.limit) break;
    const dataItem = details[i];

    const parsed = parserService.parseVideo(dataItem);
    if (!parsed) continue;

    results.push(parsed);
  }

  return results;
}
