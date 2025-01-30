package main

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/recktt77/clothesstorealona/handlers"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/register", handlers.UserRegister).Methods("POST")
	r.HandleFunc("/login", handlers.UserLogin).Methods("POST")

	if err := http.ListenAndServe(":4000", r); err != nil {
		panic(err)
	}
}
