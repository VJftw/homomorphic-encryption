import {Injectable} from "angular2/core";
import {EncryptionHelper} from "./encryption_helper";
import {BigInteger} from "jsbn";
import {BaseException} from "angular2/src/facade/exceptions";


@Injectable()
export class Computer {

    private scopeVars: {};

    constructor (
        private encryptionHelper: EncryptionHelper
    ) {
        this.scopeVars = {};
    }

    public getScopeVars(): {} {
        return this.scopeVars;
    }

    public computeSteps(steps: string[]) {
        for (let i = 0; i < steps.length; i++) {
            console.log("Step " + i + ").");
            let step = steps[i];
            console.log("\t" + step);
            this.doStepCompute(step);
        }
    }

    private doStepCompute(stepCompute: string) {
        // 1) get variable name from compute step
        let varName = stepCompute.split(" = ")[0];
        console.log("\tvarName: " + varName);
        // 2) compute based on the command
        let command = stepCompute.split(" = ")[1];
        console.log("\tcommand: " + command);

        // 3) add variable to scope
        this.scopeVars[varName] = this.doCommand(command);
    }

    private doCommand(command: string): BigInteger {
        if (command === "generateRandomPrime()") {
            return this.encryptionHelper.generatePrime(16);
        } else {
            // p + 1
            return this.calcExpression(command);
        }
    }

    private calcExpression(expr: string): BigInteger {
        let parts = expr.split(" ");
        if (parts.length % 2 === 0) {
            throw new BaseException("Invalid expression: " + expr);
        }
        if (parts.length > 3) {
            let midOperation = parts[Math.floor(parts.length/2)];
            console.log("Mid Op: " + midOperation);

            let pattern = /\) . \(/g;
            parts = expr.split(pattern);
            let partA = parts[0].trim().substring(1, parts[0].length);
            let partB = parts[1].trim().substring(0, parts[1].length - 1);
            console.log("PartA: " + partA);
            console.log("PartB: " + partB);
            let a = this.calcExpression(partA);
            let b = this.calcExpression(partB);
            console.log("a: " + a);
            console.log("b: " + b);
            return this.calc(a, midOperation, b);
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