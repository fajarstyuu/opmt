const secondToDayString = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}hari ${hours}jam ${minutes}menit`;
};

const dateToSecond = (
  day: string,
  hour: string,
  minute: string,
  seconds: string,
): number => {
  const daysInSeconds = parseInt(day) * 86400;
  const hoursInSeconds = parseInt(hour) * 3600;
  const minutesInSeconds = parseInt(minute) * 60;
  const secondsInSeconds = parseInt(seconds);

  return daysInSeconds + hoursInSeconds + minutesInSeconds + secondsInSeconds;
};

export { secondToDayString, dateToSecond };
