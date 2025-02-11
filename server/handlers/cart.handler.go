package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddToCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		UserEmail string `json:"userEmail"`
		GoodId    int    `json:"goodId"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	// Найти пользователя по email
	var user models.User
	fmt.Println(req.UserEmail)
	err := collection.FindOne(context.TODO(), bson.M{"email": req.UserEmail}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Проверить, существует ли товар
	var good models.Good
	err = goodsCollection.FindOne(context.TODO(), bson.M{"id": req.GoodId}).Decode(&good)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "Good not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Проверить, есть ли уже этот товар в корзине
	existingFilter := bson.M{"userEmail": user.Email, "goodId": req.GoodId}
	count, _ := cartCollection.CountDocuments(context.TODO(), existingFilter)
	if count > 0 {
		http.Error(w, "Item already in cart", http.StatusConflict)
		return
	}

	// Добавить товар в корзину
	_, err = cartCollection.InsertOne(context.TODO(), bson.M{"userEmail": user.Email, "goodId": req.GoodId})
	if err != nil {
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		return
	}
	fmt.Println("Added to cart")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Added to cart"})
}

func GetCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userEmail := r.URL.Query().Get("userEmail")
	if userEmail == "" {
		http.Error(w, "User email is required", http.StatusBadRequest)
		return
	}

	// Ищем пользователя по email
	var user models.User
	filter := bson.M{"email": userEmail}
	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Получаем товары из корзины пользователя
	cartFilter := bson.M{"userId": user.Id}
	cursor, err := cartCollection.Find(context.TODO(), cartFilter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var cartItems []models.Cart
	if err := cursor.All(context.TODO(), &cartItems); err != nil {
		http.Error(w, "Error decoding cart items", http.StatusInternalServerError)
		return
	}

	// Получаем детали товаров
	var goods []models.Good
	for _, item := range cartItems {
		var good models.Good
		if err := goodsCollection.FindOne(context.TODO(), bson.M{"id": item.GoodId}).Decode(&good); err == nil {
			goods = append(goods, good)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(goods)
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

	// Удаляем товар из корзины
	filter := bson.M{"userId": userId, "goodId": goodId}
	result, err := cartCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Item not found in cart", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Removed from cart"})
}
