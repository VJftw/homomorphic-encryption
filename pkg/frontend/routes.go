package frontend

import "github.com/maxence-charriere/go-app/v10/pkg/app"

func Routes() {

	app.Route("/", func() app.Composer { return &BaseOf{Content: &Index{}} })
	app.Route("/schemes", func() app.Composer { return &BaseOf{Content: &Schemes{}} })
	app.RouteWithRegexp("^/schemes/([a-z]*)/?", func() app.Composer { return &BaseOf{Content: &Schemes{}} })
}
