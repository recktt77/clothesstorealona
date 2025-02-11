package models

type Good struct {
	Id       int    `bson:"id"`
	Title    string `bson:"title"`
	Price    int    `bson:"price"`
	Image    string `bson:"image"`
	Category string `bson:"category"`
}
