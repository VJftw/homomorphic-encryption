/*
 * Providers provided by Angular
 */
import {bootstrap} from "angular2/bootstrap";
import {enableProdMode} from "angular2/core";
import {FORM_PROVIDERS} from "angular2/common";
import {ELEMENT_PROBE_PROVIDERS} from "angular2/platform/common_dom";
import {ROUTER_PROVIDERS} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";
import {Pailler} from "./app/encryption/pailler/pailler";
import {ComputationResolver} from "./app/resolver/computation_resolver";
import {StepResolver} from "./app/resolver/step_resolver";
import {StageResolver} from "./app/resolver/stage_resolver";
import {ComputationProvider} from "./app/provider/computation_provider";
import {StepProvider} from "./app/provider/step_provider";
import {StageProvider} from "./app/provider/stage_provider";
import {EncryptionSchemeProvider} from "./app/provider/encryption_scheme_provider";
import {PaillerScheme} from "./app/encryption/pailler/pailler_scheme";
import {ElGamalScheme} from "./app/encryption/elgamal/el_gamal_scheme";
import {ElGamal} from "./app/encryption/elgamal/el_gamal";

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from "./app/app";

/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular"s dependency injection
 */
function main() {
  let base_deps: Array<any> = [
      FORM_PROVIDERS,
      ROUTER_PROVIDERS,
      HTTP_PROVIDERS
  ];

  let app_deps: Array<any> = [
    ComputationResolver,
    StepResolver,
    StageResolver,
    ComputationProvider,
    StepProvider,
    StageProvider,
    EncryptionSchemeProvider,
    PaillerScheme,
    Pailler,
    ElGamalScheme,
    ElGamal
  ];

  if (process.env.NODE_ENV !== "development") {
    // Production
    enableProdMode();
  } else {
    // Development
    base_deps.push(ELEMENT_PROBE_PROVIDERS);
  }

  return bootstrap(App, base_deps.concat(app_deps))
    .catch(err => console.error(err));
}

document.addEventListener("DOMContentLoaded", main);
