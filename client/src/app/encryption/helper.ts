import {BigInteger} from "jsbn";

export class EncryptionHelper {

  public static getRandomArbitrary(min: number, max :number): BigInteger {
    let x = Math.random() * (max - min) + min;

    return new BigInteger("" + Math.round(x));
  }

  public static generatePrime(bits: number): BigInteger {
    let min = Math.pow(2, bits - 1);
    let max = Math.pow(2, bits);

    while (true) {
      let n = Math.round(Math.random() * (max - min) + min);
      let prime = new BigInteger("" + n);

      if (prime.isProbablePrime(prime.bitLength())) {
        return prime;
      }
    }
  }

  public static findPrimitiveRootOfPrime(prime: BigInteger): BigInteger {

    if (prime.intValue() === 2) {
      return new BigInteger("1");
    }

    let p1 = new BigInteger("2");
    let s = prime.subtract(new BigInteger("1"));
    let p2 = s.divide(p1);

    while(true) {
      let g = this.getRandomArbitrary(2, s.intValue());

      let h = g.modPow(p2, prime);
      if (h.intValue() !== 1) {
        let k = g.modPow(s.divide(p2), prime);
        if (k.intValue() !== 1) {
          return g;
        }
      }
    }

  }

}
