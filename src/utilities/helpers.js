const responseFormat = (ok, message, data) => {
  return {
    ok,
    message,
    data,
  };
};
module.exports = { responseFormat };
