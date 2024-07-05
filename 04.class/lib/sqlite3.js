import sqlite3 from "sqlite3";
import Storage from "../lib/storage.js";

export default class SQLite3 extends Storage {
  constructor() {
    super();
    this.db = new sqlite3.Database("../lib/memo_app.sqlite3");
    this.#safeCreateTable();
  }

  async fetchAll() {
    const memos = await this.#allPromise(this.db, "SELECT * FROM memos");
    await this.#closePromise(this.db);
    return memos;
  }

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

  #allPromise(db, query, params = []) {
    return new Promise((resolve, reject) => {
      db.all(query, params, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
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
