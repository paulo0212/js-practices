import readline from "readline";

export default class MemoApp {
  constructor(storage) {
    this.storage = storage;
  }

  run(options) {
    if (options) {
      switch (options) {
        case "-l":
          this.#list();
          break;
        case "-r":
          this.#read();
          break;
        case "-d":
          this.#delete();
          break;
      }
    } else {
      this.#add();
    }
  }

  async #add() {
    const rl = readline.createInterface(process.stdin);
    const lines = [];
    for await (const line of rl) {
      lines.push(line);
    }

    const content = lines.join("\n");
    await this.storage.create(content);
  }

  #list() {
    console.log("This is #list.");
  }

  #read() {
    console.log("This is #read.");
  }

  #delete() {
    console.log("This is #delete.");
  }
}
