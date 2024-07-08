import readline from "readline";
import enquirer from "enquirer";

export default class MemoApp {
  constructor(storage) {
    this.storage = storage;
  }

  async run(options) {
    if (options) {
      switch (options) {
        case "-l":
          await this.#list();
          break;
        case "-r":
          await this.#read();
          break;
        case "-d":
          await this.#delete();
          break;
      }
    } else {
      await this.#add();
    }
    await this.storage.close();
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

    try {
      const memo = await prompt.run();
      console.log(memo.value);
    } catch (error) {
      console.error(error);
    }
  }

  async #delete() {
    const memos = await this.storage.fetchAll();
    const prompt = new enquirer.Select({
      name: "memo",
      message: "Choose a memo you want to delete:",
      choices: memos,
      result() {
        return this.focused;
      },
    });

    try {
      const memo = await prompt.run();
      await this.storage.delete(memo.name);
      console.log(`'${memo.message}' has been deleted.`);
    } catch (error) {
      console.error(error);
    }
  }
}
