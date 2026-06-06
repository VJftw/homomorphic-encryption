// - GRPC + HTTP (use GRPC+HTTP Mux Layer)
//   - Gateway server /api/...
//   - Swagger docs /docs/...
//   - built-in-client (static-site) /
package main

import (
	"context"
	_ "embed"
	"fmt"
	"log"
	"net"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"

	v1 "github.com/vjftw/homomorphic-encryption/api/homomorphic_encryption/v1"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

//go:embed cmd/frontend/index.html
var frontend []byte

func main() {
	log.Printf("Hello World!")

	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", 3001))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)
	v1.RegisterComputeServiceServer(grpcServer, v1.UnimplementedComputeServiceServer{})
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}

func gw(ctx context.Context) error {
	// Register gRPC server endpoint
	grpcServerEndpoint := "localhost:3000"
	// Note: Make sure the gRPC server is running properly and accessible
	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := v1.RegisterComputeServiceHandlerFromEndpoint(ctx, mux, grpcServerEndpoint, opts)
	if err != nil {
		return err
	}

	// Start HTTP server (and proxy calls to gRPC server endpoint)
	return http.ListenAndServe(":8081", mux)
}
