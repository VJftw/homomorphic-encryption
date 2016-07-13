package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/justinas/alice"
	"github.com/rs/cors"
	"github.com/sebest/xff"
	"github.com/vjftw/homomorphic-encryption/backend/controllers"
)

type Router struct {
	ComputationController *controllers.ComputationController `inject:""`
	ComputeController     *controllers.ComputeController     `inject:""`
	router                http.Handler
}

func (r *Router) init() {
	router := mux.NewRouter()

	router.HandleFunc("/", handler)
	r.ComputationController.AddRoutes(router)
	r.ComputeController.AddRoutes(router)

	corsHandler := cors.Default()
	xffmw, _ := xff.Default()
	chain := alice.New(corsHandler.Handler, xffmw.Handler)

	r.router = chain.Then(router)
}

func (r *Router) GetRouter() http.Handler {
	return r.router
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, world!")
}
