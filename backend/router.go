package main

import (
    "github.com/gorilla/mux",
    "github.com/vjftw/homomorphic-encryption/backend/controllers"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter()

	AddComputationRoutes(router)

	return router
}
