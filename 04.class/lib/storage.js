export default class Storage {
  fetchAll() {
    throw new Error("Subclasses must implement 'fetchAll' method.");
  }

  create() {
    throw new Error("Subclasses must implement 'create' method.");
  }

  delete() {
    throw new Error("Subclasses must implement 'delete' method.");
  }
}
