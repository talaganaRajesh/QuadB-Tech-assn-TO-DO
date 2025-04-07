import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Fetch weather data from OpenWeatherMap API
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (location = "New York", { rejectWithValue }) => {
    try {
      // In a real app, you'd use your own API key
      // For this demo, we'll simulate the API response
      // const apiKey = 'your-api-key'
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simulate API response based on location
      let mockWeather

      switch (location.toLowerCase()) {
        case "london":
          mockWeather = { temp: 15, condition: "Rainy", icon: "10d" }
          break
        case "tokyo":
          mockWeather = { temp: 25, condition: "Clear", icon: "01d" }
          break
        case "sydney":
          mockWeather = { temp: 28, condition: "Sunny", icon: "01d" }
          break
        default:
          // Default to New York
          mockWeather = { temp: 22, condition: "Partly Cloudy", icon: "02d" }
      }

      return {
        location,
        ...mockWeather,
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  data: null,
  loading: false,
  error: null,
}

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearWeather: (state) => {
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearWeather } = weatherSlice.actions
export default weatherSlice.reducer

