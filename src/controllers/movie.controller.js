const BookingModel = require("../models/booking.model");
const MovieModel = require("../models/movie.model");
const ScreenModel = require("../models/screen.model");
const UserModel = require("../models/user.model");

const { responseFormat } = require("../utilities/helpers");

class MovieController {
  adminCreateMovie = async (req, res, next) => {
    try {
      const {
        title,
        description,
        portraitImgUrl,
        landscapeImgUrl,
        rating,
        genre,
        duration,
        director,
      } = req.body;

      const newMovie = new MovieModel({
        title,
        description,
        portraitImgUrl,
        landscapeImgUrl,
        rating,
        genre,
        duration,
        director,
      });
      const response = await newMovie.save();
      res.status(201).json({
        ok: true,
        message: "Movie added successfully.",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  };

  adminCreateScreen = async (req, res, next) => {
    try {
      const { name, hallName, seats, city, screenType } = req.body;
      const newScreen = new ScreenModel({
        name,
        hallName,
        seats,
        city: city.toLowerCase(),
        screenType,
        movieSchedules: [],
      });

      await newScreen.save();

      res.status(201).json({
        ok: true,
        message: "Screen added successfully.",
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  adminAddMovieScheduleToScreen = async (req, res, next) => {
    // console.log("Inside addmoviescheduletoscreen");
    try {
      const { screenId, movieId, showTime, showDate } = req.body;
      const screen = await ScreenModel.findById(screenId);
      if (!screen) {
        return res.status(404).json({
          ok: false,
          message: "Screen not found.",
        });
      }

      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          ok: false,
          message: "Movie not found.",
        });
      }

      screen.movieSchedules.push({
        movieId,
        showTime,
        notavailableseats: [],
        showDate,
      });

      await screen.save();

      res.status(201).json({
        ok: true,
        message: "Movie schedule added successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  userBookTicket = async (req, res, next) => {
    try {
      const {
        showTime,
        showDate,
        movieId,
        screenId,
        seats,
        totalPrice,
        paymentId,
        paymentType,
      } = req.body;
      console.log(req.body);

      const screen = await ScreenModel.findById(screenId);

      if (!screen) {
        return res.status(404).json({
          ok: false,
          message: "Theatre not found.",
        });
      }

      const movieSchedule = screen.movieSchedules.find((schedule) => {
        console.log(schedule);
        let showDate1 = new Date(schedule.showDate);
        let showDate2 = new Date(showDate);
        if (
          showDate1.getDay() === showDate2.getDay() &&
          showDate1.getMonth() === showDate2.getMonth() &&
          showDate1.getFullYear() === showDate2.getFullYear() &&
          schedule.showTime === showTime &&
          schedule.movieId == movieId
        ) {
          return true;
        }
        return false;
      });

      if (!movieSchedule) {
        return res.status(404).json({
          ok: false,
          message: "Movie schedule not found.",
        });
      }

      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found.",
        });
      }
      // console.log("before newBooking done");
      const newBooking = new Booking({
        userId: req.userId,
        showTime,
        showDate,
        movieId,
        screenId,
        seats,
        totalPrice,
        paymentId,
        paymentType,
      });
      await newBooking.save();
      console.log("newBooking done");

      movieSchedule.notAvailableSeats.push(...seats);
      await screen.save();
      console.log("screen saved");

      user.bookings.push(newBooking._id);
      await user.save();
      console.log("user saved");
      res.status(201).json({
        ok: true,
        message: "Booking successful.",
      });
    } catch (err) {
      next(err);
    }
  };

  getListOfMovies = async (req, res, next) => {
    try {
      const movies = await MovieModel.find();

      res.status(200).json({
        ok: true,
        data: movies,
        message: "Movies retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  getSingleMovie = async (req, res, next) => {
    try {
      const movieId = req.params.id;
      const movie = await MovieModel.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          ok: false,
          message: "Movie not found.",
        });
      }

      res.status(200).json({
        ok: true,
        data: movie,
        message: "Movie retrieved successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  getScreenByCity = async (req, res, next) => {
    const city = req.params.city.toLowerCase();

    try {
      const screens = await ScreenModel.find({ city });
      if (!screens || screens.length === 0) {
        return res
          .status(404)
          .json(
            responseFormat(
              false,
              "No screens found in the specified city.",
              null
            )
          );
      }

      res
        .status(200)
        .json(responseFormat(true, "Screens retrieved successfully.", screens));
    } catch (err) {
      next(err);
    }
  };

  getScreenByMovieSchedule = async (req, res, next) => {
    try {
      const city = req.params.city.toLowerCase();
      const date = req.params.date;
      const movieId = req.params.movieid;

      // Retrieve screens for the specified city
      const screens = await Screen.find({ city });

      // Check if screens were found
      if (!screens || screens.length === 0) {
        return res
          .status(404)
          .json(
            responseFormat(
              false,
              "No screens found in the specified city.",
              null
            )
          );
      }

      let temp = [];
      // Filter screens based on the showDate
      const filteredScreens = screens.forEach((screen) => {
        // screen

        screen.movieSchedules.forEach((schedule) => {
          let showDate = new Date(schedule.showDate);
          let bodyDate = new Date(date);
          // console.log(showDate , bodyDate);
          if (
            showDate.getDay() === bodyDate.getDay() &&
            showDate.getMonth() === bodyDate.getMonth() &&
            showDate.getFullYear() === bodyDate.getFullYear() &&
            schedule.movieId == movieId
          ) {
            temp.push(screen);
          }
        });
      });

      console.log(temp);

      res
        .status(200)
        .json(responseFormat(true, "Screens retrieved successfully.", temp));
    } catch (err) {
      next(err);
    }
  };

  getScheduleByMovie = async (req, res, next) => {
    const screenId = req.params.screenid;
    const date = req.params.date;
    const movieId = req.params.movieid;

    const screen = await ScreenModel.findById(screenId);

    if (!screen) {
      return res
        .status(404)
        .json(responseFormat(false, "Screen not found.", null));
    }

    const movieSchedules = screen.movieSchedules.filter((schedule) => {
      let showDate = new Date(schedule.showDate);
      let bodyDate = new Date(date);
      if (
        showDate.getDay() === bodyDate.getDay() &&
        showDate.getMonth() === bodyDate.getMonth() &&
        showDate.getFullYear() === bodyDate.getFullYear() &&
        schedule.movieId == movieId
      ) {
        return true;
      }
      return false;
    });
    console.log(movieSchedules);

    if (!movieSchedules) {
      return res
        .status(404)
        .json(responseFormat(false, "Movie schedule not found.", null));
    }

    res.status(200).json(
      responseFormat(true, "Movie schedule retrieved successfully.", {
        screen,
        movieSchedulesforDate: movieSchedules,
      })
    );
  };

  getUserBookings = async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.userId).populate("bookings");
      if (!user) {
        return res
          .status(404)
          .json(responseFormat(false, "User not found", null));
      }

      let bookings = [];

      for (let i = 0; i < user.bookings.length; i++) {
        let bookingobj = await BookingModel.findById(user.bookings[i]._id);
        bookings.push(bookingobj);
      }

      res
        .status(200)
        .json(
          responseFormat(
            true,
            "User bookings retrieved successfully.",
            bookings
          )
        );
    } catch (err) {
      next(err);
    }
  };

  getUserSingleBooking = async (req, res, next) => {
    try {
      const bookingId = req.params.id;
      const booking = await BookingModel.findById(bookingId);

      if (!booking) {
        return res
          .status(404)
          .json(responseFormat(false, "Booking not found.", null));
      }

      res
        .status(200)
        .json(responseFormat(true, "Booking retrieved successfully.", booking));
    } catch (err) {
      next(err);
    }
  };
}

const movieControllerObj = new MovieController();
module.exports = movieControllerObj;
