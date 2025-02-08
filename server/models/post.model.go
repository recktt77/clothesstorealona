package models

type Post struct {
	Id    int    `json:"id"`
	UserId int    `json:"userId"`
	Title string `json:"title"`
	Link  string `json:"link"`
	Body  string `json:"body"`
	Likes int    `json:"likes"`
}
