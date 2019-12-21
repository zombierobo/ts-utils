import { syncToAsync } from './sync-to-async';
import sinon from 'sinon';

let clock: sinon.SinonFakeTimers;

beforeEach(() => {
  clock = sinon.useFakeTimers();
});

afterEach(() => {
  clock.restore();
});

test('syncToAsync should return a promise version of sync function', done => {
  const getUsers = jest.fn(() => [{ name: 'bob', age: 21 }]);
  const getUsersAsync = syncToAsync(getUsers);
  getUsersAsync.then(res => {
    expect(getUsers).toHaveBeenCalled();
    expect(res).toEqual(getUsers());
    done();
  });
  clock.tick(1);
});

test('syncToAsync should take args of sync function', done => {
  const getUsers = jest.fn((namePrefix: string, startId: number) => [
    { name: namePrefix + 'bob', age: 21, id: startId },
    { name: namePrefix + 'alice', age: 30, id: startId + 1 },
    { name: namePrefix + 'tom', age: 15, id: startId + 2 }
  ]);
  const getUsersAsync = syncToAsync(getUsers, {}, 'Mr. ', 0);
  getUsersAsync.then(res => {
    expect(getUsers).toHaveBeenCalled();
    expect(res).toEqual(getUsers('Mr. ', 0));
    done();
  });
  clock.tick(1);
});

test('syncToAsync should accept custom delay', done => {
  const getUsers = jest.fn(() => [{ name: 'bob', age: 21 }]);
  const getUsersAsync = syncToAsync(getUsers, { delay: 200 });
  getUsersAsync.then(res => {
    expect(getUsers).toHaveBeenCalled();
    expect(res).toEqual(getUsers());
    done();
  });
  clock.tick(1);
  expect(getUsers).not.toHaveBeenCalled();
  clock.tick(100);
  expect(getUsers).not.toHaveBeenCalled();
  clock.tick(100);
  expect(getUsers).toHaveBeenCalled();
});
