export class ErrorCodesService {
  private firebaseTranslationMap: Map<string, string> = new Map<string, string>();
  private firebaseTranslationDefault: string = "LOGIN.GENERIC_ERROR";

  public static init(): ErrorCodesService {
    return new ErrorCodesService();
  }

  constructor() {
    this.initCodes();
  }

  initCodes() {
    this.firebaseTranslationMap.set("auth/weak-password", "RESET_PASSWORD.ERRORLENGTH");
    this.firebaseTranslationMap.set("auth/invalid-action-code", "RESET_PASSWORD.INVALID_CODE");
    this.firebaseTranslationMap.set("auth/network-request-failed", "RESET_PASSWORD.NETWORK_FAILURE");
  }

  public getFromFirebaseError(error): string {
    return this.getFromFirebaseString(error.code);
  }
  public getFromFirebaseString(str): string {
    let val = this.firebaseTranslationMap.get(str);
    if (val == null) {
      return this.firebaseTranslationDefault;
    }
    else {
      return val;
    }
  }
}
