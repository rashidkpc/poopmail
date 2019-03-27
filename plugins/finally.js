const config = require("../poopmail.json");

module.exports = () => {
  console.log("FINALLY:", config.default_accept);
  return config.default_accept;
};
