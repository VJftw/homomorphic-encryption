import {
  it
} from "angular2/testing";

import {EncryptionSchemeProvider} from "./encryption_scheme_provider";
import {EncryptionSchemeResolver} from "../resolver/encryption_scheme/encryption_scheme_resolver";
import {EncryptionSchemeStageResolver} from "../resolver/encryption_scheme/encryption_scheme_stage_resolver";
import {EncryptionSchemeStepResolver} from "../resolver/encryption_scheme/encryption_scheme_step_resolver";

describe("EncryptionSchemeProvider", () => {

  let encryptionSchemeStepResolver = new EncryptionSchemeStepResolver();
  let encryptionSchemeStageResolver = new EncryptionSchemeStageResolver(encryptionSchemeStepResolver);
  let encryptionSchemeResolver = new EncryptionSchemeResolver(encryptionSchemeStageResolver);

  let encryptionSchemeProvider: EncryptionSchemeProvider;

  beforeEach(() => {
    encryptionSchemeProvider = new EncryptionSchemeProvider(
      encryptionSchemeResolver
    );
  });

  it("should return an encryption scheme given by its name", () => {

    expect(encryptionSchemeProvider.getEncryptionSchemeByName("pailler").getReadableName())
      .toBe("Pailler")
    ;

  });

  it("should throw an error for an unknown encryption encryption_scheme", () => {

    expect(() => {
      encryptionSchemeProvider.getEncryptionSchemeByName("abcd")
    }).toThrowError()
    ;

  });

  it("should return the encryption schemes", () => {

    let schemes = encryptionSchemeProvider.getEncryptionSchemes();

    expect(schemes.length)
      .toBe(2)
    ;

  });
});