# [youtube-search: Node.js](https://github.com/appit-online/youtube-search)

Search videos on youtube without API key

**Table of contents:**


* [Quickstart](#quickstart)

  * [Installing the library](#installing-the-library)
  * [Using the library](#using-the-library)
* [License](#license)

## Quickstart

### Installing the library

```bash
npm install youtube-search-without-api-key --save
```


### Using the library

```javascript
import * as yt from 'youtube-search-without-api-key';

/**
 * Given a search query, searching on youtube
 * @param {string} search value (string or videoId).
 */
const videos = await yt.search('Hallo Welt');
const videos = await yt.search('y5kIrbG2gRc');
console.log('Videos:');
console.log(videos);

[{ kind: 'youtube#searchResult',
     channel:
      { id: 'UCFzpTuxdolZ_EaZr-emNgbg',
        name: 'David Koller',
        url: 'https://www.youtube.com/channel/UCFzpTuxdolZ_EaZr-emNgbg' },
     id:
      { videoId: 'y5kIrbG2gRc',
        channelId: 'UCFzpTuxdolZ_EaZr-emNgbg' },
     snippet:
      { url: 'https://www.youtube.com/watch?v=y5kIrbG2gRc',
        thumbnails: {
            "url":"https://i.ytimg.com/vi/y5kIrbG2gRc/hqdefault.jpg?sqp=-oaymwEjCPYBEIoBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLA-pk9HLDSz4VelSFZ01ceyeIpBSw",
            "width":"246",
            "height":"138"
        },
        publishedAt: 'vor 3 Monaten',
        duration: '2:01',
        title: 'How to Download Free Music On Your iPhone (OFFLINE) 2020',
        views: '51',
        description:
         'This video will show you how to download free music and videos on your iphone easy and fast 2020&#xA0;...' } 
},...]
```

```javascript
const yt = require('youtube-search-without-api-key');

/**
 * Given a search query, searching on youtube
 * @param {string} search value.
 */
const videos = await yt.search('My Search Query');
console.log('Videos:');
console.log(videos);
```

## Supported Node.js Versions

Our client libraries follow the [Node.js release schedule](https://nodejs.org/en/about/releases/).
Libraries are compatible with all current _active_ and _maintenance_ versions of
Node.js.

## License

Apache Version 2.0

See [LICENSE](https://github.com/appit-online/youtube-search/blob/master/LICENSE)
