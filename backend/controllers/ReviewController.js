const mongoose = require('mongoose');
const { Review } = require('../models/review'); // Corrected import statement
const {User} = require('../models/user');
const {Product} = require('../models/product');

exports.createReview = async (req, res) => {
    try {
      console.log(req.body)
        const { user, product, rating, comments } = req.body;

        // Check if the user has already submitted a review for this product
        const existingReview = await Review.findOne({ user: user, product: product });

        if (existingReview) {
            // If a review already exists, you can choose to reject the new submission
            return res.status(400).json({ error: "You have already submitted a review for this product." });
        }
        
        const savedReview = await Review.create(req.body)
        // Respond with the saved review
        res.status(201).json(savedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Could not create review" });
    }
};

exports.getReviews = async (req, res) => {

    try {
      const filterOption = {}
      if (req.query.id){
        filterOption.product = req.query.id
      }
      // Retrieve all reviews from the database, populating user and product fields
      const reviews = await Review.find(filterOption).populate('user').populate('product');
  
      // If there are no reviews, respond with a message
      // if (!reviews || reviews.length === 0) {
      //   return res.status(404).json({ message: "No reviews found" });
      // }
  
      // Respond with the populated reviews
      res.status(200).json(reviews);
    } catch (error) {
      // If an error occurs, respond with an error message
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comments } = req.body;

    // Check if the review exists
    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update the review fields
    existingReview.rating = rating;
    existingReview.comments = comments;

    // Save the updated review
    const updatedReview = await existingReview.save();

    // Respond with the updated review
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Could not update review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the review exists
    const existingReview = await Review.findById(id);

    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Delete the review
    await existingReview.remove();

    // Respond with a success message
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Could not delete review" });
  }
};

