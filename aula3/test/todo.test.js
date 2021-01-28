const { describe, it, before } = require("mocha");
const { expect } = require("chai");
const Todo = require("../src/todo");
describe("todo", () => {
  describe("#isValid", () => {
    it("should return invalid when creating an object without text property", () => {
      const data = { text: "", when: new Date("2021-01-01") };

      const todo = new Todo(data);
      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it("should return invalid when creating an object without when property", () => {
      const data = { text: "Test", when: "" };

      const todo = new Todo(data);
      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it("should return invalid when creating an object using 'when' property invalid", () => {
      const data = { text: "Test", when: new Date("20-01-01") };

      const todo = new Todo(data);
      const result = todo.isValid();

      expect(result).to.be.not.ok;
    });

    it("should have 'id', 'text, 'when' and 'status properties'", () => {
      const data = { text: "Test", when: new Date("2021-01-01") };

      const todo = new Todo(data);
      const result = todo.isValid();

      expect(result).to.be.ok;
    });
  });
});
