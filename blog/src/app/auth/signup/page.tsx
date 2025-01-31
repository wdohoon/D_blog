"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            alert("회원가입 성공! 🎉 이메일 확인이 필요할 수 있습니다.");
            router.push("/auth/signin");
        } catch (err: any) {
            console.error("SignUp Error:", err.message);
            alert(`회원가입 에러: ${err.message} 😞`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">회원가입 🌟</h1>
            <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                    <label className="block mb-2 font-medium">이메일 📧</label>
                    <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
                >
                    {loading ? "가입 중... ⏳" : "가입하기 🚀"}
                </button>
            </form>
            <p className="mt-4 text-center">
                이미 계정이 있으신가요? <Link href="/auth/signin" className="text-green-500 hover:underline">로그인</Link>
            </p>
        </main>
    );
}
