export class EncryptionSchemeStep {

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

  public inPublicScope(): boolean {
    return this.inPublicScope;
  }

}
