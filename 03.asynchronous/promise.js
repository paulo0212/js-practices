#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runPromise,
  getPromise,
  closePromise,
} from "./promisifiedFunctions.js";

const db = new sqlite3.Database(":memory:");

console.log("\n= = = = = ここからエラーなし = = = = =");
runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("\n2. レコード追加");
    return runPromise(db, "INSERT INTO books (title) VALUES (?)", "LoremIpsum");
  })
  .then((result) => {
    console.log(`lastID : ${result.lastID}`);
    console.log("\n3. レコード取得");
    return getPromise(db, "SELECT * FROM books");
  })
  .then((book) => {
    console.log(book);
    return runPromise(db, "DROP TABLE books");
  });

await timers.setTimeout(100);

console.log("\n= = = = = ここからエラーあり = = = = =");
runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("\n2. レコード追加");
    return runPromise(db, "INSERT INTO books (title) VALUES (?)", null);
  })
  .then((result) => {
    console.log(`lastID : ${result.lastID}`);
  })
  .catch((error) => {
    if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
      console.error(error.message);
    } else {
      throw error;
    }
  })
  .then(() => {
    console.log("\n3. レコード取得");
    return getPromise(db, "SELECT author FROM books");
  })
  .then((book) => {
    console.log(book);
  })
  .catch((error) => {
    if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
      console.error(error.message);
    } else {
      throw error;
    }
  })
  .then(() => runPromise(db, "DROP TABLE books"))
  .then(() => closePromise(db));
