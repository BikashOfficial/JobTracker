
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import api from "../api/axios.js";
import {
  createApplication,
  updateApplication,
  fetchApplications,
  fetchDashboardStats,
} from "../store/applicationSlice.js";

const initialForm = {
  company: "",
  role: "",
  location: "",
  source: "Other",
  status: "Applied",
  applicationDate: new Date().toISOString().slice(0, 10),
  interviewDate: "",
  followUpDate: "",
  jobUrl: "",
  resumeVersion: "",
  notes: "",
};

const ApplicationForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadApplication = async () => {
      try {
        const { data } = await api.get(`/applications/${id}`);

        if (active) {
          const application = data.application;

          setForm({
            company: application.company || "",
            role: application.role || "",
            location: application.location || "",
            source: application.source || "Other",
            status: application.status || "Applied",
            applicationDate: application.applicationDate
              ? new Date(application.applicationDate).toISOString().slice(0, 10)
              : "",
            interviewDate: application.interviewDate
              ? new Date(application.interviewDate).toISOString().slice(0, 10)
              : "",
            followUpDate: application.followUpDate
              ? new Date(application.followUpDate).toISOString().slice(0, 10)
              : "",
            jobUrl: application.jobUrl || "",
            resumeVersion: application.resumeVersion || "",
            notes: application.notes || "",
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Could not load this application"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadApplication();

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.company.trim() || !form.role.trim()) {
      setError("Company and job role are required.");
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim(),
      jobUrl: form.jobUrl.trim(),
      resumeVersion: form.resumeVersion.trim(),
      notes: form.notes.trim(),
      interviewDate: form.interviewDate || null,
      followUpDate: form.followUpDate || null,
    };

    try {
      const result = isEditing
        ? await dispatch(updateApplication({ id, updates: payload }))
        : await dispatch(createApplication(payload));

      if (
        isEditing
          ? updateApplication.rejected.match(result)
          : createApplication.rejected.match(result)
      ) {
        setError(result.payload || "Unable to save application");
        return;
      }

      await Promise.all([
        dispatch(fetchApplications({ page: 1, limit: 10 })),
        dispatch(fetchDashboardStats()),
      ]);

      navigate("/dashboard", { replace: true });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50";

  const fields = [
    { name: "company", label: "Company name", required: true },
    { name: "role", label: "Job role", required: true },
    { name: "location", label: "Location", placeholder: "e.g. Bengaluru" },
    { name: "jobUrl", label: "Job posting URL", type: "url", placeholder: "https://..." },
    { name: "resumeVersion", label: "Resume version", placeholder: "e.g. Full-stack-v2" },
  ];

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500">
        Loading application...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
            JobTracker
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit application" : "Add application"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Keep the details of a job you have applied for in one place.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="text-sm font-semibold text-slate-700"
                  >
                    {field.label}
                    {field.required && <span className="text-rose-600"> *</span>}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    required={field.required || false}
                    maxLength={field.name === "notes" ? 3000 : 120}
                    className={inputClass}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="source" className="text-sm font-semibold text-slate-700">
                  Application source
                </label>
                <select
                  id="source"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {["LinkedIn", "Naukri", "Indeed", "Company Website", "Referral", "Other"].map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="text-sm font-semibold text-slate-700">
                  Current status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {["Applied", "Assessment", "Interview", "Offer", "Rejected", "Withdrawn"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="applicationDate" className="text-sm font-semibold text-slate-700">
                  Application date *
                </label>
                <input
                  id="applicationDate"
                  name="applicationDate"
                  type="date"
                  value={form.applicationDate}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="interviewDate" className="text-sm font-semibold text-slate-700">
                  Interview date
                </label>
                <input
                  id="interviewDate"
                  name="interviewDate"
                  type="date"
                  value={form.interviewDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="followUpDate" className="text-sm font-semibold text-slate-700">
                  Follow-up date
                </label>
                <input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  value={form.followUpDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-semibold text-slate-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                maxLength={3000}
                placeholder="Recruiter details, interview preparation, follow-up reminders..."
                className={inputClass}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <Link
                to="/dashboard"
                className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save changes"
                    : "Create application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ApplicationForm;
