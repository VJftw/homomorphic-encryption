/// <reference path="../../../typings/_custom.d.ts" />

/*
 * Angular 2
 */
import {Component, View} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {BigInteger} from "jsbn";
import {BaseException} from "angular2/src/facade/exceptions";


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

  private scopeVars = {};

  public test() {
    let step1 = "p = generateRandomPrime()";
    let step2 = "q = generateRandomPrime()";
    let step3 = "n = p * q";
    let step4 = "l = (p - 1) * (q - 1)";
    let step5 = "z = ((n * q) - (p - 1)) * (q - 1)";

    this.doStepCompute(step1);
    this.doStepCompute(step2);
    this.doStepCompute(step3);
    this.doStepCompute(step4);
    this.doStepCompute(step5);


    console.log(this.scopeVars);
  }

  private doStepCompute(stepCompute: string) {
    // 1) get variable name from compute step
    let varName = stepCompute.split(" = ")[0];
    console.log("varName = " + varName);
    // 2) compute based on the command
    let command = stepCompute.split(" = ")[1];
    console.log("command = " + command);

    // 3) add variable to scope

    this.scopeVars[varName] = this.doCommand(command);
  }

  private doCommand(command: string): BigInteger {
    if (command === "generateRandomPrime()") {
      return new BigInteger("11");
    } else {
      // p + 1
      return this.calcExpression(command);
    }
  }


  private calcExpression(expr: string): BigInteger {
    // recursive (p - 1) * (q - 1)
    // expect expr to be 3 parts, [1] is the operator

    // if starts with (, use regex to find full expression

    let parts = expr.split(" ");
    if (parts.length % 2 === 0) {
      throw new BaseException("Invalid expression: " + expr);
    }
    if (parts.length > 3) {
      let midOperation = parts[Math.floor(parts.length/2)];
      console.log("Mid Op: " + midOperation);

      let pattern = /\) . \(/g;
      parts = expr.split(pattern);
      console.log("Part 0: " + parts[0]);
      console.log("Part 1: " + parts[1]);
      let a = this.calcExpression(parts[0].trim().substring(1, parts[0].length));
      let b = this.calcExpression(parts[1].trim().substring(0, parts[1].length - 1));
      console.log("a: " + a);
      console.log("b: " + b);
      return this.calc(a, midOperation, b);
    } else {

    }

    let aStr = expr.split(" ")[0];
    let operator = expr.split(" ")[1];
    let bStr = expr.split(" ")[2];

    // resolve a and b to BigIntegers
    let a = this.resolveVariable(aStr);
    let b = this.resolveVariable(bStr);

    return this.calc(a, operator, b);
  }

  private calc(a: BigInteger, operator: string, b: any) {

    switch(operator) {
      case "+":
        return a.add(b);
      case "-":
        return a.subtract(b);
      case "*":
        return a.multiply(b);
      case "/":
        return a.divide(b);
      case "powerMod":
        let exp = b.split(",")[0];
        return a.modPow()
      default:
        throw new BaseException("Cannot resolve operation: " + operator)
    }
  }

  private resolveVariable(v: string): BigInteger {
    if (v in this.scopeVars) {
      return this.scopeVars[v];
    } else if (+v) {
      return new BigInteger("" + v);
    } else {
      throw new BaseException("Cannot resolve variable: " + v);
    }
  }


}
