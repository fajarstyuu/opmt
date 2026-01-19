const calculateSessionId = (file: File): string => {
  const fileName = file.name;
  const fileSize = file.size;
  const timestamp = Date.now();

  const hash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const sessionId = hash(`${fileName}-${fileSize}-${timestamp}`);
  return sessionId.toString();
};

export { calculateSessionId };
