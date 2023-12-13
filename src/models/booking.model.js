const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  showTime: {
    type: String,
    required: true,
  },
  showDate: {
    type: Date,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
  seats: [
    {
      // { row: 'D', col: 0, seat_id: '10', price: 300 }

      row: {
        type: String,
        required: true,
      },
      col: {
        type: Number,
        required: true,
      },
      seat_id: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingModel;
