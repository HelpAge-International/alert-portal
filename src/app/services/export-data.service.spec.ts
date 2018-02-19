import { TestBed, inject } from '@angular/core/testing';

import { ExportDataService } from './export-data.service';

describe('ExportDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExportDataService]
    });
  });

  it('should ...', inject([ExportDataService], (service: ExportDataService) => {
    expect(service).toBeTruthy();
  }));
});
