const YOUTUBE_URL = 'https://www.youtube.com';
const YOUTUBE_SEARCH_URL = 'https://www.youtube.com/results?search_query=';
import got from 'got';

export async function searchVideo(searchQuery: string) {
  const cheerio = require('cheerio');
  const searchRes: any = await got.get(encodeURI(`${YOUTUBE_SEARCH_URL}${searchQuery}&sp=EgIQAQ%253D%253D`));
  const $ = cheerio.load(searchRes.body);

  const videos = [];
  for (const result of  $('.yt-lockup-dismissable').toArray()) {
    try {
      let channelId = $(result).find('.yt-lockup-byline a').attr('href');
      if(channelId) {
        channelId = channelId.split('/')[2];
      }
      const channelTitle = $(result).find('.yt-lockup-byline a').html();
      const channelURL = YOUTUBE_URL + $(result).find('.yt-lockup-byline a').attr('href');

      const thumbnail = $(result).find('.yt-lockup-thumbnail img').attr('data-thumb') || $(result).find('.yt-lockup-thumbnail img').attr('src');
      let description = $(result).find('.yt-lockup-description').html();
      if(description){
        description = description.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
      }
      let views = $(result).find('.yt-lockup-meta-info').children().last().text().match(/\d+/g);
      if(views){
        views = views.join('.');
      }
      videos.push({
        kind: 'youtube#searchResult',
        channel: {
          id: channelId,
          name: channelTitle,
          url: channelURL
        },
        id: {
          videoId: $(result).find('.yt-lockup-title a').attr('href').split('=')[1],
          channelId
        },
        snippet: {
          url: YOUTUBE_URL + $(result).find('.yt-lockup-title a').attr('href'),
          thumbnails: {
            url: thumbnail,
            width: $(result).find('.yt-lockup-thumbnail img').attr('width'),
            height: $(result).find('.yt-lockup-thumbnail img').attr('height')
          },
          publishedAt: $(result).find('ul.yt-lockup-meta-info li').eq(0).text(),
          duration:  $(result).find('.yt-lockup-thumbnail .video-time').html(),
          title: $(result).find('.yt-lockup-title a').attr('title'),
          views,
          description
        },
      });
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }
  return videos;
}
