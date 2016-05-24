package models

import (
	"time"

	"golang.org/x/net/context"
	"google.golang.org/appengine/datastore"
)

type Computation struct {
	ID               int64     `json:"id" datastore:"-"`
	HashID           string    `json:"hashId"`
	EncryptionScheme string    `json:"encryptionScheme"`
	Timestamp        time.Time `json:"timestamp"`
	IPAddress        string    `json:"ipAddress"`
	AuthToken        string    `json:"authToken"`
}

func PutComputation(ctx context.Context, computation Computation) Computation {
	key := datastore.NewKey(ctx, "Computation", "", 0, nil)
	k, err := datastore.Put(ctx, key, &computation)

	if err == nil {

	}

	computation.ID = k.IntID()
	return computation
}
