"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "../services/api";

export default function Menu() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/home");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleRegister = async () => {
    try {
      console.log("Tentando registrar com os dados:", { username, password });

      const data = await registerUser(username, password);
      setMessage(`Usuário registrado com sucesso: ${data.username}`);
      setShowRegisterPopup(false);
    } catch (error) {
      if (error.response) {
        console.error("Erro no registro:", error.response.data);
        setMessage(`Erro ao registrar: ${error.response.data.message || "Verifique os dados enviados."}`);
      } else {
        console.error("Erro desconhecido:", error);
        setMessage("Erro ao registrar usuário.");
      }
    }
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      if (data.token && data.username) {
        localStorage.setItem("authToken", data.token);
        router.push("/home");
      } else {
        setMessage("Falha no login: Token ou nome de usuário ausente.");
      }
    } catch (error) {
      setMessage("Erro ao fazer login.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center">
      <div className="bg-gray-300 dark:bg-gray-700 p-6 rounded-lg shadow-md w-96">
        <h1 className="text-xl font-bold mb-4">Menu</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={() => setShowRegisterPopup(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Registrar
          </button>
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </button>
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>

      {showRegisterPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Registrar</h2>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-400 dark:border-gray-600 rounded-lg"
            />
            <div className="flex gap-4">
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Registrar
              </button>
              <button
                onClick={() => setShowRegisterPopup(false)}
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
