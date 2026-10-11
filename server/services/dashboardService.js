
import JobApplication from "../models/JobApplication.js";

const getDashboardStats = async (userId) => {
  const [totalApplications, statusCounts, upcomingInterviews] =
    await Promise.all([
      JobApplication.countDocuments({ user: userId }),

      JobApplication.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      JobApplication.countDocuments({
        user: userId,
        interviewDate: {
          $gte: new Date(),
        },
        status: "Interview",
      }),
    ]);

  const countsByStatus = Object.fromEntries(
    statusCounts.map(({ _id, count }) => [_id, count])
  );

  return {
    totalApplications,
    assessmentCount: countsByStatus.Assessment || 0,
    interviewCount: countsByStatus.Interview || 0,
    offerCount: countsByStatus.Offer || 0,
    rejectedCount: countsByStatus.Rejected || 0,
    withdrawnCount: countsByStatus.Withdrawn || 0,
    appliedCount: countsByStatus.Applied || 0,
    upcomingInterviews,
    statusBreakdown: countsByStatus,
  };
};

export { getDashboardStats };
