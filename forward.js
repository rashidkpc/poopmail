const moment = require("moment");
const config = require("./poopmail.json");

module.exports = to => {
  try {
    const user = to.split("@")[0];
    const datepart = user.match(/(\d+)/)[0];
    if (!datepart) return false;
    
    const parsedDate = moment(datepart, config.dateformats);
    if (parsedDate.isBefore(moment())) return false;
    if (!parsedDate.isValid()) return false;
    return true;
  } catch (e) {
    return false;
  }
};
