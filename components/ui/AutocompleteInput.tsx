import { useState, useRef, useEffect, FC } from 'react'
import { cn } from '@/lib/utils/cn'

export interface AutocompleteOption {
  id: string
  label: string
  category: string // e.g., "Store", "Neighborhood", "Category"
  value: string
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  options: AutocompleteOption[]
  placeholder?: string
  className?: string
  onSelect?: (option: AutocompleteOption) => void
}

export const AutocompleteInput: FC<AutocompleteInputProps> = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
  className,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Filter options based on current input
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(value.toLowerCase()) ||
    option.value.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 8) // Limit to 8 suggestions

  // Handle input change
  const handleInputChange = (newValue: string) => {
    onChange(newValue)
    setIsOpen(newValue.length > 0)
    setHighlightedIndex(-1)
  }

  // Handle option selection
  const handleOptionSelect = (option: AutocompleteOption) => {
    onChange(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSelect?.(option)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredOptions.length === 0) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [highlightedIndex])

  return (
    <div className="relative">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-earth-sage-500 focus:border-earth-sage-500 transition-all duration-200",
            className
          )}
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => handleInputChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
          <ul ref={listRef} className="py-1">
            {filteredOptions.map((option, index) => (
              <li
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "px-4 py-2 cursor-pointer flex items-center justify-between transition-colors duration-150",
                  index === highlightedIndex
                    ? "bg-earth-sage-50 text-earth-sage-900"
                    : "text-gray-900 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{option.label}</span>
                  {option.category && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {option.category}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}