export class ParserService {

  public parseVideo(data: any) {
    if (!data?.videoRenderer) { return undefined; }

    try {
      const vr = data.videoRenderer;

      // Titel extrahieren und evtl. Backslashes fixen
      let title = vr.title?.runs?.[0]?.text ?? '';
      title = this.cleanUpName(title);

      // Optional: decodeURIComponent nur, wenn es sinnvoll ist (hier z.B. keine Fehler werfen)
      try {
        title = decodeURIComponent(title);
      } catch {
        // ignore decode errors
      }

      // Thumbnail: letztes Thumbnail-Objekt nutzen (meist größte Auflösung)
      const thumbnails = vr.thumbnail?.thumbnails ?? [];
      const thumbnail = thumbnails.length ? thumbnails[thumbnails.length - 1] : null;

      // Views aus Text extrahieren und in Zahl konvertieren
      const viewsText = vr.viewCountText?.simpleText ?? '';
      const views = Number(viewsText.replace(/\D/g, '')) || 0;

      return {
        id: {
          videoId: vr.videoId
        },
        url: `https://www.youtube.com/watch?v=${vr.videoId}`,
        // tslint:disable-next-line:object-literal-sort-keys
        title,
        description: vr.descriptionSnippet?.runs?.[0]?.text ?? '',
        duration_raw: vr.lengthText?.simpleText ?? null,
        snippet: {
          url: `https://www.youtube.com/watch?v=${vr.videoId}`,
          // tslint:disable-next-line:object-literal-sort-keys
          duration: vr.lengthText?.simpleText ?? null,
          publishedAt: vr.publishedTimeText?.simpleText ?? null,
          thumbnails: thumbnail
            ? {
              id: vr.videoId,
              url: thumbnail.url,
              // tslint:disable-next-line:object-literal-sort-keys
              default: thumbnail,
              high: thumbnail,
              height: thumbnail.height,
              width: thumbnail.width
            }
            : null,
          title
        },
        views
      };
    } catch {
      return undefined;
    }
  }


  public cleanUpName(name: string): string {
   return  name
      // Unicode-Escape-Sequenzen wie \uXXXX in Zeichen umwandeln
     .replace(/\\u[\dA-Fa-f]{4}/g, (match) =>
       String.fromCharCode(parseInt(match.slice(2), 16))
     )
     .replace(/&amp;/gi, '&')
     .replace(/&quot;/gi, '"')
     .replace(/&lt;/gi, '<')
     .replace(/&gt;/gi, '>')
     .replace(/&apos;/gi, "'")
     .replace(/[^\p{L}\p{N}\s\-_.,!?'":;%&()]/gu, '')
     .replace(/\s+/g, ' ')
     .trim();
  }

}
