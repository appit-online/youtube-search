import { parseVideo } from './parseVideo';
import { ParsedVideSearchResponse, VideoDetails } from './types';

const rfc3986EncodeURIComponent = (str: string) => encodeURIComponent(str).replace(/[!'()*]/g, escape);

export async function searchVideo(searchQuery: string) {
  const YOUTUBE_URL = 'https://www.youtube.com';

  const results = [];

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

  console.log(details);

  return details.slice(0, options.limit > 0 ? options.limit : undefined).map((data) => parseVideo(data));
}

const parseSearchResponse = (html: string): VideoDetails[] => {
  // try to parse html
  try {
    const parsedHtml: ParsedVideSearchResponse | undefined = JSON.parse(html);
    const details = parsedHtml?.contents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

    if (details?.length ?? 0 > 0) {
      return details;
    }
  } catch {
    /* nothing */
  }

  // backup/ alternative parsing

  try {
    const details: VideoDetails[] = JSON.parse(
      html
        .split('{"itemSectionRenderer":{"contents":')
        [html.split('{"itemSectionRenderer":{"contents":').length - 1].split(',"continuations":[{')[0],
    );
    return details;
  } catch {
    /* nothing */
  }

  try {
    const details: VideoDetails[] = JSON.parse(
      html
        .split('{"itemSectionRenderer":')
        [html.split('{"itemSectionRenderer":').length - 1].split('},{"continuationItemRenderer":{')[0],
    ).contents;
    return details;
  } catch {
    /* nothing */
  }

  return [];
};
