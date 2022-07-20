const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/reviewModel");

exports.sendError = (res, error, statusCode = 400) => {
  res.status(statusCode).json({ error: error });
};

exports.generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buf) => {
      if (err) reject(err);
      const buffString = buf.toString("hex");
      resolve(buffString);
    });
  });
};

exports.handleNotFound = (req, res, next) => {
  this.sendError(res, "Not Found");
};

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    {
      folder: "baocao",
      aspect_ratio: "5:6",
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    }
  );
  return { url, public_id };
};

exports.formatActors = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar.url,
  };
};

exports.parseData = (req, res, next) => {
  const { trailer, cast, genres, tags, writers } = req.body;

  if (trailer) req.body.trailer = JSON.parse(trailer);
  if (cast) req.body.cast = JSON.parse(cast);
  if (genres) req.body.genres = JSON.parse(genres);
  if (tags) req.body.tags = JSON.parse(tags);
  if (writers) req.body.writers = JSON.parse(writers);
  next();
};

exports.averageRatingPiPeline = (movieId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: {
        parentMovie: movieId,
      },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ];
};

exports.relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "relatedMovies",
      },
    },
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters:"$poster.responsive"
      },
    },
    {
      $limit: 5,
    },
  ];
};

exports.getAverageRatings = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPiPeline(movieId)
  );
  const reviews = {};
  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.ratingCount = reviewCount;
  }

  return reviews;
};

exports.topRatedMoviesPipeLine = (type) => {

  const matchOptions = {
    reviews: {$exists: true},
    status: {$eq: "public"}
  }

  if(type) matchOptions.type = {$eq:type};

  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters:'$poster.responsive',
        reviewCount: {
          $size: "$reviews",
        },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};
