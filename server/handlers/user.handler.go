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
)

func UserRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}
	var user models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		fmt.Println("Bad request")
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	if existingUser, _ := findUserByIdentifier(user.Email); existingUser != nil {
		fmt.Println("User with this email already exists: ", user.Email)
		http.Error(w, "User with this email already exists", http.StatusConflict)
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

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userList := make([]models.User, 0, len(users))
	for _, u := range users {
		userList = append(userList, u)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userList)

}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// Извлекаем ID из URL
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, `{"error": "Invalid request path"}`, http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, `{"error": "Invalid user ID"}`, http.StatusBadRequest)
		return
	}

	user, exists := users[id]

	if !exists {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	// Декодируем тело запроса
	var updatedData struct {
		Email   string `json:"email"`
		Number  string `json:"number"`
		IsAdmin bool   `json:"isAdmin"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updatedData); err != nil {
		http.Error(w, `{"error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	user.Email = updatedData.Email
	user.Number = updatedData.Number
	user.IsAdmin = updatedData.IsAdmin
	users[id] = user

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 || pathParts[2] == "" {
		http.Error(w, `{"error": "Invalid request path"}`, http.StatusBadRequest)
		return
	}

	email := pathParts[2]

	deleted := false
	for id, user := range users {
		if user.Email == email {
			delete(users, id)
			deleted = true
			break
		}
	}

	if !deleted {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
}
