const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  portraitImgUrl: {
    type: String,
    required: true,
  },
  landscapeImgUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  cast: [
    {
      celebName: String,
      celebRole: String,
      celebImage: String,
    },
  ],
  director: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "upcomming",
    enum: ["nowshowing", "upcomming", "expired"],
  },
});

const MovieModel = mongoose.model("Movie", movieSchema);

module.exports = MovieModel;
