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

  #add() {
    console.log("This is #add.");
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
