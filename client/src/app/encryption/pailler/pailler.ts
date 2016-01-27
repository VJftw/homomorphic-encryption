/// <reference path="../../../typings/jsbn.d.ts" />
import {BigInteger} from "jsbn";
import {Injectable} from "angular2/core";
import {PrivateKeyInterface, PublicKeyInterface} from "../key";
import {KeyPair} from "../helper";


@Injectable()
export class Pailler {

  public generateKeyPair(bits: number) : KeyPair {
    let p: BigInteger = this.generatePrime(bits / 2);
    let q: BigInteger = this.generatePrime(bits / 2);
    let n: BigInteger = p.multiply(q);

    let privateKey = new PrivateKey(p, q, n);
    let publicKey = new PublicKey(n);

    return new KeyPair(privateKey, publicKey);
  }

  public encrypt(publicKey, message: any, r: BigInteger) : BigInteger {
    message = new BigInteger("" + message);

    let x: BigInteger = r.modPow(publicKey.getN(), publicKey.getNSq());
    let mx : BigInteger = publicKey.getG().modPow(message, publicKey.getNSq()).multiply(x);
    return mx.mod(publicKey.getNSq());
  }

  public generateR(publicKey): BigInteger {
    let r: BigInteger;
    let k = publicKey.getN().bitLength() - 1;
    console.log(k);
    while (true) {
      r = this.generatePrime(k);
      if (r.intValue() > 0 && r < publicKey.getN()) {
        return r;
      }
    }
  }

  public e_add(publicKey: PublicKey, a: BigInteger, b: BigInteger) {
    return a.multiply(b).mod(publicKey.getNSq());
  }

  public decrypt(privateKey: PrivateKey, publicKey: PublicKey, cipher: BigInteger) {
    let x: BigInteger = cipher.modPow(privateKey.getL(), publicKey.getNSq()).subtract(new BigInteger("1"));
    let m: BigInteger = x.divide(publicKey.getN());

    return m.multiply(privateKey.getM()).mod(publicKey.getN());
  }

  public generatePrime(bits: number) : BigInteger {

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

}

export class PublicKey implements PublicKeyInterface {

  private n: BigInteger;
  private nSq: BigInteger;
  private g: BigInteger;

  constructor(n?: BigInteger) {
    if (n) {
      this.n = n;
      this.nSq = this.n.multiply(this.n);
      this.g = this.n.add(new BigInteger("1"));
    }
  }

  public getN() : BigInteger {
    return this.n;
  }

  public getNSq() : BigInteger {
    return this.nSq;
  }

  public getG() : BigInteger {
    return this.g;
  }

  public toJson(): {} {
    return {
      "n": this.getN().toString(),
      "nSq": this.getNSq().toString(),
      "g": this.getG().toString()
    };
  }
}

export class PrivateKey implements PrivateKeyInterface {

  private l: BigInteger;
  private m: BigInteger;

  constructor(p?: BigInteger, q?: BigInteger, n?: BigInteger) {
    if (p && q) {
      this.l = p.subtract(new BigInteger("1")).multiply(q.subtract(new BigInteger("1")));
      if (n) {
        this.m = this.l.modInverse(n);
      }
    }
  }

  public getL() : BigInteger {
    return this.l;
  }

  public getM() : BigInteger {
    return this.m;
  }
}
