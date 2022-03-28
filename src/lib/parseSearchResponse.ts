import { ParsedVideSearchResponse, VideoDetails } from './types';

export const parseSearchResponse = (html: string): VideoDetails[] => {
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
