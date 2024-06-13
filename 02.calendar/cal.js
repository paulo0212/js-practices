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

  printCalendar(year, month);
};

const printCalendar = (year, month) => {
  const header = buildCalendarHeader(year, month);
  const body = buildCalendarBody(year, month);

  console.log(header);
  console.log(body);
};

const buildCalendarHeader = (year, month) => {
  return `${formatYearAndMonth(year, month)}\n${DAY_OF_WEEK}`;
};

const formatYearAndMonth = (year, month) => {
  const yearMonthStr = DateTime.local(year, month, 1).toFormat("MMMM yyyy");
  const paddingWidth = (PRINT_WIDTH - yearMonthStr.length) / 2;
  const padding = " ".repeat(paddingWidth);

  return padding + yearMonthStr;
};

const buildCalendarBody = (year, month) => {
  const firstDate = DateTime.local(year, month, 1);
  const lastDate = firstDate.endOf("month");

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
  return "   ".repeat(date.weekday % 7);
};

main();
