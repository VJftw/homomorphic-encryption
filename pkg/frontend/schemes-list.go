package frontend

import "github.com/maxence-charriere/go-app/v10/pkg/app"

type SchemesList struct {
	app.Compo

	schemesByID map[string]Scheme
}

func (c *SchemesList) Render() app.UI {
	return app.Div().Body(
		app.Range(c.schemesByID).Map(func(k string) app.UI {
			return app.Div().Class("card").Body(
				app.Header().Class("card-header").Body(
					app.P().Class("card-header-title").Text(c.schemesByID[k].Name),
				),
				app.Div().Class("card-content").Body(
					app.Div().Class("content").Text(c.schemesByID[k].Description),
				),
				app.Footer().Class("card-footer").Body(
					app.Button().
						Text("Try "+c.schemesByID[k].Name).
						Class("button is-link card-footer-item").
						Value(c.schemesByID[k].ID).
						OnClick(c.selectSchemeClickEvent),
				),
			)
		}),
	)
}

func (c *SchemesList) selectSchemeClickEvent(ctx app.Context, e app.Event) {
	v := ctx.JSSrc().Get("value")
	ctx.Navigate("/schemes/" + v.String())
}
