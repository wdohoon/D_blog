"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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

            // 로그인 성공 => session 이 존재
            alert("로그인 성공!");
            router.push("/"); // 메인 페이지로 이동
        } catch (err: any) {
            console.error("SignIn Error:", err.message);
            alert(`로그인 에러: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-sm mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h1 className="text-2xl font-semibold mb-4">로그인</h1>
            <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">이메일</label>
                    <input
                        type="email"
                        className="w-full border rounded px-2 py-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 입력"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">비밀번호</label>
                    <input
                        type="password"
                        className="w-full border rounded px-2 py-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호 입력"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>
            </form>
        </main>
    );
}
