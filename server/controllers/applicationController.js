
import mongoose from "mongoose";
import {
  createApplication as createApplicationService,
  getApplications as getApplicationsService,
  getApplicationById as getApplicationByIdService,
  updateApplication as updateApplicationService,
  deleteApplication as deleteApplicationService,
} from "../services/applicationService.js";

const allowedStatuses = [
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const allowedSources = [
  "LinkedIn",
  "Naukri",
  "Indeed",
  "Company Website",
  "Referral",
  "Other",
];

const createApplication = async (req, res, next) => {
  try {
    const { company, role } = req.body;

    if (
      typeof company !== "string" ||
      !company.trim() ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    const application = await createApplicationService(req.user._id, {
      ...req.body,
      company: company.trim(),
      role: role.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Job application created successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { status, source, search, page, limit } = req.query;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    if (source && !allowedSources.includes(source)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application source",
      });
    }

    const result = await getApplicationsService(req.user._id, {
      status,
      source,
      search,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const application = await getApplicationByIdService(
      req.user._id,
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const allowedFields = [
      "company",
      "role",
      "location",
      "source",
      "status",
      "applicationDate",
      "interviewDate",
      "followUpDate",
      "jobUrl",
      "notes",
      "resumeVersion",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one valid field to update",
      });
    }

    if (
      updates.company !== undefined &&
      (typeof updates.company !== "string" || !updates.company.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot be empty",
      });
    }

    if (
      updates.role !== undefined &&
      (typeof updates.role !== "string" || !updates.role.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Job role cannot be empty",
      });
    }

    if (updates.company !== undefined) {
      updates.company = updates.company.trim();
    }

    if (updates.role !== undefined) {
      updates.role = updates.role.trim();
    }

    if (
      updates.status !== undefined &&
      !allowedStatuses.includes(updates.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    if (
      updates.source !== undefined &&
      !allowedSources.includes(updates.source)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid application source",
      });
    }

    const application = await updateApplicationService(
      req.user._id,
      req.params.id,
      updates
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job application updated successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    const application = await deleteApplicationService(
      req.user._id,
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
