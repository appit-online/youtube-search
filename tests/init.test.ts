import { Name } from '../src/index';
test('My Name', () => {
  expect(Name('World')).toBe('Hello World');
});