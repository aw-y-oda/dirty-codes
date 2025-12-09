export const addWeeks = ({ date, weeks }: { date: Date; weeks: number }) => {
  const tempDate = new Date(date);
  tempDate.setDate(tempDate.getDate() + weeks * 7);
  return tempDate;
};
