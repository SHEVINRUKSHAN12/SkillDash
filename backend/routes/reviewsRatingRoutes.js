const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getReviewsByService, 
    getReviewsByProvider, 
    debugReviews,
    createTestReview 
} = require('../controllers/reviewsRatingController');

console.log('reviewsRatingRoutes file loaded'); // TEMP DEBUG

router.post('/', createReview);
router.get('/:serviceId', getReviewsByService);
router.get('/provider/:providerId', getReviewsByProvider);

// Add debug endpoints
router.post('/debug', debugReviews);
router.post('/test', createTestReview);

module.exports = router;
