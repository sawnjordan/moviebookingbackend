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
  imgUrl: {
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
  status: {
    type: String,
    default: "upcomming",
    enum: ["nowshowing", "upcomming", "expired"],
  },
});

const MovieModel = mongoose.model("Movie", movieSchema);

module.exports = MovieModel;
