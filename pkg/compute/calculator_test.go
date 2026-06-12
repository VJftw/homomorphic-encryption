package compute_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/vjftw/homomorphic-encryption/pkg/compute"
)

func TestCalculate(t *testing.T) {
	var tests = []struct {
		inExpression string
		inScope      map[string]string
		expectedOut  string
	}{
		{"3 + 5", nil, "8"},
		{"5 - 3", nil, "2"},
		{"5 * 3", nil, "15"},
		{"5 % 2", nil, "1"},
		{"4 / 2", nil, "2"},
		{"13 $ 4", nil, "1"},
		{"13 & 4,3", nil, "1"},
		{"(5 * 3) + 4", nil, "19"},
		{"(5 * 3) + (4 + 7)", nil, "26"},
		{"(5 * (3 + 3)) + (4 + 7)", nil, "41"},
		{"a + b", map[string]string{"a": "12", "b": "3"}, "15"},
		{"(a + b) * 4", map[string]string{"a": "12", "b": "3"}, "60"},
		{"(a + b) - c", map[string]string{"a": "12", "b": "3", "c": "5"}, "10"},
	}

	for _, tt := range tests {
		t.Run(tt.inExpression, func(t *testing.T) {
			assert.Equal(t, tt.expectedOut, compute.Calculate(tt.inExpression, tt.inScope))
		})
	}
}
