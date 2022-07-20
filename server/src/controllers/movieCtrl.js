const Movie = require("../models/movieModel");
const Review = require("../models/reviewModel");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const {
  sendError,
  formatActors,
  averageRatingPiPeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeLine,
} = require("../utils/helper");
const mongoose = require("mongoose");

const movieCtrl = {
  uploadTrailer: async (req, res) => {
    try {
      const { file } = req;
      if (!file) return sendError(res, "Video file is missing!");
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { resource_type: "video" }
      );
      res.json({ url, public_id });
    } catch (err) {}
  },
  createMovie: async (req, res) => {
    try {
      const { file, body } = req;
      const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        genres,
        type,
        tags,
        cast,
        writers,
        trailer,
        language,
      } = body;
      const newMovie = await new Movie({
        title,
        storyLine,
        releseDate,
        status,
        type,
        genres,
        tags,
        cast,
        trailer,
        language,
      });
      if (director) {
        if (!isValidObjectId(director)) {
          return sendError(res, "Invalid director id!");
        }
        newMovie.director = director;
      }
      if (writers) {
        for (let writerId of writers) {
          if (!isValidObjectId(writerId))
            return sendError(res, "Invalid writer id!");
        }
        newMovie.writers = writers;
      }
      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await cloudinary.uploader.upload(file.path, {
        transformation: {
          width: 1280,
          height: 720,
        },
        responsive_breakpoints: {
          create_derived: true,
          max_width: 640,
          max_images: 3,
        },
      });
      const finalPoster = { url, public_id, responsive: [] };
      const { breakpoints } = responsive_breakpoints[0];

      if (breakpoints.length > 0) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          finalPoster.responsive.push(secure_url);
        }
        newMovie.poster = finalPoster;
      }

      await newMovie.save();

      res.json({
        movie: {
          id: newMovie._id,
          title,
        },
      });
    } catch (err) {}
  },
  updateMovieWithoutPoster: async (req, res) => {
    try {
      const { movieId } = req.params;
      if (!isValidObjectId(movieId)) return sendError(res, "Invalid Moive ID!");
      const movie = await Movie.findById(movieId);
      if (!movie) return sendError(res, "Movie Not Found!");
      const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        genres,
        type,
        tags,
        cast,
        writers,
        trailer,
        language,
      } = req.body;

      if (director) {
        if (!isValidObjectId(director)) {
          return sendError(res, "Invalid director id!");
        }
        movie.director = director;
      }
      if (writers) {
        for (let writerId of writers) {
          if (!isValidObjectId(writerId))
            return sendError(res, "Invalid writer id!");
        }
        movie.writers = writers;
      }
      movie.title = title;
      movie.storyLine = storyLine;
      movie.tags = tags;
      movie.releseDate = releseDate;
      movie.type = type;
      movie.cast = cast;
      movie.trailer = trailer;
      movie.language = language;
      movie.status = status;
      movie.genres = genres;
      await movie.save();
      res.status(200).json({ message: "Movie is updated" });
    } catch (error) {}
  },
  updateMovie: async (req, res) => {
    try {
      const { movieId } = req.params;
      const { file } = req;
      if (!isValidObjectId(movieId)) return sendError(res, "Invalid Moive ID!");

      // if (!req.file) return sendError(res, "Movie poster missing!");

      const movie = await Movie.findById(movieId);
      if (!movie) return sendError(res, "Movie Not Found!");
      const {
        title,
        storyLine,
        director,
        releseDate,
        status,
        genres,
        type,
        tags,
        cast,
        writers,
        trailer,
        language,
      } = req.body;

      if (director) {
        if (!isValidObjectId(director)) {
          return sendError(res, "Invalid director id!");
        }
        movie.director = director;
      }
      if (writers) {
        for (let writerId of writers) {
          if (!isValidObjectId(writerId))
            return sendError(res, "Invalid writer id!");
        }
        movie.writers = writers;
      }

      //update poster

      if (file) {
        const {
          secure_url: url,
          public_id,
          responsive_breakpoints,
        } = await cloudinary.uploader.upload(file.path, {
          transformation: {
            width: 1280,
            height: 720,
          },
          responsive_breakpoints: {
            create_derived: true,
            max_width: 640,
            max_images: 3,
          },
        });
        const finalPoster = { url, public_id, responsive: [] };
        const { breakpoints } = responsive_breakpoints[0];

        if (breakpoints.length > 0) {
          for (let imgObj of breakpoints) {
            const { secure_url } = imgObj;
            finalPoster.responsive.push(secure_url);
          }
        }

        movie.poster = finalPoster;
      }

      // remove poster from cloud
      if (file) {
        const publicId = movie.poster?.public_id;
        if (publicId) {
          const { result } = await cloudinary.uploader.destroy(publicId);
          if (result !== "ok") {
            return sendError(res, "Could not update poster at the mement!");
          }
        }
      }
      // uploading poster

      movie.title = title;
      movie.storyLine = storyLine;
      movie.tags = tags;
      movie.releseDate = releseDate;
      movie.type = type;
      movie.cast = cast;
      movie.language = language;
      movie.status = status;
      movie.genres = genres;
      await movie.save();
      res.status(200).json({
        message: "Movie is updated",
        movie: {
          id: movie._id,
          poster: movie.poster?.url,
          genres: movie.genres,
          status: movie.status,
          title: movie.title,
        },
      });
    } catch (error) {}
  },
  deleteMovie: async (req, res) => {
    try {
      const { movieId } = req.params;
      if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!");

      const movie = await Movie.findById(movieId);

      if (!movie) return sendError(res, "Movie Not Found!");

      if (movie.poster?.public_id) {
        const { result } = await cloudinary.uploader.destroy(
          movie.poster?.public_id
        );
        if (result !== "ok")
          sendError(res, "Could not remove poster from cloud!");
      }

      const trailerId = movie.trailer?.public_id;

      if (!trailerId)
        return sendError(res, "Could not find trailer in the cloud!");
      const { result } = await cloudinary.uploader.destroy(trailerId, {
        resource_type: "video",
      });
      if (result !== "ok")
        return sendError(res, "Could not update trailer from cloud!");

      await Movie.findByIdAndDelete(movieId);

      res.status(200).json({ message: "Movie deleted successfully!" });
    } catch (error) {}
  },
  getMovies: async (req, res) => {
    try {
      const { pageNo = 0, limit = 10 } = req.query;
      const movies = await Movie.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

      const finalMovies = movies?.map((movie) => {
        return {
          id: movie._id,
          title: movie.title,
          poster: movie.poster?.url,
          genres: movie.genres,
          status: movie.status,
          responsivePosters: movie.poster?.responsive,
        };
      });

      res.status(200).json({ movies: finalMovies });
    } catch (err) {}
  },
  getMovieForUpdate: async (req, res) => {
    try {
      const { movieId } = req.params;
      if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid");

      const movie = await Movie.findById(movieId).populate(
        "director writers cast.actor"
      );
      res.status(200).json({
        movie: {
          id: movie._id,
          title: movie.title,
          storyLine: movie.storyLine,
          poster: movie.poster?.url,
          releseDate: movie.releseDate,
          status: movie.status,
          type: movie.type,
          language: movie.language,
          genres: movie.genres,
          tags: movie.tags,
          director: formatActors(movie.director),
          writers: movie.writers.map((w) => formatActors(w)),
          cast: movie.cast.map((c) => {
            return {
              id: c._id,
              profile: formatActors(c.actor),
              roleAs: c.roleAs,
              leadActor: c.leadActor,
            };
          }),
        },
      });
    } catch (err) {}
  },
  searchMovie: async (req, res) => {
    try {
      const { title } = req.query;
      if (!title.trim()) return sendError(res, "Invalid request!");
      const movies = await Movie.find({
        title: { $regex: title, $options: "i" },
      });

      res.status(200).json({
        results: movies?.map((m) => {
          return {
            id: m._id,
            title: m.title,
            poster: m.poster?.url,
            genres: m.genres,
            status: m.status,
          };
        }),
      });
    } catch (error) {}
  },
  getLatestUploads: async (req, res) => {
    const { limit = 5 } = req.query;
    const results = await Movie.find({ status: "public" })
      .sort("-createdAt")
      .limit(parseInt(limit));

    const movies = results.map((m) => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        trailer: m.trailer?.url,
        responsivePosters: m.poster?.responsive,
        storyLine: m.storyLine,
      };
    });
    return res.status(200).json({ movies });
  },
  getSingleMovie: async (req, res) => {
    const { movieId } = req.params;
    if (!isValidObjectId(movieId))
      return sendError(res, "Movie id is not valid!");
    const movie = await Movie.findById(movieId).populate(
      "director writers cast.actor"
    );

    const reviews = await getAverageRatings(movie._id);

    const {
      _id: id,
      title,
      storyLine,
      cast,
      writers,
      director,
      releseDate,
      genres,
      tags,
      language,
      trailer,
      poster,
      type,
    } = movie;
    res.status(200).json({
      movie: {
        id,
        title,
        storyLine,
        releseDate,
        genres,
        tags,
        language,
        type,
        trailer: trailer?.url,
        poster: poster?.url,
        cast: cast.map((c) => ({
          id: c._id,
          profile: {
            id: c.actor._id,
            name: c.actor.name,
            avatar: c.actor?.avatar?.url,
          },
          leadActor: c.leadActor,
          roleAs: c.roleAs,
        })),
        writers: writers.map((w) => ({
          id: w._id,
          name: w.name,
        })),
        director: {
          id: director._id,
          name: director.name,
        },
        reviews: { ...reviews },
      },
    });
  },
  getRelatedMovies: async (req, res) => {
    const { movieId } = req.params;
    if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

    const movie = await Movie.findById(movieId);

    const movies = await Movie.aggregate(
      relatedMovieAggregation(movie.tags, movie._id)
    );

    let relatedMovies = await Promise.all(
      movies.map(async (m) => {
        const reviews = await getAverageRatings(m._id);

        return {
          id: m._id,
          title: m.title,
          poster: m.poster,
          responsivePosters: m.responsivePosters,
          reviews: { ...reviews },
        };
      })
    );

    relatedMovies = relatedMovies.filter((m) => {
      if (m.id === movieId) return null;
      return m;
    });


    res.status(200).json({ movies: relatedMovies });
  },
  getTopRatedMovies: async (req, res) => {
    const { type = "Film" } = req.query;

    const movies = await Movie.aggregate(topRatedMoviesPipeLine(type));
    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);

      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
        reviews: { ...reviews },
      };
    };

    const topRatedMovies = await Promise.all(movies.map(mapMovies));
    res.status(200).json({ movies: topRatedMovies });
  },
  searchPublicMovies: async (req, res) =>{
    const { title } = req.query;
    if (!title.trim()) return sendError(res, "Invalid request!");
    const movies = await Movie.find({
      title: { $regex: title, $options: "i" },
      status: "public"
    });

    const mapMovies = async (m) => {
      const reviews = await getAverageRatings(m._id);

      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        responsivePosters: m.poster?.responsive,
        reviews: { ...reviews },
      };
    };

    const results = await Promise.all(movies.map(mapMovies));

    res.status(200).json({results});
  }
};
module.exports = movieCtrl;
