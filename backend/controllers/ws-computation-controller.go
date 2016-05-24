package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/vjftw/homomorphic-encryption/backend/messages"
	"github.com/vjftw/homomorphic-encryption/backend/services"
)

type WSComputeController struct {
	Calculator *services.Calculator `inject:""`
}

func (wscc *WSComputeController) AddRoutes(r *mux.Router) {
	r.
		HandleFunc("/ws/v1/compute", websocketComputeHandler).
		Methods("GET")
}

func websocketComputeHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := websocket.Upgrade(w, r, nil, 1024, 1024)
	if _, ok := err.(websocket.HandshakeError); ok {
		http.Error(w, "Not a websocket handshake", 400)
		return
	} else if err != nil {
		log.Fatal("Cannot setup WebSocket connection:", err)
		return
	}

	for {
		_, p, err := ws.ReadMessage()
		if err != nil {
			log.Fatal(err)
			log.Print("Closing WebSocket")
			ws.Close()
			return
		}
		m := messages.WSComputeMessage{}
		err = json.Unmarshal(p, &m)
		if err != nil {
			log.Fatal(err)
			log.Print("Closing WebSocket")
			ws.Close()
			return
		}
		go handleComputation(m.Data)

	}
}

func handleComputation(c messages.WSComputeMessageData) {
	// for _, step := range c.ComputeSteps {
	// varName := strings.Split(step, " = ")[0]
	// compute := strings.Split(step, " = ")[1]

	// }
}
