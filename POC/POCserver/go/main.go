package main

import (
	"net/http"
	"github.com/gorilla/mux"
	"Poc/handlers"
	"Poc/models"
)

func main() {
	r := mux.NewRouter()

	todoList := []models.Todo{
		{ID: 1, Title: "How to cook", Author: "Kevin Poly", Data: "Cooking is fun"},
		{ID: 2, Title: "Top 4 Ye", Author: "Kanye West", Data: "1. Life of the Party 2. Roses 3. God Is 4. Ghost Town"},
	}

	r.HandleFunc("/todos", handlers.GetTodos(&todoList)).Methods("GET")
	r.HandleFunc("/todos/{id}", handlers.GetTodo(&todoList)).Methods("GET")
	r.HandleFunc("/todos", handlers.CreateTodo(&todoList)).Methods("POST")
	r.HandleFunc("/todos/{id}", handlers.UpdateTodo(&todoList)).Methods("PUT")
	r.HandleFunc("/todos/{id}", handlers.DeleteTodo(&todoList)).Methods("DELETE")

	http.ListenAndServe(":9090", r)
}
