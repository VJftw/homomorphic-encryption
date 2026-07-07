package compute

import (
	"crypto/rand"
	"errors"
	"log"
	"math/big"
	"regexp"
	"strings"
)

var (
	ErrInvalidFunctionCall = errors.New("invalid function call")
	functionRe             = regexp.MustCompile(`([A-z]+)\{([A-z0-9,]*)\}`)
	bRe                    = regexp.MustCompile(`\([^\)\(]+\)`)
	// odmasRe                = regexp.MustCompile(`[\^\/\*\+\-]`)
	odmasRe = regexp.MustCompile(`([A-z0-9]+)([\^\/\*\+\-])([A-z0-9]+)`)
	// TODO: change the following into functions \%\$\&

	functionMap = map[string]func(scope map[string]string, args ...string) *big.Int{
		"generateRandomPrime": func(scope map[string]string, args ...string) *big.Int {
			prime, err := rand.Prime(rand.Reader, 8)
			if err != nil {
				panic(err)
			}

			return prime
		},
		"generateR": func(scope map[string]string, args ...string) *big.Int {
			n := resolveToInt(args[0], scope)
			log.Printf("generateR, n: %s", n)
			log.Printf("generateR, n bits: %d", n.BitLen())
			for {
				r, err := rand.Prime(rand.Reader, n.BitLen()-1)
				if err != nil {
					panic(err)
				}

				if r.Sign() > 0 && r.Cmp(n) < 0 {
					return r
				}
			}
		},
		"findCoPrime": func(scope map[string]string, args ...string) *big.Int {
			n := resolveToInt(args[0], scope)
			log.Printf("generateR, n: %s", n)
			log.Printf("generateR, n bits: %d", n.BitLen())
			for {
				r, err := rand.Prime(rand.Reader, n.BitLen()-1)
				if err != nil {
					panic(err)
				}

				if r.Sign() > 0 && r.Cmp(n) < 0 {
					return r
				}
			}
		},
		"mod": func(scope map[string]string, args ...string) *big.Int {
			a := resolveToInt(args[0], scope)
			b := resolveToInt(args[1], scope)

			return a.Mod(a, b)
		},
		"invmod": func(scope map[string]string, args ...string) *big.Int {
			a := resolveToInt(args[0], scope)
			b := resolveToInt(args[1], scope)

			return a.ModInverse(a, b)
		},
		"expmod": func(scope map[string]string, args ...string) *big.Int {
			a := resolveToInt(args[0], scope)
			b := resolveToInt(args[1], scope)
			c := resolveToInt(args[2], scope)

			return a.Exp(a, b, c)
		},
	}
)

func Calculate(calculation string, scope map[string]string) string {
	calculation = strings.ReplaceAll(calculation, " ", "")
	log.Printf("calculation: %v", calculation)
	log.Printf("scope: %v", scope)

	bracketMatches := bRe.FindAllString(calculation, -1)
	for len(bracketMatches) > 0 {

		for _, bracketMatch := range bracketMatches {
			bracketCalculation := bracketMatch[1 : len(bracketMatch)-1]
			bracketResult := singleCalculation(bracketCalculation, scope)

			calculation = strings.Replace(calculation, bracketMatch, bracketResult.String(), 1)
			log.Printf("replaced '%s' with '%s', now: %s", bracketMatch, bracketResult, calculation)
		}

		bracketMatches = bRe.FindAllString(calculation, -1)
	}

	return singleCalculation(calculation, scope).String()
}

func singleCalculation(calculation string, scope map[string]string) *big.Int {
	log.Printf("singleCalculation calculation: %s", calculation)
	functionCallMatches := functionRe.FindAllStringSubmatch(calculation, -1)
	log.Printf("functionCallMatches: %v", functionCallMatches)

	for _, functionCallMatch := range functionCallMatches {
		log.Printf("functionCallMatch: %v", functionCallMatch)
		functionCall := functionCallMatch[0]
		log.Printf("functionCall: %v", functionCall)
		functionName := functionCallMatch[1]
		log.Printf("functionName: %v", functionName)
		functionArgs := []string{}
		if len(functionCallMatch) > 2 {
			functionArgs = strings.Split(functionCallMatch[2], ",")
		}

		log.Printf("functionArgs: %v", functionArgs)
		if fn, ok := functionMap[functionName]; ok {
			fnResult := fn(scope, functionArgs...)
			calculation = strings.Replace(calculation, functionCall, fnResult.String(), 1)
			log.Printf("replaced '%s' with '%s', now: %s", functionCall, fnResult, calculation)
		}
	}

	odmasMatches := odmasRe.FindAllStringSubmatch(calculation, -1)
	for _, odmasMatch := range odmasMatches {
		// TODO: order odmasMatches based on op
		odmasCall := odmasMatch[0]
		a := odmasMatch[1]
		op := odmasMatch[2]
		b := odmasMatch[3]

		odmasResult := twoValueCalculation(
			resolveToInt(a, scope),
			resolveToInt(b, scope),
			op,
		)

		calculation = strings.Replace(calculation, odmasCall, odmasResult.String(), 1)
		log.Printf("replaced '%s' with '%s', now: %s", odmasCall, odmasResult, calculation)
		odmasMatches = odmasRe.FindAllStringSubmatch(calculation, -1)
	}

	res := &big.Int{}
	if v, ok := scope[calculation]; ok {
		res.SetString(v, 10)
	} else {
		_, ok := res.SetString(calculation, 10)
		if !ok {
			panic("could not convert calculation to bigint: " + calculation)
		}
	}

	return res
}

func twoValueCalculation(a, b *big.Int, operator string) *big.Int {
	switch operator {
	case "+":
		return a.Add(a, b)
	case "-":
		return a.Sub(a, b)
	case "*":
		return a.Mul(a, b)
	case "/":
		return a.Div(a, b)
		// case "^": TODO
		// return a.
	}

	return nil
}

func resolveToInt(variable string, scope map[string]string) *big.Int {
	value := new(big.Int)
	_, success := value.SetString(variable, 10)

	if success == false {
		value, _ = value.SetString(scope[variable], 10)
	}

	log.Printf("resolved %s to %s", variable, value)

	return value
}
