import {
  it,
} from "angular2/testing";

import {KeyPair} from "./pailler";

describe("KeyPair", () => {

  let keyPair: KeyPair;

  let privateKey: any;
  let publicKey: any;
  let p: any;
  let q: any;

  beforeEach(() => {
    privateKey = jasmine.createSpyObj("privateKey", [""]);
    publicKey = jasmine.createSpyObj("publicKey", [""]);
    p = jasmine.createSpyObj("p", [""]);
    q = jasmine.createSpyObj("q", [""]);

    keyPair = new KeyPair(privateKey, publicKey, p, q);
  });

  it("should return the private key", () => {
    expect(keyPair.getPrivateKey()).toEqual(privateKey);
  });

  it("should return the public key", () => {
    expect(keyPair.getPublicKey()).toEqual(publicKey);
  });

  it("should return p", () => {
    expect(keyPair.getP()).toEqual(p);
  });

  it("should return q", () => {
    expect(keyPair.getQ()).toEqual(q);
  });

});
