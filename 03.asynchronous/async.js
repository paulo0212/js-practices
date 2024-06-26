#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runPromise,
  getPromise,
  closePromise,
} from "./promisifiedFunctions.js";

const db = new sqlite3.Database(":memory:");

console.log("\n= = = = = ここからエラーなし = = = = =");

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

console.log("\n= = = = = ここからエラーあり = = = = =");

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
  if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
    console.error(error.message);
  } else {
    throw error;
  }
}

console.log("\n3. レコード取得");
try {
  const book = await getPromise(db, "SELECT author FROM books");
  console.log(book);
} catch (error) {
  if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
    console.error(error.message);
  } else {
    throw error;
  }
}

await runPromise(db, "DROP TABLE books");

await closePromise(db);
