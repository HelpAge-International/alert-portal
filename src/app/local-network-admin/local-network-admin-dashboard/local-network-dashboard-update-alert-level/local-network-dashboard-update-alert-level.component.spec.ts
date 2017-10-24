import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkDashboardUpdateAlertLevelComponent } from './local-network-dashboard-update-alert-level.component';

describe('LocalNetworkDashboardUpdateAlertLevelComponent', () => {
  let component: LocalNetworkDashboardUpdateAlertLevelComponent;
  let fixture: ComponentFixture<LocalNetworkDashboardUpdateAlertLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkDashboardUpdateAlertLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkDashboardUpdateAlertLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
