"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { toggleTask, deleteTask, updateTaskPriority } from "../../features/tasks/tasksSlice"
import { CheckCircle, Circle, Trash2, AlertTriangle, Clock, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"



function TaskItem({ task }) {
  const dispatch = useDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleToggle = () => {
    dispatch(toggleTask(task.id))
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    // Add a small delay for animation
    setTimeout(() => {
      dispatch(deleteTask(task.id))
    }, 150)
  }



  const handlePriorityChange = (priorityValue) => {
    dispatch(
      updateTaskPriority({
        taskId: task.id,
        priority: priorityValue,
      })
    );
  };



  const getPriorityDetails = () => {
    switch (task.priority) {
      case "high":
        return {
          icon: <AlertTriangle size={16} className="text-red-500" />,
          textColor: "text-red-500",
          bgColor: "bg-red-100",
          borderColor: "border-red-400",
        }
      case "medium":
        return {
          icon: <Clock size={16} className="text-amber-500" />,
          textColor: "text-amber-500",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-300",
        }
      case "low":
        return {
          icon: <Clock size={16} className="text-blue-400" />,
          textColor: "text-blue-400",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-400",
        }
      default:
        return {
          icon: null,
          textColor: "",
          bgColor: "",
          borderColor: "",
        }
    }
  }

  const { icon: priorityIcon, textColor: priorityTextColor, bgColor, borderColor } = getPriorityDetails()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.03 }}
      className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${isDeleting ? "scale-95 opacity-50" : ""
        } ${task.completed ? "bg-gray-50" : bgColor} ${borderColor}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-black transition-colors"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <CheckCircle className="h-6 w-6 text-black" />
            </motion.div>
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </motion.button>

        <div className="flex-grow min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <motion.p
              animate={{ opacity: task.completed ? 0.6 : 1 }}
              className={`text-gray-800 break-words ${task.completed ? "line-through text-gray-500" : "font-medium"}`}
            >
              {task.text}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered || isExpanded ? 1 : 0 }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </motion.button>

            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : "28px", overflow: isExpanded ? "visible" : "hidden" }}
            className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500"
          >
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Created:</span> {formattedDate}
            </div>


            <div className="flex justify-center items-center flex-col sm:flex-row sm:items-center gap-3 pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <select
                  value={task?.priority || "low"} // Fallback to "low" if task.priority is undefined
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>




            {task.weather && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Weather:</span>
                <span>
                  {task.weather.temp}°C, {task.weather.condition} in {task.weather.location}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem