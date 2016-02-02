/*
 * Providers provided by Angular
 */
import {bootstrap} from "angular2/bootstrap";
import {enableProdMode} from "angular2/core";
import {FORM_PROVIDERS} from "angular2/common";
import {ELEMENT_PROBE_PROVIDERS} from "angular2/platform/common_dom";
import {ROUTER_PROVIDERS} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";
import {ComputationProvider} from "./app/provider/computation_provider";
import {StepProvider} from "./app/provider/step_provider";
import {StageProvider} from "./app/provider/stage_provider";
import {EncryptionSchemeProvider} from "./app/provider/encryption_scheme_provider";
import {EncryptionHelper} from "./app/encryption/encryption_helper";

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from "./app/app";
import {EncryptionSchemeResolver} from "./app/resolver/encryption_scheme/encryption_scheme_resolver";
import {EncryptionSchemeStageResolver} from "./app/resolver/encryption_scheme/encryption_scheme_stage_resolver";
import {EncryptionSchemeStepResolver} from "./app/resolver/encryption_scheme/encryption_scheme_step_resolver";
import {ComputationRunner} from "./app/runner/computation_runner";
import {Computer} from "./app/encryption/computer";
import {MessageProvider} from "./app/provider/message_provider";
import {MessageResolver} from "./app/resolver/message_resolver";

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
    ComputationProvider,
    StepProvider,
    StageProvider,
    EncryptionSchemeProvider,
    EncryptionHelper,
    EncryptionSchemeResolver,
    EncryptionSchemeStageResolver,
    EncryptionSchemeStepResolver,
    ComputationRunner,
    Computer,
    MessageProvider,
    MessageResolver
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
