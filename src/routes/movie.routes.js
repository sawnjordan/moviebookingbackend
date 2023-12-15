const express = require("express");
const router = express.Router();

const UserModel = require("../models/user.model");
const MovieModel = require("../models/movie.model");
const BookingModel = require("../models/booking.model");
const ScreenModel = require("../models/screen.model");

const { responseFormat } = require("../utilities/helpers");
const checkAuthToken = require("../middlewares/checkAuthToken");
const movieControllerObj = require("../controllers/movie.controller");
const checkAdminToken = require("../middlewares/checkAdminToken");

router.get("/test", async (req, res) => {
  res.json({
    message: "Movie api is working.",
  });
});

// admin access
router.post(
  "/createmovie",
  checkAdminToken,
  movieControllerObj.adminCreateMovie
);

router.post(
  "/createscreen",
  checkAdminToken,
  movieControllerObj.adminCreateScreen
);

router.post(
  "/addmoviescheduletoscreen",
  checkAdminToken,
  movieControllerObj.adminAddMovieScheduleToScreen
);

// user access
router.post("/bookticket", checkAuthToken, movieControllerObj.userBookTicket);

router.get("/movies", movieControllerObj.getListOfMovies);

router.get("/movies/:id", movieControllerObj.getSingleMovie);

router.get("/screensbycity/:city", movieControllerObj.getScreenByCity);

router.get(
  "/getuserbookings",
  checkAuthToken,
  movieControllerObj.getUserBookings
);

router.get(
  "/getuserbookings/:id",
  checkAuthToken,
  movieControllerObj.getUserSingleBooking
);

// everyone can access
router.get(
  "/screensbymovieschedule/:city/:date/:movieid",
  movieControllerObj.getSingleMovie
);

router.get(
  "/schedulebymovie/:screenid/:date/:movieid",
  movieControllerObj.getScheduleByMovie
);

module.exports = router;
