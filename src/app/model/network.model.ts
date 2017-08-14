/**
 * Created by Fei on 24/03/2017.
 */

//TODO: Remove ModelNetworkOld

export class ModelNetworkOld {
  public name: string;
  public adminId: string;
  public isActive: boolean;
  public logoPath: string;
}

export class ModelNetwork {
  public networkAdminId: string;
  public name: string;
  public isActive: boolean;
  public logoPath: string;
  public isInitialisedNetwork: boolean;
  public addressLine1: string;
  public addressLine2: string;
  public addressLine3: string;
  public countryId: number;
  public city: string;
  public postcode: string;
  public telephone: string;
  public websiteAddress: string;

}
