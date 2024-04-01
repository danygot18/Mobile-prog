import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";

const ReviewSection = ({ product, token }) => {
  console.log(product + " 8");
  const [rating, setRating] = useState(5); // Initial rating value
  const [comments, setComments] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviews, setReviews] = useState([]);

  const user = JSON.parse(SyncStorage.get("user"));
  

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseURL}/reviews?id=${product._id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch reviews when the component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  const handleIncrementRating = () => {
    if (rating < 5) {
      setRating(rating + 1);
    }
  };

  const handleDecrementRating = () => {
    if (rating > 1) {
      setRating(rating - 1);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      console.log(user["_id"]);
      const reviewData = {
        product: product._id,
        user: user._id, // Include the user ID in the review data
        rating,
        comments,
      };

      // Make the review submission request with the user's token
      const response = await axios.post(`${baseURL}/reviews`, reviewData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Review submitted successfully:", response.data);
      setRating(1); // Reset rating to 1 after submission
      setComments(""); // Clear comments after submission
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <ScrollView>
      <View>
        <Text style={styles.title}>Reviews</Text>
        {reviews.map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.avatarContainer}>
              <Image
                style={styles.avatar}
                source={{ uri: review.user.image }}
              />
            </View>
            <View style={styles.commentContainer}>
              <Text style={styles.userName}>{review.user.name}</Text>
              <Text>Comment: {review.comments}</Text>
            </View>
          </View>
        ))}

        <>
          <Text style={styles.title}>Leave a Review:</Text>
          <View style={styles.ratingContainer}>
            <Button title="-" onPress={handleDecrementRating} />
            <Text>{rating}</Text>
            <Button title="+" onPress={handleIncrementRating} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Comments"
            value={comments}
            onChangeText={(text) => setComments(text)}
            multiline={true}
            numberOfLines={4}
          />
          <Button
            title="Submit Review"
            onPress={handleReviewSubmit}
            disabled={hasReviewed} // Disable the button if the user has already reviewed
          />
        </>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reviewContainer: {
    flexDirection: "row", // Align avatar and comment side by side
    alignItems: "center", // Center items vertically
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  commentContainer: {
    flex: 1, // Take up remaining space in the row
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default ReviewSection;
