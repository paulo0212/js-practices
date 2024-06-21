#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";
import {
  runPromise,
  getPromise,
  closePromise,
} from "./promisifiedFunctions.js";

const db = new sqlite3.Database(":memory:");

async function executeDatabaseOperationsWithoutError() {
  await runPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  console.log("\n2. レコード追加");
  const result = await runPromise(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "LoremIpsum",
  );
  console.log(`lastID : ${result.lastID}`);

  console.log("\n3. レコード取得");
  const book = await getPromise(db, "SELECT * FROM books");
  console.log(book);

  await runPromise(db, "DROP TABLE books");
}

async function executeDatabaseOperationsWithError() {
  await runPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );

  console.log("\n2. レコード追加");
  try {
    const result = await runPromise(
      db,
      "INSERT INTO books (title) VALUES (?)",
      null,
    );
    console.log(`lastID : ${result.lastID}`);
  } catch (error) {
    console.error(error.message);
  }

  console.log("\n3. レコード取得");
  try {
    const book = await getPromise(db, "SELECT author FROM books");
    console.log(book);
  } catch (error) {
    console.error(error.message);
  }

  await runPromise(db, "DROP TABLE books");

  await closePromise(db);
}

console.log("\n= = = = = ここからエラーなし = = = = =");
executeDatabaseOperationsWithoutError();

await timers.setTimeout(100);

console.log("\n= = = = = ここからエラーあり = = = = =");
executeDatabaseOperationsWithError();
