import axios from "axios";

const API_URL_Reg = "http://localhost:4000/register";
const API_URL_Log = "http://localhost:4000/login";

export const registerUser = async (userData) => {
  const userData1 ={
    ...userData,
    isAdmin: false
  }
  try {
    const response = await axios.post(`${API_URL_Reg}`, userData1);
    console.log("registered")
    return response.data;
  } catch (error) {
    throw error.response?.data || "error registartion";
  }
};



export const loginUser = async (userData) => {
  try {
    const response = await axios.post(API_URL_Log, userData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data || "Login failed");
  }
};


export const isAdmin = async (email) => {
  try {
    const response = await axios.get(`http://localhost:4000/is-admin?email=${email}`, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Admin status:", response.data);
    return response.data.isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error checking admin status");
  }
};


export const listOfUsersForAdmin = async (adminEmail) => {
  try {
    const response = await axios.get(`http://localhost:4000/users?email=${adminEmail}`, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Error in listing users:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error in listing the users");
  }
};


export const addUser = async (userData) => {
  try {
    const response = await axios.post(API_URL_Reg, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка добавления пользователя");
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL_Reg}/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка обновления пользователя");
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL_Reg}/${userId}`);
    return { message: "Пользователь удален" };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка удаления пользователя");
  }
};


const API_URL_GOODS = "http://localhost:3000/goods";
const API_URL_POSTS = "http://localhost:3000/posts";

export const getAllGoods = async () => {
  try {
    const response = await axios.get(API_URL_GOODS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка получения товаров");
  }
};

export const addGood = async (goodData) => {
  try {
    const response = await axios.post(API_URL_GOODS, goodData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка добавления товара");
  }
};

export const updateGood = async (goodId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL_GOODS}/${goodId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка обновления товара");
  }
};

export const deleteGood = async (goodId) => {
  try {
    await axios.delete(`${API_URL_GOODS}/${goodId}`);
    return { message: "Товар удален" };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка удаления товара");
  }
};

export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_URL_POSTS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка получения постов");
  }
};

export const addPost = async (postData) => {
  try {
    const response = await axios.post(API_URL_POSTS, postData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка добавления поста");
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL_POSTS}/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка обновления поста");
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_URL_POSTS}/${postId}`);
    return { message: "Пост удален" };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка удаления поста");
  }
};