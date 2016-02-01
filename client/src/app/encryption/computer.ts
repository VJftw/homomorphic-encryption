import {Injectable} from "angular2/core";
import {BigInteger} from "jsbn";

import {EncryptionHelper} from "./encryption_helper";

@Injectable()
export class Computer {

  private static operations = [
    "+", // add
    "-", // subtract
    "/", // divide
    "*", // multiply
    "%", // modulus
    "&", // powerMod
    "$"  // inverseMod
  ];

  constructor(
    private encryptionHelper: EncryptionHelper
  ) {
  }

  public calculateStepCompute(compute: string, scope: {}): BigInteger {
    return this.doCommand(compute, scope);
  }

  public computeSteps(steps: string[]) {
    for (let i = 0; i < steps.length; i++) {
      console.log("Step " + i + ").");
      let step = steps[i];
      console.log("\t" + step);
      this.doStepCompute(step, {});
    }
  }

  private doStepCompute(stepCompute: string, scope: {}) {
    // 1) get variable name from compute step
    let varName = stepCompute.split(" = ")[0];
    console.log("\tvarName: " + varName);
    // 2) compute based on the command
    let command = stepCompute.split(" = ")[1];
    console.log("\tcommand: " + command);

    // 3) add variable to scope
    scope[varName] = this.doCommand(command, scope);
  }

  private doCommand(command: string, scope: {}): BigInteger {

    let generateRandomPrimeRegex = /generateRandomPrime\(\)/;
    let generateRRegex = /generateR\((.+)\)/;
    let primitiveRootRegex = /primitiveRoot\((.+)\)/;
    let randomArbitraryRegex = /randomArbitrary\((.+),(.+)\)/;

    console.log(scope);

    let matches;
    switch (true) {
      case generateRandomPrimeRegex.test(command):
        return this.encryptionHelper.generatePrime(16);
      case generateRRegex.test(command):
        matches = generateRRegex.exec(command);
        return this.encryptionHelper.generateR(scope[matches[1]]);
      case primitiveRootRegex.test(command):
        matches = primitiveRootRegex.exec(command);
        console.log(matches);
        return this.encryptionHelper.findPrimitiveRootOfPrime(scope[matches[1]]);
      case randomArbitraryRegex.test(command):
        matches = randomArbitraryRegex.exec(command);
        console.log(matches);
        return this.encryptionHelper.getRandomArbitrary(
          this.resolveVariable(matches[1].trim(), scope).intValue(),
          this.resolveVariable(matches[2].trim(), scope).intValue()
        );

      default:
        return this.calcExpression(command, scope);
    }

  }

  private findTopOperatorLocation(expr: string): number {
    let bracketCounter = 0;
    let topLevelLoc = -1;

    for (let i = 0; i < expr.length; i++) {
      let char = expr[i];
      if (char === "(") {
        bracketCounter++;
      } else if (char === ")") {
        bracketCounter--;
      } else if (bracketCounter === 0 && Computer.operations.indexOf(char) > -1) {
        topLevelLoc = i;
      }
    }

    if (bracketCounter !== 0 || topLevelLoc === -1) {
      throw new Error("Broken expression");
    }

    return topLevelLoc;
  }

  private trimBrackets(expr: string): string {
    if (expr[0] === "(" && expr[expr.length - 1] === ")") {
      return expr.substring(1, expr.length - 1);
    } else {
      return expr;
    }
  }

  private calcExpression(expr: string, scope: {}): BigInteger {
    // first split in to two, a and b by the top operator
    let topOpLoc = this.findTopOperatorLocation(expr);
    let topOp = expr[topOpLoc];

    console.log("Top operator: " + topOp + " at: " + topOpLoc);

    let aStr = this.trimBrackets(expr.substring(0, topOpLoc).trim());
    let bStr = this.trimBrackets(expr.substring(topOpLoc + 1, expr.length).trim());
    console.log("\taStr: " + aStr);
    console.log("\tbStr: " + bStr);

    let a;
    let b;
    let c;

    if (topOp === "&") {
      let parts = bStr.split(",");
      bStr = parts[0];
      let cStr = parts[1];
      console.log("\tbStr: " + cStr);
      console.log("\tcStr: " + cStr);

      // check if c requires more operations
      if (Computer.operations.some(function (v) {
          return cStr.indexOf(v) >= 0;
        })) {
        c = this.calcExpression(cStr, scope);
      } else {
        c = this.resolveVariable(cStr, scope);
      }
    }

    // check if a requires more operations
    if (Computer.operations.some(function (v) {
        return aStr.indexOf(v) >= 0;
      })) {
      a = this.calcExpression(aStr, scope);
    } else {
      a = this.resolveVariable(aStr, scope);
    }
    // check if b requires more operations
    if (Computer.operations.some(function (v) {
        return bStr.indexOf(v) >= 0;
      })) {
      b = this.calcExpression(bStr, scope);
    } else {
      b = this.resolveVariable(bStr, scope);
    }

    console.log("\t\ta: " + a.toString());
    console.log("\t\tb: " + b.toString());

    if (topOp === "&") {
      console.log("\t\tc: " + c);
      console.log(scope);
      return this.calc(a, topOp, b, c);
    }
    return this.calc(a, topOp, b);
  }

  private calc(a: BigInteger, operator: string, b: BigInteger, c?: BigInteger) {

    switch (operator) {
      case "+":
        return a.add(b);
      case "-":
        return a.subtract(b);
      case "*":
        return a.multiply(b);
      case "/":
        return a.divide(b);
      case "%":
        return a.mod(b);
      case "$":
        return a.modInverse(b);
      case "&":
        return a.modPow(b, c);
      default:
        throw new RangeError("Cannot resolve operation: " + operator);
    }
  }

  private resolveVariable(v: string, scope: {}): BigInteger {
    if (v in scope) {
      return scope[v];
    } else if (parseInt(v, 10) !== NaN) {
      return new BigInteger("" + v);
    } else {
      throw new RangeError("Cannot resolve variable: " + v);
    }
  }

}
