const actorCtrl = require("../controllers/actorCtrl");
const { auth, admin } = require("../middleware/auth");
const { uploadImage } = require("../middleware/multer");
const { actorInfoValidator, validate } = require("../middleware/validator");

const actorRouter = require("express").Router();

actorRouter.post(
  "/create",
  auth,
  admin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  actorCtrl.create
);

actorRouter.post(
  "/update/:actorId",
  auth,
  admin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  actorCtrl.update
);

actorRouter.delete("/:actorId", auth, admin, actorCtrl.delete);

actorRouter.get("/latest-uploads", auth, admin, actorCtrl.getLatestActors);

actorRouter.get("/search", actorCtrl.search);

actorRouter.get("/actors", actorCtrl.getActors);

actorRouter.get("/single/:id", actorCtrl.getSingleActor);

module.exports = actorRouter;
