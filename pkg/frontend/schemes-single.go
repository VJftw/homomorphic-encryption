package frontend

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"strings"

	"github.com/maxence-charriere/go-app/v10/pkg/app"
	v1 "github.com/vjftw/homomorphic-encryption/api/v1"
	"github.com/vjftw/homomorphic-encryption/pkg/compute"
	"google.golang.org/protobuf/encoding/protojson"
)

type SchemesSingle struct {
	app.Compo

	scheme Scheme

	a         uint
	b         uint
	operation string

	isCalculating bool
}

func (c *SchemesSingle) Render() app.UI {
	return app.Div().Body(
		app.Section().Class("hero").Body(
			app.Div().Class("hero-body").Body(
				app.P().Class("title").Text(c.scheme.Name),
				app.P().Class("subtitle").Text(c.scheme.Description),
			),
		),
		app.Section().Class().Body(
			app.Div().Class("card").Body(
				app.Header().Class("card-header").Body(
					app.P().Class("card-header-title").Text("Enter a sum"),
				),
				app.Div().Class("card-content").Body(
					app.FieldSet().Attr("disabled", c.isCalculating).Body(
						app.Div().Class("content").Body(
							app.Div().Class("columns").Body(
								app.Div().Class("field column").Body(
									app.Div().Class("control").Body(
										app.Input().Class("input", "is-large").
											Type("number").
											Placeholder("3").
											OnChange(c.ValueTo(&c.a)),
									),
								),
								app.Div().Class("field column is-narrow").Body(
									app.Div().Class("control").Body(
										app.Div().Class("select is-large").Body(
											app.Select().Body(
												app.Range(c.scheme.Stages.Backend).Map(func(k string) app.UI {
													if c.operation == "" {
														c.operation = k
													}
													return app.Option().Value(k).Text(k)
												}),
											).OnChange(c.ValueTo(&c.operation)),
										),
									),
								),
								app.Div().Class("field column").Body(
									app.Div().Class("control").Body(
										app.Input().Class("input is-large").
											Type("number").
											Placeholder("5").
											OnChange(c.ValueTo(&c.b)),
									),
								),
							),
							app.Div().Class("is-clearfix").Body(
								app.Div().Class("field", "is-horizontal", "is-pulled-right").Body(
									app.Div().Class("field-label", "is-normal").Body(
										app.Label().Class("label").Text("Key bit length"),
									),
									app.Div().Class("field-body").Body(
										app.Div().Class("control").Body(
											app.Div().Class("select").Body(
												app.Select().Body(
													app.Range(c.scheme.BitLengths).Slice(func(i int) app.UI {
														bitLength := c.scheme.BitLengths[i]
														return app.Option().Value(bitLength.BitLength).Text(bitLength.BitLength)
													}),
												),
											),
										),
									),
								),
							),
							app.Div().Class("is-clearfix").Body(
								app.Button().
									Class("button", "is-primary", "is-pulled-right").
									Text("Execute").
									OnClick(c.executeSchemeClickEvent),
							),
						),
					),
				),
			),
		),
	)
}

func (c *SchemesSingle) executeSchemeClickEvent(ctx app.Context, e app.Event) {
	slog.Info("calculating", slog.Int("a", int(c.a)), slog.Int("b", int(c.b)), slog.String("operation", c.operation))
	c.isCalculating = true
	// defer func() { c.isCalculating = false }()
	publicScope := map[string]string{}
	scope := map[string]string{
		"a": fmt.Sprintf("%d", c.a),
		"b": fmt.Sprintf("%d", c.b),
	}

	for _, setupStage := range c.scheme.Stages.Setup {
		for _, step := range setupStage.Steps {
			log.Printf("step.Compute %v", step.Compute)

			varName := strings.Split(step.Compute, " = ")[0]
			log.Printf("varName %v", varName)
			varCompute := strings.Split(step.Compute, " = ")[1]
			log.Printf("varCompute %v", varCompute)
			scope[varName] = compute.Calculate(varCompute, scope)
			log.Printf("set %s = %s", varName, scope[varName])
			if step.Expose {
				publicScope[varName] = scope[varName]
			}
		}
	}

	log.Printf("%v", scope)

	for _, encryptStage := range c.scheme.Stages.Encryption {
		for _, step := range encryptStage.Steps {
			varName := strings.Split(step.Compute, " = ")[0]
			varCompute := strings.Split(step.Compute, " = ")[1]
			scope[varName] = compute.Calculate(varCompute, scope)
			log.Printf("set %s = %s", varName, scope[varName])
			if step.Expose {
				publicScope[varName] = scope[varName]
			}
		}
	}

	log.Printf("%v", scope)

	backendStage := c.scheme.Stages.Backend[c.operation]
	backendSteps := make([]string, len(backendStage.Steps))
	for i, step := range backendStage.Steps {
		backendSteps[i] = step.Compute
	}
	// send to compute
	computeReqBody := v1.ComputeRequest{
		PublicScope: publicScope,
		Steps:       backendSteps,
	}
	marshalledBody, err := protojson.Marshal(&computeReqBody)
	if err != nil {
		slog.Error(err.Error())
		return
	}
	resp, err := http.Post("/api/v1/compute", "application/json", bytes.NewBuffer(marshalledBody))
	if err != nil {
		slog.Error(err.Error())
		return
	}
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		slog.Error(err.Error())
		return
	}
	computeResp := v1.ComputeResponse{}
	if err := protojson.Unmarshal(respBytes, &computeResp); err != nil {
		slog.Error(err.Error())
		return
	}

	for k, v := range computeResp.PublicScope {
		scope[k] = v
	}

	for _, decryptStage := range c.scheme.Stages.Decryption {
		for _, step := range decryptStage.Steps {
			varName := strings.Split(step.Compute, " = ")[0]
			varCompute := strings.Split(step.Compute, " = ")[1]
			scope[varName] = compute.Calculate(varCompute, scope)
			log.Printf("set %s = %s", varName, scope[varName])
			if step.Expose {
				publicScope[varName] = scope[varName]
			}
		}
	}
}
