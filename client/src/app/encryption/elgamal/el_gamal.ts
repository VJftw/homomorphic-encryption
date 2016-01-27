import {Injectable} from "angular2/core";
import {PublicKeyInterface} from "../key";
import {PrivateKeyInterface} from "../key";
import {BigInteger} from "jsbn";

@Injectable()
export class ElGamal {

  public encrypt(y: BigInteger, message: any, publicKey: PublicKey): BigInteger {
    let m = new BigInteger("" + message);

    return m.multiply(publicKey.getH().modPow(y, publicKey.getP())).mod(publicKey.getP());
  }
}

export class PublicKey implements PublicKeyInterface {

  constructor(
    private p: BigInteger,
    private g: BigInteger,
    private h: BigInteger
  ) {
  }

  public getP(): BigInteger {
    return this.p;
  }

  public getG(): BigInteger {
    return this.g;
  }

  public getH(): BigInteger {
    return this.h;
  }

  public toJson(): {} {
    return {
      'p': this.getP().toString(),
      'g': this.getG().toString(),
      'h': this.getH().toString()
    };
  }

}

export class PrivateKey implements PrivateKeyInterface {

  constructor(
    private p: BigInteger,
    private g: BigInteger,
    private x: BigInteger
  ) {
  }

  public getP(): BigInteger {
    return this.p;
  }

  public getG(): BigInteger {
    return this.g;
  }

  public getX(): BigInteger {
    return this.x;
  }

}
