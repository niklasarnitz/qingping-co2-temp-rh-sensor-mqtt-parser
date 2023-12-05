export const checkProtocolHeader = (bytes: Uint8Array) => {
  return bytes[0] === 0x43 && bytes[1] === 0x47;
};
