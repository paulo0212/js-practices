#!/usr/bin/env node

import MemoApp from "../lib/memo_app.js";
import SQLite3 from "../lib/sqlite3.js";

const storage = new SQLite3();
const options = [];
const memoApp = new MemoApp(storage);

memoApp.run(options);
