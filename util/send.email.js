const nodemailer = require("nodemailer");
function sendEmail(options){
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7226e8e9ee3fab",
      pass: "642a5e652b2f26"
    }
  });
console.log(options)
async function main() {
  // send mail with defined transport object
  const info = await transport.sendMail({
    from: "ranjbaramir829@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text,
    html:options.text, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
}
module.exports = sendEmail;