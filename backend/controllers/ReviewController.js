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

        // Create a new review instance
        // const newReview = new Review({ user, product, rating, comments });

        // Save the review to the database
        // const savedReview = await newReview.save();
        
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



