import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAdminSettingsResponsePlanComponent } from './agency-admin-settings-response-plan.component';

describe('AgencyAdminSettingsResponsePlanComponent', () => {
  let component: AgencyAdminSettingsResponsePlanComponent;
  let fixture: ComponentFixture<AgencyAdminSettingsResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAdminSettingsResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAdminSettingsResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
