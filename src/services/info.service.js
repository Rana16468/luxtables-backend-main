const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {
  PrivacyPolicy,
  TermsAndCondition,
  AboutUs,
  Support,
  Notification,
  Report,
} = require("../models");
const he = require("he");
const { getUserById } = require("./user.service");

const createPrivacy = async (privacyBody) => {
  if (privacyBody.content) {
    privacyBody.content = he.decode(privacyBody.content);
  }

  const existingPrivacy = await PrivacyPolicy.findOne();
  if (existingPrivacy) {
    existingPrivacy.set(privacyBody);
    await existingPrivacy.save();
    return existingPrivacy;
  } else {
    const newPrivacy = await PrivacyPolicy.create(privacyBody);
    return newPrivacy;
  }
};

const queryPrivacy = async () => {
  const privacy = await PrivacyPolicy.find();
  return privacy;
};

const createTerms = async (termsBody) => {
  if (termsBody.content) {
    termsBody.content = he.decode(termsBody.content);
  }

  const existingTerms = await TermsAndCondition.findOne();
  if (existingTerms) {
    existingTerms.set(termsBody);
    await existingTerms.save();
    return existingTerms;
  } else {
    const newTerms = await TermsAndCondition.create(termsBody);
    return newTerms;
  }
};

const queryTerms = async () => {
  const terms = await TermsAndCondition.find();
  return terms;
};

const createAboutUs = async (body) => {
  if (body.content) {
    body.content = he.decode(body.content);
  }

  const existingAboutUs = await AboutUs.findOne();
  if (existingAboutUs) {
    existingAboutUs.set(body);
    await existingAboutUs.save();
    return existingAboutUs;
  } else {
    const newAboutUs = await AboutUs.create(body);
    return newAboutUs;
  }
};

const queryAboutUs = async () => {
  const newAboutUs = await AboutUs.find();
  return newAboutUs;
};

const createSupport = async (body) => {
  if (body.content) {
    body.content = he.decode(body.content);
  }

  const existingSupport = await Support.findOne();
  if (existingSupport) {
    existingSupport.set(body);
    await existingSupport.save();
    return existingSupport;
  } else {
    const newSupport = await Support.create(body);
    return newSupport;
  }
};

const querySupport = async () => {
  const newSupport = await Support.find();
  return newSupport;
};

const gerAllNotifications = async (id) => {
  const notifications = await Notification.find({ userId: id }).sort({
    createdAt: -1,
  });

  const totalUnread = await Notification.countDocuments({
    userId: id,
    status: "unread",
  });
  const totalRead = await Notification.countDocuments({
    userId: id,
    status: "read",
  });

  return {
    notifications,
    totalUnread,
    totalRead,
  };
};

const updateNotification = async (id, updateData) => {
  const updatedNotification = await Notification.findOneAndUpdate(
    { _id: id },
    { $set: { status: updateData } },
    { new: true }
  );

  return updatedNotification;
};

const reportImage = async (reportData) => {
  const report = await Report.create(reportData);
  return report;
};

const getAllReports = async (date) => {
  const reports = await Report.find({
    isDecline: false,
    isDeleted: false,
  }).populate({
    path: "createdBy profile",
    select:
      "fullName role callingCode phoneNumber photos coverImage profileImage email",
  });
  return reports;
};

const getSingleReport = async (id) => {
  const report = await Report.find({
    _id: id,
    isDecline: false,
    isDeleted: false,
  }).populate({
    path: "createdBy profile",
    select:
      "fullName role callingCode phoneNumber photos coverImage profileImage email",
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Report found");
  }

  return report;
};

const declineReport = async (reportId) => {
  const updatedReport = await Report.findByIdAndUpdate(
    reportId,
    { isDecline: true },
    { new: true }
  );
  return updatedReport;
};

const deleteReportImage = async (reportId) => {
  const report = await Report.findOne({
    _id: reportId,
    isDecline: false,
    isDeleted: false,
  });

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "No report found");
  }

  const profile = await getUserById(report?.profile);

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Profile not found");
  }

  // Check if the image exists in profile.photos
  const imageIndex = profile.photos.indexOf(report.image);

  if (imageIndex !== -1) {
    profile.photos.splice(imageIndex, 1);
    await profile.save();
    report.isDeleted = true;
    await report.save();
    console.log("✅ Image removed from profile.photos and profile updated");
  } else {
    console.log("⚠️ Image not found in profile.photos");
  }

  return report;
};

module.exports = {
  createPrivacy,
  queryPrivacy,
  createTerms,
  queryTerms,
  createAboutUs,
  queryAboutUs,

  createSupport,
  querySupport,

  gerAllNotifications,
  updateNotification,

  reportImage,
  getAllReports,
  getSingleReport,
  declineReport,
  deleteReportImage,
};
