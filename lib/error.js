function badRequestError (message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

module.exports = {
  badRequestError
};
