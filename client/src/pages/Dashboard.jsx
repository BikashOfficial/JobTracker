
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Plus,
  Search,
  TrendingUp,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import {
  fetchApplications,
  fetchDashboardStats,
  deleteApplication,
} from "../store/applicationSlice.js";
import Sidebar from "../components/Sidebar.jsx";

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700",
  Assessment: "bg-amber-50 text-amber-700",
  Interview: "bg-violet-50 text-violet-700",
  Offer: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700",
  Withdrawn: "bg-gray-100 text-gray-600",
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    items = [],
    pagination = {},
    stats,
    loading,
    statsLoading,
    error,
  } = useSelector((state) => state.applications);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchApplications({
        search,
        status,
        page,
        limit: 10,
      })
    );
  }, [dispatch, search, status, page]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleDelete = async (application) => {
    const confirmed = window.confirm(
      `Delete the application for ${application.role} at ${application.company}?`
    );

    if (!confirmed) return;

    setDeleteError("");
    setDeleteLoadingId(application._id);

    try {
      const result = await dispatch(
        deleteApplication(application._id)
      );

      if (deleteApplication.fulfilled.match(result)) {
        await dispatch(fetchDashboardStats());

        if (items.length === 1 && page > 1) {
          setPage((currentPage) => currentPage - 1);
        } else {
          dispatch(
            fetchApplications({
              search,
              status,
              page,
              limit: 10,
            })
          );
        }
      } else {
        setDeleteError(
          result.payload || "Could not delete application."
        );
      }
    } catch {
      setDeleteError("Something went wrong while deleting.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const statCards = [
    {
      label: "Total applications",
      value: stats?.totalApplications ?? 0,
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-600",
      description: "Applications tracked",
    },
    {
      label: "Assessments",
      value: stats?.assessmentCount ?? 0,
      icon: ClipboardList,
      color: "bg-amber-50 text-amber-600",
      description: "Assessment stage",
    },
    {
      label: "Interviews",
      value: stats?.interviewCount ?? 0,
      icon: CalendarDays,
      color: "bg-violet-50 text-violet-600",
      description: "Interview stage",
    },
    {
      label: "Offers",
      value: stats?.offerCount ?? 0,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      description: "Offers received",
    },
  ];

  const totalPages = Math.max(
    1,
    pagination?.totalPages ?? 1
  );

  const currentPage = pagination?.page ?? page;

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-slate-50 text-slate-800">
      <Sidebar />

      <main className="min-w-0 w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
        {/* Dashboard header */}
        <header className="flex min-h-20 flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-sm text-slate-500">
              Your workspace
            </p>

            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Dashboard
            </h1>
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <span className="hidden text-sm text-slate-500 md:inline">
              Welcome, {user?.name || "User"}
            </span>

            <button
              type="button"
              onClick={() => navigate("/applications/new")}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
            >
              <Plus size={18} />
              <span>Add application</span>
            </button>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] space-y-6 p-3 min-[360px]:p-4 sm:p-6 xl:p-8">
          {/* Overview heading */}
          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Application overview
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track your job search progress at a glance.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <TrendingUp size={17} />
                <span>Your job search activity</span>
              </div>
            </div>

            {/* Statistics cards */}
            <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.label}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500">
                          {card.label}
                        </p>

                        <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                          {statsLoading ? "—" : card.value}
                        </p>
                      </div>

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.color}`}
                      >
                        <Icon size={21} />
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Applications section */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage your job applications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/applications/new")}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus size={17} />
                Add new
              </button>
            </div>

            {/* Search and filter */}
            <div className="grid grid-cols-1 gap-3 border-b border-slate-200 p-4 sm:p-5 md:grid-cols-2">
              <div className="relative min-w-0">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    handleSearchChange(event.target.value)
                  }
                  placeholder="Search company or role..."
                  aria-label="Search applications"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <select
                value={status}
                onChange={(event) =>
                  handleStatusChange(event.target.value)
                }
                aria-label="Filter applications by status"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All statuses</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            {/* Error messages */}
            {(error || deleteError) && (
              <div
                role="alert"
                className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:m-5"
              >
                {deleteError || error}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

                <p className="text-sm text-slate-500">
                  Loading applications...
                </p>
              </div>
            ) : items.length === 0 ? (
              /* Empty state */
              <div className="flex min-h-56 flex-col items-center justify-center px-4 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <BriefcaseBusiness size={25} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  No applications found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  {search || status
                    ? "Try changing your search or status filter."
                    : "Add your first job application to start tracking your progress."}
                </p>

                {!search && !status && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/applications/new")
                    }
                    className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Plus size={17} />
                    Add application
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Desktop and tablet table */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Company & role
                        </th>

                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>

                        <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Applied on
                        </th>

                        <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {items.map((application) => (
                        <tr
                          key={application._id}
                          className="transition hover:bg-slate-50/80"
                        >
                          <td className="px-5 py-4">
                            <p className="font-semibold text-slate-900">
                              {application.company}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {application.role}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                statusStyles[application.status] ||
                                "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {application.status}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {formatDate(
                              application.appliedDate ||
                                application.createdAt
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/applications/${application._id}`
                                  )
                                }
                                aria-label={`View ${application.company}`}
                                title="View"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <Eye size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/applications/${application._id}/edit`
                                  )
                                }
                                aria-label={`Edit ${application.company}`}
                                title="Edit"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-amber-50 hover:text-amber-600"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(application)
                                }
                                disabled={
                                  deleteLoadingId ===
                                  application._id
                                }
                                aria-label={`Delete ${application.company}`}
                                title="Delete"
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deleteLoadingId ===
                                application._id ? (
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-center text-sm text-slate-500 sm:text-left">
                    Page{" "}
                    <span className="font-semibold text-slate-800">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPage((currentPage) =>
                          Math.max(1, currentPage - 1)
                        )
                      }
                      disabled={page <= 1 || loading}
                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPage((currentPage) =>
                          Math.min(totalPages, currentPage + 1)
                        )
                      }
                      disabled={
                        page >= totalPages || loading
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <span>Next</span>
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          {/* Footer */}
          <footer className="pb-2 pt-1 text-center text-xs text-slate-400 sm:text-sm">
            JobTracker· Keep moving toward your next opportunity.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
