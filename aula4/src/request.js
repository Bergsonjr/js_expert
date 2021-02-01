const https = require("https");
const { resolve } = require("path");

class Request {
  constructor() {}

  errorTimeout = (reject, url) => () => reject(new Error(`timedout in ${url}`));

  raceTimeout(url, timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(this.errorTimeout(reject, url), timeout);
    });
  }

  async get(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          const items = [];
          res
            .on("data", (data) => items.push(data))
            .on("end", () => resolve(JSON.parse(items.join(""))));
        })
        .on("error", reject);
    });
  }

  async makeRequest({ url, method, timeout }) {
    return Promise.race([this[method](url), this.raceTimeout(url, timeout)]);
  }
}

module.exports = Request;
