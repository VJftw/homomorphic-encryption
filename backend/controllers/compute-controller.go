package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
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

	w.Header.Set("Content-Type", "application/json")

	var m messages.WSComputeMessage
	err := json.Unmarshal(&m, r.Body)

	if err != nil {

	}

	fmt.Println(computeMessage)

	for _, step := range m.Data.ComputeSteps {
		varName := strings.Split(step, " = ")[0]
		compute := strings.Split(step, " = ")[1]
		result := cC.Calculator.Compute(compute, m.PublicScope)
		m.PublicScope[varName] = strconv.Itoa(result)
		m.Results = append(m.Results, strconv.Itoa(result))
	}

	j, _ := json.Marshal(m)
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}
