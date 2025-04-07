"use client"

import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import { LogOut } from "lucide-react"
import { useState, useRef, useEffect } from "react"

function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items: tasks = [] } = useSelector((state) => state.tasks || {})

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
    navigate("/login")
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U"
  const userName = user?.name || "User"
  const userEmail = user?.email || "user@example.com"

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-emerald-600">
            Task Master
          </Link>

          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <div
                onClick={toggleMenu}
                className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-semibold cursor-pointer hover:brightness-110 transition"
              >
                {userInitial}
              </div>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl z-40 border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>

                  <div className="px-4 py-2 border-t border-b border-gray-100 text-sm space-y-1">
                    <p className="text-gray-700">📋 Total Tasks: <span className="font-semibold">{totalTasks}</span></p>
                    <p className="text-green-600">✅ Completed: <span className="font-semibold">{completedTasks}</span></p>
                    <p className="text-orange-500">🕒 Pending: <span className="font-semibold">{pendingTasks}</span></p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center space-x-2 transition"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-3">
              <Link
                to="/login"
                className="inline-block px-5 py-2 text-sm font-medium text-emerald-600 border border-emerald-500 rounded-full shadow-sm hover:bg-emerald-50 hover:shadow-md transition duration-300"
              >
                Sign in
              </Link>

            </div>

          )}
        </div>
      </div>
    </header>
  )
}

export default Header
