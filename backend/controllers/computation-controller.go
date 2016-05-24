package controllers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"google.golang.org/appengine"

	"github.com/gorilla/mux"
	"github.com/speps/go-hashids"
	"github.com/vjftw/homomorphic-encryption/backend/models"
)

type ComputationController struct {
}

func AddComputationRoutes(r *mux.Router) {
	r.
		HandleFunc("/api/v1/computations", postComputationHandler).
		Methods("POST")
}

func postComputationHandler(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	w.Header().Set("Content-Type", "application/json")

	var c models.Computation

	c.EncryptionScheme = r.FormValue("encryptionScheme")

	if c.EncryptionScheme == "" {
		http.Error(w, "No Encryption Scheme", http.StatusBadRequest)
		return
	}

	// add AuthToken
	c.AuthToken = "abcdef"

	// add IP Address
	c.IPAddress = strings.Split(r.RemoteAddr, ":")[0]

	// add Timestamp
	c.Timestamp = time.Now()

	// add HashID
	hd := hashids.NewData()
	hd.Salt = "abcdef"
	h := hashids.NewWithData(hd)
	e, _ := h.Encode([]int{c.Timestamp.Nanosecond(), c.Timestamp.YearDay(), c.Timestamp.Hour(), c.Timestamp.Year(), c.Timestamp.Minute(), c.Timestamp.Second()})
	c.HashID = e

	// Persist
	c = models.PutComputation(ctx, c)

	j, _ := json.Marshal(c)
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}
