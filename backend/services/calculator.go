package services

import (
	"log"
	"regexp"
	"strconv"
	"strings"
)

type Calculator struct {
}

func (calc *Calculator) Compute(calculation string, scope map[string]string) int {

	calculation = strings.Replace(calculation, " ", "", -1)

	regex := regexp.MustCompile(`\([^\)\(]*\)`)
	bracketMatches := regex.FindAllString(calculation, -1)
	for len(bracketMatches) > 0 {

		for _, bracketMatch := range bracketMatches {
			bracketCalculation := bracketMatch[1 : len(bracketMatch)-1]
			bracketResult := calc.singleCalculation(bracketCalculation, scope)

			calculation = strings.Replace(calculation, bracketMatch, strconv.Itoa(bracketResult), 1)
		}

		bracketMatches = regex.FindAllString(calculation, -1)
	}

	return calc.singleCalculation(calculation, scope)
}

func (calc *Calculator) singleCalculation(calculation string, scope map[string]string) int {
	regex := regexp.MustCompile(`[\*+-]`)

	foundOperators := regex.FindAllString(calculation, -1)
	if len(foundOperators) > 1 {
		log.Fatal("Too many operators" + calculation)
		return 0
	}
	operator := foundOperators[0]

	parts := regex.Split(calculation, -1)
	if operator == "+" || operator == "-" || operator == "*" {
		return calc.twoValueCalculation(
			calc.resolveToInt(parts[0], scope),
			calc.resolveToInt(parts[1], scope),
			operator,
		)
	}

	return 0
}

func (calc *Calculator) twoValueCalculation(a int, b int, operator string) int {
	switch operator {
	case "+":
		return a + b
	case "-":
		return a - b
	case "*":
		return a * b
	}

	return 0
}

func (calc *Calculator) resolveToInt(variable string, scope map[string]string) int {
	value, err := strconv.Atoi(variable)

	if err != nil {
		value, _ = strconv.Atoi(scope[variable])
	}

	return value
}
