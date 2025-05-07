import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000", 
});

export const registerUser = async (username: string, password: string) => {
  const response = await api.post("/users/register", { username, password });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post("/users/login", { username, password });
  return response.data;
};

export const fetchPosts = async () => {
  try {
    console.log("Chamando o endpoint:", `${process.env.NEXT_PUBLIC_API_URL}/posts`);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
    console.log("Resposta recebida:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;
  }
};

export const createPost = async (post: { title: string; content: string }) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts`, post);
  return response.data;
};

export default api;