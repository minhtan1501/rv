const Movie = require("../models/movieModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const {
  topRatedMoviesPipeLine,
  getAverageRatings,
} = require("../utils/helper");
const adminCtrl = {
  getAppInfo: async (req, res) => {
    const movieCount = await Movie.countDocuments();
    const userCount = await User.countDocuments();
    const reviewCount = await Review.countDocuments();

    res.json({ movieCount, userCount, reviewCount });
  },
  getMostRendered: async (req, res) => {
    const { type = "Film" } = req.query;

    const movies = await Movie.aggregate(topRatedMoviesPipeLine());

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);

      return {
        id: m._id,
        title: m.title,
        reviews: { ...reviews },
      };
    };


    const topRatedMovies = await Promise.all(movies.map(mapMovies));
    console.log(topRatedMovies)
    res.json({ movies: topRatedMovies});
  },
};

module.exports = adminCtrl;
