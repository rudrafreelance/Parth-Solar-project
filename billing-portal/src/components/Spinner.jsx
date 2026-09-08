export default function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-3 text-emerald-900">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-800" />
      <p className="text-sm font-medium text-emerald-800/70">{label}</p>
    </div>
  )
}

export function SkeletonRows({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-xl bg-emerald-950/5" />
      ))}
    </div>
  )
}
