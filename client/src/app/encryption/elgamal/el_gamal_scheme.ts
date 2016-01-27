import {Injectable} from "angular2/core";
import {EncryptionScheme, Operation} from "../encryption_scheme";
import {Computation} from "../../model/computation";
import {ComputationResolver} from "../../resolver/computation_resolver";
import {StageProvider} from "../../provider/stage_provider";
import {Http} from "angular2/http";
import {StepProvider} from "../../provider/step_provider";
import {EncryptionHelper} from "../helper";
import {PrivateKey, PublicKey, ElGamal} from "./el_gamal";


@Injectable()
export class ElGamalScheme extends EncryptionScheme {

  private y;

  constructor(
    stageProvider: StageProvider,
    stepProvider: StepProvider,
    computationResolver: ComputationResolver,
    http: Http,
    private elGamal: ElGamal
  ) {
    super(
      stageProvider,
      stepProvider,
      computationResolver,
      http
    )
  }

  getName(): string {
    return "ElGamal_ECC";
  }

  getDescription(): string {
    return "";
  }

  getCapabilities(): Array<string> {
    return [Operation.ADD];
  }

  doScheme():void {
    this.workspace();
    this.generateKeys();
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

  private generateKeys(): void {
    let stageName = "Key Generation";
    this.computation.addStage(
      this.stageProvider.create(stageName)
    );

    let bits = 16;
    let p = EncryptionHelper.generatePrime(bits);
    let g = EncryptionHelper.findPrimitiveRootOfPrime(p);
    let x = EncryptionHelper.getRandomArbitrary(1, p.intValue());
    let h = g.modPow(x, p);

    let privateKey = new PrivateKey(p, g, x);
    this.computation.setPrivateKey(privateKey);

    let publicKey = new PublicKey(p, g, h);
    this.computation.setPublicKey(publicKey);
  }

  private encryptValues(): void {
    let stageName = "Encryption";
    this.computation.addStage(
      this.stageProvider.create(stageName)
    );

    this.y = EncryptionHelper.getRandomArbitrary(0, this.computation.getPublicKey().getP());

    let aX = this.elGamal.encrypt(this.y, this.computation.getA(), this.computation.getPublicKey());
    this.computation.setAEncrypted(aX);
    let bX = this.elGamal.encrypt(this.y, this.computation.getB(), this.computation.getPublicKey());
    this.computation.setBEncrypted(bX);
  }

  protected decrypt(): void {
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

    let e = lastStep.getResult();

    let g = this.computation.getPrivateKey().getG();
    let p = this.computation.getPrivateKey().getP();

    let brmodp = g.modPow(this.y, p);

    let crmodp = brmodp.modPow(this.computation.getPrivateKey().getX(), p);
    let d = crmodp.modInverse(p);
    let ad = d.multiply(e).mod(p);

    this.computation.setC(ad);
    this.computation.setState(Computation.STATE_COMPLETE);
  }
}
