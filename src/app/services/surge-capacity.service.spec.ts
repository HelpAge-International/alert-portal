import { TestBed, inject } from '@angular/core/testing';

import { SurgeCapacityService } from './surge-capacity.service';

describe('SurgeCapacityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurgeCapacityService]
    });
  });

  it('should ...', inject([SurgeCapacityService], (service: SurgeCapacityService) => {
    expect(service).toBeTruthy();
  }));
});
