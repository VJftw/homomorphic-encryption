// TODO: WASM only.
package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/maxence-charriere/go-app/v10/pkg/app"
	"github.com/vjftw/homomorphic-encryption/pkg/frontend"
)

// The main function is the entry point where the app is configured and started.
// It is executed in 2 different environments: A client (the web browser) and a
// server.
func main() {
	frontend.Routes()
	// Once the routes set up, the next thing to do is to either launch the app
	// or the server that serves the app.
	//
	// When executed on the client-side, the RunWhenOnBrowser() function
	// launches the app,  starting a loop that listens for app events and
	// executes client instructions. Since it is a blocking call, the code below
	// it will never be executed.
	//
	// When executed on the server-side, RunWhenOnBrowser() does nothing, which
	// lets room for server implementation without the need for precompiling
	// instructions.
	app.RunWhenOnBrowser()

	if err := app.GenerateStaticWebsite(filepath.Dir(os.Args[1]), &app.Handler{
		Name:        "Hello",
		Description: "An Hello World! example",
	}); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(filepath.Dir(os.Args[1]), "web"), 0o700); err != nil {
		log.Fatal(err)
	}
	if err := os.Rename(os.Args[2], filepath.Join(filepath.Dir(os.Args[1]), "web", "app.wasm")); err != nil {
		log.Fatal(err)
	}

}
