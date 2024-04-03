import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import SyncStorage from "sync-storage";
import { Ionicons } from "@expo/vector-icons";

const ReviewSection = ({ product, token }) => {
  console.log(product + " 8");
  const [rating, setRating] = useState(5); // Initial rating value
  const [comments, setComments] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComments, setEditedComments] = useState("");
  const [menuVisible, setMenuVisible] = useState({});

  const user = JSON.parse(SyncStorage.get("user"));


  const fetchReviewsAndCheckReviewStatus = async () => {
    try {
      const response = await axios.get(`${baseURL}/reviews?id=${product._id}`);
      setReviews(response.data);
      // Check if the user has already reviewed the current product
      if (response.data.some(review => review.user._id === user._id)) {
        setHasReviewed(true);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviewsAndCheckReviewStatus();
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
      fetchReviewsAndCheckReviewStatus();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleEditModalOpen = (reviewId, initialRating, initialComments) => {
    setEditingReviewId(reviewId);
    setEditedRating(initialRating);
    setEditedComments(initialComments);
    setEditModalVisible(true);
  };

  const handleEditReview = async () => {
    try {
      const reviewData = {
        rating: editedRating,
        comments: editedComments,
      };

      const response = await axios.put(
        `${baseURL}/reviews/${editingReviewId}`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Review updated successfully:", response.data);
      setEditModalVisible(false);
      fetchReviewsAndCheckReviewStatus();// Refresh reviews after updating
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${baseURL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Review deleted successfully:", response.data);
      // After deleting the review, refresh the list of reviews
      fetchReviewsAndCheckReviewStatus();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEllipsisPress = () => {
    setMenuVisible(!menuVisible); // Toggle menu visibility
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const toggleMenuVisible = (reviewId) => {
    setMenuVisible(prevState => ({
      ...prevState,
      [reviewId]: !prevState[reviewId]
    }));
  };

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableHighlight key={i} onPress={() => setRating(i)}>
          <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={24} color="orange" />
        </TouchableHighlight>
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => setMenuVisible(false)}>
      <ScrollView>
        <View>
          <Text style={styles.title}>Reviews</Text>
          {reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View style={styles.avatarContainer}>
                <Image style={styles.avatar} source={{ uri: review.user.image }} />
              </View>
              <View style={styles.commentContainer}>
                <View style={styles.header}>
                <Text style={styles.userName}>{review.user.name}</Text>
                  <Text style={styles.userName}>{review.user.name}</Text>
                  
                  {user._id === review.user._id && (
                    <View style={styles.buttonContainer}>
                      <TouchableHighlight
                        style={[styles.button, styles.ellipsisButton]}
                        onPress={() => toggleMenuVisible(review._id)}
                      >
                        <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                      </TouchableHighlight>
                    </View>
                  )}
                </View>
                
                <Text>Comment: {review.comments}</Text>
                {/* Render menu if visible */}
                {menuVisible[review._id] && (
                  
                  // Render menu if visible for this specific review
                  <View style={styles.menu}>
                    
                    <TouchableHighlight
                      style={[styles.menuItem, styles.editButton]}
                      onPress={() =>
                        handleEditModalOpen(review._id, review.rating, review.comments)
                      }
                    >
                      <Ionicons name="ios-create-outline" size={24} color="black" />
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={[styles.menuItem, styles.deleteButton]}
                      onPress={() => handleDeleteReview(review._id)}
                    >
                      <Ionicons name="ios-trash-outline" size={24} color="red" />
                    </TouchableHighlight>
                  </View>
                )}
              </View>
            </View>
          ))}

          {!hasReviewed && (
            <>
              <Text style={styles.title}>Leave a Review:</Text>
              <View style={styles.ratingContainer}>
                {renderStars()}
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
          )}

          {/* Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Edit Review</Text>
                <View style={styles.modalRatingContainer}>
                  {renderStars()}
                </View>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Comments"
                  value={editedComments}
                  onChangeText={(text) => setEditedComments(text)}
                  multiline={true}
                  numberOfLines={4}
                />
                <Button title="Save" onPress={handleEditReview} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginLeft: 10,
    padding: 5,
  },
  ellipsisButton: {
    backgroundColor: "#eee",
  },
  menuBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to cover the screen
    zIndex: 0, // Place behind the menu
  },
  menu: {
    position: 'absolute',
    top: -40, // Adjust the distance from the ellipsis icon
    right: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1,
  },
  menuItemContainer: {
    flexDirection: "row",
  },
  menuItem: {
    padding: 5,
  },
});

export default ReviewSection;
