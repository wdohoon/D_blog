"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DeleteButton({ postId }: { postId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

        if (error) {
            console.error("Delete error:", error.message);
            alert("게시글 삭제 중 에러가 발생했습니다.");
            return;
        }

        alert("게시글이 삭제되었습니다.");
        router.push("/"); // 메인 페이지나 목록으로 이동
    };

    return (
        <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
            삭제
        </button>
    );
}
