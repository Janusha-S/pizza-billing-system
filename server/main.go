package main

import (
    "pizzahub-server/database"
    "pizzahub-server/routes"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "time"
)

func main() {
    database.Connect()

    router := gin.Default()

    // Configure CORS for your frontend origin
    router.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, // your React app URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))

    routes.SetupRoutes(router)

    router.Run(":8080")
}
