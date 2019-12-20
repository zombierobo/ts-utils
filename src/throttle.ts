type GenericFunc = (...args: any[]) => any;

export const throttle = (fn: GenericFunc, wait: number) => {
  let inThrottle: boolean;
  let lastFn: NodeJS.Timeout;
  let lastTime: number;
  return function() {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(function() {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
