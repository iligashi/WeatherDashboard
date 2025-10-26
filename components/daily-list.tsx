interface DailyData {
  day: string
  date: string
  high: number
  low: number
  condition: string
  precipitation: number
}

interface DailyListProps {
  data: DailyData[]
  units: "metric" | "imperial"
}

export function DailyList({ data, units }: DailyListProps) {
  const tempUnit = units === "metric" ? "°C" : "°F"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">7-Day Forecast</h3>
      <div className="space-y-3">
        {data.map((day, index) => {
          const displayHigh = units === "metric" ? day.high : Math.round((day.high * 9) / 5 + 32)
          const displayLow = units === "metric" ? day.low : Math.round((day.low * 9) / 5 + 32)

          return (
            <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-4">
                <div className="w-24">
                  <div className="font-semibold">{day.day}</div>
                  <div className="text-sm text-muted-foreground">{day.date}</div>
                </div>
                <span className="text-3xl">
                  {day.condition === "Sunny"
                    ? "☀️"
                    : day.condition === "Cloudy"
                      ? "☁️"
                      : day.condition === "Rainy"
                        ? "🌧️"
                        : day.condition === "Partly Cloudy"
                          ? "⛅"
                          : "🌤️"}
                </span>
                <span className="min-w-[120px] text-sm text-muted-foreground">{day.condition}</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground">{day.precipitation}% rain</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {displayHigh}
                    {tempUnit}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground">
                    {displayLow}
                    {tempUnit}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
