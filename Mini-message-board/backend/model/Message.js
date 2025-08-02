let messages = [];

module.exports = {
  NewMessage: (user, content, tstamp) => {
    if (user && content && tstamp) {
      messages.unshift({ user: user, content: content, tstamp: tstamp });
      return messages;
    } else {
      throw new Error("Message not added");
    }
  },
  GetAllMessages: () => {
    return messages;
  },
  DeleteMessage: (id) => {
    if (messages[id]) {
      messages.splice(id, 1);
    } else {
      throw new Error("Trying to delete message that does not exist");
    }
  },
};
