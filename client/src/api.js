import axios from "axios";

const API_URL = "http://localhost:4000";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.data.user) {
      throw new Error("Invalid login response");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};


export const isAdmin = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/is-admin?email=${email}`, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Admin status:", response.data);
    return response.data.isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error checking admin status");
  }
};




export const getAllGoods = async () => {
  return axios.get(`${API_URL}/goods`);
};

export const addGood = async (goodData) => {
  return axios.post(`${API_URL}/goods`, goodData, {
    headers: { "Content-Type": "application/json" }, 
  });
};


export const updateGood = async (goodId, updatedData) => {
  return axios.put(`${API_URL}/goods/${goodId}`, updatedData);
};

export const deleteGood = async (goodId) => {
  return axios.delete(`${API_URL}/goods/${goodId}`);
};



//TODO

export const listOfUsersForAdmin = async (adminEmail) => {
  try {
    const response = await axios.get(`http://localhost:4000/users?email=${adminEmail}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("iou: ", response.data)
    return response.data;
  } catch (error) {
    console.error("Error in listing users:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error in listing the users");
  }
};


export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка добавления пользователя");
  }
};

export const updateUser = async (userEmail, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userEmail}`, updatedData);
    console.log("Update data: ", response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка обновления пользователя");
  }
};

export const deleteUser = async (userEmail) => {
  try {
    await axios.delete(`${API_URL}/users/${userEmail}`);
    return { message: "Пользователь удален" };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка удаления пользователя");
  }
};


const API_URL_POSTS = "http://localhost:3000/posts";



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