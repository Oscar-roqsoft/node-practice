const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const homeRoutes = require("./routes/home/home");
// const authRoutes = require("./routes/auth/auth");
const taskRoutes = require("./routes/tasks");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token"
  );
  next();
});


app.use(express.json());
app.use("/api/v1/", taskRoutes);
// app.use("/auth", authRoutes);
// app.use("/user", userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server running");
});
