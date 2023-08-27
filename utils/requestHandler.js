const handleRequest = (handler) => {
  return async (req, res) => {
    try {
      const result = await handler(req, res);
      if (result) {
        res.json(result);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message || 'Something went wrong!');
    }
  };
};

module.exports = handleRequest;
