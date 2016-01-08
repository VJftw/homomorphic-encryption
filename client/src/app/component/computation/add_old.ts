/// <reference path="../../../typings/_custom.d.ts" />
import {Component, View} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from "angular2/common";
import {Http} from "angular2/http";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {Computation} from "../../model/computation";
import {Pailler, KeyPair} from "../../encryption/pailler/pailler";
import {Headers} from "../../../../node_modules/angular2/src/http/headers";
import {ComputationResolver} from "../../resolver/computation_resolver";
import {MathJaxDirective} from "../../directive/mathjax";

@Component({
  selector: "computation-add"
})
@View({
  directives: [
    CORE_DIRECTIVES,   // Angular"s core directives
    FORM_DIRECTIVES,   // Angular"s form directives
    ROUTER_DIRECTIVES, // Angular"s router
    MathJaxDirective
  ],
  template: require("./add.html")
})
export class ComputationAdd {

  /**
   *
   * @type {Computation}
   */
  protected computationModel = new Computation();

  /**
   * @type {ControlGroup}
   */
  protected computationForm: ControlGroup;

  protected formSubmitted: boolean;

  protected socket: WebSocket;

  protected keyPair: KeyPair;

  protected aR: any;
  protected bR: any;

  /**
   *
   * @param formBuilder
   * @param http
   * @param pailler
   * @param computationResolver
   */
  constructor(
    public formBuilder: FormBuilder,
    public http: Http,
    public pailler: Pailler,
    public computationResolver: ComputationResolver
  ) {
    this.computationForm = formBuilder.group({
      "a": ["", Validators.compose([
        Validators.required
      ])],
      "b": ["", Validators.required]
    });
    this.formSubmitted = false;

    this.socket = null;
  }

  /**
   *
   * @param event
   */
  protected submit(event) {
    event.preventDefault();
    this.formSubmitted = true;

    console.log(this.computationForm);

    this.generateKeyPair();
    this.encryptValues();


    // console.log("Adding Numbers");
    // var c = this.pailler.e_add(
    //  this.computationModel.getPublicKey(),
    //  this.computationModel.getAEncrypted(),
    //  this.computationModel.getBEncrypted()
    // );

    // console.log("Decrypting");
    // var r = this.pailler.decrypt(
    //  this.computationModel.getPrivateKey(),
    //  this.computationModel.getPublicKey(),
    //  c
    // );
    // console.log(r.toString());

    console.log(__API_URL__);
    console.log(__BACKEND_URL__);
    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append("Accept", "application/json");
    JSON_HEADERS.append("Content-Type", "application/json");
    this.http.post("http://" + __API_URL__ + "/api/computations", JSON.stringify(this.computationModel.toJson()), { headers: JSON_HEADERS})
      .subscribe(
          data => this.connectToWebSocket(data),
          err => console.log(err)
      )
    ;
  }

  private connectToWebSocket(data) {
    console.log(data);
    this.computationModel.setHashId(data.json().hashId);

    this.socket = new WebSocket("ws://" + __BACKEND_URL__);

    this.socket.addEventListener("open", (ev: Event) => {
      this.socket.send(JSON.stringify({
        "action": "computation/compute",
        "data": {
          "hashId": this.computationModel.getHashId()
        }
      }));
    });

    this.socket.addEventListener("message", (ev: MessageEvent) => {
      console.log(ev);
      this.computationModel = this.computationResolver.fromJson(
        JSON.parse(ev.data),
        this.computationModel
      );

      if (this.computationModel.isComplete()) {
        this.socket.close();
        //let lastStep = this.computationModel.getSteps()[
        //  this.computationModel.getSteps().length - 1
        //];

        //let c = this.pailler.decrypt(
        //  this.computationModel.getPrivateKey(),
        //  this.computationModel.getPublicKey(),
        //  lastStep.getResult()
        //);
        console.log(this.computationModel.toJson());

        //console.log(c.toString());
      }
    });
  }

  private generateKeyPair() {
    console.log("Generating Key Pair.");
    this.keyPair = this.pailler.generateKeyPair(32);
    this.computationModel.setPrivateKey(this.keyPair.getPrivateKey());
    this.computationModel.setPublicKey(this.keyPair.getPublicKey());
    console.log(this.computationModel);
  }

  private encryptValues() {
    console.log("Encrypting A and B");
    this.aR = this.pailler.generateR(this.computationModel.getPublicKey());
    this.computationModel.setAEncrypted(
      this.pailler.encrypt(
        this.computationModel.getPublicKey(),
        this.computationModel.getA(),
        this.aR
      )
    );
    this.bR = this.pailler.generateR(this.computationModel.getPublicKey());
    this.computationModel.setBEncrypted(
      this.pailler.encrypt(
        this.computationModel.getPublicKey(), this.computationModel.getB(), this.bR
      )
    );
    console.log(this.computationModel);
  }

}
