import sqlite3 from "sqlite3";
import Storage from "../lib/storage.js";

export default class SQLite3 extends Storage {
  constructor() {
    super();
    this.db = new sqlite3.Database("../lib/memo_app.sqlite3");
    this.#safeCreateTable();
  }

  fetchAll() {}

  async create(lines) {
    await this.#runPromise(
      this.db,
      "INSERT INTO memos (content) VALUES (?)",
      lines,
    );
    await this.#closePromise(this.db);
  }

  find() {}

  delete() {}

  async #safeCreateTable() {
    await this.#runPromise(
      this.db,
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL)",
    );
  }

  #runPromise(db, query, params = []) {
    return new Promise((resolve, reject) => {
      db.run(query, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  #closePromise(db) {
    return new Promise((resolve, reject) => {
      db.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
