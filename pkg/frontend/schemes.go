package frontend

import (
	"strings"

	"github.com/maxence-charriere/go-app/v10/pkg/app"
)

type Schemes struct {
	app.Compo

	schemesByID map[string]Scheme

	requestedSchemeId string
}

func (c *Schemes) Render() app.UI {
	if scheme, ok := c.schemesByID[c.requestedSchemeId]; ok {
		return c.Single(scheme)
	}

	return c.List()
}

func (c *Schemes) OnNav(ctx app.Context) {
	c.requestedSchemeId = strings.TrimPrefix(ctx.Page().URL().Path, "/schemes/")
}

func (c *Schemes) List() app.UI {
	return app.Div().Text("Schemes")
}

func (c *Schemes) Single(scheme Scheme) app.UI {
	return app.Div().Text("Scheme: " + c.requestedSchemeId)
}

type Scheme struct {
	Name        string
	Description string
	BitLengths  []struct {
		BitLength uint
		MaxInt    uint
	}

	Stages struct {
		Setup      []Stage
		Encryption []Stage
		Backend    map[string]Stage
		Decryption []Stage
	}
}

type Stage struct {
	Name           string
	PreDescription string
	Steps          []struct {
		Description string
		Compute     string
		Expose      bool
	}
	PostDescription string
}
