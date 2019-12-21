// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const safeJsonParse = <T = any>(data: string): T | undefined => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
};
