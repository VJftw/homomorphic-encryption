import {
  it
} from "angular2/testing";

import {Computation} from "./computation";
import {BigInteger} from "jsbn";

describe("Computation", () => {

  let computation: Computation;

  beforeEach(() => {
    computation = new Computation();
  });

  it("should return the hashId", () => {
    expect(computation.getHashId())
      .toBeUndefined()
    ;
  });

  it("should set the hashId", () => {
    expect(computation.setHashId("ax54dc"))
      .toBe(computation)
    ;

    expect(computation.getHashId())
      .toEqual("ax54dc")
    ;
  });

  it("should return A", () => {
    expect(computation.getA())
      .toBeUndefined()
    ;
  });

  it("should return B", () => {
    expect(computation.getB())
      .toBeUndefined()
    ;
  });

  it("should return C", () => {
    expect(computation.getC())
      .toBeUndefined()
    ;
  });

  it("should set C", () => {
    let c = jasmine.createSpyObj("c", [""]);
    expect(computation.setC(c))
      .toBe(computation)
    ;

    expect(computation.getC())
      .toBe(c)
    ;
  });

  it("should return the private key", () => {
    expect(computation.getPrivateKey())
      .toBeUndefined()
    ;
  });

  it("should set the private key", () => {
    let privateKey = jasmine.createSpyObj("privateKey", [""]);

    expect(computation.setPrivateKey(privateKey))
      .toBe(computation)
    ;

    expect(computation.getPrivateKey())
      .toBe(privateKey)
    ;
  });

  it("should return the public key", () => {
    expect(computation.getPublicKey())
      .toBeUndefined()
    ;
  });

  it("should set the public key", () => {
    let publicKey = jasmine.createSpyObj("publicKey", [""]);

    expect(computation.setPublicKey(publicKey))
      .toBe(computation)
    ;

    expect(computation.getPublicKey())
      .toBe(publicKey)
    ;
  });

  it("should return AEncrypted", () => {
    expect(computation.getAEncrypted())
      .toBeUndefined()
    ;
  });

  it("should set AEncrypted", () => {
    let aEncrypted = new BigInteger("4");

    expect(computation.setAEncrypted(aEncrypted))
      .toBe(computation)
    ;

    expect(computation.getAEncrypted())
      .toBe(aEncrypted)
    ;
  });

  it("should return BEncrypted", () => {
    expect(computation.getBEncrypted())
      .toBeUndefined()
    ;
  });

  it("should set BEncrypted", () => {
    let bEncrypted = new BigInteger("8");

    expect(computation.setBEncrypted(bEncrypted))
      .toBe(computation)
    ;

    expect(computation.getBEncrypted())
      .toBe(bEncrypted)
    ;
  });

  it("should return the timestamp", () => {
    expect(computation.getTimestamp())
      .toBeUndefined()
    ;
  });

  it("should set the timestamp", () => {
    let timestamp = new Date();
    expect(computation.setTimestamp(timestamp))
      .toBe(computation)
    ;

    expect(computation.getTimestamp())
      .toBe(timestamp)
    ;
  });

  it("should return the scheme", () => {
    expect(computation.getScheme())
      .toBeUndefined()
    ;
  });

  it("should set the scheme", () => {
    expect(computation.setScheme("Pailler"))
      .toBe(computation)
    ;

    expect(computation.getScheme())
      .toEqual("Pailler")
    ;
  });

  it("should return the operation", () => {
    expect(computation.getOperation())
      .toBeUndefined()
    ;
  });

  it("should set the operation", () => {
    expect(computation.setOperation("+"))
      .toBe(computation)
    ;

    expect(computation.getOperation())
      .toEqual("+")
    ;
  });

  it("should return the initial state", () => {
    expect(computation.getState())
      .toEqual(Computation.STATE_NEW)
    ;
  });

  it("should set the state", () => {
    expect(computation.setState(Computation.STATE_STARTED))
      .toBe(computation)
    ;

    expect(computation.getState())
      .toEqual(Computation.STATE_STARTED)
    ;
  });

  it("should return whether or not it is in the NEW state", () => {
    expect(computation.isNew())
      .toEqual(true)
    ;

    expect(computation.isStarted())
      .toEqual(false)
    ;

    expect(computation.isComplete())
      .toEqual(false)
    ;
  });

  it("should return whether or not it is in the STARTED state", () => {
    computation.setState(Computation.STATE_STARTED);

    expect(computation.isNew())
      .toEqual(false)
    ;

    expect(computation.isStarted())
      .toEqual(true)
    ;

    expect(computation.isComplete())
      .toEqual(false)
    ;
  });

  it("should return whether or not it is in the COMPLETE state", () => {
    computation.setState(Computation.STATE_COMPLETE);

    expect(computation.isNew())
      .toEqual(false)
    ;

    expect(computation.isStarted())
      .toEqual(false)
    ;

    expect(computation.isComplete())
      .toEqual(true)
    ;
  });

  it("should return the stages", () => {
    expect(computation.getStages())
      .toEqual([])
    ;
  });

  it("should add a stage", () => {
    let stage = jasmine.createSpyObj("stage", ["getName"]);
    stage.getName.and.returnValue("abcd");

    expect(computation.addStage(stage))
      .toBe(computation)
    ;

    expect(computation.getStages())
      .toEqual([stage])
    ;
  });

  it("should return a stage given by its name", () => {
    let stage = jasmine.createSpyObj("stage", ["getName"]);
    stage.getName.and.returnValue("abcd");

    computation.addStage(stage);

    expect(computation.getStageByName("abcd"))
      .toBe(stage)
    ;

    expect(computation.getStageByName("aaaa"))
      .toBeNull()
    ;
  });

  it("should format to JSON", () => {
    computation.setScheme("Pailler");
    computation.setOperation("+");
    let aEncrypted = new BigInteger("4");
    computation.setAEncrypted(aEncrypted);
    let bEncrypted = new BigInteger("7");
    computation.setBEncrypted(bEncrypted);
    let publicKey = jasmine.createSpyObj("publicKey", ["toJson"]);
    publicKey.toJson.and.returnValue({});
    computation.setPublicKey(publicKey);

    let stage = jasmine.createSpyObj("stage", ["getName", "toJson"]);
    stage.getName.and.returnValue("abcd");
    stage.toJson.and.returnValue({
      "name": "abcd",
      "steps": []
    });
    computation.addStage(stage);

    expect(computation.toJson())
      .toEqual({
        "scheme": "Pailler",
        "operation": "+",
        "aEncrypted": "4",
        "bEncrypted": "7",
        "publicKey": {},
        "stages": [
          {
            "name": "abcd",
            "steps": []
          }
        ]
      });

  });
});