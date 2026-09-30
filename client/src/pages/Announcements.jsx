import { useEffect, useState } from "react"
import AnnouncementCard from "../components/AnnouncementCard"

function Announcements() {
  const [announcements, setAnnouncements] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")

  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetch("https://campushub-api-k9ug.onrender.com/announcements")
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data)
      })
      .catch((error) => {
        console.error("Error fetching announcements:", error)
      })
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    try {
      if (editingId === null) {
        const response = await fetch(
          "https://campushub-api-k9ug.onrender.com/announcements",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              description,
              date,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to create announcement"
          )
        }

        setAnnouncements((currentAnnouncements) => [
          ...currentAnnouncements,
          data,
        ])
      } else {
        const response = await fetch(
          `https://campushub-api-k9ug.onrender.com/announcements/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title,
              description,
              date,
            }),
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to update announcement"
          )
        }

        setAnnouncements((currentAnnouncements) =>
          currentAnnouncements.map((announcement) =>
            announcement.id === editingId
              ? data
              : announcement
          )
        )

        setEditingId(null)
      }

      setTitle("")
      setDescription("")
      setDate("")
    } catch (error) {
      console.error("Error saving announcement:", error)
      alert(error.message)
    }
  }

  const handleEdit = (id) => {
    const announcement = announcements.find(
      (announcement) => announcement.id === id
    )

    if (!announcement) {
      return
    }

    setEditingId(id)
    setTitle(announcement.title)
    setDescription(announcement.description)
    setDate(announcement.date)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://campushub-api-k9ug.onrender.com/announcements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete announcement"
        )
      }

      setAnnouncements((currentAnnouncements) =>
        currentAnnouncements.filter(
          (announcement) => announcement.id !== id
        )
      )
    } catch (error) {
      console.error("Error deleting announcement:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-4xl font-bold text-slate-900">
        Announcements
      </h1>

      <p className="mt-3 text-slate-600">
        Stay updated with what's happening around campus.
      </p>

      {/* Admin-only Create/Edit Form */}
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId === null
              ? "Create Announcement"
              : "Edit Announcement"}
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter announcement title"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Enter announcement description"
              rows="4"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
            >
              {editingId === null
                ? "Create Announcement"
                : "Update Announcement"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setTitle("")
                  setDescription("")
                  setDate("")
                }}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Announcement List */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            id={announcement.id}
            title={announcement.title}
            description={announcement.description}
            date={announcement.date}
            onEdit={isAdmin ? handleEdit : null}
            onDelete={isAdmin ? handleDelete : null}
            isAdmin={isAdmin}
          />
        ))}
      </div>

    </main>
  )
}

export default Announcements