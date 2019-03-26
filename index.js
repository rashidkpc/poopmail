// smtp.js
const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const config = require("./poopmail.json");

const sendmail = require("sendmail")({ silent: !config.debug });
const plugins = require("./plugins");

const server = new SMTPServer({
  // disable STARTTLS to allow authentication in clear text mode
  disabledCommands: ["STARTTLS", "AUTH"],
  logger: config.debug,
  onData(stream) {
    simpleParser(stream).then(parsed => {
      const { from, to, subject, html, text, attachments } = parsed;
      const address = to.value[0].address;

      if (config.debug) {
        console.log(JSON.stringify(parsed, null, " "));
      }

      const incoming = {
        from: from.value[0].address,
        to: to.value[0].address,
        subject,
        text,
        html,
        attachments
      };

      const outgoing = {
        from: `Forwarded for ${address} <noreply@poopmail>`,
        to: config.to,
        subject,
        text,
        html,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: new Buffer(att.content.data)
        }))
      };

      function act(decision) {
        if (decision === true) {
          sendmail(outgoing);
        }
        if (decision === false) {
          if (!config.debug) return decision;
          console.log(
            `Dropping mail to ${address} from ${from.value[0].address}`
          );
        }
        return decision;
      }

      for (let plugin of plugins) {
        const decision = plugin(incoming);
        if (decision === true || decision === false) {
          act(outgoing);
          return decision;
        }
      }

      // No decision
      return act(config.default_accept);
    });
  }
});

server.listen(3025);
