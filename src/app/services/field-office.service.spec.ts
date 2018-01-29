import { TestBed, inject } from '@angular/core/testing';

import { FieldOfficeService } from './field-office.service';

describe('FieldOfficeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldOfficeService]
    });
  });

  it('should ...', inject([FieldOfficeService], (service: FieldOfficeService) => {
    expect(service).toBeTruthy();
  }));
});
