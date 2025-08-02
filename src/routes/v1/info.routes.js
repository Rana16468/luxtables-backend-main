const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { infoController, authController } = require("../../controllers");

const router = express.Router();

router
  .route("/privacy-policy")
  .post(auth("admin"), infoController.createPrivacy)
  .get(infoController.queryPrivacy);

router
  .route("/terms-condition")
  .post(auth("admin"), infoController.createTerms)
  .get(infoController.queryTerms);

router
  .route("/about-us")
  .post(auth("admin"), infoController.createAboutUs)
  .get(infoController.queryAboutUs);

router
  .route("/support")
  .post(auth("admin"), infoController.createSupport)
  .get(infoController.querySupport);

router
  .route("/notifications")
  .get(auth("common"), infoController.getAllNotifications);


module.exports = router;
