//higher-order function - takes one or more functions as arguments
//or returns a function as its result.

//here we takes a handler function as an argument and return
// an asynchronous function that handles HTTP requests (and errors).
module.exports = handleRequest = (handler) => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res);
      if (result === null) {
        res.status(204).send();
      } else if (result) {
        res.json(result);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
};
