package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/vjftw/homomorphic-encryption/backend/models"
)

type ComputationController struct {
}

func AddComputationRoutes(r mux.Router) {
	r.
		HandleFunc("/api/v1/computation", postComputationHandler).
		Methods("POST")
}

func postComputationHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var c models.Computation
	b, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(b, &c)

	if c.EncryptionScheme == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// add AuthToken

	// add IP Address

	// add HashID

	// add Timestamp

	// Persist

	j, _ := json.Marshal(c)
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}
