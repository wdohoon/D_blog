// src/app/theme-switcher.tsx
"use client";

import React from "react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value);
    };

    return (
        <select
            value={theme}
            onChange={handleChange}
            className="p-1 border rounded bg-white dark:bg-gray-800 text-sm"
        >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    );
}
