import { parseVideo } from './parseVideo';
import { parseSearchResponse } from './parseSearchResponse';
import { VideoDetails } from './types';

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchQuery: string) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const options = { type: 'video', limit: 0 };

  const searchRes = await fetch(`${YOUTUBE_URL}/results?q=${rfc3986EncodeURIComponent(searchQuery.trim())}&hl=en`);
  let html = await searchRes.text();

  try {
    const data = html.split("ytInitialData = '")[1].split("';</script>")[0];
    html = data.replace(/\\x([0-9A-F]{2})/gi, (...items) => {
      return String.fromCharCode(parseInt(items[1], 16));
    });
    html = html.replaceAll('\\\\"', '');
  } catch {
    /* nothing */
  }

  const details = parseSearchResponse(html);

  return details
    .slice(0, options.limit > 0 ? options.limit : undefined)
    .map((data) => parseVideo(data))
    .filter((maybeParsedData): maybeParsedData is NonNullable<ReturnType<typeof parseVideo>> => !!maybeParsedData);
}
