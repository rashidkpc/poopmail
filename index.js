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
    simpleParser(stream).then(parsed => {
      const { from, to, subject, html, text, attachments } = parsed;

      if (config.debug) {
        console.log("INCOMING EMAIL", JSON.stringify(parsed, null, " "));
      }

      const results = to.value.map(recp =>
        processEmail({
          from: from.value[0].address,
          to: recp.address,
          subject,
          text,
          html,
          attachments
        })
      );

      if (results.includes(true)) {
        callback(null, "Accepted");
      } else {
        const err = new Error("Rejected");
        err.responseCode = 541;
        callback(err);
      }
    });
  }
});

server.listen(3025);
