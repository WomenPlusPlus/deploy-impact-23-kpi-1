import { Tooltip } from "@mui/material";
import {
  endOfWeek,
  format,
  getQuarter,
  getWeek,
  getYear,
  startOfWeek,
} from "date-fns";

export const getDisplayValueByPeriodicity = (
  periodicity: string,
  date: Date
) => {
  const today = new Date();
  const isCurrentYear = (date: Date) => {
    return getYear(date) === getYear(today);
  };

  const getRenderCell = (
    value: string,
    isCurrentYear: boolean,
    lDate: Date
  ) => {
    return (
      <span>
        <div className="text-center">{value}</div>
        <div className="m-0 p-0 text-center text-xs text-gray-400">
          {isCurrentYear ? "" : getYear(lDate)}
        </div>
      </span>
    );
  };
  if (date) {
    const newDate = new Date(date);
    if (periodicity === "quarterly") {
      return getRenderCell(
        `Q${getQuarter(newDate)}`,
        isCurrentYear(newDate),
        newDate
      );
    } else if (periodicity === "yearly") {
      return getRenderCell(format(newDate, "yyyy"), true, newDate);
    } else if (periodicity === "weekly") {
      //show the date range of the week in a tooltip
      const firstDayOfWeek = startOfWeek(newDate, { weekStartsOn: 1 });
      const lastDayOfWeek = endOfWeek(newDate, { weekStartsOn: 1 });
      return (
        <Tooltip
          title={
            <span>{`${format(firstDayOfWeek, "dd.MM.yyyy")} - ${format(
              lastDayOfWeek,
              "dd.MM.yyyy"
            )}`}</span>
          }
        >
          {getRenderCell(
            `Week ${getWeek(firstDayOfWeek, {
              weekStartsOn: 1,
              firstWeekContainsDate: 4,
            })}`,
            isCurrentYear(firstDayOfWeek),
            newDate
          )}
        </Tooltip>
      );
    } else if (periodicity === "monthly") {
      return getRenderCell(
        format(newDate, "MMM"),
        isCurrentYear(newDate),
        newDate
      );
    }
    {
      return format(newDate, "dd.MM.yyyy");
    }
  } else {
    return null;
  }
};

export const getStringDisplayValueByPeriodicity = (
  periodicity: string,
  date: Date
) => {
  const newDate = new Date(date);
  if (periodicity === "quarterly") {
    return `Q${getQuarter(newDate)}`;
  } else if (periodicity === "yearly") {
    return format(newDate, "yyyy");
  } else if (periodicity === "weekly") {
    const firstDayOfWeek = startOfWeek(newDate, { weekStartsOn: 1 });
    return `Week ${getWeek(firstDayOfWeek, {
      weekStartsOn: 1,
      firstWeekContainsDate: 4,
    })}`;
  } else if (periodicity === "monthly") {
    return format(newDate, "MMM");
  } else {
    return format(newDate, "yyyy-MM-dd");
  }
};
