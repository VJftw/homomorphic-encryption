/// <reference path="../../../typings/_custom.d.ts" />

/*
 * Angular 2
 */
import {Component, View} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {BigInteger} from "jsbn";


// Simple external file component example
@Component({
  selector: "home"
})
@View({
  directives: [
    // Angular"s core directives
    CORE_DIRECTIVES,

    // Angular"s router
    ROUTER_DIRECTIVES,
  ],
  // include our .html and .css file
  template: require("./index.html")
})
export class Index {

  public test() {
    console.log("TEST");

    let a = new BigInteger("24"); // X
    let b = new BigInteger("44");

    // Generate Keys
    let p = this.generatePrime(16); // p
    console.log("p: " + p.intValue());
    let g = this.findPrimitiveRootOfPrime(p); // b
    console.log("g: " + g.intValue());
    let x = this.getRandomArbitrary(1, p.intValue()); // secretKey
    console.log("x: " + x.intValue());
    let h = g.modPow(x, p); // c
    console.log("h: " + h.intValue());

    // public key is p, g, h
    // private key is p, g, x



    let y = this.getRandomArbitrary(0, p.intValue()); // r
    let cA = g.modPow(y, p);


    let dA = a.multiply(h.modPow(y, p)).mod(p); // EC
    let dB = b.multiply(h.modPow(y, p)).mod(p); // EC

    let dC = dA.add(dB);

    let brmodp = g.modPow(y, p);





    // decrypt A
    let crmodp = brmodp.modPow(x, p);
    let d = crmodp.modInverse(p);
    let ad = d.multiply(dC).mod(p);

    console.log(ad.intValue());


    //let yB = this.getRandomArbitrary(0, p.intValue());
    //let cB = g.modPow(yB, p);
    //let dB = b.multiply(h.modPow(yB, p)).mod(p);
    //
    //let cAB = dA.multiply(dB);
    //
    //let s = cAB.modPow(x, p);
    //let res = s.modPow(p, p).mod(p);
    //
    //console.log(s.intValue());
  }

  public getRandomArbitrary(min, max): BigInteger {
    let x = Math.random() * (max - min) + min;

    return new BigInteger(""+ Math.round(x));
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

  public findPrimitiveRootOfPrime(prime: BigInteger): BigInteger {

    if (prime.intValue() == 2) {
      return new BigInteger("1");
    }

    let p1 = new BigInteger("2");
    let s = prime.subtract(new BigInteger("1"));
    let p2 = s.divide(p1);

    while(true) {
      let g = this.getRandomArbitrary(2, s.intValue());

      let h = g.modPow(p2, prime);
      if (h.intValue() != 1) {
        let k = g.modPow(s.divide(p2), prime);
        if (k.intValue() != 1) {
          return g;
        }

      }
    }
  }
}
