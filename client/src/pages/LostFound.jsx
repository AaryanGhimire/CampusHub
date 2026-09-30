import { useEffect, useState } from "react"

function LostFound() {
  const [items, setItems] = useState([])

  const [item, setItem] = useState("")
  const [type, setType] = useState("Lost")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [contact, setContact] = useState("")

  const [editingId, setEditingId] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    fetch("https://campushub-api-k9ug.onrender.com/lost-found")
      .then((response) => response.json())
      .then((data) => {
        setItems(data)
      })
      .catch((error) => {
        console.error("Error fetching lost & found items:", error)
      })
  }, [])

  const clearForm = () => {
    setEditingId(null)
    setItem("")
    setType("Lost")
    setDescription("")
    setLocation("")
    setDate("")
    setContact("")
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
          ? "https://campushub-api-k9ug.onrender.com/lost-found"
          : `https://campushub-api-k9ug.onrender.com/lost-found/${editingId}`

      const method = editingId === null ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item,
          type,
          description,
          location,
          date,
          contact,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save item"
        )
      }

      if (editingId === null) {
        setItems((currentItems) => [
          ...currentItems,
          data,
        ])
      } else {
        setItems((currentItems) =>
          currentItems.map((currentItem) =>
            currentItem.id === editingId
              ? data
              : currentItem
          )
        )
      }

      clearForm()
    } catch (error) {
      console.error("Error saving item:", error)
      alert(error.message)
    }
  }

  const handleEdit = (currentItem) => {
    setEditingId(currentItem.id)
    setItem(currentItem.item)
    setType(currentItem.type)
    setDescription(currentItem.description)
    setLocation(currentItem.location)
    setDate(currentItem.date)
    setContact(currentItem.contact)
  }

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login first.")
      return
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(
        `https://campushub-api-k9ug.onrender.com/lost-found/${id}`,
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
          data.error || "Failed to delete item"
        )
      }

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.id !== id
        )
      )
    } catch (error) {
      console.error("Error deleting item:", error)
      alert(error.message)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <h1 className="text-4xl font-bold text-slate-900">
        Lost & Found
      </h1>

      <p className="mt-3 text-slate-600">
        Find lost belongings or report items found around campus.
      </p>

      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <h2 className="text-2xl font-bold text-slate-900">
            {editingId === null
              ? "Add Lost & Found Listing"
              : "Edit Listing"}
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700">
              Item
            </label>

            <input
              type="text"
              value={item}
              onChange={(event) => setItem(event.target.value)}
              placeholder="Item name"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700">
              Type
            </label>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
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
              placeholder="Describe the item"
              rows="4"
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
              placeholder="Where was it lost/found?"
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
              Contact
            </label>

            <input
              type="text"
              value={contact}
              onChange={(event) =>
                setContact(event.target.value)
              }
              placeholder="Contact information"
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
                ? "Add Listing"
                : "Update Listing"}
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

      <div className="mt-10 grid gap-6 md:grid-cols-2">

        {items.map((currentItem) => (
          <article
            key={currentItem.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <span
                className={
                  currentItem.type === "Lost"
                    ? "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                    : "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                }
              >
                {currentItem.type}
              </span>

              <span className="text-sm text-slate-500">
                {currentItem.date}
              </span>

            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              {currentItem.item}
            </h2>

            <p className="mt-3 text-slate-600">
              {currentItem.description}
            </p>

            <p className="mt-4 text-sm font-medium text-slate-700">
              📍 {currentItem.location}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Contact: {currentItem.contact}
            </p>

            {isAdmin && (
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => handleEdit(currentItem)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(currentItem.id)}
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

export default LostFound