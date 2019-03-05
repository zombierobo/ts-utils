const helperFn = <T>(
  asynFn: (...args: any) => Promise<T>,
  args: any[],
  predicate: (data: T) => boolean,
  resolve: (data: T) => void,
  reject: (err: any) => void,
  pollInterval: number
) => {
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

export const promisePoll = <T>(
  asynFn: (...args: any) => Promise<T>,
  args: any[],
  predicate: (data: T) => boolean,
  pollInterval = 0
): Promise<T> => {
  return new Promise((resolve, reject) =>
    helperFn(asynFn, args, predicate, resolve, reject, pollInterval)
  );
};
