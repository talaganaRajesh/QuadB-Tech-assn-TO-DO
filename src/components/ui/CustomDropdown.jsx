import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select", 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  // Find the selected option label
  const selectedOption = options.find(option => option.value === value)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-200 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-800" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ease-in-out ${isOpen ? "transform rotate-180" : ""}`} 
        />
      </button>
      
      <div 
        className={`
          absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen 
            ? "opacity-100 transform translate-y-0" 
            : "opacity-0 transform -translate-y-2 pointer-events-none"}
        `}
      >
        <ul className="py-1">
          {options.map((option) => (
            <li
              key={option.value}
              className={`
                px-3 py-2 text-sm cursor-pointer transition-colors duration-200
                ${option.value === value 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-50"}
              `}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CustomDropdown