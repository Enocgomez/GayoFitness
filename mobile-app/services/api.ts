import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_IP = "10.10.2.221";

const API_NODE =
  typeof window !== "undefined"
    ? "http://localhost:3000/api"
    : `http://${LOCAL_IP}:3000/api`;

const API_IA =
  typeof window !== "undefined"
    ? "http://127.0.0.1:8000"
    : `http://${LOCAL_IP}:8000`;

// 🔹 HEADERS CON TOKEN
const getHeaders = async () => {
  let token = await AsyncStorage.getItem('token');

  // 🔥 FIX PARA WEB
  if (!token && typeof window !== "undefined") {
    token = localStorage.getItem('token');
  }

  console.log("TOKEN:", token); // debug

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ======================
// 🔹 AUTH
// ======================

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  goal: string
) => {
  const res = await fetch(`${API_NODE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, goal }),
  });

  const data = await res.json();

  if (data.token) {
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_NODE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (data.token) {
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getLocalUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ======================
// 🔹 STATS
// ======================

export const getTodayStats = async () => {
  const res = await fetch(`${API_NODE}/stats/today`, {
    headers: await getHeaders(),
  });
  return await res.json();
};

export const getWeeklyStats = async () => {
  const res = await fetch(`${API_NODE}/stats/weekly`, {
    headers: await getHeaders(),
  });
  return await res.json();
};

// ======================
// 🔹 RECOMMENDATIONS
// ======================

export const getRecommendations = async () => {
  const res = await fetch(`${API_NODE}/recommendations`, {
    headers: await getHeaders(),
  });
  return await res.json();
};

// ======================
// 🔹 IA
// ======================

// Tipo del historial que acepta el backend
export type ChatHistoryMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export const chatIA = async (
  message: string,
  history: ChatHistoryMessage[] = []
): Promise<{ reply: string }> => {

  // Recuperar datos del usuario para personalizar la IA
  const user = await getLocalUser();

  const res = await fetch(`${API_IA}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history,          // ✅ historial de conversación
      stream: false,    // ✅ sin streaming (React Native no soporta SSE fácilmente)
      name: user?.name ?? null,   // ✅ nombre del usuario para personalizar
      goal: user?.goal ?? null,   // ✅ objetivo del usuario para personalizar
    }),
  });

  if (!res.ok) {
    throw new Error(`Error del servidor: ${res.status}`);
  }

  return await res.json(); // { reply: "..." }
};