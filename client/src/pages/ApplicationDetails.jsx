
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  LoaderCircle,
  Globe,
  FileText,
  AlertCircle,
} from "lucide-react";

import api from "../api/axios.js";
import Sidebar from "../components/Sidebar.jsx";

const statusColors = {
  Applied: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Assessment: "bg-purple-50 text-purple-700 ring-purple-600/20",
  Interview: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  Withdrawn: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");
        setApplication(null);

        const { data } = await api.get(`/applications/${id}`);

        if (isMounted) {
          setApplication(data.application);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load this application."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const details = application
    ? [
        {
          label: "Location",
          value: application.location || "Not specified",
          icon: MapPin,
        },
        {
          label: "Application date",
          value: formatDate(application.applicationDate),
          icon: CalendarDays,
        },
        {
          label: "Interview date",
          value: formatDate(application.interviewDate),
          icon: CalendarDays,
        },
        {
          label: "Follow-up date",
          value: formatDate(application.followUpDate),
          icon: CalendarDays,
        },
        {
          label: "Application source",
          value: application.source || "Not specified",
          icon: Globe,
        },
        {
          label: "Resume version",
          value: application.resumeVersion || "Not specified",
          icon: FileText,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 lg:ml-64 lg:min-h-screen">
          <div
            className="flex flex-col items-center gap-3 text-center text-slate-500 sm:flex-row"
            role="status"
          >
            <LoaderCircle
              className="animate-spin text-indigo-600"
              size={24}
            />
            <span>Loading application...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 lg:ml-64 lg:min-h-screen">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              {error ? (
                <AlertCircle size={28} />
              ) : (
                <BriefcaseBusiness size={28} />
              )}
            </div>

            <h1 className="mt-4 text-xl font-bold text-slate-900">
              Application not found
            </h1>

            <p className="mt-2 break-words text-sm leading-6 text-slate-500">
              {error || "This application may have been removed."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Back to dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-slate-50 text-slate-800">
      <Sidebar />

      <main className="min-w-0 w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
        {/* Page header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex min-h-20 max-w-[1600px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-sm text-slate-500">
                Your workspace
              </p>

              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Application details
              </h1>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-indigo-600 sm:self-auto"
            >
              <ArrowLeft size={17} />
              Back to dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl px-3 py-5 min-[360px]:px-4 sm:px-6 sm:py-8 lg:px-8">
          {/* Breadcrumb */}
          

          {/* Application card */}
          <section className="mt-5 min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mt-6">
            {/* Application heading */}
            <div className="border-b border-slate-100 p-4 min-[360px]:p-5 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:h-14 sm:w-14">
                    <BriefcaseBusiness size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
                      {application.role}
                    </h2>

                    <p className="mt-2 break-words text-base font-medium text-slate-600">
                      {application.company}
                    </p>

                    {application.location && (
                      <p className="mt-2 flex items-start gap-1.5 break-words text-sm text-slate-500">
                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0"
                        />
                        <span>{application.location}</span>
                      </p>
                    )}

                    <span
                      className={`mt-4 inline-flex max-w-full rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                        statusColors[application.status] ||
                        "bg-slate-100 text-slate-700 ring-slate-500/20"
                      }`}
                    >
                      {application.status || "Unknown status"}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/applications/${application._id}/edit`}
                  className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                  <Pencil size={16} />
                  Edit application
                </Link>
              </div>
            </div>

            {/* Application information */}
            <div className="p-4 min-[360px]:p-5 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900">
                Application information
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4">
                {details.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Icon size={16} className="shrink-0" />
                      <span>{label}</span>
                    </div>

                    <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Job posting */}
              {application.jobUrl && (
                <div className="mt-6">
                  <h2 className="text-sm font-semibold text-slate-700">
                    Job posting
                  </h2>

                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-indigo-600 transition hover:text-indigo-800"
                  >
                    <ExternalLink
                      className="shrink-0"
                      size={16}
                    />
                    Open job posting
                  </a>
                </div>
              )}

              {/* Notes */}
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-700">
                  Notes
                </h2>

                <div className="mt-2 min-h-24 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {application.notes || "No notes added yet."}
                </div>
              </div>

              {/* Last updated */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs text-slate-400">
                  Last updated: {formatDate(application.updatedAt)}
                </p>
              </div>
            </div>
          </section>

          <footer className="py-6 text-center text-xs text-slate-400 sm:text-sm">
            JobTracker· Keep moving toward your next opportunity.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default ApplicationDetails;