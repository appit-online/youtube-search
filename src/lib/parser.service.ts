export class ParserService {

  parseVideo(data: any) {
    if (!data) return undefined;

    try {
      let title = '';
      if (data.compactVideoRenderer){
        title = data.compactVideoRenderer.title.runs[0].text;
        title = title.replace("\\\\", "\\");

        try {
          title = decodeURIComponent(title);
        } catch (e) {
          // @ts-ignore
        }

        return {
          id: {
            videoId: data.compactVideoRenderer.videoId
          },
          url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
          title,
          description: data.compactVideoRenderer.descriptionSnippet && data.compactVideoRenderer.descriptionSnippet.runs[0] ? data.compactVideoRenderer.descriptionSnippet.runs[0].text : "",
          duration_raw: data.compactVideoRenderer.lengthText ? data.compactVideoRenderer.lengthText.simpleText : null,
          snippet: {
            url: `https://www.youtube.com/watch?v=${data.compactVideoRenderer.videoId}`,
            duration: data.compactVideoRenderer.lengthText ? data.compactVideoRenderer.lengthText.simpleText : null,
            publishedAt: data.compactVideoRenderer.publishedTimeText ? data.compactVideoRenderer.publishedTimeText.simpleText : null,
            thumbnails: {
              id: data.compactVideoRenderer.videoId,
              url: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].url,
              default: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1],
              high: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1],
              height: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].height,
              width: data.compactVideoRenderer.thumbnail.thumbnails[data.compactVideoRenderer.thumbnail.thumbnails.length - 1].width
            },
            title,
            views: data.compactVideoRenderer.viewCountText && data.compactVideoRenderer.viewCountText.simpleText ? data.compactVideoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
          },
          views: data.compactVideoRenderer.viewCountText && data.compactVideoRenderer.viewCountText.simpleText ? data.compactVideoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
        };

      } else if (data.videoWithContextRenderer){
        if (data.videoWithContextRenderer.headline?.runs && data.videoWithContextRenderer.headline?.runs.length > 0){
          title = data.videoWithContextRenderer.headline?.runs[0].text;
        }else{
          title = data.videoWithContextRenderer.headline?.accessibility?.accessibilityData?.label;
        }

        title = title.replace("\\\\", "\\");

        try {
          title = decodeURIComponent(title);
        } catch (e) {
          // @ts-ignore
        }

        return {
          id: {
            videoId: data.videoWithContextRenderer.videoId
          },
          url: `https://www.youtube.com/watch?v=${data.videoWithContextRenderer.videoId}`,
          title,
          description: '',
          duration_raw: data.videoWithContextRenderer.lengthText?.accessibility?.accessibilityData?.text,
          snippet: {
            url: `https://www.youtube.com/watch?v=${data.videoWithContextRenderer.videoId}`,
            duration: data.videoWithContextRenderer.lengthText?.accessibility?.accessibilityData?.text,
            publishedAt: data.videoWithContextRenderer.publishedTimeText?.runs?.length > 0 ? data.videoWithContextRenderer.publishedTimeText?.runs[0].text : null,
            thumbnails: {
              id: data.videoWithContextRenderer.videoId,
              url: data.videoWithContextRenderer.thumbnail.thumbnails[data.videoWithContextRenderer.thumbnail.thumbnails.length - 1].url,
              default: data.videoWithContextRenderer.thumbnail.thumbnails[data.videoWithContextRenderer.thumbnail.thumbnails.length - 1],
              high: data.videoWithContextRenderer.thumbnail.thumbnails[data.videoWithContextRenderer.thumbnail.thumbnails.length - 1],
              height: data.videoWithContextRenderer.thumbnail.thumbnails[data.videoWithContextRenderer.thumbnail.thumbnails.length - 1].height,
              width: data.videoWithContextRenderer.thumbnail.thumbnails[data.videoWithContextRenderer.thumbnail.thumbnails.length - 1].width
            },
            title,
            views: data.videoWithContextRenderer.shortViewCountText?.accessibility?.accessibilityData?.label?.replace(/[^0-9]/g, "")
          },
          views: data.videoWithContextRenderer.shortViewCountText?.accessibility?.accessibilityData?.label?.replace(/[^0-9]/g, "")
        };
      }

      return undefined
    } catch (e) {
      return undefined
    }
  }
}
