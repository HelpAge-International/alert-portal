import { TestBed, inject } from '@angular/core/testing';

import { BugReportingService } from './bug-reporting.service';

describe('BugReportingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BugReportingService]
    });
  });

  it('should ...', inject([BugReportingService], (service: BugReportingService) => {
    expect(service).toBeTruthy();
  }));
});
