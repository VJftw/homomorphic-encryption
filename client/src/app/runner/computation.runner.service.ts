import {Injectable} from 'angular2/core';
import {Computation} from "../model/computation";
import {Computer} from "../encryption/computer";
import {StageProviderService} from "../provider/stage.provider.service";
import {MessageResolverService} from "../resolver/message.resolver.service";
import {Http} from "angular2/http";
import {StepProviderService} from "../provider/step.provider.service";
import {MessageProviderService} from "../provider/message.provider.service";
import {BigInteger} from "jsbn";
import {Stage} from "../model/encryption-scheme/stage";
import {Step} from "../model/encryption-scheme/step";
import {Headers} from "angular2/http";


@Injectable()
export class ComputationRunnerService {

  private _computation: Computation;
  private _socket: WebSocket;

  constructor(
    private _stageProviderService: StageProviderService,
    private _stepProviderService: StepProviderService,
    private _computer: Computer,
    private _messageProviderService: MessageProviderService,
    private _messageResolverService: MessageResolverService,
    private _http: Http
  ) {
  }

  public setComputation(computation: Computation) {
    this._computation = computation;

    return this;
  }

  public getComputation(): Computation {
    return this._computation;
  }

  public runComputation(): void {
    // set up a and b
    this._computation.addToScope('a', new BigInteger("" + this._computation.getA()), false);
    this._computation.addToScope('b', new BigInteger("" + this._computation.getB()), false);

    // set bit length
    this._computer.setBitLength(this._computation.getBitLength());
    console.log('Bit Length: ' + this._computation.getBitLength());

    this.addWorkspace();


    let encryptionScheme = this._computation.getEncryptionScheme();

    let schemeStages = encryptionScheme.getSetupStages();
    schemeStages.forEach(schemeStage => {
      this.doStage(schemeStage);
    });

    this._computation.setState(Computation.STATE_BACKEND_CONNECT);
    this.registerComputation();
  }

  private addWorkspace(): void {
    let stage = this._stageProviderService.create('Workspace');
    stage.addStep(this._stepProviderService.create(
      'We aim to calculate \\(a ' + this._computation.getOperation() + ' b = c\\)'
    ));

    stage.addStep(this._stepProviderService.create(
      'let \\(a\\)',
      this._computation.getA()
    ));

    stage.addStep(this._stepProviderService.create(
      'let \\(b\\)',
      this._computation.getB()
    ));

    this._computation.addStage(stage);

  }

  private doStage(schemeStage: Stage) {
    let stage = this._stageProviderService.create(schemeStage.getName());
    this._computation.addStage(stage);

    schemeStage.getSteps().forEach(schemeStep => {
      let r = this.computeStep(schemeStep);

      let step = this._stepProviderService.create(
        schemeStep.getDescription(),
        r
      );

      this._computation.getStageByName(schemeStage.getName()).addStep(step);
    });
  }

  private computeStep(step: Step) {
    // 1) get variable name from compute step
    let varName = step.getCompute().split(' = ')[0];
    // 2) compute based on the command
    let command = step.getCompute().split(' = ')[1];

    let r = this._computer.calculateStepCompute(command, this._computation.getFullScope());

    this._computation.addToScope(varName, r, step.isPublicScope());

    console.log('Completed: ' + step.getCompute());

    return r;
  }



  private decrypt() {
    for (let stage of this._computation.getEncryptionScheme().getDecryptionStages()) {
      this.doStage(stage);
    }

    this._computation.setC(this._computation.getFromScope('c'));
  }

  private registerComputation(): void {
    console.log('API Address: ' +  process.env.API_ADDRESS);

    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append('Accept', 'application/json');
    JSON_HEADERS.append('Content-Type', 'application/json');
    let message = this._messageProviderService.createRegisterMessage(this._computation);
    //this.http.post('http://' + __API_URL__ + '/api/computations', JSON.stringify(message.toJson()), { headers: JSON_HEADERS})
    //  .subscribe(
    //    data => this.registerSuccess(data),
    //    err => console.log(err)
    //  )
    //;
  }

  private registerSuccess(data) {
    this._computation = this._messageResolverService.resolveRegisterMessage(data.json(), this._computation);

    //this.connectToWebSocket();
  }

  //private connectToWebSocket(): void {
  //  console.log('Backend Address: ' +  __BACKEND_URL__);
  //
  //  this.socket = new WebSocket('ws://' + __BACKEND_URL__);
  //
  //  this.socket.addEventListener('open', (ev: Event) => {
  //    let message = this.messageProvider.createComputeMessage(this.computation);
  //    this.socket.send(JSON.stringify(message.toJson()));
  //
  //    this.computation.setState(Computation.STATE_STARTED);
  //  });
  //
  //  this.socket.addEventListener('message', (ev: MessageEvent) => {
  //    this.computation.setState(Computation.STATE_BACKEND_CONNECTED);
  //    let stage = this.stageProvider.create(
  //      this.computation.getEncryptionScheme().getBackendStage().getName(),
  //      Stage.HOST_SERVER
  //    );
  //    this.computation.addStage(stage);
  //
  //    this.computation = this.messageResolver.resolveComputeMessage(
  //      JSON.parse(ev.data),
  //      this.computation
  //    );
  //
  //    if (this.computation.isComplete()) {
  //      this.socket.close();
  //
  //      this.decrypt();
  //    }
  //  });
  //}

}
