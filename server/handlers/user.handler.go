package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
)

var (
	users      = make(map[int]models.User)
	nextId     = 1
	goods      = make(map[int]models.Good)
	nextGoodID = 1
)

func UserRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}
	var user models.User

	if existingUser, _ := findUserByIdentifier(user.Email); existingUser != nil {
		fmt.Println("User with this email already exists")
		http.Error(w, "User with this email already exists", http.StatusConflict)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Println("Bad request")
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	user.Id = nextId
	if nextId == 1 {
		user.IsAdmin = true
	}
	nextId++
	users[user.Id] = user

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"msg": "You are registered succesfully"})
}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		fmt.Println("Login: Method not allowed")
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Identifier string `json:"identifier"` // Email или Number
		Password   string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Println("Login: Bad request")
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, err := findUserByIdentifier(req.Identifier)
	if err != nil {
		fmt.Println("Login: Invalid email/number")
		http.Error(w, "Invalid email/number", http.StatusUnauthorized)
		return
	}

	if user.Password != req.Password {
		fmt.Println("Login: Invalid password")
		http.Error(w, "Invalid email/number or password", http.StatusUnauthorized)
		return
	}
	fmt.Println("Login: You are logged in succesfully")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"msg":  "You are logged in succesfully",
		"user": user,
	})

}

func findUserByIdentifier(identifier string) (*models.User, error) {
	for _, user := range users {
		if user.Email == identifier || user.Number == identifier {
			fmt.Println("findUserByIdentifier: User found")
			return &user, nil
		}
	}
	fmt.Println("findUserByIdentifier: User not found")
	return nil, errors.New("user not found")
}

func CheckAdminStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, `{"error": "Email is required"}`, http.StatusBadRequest)
		return
	}

	user, err := findUserByIdentifier(email)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"isAdmin": user.IsAdmin})
}

func getAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, `{"error": "Email is required"}`, http.StatusBadRequest)
		return
	}

	// Проверяем, является ли пользователь администратором
	user, err := findUserByIdentifier(email)
	if err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	if !user.IsAdmin {
		http.Error(w, `{"error": "Access denied"}`, http.StatusForbidden)
		return
	}

	// Получаем список всех пользователей

	userList := make([]models.User, 0, len(users))
	for _, u := range users {
		userList = append(userList, u)
	}

	// Отправляем JSON-ответ с пользователями
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userList)

}

func GetAllGoods(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	goodsList := make([]models.Good, 0, len(goods))
	for _, good := range goods {
		goodsList = append(goodsList, good)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(goodsList)
}

func AddGood(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var good models.Good
	err := json.NewDecoder(r.Body).Decode(&good)
	if err != nil {
		fmt.Println("error of decoding JSON:", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	fmt.Printf("getting data: %+v\n", good)

	if good.Title == "" || good.Price <= 0 || good.Image == "" || good.Category == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	good.Id = nextGoodID
	nextGoodID++
	goods[good.Id] = good

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(good)
}

func UpdateGood(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	existingGood, exists := goods[id]
	if !exists {
		http.Error(w, "Good not found", http.StatusNotFound)
		return
	}

	var updatedGood models.Good
	if err := json.NewDecoder(r.Body).Decode(&updatedGood); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	updatedGood.Id = existingGood.Id

	goods[id] = updatedGood

	fmt.Println("Good updated successfully:", updatedGood)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedGood)
}

func DeleteGood(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	if _, exists := goods[id]; !exists {
		http.Error(w, "Good not found", http.StatusNotFound)
		return
	}

	delete(goods, id)

	fmt.Println("Good deleted successfully with ID:", id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Good deleted"})
}
