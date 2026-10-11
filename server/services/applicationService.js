
import JobApplication from "../models/JobApplication.js";

const createApplication = async (userId, data) => {
  return await JobApplication.create({
    ...data,
    user: userId,
  });
};

const getApplications = async (userId, filters = {}) => {
  const {
    search,
    status,
    source,
    page = 1,
    limit = 10,
  } = filters;

  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  if (source) {
    query.source = source;
  }

  if (search?.trim()) {
    const escapedSearch = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    query.$or = [
      { company: { $regex: escapedSearch, $options: "i" } },
      { role: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));

  const [applications, total] = await Promise.all([
    JobApplication.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),

    JobApplication.countDocuments(query),
  ]);

  return {
    applications,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

const getApplicationById = async (userId, applicationId) => {
  return await JobApplication.findOne({
    _id: applicationId,
    user: userId,
  });
};

const updateApplication = async (userId, applicationId, data) => {
  return await JobApplication.findOneAndUpdate(
    {
      _id: applicationId,
      user: userId,
    },
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );
};

const deleteApplication = async (userId, applicationId) => {
  return await JobApplication.findOneAndDelete({
    _id: applicationId,
    user: userId,
  });
};

export {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
