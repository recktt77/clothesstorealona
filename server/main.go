package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/recktt77/clothesstorealona/handlers"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
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

	if err := http.ListenAndServe(":4000", r); err != nil {
		panic(err)
	}
}
