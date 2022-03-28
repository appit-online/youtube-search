import type { ParsedVideSearchResponse } from '../src/lib/types';
import { search } from '../src/index';

const mockJsonResponse: ParsedVideSearchResponse = {
  contents: {
    sectionListRenderer: {
      contents: [
        {
          itemSectionRenderer: {
            contents: [
              {
                videoRenderer: {
                  title: { runs: [{ text: 'Title' }] },
                  thumbnail: { thumbnails: [{ height: 300, width: 400, url: 'https://test.com/thumbnail.png' }] },
                  videoId: 'testId',
                  descriptionSnippet: { runs: [{ text: 'testDescription' }] },
                  lengthText: { simpleText: 'testLength' },
                  publishedTimeText: { simpleText: 'testPublishedTime' },
                  viewCountText: { simpleText: 'testViewCount' },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

describe('Youtube search without API key', () => {
  const fetchMock = jest.fn();

  it('fetches and parses a search response', async () => {
    fetchMock.mockImplementationOnce(() => ({
      text: async () => JSON.stringify(mockJsonResponse),
    }));

    await expect(search('test', { fetch: fetchMock })).resolves.toEqual([
      {
        description: 'testDescription',
        duration_raw: 'testLength',
        id: {
          videoId: 'testId',
        },
        snippet: {
          duration: 'testLength',
          publishedAt: 'testPublishedTime',
          thumbnails: {
            default: {
              height: 300,
              url: 'https://test.com/thumbnail.png',
              width: 400,
            },
            height: 300,
            high: {
              height: 300,
              url: 'https://test.com/thumbnail.png',
              width: 400,
            },
            id: 'testId',
            url: 'https://test.com/thumbnail.png',
            width: 400,
          },
          title: 'Title',
          url: 'https://www.youtube.com/watch?v=testId',
          views: '',
        },
        title: 'Title',
        url: 'https://www.youtube.com/watch?v=testId',
        views: '',
      },
    ]);
  });
});
