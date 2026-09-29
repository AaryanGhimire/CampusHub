import { useState } from "react"
import FeatureCard from "../components/FeatureCard"

function Home() {
  const [showMore, setShowMore] = useState(false)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-slate-900 text-white">
        {/* ... */}
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need
            </h2>

            <p className="mt-3 text-slate-600">
              Stay connected with what's happening around campus.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <FeatureCard
              title="Announcements"
              description="Stay updated with important campus announcements."
            />

            <FeatureCard
              title="Events"
              description="Discover upcoming events and activities."
            />

            <FeatureCard
              title="Resources"
              description="Find useful academic resources shared by students."
            />

            <FeatureCard
              title="Clubs"
              description="Explore student clubs and campus communities."
            />

          </div>
          <button
  onClick={() => setShowMore(!showMore)}
  className="mt-8 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
>
  {showMore ? "Show Less" : "Show More"}
</button>

{showMore && (
  <p className="mt-4 text-slate-600">
    CampusHub will eventually include Lost & Found, student accounts,
    event registration, and more.
  </p>
)}
        </div>
        
      </section>
    </main>
  )
}

export default Home