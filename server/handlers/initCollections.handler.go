package handlers

import (
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection
var goodsCollection *mongo.Collection
var postsCollection *mongo.Collection
var cartCollection *mongo.Collection

// Функция для передачи коллекций из main.go
func InitCollections(userCol *mongo.Collection, goodCol *mongo.Collection, postCol *mongo.Collection, cartCol *mongo.Collection) {
	collection = userCol
	goodsCollection = goodCol
	postsCollection = postCol
	cartCollection = cartCol
}
