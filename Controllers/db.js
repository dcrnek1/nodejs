const users = [
  {id: 1, name: "Bryan"},
  {id: 2, name: "Christian"},
  {id: 3, name: "Jayson"},
];

async function getUserById(userId) {
  // throw new Error('Oh no, db not working');
  return users.find(user => userId == user.id);
}

module.exports = {getUserById};