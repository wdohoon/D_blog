"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthLinks() {
    const [session, setSession] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // 1) 페이지 로드 시 현재 세션 확인
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // 2) 로그인/로그아웃 등 Auth 상태 변화 감지
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 로그아웃
    const handleLogout = async () => {
        await supabase.auth.signOut();
        // 상태 변경 후 새로고침(또는 router.refresh())
        router.refresh();
    };

    // **로그인되지 않은** 경우 → "회원가입", "로그인" 버튼 보여주기
    if (!session) {
        return (
            <>
                <Link href="/auth/signup" className="hover:text-green-600">
                    회원가입
                </Link>
                <Link href="/auth/signin" className="hover:text-green-600">
                    로그인
                </Link>
            </>
        );
    }

    // **로그인된** 경우 → "로그아웃" 버튼만 보여주기
    return (
        <>
            <button onClick={handleLogout} className="hover:text-green-600">
                로그아웃
            </button>
        </>
    );
}
