interface HourlyData {
  time: string
  temperature: number
  condition: string
  precipitation: number
}

interface HourlyListProps {
  data: HourlyData[]
  units: "metric" | "imperial"
}

export function HourlyList({ data, units }: HourlyListProps) {
  const tempUnit = units === "metric" ? "°C" : "°F"

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Hourly Forecast</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2">
          {data.map((hour, index) => {
            const displayTemp = units === "metric" ? hour.temperature : Math.round((hour.temperature * 9) / 5 + 32)

            return (
              <div key={index} className="flex min-w-[100px] flex-col items-center gap-2 rounded-lg bg-muted/50 p-4">
                <span className="text-sm font-medium">{hour.time}</span>
                <span className="text-3xl">
                  {hour.condition === "Sunny"
                    ? "☀️"
                    : hour.condition === "Cloudy"
                      ? "☁️"
                      : hour.condition === "Rainy"
                        ? "🌧️"
                        : "⛅"}
                </span>
                <span className="text-xl font-bold">
                  {displayTemp}
                  {tempUnit}
                </span>
                <span className="text-xs text-muted-foreground">{hour.precipitation}% rain</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
