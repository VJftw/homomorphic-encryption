package static

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed build/*
var staticFS embed.FS

func FileServer() http.Handler {
	staticFS, err := fs.Sub(staticFS, "build")
	if err != nil {
		panic(err)
	}

	return http.FileServer(http.FS(staticFS))
}
