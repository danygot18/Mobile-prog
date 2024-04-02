const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController'); 

router.post('/', reviewController.createReview);
router.get('/', reviewController.getReviews);
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
