import { safeJsonParse } from './safe-json-parse';

describe('safeJsonParse', () => {
  test('it should parse a valid json string to json', () => {
    const parsed = safeJsonParse<{ x: number; y: string; z: boolean }>(
      '{"x": 1, "y": "2", "z": true}'
    );
    expect(parsed).toEqual({
      x: 1,
      y: '2',
      z: true
    });
  });
  test('it should return undefined if json string is not a valid json', () => {
    expect(safeJsonParse('{"x": 1, "y": "2", "z": trueee}')).toEqual(undefined);
  });

  test('it should return undefined if string is a plain string', () => {
    expect(safeJsonParse('Hello')).toEqual(undefined);
  });
});
