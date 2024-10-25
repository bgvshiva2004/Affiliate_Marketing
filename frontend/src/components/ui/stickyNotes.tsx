"use client"

import { useState } from 'react'
import { X } from 'lucide-react'

interface StickyNoteProps {
  title?: string
  content?: string
  onDelete?: () => void
}

export default function StickyNote({ title = 'Title', content = '', onDelete }: StickyNoteProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative w-64 h-64 bg-[#e8f5e9] p-4 shadow-md overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(#e8f5e9 1px, transparent 1px), linear-gradient(90deg, #e8f5e9 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '-1px -1px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 right-0 mt-2 mr-2">
        {isHovered && (
          <button 
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{content}</p>
      <div 
        className="absolute bottom-0 right-0 w-12 h-12 bg-[#fff]"
        style={{
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          transform: 'rotate(-5deg) translate(6px, 6px)'
        }}
      />
    </div>
  )
}