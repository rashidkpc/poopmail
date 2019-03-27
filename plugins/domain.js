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
    const domain = email.to.split("@")[1];
    if (!config.domains.includes(domain)) return false;
    return null;
  } catch (e) {
    return null;
  }
};
