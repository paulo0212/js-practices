import readline from "readline";
import enquirer from "enquirer";

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

  async #list() {
    const memos = await this.storage.fetchAll();
    for (const memo of memos) {
      console.log(memo.message);
    }
  }

  async #read() {
    const memos = await this.storage.fetchAll();
    const prompt = new enquirer.Select({
      name: "memo",
      message: "Choose a memo you want to see:",
      choices: memos,
      result() {
        return this.focused;
      },
    });

    prompt
      .run()
      .then((memo) => console.log(memo.value))
      .catch(console.error);
  }

  #delete() {
    console.log("This is #delete.");
  }
}
