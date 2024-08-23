function async(handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response);
    } catch (e) {
      next(e);
    }
  };
}

module.exports = async;