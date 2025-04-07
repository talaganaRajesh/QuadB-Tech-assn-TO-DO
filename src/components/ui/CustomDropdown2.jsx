import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Clock, ChevronDown } from "lucide-react";

function CustomDropdown2({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const getIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle size={16} className="text-red-500" />;
      case "medium":
        return <Clock size={16} className="text-amber-500" />;
      case "low":
        return <Clock size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };
  
  const getBackgroundColor = (priority) => {
    switch (priority) {
      case "high":
        return "hover:bg-red-50";
      case "medium":
        return "hover:bg-amber-50";
      case "low":
        return "hover:bg-blue-50";
      default:
        return "";
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between space-x-3 pl-3 pr-4 py-2 min-w-[120px] border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
      >
        <span className="flex items-center">
          {getIcon(value)}
          <span className="ml-2 capitalize">{value}</span>
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="fixed z-50 shadow-lg" style={{
          width: dropdownRef.current ? Math.max(dropdownRef.current.clientWidth, 130) : 130,
          top: dropdownRef.current ? 
            dropdownRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 0,
          left: dropdownRef.current ? 
            dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0
        }}>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            {["low", "medium", "high"].map((priority) => (
              <div
                key={priority}
                onClick={() => {
                  onChange(priority);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer ${
                  value === priority ? "bg-gray-100" : ""
                } ${getBackgroundColor(priority)}`}
              >
                {getIcon(priority)}
                <span className="capitalize">{priority}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomDropdown2;