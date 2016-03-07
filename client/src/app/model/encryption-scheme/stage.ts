import {Step} from './step';
import {IStepJson} from './step';


export class Stage {

  private _name: string;
  private _preDescription: string;
  private _steps: Step[];
  private _postDescription: string;
  private _serverSide: boolean;

  constructor(
    name: string
  ) {
    this._name = name;
    this._steps = [];
    this._serverSide = false;
  }

  public getName(): string {
    return this._name;
  }

  public getPreDescription() {
    return this._preDescription;
  }

  public setPreDescription(description: string) {
    this._preDescription = description;

    return this;
  }

  public getPostDescription() {
    return this._postDescription;
  }

  public setPostDescription(description: string) {
    this._postDescription = description;

    return this;
  }

  public addStep(step: Step) {
    this._steps.push(step);

    return this;
  }

  public getSteps(): Step[] {
    return this._steps;
  }

  public setServerSide(serverSide: boolean) {
    this._serverSide = serverSide;

    return this;
  }

  public isServerSide() {
    return this._serverSide;
  }

  public toJson() {
    let steps = [];

    this._steps.forEach(step => {
      steps.push(step.toJson());
    });

    return {
      'name': this.getName(),
      'steps': steps
    };
  }

}

export interface IStageJson {
  name: string;
  preDescription?: string;
  steps: IStepJson[];
  postDescription?: string;
}
