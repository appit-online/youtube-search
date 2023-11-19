import { searchVideo } from './lib/search.js';

export const Name = (name: string) => `Hello ${name}`;

export function search(searchQuery: string) {
  return searchVideo(searchQuery);
}
