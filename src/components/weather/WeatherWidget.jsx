"use client"

import { useSelector, useDispatch } from "react-redux"
import { fetchWeather } from "../../features/weather/weatherSlice"
import { useState } from "react"
import { Cloud, Sun, CloudRain, Search, RefreshCw, CloudDrizzle, CloudLightning, Wind } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

function WeatherWidget() {
  const dispatch = useDispatch()
  const { data: weather, loading, error } = useSelector((state) => state.weather)
  const [location, setLocation] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Handle weather refresh with animation
  const handleRefresh = () => {
    dispatch(fetchWeather(weather?.location || "New York"))
  }

  // Handle location search
  const handleSearch = (e) => {
    e.preventDefault()
    if (!location.trim()) return

    setIsSearching(true)
    dispatch(fetchWeather(location)).finally(() => {
      setIsSearching(false)
      setLocation("")
    })
  }

  // Get weather icon based on condition with animations
  const getWeatherIcon = () => {
    if (!weather) return <Cloud className="h-10 w-10 text-gray-400" />

    const condition = weather.condition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <CloudDrizzle className="h-10 w-10 text-blue-500" />
        </motion.div>
      )
    } else if (condition.includes("thunder") || condition.includes("lightning")) {
      return (
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <CloudLightning className="h-10 w-10 text-purple-500" />
        </motion.div>
      )
    } else if (condition.includes("sun") || condition.includes("clear")) {
      return (
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <Sun className="h-10 w-10 text-amber-500" />
        </motion.div>
      )
    } else if (condition.includes("wind") || condition.includes("breeze")) {
      return (
        <motion.div
          animate={{ x: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Wind className="h-10 w-10 text-gray-500" />
        </motion.div>
      )
    } else {
      return (
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <Cloud className="h-10 w-10 text-gray-500" />
        </motion.div>
      )
    }
  }

  // Format the last updated time
  const getLastUpdated = () => {
    if (!weather?.lastUpdated) return "Never"

    return new Date(weather.lastUpdated).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Weather</h3>

      <AnimatePresence mode="wait">
        {loading && !weather && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="rounded-full h-10 w-10 border-b-2 border-t-2 border-black"
            ></motion.div>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4 text-red-500"
          >
            <p>Failed to load weather data.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="mt-2 px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
            >
              Retry
            </motion.button>
          </motion.div>
        )}

        {weather && !loading && (
          <motion.div
            key="weather"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getWeatherIcon()}
                <div className="ml-3">
                  <h4 className="font-medium text-gray-800">{weather.location}</h4>
                  <p className="text-2xl font-bold">{weather.temp}°C</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">{weather.condition}</p>
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleRefresh}
                  className="text-gray-400 hover:text-black mt-1"
                  aria-label="Refresh weather"
                >
                  <RefreshCw size={16} />
                </motion.button>
              </div>
            </div>

            <p className="text-xs text-gray-500">Last updated: {getLastUpdated()}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSearch}
        className="mt-4"
      >
        <div className="flex">
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location..."
            className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black"
            disabled={isSearching}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="px-3 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 disabled:opacity-50"
            disabled={isSearching || !location.trim()}
          >
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              ></motion.div>
            ) : (
              <Search size={16} />
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  )
}

export default WeatherWidget