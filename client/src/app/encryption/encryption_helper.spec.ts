import {
  it
} from "angular2/testing";

import {EncryptionHelper} from "./encryption_helper";
import {BigInteger} from "jsbn";


describe("EncryptionHelper", () => {

  let encryptionHelper: EncryptionHelper;

  beforeEach(() => {
    encryptionHelper = new EncryptionHelper();
  });

  it("should return a random arbitrary number", () => {

    let r = encryptionHelper.getRandomArbitrary(3, 5);
    expect(r.intValue() >= 3).toBe(true);
    expect(r.intValue() <= 5).toBe(true);

    r = encryptionHelper.getRandomArbitrary(3, 3);
    expect(r.intValue() >= 3).toBe(true);
    expect(r.intValue() <= 3).toBe(true);

    r = encryptionHelper.getRandomArbitrary(-1, 30);
    expect(r.intValue() >= -1).toBe(true);
    expect(r.intValue() <= 30).toBe(true);

  });

  it("should generate a Prime number", () => {

    let bits = 8;
    let p;

    for (let i = 0; i < 100; i++) {
      p = encryptionHelper.generatePrime(bits);
      expect(isPrime(p.intValue())).toBe(true);
    }

  });

  function isPrime(p: number) {
    for (let i = 2; i < p; i++) {
      if (p % i == 0) {
        return false;
      }
    }
    return true;
  }

  it("should return a primitive root of a prime number", () => {

    let root = encryptionHelper.findPrimitiveRootOfPrime(new BigInteger("2"));
    expect(root.intValue()).toBe(1);

    root = encryptionHelper.findPrimitiveRootOfPrime(new BigInteger("43"));
    let roots = [3, 5, 12, 18, 19, 20, 26, 28, 29, 30, 33, 34];
    expect(roots.indexOf(root.intValue())).toBeTruthy();

  });

});
