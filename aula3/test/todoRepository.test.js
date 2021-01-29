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
      const functionName = "insertOne";
      const expectedReturn = true;

      sandbox
        .stub(todoRepository.schedule, functionName)
        .returns(expectedReturn);

      const mockDatabase = {
        name: "Diego Maradona",
        age: 60,
      };

      const result = todoRepository.create(mockDatabase);

      expect(result).to.be.ok;
      expect(
        todoRepository.schedule[functionName].calledOnceWithExactly(
          mockDatabase
        )
      ).to.be.ok;
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

      sandbox
        .stub(todoRepository.schedule, functionName)
        .returns(expectedReturn);

      const result = todoRepository.list();

      expect(result).to.be.deep.equal(expectedReturn);
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok;
    });
  });
});
