import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated login function - in a real app, this would call an API
export const login = createAsyncThunk("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Super basic validation - would be handled by backend in real app
    if (email === "demo@example.com" && password === "password") {
      // Store in localStorage to persist across sessions
      localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }))
      return { email, name: "Demo User" }
    }

    return rejectWithValue("Invalid credentials")
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// Simulated register function
export const register = createAsyncThunk("auth/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would create a new user in the database
    localStorage.setItem("user", JSON.stringify({ email, name }))
    return { email, name }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// Check if user is already logged in
export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async () => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = localStorage.getItem("user")
  if (user) {
    return JSON.parse(user)
  }

  return null
})

// Logout function
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user")
  // Clear tasks from localStorage too when logging out
  localStorage.removeItem("tasks")
  return null
})

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = !!action.payload
        state.user = action.payload
      })

      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

