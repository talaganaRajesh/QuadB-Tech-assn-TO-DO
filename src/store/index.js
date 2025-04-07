import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import tasksReducer from "../features/tasks/tasksSlice"
import weatherReducer from "../features/weather/weatherSlice"

// Main Redux store configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    weather: weatherReducer,
  },
  // Added this middleware after debugging some weird serialization issues
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ["tasks/addTask/fulfilled"],
      },
    }),
})

