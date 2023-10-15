import { Tooltip } from "@mui/material";
import { endOfWeek, format, getQuarter, getWeek, startOfWeek } from "date-fns";

export const getDisplayValueByPeriodicity = (
  periodicity: string,
  date: Date
) => {
  const today = new Date();
  const isCurrentYear = (date: Date) => {
    return date.getFullYear() === today.getFullYear();
  };

  const getRenderCell = (value: string, isCurrentYear: boolean) => {
    return (
      <span>
        <div className="text-center">{value}</div>
        <div className="m-0 p-0 text-center text-xs text-gray-400">
          {isCurrentYear ? "" : date.getFullYear()}
        </div>
      </span>
    );
  };
  if (date) {
    const newDate = new Date(date);
    if (periodicity === "quarterly") {
      return getRenderCell(`Q${getQuarter(newDate)}`, isCurrentYear(newDate));
    } else if (periodicity === "yearly") {
      return getRenderCell(format(newDate, "yyyy"), true);
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
            isCurrentYear(firstDayOfWeek)
          )}
        </Tooltip>
      );
    } else if (periodicity === "monthly") {
      return getRenderCell(format(newDate, "MMM"), isCurrentYear(newDate));
    }
    {
      return format(newDate, "dd.MM.yyyy");
    }
  } else {
    return null;
  }
};
