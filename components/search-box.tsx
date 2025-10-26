"use client"

import { useState, useRef, useEffect } from "react"
import { searchLocations, type LocationResult } from "@/lib/weather-api"

interface SearchBoxProps {
  onSearch: (location: LocationResult) => void
}

export function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = async (value: string) => {
    setQuery(value)
    if (value.length > 1) {
      setIsLoading(true)
      const results = await searchLocations(value)
      setSuggestions(results)
      setIsOpen(results.length > 0)
      setIsLoading(false)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }

  const handleSelect = (suggestion: LocationResult) => {
    const displayName = suggestion.state
      ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
      : `${suggestion.name}, ${suggestion.country}`
    setQuery(displayName)
    onSearch(suggestion)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Search location..."
          className="w-64 rounded-lg border border-border bg-card px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-accent first:rounded-t-lg last:rounded-b-lg"
            >
              {suggestion.state
                ? `${suggestion.name}, ${suggestion.state}, ${suggestion.country}`
                : `${suggestion.name}, ${suggestion.country}`}
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      )}
    </div>
  )
}
