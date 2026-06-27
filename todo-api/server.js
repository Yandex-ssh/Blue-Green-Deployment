const express = require("express");
const mongoose = require("mongoose");
const appVersion = process.env.APP_VERSION || "Unknown";
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/todos", require("./routes/todoRoutes"));

app.get("/", (req, res) => {
  res.send("Todo API Running v2");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/version", (req, res) => {
  res.json({
    version: appVersion,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: process.env.APP_VERSION,
  });
});