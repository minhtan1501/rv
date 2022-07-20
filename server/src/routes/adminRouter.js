const router = require("express").Router();
const { auth, admin } = require("../middleware/auth");
const adminCtrl = require("../controllers/adminCtrl")

router.get("/app-info", auth, admin, adminCtrl.getAppInfo);
router.get("/most-rated",auth, admin, adminCtrl.getMostRendered)

module.exports = router