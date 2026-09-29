function AnnouncementCard({
  id,
  title,
  description,
  date,
  onEdit,
  onDelete,
  isAdmin,
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {date}
      </p>

      <h3 className="mt-2 text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-slate-600">
        {description}
      </p>

      {isAdmin && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onEdit(id)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(id)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      )}

    </article>
  )
}

export default AnnouncementCard