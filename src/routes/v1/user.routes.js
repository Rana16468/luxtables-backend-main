const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const {
  AboutUsController,
  FindBySpecificAboutController,
  UpdateAboutUsController,
} = require("../../controllers/aboutUs.controller");
const UPLOADS_FOLDER_USERS = "./public/uploads/users";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/self/in").get(auth("common"), userController.getProfile);

router
  .route("/self/update")
  .patch(
    auth("common"),
    validate(userValidation.updateUser),
    [uploadUsers.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    userController.updateProfile
  );

router.get(
  "/get-trending-restaurants",
  auth("common"),
  userController.TrendingPlacesAndTopRatedRestaurants
);

router.get(
  "/get-restaurant-info",
  auth("common"),
  userController.restaurantInfo
);

router
  .route("/book-mark")
  .post(auth("common"), userController.addToBookMark)
  .get(auth("common"), userController.getUserBookmarks);

router.get("/self/in/all_users", auth("admin"), userController.getUsers);
router.get(
  "/self/in/dashboardInfo",
  auth("admin"),
  userController.dashboardInfo
);

router.get("/self/in/about_us", auth("admin"), AboutUsController);
router.get(
  "/self/in/specific_aboutUs/:id",
  auth("admin"),
  FindBySpecificAboutController
);
router.patch("/self/in/update_aboutUs/:id", auth('admin'), UpdateAboutUsController);

module.exports = router;
