const { v4 } = require("uuid");

class Todo {
  constructor({ text, when }) {
    this.text = text;
    this.when = when;
    this.status = "";
    this.id = v4();
  }

  isValid() {
    return !!this.text && !!this.when && !isNaN(this.when.valueOf());
  }
}

module.exports = Todo;
