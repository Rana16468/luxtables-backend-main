const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { userService } = require("../services");
const unlinkImages = require("../common/unlinkImage");
const { default: axios } = require("axios");
const cheerio = require("cheerio");
const {
  addRestaurantToBookMarSchemaValidator,
} = require("../validations/functions.validation");
const Bookmark = require("../models/bookmark.model");
const { userController } = require(".");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "User Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: user,
    })
  );
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "gender"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).json(
    response({
      message: "All Users",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.id);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is deleted");
  }

  if (user.isBlocked) {
    throw new ApiError(httpStatus.NOT_FOUND, "The account is blocked");
  }

  const { securitySettings } = user;

  res.status(httpStatus.OK).json(
    response({
      message: "User Profile",
      status: "OK",
      statusCode: httpStatus.OK,
      data: { user, securitySettings },
    })
  );
});

const getUser = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  res.status(httpStatus.OK).json(
    response({
      message: "User",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateUser = catchAsync(async (req, res) => {
  if (req.body.interest) {
    const parsedInterest = JSON.parse(req.body.interest);
    req.body.interest = parsedInterest;
  }
  const image = {};
  console.log(req.file);
  if (req.file) {
    image.url = "/uploads/users/" + req.file.filename;
    image.path = req.file.path;
  }
  if (req.file) {
    req.body.image = image;
  }

  const user = await userService.updateUserById(req.params.userId, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const updateProfile = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.image = `/uploads/users/${req.file.filename}`;
  }

  // Set fullName if firstName or lastName is provided
  if (!req.body.fullName && (req.body.firstName || req.body.lastName)) {
    req.body.fullName = `${req.body.firstName || ""} ${
      req.body.lastName || ""
    }`.trim();
  }

  const user = await userService.updateUserById(req.user.id, req.body);

  res.status(httpStatus.OK).json(
    response({
      message: "User Updated",
      status: "OK",
      statusCode: httpStatus.OK,
      data: user,
    })
  );
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).json(
    response({
      message: "User Deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: {},
    })
  );
});

const TrendingPlacesAndTopRatedRestaurants = catchAsync(async (req, res) => {
  const url = `${process.env.APPOINTMENTTRADER_BASE_URL}/v1/location/get_list?key=${process.env.APPOINTMENTTRADER_KEY}&searchFilter=london`;
  const responseData = await axios.get(url);

  res.status(httpStatus.OK).json(
    response({
      message: "Success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: responseData.data,
    })
  );
});

const dashboardInfo = catchAsync(async (req, res) => {
  const result = await userService.dashboardInfo();
  res.status(httpStatus.OK).json(
    response({
      message: "Success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const addToBookMark = catchAsync(async (req, res) => {
  const { value, error } = addRestaurantToBookMarSchemaValidator.validate(
    req.body
  );

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      error: error.details,
    });
  }

  try {
    const userId = req.user.id;

    const newBookmark = await Bookmark.create({
      ...value,
      user: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant added to bookmarks successfully",
      data: newBookmark,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the restaurant to bookmarks",
      error: err.message,
    });
  }
});

const getUserBookmarks = catchAsync(async (req, res) => {
  const userId = req.user.id;

  try {
    const bookmarks = await Bookmark.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!bookmarks.length) {
      return res.status(404).json({
        success: false,
        message: "No bookmarks found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User's bookmarks retrieved successfully",
      data: bookmarks,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the bookmarks",
      error: err.message,
    });
  }
});

const restaurantInfo = catchAsync(async (req, res) => {
  const { locationAlias } = req.query;

  const url = `${process.env.APPOINTMENTTRADER_BASE_URL}/v1/bid/get_list?key=${process.env.APPOINTMENTTRADER_KEY}&locationAlias=${locationAlias}`;
  const responseData = await axios.get(url);

  res.status(httpStatus.OK).json(
    response({
      message: "Success",
      status: "OK",
      statusCode: httpStatus.OK,
      data: responseData.data,
    })
  );
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  getProfile,
  updateUser,
  updateProfile,
  deleteUser,
  TrendingPlacesAndTopRatedRestaurants,
  addToBookMark,
  getUserBookmarks,
  restaurantInfo,
  dashboardInfo

};
