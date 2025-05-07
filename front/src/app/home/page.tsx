"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/"); // Se não estiver logado, volta pro login
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo à Home!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Sair
      </button>
    </div>
  );
}
