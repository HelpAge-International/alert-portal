import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkRiskMonitoringComponent } from './local-network-risk-monitoring.component';

describe('LocalNetworkRiskMonitoringComponent', () => {
  let component: LocalNetworkRiskMonitoringComponent;
  let fixture: ComponentFixture<LocalNetworkRiskMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkRiskMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkRiskMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
