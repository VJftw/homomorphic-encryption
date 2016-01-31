import {MessageInterface} from "./message_interface";
import {EncryptionSchemeStep} from "../model/encryption_scheme/encryption_scheme_step";


export class ComputeMessage implements MessageInterface {

  private steps: string[];

  constructor(
    private hashId: string,
    steps: EncryptionSchemeStep[],
    private publicScope: {}
  ) {
    this.steps = [];

    steps.forEach(step => {
      this.steps.push(step.getCompute());
    });
  }

  public toJson(): {} {
    return {
      "hashId": this.hashId,
      "compute": this.steps,
      "publicScope": this.publicScope
    }
  }
}
