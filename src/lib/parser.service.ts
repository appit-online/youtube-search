export class ParserService {

  parseVideo(data: any) {
    if (!data || !data.videoRender) return;

    let title = data.videoRender.title.runs[0].text;
    title = title.replace("\\\\", "\\");
    title = decodeURIComponent(title);

    const res = {
      id: {
        videoId: data.videoRender.videoId
      },
      url: `https://www.youtube.com/watch?v=${data.videoRender.videoId}`,
      title,
      description: data.videoRender.descriptionSnippet && data.videoRender.descriptionSnippet.runs[0] ? data.videoRender.descriptionSnippet.runs[0].text : "",
      duration_raw: data.videoRender.lengthText ? data.videoRender.lengthText.simpleText : null,
      snippet: {
        url: `https://www.youtube.com/watch?v=${data.videoRender.videoId}`,
        duration: data.videoRender.lengthText ? data.videoRender.lengthText.simpleText : null,
        publishedAt: data.videoRender.publishedTimeText ? data.videoRender.publishedTimeText.simpleText : null,
        thumbnails: {
          id: data.videoRender.videoId,
          url: data.videoRender.thumbnail.thumbnails[data.videoRender.thumbnail.thumbnails.length - 1].url,
          default: data.videoRender.thumbnail.thumbnails[data.videoRender.thumbnail.thumbnails.length - 1],
          high: data.videoRender.thumbnail.thumbnails[data.videoRender.thumbnail.thumbnails.length - 1],
          height: data.videoRender.thumbnail.thumbnails[data.videoRender.thumbnail.thumbnails.length - 1].height,
          width: data.videoRender.thumbnail.thumbnails[data.videoRender.thumbnail.thumbnails.length - 1].width
        },
        title,
        views: data.videoRender.viewCountText && data.videoRender.viewCountText.simpleText ? data.videoRender.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
      },
      views: data.videoRender.viewCountText && data.videoRender.viewCountText.simpleText ? data.videoRender.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
    };

    return res;
  }
}