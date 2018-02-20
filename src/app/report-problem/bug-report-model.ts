export class BugReportModel {
  file: string;
  fName:string;
  lName: string;
  position: string;
  country: number;
  agencyName: string;
  email: string;
  downloadUrl: string;
  description: string;
  computerDetails: string;
  date: Date = new Date();

}
