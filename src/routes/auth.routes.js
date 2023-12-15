const express = require("express");
const authControllerObj = require("../controllers/auth.controller");
const checkAuthToken = require("../middlewares/checkAuthToken");
const router = express.Router();

router.get("/test", async (req, res) => {
  res.json({
    message: "Auth api is working",
  });
});

router.post("/register", authControllerObj.registerUser);

router.post("/login", authControllerObj.loginUser);

router.get("/logout", checkAuthToken, authControllerObj.logoutUser);

router.get("/me", checkAuthToken, authControllerObj.getMyProfile);

// change user address
router.post(
  "/changeAddress",
  checkAuthToken,
  authControllerObj.changeAuthAddress
);
module.exports = router;
