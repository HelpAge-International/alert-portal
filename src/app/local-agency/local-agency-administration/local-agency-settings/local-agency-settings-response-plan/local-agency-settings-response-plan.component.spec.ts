import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencySettingsResponsePlanComponent } from './local-agency-settings-response-plan.component';

describe('LocalAgencySettingsResponsePlanComponent', () => {
  let component: LocalAgencySettingsResponsePlanComponent;
  let fixture: ComponentFixture<LocalAgencySettingsResponsePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencySettingsResponsePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencySettingsResponsePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
