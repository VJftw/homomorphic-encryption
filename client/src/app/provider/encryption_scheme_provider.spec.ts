import {
  it
} from "angular2/testing";

import {EncryptionSchemeProvider} from "./encryption_scheme_provider";

describe("EncryptionSchemeProvider", () => {

  let encryptionSchemeProvider: EncryptionSchemeProvider;

  let paillerScheme = jasmine.createSpyObj("paillerScheme", ["getName"]);
  paillerScheme.getName.and.returnValue("Pailler");

  let elgamalEccScheme = jasmine.createSpyObj("elgamalEccScheme", ["getName"]);
  elgamalEccScheme.getName.and.returnValue("ElGamal_ECC");

  beforeEach(() => {
    encryptionSchemeProvider = new EncryptionSchemeProvider(
      paillerScheme,
      elgamalEccScheme
    );
  });

  it("should return an encryption encryption_scheme given by its name", () => {

    expect(encryptionSchemeProvider.getEncryptionSchemeByName("Pailler"))
      .toBe(paillerScheme)
    ;

  });

  it("should throw an error for an unknown encryption encryption_scheme", () => {

    expect(() => {
      encryptionSchemeProvider.getEncryptionSchemeByName("abcd")
    }).toThrowError()
    ;

  });

});