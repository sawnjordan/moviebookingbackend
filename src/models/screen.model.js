const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hallName: {
    type: String,
    required: true,
  },
  seats: {
    type: Array,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  screenType: {
    type: String, //{2D,3D}
    required: true,
  },
  movieSchedules: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
      },
      showTime: String,
      showDate: Date,
      notAvailableSeats: [
        {
          // { row: 'D', col: 0, seat_id: '10', price: 300 }
          row: String,
          col: Number,
          seat_id: String,
          price: Number,
        },
      ],
    },
  ],
});

const ScreenModel = mongoose.model("Screen", screenSchema);

module.exports = ScreenModel;
