package models

type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Number   string `json:"number"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
}


type Good struct {
	Id int `json:"id"`
	Title string `json:"title"`
	Price int `json:"price"`
	Image string `json:"image"`
	Category string `json:"category"`
}