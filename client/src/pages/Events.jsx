import { useEffect, useState } from "react"

function Events() {
  const [events, setEvents] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")

  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetch("https://campushub-api-k9ug.onrender.com/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data)
      })
      .catch((error) => {
        console.error("Error fetching events:", error)
      })
  }, [])

  const clearForm = () => {
    setEditingId(null)
    setTitle("")
    setDescription("")
    setDate("")
    setLocation("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    try {
      const url =
        editingId === null
          ? "https://campushub-api-k9ug.onrender.com/events"
          : `https://campushub-api-k9ug.onrender.com/events/${editingId}`

      const method = editingId === null ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date,
          location,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save event")
      }

      if (editingId === null) {
        setEvents((currentEvents) => [
          ...currentEvents,
          data,
        ])
      } else {
        setEvents((currentEvents) =>
          currentEvents.map((currentEvent) =>
            currentEvent.id === editingId
              ? data
              : currentEvent
          )
        )
      }

      clearForm()
    } catch (error) {
      console.error("Error saving event:", error)
      alert(error.message)
    }
  }

  const handleEdit = (event) => {
    setEditingId(event.id)
    setTitle(event.title)
    setDescription(event.description)
    setDate(event.date)
    setLocation(event.location)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://campushub-api-k9ug.onrender.com/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event")
      }

      setEvents((currentEvents) =>
        currentEvents.filter(
          (currentEvent) => currentEvent.id !== id
        )
      )
    } catch (error) {
      console.error("Error deleting event:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-4xl font-bold text-slate-900">
        Events
      </h1>

      <p className="mt-3 text-slate-600">
        Discover upcoming events happening around campus.
      </p>

      {/* ADMIN FORM */}
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId === null
              ? "Create Event"
              : "Edit Event"}
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Event title"
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
              placeholder="Event description"
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Event location"
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
                ? "Create Event"
                : "Update Event"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={clearForm}
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* EVENT LIST */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <article
            key={event.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {event.date}
            </p>

            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              {event.title}
            </h2>

            <p className="mt-3 text-slate-600">
              {event.description}
            </p>

            <p className="mt-4 text-sm font-medium text-slate-700">
              📍 {event.location}
            </p>

            {isAdmin && (
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(event)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

    </main>
  )
}

export default Events