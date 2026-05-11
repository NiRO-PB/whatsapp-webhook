const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "VERIFY_TOKEN";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "GMAIL_USER",
    pass: "GMAIL_APP_PASSWORD",  // paste your app password here
  },
});

// Meta calls this once to verify your webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Meta sends WhatsApp messages here
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Only process incoming messages, ignore status updates
    if (!value?.messages) return;

    const message = value.messages[0];
    const from = message.from;
    const timestamp = new Date(message.timestamp * 1000).toLocaleString("es-BO", { timeZone: "America/La_Paz" });

    let messageText = "";
    if (message.type === "text") {
      messageText = message.text.body;
    } else {
      messageText = `[${message.type} message — not text]`;
    }

    await transporter.sendMail({
      from: "nicolasleandrorochamercado@gmail.com",
      to: "nicolasleandrorochamercado@gmail.com",
      subject: `WhatsApp reply from +${from}`,
      text: `You received a WhatsApp reply:\n\nFrom: +${from}\nTime: ${timestamp}\nMessage: ${messageText}`,
    });

    console.log(`Email sent for reply from ${from}`);
  } catch (err) {
    console.error("Error processing message:", err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
