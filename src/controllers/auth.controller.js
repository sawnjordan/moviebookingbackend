const UserModel = require("../models/user.model");
const { responseFormat } = require("../utilities/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthContorller {
  registerUser = async (req, res, next) => {
    try {
      const { name, email, password, address } = req.body;
      const existingUser = await UserModel.findOne({ email: email });
      if (existingUser) {
        return res
          .status(400)
          .json(responseFormat(false, "Email already exists."));
      }

      const newUser = new UserModel({
        name,
        password,
        email,
        address,
      });

      let response = await newUser.save();
      res
        .status(201)
        .json(responseFormat(true, "User registered successfully.", response));
    } catch (err) {
      next(err);
    }
  };

  loginUser = async (req, res, next) => {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res
        .status(400)
        .json(responseFormat(false, "Invalid credentials."));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password not matched.");
      return res
        .status(400)
        .json(responseFormat(false, "Invalid credentials."));
    }

    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: "30m" }
    );
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json(
      responseFormat(true, "Login successful", {
        authToken,
        refreshToken,
      })
    );
  };

  logoutUser = async (req, res, next) => {
    res.clearCookie("authToken");
    res.clearCookie("refreshToken");
    res.json({
      ok: true,
      message: "User logged out successfully.",
    });
  };

  getMyProfile = async (req, res) => {
    const user = await UserModel.findOne({ _id: req.userId });

    if (!user) {
      return res.status(400).json(responseFormat(false, "Invalid credentials"));
    } else {
      return res.status(200).json(responseFormat(true, "User found.", user));
    }
  };
}
const authControllerObj = new AuthContorller();
module.exports = authControllerObj;
