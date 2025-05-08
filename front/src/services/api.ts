import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Funções de Autenticação
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/users/login", { username, password });
    return {
      success: true,
      data: response.data,
      message: response.data.message || "Login bem-sucedido!"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao fazer login"
    };
  }
};

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await api.post("/users/register", { username, password });
    return {
      success: true,
      data: response.data,
      message: "Registro bem-sucedido!"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao registrar usuário"
    };
  }
};

// Funções de Posts
export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch posts");
  }
};

export const createPost = async (content: string, userId: number) => {
  try {
    const response = await api.post("/posts", {
      content,
      user_id: userId
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to create post");
  }
};

export const handleReaction = async (postId: number, userId: number, type: 'like' | 'dislike') => {
  try {
    const response = await api.post(`/posts/${postId}/react`, {
      user_id: userId,
      type
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to add reaction");
  }
};

// Interceptor para adicionar token de autenticação (opcional)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;