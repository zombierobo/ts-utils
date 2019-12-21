// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFn<T, P extends any[]> = (...args: P) => Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const helperFn = <T, P extends any[]>(
  asynFn: AsyncFn<T, P>,
  args: P,
  predicate: (data: T) => boolean,
  resolve: (data: T) => void,
  reject: (err: any) => void, // eslint-disable-line @typescript-eslint/no-explicit-any
  pollInterval: number
): void => {
  asynFn(...args)
    .then(res =>
      predicate(res)
        ? resolve(res)
        : setTimeout(
            () =>
              helperFn(asynFn, args, predicate, resolve, reject, pollInterval),
            pollInterval
          )
    )
    .catch(err => reject(err));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promisePoll = <T, P extends any[]>(
  asynFn: AsyncFn<T, P>,
  args: P,
  predicate: (data: T) => boolean,
  pollInterval = 0
): Promise<T> => {
  return new Promise((resolve, reject) =>
    helperFn(asynFn, args, predicate, resolve, reject, pollInterval)
  );
};
