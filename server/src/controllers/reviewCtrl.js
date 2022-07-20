const Review = require("../models/reviewModel");
const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const { sendError, getAverageRatings } = require("../utils/helper");
const { isValidObjectId } = require("mongoose");
const reviewCtrl = {
  addReview: async (req, res) => {
    const { movieId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if(!user.isVerified) return sendError(res,"Please verify your email first!")
    

    if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie!");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user ID");

    const movie = await Movie.findOne({ _id: movieId, status: "public" });

    if (!movie) return sendError(res, "Movie not found!");

    const isAlreadyReviewed = await Review.findOne({
      owner: userId,
      parentMovie: movie._id,
    });
    if (isAlreadyReviewed)
      return sendError(res, "Invalid request review is already their!");

    // create and update review
    const newReview = new Review({
      owner: userId,
      parentMovie: movie._id,
      content,
      rating,
    });

    // updating review for movie
    movie.reviews.push(newReview._id);
    await movie.save();

    // saving new review
    await newReview.save();

    const reviews = await getAverageRatings(movie._id);

    res.status(200).json({ message: "Your review has been added.", reviews });
  },
  updateReview: async (req, res) => {
    const { reviewId } = req.params;
    const { content, rating } = req.body;
    const userId = req.user.id;
    if (!isValidObjectId(reviewId)) return sendError(res, "Invalid Review!");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user ID");

    const review = await Review.findOne({ owner: userId, _id: reviewId });
    if (!review) return sendError(res, "Review not found!");

    review.rating = rating;
    review.content = content;

    await review.save();

    res.status(200).json({ message: "Your review has been updated" });
  },
  removeReview: async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review ID!");
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user ID");

    const review = await Review.findOne({ owner: userId, _id: reviewId });
    if (!review) return sendError(res, "Invalid request, review not found!");

    const movie = await Movie.findById(review.parentMovie).select("reviews");

    movie.reviews = movie.reviews.filter((r) => r.toString() !== reviewId);

    await Review.findByIdAndDelete(reviewId);

    await movie.save();

    res.status(200).json({ message: "Review removed successfully!" });
  },
  getReviewByMovie: async (req, res) => {
    const { movieId } = req.params;

    if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie!");

    const movie = await Movie.findById(movieId)
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
          select: "name",
        },
      })
      .select("reviews title");

    const reviews = movie.reviews?.map((r) => {
      const { owner, content, rating, _id: reviewID } = r;
      const { name, _id: ownerId } = owner;
      return {
        id: reviewID,
        owner: {
          id: ownerId._id,
          name,
        },
        content,
        rating,
      };
    });

    res.status(200).json({ movie:{
      title: movie.title,
      reviews
      
    } 
   });
  },
};

module.exports = reviewCtrl;
