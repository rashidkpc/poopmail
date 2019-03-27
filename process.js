const config = require("./poopmail.json");
const sendmail = require("sendmail")({ silent: !config.debug });
const plugins = require("./plugins");

// Returns true or false depending on if the email was ultimately forward to anyone
module.exports = incoming => {
  const address = incoming.to;
  const { subject, text, html, attachments, from } = incoming;

  const outgoing = {
    from: `Forwarded for ${address} <${from}>`,
    to: config.to,
    subject,
    text,
    html,
    attachments: attachments || []
  };

  function act(decision) {
    if (decision === true) {
      sendmail(outgoing);
      if (config.debug) console.log("FORWARDED EMAIL", address);
    }
    if (decision === false) {
      if (config.debug) {
        console.log("REJECTED EMAIL", `to ${address} from ${from}`);
      }
    }
    return decision;
  }

  for (let plugin of plugins) {
    const decision = plugin(incoming);
    if (decision === true || decision === false) {
      return act(decision);
    }
  }

  // No decision
  return act(config.default_accept);
};
