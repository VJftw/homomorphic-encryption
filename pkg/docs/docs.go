package docs

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed swagger_ui/*
var staticFS embed.FS

//go:embed v1.openapiv2.json
var v1OpenApiV2JSON []byte

func FileServer() http.Handler {
	staticFS, err := fs.Sub(staticFS, "swagger_ui")
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/swagger-initializer.js", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(`
window.onload = function() {
  window.ui = SwaggerUIBundle({
	urls: [{url: "v1.openapiv2.json", name: "Homomorphic Encryption V1"}],
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
	displayOperationId: true,
	displayRequestDuration: true,
	deepLinking: true,
  });
};
`))
	})

	mux.HandleFunc("/v1.openapiv2.json", func(w http.ResponseWriter, r *http.Request) {
		w.Write(v1OpenApiV2JSON)
	})

	mux.Handle("/", http.FileServer(http.FS(staticFS)))

	return mux
}
