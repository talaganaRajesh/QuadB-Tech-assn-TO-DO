"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchWeather } from "../features/weather/weatherSlice"
import TaskInput from "./tasks/TaskInput"
import TaskList from "./tasks/TaskList"
import WeatherWidget from "./weather/WeatherWidget"

function Dashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { items: tasks } = useSelector((state) => state.tasks)
  
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = tasks.filter((task) => !task.completed).length
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length

  useEffect(() => {
    // Get user's location or default to New York
    const userLocation = "New York" // This could be dynamic based on user preferences
    dispatch(fetchWeather(userLocation))

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchWeather(userLocation))
    }, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [dispatch])

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Tasks */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Welcome back, {user?.name || "User"}!
                </h1>
                <p className="text-gray-600">
                  {pendingTasks === 0 
                    ? "You're all caught up! Well done." 
                    : `You have ${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} remaining.`}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                  <span className="text-sm font-medium">
                    {Math.round((completedTasks / (tasks.length || 1)) * 100)}% complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
            <TaskInput />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
              {tasks.length > 0 && (
                <span className="text-sm text-gray-500">
                  {completedTasks} of {tasks.length} completed
                </span>
              )}
            </div>
            
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No tasks yet. Add a new task to get started!</p>
              </div>
            ) : (
              <TaskList />
            )}
          </div>
        </div>

        {/* Right column - Widgets */}
        <div className="w-full lg:w-1/4 space-y-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 overflow-hidden">
            <WeatherWidget />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Overview</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">{completedTasks}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${(completedTasks / (tasks.length || 1)) * 100}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">High Priority</span>
                  <span className="font-medium">{highPriorityTasks}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" 
                    style={{ width: `${(highPriorityTasks / (tasks.length || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-xl font-semibold text-gray-800">{pendingTasks}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">Efficiency</p>
                <p className="text-xl font-semibold text-gray-800">
                  {tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard