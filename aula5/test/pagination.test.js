const { it, before, afterEach, describe } = require("mocha");
const Pagination = require("../src/pagination");
const { createSandbox } = require("sinon");
const assert = require("assert");

describe("Pagination module", () => {
  let sandbox;

  before(() => {
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  describe("#Pagination", () => {
    describe("#sleep", () => {
      it("should be a promise object and not return values", async () => {
        const time = 1;
        const clock = sandbox.useFakeTimers();
        const pendingPromise = Pagination.sleep(time);

        clock.tick(time);

        assert.ok(pendingPromise instanceof Promise);

        const result = await pendingPromise;

        assert.ok(result === undefined);
      });
    });

    describe("#handleRequest", () => {
      it("should retry an request twice before throwing an exception", async () => {
        const expectedRetries = 2;
        const expectedRetryTimeout = 10;

        const pagination = new Pagination();

        pagination.maxRetries = expectedRetries;
        pagination.timeout = expectedRetryTimeout;
        pagination.retryTimeout = expectedRetryTimeout;

        const error = new Error("timedout in https://google.com?tid=0");

        sandbox.spy(pagination, pagination.handleRequest.name);
        sandbox.stub(Pagination, Pagination.sleep.name).resolves();

        sandbox
          .stub(pagination.request, pagination.request.makeRequest.name)
          .rejects(error);

        const data = { url: "https://google.com", page: 0 };

        await assert.rejects(pagination.handleRequest(data), error);
        assert.deepStrictEqual(
          pagination.handleRequest.callCount,
          expectedRetries
        );

        const lastCall = 1;
        const firstCall = pagination.handleRequest.getCall(lastCall).firstArg;
        const firstCallRetries = firstCall.retries;
        assert.deepStrictEqual(firstCallRetries, expectedRetries);

        const expectedArgs = {
          url: `${data.url}?tid=${data.page}`,
          method: "get",
          timeout: expectedRetryTimeout,
        };

        const firstCallArgs = pagination.request.makeRequest.getCall(0).args;
        assert.deepStrictEqual(firstCallArgs, [expectedArgs]);

        assert.ok(Pagination.sleep.calledWithExactly(expectedRetryTimeout));
      });

      it("should return data from request when succeded", async () => {
        const data = { result: "ok" };
        const pagination = new Pagination();

        sandbox
          .stub(pagination.request, pagination.request.makeRequest.name)
          .resolves(data);

        const result = await pagination.handleRequest({
          url: "https://google.com",
          page: 1,
        });

        assert.deepStrictEqual(result, data);
      });
    });

    describe("#getPaginated", () => {
      const responseMock = [
        {
          tid: 5705,
          date: 1373123005,
          type: "sell",
          price: 196.52,
          amount: 0.01,
        },
        {
          tid: 5706,
          date: 1373124523,
          type: "buy",
          price: 200,
          amount: 0.3,
        },
      ];

      it("should update request id on each request", async () => {
        const pagination = new Pagination();

        sandbox.stub(Pagination, Pagination.sleep.name).resolves();

        sandbox
          .stub(pagination, pagination.handleRequest.name)
          .onCall(0)
          .resolves([responseMock[0]])
          .onCall(1)
          .resolves([responseMock[1]])
          .onCall(2)
          .resolves([]);

        sandbox.spy(pagination, pagination.getPaginated.name);
        const data = { url: "google.com", page: 1 };

        const secondCallExpectation = {
          ...data,
          page: responseMock[0].tid,
        };

        const thirdCallExpectation = {
          ...secondCallExpectation,
          page: responseMock[1].tid,
        };

        const generator = pagination.getPaginated(data);

        for await (const result of generator) {
        }

        const getFirstArgFromCall = (value) =>
          pagination.handleRequest.getCall(value).firstArg;

        assert.deepStrictEqual(getFirstArgFromCall(0), data);
        assert.deepStrictEqual(getFirstArgFromCall(1), secondCallExpectation);
        assert.deepStrictEqual(getFirstArgFromCall(2), thirdCallExpectation);
      });

      it("should stop requesting when request an empty array", async () => {
        const expectedThreshold = 20;
        const pagination = new Pagination();

        pagination.threshold = 20;

        sandbox.stub(Pagination, Pagination.sleep.name).resolves();

        sandbox
          .stub(pagination, pagination.handleRequest.name)
          .onCall(0)
          .resolves([responseMock[0]])
          .onCall(1)
          .resolves([]);

        sandbox.spy(pagination, pagination.getPaginated.name);

        const data = { url: "google.com", page: 1 };

        const iterator = await pagination.getPaginated(data);
        const [firstResult, secondResult] = await Promise.all([
          iterator.next(),
          iterator.next(),
        ]);

        const expectedFirstCall = { done: false, value: [responseMock[0]] };
        assert.deepStrictEqual(firstResult, expectedFirstCall);

        const expectedSecondCall = { done: true, value: undefined };
        assert.deepStrictEqual(secondResult, expectedSecondCall);

        assert.deepStrictEqual(Pagination.sleep.callCount, 1);
        assert.ok(Pagination.sleep.calledWithExactly(expectedThreshold));
      });
    });
  });
});
