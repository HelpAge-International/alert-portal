import { TestBed, inject } from '@angular/core/testing';

import { AgencyServiceService } from './agency-service.service';

describe('AgencyServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgencyServiceService]
    });
  });

  it('should ...', inject([AgencyServiceService], (service: AgencyServiceService) => {
    expect(service).toBeTruthy();
  }));
});
