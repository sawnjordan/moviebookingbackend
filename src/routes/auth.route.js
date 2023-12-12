const express = require("express");
const router = express.Router();

router.get("/test", async (req, res) => {
  res.json({
    message: "Auth api is working",
  });
});

const responseFormat = (ok, message, data) => {
  return {
    ok,
    message,
    data,
  };
};

router.post("/register", async (req, res, next) => {});

router.post("/login", async (req, res, next) => {});

router.get("/logout", async (req, res) => {});

module.exports = router;
