package models

import "time"

type Invoice struct {
    ID           int       `db:"id" json:"id"`
    CustomerName string    `db:"customer_name" json:"customer_name"`
    CreatedAt    time.Time `db:"created_at" json:"created_at"`
    Total        float64   `db:"total" json:"total"`
}

type InvoiceItem struct {
    ID        int     `db:"id" json:"id"`
    InvoiceID int     `db:"invoice_id" json:"invoice_id"`
    ItemID    int     `db:"item_id" json:"item_id"`
    Quantity  int     `db:"quantity" json:"quantity"`
    Subtotal  float64 `db:"subtotal" json:"subtotal"`
}

type Item struct {
    ID    int     `db:"id" json:"id"`
    Name  string  `db:"name" json:"name"`
    Price float64 `db:"price" json:"price"`
    Type  string  `db:"type" json:"type"`
}

type CreateInvoiceRequest struct {
    CustomerName string `json:"customer_name"`
    Items        []struct {
        ItemID   int `json:"item_id"`
        Quantity int `json:"quantity"`
    } `json:"items"`
}
