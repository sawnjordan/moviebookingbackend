const express = require("express");
const cookieParser = require("cookie-parser");
const mongodbInit = require("./mongo.config");
const cors = require("cors");
const routes = require("../routes");

const app = express();
mongodbInit();

const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials
  })
);

//if your content type is application/json us this middleware
app.use(express.json());

//if your content type is application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: false }));

//to use cookie
app.use(cookieParser());
app.use("/api/v1", routes);

//express global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);

  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ data: null, msg: msg, meta: null });
});

module.exports = app;
