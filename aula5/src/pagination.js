const Request = require("./request");

const DEFAULT_OPTIONS = {
  maxRetries: 4,
  retryTimeout: 1000,
  timeout: 1000,
  threshold: 200,
};

class Pagination {
  constructor(options = DEFAULT_OPTIONS) {
    this.maxRetries = options.maxRetries;
    this.retryTimeout = options.retryTimeout;
    this.timeout = options.timeout;
    this.threshold = options.threshold;
    this.request = new Request();
  }

  async handleRequest({ url, page, retries = 1 }) {
    try {
      const finalUrl = `${url}?tid=${page}`;
      const result = await this.request.makeRequest({
        url: finalUrl,
        method: "get",
        timeout: this.timeout,
      });

      return result;
    } catch (error) {
      if (retries === this.maxRetries) {
        throw error;
      }
      await Pagination.sleep(this.retryTimeout);

      return this.handleRequest({ url, page, retries: ++retries });
    }
  }

  static async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generators sao usados para trabalhar com dados sob demanda,
   * portanto é necessário declarar a função com '*' e utilizar
   * 'yield' para delegar os dados/valores obtidos
   */
  async *getPaginated({ url, page }) {
    const result = await this.handleRequest({ url, page });
    const lastId = result[result.length - 1]?.tid ?? 0;

    if (lastId === 0) return;

    yield result;

    await Pagination.sleep(this.threshold);

    yield* this.getPaginated({ url, page: lastId });
  }
}

module.exports = Pagination;
