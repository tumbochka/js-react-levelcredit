import { TradelineDateRange, TradelineHistoryDataStyle, TradelineStringDateObject } from "src/ObligationAPI/types";
import dayjs from "dayjs";

const last_24_months = dayjs().subtract(23, "month");

export default function getTradelineDateRange(
  date_list: string[],
  data_style: TradelineHistoryDataStyle
): TradelineDateRange {
  const start_date: TradelineStringDateObject = { year: null, month: null };
  const original_start_date: TradelineStringDateObject = { year: null, month: null };
  const end_date: TradelineStringDateObject = { year: null, month: null };

  if (data_style === "last-24-datasets") {
    date_list = date_list.slice(0, 24);
  }

  date_list.forEach(function (date) {
    const [year, month] = date.split("-").map((s) => parseInt(s));

    if (!original_start_date.year || original_start_date.year >= year) {
      if (!original_start_date.year || original_start_date.year > year) {
        // When there is no year or year is completely different, then we should reset the month
        original_start_date.year = year;
        original_start_date.month = 12;
      }

      if (!original_start_date.month || original_start_date.month > month) {
        original_start_date.month = month;
      }
    }

    if (data_style === "last-24-months") {
      if (last_24_months.year() > year || (last_24_months.year() === year && last_24_months.month() >= month)) {
        return;
      }
    }

    if (data_style === "last-24-months-including-year") {
      if (last_24_months.year() > year) {
        return;
      }
    }

    start_date.month = original_start_date.month;
    start_date.year = original_start_date.year;

    if (!end_date.year || end_date.year <= year) {
      if (!end_date.year || end_date.year < year) {
        // When there is no year or year is completely different, then we should reset the month
        end_date.year = year;
        end_date.month = 1;
      }

      if (!end_date.month || end_date.month < month) {
        end_date.month = month;
      }
    }
  });

  return { original_start_date, start_date, end_date };
}
