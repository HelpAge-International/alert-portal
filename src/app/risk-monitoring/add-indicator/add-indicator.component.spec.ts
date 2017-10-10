import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMonitoringComponent } from '../risk-monitoring.component';

describe('RiskMonitoringComponent', () => {
  let component: RiskMonitoringComponent;
  let fixture: ComponentFixture<RiskMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
