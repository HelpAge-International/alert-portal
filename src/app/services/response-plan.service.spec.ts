import { TestBed, inject } from '@angular/core/testing';

import { ResponsePlanService } from './response-plan.service';

describe('ResponsePlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponsePlanService]
    });
  });

  it('should ...', inject([ResponsePlanService], (service: ResponsePlanService) => {
    expect(service).toBeTruthy();
  }));
});
