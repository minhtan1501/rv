const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");
const movieCtrl = require("../controllers/movieCtrl");
const { uploadVideo, uploadImage } = require("../middleware/multer");
const { parseData } = require("../utils/helper");
const { validateMovie, validate } = require("../middleware/validator");

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
  "/update-movie-with-poster/:movieId",
  auth,
  admin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  movieCtrl.updateMovieWithPoster
);

router.delete("/:movieId", auth, admin, movieCtrl.deleteMovie);
router.get('/movies',auth,admin, movieCtrl.getMovies)
router.get('/for-update/:movieId',auth,admin, movieCtrl.getMovieForUpdate)

module.exports = router;
