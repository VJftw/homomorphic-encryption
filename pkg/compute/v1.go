package compute

import (
	"context"
	"maps"
	"strings"

	v1 "github.com/vjftw/homomorphic-encryption/api/v1"
)

// V1ServiceServer implements v1.ComputeServiceServer.
type V1ServiceServer struct {
	v1.UnimplementedComputeServiceServer
}

// V1ServiceServerOpt represents functional options for instantiating a
// V1ServiceServer.
type V1ServiceServerOpt func(*V1ServiceServer)

// NewV1ServiceServer returns a new implementation for v1.ComputeServiceServer.
func NewV1ServiceServer(opts ...V1ServiceServerOpt) *V1ServiceServer {
	s := &V1ServiceServer{}

	for _, opt := range opts {
		opt(s)
	}

	return s
}

// Compute implements v1.ComputeServiceServer.Compute.
func (s *V1ServiceServer) Compute(ctx context.Context, req *v1.ComputeRequest) (*v1.ComputeResponse, error) {

	res := &v1.ComputeResponse{
		ComputeRequest: req,
		PublicScope:    map[string]string{},
	}

	// Copy from request to preserve original scope.
	maps.Copy(res.PublicScope, req.PublicScope)

	for _, step := range req.Steps {
		varName := strings.Split(step, " = ")[0]
		compute := strings.Split(step, " = ")[1]

		result := Calculate(compute, req.PublicScope)
		res.PublicScope[varName] = result
	}

	return res, nil
}
