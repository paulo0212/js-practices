#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import { runPromise, getPromise } from "./promisifiedFunctions.js";

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
    runPromise(db, "DROP TABLE books");
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
  .catch((error) => console.error(error.message))
  .then(() => {
    console.log("\n3. レコード取得");
    return getPromise(db, "SELECT author FROM books");
  })
  .catch((error) => console.error(error.message))
  .then(() => runPromise(db, "DROP TABLE books"))
  .then(() => db.close());
