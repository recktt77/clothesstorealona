package models

type Cart struct {
	UserEmail string `bson:"userEmail"`
	GoodId    int    `bson:"goodId"`
	Quantity  int    `bson:"quantity"`
}
