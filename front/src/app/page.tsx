"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", isError: false });

    try {
      if (showRegister) {
        const result = await registerUser(form.username, form.password);
        if (result.success) {
          setMessage({ text: result.message, isError: false });
          setShowRegister(false);
          setForm({ username: "", password: "" });
        } else {
          setMessage({ text: result.message, isError: true });
        }
      } else {
        const result = await loginUser(form.username, form.password);
        if (result.success) {
          localStorage.setItem("currentUser", JSON.stringify({
            id: result.user_id,
            username: form.username
          }));
          router.push("/home");
        } else {
          setMessage({ text: result.message, isError: true });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">
          {showRegister ? "Registrar" : "Login"}
        </h1>
        
        {message.text && (
          <div className={`mb-4 p-2 rounded text-center ${
            message.isError ? "bg-red-700 text-red-200" : "bg-green-700 text-green-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Usuário"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded bg-gray-700 text-white placeholder-gray-400"
            required
          />
          
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
            >
              {isLoading ? "Processando..." : showRegister ? "Registrar" : "Entrar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowRegister(!showRegister);
                setMessage({ text: "", isError: false });
              }}
              className="text-gray-300 hover:underline"
            >
              {showRegister ? "Já tem conta? Login" : "Criar nova conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}