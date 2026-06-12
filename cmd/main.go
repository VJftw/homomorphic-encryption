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
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"golang.org/x/sync/errgroup"

	v1 "github.com/vjftw/homomorphic-encryption/api/v1"
	"github.com/vjftw/homomorphic-encryption/pkg/compute"
	"github.com/vjftw/homomorphic-encryption/pkg/docs"
	"github.com/vjftw/homomorphic-encryption/pkg/frontend/static"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	g, gCtx := errgroup.WithContext(ctx)

	g.Go(func() error {
		return httpServer(gCtx)
	})

	g.Go(func() error {
		return grpcServer(gCtx)
	})

	if err := g.Wait(); err != nil {
		log.Fatalf("%v", err)
	}
}

func httpServer(ctx context.Context) error {
	mux := http.NewServeMux()

	mux.Handle("/", static.FileServer())

	grpcMux := runtime.NewServeMux()
	mux.Handle("/api/v1/", http.StripPrefix("/api/v1", grpcMux))
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	err := v1.RegisterComputeServiceHandlerFromEndpoint(ctx, grpcMux, "localhost:3001", opts)
	if err != nil {
		return err
	}

	mux.Handle("/docs/", http.StripPrefix("/docs", docs.FileServer()))

	server := &http.Server{
		Addr:    ":3000",
		Handler: mux,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		server.Shutdown(shutdownCtx)
	}()

	return server.ListenAndServe()
}

func grpcServer(ctx context.Context) error {
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", 3001))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	var opts []grpc.ServerOption
	grpcServer := grpc.NewServer(opts...)
	v1.RegisterComputeServiceServer(grpcServer, compute.NewV1ServiceServer())

	go func() {
		<-ctx.Done()
		grpcServer.GracefulStop()
	}()

	return grpcServer.Serve(lis)
}
