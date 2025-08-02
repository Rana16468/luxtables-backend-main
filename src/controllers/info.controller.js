const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { infoService } = require("../services");

const createPrivacy = catchAsync(async (req, res) => {
  const privacy = await infoService.createPrivacy(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Privacy Policy Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: privacy,
    })
  );
});

const queryPrivacy = catchAsync(async (req, res) => {
  const result = await infoService.queryPrivacy();
  res.status(httpStatus.OK).json(
    response({
      message: "Privacy Policy",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const createTerms = catchAsync(async (req, res) => {
  const terms = await infoService.createTerms(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Terms and Condition Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: terms,
    })
  );
});

const queryTerms = catchAsync(async (req, res) => {
  const result = await infoService.queryTerms();
  res.status(httpStatus.OK).json(
    response({
      message: "Terms and Condition",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const createAboutUs = catchAsync(async (req, res) => {
  const trustSafety = await infoService.createAboutUs(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "About us Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: trustSafety,
    })
  );
});

const queryAboutUs = catchAsync(async (req, res) => {
  const result = await infoService.queryAboutUs();
  res.status(httpStatus.OK).json(
    response({
      message: "About us",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const createSupport = catchAsync(async (req, res) => {
  const trustSafety = await infoService.createSupport(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Support Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: trustSafety,
    })
  );
});

const querySupport = catchAsync(async (req, res) => {
  const result = await infoService.querySupport();
  res.status(httpStatus.OK).json(
    response({
      message: "Support",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

const getAllNotifications = catchAsync(async (req, res) => {
  const notification = await infoService.gerAllNotifications(req.user.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Notifications fetched successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notification,
    })
  );
});

const updateNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.body;
  const status = "read";

  const notification = await infoService.updateNotification(
    notificationId,
    status
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Notifications fetched successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: notification,
    })
  );
});

const reportImage = catchAsync(async (req, res) => {
  req.body.createdBy = req.user.id;

  const newReport = await infoService.reportImage(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "Report send successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: newReport,
    })
  );
});

const getAllReports = catchAsync(async (req, res) => {
  const reports = await infoService.getAllReports();
  res.status(httpStatus.OK).json(
    response({
      message: "All reports",
      status: "OK",
      statusCode: httpStatus.OK,
      data: reports,
    })
  );
});

const getSingleReport = catchAsync(async (req, res) => {
  const reportId = req.params.reportId;
  const report = await infoService.getSingleReport(reportId);
  res.status(httpStatus.OK).json(
    response({
      message: "Single report detels",
      status: "OK",
      statusCode: httpStatus.OK,
      data: report,
    })
  );
});

const declineReport = catchAsync(async (req, res) => {
  const reportId = req.body.reportId;
  if (!reportId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Report Id is required");
  }
  const report = await infoService.declineReport(reportId);
  res.status(httpStatus.OK).json(
    response({
      message: "Decline Report",
      status: "OK",
      statusCode: httpStatus.OK,
      data: report,
    })
  );
});

const deleteReportImage = catchAsync(async (req, res) => {
  const reportId = req.body.reportId;
  if (!reportId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Report Id is required");
  }
  const report = await infoService.deleteReportImage(reportId);
  res.status(httpStatus.OK).json(
    response({
      message: "Report Image is deleted",
      status: "OK",
      statusCode: httpStatus.OK,
      data: report,
    })
  );
});

module.exports = {
  createPrivacy,
  queryPrivacy,
  createTerms,
  queryTerms,
  createAboutUs,
  queryAboutUs,
  createSupport,
  querySupport,

  getAllNotifications,
  updateNotification,

  reportImage,
  getAllReports,
  getSingleReport,
  declineReport,
  deleteReportImage,
};
