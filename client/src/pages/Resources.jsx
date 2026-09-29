import { useEffect, useState } from "react"

function Resources() {
  const [resources, setResources] = useState([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [link, setLink] = useState("")

  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetch("http://localhost:5000/resources")
      .then((response) => response.json())
      .then((data) => {
        setResources(data)
      })
      .catch((error) => {
        console.error("Error fetching resources:", error)
      })
  }, [])

  const clearForm = () => {
    setEditingId(null)
    setTitle("")
    setDescription("")
    setCategory("")
    setLink("")
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
          ? "http://localhost:5000/resources"
          : `http://localhost:5000/resources/${editingId}`

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
          category,
          link,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save resource")
      }

      if (editingId === null) {
        setResources((currentResources) => [
          ...currentResources,
          data,
        ])
      } else {
        setResources((currentResources) =>
          currentResources.map((resource) =>
            resource.id === editingId
              ? data
              : resource
          )
        )
      }

      clearForm()
    } catch (error) {
      console.error("Error saving resource:", error)
      alert(error.message)
    }
  }

  const handleEdit = (resource) => {
    setEditingId(resource.id)
    setTitle(resource.title)
    setDescription(resource.description)
    setCategory(resource.category)
    setLink(resource.link)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/resources/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete resource")
      }

      setResources((currentResources) =>
        currentResources.filter(
          (resource) => resource.id !== id
        )
      )
    } catch (error) {
      console.error("Error deleting resource:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-4xl font-bold text-slate-900">
        Resources
      </h1>

      <p className="mt-3 text-slate-600">
        Useful academic and campus resources for students.
      </p>

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-slate-900">
            {editingId === null
              ? "Add Resource"
              : "Edit Resource"}
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Resource title"
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
              placeholder="Resource description"
              rows="4"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Academic, Career, Campus..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Resource Link
            </label>

            <input
              type="text"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://example.com"
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
                ? "Add Resource"
                : "Update Resource"}
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

        {resources.map((resource) => (
          <article
            key={resource.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {resource.category}
            </span>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              {resource.title}
            </h2>

            <p className="mt-3 text-slate-600">
              {resource.description}
            </p>

            <div className="mt-6 flex gap-3">

              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                View Resource
              </a>

              {isAdmin && (
                <>
                  <button
                    onClick={() => handleEdit(resource)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(resource.id)}
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

export default Resources