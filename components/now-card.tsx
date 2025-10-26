interface CurrentWeather {
  temperature: number
  feelsLike: number
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
  sunrise: string
  sunset: string
}

interface NowCardProps {
  data: CurrentWeather
  units: "metric" | "imperial"
}

export function NowCard({ data, units }: NowCardProps) {
  const tempUnit = units === "metric" ? "°C" : "°F"
  const speedUnit = units === "metric" ? "m/s" : "mph"

  const displayTemp = units === "metric" ? data.temperature : Math.round((data.temperature * 9) / 5 + 32)
  const displayFeelsLike = units === "metric" ? data.feelsLike : Math.round((data.feelsLike * 9) / 5 + 32)
  const displayWindSpeed = units === "metric" ? data.windSpeed : Math.round(data.windSpeed * 2.237)

  const stats = [
    { label: "Feels Like", value: `${displayFeelsLike}${tempUnit}`, icon: "🌡️" },
    { label: "Humidity", value: `${data.humidity}%`, icon: "💧" },
    { label: "Wind Speed", value: `${displayWindSpeed} ${speedUnit}`, icon: "💨" },
    { label: "Precipitation", value: `${data.precipitation}%`, icon: "🌧️" },
    { label: "Sunrise", value: data.sunrise, icon: "🌅" },
    { label: "Sunset", value: data.sunset, icon: "🌇" },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Current Conditions</h3>
      <div className="grid gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <span className="font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
