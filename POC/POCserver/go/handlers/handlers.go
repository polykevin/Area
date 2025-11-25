package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"github.com/gorilla/mux"
	"Poc/models"
)

func GetTodos(list *[]models.Todo) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(*list)
    }
}

func GetTodo(list *[]models.Todo) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        params := mux.Vars(r)
        id, _ := strconv.Atoi(params["id"])

        for _, item := range *list {
            if item.ID == id {
                w.Header().Set("Content-Type", "application/json")
                json.NewEncoder(w).Encode(item)
                return
            }
        }
        http.NotFound(w, r)
    }
}

func CreateTodo(list *[]models.Todo) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var todo models.Todo
        _ = json.NewDecoder(r.Body).Decode(&todo)
        todo.ID = len(*list) + 1
        *list = append(*list, todo)

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(todo)
    }
}

func UpdateTodo(list *[]models.Todo) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        params := mux.Vars(r)
        id, _ := strconv.Atoi(params["id"])

        for i, item := range *list {
            if item.ID == id {
                var updated models.Todo
                _ = json.NewDecoder(r.Body).Decode(&updated)
                updated.ID = id
                (*list)[i] = updated

                w.Header().Set("Content-Type", "application/json")
                json.NewEncoder(w).Encode(updated)
                return
            }
        }
        http.NotFound(w, r)
    }
}

func DeleteTodo(list *[]models.Todo) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        params := mux.Vars(r)
        id, _ := strconv.Atoi(params["id"])

        for i, item := range *list {
            if item.ID == id {
                *list = append((*list)[:i], (*list)[i+1:]...)
                w.WriteHeader(http.StatusNoContent)
                return
            }
        }
        http.NotFound(w, r)
    }
}
