package routes

import (
    "github.com/gin-gonic/gin"
    "pizzahub-server/controllers"
)

func SetupRoutes(router *gin.Engine) {
    router.GET("/items", controllers.GetItems)
    router.POST("/items", controllers.AddItem)
    router.PUT("/items/:id", controllers.UpdateItem)
    router.DELETE("/items/:id", controllers.DeleteItem)

    router.POST("/invoices", controllers.CreateInvoice)
    router.GET("/invoices", controllers.GetInvoices)
    router.GET("/invoices/:id", controllers.GetInvoiceDetails)
}
