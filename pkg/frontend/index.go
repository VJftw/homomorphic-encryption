package frontend

import (
	"github.com/maxence-charriere/go-app/v10/pkg/app"
)

type Index struct {
	app.Compo
}

func (c *Index) Render() app.UI {
	return app.Div().Class("content").Body(
		app.P().Class("mb-4").Text("This application presents various Homomorphic Encryption schemes to help teach how they work and could be implemented."),
		app.P().Class("has-text-centered").Body(app.Button().Class("button is-primary").OnClick(c.tryItOutClickEvent).Text("Try it out!")),
		app.H1().Text("More information"),
		app.P().Text("Homomorphic Encryption has become an increasingly important topic in Computer Science with the emergence of public cloud services like Amazon Web Services, Google Cloud Platform and Microsoft Azure who offer virtual computers in their data-centers across the globe. Usage of their computers ultimately means that anyone who can gain access to their computers can discover what it is currently executing and compromise any data that is a part of that process. Homomorphic Encryption describes the ability to encrypt values and allow any external process to perform operations on them whilst retaining their original meaning, thus solving this vulnerability."),
		app.H2().Text("Created with"),
		app.Ul().Body(
			app.Li().Body(app.A().Href("https://golang.org").Text("Go").Attr("target", "_blank")),
			app.Li().Body(app.A().Href("https://bazel.build").Text("Bazel").Attr("target", "_blank")),
			app.Li().Body(app.Text("Styled with "), app.A().Href("https://bulma.io").Text("Bulma").Attr("target", "_blank")),
			app.Li().Body(app.Text("Hosted on "), app.A().Href("http://aws.amazon.com/").Text("Amazon Web Services").Attr("target", "_blank")),
		),
	)
}

func (c *Index) tryItOutClickEvent(ctx app.Context, e app.Event) {
	ctx.Navigate("/schemes")
}
