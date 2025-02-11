package models

type Cart struct {
	UserId int `bson:"userId"`
	GoodId int `bson:"goodId"`
}
