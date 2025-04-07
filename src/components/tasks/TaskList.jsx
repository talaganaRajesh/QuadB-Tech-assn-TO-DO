"use client"

import { useSelector } from "react-redux"
import TaskItem from "./TaskItem"
import { motion, AnimatePresence } from "framer-motion"
import { ListFilter, CheckCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

// Component for displaying the list of tasks
function TaskList() {
  const { items: tasks, loading } = useSelector((state) => state.tasks)
  const [filter, setFilter] = useState("all") // all, active, completed
  const [priorityFilter, setPriorityFilter] = useState("all") // all, high, medium, low

  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === "active" && task.completed) return false
    if (filter === "completed" && !task.completed) return false

    //  by priority
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false

    return true
  })

  //  by both priority and completion status
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="rounded-full h-12 w-12 border-2 border-t-black border-r-gray-200 border-b-gray-200 border-l-gray-200"
        ></motion.div>
      </div>
    )
  }

  return (

    <div>

      <div>
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            <div className="flex items-center mr-4">
              <ListFilter size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-500 mr-2">Status:</span>
              <div className="flex bg-gray-100 rounded-md p-1">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  label="All"
                />
                <FilterButton
                  active={filter === "active"}
                  onClick={() => setFilter("active")}
                  label="Active"
                />
                <FilterButton
                  active={filter === "completed"}
                  onClick={() => setFilter("completed")}
                  label={<div className="flex items-center"><CheckCircle size={14} className="mr-1" />Completed</div>}
                />
              </div>
            </div>

            <div className="flex items-center">
              <AlertTriangle size={16} className="text-gray-500 mr-1" />
              <span className="text-sm text-gray-500 mr-2">Priority:</span>
              <div className="flex bg-gray-100 rounded-md p-1">
                <FilterButton
                  active={priorityFilter === "all"}
                  onClick={() => setPriorityFilter("all")}
                  label="All"
                />
                <FilterButton
                  active={priorityFilter === "high"}
                  onClick={() => setPriorityFilter("high")}
                  label={<span className="text-red-500">High</span>}
                />
                <FilterButton
                  active={priorityFilter === "medium"}
                  onClick={() => setPriorityFilter("medium")}
                  label={<span className="text-amber-500">Medium</span>}
                />
                <FilterButton
                  active={priorityFilter === "low"}
                  onClick={() => setPriorityFilter("low")}
                  label={<span className="text-blue-400">Low</span>}
                />
              </div>
            </div>
          </motion.div>
        )}

      </div>

      <div className="h-96 px-4 w-full overflow-y-scroll">

        {tasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-xl bg-gray-50 border border-gray-100"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ListFilter size={40} className="text-gray-300 mb-3" />
              </motion.div>
              <p className="text-gray-500 font-medium">No tasks yet. Add one above to get started!</p>
            </div>
          </motion.div>
        ) : sortedTasks.length === 0 ? (
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100"
          >
            <p className="text-gray-500">No matching tasks found. Try adjusting your filters.</p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
              {sortedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                >
                  <TaskItem task={task} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>

  )
}

function FilterButton({ active, onClick, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${active ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"
        }`}
    >
      {label}
    </motion.button>
  )
}

export default TaskList