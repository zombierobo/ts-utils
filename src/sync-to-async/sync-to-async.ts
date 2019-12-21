// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function syncToAsync<P extends any[], T extends (...args: P) => any>(
  fn: T,
  config?: {
    delay?: number;
  },
  ...args: P
): Promise<ReturnType<T>> {
  return new Promise<ReturnType<T>>(res =>
    setTimeout(
      () => res(fn(...args)),
      config && config.delay !== undefined ? config.delay : 0
    )
  );
}
