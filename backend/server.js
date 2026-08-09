const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "BYTE backend is running",
    status: "online"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    agent: "BYTE",
    status: "online",
    memory: "not_connected",
    mode: "development"
  });
  });
  app.get("/api/stats", (req, res) => {
  res.json({
    discovered: 0,
    accepted: 0,
    rejected: 0,
    memories: 0
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BYTE backend running on port ${PORT}`);
});