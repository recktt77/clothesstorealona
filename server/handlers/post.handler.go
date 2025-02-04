package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/recktt77/clothesstorealona/models"
)

var (
	posts      = make(map[int]models.Post)
	nextPostId = 1
)

func GetAllPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	postsList := make([]models.Post, 0, len(posts))
	for _, post := range posts {
		postsList = append(postsList, post)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(postsList)
}

func AddPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var post models.Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		fmt.Println("error of decoding JSON:", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	fmt.Printf("getting data: %+v\n", post)

	if post.Title == "" || post.Link == "" || post.Body == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	post.Id = nextPostId
	nextPostId++
	posts[post.Id] = post

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(post)
}

func UpdatePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	existingPost, exists := posts[id]
	if !exists {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	var updatedPost models.Post
	if err := json.NewDecoder(r.Body).Decode(&updatedPost); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	updatedPost.Id = existingPost.Id

	posts[id] = updatedPost

	fmt.Println("Post updated successfully:", updatedPost)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedPost)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	if _, exists := posts[id]; !exists {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	delete(posts, id)

	fmt.Println("Post deleted successfully with ID:", id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Post deleted"})
}
