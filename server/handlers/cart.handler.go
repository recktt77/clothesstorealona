package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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

	ctx := r.Context()

	var user models.User
	err := collection.FindOne(ctx, bson.M{"email": req.UserEmail}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	var good models.Good
	err = goodsCollection.FindOne(ctx, bson.M{"id": req.GoodId}).Decode(&good)
	if err == mongo.ErrNoDocuments {
		log.Println("Ошибка: товар не найден. ID:", req.GoodId)
		http.Error(w, "Good not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}


	existingFilter := bson.M{"userEmail": req.UserEmail, "goodId": req.GoodId}
	count, err := cartCollection.CountDocuments(ctx, existingFilter)
	if err != nil {
		log.Println("CountDocuments error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if count > 0 {
		update := bson.M{"$inc": bson.M{"quantity": 1}}
		_, err := cartCollection.UpdateOne(ctx, existingFilter, update)
		if err != nil {
			log.Println("UpdateOne error:", err)
			http.Error(w, "Database update error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Updated item quantity in cart"})
		return
	}
	

	_, err = cartCollection.InsertOne(ctx, bson.M{"userEmail": req.UserEmail, "goodId": req.GoodId, "quantity": 1})
	if err != nil {
		log.Println("InsertOne error:", err)
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		return
	}

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

	fmt.Println("Получение корзины для:", userEmail)

	cartFilter := bson.M{"userEmail": userEmail}
	cursor, err := cartCollection.Find(context.TODO(), cartFilter)
	if err != nil {
		log.Println("Ошибка получения корзины:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var cartItems []models.Cart
	if err := cursor.All(context.TODO(), &cartItems); err != nil {
		log.Println("Ошибка декодирования корзины:", err)
		http.Error(w, "Error decoding cart items", http.StatusInternalServerError)
		return
	}

	if len(cartItems) == 0 {
		fmt.Println("Корзина пуста")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]models.Good{})
		return
	}

	var itemsWithDetails []map[string]interface{}
	for _, item := range cartItems {
		var good models.Good
		if err := goodsCollection.FindOne(context.TODO(), bson.M{"id": item.GoodId}).Decode(&good); err == nil {
			itemData := map[string]interface{}{
				"id":       good.Id,
				"title":    good.Title,
				"price":    good.Price,
				"image":    good.Image,
				"quantity": item.Quantity,
			}
			itemsWithDetails = append(itemsWithDetails, itemData)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(itemsWithDetails)
}


func RemoveFromCart(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	vars := mux.Vars(r)
	goodId, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}


	userEmail := r.URL.Query().Get("userEmail")
	if userEmail == "" {
		http.Error(w, "User email is required", http.StatusBadRequest)
		return
	}

	filter := bson.M{"userEmail": userEmail, "goodId": goodId}
	var cartItem models.Cart
	err = cartCollection.FindOne(context.TODO(), filter).Decode(&cartItem)
	if err == mongo.ErrNoDocuments {
		http.Error(w, "Item not found in cart", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if cartItem.Quantity > 1 {
		update := bson.M{"$inc": bson.M{"quantity": -1}}
		_, err := cartCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			http.Error(w, "Database update error", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Reduced quantity in cart"})
		return
	}

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

func ProcessPurchase(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return;
	}

	var req struct {
		UserEmail string `json:"userEmail"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	filter := bson.M{"userEmail": req.UserEmail}
	_, err := cartCollection.DeleteMany(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Purchase completed successfully",
	})
}
