const { describe, it, before, afterEach } = require("mocha");
const { expect } = require("chai");
const TodoRepository = require("../src/todoRepository");
const { createSandbox } = require("sinon");

describe("todoRepository", () => {
  describe("methods signature", () => {
    let todoRepository, sandbox;
    before(() => {
      todoRepository = new TodoRepository();
      sandbox = createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should call insertOne from lokijs", () => {
      const mock = [
        {
          name: "Diego Maradona",
          age: 60,
        },
      ];
    });

    it("should call find from lokijs", () => {
      const mockDatabase = [
        {
          name: "Diego Maradona",
          age: 60,
        },
      ];
      const functionName = "find";
      const expectedReturn = mockDatabase;
      sandbox.stub();
    });
  });
});
