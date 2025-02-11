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

func GetLastUserID() (int, error) {
	var lastUser models.User

	// Находим пользователя с самым большим `id`
	opts := options.FindOne().SetSort(bson.M{"id": -1})
	err := collection.FindOne(context.TODO(), bson.M{}, opts).Decode(&lastUser)

	if err == mongo.ErrNoDocuments {
		return 0, nil // Если коллекция пустая, возвращаем 0
	}
	if err != nil {
		return 0, err // Ошибка запроса
	}

	return lastUser.Id, nil // Возвращаем последний `id`
}

func UserRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed!", http.StatusMethodNotAllowed)
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	// Проверяем, существует ли пользователь по Email или Number
	if existingUser, _ := findUserByIdentifier(user.Email); existingUser != nil {
		http.Error(w, "User with this email already exists", http.StatusConflict)
		return
	}
	if existingUser, _ := findUserByIdentifier(user.Number); existingUser != nil {
		http.Error(w, "User with this phone number already exists", http.StatusConflict)
		return
	}

	lastID, err := GetLastUserID()
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	user.Id = lastID + 1

	// Назначаем администратора, если это первый пользователь
	count, err := collection.CountDocuments(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if count == 0 {
		user.IsAdmin = true
	}

	// Вставляем пользователя в MongoDB
	_, err = collection.InsertOne(context.TODO(), user)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"msg": "You are registered successfully"})
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
	if err != nil || user == nil {
		http.Error(w, "Invalid email/number", http.StatusUnauthorized)
		return
	}

	if user.Password != req.Password {
		http.Error(w, "Invalid email/number or password", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"msg":  "You are logged in successfully",
		"user": user,
	})
}

func findUserByIdentifier(identifier string) (*models.User, error) {
	var user models.User

	filter := bson.M{
		"$or": []bson.M{
			{"email": identifier},
			{"number": identifier},
		},
	}

	err := collection.FindOne(context.TODO(), filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &user, nil
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
	if err != nil || user == nil {
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

	cursor, err := collection.Find(context.TODO(), bson.M{})
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.TODO())

	var users []models.User
	for cursor.Next(context.TODO()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			http.Error(w, `{"error": "Error decoding user"}`, http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
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

	filter := bson.M{"id": id}
	var user models.User
	err = collection.FindOne(context.TODO(), filter).Decode(&user)
	if err == mongo.ErrNoDocuments {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
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

	// Обновляем данные в MongoDB
	update := bson.M{"$set": bson.M{
		"email":   updatedData.Email,
		"number":  updatedData.Number,
		"isAdmin": updatedData.IsAdmin,
	}}

	_, err = collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		http.Error(w, `{"error": "Database update error"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User updated successfully"})
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// Извлекаем email из пути (например, /users/{email})
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 || pathParts[2] == "" {
		http.Error(w, `{"error": "Invalid request path"}`, http.StatusBadRequest)
		return
	}

	email := pathParts[2]

	filter := bson.M{"email": email}

	// Удаляем пользователя из MongoDB
	result, err := collection.DeleteOne(context.TODO(), filter)
	if err != nil {
		http.Error(w, `{"error": "Database error"}`, http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, `{"error": "User not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User deleted successfully"})
}
