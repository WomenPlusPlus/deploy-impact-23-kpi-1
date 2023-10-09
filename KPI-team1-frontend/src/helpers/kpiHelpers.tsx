import { getQuarter, getWeek } from "date-fns";

export const getDisplayValueByPeriodicity = (
  periodicity: string,
  date: Date
) => {
  if (date !== null) {
    const newDate = new Date(date);
    if (periodicity === "daily") {
      return newDate.toLocaleDateString("en-CH");
    } else if (periodicity === "quarterly") {
      return `Q${getQuarter(newDate)}`;
    } else if (periodicity === "yearly") {
      return newDate.toLocaleDateString("en-CH", {
        year: "numeric",
      } as Intl.DateTimeFormatOptions);
    } else if (periodicity === "weekly") {
      return `Week ${getWeek(newDate, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      })}`;
    } else {
      return newDate.toLocaleDateString("en-CH", {
        month: "short",
        year: "numeric",
      } as Intl.DateTimeFormatOptions);
    }
  } else {
    return null;
  }
};
