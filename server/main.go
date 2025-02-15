package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/recktt77/clothesstorealona/handlers"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "3600")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
		return
	}

	database_uri := os.Getenv("MONGO_URI")
	clientOptions := options.Client().ApplyURI(database_uri)
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal("Ошибка подключения:", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Ошибка пинга:", err)
	}

	collection := client.Database("Alona").Collection("users")
	goodsCollection := client.Database("Alona").Collection("goods")
	postsCollection := client.Database("Alona").Collection("posts")
	cartCollection := client.Database("Alona").Collection("cart")

	handlers.InitCollections(collection, goodsCollection, postsCollection, cartCollection)

	fmt.Println("Успешное подключение к MongoDB Atlas!")

	r := mux.NewRouter()

	r.Use(corsMiddleware)

	r.HandleFunc("/users", handlers.GetAllUsers).Methods("GET", "OPTIONS")
	r.HandleFunc("/users/{id}", handlers.UpdateUser).Methods("PUT", "OPTIONS")
	r.HandleFunc("/users/{email}", handlers.DeleteUser).Methods("DELETE", "OPTIONS")

	r.HandleFunc("/register", handlers.UserRegister).Methods("POST", "OPTIONS")
	r.HandleFunc("/login", handlers.UserLogin).Methods("POST", "OPTIONS")
	r.HandleFunc("/is-admin", handlers.CheckAdminStatus).Methods("GET", "OPTIONS")

	r.HandleFunc("/goods", handlers.GetAllGoods).Methods("GET", "OPTIONS")
	r.HandleFunc("/goods", handlers.AddGood).Methods("POST", "OPTIONS")
	r.HandleFunc("/goods/{id}", handlers.UpdateGood).Methods("PUT", "OPTIONS")
	r.HandleFunc("/goods/{id}", handlers.DeleteGood).Methods("DELETE", "OPTIONS")

	r.HandleFunc("/posts", handlers.GetAllPosts).Methods("GET", "OPTIONS")
	r.HandleFunc("/posts", handlers.AddPost).Methods("POST", "OPTIONS")
	r.HandleFunc("/posts/{id}", handlers.GetPost).Methods("GET", "OPTIONS")
	r.HandleFunc("/posts/{id}", handlers.UpdatePost).Methods("PUT", "OPTIONS")
	r.HandleFunc("/posts/{id}", handlers.DeletePost).Methods("DELETE", "OPTIONS")
	r.HandleFunc("/posts/{id}", handlers.PostLike).Methods("POST", "OPTIONS")
	r.HandleFunc("/user-posts", handlers.GetUserPosts).Methods("GET", "OPTIONS")

	r.HandleFunc("/cart/add", handlers.AddToCart).Methods("POST", "OPTIONS")
	r.HandleFunc("/cart", handlers.GetCart).Methods("GET", "OPTIONS")
	r.HandleFunc("/cart/{id}", handlers.RemoveFromCart).Methods("DELETE", "OPTIONS")

	r.HandleFunc("/purchase", handlers.ProcessPurchase).Methods("POST", "OPTIONS")

	if err := http.ListenAndServe(":4000", r); err != nil {
		panic(err)
	}
}
