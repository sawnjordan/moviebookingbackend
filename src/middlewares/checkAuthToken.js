const jwt = require("jsonwebtoken");

const checkAuthToken = (req, res, next) => {
  const { authToken } = req.cookies;
  const { refreshToken } = req.cookies;
  console.log(authToken, refreshToken);

  if (!authToken || !refreshToken) {
    return res.status(401).json({
      message: "Authentication failed: No authToken or refreshToken provided.",
      ok: false,
    });
  }

  jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY,
        (refreshErr, refreshDecoded) => {
          if (refreshErr) {
            // Both tokens are invalid, send an error message and prompt for login
            return res.status(401).json({
              message: "Authentication failed: Both tokens are invalid",
              ok: false,
            });
          } else {
            const newAuthToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "10m" }
            );
            const newRefreshToken = jwt.sign(
              { userId: refreshDecoded.userId },
              process.env.JWT_REFRESH_SECRET_KEY,
              { expiresIn: "30m" }
            );

            res.cookie("authToken", newAuthToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });
            res.cookie("refreshToken", newRefreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });

            req.userId = refreshDecoded.userId;
            req.ok = true;
            next();
          }
        }
      );
      // 1. expired

      // 2. not expired
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

module.exports = checkAuthToken;
