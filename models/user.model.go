package models

type User struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Number   string `json:"number"`
	Password string `json:"password"`
	// IsAdmin  bool   `json:"isAdmin"`
}
