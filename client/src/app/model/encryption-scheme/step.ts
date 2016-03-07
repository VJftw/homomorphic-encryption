export class Step {

  private description: string;
  private compute: string;
  private inPublicScope: boolean;

  constructor(
    description: string,
    compute: string,
    inPublicScope = false
  ) {
    this.description = description;
    this.compute = compute;
    this.inPublicScope = inPublicScope;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCompute(): string {
    return this.compute;
  }

  public isPublicScope(): boolean {
    return this.inPublicScope;
  }

  public toJson() {
    return {
      'description': this.getDescription(),
      'compute': this.getCompute()
    };
  }

}

export interface IStepJson {
  description: string;
  compute: string;
  expose?: boolean;
}
