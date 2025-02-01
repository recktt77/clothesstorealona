package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/recktt77/clothesstorealona/models"
)

var (
	users  = make(map[int]models.User)
	nextId = 1
)

func UserRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}
	var user models.User

	if existingUser, _ := findUserByIdentifier(user.Email); existingUser != nil {
		http.Error(w, "User with this email already exists", http.StatusConflict)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	user.Id = nextId
	if nextId==1{
		user.IsAdmin=true
	}
	nextId++
	users[user.Id] = user


	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"msg": "You are registered succesfully"})
}

func UserLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Identifier string `json:"identifier"` // Email или Number
		Password   string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, err := findUserByIdentifier(req.Identifier)
	if err != nil {
		http.Error(w, "Invalid email/number", http.StatusUnauthorized)
		return
	}

	if user.Password != req.Password {
		http.Error(w, "Invalid email/number or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"msg": "You are logged in succesfully",
		"user": user, 
	})
	
}

func findUserByIdentifier(identifier string) (*models.User, error) {
	for _, user := range users {
		if user.Email == identifier || user.Number == identifier {
			return &user, nil
		}
	}
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
