import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyRiskMonitoringComponent } from './local-agency-risk-monitoring.component';

describe('LocalAgencyRiskMonitoringComponent', () => {
  let component: LocalAgencyRiskMonitoringComponent;
  let fixture: ComponentFixture<LocalAgencyRiskMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyRiskMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyRiskMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
