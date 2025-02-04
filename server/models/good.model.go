package models

type Good struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Price    int    `json:"price"`
	Image    string `json:"image"`
	Category string `json:"category"`
}