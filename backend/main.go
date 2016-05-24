package main

import (
	"net/http"

	"github.com/facebookgo/inject"
)

type HomomorphicEncryptionBackendApp struct {
	Router *Router `inject:""`
}

func (app *HomomorphicEncryptionBackendApp) init() {
	app.Router.init()
}

func Main() {
	var app HomomorphicEncryptionBackendApp

	inject.Populate(&app)
	app.init()

	http.Handle("/", app.Router.GetRouter())
}
