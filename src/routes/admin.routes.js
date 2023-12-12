const express = require("express");
const router = express.Router();
const adminControllerObj = require("../controllers/admin.controller");

router.post("/register", adminControllerObj.registerAdmin);

router.post("/login", adminControllerObj.loginAdmin);

module.exports = router;
