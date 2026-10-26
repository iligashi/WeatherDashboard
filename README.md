# Weather Dashboard

A responsive weather dashboard built with Next.js, React, and TypeScript. It supports location search and presents current conditions, hourly and daily forecasts, charts, and display settings.

## Requirements

- Node.js and npm
- An OpenWeather API key

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env.local` and set your API key:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

The app makes weather requests from the browser, so the public API key is included in client-side requests. Apply the restrictions and usage limits available from your OpenWeather account.
