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
    localStorage.setItem("userId", user.id);
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


export const getAllUsers = async () => {
  return axios.get(`${API_URL}/users`);
};

export const addUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const updateUser = async (userId, updatedData) => {
  console.log(userId, updatedData)
  return axios.put(`${API_URL}/users/${userId}`, updatedData, {
    headers: { "Content-Type": "application/json" },
  });
};

export const deleteUser = async (userId) => {
  return axios.delete(`${API_URL}/users/${userId}`);
};



const API_URL_POSTS = "http://localhost:4000/posts";



export const getAllPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка получения постов");
  }
};

export const getUserPosts = async (userEmail) => {
  if (!userEmail) throw new Error("Invalid user email");

  try {
    const response = await axios.get(`${API_URL}/user-posts?userEmail=${userEmail}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка получения постов пользователя");
  }
};

export const addPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.response?.data?.message || "Ошибка добавления поста");
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    console.log(updatedData)
    const response = await axios.put(`${API_URL}/posts/${postId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка обновления поста");
  }
};

export const deletePost = async (postId) => {
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
    return { message: "Пост удален" };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка удаления поста");
  }
};

export const likeLogic = async (userEmail, postId) => {
  postId = Number(postId);
  console.log(`Лайкаем пост: userEmail=${userEmail}, postId=${postId}`);

  try {
    const response = await axios.post(`${API_URL}/posts/${userEmail}`, { userEmail, postId }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка лайка поста:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка лайка поста");
  }
}

export const addToCart = async (userEmail, goodId) => {
  goodId = Number(goodId);
  console.log(`Добавление в корзину: userEmail=${userEmail}, goodId=${goodId}`);

  try {
    const response = await axios.post(`${API_URL}/cart/add`, { userEmail, goodId }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка добавления в корзину:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка добавления в корзину");
  }
};




export const getCart = async (userEmail) => {
  try {
    const response = await axios.get(`${API_URL}/cart?userEmail=${userEmail}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Ответ от сервера (корзина):", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка получения корзины:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка получения корзины");
  }
};


export const removeFromCart = async (userEmail, goodId) => {
  try {
    await axios.delete(`${API_URL}/cart/${goodId}?userEmail=${userEmail}`);
    return { message: "Товар удален из корзины" };
  } catch (error) {
    console.error("Ошибка удаления товара:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка удаления товара из корзины");
  }
};

export const processPurchase = async (userEmail) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const response = await axios.post(`${API_URL}/purchase`,
      { userEmail },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Purchase completed:", response.data);
      return response.data;
    } else {
      throw new Error("Purchase failed");
    }
  } catch (error) {
    console.error("Purchase error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Purchase failed");
  }
};

export const addPaymentMethod = async (userEmail, paymentMethod) => {
  console.log(`Добавление метода оплаты: userEmail=${userEmail}, paymentMethod=${paymentMethod}`);

  try {
    const response = await axios.post(`${API_URL}/payment/${userEmail}`, { paymentMethod }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Ответ от сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка добавления в метода оплаты:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка добавления метода оплаты");
  }
};

export const getPaymentMethod = async (userEmail) => {
  try {
    const response = await axios.get(`${API_URL}/payment/${userEmail}`, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Ответ от сервера (метод оплаты):", response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка получения метода оплаты:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка получения метода оплаты");
  }
};

export const deletePaymentMethod = async (userEmail) => {
  try {
    await axios.delete(`${API_URL}/payment/${userEmail}`, { userEmail });
    return { message: "Метод оплаты удален" };
  } catch (error) {
    console.error("Ошибка удаления метода оплаты:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка удаления метода оплаты");
  }
};
