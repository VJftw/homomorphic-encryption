package controllers

import "github.com/gorilla/mux"

// Controller - defines methods that all controllers should have
type Controller interface {
	AddRoutes(mux.Router)
}
