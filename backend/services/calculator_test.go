package services

import (
	"testing"

	. "github.com/smartystreets/goconvey/convey"
)

func TestCompute(t *testing.T) {
	calculator := Calculator{}
	Convey("Should perform basic mathematical operations", t, func() {
		So(calculator.Compute("3 + 5", make(map[string]string)),
			ShouldEqual,
			8,
		)
		So(calculator.Compute("5 - 3", make(map[string]string)),
			ShouldEqual,
			2,
		)
		So(calculator.Compute("5 * 3", make(map[string]string)),
			ShouldEqual,
			15,
		)
	})

	Convey("It should perform bracket calculations", t, func() {
		So(calculator.Compute("(5 * 3) + 4", make(map[string]string)),
			ShouldEqual,
			19,
		)
		So(calculator.Compute("(5 * 3) + (4 + 7)", make(map[string]string)),
			ShouldEqual,
			26,
		)
		So(calculator.Compute("(5 * (3 + 3)) + (4 + 7)", make(map[string]string)),
			ShouldEqual,
			41,
		)
	})

	Convey("It should resolve variables from the scope", t, func() {
		So(calculator.Compute("a + b", map[string]string{"a": "12", "b": "3"}),
			ShouldEqual,
			15,
		)
		So(calculator.Compute("(a + b) * 4", map[string]string{"a": "12", "b": "3"}),
			ShouldEqual,
			60,
		)
		So(calculator.Compute("(a + b) - c", map[string]string{"a": "12", "b": "3", "c": "5"}),
			ShouldEqual,
			10,
		)
	})

}
