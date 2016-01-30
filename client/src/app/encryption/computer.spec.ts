import {
  it
} from "angular2/testing";
import {Computer} from "./computer";
import {BigInteger} from "jsbn";

describe("Computer", () => {

    let encryptionHelper = jasmine.createSpyObj("encryptionHelper", ["generatePrime"]);
    encryptionHelper.generatePrime.and.returnValue(new BigInteger("11"));

    let computer: Computer;

    beforeEach(() => {
        computer = new Computer(encryptionHelper);
    });

    it("should compute 'p = generateRandomPrime()'", () => {

        let steps = [
            "p = generateRandomPrime()"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(11)
        ;
    });

    it("should compute 'p = 1 + 1'", () => {

        let steps = [
            "p = 1 + 1"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(2)
        ;
    });

    it("should compute 'p = 1 - 1'", () => {

        let steps = [
            "p = 1 - 1"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(0)
        ;
    });

    it("should compute 'p = 4 * 3'", () => {

        let steps = [
            "p = 4 * 3"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(12)
        ;
    });

    it("should compute 'p = 6 / 3'", () => {

        let steps = [
            "p = 6 / 3"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(2)
        ;
    });

    it("should compute 'p = (1 + 1) * (3 + 2)'", () => {

        let steps = [
            "p = (1 + 1) * (3 + 2)"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(10)
        ;
    });

    it("should compute 'p = (1 + (5 * 2)) + (3 + 2)'", () => {

        let steps = [
            "p = (1 + (5 * 2)) + (3 + 2)"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(16)
        ;
    });

});