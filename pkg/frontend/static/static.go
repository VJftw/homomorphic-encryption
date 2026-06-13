package static

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed build/*
var staticFS embed.FS

func FileServer() http.Handler {
	sfs, err := fs.Sub(staticFS, "build")
	if err != nil {
		panic(err)
	}

	return http.FileServer(http.FS(spaFS{sfs}))
}

type spaFS struct {
	sfs fs.FS
}

func (fs spaFS) Open(name string) (fs.File, error) {
	file, err := fs.sfs.Open(name)
	if err != nil {
		return fs.sfs.Open("index.html")
	}

	return file, nil
}
