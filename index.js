const express = require("express");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "my_secret_token";

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
app.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("Incoming message:", JSON.stringify(body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
