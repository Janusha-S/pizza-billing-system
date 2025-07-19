package models

type Item struct {
    ID    int     `db:"id" json:"id"`
    Name  string  `db:"name" json:"name"`
    Price float64 `db:"price" json:"price"`
    Type  string  `db:"type" json:"type"`
}
