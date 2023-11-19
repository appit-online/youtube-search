import { searchVideo } from './lib/search.js';

export function search(searchQuery: string) {
  return searchVideo(searchQuery);
}
