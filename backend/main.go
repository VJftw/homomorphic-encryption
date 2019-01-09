package main

import (
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

var ginLambda *ginadapter.GinLambda

func init() {
	log.Printf("Gin cold start")
	r := gin.Default()

	r.Use(cors.Default())
	r.GET("/v1/health", func(c *gin.Context) {
		c.JSON(200, "OK")
	})
	r.POST("/v1/compute", postCompute)

	ginLambda = ginadapter.New(r)
}

func Handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// If no name is provided in the HTTP request body, throw an error
	return ginLambda.Proxy(req)
}

func main() {
	lambda.Start(Handler)
}
