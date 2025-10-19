class UsersModel {
  constructor() {
    this.storage = {'0': {id: 0, firstName: "Dario", lastName: "Crnek"}, '1': {id: 1, firstName: "Dario1", lastName: "Crnek1"}};
    this.id = 2;
  }

  addUser({firstName, lastName}) {
    const id = this.id;
    this.storage[id] = {id, firstName, lastName}
    this.id++;
  }

  getUsers() {
    return this.storage;
  }

  getUser(id) {
    return this.storage[id];
  }

  updateUser(id, {firstName, lastName}) {
    this.storage[id] = {id, firstName, lastName};
  }

  deleteUser(id) {
    delete this.storage[id];
  }
}

module.exports = new UsersModel();