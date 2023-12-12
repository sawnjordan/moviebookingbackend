const express = require("express");
const router = express.Router();
const adminControllerObj = require("../controllers/admin.controller");
const checkAdminToken = require("../middlewares/checkAdminToken");

router.post("/register", adminControllerObj.registerAdmin);

router.post("/login", adminControllerObj.loginAdmin);

router.get("/logout", checkAdminToken, adminControllerObj.logoutAdmin);

module.exports = router;
