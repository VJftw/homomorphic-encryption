/// <reference path="../../../typings/jsbn.d.ts" />
import {EncryptionScheme, Operation} from "../encryption_scheme";
import {ComputationResolver} from "../../resolver/computation_resolver";
import {Pailler, PublicKey, PrivateKey} from "./pailler";
import {Computation} from "../../model/computation";
import {StepProvider} from "../../provider/step_provider";
import {StageProvider} from "../../provider/stage_provider";
import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import {BigInteger} from "jsbn";
import {Headers} from "angular2/http";

/**
 * PaillerScheme
 */
@Injectable()
export class PaillerScheme implements EncryptionScheme {


  protected socket: WebSocket;

  private computation: Computation;

  constructor(
    private pailler: Pailler,
    private stageProvider: StageProvider,
    private stepProvider: StepProvider,
    private computationResolver: ComputationResolver,
    private http: Http
  ) {
    this.socket = null;
  }

  public setComputation(computation: Computation): EncryptionScheme {
    this.computation = computation;

    return this;
  }

  public getComputation(): Computation {
    return this.computation;
  }

  public getName(): string {
    return "Pailler";
  }

  public getDescription(): string {
    return "";
  }

  public getCapabilities(): Array<string> {
    return [Operation.ADD];
  }

  public doScheme(): void {
    this.workspace();
    this.generateKeyPair();
    this.encryptValues();
    this.registerComputation();
  }

  private workspace(): void {
    let stageName = "Workspace";
    this.computation.addStage(
        this.stageProvider.create(stageName)
    );
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
        "We aim to calculate \\(a + b = c\\)"
    ));
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
        "let \\(a\\)",
        this.computation.getA()
    ));
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
        "let \\(b\\)",
        this.computation.getB()
    ));
  }

  private generateKeyPair(): void {
    let stageName = "Key Generation";
    this.computation.addStage(
        this.stageProvider.create(stageName)
    );

    let bits = 16;
    let p: BigInteger = this.pailler.generatePrime(bits / 2);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Generate random prime \\(p\\)",
      p
    ));
    let q: BigInteger = this.pailler.generatePrime(bits / 2);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Generate random prime \\(q\\)",
      q
    ));
    let n: BigInteger = p.multiply(q);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Multiply primes \\(p\\) and \\(q\\) to get \\(n\\)",
      n
    ));

    let l: BigInteger = p.subtract(new BigInteger("1")).multiply(q.subtract(new BigInteger("1")));
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Calculate \\(\\phi(p\\cdot q)\\) to get \\(l\\)",
      l
    ));

    let m: BigInteger = l.modInverse(n);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Calculate \\(l^{-1} \\bmod n\\) to get \\(m\\)",
      m
    ));


    let privateKey: PrivateKey = new PrivateKey(p, q, n);
    this.computation.setPrivateKey(privateKey);

    let publicKey: PublicKey = new PublicKey(n);
    this.computation.setPublicKey(publicKey);

  }

  private encryptValues(): void {
    let stageName = "Encryption";
    this.computation.addStage(
        this.stageProvider.create(stageName)
    );
    console.log("Encrypting A and B");
    let aR: BigInteger = this.pailler.generateR(this.computation.getPublicKey());
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Generate random prime \\(aR\\)",
      aR
    ));

    let aEncrypted: BigInteger = this.pailler.encrypt(
      this.computation.getPublicKey(),
      this.computation.getA(),
      aR
    );
    this.computation.setAEncrypted(aEncrypted);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Encrypt A by calculating \\((g^a \\bmod n^2 \\cdot aR^n \\bmod n^2) \\bmod n^2\\) to get \\(aX\\)",
      aEncrypted
    ));

    let bR: BigInteger = this.pailler.generateR(this.computation.getPublicKey());
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Generate random prime \\(bR\\)",
      bR
    ));
    let bEncrypted: BigInteger = this.pailler.encrypt(
      this.computation.getPublicKey(),
      this.computation.getB(),
      bR
    );
    this.computation.setBEncrypted(bEncrypted);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Encrypt B by calculating \\((g^b \\bmod n^2 \\cdot bR^n \\bmod n^2) \\bmod n^2\\) to get \\(bX\\)",
      bEncrypted
    ));

    console.log(this.computation);
  }

  private registerComputation(): void {
    console.log(__API_URL__);

    const JSON_HEADERS = new Headers();

    JSON_HEADERS.append("Accept", "application/json");
    JSON_HEADERS.append("Content-Type", "application/json");
    this.http.post("http://" + __API_URL__ + "/api/computations", JSON.stringify(this.computation.toJson()), { headers: JSON_HEADERS})
      .subscribe(
        data => this.connectToWebSocket(data),
        err => console.log(err)
      )
    ;
  }

  private connectToWebSocket(data) {
    console.log(data);
    this.computation.setHashId(data.json().hashId);

    this.socket = new WebSocket("ws://" + __BACKEND_URL__);

    this.socket.addEventListener("open", (ev: Event) => {
      this.socket.send(JSON.stringify({
        "action": "computation/compute",
        "data": {
          "hashId": this.computation.getHashId()
        }
      }));
    });


    this.socket.addEventListener("message", (ev: MessageEvent) => {
      console.log(ev);
      this.computation = this.computationResolver.fromJson(
        JSON.parse(ev.data),
        this.computation
      );

      if (this.computation.isComplete()) {
        this.socket.close();

        this.decrypt();
      }
    });
  }

  private decrypt() {
    let stageName = "Decryption";
    this.computation.addStage(
      this.stageProvider.create(stageName)
    );

    let lastStage = this.computation.getStages()[
      this.computation.getStages().length - 2
    ];
    let lastStep = lastStage.getSteps()[
      lastStage.getSteps().length - 1
    ];

    let e: BigInteger = lastStep.getResult();
    let privateKey = this.computation.getPrivateKey();
    let publicKey = this.computation.getPublicKey();

    let x: BigInteger = e.modPow(privateKey.getL(), publicKey.getNSq()).subtract(new BigInteger("1"));
    let m: BigInteger = x.divide(publicKey.getN());

    let c = m.multiply(privateKey.getM()).mod(publicKey.getN());
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Calculate \\((\\frac{cX^lmod(n^2) - 1}{n})\\cdot cX \\bmod n \\) to get \\(c\\)",
      c
    ));

    this.computation.setC(c);
    this.computation.setState(Computation.STATE_COMPLETE);
  }
}
