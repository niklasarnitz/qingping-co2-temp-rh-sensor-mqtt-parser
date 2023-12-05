export const parseKeys = (bytes: Uint8Array) => {
  const payloadLength = bytes[3] | (bytes[4] << 8);

  const data: Record<string, Uint8Array> = {};

  // Start at 5 because the first 5 bytes are the protocol header and payload length
  for (let i = 5; i < payloadLength - 1; ) {
    const key = bytes[i];
    const length = bytes[i + 1] | (bytes[i + 2] << 8);

    const value: Uint8Array = bytes.slice(i + 3, i + 3 + length);

    data[`0x${Number(key).toString(16)}`] = value;

    i += 3 + length;
  }

  return data;
};
