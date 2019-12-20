export const debounce = (fn: (...args: any) => any, ms = 0) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(undefined, args), ms);
  };
};
