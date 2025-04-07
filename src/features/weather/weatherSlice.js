import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Async thunk to fetch real-time weather data
export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async (location = "New York", { rejectWithValue }) => {
    try {
      // ✅ Use Vite environment variable
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

      // ✅ Input validation
      if (!location || location.trim().length < 2) {
        return rejectWithValue("Please enter a valid city name.");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
      );

      const data = await response.json();

      // ✅ Check for invalid response (like 404 city not found)
      if (!response.ok) {
        const errorMsg = data?.message || "Failed to fetch weather data";
        throw new Error(errorMsg);
      }

      // ✅ Return simplified data
      return {
        location: data.name,
        temp: data.main.temp,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Initial State
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// ✅ Redux Slice
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearWeather: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load weather data.";
      });
  },
});

export const { clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
