// smtp.js
const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const sendmail = require("sendmail")();
const config = require("./poopmail.json");
const forward = require("./forward");

const server = new SMTPServer({
  // disable STARTTLS to allow authentication in clear text mode
  disabledCommands: ["STARTTLS", "AUTH"],
  logger: false,
  onData(stream, session, callback) {
    simpleParser(stream).then(parsed => {
      const { from, to, attachments, subject, html, text } = parsed;
      const address = to.value[0].address;

      const result = {
        from: `Forwarded for ${address} <noreply@poopmail>`,
        to: config.to,
        text,
        html,
        subject
      };

      if (forward(address)) {
        sendmail(result);
      } else {
        console.log(
          `Dropping mail to ${address} from ${from.value[0].address}`
        );
      }

      return result;
    });
  }
});

server.listen(3025);
