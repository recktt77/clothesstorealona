package models

type User struct {
	Id       int    `bson:"id"`
	Email    string `bson:"email"`
	Number   string `bson:"number"`
	Password string `bson:"password"`
	IsAdmin  bool   `bson:"isAdmin"`
	Cart     []int  `bson:"cart"`
}
