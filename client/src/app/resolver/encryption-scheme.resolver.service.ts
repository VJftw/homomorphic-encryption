import {Injectable} from 'angular2/core';
import {BitLengthResolverService} from './encryption-scheme/bit-length.resolver.service';
import {StageResolverService} from './encryption-scheme/stage.resolver.service';
import {IEncryptionSchemeJson} from "../model/encryption-scheme";
import {EncryptionScheme} from "../model/encryption-scheme";


@Injectable()
export class EncryptionSchemeResolverService {

  constructor(
    private _bitLengthResolverService: BitLengthResolverService,
    private _stageResolverService: StageResolverService
  ) {

  }

  public fromJson(schemeJson: IEncryptionSchemeJson): EncryptionScheme {
    let scheme = new EncryptionScheme(
      schemeJson.uniqueName,
      schemeJson.readableName,
      schemeJson.description
    );

    for (let bitLengthJson of schemeJson.bitLengths) {
      let bitLength = this._bitLengthResolverService.fromJson(bitLengthJson);
      scheme.addBitLength(bitLength);
    }

    // setup stage
    for (let stageJson of schemeJson.stages.setup) {
      let stage = this._stageResolverService.fromJson(stageJson);
      scheme.addSetupStage(stage);
    }

    // encryption stage
    for (let stageJson of schemeJson.stages.encryption) {
      let stage = this._stageResolverService.fromJson(stageJson);
      scheme.addEncryptionStage(stage);
    }

    // backend stage
    for (let operator in schemeJson.stages.backend) {
      let stage = this._stageResolverService.fromJson(schemeJson.stages.backend[operator]);
      scheme.addBackendStage(operator, stage);
    }

    // decryption stage
    for (let stageJson of schemeJson.stages.decryption) {
      let stage = this._stageResolverService.fromJson(stageJson);
      scheme.addDecryptionStage(stage);
    }

    return scheme;
  }

}
