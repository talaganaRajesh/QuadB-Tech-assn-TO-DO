"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addTask } from "../../features/tasks/tasksSlice"
import { motion } from "framer-motion"
import { Plus, AlertTriangle, Clock } from "lucide-react"
import CustomDropdown from "../ui/CustomDropdown2"

function TaskInput() {
  const dispatch = useDispatch()
  const [text, setText] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const weatherData = useSelector((state) => state.weather.data)

  const formRef = useRef(null) // Add a ref to the form element

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsExpanded(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [formRef])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) return

    setIsLoading(true)

    // Dispatch the addTask action with the task data
    await dispatch(
      addTask({
        text: text.trim(),
        priority,
        weather: weatherData
          ? {
            temp: weatherData.temp,
            condition: weatherData.condition,
            location: weatherData.location,
          }
          : null,
      }),
    )

    // Reset form after submission
    setText("")
    setPriority("medium")
    setIsLoading(false)
  }

  const getPriorityIcon = () => {
    switch (priority) {
      case "high":
        return <AlertTriangle size={16} className="text-red-500" />
      case "medium":
        return <Clock size={16} className="text-amber-500" />
      case "low":
        return <Clock size={16} className="text-blue-400" />
      default:
        return null
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" }
      case "medium":
        return { bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-100" }
      case "low":
        return { bg: "bg-blue-50", text: "text-blue-400", border: "border-blue-100" }
      default:
        return { bg: "", text: "", border: "" }
    }
  }

  const { bg, text: textColor, border } = getPriorityColor()

  return (
    <motion.div layout className="mb-1">
      <motion.form onSubmit={handleSubmit} layout ref={formRef}>
        <div className="flex flex-col space-y-3">
          <motion.div
            className={`flex items-center overflow-hidden border ${border} rounded-lg shadow-sm ${bg}`}
            animate={{ height: "auto" }}
          >
            <motion.input
              whileFocus={{ scale: 1.005 }}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done?"
              className={`flex-grow px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 font-medium ${text ? "text-gray-800" : "text-gray-500"
                }`}
              onFocus={() => setIsExpanded(true)}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="submit"
              className="px-4 py-3 bg-black text-white rounded-r-lg hover:bg-gray-800 disabled:opacity-50 flex items-center"
              disabled={isLoading || !text.trim()}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                ></motion.div>
              ) : (
                <Plus size={20} />
              )}
            </motion.button>
          </motion.div>

          <AnimatedOptions isExpanded={isExpanded || text.length > 0} priority={priority} setPriority={setPriority} />
        </div>
      </motion.form>
    </motion.div>
  )
}

// Animated Options component
function AnimatedOptions({ isExpanded, priority, setPriority }) {
  return (
    <motion.div
      animate={{
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      initial={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <CustomDropdown
            value={priority}
            onChange={(value) => setPriority(value)}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TaskInput