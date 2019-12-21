import { promisePoll } from './promise-poll';

type ResponseData = 'INPROGRESS' | 'COMPLETED' | 'FAILED';

function FakeServer(responseSequences: ResponseData[]) {
  let currentResponseSequenceIdx = 0;
  return {
    getStatus(): Promise<ResponseData> {
      return new Promise(res =>
        setTimeout(() => {
          res(responseSequences[currentResponseSequenceIdx]);
          currentResponseSequenceIdx =
            currentResponseSequenceIdx + (1 % responseSequences.length);
        }, 300)
      );
    },
    getStatusWithRejection(): Promise<ResponseData> {
      return new Promise((res, rej) =>
        setTimeout(() => {
          rej(responseSequences[currentResponseSequenceIdx]);
          currentResponseSequenceIdx =
            currentResponseSequenceIdx + (1 % responseSequences.length);
        }, 300)
      );
    }
  };
}

describe('Promise poll', () => {
  test('it should not resolve until the predicate is truthy', done => {
    const responseSequences: ResponseData[] = [
      'INPROGRESS',
      'INPROGRESS',
      'INPROGRESS',
      'INPROGRESS',
      'COMPLETED'
    ];
    const fakseServer = FakeServer(responseSequences);
    const func = jest.fn(fakseServer.getStatus);
    promisePoll(func, [], response => response === 'COMPLETED', 3).then(
      response => {
        expect(response).toBe('COMPLETED');
        expect(func).toHaveBeenCalledTimes(responseSequences.length);
        done();
      }
    );
  });

  test('it should reject if the underlying promise rejects', done => {
    const responseSequences: ResponseData[] = [
      'INPROGRESS',
      'INPROGRESS',
      'INPROGRESS',
      'INPROGRESS',
      'COMPLETED'
    ];
    const fakseServer = FakeServer(responseSequences);
    const func = jest.fn(fakseServer.getStatusWithRejection);
    promisePoll(func, [], response => response === 'COMPLETED').then(
      () => {
        expect(true).toBeFalsy();
        done();
      },
      err => {
        expect(func).toHaveBeenCalledTimes(1);
        expect(err).toBe('INPROGRESS');
        done();
      }
    );
  });
});
