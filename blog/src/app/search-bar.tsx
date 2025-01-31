"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function SearchBar() {
    const [query, setQuery] = useState("")
    const router = useRouter()

    const handleSearch = () => {
        if (!query.trim()) return
        router.push(`/search?query=${encodeURIComponent(query)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요..."
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white text-sm px-3 py-1 rounded-full
                   hover:bg-green-600 transition-colors"
            >
                검색
            </button>
        </div>
    )
}

