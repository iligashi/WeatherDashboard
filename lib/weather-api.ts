const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ""
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

export interface LocationResult {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
}

export interface WeatherData {
  current: {
    temperature: number
    feelsLike: number
    condition: string
    humidity: number
    windSpeed: number
    precipitation: number
    sunrise: string
    sunset: string
  }
  hourly: Array<{
    time: string
    temperature: number
    condition: string
    precipitation: number
    humidity: number
    windSpeed: number
  }>
  daily: Array<{
    day: string
    date: string
    high: number
    low: number
    condition: string
    precipitation: number
  }>
}

// Search for locations by name
export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.length < 2) return []

  try {
    const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)

    if (!response.ok) throw new Error("Failed to fetch locations")

    const data = await response.json()
    return data.map((item: any) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
    }))
  } catch (error) {
    console.error("[v0] Location search error:", error)
    return []
  }
}

// Get weather data by coordinates
export async function getWeatherByCoords(
  lat: number,
  lon: number,
  units: "metric" | "imperial" = "metric",
): Promise<WeatherData> {
  try {
    // Fetch current weather and forecast in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
      fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`),
    ])

    if (!currentResponse.ok) {
      const errorText = await currentResponse.text()
      console.error("Current weather API error:", currentResponse.status, errorText)
      throw new Error(`Failed to fetch current weather: ${currentResponse.status}`)
    }

    if (!forecastResponse.ok) {
      const errorText = await forecastResponse.text()
      console.error("Forecast API error:", forecastResponse.status, errorText)
      throw new Error(`Failed to fetch forecast: ${forecastResponse.status}`)
    }

    const currentData = await currentResponse.json()
    const forecastData = await forecastResponse.json()

    // Process current weather
    const current = {
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      condition: currentData.weather[0].main,
      humidity: currentData.main.humidity,
      windSpeed: currentData.wind.speed,
      precipitation: currentData.rain?.["1h"] || currentData.snow?.["1h"] || 0,
      sunrise: formatTime(currentData.sys.sunrise),
      sunset: formatTime(currentData.sys.sunset),
    }

    // Process hourly forecast (next 10 hours from 3-hour intervals)
    const hourly = forecastData.list.slice(0, 10).map((item: any) => ({
      time: formatHourTime(item.dt),
      temperature: Math.round(item.main.temp),
      condition: item.weather[0].main,
      precipitation: Math.round((item.pop || 0) * 100),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }))

    // Process daily forecast (group by day)
    const dailyMap = new Map<string, any[]>()
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()
      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, [])
      }
      dailyMap.get(dateKey)!.push(item)
    })

    const daily = Array.from(dailyMap.entries())
      .slice(0, 7)
      .map(([dateKey, items], index) => {
        const date = new Date(dateKey)
        const temps = items.map((item: any) => item.main.temp)
        const high = Math.round(Math.max(...temps))
        const low = Math.round(Math.min(...temps))
        const condition = items[Math.floor(items.length / 2)].weather[0].main
        const precipitation = Math.round(Math.max(...items.map((item: any) => (item.pop || 0) * 100)))

        return {
          day: index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "long" }),
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          high,
          low,
          condition,
          precipitation,
        }
      })

    return { current, hourly, daily }
  } catch (error) {
    console.error("[v0] Weather fetch error:", error)
    throw error
  }
}

// Helper to format Unix timestamp to time string
function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

// Helper to format Unix timestamp to hour string
function formatHourTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true })
}
