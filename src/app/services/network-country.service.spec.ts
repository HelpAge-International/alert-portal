import { TestBed, inject } from '@angular/core/testing';

import { NetworkCountryService } from './network-country.service';

describe('NetworkCountryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkCountryService]
    });
  });

  it('should ...', inject([NetworkCountryService], (service: NetworkCountryService) => {
    expect(service).toBeTruthy();
  }));
});
