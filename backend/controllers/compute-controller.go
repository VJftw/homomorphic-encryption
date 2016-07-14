package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/vjftw/homomorphic-encryption/backend/messages"
	"github.com/vjftw/homomorphic-encryption/backend/services"
)

type ComputeController struct {
	Calculator *services.Calculator `inject:""`
}

func (cC ComputeController) AddRoutes(r *mux.Router) {
	r.
		HandleFunc("/api/v1/compute", cC.postHandler).
		Methods("POST")
}

func (cC ComputeController) postHandler(w http.ResponseWriter, r *http.Request) {
	// ctx := appengine.NewContxt(r)

	w.Header().Set("Content-Type", "application/json")

	var m messages.WSComputeMessage
	err := json.NewDecoder(r.Body).Decode(&m)
	if err != nil {
		// 400 on Error
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Println(m)

	for _, step := range m.Data.ComputeSteps {
		varName := strings.Split(step, " = ")[0]
		compute := strings.Split(step, " = ")[1]
		result := cC.Calculator.Compute(compute, m.Data.PublicScope)
		m.Data.PublicScope[varName] = result
		m.Data.Results = append(m.Data.Results, result)
	}

	j, _ := json.Marshal(m.Data)
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}
