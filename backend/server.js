/**
 * Farman Shah — Portfolio backend
 * --------------------------------
 * Express server that:
 *   1. Serves the static frontend (the whole portfolio site)
 *   2. Exposes POST /api/contact for the contact form
 *      (messages are validated and stored in backend/data/messages.json)
 *
 * Run locally:
 *   cd backend && npm install && npm start
 *   → http://localhost:3000
 */
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "messages.json");

app.use(express.json({ limit: "64kb" }));

// Serve the static site from the repo root (one level up)
app.use(express.static(path.join(__dirname, ".."), { extensions: ["html"] }));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function loadMessages() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveMessages(list) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

app.get("/api/health", (req, res) => res.json({ ok: true, service: "farman-portfolio" }));

app.post("/api/contact", (req, res) => {
  const { name = "", email = "", service = "", budget = "", message = "" } = req.body || {};

  const errors = [];
  if (name.trim().length < 2) errors.push("name");
  if (!EMAIL_RE.test(email.trim())) errors.push("email");
  if (message.trim().length < 10) errors.push("message");
  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }

  const entry = {
    id: Date.now(),
    receivedAt: new Date().toISOString(),
    name: name.trim().slice(0, 120),
    email: email.trim().slice(0, 160),
    service: String(service).slice(0, 80),
    budget: String(budget).slice(0, 80),
    message: message.trim().slice(0, 5000),
    ip: req.ip,
  };

  try {
    const list = loadMessages();
    list.push(entry);
    saveMessages(list);
  } catch (err) {
    console.error("Failed to store message:", err.message);
    return res.status(500).json({ ok: false, error: "storage" });
  }

  console.log(`[contact] ${entry.name} <${entry.email}> — ${entry.service}`);
  res.json({ ok: true });
});

// SPA-style fallback: unknown routes serve the homepage
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Farman Shah portfolio running → http://localhost:${PORT}`);
});
