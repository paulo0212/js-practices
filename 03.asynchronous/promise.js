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
  .then(
    (result) => {
      console.log(`lastID : ${result.lastID}`);
      console.log("\n3. レコード取得");
      return getPromise(db, "SELECT author FROM books");
    },
    (error) => {
      if (error.code === "SQLITE_CONSTRAINT") {
        console.error(error.message);
      } else {
        throw error;
      }
      console.log("\n3. レコード取得");
      return getPromise(db, "SELECT author FROM books");
    },
  )
  .then(
    (book) => {
      console.log(book);
      return runPromise(db, "DROP TABLE books");
    },
    (error) => {
      if (error.code === "SQLITE_ERROR") {
        console.error(error.message);
      } else {
        throw error;
      }
      return runPromise(db, "DROP TABLE books");
    },
  )
  .then(() => db.close());
