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

    const { user } = response.data;
    localStorage.setItem("userId", user.id);  // Сохраняем userId
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("isAdmin", user.isAdmin ? "true" : "false");

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


const API_URL_POSTS = "http://localhost:4000/posts";



export const getUserPosts = async (userId) => {
  userId = parseInt(userId); // 👈 Приводим userId к числу

  if (isNaN(userId)) {
      console.error("Ошибка: userId невалиден!", userId);
      throw new Error("Invalid user ID");
  }

  try {
      const response = await axios.get(`${API_URL}/user-posts?userId=${userId}`, {
          headers: { "Content-Type": "application/json" },
      });
      return response.data;
  } catch (error) {
      console.error("Ошибка получения постов пользователя:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Ошибка получения постов пользователя");
  }
};


export const addPost = async (userId, postData) => {
  userId = parseInt(userId);
  try {
      const response = await axios.post(`${API_URL}/posts`, { userId, ...postData }, {
          headers: { "Content-Type": "application/json" },
      });
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || "Ошибка добавления поста");
  }
};



export const getAllPosts = async () => {
  try {
    const response = await axios.get(API_URL_POSTS);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка получения постов");
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





export const addToCart = async (userId, goodId) => {
  userId = parseInt(userId);
  console.log("Отправка в API /cart/add:", { userId, goodId });
  try {
      const response = await axios.post(`${API_URL}/cart/add`, { userId, goodId }, {
          headers: { "Content-Type": "application/json" },
      });
      console.log("Cart added to basket:", response.data);
      return response.data;
  } catch (error) {
      console.error("error while adding:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "error while adding");
  }
};



export const getCart = async (userId) => {
  try {
      const response = await axios.get(`${API_URL}/cart?userId=${userId}`, {
          headers: { "Content-Type": "application/json" },
      });
      return response.data;
  } catch (error) {
      console.error("error while getting basket:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "error while etting basket");
  }
};

export const removeFromCart = async (userId, goodId) => {
  try {
      await axios.delete(`${API_URL}/cart/${goodId}?userId=${userId}`);
      console.log("good removed");
      return { message: "removed" };
  } catch (error) {
      console.error("error while deleteing good:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "error while deleting goods");
  }
};
