package controllers

import (
    "net/http"
    "pizzahub-server/database"
    "pizzahub-server/models"

    "github.com/gin-gonic/gin"
)

// Request struct for creating invoice with nested items
type CreateInvoiceRequest struct {
    CustomerName string `json:"customer_name"`
    Items        []struct {
        ItemID   int `json:"item_id"`
        Quantity int `json:"quantity"`
    } `json:"items"`
}

// Handler to create an invoice with items and calculate totals + tax
func CreateInvoice(c *gin.Context) {
    var req CreateInvoiceRequest

    // Bind incoming JSON payload
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    tx := database.DB.MustBegin() // Begin a transaction

    // Insert invoice with initial total 0
    var insertedInvoiceID int
    err := tx.QueryRow(
        "INSERT INTO invoices (customer_name, total) VALUES ($1, $2) RETURNING id",
        req.CustomerName,
        0,
    ).Scan(&insertedInvoiceID)
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create invoice"})
        return
    }

    total := 0.0

    // Loop through each invoice item, insert, and calculate subtotal
    for _, item := range req.Items {
        var price float64
        err := tx.Get(&price, "SELECT price FROM items WHERE id = $1", item.ItemID)
        if err != nil {
            tx.Rollback()
            c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
            return
        }
        subtotal := price * float64(item.Quantity)
        total += subtotal

        _, err = tx.Exec(
            "INSERT INTO invoice_items (invoice_id, item_id, quantity, subtotal) VALUES ($1, $2, $3, $4)",
            insertedInvoiceID, item.ItemID, item.Quantity, subtotal,
        )
        if err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert invoice items"})
            return
        }
    }

    // Apply 10% tax
    tax := total * 0.1
    grandTotal := total + tax

    // Update invoice total with grandTotal
    _, err = tx.Exec(
        "UPDATE invoices SET total = $1 WHERE id = $2",
        grandTotal,
        insertedInvoiceID,
    )
    if err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update invoice total"})
        return
    }

    // Commit transaction
    err = tx.Commit()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message":    "Invoice created successfully",
        "invoice_id": insertedInvoiceID,
        "subtotal":   total,
        "tax":        tax,
        "total":      grandTotal,
    })
}

// Handler to get all invoices ordered by created date descending
func GetInvoices(c *gin.Context) {
    var invoices []models.Invoice

    err := database.DB.Select(&invoices, "SELECT * FROM invoices ORDER BY created_at DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoices"})
        return
    }

    c.JSON(http.StatusOK, invoices)
}

// Handler to get details of one invoice including items with quantity & subtotal
func GetInvoiceDetails(c *gin.Context) {
    id := c.Param("id")

    var invoice models.Invoice
    err := database.DB.Get(&invoice, "SELECT * FROM invoices WHERE id = $1", id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Invoice not found"})
        return
    }

    var items []struct {
        models.Item
        Quantity int     `db:"quantity" json:"quantity"`
        Subtotal float64 `db:"subtotal" json:"subtotal"`
    }

    err = database.DB.Select(&items, `
        SELECT i.*, ii.quantity, ii.subtotal
        FROM items i
        JOIN invoice_items ii ON i.id = ii.item_id
        WHERE ii.invoice_id = $1
    `, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch invoice items"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "invoice": invoice,
        "items":   items,
    })
}
