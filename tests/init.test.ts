import { Name } from '../src/index.js';
test('My Name', () => {
  expect(Name('World')).toBe('Hello World');
});