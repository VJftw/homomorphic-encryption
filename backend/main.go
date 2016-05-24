package main

import "net/http"

func Main() {
	router := NewRouter()
	http.Handle("/", router)
}
