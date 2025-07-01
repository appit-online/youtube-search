import { searchVideo } from './lib/search.js';

export function search(searchQuery: string,  opts?: { duration?: 'under' | 'between' | 'over' | string }) {
  return searchVideo(searchQuery, opts);
}
