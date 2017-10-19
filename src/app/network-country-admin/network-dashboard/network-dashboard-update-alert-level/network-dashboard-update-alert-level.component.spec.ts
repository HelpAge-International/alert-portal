import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDashboardUpdateAlertLevelComponent } from './network-dashboard-update-alert-level.component';

describe('NetworkDashboardUpdateAlertLevelComponent', () => {
  let component: NetworkDashboardUpdateAlertLevelComponent;
  let fixture: ComponentFixture<NetworkDashboardUpdateAlertLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDashboardUpdateAlertLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDashboardUpdateAlertLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
