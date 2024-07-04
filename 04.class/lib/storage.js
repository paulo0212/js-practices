export default class Storage {
  fetchAll() {
    throw new Error("Subclasses must implement 'fetchAll' method.");
  }

  create() {
    throw new Error("Subclasses must implement 'create' method.");
  }

  find() {
    throw new Error("Subclasses must implement 'find' method.");
  }

  delete() {
    throw new Error("Subclasses must implement 'delete' method.");
  }
}
