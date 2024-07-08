import readline from "readline";
import enquirer from "enquirer";

export default class MemoApp {
  constructor(storage) {
    this.storage = storage;
  }

  async run(options) {
    if (options) {
      const memos = await this.storage.fetchAll();
      if (!memos?.length > 0) {
        console.log("There are no memos available.");
        return;
      }
      switch (options) {
        case "-l":
          await this.#list(memos);
          break;
        case "-r":
          await this.#read(memos);
          break;
        case "-d":
          await this.#delete(memos);
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

    try {
      await this.storage.create(content);
      console.log("A new memo has been created!");
    } catch (error) {
      console.error(error);
    }
  }

  async #list(memos) {
    try {
      for (const memo of memos) {
        console.log(memo.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async #read(memos) {
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

  async #delete(memos) {
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
