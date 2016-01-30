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

    it("should compute 'p = ((1 + 3) + (5 * 2)) + (3 + 2)'", () => {

        let steps = [
            "p = ((1 + 3) + (5 * 2)) + (3 + 2)"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(19)
        ;
    });

    it("should compute 'n = p * q'", () => {

        let steps = [
            "p = (1 + (5 * 2)) + (3 + 2)",
            "q = 1 + 2",
            "n = p * q"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(16)
        ;
        expect(scopeVars['q'].intValue())
            .toBe(3)
        ;
        expect(scopeVars['n'].intValue())
            .toBe(48)
        ;
    });

    it("should compute 'p = 13 % 4'", () => {

        let steps = [
            "p = 13 % 4"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(1)
        ;
    });

    it("should compute 'p = 13 & 4,3'", () => {

        let steps = [
            "p = 13 & 4,3"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(1)
        ;
    });


    it("should compute 'p = 13 $ 4'", () => {

        let steps = [
            "p = 13 $ 4"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(1)
        ;
    });

    it("should compute 'l = (p - 1) * (q - 1)'", () => {

        let steps = [
            "p = generateRandomPrime()",
            "q = generateRandomPrime()",
            "l = (p - 1) * (q - 1)"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        expect(scopeVars['p'].intValue())
            .toBe(11)
        ;
        expect(scopeVars['q'].intValue())
            .toBe(11)
        ;
        expect(scopeVars['l'].intValue())
            .toBe(100)
        ;
    });

    it("should encrypt with Pailler", () => {

        let steps = [
            "a = 3 + 1",
            "b = 1 + 2",
            // Key Generation
            "p = 190 + 1",
            "q = 148 + 1",
            "n = p * q",
            "nSq = n * n",
            "g = n + 1",
            "l = (p - 1) * (q - 1)",
            "m = l $ n",
            // Encryption
            "aR = 15348 + 1",
            "aX = ((g & a,nSq) * (aR & n,nSq)) % nSq",
            "bR = 11436 + 1",
            "bX = ((g & b,nSq) * (bR & n,nSq)) % nSq",
            // Add (in Backend)
            "cX = (aX * bX) % nSq",
            // Decryption
            "c = ((((cX & l,nSq) - 1) / n) * m) % n"
        ];

        computer.computeSteps(steps);

        let scopeVars = computer.getScopeVars();

        // Workspace
        expect(scopeVars['a'].intValue())
            .toBe(4)
        ;
        expect(scopeVars['b'].intValue())
            .toBe(3)
        ;

        // Key Generation
        expect(scopeVars['p'].intValue())
            .toBe(191)
        ;
        expect(scopeVars['q'].intValue())
            .toBe(149)
        ;
        expect(scopeVars['n'].intValue())
            .toBe(28459)
        ;
        expect(scopeVars['l'].intValue())
            .toBe(28120)
        ;
        expect(scopeVars['m'].intValue())
            .toBe(26780)
        ;

        // Encryption
        expect(scopeVars['aR'].intValue())
            .toBe(15349)
        ;
        expect(scopeVars['aX'].intValue())
            .toBe(297558379)
        ;

        expect(scopeVars['bR'].intValue())
            .toBe(11437)
        ;
        expect(scopeVars['bX'].intValue())
            .toBe(561167611)
        ;

        // Decryption
        expect(scopeVars['cX'].intValue())
            .toBe(316228311)
        ;

        expect(scopeVars['c'].intValue())
            .toBe(7)
        ;
    });


});