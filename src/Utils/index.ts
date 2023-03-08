export const stringBytes = (str: string) => {
  const textEncoder = new TextEncoder();
  return textEncoder.encode(str).byteLength;
};
