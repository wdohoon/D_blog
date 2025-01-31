"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const {
                data: { session },
                error,
            } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                throw error;
            }

            alert("로그인 성공! 🎉");
            router.push("/");
        } catch (err: any) {
            console.error("SignIn Error:", err.message);
            alert(`로그인 에러: ${err.message} 😞`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">로그인 ✨</h1>
            <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">이메일 📧</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2 font-medium">비밀번호 🔒</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    {loading ? "로그인 중... ⏳" : "로그인 🚀"}
                </button>
            </form>
            <p className="mt-4 text-center">
                계정이 없으신가요? <Link href="/auth/signup" className="text-blue-500 hover:underline">회원가입</Link>
            </p>
        </main>
    );
}
