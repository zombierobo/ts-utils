import sinon from 'sinon';
import { debounce } from './debounce';

let clock: sinon.SinonFakeTimers;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('debounce should only execute function on finish of debounce time', () => {
  const func = jest.fn();
  const debouncedFunc = debounce(func, 500);
  let expectedCallTimes = 0;

  debouncedFunc();
  expect(func).toHaveBeenCalledTimes(expectedCallTimes);

  debouncedFunc();
  clock.tick(200);
  expect(func).toHaveBeenCalledTimes(expectedCallTimes);

  debouncedFunc();
  clock.tick(600);
  expectedCallTimes = expectedCallTimes + 1;
  expect(func).toHaveBeenCalledTimes(expectedCallTimes);

  for (let i = 0; i < 10; i++) {
    debouncedFunc();
    clock.tick(200);
    expect(func).toHaveBeenCalledTimes(expectedCallTimes);
  }

  debouncedFunc();
  clock.tick(600);
  expectedCallTimes = expectedCallTimes + 1;
  expect(func).toHaveBeenCalledTimes(expectedCallTimes);
});

test('debounce should work even if debounce time parameter is not provided', () => {
  const func = jest.fn();
  const debouncedFunc = debounce(func);
  for (let i = 0; i < 10; i++) {
    debouncedFunc();
    expect(func).toHaveBeenCalledTimes(0);
  }
  clock.tick(1);
  expect(func).toHaveBeenCalledTimes(1);
});
