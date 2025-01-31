// src/app/search-bar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;
        // /search?query=사용자입력값 으로 이동
        router.push(`/search?query=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Enter 키 누르면 검색
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요..."
                className="border border-gray-300 rounded px-2 py-1 text-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                onClick={handleSearch}
                className="bg-green-500 text-white text-sm px-3 py-1 rounded
                   hover:bg-green-600 transition-colors"
            >
                검색
            </button>
        </div>
    );
}
