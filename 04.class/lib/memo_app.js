export default class MemoApp {
  constructor(storage) {
    this.storage = storage;
  }

  run(options) {
    console.log(options);
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
