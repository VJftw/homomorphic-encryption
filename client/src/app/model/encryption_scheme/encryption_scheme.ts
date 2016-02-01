import {EncryptionSchemeStage} from "./encryption_scheme_stage";
import {IEncryptionSchemeStageJson} from "./encryption_scheme_stage";


export class EncryptionScheme {

  private uniqueName: string;
  private readableName: string;
  private description: string;
  private capabilities: string[];

  private stages: EncryptionSchemeStage[];

  constructor(
    uniqueName: string,
    readableName: string,
    description: string,
    capabilities: string[]
  ) {
    this.uniqueName = uniqueName;
    this.readableName = readableName;
    this.description = description;
    this.capabilities = capabilities;

    this.stages = [];
  }

  public getUniqueName(): string {
    return this.uniqueName;
  }

  public getReadableName(): string {
    return this.readableName;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCapabilities(): string[] {
    return this.capabilities;
  }

  public addStage(stage: EncryptionSchemeStage) {
    this.stages.push(stage);

    return this;
  }

  public getStages(): EncryptionSchemeStage[] {
    return this.stages;
  }

  public getSetupStages(): EncryptionSchemeStage[] {
    let stages = [];

    for (let stage of this.stages) {
      if (stage.isBackend()) {
        return stages;
      } else {
        stages.push(stage);
      }
    }
  }

  public getBackendStage(): EncryptionSchemeStage {

    for (let stage of this.stages) {
      if (stage.isBackend()) {
        return stage;
      }
    }

    throw new RangeError("No Backend Stage found.");
  }

  public getDecryptStage(): EncryptionSchemeStage {

    for (let stage of this.stages) {
      if (stage.getName() === "Decryption") {
        return stage;
      }
    }

    throw new RangeError("No Decryption Stage found.");
  }

}

export interface IEncryptionSchemeJson {
  uniqueName: string;
  readableName: string;
  description: string;
  capabilities: string[];
  stages: IEncryptionSchemeStageJson[];
}
