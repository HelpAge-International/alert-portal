import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyExternalPartnerResponsePlanComponent } from './local-agency-external-partner-response-plan.component';

describe('LocalAgencyExternalPartnerResponsePlanComponent', () => {
  let component: LocalAgencyExternalPartnerResponsePlanComponent;
  let fixture: ComponentFixture<LocalAgencyExternalPartnerResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyExternalPartnerResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyExternalPartnerResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
