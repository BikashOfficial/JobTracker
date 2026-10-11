
import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";

const AuthLayout = ({ mode = "login", children }) => {
  const isLogin = mode === "login";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-2">
        {/* Left Side: Simple Branding */}
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

          {/* Logo */}
          <Link
            to="/login"
            className="relative flex w-fit items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-lg shadow-indigo-500/20">
              <BriefcaseBusiness className="text-blue-500" size={23} />
            </span>

            <span className="text-2xl text-white font-bold">
              JobTracker
            </span>
          </Link>

          {/* Main Message */}
          <div className="relative max-w-lg">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Your career starts here
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Your career journey,
              <br />
              <span className="text-indigo-400">
                all in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
              Organize your job applications, track interview progress,
              and manage your next career move with confidence.
            </p>

            <div className="mt-8 h-1 w-16 rounded-full bg-indigo-400" />
          </div>

          {/* Footer */}
          <p className="relative text-sm text-slate-500">
            © {new Date().getFullYear()} JobTracker. Your job search,
            simplified.
          </p>
        </section>

        {/* Right Side: Login / Register Form */}
        <section className="flex min-h-screen flex-col bg-slate-50 px-5 py-6 sm:px-10 lg:px-14 xl:px-20">
          {/* Mobile Logo */}
          <div className="flex items-center justify-between lg:hidden">
            <Link to="/login" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <BriefcaseBusiness size={21} />
              </span>

              <span className="text-xl font-bold text-slate-900">
                Apply<span className="text-indigo-600">Track</span>
              </span>
            </Link>

            <span className="text-xs font-medium text-slate-500">
              Job search, simplified
            </span>
          </div>

          {/* Authentication Content */}
          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <BriefcaseBusiness size={24} />
                </div>

                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-indigo-600">
                  {isLogin ? "Welcome back" : "Get started for free"}
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  {isLogin
                    ? "Sign in to JobTracker"
                    : "Create your account"}
                </h2>

                <p className="mt-3 leading-6 text-slate-500">
                  {isLogin
                    ? "Pick up where you left off and keep your applications moving."
                    : "Bring your applications, interviews, and follow-ups into one place."}
                </p>
              </div>

              {children}

              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                JobTracker helps you organize your job search.
                Your dashboard is private to your account.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-4 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} JobTracker
          </footer>
        </section>
      </div>
    </main>
  );
};

export default AuthLayout;