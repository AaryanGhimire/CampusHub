import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  const [stats, setStats] = useState({
    announcements: 0,
    events: 0,
    resources: 0,
    clubs: 0,
    lostFound: 0,
  })

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    const fetchStats = async () => {
      try {
        const [
          announcementsResponse,
          eventsResponse,
          resourcesResponse,
          clubsResponse,
          lostFoundResponse,
        ] = await Promise.all([
          fetch("https://campushub-api-k9ug.onrender.com/announcements"),
          fetch("https://campushub-api-k9ug.onrender.com/events"),
          fetch("https://campushub-api-k9ug.onrender.com/resources"),
          fetch("https://campushub-api-k9ug.onrender.com/clubs"),
          fetch("https://campushub-api-k9ug.onrender.com/lost-found"),
        ])

        const [
          announcements,
          events,
          resources,
          clubs,
          lostFound,
        ] = await Promise.all([
          announcementsResponse.json(),
          eventsResponse.json(),
          resourcesResponse.json(),
          clubsResponse.json(),
          lostFoundResponse.json(),
        ])

        setStats({
          announcements: announcements.length,
          events: events.length,
          resources: resources.length,
          clubs: clubs.length,
          lostFound: lostFound.length,
        })
      } catch (error) {
        console.error("Error loading dashboard:", error)
      }
    }

    fetchStats()
  }, [isAdmin])

  const adminSections = [
    {
      title: "Announcements",
      count: stats.announcements,
      link: "/announcements",
    },
    {
      title: "Events",
      count: stats.events,
      link: "/events",
    },
    {
      title: "Resources",
      count: stats.resources,
      link: "/resources",
    },
    {
      title: "Clubs",
      count: stats.clubs,
      link: "/clubs",
    },
    {
      title: "Lost & Found",
      count: stats.lostFound,
      link: "/lost-found",
    },
  ]

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      {/* HEADER */}

      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="mt-3 text-slate-600">
          {user?.email}
        </p>
      </div>


      {/* ==============================
          STUDENT DASHBOARD
          ============================== */}

      {!isAdmin && (
        <>
          {/* ACCOUNT */}

          <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Your Account
                </p>

                <h2 className="mt-1 text-xl font-semibold text-slate-900">
                  {user?.email}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Student account
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                Student
              </span>

            </div>

          </section>


          {/* QUICK ACTIONS */}

          <section className="mt-12">

            <h2 className="text-2xl font-bold text-slate-900">
              Quick Access
            </h2>

            <p className="mt-2 text-slate-600">
              Jump directly to the parts of CampusHub you use most.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              <Link
                to="/events"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  Events
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  See upcoming campus events and activities.
                </p>

                <p className="mt-5 text-sm font-semibold text-slate-900">
                  Browse events →
                </p>
              </Link>


              <Link
                to="/resources"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  Resources
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Find useful academic and campus resources.
                </p>

                <p className="mt-5 text-sm font-semibold text-slate-900">
                  Browse resources →
                </p>
              </Link>


              <Link
                to="/clubs"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  Clubs
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Discover student clubs and communities.
                </p>

                <p className="mt-5 text-sm font-semibold text-slate-900">
                  Explore clubs →
                </p>
              </Link>


              <Link
                to="/lost-found"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  Lost & Found
                </h3>

                <p className="mt-3 text-sm text-slate-600">
                  Check items lost or found around campus.
                </p>

                <p className="mt-5 text-sm font-semibold text-slate-900">
                  View listings →
                </p>
              </Link>

            </div>

          </section>


          {/* ACCOUNT INFORMATION */}

          <section className="mt-12">

            <h2 className="text-2xl font-bold text-slate-900">
              Account Information
            </h2>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Role
                  </p>

                  <p className="mt-1 font-medium text-slate-900">
                    Student
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 font-medium text-green-600">
                    Active
                  </p>
                </div>

              </div>

            </div>

          </section>
        </>
      )}


      {/* ==============================
          ADMIN DASHBOARD
          ============================== */}

      {isAdmin && (
        <>
          {/* ADMIN ACCOUNT */}

          <section className="mt-10 rounded-xl border border-purple-200 bg-purple-50 p-6">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-purple-700">
                  Administrator
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {user?.email}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  You have permission to manage CampusHub content.
                </p>
              </div>

              <span className="w-fit rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                Admin
              </span>

            </div>

          </section>


          {/* STATISTICS */}

          <section className="mt-12">

            <h2 className="text-2xl font-bold text-slate-900">
              Campus Content
            </h2>

            <p className="mt-2 text-slate-600">
              Current content across CampusHub.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {adminSections.map((section) => (
                <Link
                  key={section.title}
                  to={section.link}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <p className="text-sm text-slate-500">
                    {section.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {section.count}
                  </p>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Manage →
                  </p>

                </Link>
              ))}

            </div>

          </section>


          {/* MANAGEMENT */}

          <section className="mt-12">

            <h2 className="text-2xl font-bold text-slate-900">
              Content Management
            </h2>

            <p className="mt-2 text-slate-600">
              Create, edit and remove CampusHub content.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <Link
                to="/announcements"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Announcements
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Publish and manage campus announcements.
                </p>
              </Link>


              <Link
                to="/events"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Events
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Create and manage upcoming campus events.
                </p>
              </Link>


              <Link
                to="/resources"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Resources
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Maintain academic and campus resources.
                </p>
              </Link>


              <Link
                to="/clubs"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Clubs
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Manage student clubs and membership information.
                </p>
              </Link>


              <Link
                to="/lost-found"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Manage Lost & Found
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Manage lost and found listings around campus.
                </p>
              </Link>

            </div>

          </section>
        </>
      )}

    </main>
  )
}

export default Dashboard