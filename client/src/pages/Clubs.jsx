import { useEffect, useState } from "react"

function Clubs() {
  const [clubs, setClubs] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [members, setMembers] = useState("")

  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetch("https://campushub-api-k9ug.onrender.com/clubs")
      .then((response) => response.json())
      .then((data) => {
        setClubs(data)
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error)
      })
  }, [])

  const clearForm = () => {
    setEditingId(null)
    setName("")
    setDescription("")
    setMembers("")
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
          ? "https://campushub-api-k9ug.onrender.com/clubs"
          : `https://campushub-api-k9ug.onrender.com/clubs/${editingId}`

      const method = editingId === null ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          members: Number(members),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save club")
      }

      if (editingId === null) {
        setClubs((currentClubs) => [
          ...currentClubs,
          data,
        ])
      } else {
        setClubs((currentClubs) =>
          currentClubs.map((club) =>
            club.id === editingId
              ? data
              : club
          )
        )
      }

      clearForm()
    } catch (error) {
      console.error("Error saving club:", error)
      alert(error.message)
    }
  }

  const handleEdit = (club) => {
    setEditingId(club.id)
    setName(club.name)
    setDescription(club.description)
    setMembers(club.members)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this club?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://campushub-api-k9ug.onrender.com/clubs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete club")
      }

      setClubs((currentClubs) =>
        currentClubs.filter(
          (club) => club.id !== id
        )
      )
    } catch (error) {
      console.error("Error deleting club:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-4xl font-bold text-slate-900">
        Clubs
      </h1>

      <p className="mt-3 text-slate-600">
        Discover student clubs and communities around campus.
      </p>

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <h2 className="text-2xl font-bold text-slate-900">
            {editingId === null
              ? "Create Club"
              : "Edit Club"}
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Club Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Club name"
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
              placeholder="Club description"
              rows="4"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Members
            </label>

            <input
              type="number"
              min="0"
              value={members}
              onChange={(event) => setMembers(event.target.value)}
              placeholder="Number of members"
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
                ? "Create Club"
                : "Update Club"}
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

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {clubs.map((club) => (
          <article
            key={club.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                {club.name.charAt(0)}
              </div>

              <span className="text-sm font-medium text-slate-500">
                {club.members} members
              </span>

            </div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              {club.name}
            </h2>

            <p className="mt-3 text-slate-600">
              {club.description}
            </p>

            <div className="mt-6 flex gap-3">

              <button
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                View Club
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => handleEdit(club)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(club.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}

            </div>

          </article>
        ))}

      </div>

    </main>
  )
}

export default Clubs