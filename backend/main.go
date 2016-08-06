package main

import (
	"log"
	"net/http"

	"github.com/facebookgo/inject"
)

type HomomorphicEncryptionBackendApp struct {
	Router *Router `inject:""`
}

func initApp() HomomorphicEncryptionBackendApp {

	var app HomomorphicEncryptionBackendApp

	inject.Populate(&app)

	app.Router.init()

	return app
}

// AppEngine - For use in Google AppEngine
func AppEngine() {
	app := initApp()

	http.Handle("/", app.Router.GetRouter())
}

func main() {
	app := initApp()
	log.Fatal(http.ListenAndServe(":8080", app.Router.GetRouter()))
}
