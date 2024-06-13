#!/usr/bin/env node

import minimist from "minimist";
import { DateTime } from "luxon";

const DAY_OF_WEEK = "Su Mo Tu We Th Fr Sa";
const PRINT_WIDTH = DAY_OF_WEEK.length;

const main = () => {
  const argv = minimist(process.argv.slice(2));
  const today = DateTime.local();
  const year = argv.y ?? today.year;
  const month = argv.m ?? today.month;

  printCalendar(DateTime.local(year, month, 1));
};

const printCalendar = (date) => {
  const header = buildCalendarHeader(date);
  const body = buildCalendarBody(date);

  console.log(header);
  console.log(body);
};

const buildCalendarHeader = (date) => {
  const header = formatYearMonth(date) + "\n" + DAY_OF_WEEK;
  return header;
};

const formatYearMonth = (date) => {
  const yearMonthStr = date.toFormat("MMMM yyyy");
  const paddingWidth = (PRINT_WIDTH - yearMonthStr.length) / 2;
  const padding = " ".repeat(paddingWidth);

  return padding + yearMonthStr;
};

const buildCalendarBody = (date) => {
  const firstDate = date.startOf("month");
  const lastDate = date.endOf("month");

  let body = paddingForFirstWeek(firstDate);

  for (
    let targetDate = firstDate;
    targetDate <= lastDate;
    targetDate = targetDate.plus({ days: 1 })
  ) {
    const dateStr = targetDate.toFormat("d").padStart(2, " ");
    const separator = targetDate.weekday === 6 ? "\n" : " ";
    body += dateStr + separator;
  }
  if (!body.endsWith("\n")) body += "\n";
  return body;
};

const paddingForFirstWeek = (date) => {
  const repeatTimes = date.weekday % 7;
  return "   ".repeat(repeatTimes);
};

main();
