import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/instagram", (req, res) => {
  res.send("I don't have an instagram, LoL");
});

app.listen(PORT, () => {
  console.log(`The server is listening at http://localhost:${PORT}`);
});
