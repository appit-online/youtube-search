export class ParserService {

  parseVideo(data: any) {
    if (!data) return undefined;

    try {
      let title = '';
      if (data.videoRenderer){
        title = data.videoRenderer.title.runs[0].text;
        title = title.replace("\\\\", "\\");

        try {
          title = decodeURIComponent(title);
        } catch (e) {
          // @ts-ignore
        }
        const descripcionAux = function () {
          try {
              data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs.map((c, i) => {
                  data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs[i].toString = function () {
                      return this.text;
                  };
              });
              return data.videoRenderer.detailedMetadataSnippets[0].snippetText.runs.join(" ");
          } catch (e) {
              return "";
          }
      }
        return {
          id: {
            videoId: data.videoRenderer.videoId
          },
          url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
          title,
          channelName: data.videoRenderer.longBylineText && data.videoRenderer.longBylineText.runs[0] ? data.videoRenderer.longBylineText.runs[0].text : null,
          description: descripcionAux(),
          duration_raw: data.videoRenderer.lengthText ? data.videoRenderer.lengthText.simpleText : null,
          snippet: {
            url: `https://www.youtube.com/watch?v=${data.videoRenderer.videoId}`,
            duration: data.videoRenderer.lengthText ? data.videoRenderer.lengthText.simpleText : null,
            publishedAt: data.videoRenderer.publishedTimeText ? data.videoRenderer.publishedTimeText.simpleText : null,
            thumbnails: {
              id: data.videoRenderer.videoId,
              url: data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1].url,
              height: data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1].height,
              width: data.videoRenderer.thumbnail.thumbnails[data.videoRenderer.thumbnail.thumbnails.length - 1].width
            },
            title,
            views: data.videoRenderer.viewCountText && data.videoRenderer.viewCountText.simpleText ? data.videoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
          },
          views: data.videoRenderer.viewCountText && data.videoRenderer.viewCountText.simpleText ? data.videoRenderer.viewCountText.simpleText.replace(/[^0-9]/g, "") : 0
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
