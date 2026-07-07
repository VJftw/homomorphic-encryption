package compute_test

import (
	"crypto/rand"
	"math/big"
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
		{"mod(5, 2)", nil, "1"},
		{"4 / 2", nil, "2"},
		{"invmod(13, 4)", nil, "1"},
		{"expmod(13, 4, 3)", nil, "1"},
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

	t.Run("generateRandomePrime", func(t *testing.T) {
		var tests = []struct {
			inExpression string
			inScope      map[string]string
			expectedErr  error
		}{
			{"generateRandomPrime()", nil, nil},
			// {"generateRandomPrime(a)", nil, compute.ErrInvalidFunctionCall},
			// {"generateRandomPrime(1)", nil, compute.ErrInvalidFunctionCall},
		}

		for _, tt := range tests {
			t.Run(tt.inExpression, func(t *testing.T) {
				result := compute.Calculate(tt.inExpression, tt.inScope)
				if tt.expectedErr == nil {
					bigint := &big.Int{}
					bigint.SetString(result, 10)

					assert.Truef(t, bigint.ProbablyPrime(0), "not prime: %s", result)
				}
			})
		}
	})

	t.Run("generateR", func(t *testing.T) {
		n, _ := rand.Prime(rand.Reader, 8)
		var tests = []struct {
			inExpression string
			inScope      map[string]string
			expectedErr  error
		}{
			{"generateR(n)", map[string]string{"n": n.String()}, nil},
			// {"generateR()", nil, compute.ErrInvalidFunctionCall},
			// {"generateR(1, 2)", nil, compute.ErrInvalidFunctionCall},
		}

		for _, tt := range tests {
			t.Run(tt.inExpression, func(t *testing.T) {
				resultStr := compute.Calculate(tt.inExpression, tt.inScope)
				if tt.expectedErr == nil {
					result := &big.Int{}
					result.SetString(resultStr, 10)

					assert.Greaterf(t, result.Sign(), 0, "generated R must be positive, got: %s", result.String())
					assert.Lessf(t, result.Cmp(n), 0, "generated R must be less than n (%s), got: %s", n.String(), result.String())
				}
			})
		}
	})

	t.Run("findCoPrime(l)", func(t *testing.T) {

	})
}
