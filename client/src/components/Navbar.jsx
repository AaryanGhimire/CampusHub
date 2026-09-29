import { Link, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        {/* LOGO */}

        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
        >
          Campus<span className="text-slate-500">Hub</span>
        </Link>


        {/* MAIN NAVIGATION */}

        <div className="hidden items-center gap-5 text-sm font-medium text-slate-600 lg:flex">

          <Link
            to="/"
            className="transition hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            to="/announcements"
            className="transition hover:text-slate-900"
          >
            Announcements
          </Link>

          <Link
            to="/events"
            className="transition hover:text-slate-900"
          >
            Events
          </Link>

          <Link
            to="/resources"
            className="transition hover:text-slate-900"
          >
            Resources
          </Link>

          <Link
            to="/clubs"
            className="transition hover:text-slate-900"
          >
            Clubs
          </Link>

          <Link
            to="/lost-found"
            className="transition hover:text-slate-900"
          >
            Lost & Found
          </Link>

        </div>


        {/* AUTH / DASHBOARD */}

        <div className="flex items-center gap-2 sm:gap-3">

          {token ? (
            <>
              <span className="hidden text-sm text-slate-500 xl:block">
                {user?.email}
              </span>

              <Link
                to="/dashboard"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:px-4"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 sm:px-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 sm:px-4"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:block"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>


      {/* MOBILE NAVIGATION */}

      <div className="overflow-x-auto border-t border-slate-100 lg:hidden">
        <div className="mx-auto flex min-w-max max-w-7xl gap-5 px-4 py-3 text-sm font-medium text-slate-600 sm:px-6">

          <Link
            to="/"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            to="/announcements"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Announcements
          </Link>

          <Link
            to="/events"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Events
          </Link>

          <Link
            to="/resources"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Resources
          </Link>

          <Link
            to="/clubs"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Clubs
          </Link>

          <Link
            to="/lost-found"
            className="whitespace-nowrap transition hover:text-slate-900"
          >
            Lost & Found
          </Link>

        </div>
      </div>

    </nav>
  )
}

export default Navbar