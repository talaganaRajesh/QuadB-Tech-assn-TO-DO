import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

// Load tasks from localStorage
const loadTasks = () => {
  try {
    const tasks = localStorage.getItem("tasks")
    return tasks ? JSON.parse(tasks) : []
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error)
    return []
  }
}

// Save tasks in localStorage
const saveTasks = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

export const addTask = createAsyncThunk("tasks/addTask", async (taskData, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const newTask = {
    id: uuidv4(),
    text: taskData.text,
    completed: false,
    priority: taskData.priority || "medium",
    createdAt: new Date().toISOString(),
    weather: taskData.weather || null,
  }

  const currentTasks = getState().tasks.items
  const updatedTasks = [...currentTasks, newTask]
  saveTasks(updatedTasks)

  return newTask
})

export const toggleTask = createAsyncThunk("tasks/toggleTask", async (taskId, { getState }) => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const currentTasks = getState().tasks.items
  const updatedTasks = currentTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task))

  saveTasks(updatedTasks)
  return taskId
})

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (taskId, { getState }) => {
  await new Promise((resolve) => setTimeout(resolve, 200))

  const currentTasks = getState().tasks.items
  const updatedTasks = currentTasks.filter((task) => task.id !== taskId)

  saveTasks(updatedTasks)
  return taskId
})

export const updateTaskPriority = createAsyncThunk(
  "tasks/updateTaskPriority",
  async ({ taskId, priority }, { getState }) => {
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
    clearTasks: (state) => {
      state.items = []
      saveTasks([])
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(toggleTask.fulfilled, (state, action) => {
        const taskId = action.payload
        const task = state.items.find((task) => task.id === taskId)
        if (task) {
          task.completed = !task.completed
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload)
      })

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

