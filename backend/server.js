const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const chatRoutes = require("./routes/chat");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
