// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<P extends any[], T extends (...args: P) => void>(
  fn: T,
  ms = 0
): (...args: P) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: P): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.call(undefined, ...args), ms);
  };
}
