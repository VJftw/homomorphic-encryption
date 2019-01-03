package main

import (
	"log"
	"strings"

	"github.com/VJftw/homomorphic-encryption/backend/calculator"
	"github.com/VJftw/homomorphic-encryption/backend/messages"
	"github.com/gin-gonic/gin"
)

func postCompute(c *gin.Context) {
	var m messages.WSComputeMessage
	err := c.ShouldBindJSON(&m)
	if err != nil {
		return
	}

	log.Printf("%+v\n", m)

	for _, step := range m.Data.ComputeSteps {
		varName := strings.Split(step, " = ")[0]
		compute := strings.Split(step, " = ")[1]
		result := calculator.Compute(compute, m.Data.PublicScope)
		m.Data.PublicScope[varName] = result
		m.Data.Results = append(m.Data.Results, result)
	}

	c.JSON(201, m.Data)
}
