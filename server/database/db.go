package database

import (
    "log"

    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq"
)

var DB *sqlx.DB

func Connect() {
    var err error
    dsn := "user=postgres password=Janu20sha dbname=pizza_shop sslmode=disable"
    DB, err = sqlx.Connect("postgres", dsn)
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }
    log.Println("Database connected successfully")
}
