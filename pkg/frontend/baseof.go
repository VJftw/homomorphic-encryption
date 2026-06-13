package frontend

import "github.com/maxence-charriere/go-app/v10/pkg/app"

type BaseOf struct {
	app.Compo

	Content app.UI
}

func (c *BaseOf) Render() app.UI {
	return app.Div().Class("container is-max-tablet").Body(
		app.Section().Class("hero").Body(
			app.Div().Class("hero-body is-centered").Body(
				app.P().Class("title has-text-centered").Text("Homomorpic Encryption"),
				app.P().Class("subtitle has-text-right").Body(
					app.Text("by "), app.A().Text("VJ Patel").Href("https://vjpatel.me").Attr("target", "_blank"),
				),
			),
		),
		app.Section().Class("section").Body(
			c.Content,
		),
	)
}
