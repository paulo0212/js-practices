#!/usr/bin/env node

import minimist from "minimist";
import { DateTime } from "luxon";

const DAY_OF_WEEK = "Su Mo Tu We Th Fr Sa";
const PRINT_WIDTH = DAY_OF_WEEK.length;

const main = () => {
  const argv = minimist(process.argv.slice(2));
  const today = DateTime.local();
  const year = argv["y"] || today.year;
  const month = argv["m"] || today.month;

  print_calendar(DateTime.local(year, month, 1));
};

const print_calendar = (date) => {
  const header = build_header(date);
  const body = build_body(date);

  console.log(header);
  console.log(body);
};

const build_header = (date) => {
  const header = format_year_month(date) + "\n" + DAY_OF_WEEK;
  return header;
};

const format_year_month = (date) => {
  const year_month_str = date.toFormat("MMMM yyyy");
  const padding_width = (PRINT_WIDTH - year_month_str.length) / 2;
  const padding = " ".repeat(padding_width);

  return padding + year_month_str;
};

const build_body = (date) => {
  const first_date = date.startOf("month");
  const last_date = date.endOf("month");

  let body = padding_for_first_week(first_date);

  for (
    let target_date = first_date;
    target_date <= last_date;
    target_date = target_date.plus({ days: 1 })
  ) {
    const date_str = target_date.toFormat("d").padStart(2, " ");
    const separator = target_date.weekday === 6 ? "\n" : " ";
    body += date_str + separator;
  }
  return body;
};

const padding_for_first_week = (date) => {
  const repeat_times = date.weekday % 7;
  return "   ".repeat(repeat_times);
};

main();
