export type VideoDetails = {
  videoRenderer: {
    videoId: string;
    title: {
      runs: { text: string }[];
    };
    descriptionSnippet?: {
      runs: { text: string }[];
    };
    lengthText?: { simpleText?: string };
    publishedTimeText?: { simpleText?: string };
    viewCountText?: { simpleText?: string };
    thumbnail: {
      thumbnails: {
        url: string;
        width: number;
        height: number;
      }[];
    };
  };
};

export type ParsedVideSearchResponse = {
  contents?: {
    sectionListRenderer?: {
      contents?: { itemSectionRenderer?: { contents: VideoDetails[] } }[];
    };
  };
};
