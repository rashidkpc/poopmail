const moment = require("moment");
const config = require("../poopmail.json");

/*
  email parameter looks like:
  {
    from: 'dirty.spammer@example.com',
    to: 'my.tender.inbox@example.com',
    subject: 'Buy these pills',
    text: 'My pills, you buy them, suckah',
    html: '<div>Pillllz</div>'
  };

  To accept an email, return true. 
  To reject an email return false.
  To pass the decision to the next plugin, return null or undefined

*/

module.exports = email => {
  try {
    const user = email.to.split("@")[0];
    const datepart = user.match(/(\d+)/)[0];
    if (!datepart) return null;

    const parsedDate = moment(datepart, config.date_formats);
    if (parsedDate.isBefore(moment())) return null;
    if (!parsedDate.isValid()) return null;
    return true;
  } catch (e) {
    return null;
  }
};
