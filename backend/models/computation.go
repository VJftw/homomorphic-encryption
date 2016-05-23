package models

import "time"

type Computation struct {
	ID               int       `json:"id"`
	HashID           string    `json:"hashId"`
	EncryptionScheme string    `json:"encryptionScheme"`
	Timestamp        time.Time `json:"timestamp"`
	IPAddress        string    `json:"ipAddress"`
	AuthToken        string    `json:"authToken"`
}
