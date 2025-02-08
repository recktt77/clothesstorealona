package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
)

func AddToCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		UserId int `json:"userId"`
		GoodId int `json:"goodId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, exists := users[req.UserId]
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	_, exists = goods[req.GoodId]
	if !exists {
		http.Error(w, "Good not found", http.StatusNotFound)
		return
	}

	user.Cart = append(user.Cart, req.GoodId)
	users[req.UserId] = user

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Added to cart"})
}

func GetCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userId, err := strconv.Atoi(r.URL.Query().Get("userId"))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user, exists := users[userId]
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	cartItems := []models.Good{}
	for _, id := range user.Cart {
		if good, found := goods[id]; found {
			cartItems = append(cartItems, good)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cartItems)
}

func RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	goodId, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	userId, err := strconv.Atoi(r.URL.Query().Get("userId"))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user, exists := users[userId]
	if !exists {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	newCart := []int{}
	for _, id := range user.Cart {
		if id != goodId {
			newCart = append(newCart, id)
		}
	}

	user.Cart = newCart
	users[userId] = user

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Removed from cart"})
}
