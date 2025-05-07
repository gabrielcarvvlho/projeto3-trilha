"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true); // Garante que não redirecione cedo

  // Verifica token somente depois de montar
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      router.replace("/home");
    } else {
      setIsCheckingToken(false); // Só exibe a tela depois dessa verificação
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        router.replace("/home");
      } else {
        setMessage("Token inválido.");
      }
    } catch {
      setMessage("Erro ao fazer login.");
    }
  };

  const handleRegister = async () => {
    try {
      const data = await registerUser(username, password);
      setMessage(`Usuário ${data.username} registrado com sucesso!`);
      setShowRegister(false);
    } catch {
      setMessage("Erro ao registrar.");
    }
  };

  if (isCheckingToken) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <div className="flex justify-between mb-4">
          <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Entrar
          </button>
          <button onClick={() => setShowRegister(true)} className="text-blue-500 hover:underline">
            Registrar
          </button>
        </div>
        {message && <p className="text-center text-sm">{message}</p>}
      </div>

      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Registrar Usuário</h2>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
            />
            <div className="flex justify-between">
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Registrar
              </button>
              <button
                onClick={() => setShowRegister(false)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
