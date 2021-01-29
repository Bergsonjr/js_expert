const { describe, it, before, afterEach, beforeEach } = require("mocha");
const { expect } = require("chai");
const TodoService = require("../src/todoService");
const { createSandbox } = require("sinon");
const Todo = require("../src/todo");

describe("todoService", () => {
  let sandbox, todoService;

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe("#list", () => {
    const mockDatabase = [
      {
        name: "Diego Maradona",
        age: 60,
      },
    ];

    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase),
        },
      };

      todoService = new TodoService(dependencies);
    });

    it("should return data on a specific format", () => {
      const result = todoService.list();
      const [{ ...expected }] = mockDatabase;

      expect(result).to.be.deep.equal([expected]);
    });
  });

  describe("#create", () => {
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          create: sandbox.stub().returns(true),
        },
      };

      todoService = new TodoService(dependencies);
    });

    it("should not save todo item with invalid data", () => {
      const data = new Todo({
        text: "",
        when: "",
      });

      Reflect.deleteProperty(data, "id");

      const expected = {
        error: {
          message: "Invalid data",
          data,
        },
      };

      const result = todoService.create(data);

      expect(result).to.be.deep.equal(expected);
    });

    it("should save todo item with late status when then property is further than today", () => {
      const properties = {
        text: "I want to walk with Duck",
        when: new Date("2021-01-01"),
      };

      const data = new Todo(properties);
      Reflect.set(data, "id", "00001");

      const today = new Date("2021-01-02");
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: "late",
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });

    it("should save todo item with pending status", () => {
      const properties = {
        text: "I want to walk with Duck",
        when: new Date("2021-01-03"),
      };

      const data = new Todo(properties);
      Reflect.set(data, "id", "00001");

      const today = new Date("2021-01-02");
      sandbox.useFakeTimers(today.getTime());

      todoService.create(data);

      const expectedCallWith = {
        ...data,
        status: "pending",
      };

      expect(
        todoService.todoRepository.create.calledOnceWithExactly(
          expectedCallWith
        )
      ).to.be.ok;
    });
  });
});
