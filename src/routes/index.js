const router = require("express").Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const imageRoutes = require("./imageUpload.routes");
const movieRoutes = require("./movie.routes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/movie", movieRoutes);
router.use("/image", imageRoutes);

module.exports = router;
