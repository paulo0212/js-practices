import sqlite3 from "sqlite3";
import Storage from "../lib/storage.js";

export default class SQLite3 extends Storage {
  constructor(filepath) {
    super();
    this.db = new sqlite3.Database(filepath);
    this.#safeCreateTable();
  }

  async fetchAll() {
    const memos = await this.#allPromise(
      this.db,
      "SELECT * FROM memos ORDER BY id DESC",
    );
    return memos.map((memo) => this.#buildMemo(memo));
  }

  async create(lines) {
    await this.#runPromise(
      this.db,
      "INSERT INTO memos (content) VALUES (?)",
      lines,
    );
  }

  async delete(id) {
    await this.#runPromise(this.db, "DELETE FROM memos WHERE id = ?", id);
  }

  async close() {
    await this.#closePromise(this.db);
  }

  #buildMemo(memo) {
    return {
      name: memo.id,
      value: memo.content,
      message: memo.content.split(/[\r\n]+/)[0],
    };
  }

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
