package models

type Post struct {
	Id        int    `json:"id"`
	UserEmail string `json:"userEmail"`
	Title     string `json:"title"`
	Link      string `json:"link"`
	Body      string `json:"body"`
	Likes     int    `json:"likes"`
	LikedBy   []int  `json:"likedBy"`
}
