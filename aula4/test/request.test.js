const { it, before, afterEach, describe } = require("mocha");
const { createSandbox } = require("sinon");
const Request = require("../src/request");
const assert = require("assert");
const Events = require("events");
const https = require("https");

describe("Request module", () => {
  let sandbox, request;

  before(() => {
    request = new Request();
    sandbox = createSandbox();
  });

  afterEach(() => sandbox.restore());

  it("should throw a timeout error", async () => {
    const exceededTimeout = 25;

    sandbox
      .stub(request, request.get.name)
      .callsFake(
        () => new Promise((resolve) => setTimeout(resolve, exceededTimeout))
      );

    const call = request.makeRequest({
      url: "https://testing.com",
      method: "get",
      timeout: 15,
    });

    await assert.rejects(call, { message: "timedout in https://testing.com" });
  });

  it("should return ok when promise time is ok", async () => {
    const expected = { ok: "ok" };

    sandbox.stub(request, request.get.name).callsFake(async () => {
      new Promise((resolve) => setTimeout(resolve));
      return expected;
    });

    const call = () =>
      request.makeRequest({
        url: "https://testing.com",
        method: "get",
        timeout: 15,
      });

    await assert.doesNotReject(call());
    assert.deepStrictEqual(await call(), expected);
  });

  it("should return JSON in response", async () => {
    const data = [
      Buffer.from('{"ok": '),
      Buffer.from('"ok"'),
      Buffer.from("}"),
    ];

    const events = new Events();
    const httpEvent = new Events();

    sandbox.stub(https, https.get.name).yields(events).returns(httpEvent);

    const expected = { ok: "ok" };
    const promise = request.get("https://testing.com");

    events.emit("data", data[0]);
    events.emit("data", data[1]);
    events.emit("data", data[2]);

    events.emit("end");

    const response = await promise;

    assert.deepStrictEqual(response, expected);
  });
});
