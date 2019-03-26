// smtp.js
const { SMTPServer } = require("smtp-server");
const processEmail = require("./process");
const { simpleParser } = require("mailparser");
const config = require("./poopmail.json");
const server = new SMTPServer({
  // disable STARTTLS to allow authentication in clear text mode
  disabledCommands: ["STARTTLS", "AUTH"],
  logger: config.debug,
  onData(stream, session, callback) {
    callback(null, "Accepted"); // We accept everything

    simpleParser(stream).then(parsed => {
      const { from, to, subject, html, text, attachments } = parsed;

      if (config.debug) {
        console.log("INCOMING EMAIL", JSON.stringify(parsed, null, " "));
      }

      to.value.forEach(recp =>
        processEmail({
          from: from.value[0].address,
          to: recp.address,
          subject,
          text,
          html,
          attachments
        })
      );
    });
  }
});

server.listen(3025);
