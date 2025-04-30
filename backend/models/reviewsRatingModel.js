const mongoose = require('mongoose');

const reviewsRatingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReviewsRating', reviewsRatingSchema);
