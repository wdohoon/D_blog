"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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

            // 이메일 인증이 활성화된 경우, 가입 후 인증 메일이 발송됨
            // 활성화되지 않았다면 바로 유저가 생성되고 세션이 생길 수도 있음
            alert("회원가입 성공! 이메일 확인(메일 인증)이 필요할 수 있습니다.");
            router.push("/auth/signin"); // 로그인 페이지로 이동
        } catch (err: any) {
            console.error("SignUp Error:", err.message);
            alert(`회원가입 에러: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-sm mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h1 className="text-2xl font-semibold mb-4">회원가입</h1>
            <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">이메일</label>
                    <input
                        type="email"
                        className="w-full border rounded px-2 py-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
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
                        placeholder="********"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {loading ? "가입 중..." : "가입"}
                </button>
            </form>
        </main>
    );
}
