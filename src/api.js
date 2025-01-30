import axios from "axios";

const API_URL = "http://localhost:3000/accounts";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Ошибка регистрации";
  }
};



export const loginUser = async (userData) => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data;

    const user = users.find((u) => u.email === userData.email);

    if (!user) {
      throw "Пользователь не найден";
    }

    if (user.password !== userData.password) {
      throw "Неверный пароль";
    }
    console.log("all right")
    return { message: "Вход выполнен успешно!", user };
  } catch (error) {
    throw error || "Ошибка входа";
  }
};
