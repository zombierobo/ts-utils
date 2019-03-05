export const safeJsonParse = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return undefined;
  }
};
