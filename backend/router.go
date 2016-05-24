package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/justinas/alice"
	"github.com/rs/cors"
	"github.com/rs/formjson"
	"github.com/sebest/xff"
	"github.com/vjftw/homomorphic-encryption/backend/controllers"
)

func NewRouter() http.Handler {
	router := mux.NewRouter()

	router.HandleFunc("/", handler)
	controllers.AddComputationRoutes(router)

	corsHandler := cors.Default()
	xffmw, _ := xff.Default()
	chain := alice.New(corsHandler.Handler, xffmw.Handler, formjson.Handler)

	return chain.Then(router)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello, world!")
}
