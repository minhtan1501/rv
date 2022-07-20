const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");
const movieCtrl = require("../controllers/movieCtrl");
const { uploadVideo, uploadImage } = require("../middleware/multer");
const { parseData } = require("../utils/helper");
const { validateMovie, validate, validateTrailer } = require("../middleware/validator");

router.post(
  "/upload-trailer",
  auth,
  admin,
  uploadVideo.single("video"),
  movieCtrl.uploadTrailer
);

router.post(
  "/create",
  auth,
  admin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  movieCtrl.createMovie
);
router.patch(
  "/update-movie-without-poster/:movieId",
  auth,
  admin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  movieCtrl.updateMovieWithoutPoster
);

router.patch(
  "/update/:movieId",
  auth,
  admin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  movieCtrl.updateMovie)

router.delete("/:movieId", auth, admin, movieCtrl.deleteMovie);
router.get('/movies',auth,admin, movieCtrl.getMovies)
router.get('/for-update/:movieId',auth,admin, movieCtrl.getMovieForUpdate)
router.get('/search',auth,admin, movieCtrl.searchMovie)


//for normal user

router.get('/latest-uploads',movieCtrl.getLatestUploads)
router.get('/single/:movieId',movieCtrl.getSingleMovie)
router.get('/related/:movieId',movieCtrl.getRelatedMovies)
router.get('/top-rated',movieCtrl.getTopRatedMovies)
router.get('/search-public', movieCtrl.searchPublicMovies)

module.exports = router;
