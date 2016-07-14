package services

import (
	"log"
	"math/big"
	"regexp"
	"strings"
)

type Calculator struct {
}

func (calc *Calculator) Compute(calculation string, scope map[string]string) string {

	calculation = strings.Replace(calculation, " ", "", -1)

	regex := regexp.MustCompile(`\([^\)\(]*\)`)
	bracketMatches := regex.FindAllString(calculation, -1)
	for len(bracketMatches) > 0 {

		for _, bracketMatch := range bracketMatches {
			bracketCalculation := bracketMatch[1 : len(bracketMatch)-1]
			bracketResult := calc.singleCalculation(bracketCalculation, scope)

			calculation = strings.Replace(calculation, bracketMatch, bracketResult.String(), 1)
		}

		bracketMatches = regex.FindAllString(calculation, -1)
	}

	return calc.singleCalculation(calculation, scope).String()
}

func (calc *Calculator) singleCalculation(calculation string, scope map[string]string) *big.Int {
	regex := regexp.MustCompile(`[\*\+\-\%\/\$\&]`)

	foundOperators := regex.FindAllString(calculation, -1)
	if len(foundOperators) > 1 {
		log.Fatal("Too many operators" + calculation)
		return nil
	}
	operator := foundOperators[0]

	parts := regex.Split(calculation, -1)
	if operator == "+" || operator == "-" || operator == "*" || operator == "%" || operator == "/" || operator == "$" {
		return calc.twoValueCalculation(
			calc.resolveToInt(parts[0], scope),
			calc.resolveToInt(parts[1], scope),
			operator,
		)
	} else if operator == "&" {
		regex = regexp.MustCompile(",")
		g := regex.Split(parts[1], -1)
		return calc.threeValueCalculation(
			calc.resolveToInt(parts[0], scope),
			calc.resolveToInt(g[0], scope),
			calc.resolveToInt(g[1], scope),
			operator,
		)
	}

	return nil
}

func (calc *Calculator) twoValueCalculation(a, b *big.Int, operator string) *big.Int {
	switch operator {
	case "+":
		return a.Add(a, b)
	case "-":
		return a.Sub(a, b)
	case "*":
		return a.Mul(a, b)
	case "%":
		return a.Mod(a, b)
	case "/":
		return a.Div(a, b)
	case "$":
		return a.ModInverse(a, b)
	}

	return nil
}

func (calc Calculator) threeValueCalculation(a, b, c *big.Int, operator string) *big.Int {
	switch operator {
	case "&":
		return a.Exp(a, b, c)
	}
	return nil
}

func (calc *Calculator) resolveToInt(variable string, scope map[string]string) *big.Int {
	value := new(big.Int)
	_, success := value.SetString(variable, 10)

	if success == false {
		value, _ = value.SetString(scope[variable], 10)
	}

	return value
}
