interface LocationHeaderProps {
  location: string
  temperature: number
  condition: string
  units: "metric" | "imperial"
}

export function LocationHeader({ location, temperature, condition, units }: LocationHeaderProps) {
  const tempUnit = units === "metric" ? "°C" : "°F"
  const displayTemp = units === "metric" ? temperature : Math.round((temperature * 9) / 5 + 32)

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">{location}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold">
            {displayTemp}
            {tempUnit}
          </div>
          <p className="mt-1 text-lg text-muted-foreground">{condition}</p>
        </div>
      </div>
    </div>
  )
}
