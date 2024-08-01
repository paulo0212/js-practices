#!/usr/bin/env node

import MemoApp from "../lib/memo_app.js";
import SQLite3 from "../lib/sqlite3.js";

const storage = new SQLite3("../lib/memo_app.sqlite3");
const options = process.argv[2];
const memoApp = new MemoApp(storage);

memoApp.run(options);
