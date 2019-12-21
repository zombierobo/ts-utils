import sinon from 'sinon';
import { throttle } from './throttle';
import { getRandomIntInRange } from '../random-int-in-range/random-int-in-range';

describe('throttle', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  test('it should execute seamlessly if the time difference between two calls is greater than throttle time', done => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 200);
    let calledTimes = 0;
    for (let i = 0; i < 10; i++) {
      throttledFunc();
      clock.tick(200 + getRandomIntInRange(0, 10));
      calledTimes++;
      expect(func).toHaveBeenCalledTimes(calledTimes);
    }
    done();
  });

  test('it should throttle number of calls if the time difference between two calls is less than throttle time', done => {
    const func = jest.fn((x: number, y: string) => y + x * 2);
    const throttledFunc = throttle(func, 200);

    /**
     * Call --- Call --- Call --- Call --- Call --- Call ...
     * Fire ------------------------------ Fire -----
     */
    throttledFunc(5, 'y');
    expect(func).toHaveBeenCalled();
    for (let i = 0; i < 100; i++) {
      clock.tick(50);
      throttledFunc(5, 'y');
      expect(func).toHaveBeenCalledTimes(Math.floor((i + 1) / 4) + 1);
    }
    done();
  });
});
