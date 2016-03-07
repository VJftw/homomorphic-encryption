import {Injectable} from 'angular2/core';
import {Computation} from '../model/computation';
import {Computer} from '../encryption/computer';
import {StageProviderService} from '../provider/stage.provider.service';
import {MessageResolverService} from '../resolver/message.resolver.service';
import {Http} from 'angular2/http';
import {StepProviderService} from '../provider/step.provider.service';
import {MessageProviderService} from '../provider/message.provider.service';
import {BigInteger} from 'jsbn';
import {Stage} from '../model/computation/stage';
import {Step} from '../model/computation/step';
import {Headers} from 'angular2/http';


@Injectable()
export class ComputationRunnerService {

  private _computation: Computation;
  private _socket: WebSocket;

  constructor(
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
    this._computation.addToScope('a', new BigInteger('' + this._computation.getA()), false);
    this._computation.addToScope('b', new BigInteger('' + this._computation.getB()), false);

    // set bit length
    this._computer.setBitLength(this._computation.getBitLength());
    console.log('Bit Length: ' + this._computation.getBitLength());

    //this.addWorkspace();

    this._computation.getSetupStages().forEach(stage => {
      this.doStage(stage);
    });

    this._computation.getEncryptionStages().forEach(stage => {
      this.doStage(stage);
    });

    this._computation.setState(Computation.STATE_BACKEND_CONNECT);

    setTimeout(() => this.registerComputation(),
      2000
    );
  }

  ////private addWorkspace(): void {
  ////  let stage = this._stageProviderService.create('Workspace');
  ////  stage.addStep(this._stepProviderService.create(
  ////    'We aim to calculate \\(a ' + this._computation.getOperation() + ' b = c\\)'
  ////  ));
  ////
  ////  stage.addStep(this._stepProviderService.create(
  ////    'let \\(a\\)',
  ////    this._computation.getA()
  ////  ));
  ////
  ////  stage.addStep(this._stepProviderService.create(
  ////    'let \\(b\\)',
  ////    this._computation.getB()
  ////  ));
  ////
  ////  this._computation.addStage(stage);
  ////
  ////}

  private doStage(stage: Stage) {

    stage.getSteps().forEach(step => {
      let r = this.computeStep(step);

      step.setResult(r);
    });
  }

  private computeStep(step: Step) {
    // 1) get variable name from compute step
    let varName = step.getEncryptionStep().getCompute().split(' = ')[0];
    // 2) compute based on the command
    let command = step.getEncryptionStep().getCompute().split(' = ')[1];

    let r = this._computer.calculateStepCompute(command, this._computation.getFullScope());

    this._computation.addToScope(varName, r, step.getEncryptionStep().isPublicScope());

    console.log('Completed: ' + step.getEncryptionStep().getCompute());

    return r;
  }

  private decrypt() {

    this._computation.getDecryptionStages().forEach(stage => {
      this.doStage(stage);
    });

    this._computation.setC(this._computation.getFromScope('c'));
  }

  private registerComputation(): void {
    console.log('API Address: ' +  process.env.API_ADDRESS);

    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append('Accept', 'application/json');
    JSON_HEADERS.append('Content-Type', 'application/json');
    let message = this._messageProviderService.createRegisterMessage(this._computation);
    this._http.post(
      'http://' + process.env.API_ADDRESS + '/api/computations',
      JSON.stringify(message.toJson()),
      { headers: JSON_HEADERS}
    ).subscribe(
        data => this.registerSuccess(data),
        err => console.log(err)
      )
    ;
  }

  private registerSuccess(data) {
    this._computation = this._messageResolverService.resolveRegisterMessage(
      data.json(),
      this._computation
    );

    this.connectToWebSocket();
  }

  private connectToWebSocket(): void {
    console.log('Backend Address: ' +  process.env.BACKEND_ADDRESS);

    this._socket = new WebSocket('ws://' + process.env.BACKEND_ADDRESS);

    this._socket.addEventListener('open', (ev: Event) => {
      let message = this._messageProviderService.createComputeMessage(this._computation);
      this._socket.send(JSON.stringify(message.toJson()));

      this._computation.setState(Computation.STATE_STARTED);
    });

    this._socket.addEventListener('message', (ev: MessageEvent) => {
      this._computation.setState(Computation.STATE_BACKEND_CONNECTED);

      this._computation = this._messageResolverService.resolveComputeMessage(
        JSON.parse(ev.data),
        this._computation
      );

      if (this._computation.isComplete()) {
        this._socket.close();

        this.decrypt();
      }
    });
  }

}