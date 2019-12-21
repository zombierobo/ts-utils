// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunc<T, P extends any[]> = (...args: P) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T, P extends any[]>(
  fn: GenericFunc<T, P>,
  wait: number
): GenericFunc<void, P> {
  let inThrottle = false;
  let lastFn: NodeJS.Timeout;
  let lastTime: number;

  return (...args: P): void => {
    const executeFn = (): T => fn.call(undefined, ...args);
    if (!inThrottle) {
      executeFn();
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        executeFn();
        lastTime = Date.now();
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}
