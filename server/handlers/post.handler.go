package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetLastPostID() (int, error) {
	var lastPost models.Post

	// Находим пользователя с самым большим `id`
	opts := options.FindOne().SetSort(bson.M{"id": -1})
	err := postsCollection.FindOne(context.TODO(), bson.M{}, opts).Decode(&lastPost)

	if err == mongo.ErrNoDocuments {
		return 0, nil // Если коллекция пустая, возвращаем 0
	}
	if err != nil {
		return 0, err // Ошибка запроса
	}

	return lastPost.Id, nil // Возвращаем последний `id`
}

func GetAllPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	cursor, err := postsCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var posts []models.Post
	for cursor.Next(context.TODO()) {
		var post models.Post
		if err := cursor.Decode(&post); err != nil {
			http.Error(w, "Error decoding post", http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func AddPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var post models.Post
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	if post.Title == "" || post.Link == "" || post.Body == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	lastID, err := GetLastPostID()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	post.Id = lastID + 1

	_, err = postsCollection.InsertOne(context.TODO(), post)
	if err != nil {
		http.Error(w, "Database insert error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
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
	var post models.Post
	err = postsCollection.FindOne(context.TODO(), filter).Decode(&post)
	if err == mongo.ErrNoDocuments {
		http.Error(w, `{"error": "Post not found"}`, http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	var updatedData struct {
		Title string `json:"title"`
		Link  string `json:"link"`
		Body  string `json:"body"`
		Likes int    `json:"likes"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updatedData); err != nil {
		http.Error(w, `{"error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	update := bson.M{"$set": bson.M{
		"title": updatedData.Title,
		"link":  updatedData.Link,
		"body":  updatedData.Body,
		"likes": updatedData.Likes,
	}}

	_, err = postsCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, `{"error": "Database update error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Post updated successfully"})

}

func DeletePost(w http.ResponseWriter, r *http.Request) {
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
	result, err := postsCollection.DeleteOne(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Post deleted"})
}

func GetUserPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userEmail := r.URL.Query().Get("userEmail")
	if userEmail == "" {
		http.Error(w, "User email is required", http.StatusBadRequest)
		return
	}

	filter := bson.M{"useremail": userEmail}
	cursor, err := postsCollection.Find(context.TODO(), filter)

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var userPosts []models.Post
	for cursor.Next(context.TODO()) {
		var post models.Post
		if err := cursor.Decode(&post); err != nil {
			http.Error(w, "Error decoding post", http.StatusInternalServerError)
			return
		}
		userPosts = append(userPosts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userPosts)
}
