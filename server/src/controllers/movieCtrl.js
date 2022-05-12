const Movie = require("../models/movieModel");
const cloudinary = require("../cloud");
const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const movieCtrl = {
  uploadTrailer: async (req, res, next) => {
    try {
      const { file } = req;
      if (!file) return sendError(res, "Video file is missing!");
      console.log(file);
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { resource_type: "video" }
      );

      res.json({  url, public_id });
    } catch (err) {}
  },
  createMovie: async (req, res, next) => {
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
      }

      newMovie.poster = finalPoster;

      await newMovie.save();

      res.json({ id: newMovie._id });
    } catch (err) {}
  },
  updateMovieWithoutPoster: async (req, res, next) => {
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
      console.log(movie);
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
  updateMovieWithPoster: async (req, res, next) => {
    try {
      const { movieId } = req.params;
      if (!isValidObjectId(movieId)) return sendError(res, "Invalid Moive ID!");
      if (!req.file) return sendError(res, "Movie poster missing!");

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
      const publicId = movie.poster?.public_id;
      console.log(publicId)
      if (publicId) {
        const { result } = await cloudinary.uploader.destroy(publicId);
        if (result !== "ok") {
          return sendError(res, "Could not update poster at the mement!");
        }
      }

      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await cloudinary.uploader.upload(req?.file?.path, {
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
  deleteMovie: async (req, res, next) =>{
    try {
      const {movieId} = req.params;
      if(!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!");

      const movie = await Movie.findById(movieId);

      if(!movie) return sendError(res, "Movie Not Found!");

      if(movie.poster?.public_id){
        const {result}  = await cloudinary.uploader.destroy(movie.poster?.public_id)
        if(result !== 'ok') return sendError(res,"Could not remove poster from cloud!")
      }

      const trailerId = movie.trailer?.public_id

      if(!trailerId) return sendError(res, "Could not find trailer in the cloud!");
      const {result}  = await cloudinary.uploader.destroy(trailerId,{resource_type:'video'})
      if(result !== 'ok') return sendError(res,"Could not update trailer from cloud!")
      
      
      await Movie.findByIdAndDelete(movieId);

      res.status(200).json({message: "Movie deleted successfully!"})

    }catch (error){

    }
  }
};
module.exports = movieCtrl;
