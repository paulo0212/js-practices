#!/usr/bin/env node

import minimist from "minimist";
import * as luxon from "luxon";

const DAY_OF_WEEK = "Su Mo Tu We Th Fr Sa";
const PRINT_WIDTH = DAY_OF_WEEK.length;
const PRINT_DATE_LINES = 6;

const main = () => {
  const argv = minimist(process.argv.slice(2));
  const today = luxon.DateTime.local();
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
  const yearAndMonthStr = luxon.DateTime.local(year, month, 1).toFormat(
    "MMMM yyyy",
  );
  const paddingWidth = (PRINT_WIDTH - yearAndMonthStr.length) / 2;
  const padding = " ".repeat(paddingWidth);

  return `${padding}${yearAndMonthStr}`;
};

const buildCalendarBody = (year, month) => {
  const firstDate = luxon.DateTime.local(year, month, 1);
  const lastDate = firstDate.endOf("month").startOf("day");

  let body = generateFirstWeekPadding(firstDate);
  for (
    let targetDate = firstDate;
    targetDate <= lastDate;
    targetDate = targetDate.plus({ days: 1 })
  ) {
    const dateStr = targetDate.toFormat("d").padStart(2, " ");
    let separator = "";
    if (targetDate < lastDate) {
      separator = targetDate.weekday === 6 ? "\n" : " ";
    }
    body += `${dateStr}${separator}`;
  }
  body += generateCalendarBottomPadding(body);

  return body;
};

const generateFirstWeekPadding = (date) => {
  return "   ".repeat(date.weekday % 7);
};

const generateCalendarBottomPadding = (body) => {
  return "\n".repeat(PRINT_DATE_LINES - body.split("\n").length);
};

main();
