package static

import (
	"embed"
	"net/http"
)

//go:embed *
var staticFS embed.FS

func FileServer() {
	return http.FileServer(http.FS(staticFS))
}
