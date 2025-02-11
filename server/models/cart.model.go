package models

type Cart struct {
	UserEmail int `bson:"userEmail"`
	GoodId    int `bson:"goodId"`
}
