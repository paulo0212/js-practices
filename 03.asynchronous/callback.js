#!/usr/bin/env node

import sqlite3 from "sqlite3";
import timers from "timers/promises";

const db = new sqlite3.Database(":memory:");

console.log("\n= = = = = ここからエラーなし = = = = =");
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("\n2. レコード追加");
    db.run("INSERT INTO books (title) VALUES (?)", "LoremIpsum", function () {
      console.log(`lastID : ${this.lastID}`);
      console.log("\n3. レコード取得");
      db.get("SELECT * FROM books", (_, book) => {
        console.log(book);
        db.run("DROP TABLE books");
      });
    });
  },
);

await timers.setTimeout(100);

console.log("\n= = = = = ここからエラーあり = = = = =");
db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("\n2. レコード追加");
    db.run("INSERT INTO books (title) VALUES (?)", null, function (error) {
      if (error) {
        console.error(error.message);
      } else {
        console.log(`lastID : ${this.lastID}`);
      }
      console.log("\n3. レコード取得");
      db.get("SELECT author FROM books", (error, book) => {
        if (error) {
          console.error(error.message);
        } else {
          console.log(book);
        }
        db.run("DROP TABLE books");
      });
    });
  },
);

await timers.setTimeout(100);

db.close();
