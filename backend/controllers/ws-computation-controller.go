package controllers

import (
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/vjftw/homomorphic-encryption/backend/messages"
	"github.com/vjftw/homomorphic-encryption/backend/services"
)

type WSComputeController struct {
	Calculator *services.Calculator `inject:""`
}

func (wscC *WSComputeController) AddRoutes(r *mux.Router) {
	r.
		HandleFunc("/ws/v1/compute", wscC.websocketComputeHandler)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func (wscC *WSComputeController) websocketComputeHandler(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		m := messages.WSComputeMessage{}
		err := ws.ReadJSON(&m)
		if err != nil {
			log.Fatal(err)
			log.Print("Closing WebSocket")
			ws.Close()
			return
		}
		go wscC.handleComputation(m.Data, ws)
	}
}

func (wscC *WSComputeController) handleComputation(c messages.WSComputeMessageData, ws *websocket.Conn) {
	for _, step := range c.ComputeSteps {
		varName := strings.Split(step, " = ")[0]
		compute := strings.Split(step, " = ")[1]
		result := wscC.Calculator.Compute(compute, c.PublicScope)
		c.PublicScope[varName] = strconv.Itoa(result)
		c.Results = append(c.Results, strconv.Itoa(result))

		ws.WriteJSON(c)
	}

	ws.Close()
}
