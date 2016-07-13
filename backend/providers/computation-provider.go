package providers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/speps/go-hashids"
	"github.com/vjftw/homomorphic-encryption/backend/errors"
	"github.com/vjftw/homomorphic-encryption/backend/models"
)

type ComputationProvider struct {
}

func (cP *ComputationProvider) NewFromRequest(r *http.Request) (models.Computation, error) {
	var c models.Computation

	json.NewDecoder(r.Body).Decode(&c)

	if c.EncryptionScheme == "" {
		return c, new(errors.MissingEncryptionScheme)
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

	return c, nil
}
