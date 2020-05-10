import { searchVideo } from './lib/search';

export const Name = (name: string) => `Hello ${name}`;

export function search(searchQuery: string) {
  return searchVideo(searchQuery);
}
