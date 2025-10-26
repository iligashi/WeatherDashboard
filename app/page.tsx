"use client"

import { useState, useEffect } from "react"
import { SearchBox } from "@/components/search-box"
import { LocationHeader } from "@/components/location-header"
import { NowCard } from "@/components/now-card"
import { HourlyList } from "@/components/hourly-list"
import { ChartPanel } from "@/components/chart-panel"
import { DailyList } from "@/components/daily-list"
import { SettingsModal } from "@/components/settings-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { getWeatherByCoords, type LocationResult, type WeatherData } from "@/lib/weather-api"

export default function WeatherDashboard() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric")
  const [location, setLocation] = useState("San Francisco, CA")
  const [coords, setCoords] = useState({ lat: 37.7749, lon: -122.4194 }) // Default: San Francisco
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    async function fetchWeather() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getWeatherByCoords(coords.lat, coords.lon, units)
        setWeatherData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load weather data. Please try again."
        setError(errorMessage)
        console.error("Weather fetch error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchWeather()
  }, [coords, units])

  const handleSearch = (locationResult: LocationResult) => {
    const displayName = locationResult.state
      ? `${locationResult.name}, ${locationResult.state}, ${locationResult.country}`
      : `${locationResult.name}, ${locationResult.country}`
    setLocation(displayName)
    setCoords({ lat: locationResult.lat, lon: locationResult.lon })
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Weather
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <SearchBox onSearch={handleSearch} />
            <ThemeToggle />
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="glass rounded-xl border border-border/50 p-2.5 transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
              aria-label="Settings"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-primary/20" />
            </div>
          </div>
        )}

        {error && (
          <div className="glass rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center shadow-lg shadow-destructive/10">
            <p className="text-lg font-medium text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && weatherData && (
          <>
            <LocationHeader
              location={location}
              temperature={weatherData.current.temperature}
              condition={weatherData.current.condition}
              units={units}
            />

            <div className="mt-10 grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <NowCard data={weatherData.current} units={units} />
              </div>

              <div className="space-y-8 lg:col-span-2">
                <HourlyList data={weatherData.hourly} units={units} />
                <ChartPanel data={weatherData.hourly} units={units} />
                <DailyList data={weatherData.daily} units={units} />
              </div>
            </div>
          </>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        units={units}
        onUnitsChange={setUnits}
      />
    </div>
  )
}
