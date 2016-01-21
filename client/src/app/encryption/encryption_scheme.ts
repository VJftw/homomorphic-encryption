
import {Computation} from "../model/computation";
/**
 * EncryptionScheme
 */
export interface EncryptionScheme {

  getName(): string;
  getDescription(): string;

  /**
   * Return what calculations the scheme can perform
   */
  getCapabilities(): Array<string>;

  /**
   * execute the encryption scheme with the given numbers and operator
   * @param operation
   */
  doScheme(): void;

  setComputation(computation: Computation): EncryptionScheme;

  getComputation(): Computation;

}

export class Operation {

  public static ADD = "+";
  public static SUBTRACT = "-";
  public static MULTIPLY = "*";
  public static DIVIDE = "/";

}
