import {
  it
} from "angular2/testing";

import {EncryptionSchemeProvider} from "./encryption_scheme_provider";

describe("EncryptionSchemeProvider", () => {

  let encryptionSchemeProvider: EncryptionSchemeProvider;

  let paillerScheme = jasmine.createSpyObj("paillerScheme", ["getName"]);
  paillerScheme.getName.and.returnValue("Pailler");

  beforeEach(() => {
    encryptionSchemeProvider = new EncryptionSchemeProvider(
      paillerScheme
    );
  });

  it("should return an encryption scheme given by its name", () => {

    expect(encryptionSchemeProvider.getEncryptionSchemeByName("Pailler"))
      .toBe(paillerScheme)
    ;

  });

  it("should throw an error for an unknown encryption scheme", () => {

    expect(() => {
      encryptionSchemeProvider.getEncryptionSchemeByName("abcd")
    }).toThrowError()
    ;

  });

});