import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

// Load tasks from localStorage
const loadTasks = () => {
  try {
    const tasks = localStorage.getItem("tasks")
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    // If there's an error parsing JSON, return empty array
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Async thunk for adding a task (with simulated API delay)
export const addTask = createAsyncThunk("tasks/addTask", async (taskData, { getState }) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newTask = {
    id: uuidv4(),
    text: taskData.text,
    completed: false,
    priority: taskData.priority || "medium",
    createdAt: new Date().toISOString(),
    weather: taskData.weather || null,
  }

  // After "API call", update localStorage
  const currentTasks = getState().tasks.items
  const updatedTasks = [...currentTasks, newTask]
  saveTasks(updatedTasks)

  return newTask
})

// Async thunk for toggling task completion
export const toggleTask = createAsyncThunk("tasks/toggleTask", async (taskId, { getState }) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const currentTasks = getState().tasks.items
  const updatedTasks = currentTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))

  saveTasks(updatedTasks)
  return taskId
})

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId, { getState }) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const currentTasks = getState().tasks.items
  const updatedTasks = currentTasks.filter((task) => task.id !== taskId)

  saveTasks(updatedTasks)
  return taskId
})

// Async thunk for updating task priority
export const updateTaskPriority = createAsyncThunk(
  "tasks/updateTaskPriority",
  async ({ taskId, priority }, { getState }) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    const currentTasks = getState().tasks.items
    const updatedTasks = currentTasks.map((task) => (task.id === taskId ? { ...task, priority } : task))

    saveTasks(updatedTasks)
    return { taskId, priority }
  },
)

const initialState = {
  items: loadTasks(),
  loading: false,
  error: null,
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Just in case we need to clear all tasks
    clearTasks: (state) => {
      state.items = []
      saveTasks([])
    },
  },
  extraReducers: (builder) => {
    builder
      // Add task cases
      .addCase(addTask.pending, (state) => {
        state.loading = true
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false
        state.items.push(action.payload)
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      // Toggle task cases
      .addCase(toggleTask.fulfilled, (state, action) => {
        const taskId = action.payload
        const task = state.items.find((task) => task.id === taskId)
        if (task) {
          task.completed = !task.completed
        }
      })

      // Delete task cases
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
      })

      // Update task priority cases
      .addCase(updateTaskPriority.fulfilled, (state, action) => {
        const { taskId, priority } = action.payload
        const task = state.items.find((task) => task.id === taskId)
        if (task) {
          task.priority = priority
        }
      })
  },
})

export const { clearTasks } = tasksSlice.actions
export default tasksSlice.reducer

