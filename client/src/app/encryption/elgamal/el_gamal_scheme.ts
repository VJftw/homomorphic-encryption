import {Injectable} from "angular2/core";
import {EncryptionScheme, Operation} from "../encryption_scheme";
import {Computation} from "../../model/computation";
import {ComputationResolver} from "../../resolver/computation_resolver";
import {StageProvider} from "../../provider/stage_provider";
import {Http} from "angular2/http";
import {StepProvider} from "../../provider/step_provider";
import {EncryptionHelper} from "../encryption_helper";
import {PrivateKey, PublicKey, ElGamal} from "./el_gamal";


@Injectable()
export class ElGamalScheme extends EncryptionScheme {

  private y;

  constructor(
    stageProvider: StageProvider,
    stepProvider: StepProvider,
    computationResolver: ComputationResolver,
    encryptionHelper: EncryptionHelper,
    http: Http,
    private elGamal: ElGamal
  ) {
    super(
      stageProvider,
      stepProvider,
      computationResolver,
      encryptionHelper,
      http
    );
  }

  public getName(): string {
    return "ElGamal_ECC";
  }

  public getDescription(): string {
    return "";
  }

  public getCapabilities(): Array<string> {
    return [Operation.ADD];
  }

  public doScheme(): void {
    this.workspace();
    this.generateKeys();
    this.encryptValues();

    this.registerComputation();
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
    let x = this.computation.getPrivateKey().getX();

    let u = g.modPow(this.y, p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(u = g^y \\bmod p\\)",
      u
    ));
    let v = u.modPow(x, p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(v = u^x \\bmod p\\)",
      v
    ));
    let w = v.modInverse(p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(w = v^{-1} \\bmod p\\)",
      v
    ));
    let c = w.multiply(e).mod(p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Calculate \\(c = w \\cdot cX \\bmod p\\)",
      c
    ));

    this.computation.setC(c);
    this.computation.setState(Computation.STATE_COMPLETE);
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
    let p = this.encryptionHelper.generatePrime(bits);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Generate a random prime \\(p\\)",
      p
    ));
    let g = this.encryptionHelper.findPrimitiveRootOfPrime(p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let the generator be a primitive root of \\(p\\) to get \\(g\\)",
      g
    ));
    let x = this.encryptionHelper.getRandomArbitrary(1, p.intValue());
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let the secret be a random arbitrary number between \\(1\\) and \\(p\\) to get \\(x\\)",
      x
    ));
    let h = g.modPow(x, p);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Calculate \\(g^x \\bmod p\\) to get \\(h\\)",
      h
    ));

    let privateKey = new PrivateKey(p, g, x);
    this.computation.setPrivateKey(privateKey);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "The Private key consists of \\((p, g, x)\\)"
    ));

    let publicKey = new PublicKey(p, g, h);
    this.computation.setPublicKey(publicKey);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "The Public key consists of \\((p, g, h)\\)"
    ));
  }

  private encryptValues(): void {
    let stageName = "Encryption";
    this.computation.addStage(
      this.stageProvider.create(stageName)
    );

    this.y = this.encryptionHelper.getRandomArbitrary(0, this.computation.getPublicKey().getP());
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "let \\(y\\) be a random arbitrary number between \\(0\\) and \\(p\\)",
      this.y
    ));

    let aX = this.elGamal.encrypt(this.y, this.computation.getA(), this.computation.getPublicKey());
    this.computation.setAEncrypted(aX);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Encrypt \\(a\\) by calculating \\((a x (h^y \\bmod p)) \\bmod p\\) to get \\(aX\\)",
      aX
    ));

    let bX = this.elGamal.encrypt(this.y, this.computation.getB(), this.computation.getPublicKey());
    this.computation.setBEncrypted(bX);
    this.computation.getStageByName(stageName).addStep(this.stepProvider.create(
      "Encrypt \\(b\\) by calculating \\((b x (h^y \\bmod p)) \\bmod p\\) to get \\(bX\\)",
      bX
    ));
  }


}
