export const roundToNearest30Minutes = (date: Date): Date => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 30) * 30;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    roundedMinutes,
    0,
    0,
  );
};
