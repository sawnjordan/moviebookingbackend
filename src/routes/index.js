const router = require("express").Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
