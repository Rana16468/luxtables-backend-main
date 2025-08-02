const httpStatus = require("http-status");
const {
  AboutUs,
  FindBySpecificAbout,
  UpdateAboutUs,
} = require("../services/aboutus.service");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { aboutValidation } = require("../validations/user.validation");

const AboutUsController = catchAsync(async (req, res) => {
  const result = await AboutUs();
  res.status(httpStatus.OK).json(
    response({
      message: "Successfully Find By The  About Us",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: result,
    })
  );
});

const FindBySpecificAboutController = catchAsync(async (req, res) => {
  const result = await FindBySpecificAbout(req.params.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Successfully Find By The  Specific  About Us",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: result,
    })
  );
});

const UpdateAboutUsController = catchAsync(async (req, res) => {
  const { value, error } = aboutValidation.body.validate(req.body); // ✅ use .validate()

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details,
    });
  }

  const result = await UpdateAboutUs(req.params.id, value);
  res.status(httpStatus.OK).json(
    response({
      message: "Successfully Updated About Us",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  AboutUsController,
  FindBySpecificAboutController,
  UpdateAboutUsController,
};
