function FeatureCard({ title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 p-6 transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard