package controllers

import (
	"encoding/json"
	"net/http"

	"google.golang.org/appengine"

	"github.com/gorilla/mux"
	"github.com/vjftw/homomorphic-encryption/backend/models"
	"github.com/vjftw/homomorphic-encryption/backend/providers"
)

type ComputationController struct {
	ComputationProvider *providers.ComputationProvider `inject:""`
}

func (cC *ComputationController) AddRoutes(r *mux.Router) {
	r.
		HandleFunc("/api/v1/computations", cC.postHandler).
		Methods("POST")
}

func (cC *ComputationController) postHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	w.Header().Set("Content-Type", "application/json")

	computation, err := cC.ComputationProvider.NewFromRequest(r)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Persist
	computation = models.PutComputation(ctx, computation)

	j, _ := json.Marshal(computation)
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}
