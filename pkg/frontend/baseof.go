package frontend

import "github.com/maxence-charriere/go-app/v10/pkg/app"

type BaseOf struct {
	app.Compo

	Content app.UI
}

func (c *BaseOf) Render() app.UI {
	defer func() {
		mathjax := app.Window().Get("MathJax")
		mathjax.Call("typesetPromise")
	}()
	return app.Div().Class("container").Body(
		app.Div().Class("container is-max-tablet").Body(
			app.Section().Class("hero").Body(
				app.Div().Class("hero-body is-centered").Body(
					app.P().Class("title has-text-centered").Body(app.A().Text("Homomorpic Encryption").Href("/")),
					app.P().Class("subtitle has-text-right").Body(
						app.Text("by "), app.A().Text("VJ Patel").Href("https://vjpatel.me").Attr("target", "_blank"),
					),
				),
			),
		),
		app.Section().Class("section").Body(
			c.Content,
		),
	)
}
