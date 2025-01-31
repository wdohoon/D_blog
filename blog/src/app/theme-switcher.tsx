"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from 'lucide-react';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else if (theme === 'light') {
            setTheme('system');
        } else {
            setTheme('dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Moon size={20} />
            ) : theme === 'light' ? (
                <Sun size={20} />
            ) : (
                <Monitor size={20} />
            )}
        </button>
    );
}
