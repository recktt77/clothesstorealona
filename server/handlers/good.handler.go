package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
)

var (
	goods      = make(map[int]models.Good)
	nextGoodID = 1
)

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
