const httpStatus = require("http-status");
const aboutUsModel = require("../models/aboutUs.model");
const ApiError = require("../utils/ApiError");

const AboutUs = async () => {
  return aboutUsModel.find();
};

const FindBySpecificAbout = async (id) => {
  return aboutUsModel.findById(id);
};

const UpdateAboutUs = async (id, payload) => {
  const result = await aboutUsModel.updateOne(
    { _id: id },
    { content: payload.content },
    { new: true, upsert: true }
  );
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_IMPLEMENTED,
      "some issues by the update  about section",
      ""
    );
  }
  return result && { message: "successfully update about us" };
};

module.exports = {
  AboutUs,
  FindBySpecificAbout,
  UpdateAboutUs,
};
