const AdminModel = require("../models/admin.model");
const { responseFormat } = require("../utilities/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AdminContorller {
  registerAdmin = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // Check if the admin with the same email already exists
      const existingAdmin = await AdminModel.findOne({ email });

      if (existingAdmin) {
        return res
          .status(409)
          .json(responseFormat(false, "Admin with this email already exists."));
      }

      const newAdmin = new AdminModel({
        name,
        email,
        password,
      });

      await newAdmin.save();

      res
        .status(201)
        .json(responseFormat(true, "Admin registered successfully."));
    } catch (err) {
      next(err);
    }
  };

  loginAdmin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const admin = await AdminModel.findOne({ email });

      if (!admin) {
        return res
          .status(400)
          .json(responseFormat(false, "Invalid admin credentials."));
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res
          .status(400)
          .json(responseFormat(false, "Invalid admin credentials."));
      }

      // Generate an authentication token for the admin
      const adminAuthToken = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_ADMIN_SECRET_KEY,
        { expiresIn: "10m" }
      );

      res.cookie("adminAuthToken", adminAuthToken, { httpOnly: true });
      res
        .status(200)
        .json(
          responseFormat(true, "Admin login successful.", { adminAuthToken })
        );
    } catch (err) {
      next(err);
    }
  };

  logoutAdmin = async (req, res, next) => {
    res.clearCookie("adminAuthToken");
    res.json({
      ok: true,
      message: "Admin logged out successfully.",
    });
  };
}
const adminControllerObj = new AdminContorller();
module.exports = adminControllerObj;
