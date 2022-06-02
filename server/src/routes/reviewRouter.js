const router = require("express").Router();
const reviewCtrl = require("../controllers/reviewCtrl");
const { auth, admin } = require("../middleware/auth");
const { validateRatings, validate } = require("../middleware/validator");
router.post(
  "/add/:movieId",
  auth,
  validateRatings,
  validate,
  reviewCtrl.addReview
);

router.patch(
  "/:reviewId",
  auth,
  validateRatings,
  validate,
  reviewCtrl.updateReview
);

router.delete("/:reviewId",auth,reviewCtrl.removeReview);

router.get('/get-reviews-by-movie/:movieId', reviewCtrl.getReviewByMovie)


module.exports = router;
