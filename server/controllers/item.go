package controllers

import (
    "net/http"
    "pizzahub-server/database"
    "pizzahub-server/models"

    "github.com/gin-gonic/gin"
)

func GetItems(c *gin.Context) {
    var items []models.Item
    err := database.DB.Select(&items, "SELECT * FROM items")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
        return
    }
    c.JSON(http.StatusOK, items)
}

func AddItem(c *gin.Context) {
    var item models.Item
    if err := c.ShouldBindJSON(&item); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    _, err := database.DB.Exec("INSERT INTO items (name, price, type) VALUES ($1, $2, $3)", item.Name, item.Price, item.Type)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Item added"})
}
func UpdateItem(c *gin.Context) {
    id := c.Param("id")
    var item models.Item

    if err := c.ShouldBindJSON(&item); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    _, err := database.DB.Exec("UPDATE items SET name=$1, price=$2, type=$3 WHERE id=$4",
        item.Name, item.Price, item.Type, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Item updated"})
}
func DeleteItem(c *gin.Context) {
    id := c.Param("id")
    _, err := database.DB.Exec("DELETE FROM items WHERE id=$1", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Item deleted"})
}
