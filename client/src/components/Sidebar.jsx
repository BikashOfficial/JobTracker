
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

const Brand = () => (
  <Link
    to="/dashboard"
    className="flex h-20 items-center gap-3 px-5"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
      J
    </div>

    <div>
      <h1 className="text-lg font-bold tracking-tight text-slate-900">
        JobTracker
      </h1>
      <p className="text-xs text-slate-500">
        Application Manager
      </p>
    </div>
  </Link>
);

const NavigationLinks = ({ onNavigate }) => (
  <nav className="space-y-2 px-3 py-5">
    <NavLink
      to="/dashboard"
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-indigo-50 text-indigo-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`
      }
    >
      <LayoutDashboard size={19} />
      <span>Dashboard</span>
    </NavLink>
  </nav>
);

const UserProfile = ({ user }) => (
  <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
      {(user?.name || "U").charAt(0).toUpperCase()}
    </div>

    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-800">
        {user?.name || "User"}
      </p>
      <p className="truncate text-xs text-slate-500">
        {user?.email || "Signed in"}
      </p>
    </div>
  </div>
);

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    if (logoutLoading) return;

    try {
      setLogoutLoading(true);
      setLogoutError("");

      await logout();

      setMobileMenuOpen(false);
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const LogoutSection = () => (
    <div className="border-t border-slate-200 p-4">
      {logoutError && (
        <p className="mb-3 text-xs text-red-600">
          {logoutError}
        </p>
      )}

      <UserProfile user={user} />

      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutLoading}
        className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut size={18} />
        <span>{logoutLoading ? "Signing out..." : "Sign out"}</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top navigation */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
            J
          </div>

          <span className="font-bold text-slate-900">
            JobTrack
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open sidebar"
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
        >
          <Menu size={23} />
        </button>
      </header>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        aria-label="Mobile sidebar"
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none"
        }`}
      >
        {/* Mobile sidebar header with logout and close buttons */}
        <div className="flex min-h-20 items-center justify-between border-b border-slate-200 pr-3">
          <Brand />

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
            >
              <LogOut size={20} />
            </button>

            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NavigationLinks onNavigate={closeMobileMenu} />
        </div>

        <LogoutSection />
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Brand />

        <div className="flex-1 overflow-y-auto">
          <NavigationLinks />
        </div>

        <LogoutSection />
      </aside>
    </>
  );
};

export default Sidebar;