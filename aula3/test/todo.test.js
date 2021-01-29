const { describe, it, before, afterEach } = require("mocha");
const { createSandbox } = require("sinon");
const { expect } = require("chai");
const Todo = require("../src/todo");
describe("todo", () => {
  let sandbox;

  before(() => (sandbox = createSandbox()));

  afterEach(() => sandbox.restore());
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

    it("should have 'id', 'text, 'when' and 'status' properties", () => {
      const data = { text: "Test", when: new Date("2021-01-02") };

      const expectedId = "000001";
      const expected = {
        text: data.text,
        when: data.when,
        status: "",
        id: expectedId,
      };

      const result = new Todo(data);

      Reflect.set(result, "id", expectedId);

      expect(result).to.be.deep.equal(expected);
    });
  });
});
