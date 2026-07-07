package frontend

import (
	"embed"
	"fmt"
	"log/slog"
	"path/filepath"
	"strings"

	"github.com/maxence-charriere/go-app/v10/pkg/app"
	"gopkg.in/yaml.v3"
)

//go:embed schemes/*
var schemeConfigsFS embed.FS

type Schemes struct {
	app.Compo

	schemesByID map[string]Scheme

	requestedSchemeId string
}

func (c *Schemes) Render() app.UI {
	if err := c.load(); err != nil {
		slog.Error("onmount could not load schemes", slog.String("error", err.Error()))
	}

	if scheme, ok := c.schemesByID[c.requestedSchemeId]; ok {
		return &SchemesSingle{scheme: scheme}
	}

	return &SchemesList{schemesByID: c.schemesByID}
}

func (c *Schemes) OnNav(ctx app.Context) {
	c.requestedSchemeId = strings.TrimPrefix(ctx.Page().URL().Path, "/schemes/")
}

func (c *Schemes) load() error {
	if len(c.schemesByID) > 0 {
		return nil
	}

	c.schemesByID = map[string]Scheme{}
	dirEntries, err := schemeConfigsFS.ReadDir("schemes")
	if err != nil {
		return fmt.Errorf("load schemes: %w", err)
	}

	slog.Info("loading schemes", slog.Any("dirEntries", dirEntries))

	for _, dirEntry := range dirEntries {
		schemeFile, err := schemeConfigsFS.Open(filepath.Join("schemes", dirEntry.Name()))
		if err != nil {
			return fmt.Errorf("open '%s': %w", dirEntry.Name(), err)
		}
		defer schemeFile.Close()

		var scheme Scheme
		if err := yaml.NewDecoder(schemeFile).Decode(&scheme); err != nil {
			return fmt.Errorf("decode scheme from '%s': %w", dirEntry.Name(), err)
		}

		slog.Info("loaded scheme", slog.String("id", scheme.ID))
		c.schemesByID[scheme.ID] = scheme
	}

	return nil
}

type Scheme struct {
	ID          string `yaml:"id"`
	Name        string `yaml:"name"`
	Description string `yaml:"description"`
	BitLengths  []struct {
		BitLength uint `yaml:"bitLength"`
		MaxInt    uint `yaml:"maxInt"`
	} `yaml:"bitLengths"`

	Stages struct {
		Setup      []Stage          `yaml:"setup"`
		Encryption []Stage          `yaml:"encryption"`
		Backend    map[string]Stage `yaml:"backend"`
		Decryption []Stage          `yaml:"decryption"`
	} `yaml:"stages"`
}

type Stage struct {
	Name           string `yaml:"name"`
	PreDescription string `yaml:"preDescription"`
	Steps          []struct {
		Description string `yaml:"description"`
		Compute     string `yaml:"compute"`
		Expose      bool   `yaml:"expose"`
	}
	PostDescription string `yaml:"postDescription"`
}
