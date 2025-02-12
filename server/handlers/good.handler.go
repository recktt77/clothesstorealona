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
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetLastGoodID() (int, error) {
	var lastGood models.Good

	opts := options.FindOne().SetSort(bson.M{"id": -1})
	err := goodsCollection.FindOne(context.TODO(), bson.M{}, opts).Decode(&lastGood)

	if err == mongo.ErrNoDocuments {
		return 0, nil
	}
	if err != nil {
		return 0, err
	}

	return lastGood.Id, nil
}

func GetAllGoods(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cursor, err := goodsCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var goods []models.Good
	for cursor.Next(context.TODO()) {
		var good models.Good
		if err := cursor.Decode(&good); err != nil {
			http.Error(w, `{"error": "Error decoding good"}`, http.StatusInternalServerError)
			return
		}
		goods = append(goods, good)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(goods)
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

	lastID, err := GetLastGoodID()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	good.Id = lastID + 1
	_, err = goodsCollection.InsertOne(context.TODO(), good)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

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

	filter := bson.M{"id": id}
	var good models.Good
	err = goodsCollection.FindOne(context.TODO(), filter).Decode(&good)
	if err == mongo.ErrNoDocuments {
		http.Error(w, `{"error": "Good not found"}`, http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	var updatedData struct {
		Title    string `json:"title"`
		Price    int    `json:"price"`
		Image    string `json:"image"`
		Category string `json:"category"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updatedData); err != nil {
		http.Error(w, `{"error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	// Обновляем данные в MongoDB
	update := bson.M{"$set": bson.M{
		"title":    updatedData.Title,
		"price":    updatedData.Price,
		"image":    updatedData.Image,
		"category": updatedData.Category,
	}}

	_, err = goodsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, `{"error": "Database update error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Good updated successfully"})

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

	filter := bson.M{"id": id}

	result, err := goodsCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, `{"error": "Good not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Good deleted successfully"})

}
