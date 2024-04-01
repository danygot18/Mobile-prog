const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController'); 

router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);

module.exports = router;
